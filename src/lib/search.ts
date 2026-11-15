import { PLANTES, PROBLEMES, REMEDES, GUIDES, ANIMAUX, SIGNES } from "../data/index";
import { norm } from "./garden";
import { LEXIQUE } from "../data/lexique";
import { MALADIES_ANIMALES } from "../data/maladies-animales";
import { AMENAGEMENTS } from "../data/amenagements";
import { GESTES_RECOLTE } from "../data/cueillette";
import { AROMATES_INT } from "../data/interieur-hub";

// Moteur de recherche : noms courants et synonymes, texte complet des fiches,
// questions en phrase (« quand planter les tomates », « ma poule ne pond plus »),
// symptômes (→ diagnostic) et tolérance aux fautes de frappe.

export interface Hit { href: string; emoji: string; titre: string; type: string; score: number; id?: string }
interface Doc { href: string; emoji: string; titre: string; type: string; noms: string; texte: string; id?: string; principal: boolean }

// Autres noms des animaux (pour « coq », « brebis », « ruche »…)
const ALIAS_ANIMAUX: Record<string, string> = {
  poule: "poules coq coqs poussin poussins ponte oeuf oeufs volaille volailles poulailler pondeuse",
  canard: "canards cane canes caneton", oie: "oies jars oison", pintade: "pintades pintadeau", caille: "cailles",
  lapin: "lapins lapine lapereau clapier", chevre: "chevres bouc chevreau caprin", mouton: "moutons brebis agneau belier ovin",
  ane: "anes anesse anon", cheval: "chevaux poney poneys jument equide", cochon: "cochons porc porcs truie porcelet",
  abeille: "abeilles ruche ruches apiculture miel essaim", dindon: "dinde dindes dindonneau", pigeon: "pigeons pigeonneau colombe",
};

