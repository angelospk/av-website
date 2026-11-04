# Στήσιμο από το μηδέν σε υπολογιστή Windows

Αυτός ο οδηγός παίρνει έναν υπολογιστή Windows 10/11 **χωρίς τίποτα εγκατεστημένο**
και φτάνει σε:

- site online στο Cloudflare, που ενημερώνεται μόνο του σε κάθε αλλαγή·
- CMS στο `/admin/` για αλλαγές από το browser·
- repo στον λογαριασμό GitHub **του γραφείου**·
- AI agent (Claude Code) στον υπολογιστή, που προσθέτει έργα από το NAS·
- εβδομαδιαίο backup στο NAS και φάκελο «ΑΝΑΚΤΗΣΗ».

Χρόνος: 3-4 ώρες με έναν τεχνικό δίπλα. Κόστος: 0 € (εκτός από domain και, αν θέλετε AI agent, συνδρομή Claude).

## Ποιος κάνει τι

| Φάση | Ποιος | Πού |
|---|---|---|
| 0. Λογαριασμοί και εγκαταστάσεις | Άνθρωπος, με οδηγό το Claude στο browser (claude.ai) | Browser + PowerShell |
| 1-7. Όλα τα άλλα | Claude Code, ο άνθρωπος εγκρίνει | Τερματικό, μέσα στον φάκελο του site |

Οι λογαριασμούς τους φτιάχνει **πάντα άνθρωπος** (captcha, email, 2FA).
Κωδικοί, tokens και secrets **δεν γράφονται ποτέ** στη συνομιλία με το AI ή στο repo.

---

## Φάση 0: Prompt για το claude.ai

Άνοιξε το https://claude.ai σε Chrome ή Edge, ξεκίνα νέα συνομιλία και επικόλλησε
όλο το παρακάτω κείμενο.

````text
Θα με καθοδηγήσεις βήμα-βήμα να στήσω σε αυτόν τον υπολογιστή Windows το εργαλείο
που ενημερώνει το site του τεχνικού μας γραφείου. Ο υπολογιστής δεν έχει τίποτα
εγκατεστημένο (ούτε git, ούτε Node).

Κανόνες:
- Ένα βήμα τη φορά. Μετά από κάθε βήμα περίμενε να σου πω «έγινε» ή να σου στείλω
  screenshot. Μη μου δίνεις 5 βήματα μαζί.
- Μίλα απλά ελληνικά. Πες μου ακριβώς πού να κλικάρω και τι να γράψω.
- Ποτέ μη μου ζητήσεις κωδικό, token, recovery code ή secret. Αν χρειαστεί,
  πες μου πού να το βάλω εγώ (password manager / dashboard), όχι στη συνομιλία.
- Αν κάτι βγάλει σφάλμα, ζήτα μου screenshot ή το κείμενο του σφάλματος.

Στόχος αυτής της φάσης (με αυτή τη σειρά):

1. Password manager: έλεγξε αν το γραφείο έχει (π.χ. Bitwarden). Αν όχι, βοήθησέ με
   να φτιάξω δωρεάν λογαριασμό Bitwarden με το email του γραφείου. Εκεί θα μπουν
   όλοι οι κωδικοί που ακολουθούν.
2. Λογαριασμός GitHub με το email του γραφείου (όχι προσωπικό).
   - Username σύντομο, π.χ. το όνομα του γραφείου.
   - Ενεργοποίηση 2FA με εφαρμογή authenticator στο κινητό.
   - Κατέβασμα των recovery codes: εκτύπωση και σε φάκελο «ΑΝΑΚΤΗΣΗ», + αντίγραφο στον password manager.
3. Λογαριασμός Cloudflare με το ίδιο email, με 2FA και recovery codes όπως πάνω.
4. Εγκαταστάσεις: άνοιξε PowerShell (Έναρξη → γράψε PowerShell → Enter) και τρέξε
   μία-μία, περιμένοντας να τελειώσει κάθε μία:
     winget install --id Git.Git -e --source winget
     winget install --id OpenJS.NodeJS.LTS -e --source winget
     winget install --id GitHub.cli -e --source winget
     irm https://claude.ai/install.ps1 | iex
   Μετά κλείσε το PowerShell, άνοιξε καινούριο, και έλεγξε:
     git --version
     node --version
     gh --version
     claude --version
   Αν κάποιο λέει «not recognized»: κλείσε όλα τα παράθυρα PowerShell και άνοιξε ξανά.
   Αν το winget λείπει: εγκατάσταση «App Installer» από το Microsoft Store.
   Αν το npm αργότερα πει «running scripts is disabled»:
     Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
