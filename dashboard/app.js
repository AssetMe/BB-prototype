// BenchBrawl Visibility Dashboard — vanilla JS SPA with hash routing
(() => {
  const D = window.__BB_DATA__;

  // ---------- Persistent UI state ----------
  const STATE = {
    range:      { from: '2026-04-08', to: '2026-05-05' },
    compareKind:'',                                       // '' | 'prev-period' | 'prev-week' | 'custom'
    compareRange:{ from: '', to: '' },
    topic:      '',
    promptId:   '',
    metric:     'mention',                                // mention | citation | position
    model:      'all',
  };

  function fmtRange(from, to) {
    const a = new Date(from), b = new Date(to);
    const sameYear = a.getFullYear() === b.getFullYear();
    const opt = { month:'short', day:'numeric' };
    return `${a.toLocaleDateString('en-US',opt)} – ${b.toLocaleDateString('en-US',opt)}${sameYear?', '+b.getFullYear():''}`;
  }
  function clampRange(r) {
    if (!r.from || !r.to) return r;
    if (new Date(r.from) > new Date(r.to)) r.from = r.to;
    return r;
  }
  function deriveTrend() {
    // Filter days to the selected range, then scale by topic/prompt selection
    const fromT = new Date(STATE.range.from).getTime();
    const toT   = new Date(STATE.range.to).getTime();
    let days = D.TREND_DAYS.filter(d => {
      const t = new Date(d.date).getTime();
      return t >= fromT && t <= toT;
    });
    let scale = 1;
    if (STATE.promptId) {
      const p = D.PROMPTS.find(x => x.id == STATE.promptId);
      if (p) scale = (D.KPIS.mention > 0) ? (p.mr / D.KPIS.mention) : 1;
    } else if (STATE.topic) {
      const t = D.TOPICS.find(x => x.name === STATE.topic);
      if (t) scale = (D.KPIS.mention > 0) ? (t.mention / D.KPIS.mention) : 1;
    }
    return days.map(d => ({
      ...d,
      mention:  +(d.mention  * scale).toFixed(1),
      citation: +(d.citation * scale).toFixed(1),
    }));
  }
  function deriveCompareTrend() {
    if (!STATE.compareKind) return null;
    const main = D.TREND_DAYS;
    const fromT = new Date(STATE.range.from).getTime();
    const toT   = new Date(STATE.range.to).getTime();
    const days  = Math.round((toT - fromT) / 86400000);
    let cFrom, cTo;
    if (STATE.compareKind === 'prev-period') {
      cTo = new Date(fromT - 86400000);
      cFrom = new Date(cTo.getTime() - days*86400000);
    } else if (STATE.compareKind === 'prev-week') {
      cTo = new Date(toT - 7*86400000);
      cFrom = new Date(fromT - 7*86400000);
    } else if (STATE.compareKind === 'custom' && STATE.compareRange.from && STATE.compareRange.to) {
      cFrom = new Date(STATE.compareRange.from);
      cTo = new Date(STATE.compareRange.to);
    } else {
      return null;
    }
    // For demo data, synthesize a "previous" series: shift main values down by ~25%
    return D.TREND_DAYS
      .filter(d => { const t = new Date(d.date).getTime(); return t >= cFrom.getTime() && t <= cTo.getTime(); })
      .map(d => ({ ...d, mention: +(d.mention*0.7).toFixed(1), citation: +(d.citation*0.6).toFixed(1) }));
  }

  // ---------- Helpers ----------
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const fmtPct = (v) => (v == null) ? '—' : `${Math.round(v)}%`;
  const fmtPctOne = (v) => (v == null) ? '—' : `${v.toFixed(1)}%`;
  const fmtPos = (v) => (v == null || v === 0) ? '—' : `#${v.toFixed(1)}`;
  const fmtDateShort = (iso) => {
    const d = new Date(iso); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  };
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function rateBadge(v) {
    if (!v || v === 0) return `<span class="rate-badge zero">0%</span>`;
    if (v >= 60) return `<span class="rate-badge high">${Math.round(v)}%</span>`;
    return `<span class="rate-badge">${Math.round(v)}%</span>`;
  }
  function posBadge(v) {
    if (!v || v === 0) return `<span class="position-badge empty">—</span>`;
    return `<span class="position-badge">#${v.toFixed(1)}</span>`;
  }

  // SVG icons (Lucide-style)
  const I = {
    grid:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    at:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/></svg>`,
    link:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
    doc:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    users:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    chat:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    logout:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    chevronUpDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 15 12 20 17 15"/><polyline points="7 9 12 4 17 9"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevronRight:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    plus:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    search:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    cal:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    eye:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    external:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    x:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    arrowRight:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    edit:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    toptal:  `<img src="toptal.svg" alt="Toptal" class="toptal-logo">`,
  };

  // ---------- Reusable filter row (Topic / Prompt / Date range / Compare-to / Model) ----------
  function filterRow(opts={}) {
    const showTopic   = opts.showTopic   !== false;
    const showPrompt  = opts.showPrompt  !== false;
    const showRange   = opts.showRange   !== false;
    const showCompare = opts.showCompare !== false;
    const showModel   = opts.showModel   !== false;

    const promptOpts = D.PROMPTS
      .filter(p => !STATE.topic || p.topics.split('|').includes(STATE.topic))
      .map(p => {
        const txt = p.text.length > 60 ? p.text.slice(0,57)+'…' : p.text;
        return `<option value="${p.id}" ${String(STATE.promptId)===String(p.id)?'selected':''}>${escapeHtml(txt)}</option>`;
      }).join('');

    return `
      <div class="filter-row">
        ${showTopic ? `
          <select class="select filter-control" id="f-topic">
            <option value="">All Topics</option>
            ${D.TOPICS.map(t => `<option ${STATE.topic===t.name?'selected':''}>${escapeHtml(t.name)}</option>`).join('')}
          </select>` : ''}
        ${showPrompt ? `
          <select class="select filter-control" id="f-prompt" style="max-width:280px">
            <option value="">All Prompts</option>
            ${promptOpts}
          </select>` : ''}
        ${showRange ? dateRangeButton('drMain', STATE.range) : ''}
        ${showCompare ? `
          ${dateRangeButton('drCmp', STATE.compareRange.from && STATE.compareRange.to ? STATE.compareRange : STATE.range,
              STATE.compareKind === 'prev-period' ? 'Previous period'
            : STATE.compareKind === 'prev-week'   ? 'Previous week'
            : STATE.compareKind === 'custom' && STATE.compareRange.from ? fmtRange(STATE.compareRange.from, STATE.compareRange.to)
            : 'Compare to…')}
          <select class="select filter-control" id="f-compare-kind">
            <option value="">Off</option>
            <option value="prev-period" ${STATE.compareKind==='prev-period'?'selected':''}>Previous period</option>
            <option value="prev-week"   ${STATE.compareKind==='prev-week'?'selected':''}>Previous week</option>
            <option value="custom"      ${STATE.compareKind==='custom'?'selected':''}>Custom range</option>
          </select>
        ` : ''}
        <div class="grow"></div>
        ${showModel ? `
          <select class="select filter-control" id="f-model">
            <option value="all">All Models</option>
            <option ${STATE.model==='ChatGPT'?'selected':''}>ChatGPT</option>
            <option ${STATE.model==='Claude'?'selected':''}>Claude</option>
            <option ${STATE.model==='Gemini'?'selected':''}>Gemini</option>
            <option ${STATE.model==='Perplexity'?'selected':''}>Perplexity</option>
          </select>` : ''}
        ${(STATE.topic||STATE.promptId||STATE.compareKind) ? `<button class="btn btn-clear" id="f-clear">${I.x} Clear</button>` : ''}
      </div>
    `;
  }
  function filteredPrompts() {
    return D.PROMPTS.filter(p => {
      if (STATE.topic && !p.topics.split('|').includes(STATE.topic)) return false;
      if (STATE.promptId && String(p.id) !== String(STATE.promptId)) return false;
      return true;
    });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  // Tiny markdown: **bold**, paragraphs, - lists, numbered lists
  function formatMd(s) {
    if (!s) return '';
    const lines = String(s).split('\n');
    const html = [];
    let inList = false, listType = '';
    const flushList = () => { if (inList) { html.push(`</${listType}>`); inList = false; } };
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushList(); continue; }
      const ulMatch = line.match(/^[-•]\s+(.*)/);
      const olMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') { flushList(); html.push('<ul class="md-ul">'); inList=true; listType='ul'; }
        html.push(`<li>${md(ulMatch[1])}</li>`);
      } else if (olMatch) {
        if (!inList || listType !== 'ol') { flushList(); html.push('<ol class="md-ol">'); inList=true; listType='ol'; }
        html.push(`<li>${md(olMatch[2])}</li>`);
      } else {
        flushList();
        html.push(`<p>${md(line)}</p>`);
      }
    }
    flushList();
    return html.join('');
    function md(s) { return s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>'); }
  }

  // Date-range button + popover. Each instance gets a unique id (prefix).
  function dateRangeButton(prefix, range, label) {
    const display = label || (range.from && range.to ? fmtRange(range.from, range.to) : 'Pick dates');
    return `
      <div class="dr" data-dr="${prefix}">
        <button class="btn dr-btn" type="button" id="${prefix}-btn">
          ${I.cal} <span class="dr-text">${display}</span> ${I.chevron}
        </button>
        <div class="dr-popover" id="${prefix}-pop" hidden>
          <div class="dr-pop-row">
            <label>From</label>
            <input type="date" class="input-date" id="${prefix}-from" value="${range.from||''}" min="2026-04-08" max="2026-05-06">
          </div>
          <div class="dr-pop-row">
            <label>To</label>
            <input type="date" class="input-date" id="${prefix}-to" value="${range.to||''}" min="2026-04-08" max="2026-05-06">
          </div>
          <div class="dr-pop-presets">
            <button class="btn-link" data-preset="last7">Last 7 days</button>
            <button class="btn-link" data-preset="last14">Last 14 days</button>
            <button class="btn-link" data-preset="last30">Last 30 days</button>
            <button class="btn-link" data-preset="all">All time</button>
          </div>
          <div class="dr-pop-actions">
            <button class="btn" type="button" data-action="cancel">Cancel</button>
            <button class="btn btn-primary" type="button" data-action="apply">Apply</button>
          </div>
        </div>
      </div>
    `;
  }
  function wireDateRangePopover(prefix, getRange, setRange) {
    const btn = $(`#${prefix}-btn`); const pop = $(`#${prefix}-pop`);
    if (!btn || !pop) return;
    let pending = { ...getRange() };
    const close = () => { pop.hidden = true; document.removeEventListener('mousedown', onDocClick, true); };
    const onDocClick = (e) => { if (!pop.contains(e.target) && !btn.contains(e.target)) close(); };
    btn.addEventListener('click', () => {
      pending = { ...getRange() };
      pop.hidden = !pop.hidden;
      if (!pop.hidden) setTimeout(() => document.addEventListener('mousedown', onDocClick, true), 0);
    });
    $(`#${prefix}-from`)?.addEventListener('change', e => pending.from = e.target.value);
    $(`#${prefix}-to`)?.addEventListener('change',   e => pending.to   = e.target.value);
    $$(`#${prefix}-pop [data-preset]`).forEach(b => b.addEventListener('click', () => {
      const today = '2026-05-06';
      const dFrom = (n) => { const t = new Date(today); t.setDate(t.getDate()-n+1); return t.toISOString().slice(0,10); };
      const map = { last7: dFrom(7), last14: dFrom(14), last30: dFrom(30), all: '2026-04-08' };
      pending.from = map[b.dataset.preset]; pending.to = today;
      $(`#${prefix}-from`).value = pending.from; $(`#${prefix}-to`).value = pending.to;
    }));
    $$(`#${prefix}-pop [data-action="cancel"]`).forEach(b => b.addEventListener('click', close));
    $$(`#${prefix}-pop [data-action="apply"]`).forEach(b => b.addEventListener('click', () => {
      if (pending.from && pending.to) {
        if (new Date(pending.from) > new Date(pending.to)) { const t = pending.from; pending.from = pending.to; pending.to = t; }
        setRange(pending); close(); render();
      }
    }));
  }

  // Wire the filter row's controls to STATE + re-render
  function wireFilters() {
    const reRender = () => render();
    $('#f-topic')?.addEventListener('change', e => { STATE.topic = e.target.value; STATE.promptId = ''; reRender(); });
    $('#f-prompt')?.addEventListener('change', e => { STATE.promptId = e.target.value; reRender(); });
    wireDateRangePopover('drMain', () => STATE.range, r => { STATE.range = r; });
    wireDateRangePopover('drCmp',  () => STATE.compareRange, r => { STATE.compareRange = r; STATE.compareKind = 'custom'; });
    $('#f-compare-kind')?.addEventListener('change', e => { STATE.compareKind = e.target.value; reRender(); });
    $('#f-model')?.addEventListener('change', e => { STATE.model = e.target.value; reRender(); });
    $('#f-clear')?.addEventListener('click', () => {
      STATE.topic=''; STATE.promptId=''; STATE.compareKind=''; STATE.compareRange={from:'',to:''};
      reRender();
    });
    // Metric tabs (Trends page)
    $$('#metricTabs .tab').forEach(t => t.addEventListener('click', () => { STATE.metric = t.dataset.metric; reRender(); }));
  }

  // ---------- Sidebar ----------
  function renderSidebar(activeRoute) {
    const links = [
      { href: '#/overview',     label: 'Overview',          icon: I.grid },
      { href: '#/trends',       label: 'Visibility Trends', icon: I.at },
      { href: '#/citations',    label: 'Citations',         icon: I.link },
      { href: '#/responses',    label: 'Response Analysis', icon: I.doc },
      { href: '#/competitors',  label: 'Competitors',       icon: I.users },
      { href: '#/prompts',      label: 'Prompts',           icon: I.chat },
    ];
    const isProfile = activeRoute === 'profile';
    const isSettings = activeRoute === 'settings';
    return `
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">Sonar</div>
          <div class="brand-by">by ${I.toptal}</div>
        </div>
        <div class="workspace" id="ws-trigger">
          <div>
            <div class="workspace-name">BenchBrawl</div>
            <div class="workspace-domain">benchbrawl.com</div>
          </div>
          ${I.chevronUpDown}
          <div class="ws-popover" id="ws-pop" hidden>
            <a class="ws-item" href="https://sonar.toptal.com/syracuse-university" target="_blank" rel="noopener">
              <div class="workspace-name">Syracuse University</div>
              <div class="workspace-domain">syracuse.edu</div>
            </a>
            <a class="ws-item active" href="#/overview">
              <div class="workspace-name">BenchBrawl</div>
              <div class="workspace-domain">get.benchbrawl.com</div>
            </a>
          </div>
        </div>
        <div class="nav-label">Workspace</div>
        <nav class="nav">
          ${links.map(l => `
            <a href="${l.href}" class="${activeRoute && l.href.startsWith('#/'+activeRoute) ? 'active' : ''}">
              ${l.icon}<span>${l.label}</span>
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <a href="#/profile" class="sidebar-user-link ${isProfile?'active':''}">
            <div class="user-avatar"><img src="avatar.jpg" alt="A" onerror="var p=this.parentNode;p.classList.add('fallback');p.textContent='A';"></div>
            <div class="user-email">asset.mendesh@toptal.com</div>
          </a>
          <a href="#/settings" class="${isSettings?'active':''}">${I.settings}<span>Settings</span></a>
          <a href="#/signout">${I.logout}<span>Sign out</span></a>
        </div>
      </aside>
    `;
  }
  function wireSidebar() {
    const ws = $('#ws-trigger'); const pop = $('#ws-pop');
    if (!ws || !pop) return;
    const close = () => { pop.hidden = true; document.removeEventListener('mousedown', onDoc, true); };
    const onDoc = (e) => { if (!pop.contains(e.target) && !ws.contains(e.target)) close(); };
    ws.addEventListener('click', (e) => {
      if (e.target.closest('.ws-item')) return; // let link clicks through
      pop.hidden = !pop.hidden;
      if (!pop.hidden) setTimeout(() => document.addEventListener('mousedown', onDoc, true), 0);
    });
  }

  // ---------- Page: Settings ----------
  function pageSettings() {
    const projects = [
      { name: 'Syracuse University', domain: 'syracuse.edu',     limit: 100, end: 'Apr 14', cadence: 'Daily', external: 'https://sonar.toptal.com/syracuse-university' },
      { name: 'Benchbrawl',          domain: 'get.benchbrawl.com', limit: 100, end: 'May 27', cadence: 'Daily' },
    ];
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Settings</div>
        </div>
      </div>

      <div class="section-title" style="margin-top:0">Projects</div>
      <div class="card">
        <table>
          <thead><tr>
            <th>Name</th><th>Website domain</th>
            <th class="t-right">Prompt Limit</th>
            <th>End Date</th>
            <th>Tracking cadence</th>
            <th class="t-right">Actions</th>
          </tr></thead>
          <tbody>
            ${projects.map(p => `
              <tr class="cell-clickable" data-project="${p.name}" ${p.external?`data-href="${p.external}"`:''}>
                <td class="cell-prompt">${p.name}</td>
                <td class="text-2">${p.domain}</td>
                <td class="t-right text-2">${p.limit}</td>
                <td class="text-2">${p.end}</td>
                <td class="text-2">${p.cadence}</td>
                <td class="t-right"><button class="btn btn-icon" title="Edit">${I.edit}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section-title">Appearance</div>
      <select class="select" style="width:200px">
        <option>System</option><option>Dark</option><option>Light</option>
      </select>
      <div class="text-3" style="font-size:12px;margin-top:8px">Dark mode is experimental. Some elements may not display correctly.</div>
    `;
  }
  function wireSettings() {
    $$('tr[data-project]').forEach(tr => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const href = tr.dataset.href;
        if (href) window.open(href, '_blank', 'noopener');
      });
    });
  }

  // ---------- Page: Something went wrong (fallback for unfinished sections) ----------
  function pageError() {
    const where = (location.hash || '').replace(/^#\//,'') || 'unknown';
    return `
      <div class="error-page">
        <div class="error-card">
          <div class="error-title">Something went wrong</div>
          <div class="error-msg">Cannot read properties of null (reading 'toFixed')</div>
          <button class="btn btn-primary" id="err-retry">Try again</button>
        </div>
        <div class="error-proto">
          <span class="proto-badge">Working prototype</span>
          <span class="text-3" style="font-size:12px">Section <code>/${escapeHtml(where)}</code> is not wired yet — the rest of the dashboard works as expected.</span>
        </div>
      </div>
    `;
  }
  function wireError() {
    $('#err-retry')?.addEventListener('click', () => { location.hash = '#/overview'; });
  }

  // ---------- Page: Profile ----------
  function pageProfile() {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Profile</div>
          <div class="page-subtitle">Update your name and avatar.</div>
        </div>
      </div>

      <div style="max-width:560px">
        <label class="label">Name</label>
        <input class="input" id="prof-name" type="text" placeholder="Your name" value="Asset Mendesh" style="width:100%">

        <label class="label" style="margin-top:18px">Avatar URL</label>
        <input class="input" id="prof-avatar" type="text" value="avatar.jpg" style="width:100%">

        <div style="margin-top:16px">
          <div class="label">Preview</div>
          <div class="preview-avatar">
            <img id="prof-preview" src="avatar.jpg" onerror="this.style.display='none'">
          </div>
        </div>

        <button class="btn btn-primary" id="prof-save" style="margin-top:18px">Save</button>
      </div>
    `;
  }
  function wireProfile() {
    const url = $('#prof-avatar'); const prev = $('#prof-preview');
    url?.addEventListener('input', () => { prev.style.display = ''; prev.src = url.value || 'avatar.jpg'; });
    $('#prof-save')?.addEventListener('click', () => {
      const btn = $('#prof-save');
      const orig = btn.textContent; btn.textContent = 'Saved ✓'; btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1500);
    });
  }

  // ---------- Page: Overview ----------
  function pageOverview() {
    const k = D.KPIS;
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Overview</div>
          <div class="page-subtitle">Monitor your brand visibility across LLM responses</div>
        </div>
        ${dateRangeButton('drMain', STATE.range)}
      </div>

      <div class="kpis">
        <div class="kpi">
          <div class="kpi-label">Mention Rate ${I.info}</div>
          <div class="kpi-value">${k.mention}<span class="unit">%</span></div>
          <div class="kpi-trend">▲ +4.2% vs prior period</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Citation Rate ${I.info}</div>
          <div class="kpi-value">${k.citation}<span class="unit">%</span></div>
          <div class="kpi-trend">▲ +2.8% vs prior period</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Avg. Position ${I.info}</div>
          <div class="kpi-value">#44</div>
          <div class="kpi-trend down">▼ ranked low — needs work</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Active Prompts ${I.info}</div>
          <div class="kpi-value">${k.activePrompts}</div>
          <div class="kpi-trend">all running</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Visibility over time</div>
            <div class="card-subtitle">Mention rate and citation rate, daily</div>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#818cf8"></span>Mention rate</div>
            <div class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Citation rate</div>
          </div>
        </div>
        <div class="chart-wrap"><canvas id="overviewChart"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Top Performing Topics</div>
        </div>
        <table>
          <thead>
            <tr>
              <th><span class="sort">Topic</span></th>
              <th class="t-right"><span class="sort">Prompts</span></th>
              <th class="t-right"><span class="sort">Mention Rate ▼</span></th>
              <th class="t-right"><span class="sort">Citation Rate</span></th>
              <th class="t-right"><span class="sort">Avg. Position</span></th>
            </tr>
          </thead>
          <tbody>
            ${[...D.TOPICS].sort((a,b)=>b.mention-a.mention).slice(0,12).map(t => {
              const barW = Math.max(2, Math.round(t.mention)) + '%';
              return `
                <tr>
                  <td class="cell-prompt">${t.name}</td>
                  <td class="t-right text-2">${t.prompts}</td>
                  <td class="t-right">
                    <span class="tt-bar-track"><span class="tt-bar" style="width:${barW}"></span></span>
                    ${rateBadge(t.mention)}
                  </td>
                  <td class="t-right">${rateBadge(t.citation)}</td>
                  <td class="t-right">${posBadge(t.position)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div class="pagination">
          <div class="per-page">
            <span>Items per page</span>
            <button class="active">10</button><button>20</button>
          </div>
          <div>1-10 of ${D.TOPICS.length}</div>
        </div>
      </div>
    `;
  }

  // ---------- Page: Visibility Trends ----------
  function pageTrends() {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Visibility Trends</div>
          <div class="page-subtitle">Track mention rate, citation rate, and average position over time across LLM responses.</div>
        </div>
      </div>

      <div class="tab-row" id="metricTabs">
        <div class="tab ${STATE.metric==='mention'?'active':''}" data-metric="mention">Mention Rate</div>
        <div class="tab ${STATE.metric==='citation'?'active':''}" data-metric="citation">Citation Rate</div>
        <div class="tab ${STATE.metric==='position'?'active':''}" data-metric="position">Average Position</div>
      </div>

      ${filterRow()}

      <div class="card">
        <div class="chart-wrap" style="height:380px"><canvas id="trendsChart"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">True Mention Rate</div>
        </div>
        ${promptsTable(filteredPrompts(), { showFirstRun: false, perPage: 10 })}
      </div>
    `;
  }

  // ---------- Page: Citations ----------
  function pageCitations() {
    const totalRate = D.KPIS.citation;
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Citations</div>
          <div class="page-subtitle">Track URL citations in LLM responses</div>
        </div>
      </div>

      <div class="filter-row">
        <select class="select"><option>All Topics</option>${D.TOPICS.map(t=>`<option>${t.name}</option>`).join('')}</select>
        <div class="input-search" style="width:320px">${I.search}<input class="input" placeholder="Filter by URL or path..."></div>
        <button class="btn">${I.cal} Apr 8 – May 5, 2026 ${I.chevron}</button>
        <div class="grow"></div>
        <select class="select"><option>All Models</option></select>
      </div>

      <div class="kpis" style="grid-template-columns:repeat(1,minmax(0,260px))">
        <div class="kpi">
          <div class="kpi-label">Citation Rate ${I.info}</div>
          <div class="kpi-value">${totalRate.toFixed(1)}<span class="unit">%</span></div>
        </div>
      </div>

      <div class="section-title">Top Cited Domains</div>
      <div class="card">
        <table>
          <thead><tr>
            <th><span class="sort">Domain</span></th>
            <th class="t-right"><span class="sort">Cited Prompts</span></th>
            <th class="t-right"><span class="sort">Citation Rate</span></th>
          </tr></thead>
          <tbody>
            ${D.CITATIONS_DOMAINS.map(d => {
              const w = Math.max(4, Math.min(100, d.rate*4));
              return `
                <tr>
                  <td class="cell-prompt">
                    ${d.domain}
                    ${d.primary ? `<span class="pill pill-primary" style="margin-left:8px">Primary</span>`: ''}
                  </td>
                  <td class="t-right text-2">${d.cited} prompts</td>
                  <td class="t-right">
                    <span class="dom-bar-track"><span class="dom-bar" style="width:${w}%"></span></span>
                    ${d.rate.toFixed(1)}%
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
        <div class="pagination">
          <div class="per-page">
            <span>Items per page</span>
            <button class="active">25</button><button>50</button><button>100</button>
          </div>
          <div>1-${D.CITATIONS_DOMAINS.length} of ${D.CITATIONS_DOMAINS.length}</div>
        </div>
      </div>

      <div class="section-title flex" style="justify-content:space-between;align-items:center">
        <span>Most Cited Pages</span>
        <div>
          <button class="btn">Primary Domain</button>
          <button class="btn">All Domains</button>
        </div>
      </div>
      <div class="card">
        <table>
          <thead><tr>
            <th><span class="sort">Page Path</span></th>
            <th class="t-right"><span class="sort">Cited Prompts</span></th>
          </tr></thead>
          <tbody>
            ${D.CITATIONS_PAGES.map(p => `
              <tr>
                <td>
                  <span class="text-2">${p.domain}</span>
                  &nbsp;<span class="cell-prompt">${p.path}</span>
                  ${I.external}
                  ${p.primary ? `<span class="pill pill-primary" style="margin-left:8px">Primary</span>`: ''}
                </td>
                <td class="t-right">
                  <span style="background:rgba(34,197,94,0.16);color:#4ade80;padding:3px 9px;border-radius:5px;font-weight:600;font-size:11px">${p.cited}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---------- Page: Response Analysis ----------
  function pageResponses(state) {
    const filterText = (state && state.filter) || '';
    const selectedId = (state && state.selectedId) || (state && state.fromHash);
    const list = D.PROMPTS.filter(p => !filterText || p.text.toLowerCase().includes(filterText.toLowerCase()));
    const selected = D.PROMPTS.find(p => p.id == selectedId) || D.PROMPTS[0];
    const r = selected.response;

    return `
      <div class="page-header">
        <div>
          <div class="page-title">Response Analysis</div>
          <div class="page-subtitle">Analyze LLM responses and extracted mentions for each prompt</div>
        </div>
      </div>

      <div class="ra-layout">
        <div class="ra-list">
          <div class="ra-list-header"><h3>Prompts</h3>
            <div class="input-search">${I.search}<input id="raSearch" class="input" placeholder="Search prompts..." value="${filterText}"></div>
          </div>
          <div class="ra-list-items" id="raItems">
            ${list.map(p => `
              <div class="ra-item ${p.id===selected.id?'selected':''}" data-id="${p.id}">
                <div class="ra-item-title">${p.text}</div>
                <div class="ra-item-meta">Last run: May 5</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ra-content">
          <div class="filter-row" style="margin-bottom:14px">
            <button class="btn">${I.cal} May 5, 2026, 4:05 am (Latest) ${I.chevron}</button>
            <div class="grow"></div>
            <select class="select"><option>ChatGPT</option><option>Claude</option><option>Gemini</option><option>Perplexity</option></select>
          </div>

          <div class="ra-prompt-card">
            <div class="ra-prompt-label">Prompt</div>
            <div class="ra-prompt-text">${selected.text}</div>
            <div class="ra-position-line">
              ${selected.pos > 0
                ? `BenchBrawl is mentioned in <span class="pos">position #${selected.pos.toFixed(0)}</span>`
                : `BenchBrawl is <span class="pos" style="color:var(--text-3)">not mentioned</span>`}
            </div>
          </div>

          <div class="ra-section-title">Response</div>
          <div class="ra-response-box">
            <div class="ra-response-summary">${formatMd(r.summary)}</div>
            ${r.bullets && r.bullets.length ? `
              <ul class="ra-response-bullets">
                ${r.bullets.map(b => `<li>${formatMd(b)}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <div class="ra-section-title">Extracted Mentions (${r.mentions.length})</div>
          <div class="ra-mentions">
            ${r.mentions.map((m) => `
              <div class="ra-mention ${m.primary?'primary':''}">
                <div class="ra-mention-name">${m.name}</div>
                <div class="ra-mention-quote">${m.quote}</div>
                <div class="ra-mention-pos">Position #${m.position}</div>
              </div>
            `).join('')}
          </div>

          <div class="ra-section-title flex" style="align-items:center;gap:6px">${I.link} Extracted Citations (0)</div>
          <div class="card">
            <table class="empty-citations">
              <thead><tr>
                <th>URL</th>
                <th>Domain</th>
                <th class="t-right">Position</th>
              </tr></thead>
              <tbody>
                <tr><td colspan="3" class="empty-state">No citations extracted from this response.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- Page: Competitors ----------
  function pageCompetitors() {
    const sorted = [...D.COMPETITORS].sort((a,b)=>b.mention-a.mention);
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Competitors</div>
          <div class="page-subtitle">How BenchBrawl stacks up against the rest of the pick'em market</div>
        </div>
        <button class="btn btn-primary">${I.plus} Add Competitor</button>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Share of voice across 95 prompts</div>
          <div class="card-subtitle">Mentions across non-branded competitive queries</div>
        </div>
        <div class="chart-wrap" style="height:280px"><canvas id="compChart"></canvas></div>
      </div>

      <div class="section-title">Competitor leaderboard</div>
      <div class="card">
        <table>
          <thead><tr>
            <th><span class="sort">Brand</span></th>
            <th><span class="sort">Domain</span></th>
            <th class="t-right"><span class="sort">Mention Rate ▼</span></th>
            <th class="t-right"><span class="sort">Citation Rate</span></th>
            <th class="t-right"><span class="sort">Avg. Position</span></th>
            <th class="t-right"><span class="sort">Share of Voice</span></th>
          </tr></thead>
          <tbody>
            ${sorted.map(c => `
              <tr>
                <td>
                  <span class="comp-dot" style="background:${c.color};display:inline-block;margin-right:8px"></span>
                  <span class="cell-prompt">${c.name}</span>
                  ${c.isPrimary ? `<span class="pill pill-branded" style="margin-left:8px">You</span>`: ''}
                </td>
                <td class="text-2">${c.domain}</td>
                <td class="t-right">${rateBadge(c.mention)}</td>
                <td class="t-right">${rateBadge(c.citation)}</td>
                <td class="t-right">${posBadge(c.position)}</td>
                <td class="t-right text-2">${c.share}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="comp-grid">
        ${sorted.map(c => `
          <div class="comp-card">
            <div class="comp-head">
              <div class="comp-dot" style="background:${c.color}"></div>
              <div>
                <div class="comp-name">${c.name}${c.isPrimary?' <span class="pill pill-branded" style="margin-left:6px">You</span>':''}</div>
                <div class="comp-domain">${c.domain}</div>
              </div>
            </div>
            <div class="comp-stats">
              <div class="comp-stat"><div class="label">Mention</div><div class="val">${c.mention}%</div></div>
              <div class="comp-stat"><div class="label">Citation</div><div class="val">${c.citation}%</div></div>
              <div class="comp-stat"><div class="label">Avg. Pos</div><div class="val">#${c.position.toFixed(1)}</div></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ---------- Page: Prompts ----------
  function pagePrompts(state) {
    const filterText = (state && state.filter) || '';
    const topicFilter = (state && state.topic) || '';
    const filtered = D.PROMPTS.filter(p => {
      if (filterText && !p.text.toLowerCase().includes(filterText.toLowerCase())) return false;
      if (topicFilter && !p.topics.includes(topicFilter)) return false;
      return true;
    });
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Prompts</div>
          <div class="page-subtitle">Manage and track prompts for visibility analysis.</div>
        </div>
        <div class="flex gap-8">
          <button class="btn">CSV Manager ${I.chevron}</button>
          <button class="btn btn-primary">${I.plus} Add Prompt</button>
        </div>
      </div>

      <div class="filter-row">
        <div class="input-search" style="width:340px">${I.search}<input id="promptSearch" class="input" placeholder="Search prompts..." value="${filterText}"></div>
        <select id="promptTopic" class="select">
          <option value="">All Topics</option>
          ${D.TOPICS.map(t => `<option ${t.name===topicFilter?'selected':''}>${t.name}</option>`).join('')}
        </select>
      </div>

      <div class="banner-line">
        <span><strong style="color:var(--text-1)">${D.PROMPTS.length}</strong> prompts</span>
        <span class="divider-dot">•</span>
        <span><strong style="color:var(--text-1)">${D.PROMPTS.length}</strong> active</span>
        <span class="accent">Latest run: May 5</span>
      </div>

      <div class="card">
        ${promptsTable(filtered, { perPage: 10, showFirstRun: true, showActions: true })}
      </div>
    `;
  }

  // Reusable prompts table
  function promptsTable(rows, opts={}) {
    const perPage = opts.perPage || 10;
    return `
      <table data-perpage="${perPage}" data-page="1" class="prompts-table">
        <thead><tr>
          <th><span class="sort">Prompt</span></th>
          <th><span class="sort">Topic</span></th>
          ${opts.showFirstRun ? `<th><span class="sort">First Run</span></th>` : ''}
          <th><span class="sort">Last Run</span></th>
          <th class="t-right"><span class="sort">Mention Rate</span></th>
          <th class="t-right"><span class="sort">Citation Rate</span></th>
          ${opts.showFirstRun ? `<th></th>` : ''}
        </tr></thead>
        <tbody>
          ${rows.slice(0, perPage).map(p => `
            <tr class="cell-clickable" data-prompt-id="${p.id}">
              <td class="cell-prompt" style="max-width:480px">${p.text}</td>
              <td>
                <span class="tag-row">
                  ${p.topics.split('|').map(t => `<span class="pill ${t==='Branded'?'pill-branded':''}">${t}</span>`).join('')}
                </span>
              </td>
              ${opts.showFirstRun ? `<td class="text-2">Apr 8</td>` : ''}
              <td class="text-2">May 5</td>
              <td class="t-right">${rateBadge(p.mr)}</td>
              <td class="t-right">${rateBadge(p.cr)}</td>
              ${opts.showFirstRun ? `<td>${I.eye}</td>` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="pagination">
        <div class="per-page">
          <span>Items per page</span>
          <button class="${perPage===10?'active':''}">10</button>
          <button class="${perPage===20?'active':''}">20</button>
          <button class="${perPage===50?'active':''}">50</button>
          <button class="${perPage===100?'active':''}">100</button>
        </div>
        <div class="page-nav">
          <span style="margin-right:12px">1-${Math.min(perPage, rows.length)} of ${rows.length}</span>
          <button disabled>${I.chevronLeft}</button>
          <button class="active">1</button>
          ${rows.length > perPage ? `<button>2</button>` : ''}
          ${rows.length > perPage*2 ? `<button>3</button>` : ''}
          <button ${rows.length<=perPage?'disabled':''}>${I.chevronRight}</button>
        </div>
      </div>
    `;
  }

  // ---------- Charts ----------
  function drawOverviewChart() {
    const canvas = $('#overviewChart'); if (!canvas) return;
    const days = deriveTrend();
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: days.map(d => d.label),
        datasets: [
          { label:'Mention rate', data: days.map(d=>d.mention),  borderColor:'#818cf8', backgroundColor:'rgba(99,102,241,0.12)', tension:0.35, fill:true, pointRadius:0, borderWidth:2 },
          { label:'Citation rate', data: days.map(d=>d.citation), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.10)', tension:0.35, fill:true, pointRadius:0, borderWidth:2 },
        ]
      },
      options: chartOpts({ unit: '%' })
    });
  }
  function drawTrendsChart() {
    const canvas = $('#trendsChart'); if (!canvas) return;
    const days = deriveTrend();
    const cmp = deriveCompareTrend();
    const metric = STATE.metric;
    const colorMain = '#D0F500';
    const colorCmp = '#a8a8a8';
    const valueKey = metric;  // 'mention' | 'citation' | 'position'
    const unit = metric === 'position' ? '' : '%';
    const datasets = [
      { label:'BenchBrawl', data: days.map(d=>d[valueKey]), borderColor:colorMain, backgroundColor:'rgba(208,245,0,0.12)', tension:0.35, fill:true, pointRadius:0, borderWidth:2.5 },
    ];
    if (cmp) {
      datasets.push({
        label:'Comparison', data: cmp.map(d=>d[valueKey]), borderColor:colorCmp, backgroundColor:'rgba(168,168,168,0.06)', tension:0.35, fill:false, pointRadius:0, borderWidth:2, borderDash:[6,4]
      });
    }
    new Chart(canvas, {
      type: 'line',
      data: { labels: days.map(d => d.label), datasets },
      options: {
        ...chartOpts({ unit }),
        scales: {
          x: { grid: { color:'#181818', drawTicks:false }, ticks: { color:'#6b6b6b', font:{ size:11 }, maxRotation:0, autoSkip:true, autoSkipPadding:20 } },
          y: { grid: { color:'#181818', drawTicks:false }, ticks: { color:'#6b6b6b', font:{ size:11 }, callback: v => (metric==='position' ? `#${v.toFixed(1)}` : `${v}${unit}`) }, beginAtZero: metric!=='position', reverse: metric==='position' }
        }
      }
    });
  }
  function drawCompChart() {
    const canvas = $('#compChart'); if (!canvas) return;
    const sorted = [...D.COMPETITORS].sort((a,b)=>b.mention-a.mention);
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: sorted.map(c=>c.name),
        datasets: [{
          label: 'Mention rate',
          data: sorted.map(c=>c.mention),
          backgroundColor: sorted.map(c=>c.isPrimary ? '#D0F500' : c.color),
          borderRadius: 6,
        }]
      },
      options: {
        ...chartOpts({ unit: '%' }),
        plugins: { legend: { display: false } },
        indexAxis: 'x',
      }
    });
  }
  function chartOpts({ unit='%'}={}) {
    return {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      plugins: {
        legend: { display:false },
        tooltip: {
          backgroundColor:'#0a0a0a', borderColor:'#2a2a2a', borderWidth:1,
          titleColor:'#f5f5f5', bodyColor:'#a8a8a8', padding:10,
          callbacks: { label: (c)=> `${c.dataset.label}: ${c.parsed.y}${unit}` }
        }
      },
      scales: {
        x: { grid: { color:'#181818', drawTicks:false }, ticks: { color:'#6b6b6b', font:{ size:11 }, maxRotation:0, autoSkip:true, autoSkipPadding:20 } },
        y: { grid: { color:'#181818', drawTicks:false }, ticks: { color:'#6b6b6b', font:{ size:11 }, callback: v=>v+unit }, beginAtZero:true }
      }
    };
  }

  // ---------- Router ----------
  const ROUTES = {
    overview:    { render: pageOverview,    after: () => { drawOverviewChart(); wireFilters(); wireSidebar(); } },
    trends:      { render: pageTrends,      after: () => { drawTrendsChart(); wireFilters(); wirePromptRowClicks(); wireSidebar(); } },
    citations:   { render: pageCitations,   after: wireSidebar },
    responses:   { render: pageResponses,   after: () => { wireResponseListClicks(); wireSidebar(); } },
    competitors: { render: pageCompetitors, after: () => { drawCompChart(); wireSidebar(); } },
    prompts:     { render: pagePrompts,     after: () => { wirePromptRowClicks(); wirePromptFilters(); wireSidebar(); } },
    settings:    { render: pageSettings,    after: () => { wireSettings(); wireSidebar(); } },
    profile:     { render: pageProfile,     after: () => { wireProfile(); wireSidebar(); } },
    error:       { render: pageError,       after: () => { wireError(); wireSidebar(); } },
    signout:     { render: pageError,       after: () => { wireError(); wireSidebar(); } },
  };

  function parseRoute() {
    const hash = location.hash || '#/overview';
    // formats: #/overview, #/responses, #/responses/42
    const parts = hash.replace(/^#\//,'').split('/');
    const route = parts[0] || 'overview';
    const arg = parts[1];
    return { route, arg };
  }

  function render() {
    const { route, arg } = parseRoute();
    const def = ROUTES[route];
    const root = $('#app');
    let state = {};
    if (route === 'responses' && arg) state.fromHash = arg;
    if (!def) {
      root.innerHTML = renderSidebar(route) + `<main class="main">${pageError()}</main>`;
      try { wireError(); wireSidebar(); } catch (e) { console.error(e); }
    } else {
      root.innerHTML = renderSidebar(route) + `<main class="main">${def.render(state)}</main>`;
      if (def.after) try { def.after(); } catch (e) { console.error(e); }
    }
    window.scrollTo(0,0);
  }

  function wirePromptRowClicks() {
    $$('.prompts-table tbody tr.cell-clickable').forEach(tr => {
      tr.addEventListener('click', () => {
        const id = tr.dataset.promptId;
        location.hash = `#/responses/${id}`;
      });
    });
  }
  function wirePromptFilters() {
    const search = $('#promptSearch'), topic = $('#promptTopic');
    function rerender() {
      const s = search.value, t = topic.value;
      const main = $('main.main');
      main.innerHTML = pagePrompts({ filter: s, topic: t });
      wirePromptRowClicks(); wirePromptFilters();
      // Restore focus
      const newSearch = $('#promptSearch');
      if (newSearch) { newSearch.focus(); newSearch.setSelectionRange(s.length, s.length); }
    }
    let t;
    search?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(rerender, 180); });
    topic?.addEventListener('change', rerender);
  }
  function wireResponseListClicks() {
    $$('.ra-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        location.hash = `#/responses/${id}`;
      });
    });
    const search = $('#raSearch');
    let t;
    search?.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const s = search.value;
        const main = $('main.main');
        const cur = parseRoute().arg;
        main.innerHTML = pageResponses({ filter: s, fromHash: cur });
        wireResponseListClicks();
        const ns = $('#raSearch'); if (ns) { ns.focus(); ns.setSelectionRange(s.length, s.length); }
      }, 180);
    });
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) location.hash = '#/overview';
    render();
  });
})();
