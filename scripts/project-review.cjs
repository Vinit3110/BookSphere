const {chromium}=require('C:/Users/deore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review','project');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream'});res.end(data)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});let results=[];try{
for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:900},hasTouch:true});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.waitForTimeout(2100);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,`${width}-home.png`)});
 const book=page.locator('.book-stage');await book.scrollIntoViewIfNeeded();await page.evaluate(()=>document.querySelector('.book-stage').scrollIntoView());await page.waitForTimeout(600);
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 assert.equal(await page.locator('.current-page').count(),1);await page.screenshot({path:path.join(out,`${width}-chapter1.png`)});
 await page.locator('[data-page-step="1"]').click();
 const spine=await page.locator('.fold-leaf').evaluate(leaf=>{const animation=leaf.getAnimations()[0],root=leaf.closest('.book-stage'),r=root.getBoundingClientRect();animation.pause();const points=[100,425,740].map(time=>{animation.currentTime=time;return leaf.querySelector('.fold-hinge').getBoundingClientRect().x});animation.currentTime=300;animation.play();return {points,center:r.x+r.width/2,width:leaf.offsetWidth,spread:root.clientWidth}});
 assert.ok(spine.points.every(x=>Math.abs(x-spine.center)<1),'The hinge stays on the center crease throughout the turn');assert.equal(spine.width,spine.spread/2,'Only half of the spread rotates');
 await page.screenshot({path:path.join(out,`${width}-turn.png`)});await page.waitForTimeout(950);
 assert.equal(await book.getAttribute('data-page-index'),'1');assert.equal(await page.locator('.reading-room:not(.current-page)').evaluateAll(els=>els.every(el=>el.inert)),true);
 await page.screenshot({path:path.join(out,`${width}-chapter2.png`)});await page.locator('[data-page-step="1"]').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(950);assert.equal(await book.getAttribute('data-page-index'),'2');
 await page.locator('[data-page-step="1"]').click();await page.waitForTimeout(950);assert.equal(await book.getAttribute('data-page-index'),'3');await page.screenshot({path:path.join(out,`${width}-final.png`)});assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight),height);
 await page.locator('[data-page-step="-1"]').click();const reverse=await page.locator('.fold-leaf').evaluate(leaf=>{const a=leaf.getAnimations()[0],r=leaf.closest('.book-stage').getBoundingClientRect();a.pause();a.currentTime=550;const x=leaf.querySelector('.fold-hinge').getBoundingClientRect().x;a.play();return {x,center:r.x+r.width/2}});assert.ok(Math.abs(reverse.x-reverse.center)<1,'Reverse turn uses the same center hinge');await page.waitForTimeout(950);assert.equal(await book.getAttribute('data-page-index'),'2');
 await page.mouse.move(width/2,450);await page.mouse.wheel(0,-180);await page.waitForTimeout(1100);assert.equal(await book.getAttribute('data-page-index'),'1','Wheel turns the leaf backward');
 await page.locator('.room-progress a').first().click();await page.waitForTimeout(950);assert.equal(await book.getAttribute('data-page-index'),'0');
 await book.evaluate(el=>{const start=new Event('touchstart',{bubbles:true});Object.defineProperty(start,'touches',{value:[{clientX:300,clientY:450}]});el.dispatchEvent(start);const end=new Event('touchend',{bubbles:true});Object.defineProperty(end,'changedTouches',{value:[{clientX:100,clientY:450}]});el.dispatchEvent(end)});await page.waitForTimeout(950);assert.equal(await book.getAttribute('data-page-index'),'1');
 // Seed a reader without invoking the unchanged portal delay.
 await page.evaluate(()=>{S.user={name:'Vinit'};save();location.hash='dashboard'});await page.waitForTimeout(500);
 for(const route of ['dashboard','explore','mybooks','dna','streaks','clubs','about']){
  await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(route==='dna'?1400:500);await page.screenshot({path:path.join(out,`${width}-${route}.png`),fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} horizontal overflow at ${width}`);
  assert.equal(await page.locator('.btn:not(.scroll-control)').count(),0,`${route} unpainted buttons`);
 }
 await page.evaluate(()=>location.hash='explore');await page.waitForTimeout(300);
 await page.locator('#q').fill('Dune');assert.equal(await page.locator('#eg .bi').count(),1);await page.locator('#q').fill('');
 await page.locator('[data-act="gf"][data-v="Fantasy"]').click();assert.equal(await page.evaluate(()=>U.g),'Fantasy');await page.locator('[data-act="gf"]').first().click();
 await page.locator('[data-act="track"]').first().click();await page.locator('#tsv').waitFor();await page.waitForTimeout(350);assert.equal(await page.locator('#tsv .scroll-art').count(),1);await page.screenshot({path:path.join(out,`${width}-tracker.png`)});
 await page.locator('#tp').fill('42');await page.locator('#ts').selectOption('reading');await page.locator('#tsv').click();await page.waitForTimeout(450);assert.equal(await page.locator('#modal').evaluate(e=>e.classList.contains('on')),false);assert.equal(await page.evaluate(()=>S.lib.some(e=>e.prog===42&&e.st==='reading')),true);
 await page.evaluate(()=>location.hash='mybooks');await page.waitForTimeout(300);await page.locator('.tr [data-act="track"]').first().click();await page.locator('#trm').waitFor();const count=await page.evaluate(()=>S.lib.length);await page.locator('#trm').click();await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>S.lib.length),count-1);
 await page.evaluate(()=>{delete S.log[ds(0)];save();location.hash='streaks'});await page.waitForTimeout(300);await page.locator('[data-act="logt"]').click();await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>S.log[ds(0)]),20);
 await page.evaluate(()=>location.hash='clubs');await page.waitForTimeout(350);const joined=await page.evaluate(()=>S.joined.length);await page.locator('[data-act="join"]').first().click();await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>S.joined.length),joined+1);await page.locator('[data-act="join"]').first().click();await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>S.joined.length),joined);
 await page.locator('#city').selectOption({index:1});await page.waitForTimeout(300);assert.equal(await page.locator('#city').inputValue(),await page.evaluate(()=>S.city));
 await page.locator('[data-act="ncl"]').click();await page.locator('#cn').fill('Lantern Readers');await page.waitForTimeout(350);await page.screenshot({path:path.join(out,`${width}-create-club.png`)});await page.locator('#cs').click();await page.waitForTimeout(450);assert.ok((await page.evaluate(()=>JSON.stringify(S))).includes('Lantern Readers'));
 await page.reload();assert.equal(await page.evaluate(()=>S.user.name),'Vinit');assert.ok((await page.evaluate(()=>JSON.stringify(S))).includes('Lantern Readers'));
 assert.deepEqual(errors,[]);results.push({width,pages:4,routes:7,errors,tracking:'saved',club:'created'});await context.close();
}
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.locator('[data-page-step="1"]').click();assert.equal(await page.locator('.book-stage').getAttribute('data-page-index'),'1');assert.equal(await page.locator('.book-turning').count(),0);await context.close();
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
