// Comment cueillir : un geste par type de récolte, illustré, avec les plantes concernées
export interface GesteRecolte {
  id: string; // = id de l'illustration
  titre: string; emoji: string; quand: string;
  comment: string[]; erreurs: string[]; plantes: string[]; video: string;
}

export const GESTES_RECOLTE: GesteRecolte[] = [
  { id: "cueillir-tomates", titre: "Fruits-légumes : tomates, poivrons, aubergines, concombres, courgettes", emoji: "🍅",
    quand: "Le matin quand il fait frais, ou en fin de journée. Tous les 2 à 3 jours en pleine saison : plus on cueille, plus la plante produit.",
    comment: ["Tomate : à pleine couleur, légèrement souple ; soulevez le fruit et pliez le pédoncule à l'articulation (le petit coude), il casse net.", "Poivron, piment, aubergine, concombre, courgette : coupez la queue au sécateur ou au couteau, sans tirer (les branches cassent).", "Courgette : à 15-20 cm ; concombre : avant que la peau jaunisse ; aubergine : peau encore brillante.", "Melon : quand le pédoncule se craquelle en cercle et que le fruit sent bon ; il se détache presque seul."],
    erreurs: ["Tirer sur le fruit et arracher la branche.", "Laisser grossir les courgettes en « massues » : la plante s'arrête de produire.", "Mettre les tomates au réfrigérateur (perte de goût)."],
    plantes: ["tomate", "poivron", "aubergine", "concombre", "courgette", "melon", "pasteque"], video: "comment récolter tomates courgettes bon moment" },
  { id: "cueillir-haricots", titre: "Gousses : haricots, pois, fèves", emoji: "🌱",
    quand: "Haricots verts : tous les 2 jours, gousses fines sans grain visible. Pois et fèves : grains formés mais encore tendres.",
    comment: ["Tenez la tige d'une main, pincez la gousse de l'autre au ras de la queue : la plante reste intacte.", "Pois et haricots à écosser pour le sec : laissez sécher sur pied, récoltez les gousses parcheminées par temps sec."],
    erreurs: ["Arracher d'une seule main (on déracine les haricots nains).", "Cueillir sur feuillage mouillé : on transporte les maladies."],
    plantes: ["haricot", "pois", "feve"], video: "comment cueillir haricots verts sans abîmer" },
  { id: "cueillir-salade", titre: "Feuilles : salades, épinards, blettes, choux kale, roquette", emoji: "🥬",
    quand: "Le matin, feuilles fraîches et gorgées d'eau. Salade pommée : quand le cœur est ferme, avant la montée en graines.",
    comment: ["Récolte « à la feuille » : cueillez les grandes feuilles extérieures et laissez le cœur ; la plante repousse pendant des semaines.", "Salade à couper : coupez à 3 cm au-dessus du collet, elle repart 2 à 3 fois.", "Salade pommée : coupez au couteau sous la pomme ; laissez le trognon, il fait parfois de petites repousses.", "Choux pommés : coupez sous la pomme ; les choux de Bruxelles se récoltent de bas en haut, après les premières gelées."],
    erreurs: ["Couper le cœur des plantes à cueillir feuille à feuille.", "Récolter en plein soleil : les feuilles flétrissent en minutes."],
    plantes: ["laitue", "mache", "epinard", "blette", "roquette", "chou", "chou-kale", "chou-fleur", "chicoree", "oseille", "cresson", "fenouil", "celeri", "artichaut", "asperge", "rhubarbe"], video: "récolter salade feuille à feuille couper repousse" },
  { id: "arracher-racines", titre: "Racines : carottes, radis, betteraves, panais, navets, poireaux", emoji: "🥕",
    quand: "Selon la taille voulue ; terre légèrement humide (la veille d'un arrosage ou après une pluie).",
    comment: ["Enfoncez une fourche-bêche à 10 cm du rang, faites levier pour soulever la terre, puis tirez par le feuillage.", "Poireaux et panais : décollez toujours à la fourche, ils cassent si on tire.", "Coupez les fanes à 1 cm pour la conservation (sinon elles pompent l'eau de la racine).", "Panais, poireaux, topinambours peuvent rester en terre l'hiver et se récoltent au fur et à mesure."],
    erreurs: ["Tirer à sec : la racine casse et l'extrémité pourrit en terre.", "Laver avant de conserver : brossez seulement la terre sèche."],
    plantes: ["carotte", "radis", "betterave", "panais", "navet", "poireau", "celeri", "topinambour"], video: "récolter carottes poireaux fourche bêche" },
  { id: "recolter-pommes-de-terre", titre: "Tubercules et bulbes : pommes de terre, ail, oignons, échalotes", emoji: "🥔",
    quand: "Pommes de terre : 2 semaines après le jaunissement des fanes (primeurs : dès la floraison). Ail et oignons : quand les feuilles sont aux deux tiers jaunes et couchées.",
    comment: ["Piquez la fourche à 30 cm du pied, soulevez toute la touffe, puis fouillez à la main.", "Laissez ressuyer 2 à 3 heures au sol par temps sec (pas plus : le soleil verdit les pommes de terre).", "Ail, oignons, échalotes : arrachez par temps sec, laissez sécher 1 à 2 semaines à l'ombre aérée avant de tresser ou de stocker."],
    erreurs: ["Enfoncer la fourche près du pied : on embroche les tubercules.", "Garder les pommes de terre vertes (solanine toxique) ou blessées avec celles qui sont saines."],
    plantes: ["pomme-de-terre", "patate-douce", "ail", "oignon", "echalote"], video: "récolter pommes de terre ail oignons séchage" },
  { id: "recolter-courges", titre: "Courges, potirons, maïs", emoji: "🎃",
    quand: "Courges : quand le pédoncule est sec et liégeux, la peau dure (l'ongle ne la marque plus), avant les gelées. Maïs doux : barbes brunes et sèches, grain laiteux.",
    comment: ["Coupez la courge au sécateur en gardant 5 à 10 cm de pédoncule : c'est sa porte d'entrée pour la pourriture.", "Laissez « cuire » 10 jours au soleil ou au chaud pour durcir la peau, puis stockez au sec entre 12 et 15 °C.", "Maïs : tirez l'épi vers le bas en le tournant ; à manger dans les heures qui suivent (le sucre se transforme vite en amidon)."],
    erreurs: ["Porter la courge par la queue : elle casse.", "Laisser les courges sous la gelée."],
    plantes: ["courge", "mais"], video: "récolter courges potirons conservation bon moment" },
  { id: "cueillir-fruits-arbre", titre: "Fruits des arbres : pommes, poires, prunes, cerises, figues", emoji: "🍎",
    quand: "Pomme : soulevez-la à l'horizontale et tournez d'un quart de tour ; si elle se détache seule, elle est mûre. Poire : cueillez un peu avant maturité, elle finit de mûrir au fruitier.",
    comment: ["Prenez le fruit dans le creux de la main, soulevez et tournez : le pédoncule reste attaché au fruit et la lambourde (bourgeon des fruits de l'an prochain) est préservée.", "Cerises : cueillez avec la queue pour qu'elles se conservent.", "Fruits à conserver : posez-les dans le panier sans les jeter, ils se meurtrissent au moindre choc.", "Utilisez une échelle stable ou un cueille-fruits à perche plutôt que de grimper dans l'arbre."],
    erreurs: ["Tirer sur le fruit et arracher le rameau qui porte les fruits suivants.", "Secouer l'arbre (sauf noix, châtaignes et olives pour l'huile)."],
    plantes: ["pommier", "poirier", "cerisier", "prunier", "pecher", "figuier", "cognassier", "agrumes", "kiwi", "olivier", "noyer", "amandier", "chataignier", "vigne"], video: "comment cueillir pommes poires sans abîmer l'arbre" },
  { id: "cueillir-petits-fruits", titre: "Petits fruits : fraises, framboises, groseilles, myrtilles, mûres", emoji: "🍓",
    quand: "Tous les 1 à 2 jours, le matin une fois la rosée séchée ; fruits bien colorés.",
    comment: ["Fraises : pincez la queue entre l'ongle et le pouce, ne tirez pas sur le fruit.", "Framboises et mûres : elles se détachent seules de leur cœur quand elles sont mûres.", "Groseilles et cassis : coupez la grappe entière (ciseaux), égrappez à la fourchette.", "Cueillez directement dans des petites barquettes : les fruits s'écrasent sous leur propre poids."],
    erreurs: ["Laver avant de stocker (moisissure en un jour) : lavez juste avant de manger.", "Laisser les fruits trop mûrs au sol (pourriture grise, guêpes, drosophiles)."],
    plantes: ["fraisier", "framboisier", "groseillier", "myrtillier", "murier", "groseille-maquereau", "sureau", "ronce"], video: "cueillir framboises groseilles fraises astuces" },
  { id: "couper-aromatiques", titre: "Aromatiques : basilic, persil, ciboulette, menthe, thym…", emoji: "🌿",
    quand: "Le matin après la rosée ; juste avant la floraison pour le séchage (arôme maximal).",
    comment: ["Basilic, menthe, mélisse, origan : coupez au-dessus d'une paire de feuilles, la plante se ramifie et repousse en double.", "Persil, coriandre, cerfeuil : coupez les tiges extérieures à la base, gardez le cœur.", "Ciboulette : coupez une touffe à 3 cm du sol aux ciseaux.", "Thym, romarin, sauge, sarriette : coupez seulement les pointes vertes, jamais dans le vieux bois.", "Laurier : prélevez les feuilles toute l'année."],
    erreurs: ["Arracher les feuilles une par une en laissant des tiges nues.", "Prélever plus d'un tiers de la plante à la fois."],
    plantes: ["basilic", "persil", "ciboulette", "coriandre", "thym", "romarin", "menthe", "sauge", "origan", "aneth", "estragon", "laurier", "cerfeuil", "sarriette", "melisse", "verveine", "lavande", "ortie", "consoude", "pissenlit", "plantain", "mouron"], video: "comment couper basilic aromatiques pour qu'ils repoussent" },
  { id: "couper-fleurs", titre: "Fleurs : bouquets et fleurs comestibles", emoji: "💐",
    quand: "Tôt le matin ou le soir, jamais en pleine chaleur. Fleurs à bouquet : boutons juste entrouverts (ou à demi ouverts pour zinnia, dahlia qui ne s'ouvrent plus une fois coupés). Fleurs à manger : fraîchement épanouies.",
    comment: ["Coupez au sécateur propre, en biais, en gardant une tige longue, juste au-dessus d'une paire de feuilles ou d'un bourgeon : la plante refait des fleurs.", "Plongez aussitôt les tiges dans un seau d'eau fraîche emporté au jardin.", "Retirez toutes les feuilles qui trempent dans l'eau du vase.", "Fleurs comestibles (capucine, bourrache, souci, pensée, violette) : cueillez juste avant le repas, retirez le pistil et les parties vertes amères, secouez pour chasser les insectes.", "Plus on coupe zinnias, cosmos, pois de senteur et dahlias, plus ils refleurissent."],
    erreurs: ["Couper en pleine chaleur : les fleurs flétrissent.", "Manger une fleur non identifiée avec certitude ou traitée (fleuriste, jardinerie)."],
    plantes: ["capucine", "oeillet-inde", "souci", "bourrache", "tournesol", "cosmos", "zinnia", "pensee", "violette", "primevere", "petunia", "pois-senteur", "coquelicot", "nigelle", "muflier", "alysse", "echinacee", "rudbeckia", "pivoine", "iris", "lupin", "rose-tremiere", "marguerite", "aster", "phlox", "hemerocalle", "lys", "agapanthe", "clematite", "chevrefeuille", "jasmin", "glycine", "mauve", "begonia-tubereux", "rosier", "hortensia", "tulipe", "dahlia", "lilas", "geranium"], video: "couper fleurs pour bouquet bon moment tenue en vase" },
];