5. Σύνδεση του git με τον λογαριασμό GitHub του γραφείου:
     gh auth login
   (GitHub.com → HTTPS → Yes → Login with a web browser)
     gh auth setup-git
     git config --global user.name "Όνομα Γραφείου"
     git config --global user.email "<email γραφείου>"
6. Αντιγραφή του site και δημιουργία δικού μας (private) repo:
     mkdir C:\Sites
     cd C:\Sites
     git clone https://github.com/angelospk/av-website.git
     cd av-website
     git remote remove origin
     gh repo create av-website --private --source . --remote origin --push
   Έλεγχος: άνοιξε https://github.com/<username>/av-website, πρέπει να λέει Private.
7. Σύνδεση στο Claude Code (χρειάζεται συνδρομή Claude Pro ή μεγαλύτερη):
     cd C:\Sites\av-website
     claude
   Κάνε login όταν ζητηθεί. Μετά γράψε στο Claude Code:
     «Διάβασε το SETUP.md και συνέχισε από τη Φάση 1. Ο τεχνικός είναι δίπλα μου.»

Όταν φτάσουμε στο 7, η δουλειά σου τελείωσε. Ξεκίνα από το βήμα 1.
````

---

## Φάσεις 1-7: για το Claude Code

> Claude Code: διάβασε και το `AGENTS.md`. Κάνε μία φάση τη φορά. Στο τέλος κάθε
> φάσης δείξε στον χρήστη την απόδειξη (τι έτρεξες, τι βγήκε) και ρώτα αν συνεχίζουμε.
> Ό,τι χρειάζεται κλικ σε dashboard, περίγραψέ το βήμα-βήμα και περίμενε «έγινε».
> Ποτέ μη ζητήσεις ή γράψεις secret στη συνομιλία ή σε αρχείο.

### Φάση 1: Τοπικό site

1. `npm ci`
2. `npm run build`: πρέπει να τελειώσει με `Complete!`.
3. `npm run dev` (στο παρασκήνιο) και ο χρήστης ανοίγει `http://localhost:4321/`.
4. Ο χρήστης ανοίγει `http://localhost:4321/admin/index.html` σε Chrome/Edge →
   «Work with Local Repository» → επιλέγει τον φάκελο `C:\Sites\av-website`.
   Αλλάζει έναν αριθμό στα «Στοιχεία γραφείου» και σώζει.
   Εσύ τρέχεις `git diff` και του δείχνεις την αλλαγή. Μετά `git checkout -- src/data/site.json`.

**Απόδειξη:** build OK, σελίδα ανοίγει, το CMS άλλαξε το αρχείο τοπικά.

### Φάση 2: Cloudflare (site online)

1. `npx wrangler login` (ανοίγει browser, login στον λογαριασμό Cloudflare του γραφείου).
2. `npm run build` και `npx wrangler deploy`. Γράφει ένα URL `https://av-website.<κάτι>.workers.dev`.
   Ο χρήστης το ανοίγει.
3. Αυτόματο deploy από το GitHub. Ο χρήστης, στο dashboard του Cloudflare:
   Workers & Pages → `av-website` → Settings → Build → Connect (Git repository) →
   GitHub → εγκρίνει πρόσβαση **μόνο** στο repo `av-website`.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Branch: `main`
4. Έλεγχος: άλλαξε ένα γράμμα σε ένα έργο, commit, push. Σε 1-2 λεπτά η αλλαγή φαίνεται online.
   Μετά επανάφερέ το με νέο commit (όχι force push).
5. Γράψε το τελικό URL στο `astro.config.mjs` (`site:`), commit, push.

**Απόδειξη:** push → η αλλαγή φαίνεται στο workers.dev URL.

### Φάση 3: Login στο CMS από οποιονδήποτε υπολογιστή

Το CMS χρειάζεται ένα μικρό «θυρωρό» για το login με GitHub (Sveltia CMS Authenticator).

