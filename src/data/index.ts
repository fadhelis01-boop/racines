import { RECOLTE_EN_PLUS } from "./cueillette";
import { LEGUMES } from "./legumes";
import { AROMATIQUES, FLEURS } from "./aromatiques";
import { FRUITS } from "./fruits";
import { INTERIEUR } from "./interieur";
import { INTERIEUR2, ENRICH } from "./interieur2";
import { INTERIEUR3 } from "./interieur3";
import { ENVAHISSANTES, GUIDES_AGRO } from "./agronomie";
import { GUIDES_BIO } from "./bio";
import { GUIDES_ELEVAGE } from "./guides-elevage";
import { GUIDES_RECUP, ETAPES_EN_PLUS, ALIAS_CULTIVARS } from "./guides-recup";
import { GUIDES_MARAICHAGE } from "./guides-maraichage";
import { GUIDES_APICULTURE } from "./guides-apiculture";
import { GUIDES_CONSERVERIE } from "./guides-conserverie";
import { GUIDES_EXPERT } from "./guides-expert";
import { GUIDES_HORTICULTURE } from "./guides-horticulture";
import { GUIDES_METIERS } from "./guides-metiers";
import { GUIDES_ELEVEUR } from "./guides-eleveur";
import { GUIDES_BIO_LOWTECH } from "./guides-bio-lowtech";
import { GUIDE_SEUILS, GUIDE_API_PESTICIDES } from "./pedagogie";
import { MALADIES_ANIMALES } from "./maladies-animales";
import { CONTENANT, RENDEMENT, PROFONDEUR, GERMINATION } from "./cultures-complements";
import { JARDIN2 } from "./jardin2";
import { ORNEMENT2 } from "./ornement2";
import { COMPLEMENTS } from "./rusticite";
import { FLEURS2, ENRICH_FLEURS } from "./fleurs2";
import { PROBLEMES, SIGNES } from "./problemes";
import { REMEDES as REMEDES0, AUXILIAIRES } from "./remedes";
import { REMEDES_MAISON, STATUT_MAISON } from "./remedes-maison";
import { STATUT_REMEDE } from "./reglementation";
const REMEDES = [...REMEDES0, ...REMEDES_MAISON];
Object.assign(STATUT_REMEDE, STATUT_MAISON);
import { ANIMAUX as ANIMAUX1 } from "./animaux";
import { GUIDES_JARDIN } from "./guides-jardin";
import { GUIDES_MAISON } from "./guides-maison";
import { GUIDES_ANIMAUX } from "./guides-animaux";
import { GUIDES_INTERIEUR } from "./guides-interieur";
import { GUIDES_JARDIN2 } from "./guides-jardin2";
import { GUIDES_BALCON, ALIAS_GUIDES } from "./guides-balcon";
import { ANIMAUX2 } from "./animaux2";
import { CALENDRIER, ZONES } from "./calendrier";
import type { Animal, Guide, Plante, Probleme, Remede, Rubrique } from "./types";

export const PLANTES: Plante[] = [...LEGUMES, ...AROMATIQUES, ...FLEURS, ...FRUITS, ...INTERIEUR, ...INTERIEUR2, ...INTERIEUR3, ...ENVAHISSANTES, ...JARDIN2, ...FLEURS2, ...ORNEMENT2].map((p) => ({ ...Object.fromEntries(Object.entries(COMPLEMENTS[p.id] ?? {}).filter(([k]) => (p as unknown as Record<string, unknown>)[k] == null)), ...p, ...(ENRICH[p.id] ?? {}), ...(ENRICH_FLEURS[p.id] ?? {}), ...(!p.recolteConseil && RECOLTE_EN_PLUS[p.id] ? { recolteConseil: RECOLTE_EN_PLUS[p.id] } : {}), ...(!p.contenant && CONTENANT[p.id] ? { contenant: CONTENANT[p.id] } : {}), ...(!p.rendement && RENDEMENT[p.id] ? { rendement: RENDEMENT[p.id] } : {}), ...(!p.profondeur && PROFONDEUR[p.id] ? { profondeur: PROFONDEUR[p.id] } : {}), ...(GERMINATION[p.id] ? { tempGermination: GERMINATION[p.id] } : {}), ...(ALIAS_CULTIVARS[p.id] ? { alias: [...(p.alias ?? []), ...(ENRICH[p.id]?.alias ?? []), ...ALIAS_CULTIVARS[p.id]] } : {}) }));

// Associations rendues réciproques : si A est « bon voisin » de B, B l'est de A ;
// en cas de désaccord (A ami de B mais B ennemi de A), « à séparer » l'emporte.
{
  const byId = new Map(PLANTES.map((p) => [p.id, p]));
  for (const p of PLANTES) { p.amis = [...p.amis]; p.ennemis = [...p.ennemis]; }
  for (const p of PLANTES) {
    for (const e of p.ennemis) { const q = byId.get(e); if (q && !q.ennemis.includes(p.id)) q.ennemis.push(p.id); }
  }
  for (const p of PLANTES) {
    for (const a of p.amis) { const q = byId.get(a); if (q && !q.amis.includes(p.id) && !q.ennemis.includes(p.id)) q.amis.push(p.id); }
  }
  for (const p of PLANTES) p.amis = p.amis.filter((a) => !p.ennemis.includes(a));
}
export const GUIDES: Guide[] = [...GUIDES_JARDIN, ...GUIDES_JARDIN2, ...GUIDES_MAISON, ...GUIDES_INTERIEUR, ...GUIDES_BALCON, ...GUIDES_AGRO, ...GUIDES_BIO, ...GUIDES_ANIMAUX, ...GUIDES_ELEVAGE, ...GUIDES_RECUP, ...GUIDES_MARAICHAGE, ...GUIDES_APICULTURE, ...GUIDES_CONSERVERIE, ...GUIDES_EXPERT, ...GUIDES_HORTICULTURE, ...GUIDES_METIERS, ...GUIDES_ELEVEUR, GUIDE_SEUILS, GUIDE_API_PESTICIDES, ...GUIDES_BIO_LOWTECH].map((g) => (ETAPES_EN_PLUS[g.id] ? { ...g, etapes: [...g.etapes, ...ETAPES_EN_PLUS[g.id]] } : g)).map((g) => (ALIAS_GUIDES[g.id] ? { ...g, alias: [...(g.alias ?? []), ...ALIAS_GUIDES[g.id]] } : g));
const ANIMAUX = [...ANIMAUX1, ...ANIMAUX2];
export { PROBLEMES, SIGNES, REMEDES, AUXILIAIRES, ANIMAUX, CALENDRIER, ZONES };

