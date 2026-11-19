import type { ZoneId } from "../data/calendrier";

// Outils de l'agronome : ordres de grandeur pédagogiques pour un jardin ou une petite exploitation.
// Hypothèses : horizon travaillé de 25 cm, densité apparente 1,3 t/m³.

export type Texture = "sableux" | "limoneux" | "argileux";

// ——— Triangle des textures (classification simplifiée, inspirée du triangle du GEPPA)
export interface ClasseTexture { nom: string; texture: Texture; eau: string; travail: string; fertilite: string }
export function classerTexture(argile: number, limon: number, sable: number): ClasseTexture | null {
  const t = argile + limon + sable;
  if (t < 98 || t > 102) return null;
  if (argile >= 45) return { nom: "Argile lourde", texture: "argileux", eau: "Retient beaucoup d'eau, mais une partie n'est pas disponible pour les plantes ; s'engorge l'hiver, se fend l'été.", travail: "Collante mouillée, dure sèche : ne la travaillez qu'en bon état d'humidité ; buttes et paillage aident.", fertilite: "Très riche en éléments retenus (forte CEC), se réchauffe lentement au printemps." };
  if (argile >= 30) return { nom: limon >= sable ? "Argilo-limoneux" : "Argilo-sableux", texture: "argileux", eau: "Bonne réserve en eau.", travail: "Lourd à travailler ; matière organique et engrais verts améliorent la structure.", fertilite: "Fertile et stable, réchauffement lent." };
  if (sable >= 70) return { nom: "Sableux", texture: "sableux", eau: "Retient peu d'eau : arrosages fréquents, paillage indispensable.", travail: "Léger, se travaille toute l'année.", fertilite: "Pauvre et lessivé : apports réguliers de compost, fractionnés." };
  if (sable >= 50) return { nom: argile >= 15 ? "Sablo-argileux" : "Sablo-limoneux", texture: "sableux", eau: "Réserve faible à moyenne.", travail: "Facile à travailler, se réchauffe vite au printemps.", fertilite: "Moyenne : entretenez la matière organique." };
  if (limon >= 50) return { nom: argile >= 15 ? "Limono-argileux" : "Limoneux", texture: "limoneux", eau: "Bonne réserve en eau.", travail: "Sensible à la battance (croûte après la pluie) et au tassement : ne laissez pas le sol nu.", fertilite: "Fertile si la matière organique est entretenue." };
  return { nom: "Équilibré (limono-sablo-argileux)", texture: "limoneux", eau: "Bonne réserve en eau, bon drainage.", travail: "Facile à travailler.", fertilite: "La terre de jardin idéale." };
}

// ——— Chaulage
/** CaO nécessaire (kg/ha) pour relever le pH d'une unité, selon la texture (repères courants). */
export const CAO_PAR_UNITE: Record<Texture, number> = { sableux: 1200, limoneux: 2000, argileux: 3000 };
export const AMENDEMENTS_CALCIQUES: Record<string, { nom: string; cao: number; bio: boolean; note: string }> = {
  calcaire: { nom: "Calcaire broyé (carbonate de calcium)", cao: 0.53, bio: true, note: "Action lente et douce, le plus sûr au jardin." },
  dolomie: { nom: "Dolomie (calcaire magnésien)", cao: 0.3, bio: true, note: "Apporte aussi du magnésium (environ 20 % de MgO)." },
  lithothamne: { nom: "Lithothamne (algue calcaire)", cao: 0.45, bio: true, note: "Action rapide, plus coûteux." },
  chaux: { nom: "Chaux vive", cao: 0.9, bio: false, note: "Caustique et brutale : déconseillée au jardin." },
};
export function chaulage(p: { phActuel: number; phVise: number; texture: Texture; surfaceM2: number; produit: keyof typeof AMENDEMENTS_CALCIQUES }) {
  const ecart = Math.max(0, p.phVise - p.phActuel);
  const caoHa = ecart * CAO_PAR_UNITE[p.texture];
  const caoM2 = caoHa / 10000;
  const produitKgM2 = caoM2 / AMENDEMENTS_CALCIQUES[p.produit].cao;
  // On ne relève pas le pH de plus de 0,5 unité par an : sinon blocage des oligo-éléments et vie du sol perturbée
  const annees = Math.max(1, Math.ceil(ecart / 0.5));
  return { ecart: Math.round(ecart * 10) / 10, caoKgM2: Math.round(caoM2 * 1000) / 1000, produitGM2: Math.round(produitKgM2 * 1000), totalKg: Math.round(produitKgM2 * p.surfaceM2 * 10) / 10, annees, parAnGM2: Math.round((produitKgM2 * 1000) / annees) };
}

// ——— Bilan humique
/** Vitesse de minéralisation annuelle de la matière organique (k2) selon la texture. */
export const K2: Record<Texture, number> = { sableux: 0.025, limoneux: 0.018, argileux: 0.012 };
export const AMENDEMENTS_ORGANIQUES: Record<string, { nom: string; moParKg: number; k1: number }> = {
  compost: { nom: "Compost mûr", moParKg: 0.28, k1: 0.5 },
  fumier: { nom: "Fumier composté", moParKg: 0.2, k1: 0.45 },
  brf: { nom: "BRF (bois raméal fragmenté)", moParKg: 0.35, k1: 0.3 },
  feuilles: { nom: "Feuilles mortes (terreau de feuilles)", moParKg: 0.25, k1: 0.3 },
};
export function bilanHumique(p: { surfaceM2: number; moPct: number; texture: Texture; amendement: keyof typeof AMENDEMENTS_ORGANIQUES; profondeurM?: number; densite?: number }) {
  const prof = p.profondeurM ?? 0.25, dens = p.densite ?? 1300;
  const stock = p.surfaceM2 * prof * dens * (p.moPct / 100); // kg de matière organique
  const perte = stock * K2[p.texture]; // kg par an
  const a = AMENDEMENTS_ORGANIQUES[p.amendement];
  const humusParKg = a.moParKg * a.k1;
  const kg = perte / humusParKg;
  return { stockKg: Math.round(stock), perteKg: Math.round(perte * 10) / 10, amendementKg: Math.round(kg), kgM2: Math.round((kg / p.surfaceM2) * 10) / 10 };
}

