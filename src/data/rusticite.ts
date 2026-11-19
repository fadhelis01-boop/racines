import type { Plante } from "./types";

// Rusticité (°C minimal supporté, plante installée en sol drainé), feuillage, et pour les arbres
// et fruitiers : hauteur adulte, floraison, intérêt pour les abeilles, danger pour les animaux.
// Les annuelles n'ont pas de rusticité : elles meurent à la fin de la saison (gel ou chaleur).
type Complement = Partial<Pick<Plante, "rusticite" | "feuillage" | "hauteur" | "floraison" | "mellifere" | "sansDangerAnimaux" | "taille" | "cycle" | "toxique" | "couleurs">>;

export const COMPLEMENTS: Record<string, Complement> = {
  // Fleurs vivaces, bisannuelles, grimpantes
  lavande: { rusticite: -15, feuillage: "persistant" },
  consoude: { rusticite: -25, feuillage: "caduc" },
  ortie: { rusticite: -30, feuillage: "caduc", cycle: "vivace" },
  pensee: { rusticite: -15, feuillage: "persistant" },
  violette: { rusticite: -20, feuillage: "semi-persistant" },
  primevere: { rusticite: -20, feuillage: "semi-persistant" },
  "pois-senteur": { rusticite: -5 },
  echinacee: { rusticite: -25, feuillage: "caduc" },
  rudbeckia: { rusticite: -25, feuillage: "caduc" },
  pivoine: { rusticite: -30, feuillage: "caduc" },
  iris: { rusticite: -25, feuillage: "semi-persistant" },
  lupin: { rusticite: -20, feuillage: "caduc" },
  "rose-tremiere": { rusticite: -20, feuillage: "semi-persistant" },
  marguerite: { rusticite: -20, feuillage: "semi-persistant" },
  aster: { rusticite: -25, feuillage: "caduc" },
  phlox: { rusticite: -25, feuillage: "caduc" },
  hemerocalle: { rusticite: -25, feuillage: "caduc" },
  lys: { rusticite: -20, feuillage: "caduc" },
  agapanthe: { rusticite: -10, feuillage: "semi-persistant" },
  // Clématites : taille selon le groupe (1 : après la floraison de printemps ; 2 : légère en février ; 3 : à 30 cm en février)
  clematite: { rusticite: -20, feuillage: "caduc", taille: [2, 6] },
  chevrefeuille: { rusticite: -20, feuillage: "semi-persistant", mellifere: true },
  jasmin: { rusticite: -10, feuillage: "persistant" },
  // Glycine : deux tailles par an, en été (juillet-août) et en hiver (janvier-février)
  glycine: { rusticite: -20, feuillage: "caduc", taille: [1, 2, 7, 8], mellifere: true },
  mauve: { rusticite: -20, feuillage: "caduc" },
  // Ornement existant
  rosier: { rusticite: -20, feuillage: "caduc" },
  hortensia: { rusticite: -15, feuillage: "caduc" },
  tulipe: { rusticite: -30 },
  dahlia: { rusticite: -5, feuillage: "caduc" },
  buis: { rusticite: -20, feuillage: "persistant", cycle: "arbuste" },
  lilas: { rusticite: -30, feuillage: "caduc" },
  geranium: { rusticite: 0, feuillage: "persistant" },
  // Aromatiques
  thym: { rusticite: -15, feuillage: "persistant", cycle: "vivace" },
  romarin: { rusticite: -12, feuillage: "persistant", cycle: "arbuste" },
  sauge: { rusticite: -15, feuillage: "persistant", cycle: "vivace" },
  menthe: { rusticite: -25, feuillage: "caduc", cycle: "vivace" },
  ciboulette: { rusticite: -30, feuillage: "caduc", cycle: "vivace" },
  origan: { rusticite: -20, feuillage: "semi-persistant", cycle: "vivace" },
  estragon: { rusticite: -15, feuillage: "caduc", cycle: "vivace" },
  laurier: { rusticite: -12, feuillage: "persistant", cycle: "arbuste" },
  sarriette: { rusticite: -15, feuillage: "semi-persistant", cycle: "vivace" },
  melisse: { rusticite: -20, feuillage: "caduc", cycle: "vivace" },
  verveine: { rusticite: -5, feuillage: "caduc", cycle: "arbuste" },
  persil: { rusticite: -10, cycle: "bisannuelle" },
  basilic: { cycle: "annuelle" },
  coriandre: { cycle: "annuelle" },
  aneth: { cycle: "annuelle" },
  cerfeuil: { rusticite: -10, cycle: "annuelle" },
  // Petits fruits
  fraisier: { rusticite: -20, feuillage: "semi-persistant", hauteur: "20 à 30 cm", floraison: [4, 5, 6], mellifere: true, sansDangerAnimaux: true },
  framboisier: { rusticite: -25, feuillage: "caduc", hauteur: "1,5 à 2 m", floraison: [5, 6], mellifere: true, sansDangerAnimaux: true },
  groseillier: { rusticite: -30, feuillage: "caduc", hauteur: "1 à 1,5 m", floraison: [4], mellifere: true, sansDangerAnimaux: true },
  myrtillier: { rusticite: -25, feuillage: "caduc", hauteur: "1 à 2 m", floraison: [4, 5], mellifere: true, sansDangerAnimaux: true },
  vigne: { rusticite: -18, feuillage: "caduc", hauteur: "palissée, 2 à 10 m", floraison: [6], sansDangerAnimaux: false, toxique: "Raisin et raisins secs toxiques pour les chiens (insuffisance rénale)." },
  kiwi: { rusticite: -15, feuillage: "caduc", hauteur: "liane de 5 à 8 m", floraison: [5, 6], mellifere: false, sansDangerAnimaux: true },
  sureau: { rusticite: -25, feuillage: "caduc", hauteur: "3 à 6 m", floraison: [5, 6], mellifere: true, sansDangerAnimaux: false },
  murier: { rusticite: -20, feuillage: "caduc", hauteur: "2 à 3 m (palissé)", floraison: [6, 7], mellifere: true, sansDangerAnimaux: true },
  "groseille-maquereau": { rusticite: -30, feuillage: "caduc", hauteur: "1 à 1,5 m", floraison: [4], mellifere: true, sansDangerAnimaux: true },
  // Arbres fruitiers
  pommier: { rusticite: -30, feuillage: "caduc", hauteur: "2 m (porte-greffe nain) à 8 m (haute tige)", floraison: [4, 5], mellifere: true, sansDangerAnimaux: true },
  poirier: { rusticite: -25, feuillage: "caduc", hauteur: "3 à 10 m selon le porte-greffe", floraison: [3, 4], mellifere: true, sansDangerAnimaux: true },
  cerisier: { rusticite: -25, feuillage: "caduc", hauteur: "3 m (Gisela 5) à 10 m", floraison: [3, 4], mellifere: true, sansDangerAnimaux: false },
  prunier: { rusticite: -25, feuillage: "caduc", hauteur: "4 à 6 m", floraison: [3, 4], mellifere: true, sansDangerAnimaux: false },
  pecher: { rusticite: -20, feuillage: "caduc", hauteur: "3 à 5 m", floraison: [3], mellifere: true, sansDangerAnimaux: false },
  figuier: { rusticite: -12, feuillage: "caduc", hauteur: "3 à 8 m", sansDangerAnimaux: false },
  noyer: { rusticite: -25, feuillage: "caduc", hauteur: "noyer 15 à 25 m, noisetier 3 à 6 m", floraison: [2, 3, 4], mellifere: false, sansDangerAnimaux: false },
  agrumes: { rusticite: -5, feuillage: "persistant", hauteur: "1 à 3 m en pot", floraison: [3, 4, 5], mellifere: true, sansDangerAnimaux: false },
  olivier: { rusticite: -12, feuillage: "persistant", hauteur: "3 à 10 m", floraison: [5, 6], mellifere: false, sansDangerAnimaux: true },
  cognassier: { rusticite: -25, feuillage: "caduc", hauteur: "4 à 6 m", floraison: [4, 5], mellifere: true, sansDangerAnimaux: true },
  amandier: { rusticite: -20, feuillage: "caduc", hauteur: "4 à 8 m", floraison: [2, 3], mellifere: true, sansDangerAnimaux: false },
  chataignier: { rusticite: -25, feuillage: "caduc", hauteur: "15 à 25 m", floraison: [6, 7], mellifere: true, sansDangerAnimaux: true, taille: [12, 1, 2] },
};

