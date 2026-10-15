---
version: alpha
name: Axonas Dark Cinema
description: Dark, photo-led site for a full-service Greek engineering and construction office, with a live 3D house model in the hero.
colors:
  primary: "#F2F2F0"
  secondary: "#8A9099"
  tertiary: "#7FD1FF"
  neutral: "#0D0F11"
  surface: "#16191C"
  line: "#2A2E33"
  on-tertiary: "#0D0F11"
typography:
  display:
    fontFamily: Inter Tight
    fontSize: 88px
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: -0.035em
  h2:
    fontFamily: Inter Tight
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.025em
  h3:
    fontFamily: Inter Tight
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.08em
  stat:
    fontFamily: Inter Tight
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.03em
rounded:
  none: 0px
  sm: 4px
  full: 999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 96px
  section: 160px
components:
  nav-link:
    textColor: "{colors.primary}"
    typography: "{typography.label}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    padding: 16px
  button-ghost:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: 16px
  project-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  project-card-meta:
    textColor: "{colors.secondary}"
    typography: "{typography.label}"
  stat-value:
    textColor: "{colors.primary}"
    typography: "{typography.stat}"
  wireframe:
    textColor: "{colors.tertiary}"
  filter-chip-active:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.full}"
---

# Axonas Dark Cinema

## Overview

A dark, cinematic site for an office that does everything from permits to keys:
civil, architecture, surveying, mechanical, electrical, energy and construction.
It should feel like a serious engineering firm, not an agency. Photos and the
3D model carry the emotion; type stays quiet and white.

Recognisable traits:

1. Full-bleed dark hero with a white sans headline set bottom-left (Structure
   Engineers, aw1; Populous, lb8).
2. A live wireframe model in cyan line work that turns slowly in the hero
   (cyan outline frames from Pomerleau, lb1).
3. A row of large, light-weight stat numerals under the hero (Rogers-O'Brien,
   aw5, translated to dark).
4. Project cards as large photos with small mono metadata under them (Studio
   RHE, lb3; Structure Engineers bottom strip, aw1).
5. Section labels in small uppercase mono with an index number (Pomerleau, lb1).

## Colors

- **Primary (#F2F2F0):** Warm white for headlines, body and solid buttons.
- **Secondary (#8A9099):** Steel grey for metadata, captions and inactive nav.
- **Tertiary (#7FD1FF):** Blueprint cyan, only for the 3D wireframe, active
  filters and focus rings. Never for large fills.
- **Neutral (#0D0F11):** Near-black page background.
- **Surface (#16191C):** Raised panels and card placeholders.
- **Line (#2A2E33):** Hairline dividers between rows and sections.

## Typography

Inter Tight for display and headings, Inter for body, JetBrains Mono for labels,
indices and project metadata. All three cover Greek. Headlines use weight 500,
never bold. Labels are uppercase mono with wide tracking.

## Layout

12-column grid, max width 1440px, 48px side gutters (24px on mobile). Sections
are separated by 160px. The hero is 100svh. Project grid alternates one wide
card (8 columns) with one narrow card (4 columns).

## Elevation & Depth

No shadows. Depth comes from photography, the 3D scene and a dark gradient over
photos so white text stays readable.

## Shapes

Square or 4px corners on images and cards. Pill shape only for buttons and
filter chips.

## Components

- **Hero:** full-bleed scene, nav on top, headline bottom-left, CTA pair
  bottom-right, 3D canvas behind or to the right.
- **Stat row:** 4 numerals with mono captions, divided by hairlines.
- **Service list:** numbered rows (01-08) with hairline dividers; hover reveals a
  one-line description.
- **Project card:** photo, title (h3), mono metadata (place, year, services).
  Click opens a detail view with gallery and facts.
- **Process:** horizontal steps from survey to keys, numbered mono labels.

## Do's and Don'ts

- Do keep one accent (cyan) and use it sparingly.
- Do load projects from one data file so real projects can be added without
  touching layout code.
- Don't use bold display weights or coloured section backgrounds.
- Don't put text on a photo without the dark gradient.
