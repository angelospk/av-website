// @ts-check
import { defineConfig } from "astro/config";

// Στο GitHub Actions τα SITE_URL και BASE_PATH έρχονται από το actions/configure-pages:
// με δικό σας domain ή repo <user>.github.io το BASE_PATH είναι κενό (ρίζα),
// αλλιώς είναι "/<όνομα repo>". Τοπικά: ρίζα.
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "ignore",
});
