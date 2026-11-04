// Backup όλου του repo σε ένα αρχείο (git bundle), π.χ. στο NAS.
// Χρήση: npm run backup -- "<φάκελος backup>"   ή   μεταβλητή AV_BACKUP_DIR
// Κρατά τα 8 πιο πρόσφατα. Περιέχει μόνο ό,τι έχει γίνει commit (προειδοποιεί για τα υπόλοιπα). Επαναφορά: git clone <αρχείο.bundle> av-website
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2] || process.env.AV_BACKUP_DIR;
if (!dir) { console.error('Χρήση: npm run backup -- "<φάκελος backup>"'); process.exit(1); }
fs.mkdirSync(dir, { recursive: true });
const dirty = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trimEnd();
const stamp = new Date().toISOString().slice(0, 10);
const file = path.join(dir, `av-website-${stamp}.bundle`);
// Πρώτα σε προσωρινό αρχείο: αν κάτι αποτύχει, το προηγούμενο backup της ημέρας μένει άθικτο.
const tmp = `${file}.tmp`;
execFileSync("git", ["bundle", "create", tmp, "--all"], { stdio: "inherit" });
execFileSync("git", ["bundle", "verify", tmp], { stdio: "inherit" });
fs.renameSync(tmp, file);
const old = fs.readdirSync(dir).filter((f) => /^av-website-\d{4}-\d{2}-\d{2}\.bundle$/.test(f)).sort().slice(0, -8);
for (const f of old) fs.unlinkSync(path.join(dir, f));
console.log(`Backup OK: ${file}${old.length ? ` (σβήστηκαν ${old.length} παλιά)` : ""}`);
if (dirty) {
  // Το bundle κρατά μόνο ό,τι έχει γίνει commit. Δεν σταματάμε το backup, αλλά το λέμε καθαρά.
  console.error(`\nΠΡΟΣΟΧΗ: αυτές οι αλλαγές ΔΕΝ είναι στο backup (δεν έχουν γίνει commit):\n${dirty}`);
  process.exitCode = 2;
}
