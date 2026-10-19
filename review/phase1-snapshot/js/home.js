/* Immersive landing page. Existing router and tracker callbacks stay in the app. */
window.BookSphereHome = (() => {
  const art = 'assets/slices/hero/';
  let teardown = () => {};
  const render = () => `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-art-wrap" aria-hidden="true"><div class="hero-art">
      <picture><source media="(max-width:700px)" srcset="assets/hero/nook-mobile.webp" type="image/webp"><source srcset="assets/hero/nook.webp" type="image/webp"><img class="nook-painting" src="assets/hero/nook.png" alt="" width="1536" height="1024" fetchpriority="high" decoding="async"></picture>
      <div class="window-time"></div><div class="window-shimmer"></div>
      <div class="lantern-glow lantern-one"></div><div class="lantern-glow lantern-two"></div><div class="lantern-glow lantern-three"></div>
      <div class="living-plane"><div class="steam"><i></i><i></i><i></i><i></i></div><div class="fireflies"></div></div>
      <button class="mochi" type="button" aria-label="Say hello to Mochi the sleeping cat"><img src="${art}mochi.webp" alt="Mochi, a sleeping calico cat on books" width="278" height="221"><span class="cat-z z-one" aria-hidden="true">z</span><span class="cat-z z-two" aria-hidden="true">z</span><span class="cat-z z-three" aria-hidden="true">z</span></button>
    </div></div>
    <div class="hero-foliage" aria-hidden="true"><img class="vine vine-left" src="${art}vine-left.webp" alt="" width="175" height="865"><img class="vine vine-right" src="${art}vine-right.webp" alt="" width="176" height="780"></div>
    <div class="hero-copy"><p class="hero-eyebrow">A LITTLE WONDER. A CHAPTER AT A TIME.</p><h1 id="hero-title"><span>A universe</span><span>of books,</span><span>built for you.</span></h1><p class="hero-description">Discover stories that match your soul,<br class="desktop-break"> build lasting reading habits, and find your people.</p><div class="hero-actions"><button class="btn hero-primary" data-go="explore">Explore the Shelves <span aria-hidden="true">→</span></button><button class="hero-secondary" data-go="dna">Discover your Reading DNA <span aria-hidden="true">↗</span></button></div></div>
    <div class="hero-quote"><blockquote class="quote" aria-live="off"></blockquote><div class="dots" aria-label="Choose a book quote"></div></div>
    <button class="book-of-day" data-act="track" data-id="9" aria-label="Book of the Day: The Midnight Library. Open book tracker"><span class="badge-sparkle" aria-hidden="true">✦</span><img src="assets/slices/library/cover-the-midnight-library.webp" alt="The Midnight Library cover" width="70" height="120"><span><small>BOOK OF THE DAY</small><b>The Midnight<br>Library</b><em>A little possibility awaits ↗</em></span></button>
    <a href="#rooms" class="scroll-cue" aria-label="Discover your reading rooms"><span>THERE’S MORE TO YOUR STORY</span><b aria-hidden="true">⌄</b></a>
    <div class="intro-veil" aria-hidden="true"></div>
  </section>
  <section class="reading-rooms" id="rooms" aria-labelledby="rooms-title"><div class="rooms-heading"><span class="section-kicker">MAKE YOURSELF AT HOME</span><h2 id="rooms-title">Your reading life,<br>in three rooms.</h2><p>Follow your curiosity. Find your rhythm. Leave a little space for good company.</p></div>
    <nav class="room-progress" aria-label="Reading rooms"><a href="#room-dna" class="active"><span>01</span> Your taste</a><a href="#room-streaks"><span>02</span> Your rhythm</a><a href="#room-clubs"><span>03</span> Your people</a></nav>
    <article class="reading-room room-dna" id="room-dna" data-room="dna"><div class="room-illustration"><img src="assets/slices/dna/girl-reading.webp" alt="A reader surrounded by books, a crescent moon and flowers" width="300" height="350" loading="lazy"></div><div class="room-copy"><span class="section-kicker">01 / THE DISCOVERY ROOM</span><h3>A portrait of<br>your curiosity.</h3><p>Every story leaves a trace. Discover the worlds, ideas and quiet surprises that make up your Reading DNA.</p><button class="room-link" data-go="dna">Meet your reading self <span>→</span></button></div></article>
    <article class="reading-room room-streaks" id="room-streaks" data-room="streaks"><div class="room-illustration"><img src="assets/slices/stickers/open-book-stack.webp" alt="An open book nestled among a stack of books and leaves" width="300" height="165" loading="lazy"><div class="growing-ivy" aria-hidden="true">${Array.from({length:7},(_,i)=>`<img src="${art}leaf-sprig.webp" alt="" style="--leaf:${i}" width="63" height="77">`).join('')}</div></div><div class="room-copy"><span class="section-kicker">02 / THE EVERYDAY ROOM</span><h3>A little reading.<br>A lovely ritual.</h3><p>Ten quiet minutes, a favourite chair, one more page. Make room for the stories that make your days feel richer.</p><button class="room-link" data-go="streaks">Find your reading rhythm <span>→</span></button></div></article>
    <article class="reading-room room-clubs" id="room-clubs" data-room="clubs"><div class="room-illustration"><img src="assets/slices/dna/globe-book.webp" alt="An open book and a vintage globe surrounded by flowers" width="330" height="175" loading="lazy"></div><div class="room-copy"><span class="section-kicker">03 / THE COMMON ROOM</span><h3>Good books.<br>Better company.</h3><p>There’s a special kind of friendship in loving the same story. Find a reading circle near you and pull up a chair.</p><button class="room-link" data-go="clubs">Find your people <span>→</span></button></div></article>
  </section><footer class="library-footer"><div class="footer-lantern" aria-hidden="true"></div><span class="section-kicker">BOOKSPHERE</span><p>There’s always a place for you<br>between the pages.</p><button class="room-link" data-go="explore">Your next chapter awaits →</button><small>Made for the love of reading.</small></footer>`;

  function mount({ quotes, onQuote }) {
    teardown();
    const hero = document.querySelector('.hero');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const abort = new AbortController();
    const options = { signal:abort.signal, passive:true };
    const timeouts = new Set();
    const later = (fn, ms) => { const id=setTimeout(()=>{timeouts.delete(id);fn()},ms);timeouts.add(id);return id; };
    let frame = 0, quoteIndex = 0, active = true, quoteTimer, napTimer;
    let introPlayed = false;
    try { introPlayed=sessionStorage.getItem('bs-hero-intro')==='seen';sessionStorage.setItem('bs-hero-intro','seen'); } catch {}
    if (!reduced.matches && !introPlayed) { hero.classList.add('intro'); later(()=>hero.classList.remove('intro'),1900); }
    if (introPlayed) hero.classList.add('revisit');
    const updateTime = () => { const h=new Date().getHours();hero.dataset.time=h>=19||h<6?'night':h>=17||h<8?'dusk':'day'; };
    updateTime();
    const timeTimer = setInterval(updateTime,60000);
    const dots=hero.querySelector('.dots');
    dots.innerHTML=quotes.map((_,i)=>`<button type="button" aria-label="Quote ${i+1}" data-quote="${i}"></button>`).join('');
    const showQuote = i => { quoteIndex=i;const q=hero.querySelector('.quote');q.replaceChildren();const text=document.createElement('p');text.textContent=`“${quotes[i][0]}”`;const author=document.createElement('cite');author.textContent=`— ${quotes[i][1]}`;q.append(text,author);dots.querySelectorAll('button').forEach((d,j)=>{d.classList.toggle('on',j===i);d.setAttribute('aria-pressed',String(j===i))}); };
    showQuote(0);
    dots.addEventListener('click',e=>{const d=e.target.closest('[data-quote]');if(d)showQuote(+d.dataset.quote)}, {signal:abort.signal});
    onQuote(showQuote);
    if(!reduced.matches) quoteTimer=setInterval(()=>{if(active&&!document.hidden)showQuote((quoteIndex+1)%quotes.length)},6500);
    if(!reduced.matches) {
      const flies=hero.querySelector('.fireflies');
      flies.innerHTML=Array.from({length:12},(_,i)=>`<i style="--x:${i*7+6}%;--y:${20+i*13%65}%;--delay:${-i*.7}s;--duration:${4+i%4}s"></i>`).join('');
    }
    const resetParallax=()=>{hero.style.setProperty('--mx','0');hero.style.setProperty('--my','0')};
    const point=(x,y)=>{if(reduced.matches||!active)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{hero.style.setProperty('--mx',x.toFixed(3));hero.style.setProperty('--my',y.toFixed(3))})};
    hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();point((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1)},options);
    hero.addEventListener('pointerleave',resetParallax,options);
    // No permission prompt: tilt is used only on platforms where it is already
    // available. Pointer parallax remains the fallback.
    if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission!=='function') window.addEventListener('deviceorientation',e=>{if(e.gamma!=null)point(Math.max(-1,Math.min(1,e.gamma/25)),Math.max(-1,Math.min(1,((e.beta||45)-45)/25)))},options);
    const nav=document.querySelector('.nav');
    const scroll=()=>nav.classList.toggle('scrolled',scrollY>40);
    window.addEventListener('scroll',scroll,options);scroll();
    hero.querySelector('.scroll-cue').addEventListener('click',e=>{e.preventDefault();document.querySelector('#rooms').scrollIntoView({behavior:reduced.matches?'instant':'smooth'})},{signal:abort.signal});
    document.querySelectorAll('.room-progress a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'})},{signal:abort.signal}));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.target===hero){active=entry.isIntersecting;hero.classList.toggle('motion-paused',!active||document.hidden);return;}
      if(entry.isIntersecting){entry.target.classList.add('revealed');const key=entry.target.dataset.room;document.querySelectorAll('.room-progress a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#room-${key}`));}
    }),{threshold:.18});
    observer.observe(hero);
    document.querySelectorAll('.reading-room').forEach(el=>observer.observe(el));
    document.addEventListener('visibilitychange',()=>hero.classList.toggle('motion-paused',document.hidden||!active),options);
    const cat=hero.querySelector('.mochi');
    cat.dataset.state='nap';
    cat.addEventListener('click',()=>{
      cat.dataset.state='awake';cat.setAttribute('aria-label','Mochi sends you a heart');
      const heart=document.createElement('span');heart.className='cat-heart';heart.textContent='♥';heart.setAttribute('aria-hidden','true');cat.appendChild(heart);later(()=>heart.remove(),2200);
      clearTimeout(napTimer);napTimer=later(()=>{cat.dataset.state='nap';cat.setAttribute('aria-label','Say hello to Mochi the sleeping cat')},3600);
    },{signal:abort.signal});
    teardown=()=>{abort.abort();observer.disconnect();clearInterval(quoteTimer);clearInterval(timeTimer);timeouts.forEach(clearTimeout);cancelAnimationFrame(frame);nav.classList.remove('scrolled');resetParallax();};
    return teardown;
  }
  return {render,mount,cleanup:()=>teardown()};
})();
