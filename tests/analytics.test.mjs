import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
function pages(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pages(join(dir,e.name)):e.name.endsWith('.html')?[join(dir,e.name)]:[])}
test('every generated page tracks once in the devblog property',()=>{
 const files=pages('_site'); assert.ok(files.length>1);
 for(const path of files){const html=readFileSync(path,'utf8');
 assert.equal((html.match(/https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-51M67DL5LZ/g)||[]).length,1,path);
 assert.equal((html.match(/gtag\('config', 'G-51M67DL5LZ'/g)||[]).length,1,path);
 assert.ok(html.includes('allow_google_signals: false'),path);
 }
});
