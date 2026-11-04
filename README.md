# Αλέξανδρος Βλάχος: site τεχνικού γραφείου (Λευκάδα)

Πραγματικά στοιχεία επικοινωνίας και λογότυπο (`logo.svg`). Έργα, αριθμοί και ομάδα: ακόμα demo. Στατικό site χωρίς build: HTML, CSS, JS, three.js από CDN.

## Τρέξιμο

Live: https://axonas.haroldpoi.dev (mini PC: `axonas-demo.service` στο 127.0.0.1:8766, Cloudflare tunnel `oc-asr`).
Το Cloudflare κρατά CSS/JS στον browser 4 ώρες: μετά από αλλαγή, ανέβασε το `?v=N` στο `index.html`.

```bash
cd ~/projects/axonas-demo
python3 -m http.server 8765   # άνοιξε http://localhost:8765
```

Χρειάζεται server (όχι `file://`), επειδή το 3D φορτώνει ως ES module.

## Προσθήκη έργου

1. Άνοιξε `data/projects.js`.
2. Αντίγραψε ένα block `{ ... }` μέσα στο `PROJECTS` και άλλαξε τα πεδία.
3. Βάλε φωτογραφίες στο `img/` και γράψε π.χ. `cover: "img/varh-1.jpg"`.

Νέα κατηγορία: πρόσθεσέ τη στο `CATEGORIES`. Γίνεται φίλτρο μόνη της.
Υπηρεσίες, βήματα και ομάδα: `data/site.js`.

## Αρχεία

| Αρχείο | Τι κάνει |
|---|---|
| `index.html` | Δομή σελίδας |
| `styles.css` | Όλη η εμφάνιση (χρώματα στο `:root`) |
| `app.js` | Λίστες, φίλτρα, παράθυρο έργου, animations |
| `hero3d.js` | 3D μοντέλο κατοικίας στο hero |
| `data/*.js` | Περιεχόμενο |

Design: `DESIGN.md` (tokens, layout, rules). Origin: ui-vault run 2026-10-15-techniko-grafeio.
Φωτογραφίες: Unsplash (hotlink, μόνο για demo).
