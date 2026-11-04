// @ts-check
import { defineConfig } from "astro/config";

// Άλλαξε το site όταν μπει το τελικό domain (χρειάζεται για canonical URLs).
export default defineConfig({
  site: "https://av-website.workers.dev",
  trailingSlash: "ignore",
});
