/** Interacciones de la interfaz (sin dependencias): menú, buscador, enlaces con prefill y formularios. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FORM_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT || '').trim();
const FORM_KEY = (import.meta.env.VITE_FORM_ACCESS_KEY || '').trim();

/* ---------- Menú móvil ---------- */
function initMenu() {
  const btn = $('#menu-btn'); const panel = $('#mobile-menu');
  if (!btn || !panel) return;
  const set = (open) => {
    panel.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    $('.menu-open', btn)?.classList.toggle('hidden', open);
    $('.menu-close', btn)?.classList.toggle('hidden', !open);
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
  window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

/* ---------- Prefill del formulario de presupuesto ---------- */
const quoteForm = () => $('#form-presupuesto');
function prefill(values) {
  const f = quoteForm(); if (!f) return false;
  const put = (id, v) => { const el = $(id, f); if (el && v) el.value = v; };
  const { tipo, estilo, destino, fechas, viajeros, origen } = values;
  if (tipo) { const s = $('#f-tipo', f); if ($$('option', s).some((o) => o.value === tipo)) s.value = tipo; }
  if (estilo) { const s = $('#f-estilo', f); if ($$('option', s).some((o) => o.value === estilo)) s.value = estilo; }
  put('#f-destino', destino); put('#f-fechas', fechas); put('#f-viajeros', viajeros);
  if (origen) { const m = $('#f-mensaje', f); if (m && !m.value) m.value = `Salida desde: ${origen}`; }
  return true;
}
function goToForm() {
  const section = $('#viaje-medida'); if (!section) return;
  section.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', '#viaje-medida');
  const first = $('#f-destino') || $('#f-nombre');
  setTimeout(() => first?.focus({ preventScroll: true }), reduceMotion() ? 0 : 600);
}

function initPrefillLinks() {
  const onHome = !!quoteForm();
  // Parámetros (fallback sin JS del buscador: /?destino=...#viaje-medida)
  const q = new URLSearchParams(location.search);
  if (onHome && [...q.keys()].length) {
    prefill(Object.fromEntries(['tipo', 'estilo', 'destino', 'fechas', 'viajeros', 'origen'].map((k) => [k, q.get(k) || ''])));
    history.replaceState(null, '', location.pathname + location.hash);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-tipo],a[data-estilo],a[data-destino]');
    if (!a || !onHome || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href') || '';
    if (!/^\/?#viaje-medida$/.test(href)) return;
    e.preventDefault();
    prefill({ tipo: a.dataset.tipo, estilo: a.dataset.estilo, destino: a.dataset.destino });
    goToForm();
  });
}

/* ---------- Buscador del hero ---------- */
function initSearch() {
  const form = $('#search-form'); if (!form) return;
  const tabs = $$('.search-tab-btn'); const tipo = $('#search-tipo');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
    tipo.value = t.dataset.tab;
  }));
  $$('[data-destino-chip]').forEach((c) => c.addEventListener('click', () => { $('#s-destino').value = c.dataset.destinoChip; $('#s-destino').focus(); }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    prefill({ tipo: tipo.value, destino: $('#s-destino').value.trim(), fechas: $('#s-fechas').value.trim(), viajeros: $('#s-viajeros').value.trim(), origen: $('#s-origen').value.trim() });
    goToForm();
  });
}

/* ---------- Formularios: validación, envío real y estados ---------- */
function showStatus(form, kind, nodes) {
  const box = $('[data-form-status]', form);
  box.className = 'rounded-xl px-4 py-3 font-body-sm text-body-sm ' + (kind === 'ok' ? 'bg-[#E6F7F5] text-[#004e59]' : 'bg-error-container text-on-error-container');
  box.setAttribute('role', kind === 'ok' ? 'status' : 'alert');
  box.replaceChildren(...nodes);
  box.focus();
}
const text = (s) => document.createTextNode(s);
function contactFallback() {
  const wa = $('a[href^="https://wa.me/"]'); const mail = $('a[href^="mailto:"]');
  const frag = [text(' Puedes escribirnos por ')];
  if (wa) { const a = document.createElement('a'); a.href = wa.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'underline font-semibold'; a.textContent = 'WhatsApp'; frag.push(a, text(' o por ')); }
  if (mail) { const a = document.createElement('a'); a.href = mail.href; a.className = 'underline font-semibold'; a.textContent = 'correo electrónico'; frag.push(a); }
  frag.push(text('.'));
  return frag;
}

function initForms() {
  $$('form[data-form]').forEach((form) => {
    form.addEventListener('input', (e) => e.target.removeAttribute?.('aria-invalid'));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.elements._gotcha?.value) return; // antispam: honeypot relleno
      const invalid = $$('input,select,textarea', form).filter((el) => !el.checkValidity());
      $$('input,select,textarea', form).forEach((el) => el.removeAttribute('aria-invalid'));
      if (invalid.length) {
        invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
        showStatus(form, 'error', [text('Revisa los campos marcados: faltan datos obligatorios o alguno no es válido (recuerda aceptar la política de privacidad).')]);
        invalid[0].focus();
        return;
      }
      if (!FORM_ENDPOINT) {
        showStatus(form, 'error', [text('El envío de formularios aún no está configurado en este sitio.'), ...contactFallback()]);
        return;
      }
      const btn = $('button[type="submit"]', form); const label = $('[data-submit-label]', form);
      const original = label.textContent;
      btn.disabled = true; label.textContent = 'Enviando…';
      const data = Object.fromEntries(new FormData(form));
      delete data._gotcha;
      data.subject = `[Web] ${data.formulario || 'Formulario'}`;
      if (FORM_KEY) data.access_key = FORM_KEY;
      const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), signal: ctrl.signal });
        const body = await res.json().catch(() => ({}));
        if (!res.ok || body.success === false || body.ok === false) throw new Error(body.message || `HTTP ${res.status}`);
        form.reset();
        showStatus(form, 'ok', [text(form.dataset.form === 'newsletter' ? '¡Listo! Te has suscrito correctamente.' : '¡Gracias! Hemos recibido tu solicitud y te responderemos lo antes posible.')]);
      } catch (err) {
        showStatus(form, 'error', [text('No hemos podido enviar el formulario. Inténtalo de nuevo en unos minutos.'), ...contactFallback()]);
      } finally {
        clearTimeout(timer); btn.disabled = false; label.textContent = original;
      }
    });
  });
}

export function initUI() {
  initMenu(); initPrefillLinks(); initSearch(); initForms();
}
