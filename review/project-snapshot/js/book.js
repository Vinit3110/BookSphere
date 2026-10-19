/* One physical spread at a time; page turns never change the document height. */
window.BookSphereBook = {mount(root, signal) {
  const pages=[...root.querySelectorAll('.reading-room,.library-footer')];
  const tabs=[...root.querySelectorAll('.room-progress a')];
  const status=root.querySelector('.book-status');
  let index=0,busy=false,timer,wheelTime=0,touch,fold;
  const load=page=>{
    page.querySelectorAll('[data-srcset]').forEach(el=>{el.srcset=el.dataset.srcset;el.removeAttribute('data-srcset')});
    page.querySelectorAll('[data-src]').forEach(el=>{el.src=el.dataset.src;el.removeAttribute('data-src')});
    page.classList.add('revealed');
  };
  function update(){
    pages.forEach((page,i)=>{page.inert=i!==index;page.setAttribute('aria-hidden',String(i!==index));page.classList.toggle('current-page',i===index)});
    tabs.forEach((tab,i)=>{tab.classList.toggle('active',i===index);if(i===index)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current')});
    root.querySelector('[data-page-step="-1"]').disabled=index===0;
    root.querySelector('[data-page-step="1"]').disabled=index===pages.length-1;
    status.textContent=`${index+1} / ${pages.length} · ${index===3?'The next chapter':tabs[index].textContent.trim()}`;
    root.dataset.pageIndex=index;
  }
  function turn(next){
    if(busy||next<0||next>=pages.length||next===index)return;
    const outgoing=pages[index],incoming=pages[next],forward=next>index;
    load(incoming);incoming.scrollTop=0;
    const focused=outgoing.contains(document.activeElement);
    const still=!matchMedia('(prefers-reduced-motion:reduce)').matches;
    // The two faces are visual-only snapshots. The real incoming spread stays
    // underneath; its controls are the only interactive content after the turn.
    if(still){
      fold=document.createElement('div');fold.className=`book-fold ${forward?'fold-forward':'fold-back'}`;
      fold.setAttribute('aria-hidden','true');fold.inert=true;
      fold.style.setProperty('--spread-width',`${root.clientWidth}px`);
      fold.style.setProperty('--spread-height',`${root.clientHeight}px`);
      const snapshot=(page,side)=>{
        const copy=page.cloneNode(true);copy.classList.remove('current-page');copy.classList.add('fold-snapshot');
        copy.removeAttribute('aria-hidden');copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.removeAttribute('id');
        side.append(copy);return copy;
      };
      const resting=document.createElement('div');resting.className='fold-resting';
      const leaf=document.createElement('div');leaf.className='fold-leaf';
      const front=document.createElement('div');front.className='fold-face fold-front';
      const back=document.createElement('div');back.className='fold-face fold-reverse';
      const copies=[[snapshot(outgoing,resting),outgoing.scrollTop],[snapshot(outgoing,front),outgoing.scrollTop],[snapshot(incoming,back),0]];
      const hinge=document.createElement('i');hinge.className='fold-hinge';
      leaf.append(front,back,hinge);fold.append(resting,leaf);root.append(fold);
      copies.forEach(([copy,top])=>copy.scrollTop=top);
    }
    index=next;update();
    if(focused)root.querySelector('.book-status').focus({preventScroll:true});
    if(!still)return;
    busy=true;root.classList.add('book-turning');
    timer=setTimeout(()=>{fold?.remove();fold=null;root.classList.remove('book-turning');busy=false},850);
  }
  root.addEventListener('click',e=>{
    const step=e.target.closest('[data-page-step]');if(step)turn(index+Number(step.dataset.pageStep));
    const tab=e.target.closest('.room-progress a');if(tab){e.preventDefault();turn(tabs.indexOf(tab))}
  },{signal});
  document.addEventListener('keydown',e=>{
    const rect=root.getBoundingClientRect();
    if(!root.contains(e.target)&&!(e.target===document.body&&rect.top<=2&&rect.bottom>=innerHeight-2))return;
    if(e.target.closest('input,select,textarea')||e.altKey||e.ctrlKey||e.metaKey)return;
    if(['ArrowRight','PageDown','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();turn(index+(['ArrowRight','PageDown'].includes(e.key)?1:-1))}
  },{signal});
  root.addEventListener('wheel',e=>{
    // Only take over a deliberate gesture when the spread fills the viewport.
    const rect=root.getBoundingClientRect(),page=pages[index],delta=e.deltaY;
    if(rect.top>2||rect.bottom<innerHeight-2||Math.abs(delta)<12||e.ctrlKey)return;
    if(page.scrollHeight>page.clientHeight+2&&((delta>0&&page.scrollTop+page.clientHeight<page.scrollHeight-2)||(delta<0&&page.scrollTop>2)))return;
    if((index===0&&delta<0)||(index===pages.length-1&&delta>0))return;
    e.preventDefault();const now=performance.now();if(!busy&&now-wheelTime>1000){wheelTime=now;turn(index+(delta>0?1:-1))}
  },{signal,passive:false});
  root.addEventListener('touchstart',e=>{touch={x:e.touches[0].clientX,y:e.touches[0].clientY}},{signal,passive:true});
  root.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.4)turn(index+(dx<0?1:-1));touch=null},{signal,passive:true});
  signal.addEventListener('abort',()=>{clearTimeout(timer);fold?.remove()},{once:true});
  pages.forEach((page,i)=>{page.style.setProperty('--page-order',i);page.inert=i!==0});load(pages[0]);update();
  // Prefetch the other leaves only when the book approaches the viewport.
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){pages.forEach(load);observer.disconnect()}},{rootMargin:'200px'});observer.observe(root);signal.addEventListener('abort',()=>observer.disconnect(),{once:true});
}};
