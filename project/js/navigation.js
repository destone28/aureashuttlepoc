/* AureaShuttle — global navigation & utilities
   Estende il pattern di AureaCare. Differenze chiave:
   - Accent teal AureaShuttle, niente requireDriver
   - Wallet ring conta CORSE (non prestazioni)
   - App switcher con AureaShuttle come current
   - Helper handoff in arrivo da AureaCare
   ============================================================ */

// ---------- Auth (chiave condivisa con AureaVia + AureaCare) ----------

const AUTH_KEY = 'aurea_auth_user';

function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
  catch (e) { return null; }
}
function setAuth(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
function requireAuth() {
  const u = getAuth();
  if (!u || u.role !== 'patient') { window.location.href = 'index.html'; }
}
function requireAdmin() {
  const u = getAuth();
  if (!u || u.role !== 'admin') { window.location.href = 'admin-login.html'; }
}
function logout() {
  showConfirmDialog(
    'Conferma logout',
    'Sei sicuro di voler uscire dal tuo account Aurea?',
    () => {
      localStorage.removeItem(AUTH_KEY);
      const u = getAuth();
      window.location.href = 'index.html';
    }
  );
}

// ---------- Toast ----------
function showToast(message, type) {
  type = type || 'info';
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast--' + type;
  const icons = {
    success: 'check-circle',
    error:   'x-circle',
    info:    'info',
    shuttle: 'truck'
  };
  toast.innerHTML = `
    <span class="toast-icon">${aIcon(icons[type] || 'info', { size: 22 })}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Chiudi">
      ${aIcon('x', { size: 18 })}
    </button>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 250); }, 3200);
}

// ---------- Confirm ----------
function showConfirmDialog(title, message, onConfirm, opts) {
  opts = opts || {};
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  overlay.innerHTML = `
    <div class="confirm-dialog">
      <h3 class="confirm-title">${title}</h3>
      <p class="confirm-message">${message}</p>
      <div class="confirm-actions">
        <button class="btn btn--secondary" style="flex:1" data-cancel>${opts.cancelLabel || 'Annulla'}</button>
        <button class="btn ${opts.danger ? 'btn--primary' : 'btn--shuttle'}" style="flex:1" data-confirm>${opts.confirmLabel || 'Conferma'}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('[data-cancel]').onclick = () => overlay.remove();
  overlay.querySelector('[data-confirm]').onclick = () => { overlay.remove(); if (onConfirm) onConfirm(); };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

// ---------- Modal ----------
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}
function closeModal(id) {
  if (id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  } else {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
}

// ---------- openInfoModal ----------
// Modale informativa "al volo" — comoda per mockup stub (Notifiche, SPID, SSO, Termini, Privacy…).
// opts: { title, subtitle, bodyHTML, wide, accent ('shuttle' | 'care' | 'orange' | 'neutral'),
//          actions: [{ label, kind ('primary'|'secondary'|'shuttle'|'ghost'|'danger'), onClick, close }] }
function openInfoModal(opts) {
  opts = opts || {};
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  const accentBar = opts.accent ? `<div style="height:4px;background:${
    opts.accent === 'care'    ? 'var(--care-blue)'    :
    opts.accent === 'orange'  ? 'var(--primary-orange)' :
    opts.accent === 'neutral' ? 'var(--medium-gray)'   :
                                'var(--shuttle-teal)'
  }"></div>` : '';
  const sub = opts.subtitle ? `<p class="caption" style="margin-top:2px">${opts.subtitle}</p>` : '';
  const actions = (opts.actions || [{ label: 'Chiudi', kind: 'secondary', close: true }]).map((a, i) => {
    const cls = a.kind === 'primary'   ? 'btn--primary'
              : a.kind === 'shuttle'   ? 'btn--shuttle'
              : a.kind === 'danger'    ? 'btn--danger'
              : a.kind === 'ghost'     ? 'btn--ghost'
              : 'btn--secondary';
    return `<button class="btn ${cls}" data-action-i="${i}">${a.label}</button>`;
  }).join('');
  overlay.innerHTML = `
    <div class="modal${opts.wide ? ' modal--wide' : ''}">
      ${accentBar}
      <div class="modal-header">
        <div>
          <div class="modal-title">${opts.title || ''}</div>
          ${sub}
        </div>
        <button class="modal-close" aria-label="Chiudi">${aIcon('x', { size: 14 })}</button>
      </div>
      <div class="modal-body">${opts.bodyHTML || ''}</div>
      <div class="modal-footer">${actions}</div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.modal-close').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };

  overlay.querySelectorAll('[data-action-i]').forEach(btn => {
    const i = parseInt(btn.dataset.actionI, 10);
    const a = (opts.actions || [])[i] || { close: true };
    btn.onclick = () => {
      const stay = a.onClick && a.onClick({ close }) === false;
      if (a.close !== false && !stay) close();
    };
  });

  return { overlay, close };
}

// ---------- App switcher ----------
function mountAppSwitcher(triggerEl) {
  if (!triggerEl) return;
  triggerEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const style = localStorage.getItem('aureashuttle_app_switcher_style') || 'dropdown';
    if (style === 'modal') return openAppSwitcherModal();
    if (style === 'sheet') return openAppSwitcherSheet();
    toggleAppSwitcherDropdown(triggerEl);
  });
}

function appSwitcherCards() {
  return `
    <a class="app-card via" href="https://destone28.github.io/aureaviapoc/" target="_blank" rel="noopener">
      <div class="app-dot">V</div>
      <div>
        <div class="app-name">AureaVia</div>
        <div class="app-tag">NCC &amp; taxi premium · driver layer</div>
      </div>
    </a>
    <a class="app-card shuttle current" href="home.html">
      <div class="app-dot">S</div>
      <div>
        <div class="app-name">AureaShuttle</div>
        <div class="app-tag">Trasporto sanitario · In uso</div>
      </div>
    </a>
    <a class="app-card care" href="https://aureacarepoc.vercel.app" target="_blank" rel="noopener">
      <div class="app-dot">C</div>
      <div>
        <div class="app-name">AureaCare</div>
        <div class="app-tag">Accesso alle cure</div>
      </div>
    </a>`;
}

function toggleAppSwitcherDropdown(trigger) {
  let dd = document.getElementById('appSwitcherDropdown');
  if (dd) { dd.classList.toggle('open'); return; }
  dd = document.createElement('div');
  dd.id = 'appSwitcherDropdown';
  dd.className = 'app-switcher-dropdown open';
  dd.innerHTML = `<h4>Aurea Suite</h4>${appSwitcherCards()}`;
  const wrap = trigger.closest('.app-switcher-wrap');
  if (wrap) wrap.appendChild(dd);
  else document.body.appendChild(dd);
  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target) && e.target !== trigger) dd.classList.remove('open');
  }, { once: true });
}

function openAppSwitcherModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Aurea Suite</div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          ${aIcon('x', { size: 14 })}
        </button>
      </div>
      <div class="modal-body">
        <p class="caption mb-16">Un solo account per tutta la suite. Passa da un servizio all'altro senza accessi multipli.</p>
        ${appSwitcherCards()}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

function openAppSwitcherSheet() {
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop open';
  const sheet = document.createElement('div');
  sheet.className = 'sheet open';
  sheet.innerHTML = `<div class="sheet-handle"></div><h3>Aurea Suite</h3>${appSwitcherCards()}`;
  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);
  const close = () => { backdrop.remove(); sheet.remove(); };
  backdrop.onclick = close;
}

// ---------- Wallet ring (segmentato = 1 tacca per corsa) ----------
function renderWalletRing(el, opts) {
  if (!el) return;
  opts = opts || {};
  const variant = localStorage.getItem('aureashuttle_wallet_variant') || opts.variant || 'segmented';
  const total = opts.total || 20;
  const used = opts.used || 0;
  const remaining = total - used;
  const credit = opts.credit || 0;
  const size = opts.size || 220;
  el.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'wallet-ring';
  wrap.style.width = size + 'px';
  wrap.style.height = size + 'px';

  if (variant === 'segmented') {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    const cx = 50, cy = 50, r = 42;
    const circ = 2 * Math.PI * r;
    // Se total > 24, segmenti diventano troppo sottili — cap visivo a 24 e usa 1 tacca per ogni 5%
    const visualTotal = Math.min(total, 24);
    const gap = visualTotal <= 12 ? 2.5 : 1.5;
    const segDeg = (360 / visualTotal) - gap;
    const segLen = (segDeg / 360) * circ;
    const gapLen = (gap / 360) * circ;
    // Quante tacche "spente" sono in proporzione all'used
    const visualUsed = Math.round(visualTotal * (used / total));
    for (let i = 0; i < visualTotal; i++) {
      const seg = document.createElementNS(svgNS, 'circle');
      seg.setAttribute('cx', cx);
      seg.setAttribute('cy', cy);
      seg.setAttribute('r', r);
      seg.setAttribute('class', 'seg ' + (i < (visualTotal - visualUsed) ? 'unused' : 'used'));
      seg.setAttribute('stroke-width', '7');
      seg.setAttribute('stroke-dasharray', `${segLen} ${circ - segLen}`);
      const offset = -(i * (segLen + gapLen)) + (gapLen / 2);
      seg.setAttribute('stroke-dashoffset', offset);
      svg.appendChild(seg);
    }
    wrap.appendChild(svg);
  } else if (variant === 'single') {
    const pct = Math.max(0, Math.min(1, remaining / total));
    wrap.innerHTML = `
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="42" stroke-width="7"/>
        <circle class="ring-fg" cx="50" cy="50" r="42" stroke-width="7"
                stroke-dasharray="${(2 * Math.PI * 42).toFixed(2)}"
                stroke-dashoffset="${((1 - pct) * 2 * Math.PI * 42).toFixed(2)}"/>
      </svg>`;
  } else if (variant === 'dual') {
    // Ring esterno: € residuo / acquistato
    // Ring interno: corse residue / totale
    const pctEur = Math.max(0, Math.min(1, (remaining / total) * (opts.creditMax ? credit / opts.creditMax : 1)));
    const pctRides = Math.max(0, Math.min(1, remaining / total));
    wrap.innerHTML = `
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="44" stroke-width="5"/>
        <circle class="ring-fg" cx="50" cy="50" r="44" stroke-width="5"
                stroke-dasharray="${(2 * Math.PI * 44).toFixed(2)}"
                stroke-dashoffset="${((1 - pctEur) * 2 * Math.PI * 44).toFixed(2)}"/>
        <circle class="ring-bg" cx="50" cy="50" r="34" stroke-width="5"/>
        <circle class="ring-fg" cx="50" cy="50" r="34" stroke-width="5"
                stroke="var(--primary-orange)"
                stroke-dasharray="${(2 * Math.PI * 34).toFixed(2)}"
                stroke-dashoffset="${((1 - pctRides) * 2 * Math.PI * 34).toFixed(2)}"/>
      </svg>`;
  }

  const center = document.createElement('div');
  center.className = 'ring-center';
  if (variant === 'dual') {
    center.innerHTML = `
      <div class="ring-eyebrow">Wallet AureaShuttle</div>
      <div class="ring-amount" style="font-size:24px">${remaining}<span style="font-size:13px;font-weight:400;color:var(--medium-gray)"> / ${total}</span></div>
      <div class="ring-sub">corse residue</div>
      <div class="ring-sub" style="margin-top:2px;font-weight:700;color:var(--shuttle-teal-dark)">€${credit}</div>`;
  } else {
    center.innerHTML = `
      <div class="ring-eyebrow">Corse residue</div>
      <div class="ring-amount">${remaining}<span style="font-size:14px;font-weight:400;color:var(--medium-gray);letter-spacing:0"> / ${total}</span></div>
      <div class="ring-sub">${opts.packageLabel || 'pacchetto attivo'}</div>`;
  }
  wrap.appendChild(center);
  el.appendChild(wrap);
}

// ---------- Wizard helpers ----------
function setWizardStep(currentStep, totalSteps) {
  const stepsEl = document.querySelector('.steps');
  if (!stepsEl) return;
  stepsEl.innerHTML = '';
  for (let i = 1; i <= totalSteps; i++) {
    const s = document.createElement('div');
    s.className = 'step';
    if (i < currentStep) s.classList.add('done');
    else if (i === currentStep) s.classList.add('active');
    stepsEl.appendChild(s);
  }
}

// ---------- Helper admin (popup riusabili) ----------
function openPatientsModal() {
  if (!window.MOCK || !MOCK.patients) return;
  const rows = MOCK.patients.map(p => `
    <tr>
      <td><div style="font-weight:700">${p.name}</div><div class="cell-sub font-mono">${p.id}</div></td>
      <td><span class="font-mono" style="font-size:12px">${p.cf}</span></td>
      <td>${p.phone}</td>
      <td><strong>${p.wallet_rides}</strong><div class="cell-sub">${p.package}</div></td>
      <td>${p.total_rides}</td>
      <td>${p.last_login}</td>
      <td><span class="badge badge--approved" style="font-size:10px">${p.status === 'active' ? 'Attivo' : p.status}</span></td>
    </tr>`).join('');
  openInfoModal({
    title: 'Pazienti AureaShuttle',
    subtitle: `${MOCK.patients.length} pazienti registrati`,
    accent: 'shuttle',
    wide: true,
    bodyHTML: `
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <span class="chip chip--sm">Totali: ${MOCK.patients.length}</span>
        <span class="chip chip--sm">Attivi: ${MOCK.patients.filter(p => p.status === 'active').length}</span>
        <span class="chip chip--sm">Pacchetto 20: ${MOCK.patients.filter(p => p.package === '20 corse').length}</span>
      </div>
      <div style="max-height:60vh;overflow:auto">
        <table class="data-table">
          <thead><tr><th>Paziente</th><th>CF</th><th>Telefono</th><th>Wallet</th><th>Corse fatte</th><th>Ultimo accesso</th><th>Stato</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="caption mt-12" style="font-size:11px">Mockup: la sezione completa con filtri, dettaglio paziente e azioni admin sarà disponibile in produzione.</p>`,
    actions: [{ label: 'Chiudi', kind: 'secondary' }]
  });
}

function openEsgReport() {
  if (!window.MOCK || !MOCK.esgAggregate) return;
  const e = MOCK.esgAggregate;
  openInfoModal({
    title: 'Report ESG aggregato',
    subtitle: 'Impatto sociale, ambientale e sanitario · Q2 2026',
    accent: 'shuttle',
    wide: true,
    bodyHTML: `
      <div class="esg-kpi-grid mb-16">
        <div class="esg-kpi"><div class="esg-kpi-icon">${aIcon('users',{size:18})}</div><p class="esg-kpi-num">${e.caregiver_days_saved}</p><p class="esg-kpi-lbl">Giornate caregiver risparmiate</p></div>
        <div class="esg-kpi kpi--warm"><div class="esg-kpi-icon">${aIcon('euro',{size:18})}</div><p class="esg-kpi-num">€${(e.caregiver_eur_saved/1000).toFixed(1)}k</p><p class="esg-kpi-lbl">Valore tempo recuperato</p></div>
        <div class="esg-kpi kpi--green"><div class="esg-kpi-icon">${aIcon('leaf',{size:18})}</div><p class="esg-kpi-num">${(e.co2_kg_avoided/1000).toFixed(1)}t</p><p class="esg-kpi-lbl">CO₂ evitata</p></div>
        <div class="esg-kpi kpi--blue"><div class="esg-kpi-icon">${aIcon('heart',{size:18})}</div><p class="esg-kpi-num">${e.cures_completed}</p><p class="esg-kpi-lbl">Cure portate a termine</p></div>
      </div>
      <div class="card card--padded" style="background:var(--shuttle-teal-bg);border-color:#99E9DD">
        <p style="font-weight:700;color:var(--shuttle-teal-dark);font-size:15px">SROI ${e.sroi_ratio.toFixed(1)}× — ogni €1 investito genera circa €${e.sroi_ratio.toFixed(1)} di impatto sociale</p>
        <p class="caption mt-8" style="font-size:13px;line-height:1.6">
          Valore sociale generato: <strong>€${e.social_value_eur.toLocaleString('it-IT')}</strong> · km privati evitati: <strong>${e.private_km_avoided.toLocaleString('it-IT')}</strong> · riduzione dropout terapeutico: <strong>${e.dropout_reduction}%</strong>.
        </p>
      </div>
      <div class="divider-eyebrow"><span>Metodologia</span><span class="line"></span></div>
      <p style="font-size:13px;line-height:1.55">
        Il calcolo SROI confronta il costo del servizio AureaShuttle con il valore generato in 3 dimensioni: <strong>(1) tempo caregiver</strong> recuperato (giornate × costo medio), <strong>(2) emissioni CO₂</strong> evitate (km percorsi × emissioni auto privata), <strong>(3) cure portate a termine</strong> (riduzione dropout terapeutico).
      </p>
      <p class="caption mt-12" style="font-size:11px">Report completo PDF disponibile in produzione · v0.1 POC</p>`,
    actions: [
      { label: 'Scarica PDF', kind: 'secondary', onClick: () => showToast('Generazione PDF simulata · download non attivo nel mockup', 'info') },
      { label: 'Chiudi', kind: 'shuttle' }
    ]
  });
}

function openAdminSettings() {
  openInfoModal({
    title: 'Impostazioni console',
    accent: 'shuttle',
    bodyHTML: `
      <div class="settings-list" style="background:#fff;border:1px solid var(--border-soft);border-radius:8px;overflow:hidden">
        <div class="settings-row" style="cursor:default;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)">
          ${aIcon('bell',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">Alert email su nuove richieste</p><p style="font-size:12px;color:var(--medium-gray)">Notifica immediata per ogni richiesta paziente</p></div>
          <button class="toggle-switch on" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="settings-row" style="cursor:default;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)">
          ${aIcon('shield',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">2FA obbligatorio per admin</p><p style="font-size:12px;color:var(--medium-gray)">App authenticator richiesta al login</p></div>
          <button class="toggle-switch on" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="settings-row" style="cursor:default;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)">
          ${aIcon('users',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">Auto-approvazione corse</p><p style="font-size:12px;color:var(--medium-gray)">Approva automaticamente le corse con wallet sufficiente</p></div>
          <button class="toggle-switch" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="settings-row" style="cursor:default;padding:14px 16px;display:flex;align-items:center;gap:12px">
          ${aIcon('truck',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">Inoltro automatico a AureaVia</p><p style="font-size:12px;color:var(--medium-gray)">Spinta automatica sulla flotta dopo approvazione</p></div>
          <button class="toggle-switch on" onclick="this.classList.toggle('on')"></button>
        </div>
      </div>
      <style>.toggle-switch{position:relative;width:38px;height:22px;background:var(--border-gray);border-radius:999px;border:none;cursor:pointer;transition:background .15s}.toggle-switch::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .15s}.toggle-switch.on{background:var(--shuttle-teal)}.toggle-switch.on::after{transform:translateX(16px)}</style>`,
    actions: [
      { label: 'Annulla', kind: 'secondary' },
      { label: 'Salva impostazioni', kind: 'shuttle', onClick: () => showToast('Impostazioni console salvate', 'shuttle') }
    ]
  });
}

function openAdminNotifications() {
  const items = [
    { ico: 'check-circle', accent: 'shuttle', title: 'Corsa approvata', body: 'Approvata RIDE-AS-1024 (Lucia Marchetti → Gemelli) e inoltrata a Radiotaxi 3570.', when: '12 min fa' },
    { ico: 'info',         accent: 'orange',  title: '4 corse in attesa', body: 'Coda approvazioni con 4 nuove richieste in attesa.', when: '38 min fa' },
    { ico: 'wallet',       accent: 'shuttle', title: 'Wallet basso · 3 compagnie', body: 'Pronto Taxi 5570, EUR Taxi e altre 1 sotto soglia €1.500.', when: '2 ore fa' },
    { ico: 'leaf',         accent: 'shuttle', title: 'Report ESG mensile pronto', body: 'Il PDF del report ESG di maggio è disponibile per il download.', when: 'oggi' }
  ];
  openInfoModal({
    title: 'Notifiche console',
    subtitle: `${items.length} eventi recenti`,
    accent: 'shuttle',
    bodyHTML: items.map(n => `
      <div class="list-row" style="cursor:default">
        <div class="row-icon ${n.accent === 'orange' ? 'warm' : ''}">${aIcon(n.ico, { size: 18 })}</div>
        <div class="row-body">
          <div class="row-title">${n.title}</div>
          <div class="row-meta">${n.body}</div>
          <div class="row-meta caption" style="margin-top:4px">${n.when}</div>
        </div>
      </div>`).join(''),
    actions: [
      { label: 'Segna come letti', kind: 'ghost', onClick: () => showToast('Notifiche marcate come lette', 'info') },
      { label: 'Chiudi', kind: 'shuttle' }
    ]
  });
}

// ---------- Menu "Altro" della bottom-bar admin su mobile ----------
// Su mobile la sidebar admin si riduce a 4 voci primarie + uno slot "Altro" che apre
// un'action sheet con KPI ESG, Impostazioni ed Esci.
function openMoreAdminMenu() {
  openInfoModal({
    title: 'Altre azioni console',
    accent: 'shuttle',
    bodyHTML: `
      <div class="settings-list" style="background:#fff;border:1px solid var(--border-soft);border-radius:8px;overflow:hidden">
        <a class="settings-row" href="#" data-action="esg" style="padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft);text-decoration:none;color:inherit">
          ${aIcon('leaf',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">Report KPI ESG</p><p style="font-size:12px;color:var(--medium-gray)">Impatto aggregato della rete</p></div>
          ${aIcon('chevron-right',{size:16,cls:'text-muted'})}
        </a>
        <a class="settings-row" href="#" data-action="settings" style="padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft);text-decoration:none;color:inherit">
          ${aIcon('settings',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">Impostazioni console</p><p style="font-size:12px;color:var(--medium-gray)">Notifiche, 2FA, auto-approvazione</p></div>
          ${aIcon('chevron-right',{size:16,cls:'text-muted'})}
        </a>
        <a class="settings-row danger" href="#" data-action="logout" style="padding:14px 16px;display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--error)">
          ${aIcon('log-out',{size:18})}
          <div style="flex:1"><p style="font-weight:600;font-size:14px">Esci dalla console</p><p style="font-size:12px;color:var(--medium-gray)">Logout Aurea Suite</p></div>
          ${aIcon('chevron-right',{size:16,cls:'text-muted'})}
        </a>
      </div>`,
    actions: [{ label: 'Chiudi', kind: 'secondary' }]
  });
  // Hook delle 3 voci dopo il mount
  setTimeout(() => {
    const overlay = document.querySelector('.modal-overlay.active:last-of-type') || document.querySelector('.modal-overlay.active');
    if (!overlay) return;
    overlay.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const action = el.dataset.action;
        overlay.remove();
        if (action === 'esg') openEsgReport();
        else if (action === 'settings') openAdminSettings();
        else if (action === 'logout') logout();
      });
    });
  }, 30);
}

// ---------- Mappe OpenStreetMap (Leaflet, frontend-only) ----------
// Tutto qui è puramente client-side: niente backend, niente geocoder esterno.
// Il "geocoder" interno usa MOCK.romaGeo.landmarks + MOCK.structures per riconoscere
// indirizzi/strutture comuni di Roma; fallback sul centro di Roma.

window.aureaMap = (function () {
  // Stesso stile delle altre tile tiles OSM (gratis, attribution required).
  const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const ATTR     = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  function defaultCenter() {
    return (window.MOCK && MOCK.romaGeo && MOCK.romaGeo.center) || { lat: 41.9028, lng: 12.4964 };
  }

  // Cerca prima fra le strutture sanitarie (match per nome / quartiere), poi fra i landmark.
  function geocodeAddress(text) {
    if (!text) return null;
    const q = text.toLowerCase().trim();

    // Strutture (riconoscimento per nome o chunk lungo)
    if (window.MOCK && MOCK.structures) {
      const s = MOCK.structures.find(s => {
        const n = s.name.toLowerCase();
        // "gemelli" / "policlinico gemelli" / "policlinico universitario a. gemelli"
        return q.includes(n.split(' ').slice(0, 1)[0]) && q.length >= 4 && (q.includes(n.split(' ')[1] || n.split(' ')[0]));
      }) || MOCK.structures.find(s => q.includes(s.name.toLowerCase().split(' ')[0]) && s.name.toLowerCase().includes(q.split(' ')[0]));
      if (s && s.lat) return { lat: s.lat, lng: s.lng, label: s.name, kind: 'structure' };
    }

    // Landmark Roma per strada/quartiere
    if (window.MOCK && MOCK.romaGeo) {
      const hit = MOCK.romaGeo.landmarks.find(l => q.includes(l.match));
      if (hit) return { lat: hit.lat, lng: hit.lng, label: text, kind: 'address' };
    }
    return null;
  }

  function looksLikeLeafletReady() {
    return typeof window.L !== 'undefined' && typeof L.map === 'function';
  }

  // Crea la mappa nel container e disegna marker partenza/arrivo + linea tratteggiata.
  // opts: { fromText, toText, fromCoords, toCoords, interactive, zoomControl }
  function renderRideMap(container, opts) {
    if (!container) return null;
    if (!looksLikeLeafletReady()) {
      // Fallback grazioso: mantieni il placeholder + watermark
      container.innerHTML = '<div class="map-watermark">// Leaflet non caricato — fallback placeholder</div>';
      return null;
    }
    opts = opts || {};
    container.innerHTML = '';

    const from = opts.fromCoords || geocodeAddress(opts.fromText) || defaultCenter();
    const to   = opts.toCoords   || geocodeAddress(opts.toText)   || null;

    const map = L.map(container, {
      zoomControl: opts.zoomControl !== false,
      attributionControl: true,
      dragging: opts.interactive !== false,
      scrollWheelZoom: opts.interactive !== false,
      doubleClickZoom: opts.interactive !== false,
      boxZoom: opts.interactive !== false,
      keyboard: opts.interactive !== false,
      tap: opts.interactive !== false,
      touchZoom: opts.interactive !== false
    });
    L.tileLayer(TILE_URL, { attribution: ATTR, maxZoom: 19 }).addTo(map);

    const teal   = (getComputedStyle(document.documentElement).getPropertyValue('--shuttle-teal').trim()) || '#0EA5A4';
    const orange = (getComputedStyle(document.documentElement).getPropertyValue('--primary-orange').trim()) || '#FF8C00';

    function pinIcon(color, label) {
      return L.divIcon({
        className: 'aurea-leaflet-pin',
        html: `<span style="display:inline-block;width:22px;height:22px;border:3px solid #fff;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,.25);position:relative">
                 <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);font-size:10px;font-weight:700;color:#fff">${label || ''}</span>
               </span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22]
      });
    }

    const markers = [];
    if (from) {
      const m = L.marker([from.lat, from.lng], { icon: pinIcon(orange, 'A') })
        .bindTooltip(opts.fromText || 'Partenza', { direction: 'top', offset: [0, -18] })
        .addTo(map);
      markers.push(m);
    }
    if (to) {
      const m = L.marker([to.lat, to.lng], { icon: pinIcon(teal, 'B') })
        .bindTooltip(opts.toText || to.label || 'Destinazione', { direction: 'top', offset: [0, -18] })
        .addTo(map);
      markers.push(m);
    }

    if (from && to) {
      L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
        color: teal, weight: 4, opacity: 0.85, dashArray: '8 8'
      }).addTo(map);
      map.fitBounds([[from.lat, from.lng], [to.lat, to.lng]], { padding: [40, 40] });
    } else if (from) {
      map.setView([from.lat, from.lng], 13);
    } else {
      const c = defaultCenter();
      map.setView([c.lat, c.lng], 12);
    }

    return { map, markers, geocode: geocodeAddress };
  }

  return { renderRideMap, geocodeAddress, defaultCenter };
})();

// ---------- Handoff da AureaCare: parser URL ----------
// Esempio: book-ride.html?from=aureacare&booking_id=AC-1234&dest=Policlinico+Gemelli&date=2026-06-15&time=14:30&service=Visita+cardiologica
function readCareHandoff() {
  const p = new URLSearchParams(location.search);
  if (p.get('from') !== 'aureacare') return null;
  return {
    booking_id: p.get('booking_id') || '',
    dest: (p.get('dest') || '').replace(/\+/g, ' '),
    date: p.get('date') || '',
    time: p.get('time') || '',
    service: (p.get('service') || '').replace(/\+/g, ' ')
  };
}

// ---------- Init globale ----------
document.addEventListener('DOMContentLoaded', () => {
  // app switcher trigger se presente
  document.querySelectorAll('[data-app-switcher]').forEach(el => mountAppSwitcher(el));

  // active bottom nav
  const path = location.pathname.split('/').pop().split('?')[0] || 'home.html';
  document.querySelectorAll('.bottom-nav .nav-item').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ESC chiude overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.confirm-overlay').forEach(el => el.remove());
      document.querySelectorAll('.sheet, .sheet-backdrop').forEach(el => el.classList.remove('open'));
      closeModal();
      const dd = document.getElementById('appSwitcherDropdown');
      if (dd) dd.classList.remove('open');
    }
  });
});
