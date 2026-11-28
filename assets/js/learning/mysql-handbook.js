
/* MySQL / MariaDB Handbook — dynamic Markdown pages, additive to MLCC */
(() => {
  "use strict";
  const NAV_URL = "content/mysql/navigation.json";
  const CONTENT_ROOT = "content/mysql/";
  const $ = (s, r=document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let nav = null, expanded = new Set(), filter = "", currentTopic = null;
  const allTopics = () => nav ? nav.modules.flatMap(m => m.topics.map(t => ({...t,module:m}))) : [];
  function safeUrl(url) {
    const raw = String(url || "").trim();
    if (/^(https?:|mailto:|#)/i.test(raw)) return raw;
    if (/^images\//.test(raw)) return CONTENT_ROOT + raw;
    if (/^[\w./-]+\.(?:png|jpe?g|gif|svg|webp|pdf|xlsx?|docx?|pptx?|sql|sh|ps1|zip|csv|txt|log)$/i.test(raw)) return CONTENT_ROOT + raw;
    return "#";
  }
  function inline(text) {
    let s=esc(text);
    s=s.replace(/`([^`]+)`/g,"<code>$1</code>");
    s=s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,alt,url)=>`<img loading="lazy" alt="${alt}" src="${esc(safeUrl(url))}">`);
    s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>`<a href="${esc(safeUrl(url))}" target="_blank" rel="noopener">${label}</a>`);
    s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
    return s;
  }
  function renderMarkdown(md) {
    const lines=String(md||"").replace(/\r/g,"").split("\n");
    let out="", i=0, inCode=false, code=[], list=null, table=[];
    const closeList=()=>{if(list){out+=`</${list}>`;list=null;}};
    while(i<lines.length){
      const line=lines[i];
      if(/^```/.test(line)){closeList();if(!inCode){inCode=true;code=[];}else{out+=`<pre><code>${esc(code.join("\n"))}</code></pre>`;inCode=false;}i++;continue;}
      if(inCode){code.push(line);i++;continue;}
      if(/^\s*\|.*\|\s*$/.test(line)){
        closeList();table=[];
        while(i<lines.length && /^\s*\|.*\|\s*$/.test(lines[i])){table.push(lines[i]);i++;}
        const cells=row=>row.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(c=>c.trim());
        const rows=table.filter(r=>!(/^\|?[\s:|-]+\|?$/.test(r.trim())));
        if(rows.length){const head=cells(rows[0]);out+="<table><thead><tr>"+head.map(c=>`<th>${inline(c)}</th>`).join("")+"</tr></thead><tbody>"+rows.slice(1).map(r=>"<tr>"+cells(r).map(c=>`<td>${inline(c)}</td>`).join("")+"</tr>").join("")+"</tbody></table>";}
        continue;
      }
      if(!line.trim()){closeList();i++;continue;}
      const h=line.match(/^(#{1,4})\s+(.+)$/);if(h){closeList();const n=h[1].length;out+=`<h${n}>${inline(h[2])}</h${n}>`;i++;continue;}
      if(/^---+$/.test(line.trim())){closeList();out+="<hr>";i++;continue;}
      if(/^>\s?/.test(line)){closeList();out+=`<blockquote>${inline(line.replace(/^>\s?/,""))}</blockquote>`;i++;continue;}
      const ul=line.match(/^\s*[-*+]\s+(.+)$/),ol=line.match(/^\s*\d+[.)]\s+(.+)$/);
      if(ul||ol){const type=ul?"ul":"ol";if(list!==type){closeList();list=type;out+=`<${type}>`;}out+=`<li>${inline((ul||ol)[1])}</li>`;i++;continue;}
      closeList();
      if(/^<https?:\/\//.test(line)){out+=`<p>${inline(line)}</p>`;i++;continue;}
      let para=[line.trim()];i++;
      while(i<lines.length && lines[i].trim() && !/^(#{1,4}\s|```|---+$|>\s?|[-*+]\s+|\d+[.)]\s+|\s*\|.*\|\s*$)/.test(lines[i])){para.push(lines[i].trim());i++;}
      out+=`<p>${para.map(inline).join("<br>")}</p>`;
    }
    if(inCode)out+=`<pre><code>${esc(code.join("\n"))}</code></pre>`;
    closeList();
    return out;
  }
  function setBodyActive(on){document.body.classList.toggle("mysql-handbook-active",on);}
  function shell() {
    const dashboard=$("#dashboardView"),hero=$("#heroBanner"),view=$("#contentView");
    dashboard?.classList.add("hidden");hero?.classList.add("hidden");view?.classList.remove("hidden");
    view.classList.add("mysql-view");
    view.innerHTML=`<div class="mysql-handbook">
      <aside class="mysql-sidebar">
        <div class="mysql-side-head">
          <div class="mysql-kicker">MySQL / MariaDB Knowledge Base</div>
          <h2>Contents</h2>
          <div class="mysql-side-meta" id="mysqlCount"></div>
          <label class="mysql-nav-search"><span>⌕</span><input id="mysqlFilter" type="search" placeholder="Search topics…"></label>
        </div>
        <nav class="mysql-nav" id="mysqlNav" aria-label="MySQL handbook contents"></nav>
      </aside>
      <main class="mysql-main">
        <div class="mysql-doc-top"><span id="mysqlBreadcrumb">MYSQL / HANDBOOK</span>
          <div class="mysql-doc-actions">
            <a href="https://github.com/V-SunilKumar/MyLearningCommandCenter" target="_blank" rel="noopener">GitHub source ↗</a>
            <button type="button" id="mysqlBack">← Command Center</button>
          </div>
        </div>
        <div class="mysql-doc-scroll" id="mysqlDocScroll"><article class="mysql-doc" id="mysqlDoc"><div class="mysql-loading">Loading MySQL handbook…</div></article></div>
      </main>
    </div>`;
    $("#mysqlBack").onclick=()=>{setBodyActive(false);location.hash="dashboard";if(window.navigate)window.navigate("dashboard");};
    $("#mysqlFilter").addEventListener("input",e=>{filter=e.target.value.trim().toLowerCase();renderNav();});
  }
  function renderNav(){
    if(!nav)return;
    const topics=allTopics();
    $("#mysqlCount").textContent=`${nav.modules.length} domains · ${topics.length} topic pages`;
    $("#mysqlNav").innerHTML=nav.modules.map(m=>{
      const matched=m.topics.filter(t=>!filter||m.title.toLowerCase().includes(filter)||t.title.toLowerCase().includes(filter));
      if(filter&&!matched.length)return "";
      const open=filter||expanded.has(m.id);
      return `<section class="mysql-module">
        <button class="mysql-module-toggle" data-mysql-module="${esc(m.id)}" aria-expanded="${!!open}">
          <span class="mysql-chevron">›</span><span class="mysql-module-title">${esc(m.title)}</span><span class="mysql-module-count">${m.topics.length}</span>
        </button>
        ${open?`<div class="mysql-topic-list">${matched.map(t=>`<button class="mysql-topic-link ${currentTopic===t.id?"active":""}" data-mysql-topic="${esc(t.id)}">${esc(t.title)}</button>`).join("")}</div>`:""}
      </section>`;
    }).join("");
    document.querySelectorAll("[data-mysql-module]").forEach(b=>b.onclick=()=>{const id=b.dataset.mysqlModule;expanded.has(id)?expanded.delete(id):expanded.add(id);renderNav();});
    document.querySelectorAll("[data-mysql-topic]").forEach(b=>b.onclick=()=>openTopic(b.dataset.mysqlTopic));
  }
  async function loadPage(file) {
    const r=await fetch(CONTENT_ROOT+file,{cache:"no-cache"});
    if(!r.ok)throw new Error(`Could not load ${file} (${r.status})`);
    return r.text();
  }
  function editUrl(file) {
    return `https://github.dev/V-SunilKumar/MyLearningCommandCenter/blob/main/content/mysql/${file}`;
  }
  async function openTopic(id) {
    const item=allTopics().find(t=>t.id===id);
    if(!item)return;
    currentTopic=id;renderNav();
    $("#mysqlBreadcrumb").textContent=`MYSQL / ${item.module.title.toUpperCase()} / ${item.title.toUpperCase()}`;
    const doc=$("#mysqlDoc");doc.innerHTML='<div class="mysql-loading">Loading Markdown page…</div>';
    if(location.hash!==`#mysql/${id}`)history.replaceState(null,"",`#mysql/${id}`);
    try{
      const md=await loadPage(item.file);
      doc.innerHTML=`<div class="mysql-source-note">PERSONAL TECHNICAL HANDBOOK · SOURCE PAGES ${item.sourcePages.join(", ")}</div>${renderMarkdown(md)}`;
      doc.querySelectorAll("pre").forEach(pre=>{
        const btn=document.createElement("button");btn.type="button";btn.textContent="Copy";
        btn.style.cssText="float:right;margin:0 0 8px 8px;padding:4px 8px;border:1px solid #49617b;border-radius:5px;background:#142b40;color:#dbeafa;cursor:pointer;font-size:10px";
        btn.onclick=async()=>{try{await navigator.clipboard.writeText(pre.innerText);btn.textContent="Copied";setTimeout(()=>btn.textContent="Copy",1200);}catch{btn.textContent="Select and copy";}};
        pre.prepend(btn);
      });
      const moduleFolder=item.file.split("/")[0];
      const edit=document.createElement("a");edit.href=editUrl(item.file);edit.target="_blank";edit.rel="noopener";
      edit.textContent="Edit this Markdown in github.dev ↗";edit.className="mysql-edit-link";
      const p=document.createElement("p");p.style.cssText="margin-top:32px;padding-top:16px;border-top:1px solid #e7edf3;font-size:12px";p.append(edit);doc.append(p);
      $("#mysqlDocScroll").scrollTop=0;
    }catch(err){doc.innerHTML=`<div class="mysql-loading"><strong>Unable to load this topic.</strong><p>${esc(err.message)}</p></div>`;}
  }
  async function openOverview(){
    currentTopic=null;renderNav();
    $("#mysqlBreadcrumb").textContent="MYSQL / HANDBOOK";
    try{const md=await loadPage(nav.overview.file);$("#mysqlDoc").innerHTML=renderMarkdown(md);}
    catch(e){$("#mysqlDoc").innerHTML=`<p>${esc(e.message)}</p>`;}
    $("#mysqlDocScroll").scrollTop=0;
  }
  async function openMysql() {
    setBodyActive(true);shell();
    try{
      if(!nav){const r=await fetch(NAV_URL,{cache:"no-cache"});if(!r.ok)throw new Error(`Could not load navigation (${r.status})`);nav=await r.json();}
      expanded=new Set([nav.modules[0]?.id].filter(Boolean));
      renderNav();
      const route=location.hash.startsWith("#mysql/")?location.hash.slice(7):"";
      if(route&&allTopics().some(t=>t.id===route))await openTopic(route);else await openOverview();
      if(location.hash!=="#roadmap/mysql"&&!location.hash.startsWith("#mysql/"))history.replaceState(null,"","#roadmap/mysql");
    }catch(e){$("#mysqlDoc").innerHTML=`<div class="mysql-loading"><strong>MySQL handbook could not be loaded.</strong><p>${esc(e.message)}</p><p>Check that content/mysql/navigation.json and the Markdown files are published.</p></div>`;}
  }
  const priorOpen=window.openTechnology;
  window.openTechnology=function(id){if(id==="mysql"){openMysql();return;}if(typeof priorOpen==="function")return priorOpen(id);};
  window.addEventListener("hashchange",()=>{if(location.hash==="#roadmap/mysql"||location.hash.startsWith("#mysql/"))openMysql();else if(document.body.classList.contains("mysql-handbook-active"))setBodyActive(false);});
  window.MySQLHandbook={open:openMysql,getNavigation:()=>nav};
  if(location.hash==="#roadmap/mysql"||location.hash.startsWith("#mysql/"))openMysql();
})();
