import type { Guide } from "./types";

// Tutoriels balcon complémentaires (audit « particulier avec balcon »)
export const GUIDES_BALCON: Guide[] = [
  {
    id: "balcon-voisinage", titre: "Balcon : poids, eau qui coule, copropriété et voisins", rubrique: "balcon", emoji: "🏢", niveau: 1, duree: "30 minutes de vérifications",
    resume: "Ce qu'il faut vérifier avant d'installer bacs, jardinières et récupérateur sur un balcon : charge admise, fixations, écoulements chez le voisin du dessous, règlement de copropriété.",
    alias: ["poids balcon", "charge balcon", "copropriete balcon", "eau qui coule balcon", "voisin du dessous", "jardiniere exterieure garde corps", "fixer jardiniere"],
    materiel: ["Règlement de copropriété ou bail", "Soucoupes à rebord haut, bacs à réserve d'eau", "Supports de jardinière adaptés au garde-corps"],
    etapes: [
      { titre: "Le poids : la vraie limite", texte: "Un terreau humide pèse 1 à 1,2 kg par litre : un bac de 100 L dépasse 120 kg, un carré potager de 1 m² sur 30 cm atteint 300 à 400 kg. Un balcon d'immeuble ancien est souvent prévu pour 250 à 350 kg/m² (moins pour un balcon en encorbellement fin), personnes comprises. Placez les charges lourdes contre le mur porteur et près des angles, jamais au milieu ou en bout de dalle.", attention: "En cas de doute (fissures, balcon ancien), demandez au syndic la charge admissible avant d'installer de gros bacs. Allégez avec des billes d'argile au fond, du terreau léger et des pots en plastique ou en géotextile." },
      { titre: "Les jardinières suspendues", texte: "Accrochez-les côté intérieur du garde-corps : à l'extérieur, une chute peut blesser un passant et engage votre responsabilité. Utilisez des supports vissés ou à serrage prévus pour l'épaisseur de votre rambarde ; vérifiez-les chaque printemps et avant un coup de vent." },
      { titre: "L'eau qui coule chez le voisin", texte: "Arrosez lentement, avec des soucoupes à rebord haut sous chaque pot et des bacs à réserve d'eau. Évitez d'arroser quand le linge du voisin sèche ; jamais de jet d'eau pour nettoyer le sol si l'écoulement tombe chez les autres. Gardez libre l'évacuation d'eau de pluie du balcon (feuilles, terreau)." },
      { titre: "Le règlement de copropriété", texte: "Il peut interdire les jardinières à l'extérieur, les canisses, les plantes grimpantes sur la façade, les barbecues ou les récupérateurs d'eau, et imposer une harmonie de façade. Lisez-le avant d'acheter ; en location, le bail peut aussi prévoir des règles." },
      { titre: "Vent et étages élevés", texte: "Au-delà du 4e étage, le vent dessèche et casse : choisissez des plantes basses et souples (graminées, aromatiques méditerranéennes, lierre), lestez les pots, attachez les tuteurs, rentrez parasols et voiles d'hivernage lors des tempêtes." },
    ],
    conseils: ["Une assurance habitation couvre en principe les dégâts des eaux chez le voisin, mais mieux vaut ne pas en arriver là.", "Un plancher en caillebotis sur une étanchéité ancienne retient l'eau : soulevez-le chaque année pour nettoyer."],
    video: "balcon poids jardinière copropriété conseils", liens: ["potager-balcon", "arrosage-auto-balcon", "voisinage-regles"],
  },
  {
    id: "pigeons-balcon", titre: "Pigeons au balcon : les éloigner sans les blesser", rubrique: "balcon", emoji: "🕊️", niveau: 1, duree: "1 heure",
    resume: "Pigeons qui nichent dans les jardinières, picorent les semis et salissent : ce qui marche (filets, fils, pas de nourriture) et ce qui est interdit.",
    alias: ["pigeons", "pigeon balcon", "eloigner pigeons", "pigeons semis", "fientes pigeons", "pigeon niche"],
    materiel: ["Filet anti-oiseaux à mailles fines (ou voile anti-insectes) pour les semis", "Pics ou fils tendus pour les rebords", "Brosse, gants, masque pour nettoyer les fientes"],
    etapes: [
      { titre: "Ne rien laisser à manger", texte: "Pas de pain, de graines pour oiseaux sur le balcon, de croquettes d'animaux dehors. Nourrir les pigeons est d'ailleurs interdit par le règlement sanitaire de la plupart des communes. Ramassez les graines tombées des mangeoires." },
      { titre: "Protéger semis et jeunes plants", texte: "Les pigeons arrachent les semis de pois, de salades, de choux. Posez un voile ou un filet tendu sur arceaux jusqu'à ce que les plants soient bien installés (3 à 4 semaines)." },
      { titre: "Empêcher l'installation", texte: "Ils nichent dans les jardinières vides, les coins abrités et derrière les bacs. Garnissez les jardinières vides de bâtons verticaux plantés serré, tendez un fil fin à 5 cm au-dessus des rebords, posez des pics sur les corniches où ils se posent. Retirez tout début de nid avant la ponte.", attention: "Une fois les œufs pondus, laissez le nid jusqu'à l'envol : détruire nids avec œufs ou oisillons est encadré, et les pigeons ramiers (gros, collier blanc) sont des oiseaux sauvages." },
      { titre: "Nettoyer les fientes", texte: "Les fientes sèches peuvent transmettre des maladies (ornithose, cryptococcose) : humidifiez-les avant de brosser, portez gants et masque, ne les compostez pas pour le potager." },
    ],
    erreurs: ["Les CD, hiboux en plastique et ballons effaroucheurs ne marchent que quelques jours.", "Les gels collants et produits répulsifs blessent les oiseaux et sont souvent interdits."],
    video: "éloigner pigeons balcon filet sans les blesser", liens: ["potager-balcon", "balcon-voisinage"],
  },
  {
    id: "arrosage-auto-balcon", titre: "Arrosage automatique sur un balcon (avec ou sans robinet)", rubrique: "arrosage", emoji: "💧", niveau: 2, duree: "2 heures d'installation",
    resume: "Goutte-à-goutte sur programmateur, pompe solaire sur réserve d'eau, bacs à réserve : arroser balcon et terrasse sans y penser, même en vacances.",
    alias: ["arrosage automatique", "goutte a goutte balcon", "programmateur arrosage", "arrosage sans robinet", "pompe solaire arrosage", "kit arrosage balcon"],
    materiel: ["Avec robinet : programmateur à pile, réducteur de pression, tuyau 13 mm, micro-tubes 4 mm, goutteurs réglables", "Sans robinet : kit pompe solaire ou à USB + réservoir de 20 à 60 L", "Bacs ou jardinières à réserve d'eau"],
    etapes: [
      { titre: "Choisir selon le balcon", texte: "Avec un robinet extérieur : programmateur à pile + goutte-à-goutte, le plus fiable. Sans robinet : petite pompe solaire ou sur batterie qui puise dans un réservoir (pratique jusqu'à 10-15 pots). Pour quelques pots seulement : bacs à réserve d'eau, cônes et oyas suffisent." },
      { titre: "Installer le goutte-à-goutte", texte: "Tuyau principal le long du balcon, un micro-tube et un goutteur par pot (2 pour un grand bac). Réglez le débit : environ 1 L par jour pour une jardinière de 60 cm en été, 2 à 3 L pour un pot de tomate de 30 L.", astuce: "Un réducteur de pression évite que les raccords sautent : sur un balcon, une fuite coule chez le voisin." },
      { titre: "Programmer", texte: "Arrosez tôt le matin (6 h), une ou deux fois par jour selon la chaleur. Faites un test d'une semaine avant de partir : contrôlez chaque jour que l'eau ne déborde pas des soucoupes et que la terre reste humide sans être détrempée." },
      { titre: "Avant les vacances", texte: "Groupez les pots à l'ombre légère, paillez, remplissez la réserve, changez la pile du programmateur, et confiez la clé à un voisin pour une vérification si vous partez plus de 10 jours." },
      { titre: "L'hiver", texte: "Videz tuyaux, pompe et programmateur avant les gelées et rangez-les à l'abri : l'eau qui gèle fait éclater les raccords." },
    ],
    video: "arrosage automatique balcon goutte à goutte programmateur pompe solaire", liens: ["arrosage-vacances", "oyas", "potager-balcon", "balcon-voisinage"],
  },
  {
    id: "hivernage-pots", titre: "Hiverner les plantes en pot (balcon, terrasse)", rubrique: "balcon", emoji: "❄️", niveau: 1, duree: "1 à 2 heures à l'automne",
    resume: "Les racines en pot gèlent bien plus vite qu'en pleine terre : quelles plantes rentrer, lesquelles protéger dehors, et comment éviter que les pots éclatent.",
    alias: ["hiverner", "hivernage", "proteger du gel pots", "rentrer les plantes", "plantes en pot hiver", "voile hivernage", "geranium hiver", "agrumes hiver", "olivier en pot hiver", "lavande en pot", "hortensia en pot"],
    materiel: ["Voile d'hivernage (P30), papier bulle ou toile de jute", "Cales ou pieds de pot", "Pièce lumineuse et fraîche (5 à 12 °C) pour les plantes à rentrer"],
    etapes: [
      { titre: "Les plantes à rentrer avant les gelées", texte: "Agrumes, géraniums (pélargoniums), bougainvillée, laurier-rose jeune, dipladénia, plantes d'intérieur sorties l'été, aromatiques fragiles (basilic, citronnelle, verveine citronnelle). Rentrez-les quand les nuits passent sous 5 °C, après avoir vérifié l'absence de cochenilles et de limaces sous le pot. Idéal : pièce lumineuse et fraîche (véranda, cage d'escalier claire), arrosage réduit." },
      { titre: "Les plantes qui restent dehors", texte: "Lavande, thym, romarin, sauge, olivier adulte, hortensia, rosiers, petits fruitiers, graminées, bulbes : elles supportent le froid, mais leurs racines en pot sont exposées. Regroupez les pots contre le mur abrité de la pluie, surélevez-les sur des cales (l'eau ne doit pas stagner dessous), entourez le pot de papier bulle ou de jute.", astuce: "Un pot de moins de 30 cm de diamètre gèle à cœur dès -5 °C : rapprochez-le du mur ou mettez-le dans un pot plus grand rempli de paille." },
      { titre: "Voiler les feuillages persistants", texte: "Par gel annoncé sous -5 °C, enveloppez olivier, laurier, agrumes restés dehors d'un voile d'hivernage (jamais de plastique, qui fait de la condensation). Retirez-le dès le redoux." },
      { titre: "Arroser l'hiver", texte: "Les persistants en pot meurent souvent de soif l'hiver, surtout à l'abri de la pluie : arrosez légèrement hors gel, une à deux fois par mois. Les caducs (hortensia, rosier) ont besoin de très peu d'eau." },
      { titre: "Les pots eux-mêmes", texte: "Les pots en terre cuite non « ingélive » éclatent au gel : rentrez-les vides ou choisissez des pots résistants au gel. Videz soucoupes et réservoirs." },
    ],
    video: "hiverner plantes en pot balcon protéger du gel", liens: ["gel-grele", "potager-balcon", "agrumes"],
  },
];

