import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync('index.html','utf8');
const snapshot=JSON.parse(fs.readFileSync('data/2026-10-13.json','utf8'));
const derived=JSON.parse(fs.readFileSync('data/2026-10-13-derived.json','utf8'));
const ctx=new Proxy({},{get:(_,key)=>key==='measureText'?()=>({width:30}):()=>{}});
const body={innerHTML:''};const nodes={filters:{},ticker:{innerHTML:''},hyperscalerChart:{getBoundingClientRect:()=>({width:600,height:260}),getContext:()=>ctx}};
const sandbox={document:{querySelector:()=>body,getElementById:id=>nodes[id],querySelectorAll:()=>[]},devicePixelRatio:1,addEventListener:()=>{},setTimeout,clearTimeout};
vm.createContext(sandbox);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],sandbox);
assert.equal((body.innerHTML.match(/<tr>/g)||[]).length,12);
assert(body.innerHTML.includes('中际旭创'));assert(body.innerHTML.includes('阿里巴巴'));
assert(!/NaN|Infinity|undefined/.test(body.innerHTML));
for(const [filter,count] of [['光模块',2],['PCB',2],['半导体设备',2],['材料',3],['服务器',3]]){vm.runInContext(`render(${JSON.stringify(filter)})`,sandbox);assert.equal((body.innerHTML.match(/<tr>/g)||[]).length,count);}
assert(snapshot.quotes.every(x=>new Date(x.f124*1000).toISOString().startsWith('2026-10-13')));
for(const c of derived.companies.filter(x=>x.q1)){assert(c.pe26>0);assert(Math.abs(c.a-(c.g2-c.g1))<0.00001);assert(c.household.HOLD_NOTICE_DATE<'2026-10-14');assert(c.margin.DATE.startsWith('2026-10-12'));}
assert.equal(derived.companies.find(x=>x.code==='300476').r,'观察·待扣非拐点');
const codes=['300308','300502','300476','002463','002371','688120','300054','688019','002409','000977','002897','09988'];
assert.equal(new Set(derived.companies.map(x=>x.code)).size,codes.length);
assert(!html.includes('2026.09.16'));assert(html.includes('$720–745B'));assert(html.includes('13:48'));
console.log('PASS: 12家公司、筛选、首行、报价日期、PE、二阶差分、两融/股东日期和盘中标注均已核验。');
