// Photos des fiches : jusqu'à 4 vues par fiche (photo principale de l'article
// Wikipédia + autres images de l'article), avec l'auteur et la licence de chaque
// image (obligatoire pour les licences Creative Commons).
// Requêtes groupées (20 articles, puis 40 fichiers par requête) : l'API REST
// « media-list » de Wikipédia est trop bridée pour un appel par fiche.
// Usage : npm run wiki          (ne récupère que les fiches nouvelles)
//         FORCE=1 npm run wiki  (tout récupérer)
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { PLANTES, PROBLEMES, ANIMAUX, AUXILIAIRES } from "../src/data/index";
import { LEXIQUE } from "../src/data/lexique";

type Ph = { img: string; full: string; page: string; auteur: string; licence: string };
const OUT = "src/data/wiki.json";
const old: Record<string, { photos?: Ph[]; article?: string }> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const UA = { "User-Agent": "RacinesJardinApp/1.1 (application de jardinage hors ligne)" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Photos d'article inadaptées (vue de jardin botanique, détail, plante sauvage géante) :
// on place d'abord une vue de la plante telle qu'on la cultive.
const RECHERCHE: Record<string, string> = {
  abelia: "Abelia grandiflora flowers", hosta: "Hosta leaves garden", "geranium-vivace": "Geranium Rozanne", nepeta: "Nepeta faassenii", stipa: "Stipa tenuissima",
  bonsai: "Ficus microcarpa bonsai",
  gloxinia: "Sinningia speciosa",
  "feu-bacterien": "Erwinia amylovora fire blight",
  cissus: "Cissus rhombifolia",
  azalee: "Rhododendron simsii",
  hortensia: "Hydrangea macrophylla",
  muguet: "Convallaria majalis",
  murier: "Rubus fruticosus fruits",
  "taches-noires-rosier": "Diplocarpon rosae",
  "cul-noir": "Blossom end rot tomato",
  "mildiou-oignon": "Peronospora destructor onion",
  "pourriture-blanche": "Sclerotium cepivorum",
  "tenthrede-groseillier": "sawfly larvae gooseberry",
  "mouche-figue": "Silba adipata",
  // Animaux et plantes dont l'article n'offrait que des planches, des squelettes ou des scènes de boucherie
  chevre: "goats farm pasture", cochon: "domestic pigs pasture", pigeon: "domestic pigeon dovecote", mouton: "sheep flock pasture",
  herisson: "Erinaceus europaeus garden", freesia: "Freesia flowers", eleagnus: "Elaeagnus ebbingei", amelanchier: "Amelanchier lamarckii", bergenia: "Bergenia cordifolia flowers", kaki: "Diospyros kaki fruits tree", sarrasin: "Fagopyrum esculentum flowers field", taupe: "Talpa europaea", blette: "Swiss chard garden", cognassier: "quince fruit tree", poinsettia: "Poinsettia plant pot",
};
// Mots anglais ou latins fréquents dans les noms de fichiers des maladies et ravageurs
const EN: Record<string, string[]> = {
  mildiou: ["blight", "phytoph", "mildew"], oidium: ["mildew", "mehltau", "erysiph"], pucerons: ["aphid", "blattlaus", "aphis"],
  limaces: ["slug", "arion", "limax", "deroceras"], rouille: ["rust", "puccinia"], botrytis: ["botrytis", "grey_mould", "gray_mold"],
  doryphore: ["leptinotarsa", "colorado"], altise: ["flea_beetle", "phyllotreta"], pieride: ["pieris", "cabbage_white"],
  cochenilles: ["scale", "mealybug", "coccus"], tetranyque: ["tetranychus", "spider_mite"], aleurode: ["whitefly", "trialeurodes"],
  thrips: ["thrips"], carpocapse: ["cydia", "codling"], tavelure: ["venturia", "scab"], cloque: ["taphrina", "leaf_curl"],
  moniliose: ["monilinia"], poule: ["gallus", "chicken", "hen_"], canard: ["duck", "anas_"], lapin: ["rabbit", "oryctolagus"],
  chevre: ["goat", "capra"], mouton: ["sheep", "ovis"], ane: ["donkey", "equus_asinus"], cochon: ["pig", "sus_scrofa"],
  oie: ["goose", "anser"], "tenthrede-groseillier": ["nematus", "sawfly"], processionnaire: ["thaumetopoea", "processionary"], "pyrale-buis": ["cydalima", "box_tree", "glyphodes"], "taches-noires-rosier": ["diplocarpon", "black_spot", "rose"], cheval: ["horse", "equus"], dindon: ["turkey", "meleagris"], pigeon: ["columba", "pigeon"], pintade: ["guineafowl", "numida"], abeille: ["apis", "honey_bee", "honeybee"],
};
const EXCLURE = /\.svg|logo|map|carte|distribution|diagram|schema|icon|range|flag|drawing|illustration|herbarium|herbier|\.gif|\.tif|Tomate_Dev_Num|Commons-|Wikispecies|Wiktionary|Disambig|Nuvola|Crystal_Clear|Gnome-|Question_book|Edit-clear|Loudspeaker|Info_|Red_pog|catalog|florist|journal|rare_flowers|Angiospermes|nematode|Internet_Archive|_page_|Seed_catalog|skull|cr[aâ]ne|skeleton|squelette|anatom|h[ée]raldi|blason|piggy|tirelire|d[ée]pe[çc]age|boucher|butcher|bulletin|manual|annual|price_list|monograph|pruning-book|BHL|DPLA|Archives|Medizinal|Magazine|Gleanings|homes_and_gardens|Letterbox|infographic|cyclopaedia|Everything_for_the_garden|Vick.s_garden|_\(1[89]\d\d\)/i;

async function getJson(url: string): Promise<any> {
  for (let i = 0; i < 8; i++) {
    const r = await fetch(url, { headers: UA });
    if (r.status === 429) { await sleep(3000 * (i + 1)); continue; }
    if (!r.ok) return null;
    return r.json();
  }
  return null;
}
const cle = (f: string) => f.replace(/^(Fichier|File):/, "").replace(/_/g, " ").trim();

// Fichiers de chaque article : image principale (pageimages) puis images de l'article
async function fichiersArticles(titres: string[]): Promise<Map<string, { lead?: string; autres: string[] }>> {
  const res = new Map<string, { lead?: string; autres: string[] }>();
  for (let i = 0; i < titres.length; i += 20) {
    const lot = titres.slice(i, i + 20);
    const lead = new Map<string, string>();
    const imgs = new Map<string, string[]>();
    let cont: Record<string, string> = {};
    let alias = new Map<string, string>();
    for (let n = 0; n < 15; n++) {
      const qs = new URLSearchParams({ action: "query", format: "json", redirects: "1", prop: "pageimages|images", piprop: "original", imlimit: "max", titles: lot.join("|"), ...cont });
      const j = await getJson(`https://fr.wikipedia.org/w/api.php?${qs}`);
      if (!j) break;
      for (const x of [...(j.query?.normalized ?? []), ...(j.query?.redirects ?? [])]) alias.set(x.to, alias.get(x.from) ?? x.from);
      for (const p of Object.values(j.query?.pages ?? {}) as any[]) {
        const t = alias.get(p.title) ?? p.title;
        if (p.original?.source) lead.set(t, cle(decodeURIComponent(String(p.original.source).split("/").pop()!)));
        for (const im of p.images ?? []) imgs.set(t, [...(imgs.get(t) ?? []), cle(im.title)]);
      }
      if (!j.continue) break;
      cont = j.continue;
      await sleep(200);
    }
    for (const t of lot) {
      const ok = (f: string) => !EXCLURE.test(f.replace(/ /g, "_")) && /\.(jpe?g|png|webp)$/i.test(f);
      const l = lead.get(t);
      res.set(t, { lead: l && ok(l) ? l : undefined, autres: (imgs.get(t) ?? []).filter((f) => ok(f) && f !== l) });
    }
    console.log(`articles ${Math.min(i + 20, titres.length)}/${titres.length}`);
    await sleep(300);
  }
  return res;
}

async function rechercheCommons(q: string): Promise<string[]> {
  const j = await getJson(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=8&format=json&srsearch=${encodeURIComponent(q + " filetype:bitmap")}`);
  return ((j?.query?.search ?? []) as { title: string }[]).map((x) => cle(x.title)).filter((f) => !EXCLURE.test(f) && /\.(jpe?g|png|webp)$/i.test(f));
}

const strip = (h: string) => h.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
async function infos(fichiers: string[]): Promise<Map<string, Ph>> {
  const out = new Map<string, Ph>();
  for (let i = 0; i < fichiers.length; i += 40) {
    const lot = fichiers.slice(i, i + 40);
    const qs = new URLSearchParams({ action: "query", prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "500", format: "json", titles: lot.map((f) => "File:" + f).join("|") });
    const j = await getJson(`https://commons.wikimedia.org/w/api.php?${qs}`);
    for (const p of Object.values(j?.query?.pages ?? {}) as any[]) {
      const ii = p?.imageinfo?.[0];
      if (!ii || !/image\/(jpeg|png|webp)/.test(ii.mime)) continue;
      const m = ii.extmetadata ?? {};
      out.set(cle(p.title), { img: ii.thumburl, full: ii.url, page: ii.descriptionurl, auteur: strip(m.Artist?.value ?? "").slice(0, 80) || "Auteur inconnu", licence: strip(m.LicenseShortName?.value ?? "") || "Licence libre" });
    }
    console.log(`photos ${Math.min(i + 40, fichiers.length)}/${fichiers.length}`);
    await sleep(300);
  }
  return out;
}

const ONLY = (process.env.ONLY ?? "").split(",").filter(Boolean);
const items = ([...PLANTES, ...PROBLEMES, ...ANIMAUX, ...AUXILIAIRES, ...LEXIQUE.filter((t) => t.wiki).map((t) => ({ id: "lex-" + t.id, wiki: t.wiki!, nom: t.terme }))].filter((x) => x.wiki) as { id: string; wiki: string; photo?: string }[]).filter((it) => (ONLY.length ? ONLY.includes(it.id) : process.env.FORCE || !old[it.id]?.photos?.length));
const out: Record<string, { photos: Ph[]; article: string }> = {};
for (const [k, v] of Object.entries(old)) if (v.photos?.length) out[k] = v as (typeof out)[string];

const parArticle = await fichiersArticles([...new Set(items.map((it) => it.wiki))]);
const candidats = new Map<string, string[]>();
for (const it of items) {
  // Image principale de l'article + images dont le nom cite la plante (évite les illustrations hors sujet)
  const mots = [it.wiki, (it as { latin?: string }).latin ?? "", (it as { nom?: string }).nom ?? ""].join(" ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z]+/).filter((w) => w.length >= 4 && !["plante", "maladie", "commun", "commune", "domestique", "plantes"].includes(w)).map((w) => w.slice(0, 6));
  const art = parArticle.get(it.wiki) ?? { autres: [] };
  const cite = (x: string) => mots.some((m) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(m));
  const photo = (x: string) => /\.jpe?g$/i.test(x);
  const estPlante = PLANTES.some((p) => p.id === it.id);
  // Image principale : une photo, ou un PNG qui cite la plante. Autres images : pour une plante,
  // seulement celles qui la citent ; pour une maladie, un ravageur ou un animal, toute photo.
  let f = [...(art.lead && (photo(art.lead) || cite(art.lead)) ? [art.lead] : []), ...art.autres.filter((x) => cite(x) || (!estPlante && EN[it.id]?.some((m) => x.toLowerCase().includes(m))))];
  if (RECHERCHE[it.id]) { f = [...(await rechercheCommons(RECHERCHE[it.id])).slice(0, 2), ...f]; await sleep(300); }
  if (it.photo) f = [cle(it.photo), ...f];
  candidats.set(it.id, [...new Set(f)].slice(0, 6));
}
// Techniques sans article dédié : recherche directe de photos sur Commons
const PHOTOS_TECHNIQUES: Record<string, string> = {
  "am-planches": "vegetable garden beds", "am-carres": "square foot gardening raised bed", "am-butte": "hugelkultur bed",
  "am-lasagnes": "sheet mulching", "am-serrure": "keyhole garden", "am-mandala": "mandala garden",
  "am-bacs-hauts": "raised bed garden", "am-serre": "polytunnel tomatoes", "am-jardin-foret": "forest garden permaculture",
  "am-verger": "orchard meadow apple trees", "am-pots": "balcony vegetable garden", "am-vertical": "vertical garden vegetables wall",
  "am-sol-vivant": "no dig garden compost mulch", "am-prairie": "wildflower meadow garden", "am-jardin-sec": "gravel garden",
  "am-anglais": "cottage garden flower border", "am-francais": "potager Villandry", "am-mare": "garden pond wildlife", "am-zones": "permaculture zones garden design",
  "am-poulailler-mobile": "chicken tractor mobile coop",
  "am-rangs": "vegetable garden rows allotment", "am-trois-soeurs": "three sisters maize beans squash", "am-bottes-paille": "straw bale gardening",
  "am-sacs": "grow bag potatoes", "am-hydroponie": "hydroponic lettuce",
  "cueillir-tomates": "picking tomatoes hand", "cueillir-salade": "harvesting lettuce knife", "arracher-racines": "harvesting carrots garden fork",
  "cueillir-fruits-arbre": "picking apples tree hand", "cueillir-petits-fruits": "picking raspberries",
  "couper-fleurs": "cutting flowers secateurs", "couper-aromatiques": "harvesting basil", "recolter-courges": "pumpkin harvest stem", "cueillir-haricots": "picking green beans",
  "repiquage": "pricking out seedlings",
  // Conserverie
  "bocaux": "home canning jars water bath", "lactofermentation": "sauerkraut fermentation jar", "conserver-recoltes": "root cellar vegetables storage", "apres-recolte": "washing harvested vegetables",
  "cs-securite": "Mason jars canned vegetables", "cs-temps": "canning jars boiling water bath", "cs-confitures": "homemade jam jars", "cs-fruits-sucre": "compote jar",
  "cs-vinaigre": "pickled gherkins jar", "cs-jus-cidre": "apple press cider", "cs-alcool": "Rumtopf", "cs-sel-huile-fumage": "smoked garlic braids",
  "cs-sechage": "drying tomatoes sun", "cs-congelation": "frozen peas", "cs-plats-bocaux": "pressure canner jars", "cs-cave": "apple storage cellar",
  "cs-materiel": "canning jars lids rings", "cs-atelier-collectif": "canning women kitchen", "cs-donner-vendre": "jam jars market stall",
  // Problèmes des plantes sans article illustré (troubles de culture, carences).
  // Requêtes retirées après relecture (photos hors sujet) : le repli illustré de la rubrique s'affiche.
  "eclatement": "cracked tomato fruit",
  "pourriture-pollinisation": "zucchini rot",
  "montaison": "bolting lettuce",
  "carence-potassium": "potassium deficiency leaf",
  "carence-azote": "nitrogen deficiency",
  "carence-magnesium": "magnesium deficiency",
  "tenthrede-groseillier": "sawfly larvae gooseberry",
  "oiseaux": "blackbird eating cherries",
  "chute-feuilles": "Ficus benjamina",
  "guttation": "guttation leaf drops",
  "racines-etroit": "root bound pot plant",
  "fourmis": "ants aphids plant",
  "verticilliose": "Verticillium wilt",
  "black-rot": "Guignardia bidwellii grapes",
  "puceron-cendre": "Dysaphis plantaginea",
  // Tutoriels (audit illustrateur : un visuel pour chaque tutoriel)
  "art-floral-bases": "flower arrangement vase garden flowers", "fleurs-sechees": "dried flowers", "couleurs-jardin": "colorful perennial border", "metier-fleuriste": "florist shop", "jardin-mediterraneen": "mediterranean garden lavender gravel", "jardin-japonais": "japanese garden maple stones", "jardin-bord-de-mer": "seaside garden coastal plants", "jardin-de-pluie": "rain garden", "bassin-ornement": "garden pond water lilies", "mur-vegetal": "green wall plants facade", "arbres-petit-jardin": "Amelanchier lamarckii flowering tree",
  "api-debuter": "beekeeper hive frame", "api-emplacement": "beehives garden hedge", "api-ruche-morte": "dead bees hive frame", "api-pillage": "bees hive entrance", "essaim-batiment": "bee colony in wall", "api-hivernage": "beehives in snow",
  "sauver-plante": "repotting houseplant roots", "pots-arrosage": "houseplant watering", "saisons-plantes-interieur": "houseplants windowsill", "engrais-interieur": "liquid fertilizer houseplant",
  "veterinaire-urgences": "veterinarian examining goat", "debuter-animaux": "hens in garden", "rapaces-volailles": "Accipiter nisus", "verger-protection": "apple orchard winter",
  "jardin-pollinisateurs": "bumblebee flowers garden pollinator",
  "balcon-voisinage": "balcony planters apartment building",
  "traiter-loi": "garden sprayer",
  "nitrates": "leaching nitrate field",
  "compost-cn": "compost heap",
  "climat-erosion": "soil erosion rill field",
  "analyse-sol": "soil sample auger",
  "envahissantes": "Heracleum mantegazzianum",
  "jardiner-bio": "organic vegetable garden mulch",
  "labels-bio": "organic seeds packets",
  "jardin-sobre": "rain barrel garden",
  "fumiers-securite": "manure heap farm",
  "registre-elevage": "sheep ear tag",
  "naissances": "newborn goat kid",
  "deces-animal": "farm field fence rural",
  "poules-potager": "chickens vegetable garden",
  "hiver-basse-cour": "chickens snow",
  "traite-fromage": "milking goat by hand",
  "tonte-laine": "sheep shearing",
  "recolte-miel": "honey extraction frame uncapping",
  "hygiene-animaux": "fresh eggs basket",
  "autres-animaux": "alpaca",
  "materiaux-recup": "pallet raised bed",
  "jardin-sans-argent": "seed swap",
  "serre-fenetres": "greenhouse made of old windows",
  "poulailler-palettes": "pallet chicken coop",
  "petits-outils-maison": "paper pots seedlings",
  "toilettes-seches": "composting toilet",
  "eaux-grises": "greywater garden",
  "echange-boutures": "plant cuttings in water",
  "collection-plantes": "variegated Monstera",
  "lutte-bio-interieur": "Phytoseiulus persimilis",
  "irrigation-raisonnee": "tensiometer soil irrigation",
  "tunnel-pilotage": "polytunnel ventilation",
  "vendre-surplus": "farm stand vegetables",
  "api-calendrier": "beehives apiary spring",
  "api-visite": "beekeeper frame",
  "api-essaimage": "honey bee swarm branch",
  "api-reines": "marked queen bee",
  "api-varroa": "Varroa destructor bee",
  "api-nourrissement": "bee feeder",
  "api-materiel": "Dadant beehive",
  "api-produits": "beeswax",
  "api-miellees": "beehives lavender field",
  "api-securite": "beekeeper veil suit",
  "api-reseau": "beekeeping course",
  "api-frelon": "Vespa velutina",
  "api-miellerie": "honey extractor",
  "porc-familial": "pigs pasture",
  "produire-ses-plants": "seedling trays greenhouse",
  "potager-hiver": "leeks winter vegetable garden",
  "arbo-eclaircissage-gel": "apple blossom frost",
  "paturage-tournant": "rotational grazing electric fence sheep",
  "transport-animaux": "livestock trailer sheep",
  "planter-arbre": "planting a tree stake",
  "vivaces-guide": "perennial border",
  "jardin-ombre": "shade garden hostas ferns",
  "couvre-sols-rocaille": "rock garden",
  "grimpantes-supports": "clematis trellis",
  "fleurs-a-couper": "cut flower garden dahlias",
  "jardiniere-fleurie": "window box geraniums",
  "arrosage-automatique": "drip irrigation garden",
  "puits-forage": "hand water pump well garden",
  
  "formes-fruitieres": "espalier pear tree",
  "planter-verger": "young orchard planting",
  "elever-en-pot": "container nursery plants",
  "concevoir-jardin": "garden design plan drawing",
  "jardin-accessible-pente": "terraced garden slope",
  "allees-terrasses": "gravel garden path",
  "muret-pierre-seche": "dry stone wall",
  "drainage-terrain": "french drain gravel trench",
  "budget-reglementation": "landscape garden construction",
  "calendrier-reproduction": "lambs ewe spring",
  "gestes-jeunes": "goat kids",
  "poussins": "chicks brooder",
  "certification-bio": "organic farm",
  "eau-sans-electricite": "IBC tote rainwater",
  "germoir": "sprouting jar seeds",
  "outils-maraicher-maison": "broadfork",
  "ou-trouver-gratuit": "wood chips pile garden",
  "plastique-jardin": "plastic plant pots",
};
for (const [id, q] of Object.entries(PHOTOS_TECHNIQUES)) {
  if (ONLY.length ? !ONLY.includes(id) : !process.env.FORCE && old[id]?.photos?.length) continue;
  candidats.set(id, (await rechercheCommons(q)).slice(0, 4));
  items.push({ id, wiki: "Commons:" + q });
  await sleep(300);
}
const info = await infos([...new Set([...candidats.values()].flat())]);
const manquants: string[] = [];
for (const it of items) {
  const vus = new Set<string>();
  const photos = ((candidats.get(it.id) ?? []).map((f) => info.get(f)).filter((p) => p && !vus.has(p.img) && vus.add(p.img)) as Ph[]).slice(0, 4);
  if (photos.length) out[it.id] = { photos, article: it.wiki.startsWith("Commons:") ? `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(it.wiki.slice(8))}` : `https://fr.wikipedia.org/wiki/${encodeURIComponent(it.wiki.replace(/ /g, "_"))}` };
  else manquants.push(`${it.id} (${it.wiki})`);
}
writeFileSync(OUT, JSON.stringify(out));
console.log(`${Object.keys(out).length} fiches illustrées, ${Object.values(out).reduce((a, x) => a + x.photos.length, 0)} photos.`);
if (manquants.length) console.log("Sans photo :\n  " + manquants.join("\n  "));