1. Ο χρήστης ανοίγει https://github.com/sveltia/sveltia-cms-auth και πατά «Deploy to Cloudflare Workers».
   Συνδέεται με τον λογαριασμό Cloudflare του γραφείου. Στο τέλος κρατά το URL
   `https://sveltia-cms-auth.<κάτι>.workers.dev`.
2. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:
   - Application name: `AV website CMS`
   - Homepage URL: το URL του site
   - Authorization callback URL: `<URL του authenticator>/callback`
   Μετά: Generate a new client secret.
3. Cloudflare → Workers → `sveltia-cms-auth` → Settings → Variables and Secrets:
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Client secret, τύπος **Secret** (κρυφό)
   - `ALLOWED_DOMAINS` = το hostname του site (π.χ. `av-website.xxx.workers.dev`, αργότερα και το domain)
   Ο χρήστης τα επικολλά **ο ίδιος** στο dashboard. Το secret μπαίνει και στον password manager.
4. Εσύ αλλάζεις στο `public/admin/config.yml`:
   - `repo:` → `<username γραφείου>/av-website`
   - βγάζεις το `#` από το `base_url:` και βάζεις το URL του authenticator
   Build, commit, push.
5. Ο χρήστης ανοίγει `<URL site>/admin/` → «Sign In with GitHub» → αλλάζει κάτι → Save.
   Σε 1-2 λεπτά η αλλαγή φαίνεται online. Εσύ κάνεις `git pull` και δείχνεις το commit.

**Απόδειξη:** αλλαγή από το online CMS εμφανίστηκε στο site και στο `git log`.

Πρόσβαση άλλου υπαλλήλου στο CMS: φτιάχνει δικό του GitHub, και ο owner τον προσθέτει
στο repo (Settings → Collaborators, ρόλος Write).

### Φάση 4: Domain (αν υπάρχει ή αγοραστεί)

**ΣΤΑΜΑΤΑ και ρώτα τον τεχνικό πριν από αυτή τη φάση.** Λάθος εδώ σταματά το email του γραφείου.

1. Cloudflare → Add a domain → το domain του γραφείου → Free plan.
2. Το Cloudflare διαβάζει τις υπάρχουσες εγγραφές DNS. Σύγκρινε με τον χρήστη, γραμμή-γραμμή,
   ότι υπάρχουν **όλες** οι εγγραφές MX, και τα TXT με `v=spf1`, DKIM (`._domainkey`) και DMARC,
   όπως είναι στον τωρινό πάροχο. Κράτα screenshot των παλιών εγγραφών στο NAS.
3. Ο χρήστης αλλάζει τους nameservers στον registrar (π.χ. Papaki) σε αυτούς που δίνει το Cloudflare.
4. Workers → `av-website` → Settings → Domains & Routes → Add → Custom domain (`www` και χωρίς `www`).
5. Ενημέρωσε `astro.config.mjs` (`site:`) και `ALLOWED_DOMAINS` στον authenticator.
6. Στείλε ένα δοκιμαστικό email προς και από το email του γραφείου.

**Απόδειξη:** το site ανοίγει στο domain και το email στέλνει και λαμβάνει.

### Φάση 5: Backup στο NAS

1. Ρώτα τον χρήστη τη διαδρομή του NAS για backup (π.χ. `\\NAS\Site\backup`).
2. `npm run backup -- "\\NAS\Site\backup"`: πρέπει να γράψει `Backup OK`.
3. Εβδομαδιαία αυτόματη εργασία (Windows Task Scheduler), από PowerShell:
   ```powershell
   schtasks /create /tn "av-website backup" /sc weekly /d MON /st 10:00 /tr "cmd /c cd /d C:\Sites\av-website && git pull && npm run backup -- \\NAS\Site\backup"
   ```
   Τρέξε την μία φορά: `schtasks /run /tn "av-website backup"` και έλεγξε ότι εμφανίστηκε νέο αρχείο.

### Φάση 6: Φάκελος «ΑΝΑΚΤΗΣΗ»

Γράψε στο NAS (όχι στο repo) το αρχείο `\\NAS\Site\ΑΝΑΚΤΗΣΗ.md` με αυτό το περιεχόμενο,
συμπληρωμένο με τον χρήστη. **Χωρίς κωδικούς**: μόνο πού βρίσκονται.

