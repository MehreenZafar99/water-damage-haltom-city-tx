# Haltom City Water Damage Restoration

Static Next.js site for water damage restoration in Haltom City, TX.

## Develop

```bash
npm install
npm run dev
```

## Build (static export)

```bash
npm run build
```

Output is written to `out/` for Vercel or any static host.

## Content

Page copy lives in `content/*.md` (frontmatter: `title`, `meta_description`, `slug`).  
Phone number is controlled in `site.config.ts` only.

## Deploy

Connect the repo to Vercel. Framework preset: Next.js. Output is static (`output: "export"`).
