import {env} from 'cloudflare:workers';
import {storage} from '@/db/storage';
import {runAgent,databricksConfigured,type AgentConfig} from '@/lib/agent';
import {validate,type Report} from '@/lib/planner';
import buildings from '@/data/buildings.json';
import spaces from '@/data/spaces.json';
import classes from '@/data/classes.json';
import hours from '@/data/hours.json';
const local={buildings,spaces,classes,hours};
const headers={'Cache-Control':'no-store'};
const config=()=>env as unknown as AgentConfig;
export async function GET(){const c=config();return Response.json({enabled:c.AGENT_ENABLED==='true'&&!!c.GEMINI_API_KEY,databricksConfigured:databricksConfigured(c)}, {headers});}
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Use the AI planner on this site.'},{status:403,headers});
 const c=config();if(c.AGENT_ENABLED!=='true'||!c.GEMINI_API_KEY)return Response.json({error:'The AI planner is not connected yet. Use the manual planner below.'},{status:503,headers});
 let body;try{const raw=await request.text();if(raw.length>5000)throw Error();body=JSON.parse(raw);if(typeof body.request!=='string'||!body.request.trim()||body.request.length>1000||!body.plan||validate(body.plan,buildings))throw Error();}catch{return Response.json({error:'Enter a short request and valid gap details.'},{status:400,headers});}
 try{
  const db=storage();
  // Shared, conservative project-wide quota prevents runaway public model calls.
  const used=await db.prepare("INSERT INTO agent_budget (bucket, count) VALUES (?, 1) ON CONFLICT(bucket) DO UPDATE SET count=count+1 WHERE count<60 RETURNING count").bind(Math.floor(Date.now()/3600000)).all();
  if(!used.results.length)return Response.json({error:'The AI planner has reached its hourly demo limit. The manual planner still works.'},{status:429,headers});
  await db.prepare('DELETE FROM agent_budget WHERE bucket < ?').bind(Math.floor(Date.now()/3600000)-24).run();
  const reports=await db.prepare('SELECT space_id AS spaceId, level, created_at AS createdAt FROM reports WHERE created_at > ? ORDER BY created_at DESC LIMIT 300').bind(Date.now()-900000).all();
  const result=await runAgent(body.request,body.plan,local,reports.results as Report[],c);
  return Response.json(result,{headers});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'The AI planner is temporarily unavailable.'},{status:502,headers});}
}
