/* Oracle Roadmap Engine - additive integration for My Learning Command Center V1.7 */
(() => {
  "use strict";
  const DATA_URL = "data/roadmaps/oracle.json";
  const STATE_KEY = "mlcc.oracle.learning-state.v1";
  const $ = (s, r=document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let roadmap = null;
  let expandedModules = new Set();
  let expandedSubs = new Set();
  let filter = "";
  let currentItem = null;
  let roadmapScrollTop = 0;
  let learningState = loadState();

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(learningState));
  }
  function statusOf(item) { return learningState[item.id] || "not-started"; }
  function score(status) { return status === "learning" ? 0.5 : (status === "completed" || status === "revisit") ? 1 : 0; }
  function allItems() { return roadmap.modules.flatMap(m => m.submodules.flatMap(s => s.items)); }
  function progress(items) {
    if (!items.length) return 0;
    return Math.round(items.reduce((n, item) => n + score(statusOf(item)), 0) / items.length * 100);
  }
  function statusLabel(status) {
    return ({ "not-started":"Not started", learning:"Learning", completed:"Completed", revisit:"Revisit" })[status] || "Not started";
  }
  function setStatus(id, status) {
    if (status === "not-started") delete learningState[id];
    else learningState[id] = status;
    saveState();
  }
  function syncDashboardProgress() {
    if (!roadmap) return;
    const items = allItems();
    const completed = items.filter(item => statusOf(item) === "completed" || statusOf(item) === "revisit").length;
    const learning = items.filter(item => statusOf(item) === "learning").length;
    if (typeof window.updateTechnologyProgress === "function") {
      window.updateTechnologyProgress("oracle", completed, items.length, learning);
    }
  }
  function ensureStyles() {
    if ($("#oracle-roadmap-css") || $("#oracle-roadmap-style")) return;
    const link = document.createElement("link");
    link.id = "oracle-roadmap-style";
    link.rel = "stylesheet";
    link.href = "assets/css/learning/oracle-roadmap.css";
    document.head.appendChild(link);
  }
  function showShell(title, body, navigation = {}) {
    const dashboard = $("#dashboardView"), hero = $("#heroBanner"), view = $("#contentView");
    if (dashboard) dashboard.classList.add("hidden");
    if (hero) hero.classList.add("hidden");
    if (!view) return;
    view.classList.remove("hidden");
    const backLabel = navigation.label || "← Dashboard";
    const backId = navigation.id || "orBackDashboard";
    view.innerHTML = `<section class="content-card oracle-roadmap-shell">
      <div class="or-topline">
        <button class="action-button or-back" id="${backId}" type="button">${esc(backLabel)}</button>
        <span class="or-kicker">TECHNOLOGY LEARNING PATH</span>
      </div>
      <h2>${esc(title)}</h2>${body}</section>`;
    if (typeof navigation.onBack === "function") {
      $(`#${backId}`)?.addEventListener("click", navigation.onBack);
    } else {
      $(`#${backId}`)?.addEventListener("click", () => { location.hash = "dashboard"; if (typeof window.navigate === "function") window.navigate("dashboard"); });
    }
    if (typeof window.setActive === "function") window.setActive("roadmaps");
  }
  function moduleItems(module) { return module.submodules.flatMap(s => s.items); }
  function renderModule(module) {
    const items = moduleItems(module), pct = progress(items), open = expandedModules.has(module.number);
    const matchingSubs = module.submodules.map(sub => {
      const subOpen = expandedSubs.has(sub.number);
      const filtered = sub.items.filter(item => !filter || item.title.toLowerCase().includes(filter) || sub.title.toLowerCase().includes(filter) || module.title.toLowerCase().includes(filter));
      if (filter && !filtered.length && !module.title.toLowerCase().includes(filter)) return "";
      const subPct = progress(sub.items);
      return `<div class="or-submodule">
        <button class="or-sub-toggle" data-sub="${esc(sub.number)}" aria-expanded="${subOpen}">
          <span class="or-chevron ${subOpen ? "is-open" : ""}">›</span>
          <span class="or-sub-number">${esc(sub.number)}</span>
          <span class="or-sub-title">${esc(sub.title)}</span>
          <span class="or-sub-count">${sub.items.length} items</span>
          <span class="or-mini-progress"><i style="width:${subPct}%"></i></span>
        </button>
        ${subOpen ? `<div class="or-items">${filtered.map(item => renderItem(item)).join("") || `<p class="or-empty">No matching study items.</p>`}</div>` : ""}
      </div>`;
    }).join("");
    return `<article class="or-module">
      <button class="or-module-toggle" data-module="${esc(module.number)}" aria-expanded="${open}">
        <span class="or-chevron ${open ? "is-open" : ""}">›</span>
        <span class="or-module-number">${esc(module.number)}</span>
        <span class="or-module-title">${esc(module.title)}</span>
        <span class="or-module-meta">${items.filter(i => statusOf(i) === "completed").length}/${items.length} complete</span>
        <span class="or-module-progress"><i style="width:${pct}%"></i></span>
      </button>
      ${open ? `<div class="or-submodules">${matchingSubs}</div>` : ""}
    </article>`;
  }
  function renderItem(item) {
    const status = statusOf(item);
    const checked = status === "completed" || status === "revisit";
    return `<div class="or-study-item">
      <label class="or-completion-check" title="Mark this study topic complete">
        <input type="checkbox" data-complete="${esc(item.id)}" ${checked ? "checked" : ""} aria-label="Mark ${esc(item.title)} complete">
        <span class="or-checkmark" aria-hidden="true"></span>
      </label>
      <button class="or-study-open" data-item="${esc(item.id)}" type="button">
        <span class="or-file-icon">◇</span><span>${esc(item.title)}</span>
      </button>
      <button class="or-status or-status-${status}" data-status="${esc(item.id)}" type="button" title="Change learning status">${esc(statusLabel(status))}</button>
    </div>`;
  }
  function renderRoadmap() {
    if (!roadmap) return;
    const existingScroller = $("#orScrollRegion");
    const previousScrollTop = existingScroller ? existingScroller.scrollTop : roadmapScrollTop;
    const items = allItems(), pct = progress(items);
    const moduleHtml = roadmap.modules.map(renderModule).join("");
    const body = `<div class="or-toolbar">
      <label class="or-search"><span>⌕</span><input id="orFilter" type="search" placeholder="Filter modules, submodules or study items…" value="${esc(filter)}"></label>
      <div class="or-toolbar-actions">
        <button class="or-small-button" id="orExpandAll" type="button">Expand all</button>
        <button class="or-small-button" id="orCollapseAll" type="button">Collapse all</button>
        <button class="or-small-button" id="orExport" type="button">Export progress</button>
      </div>
    </div>
    <div class="or-scroll-region" id="orScrollRegion" tabindex="0" aria-label="Scrollable Oracle curriculum">
      <div class="or-module-list">${moduleHtml}</div>
    </div>
    <div class="or-footer-note">Oracle Database 19c is the primary lab baseline. Relevant 11g, 12c and newer-release differences will be identified in the study pages.</div>
    <button class="or-back-top" id="orBackTop" type="button" aria-label="Back to top">↑</button>`;
    showShell("Oracle Database Roadmap", body);
    bindRoadmapEvents();
    const newScroller = $("#orScrollRegion");
    if (newScroller) {
      newScroller.scrollTop = previousScrollTop;
      roadmapScrollTop = previousScrollTop;
    }
  }
  function bindRoadmapEvents() {
    $("#orFilter")?.addEventListener("input", e => {
      filter = e.target.value.trim().toLowerCase();
      if (filter) {
        roadmap.modules.forEach(m => {
          if (m.title.toLowerCase().includes(filter)) expandedModules.add(m.number);
          m.submodules.forEach(s => { if (s.title.toLowerCase().includes(filter) || s.items.some(i => i.title.toLowerCase().includes(filter))) { expandedModules.add(m.number); expandedSubs.add(s.number); } });
        });
      }
      renderRoadmap();
      const input = $("#orFilter"); if (input) { input.focus(); input.setSelectionRange(filter.length, filter.length); }
    });
    document.querySelectorAll("[data-module]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.module; expandedModules.has(id) ? expandedModules.delete(id) : expandedModules.add(id); renderRoadmap();
    }));
    document.querySelectorAll("[data-sub]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.sub; expandedSubs.has(id) ? expandedSubs.delete(id) : expandedSubs.add(id); renderRoadmap();
    }));
    document.querySelectorAll("[data-item]").forEach(b => b.addEventListener("click", () => {
      const item = allItems().find(x => x.id === b.dataset.item); if (item) openStudyItem(item);
    }));
    document.querySelectorAll("[data-complete]").forEach(box => box.addEventListener("change", () => {
      const id = box.dataset.complete;
      setStatus(id, box.checked ? "completed" : "not-started");
      syncDashboardProgress();
      renderRoadmap();
    }));
    document.querySelectorAll("[data-status]").forEach(b => b.addEventListener("click", () => {
      const item = allItems().find(x => x.id === b.dataset.status); if (!item) return;
      const order = ["not-started","learning","completed","revisit"];
      const next = order[(order.indexOf(statusOf(item)) + 1) % order.length];
      setStatus(item.id, next); syncDashboardProgress(); renderRoadmap();
    }));
    $("#orExpandAll")?.addEventListener("click", () => {
      roadmap.modules.forEach(m => { expandedModules.add(m.number); m.submodules.forEach(s => expandedSubs.add(s.number)); }); renderRoadmap();
    });
    $("#orCollapseAll")?.addEventListener("click", () => { expandedModules.clear(); expandedSubs.clear(); renderRoadmap(); });
    $("#orExport")?.addEventListener("click", exportProgress);
    const scroller = $("#orScrollRegion");
    $("#orBackTop")?.addEventListener("click", () => scroller?.scrollTo({top:0,behavior:"smooth"}));
    scroller?.addEventListener("scroll", () => { const b=$("#orBackTop"); if (b) b.classList.toggle("is-visible", scroller.scrollTop > 250); });
  }
  function openStudyItem(item) {
    roadmapScrollTop = $("#orScrollRegion")?.scrollTop || 0;
    currentItem = item;
    const status = statusOf(item);
    const body = `<div class="or-study-page">
      <div class="or-breadcrumb">Oracle Database / ${esc(item.title)}</div>
      <div class="or-study-header"><span class="or-kicker">ORACLE LEARNING OBJECTIVE</span><span class="or-status or-status-${status}">${esc(statusLabel(status))}</span></div>
      <h3>${esc(item.title)}</h3>
      <p class="or-study-intro">This is the dedicated learning page for this Oracle DBA subject. The detailed lesson content, diagrams, commands, hands-on lab, troubleshooting cases and interview questions will be developed here.</p>
      <div class="or-learning-sections">
        <section><h4>1. Fundamentals and first principles</h4><p>Explain the concept, terminology, purpose, and the problem this Oracle feature solves.</p></section>
        <section><h4>2. Internal architecture and how it works</h4><p>Document the components, dependencies, processing flow, background activity and relevant Oracle views.</p></section>
        <section><h4>3. Implementation and administration</h4><p>Add prerequisites, configuration steps, SQL/SQL*Plus commands, expected outputs and validation checks.</p></section>
        <section><h4>4. Hands-on laboratory</h4><p>Build a repeatable lab with environment requirements, execution steps, expected results, cleanup and evidence.</p></section>
        <section><h4>5. Troubleshooting and production scenarios</h4><p>Use Detect → Collect Evidence → Diagnose → Fix Safely → Validate → RCA → Prevent Recurrence.</p></section>
        <section><h4>6. Specialist knowledge and interview preparation</h4><p>Include advanced behavior, design trade-offs, real production examples and senior DBA / architect questions.</p></section>
        <section><h4>7. Personal notes and revision</h4><textarea class="or-notes" id="orNotes" placeholder="Your personal learning notes for this subject…">${esc(learningState["note:"+item.id] || "")}</textarea></section>
      </div>
      <div class="or-study-actions">
        <label class="or-status-select">Learning status
          <select id="orItemStatus">
            ${["not-started","learning","completed","revisit"].map(s=>`<option value="${s}" ${s===status?"selected":""}>${statusLabel(s)}</option>`).join("")}
          </select>
        </label>
        <button class="action-button" id="orSaveItem">Save status and notes</button>
      </div>
    </div>`;
    showShell("Oracle Study Page", body, {
      id: "orBackToRoadmapTop",
      label: "← Back to Oracle roadmap",
      onBack: renderRoadmap
    });
    $("#orSaveItem")?.addEventListener("click", () => {
      setStatus(item.id, $("#orItemStatus").value);
      syncDashboardProgress();
      learningState["note:"+item.id] = $("#orNotes").value;
      saveState();
      if (typeof window.toast === "function") window.toast("Study status and notes saved in this browser.");
      else alert("Study status and notes saved in this browser.");
    });
  }
  function exportProgress() {
    const payload = {technology:"oracle",exportedAt:new Date().toISOString(),state:learningState};
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="oracle-roadmap-progress-backup.json"; a.click(); URL.revokeObjectURL(a.href);
  }
  async function openOracle() {
    ensureStyles();
    try {
      if (!roadmap) {
        const response = await fetch(DATA_URL, {cache:"no-cache"});
        if (!response.ok) throw new Error(`Could not load curriculum (${response.status})`);
        roadmap = await response.json();
      }
      syncDashboardProgress();
      filter = ""; expandedModules.clear(); expandedSubs.clear(); renderRoadmap();
      if (location.hash !== "#roadmap/oracle") history.replaceState(null,"","#roadmap/oracle");
    } catch (error) {
      showShell("Oracle Database Roadmap", `<div class="or-error"><strong>Unable to load Oracle curriculum.</strong><p>${esc(error.message)}</p><p>Confirm that <code>data/roadmaps/oracle.json</code> is present and that the site is opened through the local web server or GitHub Pages, not directly as a file.</p></div>`);
    }
  }
  // Replace the dashboard's placeholder Oracle destination while leaving every other technology unchanged.
  const originalOpenTechnology = window.openTechnology;
  window.openTechnology = function(id) {
    if (id === "oracle") { openOracle(); return; }
    if (typeof originalOpenTechnology === "function") return originalOpenTechnology(id);
  };
  window.addEventListener("hashchange", () => {
    if (location.hash === "#roadmap/oracle") openOracle();
  });
  // Expose a small API for future roadmap editor and validation work.
  window.OracleRoadmap = {open:openOracle,getData:()=>roadmap,getState:()=>({...learningState})};
})();