// Mots tapés par les débutants pour les tutoriels existants
export const ALIAS_GUIDES: Record<string, string[]> = {
  haie: ["haie", "planter une haie", "tailler la haie", "haie champetre", "haie brise vent", "arbustes haie"],
  pelouse: ["pelouse jaune", "gazon jaune", "gazon", "pelouse seche", "mousse dans la pelouse", "tondre", "regarnir pelouse"],
  poulailler: ["construire poulailler", "poulailler", "combien de poules", "poules en ville"],
  "abattage-volaille": ["tuer un poulet", "tuer une poule", "tuer un canard", "saigner volaille", "plumer", "vider un poulet", "fiel", "retirer le fiel", "abattre"],
  "preparer-lapin": ["tuer un lapin", "depouiller lapin"],
  oeufs: ["oeufs", "conserver les oeufs", "oeufs frais", "test de fraicheur", "laver les oeufs"],
  "cultiver-pour-animaux": ["nourrir poules", "nourrir les poules", "que donner aux poules", "nourrir lapins", "restes pour les poules", "nourrir chevres"],
  "plantes-interieur-bases": ["engrais plantes vertes", "engrais plante interieur", "entretenir plante verte", "plante qui meurt", "plante interieur meurt"],
  "plantes-toxiques": ["plante pour chat", "plantes pour chats", "plante sans danger chat", "chat mange plante", "chien mange plante", "plante toxique chat"],
  "eau-arrosage-interieur": ["eau du robinet plantes", "eau calcaire", "arroser plante interieur"],
  "potager-balcon": ["potager balcon", "legumes balcon", "tomates en pot", "balcon plein sud", "balcon nord", "balcon ombre"],
  "integrer-animaux": ["nouvelles poules", "quarantaine", "presenter les poules"],
  "voisinage-regles": ["declaration poules", "declaration mairie", "coq bruit", "voisin coq", "bruler dechets verts", "distance plantation voisin", "arbre du voisin"],
  "fumiers-securite": ["fumier dangereux", "aminopyralide", "fumier cheval herbicide"],
  "compost-tas": ["compost", "composter", "composteur", "compost qui sent mauvais", "compost en tas"],
  "taille-fruitiers": ["tailler pommier", "tailler poirier", "taille des arbres", "quand tailler"],
  "arrosage-bien-arroser": ["combien arroser", "quand arroser", "arroser le soir", "arroser le matin"],
  "semis-interieur": ["semis qui filent", "semis etioles", "fonte des semis", "semer en godet"],
  "desherbage": ["mauvaises herbes", "desherber", "chiendent", "liseron"],
  "nuisibles-predateurs": ["renard", "fouine", "rats", "sanglier", "chevreuil", "taupe"],
  "couvaison": ["couveuse", "faire couver", "poussins", "incubation"],
  "lumiere-led": ["lampe horticole", "lampe plante", "manque de lumiere", "appartement sombre"],
  "vacances-plantes-interieur": ["vacances plantes", "partir en vacances", "arroser pendant absence"],
};
