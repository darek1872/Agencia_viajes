/**
 * Mini motor de plantillas para el HTML (se ejecuta en Vite y en los scripts de comprobación).
 *  <!-- include:archivo.html -->        incluye src/partials/archivo.html (anidable)
 *  {{#if site.instagram}}...{{/if}}      bloque condicional
 *  {{icon:nombre|clases}}                icono del sprite
 *  {{img:nombre|alt|clases|sizes|eager}} <img> responsive (alt "auto" = el del manifiesto, "none" = decorativa)
 *  {{ruta.variable}}                     variable escapada (site.*, page.*, siteUrl, year...)
 *  {{sprite}} {{jsonld}} {{breadcrumb}}  bloques generados
 * Una variable inexistente lanza error: así se detectan erratas al compilar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spriteSvg, icons } from '../src/icons.js';

export const isMarker = (v) => typeof v === 'string' && v.includes('[[');
export const real = (v) => typeof v === 'string' && v.trim() !== '' && !isMarker(v);
export const stripMarkers = (s) => String(s).replace(/\s*\|\s*\[\[[^\]]*\]\]/g, '').replace(/\[\[[^\]]*\]\]/g, '').replace(/\s{2,}/g, ' ').trim();
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);

export function buildJsonLd({ site, page, siteUrl }) {
  const abs = (p) => siteUrl + p;
  const orgId = abs('/#organization');
  const hasAddress = ['addressStreet', 'addressLocality', 'postalCode'].every((k) => real(site[k]));
  const org = { '@type': hasAddress ? 'TravelAgency' : 'Organization', '@id': orgId, url: abs('/'), logo: abs('/icon-512.png') };
  if (real(site.name)) org.name = site.name;
  if (real(site.legalName)) org.legalName = site.legalName;
  if (real(site.phoneTel)) org.telephone = site.phoneTel;
  if (real(site.email)) org.email = site.email;
  if (hasAddress) {
    org.image = abs(page.ogImage || '/og/og-default.jpg');
    org.address = { '@type': 'PostalAddress', streetAddress: site.addressStreet, addressLocality: site.addressLocality, postalCode: site.postalCode, addressCountry: site.country };
    if (real(site.addressRegion)) org.address.addressRegion = site.addressRegion;
    if (site.openingHours?.length) {
      org.openingHoursSpecification = site.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }));
    }
  }
  const sameAs = [site.instagram, site.facebook].filter(real);
  if (sameAs.length) org.sameAs = sameAs;

  const graph = [org];
  if (page.path === '/') {
    const website = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), inLanguage: 'es-ES', publisher: { '@id': orgId } };
    if (real(site.name)) website.name = site.name;
    graph.push(website);
  }
  const pageUrl = abs(page.path);
  const wp = { '@type': page.schema || 'WebPage', '@id': pageUrl + '#webpage', url: pageUrl, name: stripMarkers(page.title), description: stripMarkers(page.description), inLanguage: 'es-ES', isPartOf: { '@id': abs('/#website') } };
  if (page.breadcrumb) wp.breadcrumb = { '@id': pageUrl + '#breadcrumb' };
  if (page.path === '/') wp.about = { '@id': orgId };
  graph.push(wp);
  if (page.breadcrumb) {
    graph.push({
      '@type': 'BreadcrumbList', '@id': pageUrl + '#breadcrumb',
      itemListElement: page.breadcrumb.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: abs(b.path) }))
    });
  }
  // Se omite el nodo WebSite fuera de la portada: las demás páginas lo referencian por @id.
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function createRenderer({ root, site, pages, siteUrl, indexing = true, images = null, imagesFallback = [] }) {
  const partialsDir = path.join(root, 'src/partials');
  const year = new Date().getFullYear();
  const imgBy = Object.fromEntries((images || []).map((i) => [i.name, i]));
  const fbBy = Object.fromEntries(imagesFallback.map((i) => [i.name, i]));

  function imgTag(spec) {
    const [name, alt = 'auto', cls = '', sizes = '100vw', mode = 'lazy'] = spec.split('|').map((s) => s.trim());
    const built = imgBy[name]; const fb = fbBy[name];
    if (!fb) throw new Error(`Imagen desconocida en plantilla: ${name}`);
    const altText = alt === 'none' ? '' : alt === 'auto' ? fb.alt : alt;
    const eager = mode === 'eager';
    const loading = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
    if (!built) {
      if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_REMOTE_IMAGES) throw new Error(`Falta la imagen procesada "${name}". Ejecuta: npm run images`);
      return `<img src="${esc(fb.url)}" alt="${esc(altText)}" class="${esc(cls)}" width="${fb.widths.at(-1)}" height="${Math.round((fb.widths.at(-1) * fb.ratioH) / fb.ratioW)}" ${loading}>`;
    }
    const srcset = built.files.map((f) => `${f.url} ${f.w}w`).join(', ');
    const last = built.files.at(-1);
    return `<img src="${last.url}" srcset="${srcset}" sizes="${esc(sizes)}" alt="${esc(altText)}" class="${esc(cls)}" width="${built.width}" height="${built.height}" ${loading}>`;
  }
  const heroSrcset = () => (imgBy.hero ? imgBy.hero.files.map((f) => `${f.url} ${f.w}w`).join(', ') : '');

  function pageCtx(page) {
    const base = { site, siteUrl, year };
    const interp = (s) => String(s).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => String(get(base, k) ?? ''));
    const url = siteUrl + page.path;
    const robots = !indexing ? 'noindex, nofollow' : page.robots || 'index, follow, max-image-preview:large';
    return {
      ...base,
      page: { ...page, title: interp(page.title), description: interp(page.description), url, robots,
        canonical: page.canonical === false ? '' : url, ogImageUrl: siteUrl + (page.ogImage || '/og/og-default.jpg'),
        ogImageAlt: page.ogImageAlt || '' },
      hero: { srcset: page.preloadHero ? heroSrcset() : '' }
    };
  }

  function breadcrumbHtml(page) {
    if (!page.breadcrumb) return '';
    const items = page.breadcrumb.map((b, i, a) => {
      const last = i === a.length - 1;
      return last
        ? `<li aria-current="page" class="text-primary font-semibold">${esc(b.name)}</li>`
        : `<li class="flex items-center gap-1.5"><a class="hover:text-secondary underline-offset-2 hover:underline" href="${b.path}">${esc(b.name)}</a><svg class="w-3.5 h-3.5" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg></li>`;
    });
    return `<nav aria-label="Migas de pan" class="max-w-7xl mx-auto px-margin-mobile md:px-margin pt-6"><ol class="flex flex-wrap items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">${items.join('')}</ol></nav>`;
  }

  function render(html, fileRel) {
    const page = pages.find((p) => p.file === fileRel);
    if (!page) throw new Error(`Página sin configuración en src/pages.config.js: ${fileRel}`);
    const ctx = pageCtx(page);
    let out = html;
    for (let i = 0; i < 5 && /<!--\s*include:/.test(out); i++) {
      out = out.replace(/<!--\s*include:([\w\-./]+)\s*-->/g, (_, f) => fs.readFileSync(path.join(partialsDir, f), 'utf8'));
    }
    for (let i = 0; i < 4 && out.includes('{{#if'); i++) {
      out = out.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, k, body) => { const v = get(ctx, k); return v && !(typeof v === 'string' && v.trim() === '') ? body : ''; });
    }
    out = out.replace(/\{\{icon:([\w-]+)(?:\|([^}]*))?\}\}/g, (_, n, cls = '') => {
      if (!icons[n]) throw new Error(`Icono inexistente: ${n}`);
      return `<svg class="icon ${esc(cls.trim())}" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
    });
    out = out.replace(/\{\{img:([^}]+)\}\}/g, (_, spec) => imgTag(spec));
    out = out.replace(/\{\{sprite\}\}/g, spriteSvg());
    out = out.replace(/\{\{breadcrumb\}\}/g, () => breadcrumbHtml(page));
    out = out.replace(/\{\{jsonld\}\}/g, () => `<script type="application/ld+json">${JSON.stringify(buildJsonLd({ site, page: ctx.page, siteUrl })).replace(/</g, '\\u003c')}</script>`);
    out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
      const v = get(ctx, k);
      if (v === undefined) throw new Error(`Variable de plantilla no definida: {{${k}}} en ${fileRel}`);
      return esc(v);
    });
    return out;
  }
  return { render, pageCtx };
}