let DOCS: Doc[] | null = null;
function docs(): Doc[] {
  if (DOCS) return DOCS;
  DOCS = [
    ...PLANTES.map((p) => ({ principal: true, id: p.id, href: `/plante/${p.id}`, emoji: p.emoji, titre: p.nom, type: p.categorie === "fleur" || p.categorie === "ornement" ? "Fleur et jardin d'agrément" : p.categorie === "arbre" ? "Arbre fruitier" : p.categorie === "interieur" ? "Plante d'intérieur" : p.categorie === "toxique" ? "Plante dangereuse" : p.categorie === "sauvage" ? "Plante sauvage" : "Plante", noms: norm([p.nom, p.latin, ...(p.alias ?? []), ...(p.latins ?? [])].join(" | ")), texte: norm([p.intro, ...p.etapes, ...p.entretien, p.conservation ?? "", p.lumiere ?? "", p.arrosageDetail ?? "", p.toxique ?? "", p.sansDangerAnimaux ? "sans danger chats chiens" : ""].join(" ")) })),
    ...LEXIQUE.map((t) => ({ principal: false, id: t.wiki ? "lex-" + t.id : undefined, href: `/lexique?t=${t.id}`, emoji: "📖", titre: t.terme, type: "Lexique", noms: norm([t.terme, ...(t.alias ?? [])].join(" | ")), texte: norm(t.def) })),
    ...ANIMAUX.map((a) => ({ principal: true, id: a.id, href: `/animal/${a.id}`, emoji: a.emoji, titre: a.nom, type: "Animal", noms: norm(a.nom + " | " + (ALIAS_ANIMAUX[a.id] ?? "")), texte: norm([a.resume, ...a.quotidien, ...a.alimentation, ...a.interdits, ...a.reglementation, ...a.sante.map((s) => s.signe)].join(" ")) })),
    ...MALADIES_ANIMALES.map((m) => ({ principal: true, id: m.especes[0], href: `/maladie-animale/${m.id}`, emoji: "🩺", titre: m.nom, type: "Santé des animaux", noms: norm([m.nom, ...m.alias].join(" | ")), texte: norm([m.signes, m.explication, ...m.especes.map((e) => ALIAS_ANIMAUX[e] ?? e)].join(" ")) })),
    ...PROBLEMES.map((p) => ({ principal: true, id: p.id, href: `/probleme/${p.id}`, emoji: "🩺", titre: p.nom, type: "Santé des plantes", noms: norm([p.nom, ...(p.alias ?? []), ...p.signes.map((s) => SIGNES[s].label)].join(" | ")), texte: norm([p.cible, ...p.symptomes, p.conditions].join(" ")) })),
    ...AMENAGEMENTS.map((a) => ({ principal: false, id: a.id, href: `/amenagements?id=${a.id}`, emoji: a.emoji, titre: a.nom, type: "Aménagement", noms: norm([a.nom, "amenager amenagement jardin"].join(" | ")), texte: norm([a.resume, ...a.avantages, ...a.inconvenients].join(" ")) })),
    ...GESTES_RECOLTE.map((g) => ({ principal: false, id: g.id, href: `/cueillette?g=${g.id}`, emoji: g.emoji, titre: "Cueillir — " + g.titre, type: "Bien cueillir", noms: norm(["cueillir recolter cueillette comment recolter", g.titre].join(" | ")), texte: norm([g.quand, ...g.comment].join(" ")) })),
    { principal: false, href: "/interieur", emoji: "🌿", titre: "Plantes d'intérieur et aromates (avec ou sans lampe)", type: "Espace intérieur", noms: norm("plantes d'interieur | plante interieur | plantes vertes | aromates interieur | herbes interieur | lampe de culture | lampe horticole | sans lampe | appartement sombre | quelle plante pour ma fenetre"), texte: norm("fenetre sud nord est ouest lampe aromates bouture substrat") },
    { principal: false, href: "/interieur?t=lampe", emoji: "💡", titre: "Lampe de culture : calculer puissance, distance, coût", type: "Espace intérieur", noms: norm("lampe de culture | lampe horticole | led horticole | eclairage plantes | combien de watts"), texte: norm("puissance distance heures consommation kwh") },
    { principal: false, href: "/interieur?t=multiplier", emoji: "✂️", titre: "Multiplier ses plantes d'intérieur (boutures, divisions)", type: "Espace intérieur", noms: norm("bouturer plante interieur | bouture pothos | bouture monstera | diviser plante | rejets | keiki"), texte: norm("bouture tige noeud eau division") },
    ...AROMATES_INT.map((a) => ({ principal: false, id: a.id, href: "/interieur?t=aromates&a=" + encodeURIComponent(a.id ?? a.nom), emoji: a.emoji, titre: `${a.nom} en intérieur`, type: "Aromate en intérieur", noms: norm([`${a.nom} en interieur`, `${a.nom} interieur`, `${a.nom} lampe`, `${a.nom} appartement`, `${a.nom} supermarche`].join(" | ")), texte: norm([a.sansLampe, a.avecLampe, a.demarrer, a.piege].join(" ")) })),
    { principal: false, href: "/sol", emoji: "🟫", titre: "Mon sol : identifier son type de sol (test guidé)", type: "Outil", noms: norm("type de sol | quel sol | mon sol | sol argileux | sol sableux | sol calcaire | sol acide | terre argileuse | analyse de sol | ph du sol | test du sol"), texte: norm("boudin vinaigre chou rouge vers de terre plantes indicatrices ameliorer") },
    { principal: false, href: "/sol?t=ph", emoji: "🎨", titre: "Acide ou calcaire ? Le pH du sol et le test du chou rouge", type: "Outil", noms: norm("ph | ph du sol | sol acide | sol calcaire | chou rouge | plantes indicatrices"), texte: norm("vinaigre mousse indicateur couleur") },
    { principal: false, href: "/nutrition", emoji: "🍽️", titre: "Nourrir ses plantes : besoins, N-P-K, carences", type: "Outil", noms: norm("engrais | nourrir les plantes | npk | azote phosphore potassium | besoins des plantes | carence | quel engrais | fertiliser"), texte: norm("gourmand compost fumier purin feuilles jaunes") },
    { principal: false, href: "/nutrition?t=engrais", emoji: "🧺", titre: "Les engrais naturels comparés", type: "Outil", noms: norm("engrais naturel | engrais bio | corne broyee | sang seche | poudre d'os | cendre | marc de cafe | coquilles d'oeufs | guano"), texte: norm("dose vitesse attention") },
    { principal: false, href: "/nutrition?t=animaux", emoji: "🐔", titre: "Nourrir ses animaux : besoins de chaque espèce", type: "Outil", noms: norm("nourrir les animaux | alimentation animaux | ration | besoins animaux | mineraux | pierre a lecher | coquilles d'huitres | quoi donner"), texte: norm("eau proteines fibres mineraux poules chevres lapins") },
    { principal: false, href: "/demenagement", emoji: "📦", titre: "Je déménage (appartement ↔ maison avec jardin)", type: "Outil", noms: norm("je demenage | demenagement | demenager | emmenager | nouvelle maison | quitter la maison | transporter plantes"), texte: norm("emporter plantes boutures graines animaux transport declaration") },
    { principal: false, href: "/calculs", emoji: "🧮", titre: "Calculs pratiques", type: "Outil", noms: norm("calcul | calculs | combien | quantite | combien de poules | combien de compost | combien de terreau | combien planter"), texte: norm("compost fumier terreau famille eau de pluie poules") },
    { principal: false, href: "/amenagements", emoji: "🗺️", titre: "Aménager son jardin : les façons de faire comparées", type: "Outil", noms: norm("amenager | amenagement | amenager jardin | organiser jardin | plan du jardin | idees jardin"), texte: norm("potager carre butte lasagnes jardin foret verger prairie mare") },
    ...REMEDES.map((r) => ({ principal: false, href: `/remede/${r.id}`, emoji: r.emoji, titre: r.nom, type: "Remède", noms: norm(r.nom), texte: norm([r.role, ...r.usage].join(" ")) })),
    ...GUIDES.map((g) => ({ principal: false, id: g.id, href: `/guide/${g.id}`, emoji: g.emoji, titre: g.titre, type: "Tutoriel", noms: norm([g.titre, g.resume, ...(g.alias ?? [])].join(" | ")), texte: norm(g.etapes.map((e) => e.titre + " " + e.texte).join(" ")) })),
  ];
  return DOCS;
}

