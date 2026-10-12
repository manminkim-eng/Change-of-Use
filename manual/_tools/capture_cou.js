// 건축물 용도변경 판정기 매뉴얼 화면 캡처 — usage: node capture_cou.js <repoDir> <outDir>
// 규격: 1440×900 · DSF 1.25 · _marks.json(번호 배지 % 좌표) · _example.json(예제 검증값)
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=1440,VH=900,DSF=1.25,PORT=8897;
/* 예제 A(허가)  = 공동주택(제8군) → 제1종 근린생활시설(제7군) · 공사명 「만민 공동주택 1층 근린생활시설 용도변경」 · 작성자 「건축사 김만민」
   예제 B(신고)  = 판매시설(제5군) → 업무시설(제8군)
   예제 C(같은 군) = 제1종 근린생활시설 → 제2종 근린생활시설(제7군) */
const FREEZE=`(()=>{const T=new Date(2026,9,12,10,0,0).getTime();const D=Date;class F extends D{constructor(...a){if(a.length)super(...a);else super(T);}static now(){return T;}}window.Date=F;window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear();localStorage.setItem('pwa-banner-dismissed','1')}catch(e){}})()`;
const HELP=`window.__vis=e=>e&&e.getClientRects().length>0;
window.__card=(t)=>{const h=[...document.querySelectorAll('.chead')].find(e=>__vis(e)&&e.textContent.trim().startsWith(t));return h?h.closest('.card'):null;};
window.__find=(sel)=>{
 if(sel.startsWith('card:'))return __card(sel.slice(5));
 if(sel.startsWith('sub:'))return document.querySelectorAll('#a4-body .a4-sub')[+sel.slice(4)]||null;
 if(sel.startsWith('mt:'))return document.querySelectorAll('.modal-tabs .mtab')[+sel.slice(3)]||null;
 if(sel.startsWith('grp:'))return [...document.querySelectorAll(sel.split('|')[1]+' .fac-group')][+sel.split('|')[0].slice(4)]||null;
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(__vis);if(e)return e;}return null;};
window.__pick=(box,u)=>{const b=[...document.querySelectorAll(box+' .fb')].find(x=>x.textContent.replace(/^제\\d군/,'').replace('현재','')===u);b.click();};
window.__sel=(cur,tgt,name,author,judge)=>{doReset();goTab('tj');__pick('#gCur',cur);__pick('#gTgt',tgt);
  const n=document.getElementById('a4ProjName'),a=document.getElementById('a4Author');n.value=name||'';a.value=author||'';renderA4();if(window.mmSetSum)mmSetSum();
  if(judge){doJudge();}window.scrollTo(0,0);};
window.__A=(j)=>__sel('공동주택','제1종 근린생활시설','만민 공동주택 1층 근린생활시설 용도변경','건축사 김만민',j);
window.__B=(j)=>__sel('판매시설','업무시설','만민 판매시설 업무시설 용도변경','건축사 김만민',j);
window.__C=(j)=>__sel('제1종 근린생활시설','제2종 근린생활시설','만민 근린생활시설 용도변경','건축사 김만민',j);
window.__ex=()=>{const r=lastResult;const mi=[...document.querySelectorAll('#rArea .mi')].map(x=>[x.querySelector('.ml').textContent,x.querySelector('.mv').textContent]);
  return {cur:r.curU,tgt:r.tgtU,fg:r.fg,tg:r.tg,type:r.type,gn:[GN[r.fg],GN[r.tg]],kw:document.querySelector('#rArea .vkw').textContent,verdict:document.querySelector('#rArea .vhl').textContent,mi:Object.fromEntries(mi),
   chead:(document.querySelector('#rArea .chead')||{}).textContent||'',procs:[...document.querySelectorAll('#rArea .proc-list .pt')].map(e=>e.textContent),warns:[...document.querySelectorAll('#rArea .wl li')].map(e=>e.textContent),
   sum:[...document.querySelectorAll('.sum-bar .sum-item')].map(e=>e.textContent.trim()),name:document.getElementById('a4ProjName').value};};`;
