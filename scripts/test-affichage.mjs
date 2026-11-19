// Test d'affichage : ouvre la version compilée (dist) dans Edge ou Chrome, au format téléphone,
// et vérifie pour chaque page principale : pas d'erreur, un titre, pas de débordement horizontal,
// et des zones à toucher suffisantes pour les tâches à cocher.
// Usage : npm run build puis npm run test:affichage
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import puppeteer from "puppeteer-core";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const NAVIGATEURS = [
  process.env.NAVIGATEUR,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const exe = NAVIGATEURS.find((x) => existsSync(x));
if (!exe) { console.log("⚠ Aucun navigateur Edge ou Chrome trouvé : test d'affichage ignoré (NAVIGATEUR=chemin pour le préciser)."); process.exit(0); }

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon" };
const racine = normalize("dist");
const serveur = createServer(async (req, res) => {
  const chemin = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const f = join(racine, chemin === "/" ? "index.html" : chemin);
  try { const b = await readFile(f); res.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = serveur.address().port;
const base = `http://localhost:${port}/`;

const PAGES = ["/", "/jardin", "/plantes", "/plante/tomate", "/sante", "/diagnostic", "/calendrier", "/guides", "/guide/bocaux", "/plus", "/conserver", "/conserver?t=temps", "/debuter", "/interieur", "/animaux", "/animal/poule", "/rucher", "/lexique", "/reglages", "/recherche?q=limaces", "/sol", "/nutrition", "/creer", "/calculs", "/plan-culture", "/amenagements", "/cueillette", "/bio", "/probleme/pucerons", "/maladie-animale/varroa", "/agronome", "/agronome?t=azote", "/agronome?t=dj", "/cours", "/references", "/guide/rotation"];

const profil = mkdtempSync(join(tmpdir(), "racines-test-"));
const navigateur = await puppeteer.launch({ executablePath: exe, headless: true, userDataDir: profil, args: ["--no-first-run", "--disable-extensions", "--no-default-browser-check"] });
let echecs = 0;
const ko = (m) => { echecs++; console.error("✗ " + m); };
try {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(String(e.message ?? e)));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR|wikimedia|status of 404/.test(m.text())) erreurs.push(m.text()); });

  // Premier lancement : on passe l'accueil de bienvenue
  await page.goto(base, { waitUntil: "networkidle0" });
  for (let i = 0; i < 10; i++) {
    const clic = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button,a")].find((x) => /^(Commencer|Continuer|Oui|Terminer|Aller au jardin)/i.test(x.textContent.trim()));
      if (!b) return false; b.click(); return true;
    });
    if (!clic) break;
    await new Promise((r) => setTimeout(r, 250));
  }

  for (const p of PAGES) {
    erreurs.length = 0;
    await page.goto(`${base}#${p}`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() => !document.querySelector("main")?.innerText.includes("Chargement…"), { timeout: 8000 }).catch(() => ko(`${p} : reste sur « Chargement… »`));
    const r = await page.evaluate(() => {
      const m = document.querySelector("main");
      const deborde = [...document.querySelectorAll("main *")].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right > innerWidth + 2 && !e.closest(".scroll-x,[role=tablist],.table-wrap,table,svg,.wx,pre,.chips") && getComputedStyle(e).position !== "fixed"; }).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]}`);
      const petites = [...document.querySelectorAll("main .task")].filter((e) => e.getBoundingClientRect().height < 40).length;
      return { h1: !!m?.querySelector("h1"), largeur: document.documentElement.scrollWidth, deborde: [...new Set(deborde)].slice(0, 3), petites, garde: !!m?.innerText.match(/Oups|Une erreur est survenue/) };
    });
    if (!r.h1) ko(`${p} : pas de titre de page`);
    if (r.largeur > 377) ko(`${p} : la page déborde horizontalement (${r.largeur}px) ${r.deborde.join(" ")}`);
    if (r.petites) ko(`${p} : ${r.petites} tâche(s) à cocher trop petite(s)`);
    if (r.garde) ko(`${p} : la page affiche une erreur`);
    if (erreurs.length) ko(`${p} : erreur ${erreurs[0].slice(0, 160)}`);
  }
  // Impression : une page normale doit garder son contenu et masquer les menus
  await page.goto(`${base}#/guide/bocaux`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.querySelector("main h1"), { timeout: 8000 }).catch(() => undefined);
  await page.emulateMediaType("print");
  const impr = await page.evaluate(() => {
    const m = document.querySelector("main");
    const vis = m ? getComputedStyle(m.querySelector("h1") ?? m).visibility : "hidden";
    const side = document.querySelector(".bottom-nav, .side");
    return { visible: vis === "visible" && (m?.getBoundingClientRect().height ?? 0) > 200, menu: side ? getComputedStyle(side).display : "none" };
  });
  if (!impr.visible) ko("impression : le contenu d'un tutoriel ne s'imprime pas");
  if (impr.menu !== "none") ko("impression : les menus apparaissent sur la page imprimée");
  await page.emulateMediaType("screen");
} finally {
  await navigateur.close();
  serveur.close();
  try { rmSync(profil, { recursive: true, force: true }); } catch { /* profil verrouillé : ignoré */ }
}
console.log(echecs ? `✗ ${echecs} problème(s) d'affichage` : `✓ ${PAGES.length} pages affichées sans erreur au format téléphone`);
process.exit(echecs ? 1 : 0);