function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    let best = d[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
      best = Math.min(best, d[j]);
    }
    if (best > max) return max + 1;
  }
  return d[b.length];
}

// Mots qui ne portent pas le sens de la question
const STOP = new Set([
  "de", "la", "le", "les", "des", "du", "un", "une", "a", "au", "aux", "et", "en", "ma", "mon", "mes", "ta", "ton", "tes", "sa", "son", "ses", "nos", "vos", "leur", "leurs",
  "qui", "que", "quoi", "quand", "comment", "pourquoi", "quel", "quelle", "quels", "quelles", "ou", "est", "sont", "ont", "pas", "ne", "plus", "tres", "trop", "peu",
  "pour", "sur", "dans", "avec", "sans", "par", "chez", "je", "j", "il", "elle", "ils", "elles", "on", "nous", "vous", "ce", "cet", "cette", "ces", "faire", "faut", "peut", "doit",
  "plante", "plantes", "mon", "bien", "mal", "y", "l", "d", "qu", "c", "s", "n", "m",
]);
// Synonymes : un mot de la question est satisfait si l'un de ses équivalents est trouvé
const SYN: Record<string, string[]> = {
  tuer: ["abattre", "abattage"], tue: ["abattre", "abattage"], abattre: ["abattage"], saigner: ["saignee", "abattage"],
  meurt: ["malade", "diagnostic", "sauver"], mourir: ["malade", "diagnostic"], creve: ["malade", "diagnostic"], malade: ["diagnostic", "maladie"],
  jaunit: ["jaune", "jaunissement"], jaunissent: ["jaune", "jaunissement"], jaunes: ["jaune", "jaunissement"],
  mous: ["molle", "molles"], mou: ["molle"], maigre: ["amaigrissement", "maigrit"], maigrit: ["amaigrissement"],
  declaration: ["declarer", "reglementation"], declarer: ["declaration"], mairie: ["declaration"],
  pond: ["ponte"], pondent: ["ponte"], oeufs: ["oeuf", "ponte"], chat: ["chats", "animaux"], chien: ["chiens", "animaux"],
  planter: ["plantation", "plantez"], semer: ["semis", "semez"], arroser: ["arrosage", "arrosez"], tailler: ["taille", "taillez"], rempoter: ["rempotage"],
  hiverner: ["hivernage", "hiver"], pigeons: ["pigeon"], nourrir: ["alimentation", "nourrir", "manger"], manger: ["alimentation", "nourrir"],
  pucerons: ["puceron"], limace: ["limaces"], vers: ["ver", "vermifuge"], tomates: ["tomate"], fraises: ["fraisier", "fraise"], pommes: ["pommier", "pomme"],
  automatique: ["programmateur", "goutte"], voisin: ["voisinage", "voisins"], copropriete: ["syndic", "voisinage"],
};
// Expressions transformées avant l'analyse
const PHRASES: [RegExp, string][] = [
  [/plantes? vertes?/g, "plante interieur"],
  [/plantes? pour (les )?(chats?|chiens?)/g, "sans danger chats chiens"],
  [/sans danger (pour )?(les )?(chats?|chiens?)/g, "sans danger chats chiens"],
  [/\boeufs? mous\b|\boeufs? sans coquille/g, "coquilles molles oeufs"],
  [/arrosage automatique/g, "arrosage automatique programmateur"],
];

