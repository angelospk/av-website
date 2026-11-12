// Γλώσσες του site. Ελληνικά στο /, αγγλικά στο /en/.
// Τα κείμενα της σελίδας που ΔΕΝ είναι στο CMS (μενού, τίτλοι, φόρμα) είναι εδώ.
// Κάθε αλλαγή σε ελληνικό κείμενο εδώ θέλει και την αγγλική της.
import siteAll from "./data/site.json";
import { u } from "./lib/url";

export const LANGS = ["el", "en"] as const;
export type Lang = (typeof LANGS)[number];

// Στοιχεία γραφείου από το CMS (src/data/site.json = { el: {...}, en: {...} }).
// Ό,τι λείπει στα αγγλικά παίρνεται από τα ελληνικά (και μέσα στα contact/process).
export const siteFor = (lang: Lang) => {
  const el = siteAll.el;
  const en: Partial<typeof el> = lang === "en" ? siteAll.en : {};
  return {
    ...el,
    ...en,
    contact: { ...el.contact, ...en.contact },
    process: { ...el.process, ...en.process },
  };
};

// Διαδρομή στη σωστή γλώσσα: path(lang, "/#projects") -> "/en/#projects" στα αγγλικά.
export const path = (lang: Lang, p: string) => u(lang === "en" ? `/en${p}` : p);

// Σελίδα έργου: /erga/<id>/ και /en/projects/<id>/.
export const projectPath = (lang: Lang, id: string) => path(lang, lang === "en" ? `/projects/${id}/` : `/erga/${id}/`);

// Κατηγορίες και καταστάσεις έργων: στο CMS γράφονται στα ελληνικά.
// Νέα κατηγορία στο CMS: πρόσθεσε εδώ και την αγγλική.
const EN_TERMS: Record<string, string> = {
  "Κατοικία": "House",
  "Ανακαίνιση": "Renovation",
  "Ενέργεια": "Energy",
  "Άδειες": "Permits",
  "Τοπογραφικά": "Surveys",
  "Ολοκληρώθηκε": "Completed",
  "Σε εξέλιξη": "In progress",
  "Μελέτη": "Design stage",
};
export const term = (lang: Lang, s: string) => (lang === "en" ? EN_TERMS[s] ?? s : s);

export const T = {
  el: {
    name: "Αλέξανδρος Βλάχος",
    role: "Πολιτικός μηχανικός · Τεχνικό γραφείο",
    roleShort: "Πολιτικός μηχανικός",
    title: "Αλέξανδρος Βλάχος | Πολιτικός μηχανικός, Λευκάδα",
    description: "Τεχνικό γραφείο του πολιτικού μηχανικού Αλέξανδρου Βλάχου στη Λευκάδα. Άδειες, μελέτες, ενεργειακά, τοπογραφικά και κατασκευή κατοικιών.",
    navProjects: "Έργα",
    navServices: "Υπηρεσίες",
    navProcess: "Διαδρομή",
    navContact: "Επικοινωνία",
    menu: "Μενού",
    switchLabel: "English",
    switchShort: "EN",
    footerLabel: "ΤΕΕ · Μέλη Μητρώου Μελετητών",
    hero3d: "Τρισδιάστατο μοντέλο κατοικίας",
    heroLabel: "Μελέτες · Άδειες · Ενέργεια · Κατασκευή",
    heroTitle: "Μελέτη, άδεια<br>και κατασκευή.",
    ctaVisit: "Κλείστε αυτοψία",
    ctaProjects: "Δείτε έργα",
    projectsTitle: "Επιλεγμένα έργα",
    filterLabel: "Φίλτρο κατηγορίας",
    servicesTitle: "Τι αναλαμβάνουμε",
    contactTitle: "Πείτε μας για το ακίνητό σας.",
    contactLede: "Απαντάμε την ίδια ή την επόμενη εργάσιμη.",
    office: "Γραφείο",
    phone: "Τηλέφωνο",
    email: "Email",
    formName: "Όνομα",
    formPhone: "Τηλέφωνο",
    formNeed: "Τι χρειάζεστε;",
    needs: ["Άδεια δόμησης / νέα κατοικία", "Ανακαίνιση", "Ενεργειακή αναβάθμιση / Εξοικονομώ", "Τακτοποίηση αυθαιρέτου", "Τοπογραφικό", "Κάτι άλλο"],
    formMsg: "Μήνυμα",
    formSend: "Αποστολή",
    formOff: "Η φόρμα δεν στέλνει ακόμα μηνύματα. Πάρτε μας στο {phone}.",
    formSending: "Αποστολή…",
    formOk: "Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα σας καλέσουμε σύντομα.",
    formFail: "Το μήνυμα δεν στάλθηκε. Πάρτε μας στο {phone}.",
    close: "Κλείσιμο",
    all: "Όλα",
    projectPage: "Σελίδα έργου",
    allProjects: "Όλα τα έργα",
    photos: "Φωτογραφίες",
    photo: "Φωτογραφία",
    prev: "Προηγούμενη",
    next: "Επόμενη",
    model3d: "3D μοντέλο",
    model3dHint: "3D · σύρετε για περιστροφή",
  },
  en: {
    name: "Alexandros Vlachos",
    role: "Civil engineer · Engineering office",
    roleShort: "Civil engineer",
    title: "Alexandros Vlachos | Civil engineer, Lefkada",
    description: "Engineering office of civil engineer Alexandros Vlachos in Lefkada, Greece. Building permits, design, energy, land surveys and house construction.",
    navProjects: "Projects",
    navServices: "Services",
    navProcess: "Process",
    navContact: "Contact",
    menu: "Menu",
    switchLabel: "Ελληνικά",
    switchShort: "EL",
    footerLabel: "TEE · Registered in the Greek Register of Consultants",
    hero3d: "3D model of a house",
    heroLabel: "Design · Permits · Energy · Construction",
    heroTitle: "Design, permit<br>and construction.",
    ctaVisit: "Book a site visit",
    ctaProjects: "See projects",
    projectsTitle: "Selected projects",
    filterLabel: "Category filter",
    servicesTitle: "What we do",
    contactTitle: "Tell us about your property.",
    contactLede: "We reply the same or the next working day.",
    office: "Office",
    phone: "Phone",
    email: "Email",
    formName: "Name",
    formPhone: "Phone",
    formNeed: "What do you need?",
    needs: ["Building permit / new house", "Renovation", "Energy upgrade", "Legalisation of unauthorised works", "Land survey", "Something else"],
    formMsg: "Message",
    formSend: "Send",
    formOff: "The form does not send messages yet. Call us on {phone}.",
    formSending: "Sending…",
    formOk: "Thank you! We received your message and will call you soon.",
    formFail: "The message was not sent. Call us on {phone}.",
    close: "Close",
    all: "All",
    projectPage: "Project page",
    allProjects: "All projects",
    photos: "Photos",
    photo: "Photo",
    prev: "Previous",
    next: "Next",
    model3d: "3D model",
    model3dHint: "3D · drag to rotate",
  },
} satisfies Record<Lang, Record<string, string | string[]>>;
