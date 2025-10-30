# SEO Strategy & Implementation

## 📈 SEO Overview

Comprehensive SEO implementation for AquatechIA dual-portal platform (IA + Environmental).

## 🎯 SEO Goals

- **Primary**: Rank top 3 for "herramientas IA" and "gestión ambiental IA"
- **Secondary**: Organic traffic growth of 100% within 6 months
- **Technical**: Core Web Vitals passing, 90+ Lighthouse score

## ✅ Technical SEO Implemented

### 1. **Meta Tags & Metadata**

All pages include comprehensive metadata:

```typescript
export const metadata: Metadata = {
  title: {
    default: "AquatechIA - IA + Gestión Ambiental",
    template: "%s | AquatechIA"
  },
  description: "Plataforma de IA para gestión ambiental sostenible",
  keywords: ["inteligencia artificial", "gestión ambiental", ...],
  authors: [{ name: "AquatechIA" }],
  openGraph: { ... },
  twitter: { ... },
  robots: { ... }
}
```

**Location**: Each `page.tsx` file

### 2. **Structured Data (JSON-LD)**

Implemented schemas:

- ✅ **Organization Schema**: Company information
- ✅ **WebSite Schema**: Site-wide searchability
- ✅ **BreadcrumbList**: Navigation breadcrumbs (TODO)
- ✅ **Article Schema**: Blog posts (TODO)
- ✅ **Course Schema**: Educational content (TODO)

**Location**: `app/layout.tsx` and individual pages

### 3. **Sitemap**

Dynamic XML sitemap generated at build time:

- ✅ All public pages included
- ✅ Priority scores assigned
- ✅ Change frequency specified
- ✅ Last modification dates
- ✅ Both portals (IA + Environmental)

**URL**: `/sitemap.xml`  
**Location**: `app/sitemap.ts`

### 4. **Robots.txt**

Optimized robots.txt with:

- ✅ Allow all search engines
- ✅ Disallow private routes (`/api/`, `/auth/`, `/perfil`)
- ✅ Block AI crawlers (GPTBot, Claude, etc.)
- ✅ Sitemap reference

**URL**: `/robots.txt`  
**Location**: `app/robots.ts`

### 5. **URL Structure**

SEO-friendly URL patterns:

```
✅ /ia                          # IA Portal home
✅ /ia/herramientas             # Tools listing
✅ /ia/herramientas/[slug]      # Individual tool
✅ /ia/blog                     # Blog listing
✅ /ia/cursos                   # Courses
✅ /ambiental/...               # Environmental portal (same structure)
```

**Best practices**:

- Lowercase slugs
- Hyphens for spaces
- Short and descriptive
- No query parameters in main URLs

### 6. **Canonical URLs**

Prevent duplicate content:

```typescript
alternates: {
  canonical: `${baseUrl}/ia/herramientas/${slug}`;
}
```

**Applied to**: All pages with potential duplicates

### 7. **Open Graph & Twitter Cards**

Social media optimization:

- ✅ OG images (1200x630px)
- ✅ OG titles and descriptions
- ✅ Twitter card type: `summary_large_image`
- ✅ Portal-specific branding

### 8. **Performance Optimization**

Core Web Vitals improvements:

- ✅ Next.js Image optimization (AVIF, WebP)
- ✅ Code splitting and lazy loading
- ✅ DNS prefetch for external resources
- ✅ Preconnect for critical resources
- ✅ Font optimization with `next/font`
- ✅ Compression enabled
- ✅ CDN delivery (Vercel)

**Targets**:

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### 9. **Mobile Optimization**

- ✅ Responsive design (Tailwind CSS)
- ✅ Mobile-first approach
- ✅ Touch-friendly UI elements
- ✅ Viewport meta tag configured
- ✅ Mobile-specific breakpoints

### 10. **Internationalization (i18n)**

Currently Spanish (es_ES), ready for expansion:

```typescript
<html lang="es">
  <meta property="og:locale" content="es_ES" />
</html>
```

**Planned**: English (en_US), Portuguese (pt_BR)

## 🔍 On-Page SEO

### Content Guidelines

1. **Title Tags**:
   - 50-60 characters
   - Include primary keyword
   - Brand name at end
   - Unique per page

2. **Meta Descriptions**:
   - 150-160 characters
   - Include call-to-action
   - Relevant keywords naturally
   - Unique per page

3. **Heading Structure**:

   ```html
   <h1>Main Title (1 per page)</h1>
   <h2>Section Headings</h2>
   <h3>Subsections</h3>
   ```

4. **Internal Linking**:
   - Descriptive anchor text
   - Link to related content
   - Breadcrumb navigation
   - Footer sitemap links

5. **Image Optimization**:
   - Alt text for all images
   - Descriptive file names
   - Next.js Image component
   - WebP/AVIF formats
   - Lazy loading

## 📊 SEO Monitoring & Analytics

### Tools Integrated

- ✅ Google Analytics 4 (gtag)
- ✅ Google Search Console (planned)
- ✅ Vercel Analytics
- ⏳ Structured data testing tool
- ⏳ PageSpeed Insights monitoring

### Key Metrics to Track

