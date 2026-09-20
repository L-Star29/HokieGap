// Proves (or disproves) the Databricks integration end to end, without Gemini.
// Usage: npm run check:databricks   (reads .dev.vars)
import {readFileSync} from 'node:fs';
import {loadCampus,databricksConfigured} from '../lib/agent.ts';
const local=Object.fromEntries(['buildings','spaces','classes','hours'].map(k=>[k,JSON.parse(readFileSync(new URL(`../data/${k}.json`,import.meta.url),'utf8'))]));
const c=process.env;
const missing=['DATABRICKS_HOST','DATABRICKS_TOKEN','DATABRICKS_WAREHOUSE_ID'].filter(k=>!c[k]);
if(!databricksConfigured(c)){console.error(`Not configured. Missing in .dev.vars: ${missing.join(', ')}`);process.exit(2);}
try{
 const t=Date.now();
 const r=await loadCampus(c,local);
 const same=JSON.stringify(r.data.classes)===JSON.stringify(local.classes);
 console.log(`OK  source: ${r.source}  (${Date.now()-t} ms)`);
 console.log(`    buildings=${r.data.buildings.length} spaces=${r.data.spaces.length} classes=${r.data.classes.length} hoursDates=${Object.keys(r.data.hours.dates).length}`);
 console.log(`    classes identical to bundled snapshot: ${same}`);
}catch(e){console.error(`FAILED: ${e.message}`);process.exit(1);}
