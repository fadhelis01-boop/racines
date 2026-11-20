// Outils du paysagiste et du fleuriste : hauteur lue dans la fiche, sols, densités, coût et floraison d'un massif.
// Sans dépendance au routeur : testable.
import type { Plante, SolPlante, Mois } from "../data/types";

/** Hauteur adulte maximale en cm : « 30 cm à 1,5 m » → 150, « 10 à 20 cm » → 20, « 2 à 4 m » → 400. */
export function hauteurCm(txt?: string): number {
  if (!txt) return 0;
  const re = /(\d+(?:,\d+)?)(?:\s*(cm|m)\b)?/g;
  const nums: { v: number; u?: string; i: number }[] = [];
  for (const x of txt.matchAll(re)) nums.push({ v: parseFloat(x[1].replace(",", ".")), u: x[2], i: x.index ?? 0 });
  let max = 0;
  nums.forEach((n, k) => {
    const unite = n.u ?? nums.slice(k + 1).find((x) => x.u)?.u;
    if (!unite) return;
    max = Math.max(max, unite === "m" ? n.v * 100 : n.v);
  });
  return Math.round(max);
}

export type ClasseHauteur = "basse" | "moyenne" | "haute" | "arbre";
export const CLASSES_HAUTEUR: Record<ClasseHauteur, string> = { basse: "Basse (moins de 40 cm)", moyenne: "Moyenne (40 cm à 1 m)", haute: "Haute (1 à 3 m)", arbre: "Grande (plus de 3 m)" };
export function classeHauteur(p: Pick<Plante, "hauteur">): ClasseHauteur | null {
  const h = hauteurCm(p.hauteur);
  if (!h) return null;
  return h < 40 ? "basse" : h <= 100 ? "moyenne" : h <= 300 ? "haute" : "arbre";
}

export const NOMS_SOLS: Record<SolPlante, string> = { argileux: "Argileux (lourd)", calcaire: "Calcaire", acide: "Acide (terre de bruyère)", sableux: "Sableux (léger)", humide: "Frais à humide", sec: "Sec, caillouteux" };

/** Le résultat du test « Mon sol » traduit en sols de plantes */
export function solsDeMonSol(sol?: { texture: string; traits: string[] }): SolPlante[] {
  if (!sol) return [];
  const out: SolPlante[] = [];
  if (sol.texture === "argileux") out.push("argileux");
  if (sol.texture === "sableux") out.push("sableux");
  if (sol.traits.includes("calcaire")) out.push("calcaire");
  if (sol.traits.includes("acide")) out.push("acide");
  if (sol.traits.includes("caillouteux")) out.push("sec");
  return out;
}

// ───────── Massif : densité, coût, floraison ─────────

export type TypeVegetal = "couvre-sol" | "vivace" | "grande-vivace" | "graminee" | "bulbe" | "annuelle" | "arbuste" | "arbre";
export const DENSITE: Record<TypeVegetal, { parM2: number; prix: [number, number]; godet: string }> = {
  "couvre-sol": { parM2: 9, prix: [3, 5], godet: "godet de 9 cm" },
  vivace: { parM2: 6, prix: [4, 8], godet: "godet de 9 cm ou pot de 1 L" },
  "grande-vivace": { parM2: 3, prix: [6, 12], godet: "pot de 2 à 3 L" },
  graminee: { parM2: 4, prix: [5, 10], godet: "pot de 1 à 2 L" },
  bulbe: { parM2: 50, prix: [0.2, 0.6], godet: "bulbes en sac" },
  annuelle: { parM2: 9, prix: [1, 3], godet: "mini-motte ou semis" },
  arbuste: { parM2: 1, prix: [12, 30], godet: "conteneur de 3 à 5 L" },
  arbre: { parM2: 0.1, prix: [40, 150], godet: "baliveau ou conteneur de 15 L" },
};

