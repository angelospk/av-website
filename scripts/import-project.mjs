// Φέρνει φωτογραφίες έργου από έναν φάκελο (π.χ. στο NAS) στο site.
// Δέχεται JPEG, PNG, WebP, TIFF. Όχι HEIC (το sharp δεν το διαβάζει χωρίς επιπλέον codec).
// Χρήση: npm run import-project -- "<φάκελος με φωτογραφίες>" <slug>
// - Μικραίνει κάθε φωτογραφία στα 2000 px και τη σώζει ως WebP.
// - Σβήνει όλα τα metadata (EXIF, GPS, μοντέλο κάμερας). Το sharp δεν τα κρατά αν δεν του το ζητήσεις.
// - Δεν αλλάζει τίποτα στον αρχικό φάκελο.
// - Αν δεν υπάρχει src/content/projects/<slug>.el.md, φτιάχνει πρόχειρο (draft: true). Το αγγλικό <slug>.en.md το γράφει ο agent μετά.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [src, slug] = process.argv.slice(2);
if (!src || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Χρήση: npm run import-project -- "<φάκελος>" <slug με λατινικά-μικρά-παύλες>');
  process.exit(1);
}
if (!fs.existsSync(src)) { console.error(`Δεν υπάρχει ο φάκελος: ${src}`); process.exit(1); }

const photos = fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)).sort();
const heic = fs.readdirSync(src).filter((f) => /\.(heic|heif)$/i.test(f));
if (heic.length) console.error(`ΠΡΟΣΟΧΗ: ${heic.length} αρχεία HEIC/HEIF αγνοούνται. Μετάτρεψέ τα σε JPEG (π.χ. από το κινητό: «Πιο συμβατό»).`);
if (!photos.length) { console.error("Δεν βρέθηκαν φωτογραφίες (jpg, png, webp, tif)."); process.exit(1); }

const outDir = path.join("public", "images", "projects", slug);
if (fs.existsSync(outDir) && fs.readdirSync(outDir).length) {
  console.error(`Υπάρχει ήδη ο φάκελος ${outDir}. Διάλεξε άλλο slug ή σβήσε τον φάκελο πρώτα (με έγκριση).`);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });
const urls = [];
for (const [i, f] of photos.entries()) {
  const name = `${String(i + 1).padStart(2, "0")}.webp`;
  try {
    await sharp(path.join(src, f)).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, name));
    urls.push(`/images/projects/${slug}/${name}`);
    console.log(`OK   ${f} -> ${outDir}/${name}`);
  } catch (e) {
    console.error(`SKIP ${f}: ${e.message}`);
  }
}

const md = path.join("src", "content", "projects", `${slug}.el.md`);
if (!fs.existsSync(md) && urls.length) {
  const gallery = urls.slice(1).map((u) => `  - ${u}`).join("\n");
  fs.writeFileSync(md, `---
slug: ${slug}
title: ΣΥΜΠΛΗΡΩΣΕ
place: ΣΥΜΠΛΗΡΩΣΕ
year: ${new Date().getFullYear()}
status: Σε εξέλιξη
categories:
  - Κατοικία
order: 100
cover: ${urls[0]}
${gallery ? `gallery:\n${gallery}\n` : ""}summary: ΣΥΜΠΛΗΡΩΣΕ
draft: true
---

ΣΥΜΠΛΗΡΩΣΕ την περιγραφή.
`);
  console.log(`NEW  ${md} (draft: true, συμπλήρωσε τα ΣΥΜΠΛΗΡΩΣΕ)`);
}
console.log(`\n${urls.length}/${photos.length} φωτογραφίες έτοιμες.`);
if (urls.length < photos.length) process.exit(1);
