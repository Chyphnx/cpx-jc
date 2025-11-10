function highlight(text,q){if(!q)return text;const re=new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"ig");return text.replace(re,'<span class="hl">$1</span>')}
async function load(){
  const r=await fetch("metadata.json?_="+Date.now());
  const data=await r.json();
  const g=document.querySelector("#grid"),s=document.querySelector("#search"),dd=document.querySelector("#issuer"),t=document.querySelector("#total"),u=document.querySelector("#updated");
  u&&(u.textContent=data.generated||"—");
  const issuers=[...new Set(data.certs.map(c=>c.issuer))].sort();
  dd.innerHTML='<option value="">All Issuers</option>'+issuers.map(i=>`<option>${i}</option>`).join("");
  function render(){
    const q=(s.value||"").trim().toLowerCase(),ch=dd.value;
    const f=data.certs.filter(c=>(!ch||c.issuer===ch)&&(!q||c.title.toLowerCase().includes(q)||c.issuer.toLowerCase().includes(q)));
    t.textContent=f.length+" total";
    g.innerHTML=f.map(c=>`<article class="card"><div class="thumb" data-img="${c.path}"><img src="${c.path}" alt="${c.title}" loading="lazy"></div><div class="meta"><h3 class="title">${highlight(c.title,(s.value||""))}</h3><p class="issuer">${highlight(c.issuer,(s.value||""))}</p><div class="tags">${c.date?`<span class="tag">${c.date}</span>`:""}${c.url?`<a class="tag" href="${c.url}" target="_blank" rel="noopener">verify</a>`:""}</div></div></article>`).join("");
  }
  dd.addEventListener("change",render); s.addEventListener("input",render); render();
  const lb=document.querySelector("#lightbox"),img=lb.querySelector("img");
  g.addEventListener("click",e=>{const el=e.target.closest(".thumb"); if(!el) return; img.src=el.dataset.img; lb.classList.add("open")});
  document.querySelector("#close")?.addEventListener("click",()=>lb.classList.remove("open"));
  lb.addEventListener("click",e=>{if(e.target===lb)lb.classList.remove("open")});
  document.querySelector("#toTop")?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}
document.addEventListener("DOMContentLoaded",load);
