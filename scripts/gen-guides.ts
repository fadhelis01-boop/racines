// Génère src/data/guides-meta.json (résumés des tutoriels chargés au démarrage) à partir des tutoriels complets.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { GUIDES_COMPLETS } from "../src/data/guides-complets";
const meta = GUIDES_COMPLETS.map(({ etapes, materiel, conseils, erreurs, video, ...m }) => m);
const json = JSON.stringify(meta);
const f = "src/data/guides-meta.json";
if (!existsSync(f) || readFileSync(f, "utf8") !== json) { writeFileSync(f, json); console.log(`✓ Résumés des tutoriels régénérés (${meta.length})`); }
else console.log(`✓ Résumés des tutoriels à jour (${meta.length})`);
