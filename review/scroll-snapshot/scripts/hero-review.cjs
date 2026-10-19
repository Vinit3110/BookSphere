// Browser acceptance checks for the immersive landing page.
// Usage: node scripts/hero-review.cjs before|after
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/deore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const phase = process.argv[2] || 'after';
const verify = phase !== 'before';
const out = path.join(root, 'review', phase);
fs.mkdirSync(out, { recursive: true });
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.png':'image/png' };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => { res.writeHead(err ? 404 : 200, { 'Content-Type':types[path.extname(file)] || 'application/octet-stream' }); res.end(err ? '' : data); });
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ channel:'chrome', headless:true });
  try {
    const results = [];
    for (const [width,height] of [[1440,900],[1920,1080],[2560,1080],[390,844]]) {
      const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:1 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      if(verify) page.on('console', message=>{if(message.type()==='error')errors.push(message.text())});
      await page.goto(`http://127.0.0.1:${server.address().port}/booksphere.html#home`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1900);
      // The final composition, after the six-second push-in, is the QA target.
      if (verify) await page.locator('.hero-art').evaluate(e => e.getAnimations().forEach(a => a.finish()));
      await page.screenshot({ path:path.join(out, `${width}x${height}.png`) });
      const geometry = await page.evaluate(() => {
        const box = s => { const r=document.querySelector(s).getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
        const h=box('.hero'), title=box('.hero h1'), quote=box('.quote');
        return {hero:h,title,quote,overlap: title.x<quote.right&&title.right>quote.x&&title.y<quote.bottom&&title.bottom>quote.y,overflow:document.documentElement.scrollWidth>innerWidth, viewport:{width:innerWidth,height:innerHeight}};
      });
      if(phase==='scroll'){
        const button=page.locator('.hero-primary');
        const scale=()=>button.locator('.scroll-paper').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a);
        assert.ok(Math.abs(await scale()-.93)<.01,'Resting scroll is partially unfurled');
        const hitbox=await button.boundingBox();
        await button.hover();await page.waitForTimeout(550);
        assert.ok(Math.abs(await scale()-1)<.01,'Hover opens scroll');
        assert.deepEqual(await button.boundingBox(),hitbox,'Unfurl does not move the click target');
        await page.locator('.hero-actions').screenshot({path:path.join(out,`${width}x${height}-buttons-open.png`)});
        await page.mouse.move(width-5,height-5);await page.waitForTimeout(550);
        assert.ok(Math.abs(await scale()-.93)<.01,'Pointer leave closes scroll to rest');
        await page.locator('.hero-actions').screenshot({path:path.join(out,`${width}x${height}-buttons-rest.png`)});
        await button.focus();await page.keyboard.press('Tab');await page.waitForTimeout(550);
        assert.equal(await page.locator('.hero-secondary').evaluate(e=>e.matches(':focus-visible')),true,'Keyboard focus opens secondary control');
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.hero-secondary').evaluate(e=>e.classList.contains('scroll-closing')),true,'Activation starts roll-up');
        await page.locator('.persona').waitFor();
        await page.evaluate(()=>location.hash='home');await page.locator('.hero.revisit').waitFor();
        await page.locator('.hero-primary').dispatchEvent('pointerdown',{pointerType:'touch'});
        assert.equal(await page.locator('.hero-primary').evaluate(e=>e.classList.contains('scroll-touch-open')),true);
        await page.locator('.hero-primary').dispatchEvent('pointercancel',{pointerType:'touch'});
        assert.equal(await page.locator('.hero-primary').evaluate(e=>e.classList.contains('scroll-touch-open')),false);
      }
      if (verify) {
        assert.equal(geometry.hero.x,0); assert.equal(geometry.hero.y,0);
        assert.equal(geometry.hero.width,width); assert.equal(geometry.hero.height,height);
        assert.equal(geometry.overlap,false,'Quote overlaps headline');
        assert.equal(geometry.overflow,false,'Horizontal overflow');
        assert.equal(await page.locator('.hero h1 span').count(),3);
        const catBox=await page.locator('.mochi').boundingBox();
        assert.ok(catBox.x>=0 && catBox.x+catBox.width<=width+3,'Mochi fits inside the screen');
        const lineBoxes=await page.locator('.hero h1 span').evaluateAll(lines=>lines.map(el=>({height:el.getBoundingClientRect().height,line:parseFloat(getComputedStyle(el).lineHeight),overflow:el.scrollWidth>el.clientWidth})));
        lineBoxes.forEach(line=>assert.ok(line.height<line.line*1.1&&!line.overflow,'Headline line fits the safe zone'));
        await page.locator('.book-of-day').click();
        await page.locator('#tsv').waitFor({state:'visible'});
        await page.keyboard.press('Escape');
        await page.locator('.mochi').click();
        assert.ok(await page.locator('.cat-heart').count(),'Cat tap produces a heart');
        await page.locator('.scroll-cue').click();
        await page.waitForTimeout(900);
        assert.ok(await page.locator('.nav').evaluate(e=>e.classList.contains('scrolled')),'Nav becomes cream on scroll');
        await page.locator('[data-room="dna"]').waitFor({state:'visible'});
        await page.screenshot({path:path.join(out,`${width}x${height}-rooms.png`)});
        if(phase==='bookcraft'||phase==='scroll') {
          if(phase==='scroll')assert.ok(await page.locator('.hero-primary .scroll-roll').evaluate(e=>getComputedStyle(e).backgroundImage.includes('scroll/roll.webp')),'Controls use the supplied scroll artwork');
          else assert.ok(await page.locator('.hero-primary').evaluate(e=>getComputedStyle(e,'::before').borderImageSource.includes('walnut-plaque')),'Primary CTA uses real painted wood');
          for(const key of ['dna','streaks','clubs']) {
            const room=page.locator(`#room-${key}`);
            await room.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
            await page.waitForTimeout(1400);
            const bounds=await room.boundingBox();
            assert.equal(bounds.x,0,'Chapter starts at browser edge');
            assert.equal(bounds.width,width,'Chapter spans full viewport width');
            assert.equal(await room.locator('img[data-src]').count(),0,'Chapter artwork is loaded when visible');
            assert.equal(await room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true,'Chapter paintings decode');
            const pieces=await room.evaluate(el=>{const a=el.querySelector('.room-copy').getBoundingClientRect(),b=el.querySelector('.room-illustration>img').getBoundingClientRect();return {overlap:a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y,overflow:document.documentElement.scrollWidth>innerWidth}});
            assert.equal(pieces.overlap,false,'Chapter copy clears the illustration');
            assert.equal(pieces.overflow,false,'No chapter horizontal overflow');
            assert.equal(await page.locator('.room-progress a.active').getAttribute('href'),`#room-${key}`,'Bookmark follows the visible chapter');
            await page.screenshot({path:path.join(out,`${width}x${height}-${key}.png`)});
          }
          await page.locator('.library-footer').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'end'}));
          await page.waitForTimeout(1400);
          assert.equal((await page.locator('.library-footer').boundingBox()).width,width,'Closing scene spans the page');
          assert.ok(await page.locator('.closing-painting img').evaluate(i=>i.complete&&i.naturalWidth>0),'Closing scene loads on approach');
          await page.screenshot({path:path.join(out,`${width}x${height}-closing.png`)});
        }
        if(width===1440){
          // Same-session navigation must skip the introduction.
          await page.evaluate(()=>location.hash='explore');
          await page.locator('#q').waitFor();
          await page.evaluate(()=>location.hash='home');
          await page.locator('.hero.revisit').waitFor();
          assert.equal(await page.locator('.hero').evaluate(e=>e.classList.contains('intro')),false);
          await page.evaluate(()=>{document.querySelector('.hero').dataset.time='day'});
          await page.screenshot({path:path.join(out,'1440x900-day.png')});
          await page.locator('.hero-secondary').click();
          await page.locator('.persona').waitFor();
          await page.evaluate(()=>location.hash='home');
          await page.locator('.hero.revisit').waitFor();
          await page.locator('.usr [data-act="login"]').click();
          await page.locator('#ln').fill('Vinit');
          await page.locator('#lgo').click();
          await page.locator('.shell').waitFor();
          await page.waitForFunction(()=>!document.querySelector('#portal').classList.contains('on'));
          assert.equal(await page.locator('body').getAttribute('data-page'),'dashboard','Login portal reaches dashboard');
          await page.reload();
          await page.locator('.shell').waitFor();
          assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('bs-v1')).user.name),'Vinit','Sign-in survives reload');
        }
      }
      assert.deepEqual(errors,[]);
      results.push({width,height,...geometry,errors});
      await context.close();
    }
    if (verify) {
      const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${server.address().port}/booksphere.html#home`);
      assert.equal(await page.locator('.hero').evaluate(e=>e.classList.contains('intro')),false);
      assert.equal(await page.locator('.hero').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);
      await page.screenshot({path:path.join(out,'390x844-reduced-motion.png')});
      if(phase==='bookcraft'||phase==='scroll'){
        await page.locator('#room-dna').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
        await page.waitForTimeout(300);
        assert.equal(await page.locator('#room-dna').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0,'Reduced-motion chapters are still');
        await page.screenshot({path:path.join(out,'390x844-reduced-chapter.png')});
        if(phase==='scroll'){
          await page.evaluate(()=>scrollTo(0,0));
          await page.locator('.hero-secondary').click();
          await page.locator('.persona').waitFor();
          assert.equal(await page.locator('.scroll-closing').count(),0,'Reduced motion navigates without a roll-up delay');
        }
      }
      await context.close();
    }
    fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify({phase,viewports:results.length,output:out,passed:true}));
  } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
