import {readFileSync} from 'node:fs';
import {runAgent} from '../lib/agent.ts';
const data=Object.fromEntries(['buildings','spaces','classes','hours'].map(k=>[k,JSON.parse(readFileSync(new URL(`../data/${k}.json`,import.meta.url),'utf8'))]));
const plan={from:'NCB',to:'DERR',date:'2026-09-21',start:'09:55',end:'11:15',intent:'study',maxWalk:12,buffer:5,confirmedOnly:false};
try{const result=await runAgent('I want to eat and walk no more than 8 minutes.',plan,data,[],process.env);console.log(JSON.stringify(result,null,2));}catch(e){console.error(e.message);process.exitCode=1;}
