import { LEGUMES } from "./legumes";
import { AROMATIQUES, FLEURS } from "./aromatiques";
import { FRUITS } from "./fruits";
import { INTERIEUR } from "./interieur";
import { PROBLEMES, SIGNES } from "./problemes";
import { REMEDES, AUXILIAIRES } from "./remedes";
import { ANIMAUX } from "./animaux";
import { GUIDES_JARDIN } from "./guides-jardin";
import { GUIDES_MAISON } from "./guides-maison";
import { GUIDES_ANIMAUX } from "./guides-animaux";
import { CALENDRIER, ZONES } from "./calendrier";
import type { Animal, Guide, Plante, Probleme, Remede, Rubrique } from "./types";

export const PLANTES: Plante[] = [...LEGUMES, ...AROMATIQUES, ...FLEURS, ...FRUITS, ...INTERIEUR];
export const GUIDES: Guide[] = [...GUIDES_JARDIN, ...GUIDES_MAISON, ...GUIDES_ANIMAUX];
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
  if (pb) return { href: `/probleme/${id}`, label: pb.nom, emoji: "🩺" };
  const g = G.get(id);
  if (g) return { href: `/guide/${id}`, label: g.titre, emoji: g.emoji };
  const a = A.get(id);
  if (a) return { href: `/animal/${id}`, label: a.nom, emoji: a.emoji };
  const r = R.get(id);
  if (r) return { href: `/remede/${id}`, label: r.nom, emoji: r.emoji };
  return null;
}

export const CATEGORIES: Record<Plante["categorie"], { label: string; emoji: string }> = {
  legume: { label: "Légumes", emoji: "🥕" },
  aromatique: { label: "Aromatiques", emoji: "🌿" },
  fruit: { label: "Petits fruits", emoji: "🍓" },
  arbre: { label: "Arbres fruitiers", emoji: "🍎" },
  fleur: { label: "Fleurs utiles", emoji: "🌼" },
  "engrais-vert": { label: "Engrais verts", emoji: "☘️" },
  interieur: { label: "Plantes d'intérieur", emoji: "🌿" },
};

export const FAMILLES: Record<Plante["famille"], string> = {
  solanacees: "Solanacées (tomate, pomme de terre…)",
  cucurbitacees: "Cucurbitacées (courges, concombre…)",
  fabacees: "Fabacées / légumineuses (haricot, pois…)",
  brassicacees: "Brassicacées (choux, radis, navet…)",
  apiacees: "Apiacées (carotte, céleri, persil…)",
  amaryllidacees: "Alliacées (ail, oignon, poireau…)",
  asteracees: "Astéracées (laitue, artichaut…)",
  amaranthacees: "Amaranthacées (betterave, épinard…)",
  poacees: "Poacées (maïs)",
  lamiacees: "Lamiacées (basilic, thym…)",
  rosacees: "Rosacées (fraisier, pommier…)",
  polygonacees: "Polygonacées (rhubarbe)",
  convolvulacees: "Convolvulacées (patate douce)",
  autres: "Autres familles",
};

export const RUBRIQUES: Record<Rubrique, { label: string; emoji: string }> = {
  demarrer: { label: "Démarrer son potager", emoji: "👨‍🌾" },
  sol: { label: "Sol et engrais", emoji: "🟫" },
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