const radical = (t: string) => { const r = t.replace(/(ements|ement|ations|ation|ages|age|eurs|eur|ees|ee|ers|er|es|s|x)$/, ""); return r.length >= 4 ? r : t; };
const echappe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Mots de 4 lettres ou moins : le mot entier (au pluriel près) — « coq » ne trouve pas « coquelicot ».
// Mots de 5 lettres : début de mot. Au-delà : n'importe où.
const contient = (hay: string, tok: string) =>
  tok.length >= 6 ? hay.includes(tok) : tok.length === 5 ? new RegExp(`(^|[^a-z0-9])${echappe(tok)}`).test(hay) : new RegExp(`(^|[^a-z0-9])${echappe(tok)}(s|x)?($|[^a-z0-9])`).test(hay);

export function rechercher(q: string, limit = 60): Hit[] {
  let nq = norm(q.trim()).replace(/['’-]/g, " ").replace(/\s+/g, " ");
  if (nq.length < 2) return [];
  for (const [re, rep] of PHRASES) nq = nq.replace(re, rep);
  const toks = nq.split(" ").filter((t) => t.length > 1 && !STOP.has(t));
  const variantes = (t: string) => [t, radical(t), ...(SYN[t] ?? [])];
  const radQ = new Set(toks.flatMap((t) => [radical(t), ...(SYN[t] ?? []).map(radical)]));
  const hits: Hit[] = [];
  for (const d of docs()) {
    let score = 0;
    const titre = norm(d.titre);
    if (titre === nq) score += 100;
    else if (titre.startsWith(nq)) score += 50;
    // Un nom ou un alias identique à la question (« haie », « pelouse jaune ») : c'est la fiche attendue
    if (d.noms.split(" | ").some((x) => x === nq)) score += 40;
    if (contient(d.noms, nq)) score += 60;
    else if (contient(d.texte, nq)) score += 20;
    // Le sujet de la fiche est nommé dans la question (« tomates » dans « quand planter les tomates »)
    const motsTitre = titre.split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w)).map(radical);
    if (d.principal && motsTitre.length && radical(motsTitre[0]) && radQ.has(motsTitre[0])) score += 45;
    if (motsTitre.length && motsTitre.every((w) => radQ.has(w))) score += 30;
    if (toks.length) {
      let manquants = 0;
      for (const t of toks) {
        const vs = variantes(t);
        if (vs.some((v) => contient(d.noms, v))) score += 12;
        else if (vs.some((v) => contient(d.texte, v))) score += 4;
        else if (t.length >= 5 && d.noms.split(/[^a-z0-9]+/).some((w) => w.length >= 4 && lev(w, t, t.length >= 8 ? 2 : 1) <= (t.length >= 8 ? 2 : 1))) score += 8;
        else manquants++;
      }
      // Tous les mots doivent être trouvés ; dans une phrase de 3 mots et plus, on tolère un mot absent
      if (manquants && !(toks.length >= 3 && manquants === 1)) score = toks.length > 1 ? score * 0.35 : 0;
      else if (manquants) score *= 0.75;
    }
    if (score > 0) hits.push({ id: d.id, href: d.href, emoji: d.emoji, titre: d.titre, type: d.type, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

// La requête ressemble-t-elle à un symptôme ? → proposer le diagnostic
export function ressembleSymptome(q: string) {
  const nq = norm(q);
  return /jaun|tache|brun|noir|blanc|mou|fletri|tomb|sech|trou|insect|mouche|moucheron|pourri|colle|toile|pend|malade|meurt|crev|cloque|poudre|ver\b|vers|pond|maigr|boite|diarrh|tousse|gratte/.test(nq);
}
export function parleAnimal(q: string) {
  const nq = norm(q);
  return Object.entries(ALIAS_ANIMAUX).some(([k, v]) => new RegExp(`(^|[^a-z])(${k}|${v.split(" ").join("|")})($|[^a-z])`).test(nq));
}

// Recherche d'une plante d'intérieur par son nom (courant, ancien, commercial ou latin),
// tolérante aux fautes de frappe. Renvoie aussi le nom qui a correspondu (« aussi appelée … »).
export interface HitInterieur { plante: (typeof PLANTES)[number]; score: number; via?: string }
export function chercherInterieur(q: string, limit = 30): HitInterieur[] {
  const nq = norm(q.trim()).replace(/['’-]/g, " ").replace(/\s+/g, " ");
  if (nq.length < 2) return [];
  const toks = nq.split(" ").filter((t) => t.length > 1 && !STOP.has(t));
  const out: HitInterieur[] = [];
  for (const p of PLANTES) {
    if (p.categorie !== "interieur") continue;
    const noms: [string, boolean][] = [[p.nom, false], [p.latin, false], ...(p.alias ?? []).map((a): [string, boolean] => [a, true]), ...(p.latins ?? []).map((a): [string, boolean] => [a, true])];
    let best = 0, via: string | undefined;
    for (const [n, alias] of noms) {
      const nn = norm(n).replace(/['’-]/g, " ");
      let sc = 0;
      if (nn === nq) sc = 100;
      else if (nn.startsWith(nq)) sc = 80;
      else if (new RegExp(`(^|[^a-z0-9])${echappe(nq)}`).test(nn)) sc = 65;
      else if (nq.length >= 4 && nn.includes(nq)) sc = 50;
      else if (toks.length) {
        const mots = nn.split(/[^a-z0-9]+/).filter(Boolean);
        const trouve = toks.filter((t) => mots.some((w) => w.startsWith(t) || (t.length >= 5 && w.length >= 4 && lev(w, t, t.length >= 8 ? 2 : 1) <= (t.length >= 8 ? 2 : 1))));
        if (trouve.length === toks.length) sc = 40;
      }
      if (sc > best) { best = sc; via = alias ? n : undefined; }
    }
    if (best) out.push({ plante: p, score: best - p.difficulte, via });
  }
  return out.sort((a, b) => b.score - a.score || a.plante.nom.localeCompare(b.plante.nom, "fr")).slice(0, limit);
}