// ——— Fumure azotée (méthode du bilan simplifiée)
/** Besoin en azote des cultures (kg N/ha pour une récolte de jardin moyenne). */
export const BESOIN_N: Record<string, number> = {
  tomate: 150, aubergine: 150, poivron: 140, courgette: 150, concombre: 120, courge: 120, melon: 100,
  "pomme-de-terre": 150, carotte: 90, radis: 50, navet: 80, betterave: 120, panais: 90, celeri: 150, poireau: 150,
  oignon: 100, ail: 80, echalote: 80, chou: 200, "chou-fleur": 200, "chou-kale": 150, laitue: 80, mache: 40,
  epinard: 120, blette: 120, fenouil: 100, mais: 180, fraisier: 80, haricot: 20, pois: 0, feve: 0,
};
export const APPORTS_N: Record<string, { nom: string; nPct: number; dispo: number }> = {
  compost: { nom: "Compost mûr", nPct: 1, dispo: 0.1 },
  fumier: { nom: "Fumier composté", nPct: 0.6, dispo: 0.25 },
  organique: { nom: "Engrais organique azoté (corne, plumes, sang)", nPct: 12, dispo: 0.7 },
  purin: { nom: "Purin d'ortie (dilué)", nPct: 0.05, dispo: 0.9 },
};
export function fumureAzotee(p: { culture: string; moPct: number; precedent: "aucun" | "legumineuse" | "engrais-vert-legumineuse"; apport: keyof typeof APPORTS_N }) {
  const besoin = BESOIN_N[p.culture] ?? 100;
  const sol = Math.round(p.moPct * 30); // minéralisation de la matière organique pendant la saison (ordre de grandeur)
  const precedent = p.precedent === "legumineuse" ? 30 : p.precedent === "engrais-vert-legumineuse" ? 50 : 0;
  const aApporter = Math.max(0, besoin - sol - precedent);
  const a = APPORTS_N[p.apport];
  const gNparM2 = aApporter / 10; // kg/ha → g/m²
  const produitKgM2 = gNparM2 / (a.nPct * 10 * a.dispo); // g N disponibles par kg de produit = nPct × 10 × dispo
  return { besoin, sol, precedent, aApporter, gNparM2: Math.round(gNparM2 * 10) / 10, produitGM2: Math.round(produitKgM2 * 1000) };
}

// ——— Degrés-jours
/** Températures moyennes mensuelles (°C) par climat, ordres de grandeur. */
export const TMOY: Record<ZoneId, number[]> = {
  mediterraneen: [8, 9, 12, 14, 18, 22, 25, 24, 21, 17, 12, 9],
  oceanique: [7, 7, 9, 11, 14, 17, 19, 19, 17, 14, 10, 7],
  tempere: [5, 6, 9, 12, 15, 18, 20, 20, 17, 13, 8, 5],
  continental: [2, 3, 7, 11, 15, 18, 20, 20, 16, 11, 6, 3],
  montagne: [-1, 0, 3, 7, 11, 14, 17, 17, 13, 9, 4, 0],
};
/** Température de base (seuil de croissance) et besoin indicatif en degrés-jours jusqu'à la récolte. */
export const BASE_DJ: Record<string, { base: number; dj: number; depuis: string }> = {
  "mais": { base: 6, dj: 1300, depuis: "semis (maïs doux)" },
  tomate: { base: 10, dj: 900, depuis: "plantation jusqu'aux premiers fruits mûrs" },
  courgette: { base: 10, dj: 450, depuis: "plantation jusqu'aux premières courgettes" },
  haricot: { base: 10, dj: 650, depuis: "semis (haricot vert)" },
  "pomme-de-terre": { base: 7, dj: 1200, depuis: "plantation (variété de demi-saison)" },
  laitue: { base: 4, dj: 800, depuis: "semis" },
  radis: { base: 5, dj: 380, depuis: "semis" },
  carotte: { base: 4, dj: 1300, depuis: "semis" },
};
export function degresJours(zone: ZoneId, base: number, debut: string, dj: number) {
  const d = new Date(debut + "T12:00:00");
  let cumul = 0, jours = 0;
  const parMois: { mois: number; dj: number }[] = [];
  while (cumul < dj && jours < 400) {
    const m = d.getMonth();
    const gain = Math.max(0, TMOY[zone][m] - base);
    cumul += gain;
    const last = parMois[parMois.length - 1];
    if (last && last.mois === m + 1) last.dj += gain; else parMois.push({ mois: m + 1, dj: gain });
    d.setDate(d.getDate() + 1); jours++;
  }
  return { atteint: cumul >= dj, date: d.toISOString().slice(0, 10), jours, parMois: parMois.map((x) => ({ ...x, dj: Math.round(x.dj) })) };
}
