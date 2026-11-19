// Données de conservation structurées par plante : durée au frais, méthodes possibles,
// garde en cave, variétés de garde. Repères indicatifs de conserverie familiale.

export type MethodeConserv = "frais" | "cave" | "terre" | "congelation" | "sterilisation" | "lacto" | "vinaigre" | "sucre" | "sechage" | "huile" | "sel" | "jus" | "alcool" | "fumage";

export const METHODES_CONSERV: Record<MethodeConserv, { nom: string; emoji: string; guide: string; materiel?: "congelateur" | "sterilisateur" | "deshydrateur" | "cave" | "pressoir"; effort: 1 | 2 | 3; garde: string }> = {
  frais: { nom: "Au frais", emoji: "🥬", guide: "apres-recolte", effort: 1, garde: "quelques jours" },
  cave: { nom: "En cave ou au fruitier", emoji: "🏚️", guide: "cs-cave", materiel: "cave", effort: 1, garde: "1 à 12 mois" },
  terre: { nom: "Laissé en terre", emoji: "🌱", guide: "conserver-recoltes", effort: 1, garde: "tout l'hiver" },
  congelation: { nom: "Congélation", emoji: "❄️", guide: "cs-congelation", materiel: "congelateur", effort: 2, garde: "6 à 12 mois" },
  sterilisation: { nom: "Bocaux stérilisés", emoji: "🥫", guide: "bocaux", materiel: "sterilisateur", effort: 3, garde: "1 an" },
  lacto: { nom: "Lacto-fermentation", emoji: "🥒", guide: "lactofermentation", effort: 2, garde: "6 mois au frais" },
  vinaigre: { nom: "Au vinaigre, chutney", emoji: "🍶", guide: "cs-vinaigre", effort: 2, garde: "1 an" },
  sucre: { nom: "Confiture, sirop, compote", emoji: "🍯", guide: "cs-confitures", effort: 2, garde: "1 an" },
  sechage: { nom: "Séchage", emoji: "☀️", guide: "cs-sechage", materiel: "deshydrateur", effort: 2, garde: "6 mois à 1 an" },
  huile: { nom: "À l'huile (au frais)", emoji: "🍳", guide: "cs-sel-huile-fumage", effort: 2, garde: "2 à 4 semaines au réfrigérateur" },
  sel: { nom: "Au sel", emoji: "🧂", guide: "cs-sel-huile-fumage", effort: 1, garde: "6 mois à 1 an" },
  jus: { nom: "Jus pasteurisé, cidre", emoji: "🍹", guide: "cs-jus-cidre", materiel: "pressoir", effort: 3, garde: "1 an" },
  alcool: { nom: "À l'eau-de-vie, liqueur", emoji: "🍒", guide: "cs-alcool", effort: 1, garde: "plusieurs années" },
  fumage: { nom: "Fumage", emoji: "🔥", guide: "cs-sel-huile-fumage", effort: 3, garde: "selon séchage" },
};

export interface ConservPlante {
  frais: string; // où et combien de temps
  methodes: MethodeConserv[]; // classées de la plus conseillée à la moins
  cave?: string; // durée de garde en cave / au fruitier
  nonCongel?: string; // ce qui ne se congèle pas bien
  varietes?: string; // variétés de garde
  texte?: string; // conseil complet si la fiche n'en a pas
  acide?: boolean; // conserve acide (sans risque botulique à 100 °C)
}

