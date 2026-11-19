import type { Guide } from "./types";

// Guides du jardin d'ornement (audit horticulteur)
const g = (x: Omit<Guide, "niveau" | "duree"> & Partial<Pick<Guide, "niveau" | "duree">>): Guide => ({ niveau: 1, duree: "Lecture : 5 minutes", ...x });

export const GUIDES_HORTICULTURE: Guide[] = [
  g({ id: "planter-arbre", titre: "Planter un arbre ou un arbuste", rubrique: "demarrer", emoji: "🌳", duree: "30 minutes à 1 heure",
    resume: "Le bon moment, le trou, le pralinage, le tuteur, le premier arrosage et le paillage : les gestes qui font qu'un arbre reprend et vit longtemps.",
    alias: ["planter un arbre", "planter un arbuste", "plantation arbre", "trou de plantation", "tuteurer un arbre", "tuteur arbre", "planter une haie", "arroser un arbre plante", "arbre qui ne reprend pas"],
    materiel: ["Bêche ou pelle, fourche", "Tuteur (piquet de châtaignier) et lien souple", "Compost mûr (pas de fumier frais)", "Arrosoir, paillage"],
    etapes: [
      { titre: "Le bon moment", texte: "De novembre à mars, hors gel et hors sol détrempé (« à la Sainte-Catherine, tout bois prend racine »). Les plantes en racines nues se plantent uniquement à cette période ; les plantes en pot (conteneur) toute l'année sauf en été et par gel, mais l'automne reste le meilleur moment." },
      { titre: "Le trou", texte: "Deux à trois fois plus large que les racines ou la motte, et à peine plus profond. Griffez les parois à la fourche (sinon les racines tournent comme dans un pot). Mélangez la terre extraite avec un peu de compost mûr ; pas d'engrais chimique au fond du trou." },
      { titre: "Préparer les racines", texte: "Racines nues : coupez les bouts abîmés et pralinez (trempez-les dans une boue de terre, de compost et d'eau). Motte en pot : trempez-la 15 minutes dans un seau d'eau ; si les racines tournent en rond, démêlez-les ou incisez-les sur la hauteur." },
      { titre: "Planter à la bonne hauteur", texte: "Le collet (départ des racines) au niveau du sol, jamais enterré ; le point de greffe (bourrelet sur le tronc) toujours 5 à 10 cm au-dessus du sol. Plantez le tuteur AVANT l'arbre, du côté des vents dominants, puis rebouchez en tassant au pied." },
      { titre: "Arroser et pailler", texte: "Formez une cuvette autour du pied et versez 10 à 20 litres d'eau même s'il pleut (l'eau colle la terre aux racines). Paillez épais sur 1 m de diamètre. Les deux premiers étés, arrosez abondamment tous les 10 jours par temps sec : c'est la cause n° 1 des échecs." },
      { titre: "Attacher et protéger", texte: "Attachez le tronc au tuteur avec un lien souple en huit, sans serrer, à vérifier chaque année. Protection contre les lapins et chevreuils (manchon grillagé) à la campagne. Le tuteur s'enlève après 2 à 3 ans." },
    ],
    erreurs: ["Planter trop profond (le collet pourrit).", "Ne pas arroser l'été suivant la plantation.", "Laisser un lien qui étrangle le tronc."],
    video: "planter un arbre racines nues pralinage tuteur", liens: ["haie", "taille-arbustes-calendrier", "pommier"] }),

  g({ id: "vivaces-guide", titre: "Les vivaces : choisir, associer, diviser", rubrique: "fleurs", emoji: "🌼", niveau: 2,
    resume: "Des fleurs qui reviennent chaque année : comment composer un massif qui fleurit de mars à novembre, et multiplier ses vivaces gratuitement par division.",
    alias: ["vivaces", "vivace", "massif de vivaces", "vivaces faciles", "plantes vivaces", "diviser une vivace", "division des vivaces", "diviser les vivaces", "plate bande", "mixed border"],
    etapes: [
      { titre: "Choisir selon son sol et son exposition", texte: "Soleil et sol sec : sauges arbustives, pérovskia, gaura, népéta, lavande, achillée. Soleil et sol frais : phlox, échinacée, rudbeckia, asters, hémérocalles. Mi-ombre et ombre : hellébores, hostas, heuchères, géraniums vivaces, anémones du Japon, fougères. La fiche de chaque plante indique son exposition, sa rusticité et son sol." },
      { titre: "Composer pour toute l'année", texte: "Prévoyez des floraisons étalées : hellébores et bulbes (fin d'hiver), géraniums et népéta (printemps), sauges, phlox, échinacées (été), anémones du Japon, asters, graminées (automne). Plantez par groupes de 3, 5 ou 7 d'une même plante, les hautes au fond, et laissez des feuillages persistants pour l'hiver." },
      { titre: "Planter", texte: "Au printemps ou en septembre-octobre (l'automne donne un enracinement plus fort). Espacement : celui indiqué sur la fiche (les vivaces doublent de volume en 2 ans). Paillez entre les plants la première année." },
      { titre: "Diviser", texte: "Tous les 3 à 5 ans, quand le centre de la touffe se dégarnit : soulevez la touffe à la fourche, coupez-la en morceaux à la bêche ou au couteau (chaque éclat garde des racines et des bourgeons), replantez les plus vigoureux de l'extérieur, donnez les autres. Vivaces de printemps : divisez en automne ; vivaces d'été et d'automne : au printemps." },
      { titre: "L'entretien de l'année", texte: "Coupez les fleurs fanées pour prolonger la floraison (sauf si vous voulez les graines pour les oiseaux). Laissez les tiges sèches en hiver : elles abritent les insectes utiles et protègent la souche ; coupez tout en fin d'hiver." },
    ],
    video: "massif de vivaces facile diviser les vivaces", liens: ["hellebore", "geranium-vivace", "anemone-japon", "jardin-ombre"] }),

  g({ id: "jardin-ombre", titre: "Le jardin d'ombre", rubrique: "fleurs", emoji: "🌿",
    resume: "Ombre légère, mi-ombre, ombre sèche sous les arbres : les plantes qui y réussissent et comment préparer le sol.",
    alias: ["jardin d ombre", "plantes d ombre", "plante pour l ombre", "ombre seche", "sous un arbre", "cote nord", "arbuste pour l ombre", "fleurs ombre", "massif ombre"],
    etapes: [
      { titre: "Reconnaître son ombre", texte: "Mi-ombre : soleil le matin ou moins de 4 heures par jour. Ombre légère : sous un arbre au feuillage fin (bouleau). Ombre dense : côté nord d'un mur, sous un conifère. Ombre sèche : au pied des grands arbres, dont les racines boivent toute l'eau : c'est la plus difficile." },
      { titre: "Préparer le sol", texte: "Apportez du compost ou du terreau de feuilles chaque automne, et paillez avec les feuilles mortes : un sol d'ombre riche en humus garde la fraîcheur. Sous les arbres, ne mettez pas plus de 5 cm de terre sur leurs racines." },
      { titre: "Les plantes", texte: "Arbustes : laurier-tin, camélia et rhododendron (sol acide), hortensia, fusain, viorne. Vivaces : hellébores, hostas, heuchères, fougères, géranium macrorrhizum (même en ombre sèche), anémone du Japon, pervenche. Bulbes : jacinthes des bois, perce-neige, cyclamens rustiques. Grimpante : lierre." },
      { titre: "Jouer avec la lumière", texte: "Les feuillages panachés, argentés ou vert tendre éclairent un coin sombre ; les fleurs blanches se voient même au crépuscule." },
    ],
    video: "jardin d'ombre plantes faciles", liens: ["hosta", "hellebore", "fougere-jardin", "laurier-tin", "vivaces-guide"] }),

  g({ id: "couvre-sols-rocaille", titre: "Couvre-sols et rocaille", rubrique: "fleurs", emoji: "⛰️",
    resume: "Des plantes basses qui remplacent la pelouse ou le paillage sur un talus, et un jardin de rocaille pour les plantes des sols secs.",
    alias: ["couvre sol", "couvre-sol", "plantes couvre sol", "plantes couvre-sol", "talus", "remplacer la pelouse", "rocaille", "jardin de rocaille", "plantes de rocaille", "muret"],
    etapes: [
      { titre: "Pourquoi des couvre-sols", texte: "Un sol couvert ne se dessèche pas, ne s'érode pas sur un talus et laisse peu de place aux herbes indésirables. Une fois installés (2 ans), ils ne demandent presque plus rien." },
      { titre: "Lesquels", texte: "Soleil : thym serpolet, origan, géranium sanguin, sédums, népéta basse, lierre terrestre. Mi-ombre et ombre : géranium macrorrhizum, pervenche, lamier, épimédium, lierre. Talus : millepertuis, rosiers couvre-sol, cotonéaster rampant." },
      { titre: "Les installer", texte: "Désherbez soigneusement avant, plantez serré (4 à 9 pieds par m² selon la plante), paillez entre eux la première année, arrosez la première saison. Ils couvrent tout en 1 à 3 ans." },
      { titre: "La rocaille", texte: "Un coin très drainé : butte de terre mélangée moitié à du gravier, grosses pierres à moitié enterrées, inclinées vers l'intérieur. On y plante les plantes des montagnes et des sols secs : sédums, joubarbes, thym, œillets nains, aubriète, saxifrages. Pas d'arrosage une fois installées, paillage minéral (gravier)." },
    ],
    video: "plantes couvre-sol faciles talus", liens: ["geranium-vivace", "thym", "jardin-sec"] }),

  g({ id: "grimpantes-supports", titre: "Plantes grimpantes : choisir et installer le bon support", rubrique: "fleurs", emoji: "🌸",
    resume: "Chaque grimpante s'accroche à sa façon : ventouses, vrilles, tiges volubiles. Bien choisir le support, palisser et tailler.",
    alias: ["plantes grimpantes", "grimpante", "grimpantes", "treillage", "pergola", "palisser", "couvrir un mur", "cacher un grillage", "support grimpante", "tonnelle"],
    etapes: [
      { titre: "Comment elles grimpent", texte: "Crampons et ventouses (lierre, vigne vierge à ventouses, hortensia grimpant) : s'accrochent seules à un mur. Vrilles et pétioles (clématites, passiflore, pois de senteur, vigne) : il leur faut un grillage ou des fils fins. Tiges qui s'enroulent (glycine, chèvrefeuille, jasmin, haricot) : un support vertical solide. Rosiers grimpants : aucun moyen, il faut les attacher." },
      { titre: "Le bon support", texte: "Mur : fils tendus horizontalement tous les 30 à 40 cm, à 5 cm du mur (l'air circule). Grillage, treillage, arceaux pour les clématites et rosiers. Pergola très solide pour la glycine, qui devient énorme et tord le métal léger." },
      { titre: "Planter", texte: "À 30-40 cm du pied du mur (la terre y est sèche, abritée de la pluie), inclinée vers le support. Clématite : pied à l'ombre (paillage, plante basse devant), tête au soleil, plantée 5 cm plus profond qu'en pot." },
      { titre: "Palisser et tailler", texte: "Attachez les jeunes tiges au fur et à mesure, à l'horizontale le plus possible : elles fleurissent davantage. Taille selon la plante : glycine en été et en hiver, clématites selon leur groupe, vigne vierge et lierre pour dégager fenêtres et toitures." },
    ],
    video: "plantes grimpantes support palissage mur", liens: ["glycine", "clematite", "vigne-vierge", "lierre-jardin", "passiflore"] }),

  g({ id: "taille-arbustes-calendrier", titre: "Calendrier de taille des arbustes d'ornement", rubrique: "fleurs", emoji: "✂️", niveau: 2,
    resume: "Mois par mois, quels arbustes tailler et comment : la règle simple selon la période de floraison, et les exceptions.",
    alias: ["calendrier de taille", "quand tailler", "quand tailler les arbustes", "taille des arbustes", "tailler la glycine", "tailler une clematite", "tailler les hortensias", "tailler le buddleia", "taille ornement"],
    etapes: [
      { titre: "Janvier - février", texte: "Glycine (taille d'hiver : raccourcir à 2-3 yeux les pousses déjà taillées en été). Clématites des groupes 2 et 3 (groupe 3, floraison d'été : à 30 cm du sol ; groupe 2, grandes fleurs : légère taille). Rosiers en fin de période dans le Sud. Arbres caducs (bois mort, branches qui se croisent) hors gel." },
      { titre: "Mars", texte: "Rosiers buissons. Arbustes à floraison d'été et d'automne : buddleia (sévère), abélia, hibiscus de jardin, spirées d'été, caryoptéris, perovskia, sauge arbustive (après les gelées). Hortensias macrophylla : seulement les fleurs sèches. Hortensia paniculé : taille courte. Cornouillers : recépage d'un tiers des tiges. Graminées et vivaces : coupe des tiges sèches." },
      { titre: "Avril - mai", texte: "Juste après leur floraison : forsythia, laurier-tin, groseillier à fleurs, camélia, céanothe (légère), viorne. Premières tailles de haies persistantes à la fin mai, en vérifiant l'absence de nids." },
      { titre: "Juin - juillet", texte: "Après floraison : lilas, weigela, seringat, deutzia, spirées de printemps, rhododendrons (fleurs fanées), clématites du groupe 1 (montana). Haies : taille d'été légère. Glycine : taille d'été en juillet-août (pousses de l'année raccourcies à 5-6 feuilles)." },
      { titre: "Août - septembre", texte: "Arbres fruitiers à noyau et cerisiers à fleurs par temps sec (moins de gomme). Deuxième taille des haies persistantes (photinia, fusain, laurier-tin à la fin de l'été). Lavande juste après la floraison, sans couper dans le vieux bois." },
      { titre: "Octobre - décembre", texte: "On taille peu : bois mort, branches cassées, et les arbres caducs une fois les feuilles tombées (érables du Japon, bouleaux uniquement à cette période ou en fin d'été car ils perdent beaucoup de sève au printemps). Les fiches des plantes et le calendrier de Racines indiquent le mois de taille de chaque arbuste." },
    ],
    video: "calendrier de taille arbustes d'ornement", liens: ["taille-rosiers-arbustes", "glycine", "clematite", "hortensia", "buddleia"] }),

  g({ id: "pelouse-semer", titre: "Semer ou regarnir une pelouse", rubrique: "demarrer", emoji: "🌱", duree: "Une demi-journée + 3 semaines de levée",
    resume: "Préparer le sol, choisir le mélange de graines, semer au bon moment, et réparer les zones dégarnies sans tout refaire.",
    alias: ["semer une pelouse", "semer du gazon", "regarnir une pelouse", "regarnir le gazon", "pelouse degarnie", "trous dans la pelouse", "gazon", "creer une pelouse", "quand semer le gazon"],
    etapes: [
      { titre: "Le bon moment", texte: "Septembre est idéal (sol chaud, pluies d'automne, peu d'herbes concurrentes) ; sinon avril-mai. Jamais en plein été ni par gel." },
      { titre: "Préparer le sol", texte: "Retirez les herbes et cailloux, ameublissez sur 10 à 15 cm, nivelez au râteau. Laissez reposer 2 à 3 semaines et arrachez les herbes qui lèvent (faux-semis). Passez un rouleau léger pour tasser." },
      { titre: "Choisir le mélange", texte: "Pelouse rustique et résistante au piétinement : mélange avec ray-grass et fétuques. Sol sec et sans arrosage : fétuques élevées ou rouges, avec du trèfle blanc nain (reste vert l'été, enrichit le sol). Ombre : mélange « ombre » à base de fétuques et pâturin. 30 à 35 g de graines par m²." },
      { titre: "Semer", texte: "Par temps calme, en deux passages croisés pour une répartition régulière, puis griffez légèrement au râteau et roulez. Arrosez en pluie fine chaque jour sans détremper jusqu'à la levée (8 à 20 jours). Première tonte haute (6-8 cm) quand l'herbe atteint 10 cm." },
      { titre: "Regarnir les trous", texte: "Griffez la zone dégarnie, ajoutez 1 cm de terreau, semez (le mélange d'origine si possible), tassez du pied, gardez humide 3 semaines. Cherchez la cause : ombre, piétinement, urine de chien, vers blancs." },
    ],
    video: "semer une pelouse étape par étape septembre", liens: ["pelouse", "vers-blancs", "desherbage"] }),

  g({ id: "fleurs-a-couper", titre: "Un coin de fleurs à couper pour faire ses bouquets", rubrique: "fleurs", emoji: "💐",
    resume: "Les fleurs qui tiennent en vase, comment organiser un carré de fleurs à couper, et les gestes pour des bouquets qui durent.",
    alias: ["fleurs a couper", "fleurs coupees", "fleurs pour bouquets", "bouquet du jardin", "faire ses bouquets", "jardin de fleurs a couper", "fleurs en vase"],
    etapes: [
      { titre: "Les meilleures fleurs à couper", texte: "Annuelles faciles à semer : cosmos, zinnias, mufliers, tournesols ramifiés, nigelle, pois de senteur, centaurées. Bulbes : tulipes, narcisses, dahlias, glaïeuls, ail d'ornement. Vivaces : pivoines, phlox, échinacées, asters, alstrœmères. Feuillages : eucalyptus, graminées, fenouil bronze." },
      { titre: "Organiser le carré", texte: "Comme un potager : des rangs au soleil, accessibles, tuteurés par un filet horizontal à 40 cm. Semez les annuelles en plusieurs fois (toutes les 3 semaines) pour couper tout l'été ; plantez les glaïeuls toutes les 2 semaines." },
      { titre: "Couper au bon moment", texte: "Tôt le matin, quand les tiges sont pleines d'eau, avec un sécateur propre. Coupez quand les fleurs commencent juste à s'ouvrir (pivoine en bouton « guimauve », dahlia et zinnia bien ouverts). Plongez aussitôt dans un seau d'eau. Plus on coupe les annuelles, plus elles refleurissent." },
      { titre: "Faire durer le bouquet", texte: "Retirez les feuilles qui trempent, recoupez les tiges en biais, vase très propre, eau changée tous les 2 jours. Tiges qui saignent (pavot, euphorbe) : passez le bout à la flamme." },
    ],
    video: "jardin de fleurs à couper débutant", liens: ["cosmos", "zinnia", "dahlia", "glaieul"] }),

  g({ id: "jardiniere-fleurie", titre: "Une jardinière fleurie qui tient tout l'été", rubrique: "balcon", emoji: "🌺",
    resume: "Choisir les plantes selon l'exposition du balcon, le terreau et le bac, l'arrosage, l'engrais et le nettoyage qui gardent les jardinières fleuries jusqu'aux gelées.",
    alias: ["jardiniere fleurie", "jardinieres", "fleurs de balcon", "balcon fleuri", "suspension fleurie", "fleurs en pot ete", "composer une jardiniere", "geranium balcon"],
    etapes: [
      { titre: "Selon l'exposition", texte: "Plein sud : géraniums (pélargoniums), gauras, verveines, gazanias, sauges, pourpiers. Est ou ouest : pétunias, surfinias, calibrachoas, bacopa, fuchsias (ouest). Nord : bégonias, impatiens, fuchsias, heuchères, lierres, fougères." },
      { titre: "Le bac et le terreau", texte: "Une jardinière d'au moins 20 cm de profondeur, percée, avec 2 cm de billes d'argile au fond. Terreau pour plantes fleuries de bonne qualité, avec un engrais à libération lente mélangé à la plantation. Plantez après les dernières gelées, en serrant (une plante tous les 15-20 cm)." },
      { titre: "Composer", texte: "Au fond une plante haute (sauge, gaura), au milieu les plantes en touffe (géraniums, bégonias), devant les retombantes (surfinia, bacopa, lierre). Trois couleurs au plus pour un effet harmonieux." },
      { titre: "Arroser et nourrir", texte: "En été, arrosage chaque soir (deux fois par jour en plein sud lors des canicules), jusqu'à ce que l'eau sorte par les trous. Engrais liquide pour plantes fleuries tous les 10 à 15 jours de juin à septembre : les jardinières épuisent vite leur terreau." },
      { titre: "Nettoyer", texte: "Retirez les fleurs fanées chaque semaine, rabattez les surfinias de moitié s'ils s'étirent en juillet : ils refleurissent en 3 semaines. Les géraniums s'hivernent au frais et hors gel." },
    ],
    video: "composer une jardinière fleurie balcon", liens: ["geranium", "petunia", "hivernage-pots", "arrosage-auto-balcon"] }),
];
