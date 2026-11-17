// Données maraîchères chiffrées, pour planifier : espacements, semaines en motte, durée de récolte
// d'une série, rendement indicatif au m², taux de germination courant. Valeurs moyennes en plein champ,
// climat tempéré, jardin bien conduit (sous abri, les rendements des légumes d'été sont plus élevés).
export interface DonneesMaraich {
  rang: number; // cm entre deux plants sur le rang
  interRang: number; // cm entre deux rangs
  motte: number; // semaines en plaque alvéolée ou en motte avant plantation (0 = semis direct ou plants achetés)
  fenetre: number; // semaines pendant lesquelles une même série se récolte
  rdt: number; // rendement indicatif par m²
  unite: "kg" | "pièces";
  germ: number; // taux de germination courant (0 = multiplié par plants, bulbes, tubercules)
}
const d = (rang: number, interRang: number, motte: number, fenetre: number, rdt: number, germ: number, unite: "kg" | "pièces" = "kg"): DonneesMaraich => ({ rang, interRang, motte, fenetre, rdt, unite, germ });

export const MARAICH: Record<string, DonneesMaraich> = {
  tomate: d(50, 70, 7, 12, 5, 0.85), aubergine: d(50, 70, 8, 10, 3, 0.75), poivron: d(40, 50, 8, 12, 2.5, 0.7),
  courgette: d(80, 100, 4, 12, 6, 0.85), concombre: d(50, 100, 4, 8, 6, 0.85), courge: d(100, 150, 4, 4, 3, 0.85),
  melon: d(80, 100, 4, 6, 3, 0.8), pasteque: d(100, 150, 4, 4, 3, 0.8),
  haricot: d(7, 40, 0, 4, 1.5, 0.8), pois: d(5, 40, 0, 4, 1, 0.85), feve: d(15, 40, 0, 4, 1.2, 0.85),
  "pomme-de-terre": d(35, 70, 0, 2, 3, 0), "patate-douce": d(40, 80, 0, 2, 2, 0), topinambour: d(40, 70, 0, 20, 3, 0),
  carotte: d(4, 25, 0, 6, 4, 0.7), radis: d(3, 15, 0, 2, 1.5, 0.85), navet: d(10, 25, 0, 4, 3, 0.85), betterave: d(10, 30, 4, 6, 3.5, 0.8),
  panais: d(10, 35, 0, 12, 2.5, 0.6), celeri: d(35, 40, 10, 8, 4, 0.6), fenouil: d(25, 35, 4, 4, 2.5, 0.75),
  poireau: d(12, 30, 10, 16, 3, 0.75), oignon: d(10, 25, 0, 2, 3, 0.75), echalote: d(15, 25, 0, 2, 1.5, 0), ail: d(12, 25, 0, 2, 1, 0),
  chou: d(50, 60, 5, 6, 4, 0.75), "chou-fleur": d(60, 60, 5, 4, 3, 0.75), "chou-kale": d(50, 60, 5, 20, 2.5, 0.8),
  laitue: d(30, 30, 4, 3, 11, 0.85, "pièces"), mache: d(5, 10, 0, 12, 0.8, 0.75), epinard: d(8, 25, 0, 6, 1.5, 0.75),
  blette: d(30, 40, 4, 20, 4, 0.75), roquette: d(3, 15, 0, 6, 1, 0.85), chicoree: d(30, 30, 4, 8, 11, 0.75, "pièces"),
  oseille: d(30, 30, 0, 26, 1.5, 0.7), cresson: d(10, 15, 0, 12, 1, 0.7),
  artichaut: d(100, 100, 0, 12, 1, 0), asperge: d(40, 150, 0, 8, 0.4, 0), rhubarbe: d(100, 100, 0, 12, 2, 0), mais: d(30, 70, 3, 3, 1.2, 0.85),
  basilic: d(25, 25, 5, 16, 0.8, 0.8), persil: d(10, 25, 0, 26, 1.5, 0.6), ciboulette: d(20, 25, 0, 30, 1, 0.7), coriandre: d(5, 20, 0, 4, 0.6, 0.7),
  thym: d(30, 40, 0, 52, 0.5, 0.6), romarin: d(60, 60, 0, 52, 0.5, 0), menthe: d(30, 40, 0, 24, 1, 0), sauge: d(40, 50, 0, 52, 0.5, 0),
  origan: d(30, 40, 0, 16, 0.5, 0.6), aneth: d(10, 25, 0, 6, 0.5, 0.7), estragon: d(40, 50, 0, 20, 0.5, 0), laurier: d(100, 100, 0, 52, 0.3, 0),
  cerfeuil: d(5, 20, 0, 6, 0.6, 0.7), sarriette: d(25, 30, 0, 16, 0.4, 0.6), melisse: d(40, 40, 0, 20, 0.8, 0.6), verveine: d(50, 50, 0, 16, 0.3, 0),
};

// Temps de travail moyen (heures par m² et par semaine en saison), selon la façon de cultiver
export const TEMPS_METHODE: Record<string, { label: string; h: number }> = {
  paille: { label: "Sol vivant, paillage permanent", h: 0.02 },
  planches: { label: "Planches permanentes, binage régulier", h: 0.035 },
  rangs: { label: "Rangs en terre nue, bêchage", h: 0.055 },
};