export const CONSERV: Record<string, ConservPlante> = {
  lentille: { frais: "Graines sèches : plusieurs années au sec", methodes: ["sechage", "congelation"], texte: "48 heures au congélateur après récolte (bruche), puis bocal fermé au sec" },
  "pois-chiche": { frais: "Pois frais : 3 jours ; secs : plusieurs années", methodes: ["sechage", "congelation", "sterilisation"], texte: "48 heures au congélateur, puis bocal au sec" },
  salsifis: { frais: "1 semaine au réfrigérateur", methodes: ["terre", "cave", "congelation"], cave: "2 à 3 mois en sable frais" },
  kaki: { frais: "Plusieurs semaines au frais, à blettir à température ambiante", methodes: ["frais", "congelation", "sechage"] },
  grenadier: { frais: "1 à 2 mois au frais et au sec", methodes: ["frais", "congelation", "jus"] },
  tomate: { frais: "5 à 7 jours à température ambiante, jamais au réfrigérateur", methodes: ["sterilisation", "congelation", "sechage", "sucre", "vinaigre", "lacto"], nonCongel: "crue pour la salade (devient molle)", varietes: "Tomates charnues pour coulis et séchage : roma, cœur de bœuf, San Marzano", acide: true },
  aubergine: { frais: "1 semaine au frais (10 °C)", methodes: ["congelation", "huile", "lacto"], nonCongel: "crue (devient spongieuse) : grillez-la avant" },
  poivron: { frais: "1 à 2 semaines au réfrigérateur", methodes: ["congelation", "sechage", "lacto", "vinaigre", "huile", "fumage"] },
  courgette: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "vinaigre", "lacto", "sucre"], nonCongel: "en rondelles crues (molle) : râpée ou cuite" },
  concombre: { frais: "1 semaine au réfrigérateur", methodes: ["lacto", "vinaigre"], nonCongel: "tout cru" },
  courge: { frais: "Se garde des mois une fois « durcie »", methodes: ["cave", "congelation", "sucre"], cave: "3 à 12 mois à 12-15 °C (musquées et butternut les plus longues)", varietes: "Musquée de Provence, butternut, longue de Nice, sucrine du Berry, potimarron (3-5 mois)" },
  melon: { frais: "3 à 5 jours ; au réfrigérateur une fois coupé", methodes: ["congelation", "sucre", "sechage"] },
  pasteque: { frais: "2 semaines entière au frais", methodes: ["sucre", "vinaigre"], texte: "Entière, elle se garde 2 à 3 semaines au frais. Confiture de pastèque à confire (méréville), écorces au vinaigre." },
  haricot: { frais: "3 jours au réfrigérateur", methodes: ["congelation", "sterilisation", "lacto", "sel", "sechage"], varietes: "Haricots à écosser (lingot, coco) pour les grains secs" },
  pois: { frais: "1 à 2 jours (le sucre devient amidon)", methodes: ["congelation", "sechage", "sterilisation"] },
  feve: { frais: "2 jours au réfrigérateur", methodes: ["congelation", "sechage"] },
  "pomme-de-terre": { frais: "Dans le noir, au frais", methodes: ["cave"], cave: "4 à 8 mois à 5-8 °C dans le noir", nonCongel: "crue (devient noire et aqueuse) ; en purée ou frites précuites oui", varietes: "Bintje, Désirée, Agria, Mona Lisa pour la garde ; les primeurs se gardent peu" },
  carotte: { frais: "2 à 3 semaines au réfrigérateur, fanes coupées", methodes: ["terre", "cave", "lacto", "congelation", "sterilisation"], cave: "4 à 6 mois en caisse de sable humide", varietes: "Carottes de garde : Colmar, Nantaise améliorée tardive, Flakkee" },
  radis: { frais: "1 semaine au réfrigérateur, fanes coupées", methodes: ["lacto", "vinaigre"], nonCongel: "tout" },
  navet: { frais: "2 semaines au réfrigérateur", methodes: ["terre", "cave", "lacto", "vinaigre"], cave: "2 à 4 mois en sable" },
  betterave: { frais: "2 à 3 semaines au réfrigérateur", methodes: ["cave", "vinaigre", "lacto", "sterilisation"], cave: "4 à 6 mois en sable, collet intact" },
  panais: { frais: "2 semaines au réfrigérateur", methodes: ["terre", "cave", "congelation"], cave: "4 à 6 mois en sable ; meilleur après les gelées" },
  celeri: { frais: "2 semaines au réfrigérateur", methodes: ["cave", "sel", "congelation", "sechage"], cave: "Céleri-rave 4 à 6 mois en sable" },
  poireau: { frais: "1 à 2 semaines au réfrigérateur", methodes: ["terre", "congelation", "sechage"], cave: "2 à 3 mois en jauge dans du sable", varietes: "Poireaux d'hiver : bleu de Solaise, monstrueux de Carentan" },
  oignon: { frais: "Au sec, à l'air", methodes: ["cave", "vinaigre", "sechage", "congelation"], cave: "6 à 10 mois au sec, tressés ou en filets", varietes: "Jaune paille des Vertus, Stuttgart, rouge de Brunswick (les oignons blancs se gardent peu)" },
  echalote: { frais: "Au sec, à l'air", methodes: ["cave", "vinaigre"], cave: "8 à 12 mois au sec" },
  ail: { frais: "Au sec, à l'air", methodes: ["cave", "lacto", "fumage", "congelation", "sechage"], cave: "6 à 12 mois au sec, tressé (ail rose et violet de printemps les plus longs)", varietes: "Ail rose de Lautrec, violet de Cadours, ail de printemps pour la garde" },
  chou: { frais: "2 à 4 semaines au réfrigérateur", methodes: ["lacto", "terre", "cave", "congelation"], cave: "2 à 4 mois suspendus tête en bas" },
  "chou-fleur": { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "vinaigre", "lacto"] },
  "chou-kale": { frais: "1 semaine au réfrigérateur", methodes: ["terre", "congelation", "sechage"] },
  laitue: { frais: "3 à 5 jours au réfrigérateur dans un linge humide", methodes: ["frais"], nonCongel: "tout" },
  mache: { frais: "3 jours au réfrigérateur", methodes: ["terre", "frais"], nonCongel: "tout" },
  epinard: { frais: "3 jours au réfrigérateur", methodes: ["congelation", "terre"] },
  blette: { frais: "4 jours au réfrigérateur", methodes: ["congelation", "terre"] },
  roquette: { frais: "3 jours au réfrigérateur", methodes: ["frais", "huile"], nonCongel: "en salade" },
  fenouil: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "lacto", "vinaigre"] },
  artichaut: { frais: "4 à 5 jours au réfrigérateur, tige dans l'eau", methodes: ["congelation", "huile", "vinaigre"] },
  asperge: { frais: "3 jours debout dans un peu d'eau au réfrigérateur", methodes: ["congelation", "sterilisation", "vinaigre"] },
  mais: { frais: "1 à 2 jours (le sucre se perd vite)", methodes: ["congelation", "sechage"], varietes: "Maïs à pop-corn et à farine pour le séchage" },
  "patate-douce": { frais: "Ne jamais la mettre au réfrigérateur", methodes: ["cave", "congelation"], cave: "3 à 6 mois à 13-15 °C après 10 jours de cicatrisation au chaud" },
  topinambour: { frais: "1 semaine au réfrigérateur", methodes: ["terre", "cave", "lacto"], cave: "1 à 2 mois en sable humide (il se ride vite)" },
  rhubarbe: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "sucre"] },
  chicoree: { frais: "1 semaine au réfrigérateur", methodes: ["terre", "cave", "frais"], cave: "Racines d'endive forcées en cave tout l'hiver", texte: "Les chicorées frisées et scaroles se gardent 1 semaine au réfrigérateur et tiennent en terre jusqu'aux fortes gelées (sous voile). Les racines d'endive se forcent en cave dans l'obscurité, de novembre à mars." },
  oseille: { frais: "3 jours au réfrigérateur", methodes: ["congelation", "terre"], texte: "3 jours au réfrigérateur. Se congèle très bien fondue au beurre (en purée), en portions. Riche en acide oxalique : avec modération pour les personnes sujettes aux calculs rénaux." },
  cresson: { frais: "2 jours au réfrigérateur, tiges dans l'eau", methodes: ["frais", "congelation"], texte: "Très fragile : 2 jours au réfrigérateur, tiges dans un verre d'eau. Se congèle en soupe. Cresson cultivé à l'eau propre uniquement (le cresson sauvage des ruisseaux peut transmettre la douve du foie)." },
  // Aromatiques
  basilic: { frais: "Quelques jours, tiges dans l'eau, hors du réfrigérateur", methodes: ["congelation", "huile", "sel"] },
  persil: { frais: "1 semaine au réfrigérateur, en bouquet dans l'eau", methodes: ["congelation", "sel", "sechage"] },
  ciboulette: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "sel"] },
  coriandre: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "sechage"] },
  thym: { frais: "2 semaines", methodes: ["sechage", "huile", "sel"] },
  romarin: { frais: "2 semaines", methodes: ["sechage", "huile", "sel"] },
  menthe: { frais: "1 semaine au réfrigérateur", methodes: ["sechage", "sucre", "congelation"] },
  sauge: { frais: "1 semaine", methodes: ["sechage", "congelation"] },
  origan: { frais: "1 semaine", methodes: ["sechage"] },
  aneth: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "sechage", "vinaigre"] },
  estragon: { frais: "1 semaine au réfrigérateur", methodes: ["vinaigre", "congelation", "sechage"] },
  laurier: { frais: "Toute l'année sur l'arbuste", methodes: ["sechage"] },
  cerfeuil: { frais: "3 jours au réfrigérateur", methodes: ["congelation"] },
  sarriette: { frais: "1 semaine", methodes: ["sechage"] },
  melisse: { frais: "1 semaine", methodes: ["sechage", "sucre"] },
  verveine: { frais: "1 semaine", methodes: ["sechage", "alcool"] },
  // Petits fruits
  fraisier: { frais: "1 à 2 jours, non lavées, au frais", methodes: ["sucre", "congelation", "sechage"] },
  framboisier: { frais: "1 à 2 jours au réfrigérateur", methodes: ["congelation", "sucre", "alcool", "vinaigre"] },
  groseillier: { frais: "3 à 5 jours au réfrigérateur", methodes: ["sucre", "congelation", "alcool", "jus"] },
  myrtillier: { frais: "1 semaine au réfrigérateur", methodes: ["congelation", "sucre", "sechage"] },
  vigne: { frais: "1 à 2 semaines au frais", methodes: ["jus", "sechage", "sucre", "alcool"], cave: "Grappes de garde suspendues : 1 à 2 mois" },
  kiwi: { frais: "Mûrit au fruitier, puis 1 semaine au frais", methodes: ["cave", "sucre", "sechage"], cave: "Cueillis durs, 2 à 4 mois au frais (à mûrir près des pommes)" },
  sureau: { frais: "Fleurs à utiliser le jour même", methodes: ["sucre", "jus", "sechage"] },
  murier: { frais: "1 jour", methodes: ["congelation", "sucre", "jus"] },
  "groseille-maquereau": { frais: "3 à 5 jours au réfrigérateur", methodes: ["sucre", "congelation", "vinaigre"] },
  // Arbres fruitiers
  pommier: { frais: "Au fruitier", methodes: ["cave", "sucre", "jus", "sechage", "congelation", "vinaigre"], cave: "1 à 6 mois au fruitier selon la variété", varietes: "Reinette, belle de Boskoop, Canada, patte de loup, Melrose, Chantecler (garde jusqu'en mars-avril)", acide: true },
  poirier: { frais: "Au fruitier ; mûrissent après la cueillette", methodes: ["cave", "sucre", "sechage", "jus", "alcool"], cave: "1 à 3 mois au fruitier", varietes: "Poires d'hiver : Passe-Crassane, Comice, Conférence, curé" },
  cerisier: { frais: "2 à 4 jours au réfrigérateur", methodes: ["sucre", "congelation", "alcool", "sechage"] },
  prunier: { frais: "3 à 5 jours", methodes: ["sucre", "sechage", "congelation", "alcool"] },
  pecher: { frais: "3 à 5 jours", methodes: ["sucre", "congelation", "sechage"] },
  figuier: { frais: "2 jours", methodes: ["sechage", "sucre", "congelation"] },
  noyer: { frais: "Noix fraîches 1 semaine au réfrigérateur", methodes: ["sechage", "alcool"], cave: "Noix sèches 1 an (attention aux moisissures)" },
  agrumes: { frais: "2 à 3 semaines au frais", methodes: ["sucre", "lacto", "sel", "sechage"] },
  olivier: { frais: "Les olives crues sont immangeables", methodes: ["sel", "lacto"] },
  cognassier: { frais: "Au fruitier, à l'écart (odeur forte)", methodes: ["sucre", "cave"], cave: "1 à 2 mois au fruitier" },
  amandier: { frais: "Amandes vertes 1 semaine", methodes: ["sechage"], cave: "Sèches 1 an" },
  chataignier: { frais: "1 semaine (elles se dessèchent ou moisissent)", methodes: ["congelation", "sechage", "sucre", "sterilisation"] },
  // Fleurs comestibles et plantes sauvages
  capucine: { frais: "Fleurs 1 jour au réfrigérateur", methodes: ["vinaigre", "sel"], texte: "Les fleurs et feuilles se mangent le jour même. Les boutons et graines vertes se confisent au vinaigre comme des câpres (« câpres de capucine »)." },
  souci: { frais: "Pétales 1 jour", methodes: ["sechage", "huile"], texte: "Pétales séchés à l'ombre pour colorer riz, soupes et tisanes ; macérat huileux de fleurs sèches pour la peau." },
  bourrache: { frais: "Fleurs 1 jour", methodes: ["congelation"], texte: "Fleurs à cueillir le jour même ; congelées dans des glaçons pour décorer les boissons. Feuilles à consommer avec modération (alcaloïdes)." },
  violette: { frais: "Fleurs 1 jour", methodes: ["sucre", "sechage"], texte: "Fleurs cristallisées (badigeonnées de blanc d'œuf puis de sucre, séchées), sirop de violette, ou séchées pour les tisanes." },
  pensee: { frais: "Fleurs 1 jour", methodes: ["sucre", "sechage"], texte: "Fleurs cristallisées ou pressées pour décorer gâteaux et salades." },
  lavande: { frais: "Épis 1 semaine", methodes: ["sechage", "sucre"], texte: "Épis cueillis juste avant l'ouverture, séchés tête en bas à l'ombre ; sucre ou sirop de lavande (avec modération : goût puissant)." },
  coquelicot: { frais: "Pétales 1 jour", methodes: ["sucre", "sechage"], texte: "Pétales en sirop ou en gelée ; jeunes feuilles cuites avant floraison. Graines de coquelicot sèches en pâtisserie." },
  ortie: { frais: "1 jour au réfrigérateur", methodes: ["sechage", "congelation"], texte: "Jeunes pousses séchées pour les tisanes et soupes, ou blanchies et congelées (cuites, elles ne piquent plus). Cueillez loin des routes et des champs traités." },
  pissenlit: { frais: "2 jours au réfrigérateur", methodes: ["sucre", "sechage", "lacto"], texte: "Jeunes feuilles en salade le jour même ; fleurs en « cramaillotte » (gelée de fleurs) ; racines séchées et torréfiées en succédané de café ; boutons au vinaigre." },
  ronce: { frais: "Mûres 1 jour", methodes: ["sucre", "congelation", "jus"], texte: "Mûres en confiture, gelée, sirop ou congelées ; jeunes feuilles séchées en tisane. Cueillez au-dessus de 1 m du sol, loin des chemins fréquentés par les chiens." },
  mauve: { frais: "1 jour", methodes: ["sechage"], texte: "Fleurs et feuilles séchées à l'ombre pour les tisanes." },
  plantain: { frais: "1 jour", methodes: ["sechage", "huile"], texte: "Feuilles séchées pour tisanes et macérat huileux (soin des piqûres)." },
};

