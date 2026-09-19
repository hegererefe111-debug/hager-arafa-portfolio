const root=document.documentElement;
const progress=document.getElementById('progress');
const menu=document.getElementById('menu');
const nav=document.querySelector('.nav');

// Theme preference
const saved=localStorage.getItem('hager-theme');
if(saved) root.dataset.theme=saved;
const themeBtn=document.createElement('button');
themeBtn.className='theme-fab';
themeBtn.setAttribute('aria-label','Toggle dark mode');
themeBtn.textContent='◐';
document.body.appendChild(themeBtn);
themeBtn.addEventListener('click',()=>{
  const dark=root.dataset.theme!=='dark';
  root.dataset.theme=dark?'dark':'';
  if(!dark) delete root.dataset.theme;
  localStorage.setItem('hager-theme',dark?'dark':'light');
});

menu?.addEventListener('click',()=>nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const onScroll=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
};
window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Add a compact dark-mode control style after creation.
const s=document.createElement('style');
s.textContent='.theme-fab{position:fixed;right:22px;bottom:22px;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--paper);color:var(--ink);z-index:95;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.08);font-size:18px}.theme-fab:hover{transform:translateY(-2px)}';
document.head.appendChild(s);
