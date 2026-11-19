// Modèle de contenu de Racines. Tout le savoir de l'application est
// décrit ici sous forme de données : ajouter une plante, un animal ou un
// tutoriel ne demande que d'ajouter une entrée (les contrôles du build
// vérifient les références croisées).

export type Mois = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Categorie = "legume" | "aromatique" | "fruit" | "arbre" | "fleur" | "engrais-vert" | "interieur" | "ornement" | "sauvage" | "toxique";

// Familles botaniques : base de la rotation des cultures
export type Famille =
  | "solanacees"
  | "cucurbitacees"
  | "fabacees"
  | "brassicacees"
  | "apiacees"
  | "amaryllidacees"
  | "asteracees"
  | "amaranthacees"
  | "poacees"
  | "lamiacees"
  | "rosacees"
  | "polygonacees"
  | "convolvulacees"
  | "valerianacees"
  | "autres";

export type Lieu = "pleine-terre" | "pot" | "balcon" | "serre" | "interieur";
export type Expo = "soleil" | "mi-ombre" | "ombre";
export type Besoin = "gourmand" | "moyen" | "peu" | "ameliorant";

export interface Plante {
  id: string;
  nom: string;
  latin: string;
  categorie: Categorie;
  famille: Famille;
  emoji: string;
  wiki?: string; // titre de l'article Wikipédia (photo et lien)
  difficulte: 1 | 2 | 3;
  lieux: Lieu[];
  expo: Expo[];
  besoin: Besoin;
  eau: "faible" | "moyen" | "fort";
  // Calendrier de référence : climat tempéré (Centre / Nord de la France).
  // Il est décalé automatiquement selon la zone choisie dans les réglages.
  semisAbri?: Mois[];
  semisPlace?: Mois[];
  plantation?: Mois[];
  recolte?: Mois[];
  taille?: Mois[];
  espacement?: string;
  profondeur?: string;
  levee?: string; // durée de germination
  tempGermination?: string; // températures de germination (minimum, idéal)
  delai?: string; // du semis ou de la plantation à la récolte
  joursRecolte?: number; // valeur moyenne utilisée pour prévoir la récolte
  contenant?: string; // taille minimale de pot
  rendement?: string;
  amis: string[];
  ennemis: string[];
  intro: string;
  etapes: string[];
  entretien: string[];
  recolteConseil?: string;
  conservation?: string;
  problemes: string[]; // ids de la table des problèmes
  astuces?: string[];
  graines?: { ans: number; recolter?: string }; // durée germinative, comment récolter ses graines
  animaux?: string; // ce que la basse-cour peut en manger (ou pas)
  toxique?: string; // pour les enfants / animaux de compagnie
  // Plantes d'intérieur
  lumiere?: string;
  arrosageDetail?: string;
  humidite?: string;
  rempotage?: string;
  temperature?: string;
  // Recherche et identification
  alias?: string[]; // noms courants (« caoutchouc », « misère »…)
  latins?: string[]; // autres noms scientifiques, anciens ou acceptés (Pl@ntNet)
  sosies?: { id?: string; nom: string; difference: string }[]; // plantes avec lesquelles on la confond
  // Suivi « Mes plantes » (intérieur et pots) : jours entre deux soins
  soins?: { arrosageEte: number; arrosageHiver: number; engrais?: number; rempotageAns?: number };
  sansDangerAnimaux?: boolean; // chats et chiens
  ombreOk?: boolean; // supporte une pièce peu lumineuse
  fleurit?: boolean; // fleurit en intérieur
  tailleAdulte?: string;
  photo?: string; // fichier Wikimedia Commons à préférer à la photo de l'article
  danger?: boolean; // plante très toxique : alerte rouge à l'identification
  semisPlaceDoux?: Mois[]; // semis d'automne réservés aux climats doux
  comestible?: string; // partie comestible et précautions (plantes sauvages, fleurs)
  // Fleurs
  couleurs?: Couleur[];
  floraison?: Mois[];
  cycle?: "annuelle" | "bisannuelle" | "vivace" | "bulbe" | "grimpante" | "arbuste";
  mellifere?: boolean;
  hauteur?: string;
  rusticite?: number; // température minimale supportée en pleine terre (°C), plante installée
  feuillage?: "persistant" | "semi-persistant" | "caduc";
}
export type Couleur = "blanc" | "jaune" | "orange" | "rouge" | "rose" | "violet" | "bleu" | "vert" | "multicolore";

