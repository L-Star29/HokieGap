'use client';
import {useEffect,useMemo,useState} from 'react';
import {ArrowRight,Footprints,Clock,MapPin,ArrowUpRight,Info,RefreshCw,Navigation,Star,ChevronDown,Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {NativeSelect} from '@/components/ui/native-select';
import buildings from '@/data/buildings.json';
import spaces from '@/data/spaces.json';
import classes from '@/data/classes.json';
import hours from '@/data/hours.json';
import {recommend,forecast,clock,minutes,eastern,freshReports,validate,type Plan,type Report,type Data} from '@/lib/planner';
const data:Data={buildings,spaces,classes,hours};
const bootstrapPlan:Plan={from:'NCB',to:'DERR',date:'2026-09-19',start:'12:00',end:'13:00',intent:'study',maxWalk:12,buffer:5,confirmedOnly:false};
const timeValue=(m:number)=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
function currentPlan(base:Plan=bootstrapPlan){const n=eastern(Date.now()),end=Math.min(n.minute+60,1439);return {...base,date:n.date,start:timeValue(n.minute),end:timeValue(end)};}
const reportLabels={plenty:'Plenty of seats',few:'A few seats',none:'No seats seen'};
const intentLabels:Record<string,string>={study:'Get some work done',quiet:'Find a quieter spot',group:'Work with friends',eat:'Get something to eat',break:'Take a break'};
const smooth=():ScrollBehavior=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
export default function Home(){
 const [draft,setDraft]=useState<Plan>(bootstrapPlan),[plan,setPlan]=useState<Plan>(bootstrapPlan);
 const [reports,setReports]=useState<Report[]>([]),[reportStatus,setReportStatus]=useState('Loading recent reports…'),[now,setNow]=useState(0),[selected,setSelected]=useState(''),[backup,setBackup]=useState(''),[reportSpace,setReportSpace]=useState(spaces[0].id),[posting,setPosting]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(''),[routeMessage,setRouteMessage]=useState('');
 const [foldOpen,setFoldOpen]=useState(false),[ready,setReady]=useState(false),[favorites,setFavorites]=useState<string[]>([]),[savedGaps,setSavedGaps]=useState<{name:string;plan:Plan}[]>([]),[gapName,setGapName]=useState(''),[showAll,setShowAll]=useState(false),[aiRequest,setAiRequest]=useState(''),[aiBusy,setAiBusy]=useState(false),[aiResult,setAiResult]=useState<any>(null),[aiError,setAiError]=useState(''),[aiEnabled,setAiEnabled]=useState(false);
 const dirty=JSON.stringify(draft)!==JSON.stringify(plan);
 const liveTime=eastern(now||Date.now());
 const departed=plan.date<liveTime.date||(plan.date===liveTime.date&&minutes(plan.start)<liveTime.minute-5);
 function remember(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
 function saveGap(){if(!gapName.trim()||validate(draft,buildings))return;setSavedGaps(v=>[...v.filter(x=>x.name!==gapName.trim()),{name:gapName.trim().slice(0,60),plan:draft}].slice(-8));setGapName('');}
 async function askAgent(){setAiBusy(true);setAiError('');setAiResult(null);try{const r=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({request:aiRequest,plan:draft})});const x=await r.json() as any;if(!r.ok)throw Error(x.error||'Could not create an AI plan.');setDraft(x.plan);setPlan(x.plan);setSelected(x.selectedId||'');setBackup('');setAiResult(x);}catch(e){setAiError(e instanceof Error?e.message:'AI unavailable');}finally{setAiBusy(false);}}

 const result=useMemo(()=>recommend(plan,data,reports,now),[plan,reports,now]);
 const active=result.results.find(s=>s.id===selected)||result.results[0];
 async function refresh(){try{const r=await fetch('/api/reports');if(!r.ok)throw Error();const x=await r.json() as {reports:Report[]};setReports(x.reports);setReportStatus(x.reports.length?`${x.reports.length} recent student report${x.reports.length===1?'':'s'}`:'No recent reports yet');}catch{setReportStatus('Reports unavailable · forecasts still work');}}
 useEffect(()=>{let live=currentPlan();try{const pref=JSON.parse(localStorage.getItem('hg-preferences')||'null');if(pref){const test={...live,...pref,date:live.date,start:live.start,end:live.end};if(!validate(test,buildings))live=test;}const fav=JSON.parse(localStorage.getItem('hg-favorites')||'[]');if(Array.isArray(fav))setFavorites(fav.filter(id=>spaces.some(s=>s.id===id)));const gaps=JSON.parse(localStorage.getItem('hg-gaps')||'[]');if(Array.isArray(gaps))setSavedGaps(gaps.filter(g=>typeof g.name==='string'&&g.plan&&!validate(g.plan,buildings)).slice(-8));const session=JSON.parse(localStorage.getItem('hg-active')||'null');const n=eastern(Date.now());if(session?.plan&&!validate(session.plan,buildings)&&session.plan.date===n.date&&minutes(session.plan.end)>n.minute){live=session.plan;setSelected(session.selected||'');setBackup(session.backup||'');}}catch{}setDraft(live);setPlan(live);setNow(Date.now());setReady(true);void refresh();void fetch('/api/agent').then(r=>r.json()).then((x:any)=>setAiEnabled(x.enabled===true)).catch(()=>{});const t=setInterval(()=>{setNow(Date.now());void refresh();},60000);return ()=>clearInterval(t);},[]);
 useEffect(()=>{if(!ready)return;const {from,to,intent,maxWalk,buffer,confirmedOnly}=plan;remember('hg-preferences',{from,to,intent,maxWalk,buffer,confirmedOnly});remember('hg-active',{plan,selected,backup});remember('hg-favorites',favorites);remember('hg-gaps',savedGaps);},[ready,plan,selected,backup,favorites,savedGaps]);
 function apply(p:Plan){const r=recommend(p,data,reports,Date.now());if(r.error){setError(r.error);return;}setError('');setFoldOpen(false);setPlan(p);setSelected('');setBackup('');setAiResult(null);setRouteMessage('');}
 function showPlan(id:string,name:string){setSelected(id);setRouteMessage(`Route updated for ${name}.`);requestAnimationFrame(()=>{const panel=document.getElementById('route-plan');if(!panel)return;panel.focus({preventScroll:true});const r=panel.getBoundingClientRect();if(r.top<0||r.top>window.innerHeight*0.6)panel.scrollIntoView({behavior:smooth(),block:'start'});});}
 async function report(level:Report['level']){setPosting(true);setMessage('');try{const r=await fetch('/api/reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({spaceId:reportSpace,level})});const body=await r.json() as {error?:string};if(!r.ok)throw Error(body.error||'Could not save your report.');setMessage('Thanks — your observation is saved and visible for 15 minutes.');setNow(Date.now());await refresh();}catch(e){setMessage(e instanceof Error?e.message:'Could not save your report.');}finally{setPosting(false);}}
 useEffect(()=>{const context=(document as any).modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();Promise.resolve(context.registerTool({name:'configure_gap_plan',description:'Update the visible campus gap plan. Does not reserve seating.',inputSchema:{type:'object',properties:{from:{type:'string'},to:{type:'string'},date:{type:'string'},start:{type:'string'},end:{type:'string'},intent:{type:'string',enum:['study','quiet','group','break','eat']}},required:['from','to','date','start','end','intent'],additionalProperties:false},execute(input:unknown){if(!input||typeof input!=='object')throw Error('Expected plan inputs');const p={...bootstrapPlan,...input} as Plan;const r=recommend(p,data);if(r.error)throw Error(r.error);setDraft(p);setPlan(p);setSelected('');setBackup('');setError('');return {status:'configured',places:r.results.map(x=>({name:x.name,usableMinutes:x.usable,leaveBy:clock(x.leave)}))};}},{signal:lifecycle.signal})).catch(()=>{});return ()=>lifecycle.abort();},[]);
 const backupOption=result.results.find(s=>s.id===backup);
 const fallbackPlan=active&&backupOption?{...plan,from:active.buildingId,start:timeValue(Math.max(liveTime.date===plan.date?liveTime.minute:0,active.arrival))}:null;
 const fallback=fallbackPlan?recommend(fallbackPlan,data,reports,now).results.find(s=>s.id===backup):null;
 function switchBackup(){if(!fallback||!fallbackPlan)return;setDraft(fallbackPlan);setPlan(fallbackPlan);setSelected(fallback.id);setBackup('');setAiResult(null);setRouteMessage('Plan B selected with updated walking time.');}
 const fromBuilding=buildings.find(b=>b.id===plan.from),toBuilding=buildings.find(b=>b.id===plan.to);
 const mapsUrl=active&&fromBuilding&&toBuilding?`https://www.google.com/maps/dir/?api=1&origin=${fromBuilding.lat},${fromBuilding.lon}&destination=${toBuilding.lat},${toBuilding.lon}&waypoints=${active.building.lat},${active.building.lon}&travelmode=walking`:'';
 const gapMinutes=Math.max(0,minutes(plan.end)-minutes(plan.start));
 const options=result.results;
 const startMin=minutes(plan.start),endMin=minutes(plan.end),span=Math.max(1,endMin-startMin);
 const at=(m:number)=>Math.max(0,Math.min(100,(m-startMin)/span*100));
 const parts=active?(()=>{const out=Math.min(endMin,active.leave+active.walkOut);return {walkIn:Math.max(0,active.arrival-startMin),stay:Math.max(0,active.leave-active.arrival),walkOut:Math.max(0,out-active.leave),buffer:Math.max(0,endMin-out)};})():null;
 const tickStep=span<=60?5:span<=180?15:60;
 const ticks=span/tickStep<=40?Array.from({length:Math.floor(span/tickStep)+1},(_,i)=>i*tickStep):[];
 const leaveAt=active?at(active.leave):0;
 const leaveShift=leaveAt>55?'-100%':leaveAt<12?'0%':'-50%';
 const isBest=!!active&&options[0]?.id===active.id;
 const facts=(s:typeof options[number])=><p className="place-facts"><span className={`tag ${s.crowd.score>=30?'high':''}`}>{s.crowd.available?`Class activity: ${s.crowd.label}`:s.crowd.label}</span><span className={s.latest?'seat-report':''}>{s.latest?reportLabels[s.latest.level]+' · student report':'No recent seating reports'}</span><span>{s.open?'Open per published hours':'Opening hours not verified'}</span></p>;
 function submit(){const r=recommend(draft,data,reports,Date.now());apply(draft);if(!r.error&&window.innerWidth<=700)requestAnimationFrame(()=>document.getElementById('planner')?.scrollIntoView({behavior:smooth(),block:'start'}));}
 return <>
 <header className="topbar"><a className="wordmark" href="/"><span className="logo">h<span>g</span></span>hokiegap</a><span className="campus-label"><MapPin size={15}/> Virginia Tech</span><a href="#data-notes" className="source-link">About the data <ArrowUpRight size={15}/></a></header>
 <main>
 <div className="top">
  <div className="intro-copy"><h1>A little gap. A good place.</h1><p>Find somewhere to settle in, with time to make your next class.</p></div>
  <div className="ai-planner" role="group" aria-labelledby="ai-title">
   <div className="ai-row"><h2 id="ai-title">Ask HokieGap</h2><Input aria-label="Your request" value={aiRequest} onChange={e=>setAiRequest(e.target.value)} maxLength={1000} disabled={!aiEnabled} placeholder="Somewhere quiet, under 8 min walk"/><Button onClick={()=>void askAgent()} disabled={!aiEnabled||aiBusy||!aiRequest.trim()||!!validate(draft,buildings)}>{aiBusy?'Finding a plan…':'Plan with AI'}</Button></div>
   <p className="caption">Describe what you need. Your buildings and times below set the boundaries. {aiEnabled?'Your request and gap details are sent to Gemini. Avoid private information.':'AI setup is pending. Use the manual planner below.'}</p>
   {aiError&&<p role="alert" className="error">{aiError}</p>}
   {aiResult&&<div role="status" className="ai-result"><p>{aiResult.explanation}</p>{aiResult.source&&<p className="caption">Checked against: {aiResult.source}.</p>}</div>}
  </div>
 </div>
 <aside className="planner" id="planner" data-open={foldOpen} aria-label="Your gap">
  <button type="button" className="gap-summary" aria-expanded={foldOpen} aria-controls="planner-body" onClick={()=>setFoldOpen(o=>!o)}><span className="gap-summary-text"><strong>{clock(startMin)} – {clock(endMin)} · {gapMinutes} min</strong><small>{fromBuilding?.name} → {toBuilding?.name} · {intentLabels[plan.intent]||plan.intent}</small></span><span className="gap-summary-action">{foldOpen?'Close':'Change'}<ChevronDown size={16}/></span></button>
  <div className="planner-body" id="planner-body">
   <form className="gap-form" onSubmit={e=>{e.preventDefault();submit();}}>
    <label>Starting from<NativeSelect value={draft.from} onChange={e=>setDraft({...draft,from:e.target.value})}>{buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</NativeSelect></label>
    <label>Next class in<NativeSelect value={draft.to} onChange={e=>setDraft({...draft,to:e.target.value})}>{buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</NativeSelect></label>
    <div className="two-fields"><label>Free from<Input type="time" required value={draft.start} onChange={e=>setDraft({...draft,start:e.target.value})}/></label><label>Class starts<Input type="time" required value={draft.end} onChange={e=>setDraft({...draft,end:e.target.value})}/></label></div>
    <label>I want to<NativeSelect value={draft.intent} onChange={e=>setDraft({...draft,intent:e.target.value})}>{Object.entries(intentLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</NativeSelect></label>
    <div className="gap-submit"><Button type="submit" className="primary-btn">{dirty?'Update results':'Find my spot'} <ArrowRight size={18}/></Button></div>
    {dirty&&<p className="notice">Inputs changed. Update results before using the route.</p>}{error&&<p role="alert" className="error">{error}</p>}
   </form>
   <div className="gap-tools">
    <details className="preferences"><summary>More preferences</summary><div className="pref-grid"><label>Date<Input type="date" required value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})}/></label><label>Maximum walk each way<NativeSelect value={draft.maxWalk} onChange={e=>setDraft({...draft,maxWalk:+e.target.value})}>{[3,5,8,12,15,20].map(n=><option key={n} value={n}>{n} min</option>)}</NativeSelect></label><label>Arrive early<NativeSelect value={draft.buffer} onChange={e=>setDraft({...draft,buffer:+e.target.value})}>{[0,5,10,15].map(n=><option key={n} value={n}>{n} min</option>)}</NativeSelect></label>
    <label>Opening hours<NativeSelect value={draft.confirmedOnly?'confirmed':'all'} onChange={e=>setDraft({...draft,confirmedOnly:e.target.value==='confirmed'})}><option value="all">Include unknown hours</option><option value="confirmed">Only confirmed hours</option></NativeSelect></label></div><p className="caption">Uses published schedules, not a live door check. Places with unknown hours are hidden when this filter is on.</p></details>
    <details className="preferences"><summary>Saved gaps</summary><p className="caption">Saved on this device. Choose a saved gap, then check the date.</p><div className="pref-grid save-row"><label>Gap name<Input value={gapName} onChange={e=>setGapName(e.target.value)} placeholder="MWF morning" maxLength={60}/></label><Button variant="outline" disabled={!gapName.trim()||!!validate(draft,buildings)} onClick={saveGap}>Save this gap</Button></div>{savedGaps.map(g=><div className="saved-gap" key={g.name}><button type="button" onClick={()=>{const p={...g.plan,date:liveTime.date};setDraft(p);apply(p);}}>{g.name}</button><button type="button" aria-label={`Remove ${g.name}`} onClick={()=>setSavedGaps(v=>v.filter(x=>x.name!==g.name))}>Remove</button></div>)}</details>
    <button type="button" className="text-button" onClick={()=>{const p=currentPlan(draft);setDraft(p);apply(p);}}>Start now · one-hour gap</button>
    <p className="caption">Eastern Time. Late-night gaps end at 11:59 PM; overnight planning is not supported.</p>
   </div>
  </div>
 </aside>
 <div className="board" aria-busy={!ready}>
  {ready&&departed&&<p className="notice">Your planned start is in the past. Use “Start now” or update the time.</p>}{dirty&&<p className="notice">Showing your previous search until results are updated.</p>}
  {!ready&&<div className="skeleton answer-skeleton" aria-hidden="true"/>}
  {ready&&options.length===0&&<div className="empty"><h2>{plan.confirmedOnly?'No places with confirmed hours fit these constraints.':'No places fit these constraints.'}</h2>{plan.confirmedOnly&&<Button onClick={()=>{const p={...plan,confirmedOnly:false};setDraft(p);apply(p);}}>Include unknown hours</Button>}<p>Try a longer gap, a larger walking limit or include unverified hours. We require at least 15 usable minutes.</p></div>}
  {ready&&active&&parts&&<section className="answer" id="route-plan" tabIndex={-1} aria-label={`Recommended place: ${active.name}`}>
   <p className="sr-only" aria-live="polite">{routeMessage}</p>
   <div className="answer-top">
    <div className="answer-place">
     <div className="answer-name"><h2>{active.name}</h2>{isBest&&<span className="best-tag">Best fit</span>}</div>
     <p className="location">{active.location}</p>
     {facts(active)}
     {mapsUrl&&<a className="map-link" href={mapsUrl} target="_blank" rel="noreferrer"><Navigation size={17}/><span>Open walking directions<small>{fromBuilding?.name} → {active.name} → {toBuilding?.name} · leave {clock(startMin)}</small></span><ArrowUpRight size={16}/></a>}
    </div>
    <div className="answer-leave"><span>Leave for class by</span><strong>{clock(active.leave)}</strong><em>{active.usable} minutes to settle in · {active.walkIn}-minute walk</em></div>
   </div>
   <div className="ruler" role="img" aria-label={`Your gap to scale: ${parts.walkIn} minutes walking to the spot, ${parts.stay} minutes settled in, ${parts.walkOut} minutes walking to class and ${parts.buffer} minutes of buffer.`}>
    <span className="ruler-mark" style={{left:`${leaveAt}%`}}/>
    <span className="ruler-leave" style={{left:`${leaveAt}%`,transform:`translateX(${leaveShift})`}}>Leave by {clock(active.leave)}</span>
    <div className="ruler-track"><span className="seg walk" style={{flexGrow:parts.walkIn}}/><span className="seg stay" style={{flexGrow:parts.stay}}>{active.usable} min to settle in</span><span className="seg walk" style={{flexGrow:parts.walkOut}}/><span className="seg buffer" style={{flexGrow:parts.buffer}}/></div>
    <div className="ruler-ticks" aria-hidden="true">{ticks.map(t=><i key={t} className={t%(tickStep*3)===0?'major':''} style={{left:`${at(startMin+t)}%`}}/>)}</div>
    <div className="ruler-ends" aria-hidden="true"><span>{clock(startMin)}</span><span>Class {clock(endMin)}</span></div>
   </div>
   <ul className="ruler-legend" aria-hidden="true"><li><i className="walk"/>Walking {parts.walkIn+parts.walkOut} min</li><li><i className="stay"/>Settle in {parts.stay} min</li><li><i className="buffer"/>Buffer {parts.buffer} min</li></ul>
   <ol className="steps">
    <li><span className="step-time">{clock(startMin)}</span><div>{plan.from===active.buildingId?'Stay in':'Leave'} {fromBuilding?.name}<small>About {active.walkIn} min to your spot</small></div></li>
    <li className="main-stop"><span className="step-time">{clock(active.arrival)}</span><div>Settle in for {active.usable} minutes<small>{plan.intent==='eat'?'Includes ordering and eating. Queue times and venue hours are not verified.':plan.intent==='break'?'Time to take a breather.':'A pocket of time to make progress.'}</small></div></li>
    <li><span className="step-time">{clock(active.leave)}</span><div>Head to {toBuilding?.name}<small>About {active.walkOut} min walking · {plan.buffer} min buffer</small></div></li>
    <li><span className="step-time">{clock(endMin)}</span><div>Next class starts</div></li>
   </ol>
  </section>}
  <div className="lower">
   <section className="results" id="results" aria-labelledby="results-title">
    <div className="results-heading"><h2 id="results-title">Places that fit</h2>{ready&&<span>{options.length} {options.length===1?'option':'options'}</span>}</div>
    <p className="results-sub">Compared by available time, class-change activity and recent seat reports.</p>
    <div className="report-strip"><span className="status-dot"/>{reportStatus}<Button variant="ghost" size="icon-sm" aria-label="Refresh seating reports" onClick={()=>void refresh()}><RefreshCw size={14}/></Button></div>
    {!ready&&<><div className="skeleton" aria-hidden="true"/><div className="skeleton" aria-hidden="true"/></>}
    {ready&&<ul className="places">{(showAll?options:options.slice(0,3)).map((s,i)=>{const on=active?.id===s.id;return <li className={`place ${on?'is-active':''}`} key={s.id}>
     <div className="place-main"><h3 className="place-name"><button type="button" className="spot-title" onClick={()=>showPlan(s.id,s.name)} aria-pressed={on}>{s.name}</button>{i===0&&<span className="best-tag">Best fit</span>}</h3><p className="location">{s.location}</p>{facts(s)}</div>
     <div className="place-stat"><strong>{s.usable}</strong><span>minutes there</span></div>
     <div className="place-stat"><strong>{s.walkIn}</strong><span>min walk</span></div>
     <div className="place-stat leave"><strong>{clock(s.leave)}</strong><span>leave by</span></div>
     <div className="place-actions">{on?<span className="showing"><Check size={15}/>Showing above</span>:<Button variant="ghost" onClick={()=>showPlan(s.id,s.name)}>View route <ArrowRight size={15}/></Button>}<Button variant="ghost" disabled={on} onClick={()=>setBackup(backup===s.id?'':s.id)}>{backup===s.id?'Remove Plan B':'Add as Plan B'}</Button><Button variant="ghost" aria-label={favorites.includes(s.id)?'Saved place':'Save place'} aria-pressed={favorites.includes(s.id)} onClick={()=>setFavorites(v=>v.includes(s.id)?v.filter(x=>x!==s.id):[...v,s.id])}><Star size={15} fill={favorites.includes(s.id)?'currentColor':'none'}/><span className="btn-label">{favorites.includes(s.id)?'Saved':'Save place'}</span></Button></div>
    </li>;})}</ul>}
    {ready&&options.length>3&&<Button variant="outline" className="more-btn" onClick={()=>setShowAll(!showAll)}>{showAll?'Show fewer places':`Show ${options.length-3} more places`}</Button>}
   </section>
   <aside className="about" aria-label="About this pick">
    {!ready&&<div className="skeleton tall" aria-hidden="true"/>}
    {ready&&active&&<>
     <div className="forecast"><div><h3>Expected class-change activity</h3><span className="small-tag">ESTIMATE</span></div><p>{active.crowd.available?`${active.crowd.label} activity`:active.crowd.label} around {clock(active.crowd.time)}</p>{active.crowd.available&&<div className="bars">{Array.from({length:7},(_,i)=>{const t=Math.round(active.arrival+i*(active.leave-active.arrival)/6),c=forecast(active.buildingId,plan.date,t,data);return <div key={i} title={`${clock(t)}: ${c.label}`}><span className={c.score>=30?'hi':c.score>=10?'mid':''} style={{height:`${Math.max(6,Math.min(58,c.score))}px`}}/><small>{i%3===0?clock(t).replace(' AM','').replace(' PM',''):''}</small></div>;})}</div>}<p className="caption">Estimated activity from classes, not total crowds. Low activity does not mean seats are available. Forecast coverage: Sept 19–25, 2026.</p>{active.crowd.events.map(e=><p className="event" key={e.room+e.end}>{e.course} ends {clock(e.end)} · {e.room}<small>Section capacity {e.capacity}; enrollment unknown</small></p>)}</div>
     {backupOption&&backup!==active.id&&<div className="backup"><strong>Plan B: {backupOption.name}</strong><p>{fallback?`${fallback.walkIn}-minute walk from ${active.name}; ${fallback.usable} minutes available. Leave by ${clock(fallback.leave)}.`:'This backup no longer fits from your selected spot.'}</p><Button disabled={!fallback||dirty} onClick={switchBackup}>I’m here · switch to Plan B</Button><button type="button" className="text-button" onClick={()=>setBackup('')}>Remove</button></div>}
     <Button variant="outline" className="report-cta" onClick={()=>{setReportSpace(active.id);document.getElementById('seat-reports')?.scrollIntoView({behavior:smooth()});}}>Report seats at this place</Button>
     <details className="place-details"><summary>What we know about this spot</summary><p>{active.note}</p><p>{active.verification}. Seat count and current outlet availability are unknown.</p><a href={active.source} target="_blank" rel="noreferrer">Read the place source <ArrowUpRight size={14}/></a><p className="caption">Walks use building coordinates, a 35% detour allowance, 70 m/min pace and 2 minutes indoors. Actual routes, stairs and accessible entrances may take longer.</p></details>
    </>}
   </aside>
  </div>
 </div>
 <section id="seat-reports" className="community"><div><h2>Here right now? Share the seat situation.</h2><p>Report only what you can see at the selected spot. Reports are shown for 15 minutes. Anonymous observations may be kept to improve the forecast.</p><p className="caption">Reports describe now, even when your plan is for another day. They influence a plan only if still fresh at arrival.</p></div><div className="report-controls"><label>Where are you?<NativeSelect value={reportSpace} onChange={e=>setReportSpace(e.target.value)}>{spaces.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</NativeSelect></label><div className="report-buttons">{(['plenty','few','none'] as const).map(level=><Button key={level} variant="outline" disabled={posting} onClick={()=>void report(level)}>{reportLabels[level]}</Button>)}</div><p role="status">{message}</p>{freshReports(reports,reportSpace,now)[0]&&<p className="caption">Latest observation: {reportLabels[freshReports(reports,reportSpace,now)[0].level]} · {Math.floor((now-freshReports(reports,reportSpace,now)[0].createdAt)/60000)} min ago</p>}</div></section>
 <details id="data-notes" className="data-notes"><summary><Info size={17}/> Data, coverage & limitations</summary><div className="notes-grid"><div><h3>Real sources, defined coverage</h3><p>{buildings.length} building coordinates from VT GIS and {spaces.length} destinations from university or architect descriptions. Bishop-Favrao is currently a route endpoint until a suitable public space is verified.</p><p>The Sept 19 snapshot includes {classes.length} meetings from 14 subjects. It uses section capacity rather than enrollment and does not collect private rosters.</p><a href="https://selfservice.banner.vt.edu/ssb/HZSKVTSC.P_DispRequest" target="_blank" rel="noreferrer">VT public timetable <ArrowUpRight size={14}/></a></div><div><h3>Forecast model</h3><p>The current class-change forecast covers Sept 19–25, 2026. It estimates how nearby class starts and endings affect demand; observations will be used to calibrate and extend it.</p><p>Library hours are a dated calendar snapshot. Other opening hours are unknown. Schedules and access can change.</p><a href="https://lib.vt.edu/about-us/hours.html" target="_blank" rel="noreferrer">Check current library hours <ArrowUpRight size={14}/></a></div><div><h3>Live reports</h3><p>Seating observations are stored on the service and influence recommendations for 15 minutes. They are not reservations or guarantees.</p><p>The optional AI planner shows the actual data source used for each request. Class-change activity is an uncalibrated scheduling heuristic. HokieGap is an independent student project.</p></div></div></details>
 <footer><span className="wordmark">hokiegap</span><span>A better use of the time between.</span></footer></main></>;
}
