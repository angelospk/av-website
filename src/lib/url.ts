// Το site μπορεί να ζει στη ρίζα (domain ή <user>.github.io) ή σε υποφάκελο (<user>.github.io/av-website/).
// Το u("/images/x.webp") βάζει μπροστά τον υποφάκελο όταν χρειάζεται. Εξωτερικά URL μένουν ίδια.
export const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const u = (p: string) => (p.startsWith("/") && !p.startsWith("//") ? base + p : p);
// Για HTML από Markdown: διορθώνει src="/..." και href="/...".
export const fixHtml = (html: string) => html.replace(/\b(src|href)="\/(?!\/)/g, `$1="${base}/`);
