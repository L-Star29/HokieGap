"""Read-only public VT snapshot. No enrollment login, rosters, or private data."""
import json, csv, re, urllib.request, urllib.parse, datetime
from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'; OUT.mkdir(exist_ok=True)
STAMP=datetime.datetime.now(datetime.timezone.utc).isoformat()
GIS='https://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/Buildings/FeatureServer/0/query'
TIMETABLE='https://selfservice.banner.vt.edu/ssb/HZSKVTSC.P_ProcRequest'
NAMES={'Classroom Building':'NCB','Goodwin Hall':'GOODWIN','Derring Hall':'DERR','Bishop-Favrao Hall':'BFH','Cowgill Hall':'COW','Hancock Hall':'HAN','Newman Library':'NEWMAN','Hitt Hall':'HITT'}
class Rows(HTMLParser):
    def __init__(self): super().__init__(); self.rows=[]; self.row=[]; self.cell=None
    def handle_starttag(self,tag,attrs):
        if tag=='tr':
            if self.row: self.rows.append(self.row)
            self.row=[]; self.cell=None
        if tag in ('td','th'): self.cell=[]
        if tag=='br' and self.cell is not None: self.cell.append(' ')
    def handle_data(self,s):
        if self.cell is not None: self.cell.append(s)
    def handle_endtag(self,tag):
        if tag in ('td','th') and self.cell is not None:
            self.row.append(re.sub(r'\s+',' ',' '.join(self.cell)).strip()); self.cell=None
        if tag=='tr' and self.row: self.rows.append(self.row); self.row=[]
def fetch(url,data=None):
    return urllib.request.urlopen(urllib.request.Request(url,data=data,headers={'User-Agent':'HokieGap campus planning service'}),timeout=30).read().decode()
q=urllib.parse.urlencode({'where':'1=1','outFields':'name,latitude,longitude','returnGeometry':'false','f':'json'})
records=json.loads(fetch(GIS+'?'+q))['features']
buildings=[dict(id=NAMES[a['name']],name=a['name'],lat=a['latitude'],lon=a['longitude'],source=GIS,checkedAt=STAMP) for f in records for a in [f['attributes']] if a.get('name') in NAMES]
(OUT/'buildings.json').write_text(json.dumps(buildings,indent=2))
SUBJECTS=['ECE','ENGE','ME','AOE','CEE','CS','MATH','PHYS','STAT','BIOL','GEOS','CHEM','ARCH','BC']
def subject_rows(subject):
    p={'CAMPUS':'0','TERMYEAR':'202609','CORE_CODE':'AR%','subj_code':subject,'SCHDTYPE':'%','CRSE_NUMBER':'','crn':'','open_only':'','disp_comments_in':'Y','sess_code':'%','BTN_PRESSED':'FIND class sections','inst_name':''}
    parser=Rows(); parser.feed(fetch(TIMETABLE,urllib.parse.urlencode(p).encode()))
    return [(subject,r) for r in parser.rows if r and re.fullmatch(r'\d{5}',r[0])]
rows=[]; failures=[]
with ThreadPoolExecutor(max_workers=3) as pool:
    futures={s:pool.submit(subject_rows,s) for s in SUBJECTS}
    for s,f in futures.items():
        try: rows+=f.result()
        except Exception as e: failures.append({'subject':s,'error':str(e)})
(OUT/'timetable-rows.json').write_text(json.dumps(rows,indent=2))
print(json.dumps({'buildings':len(buildings),'rawSections':len(rows),'sample':rows[:3],'failures':failures}))
(OUT/'snapshot.json').write_text(json.dumps({'checkedAt':STAMP,'term':'202609','subjects':SUBJECTS,'failures':failures,'coverage':'Selected subjects only; missing classes and special events mean lower forecast confidence.','source':TIMETABLE},indent=2))
