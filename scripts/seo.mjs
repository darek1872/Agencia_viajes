import { real } from './templating.mjs';

export function buildSitemap({ pages, siteUrl, indexing }) {
  if (!indexing) return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';
  const urls = pages.filter((p) => p.sitemap !== false).map((p) =>
    `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n    <changefreq>${p.changefreq || 'monthly'}</changefreq>\n    <priority>${p.priority || '0.5'}</priority>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export function buildRobots({ siteUrl, indexing }) {
  if (!indexing) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

/** llms.txt: descripción para asistentes de IA. Solo datos reales; no garantiza indexación ni posicionamiento. */
export function buildLlms({ site, pages, siteUrl }) {
  const name = real(site.name) ? site.name : 'Agencia de viajes';
  const lines = [`# ${name}`, '', '> Agencia de viajes que organiza viajes a medida: paquetes, circuitos, cruceros y escapadas, con asesoramiento personal y presupuesto gratuito sin compromiso.', ''];
  const contact = [];
  if (real(site.phoneDisplay)) contact.push(`- Teléfono: ${site.phoneDisplay}`);
  if (real(site.email)) contact.push(`- Correo: ${site.email}`);
  if (real(site.addressStreet) && real(site.addressLocality)) contact.push(`- Dirección: ${site.addressStreet}, ${site.postalCode && real(site.postalCode) ? site.postalCode + ' ' : ''}${site.addressLocality}`);
  if (real(site.hoursText)) contact.push(`- Horario: ${site.hoursText}`);
  lines.push('## Servicios', '', '- Paquetes de viaje', '- Circuitos', '- Cruceros', '- Escapadas', '- Viajes a medida con presupuesto personalizado', '');
  lines.push('## Páginas principales', '');
  for (const p of pages.filter((x) => x.sitemap !== false)) {
    const title = p.title.replace(/\s*\|.*$/, '').replace(/\{\{[^}]+\}\}/g, '').trim();
    lines.push(`- [${title}](${siteUrl}${p.path}): ${p.description.replace(/\{\{[^}]+\}\}/g, '').trim()}`);
  }
  if (contact.length) lines.push('', '## Contacto', '', ...contact);
  return lines.join('\n') + '\n';
}

export function buildManifest({ site }) {
  const name = real(site.name) ? site.name : 'Agencia de viajes';
  return JSON.stringify({ name, short_name: name.slice(0, 12), lang: 'es', start_url: '/', display: 'browser', theme_color: '#0b2545', background_color: '#f7f9fb',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2);
}
