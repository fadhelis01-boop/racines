import { MARAICH } from "../data/maraichage";

// Économie d'une planche de maraîchage bio en vente directe : repères indicatifs, à remplacer par vos prix.
// Prix : vente directe bio (marché, panier, AMAP), en € par kg (ou par pièce pour laitues, chicorées, maïs).
export const PRIX_BIO: Record<string, number> = {
  tomate: 4.5, aubergine: 4.5, poivron: 6, courgette: 3, concombre: 3.5, courge: 2.5, melon: 3.5, pasteque: 2.5,
  haricot: 9, pois: 8, feve: 4, "pomme-de-terre": 2.3, "patate-douce": 5, topinambour: 3.5,
  carotte: 2.8, radis: 4, navet: 3, betterave: 3, panais: 4, celeri: 3.5, fenouil: 4.5,
  poireau: 4, oignon: 3, echalote: 8, ail: 15, chou: 2.8, "chou-fleur": 4, "chou-kale": 9,
  laitue: 1.6, mache: 22, epinard: 9, blette: 4, roquette: 22, chicoree: 2, oseille: 12, cresson: 15,
  artichaut: 6, asperge: 13, rhubarbe: 5, mais: 3,
  basilic: 35, persil: 18, ciboulette: 25, coriandre: 25, thym: 30, romarin: 25, menthe: 25, sauge: 30, origan: 30, aneth: 25, estragon: 35, laurier: 30, cerfeuil: 25, sarriette: 30, melisse: 25, verveine: 35,
};

// Temps de travail par m² et par culture (heures, de l'implantation à la vente), maraîchage diversifié manuel.
export const HEURES_M2: Record<string, number> = {
  tomate: 0.9, aubergine: 0.7, poivron: 0.7, concombre: 0.8, courgette: 0.35, courge: 0.12, melon: 0.4, pasteque: 0.3,
  haricot: 0.6, pois: 0.6, feve: 0.3, "pomme-de-terre": 0.12, "patate-douce": 0.2, topinambour: 0.08,
  carotte: 0.35, radis: 0.25, navet: 0.2, betterave: 0.25, panais: 0.25, celeri: 0.35, fenouil: 0.25,
  poireau: 0.35, oignon: 0.2, echalote: 0.25, ail: 0.25, chou: 0.2, "chou-fleur": 0.25, "chou-kale": 0.35,
  laitue: 0.2, mache: 0.45, epinard: 0.35, blette: 0.3, roquette: 0.35, chicoree: 0.2, oseille: 0.3, cresson: 0.4,
  artichaut: 0.15, asperge: 0.3, rhubarbe: 0.1, mais: 0.15,
};
/** Coût des intrants par m² (semences ou plants, compost, paillage, petit matériel), en €. */
export const INTRANTS_M2: Record<string, number> = { tomate: 1.5, aubergine: 1.5, poivron: 1.5, concombre: 1.2, courgette: 0.8, melon: 1, fraisier: 2, ail: 1.5, echalote: 1.5, "pomme-de-terre": 0.6 };
const INTRANTS_DEFAUT = 0.5;

export interface EconomiePlanche { cultureId: string; surface: number; recolte: number; unite: string; chiffre: number; intrants: number; marge: number; heures: number; parHeure: number; parM2: number }

/** Chiffre d'affaires, marge et rémunération horaire d'une culture sur une surface donnée. */
export function economiePlanche(cultureId: string, surface: number, prix?: number, perte = 0.15): EconomiePlanche | null {
  const m = MARAICH[cultureId];
  if (!m) return null;
  const p = prix ?? PRIX_BIO[cultureId] ?? 3;
  const recolte = m.rdt * surface * (1 - perte); // part invendue ou abîmée
  const chiffre = recolte * p;
  const intrants = surface * (INTRANTS_M2[cultureId] ?? INTRANTS_DEFAUT);
  const heures = surface * (HEURES_M2[cultureId] ?? (m.fenetre > 20 ? 0.4 : 0.3));
  const marge = chiffre - intrants;
  return { cultureId, surface, recolte: Math.round(recolte * 10) / 10, unite: m.unite, chiffre: Math.round(chiffre), intrants: Math.round(intrants), marge: Math.round(marge), heures: Math.round(heures * 10) / 10, parHeure: heures ? Math.round((marge / heures) * 10) / 10 : 0, parM2: Math.round((marge / surface) * 10) / 10 };
}

/** Classe les cultures par marge au m² ou par rémunération horaire. */
export function classementCultures(critere: "parM2" | "parHeure", prix: Record<string, number> = {}) {
  return Object.keys(MARAICH).map((id) => economiePlanche(id, 10, prix[id])).filter((x): x is EconomiePlanche => !!x).sort((a, b) => b[critere] - a[critere]);
}

// ——— Paniers
export interface Panier { saison: string; contenu: string[]; valeur: number }
export const PANIERS_TYPES: Panier[] = [
  { saison: "Printemps (avril-mai)", contenu: ["1 salade", "1 botte de radis", "500 g d'épinards ou de blettes", "1 botte d'oignons nouveaux", "150 g de roquette ou mesclun", "1 botte d'aromates"], valeur: 15 },
  { saison: "Été (juillet-août)", contenu: ["1,5 kg de tomates", "1 kg de courgettes", "500 g de haricots verts", "1 concombre", "1 salade", "1 botte de basilic"], valeur: 22 },
  { saison: "Automne (octobre)", contenu: ["1 courge (1,5 kg)", "1 kg de pommes de terre", "1 kg de carottes", "1 kg de poireaux", "500 g de betteraves", "1 salade ou 150 g de mâche"], valeur: 18 },
  { saison: "Hiver (janvier)", contenu: ["1 kg de poireaux", "1 kg de carottes", "1 chou", "500 g de panais ou topinambours", "150 g de mâche", "1 kg d'oignons"], valeur: 17 },
];
/**
 * Nombre de paniers hebdomadaires qu'une surface cultivée peut fournir sur une saison :
 * repère courant en maraîchage diversifié : environ 25 à 35 m² cultivés par panier hebdomadaire sur l'année.
 */
export function paniersPossibles(surfaceM2: number, m2ParPanier = 30) {
  return Math.floor(surfaceM2 / m2ParPanier);
}
