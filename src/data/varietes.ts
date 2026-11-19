// Variétés conseillées pour un jardin familial (repères courants en France, à compléter selon sa région).
// type : P précoce, T tardive, R résistante ou tolérante à une maladie, G de garde, A ancienne ou de pays, F facile ou productive
export type TypeVariete = "P" | "T" | "R" | "G" | "A" | "F";
export const LIB_TYPE_VARIETE: Record<TypeVariete, string> = { P: "Précoce", T: "Tardive", R: "Résistante", G: "De garde", A: "Ancienne", F: "Facile, productive" };

export const VARIETES: Record<string, { nom: string; types: TypeVariete[]; note: string }[]> = {
  lentille: [
    { nom: "Lentille verte du Puy (type)", types: ["A"], note: "Petite lentille verte marbrée, tenue à la cuisson ; sol pauvre et sec." },
    { nom: "Lentille blonde de Saint-Flour", types: ["A"], note: "Lentille de pays, grosse et douce, adaptée au climat frais." },
    { nom: "Lentille corail (rouge)", types: ["F"], note: "Cuisson rapide, demande un été chaud." },
  ],
  "pois-chiche": [
    { nom: "Kabuli (gros grain clair)", types: ["F"], note: "Le pois chiche de cuisine courant ; demande un été chaud et sec." },
    { nom: "Desi (petit grain foncé)", types: ["R"], note: "Plus rustique et plus tolérant aux maladies, petits grains." },
  ],
  salsifis: [
    { nom: "Scorsonère « Géante noire de Russie »", types: ["F"], note: "Racine noire longue, la plus productive et la plus facile." },
    { nom: "Salsifis « Mammouth »", types: ["A"], note: "Racine claire au goût fin, demande une terre très meuble." },
  ],
  aubergine: [
    { nom: "Black Beauty", types: ["F"], note: "Grosse aubergine violet foncé, classique et productive." },
    { nom: "Barbentane", types: ["P", "A"], note: "Longue, précoce, adaptée aux étés courts." },
    { nom: "Rotonda bianca sfumata di rosa", types: ["A"], note: "Ronde rose et blanche, chair douce." },
  ],
  courgette: [
    { nom: "Verte des maraîchers", types: ["F", "A"], note: "La classique, buissonnante et productive." },
    { nom: "Ronde de Nice", types: ["A"], note: "Ronde, à farcir ; à récolter petite." },
    { nom: "Variétés tolérantes à l'oïdium (mention « IR Px »)", types: ["R"], note: "Gardent leurs feuilles plus longtemps en fin d'été." },
  ],
  concombre: [
    { nom: "Le Généreux", types: ["F"], note: "Productif en pleine terre." },
    { nom: "Marketmore", types: ["R"], note: "Tolérant à l'oïdium et au virus de la mosaïque." },
    { nom: "Cornichon vert petit de Paris", types: ["A"], note: "Le cornichon traditionnel à confire." },
  ],
  feve: [
    { nom: "Aguadulce", types: ["P", "F"], note: "Longues gousses, semis d'automne dans le Sud." },
    { nom: "Fève de Séville", types: ["P"], note: "Très précoce, semis de fin d'hiver." },
    { nom: "Witkiem", types: ["F"], note: "Semis de printemps, gousses bien remplies." },
  ],
  "pomme-de-terre": [
    { nom: "Charlotte", types: ["F"], note: "Chair ferme, à vapeur et salade, garde moyenne." },
    { nom: "Désirée, Agria, Bintje", types: ["G"], note: "Bonnes variétés de garde pour l'hiver." },
    { nom: "Sarpo Mira, Carolus, Twinner", types: ["R"], note: "Très tolérantes au mildiou : moins de traitements." },
    { nom: "Ratte, Vitelotte", types: ["A"], note: "Variétés anciennes de goût, rendement plus faible." },
  ],
  radis: [
    { nom: "Flamboyant, 18 jours", types: ["P", "F"], note: "Radis demi-longs, très rapides." },
    { nom: "Gaudry", types: ["F"], note: "Rond rouge à bout blanc, tient bien." },
    { nom: "Noir long d'hiver, Red Meat", types: ["G"], note: "Radis d'automne et d'hiver qui se conservent." },
  ],
  navet: [
    { nom: "Milan à collet violet", types: ["P"], note: "Rapide, à récolter jeune." },
    { nom: "Boule d'or", types: ["G", "A"], note: "Chair jaune, se garde en cave." },
    { nom: "Navet des Vertus Marteau", types: ["A"], note: "Long, d'automne." },
  ],
  betterave: [
    { nom: "Detroit 2", types: ["F", "G"], note: "Ronde, régulière, se conserve bien." },
    { nom: "Crapaudine", types: ["A", "G"], note: "Longue à peau rugueuse, la plus goûteuse." },
    { nom: "Chioggia", types: ["A"], note: "Chair rayée rose et blanc, douce." },
  ],
  panais: [
    { nom: "Demi-long de Guernesey", types: ["A", "F"], note: "Le classique, rustique." },
    { nom: "Tender and True", types: ["R"], note: "Tolérant au chancre du panais." },
  ],
  celeri: [
    { nom: "Céleri-rave Monarch", types: ["F", "G"], note: "Boule lisse, se garde en cave." },
    { nom: "Céleri-rave Prinz", types: ["R"], note: "Tolérant à la septoriose." },
    { nom: "Céleri branche Plein blanc doré", types: ["A"], note: "Côtes blanches et tendres." },
  ],
  poireau: [
    { nom: "Poireau d'été Gros long d'été", types: ["P"], note: "À récolter à la fin de l'été." },
    { nom: "Bleu de Solaise", types: ["T", "A"], note: "Feuillage bleu, très résistant au froid." },
    { nom: "Monstrueux de Carentan", types: ["A"], note: "Gros fût court, automne-hiver." },
  ],
  echalote: [
    { nom: "Grise (griselle)", types: ["A", "G"], note: "Goût fin, plantée à l'automne, se garde 8 à 12 mois." },
    { nom: "Jersey (demi-longue rose)", types: ["F"], note: "Productive, plantation de printemps." },
    { nom: "Longor", types: ["G"], note: "Longue, se conserve bien." },
  ],
  "chou-fleur": [
    { nom: "Boule de neige", types: ["P"], note: "Pommes moyennes, de printemps ou d'automne." },
    { nom: "Romanesco", types: ["A"], note: "Pommes pyramidales vertes, d'automne." },
    { nom: "Brocoli Calabrais", types: ["F"], note: "Repousses latérales après la première tête." },
  ],
  "chou-kale": [
    { nom: "Kale vert demi-nain frisé", types: ["F"], note: "Très résistant au froid, récolte feuille à feuille." },
    { nom: "Nero di Toscana", types: ["A"], note: "Feuilles noires cloquées, tendres." },
    { nom: "Chou de Bruxelles Long Island", types: ["T"], note: "Récolte de novembre à février." },
  ],
  mache: [
    { nom: "Verte à cœur plein", types: ["F"], note: "Rosettes bien pleines." },
    { nom: "Verte de Cambrai", types: ["A", "R"], note: "Très résistante au froid." },
    { nom: "Coquille de Louviers", types: ["A"], note: "Feuilles en cuillère, rustique." },
  ],
  epinard: [
    { nom: "Géant d'hiver", types: ["T"], note: "Semis d'automne, récolte d'hiver et de printemps." },
    { nom: "Matador", types: ["F"], note: "Semis de printemps, monte peu." },
    { nom: "Variétés résistantes au mildiou (« Pfs »)", types: ["R"], note: "Moins de taches en saison humide." },
  ],
  blette: [
    { nom: "Verte à carde blanche", types: ["F"], note: "Larges côtes, très productive." },
    { nom: "Bright Lights (multicolore)", types: ["A"], note: "Côtes jaunes, roses, rouges ; décorative." },
    { nom: "Poirée à couper", types: ["F"], note: "Feuilles seules, comme un épinard qui ne monte pas." },
  ],
  roquette: [
    { nom: "Roquette cultivée", types: ["P", "F"], note: "Pousse vite, monte en graines l'été." },
    { nom: "Roquette sauvage (Diplotaxis)", types: ["R"], note: "Vivace, plus piquante, monte moins vite." },
  ],
  fenouil: [
    { nom: "Fenouil de Florence", types: ["A"], note: "Bulbe, semis à partir de juin pour éviter la montaison." },
    { nom: "Zefa Fino", types: ["R", "F"], note: "Résiste bien à la montée en graines." },
  ],
  artichaut: [
    { nom: "Gros vert de Laon", types: ["A", "R"], note: "Le plus rustique au froid du Nord." },
    { nom: "Violet de Provence", types: ["A", "P"], note: "Petits artichauts, régions douces." },
    { nom: "Camus de Bretagne", types: ["A"], note: "Gros capitule rond, climat océanique." },
  ],
  asperge: [
    { nom: "Argenteuil", types: ["A"], note: "Variété ancienne, asperges blanches ou violettes." },
    { nom: "Hybrides mâles (Gijnlim, Backlim)", types: ["F"], note: "Plus productives, pas de graines qui germent partout." },
  ],
  mais: [
    { nom: "Maïs doux (variétés « sucré » ou « supersweet »)", types: ["F"], note: "À manger frais ; isoler des autres maïs (pollinisation croisée)." },
    { nom: "Maïs à pop-corn", types: ["A"], note: "À sécher sur pied." },
    { nom: "Maïs population (Grand Roux basque…)", types: ["A"], note: "Pour la farine et la polenta, semences reproductibles." },
  ],
  "patate-douce": [
    { nom: "Beauregard", types: ["P", "F"], note: "Chair orange, la plus adaptée aux étés courts." },
    { nom: "Murasaki", types: ["A"], note: "Peau violette, chair blanche, goût de châtaigne." },
  ],
  topinambour: [
    { nom: "Fuseau", types: ["F"], note: "Tubercules allongés et lisses, faciles à éplucher." },
    { nom: "Rouge commun", types: ["A"], note: "Très rustique et productif." },
  ],
  rhubarbe: [
    { nom: "Victoria", types: ["F"], note: "Productive, tiges vertes et rouges." },
    { nom: "Glaskins Perpetual", types: ["P"], note: "Récolte possible dès la première année." },
    { nom: "Valentine", types: ["A"], note: "Tiges bien rouges, moins acides." },
  ],
  chicoree: [
    { nom: "Scarole grosse bouclée", types: ["F"], note: "Automne, résiste aux premières gelées." },
    { nom: "Frisée fine de Louviers", types: ["A"], note: "Feuilles très découpées." },
    { nom: "Pain de sucre, Trévise", types: ["T"], note: "Chicorées d'automne et d'hiver." },
  ],
  oseille: [
    { nom: "Large de Belleville", types: ["A", "F"], note: "Grandes feuilles, la plus courante." },
    { nom: "Oseille sanguine", types: ["A"], note: "Nervures rouges, décorative, moins acide." },
  ],
  cresson: [
    { nom: "Cresson alénois", types: ["P", "F"], note: "Prêt en 10 jours, même en pot." },
    { nom: "Cresson de terre", types: ["F"], note: "Pousse en terre fraîche, sans eau courante." },
  ],
  cerisier: [
    { nom: "Burlat", types: ["P"], note: "Très précoce (fin mai), demande un pollinisateur." },
    { nom: "Stella, Sunburst, Lapins", types: ["F"], note: "Autofertiles : un seul arbre suffit." },
    { nom: "Montmorency", types: ["A"], note: "Cerise acide, pour clafoutis et confitures, autofertile." },
  ],
  prunier: [
    { nom: "Mirabelle de Nancy", types: ["A", "F"], note: "Autofertile, la plus parfumée." },
    { nom: "Quetsche d'Alsace", types: ["T", "F"], note: "Autofertile, idéale pour tartes et pruneaux." },
    { nom: "Reine-Claude dorée", types: ["A"], note: "Délicieuse ; prévoir une Reine-Claude d'Oullins à proximité." },
  ],
  framboisier: [
    { nom: "Héritage, Autumn Bliss", types: ["T", "F"], note: "Remontantes : récolte de la fin d'été aux gelées." },
    { nom: "Glen Ample, Tulameen", types: ["P"], note: "Non remontantes, grosses framboises en juin-juillet." },
    { nom: "Framboise jaune Fallgold", types: ["A"], note: "Fruits jaunes très sucrés." },
  ],
  groseillier: [
    { nom: "Groseille Jonkheer van Tets", types: ["P", "F"], note: "Grosses grappes rouges, précoce." },
    { nom: "Groseille blanche de Versailles", types: ["A"], note: "Douce, peu acide." },
    { nom: "Cassis Noir de Bourgogne", types: ["A"], note: "Le cassis des liqueurs, très parfumé." },
  ],
  agrumes: [
    { nom: "Citronnier 4 saisons", types: ["F"], note: "Fleurit et fructifie toute l'année en pot." },
    { nom: "Kumquat, calamondin", types: ["R"], note: "Les plus résistants au froid (-7 à -10 °C)." },
    { nom: "Clémentinier", types: ["A"], note: "Pour les régions douces ou la véranda." },
  ],
  cognassier: [
    { nom: "Champion", types: ["F"], note: "Productif, gros fruits, autofertile." },
    { nom: "Coing de Portugal", types: ["A"], note: "Très gros fruits parfumés." },
    { nom: "Vranja", types: ["P"], note: "Fruits en forme de poire, très parfumés." },
  ],
  sureau: [
    { nom: "Sureau noir commun", types: ["A"], note: "Fleurs pour sirop et beignets, baies cuites." },
    { nom: "Haschberg", types: ["F"], note: "Sélectionné pour ses grosses grappes de baies." },
  ],
  murier: [
    { nom: "Mûrier sans épines Thornless Evergreen", types: ["F"], note: "Vigoureux, palissé, récolte en août-septembre." },
    { nom: "Loch Ness", types: ["F"], note: "Port érigé, sans épines, gros fruits." },
    { nom: "Mûrier noir (Morus nigra)", types: ["A"], note: "Arbre aux mûres très parfumées." },
  ],
};
