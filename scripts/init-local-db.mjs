import './sites-env.mjs';
import {spawnSync} from 'node:child_process';
import {readdirSync,readFileSync} from 'node:fs';
for(const file of readdirSync(new URL('../drizzle',import.meta.url)).filter(x=>x.endsWith('.sql')).sort()){
 // Bootstrap is repeatable on existing development databases; production uses migrations.
 const sql=readFileSync(new URL(`../drizzle/${file}`,import.meta.url),'utf8').replace(/CREATE TABLE (?!IF NOT EXISTS)/g,'CREATE TABLE IF NOT EXISTS ').replace(/CREATE INDEX (?!IF NOT EXISTS)/g,'CREATE INDEX IF NOT EXISTS ');
 const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','site-creator-d1','--config','wrangler.local.jsonc','--local','--persist-to','.wrangler/state','--command',sql],{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}
