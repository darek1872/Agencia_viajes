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
  // En la portada el destino es la sección #viaje-medida; en /contacto/ el propio formulario.
  const section = $('#viaje-medida') || quoteForm(); if (!section) return;
  section.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  if (section.id === 'viaje-medida') history.replaceState(null, '', '#viaje-medida');
  const first = $('#f-destino') || $('#f-nombre');
  setTimeout(() => first?.focus({ preventScroll: true }), reduceMotion() ? 0 : 600);
}

const PREFILL_KEY = 'prefill-presupuesto';
function initPrefillLinks() {
  const hasForm = !!quoteForm(); // portada y /contacto/ tienen formulario de presupuesto
  // Parámetros (fallback sin JS del buscador: /?destino=...#viaje-medida)
  const q = new URLSearchParams(location.search);
  if (hasForm && [...q.keys()].length) {
    prefill(Object.fromEntries(['tipo', 'estilo', 'destino', 'fechas', 'viajeros', 'origen'].map((k) => [k, q.get(k) || ''])));
    history.replaceState(null, '', location.pathname + location.hash);
  }
  // Selección hecha en otra página (p. ej. el menú desde /contacto/): se recupera aquí.
  if (hasForm) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(PREFILL_KEY) || 'null');
      if (saved) { prefill(saved); sessionStorage.removeItem(PREFILL_KEY); }
    } catch { /* sin sessionStorage: se ignora */ }
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-tipo],a[data-estilo],a[data-destino]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href') || '';
    if (!/^\/?#viaje-medida$/.test(href)) return;
    const values = { tipo: a.dataset.tipo, estilo: a.dataset.estilo, destino: a.dataset.destino };
    if (!hasForm) { // la navegación sigue su curso; la selección viaja en sessionStorage
      try { sessionStorage.setItem(PREFILL_KEY, JSON.stringify(values)); } catch { /* ignorar */ }
      return;
    }
    e.preventDefault();
    prefill(values);
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

/* ---------- Formularios: validación, modo demostración y envío real ----------
   - Con VITE_FORM_ENDPOINT definido: se envía de verdad (JSON) y solo se confirma si el servicio responde OK.
   - Sin endpoint (modo demostración): se valida y se simula. NO se envía nada, NO se guarda nada, y el mensaje lo dice. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,20}$/;
const DEMO_DELAY = 700;

function validateField(el, form) {
  const v = (el.value || '').trim();
  if (el.type === 'checkbox') return !el.required || el.checked ? '' : (form.dataset.form === 'newsletter' ? 'Debes aceptar para suscribirte.' : 'Debes aceptar la política de privacidad para continuar.');
  if (el.required && !v) return { nombre: 'Escribe tu nombre.', telefono: 'Escribe un teléfono de contacto.', email: 'Escribe tu correo electrónico.' }[el.name] || 'Este campo es obligatorio.';
  if (el.name === 'nombre' && v.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  if (el.type === 'email' && v && !EMAIL_RE.test(v)) return 'Introduce un correo válido, por ejemplo nombre@dominio.com.';
  if (el.type === 'tel' && v) { const digits = v.replace(/\D/g, ''); if (!PHONE_RE.test(v) || digits.length < 9 || digits.length > 15) return 'Introduce un teléfono válido (entre 9 y 15 dígitos).'; }
  return '';
}

function errorAnchor(el) {
  if (el.type === 'checkbox') return el.parentElement;
  const p = el.parentElement;
  return p.classList.contains('relative') || p.classList.contains('sm:flex-row') ? p : el;
}
function setFieldError(el, form, message) {
  const id = `err-${el.id}`;
  let box = document.getElementById(id);
  if (!message) { box?.remove(); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); return; }
  if (!box) {
    box = document.createElement('p'); box.id = id;
    box.className = 'mt-1 font-body-sm text-xs font-semibold ' + (form.dataset.form === 'newsletter' ? 'text-error-container' : 'text-error');
    errorAnchor(el).insertAdjacentElement('afterend', box);
  }
  box.textContent = message; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id);
}

const STATUS_STYLES = {
  ok: 'bg-[#E6F7F5] text-[#004e59]',
  demo: 'bg-[#FFF4E5] text-[#7A4300]',
  error: 'bg-error-container text-on-error-container'
};
function showStatus(form, kind, nodes) {
  const box = $('[data-form-status]', form);
  box.className = 'rounded-xl px-4 py-3 font-body-sm text-body-sm ' + STATUS_STYLES[kind];
  box.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  box.replaceChildren(...nodes);
  box.focus();
}
const text = (s) => document.createTextNode(s);
const strong = (s) => { const e = document.createElement('strong'); e.textContent = s; return e; };
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
    const fields = () => $$('input,select,textarea', form).filter((el) => el.name && el.name !== '_gotcha');
    // Al corregir un campo se retira su error en cuanto es válido
    form.addEventListener('input', (e) => { const el = e.target; if (el.id && document.getElementById(`err-${el.id}`) && !validateField(el, form)) setFieldError(el, form, ''); });
    form.addEventListener('change', (e) => { const el = e.target; if (el.id && document.getElementById(`err-${el.id}`) && !validateField(el, form)) setFieldError(el, form, ''); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.sending === '1') return;            // evita dobles envíos
      if (form.elements._gotcha?.value) return;            // antispam: honeypot relleno
      const errors = fields().map((el) => [el, validateField(el, form)]);
      errors.forEach(([el, msg]) => setFieldError(el, form, msg));
      const bad = errors.filter(([, m]) => m);
      if (bad.length) {
        showStatus(form, 'error', [text(`Revisa los datos: ${bad.length === 1 ? 'hay 1 campo' : `hay ${bad.length} campos`} por corregir.`)]);
        bad[0][0].focus();
        return;
      }
      const btn = $('button[type="submit"]', form); const label = $('[data-submit-label]', form);
      const original = label.textContent;
      form.dataset.sending = '1'; form.setAttribute('aria-busy', 'true'); btn.disabled = true; label.textContent = 'Enviando…';
      const isNews = form.dataset.form === 'newsletter';
      try {
        if (!FORM_ENDPOINT) {
          // MODO DEMOSTRACIÓN: se simula la espera, pero no sale ningún dato de esta página.
          await new Promise((r) => setTimeout(r, DEMO_DELAY));
          showStatus(form, 'demo', [strong('Simulación (modo demostración). '), text(isNews
            ? 'El correo es válido, pero no se ha suscrito a nadie ni se ha enviado ningún dato.'
            : 'Los datos son válidos, pero no se ha enviado ninguna solicitud ni se ha guardado ningún dato. Esta web es una demostración.')]);
          return;
        }
        const data = Object.fromEntries(new FormData(form));
        delete data._gotcha;
        data.subject = `[Web] ${data.formulario || 'Formulario'}`;
        if (FORM_KEY) data.access_key = FORM_KEY;
        const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 15000);
        try {
          const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), signal: ctrl.signal });
          const body = await res.json().catch(() => ({}));
          if (!res.ok || body.success === false || body.ok === false) throw new Error(body.message || `HTTP ${res.status}`);
        } finally { clearTimeout(timer); }
        form.reset();
        showStatus(form, 'ok', [text(isNews ? '¡Listo! Te has suscrito correctamente.' : '¡Gracias! Hemos recibido tu solicitud y te responderemos lo antes posible.')]);
      } catch (err) {
        showStatus(form, 'error', [text(err.name === 'AbortError' ? 'El servidor tarda demasiado en responder. Inténtalo de nuevo en unos minutos.' : 'No hemos podido enviar el formulario. Inténtalo de nuevo en unos minutos.'), ...contactFallback()]);
      } finally {
        delete form.dataset.sending; form.removeAttribute('aria-busy'); btn.disabled = false; label.textContent = original;
      }
    });
  });
}

/* ---------- Modo demostración: botones de contacto con comportamiento simulado ----------
   Con <meta name="demo-mode"> (site.demo = true), los enlaces tel:, mailto: y wa.me NO abren nada (el número y el correo son
   de ejemplo): muestran una ventana explicativa. Con datos reales (demo: false) este bloque no se activa y los enlaces funcionan. */
function initDemoContact() {
  if (!document.querySelector('meta[name="demo-mode"]')) return;
  const SELECTOR = 'a[href^="tel:"],a[href^="mailto:"],a[href^="https://wa.me/"]';
  const KINDS = {
    tel: { title: 'Llamada a la agencia', body: (a) => `En la web real, este botón llamaría a la agencia (${decodeURIComponent((a.getAttribute('href') || '').slice(4))}) desde tu móvil.` },
    mailto: { title: 'Correo electrónico', body: () => 'En la web real, este botón abriría tu programa de correo para escribir a la agencia.' },
    wa: { title: 'Chat de WhatsApp', body: () => 'En la web real, este botón abriría un chat de WhatsApp con la agencia y un mensaje de bienvenida.' }
  };
  let overlay = null; let opener = null;

  function close() {
    if (!overlay) return;
    overlay.remove(); overlay = null; document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', onKey, true);
    opener?.focus?.(); opener = null;
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab' || !overlay) return;
    const f = $$('button,a[href]', overlay); const first = f[0]; const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function open(a) {
    if (overlay) return;
    const href = a.getAttribute('href') || '';
    const kind = href.startsWith('tel:') ? KINDS.tel : href.startsWith('mailto:') ? KINDS.mailto : KINDS.wa;
    opener = a;
    overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm';
    overlay.innerHTML = '<div role="dialog" aria-modal="true" aria-labelledby="demo-dialog-title" class="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">'
      + '<p class="font-label-sm text-label-sm font-bold uppercase tracking-widest text-secondary">Modo demostración</p>'
      + '<h2 id="demo-dialog-title" class="mt-1 font-headline-sm text-xl font-bold text-primary"></h2>'
      + '<p data-demo-body class="mt-2 font-body-md text-body-md text-on-surface-variant"></p>'
      + '<p class="mt-2 font-body-sm text-body-sm text-on-surface-variant">Esta web es una demostración: no se ha realizado ninguna llamada, mensaje ni envío.</p>'
      + '<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">'
      + '<button type="button" data-demo-close class="rounded-xl bg-surface-container-low px-5 py-3 font-label-md text-label-md text-primary hover:bg-surface-container">Entendido</button>'
      + '<a href="/#viaje-medida" data-demo-quote class="btn-cta !py-3">Pedir presupuesto</a></div></div>';
    $('#demo-dialog-title', overlay).textContent = kind.title;
    $('[data-demo-body]', overlay).textContent = kind.body(a);
    overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.closest('[data-demo-close]')) close(); else if (e.target.closest('[data-demo-quote]')) close(); });
    document.body.append(overlay); document.body.classList.add('overflow-hidden');
    document.addEventListener('keydown', onKey, true);
    $('[data-demo-close]', overlay).focus();
  }
  // Captura: se adelanta a cualquier otro manejador y evita la apertura (también con Ctrl/Cmd+clic y clic central).
  document.addEventListener('click', (e) => { const a = e.target.closest(SELECTOR); if (!a || e.target.closest('[role="dialog"]')) return; e.preventDefault(); e.stopPropagation(); open(a); }, true);
  document.addEventListener('auxclick', (e) => { if (e.target.closest(SELECTOR)) e.preventDefault(); }, true);
}

export function initUI() {
  initMenu(); initPrefillLinks(); initSearch(); initForms(); initDemoContact();
}