/** Rendement de transformation : ce que donne 1 kg de produit frais. */
export const RENDEMENTS: { id: string; nom: string; planteId: string; par: string; facteur: number; unite: string; note: string }[] = [
  { id: "coulis", nom: "Coulis de tomates", planteId: "tomate", par: "kg de tomates", facteur: 0.6, unite: "L", note: "+ 2 cuillères à soupe de jus de citron par litre" },
  { id: "tomates-entieres", nom: "Tomates entières en bocaux", planteId: "tomate", par: "kg de tomates", facteur: 0.75, unite: "L", note: "pelées, tassées dans leur jus" },
  { id: "tomates-sechees", nom: "Tomates séchées", planteId: "tomate", par: "kg de tomates", facteur: 0.08, unite: "kg", note: "1 kg donne environ 80 g" },
  { id: "confiture", nom: "Confiture (800 g de sucre/kg)", planteId: "fraisier", par: "kg de fruits", facteur: 1.5, unite: "kg", note: "≈ 4 pots de 370 g ; prévoir 0,8 kg de sucre par kg" },
  { id: "compote", nom: "Compote", planteId: "pommier", par: "kg de pommes", facteur: 0.8, unite: "L", note: "pelées et épépinées" },
  { id: "jus-pomme", nom: "Jus de pomme", planteId: "pommier", par: "kg de pommes", facteur: 0.65, unite: "L", note: "au pressoir" },
  { id: "pommes-sechees", nom: "Pommes séchées", planteId: "pommier", par: "kg de pommes", facteur: 0.15, unite: "kg", note: "en rondelles" },
  { id: "haricots-bocaux", nom: "Haricots verts en bocaux", planteId: "haricot", par: "kg de haricots", facteur: 1.6, unite: "L", note: "≈ 600 g par bocal de 1 L" },
  { id: "haricots-congeles", nom: "Haricots verts congelés", planteId: "haricot", par: "kg de haricots", facteur: 2, unite: "sachets de 500 g", note: "après équeutage et blanchiment" },
  { id: "choucroute", nom: "Choucroute", planteId: "chou", par: "kg de chou", facteur: 0.8, unite: "L", note: "15 à 20 g de sel par kg" },
  { id: "cornichons", nom: "Cornichons au vinaigre", planteId: "concombre", par: "kg de cornichons", facteur: 1.5, unite: "L", note: "≈ 1 L de vinaigre par kg" },
  { id: "pesto", nom: "Pesto", planteId: "basilic", par: "kg de basilic", facteur: 2.5, unite: "L", note: "100 g de feuilles ≈ 250 ml ; à congeler" },
  { id: "pruneaux", nom: "Pruneaux", planteId: "prunier", par: "kg de prunes", facteur: 0.3, unite: "kg", note: "prunes d'ente de préférence" },
  { id: "sirop-sureau", nom: "Sirop de fleurs de sureau", planteId: "sureau", par: "20 ombelles", facteur: 1.5, unite: "L", note: "pour 1 L d'eau et 1,3 kg de sucre" },
];

