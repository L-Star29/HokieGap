import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadCampus,runAgent} from '../lib/agent.ts';
import type {Data,Plan} from '../lib/planner.ts';
const data=Object.fromEntries(['buildings','spaces','classes','hours'].map(k=>[k,JSON.parse(readFileSync(new URL(`../data/${k}.json`,import.meta.url),'utf8'))])) as Data;
const plan:Plan={from:'NCB',to:'DERR',date:'2026-09-21',start:'09:55',end:'11:15',intent:'study',maxWalk:12,buffer:5,confirmedOnly:false};
test('missing Databricks configuration is explicitly labeled local',async()=>{const result=await loadCampus({},data);assert.equal(result.source,'Bundled campus snapshot');});
test('configured Databricks failure is not disguised as a successful integration',async()=>{await assert.rejects(loadCampus({DATABRICKS_HOST:'https://example.cloud.databricks.com',DATABRICKS_TOKEN:'test',DATABRICKS_WAREHOUSE_ID:'warehouse'},data,async()=>new Response('{}',{status:403})),/Databricks query failed/);});
test('successful Databricks query returns warehouse data, labeled as Databricks',async()=>{
 const rows=['buildings','spaces','classes','hours'].map(k=>[k,JSON.stringify((data as any)[k])]);
 let seen:any;
 const fake=async(url:any,init:any)=>{seen={url:String(url),body:JSON.parse(init.body),auth:init.headers.Authorization};return Response.json({status:{state:'SUCCEEDED'},result:{data_array:rows}});};
 const r=await loadCampus({DATABRICKS_HOST:'https://example.cloud.databricks.com',DATABRICKS_TOKEN:'t0k',DATABRICKS_WAREHOUSE_ID:'wh1'},data,fake as any);
 assert.equal(r.source,'Databricks SQL warehouse');
 assert.deepEqual(r.data.classes,data.classes);
 assert.equal(seen.url,'https://example.cloud.databricks.com/api/2.0/sql/statements');
 assert.equal(seen.auth,'Bearer t0k');
 assert.equal(seen.body.warehouse_id,'wh1');
 assert.match(seen.body.statement,/`workspace`\.`hokiegap`\.campus_datasets/);
});
test('Databricks host must be an https *.cloud.databricks.com workspace',async()=>{
 const fake=async()=>{throw Error('must not be called');};
 for(const host of ['https://evil.example.com','http://example.cloud.databricks.com','https://user:pw@example.cloud.databricks.com'])
  await assert.rejects(loadCampus({DATABRICKS_HOST:host,DATABRICKS_TOKEN:'t',DATABRICKS_WAREHOUSE_ID:'w'},data,fake as any),/Invalid Databricks workspace host/);
});
test('agent refuses invented destination IDs even when Gemini returns them',async()=>{let count=0;const fake=async()=>Response.json(++count===1?{candidates:[{content:{role:'model',parts:[{functionCall:{name:'find_campus_options',args:{intent:'eat',maxWalk:8}}}]}}]}:{candidates:[{content:{parts:[{text:JSON.stringify({selectedId:'imaginary-place',explanation:'Invented'})}]}}]});await assert.rejects(runAgent('food',plan,data,[],{GEMINI_API_KEY:'test'},fake),/unverified destination/);});
test('agent rejects tool arguments outside valid walking constraints',async()=>{const fake=async()=>Response.json({candidates:[{content:{parts:[{functionCall:{name:'find_campus_options',args:{intent:'eat',maxWalk:500}}}]}}]});await assert.rejects(runAgent('food',plan,data,[],{GEMINI_API_KEY:'test'},fake),/invalid preferences/);});
