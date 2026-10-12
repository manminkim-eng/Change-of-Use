// 용도변경 판정기 v5.0.6 — 전 조합 판정 대조 (건축법 제19조 제2항·제3항, 시행령 제14조 제5항 독립 구현)
// 사용: NODE_PATH=$(npm root -g) node verify_cou_judge.js <index.html>
const {chromium}=require('playwright'); const path=require('path');
const LAW=[ // 시행령 제14조 제5항 (2026-10-06 현행, 제14조 최종 개정 2024-02-13) — 앱과 별도로 원문에서 옮김
 [1,['자동차 관련 시설']],
 [2,['운수시설','창고시설','공장','위험물저장 및 처리시설','자원순환 관련 시설','묘지 관련 시설','장례시설']],
 [3,['방송통신시설','발전시설']],
 [4,['문화 및 집회시설','종교시설','위락시설','관광휴게시설']],
 [5,['판매시설','운동시설','숙박시설','제2종 근린생활시설(다중생활시설)']],
 [6,['의료시설','교육연구시설','노유자시설','수련시설','야영장시설']],
 [7,['제1종 근린생활시설','제2종 근린생활시설']],
 [8,['단독주택','공동주택','업무시설','교정시설','국방·군사시설']],
 [9,['동물 및 식물 관련 시설']]];
const G={}; LAW.forEach(([g,us])=>us.forEach(u=>G[u]=g));
const exp=(a,b)=>{const fa=G[a],fb=G[b]; if(fa===fb) return ['건축물대장 변경신청 필요','건축법 제19조 제3항'];
  return fb<fa?['허가 후 변경 가능','건축법 제19조 제2항 제1호']:['신고 후 변경 가능','건축법 제19조 제2항 제2호'];};
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({serviceWorkers:'block'}); const errs=[];
 p.on('pageerror',e=>errs.push(e.message)); await p.route(/^https?:/,r=>r.abort());
 await p.goto('file://'+path.resolve(process.argv[2])); await p.waitForTimeout(600);
 const appUses=await p.$$eval('#gCur .fb',e=>e.map(x=>x.textContent.replace(/^제\d군/,'')));
 const lawUses=Object.keys(G);
 const missing=lawUses.filter(u=>!appUses.includes(u)), extra=appUses.filter(u=>!lawUses.includes(u));
 const appG=await p.evaluate(()=>U2G);
 const gDiff=lawUses.filter(u=>appG[u]!==G[u]);
 const res=await p.evaluate(()=>{const out=[];const us=Object.keys(U2G);
   for(const a of us)for(const c of us){ if(a===c) continue;
     doReset(); const fa=[...document.querySelectorAll('#gCur .fb')].find(x=>x.textContent.replace(/^제\d군/,'')===a); fa.click();
     const fc=[...document.querySelectorAll('#gTgt .fb')].find(x=>x.textContent.replace(/^제\d군/,'')===c); fc.click();
     document.getElementById('jBtn').click();
     const mi=[...document.querySelectorAll('#rArea .mi')].map(x=>x.querySelector('.mv').textContent);
     renderA4(); const a4b=[...document.querySelectorAll('#a4-body .a4-meta-table td')].map(x=>x.textContent);
     out.push({a,c,v:document.querySelector('#rArea .vhl').textContent,basis:mi[4],a4:a4b[a4b.indexOf('판정 기준')+1],
       chead:(document.querySelector('#rArea .chead')||{}).textContent||'',body:document.querySelector('#rArea').textContent}); }
   return out;});
 let bad=0; const cnt={};
 for(const r of res){ const [v,bs]=exp(r.a,r.c); cnt[v]=(cnt[v]||0)+1;
   const ok=r.v===v && r.basis===bs && r.a4===bs && !/제19조 제3항에 따라 관할 특별자치시장|통상 3~7일|통상 15~30일|간소화/.test(r.body)
     && (v!=='건축물대장 변경신청 필요' || (/대장 변경신청 프로세스/.test(r.chead) && !/제19조 제5항|제19조 제6항/.test(r.body)));
   if(!ok){ bad++; if(bad<=5) console.log('✗',r.a,'→',r.c,'|',r.v,'|',r.basis,'|',r.a4,'|',r.chead); } }
 console.log(JSON.stringify({조합:res.length,불일치:bad,유형별:cnt,앱용도수:appUses.length,누락:missing,초과:extra,시설군차이:gDiff,오류:errs}));
 await b.close(); process.exit(bad||missing.length||extra.length||gDiff.length||errs.length?1:0);
})();
