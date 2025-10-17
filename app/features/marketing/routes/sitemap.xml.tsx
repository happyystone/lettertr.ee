// import { db } from '@/db';
// import { newsletterSources } from '@/features/newsletter/schema';

export async function loader() {
  const baseUrl = process.env.VITE_PUBLIC_APP_URL;

  // Fetch all sources for dynamic URLs
  // const allSources = await db
  //   .select({
  //     id: newsletterSources.id,
  //     name: newsletterSources.name,
  //     updatedAt: newsletterSources.updatedAt,
  //   })
  //   .from(newsletterSources)
  //   .limit(100);

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    // { loc: '/discover', priority: 0.9, changefreq: 'daily' },
    // { loc: '/letters', priority: 0.8, changefreq: 'daily' },
    // { loc: '/pricing', priority: 0.7, changefreq: 'weekly' },
    // { loc: '/about', priority: 0.6, changefreq: 'monthly' },
    { loc: '/terms', priority: 0.5, changefreq: 'monthly' },
    { loc: '/privacy', priority: 0.5, changefreq: 'monthly' },
  ];

  // Generate sitemap XML
  // xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  // xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  // )
  // .join('')}
  // ${allSources
  // .map(
  //   (source: any) => `
  // <url>
  // <loc>${baseUrl}/discover/${source.id}</loc>
  // <lastmod>${
  //   source.updatedAt
  //     ? new Date(source.updatedAt).toISOString().split('T')[0]
  //     : new Date().toISOString().split('T')[0]
  // }</lastmod>
  // <changefreq>weekly</changefreq>
  // <priority>0.7</priority>
  // </url>`,
  // )
  // .join('')}
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', //, s-maxage=7200',
    },
  });
}
