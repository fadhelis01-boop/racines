// Les déjections des animaux comme engrais : valeurs indicatives (fumier ou
// déjections avec litière, en % du produit brut ; très variables selon la litière,
// l'alimentation et le stockage). Sources : références agronomiques usuelles.
export interface Fumier {
  animal: string; // id de la fiche animal
  nom: string;
  N: string; P: string; K: string; // azote, phosphore (P2O5), potasse (K2O)
  type: "chaud" | "froid" | "très riche";
  compostage: string;
  dose: string; // par m² et par an
  usage: string;
  precaution: string;
}

export const FUMIERS: Fumier[] = [
  { animal: "poule", nom: "Fientes et fumier de poule", N: "1,5 à 4", P: "1,5 à 3", K: "1 à 2", type: "très riche", compostage: "6 mois minimum, mélangé à beaucoup de paille ou de feuilles", dose: "0,5 à 1 kg de compost de fientes", usage: "Activateur de compost, cultures gourmandes (choux, courges, maïs, poireaux), purin dilué à 10 %.", precaution: "Brûle les racines s'il est frais ; salmonelles possibles : pas sur légumes crus dans les 4 mois avant récolte." },
  { animal: "pigeon", nom: "Colombine (pigeon)", N: "3 à 4", P: "3 à 4", K: "1,5", type: "très riche", compostage: "6 mois, ou séchée et broyée", dose: "100 à 200 g", usage: "L'engrais maison le plus concentré : au compost ou en purin à 5 %.", precaution: "Masque pour le nettoyage (poussières allergisantes)." },
  { animal: "canard", nom: "Fumier de canard et d'oie", N: "1 à 1,5", P: "1", K: "0,5 à 1", type: "très riche", compostage: "4 à 6 mois", dose: "1 à 2 kg", usage: "L'eau sale des bassins est un engrais liquide organique doux à verser au pied des cultures.", precaution: "Humide : beaucoup de matière sèche (paille) pour composter." },
  { animal: "lapin", nom: "Crottin de lapin", N: "1 à 2,5", P: "1 à 1,5", K: "0,5 à 1", type: "froid", compostage: "Aucun nécessaire", dose: "1 à 2 kg (ou une poignée par pot)", usage: "Le seul fumier utilisable directement, au pied des plantes et dans les pots ; idéal pour les vers du lombricomposteur.", precaution: "Litière souillée d'urine : la composter quelques semaines." },
  { animal: "chevre", nom: "Fumier de chèvre", N: "0,7 à 1", P: "0,3 à 0,6", K: "0,8 à 1,2", type: "chaud", compostage: "3 à 6 mois", dose: "2 à 4 kg", usage: "Riche en potasse : tomates, courges, fruitiers, petits fruits.", precaution: "Attention aux vermifuges récents (voir ci-dessous)." },
  { animal: "mouton", nom: "Fumier de mouton", N: "0,8 à 1", P: "0,4 à 0,6", K: "0,8 à 1,2", type: "chaud", compostage: "3 à 6 mois", dose: "2 à 4 kg", usage: "Excellent fumier « chaud » pour les sols froids et lourds ; la laine en paillage gêne les limaces.", precaution: "Vermifuges récents." },
  { animal: "cheval", nom: "Fumier de cheval", N: "0,5 à 0,7", P: "0,3", K: "0,5 à 0,7", type: "chaud", compostage: "6 mois (frais : couche chaude)", dose: "3 à 5 kg", usage: "Fumier pailleux qui structure les sols ; frais, il chauffe les couches de semis précoces.", precaution: "Peut contenir des graines d'herbes et des résidus de vermifuges ou de désherbants du foin." },
  { animal: "ane", nom: "Crottin d'âne", N: "0,5", P: "0,3", K: "0,5", type: "froid", compostage: "3 à 6 mois", dose: "3 à 5 kg", usage: "Pauvre mais très fibreux : paillage au pied des arbres et des petits fruits, amendement des sols sableux.", precaution: "Vermifuges récents." },
  { animal: "cochon", nom: "Fumier de porc", N: "0,5 à 0,8", P: "0,4 à 0,6", K: "0,4 à 0,6", type: "froid", compostage: "6 mois minimum (parasites, germes)", dose: "2 à 3 kg", usage: "Composté, il convient à toutes les cultures gourmandes.", precaution: "Jamais frais au potager ; le lisier liquide n'est pas pour un jardin familial." },
  { animal: "dindon", nom: "Fumier de dinde", N: "1 à 2", P: "1 à 2", K: "0,8", type: "très riche", compostage: "6 mois", dose: "0,5 à 1 kg", usage: "Comme celui des poules.", precaution: "Comme celui des poules." },
];

export const fumierDe = (animal: string) => FUMIERS.find((f) => f.animal === animal);