1. **Organic Traffic**:
   - Sessions from search
   - New vs returning users
   - Bounce rate
   - Session duration

2. **Rankings**:
   - Target keyword positions
   - Featured snippets
   - Top 10 rankings

3. **Technical**:
   - Core Web Vitals
   - Mobile usability
   - Indexation status
   - Crawl errors

4. **Conversions**:
   - Tool usage
   - Course sign-ups
   - Newsletter subscriptions
   - Auth conversions

## 🎯 Target Keywords

### Primary Keywords (IA Portal)

1. **"herramientas inteligencia artificial"** - Volume: High, Difficulty: Medium
2. **"inteligencia artificial cursos"** - Volume: High, Difficulty: High
3. **"cómo funciona ia"** - Volume: Medium, Difficulty: Low
4. **"aprender inteligencia artificial"** - Volume: High, Difficulty: High

### Primary Keywords (Environmental Portal)

1. **"gestión ambiental software"** - Volume: Medium, Difficulty: Low
2. **"herramientas ambientales"** - Volume: Low, Difficulty: Low
3. **"evaluación impacto ambiental"** - Volume: Medium, Difficulty: Medium
4. **"mapas ambientales"** - Volume: Low, Difficulty: Low

### Long-tail Keywords

- "cómo funciona un modelo de lenguaje"
- "herramientas ia gratis para empresas"
- "generador matriz eia online"
- "visor mapas ambientales colombia"

## 📝 Content Strategy

### Blog Topics (Planned)

**IA Portal**:

1. "Guía completa: Cómo funcionan los LLMs"
2. "Top 10 herramientas de IA para empresas en 2024"
3. "Inteligencia Artificial vs Machine Learning: Diferencias"
4. "Casos de uso de IA en la industria"

**Environmental Portal**:

1. "Evaluación de Impacto Ambiental: Guía paso a paso"
2. "Normativa ambiental en Colombia 2024"
3. "Tecnología para monitoreo ambiental"
4. "Sostenibilidad empresarial con IA"

### Content Calendar

- **Weekly**: 1 blog post (alternating portals)
- **Monthly**: 1 tool deep-dive guide
- **Quarterly**: Industry report or whitepaper

## 🔗 Link Building Strategy

### Internal Linking

- ✅ Related tools suggestions
- ✅ Blog post crosslinks
- ✅ Footer sitemap
- ⏳ Breadcrumb navigation
- ⏳ "You might also like" sections

### External Linking

**Target sources**:

- Educational institutions (.edu)
- Government environmental sites (.gov)
- Industry publications
- Tech blogs and forums

**Tactics**:

- Guest posting
- Resource page outreach
- Broken link building
- Digital PR

## 🎨 UX/SEO Alignment

### User Experience = SEO

- ✅ Fast page loads
- ✅ Mobile-friendly design
- ✅ Clear navigation
- ✅ Accessible UI (WCAG)
- ✅ Engaging content
- ✅ Low bounce rate design

### Conversion Optimization

- ✅ Clear CTAs
- ✅ Tool preview/demo
- ✅ Social proof (testimonials TODO)
- ✅ Trust signals (security, privacy)

## 📱 Local SEO (Future)

For office/events:

- ⏳ Google Business Profile
- ⏳ Local schema markup
- ⏳ NAP consistency
- ⏳ Local citations

## 🔮 Advanced SEO (Roadmap)

### Phase 2 (Q1 2025)

- [ ] Blog with rich snippets
- [ ] FAQ schema markup
- [ ] Video content with schema
- [ ] Review/rating schema
- [ ] Event schema (webinars)

### Phase 3 (Q2 2025)

- [ ] AMP pages (if needed)
- [ ] PWA features
- [ ] Voice search optimization
- [ ] Featured snippet optimization
- [ ] Entity optimization

### Phase 4 (Q3 2025)

- [ ] Multilingual SEO (en, pt)
- [ ] International targeting
- [ ] Hreflang tags
- [ ] Country-specific content

## 📈 Success Metrics

### 3 Months

- ✅ All pages indexed
- ✅ Core Web Vitals passing
- 🎯 100+ organic sessions/month
- 🎯 5+ keywords in top 30

### 6 Months

- 🎯 1,000+ organic sessions/month
- 🎯 10+ keywords in top 10
- 🎯 2+ featured snippets
- 🎯 Domain Authority > 20

### 12 Months

- 🎯 10,000+ organic sessions/month
- 🎯 50+ keywords in top 10
- 🎯 10+ featured snippets
- 🎯 Domain Authority > 30

## 🛠️ SEO Tools Used

- **Analysis**: Google Search Console, Ahrefs, SEMrush
- **Technical**: Screaming Frog, Lighthouse, PageSpeed Insights
- **Content**: Surfer SEO, Clearscope
- **Monitoring**: Google Analytics 4, Vercel Analytics
- **Schema**: Schema.org validator, Google Rich Results Test

## 📞 SEO Team

- **Strategy**: SEO Manager
- **Content**: Content Writers
- **Technical**: Development Team
- **Analytics**: Data Analyst

---

**Last Updated**: 2024-10-30  
**Version**: 1.0.0  
**Next Review**: 2024-12-01
