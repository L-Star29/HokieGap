export type Building={id:string,name:string,lat:number,lon:number};
export type Meeting={crn:string,course:string,buildingId:string,room:string,days:string,start:number,end:number,capacity:number};
export type Space={id:string,buildingId:string,name:string,location:string,intents:string[],note:string,verification:string,source:string,hoursKey:string|null,historic:boolean};
export type Report={spaceId:string,level:'plenty'|'few'|'none',createdAt:number};
export type Plan={from:string,to:string,date:string,start:string,end:string,intent:string,maxWalk:number,buffer:number,confirmedOnly:boolean};
export type Data={buildings:Building[],spaces:Space[],classes:Meeting[],hours:{dates:Record<string,Record<string,number[][]>>}};
export const minutes=(s:string)=>{const m=/^(\d{2}):(\d{2})$/.exec(s);return m&&+m[1]<24&&+m[2]<60?+m[1]*60 + +m[2]:NaN};
export const clock=(n:number)=>`${Math.floor(n/60)%12||12}:${String(n%60).padStart(2,'0')} ${n<720?'AM':'PM'}`;
export function eastern(now:number){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return {date:`${p.year}-${p.month}-${p.day}`,minute:+p.hour*60 + +p.minute};}
export function distance(a:Building,b:Building){const rad=Math.PI/180;const x=(a.lon-b.lon)*rad*Math.cos((a.lat+b.lat)/2*rad),y=(a.lat-b.lat)*rad;return Math.sqrt(x*x+y*y)*6371000;}
export function walk(a:Building,b:Building){return a.id===b.id?2:Math.ceil(distance(a,b)*1.35/70)+2;}
export function validate(p:Plan,buildings:Building[]){if(!buildings.some(x=>x.id===p.from)||!buildings.some(x=>x.id===p.to))return 'Choose a current and next building.';if(!/^2026-\d{2}-\d{2}$/.test(p.date)||isNaN(Date.parse(p.date))||new Date(p.date).toISOString().slice(0,10)!==p.date)return 'Choose a valid date in 2026.';if(!Number.isFinite(minutes(p.start))||!Number.isFinite(minutes(p.end))||minutes(p.end)<=minutes(p.start))return 'End time must be later than start time on the same day.';if(!['study','quiet','group','break','eat'].includes(p.intent)||!Number.isInteger(p.maxWalk)||p.maxWalk<2||p.maxWalk>20||!Number.isInteger(p.buffer)||p.buffer<0||p.buffer>20)return 'Check the activity, walking limit and arrival buffer.';return null;}
export function forecast(buildingId:string,date:string,time:number,data:Data){
 const available=date>='2026-09-19'&&date<='2026-09-25';
 if(!available)return {score:0,label:'Outside forecast window',events:[] as {course:string,end:number,capacity:number,room:string}[],available:false};
 const day=['U','M','T','W','R','F','S'][new Date(date+'T12:00:00Z').getUTCDay()];
 const target=data.buildings.find(b=>b.id===buildingId)!;
 const unique=new Map<string,Meeting>();
 for(const c of data.classes.filter(c=>c.days.includes(day))){const key=`${c.room}|${c.start}|${c.end}`;if(!unique.has(key)||unique.get(key)!.capacity<c.capacity)unique.set(key,c);}
 let score=0;const events=[];
 for(const c of unique.values()){
  const b=data.buildings.find(b=>b.id===c.buildingId);if(!b)continue;
  const d=distance(target,b),proximity=c.buildingId===buildingId?1:d<250?0.2*(1-d/250):0;
  const since=time-c.end,until=c.start-time;
  // Uncalibrated demand index: 8% of capacity lingers, decaying over 25 minutes.
  if(since>=0&&since<=25){score+=c.capacity*.08*proximity*(1-since/25);if(proximity===1)events.push({course:c.course,end:c.end,capacity:c.capacity,room:c.room});}
  if(until>0&&until<=10)score+=c.capacity*.025*proximity*(1-until/10);
 }
 return {score,label:score>=30?'Higher surge':score>=10?'Some surge':'Lower surge',events:events.sort((a,b)=>b.capacity-a.capacity).slice(0,3),available:true};
}
export function freshReports(reports:Report[],spaceId:string,now:number){return reports.filter(r=>r.spaceId===spaceId&&r.createdAt<=now&&now-r.createdAt<15*60000&&['plenty','few','none'].includes(r.level)).sort((a,b)=>b.createdAt-a.createdAt);}
export function recommend(p:Plan,data:Data,reports:Report[]=[],now=Date.now()){
 const error=validate(p,data.buildings);if(error)return {error,results:[]};
 const from=data.buildings.find(b=>b.id===p.from)!,to=data.buildings.find(b=>b.id===p.to)!;
 const current=eastern(now);
 const results=data.spaces.filter(s=>s.intents.includes(p.intent)).flatMap(space=>{
  const building=data.buildings.find(b=>b.id===space.buildingId)!;
  const walkIn=walk(from,building),walkOut=walk(building,to);
  if(Math.max(walkIn,walkOut)>p.maxWalk)return [];
  const arrival=minutes(p.start)+walkIn,deadline=minutes(p.end)-p.buffer-walkOut;
  const intervals=space.hoursKey?data.hours.dates[p.date]?.[space.hoursKey]:undefined;
  const interval=intervals?.find(([open,close])=>open<=arrival&&close>arrival);
  if(intervals&&!interval)return [];
  if(p.confirmedOnly&&!interval)return [];
  const leave=interval?Math.min(deadline,interval[1]):deadline;
  const usable=leave-arrival;if(usable<15)return [];
  const arrivalCrowd=forecast(space.buildingId,p.date,arrival,data);
  let crowd={...arrivalCrowd,time:arrival};
  for(let t=arrival+5;t<leave;t+=5){const c=forecast(space.buildingId,p.date,t,data);if(c.score>crowd.score)crowd={...c,time:t};}
  const fresh=freshReports(reports,space.id,now);
  // Today's reports cannot describe a future arrival after their 15-minute freshness window.
  const applicable=p.date===current.date&&arrival>=current.minute&&arrival<=current.minute+15;
  const latest=applicable?fresh.filter(r=>current.minute+Math.max(0,(r.createdAt+900000-now)/60000)>=arrival)[0]:undefined;
  const penalty=latest?.level==='none'?75:latest?.level==='few'?20:0;
  return [{...space,building,walkIn,walkOut,arrival,leave,usable,crowd,latest,open:!!interval,score:usable-crowd.score*.4-penalty-(space.historic?12:0)-(interval?0:5)}];
 }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 return {error:null,results};
}
