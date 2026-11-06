import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Ένα έργο = ένα αρχείο src/content/projects/<id>.md
// Το build αποτυγχάνει αν λείπει υποχρεωτικό πεδίο ή έχει λάθος τύπο.
// Τα ίδια πεδία ορίζονται και στο public/admin/config.yml (CMS). Άλλαξε και τα δύο μαζί.
const projects = defineCollection({
  // Το id (και το URL /erga/<id>/) είναι πάντα το όνομα του αρχείου, ακόμα κι αν αλλάξει το πεδίο slug.
  // Έτσι μια αλλαγή στο CMS δεν σπάει links που έχουν ήδη μοιραστεί.
  loader: glob({ pattern: "*.md", base: "./src/content/projects", generateId: ({ entry }) => entry.replace(/\.md$/, "") }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    title: z.string().min(1),
    place: z.string().min(1),
    year: z.number().int().min(1950).max(2100),
    status: z.enum(["Ολοκληρώθηκε", "Σε εξέλιξη", "Μελέτη"]),
    categories: z.array(z.string().min(1)).min(1),
    order: z.number().default(100),
    wide: z.boolean().default(false),
    cover: z.string().min(1),
    gallery: z.array(z.string().min(1)).default([]),
    model: z.string().min(1).optional(), // 3D μοντέλο .glb, πρώτο στις φωτογραφίες
    summary: z.string().min(1),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    timeline: z.array(z.object({ date: z.string(), label: z.string(), done: z.boolean().default(false) })).default([]),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
  }),
});

export const collections = { projects };