export function typeVegetal(p: Pick<Plante, "cycle" | "hauteur" | "categorie" | "alias" | "id">): TypeVegetal {
  const h = hauteurCm(p.hauteur);
  if (p.cycle === "bulbe") return "bulbe";
  if (p.cycle === "annuelle" || p.cycle === "bisannuelle") return "annuelle";
  if (p.cycle === "arbuste" || p.cycle === "grimpante" || p.categorie === "arbre") return h > 600 ? "arbre" : "arbuste";
  if (/carex|fetuque|miscanthus|stipa|pennisetum/.test(p.id)) return "graminee";
  if (h && h <= 25) return "couvre-sol";
  if (h > 90) return "grande-vivace";
  return "vivace";
}

export interface LigneMassif { id: string; part: number } // part : % de la surface occupée par cette plante
export function calculMassif(surface: number, lignes: LigneMassif[], plantes: Pick<Plante, "id" | "cycle" | "hauteur" | "categorie" | "alias">[]) {
  const total = lignes.reduce((a, l) => a + l.part, 0) || 1;
  const details = lignes.map((l) => {
    const p = plantes.find((x) => x.id === l.id);
    const t = p ? typeVegetal(p) : "vivace";
    const d = DENSITE[t];
    const m2 = (surface * l.part) / total;
    const nombre = Math.max(1, Math.round(m2 * d.parM2));
    return { id: l.id, type: t, m2: Math.round(m2 * 10) / 10, nombre, prixMin: Math.round(nombre * d.prix[0]), prixMax: Math.round(nombre * d.prix[1]), godet: d.godet };
  });
  return { details, nombre: details.reduce((a, d) => a + d.nombre, 0), prixMin: details.reduce((a, d) => a + d.prixMin, 0), prixMax: details.reduce((a, d) => a + d.prixMax, 0) };
}

/** Mois sans aucune fleur dans une sélection de plantes (pour un massif fleuri toute l'année) */
export function moisSansFleur(plantes: Pick<Plante, "floraison">[], mois: Mois[] = [3, 4, 5, 6, 7, 8, 9, 10] as Mois[]): Mois[] {
  return mois.filter((mo) => !plantes.some((p) => (p.floraison ?? []).includes(mo)));
}

// ───────── Couleurs : harmonies ─────────
export const HARMONIES: Record<string, { camaieu: string[]; complementaire: string[]; note: string }> = {
  blanc: { camaieu: ["blanc", "vert"], complementaire: ["bleu", "violet", "rose"], note: "Le blanc éclaire l'ombre et le soir, et calme un massif trop chargé." },
  jaune: { camaieu: ["jaune", "orange", "blanc"], complementaire: ["violet", "bleu"], note: "Jaune et violet se font chanter l'un l'autre (rudbeckia et verveine de Buenos Aires)." },
  orange: { camaieu: ["orange", "jaune", "rouge"], complementaire: ["bleu", "violet"], note: "Les couleurs chaudes rapprochent : réservez-les près de la maison." },
  rouge: { camaieu: ["rouge", "orange", "rose"], complementaire: ["vert", "blanc"], note: "Le rouge pur se marie au feuillage vert et pourpre ; il attire l'œil de loin." },
  rose: { camaieu: ["rose", "violet", "blanc"], complementaire: ["vert", "bleu"], note: "Roses, mauves et blancs : l'harmonie douce du jardin de cottage." },
  violet: { camaieu: ["violet", "bleu", "rose"], complementaire: ["jaune", "orange"], note: "Les bleus et violets éloignent visuellement : parfaits au fond du jardin." },
  bleu: { camaieu: ["bleu", "violet", "blanc"], complementaire: ["orange", "jaune"], note: "Le bleu est rare au jardin : les sauges, népétas, agapanthes et campanules le fournissent." },
  vert: { camaieu: ["vert", "blanc"], complementaire: ["rouge", "rose"], note: "Feuillages et fleurs vertes (alchémille, euphorbe) lient toutes les couleurs entre elles." },
};