const idx = <T extends { id: string }>(a: T[]) => new Map(a.map((x) => [x.id, x]));
export const plante = (id: string) => P.get(id);
export const probleme = (id: string) => PB.get(id);
export const remede = (id: string) => R.get(id);
export const guide = (id: string) => G.get(id);
export const animal = (id: string) => A.get(id);
const P = idx(PLANTES), PB = idx(PROBLEMES), R = idx(REMEDES), G = idx(GUIDES), A = idx(ANIMAUX);

// Lien vers n'importe quel objet par son id (utilisé par les « liens » des guides)
export function lienVers(id: string): { href: string; label: string; emoji: string } | null {
  const p = P.get(id);
  if (p) return { href: `/plante/${id}`, label: p.nom, emoji: p.emoji };
  const pb = PB.get(id);
  if (pb) return { href: `/probleme/${id}`, label: pb.nom, emoji: "⚕️" };
  const g = G.get(id);
  if (g) return { href: `/guide/${id}`, label: g.titre, emoji: g.emoji };
  const a = A.get(id);
  if (a) return { href: `/animal/${id}`, label: a.nom, emoji: a.emoji };
  const r = R.get(id);
  if (r) return { href: `/remede/${id}`, label: r.nom, emoji: r.emoji };
  const ma = MALADIES_ANIMALES.find((x) => x.id === id);
  if (ma) return { href: `/maladie-animale/${id}`, label: ma.nom, emoji: "⚕️" };
  return null;
}

export const CATEGORIES: Record<Plante["categorie"], { label: string; emoji: string }> = {
  legume: { label: "Légumes", emoji: "🥕" },
  aromatique: { label: "Aromatiques", emoji: "🌿" },
  fruit: { label: "Petits fruits", emoji: "🍓" },
  arbre: { label: "Arbres fruitiers", emoji: "🍎" },
  fleur: { label: "Fleurs", emoji: "🌼" },
  "engrais-vert": { label: "Engrais verts", emoji: "☘️" },
  interieur: { label: "Plantes d'intérieur", emoji: "🌿" },
  ornement: { label: "Jardin d'agrément", emoji: "🌹" },
  sauvage: { label: "Plantes sauvages et « mauvaises herbes »", emoji: "🌾" },
  toxique: { label: "Plantes dangereuses", emoji: "☠️" },
};

export const FAMILLES: Record<Plante["famille"], string> = {
  solanacees: "Solanacées (tomate, pomme de terre…)",
  cucurbitacees: "Cucurbitacées (courges, concombre…)",
  fabacees: "Fabacées / légumineuses (haricot, pois…)",
  brassicacees: "Brassicacées (choux, radis, navet…)",
  apiacees: "Apiacées (carotte, céleri, persil…)",
  amaryllidacees: "Amaryllidacées, dites « alliacées » (ail, oignon, poireau…)",
  asteracees: "Astéracées (laitue, artichaut…)",
  amaranthacees: "Amaranthacées (betterave, épinard…)",
  poacees: "Poacées (maïs)",
  lamiacees: "Lamiacées (basilic, thym…)",
  rosacees: "Rosacées (fraisier, pommier…)",
  polygonacees: "Polygonacées (rhubarbe)",
  convolvulacees: "Convolvulacées (patate douce)",
  valerianacees: "Valérianacées (mâche)",
  autres: "Autres familles",
};

export const RUBRIQUES: Record<Rubrique, { label: string; emoji: string }> = {
  demarrer: { label: "Démarrer son potager", emoji: "👨‍🌾" },
  fleurs: { label: "Fleurs", emoji: "🌸" },
  sol: { label: "Sol et engrais", emoji: "🌍" },
  compost: { label: "Compost", emoji: "♻️" },
  arrosage: { label: "Arrosage", emoji: "💧" },
  semis: { label: "Semis et multiplication", emoji: "🌱" },
  serre: { label: "Serre", emoji: "🏡" },
  balcon: { label: "Balcon et appartement", emoji: "🏢" },
  interieur: { label: "Plantes d'intérieur", emoji: "🌿" },
  fabriquer: { label: "Fabriquer soi-même", emoji: "🔨" },
  recolte: { label: "Récolte, taille et conserves", emoji: "🧺" },
  animaux: { label: "Basse-cour et élevage", emoji: "🐔" },
  boucherie: { label: "Préparer la viande", emoji: "🔪" },
  securite: { label: "Sécurité et règles", emoji: "⛑️" },
};

export const TYPES_PROBLEME: Record<Probleme["type"], string> = {
  champignon: "Maladie (champignon)",
  bacterie: "Maladie (bactérie)",
  virus: "Virus",
  ravageur: "Ravageur",
  physiologique: "Trouble de culture",
  carence: "Carence",
  mammifere: "Animaux",
};

export type { Animal, Guide, Plante, Probleme, Remede };
