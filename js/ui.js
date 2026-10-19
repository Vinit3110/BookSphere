/* Shared painted controls. Existing router and direct form handlers run once. */
window.BookSphereUI = (() => {
  const watched=new Set();
  const sizes = new ResizeObserver(entries => entries.forEach(({target}) => {
    const css = getComputedStyle(target);
    target.style.setProperty('--scroll-travel', `${Math.max(0,target.clientWidth-(parseFloat(css.getPropertyValue('--scroll-cap'))||31)-(parseFloat(css.getPropertyValue('--scroll-end'))||29)+2)}px`);
  }));
  function mount(root=document) {
    root.querySelectorAll('.btn,.hero-secondary,.room-link,.links .l.on').forEach(control => {
      if(control.querySelector('.scroll-art'))return;
      control.classList.add('scroll-control');
      const label=document.createElement('span');label.className='scroll-label';
      while(control.firstChild)label.append(control.firstChild);
      const art=document.createElement('span');art.className='scroll-art';art.setAttribute('aria-hidden','true');
      art.innerHTML='<i class="scroll-paper"></i><i class="scroll-edge"></i><i class="scroll-roll"></i>';
      control.append(art,label);sizes.observe(control);watched.add(control);
    });
    root.querySelectorAll('[data-go],[data-act]').forEach(control=>{
      if(!['A','SPAN','DIV'].includes(control.tagName)||control.hasAttribute('href'))return;
      control.setAttribute('role','button');control.tabIndex=0;
    });
  }
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&!e.repeat&&e.target.matches('[role="button"]')){e.preventDefault();e.target.click()}
  });
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')e.target.closest('.scroll-control')?.classList.add('scroll-touch-open')},{passive:true});
  ['pointerup','pointercancel'].forEach(type=>document.addEventListener(type,()=>document.querySelectorAll('.scroll-touch-open').forEach(el=>el.classList.remove('scroll-touch-open')),{passive:true}));
  document.addEventListener('click',event=>{
    if(event.scrollForwarded||matchMedia('(prefers-reduced-motion:reduce)').matches||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const control=event.target.closest('.scroll-control');
    if(!control||control.disabled)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(control.classList.contains('scroll-closing'))return;
    control.classList.add('scroll-closing');
    setTimeout(()=>{
      if(control.isConnected){const click=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});Object.defineProperty(click,'scrollForwarded',{value:true});control.dispatchEvent(click);control.classList.remove('scroll-closing')}
    },190);
  },true);
  // Release detached nodes rather than retaining every previous route.
  const refresh=()=>{watched.forEach(el=>{if(!el.isConnected){sizes.unobserve(el);watched.delete(el)}});mount()};
  return {mount:refresh};
})();
