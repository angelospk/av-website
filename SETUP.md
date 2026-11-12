# Στήσιμο από το μηδέν σε υπολογιστή Windows

Αυτός ο οδηγός παίρνει έναν υπολογιστή Windows 10/11 **χωρίς τίποτα εγκατεστημένο**
και φτάνει σε:

- site online στο GitHub Pages (δωρεάν), που ενημερώνεται μόνο του σε κάθε αλλαγή·
- CMS στο `/admin/` για αλλαγές από το browser·
- repo στον λογαριασμό GitHub **του γραφείου** (public: ό,τι μπαίνει εκεί το βλέπει όποιος θέλει)·
- AI agent (Claude Code) στον υπολογιστή, που προσθέτει έργα από το NAS·
- εβδομαδιαίο backup στο NAS και φάκελο «ΑΝΑΚΤΗΣΗ».

Χρόνος: 2-3 ώρες με έναν τεχνικό δίπλα. Κόστος: 0 € (εκτός από domain και, αν θέλετε AI agent, συνδρομή Claude).
Χρειάζεται μόνο λογαριασμός GitHub. Cloudflare **δεν** χρειάζεται (προαιρετικό: Παράρτημα).

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
3. Εγκαταστάσεις: άνοιξε PowerShell (Έναρξη → γράψε PowerShell → Enter) και τρέξε
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
4. Σύνδεση του git με τον λογαριασμό GitHub του γραφείου:
     gh auth login
   (GitHub.com → HTTPS → Yes → Login with a web browser)
     gh auth setup-git
     git config --global user.name "Όνομα Γραφείου"
     git config --global user.email "<email γραφείου>"
5. Αντιγραφή του site και δημιουργία δικού μας repo (public, γιατί το GitHub Pages
   είναι δωρεάν μόνο για public repo):
     mkdir C:\Sites
     cd C:\Sites
     git clone https://github.com/angelospk/av-website.git
     cd av-website
     git remote remove origin
     gh repo create av-website --public --source . --remote origin --push
   Έλεγχος: άνοιξε https://github.com/<username>/av-website, πρέπει να λέει Public.
6. Σύνδεση στο Claude Code (χρειάζεται συνδρομή Claude Pro ή μεγαλύτερη):
     cd C:\Sites\av-website
     claude
   Κάνε login όταν ζητηθεί. Μετά γράψε στο Claude Code:
     «Διάβασε το SETUP.md και συνέχισε από τη Φάση 1. Ο τεχνικός είναι δίπλα μου.»

Όταν φτάσουμε στο 6, η δουλειά σου τελείωσε. Ξεκίνα από το βήμα 1.
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

### Φάση 1β: Καθάρισμα demo (πριν βγει online)

Τα έργα με `demo: true`, οι φωτογραφίες Unsplash και οι αριθμοί στην αρχική είναι παραδείγματα.
Δεν πρέπει να φανούν online σαν πραγματική δουλειά του γραφείου.

1. Αριθμοί, υπηρεσίες, βήματα, ομάδα: ο χρήστης τα αλλάζει στο τοπικό CMS («Στοιχεία γραφείου»).
   Όσα δεν ξέρει ακόμα, τα σβήνει.
2. Τουλάχιστον 1-2 πραγματικά έργα: «Νέο έργο από φάκελο στο NAS» (δες `AGENTS.md`).
3. Σβήσε κάθε έργο με `demo: true` (`.md`), μόνο με «ναι».
4. Συγκατάθεση πελάτη για κάθε έργο με φωτογραφίες. Συγκατάθεση κάθε μέλους για όνομα/φωτογραφία.
5. `npm run build` → `npm run dev` → ο χρήστης ελέγχει όλη τη σελίδα → commit → push.

**Απόδειξη:** `grep -l "demo: true" src/content/projects/*.md` δεν βγάζει τίποτα. Ο χρήστης είπε «εντάξει» για τη σελίδα.

