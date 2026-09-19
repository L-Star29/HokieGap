import re,json,html,urllib.request,datetime
from pathlib import Path
url='https://api3.libcal.com/api_hours_full.php?iid=3029&months=3'
s=urllib.request.urlopen(url,timeout=30).read().decode()
out={}
def minute(s):
    m=re.fullmatch(r'(\d+)(?::(\d+))?(am|pm)',s.strip())
    h,n,a=m.groups();return (int(h)%12+(12 if a=='pm' else 0))*60+int(n or 0)
for chunk in s.split('<td '):
    date=re.search(r'visually-hidden">([A-Za-z]+ \d+)</span>',chunk)
    if not date:continue
    d=datetime.datetime.strptime(date[1]+' 2026','%B %d %Y').date().isoformat()
    out[d]={}
    for key,name in [('newman','Newman Library'),('art','Art & Architecture Library')]:
        m=re.search(re.escape(name)+r'</div><span[^>]*>(.*?)</span>',chunk)
        if not m:continue
        text=html.unescape(m[1])
        intervals=[] if text=='Closed' else [[0,1440]] if text=='24 Hours' else [[minute(x) for x in text.split('–')]]
        out[d][key]=intervals
p=Path(__file__).resolve().parents[1]/'data'
(p/'hours.json').write_text(json.dumps({'source':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'dates':out},indent=2))
print('Library hours dates:',len(out))
