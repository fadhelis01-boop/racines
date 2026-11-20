/* Racines — service worker : hors connexion + mises à jour.
   La constante VERSION est remplacée à chaque compilation : toute nouvelle version
   publiée est ainsi détectée par les appareils. */
const VERSION = "2026-11-20T00:10:51.218Z";
const APP_CACHE = "racines-app-" + VERSION;
const CONTENT_CACHE = "racines-content";
const IMG_CACHE = "racines-images";
const ALL_FILES = ["./assets/Agronome-DD0KZisq.js","./assets/Amenagements-D3sJDh7z.js","./assets/amenagements-lnHVYsyb.js","./assets/AnimalFiche-Br8ODIzF.js","./assets/Animaux-D2lIb-lr.js","./assets/Associations-BxQjCA1A.js","./assets/Bio-B3lGplkh.js","./assets/bio-C-n1p0Ws.js","./assets/Calculs-BDcHBaxh.js","./assets/Calendrier-DBdXQ0Hd.js","./assets/choisir-animal-DeiSUmaD.js","./assets/Conserver-C2edPF67.js","./assets/Cours-DVoa_hD4.js","./assets/Creer-BV5ioVxJ.js","./assets/Cueillette-B_cTLOdp.js","./assets/data-C-K-a5D8.js","./assets/Debuter-DZCG3p5B.js","./assets/Demenagement-BqFNuRJb.js","./assets/Diagnostic-Bq4CJyAU.js","./assets/error-BTdmRKoB.js","./assets/exports-BiCRKaLv.js","./assets/Fleurs-Df69s9du.js","./assets/fraunces-latin-600-normal-BFCDtZfi.woff2","./assets/fraunces-latin-700-normal-CEOla-zY.woff2","./assets/garden-BIbg1leo.js","./assets/GuideFiche-DbaGppVu.js","./assets/guides-complets-B7TuwguD.js","./assets/Guides-Dbp3x1_5.js","./assets/Identifier-Dy2CdSlT.js","./assets/index-BR1JGC16.js","./assets/index-DqKS8Ael.css","./assets/Interieur-Bgq6CK-u.js","./assets/Jardin-Da6PVtss.js","./assets/Lexique-DqqkMZi7.js","./assets/lexique-DSGAg5nL.js","./assets/MesPlantes-B7khKult.js","./assets/MotsLexique-BlV7Jkl3.js","./assets/node.browser-HQ5SKBOf.js","./assets/node.browser-OoJ7wuke.js","./assets/nunito-latin-400-normal-r8SDr6Up.woff2","./assets/nunito-latin-600-normal-Br8yIETf.woff2","./assets/nunito-latin-700-normal-Dort48En.woff2","./assets/nunito-latin-800-normal-Dz8SOQK_.woff2","./assets/nunito-latin-900-normal-BVB1fGs6.woff2","./assets/Nutrition-CVCTGyKW.js","./assets/ornement-CvZBhsHd.js","./assets/pedagogie-Dtc_OLV7.js","./assets/PlanCulture-Bro-b3VN.js","./assets/PlanteFiche-9aTT5rmE.js","./assets/Plantes-BdhZ4KaD.js","./assets/Plus-KnVHzMLO.js","./assets/ProblemeFiche-BZxqKgz7.js","./assets/races-DexivtNW.js","./assets/Recherche-WOnMh9qM.js","./assets/References-Botl3Cem.js","./assets/Reglages-CCWRd1Sm.js","./assets/RemedeFiche-C_eHKBBb.js","./assets/rolldown-runtime-4tVxZq34.js","./assets/Rucher-D1eNT12U.js","./assets/Sante-DnbRPy2b.js","./assets/SanteAnimale-CDEApLZ4.js","./assets/Schemas-BHidHfyx.js","./assets/search-fu-LdpL0.js","./assets/Sol-BLur0QVg.js","./assets/Suivi-CRWb0rgN.js","./assets/TableFumiers-CyOZxE3N.js","./assets/traits-D7Qc4Dts.js","./assets/ui-CcOrt1DE.js","./assets/wiki-D0UvXzdT.js","./ico/abeille.webp","./ico/animaux.webp","./ico/appartement.webp","./ico/arbre.webp","./ico/aromatique.webp","./ico/arrosage.webp","./ico/associations.webp","./ico/aujourdhui.webp","./ico/bacterie.webp","./ico/balcon.webp","./ico/boucherie.webp","./ico/calendrier.webp","./ico/carence.webp","./ico/champignon.webp","./ico/compost.webp","./ico/creer.webp","./ico/demarrer.webp","./ico/diagnostic.webp","./ico/engrais-vert.webp","./ico/fabriquer.webp","./ico/fleur.webp","./ico/floraison.webp","./ico/fruit.webp","./ico/fumier.webp","./ico/identifier.webp","./ico/interieur.webp","./ico/jardin.webp","./ico/legume.webp","./ico/lexique.webp","./ico/lune.webp","./ico/maison-jardin.webp","./ico/mammifere.webp","./ico/mesplantes.webp","./ico/meteo.webp","./ico/ornement.webp","./ico/petit-jardin.webp","./ico/photo.webp","./ico/physiologique.webp","./ico/plantation.webp","./ico/plantes.webp","./ico/plus.webp","./ico/potager-interieur.webp","./ico/ravageur.webp","./ico/recherche.webp","./ico/recolte-action.webp","./ico/recolte.webp","./ico/reglages.webp","./ico/sante.webp","./ico/sauvage.webp","./ico/securite.webp","./ico/semis.webp","./ico/semisAbri.webp","./ico/semisPlace.webp","./ico/serre.webp","./ico/sol.webp","./ico/taches.webp","./ico/taille.webp","./ico/toxique.webp","./ico/tutoriels.webp","./ico/virus.webp"];
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon.svg", "./icons/icon-192.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      await cache.addAll(CORE);
      // Pré-cache de toute l'application (pages, données, illustrations) :
      // tout fonctionne hors connexion dès la première visite.
      try {
        await cache.addAll(ALL_FILES);
      } catch (e) {
        /* hors ligne pendant l'installation : les fichiers seront mis en cache à la demande */
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k.startsWith("racines-app-") && k !== APP_CACHE) await caches.delete(k);
      await self.clients.claim();
    })(),
  );
});