/** Ce qu'on met en conserve, mois par mois (sous climat tempéré ; décalez selon votre région). */
export const CALENDRIER_CONSERVES: Record<number, string[]> = {
  1: ["Marmelades d'agrumes", "Inventaire du garde-manger, tri de la cave", "Commander joints et capsules"],
  2: ["Fin des confitures d'agrumes", "Vérifier les courges et les pommes chaque semaine"],
  3: ["Sel aux herbes avec les premières herbes", "Utiliser les derniers bocaux de l'an passé"],
  4: ["Sirop de violette, gelée de pissenlit (cramaillotte)", "Pesto d'ail des ours ou de fanes"],
  5: ["Rhubarbe : confitures, compotes, congélation", "Sirop de fleurs de sureau (fin mai-juin)", "Fraises : confitures"],
  6: ["Fraises, cerises : confitures, eau-de-vie, congélation", "Petits pois et fèves : congélation", "Vin de noix (noix vertes vers le 24 juin)"],
  7: ["Framboises, groseilles, cassis : gelées, sirops, liqueurs", "Haricots verts : congélation, bocaux, lacto", "Cornichons au vinaigre", "Abricots : confitures, fruits au sirop, séchage"],
  8: ["Tomates : coulis, tomates entières, séchage", "Pêches, prunes, mirabelles : confitures, sirop, séchage", "Courgettes : chutneys, pickles, congélation", "Poivrons et aubergines : congélation, lacto, grillés"],
  9: ["Dernières tomates : chutney de tomates vertes", "Mûres, figues, raisin : confitures, séchage, jus", "Oignons, ail, échalotes : tresser et stocker", "Pressage des premières pommes"],
  10: ["Pommes et poires : jus, cidre, compotes, séchage", "Coings : gelée, pâte de coing", "Courges : rentrer et stocker", "Châtaignes : congélation, crème de marrons", "Choux : choucroute"],
  11: ["Racines en silo ou en caisse de sable", "Noix : séchage", "Mise en jauge des poireaux", "Pommes de terre : tri"],
  12: ["Confitures de Noël (pommes, coings congelés, agrumes)", "Tournée hebdomadaire de la cave"],
};

