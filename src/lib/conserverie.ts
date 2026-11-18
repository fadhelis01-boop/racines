import { CONSERV, METHODES_CONSERV, RENDEMENTS, type MethodeConserv } from "../data/conservation";
import type { Stock, LieuStock } from "./store";

export type Materiel = "congelateur" | "sterilisateur" | "deshydrateur" | "cave" | "pressoir";
export interface Contexte { kg: number; materiel: Materiel[]; temps: 1 | 2 | 3; place: boolean }

export interface Proposition { methode: MethodeConserv; score: number; pourquoi: string[]; manque?: string; rendement?: string }

const LIB_MAT: Record<Materiel, string> = { congelateur: "un congélateur", sterilisateur: "un stérilisateur ou une grande marmite", deshydrateur: "un déshydrateur ou un séchoir", cave: "une cave ou un cellier frais", pressoir: "un pressoir" };

/** « J'en ai trop » : classe les méthodes possibles pour une plante selon le matériel, le temps et la quantité. */
export function proposer(planteId: string, c: Contexte): Proposition[] {
  const cp = CONSERV[planteId];
  if (!cp) return [];
  return cp.methodes.map((m, i) => {
    const M = METHODES_CONSERV[m];
    const pourquoi: string[] = [];
    let score = 100 - i * 8; // l'ordre de la fiche reflète la méthode la plus adaptée
    let manque: string | undefined;
    // Le séchage se fait aussi au four ou à l'air : le déshydrateur n'est qu'un plus
    if (M.materiel && !c.materiel.includes(M.materiel) && !(m === "sechage")) { score -= 60; manque = `Il faut ${LIB_MAT[M.materiel]}.`; }
    if (m === "sechage" && !c.materiel.includes("deshydrateur")) { score -= 10; pourquoi.push("Possible au four (50 °C) ou à l'air, plus lent sans déshydrateur."); }
    if (M.effort > c.temps) { score -= 25 * (M.effort - c.temps); pourquoi.push("Demande plus de temps que vous n'en avez."); }
    if (M.effort === 1) pourquoi.push("Rapide à mettre en place.");
    if (c.kg >= 10 && ["sterilisation", "jus", "sucre", "cave", "sechage"].includes(m)) { score += 10; pourquoi.push("Adapté aux grosses quantités."); }
    if (c.kg < 2 && ["jus", "sterilisation"].includes(m)) { score -= 15; pourquoi.push("Peu rentable pour une petite quantité."); }
    if (!c.place && ["cave", "sterilisation", "jus"].includes(m)) { score -= 10; pourquoi.push("Prend de la place de stockage."); }
    if (m === "congelation") pourquoi.push(c.place ? "Garde le goût du frais." : "Ne prend que la place du congélateur.");
    if (m === "sterilisation" && cp.acide === false) pourquoi.push("Conserve peu acide : stérilisation longue, ou autoclave.");
    if (m === "sterilisation" && planteId === "tomate") pourquoi.push("Ajoutez 2 cuillères à soupe de jus de citron par litre.");
    if (m === "huile") { score -= 15; pourquoi.push("Au réfrigérateur uniquement, après une marinade au vinaigre."); }
    const r = RENDEMENTS.find((x) => x.planteId === planteId && rendementPour(x.id) === m);
    return { methode: m, score, pourquoi, manque, rendement: r ? `${c.kg} kg donnent environ ${arrondi(c.kg * r.facteur)} ${r.unite} (${r.nom.toLowerCase()})` : undefined };
  }).sort((a, b) => b.score - a.score);
}

function rendementPour(id: string): MethodeConserv | undefined {
  return ({ coulis: "sterilisation", "tomates-entieres": "sterilisation", "tomates-sechees": "sechage", confiture: "sucre", compote: "sucre", "jus-pomme": "jus", "pommes-sechees": "sechage", "haricots-bocaux": "sterilisation", "haricots-congeles": "congelation", choucroute: "lacto", cornichons: "vinaigre", pesto: "congelation", pruneaux: "sechage", "sirop-sureau": "sucre" } as Record<string, MethodeConserv>)[id];
}

