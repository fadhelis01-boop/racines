// Niveau de preuve des associations de cultures.
// La plupart des associations du jardin viennent de la tradition et de l'observation ;
// quelques-unes sont étayées par des essais agronomiques.
export type Niveau = "etudie" | "plausible" | "tradition";
export const NIVEAUX: Record<Niveau, { label: string; classe: string; explication: string }> = {
  etudie: { label: "Étudiée", classe: "green", explication: "Effet observé dans des essais agronomiques (rendement, ravageurs)." },
  plausible: { label: "Plausible", classe: "sun", explication: "Mécanisme connu (plante piège, odeur, couverture du sol, azote) mais résultats variables selon les conditions." },
  tradition: { label: "Tradition", classe: "", explication: "Savoir de jardinier, sans preuve solide : à essayer, sans en attendre de miracle." },
};

const P: [string, string, Niveau, string][] = [
  ["mais", "haricot", "etudie", "Le maïs sert de tuteur, le haricot fixe l'azote : rendement total supérieur (trois sœurs)."],
  ["mais", "courge", "etudie", "La courge couvre le sol et limite les adventices et l'évaporation."],
  ["haricot", "courge", "plausible", "Couverture du sol et azote des légumineuses."],
  ["tomate", "oeillet-inde", "plausible", "Les racines d'œillet d'Inde réduisent certains nématodes, surtout cultivées en masse avant la tomate."],
  ["carotte", "poireau", "plausible", "Les odeurs se brouillent pour la mouche de la carotte et la teigne du poireau ; effet modeste et variable."],
  ["carotte", "oignon", "plausible", "Même principe que carotte-poireau ; effet modeste."],
  ["chou", "capucine", "plausible", "La capucine attire pucerons et piérides (plante piège) à l'écart des choux."],
  ["tomate", "capucine", "plausible", "Plante piège à pucerons."],
  ["laitue", "radis", "plausible", "Occupation complémentaire de l'espace : le radis est récolté avant que la laitue ne s'étale."],
  ["tomate", "basilic", "tradition", "Association classique ; les essais montrent peu d'effet sur les ravageurs, mais aucun inconvénient."],
  ["fraisier", "ail", "tradition", "Réputé limiter la pourriture grise : peu d'études."],
  ["haricot", "oignon", "tradition", "Réputés « ennemis » (alliacées et légumineuses) : effet non démontré, mais rien à gagner à les mélanger."],
  ["pois", "ail", "tradition", "Même réputation que haricot-oignon."],
];
const KEY = (a: string, b: string) => [a, b].sort().join("|");
const MAP = new Map(P.map(([a, b, n, t]) => [KEY(a, b), { niveau: n, note: t }]));
export const preuve = (a: string, b: string) => MAP.get(KEY(a, b)) ?? { niveau: "tradition" as Niveau, note: "" };