export type TypeProbleme = "champignon" | "bacterie" | "virus" | "ravageur" | "physiologique" | "carence" | "mammifere";
export type Organe = "feuilles" | "fruits" | "tiges" | "racines" | "fleurs" | "plantule" | "plante";

export interface Probleme {
  id: string;
  nom: string;
  type: TypeProbleme;
  wiki?: string;
  cible: string; // plantes concernées, en clair
  plantes: string[]; // ids de plantes ou "*"
  organes: Organe[];
  signes: string[]; // ids de la table des symptômes
  symptomes: string[];
  confusion?: string;
  conditions: string;
  prevention: string[];
  traitements: string[];
  remedes: string[]; // ids de remèdes
  gravite: 1 | 2 | 3;
  mois: Mois[];
  interieur?: boolean;
  alias?: string[]; // mots que l'on tape (« feuilles jaunes », « terreau blanc »…)
}

export interface Remede {
  id: string;
  nom: string;
  emoji: string;
  role: string;
  ingredients: string[];
  preparation: string[];
  usage: string[];
  precautions: string[];
  contre: string[]; // ids de problèmes
  conservation?: string;
}

export interface Auxiliaire {
  id: string;
  nom: string;
  emoji: string;
  wiki?: string;
  mange: string;
  attirer: string[];
}

export interface EtapeGuide {
  titre: string;
  texte: string;
  attention?: string;
  astuce?: string;
}

export type Rubrique =
  | "demarrer"
  | "fleurs"
  | "sol"
  | "compost"
  | "arrosage"
  | "semis"
  | "serre"
  | "balcon"
  | "interieur"
  | "fabriquer"
  | "recolte"
  | "animaux"
  | "boucherie"
  | "securite";

export interface Guide {
  id: string;
  titre: string;
  rubrique: Rubrique;
  emoji: string;
  resume: string;
  niveau: 1 | 2 | 3;
  duree: string;
  quand?: string;
  materiel?: string[];
  etapes: EtapeGuide[];
  conseils?: string[];
  erreurs?: string[];
  video: string; // requête de recherche vidéo
  liens?: string[]; // ids de plantes, problèmes, guides ou animaux liés
  alias?: string[]; // mots de recherche supplémentaires
  sensible?: boolean; // contenu à accès volontaire (abattage)
}

export interface Animal {
  id: string;
  nom: string;
  emoji: string;
  wiki?: string;
  resume: string;
  profil: { espace: string; temps: string; budget: string; vie: string; bruit: string; niveau: 1 | 2 | 3 };
  logement: string[];
  alimentation: string[];
  jardinOK: string[];
  interdits: string[];
  eau: string;
  quotidien: string[];
  hebdo: string[];
  mensuel: string[];
  saisons: { printemps: string[]; ete: string[]; automne: string[]; hiver: string[] };
  sante: { signe: string; action: string }[];
  maladies: { nom: string; signes: string; prevention: string; soin: string }[];
  reproduction: string[];
  fumier: { valeur: string; usage: string[] };
  auJardin: string[]; // services rendus : désherbage, lutte contre les ravageurs…
  reglementation: string[];
  produits?: string[];
  cohabitation?: string;
  video: string;
  soins: { type: string; tousLesJours: number; mois?: number[] }[]; // mois : rappel seulement pendant ces mois (1-12) // rappels récurrents (vermifuge, parage…)
}

export interface TacheMois {
  mois: Mois;
  potager: string[];
  verger: string[];
  serre: string[];
  interieur: string[];
  compost: string[];
  animaux: string[];
  balcon: string[];
}
