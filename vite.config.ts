import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

// Estampille le service worker à chaque compilation : les appareils
// détectent ainsi la nouvelle version et proposent la mise à jour.
function stampServiceWorker(): Plugin {
  return {
    name: "stamp-sw",
    apply: "build",
    closeBundle() {
      const f = "dist/sw.js";
      const list = (d: string) => (existsSync("dist/" + d) ? readdirSync("dist/" + d).map((x) => `./${d}/${x}`) : []);
      const files = [...list("assets"), ...list("img")];
      if (existsSync(f)) writeFileSync(f, readFileSync(f, "utf8").replaceAll("__BUILD__", new Date().toISOString()).replace("[] /*__FILES__*/", JSON.stringify(files)));
    },
  };
}

// base "./" : fonctionne à la racine d'un domaine comme dans un sous-dossier
// (GitHub Pages, NAS…), sans configuration.
export default defineConfig({
  base: "./",
  plugins: [react(), stampServiceWorker()],
  build: { target: "es2020", chunkSizeWarningLimit: 900 },
  server: { port: 5198 },
  preview: { port: 5199 },
});
