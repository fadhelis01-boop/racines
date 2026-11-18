import type { Guide } from "./types";

// Guides demandés par l'audit expert (jardinier, horticulteur, éleveur, apiculteur)
const g = (x: Omit<Guide, "niveau" | "duree"> & Partial<Pick<Guide, "niveau" | "duree">>): Guide => ({ niveau: 2, duree: "Lecture : 6 minutes", ...x });

export const GUIDES_EXPERT: Guide[] = [
  g({ id: "api-frelon", titre: "Le frelon asiatique : protéger ses ruches", rubrique: "animaux", emoji: "🐝",
    resume: "Reconnaître le frelon asiatique, protéger les ruches pendant l'été et l'automne, piéger sans tuer les autres insectes, et faire détruire les nids.",
    alias: ["frelon asiatique", "frelons asiatiques", "vespa velutina", "frelon devant la ruche", "frelons ruche", "piege a frelons", "pieger les frelons", "nid de frelons", "harpe electrique", "museliere ruche", "paralysie de butinage"],
    etapes: [
      { titre: "Le reconnaître", texte: "Plus petit et plus sombre que le frelon européen : thorax noir, une seule bande orange sur l'abdomen, bout des pattes jaune. Il fait du « vol stationnaire » devant la planche d'envol pour attraper les butineuses qui rentrent. Le frelon européen (roux et jaune, plus gros) est protégé dans plusieurs pays et chasse peu les abeilles : ne le confondez pas." },
      { titre: "Ce qu'il fait au rucher", texte: "De juillet à novembre, la pression des frelons empêche les butineuses de sortir : c'est la « paralysie de butinage ». La colonie ne rentre plus ni nectar ni pollen, consomme ses réserves et s'affaiblit avant l'hiver. Une colonie faible peut être envahie et vidée." },
      { titre: "Protéger les ruches", texte: "Réduisez les entrées (muselière grillagée ou réducteur à mailles de 5,5 mm qui laissent passer les abeilles et pas les frelons), gardez des colonies fortes (réunissez les faibles), nourrissez si la paralysie de butinage dure, posez les ruches surélevées à 40-50 cm. Les harpes électriques, posées devant les ruches, tuent les frelons en vol stationnaire sans toucher les abeilles." },
      { titre: "Piéger sans massacrer", texte: "Le piégeage au printemps (fondatrices) et les pièges à bière ou à sirop non sélectifs tuent surtout d'autres insectes, dont des pollinisateurs : leur efficacité est discutée. Si vous piégez, utilisez des pièges sélectifs (cônes et trous de sortie pour les petits insectes), à proximité immédiate des ruchers attaqués, et relevez-les souvent. Suivez les consignes de votre GDSA ou du réseau local de lutte." },
      { titre: "Signaler et faire détruire les nids", texte: "Les nids secondaires, souvent très haut dans les arbres, se repèrent à la chute des feuilles. Signalez-les à votre mairie ou à la plateforme de signalement de votre région : la destruction est faite par des professionnels, de préférence au crépuscule et avant la sortie des futures reines (avant novembre).", attention: "Ne vous approchez jamais d'un nid et ne tentez pas de le détruire vous-même : les attaques collectives sont dangereuses, surtout pour les personnes allergiques." },
    ],
    video: "frelon asiatique protéger ruches muselière harpe", liens: ["abeille", "api-securite", "api-reseau"] }),

  g({ id: "api-miellerie", titre: "La miellerie : hygiène de l'extraction et traçabilité du miel", rubrique: "animaux", emoji: "🍯",
    resume: "Une pièce propre pour extraire, du matériel alimentaire, des lots numérotés : les bonnes pratiques pour donner ou vendre son miel en toute sécurité.",
    alias: ["miellerie", "extraction du miel", "extracteur", "hygiene du miel", "vendre son miel", "lot de miel", "tracabilite miel", "maturateur inox", "pot de miel etiquette"],
    etapes: [
      { titre: "La pièce", texte: "Une pièce fermée aux abeilles et aux animaux, lavable (sol et murs), avec un point d'eau potable, une bonne lumière et une température de 25 à 30 °C (le miel coule mieux). Une cuisine propre convient pour un usage familial ; pour la vente, une pièce dédiée est fortement conseillée." },
      { titre: "Le matériel", texte: "Uniquement du matériel de contact alimentaire : inox ou plastique alimentaire (extracteur, maturateur, filtres, seaux). Pas de récipients galvanisés ni de cuivre. Tout est lavé à l'eau chaude et bien séché avant et après la récolte." },
      { titre: "Les gestes", texte: "Mains propres, tablier, cheveux attachés. Cadres de hausse seulement (jamais de cadres de corps avec du couvain ou des traitements). Désoperculez au-dessus d'un bac, extrayez, filtrez, laissez maturer 3 à 8 jours en maturateur fermé, écumez, mettez en pots propres et secs." },
      { titre: "Lots et traçabilité", texte: "Chaque récolte d'un rucher à une date forme un lot : notez le numéro de lot, la date, les ruches, le poids et l'humidité si vous la mesurez. Le numéro figure sur l'étiquette des pots. En cas de problème (fermentation, résidu), vous retrouvez tous les pots concernés." },
      { titre: "Pour vendre", texte: "Déclaration d'activité auprès des services vétérinaires (DDPP), respect du « paquet hygiène » européen, étiquetage complet (dénomination, poids, date de durabilité minimale, nom et adresse, pays d'origine, numéro de lot). Les produits de la ruche sont des denrées d'origine animale : renseignez-vous avant la première vente." },
    ],
    video: "miellerie hygiène extraction miel", liens: ["recolte-miel", "api-produits", "cs-donner-vendre"] }),

  g({ id: "porc-familial", titre: "Élever un ou deux porcs : biosécurité, soins et règles", rubrique: "animaux", emoji: "🐖", niveau: 3,
    resume: "Ce qu'exige vraiment un porc familial : clôtures contre les sangliers, formation, identification, soins, interdits, castration et abattage.",
    alias: ["porc", "porcs", "cochon", "cochons", "porc familial", "biosecurite porc", "peste porcine africaine", "ppa", "castration porcelet", "elever un cochon", "abattage cochon", "rouget du porc"],
    etapes: [
      { titre: "Se déclarer d'abord", texte: "Avant l'arrivée du premier porc, même de compagnie : déclaration auprès de l'établissement départemental de l'élevage (EDE) qui attribue un indicatif de marquage, tenue d'un registre d'élevage, identification des animaux (boucle ou tatouage) avant tout déplacement." },
      { titre: "La biosécurité", texte: "La peste porcine africaine circule chez les sangliers en Europe : c'est elle qui justifie les règles. Clôture solide qui empêche tout contact avec les sangliers (double clôture en plein air), aliment et paille stockés à l'abri, tenue et bottes réservées au parc, aucune visite inutile. Selon le type de détention, une formation biosécurité et un plan de biosécurité écrit sont exigés : renseignez-vous auprès de la DDPP ou du GDS de votre département.", attention: "Jamais de restes de cuisine, de viande ou de charcuterie : c'est interdit et c'est la principale voie d'entrée du virus." },
      { titre: "Les soins", texte: "Vermifuge après coproscopie (analyse des crottes) 1 à 2 fois par an ; vaccination contre le rouget conseillée par beaucoup de vétérinaires en plein air ; surveillance de la gale (démangeaisons, croûtes) ; bauge et ombre l'été (coups de chaleur) ; pieds et onglons vérifiés." },
      { titre: "Ce qui est interdit", texte: "La castration des porcelets mâles sans anesthésie ni antidouleur est interdite : elle se fait par un vétérinaire, ou on choisit des femelles ou des mâles abattus jeunes. La coupe systématique des queues et des dents est interdite. Les porcs vivent au moins à deux (animal social)." },
      { titre: "L'abattage", texte: "En abattoir, ou abattage familial à la ferme encadré : animal élevé par la famille, consommation exclusivement familiale, étourdissement obligatoire, respect de l'animal. Renseignez-vous auprès de la DDPP avant toute chose ; beaucoup d'éleveurs familiaux passent par un abattoir de proximité." },
    ],
    video: "élever un cochon plein air biosécurité clôture", liens: ["cochon", "registre-elevage", "abattage-volaille"] }),

  g({ id: "produire-ses-plants", titre: "Produire ses plants : terreau, pépinière, noyaux, marcottes et greffes", rubrique: "semis", emoji: "🌱", niveau: 3, duree: "Toute la saison",
    resume: "Le terreau de semis maison, une petite pépinière, semer des noyaux et pépins (stratification), marcotter, et greffer tomates et aubergines.",
    alias: ["produire ses plants", "terreau de semis", "terreau maison", "pepiniere", "stratification", "semer des noyaux", "semer un noyau", "semer des pepins", "marcottage", "marcotter", "greffer des tomates", "greffe tomate", "porte greffe tomate", "plants maison"],
    etapes: [
      { titre: "Le terreau de semis", texte: "Fin, léger et pauvre : un tiers de compost bien mûr tamisé, un tiers de sable ou de terre de jardin tamisée, un tiers de fibre de coco ou de terreau de feuilles. Pas d'engrais (il brûle les jeunes racines). Pour limiter la fonte des semis, ébouillantez-le ou passez-le 30 minutes au four à 80 °C." },
      { titre: "Une petite pépinière", texte: "Un coin abrité, mi-ombragé, près d'un point d'eau : on y élève en godets ou en pleine terre les jeunes arbustes, fraisiers, vivaces et boutures pendant 1 ou 2 ans avant de les planter. Paillez, arrosez régulièrement, étiquetez tout (nom, date, origine)." },
      { titre: "Semer noyaux et pépins (stratification)", texte: "Les graines d'arbres (noyaux de pêche, d'abricot, pépins de pomme, glands, châtaignes) doivent passer un hiver au froid humide pour germer. Mélangez-les à du sable humide dans un pot, laissez-les dehors ou 2 à 3 mois au réfrigérateur, puis semez au printemps. Un semis de pomme ou de poire ne reproduit pas la variété : il sert de porte-greffe ou donne une variété nouvelle." },
      { titre: "Marcotter", texte: "Courbez une branche basse jusqu'au sol, entaillez-la légèrement en dessous, enterrez cette partie sous 5 à 10 cm de terre en laissant dépasser le bout, maintenez-la avec un crochet. Quelques mois plus tard, elle a des racines : coupez-la de la plante mère. Parfait pour vigne, noisetier, cassissier, jasmin, figuier. Les fraisiers se marcottent tout seuls (stolons)." },
      { titre: "Greffer tomates et aubergines", texte: "Sur un porte-greffe vigoureux et résistant aux maladies du sol (vendu en graines), greffez au stade 2 à 3 vraies feuilles, en fente ou à l'anglaise avec une pince à greffe : les plants greffés résistent mieux aux sols fatigués (fusariose, verticilliose) et produisent plus longtemps. Gardez-les 5 à 7 jours à l'ombre et à l'humidité après la greffe." },
    ],
    video: "faire ses plants terreau de semis maison stratification", liens: ["semis-interieur", "graines-maison", "bouturage", "greffe"] }),

  g({ id: "potager-hiver", titre: "Le potager d'hiver : récolter de novembre à mars", rubrique: "semis", emoji: "❄️",
    resume: "Ce qu'on sème et plante en été pour l'hiver, comment protéger, et ce qui se récolte quand il gèle.",
    alias: ["potager d hiver", "potager en hiver", "legumes d hiver", "que recolter en hiver", "cultiver en hiver", "legumes resistants au froid", "hiver au potager"],
    etapes: [
      { titre: "Tout se prépare en été", texte: "Les légumes d'hiver se sèment ou se plantent de juin à septembre : poireaux d'hiver (plantés en juillet), choux de Milan, de Bruxelles et kale (plantés en juin-juillet), carottes et navets d'automne (semés en juillet), mâche et épinards (août-septembre), oignons blancs et ail (automne), fèves et pois d'hiver dans le Sud." },
      { titre: "Ce qui tient au froid", texte: "Poireau, chou kale, chou de Bruxelles, chou de Milan, mâche, panais, topinambour, salsifis, carotte et betterave sous un paillage épais, épinard, roquette, poirée, cresson de terre, oignon blanc, ail. La plupart supportent -5 à -10 °C, le kale et le poireau davantage." },
      { titre: "Protéger", texte: "Paillage épais (feuilles, paille) sur les racines laissées en terre, voile d'hivernage sur les salades et la mâche lors des fortes gelées, tunnel ou châssis pour avancer les semis de fin d'hiver. Récoltez les légumes-feuilles hors gel (à midi), jamais gelés." },
      { titre: "Sous abri", texte: "En serre froide ou tunnel : laitues d'hiver, mâche, épinards, radis, oignons blancs et mesclun poussent lentement tout l'hiver ; aérez par beau temps pour éviter la pourriture grise." },
    ],
    video: "potager d'hiver que planter en été pour récolter en hiver", liens: ["poireau", "chou-kale", "mache", "gel-grele", "conserver-recoltes"] }),

  g({ id: "arbo-eclaircissage-gel", titre: "Arboriculture : éclaircir les fruits et protéger les fleurs du gel", rubrique: "recolte", emoji: "🍐",
    resume: "Deux gestes d'arboriculteur qui changent la récolte : retirer une partie des jeunes fruits, et sauver la floraison d'une gelée de printemps.",
    alias: ["eclaircissage", "eclaircir les fruits", "eclaircir les pommes", "trop de fruits", "alternance", "gel des fleurs", "gelee de printemps", "proteger floraison gel", "gelee noire", "aspersion antigel"],
    etapes: [
      { titre: "Pourquoi éclaircir", texte: "Un arbre trop chargé donne de petits fruits, casse ses branches et ne fleurit presque pas l'année suivante (alternance). En retirant une partie des jeunes fruits, on obtient de plus beaux fruits et une récolte régulière chaque année." },
      { titre: "Comment éclaircir", texte: "Après la chute naturelle de juin, quand les fruits ont la taille d'une noisette : pommes et poires, gardez 1 à 2 fruits par bouquet (le plus beau, souvent celui du centre pour la pomme) ; pêches et abricots, un fruit tous les 10 à 15 cm de rameau ; raisin de table, retirez les grappes en excès et ciselez les grains serrés." },
      { titre: "Le danger du gel de printemps", texte: "Une fleur ouverte gèle vers -2 °C, un jeune fruit dès -1 °C. Les nuits claires et sans vent d'avril sont les plus dangereuses (gelée blanche), surtout en bas de pente où l'air froid s'accumule." },
      { titre: "Protéger une floraison", texte: "Petits arbres et espaliers : voile d'hivernage double posé le soir et retiré le matin. Arrosage du sol la veille (un sol humide restitue plus de chaleur). Variétés à floraison tardive dans les zones gélives. Les arboriculteurs utilisent l'aspersion d'eau toute la nuit : la glace formée protège la fleur à 0 °C, mais cela demande beaucoup d'eau et un arrosage continu." },
    ],
    video: "éclaircissage des fruits pommier", liens: ["pommier", "pecher", "taille-fruitiers", "gel-grele"] }),

  g({ id: "reproduction-selection", titre: "Reproduction et sélection : éviter la consanguinité", rubrique: "animaux", emoji: "🧬",
    resume: "Choisir ses reproducteurs, renouveler les mâles, tenir un petit livre généalogique : garder un troupeau ou une basse-cour en bonne santé sur des années.",
    alias: ["consanguinite", "consanguin", "reproducteurs", "choisir un reproducteur", "changer de coq", "changer de bouc", "selection animale", "genealogie", "livre genealogique", "croisement", "race pure"],
    etapes: [
      { titre: "Le risque de la consanguinité", texte: "Reproduire entre frères et sœurs, parents et enfants, fait ressortir les défauts cachés : animaux plus petits, moins de ponte ou de lait, malformations, mortalité des jeunes, fragilité aux maladies. Les effets apparaissent en 2 ou 3 générations." },
      { titre: "Renouveler les mâles", texte: "Changez de coq, de jars, de lapin, de bouc ou de bélier tous les 2 à 3 ans, en le prenant dans un autre élevage, ou échangez vos mâles avec d'autres éleveurs (associations de race, bourses d'échange). Ne gardez jamais pour la reproduction un jeune mâle né chez vous avec ses mères." },
      { titre: "Choisir les reproducteurs", texte: "Gardez les animaux en bonne santé, bien conformés, rustiques, de bon caractère et productifs : poules qui pondent régulièrement et couvent bien, lapines bonnes mères, chèvres faciles à traire et sans mammite, brebis qui agnèlent seules. Écartez les animaux agressifs ou souvent malades." },
      { titre: "Tenir un petit registre", texte: "Pour chaque reproducteur : origine, date de naissance, parents, descendants, qualités et défauts. Dans Racines, l'onglet « Mes animaux un par un » sert de base : notez le père et la mère dans la note de chaque animal." },
      { titre: "Races locales", texte: "Beaucoup de races locales (poules, chèvres, ânes, moutons) sont menacées : les élever et les faire reproduire en lien avec leur association de race aide à les conserver, et donne accès à des reproducteurs non apparentés." },
    ],
    video: "éviter la consanguinité poules changer de coq", liens: ["registre-elevage", "naissances", "couvaison"] }),

  g({ id: "paturage-tournant", titre: "Pâturage tournant et parasites : la base de la santé des herbivores", rubrique: "animaux", emoji: "🌾",
    resume: "Diviser la prairie en parcs, déplacer les animaux, laisser l'herbe repousser : moins de vers, plus d'herbe, et le bon nombre d'animaux par surface.",
    alias: ["paturage tournant", "rotation des parcs", "chargement", "combien d animaux par hectare", "surpaturage", "strongles", "parasites prairie", "chevres vers", "moutons vers", "prairie", "herbe"],
    etapes: [
      { titre: "Pourquoi tourner", texte: "Les larves de vers (strongles) vivent dans l'herbe rase près des crottes. Des animaux qui restent toujours sur la même parcelle se réinfestent sans arrêt. En les changeant de parc, on casse ce cycle, l'herbe repousse et les animaux mangent mieux." },
      { titre: "Organiser", texte: "Divisez la surface en 4 à 6 parcs (clôture électrique mobile). Les animaux restent 5 à 10 jours par parc, puis changent ; chaque parc se repose 4 à 6 semaines au printemps et en été. Faites pâturer quand l'herbe atteint 10 à 15 cm, sortez les animaux à 5 cm." },
      { titre: "Combien d'animaux", texte: "Repères pour une prairie moyenne : 6 à 10 chèvres ou brebis par hectare, 1 à 2 chevaux par hectare, 2 ânes par hectare (moins si la prairie est pauvre ou sèche). En dessous de ces surfaces, il faut apporter du foin une grande partie de l'année." },
      { titre: "Vermifuger juste", texte: "Vermifuge seulement après une coproscopie (analyse des crottes) ou devant des signes (amaigrissement, diarrhée, muqueuses pâles chez les chèvres et moutons). Vermifuger trop souvent crée des vers résistants. Le pâturage mixte (chevaux puis moutons, ou poules après les moutons) réduit encore les parasites." },
      { titre: "Plantes utiles", texte: "Sainfoin, chicorée, plantain et lotier dans la prairie réduisent naturellement les vers chez les petits ruminants. Évitez les zones humides (douve du foie) et clôturez les mares." },
    ],
    video: "pâturage tournant chèvres moutons parasites", liens: ["chevre", "mouton", "ane", "cheval", "vers-digestifs"] }),

  g({ id: "taille-rosiers-arbustes", titre: "Tailler les rosiers et les arbustes à fleurs", rubrique: "fleurs", emoji: "🌹",
    resume: "Quand et comment tailler selon que l'arbuste fleurit sur le bois de l'année ou sur celui de l'an passé, et la taille des rosiers pas à pas.",
    alias: ["taille des rosiers", "tailler les rosiers", "tailler un rosier", "rosier grimpant taille", "tailler les arbustes", "tailler un forsythia", "tailler un lilas", "tailler un hortensia", "quand tailler"],
    etapes: [
      { titre: "La règle d'or", texte: "Arbustes à floraison de printemps (forsythia, lilas, groseillier à fleurs, deutzia, seringat) : ils fleurissent sur le bois de l'année passée, on les taille juste APRÈS la floraison. Arbustes à floraison d'été et d'automne (buddleia, lavatère, hibiscus, caryoptéris, hortensia paniculé) : ils fleurissent sur le bois de l'année, on les taille en fin d'hiver (février-mars)." },
      { titre: "Tailler les rosiers buissons", texte: "En fin d'hiver, quand les forsythias fleurissent : supprimez le bois mort, malade et les branches qui se croisent, gardez 3 à 5 belles branches bien réparties et raccourcissez-les à 3 à 5 yeux, juste au-dessus d'un œil tourné vers l'extérieur, coupe en biais. Coupez les gourmands qui partent sous le point de greffe." },
      { titre: "Rosiers grimpants et anciens", texte: "Grimpants : on garde les longues branches palissées à l'horizontale (elles fleurissent mieux) et on raccourcit leurs ramifications latérales à 2 à 3 yeux. Rosiers anciens non remontants : légère taille après la floraison seulement." },
      { titre: "Pendant la saison", texte: "Coupez les fleurs fanées au-dessus d'une feuille à 5 folioles pour relancer la floraison des remontants (sauf si vous voulez des cynorhodons pour les oiseaux)." },
      { titre: "Outils et hygiène", texte: "Sécateur bien affûté, désinfecté à l'alcool entre deux arbustes malades. Brûlez ou jetez (pas au compost) les bois atteints de maladie." },
    ],
    video: "tailler les rosiers en fin d'hiver pas à pas", liens: ["rosier", "hortensia", "lilas"] }),

  g({ id: "transport-animaux", titre: "Transporter ses animaux : règles et bien-être", rubrique: "animaux", emoji: "🚚", niveau: 1,
    resume: "Déplacer des poules, des chèvres, un âne ou des ruches sans stress et dans les règles : documents, véhicule, durée, chaleur.",
    alias: ["transport des animaux", "transporter des poules", "transporter une chevre", "transporter un ane", "van", "remorque betaillere", "document de circulation", "deplacer des ruches"],
    etapes: [
      { titre: "Les documents", texte: "Ruminants (chèvres, moutons), porcs, chevaux et ânes voyagent identifiés, avec leur document de circulation ou d'identification ; l'entrée et la sortie s'inscrivent au registre d'élevage et sont notifiées à l'EDE ou à l'IFCE selon l'espèce. Pour un transport à but commercial ou sur de longues distances, une autorisation de transporteur et une formation sont exigées." },
      { titre: "Le véhicule", texte: "Caisse ou remorque propre, aérée, sans courant d'air direct, au sol antidérapant (paille), assez haute pour que l'animal se tienne debout. Les volailles voyagent en caisses aérées, jamais dans un coffre fermé au soleil." },
      { titre: "Le bien-être", texte: "Évitez les heures chaudes : en été, voyagez tôt le matin ou le soir. Pas d'animal malade, blessé ou en fin de gestation. Eau avant le départ et à l'arrivée ; pour les trajets longs, pauses avec abreuvement. Une conduite douce évite les chutes." },
      { titre: "À l'arrivée", texte: "Quarantaine de 2 à 3 semaines pour tout nouvel animal (surtout volailles) avant de le mêler au groupe : on évite ainsi d'introduire maladies et parasites." },
      { titre: "Les ruches", texte: "Voir le guide des miellées et de la transhumance : fermeture la veille au soir, transport de nuit, ruches sanglées, entrées grillagées et aérées, déclaration du nouvel emplacement." },
    ],
    video: "transporter des chèvres remorque bien-être", liens: ["registre-elevage", "api-miellees", "hygiene-animaux"] }),
];
