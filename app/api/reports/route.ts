import {storage} from '@/db/storage';
import spaces from '@/data/spaces.json';
const headers={'Cache-Control':'no-store'};
export async function GET(){
 try{const result=await storage().prepare('SELECT space_id AS spaceId, level, created_at AS createdAt FROM reports WHERE created_at > ? AND created_at <= ? ORDER BY created_at DESC LIMIT 300').bind(Date.now()-900000,Date.now()).all();return Response.json({reports:result.results},{headers});}
 catch(e){console.error('Report read failed',e instanceof Error?e.message:'Unknown storage failure');return Response.json({error:'Reports are temporarily unavailable. Try again shortly.'},{status:503,headers});}
}
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Use the report form on this site.'},{status:403,headers});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Expected a JSON report.'},{status:415,headers});
 let body;
 try{const text=await request.text();if(text.length>1024)throw Error();body=JSON.parse(text);}catch{return Response.json({error:'Invalid report.'},{status:400,headers});}
 if(!body||!spaces.some(s=>s.id===body.spaceId)||!['plenty','few','none'].includes(body.level))return Response.json({error:'Choose a listed space and seating level.'},{status:400,headers});
 const previous=/(?:^|;\s*)hg_session=([a-f0-9-]{36})(?:;|$)/.exec(request.headers.get('cookie')||'')?.[1];
 const session=previous||crypto.randomUUID(),now=Date.now();
 const cookie=`hg_session=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${new URL(request.url).protocol==='https:'?'; Secure':''}`;
 try{
  const db=storage();
  const result=await db.prepare('INSERT INTO reports (id, session_id, space_id, level, created_at) SELECT ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM reports WHERE session_id = ? AND created_at > ?)').bind(crypto.randomUUID(),session,body.spaceId,body.level,now,session,now-60000).run();
  if(!result.meta.changes)return Response.json({error:'Please wait one minute before sending another report.'},{status:429,headers:{...headers,'Set-Cookie':cookie}});
  // Keep anonymous observations for seven days for future validation; never expose session IDs.
  await db.prepare('DELETE FROM reports WHERE created_at < ?').bind(now-7*86400000).run();
  return Response.json({ok:true},{status:201,headers:{...headers,'Set-Cookie':cookie}});
 }catch(e){console.error('Report save failed',e instanceof Error?e.message:'Unknown storage failure');return Response.json({error:'Could not save your report. Please try again shortly.'},{status:503,headers});}
}