export const arrondi = (x: number) => (x >= 10 ? Math.round(x) : Math.round(x * 10) / 10);

/** Sel pour une lacto-fermentation : légumes râpés (2 % du poids) ou saumure (30 g/L). */
export function selLacto(kg: number, litresSaumure = 0) {
  return { rape: Math.round(kg * 20), saumure: Math.round(litresSaumure * 30) };
}
/** Sucre pour une confiture selon le pourcentage choisi (par kg de fruits préparés). */
export function sucreConfiture(kgFruits: number, gParKg = 800) {
  return { sucre: arrondi((kgFruits * gParKg) / 1000), allegee: gParKg < 600 };
}

// ——— Garde-manger
export const LIEUX: Record<LieuStock, string> = { placard: "Placard", cave: "Cave / cellier", congelateur: "Congélateur", refrigerateur: "Réfrigérateur" };
/** Garde conseillée (en mois) selon la méthode : sert de date limite indicative. */
export const GARDE_DEFAUT: Record<string, number> = { sterilisation: 12, sucre: 12, vinaigre: 12, lacto: 6, congelation: 10, sechage: 9, sel: 9, jus: 12, alcool: 36, huile: 1, cave: 4, fumage: 6 };

export function finDeGarde(s: Pick<Stock, "date" | "gardeMois">) {
  const d = new Date(s.date + "T12:00:00");
  d.setMonth(d.getMonth() + s.gardeMois);
  return d.toISOString().slice(0, 10);
}

/** Numéro de lot lisible : AAMMJJ-initiales-n (ex. 260815-COU-1). */
export function numeroLot(produit: string, date: string, existants: Pick<Stock, "lot">[]) {
  const ini = produit.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "LOT";
  const base = `${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-${ini}`;
  let n = 1;
  while (existants.some((x) => x.lot === `${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Ce qu'il faut consommer en priorité, et les alertes du garde-manger. */
export function alertesStocks(stocks: Stock[], aujourdhui: string) {
  const actifs = stocks.filter((s) => s.quantite > 0);
  const in30 = new Date(aujourdhui + "T12:00:00"); in30.setDate(in30.getDate() + 30);
  const lim = in30.toISOString().slice(0, 10);
  return {
    depasses: actifs.filter((s) => finDeGarde(s) < aujourdhui),
    bientot: actifs.filter((s) => finDeGarde(s) >= aujourdhui && finDeGarde(s) <= lim),
    cave: actifs.some((s) => s.lieu === "cave"),
  };
}

/** Plan de l'année : nombre de bocaux par mois de consommation → quantité à préparer et à récolter. */
export function planAnnee(lignes: { rendementId: string; parMois: number; mois: number; contenance: number }[]) {
  return lignes.map((l) => {
    const r = RENDEMENTS.find((x) => x.id === l.rendementId)!;
    const volume = l.parMois * l.mois * l.contenance; // en L ou kg selon l'unité
    const kg = r.facteur > 0 ? volume / r.facteur : 0;
    return { ...l, nom: r.nom, unite: r.unite, bocaux: l.parMois * l.mois, volume: arrondi(volume), kgFrais: arrondi(kg), planteId: r.planteId };
  });
}

export function stocksCsv(stocks: Stock[]) {
  const esc = (x: string | number | undefined) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const l = [["Produit", "Méthode", "Lieu", "Date", "Quantité", "Unité", "Lot", "À consommer avant", "Note"].map(esc).join(";")];
  for (const s of [...stocks].sort((a, b) => a.date.localeCompare(b.date))) l.push([s.produit, METHODES_CONSERV[s.methode as MethodeConserv]?.nom ?? s.methode, LIEUX[s.lieu], s.date, s.quantite, s.unite, s.lot, finDeGarde(s), s.note].map(esc).join(";"));
  return "﻿" + l.join("\r\n");
}
