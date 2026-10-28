# AIForBusinessHub — Digital AI Magazine

A clean, modern, and professional digital magazine for practical enterprise AI insights, cost analyses, workflow automation playbooks, and strategic implementation guides.

Rebuilt from the ground up using Next.js App Router, TypeScript, Tailwind CSS, and local MDX static content generation.

---

## 🚀 Quick Start

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### Installation
```bash
npm install
```

### Development Server
Run the local development server at `http://localhost:3000`:
```bash
npm run dev
```

### Production Build & Launch
Build the fully optimized static website with full pre-rendering:
```bash
npm run build
npm start
```

---

## ☁️ Deployment Guide

### Option 1: Deploy to Vercel (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com/).
3. Framework Preset: **Next.js** (detected automatically).
4. Build Command: `npm run build`
5. Output Directory: `.next`
6. Click **Deploy**.

### Option 2: Self-Hosted Node.js / Docker
Run the production build with any process manager (PM2, systemd, or Docker):
```bash
npm run build
npm run start
```

---

## 🏛️ Website Architecture & Routes

The application follows an intentionally clean, content-focused architecture:

| Route | Type | Description |
|---|---|---|
| `/` | Static | Editorial homepage featuring masthead, hero story, filterable magazine grid, and category navigation |
| `/blog/[slug]` | SSG (`generateStaticParams`) | Individual article reading experience with sticky table of contents, breadcrumbs, JSON-LD schema, and related stories |
| `/contact` | Static / Client | Editorial contact desk with accessible form validation |
| `/sitemap.xml` | Dynamic Metadata | Automated XML sitemap containing all published articles and core pages |
| `/robots.txt` | Dynamic Metadata | Search engine crawler instructions referencing the canonical sitemap |
| `/_not-found` | Static | Custom editorial 404 page with navigation fallbacks |

### SEO & Legacy 301 Permanent Redirects
Legacy WordPress URLs are permanently redirected in `next.config.ts`:
- `/blogs` &rarr; `/#articles`
- `/authors` &rarr; `/contact`
- `/author/:slug` &rarr; `/contact`
- `/work-with-pro` &rarr; `/contact`

---

## 📰 Content Catalog Summary

- **Total Articles Migrated**: 16 (100% of discovered sitemap and RSS items)
- **Image Assets Preserved Locally**: 23 local image assets stored in `public/images/articles/`
- **Categories**:
  1. `Business Strategy` (6 articles)
  2. `AI Development` (4 articles)
  3. `AI Automation` (4 articles)
  4. `AI Tools` (2 articles)

All articles are stored as structured MDX files in `src/content/articles/` with frontmatter for:
- Full titles and slugs
- Meta descriptions
- Publication and modification timestamps
- Accurate reading times and word counts
- Localized featured images and inline figures
- FAQ schemas and Q&A blocks

---

## 🛠️ Production Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown & Frontmatter**: `gray-matter`, `marked`
- **Metadata**: Next.js Metadata API with JSON-LD (`Article`, `BreadcrumbList`, `FAQPage`)