/** Note affichée à côté de la rusticité. */
export function libRusticite(r: number) {
  if (r >= 0) return "à rentrer hors gel l'hiver";
  if (r >= -7) return "frileuse : pleine terre seulement en climat doux, sinon en pot rentré l'hiver";
  if (r >= -15) return "rustique dans la plupart des régions de plaine";
  return "très rustique, même en montagne";
}

// Sol préféré des nouvelles fiches d'ornement (s'ajoute aux fiches déjà renseignées)
import { SOL_PLANTE } from "./sols";
Object.assign(SOL_PLANTE, {
  camelia: "Acide (pH 5 à 6), frais et humifère ; en sol calcaire, uniquement en bac de terre de bruyère.",
  rhododendron: "Acide obligatoire (terre de bruyère), frais, jamais calcaire ni détrempé.",
  "erable-japon": "Frais, humifère, neutre à légèrement acide ; craint le calcaire fort et le sec.",
  magnolia: "Profond, frais, neutre à acide ; supporte mal le calcaire actif.",
  photinia: "Tous sols drainés, pas trop calcaires.",
  "laurier-tin": "Tous sols, même calcaires et secs.",
  forsythia: "Tous sols.",
  buddleia: "Drainé, même pauvre et calcaire.",
  ceanothe: "Léger et bien drainé ; craint l'eau stagnante.",
  cornouiller: "Frais à humide, même argileux.",
  "viorne-obier": "Frais, même argileux ou humide.",
  "arbre-judee": "Calcaire et sec bienvenus ; drainé.",
  bouleau: "Léger, même pauvre ou acide.",
  hellebore: "Frais et riche, calcaire toléré.",
  hosta: "Frais, riche, humifère.",
  heuchere: "Humifère et drainé.",
  "sauge-arbustive": "Drainé, caillouteux, calcaire accepté.",
  gaura: "Drainé et pauvre, jamais détrempé l'hiver.",
  perovskia: "Sec, caillouteux, calcaire accepté.",
  stipa: "Pauvre et très drainé.",
  miscanthus: "Frais, tous types.",
  lavande: "Pauvre, drainé, plutôt calcaire.",
  nenuphar: "Terre argileuse lourde, en panier, au fond de l'eau.",
  "iris-marais": "Détrempé ou sous 0 à 20 cm d'eau.",
});