const SHOTS=[
 {id:'s01_overview',pre:"__A(false)",clip:'viewport',m:[['.tab-bar-inner','작업 탭'],['.sum-bar-wrap','요약 스트립'],['.law-banner','근거 안내'],['.steps-bar','진행 단계'],['card:📋 공사 정보','공사 정보'],['#fab-group','초기화 · 이용안내']]},
 {id:'s02_tabs',clip:'.app-header',m:[['.tb:nth-of-type(1)','용도변경 판정'],['.tb:nth-of-type(2)','판정 결과'],['.tb:nth-of-type(3)','A4 판정서'],['.tb:nth-of-type(4)','시설군 참고'],['.tb-manual','매뉴얼'],['.hdr-right','근거 조문·시행일']]},
 {id:'s03_project',clip:'card:📋 공사 정보',m:[['#a4ProjName','공사명'],['#a4Author','작성자']]},
 {id:'s04_cur',clip:'card:STEP 01',m:[['grp:0|#gCur','제1군 — 상위'],['grp:6|#gCur','제7군 근린생활시설군'],['grp:7|#gCur','제8군 주거업무시설군'],['#gCur .fb.sc','현재 용도 — 공동주택'],['grp:8|#gCur','제9군 — 하위']]},
 {id:'s05_tgt',clip:'#s2card',m:[['.sel-box:nth-child(1)','현재 용도'],['.sel-box:nth-child(3)','변경 용도'],['#gTgt .fb.dis','현재 용도 — 선택 불가'],['#gTgt .fb.st','변경 용도 — 제1종 근린생활시설']]},
 {id:'s06_judge',clip:'#jBtn',union:'.breset',m:[['#jBtn','판정하기'],['.breset','처음부터 다시 선택']]},
 {id:'s07_result',pre:"doJudge();scrollTo(0,0)",clip:'#rArea .verdict',m:[['#rArea .vhl','판정 — 허가 후 변경 가능'],['#rArea .vbody','설명 — 근거 조항'],['#rArea .mi:nth-child(3)','시설군 이동'],['#rArea .mi:nth-child(4)','행정 절차'],['#rArea .mi:nth-child(5)','판정 기준 조항']]},
 {id:'s08_proc',clip:'#rArea .card',union:'#rArea .wbox',m:[['#rArea .proc-list li:nth-child(1)','설계자 선정 — 500㎡ 이상 건축사'],['#rArea .proc-list li:nth-child(6)','사용승인 — 100㎡ 이상'],['#rArea .wbox','주의사항']]},
 {id:'s09_sumbar',clip:'.sum-bar-wrap',m:[['.sum-item:nth-child(1)','현재 용도'],['.sum-item:nth-child(3)','변경 용도'],['.sum-item:nth-child(5)','이동 방향'],['.sum-item:nth-child(6)','절차']]},
 {id:'s10_a4',pre:"goTab('print');scrollTo(0,0)",wait:1200,clip:'viewport',m:[['.mm-btn-print','인쇄 / PDF 저장'],['#btn-jpg','JPG 저장'],['#a4Page','A4 판정서']]},
 {id:'s11_a4page',clip:'#a4Page',m:[['.a4-head2','공사명 · 근거 · 작성일'],['sub:0','1. 판정 조건'],['sub:1','2. 판정 결과'],['sub:2','3. 시설군 분류'],['sub:3','4. 행정 절차'],['sub:4','5. 주의사항'],['sub:5','6. 적용 기준']]},
 {id:'s12_ref',pre:"goTab('tref');scrollTo(0,0)",wait:800,clip:'#tref',m:[['#reftbl tbody tr:nth-child(1)','제1군 — 상위군'],['#reftbl tbody tr:nth-child(8)','제8군 — 교정시설 · 국방·군사시설'],['#tref .card:nth-child(2)','판정 기준 요약']]},
 {id:'s13_help_howto',pre:"goTab('tj');openModal()",wait:900,fixed:true,clip:'.modal-panel',m:[['mt:0','사용 방법'],['mt:1','관련 법규'],['mt:2','판정 기준']]},
 {id:'s14_help_law',pre:"goMtab('mlaw',document.querySelectorAll('.modal-tabs .mtab')[1]);document.querySelector('.modal-body').scrollTop=0",wait:800,fixed:true,clip:'.modal-panel',m:[]},
 {id:'s15_help_judge',pre:"goMtab('mjudge',document.querySelectorAll('.modal-tabs .mtab')[2]);document.querySelector('.modal-body').scrollTop=0",wait:800,fixed:true,post:"closeModal()",clip:'.modal-panel',m:[]},
 {id:'s16_var_report',pre:"__B(true);scrollTo(0,0)",clip:'#rArea .verdict',m:[['#rArea .vhl','판정 — 신고 후 변경 가능'],['#rArea .mi:nth-child(3)','제5군 → 제8군(하향)'],['#rArea .mi:nth-child(5)','제19조 제2항 제2호']]},
 {id:'s17_var_free',pre:"__C(true);scrollTo(0,0)",clip:'#rArea .verdict',union:'#rArea .card',m:[['#rArea .vhl','판정 — 건축물대장 변경신청'],['#rArea .vbody','임의변경 — 시행령 제14조 제4항'],['#rArea .mi:nth-child(5)','제19조 제3항'],['#rArea .proc-list li:nth-child(2)','임의변경 가능 여부 확인']]},
 {id:'s18_var_report_a4',pre:"__B(true);goTab('print');scrollTo(0,0)",wait:1200,clip:'#a4Page',post:"__A(true)",m:[]},
];
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(FREEZE);
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(2500);
 await pg.addStyleTag({content:'#pwaBanner,#pwa-install-bar,#pwa-update-bar,#swUpdateBar,#iosGuideModal,#toast,.toast{display:none!important}'});
 await pg.evaluate(HELP);
 const ex={};const meta={};
 for(const S of SHOTS){
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||700);
  if(S.id==='s07_result')ex.A=await pg.evaluate('__ex()');
  if(S.id==='s16_var_report')ex.B=await pg.evaluate('__ex()');
  if(S.id==='s17_var_free')ex.C=await pg.evaluate('__ex()');
  if(S.id==='s11_a4page')ex.A_a4=await pg.evaluate(()=>document.getElementById('a4Page').innerText.replace(/\s+/g,' '));
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=__find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     if(S.union){const e2=__find(S.union);if(e2){const a2=abs(e2);const x0=Math.min(clip.x,a2.x),y0=Math.min(clip.y,a2.y),x1=Math.max(clip.x+clip.width,a2.x+a2.w),y1=Math.max(clip.y+clip.height,a2.y+a2.h);clip={x:x0,y:y0,width:x1-x0,height:y1-y0};}}
     const P=12;clip={x:Math.max(0,clip.x-P),y:Math.max(0,clip.y-P),width:clip.width+2*P,height:clip.height+2*P};}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=__find(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(Math.min(a.w,clip.x+clip.width-a.x)/clip.width*100).toFixed(2),h:+(Math.min(a.h,clip.y+clip.height-a.y)/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW-Math.max(0,c.x)),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else if(S.fixed){const sx=await pg.evaluate(()=>scrollX),sy=await pg.evaluate(()=>scrollY);await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:c.x-sx,y:c.y-sy,width:Math.min(c.width,VW),height:Math.min(c.height,VH)}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(Math.min(cl.height,S.fixed?VH:1e9)),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){errs.push(S.id+' post '+e.message);}await pg.waitForTimeout(500);}
 }
 ex.after=await pg.evaluate('__ex()');
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true});await setup(mctx);
 const mp=await mctx.newPage();await mp.addInitScript(FREEZE);
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(2500);
 await mp.addStyleTag({content:'#pwaBanner,#pwa-install-bar,#pwa-update-bar,#swUpdateBar,#iosGuideModal,#toast,.toast{display:none!important}'});await mp.evaluate(HELP);await mp.evaluate('__A(false)');await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s19_mobile_main.png')});meta['s19_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{doJudge();window.scrollTo(0,0);});await mp.waitForTimeout(700);
 await mp.screenshot({path:path.join(out,'s20_mobile_result.png')});meta['s20_mobile_result']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{goTab('print');window.scrollTo(0,0);});await mp.waitForTimeout(1200);
 await mp.screenshot({path:path.join(out,'s21_mobile_a4.png')});meta['s21_mobile_a4']={w:390,h:844,marks:[]};
 ex.mobileTabBar=await mp.evaluate(()=>{const t=document.querySelector('.tab-bar-inner');return {scroll:t.scrollWidth,client:t.clientWidth,page:document.documentElement.scrollWidth}});
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify(ex,null,1));
 const miss=[];Object.entries(meta).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x+m.w>100.5||m.y+m.h>100.5)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y+','+m.w+','+m.h);}));
 console.log(JSON.stringify({A:[ex.A.verdict,ex.A.mi['판정 기준']],B:[ex.B.verdict,ex.B.mi['판정 기준']],C:[ex.C.verdict,ex.C.mi['판정 기준']],same:JSON.stringify(ex.A)===JSON.stringify(ex.after),mobileTabBar:ex.mobileTabBar,sizes:Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,v.w+'x'+v.h])),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();