```markdown
# ΑΝΑΚΤΗΣΗ site γραφείου

## Λογαριασμοί (όλοι με email: <email γραφείου>)
| Υπηρεσία | Username | 2FA σε | Recovery codes |
|---|---|---|---|
| GitHub | <username> | κινητό <ποιου> | φάκελος ΑΝΑΚΤΗΣΗ (χαρτί) + password manager |
| Cloudflare | <email> | κινητό <ποιου> | φάκελος ΑΝΑΚΤΗΣΗ (χαρτί) + password manager |
| Registrar domain | <πάροχος> | | |
| Password manager | <email> | | master password: <πού φυλάσσεται> |

## Πού είναι τι
- Κώδικας + περιεχόμενο: github.com/<username>/av-website (private)
- Τοπικό αντίγραφο: C:\Sites\av-website στον υπολογιστή <όνομα>
- Backup: \\NAS\Site\backup\av-website-<ημερομηνία>.bundle (κάθε Δευτέρα)
- Site: Cloudflare Worker «av-website». CMS login: Cloudflare Worker «sveltia-cms-auth»

## Αν χαθεί ο υπολογιστής
Νέος υπολογιστής → SETUP.md Φάση 0, αλλά στο βήμα 6 αντί για clone + gh repo create:
    git clone https://github.com/<username>/av-website.git C:\Sites\av-website

## Αν χαθεί ο λογαριασμός GitHub
1. Recovery codes → login. Αν δεν γίνεται: νέος λογαριασμός GitHub.
2. git clone \\NAS\Site\backup\<πιο πρόσφατο>.bundle C:\Sites\av-website
3. cd C:\Sites\av-website ; git remote remove origin
4. gh repo create av-website --private --source . --remote origin --push
5. Cloudflare: σύνδεση του Worker με το νέο repo (SETUP.md Φάση 2.3)
6. Νέο OAuth App + config.yml (SETUP.md Φάση 3)

## Αν χαθούν όλα (και το Cloudflare)
Bundle από το NAS → SETUP.md από τη Φάση 0. Χρόνος: ~3 ώρες.
```

Εκτύπωσε το αρχείο και βάλ' το στον φάκελο «ΑΝΑΚΤΗΣΗ» μαζί με τα recovery codes.

### Φάση 7: Δοκιμή ανάκτησης (υποχρεωτική)

1. `git clone "<πιο πρόσφατο .bundle>" C:\Temp\restore-test`
2. `cd C:\Temp\restore-test` → `npm ci` → `npm run build`: πρέπει να τελειώσει με `Complete!`.
3. Σβήσε το `C:\Temp\restore-test`.

**Απόδειξη:** το site χτίζεται μόνο από το backup.

---

## Μετά το στήσιμο: καθάρισμα demo

Τα έργα με `demo: true` και οι αριθμοί στην αρχική είναι παραδείγματα.

1. Αλλαγή αριθμών, υπηρεσιών και ομάδας στο CMS → «Στοιχεία γραφείου».
2. Πραγματικά έργα: «Νέο έργο από φάκελο στο NAS» (δες `AGENTS.md`).
3. Διαγραφή κάθε έργου με `demo: true`.
4. Συγκατάθεση πελάτη για κάθε έργο με φωτογραφίες. Συγκατάθεση κάθε μέλους για όνομα/φωτογραφία.

## Τέλος: λίστα ελέγχου

- [ ] Το site ανοίγει online (workers.dev ή domain)
- [ ] Push στο GitHub → αλλαγή online σε 1-2 λεπτά
- [ ] Login στο `/admin/` από άλλο υπολογιστή δουλεύει
- [ ] Claude Code προσθέτει έργο από φάκελο του NAS (με «ναι» πριν το push)
- [ ] Υπάρχει backup στο NAS και η εργασία τρέχει κάθε εβδομάδα
- [ ] Η δοκιμή ανάκτησης πέρασε
- [ ] Φάκελος «ΑΝΑΚΤΗΣΗ» τυπωμένος, recovery codes μέσα
- [ ] Owner σε GitHub, Cloudflare και domain είναι ο λογαριασμός του γραφείου· ο τεχνικός είναι μόνο συνεργάτης