Το repo είναι public: και τα πρόχειρα (`draft: true`) φαίνονται στο GitHub, απλώς όχι στο site.
Γι' αυτό: καμία φωτογραφία ή κείμενο στο repo πριν πάρετε την άδεια του πελάτη.

### Φάση 2: GitHub Pages (site online)

1. Ο χρήστης, στο GitHub: repo `av-website` → Settings → Pages →
   Build and deployment → Source: **GitHub Actions**. (Τίποτα άλλο.)
2. Εσύ: `gh workflow run deploy.yml`, μετά `gh run watch` μέχρι να τελειώσει με ✓.
3. Το site είναι στο `https://<username>.github.io/av-website/`. Ο χρήστης το ανοίγει.
4. Έλεγχος αυτόματης ενημέρωσης: άλλαξε ένα γράμμα σε ένα έργο, commit, push.
   `gh run watch` → σε 1-2 λεπτά η αλλαγή φαίνεται online. Μετά επανάφερέ το με νέο commit (όχι force push).

Αν το build αποτύχει (π.χ. λάθος πεδίο), το site **μένει όπως ήταν** και το GitHub στέλνει email
στον owner. Το `gh run view --log-failed` δείχνει ποιο αρχείο και ποιο πεδίο.

**Απόδειξη:** push → η αλλαγή φαίνεται στο github.io URL.

### Φάση 2β: Φόρμα επικοινωνίας (email στο γραφείο)

Η φόρμα «Επικοινωνία» στέλνει τα μηνύματα μέσω του Web3Forms (δωρεάν, 250 μηνύματα τον μήνα).
Το Web3Forms τα στέλνει ως email στο email του γραφείου. Χωρίς κλειδί η φόρμα λέει «πάρτε μας τηλέφωνο».

1. Ο χρήστης ανοίγει https://web3forms.com, γράφει το **email του γραφείου** και πατάει «Create Access Key».
   Σε αυτό το email θα έρχονται τα μηνύματα.
