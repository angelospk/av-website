import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Ένα έργο = src/content/projects/<id>.el.md (ελληνικά, όλα τα πεδία)
//          + src/content/projects/<id>.en.md (αγγλικά, μόνο τα κείμενα· ό,τι λείπει παίρνεται από τα ελληνικά).
// Το build αποτυγχάνει αν λείπει υποχρεωτικό πεδίο ή έχει λάθος τύπο.
// Τα ίδια πεδία ορίζονται και στο public/admin/config.yml (CMS). Άλλαξε και τα δύο μαζί.
const facts = z.array(z.object({ label: z.string(), value: z.string() }));
const timeline = z.array(z.object({ date: z.string(), label: z.string(), done: z.boolean().default(false) }));
const projects = defineCollection({
  // Το id (και το URL /erga/<id>/) είναι πάντα το όνομα του αρχείου, ακόμα κι αν αλλάξει το πεδίο slug.
  // Έτσι μια αλλαγή στο CMS δεν σπάει links που έχουν ήδη μοιραστεί.
  loader: glob({ pattern: "*.el.md", base: "./src/content/projects", generateId: ({ entry }) => entry.replace(/\.el\.md$/, "") }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    title: z.string().min(1),
    place: z.string().min(1).optional(), // κενό = δεν φαίνεται
    year: z.number().int().min(1950).max(2100).optional(), // μόνο αν έχει επιβεβαιωθεί
    status: z.enum(["Ολοκληρώθηκε", "Σε εξέλιξη", "Μελέτη"]).optional(), // μόνο αν έχει επιβεβαιωθεί
    categories: z.array(z.string().min(1)).min(1),
    order: z.number().default(100),
    wide: z.boolean().default(false),
    cover: z.string().min(1),
    gallery: z.array(z.string().min(1)).default([]),
    model: z.string().min(1).optional(), // 3D μοντέλο .glb, πρώτο στις φωτογραφίες
    summary: z.string().min(1),
    facts: facts.default([]),
    timeline: timeline.default([]),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
  }),
});

// Αγγλική μετάφραση ενός έργου. Μόνο τα πεδία που μεταφράζονται.
const projectsEn = defineCollection({
  loader: glob({ pattern: "*.en.md", base: "./src/content/projects", generateId: ({ entry }) => entry.replace(/\.en\.md$/, "") }),
  schema: z.object({
    title: z.string().min(1).optional(),
    place: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
    facts: facts.optional(),
    timeline: timeline.optional(),
  }),
});

export const collections = { projects, projectsEn };
