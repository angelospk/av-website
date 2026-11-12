// Έργα σε μία γλώσσα: τα ελληνικά (<id>.el.md) με τα αγγλικά κείμενα (<id>.en.md) από πάνω.
// Ό,τι λείπει στα αγγλικά μένει ελληνικό, ώστε ένα νέο έργο να φαίνεται και πριν μεταφραστεί.
import { getCollection } from "astro:content";
import { term, type Lang } from "../i18n";

export async function getProjects(lang: Lang) {
  const el = (await getCollection("projects", (p) => !p.data.draft)).sort((a, b) => a.data.order - b.data.order);
  const en = lang === "en" ? new Map((await getCollection("projectsEn")).map((p) => [p.id, p])) : new Map();
  return el.map((p) => {
    const tr = en.get(p.id);
    const d = { ...p.data, ...(tr?.data ?? {}) };
    return {
      id: p.id,
      ...d,
      live: p.data.status === "Σε εξέλιξη",
      status: d.status ? term(lang, d.status) : undefined,
      categories: d.categories.map((c) => term(lang, c)),
      html: (tr?.body?.trim() ? tr.rendered?.html : p.rendered?.html) ?? "",
    };
  });
}
export type Project = Awaited<ReturnType<typeof getProjects>>[number];