2. Ο χρήστης ανοίγει το email από το Web3Forms και αντιγράφει το Access Key (μορφή `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
   Αυτό το κλειδί **δεν είναι μυστικό**: φαίνεται μέσα στη σελίδα. Επιτρέπεται να το επικολλήσει στη συνομιλία.
3. Βάλε το κλειδί στο `src/data/site.json` → `contact.formKey`. (Ή ο χρήστης από το CMS: Στοιχεία γραφείου → Επικοινωνία → «Κλειδί φόρμας».)
4. `npm run build` → `npm run dev` → άνοιξε `http://localhost:4321/#contact` στον browser.
   Στείλε ένα δοκιμαστικό μήνυμα (Όνομα: `Δοκιμή`). Πρέπει να γράψει «Ευχαριστούμε! Λάβαμε το μήνυμά σας…».
5. Ο χρήστης ελέγχει ότι ήρθε email (κοίτα και τα Ανεπιθύμητα· αν είναι εκεί, «Δεν είναι ανεπιθύμητο»).
6. Με «ναι»: commit `content: κλειδί φόρμας επικοινωνίας` → push → `gh run watch`.

**Απόδειξη:** δοκιμαστικό μήνυμα από το online site έφτασε στο email του γραφείου.

### Φάση 3: Login στο CMS από οποιονδήποτε υπολογιστή

Το CMS μπαίνει με ένα token (κλειδί πρόσβασης μόνο σε αυτό το repo) του λογαριασμού GitHub
**του γραφείου**. Ένα token **ανά υπολογιστή**, ώστε να ακυρώνεται μόνο αυτό αν χαθεί ένας υπολογιστής.
Δεν χρειάζεται κανένας server για login.

1. Συνδεδεμένος ως ο λογαριασμός του γραφείου, στο GitHub: Settings → Developer settings →
   Personal access tokens → **Fine-grained tokens** → Generate new token:
   - Token name: `av-website CMS <όνομα υπολογιστή>`
   - Expiration: 1 χρόνος. **Βάλε υπενθύμιση στο ημερολόγιο** μία εβδομάδα πριν λήξει.
   - Repository access: **Only select repositories** → `av-website`
   - Permissions → Repository permissions → **Contents: Read and write**. Τίποτα άλλο.
   Το token μπαίνει στον password manager. **Όχι** στη συνομιλία με το AI.
2. Κάποιος θέλει να μπαίνει με **δικό του** λογαριασμό GitHub; Τα fine-grained tokens δεν δουλεύουν
   για συνεργάτες σε repo προσωπικού λογαριασμού. Τότε: είτε το Παράρτημα (κουμπί GitHub), είτε
   ο λογαριασμός του γραφείου γίνεται GitHub Organization. Ρώτα τον τεχνικό.
3. Εσύ αλλάζεις στο `public/admin/config.yml` το `repo:` σε `<username γραφείου>/av-website`. Commit, push.
4. Το άτομο ανοίγει `https://<username>.github.io/av-website/admin/` → «Sign In Using Access Token» →
   επικολλά το token → αλλάζει κάτι → Save. Σε 1-2 λεπτά η αλλαγή φαίνεται online.
   Εσύ κάνεις `git pull` και δείχνεις το commit.

Το token μένει αποθηκευμένο σε αυτόν τον browser. Σε κοινόχρηστο υπολογιστή: «Sign Out» στο τέλος.
Αν χαθεί ή διαρρεύσει: GitHub → Settings → Developer settings → Personal access tokens → **Revoke**, και νέο.
Σφάλμα «Resource not accessible by personal access token» στο Save: το token δεν έχει δικαίωμα εγγραφής.
Στο token: Repository access = **Only select repositories** (όχι «Public repositories», που είναι μόνο ανάγνωση)
και Contents = **Read and write** (όχι Read-only). Μετά «Sign Out» στο CMS και ξανά login με το token.

**Απόδειξη:** αλλαγή από το online CMS εμφανίστηκε στο site και στο `git log`.

### Φάση 4: Domain (μόνο αν υπάρχει ή αγοραστεί)

Εδώ **δεν** αλλάζουν nameservers. Προστίθενται μόνο 2 είδη εγγραφών για το site.
Οι εγγραφές του email (MX, SPF, DKIM) δεν αγγίζονται, άρα το email δεν επηρεάζεται.

1. GitHub → το avatar πάνω δεξιά → Settings → Pages → **Add a domain** (επαλήθευση domain).
   Ο χρήστης προσθέτει την εγγραφή TXT που δίνει το GitHub στον registrar (π.χ. Papaki) και πατά Verify.
   Αυτό εμποδίζει άλλον να «κλέψει» το domain σε δικό του site.
2. Στον registrar, στις ρυθμίσεις DNS του domain:
   - **CNAME** `www` → `<username>.github.io`
   - **A** `@` (χωρίς www) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   Αν υπάρχουν ήδη A ή CNAME για `@` ή `www` (π.χ. παλιό site), **σταμάτα και ρώτα** τον τεχνικό πριν τα σβήσεις.
   Μην αλλάξεις τίποτα άλλο.
3. Repo `av-website` → Settings → Pages → Custom domain: `www.<domain>` → Save.
   Όταν περάσει ο έλεγχος (λεπτά έως λίγες ώρες): **Enforce HTTPS** ✓.
4. `gh workflow run deploy.yml`: το site χτίζεται ξανά στη ρίζα του domain (χωρίς `/av-website/`).

**Απόδειξη:** `https://www.<domain>/` και `https://<domain>/` ανοίγουν το site με λουκέτο.

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
| Registrar domain | <πάροχος> | | |
| Web3Forms (φόρμα) | <email γραφείου> | | νέο κλειδί: web3forms.com με το ίδιο email |
| Password manager | <email> | | master password: <πού φυλάσσεται> |

## Πού είναι τι
- Κώδικας + περιεχόμενο: github.com/<username>/av-website (public)
- Τοπικό αντίγραφο: C:\Sites\av-website στον υπολογιστή <όνομα>
- Backup: \\NAS\Site\backup\av-website-<ημερομηνία>.bundle (κάθε Δευτέρα)
- Site: GitHub Pages του repo (Settings → Pages). CMS login: token ανά άτομο (λήγει: <ημερομηνία>)

## Αν χαθεί ο υπολογιστής
Νέος υπολογιστής → SETUP.md Φάση 0, αλλά στο βήμα 6 αντί για clone + gh repo create:
    git clone https://github.com/<username>/av-website.git C:\Sites\av-website

## Αν χαθεί ο λογαριασμός GitHub
1. Recovery codes → login. Αν δεν γίνεται: νέος λογαριασμός GitHub.
2. git clone \\NAS\Site\backup\<πιο πρόσφατο>.bundle C:\Sites\av-website
3. cd C:\Sites\av-website ; git remote remove origin
4. gh repo create av-website --public --source . --remote origin --push
5. SETUP.md Φάση 2 (Pages), Φάση 3 (νέα tokens, config.yml) και, αν υπάρχει domain, Φάση 4

## Αν χαθούν όλα
Bundle από το NAS → SETUP.md από τη Φάση 0. Χρόνος: ~2 ώρες.
```

Εκτύπωσε το αρχείο και βάλ' το στον φάκελο «ΑΝΑΚΤΗΣΗ» μαζί με τα recovery codes.

### Φάση 7: Δοκιμή ανάκτησης (υποχρεωτική)

1. `git clone "<πιο πρόσφατο .bundle>" C:\Temp\restore-test`
2. `cd C:\Temp\restore-test` → `npm ci` → `npm run build`: πρέπει να τελειώσει με `Complete!`.
3. Σβήσε το `C:\Temp\restore-test`.

**Απόδειξη:** το site χτίζεται μόνο από το backup.

---

## Τέλος: λίστα ελέγχου

- [ ] Κανένα έργο με `demo: true` και κανένας αριθμός-παράδειγμα online
- [ ] Το site ανοίγει online (github.io ή domain)
- [ ] Push στο GitHub → αλλαγή online σε 1-2 λεπτά
- [ ] Login στο `/admin/` από άλλο υπολογιστή δουλεύει
- [ ] Η φόρμα επικοινωνίας στέλνει email στο γραφείο
- [ ] Claude Code προσθέτει έργο από φάκελο του NAS (με «ναι» πριν το push)
- [ ] Υπάρχει backup στο NAS και η εργασία τρέχει κάθε εβδομάδα
- [ ] Η δοκιμή ανάκτησης πέρασε
- [ ] Φάκελος «ΑΝΑΚΤΗΣΗ» τυπωμένος, recovery codes μέσα
- [ ] Owner στο GitHub και στο domain είναι ο λογαριασμός του γραφείου· ο τεχνικός είναι μόνο συνεργάτης
- [ ] Υπενθύμιση στο ημερολόγιο για τη λήξη κάθε token

---

## Παράρτημα (προαιρετικό): κουμπί «Sign In with GitHub» με Cloudflare

Μόνο αν τα tokens γίνουν ενόχληση (πολλά άτομα, συχνές λήξεις). Χρειάζεται δωρεάν λογαριασμό Cloudflare.

1. https://github.com/sveltia/sveltia-cms-auth → «Deploy to Cloudflare Workers». Κράτα το URL του Worker.
2. GitHub → Settings → Developer settings → OAuth Apps → New: callback `<URL Worker>/callback`. Generate client secret.
3. Cloudflare → Worker → Settings → Variables and Secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (τύπος Secret),
   `ALLOWED_DOMAINS` = το hostname του site. Τα επικολλά ο χρήστης, όχι το AI.
4. `public/admin/config.yml` → `base_url: <URL Worker>` κάτω από το `backend:`. Commit, push.
