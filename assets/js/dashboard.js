const TECHNOLOGIES = [
  {id:'oracle',name:'Oracle Database',group:'database',logo:'oracle',logoFile:'oracle-wordmark.svg',color:'#F80000',completed:0,total:850,pct:0,wordmark:true,fill:'#00e5a0'},
  {id:'postgresql',name:'PostgreSQL',group:'database',logo:'postgresql',logoFile:'postgresql.svg',color:'#4169E1',completed:0,total:0,pct:0,fill:'#078ff0'},
  {id:'mysql',name:'MySQL',group:'database',logo:'mysql',logoFile:'mysql-wordmark.svg',color:'#F29111',completed:0,total:0,pct:0,wordmark:true,fill:'#ffad08'},
  {id:'sqlserver',name:'Microsoft SQL Server',group:'database',logo:'microsoftsqlserver',logoFile:'sqlserver-wordmark.svg',wordmark:true,color:'#CC2927',completed:0,total:0,pct:0,fill:'#c02bea'},
  {id:'mongodb',name:'MongoDB',group:'database',logo:'mongodb',logoFile:'mongodb.svg',color:'#00ED64',completed:0,total:0,pct:0,wordmark:true,fill:'#00d99a'},
  {id:'aws',name:'AWS',group:'cloud',logo:'amazonaws',logoFile:'aws-wordmark.svg',color:'#FF9900',completed:0,total:0,pct:0,wordmark:true,fill:'#ffb000'},
  {id:'azure',name:'Microsoft Azure',group:'cloud',logo:'microsoftazure',logoFile:'azure-mark.svg',color:'#0078D4',completed:0,total:0,pct:0,fill:'#078ff0'},
  {id:'gcp',name:'Google Cloud',group:'cloud',logo:'googlecloud',logoFile:'googlecloud.svg',color:'#4285F4',completed:0,total:0,pct:0,fill:'#ffd21a'},
  {id:'oci',name:'Oracle Cloud Infrastructure',group:'cloud',logo:'oraclecloud',logoFile:'oracle-cloud-mark.svg',color:'#F80000',completed:0,total:0,pct:0,wordmark:true,fill:'#c02bea'},
  {id:'docker',name:'Docker',group:'cloud',logo:'docker',logoFile:'docker.svg',color:'#2496ED',completed:0,total:0,pct:0,fill:'#078ff0'},
  {id:'kubernetes',name:'Kubernetes',group:'cloud',logo:'kubernetes',logoFile:'kubernetes.svg',color:'#326CE5',completed:0,total:0,pct:0,fill:'#078ff0'},
  {id:'linux',name:'Linux',group:'tools',logo:'linux',logoFile:'linux.svg',color:'#FCC624',completed:0,total:0,pct:0,fill:'#e5d400'},
  {id:'shell',name:'Shell Scripting',group:'tools',logo:'gnubash',color:'#FFFFFF',completed:0,total:0,pct:0,fill:'#54c8f5'},
  {id:'powershell',name:'PowerShell',group:'tools',logo:'powershell',logoFile:'powershell-mark.svg',color:'#5391FE',completed:0,total:0,pct:0,fill:'#54c8f5'},
  {id:'python',name:'Python',group:'tools',logo:'python',logoFile:'python-mark.svg',color:'#FFD43B',completed:0,total:0,pct:0,fill:'#e5d400'},
  {id:'git',name:'Git',group:'tools',logo:'git',logoFile:'git.svg',color:'#F05032',completed:0,total:0,pct:0,fill:'#ff4b3e'},
  {id:'terraform',name:'Terraform',group:'tools',logo:'terraform',logoFile:'terraform.svg',color:'#844FBA',completed:0,total:0,pct:0,fill:'#c02bea'},
  {id:'ansible',name:'Ansible',group:'tools',logo:'ansible',logoFile:'ansible.svg',color:'#FFFFFF',completed:0,total:0,pct:0,fill:'#9ec5e4'},
  {id:'jenkins',name:'Jenkins',group:'tools',logo:'jenkins',logoFile:'jenkins.svg',color:'#D24939',completed:0,total:0,pct:0,fill:'#ff4b3e'}
];
const DEFAULT_STATE = {technologies:TECHNOLOGIES.map(x=>({...x})),overall:{completed:0,learning:0,notStarted:850,total:850},activities:[]};
let state = loadState();
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loadState(){try{const saved=JSON.parse(localStorage.getItem('mlcc-dashboard-state-v5'));if(saved&&Array.isArray(saved.technologies)){const byId=new Map(saved.technologies.map(t=>[t.id,t]));return {...DEFAULT_STATE,...saved,technologies:DEFAULT_STATE.technologies.map(base=>({...base,...(byId.get(base.id)||{}),total:base.total,logoFile:base.logoFile,logoUrlOverride:base.logoUrlOverride,logoLabel:undefined}))};}}catch(e){}return structuredClone(DEFAULT_STATE)}
function saveState(){localStorage.setItem('mlcc-dashboard-state-v5',JSON.stringify(state));}
function logoUrl(t){
  if(t.logoUrlOverride) return t.logoUrlOverride;
  if(t.logoFile) return `assets/images/vendors/${t.logoFile}`;
  return `https://cdn.simpleicons.org/${t.logo}/${t.color.replace('#','')}`;
}
function cardMarkup(t){
  const pct=t.total?Math.round(t.completed/t.total*100):0;
  const fallback=(t.name||'').split(/\\s+/).map(x=>x[0]).join('').slice(0,4).toUpperCase();
  return `<button class="technology-card" style="--accent:${t.color};--progress:${pct}%;--fill:${t.fill||t.color}" data-tech="${t.id}" aria-label="Open ${esc(t.name)} roadmap">
    <span class="logo-box">
      <img class="vendor-logo" src="${logoUrl(t)}" alt="${esc(t.name)} logo" loading="eager" onerror="this.classList.add('logo-load-failed');this.nextElementSibling?.classList.add('show-fallback')">
      <span class="logo-fallback" aria-hidden="true">${esc(fallback)}</span>
    </span>
    <span class="progress-line"><span class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span class="progress-fill" style="--progress:${pct}%;--fill:${t.fill||t.color}"></span></span><span class="progress-value">${pct}%</span></span>
    <span class="topic-count">${t.completed} / ${t.total} topics</span>
  </button>`;
}
function renderCards(){for(const [group,id] of [['database','databaseCards'],['cloud','cloudCards'],['tools','toolCards']]){$('#'+id).innerHTML=state.technologies.filter(t=>t.group===group).map(cardMarkup).join('')}document.querySelectorAll('.technology-card').forEach(card=>card.addEventListener('click',()=>openTechnology(card.dataset.tech)));}
function renderProgress(){
  const totals=state.technologies.reduce((a,t)=>{a.total+=Number(t.total)||0;a.completed+=Number(t.completed)||0;return a;},{total:0,completed:0});
  const learning=state.technologies.reduce((n,t)=>n+(Number(t.learning)||0),0);
  const notStarted=Math.max(0,totals.total-totals.completed-learning);
  state.overall={completed:totals.completed,learning,notStarted,total:totals.total};
  const pct=totals.total?Math.round((totals.completed+learning*0.5)/totals.total*100):0;
  $('#overallPercent').textContent=pct+'%';
  $('#overallCount').textContent=`${totals.completed.toLocaleString()} / ${totals.total.toLocaleString()} topics`;
  $('#completedCount').textContent=totals.completed.toLocaleString();
  $('#learningCount').textContent=learning.toLocaleString();
  $('#notStartedCount').textContent=notStarted.toLocaleString();
  $('#overallDonut').style.background=`conic-gradient(#00e5a0 0 ${pct}%,#1b496b ${pct}% 100%)`;
}
function renderActivities(){const iconMap={aws:'<span style="font-weight:800;color:#ffad08">aws</span>'};$('#recentActivity').innerHTML=state.activities.map(a=>`<div class="activity-item"><span class="activity-icon" style="color:${a.color||'#fff'}">${iconMap[a.icon]||esc(a.icon)}</span><div><strong>${esc(a.title)}</strong><small>${esc(a.time)}</small></div></div>`).join('')}
function renderAll(){renderCards();renderProgress();renderActivities();}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
function setActive(page){document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===page));}
function showPage(title,html,page=''){ $('#dashboardView').classList.add('hidden');$('#heroBanner').classList.add('hidden');const v=$('#contentView');v.classList.remove('hidden');v.innerHTML=`<div class="content-card"><button class="action-button" id="backDashboard">← Dashboard</button><h2>${title}</h2>${html}</div>`;$('#backDashboard').addEventListener('click',()=>navigate('dashboard'));setActive(page);}
function navigate(page){location.hash=page==='dashboard'?'dashboard':page; if(page==='dashboard'){ $('#contentView').classList.add('hidden');$('#dashboardView').classList.remove('hidden');$('#heroBanner').classList.remove('hidden');setActive('dashboard');return;} if(page==='roadmaps'){showPage('Technology Roadmaps',`<p>Select a technology to open its dedicated roadmap. The detailed curriculum and objective hierarchy will be added in the roadmap implementation phase.</p><div class="roadmap-list">${state.technologies.map(t=>`<button class="roadmap-item" data-tech="${t.id}">${esc(t.name)}<small>${t.completed} / ${t.total} topics in dashboard preview</small></button>`).join('')}</div>`,'roadmaps');document.querySelectorAll('[data-tech]').forEach(b=>b.addEventListener('click',()=>openTechnology(b.dataset.tech)));return;} if(page==='progress'){showProgressEditor();return;}const descriptions={notes:'Personal notes, knowledge notes, KT notes and troubleshooting notes will be connected to learning objectives.',bookmarks:'Bookmarked objectives, commands, labs, notes and interview questions will be collected here.',search:'Search will eventually cover technologies, modules, topics, learning objectives, commands, notes, labs and interview content.',labs:'The Lab Tracker will record lab prerequisites, execution steps, evidence, validation, cleanup and completion.',interview:'Interview preparation will be linked to the relevant technology roadmap and learning objective.',resources:'Learning resources and official documentation will be organized by technology.',settings:'Dashboard preferences, profile settings, backup and restore will be managed here.'};showPage(page==='notes'?'My Notes':page==='bookmarks'?'My Bookmarks':page==='search'?'Search':page==='labs'?'Lab Tracker':page==='interview'?'Interview Preparation':page==='resources'?'Learning Resources':'Settings',`<p>${descriptions[page]||'This workspace will be implemented in a later phase.'}</p>${page==='settings'?'<button class="action-button" id="exportData">Export dashboard data (JSON)</button> <button class="action-button" id="resetDemo">Reset demo values</button>':''}`,page);if(page==='settings'){$('#exportData').onclick=exportData;$('#resetDemo').onclick=()=>{if(confirm('Reset dashboard demo values? This will replace locally saved dashboard values.')){state=structuredClone(DEFAULT_STATE);saveState();renderAll();toast('Dashboard demo values restored.');navigate('dashboard')}}}}
function openTechnology(id){const t=state.technologies.find(x=>x.id===id);if(!t)return;if(location.hash!==`#roadmap/${id}`)history.replaceState(null,'',`#roadmap/${id}`);showPage(`${esc(t.name)} Roadmap`,`<p class="eyebrow">TECHNOLOGY LEARNING PATH</p><p>This is the direct destination for the <strong>${esc(t.name)}</strong> dashboard card.</p><p>The roadmap will be designed as a deep, technology-specific curriculum using the agreed progression: first principles → implementation → troubleshooting → production reasoning → professional competency.</p><p>Each module will contain topics and stable-ID learning objectives. Each objective will open its own knowledge page with explanations, diagrams, commands, hands-on labs, production scenarios and interview preparation.</p><p><strong>Next implementation:</strong> build and approve the detailed ${esc(t.name)} roadmap before connecting its learning objectives and progress calculations.</p>`,'roadmaps');}
function showProgressEditor(){const rows=state.technologies.map(t=>`<tr><td>${esc(t.name)}</td><td><input type="number" min="0" max="99999" data-field="completed" data-id="${t.id}" value="${t.completed}"></td><td><input type="number" min="0" max="99999" data-field="total" data-id="${t.id}" value="${t.total}"></td><td>${t.total?Math.round(t.completed/t.total*100):0}%</td></tr>`).join('');showPage('Progress Management',`<p>Edit the demo topic counts below. These values are saved in this browser. The final roadmap implementation will calculate progress from real learning objectives automatically.</p><table class="manage-table"><thead><tr><th>Technology</th><th>Completed</th><th>Total topics</th><th>Progress</th></tr></thead><tbody>${rows}</tbody></table><button class="action-button" id="saveProgress">Save dashboard progress</button> <button class="action-button" id="exportProgress">Export backup</button>`,'progress');$('#saveProgress').onclick=()=>{document.querySelectorAll('[data-field]').forEach(input=>{const t=state.technologies.find(x=>x.id===input.dataset.id);if(t)t[input.dataset.field]=Math.max(0,Number(input.value)||0);if(t.completed>t.total)t.completed=t.total;});saveState();renderAll();toast('Progress saved in this browser.');showProgressEditor()};$('#exportProgress').onclick=exportData;}
function exportData(){const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='my-learning-command-center-backup.json';a.click();URL.revokeObjectURL(a.href);toast('Backup exported.');}
function filterSearch(value){const q=value.trim().toLowerCase();if(!q){document.querySelectorAll('.technology-card').forEach(c=>c.style.display='');return;}navigate('dashboard');document.querySelectorAll('.technology-card').forEach(c=>{const t=state.technologies.find(x=>x.id===c.dataset.tech);c.style.display=t.name.toLowerCase().includes(q)||t.id.includes(q)?'':'none'});}
document.querySelectorAll('.nav-link,[data-page]').forEach(a=>a.addEventListener('click',e=>{const page=a.dataset.page;if(!page)return;e.preventDefault();navigate(page)}));
$('#globalSearch').addEventListener('input',e=>filterSearch(e.target.value));$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.toLowerCase();const t=state.technologies.find(x=>x.name.toLowerCase().includes(q)||x.id.includes(q));if(t)openTechnology(t.id);else toast('No matching technology in this dashboard preview.')}});
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('mlcc-theme',document.body.classList.contains('light')?'light':'dark')});if(localStorage.getItem('mlcc-theme')==='light')document.body.classList.add('light');
$('#profileButton').addEventListener('click',()=>$('#profileMenu').classList.toggle('open'));document.addEventListener('click',e=>{if(!e.target.closest('.profile-wrap'))$('#profileMenu').classList.remove('open')});
$('#todayDate').textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(new Date());
window.addEventListener('hashchange',()=>{const p=location.hash.replace('#','')||'dashboard';if(p==='dashboard')navigate('dashboard');else if(p.startsWith('roadmap/'))openTechnology(p.split('/')[1]);else navigate(p)});
renderAll();

// V5 bridge: roadmap engines publish live leaf-topic progress here.
window.updateTechnologyProgress = function(id, completed, total, learning = 0) {
  const technology = state.technologies.find(item => item.id === id);
  if (!technology) return;
  technology.completed = Math.max(0, Number(completed) || 0);
  technology.total = Math.max(0, Number(total) || 0);
  technology.learning = Math.max(0, Number(learning) || 0);
  technology.pct = technology.total ? Math.round(technology.completed / technology.total * 100) : 0;
  if (technology.completed > technology.total) technology.completed = technology.total;
  renderCards();
  renderProgress();
  saveState();
};
