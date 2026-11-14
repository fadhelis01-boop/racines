// Prix de détail moyens indicatifs (€/kg, produits bio en France, ordre de grandeur
// 2025-2026), pour estimer la valeur des récoltes. Modifiables dans l'application.
export const PRIX_KG: Record<string, number> = {
  tomate: 4.5, aubergine: 4, poivron: 5, courgette: 3, concombre: 3.5, courge: 2.5, melon: 4, pasteque: 2, haricot: 8, pois: 8, feve: 5,
  "pomme-de-terre": 2, carotte: 2.5, radis: 5, navet: 3, betterave: 3, panais: 4, celeri: 3.5, poireau: 3.5, oignon: 2.5, echalote: 7, ail: 12,
  chou: 3, "chou-fleur": 4, "chou-kale": 8, laitue: 6, mache: 18, epinard: 7, blette: 4, roquette: 20, fenouil: 4, artichaut: 5, asperge: 12,
  mais: 4, "patate-douce": 4, topinambour: 4, fraisier: 12, rhubarbe: 5, chicoree: 5, oseille: 15, cresson: 12,
  basilic: 30, persil: 20, ciboulette: 30, coriandre: 30, thym: 40, romarin: 30, menthe: 30, sauge: 40, aneth: 30, cerfeuil: 30, estragon: 40,
  pommier: 3, poirier: 3.5, cerisier: 9, prunier: 4, pecher: 5, figuier: 9, noyer: 10, framboisier: 20, groseillier: 14, myrtillier: 18,
  vigne: 5, kiwi: 5, agrumes: 4, olivier: 10, cognassier: 4, amandier: 20, chataignier: 8, sureau: 10, murier: 15, "groseille-maquereau": 12,
};
// Poids moyen d'une pièce ou d'une botte (kg) pour chiffrer les récoltes comptées
export const POIDS_PIECE: Record<string, number> = {
  tomate: 0.12, aubergine: 0.3, poivron: 0.18, courgette: 0.3, concombre: 0.35, courge: 1.5, melon: 1, pasteque: 4, laitue: 0.4, chou: 1.2,
  "chou-fleur": 0.8, fenouil: 0.3, artichaut: 0.3, mais: 0.25, celeri: 0.6, poireau: 0.25, betterave: 0.2, radis: 0.25, oignon: 0.15, ail: 0.05,
  pommier: 0.17, poirier: 0.2, agrumes: 0.12, basilic: 0.05, persil: 0.05, ciboulette: 0.03, menthe: 0.04, coriandre: 0.05,
};
