export default function sitemap() {
  const baseUrl = 'https://eia-matrix-studio.vercel.app';
  
  const routes = [
    '',
    '/matrices',
    '/matrices/leopold',
    '/matrices/conesa',
    '/matrices/battelle',
    '/selector',
    '/fundamentos',
    '/casos',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
