// Statut réglementaire des préparations (France, Union européenne).
// Les listes évoluent : chaque fiche renvoie vers ephy.anses.fr et la liste des substances de base.
export type Statut = "base" | "amm" | "fertilisant" | "tradition" | "macro" | "piege";
export const STATUTS: Record<Statut, { label: string; classe: string; explication: string }> = {
  base: { label: "Substance de base autorisée (UE)", classe: "green", explication: "Inscrite sur la liste européenne des substances de base : utilisable au jardin pour les usages prévus, préparée soi-même." },
  amm: { label: "Produit autorisé (AMM) — mention « emploi autorisé au jardin »", classe: "sun", explication: "Utilisez uniquement un produit du commerce portant la mention « Emploi autorisé dans les jardins » (EAJ) et autorisé en agriculture biologique ; respectez l'étiquette : dose, nombre de traitements, délai avant récolte." },
  fertilisant: { label: "Engrais ou stimulant (pas un traitement)", classe: "green", explication: "Sert à nourrir ou fortifier les plantes, pas à les traiter : pas d'autorisation phytosanitaire nécessaire pour un usage au jardin familial." },
  tradition: { label: "Recette traditionnelle (non homologuée)", classe: "terra", explication: "Recette de jardinier sans autorisation officielle comme produit de traitement : son efficacité n'est pas démontrée et son usage relève de votre responsabilité. Préférez la prévention et les solutions autorisées." },
  macro: { label: "Auxiliaire vivant (macro-organisme)", classe: "green", explication: "Organismes vendus pour la lutte biologique, dont l'introduction est encadrée (espèces indigènes autorisées par l'Anses)." },
  piege: { label: "Piège ou barrière (sans produit)", classe: "green", explication: "Moyen physique : pas de produit de traitement." },
};

export const STATUT_REMEDE: Record<string, { statut: Statut; note?: string; dar?: string }> = {
  "purin-ortie": { statut: "base", note: "L'ortie (Urtica) est une substance de base ; comme engrais, c'est un fertilisant libre d'usage." },
  "purin-ortie-frais": { statut: "base", note: "Ortie : substance de base (contre pucerons et acariens)." },
  "purin-consoude": { statut: "fertilisant" },
  preles: { statut: "base", note: "La prêle des champs (Equisetum arvense) est une substance de base (fongicide préventif)." },
  "savon-noir": { statut: "amm", note: "Les savons insecticides du commerce (sels de potassium d'acides gras) ont une autorisation. Le savon noir ménager dilué est un usage traditionnel non homologué.", dar: "Voir l'étiquette (souvent 1 à 3 jours)." },
  bicarbonate: { statut: "base", note: "Le bicarbonate de sodium est une substance de base (oïdium) ; le bicarbonate de potassium est une substance active vendue en produits autorisés." },
  lait: { statut: "base", note: "Le lait de vache figure parmi les substances de base approuvées (oïdium) : vérifiez la liste à jour." },
  soufre: { statut: "amm", note: "Substance active : produit du commerce portant la mention « emploi autorisé au jardin ». Brûle les feuilles au-delà de 28 °C ; incompatible avec les huiles.", dar: "Voir l'étiquette (souvent 3 à 8 jours)." },
  "bouillie-bordelaise": { statut: "amm", note: "Le cuivre est une substance « candidate à la substitution » : limite européenne de 28 kg de cuivre par hectare sur 7 ans (4 kg/ha/an en moyenne), soit 0,4 g de cuivre métal par m² et par an au jardin. Un sachet de bouillie à 20 % de cuivre en contient 200 g par kilo : 2 g de bouillie par m² et par an au maximum.", dar: "Voir l'étiquette (souvent 14 à 21 jours avant la récolte)." },
  "piege-biere": { statut: "piege" },
  cendre: { statut: "fertilisant", note: "Amendement et engrais potassique ; son effet « barrière » contre les limaces disparaît à la première pluie." },
  "macer-rhubarbe": { statut: "tradition", note: "Les feuilles de rhubarbe sont riches en acide oxalique (toxique) : préparation non autorisée et peu efficace. Gants, hors de portée des enfants et des animaux." },
  tanaisie: { statut: "tradition", note: "Tanaisie et absinthe sont des plantes toxiques : usage traditionnel non homologué." },
  camomille: { statut: "tradition", note: "Usage traditionnel (fonte des semis) non homologué ; sans danger." },
  bt: { statut: "amm", note: "Bactérie (substance active microbiologique) vendue en produits autorisés au jardin et en bio ; sans danger pour les abeilles et les auxiliaires.", dar: "Voir l'étiquette (souvent aucun délai ou 3 jours)." },
  nematodes: { statut: "macro" },
  glu: { statut: "piege", note: "Les bandes engluées sur les troncs piègent aussi des auxiliaires et parfois des oiseaux : préférez les bandes protégées par un grillage, retirez-les après la saison." },
  "piege-vinaigre": { statut: "piege" },
  argile: { statut: "amm", note: "Le kaolin est une substance active vendue en produits autorisés ; l'argile ménagère est un usage traditionnel." },
  alcool: { statut: "tradition", note: "Nettoyage manuel des cochenilles au coton-tige : usage traditionnel, localisé, sans danger pour vous." },
  badigeon: { statut: "tradition", note: "Soin des troncs (protection contre le soleil d'hiver) : pas un traitement." },
  urine: { statut: "fertilisant" },
  "eau-pluie": { statut: "fertilisant" },
};

export const REGLES_TRAITEMENT = [
  "Depuis 2019, les particuliers n'ont plus le droit d'acheter ni d'utiliser des pesticides de synthèse (loi Labbé). Restent autorisés : produits de biocontrôle, produits utilisables en agriculture biologique, substances de base.",
  "Un produit du commerce doit porter la mention « Emploi autorisé dans les jardins » (EAJ). Son autorisation se vérifie sur ephy.anses.fr.",
  "Respectez le délai avant récolte (DAR) écrit sur l'étiquette : c'est le nombre de jours entre le dernier traitement et la cueillette.",
  "Traitez seulement si nécessaire (voir les seuils), par temps sec, sans vent, hors floraison, le soir (abeilles), avec gants et lunettes.",
  "Ne videz jamais un reste de produit dans l'évier ou le caniveau : déchetterie.",
];
