import json,re,collections
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'data'
aliases={'NCB':'NCB','GOODW':'GOODWIN','DER':'DERR','CO':'COW','HAN':'HAN','BFH':'BFH','LIBR':'NEWMAN'}
def minute(s):
    m=re.fullmatch(r'(\d{1,2}):(\d{2})(AM|PM)',s)
    if not m:return None
    h,n,a=m.groups();return (int(h)%12+(12 if a=='PM' else 0))*60+int(n)
out=[]
for subject,r in json.loads((p/'timetable-rows.json').read_text()):
    if len(r)<12 or r[11].split()[0] not in aliases:continue
    start,end=minute(r[9]),minute(r[10])
    if start is None or end is None or not r[6].isdigit():continue
    out.append(dict(crn=r[0],course=r[1],buildingId=aliases[r[11].split()[0]],room=r[11],days=r[8].replace(' ',''),start=start,end=end,capacity=int(r[6]),enrollment=None))
(p/'classes.json').write_text(json.dumps(out,indent=2))
print(json.dumps({'meetings':len(out),'byBuilding':dict(collections.Counter(x['buildingId'] for x in out))}))
