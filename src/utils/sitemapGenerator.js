export function generateSitemap(poems) {
  const baseUrl = 'https://poetry-blog.ashishsaranshakya.com';
  const staticRoutes = [
    '/',
    '/explore',
    '/about-author',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticRoutes.forEach(route => {
    xml += `  <url><loc>${baseUrl}${route}</loc></url>\n`;
  });

  poems.forEach(poem => {
    xml += `  <url><loc>${baseUrl}/poem/${poem.id}</loc></url>\n`;
  });

  xml += `</urlset>`;

  console.log(xml);

  const blob = new Blob([xml], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap.xml';
  a.click();
};