// Rappels quand l'appli est fermée (Chrome / Android, appli installée)
self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "racines-rappels") return;
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CONTENT_CACHE);
      const r = await cache.match("./rappels.json");
      if (!r) return;
      const jour = new Date().toISOString().slice(0, 10);
      const dus = (await r.json()).filter((x) => x.date <= jour);
      if (!dus.length) return;
      const noms = [...new Set(dus.map((x) => x.texte))];
      await self.registration.showNotification("Racines 🌿", { body: `${noms.length} plante${noms.length > 1 ? "s" : ""} à vérifier : ${noms.slice(0, 4).join(", ")}. Touchez la terre avant d'arroser.`, icon: "./icons/icon-192.png", tag: "racines-jour", data: { url: "./#/" } });
    } catch (e) { /* rien à signaler */ }
  })());
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (wins.length) return wins[0].focus();
    return self.clients.openWindow((event.notification.data && event.notification.data.url) || "./");
  })());
});

self.addEventListener("message", (e) => {
  if (e.data === "skip-waiting") self.skipWaiting();
});

async function networkFirst(req, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(fallbackUrl ?? req, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(fallbackUrl ?? req)) || (await caches.match(req)) || Response.error();
  }
}

async function cacheFirst(req, cacheName) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) (await caches.open(cacheName)).put(req, res.clone()); // images en CORS (crossorigin) : pas de réponses opaques
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreSearch: false });
  const net = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => hit || Response.error());
  return hit || net;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Photos Wikimedia et polices : cache durable (consultables hors connexion
  // une fois vues), conservé d'une version de l'application à l'autre.
  if (url.hostname === "upload.wikimedia.org" || url.hostname === "fonts.gstatic.com" || url.hostname === "fonts.googleapis.com") {
    event.respondWith(cacheFirst(req, IMG_CACHE));
    return;
  }
  if (url.origin !== self.location.origin) return; // météo, API Claude, Pl@ntNet : jamais mis en cache

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, APP_CACHE, "./index.html"));
    return;
  }
  // Illustrations : cache durable, rempli à la demande (pas de préchargement)
  if (url.pathname.includes("/img/")) {
    event.respondWith(cacheFirst(req, IMG_CACHE));
    return;
  }
  if (url.pathname.includes("/assets/")) {
    event.respondWith(cacheFirst(req, APP_CACHE));
    return;
  }
  if (url.pathname.includes("/content/")) {
    // « Vérifier les mises à jour » demande explicitement la version réseau
    if (req.cache === "no-cache" || req.cache === "reload") event.respondWith(networkFirst(req, CONTENT_CACHE));
    else event.respondWith(staleWhileRevalidate(req, CONTENT_CACHE));
    return;
  }
  event.respondWith(staleWhileRevalidate(req, APP_CACHE));
});
