# av-website

Site του τεχνικού γραφείου Αλέξανδρου Βλάχου, πολιτικού μηχανικού στη Λευκάδα.

- **Astro 7**, στατικό. Hosting: **Cloudflare Workers** (static assets, δωρεάν).
- **Sveltia CMS** στο `/admin/`: φόρμες για έργα και στοιχεία γραφείου, online ή τοπικά.
- Περιεχόμενο σε απλά αρχεία: `src/content/projects/*.md` και `src/data/site.json`.
- Οδηγίες για AI agent: `AGENTS.md`. Στήσιμο σε νέο υπολογιστή από το μηδέν: `SETUP.md`.

Τα έργα με `demo: true` και οι φωτογραφίες Unsplash είναι παραδείγματα.

## Γρήγορα

```bash
npm ci
npm run dev        # http://localhost:4321/   CMS: /admin/index.html
npm run build      # ελέγχει το περιεχόμενο και φτιάχνει το dist/
```

## Αρχεία

| Αρχείο | Τι κάνει |
|---|---|
| `src/pages/index.astro` | Αρχική. Περνάει τα δεδομένα στο `public/app.js` |
| `src/pages/erga/[id].astro` | Μία σελίδα ανά έργο: `/erga/<id>/` |
| `src/content.config.ts` | Κανόνες για τα πεδία των έργων (έλεγχος στο build) |
| `public/admin/config.yml` | Φόρμες του CMS (ίδια πεδία με το παραπάνω) |
| `public/styles.css`, `public/app.js`, `public/hero3d.js` | Εμφάνιση, φίλτρα/παράθυρο έργου, 3D |
| `scripts/import-project.mjs` | Φωτογραφίες από φάκελο → WebP χωρίς EXIF/GPS |
| `scripts/backup.mjs` | `git bundle` σε φάκελο backup |
| `wrangler.jsonc` | Ρύθμιση Cloudflare |

Design: `DESIGN.md`.
