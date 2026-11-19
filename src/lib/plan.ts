import type { TypeElementPlan, Espace } from "./store";
import { plante } from "../data/index";

// Éléments de paysage : couleur, forme et taille par défaut (m)
export const ELEMENTS: Record<TypeElementPlan, { nom: string; emoji: string; fill: string; stroke: string; l: number; p: number }> = {
  maison: { nom: "Maison", emoji: "🏠", fill: "#d9d4cc", stroke: "#6b6257", l: 10, p: 8 },
  terrasse: { nom: "Terrasse", emoji: "☀️", fill: "#e7d3b0", stroke: "#a68a5b", l: 5, p: 3 },
  allee: { nom: "Allée", emoji: "🚶", fill: "#efe6d2", stroke: "#bfae86", l: 8, p: 1.2 },
  arbre: { nom: "Arbre", emoji: "🌳", fill: "rgba(76,140,74,0.45)", stroke: "#2f6b3a", l: 6, p: 6 },
  haie: { nom: "Haie", emoji: "🌿", fill: "#5f8f4e", stroke: "#2f5a28", l: 10, p: 1.2 },
  massif: { nom: "Massif fleuri", emoji: "🌸", fill: "#f1c6d6", stroke: "#b5708a", l: 3, p: 1.5 },
  eau: { nom: "Mare ou point d'eau", emoji: "💧", fill: "#a9d3ee", stroke: "#3c7fb1", l: 3, p: 2 },
  abri: { nom: "Abri de jardin", emoji: "🏚️", fill: "#c8a27a", stroke: "#7c5a35", l: 2.5, p: 2 },
  compost: { nom: "Compost", emoji: "♻️", fill: "#8b6b4a", stroke: "#4f3a24", l: 1.5, p: 1 },
  arrosage: { nom: "Ligne d'arrosage", emoji: "🚿", fill: "#3c7fb1", stroke: "#1f4f75", l: 8, p: 0.15 },
};

/** Longueur de l'ombre portée à midi (multiple de la hauteur), vers le nord, en France métropolitaine. */
export const OMBRE_MIDI = { ete: 0.45, equinoxe: 1, hiver: 2.4 } as const;

/** Hauteur adulte (m) lue dans le texte de la fiche : « 4 à 8 m » → 8. */
export function hauteurMax(txt?: string) {
  const nums = (txt ?? "").match(/\d+(?:,\d+)?(?=\s*m\b)/g);
  return nums ? Math.max(...nums.map((x) => parseFloat(x.replace(",", ".")))) : 0;
}


// Besoin en eau de la semaine par emplacement, d'après la météo et les cultures
const MM_JOUR = (tmax: number) => (tmax < 15 ? 1 : tmax < 20 ? 2 : tmax < 25 ? 3 : tmax < 30 ? 4.5 : 6);
const KC = { faible: 0.5, moyen: 0.85, fort: 1.1 } as const;

export function besoinEau(e: Espace, cultures: { espaceId?: string; planteId: string; fini?: string }[], jours: { tmax: number; pluie: number }[], paille: boolean) {
  const actives = cultures.filter((c) => c.espaceId === e.id && !c.fini).map((c) => plante(c.planteId)).filter(Boolean);
  if (!actives.length || !e.surface) return null;
  const kc = Math.max(...actives.map((p) => KC[p!.eau]));
  const evap = jours.reduce((a, j) => a + MM_JOUR(j.tmax), 0) * kc * (paille ? 0.7 : 1);
  const pluie = jours.reduce((a, j) => a + (j.pluie ?? 0), 0) * 0.8; // une partie de la pluie ruisselle
  const mm = Math.max(0, evap - pluie);
  return { litres: Math.round(mm * e.surface), mm: Math.round(mm), pluie: Math.round(pluie) };
}