/** Barème indicatif : temps comptés à partir de l'ébullition (ou de la température indiquée), au niveau de la mer. */
export const TEMPS_TRAITEMENT: { produit: string; famille: "blanchiment" | "pasteurisation" | "sterilisation" | "autoclave"; t05?: string; t1?: string; temp: string; acide: boolean; note?: string }[] = [
  { produit: "Petits pois, épinards, blettes", famille: "blanchiment", t1: "2 min", temp: "100 °C", acide: false, note: "puis bain glacé, avant congélation" },
  { produit: "Haricots verts, brocoli, chou-fleur, asperges", famille: "blanchiment", t1: "3 min", temp: "100 °C", acide: false },
  { produit: "Carottes en rondelles, fèves", famille: "blanchiment", t1: "2 à 3 min", temp: "100 °C", acide: false },
  { produit: "Choux de Bruxelles", famille: "blanchiment", t1: "4 min", temp: "100 °C", acide: false },
  { produit: "Maïs en épis", famille: "blanchiment", t1: "7 à 10 min", temp: "100 °C", acide: false },
  { produit: "Jus de fruits, sirops", famille: "pasteurisation", t05: "20 min", t1: "20 à 30 min", temp: "75-85 °C", acide: true, note: "bouteilles remplies chaudes" },
  { produit: "Pickles au vinaigre, chutneys", famille: "pasteurisation", t05: "10 min", t1: "15 min", temp: "eau frémissante", acide: true },
  { produit: "Confitures allégées (< 50 % de sucre)", famille: "pasteurisation", t05: "10 min", t1: "15 min", temp: "100 °C", acide: true },
  { produit: "Compotes", famille: "sterilisation", t05: "20 min", t1: "25 min", temp: "100 °C", acide: true },
  { produit: "Fruits au sirop (cerises, abricots, prunes, pêches, poires)", famille: "sterilisation", t05: "20 min", t1: "30 min", temp: "100 °C", acide: true },
  { produit: "Coulis de tomates acidifié (citron)", famille: "sterilisation", t05: "35 min", t1: "40 min", temp: "100 °C", acide: true, note: "2 c. à soupe de jus de citron par litre" },
  { produit: "Tomates entières acidifiées", famille: "sterilisation", t05: "1 h 10", t1: "1 h 25", temp: "100 °C", acide: true, note: "2 c. à soupe de jus de citron par litre" },
  { produit: "Haricots verts, petits pois, carottes, betteraves", famille: "sterilisation", t05: "1 h 30", t1: "2 h", temp: "100 °C", acide: false, note: "tradition française ; au frais, réchauffer 10 min à ébullition. Autoclave recommandé" },
  { produit: "Légumes peu acides (référence sous pression)", famille: "autoclave", t05: "20 à 40 min", t1: "25 à 50 min", temp: "115-121 °C", acide: false, note: "suivre exactement la notice de l'appareil" },
  { produit: "Plats cuisinés, soupes, ratatouille", famille: "autoclave", t05: "selon notice", t1: "selon notice", temp: "115-121 °C", acide: false, note: "sans autoclave : congeler" },
  { produit: "Champignons", famille: "autoclave", t05: "selon notice", t1: "selon notice", temp: "115-121 °C", acide: false, note: "sinon séchage ou congélation" },
];

/** Majoration en altitude pour les produits acides traités à l'eau bouillante. */
export function majorationAltitude(m: number): number | null {
  if (m < 300) return 0;
  if (m <= 900) return 5;
  if (m <= 1800) return 10;
  return null; // au-delà : stérilisation sous pression conseillée
}