export const gesteDe = (planteId: string) => GESTES_RECOLTE.find((g) => g.plantes.includes(planteId));

// Conseils de récolte pour les fiches qui n'en avaient pas
export const RECOLTE_EN_PLUS: Record<string, string> = {
  chicoree: "Scaroles et frisées : coupez la rosette entière au ras du sol quand le cœur est blanchi ; endives : arrachez les racines en novembre pour le forçage au noir.",
  oseille: "Cueillez les feuilles extérieures jeunes (avant 15 cm), toute la saison ; coupez les hampes florales pour prolonger la récolte.",
  cresson: "Coupez les tiges à 5 cm au-dessus de l'eau ou du sol, avant la floraison ; il repousse en quelques semaines.",
  pissenlit: "Feuilles jeunes en mars-avril, avant la floraison (moins amères) ; boutons à poêler ; fleurs pour la « cramaillotte ». Pas au bord des routes ni dans les lieux traités ou fréquentés par les chiens.",
  ronce: "Mûres bien noires qui se détachent seules, d'août à septembre, à hauteur d'homme (les plus basses peuvent être souillées).",
  plantain: "Jeunes feuilles tendres en salade ou en soupe, au printemps.",
  mouron: "Mouron des oiseaux : cueillez les pointes tendres aux ciseaux, en salade (ne pas confondre avec le mouron rouge, toxique, à fleurs orange).",
  ortie: "Avec des gants : coupez les 4 à 6 feuilles du sommet des jeunes tiges, avant la floraison, pour la soupe ou le purin.",
  consoude: "Coupez les feuilles à 5 cm du sol 3 à 4 fois par an pour le purin, le paillage ou le compost (pas pour manger).",
  lavande: "Coupez les épis quand les premières fleurs s'ouvrent pour le séchage ; taillez ensuite la touffe en boule, sans entrer dans le vieux bois.",
};
