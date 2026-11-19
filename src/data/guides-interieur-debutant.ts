import type { Guide } from "./types";

// Tutoriels du débutant en plantes d'intérieur (audit « plantes d'intérieur débutant »)
const g = (x: Omit<Guide, "niveau" | "duree" | "rubrique"> & Partial<Pick<Guide, "niveau" | "duree" | "rubrique">>): Guide => ({ niveau: 1, duree: "Lecture : 5 minutes", rubrique: "interieur", ...x });

export const GUIDES_INTERIEUR_DEBUTANT: Guide[] = [
  g({ id: "sauver-plante", titre: "Sauver une plante qui va mal : le plan en 6 étapes", emoji: "🚑", duree: "30 minutes",
    resume: "Une démarche dans l'ordre pour trouver ce qui ne va pas (terre, racines, lumière, ravageurs, emplacement) et les gestes qui sauvent, sans tout faire en même temps.",
    alias: ["sauver une plante", "sauver ma plante", "plante qui meurt", "ma plante meurt", "plante mourante", "plante qui dépérit", "plante achetée qui dépérit", "plante malade intérieur", "que faire plante qui va mal", "réanimer une plante", "racines pourries que faire"],
    materiel: ["Journal ou bâche", "Sécateur ou ciseaux propres (désinfectés à l'alcool)", "Terreau neuf adapté", "Pot avec trou, 2 à 4 cm plus large que la motte (si besoin)"],
    etapes: [
      { titre: "1. Touchez la terre", texte: "Enfoncez un doigt sur 3 cm. Détrempée, avec une odeur de moisi : excès d'eau, c'est la première cause de mort. Sèche comme de la poussière et motte décollée du pot : la plante a soif (trempez le pot 20 minutes dans une bassine, puis égouttez)." },
      { titre: "2. Regardez les racines", texte: "Sortez la motte du pot. Racines claires et fermes : elles vont bien. Brunes, molles, qui se détachent en lambeaux : pourriture. Coupez toutes les parties molles, laissez sécher la motte 1 jour à l'air, rempotez dans un terreau neuf et un pot à peine plus grand, et n'arrosez pas avant 5 à 7 jours. Racines qui tournent en rond et sortent du trou : rempotage." },
      { titre: "3. Vérifiez la lumière", texte: "Tiges longues et pâles, plante qui penche, feuilles petites : elle manque de lumière. Rapprochez-la d'une fenêtre (sans soleil brûlant pour les plantes d'ombre) ou ajoutez une lampe. Taches blanches ou beiges sèches après un déplacement au soleil : brûlure." },
      { titre: "4. Cherchez les ravageurs", texte: "Avec une loupe ou la lampe du téléphone, sous les feuilles et à l'aisselle des tiges : amas cotonneux (cochenilles), petites toiles et feuilles ternes piquetées (araignées rouges), feuilles collantes (pucerons, cochenilles), moucherons sur la terre (sciarides). Isolez la plante des autres, puis traitez (voir la fiche du ravageur)." },
      { titre: "5. Changez ce qui a changé", texte: "Une plante qui perd ses feuilles juste après l'achat, un déménagement ou l'arrivée du chauffage réagit souvent à un choc (lumière, température, air sec) : ne la déplacez plus, ne la rempotez pas, n'ajoutez pas d'engrais. Elle repart en 3 à 6 semaines." },
      { titre: "6. Taillez et patientez", texte: "Coupez les feuilles entièrement sèches ou pourries (pas les feuilles à moitié jaunes : la plante en récupère les réserves). Si la tige est encore ferme quelque part, prélevez une bouture saine en sécurité. Puis attendez : une plante soignée met des semaines à montrer du mieux." },
    ],
    conseils: ["Un seul changement à la fois : sinon on ne sait jamais ce qui a marché.", "Le diagnostic « Santé » de l'appli aide à mettre un nom sur le problème."],
    erreurs: ["Arroser plus une plante qui s'affaisse alors que sa terre est mouillée : elle se noie.", "Rempoter, nourrir et déplacer le même jour une plante stressée."],
    video: "sauver plante intérieur racines pourries", liens: ["pourriture-racines", "soif", "manque-lumiere", "cochenilles", "rempoter", "plantes-interieur-bases"] }),

  g({ id: "pots-arrosage", titre: "Pots, cache-pots et arrosage par le bas", emoji: "🌿",
    resume: "Pourquoi le trou au fond du pot compte plus que tout, comment utiliser un cache-pot ou un pot sans trou sans noyer la plante, et quand arroser par le bas, par trempage ou avec une mèche.",
    alias: ["pot sans trou", "cache-pot", "cache pot", "eau stagnante cache-pot", "arroser par le bas", "arrosage par le bas", "trempage", "bassiner", "arrosage par mèche", "mèche arrosage", "pot en terre cuite ou plastique", "billes d'argile au fond du pot", "drainage pot"],
    etapes: [
      { titre: "Le trou, toujours", texte: "Une plante en pot sans trou finit presque toujours par pourrir : l'eau en trop stagne au fond et asphyxie les racines. Gardez le pot de culture en plastique (avec trous) et glissez-le dans le joli pot, qui sert alors de cache-pot." },
      { titre: "Le cache-pot", texte: "Après chaque arrosage, videz l'eau qui reste au fond du cache-pot au bout de 15 minutes. Une couche de billes d'argile au fond du cache-pot (pas dans le pot !) surélève la plante au-dessus de l'eau. Contrairement à une idée reçue, des billes ou des cailloux AU FOND DU POT n'améliorent pas le drainage : ils remontent la zone humide vers les racines." },
      { titre: "Arroser par le bas", texte: "Posez le pot dans une bassine ou un évier avec 3 à 5 cm d'eau, 15 à 30 minutes, jusqu'à ce que la surface de la terre devienne humide, puis égouttez. Idéal pour les terreaux devenus secs qui ne retiennent plus l'eau, les violettes africaines (feuilles qui craignent l'eau), les cactus et les plantes à rosette. Une fois par mois, arrosez aussi par le haut pour rincer les sels de l'engrais." },
      { titre: "Terre cuite ou plastique ?", texte: "La terre cuite respire et sèche vite : parfaite pour les cactus, succulentes et ceux qui oublient d'arroser trop souvent... à l'envers. Le plastique garde l'humidité plus longtemps : mieux pour les fougères, calathéas, et ceux qui oublient d'arroser." },
      { titre: "La mèche pour les absences", texte: "Une mèche en coton ou en laine passée par le trou du pot et plongée dans un réservoir d'eau sous le pot arrose en continu, pour une à deux semaines d'absence. À tester avant de partir : certaines plantes (cactus, succulentes) n'aiment pas." },
    ],
    erreurs: ["Planter directement dans un pot décoratif sans trou parce qu'il est joli."],
    video: "arroser par le bas plante intérieur cache-pot", liens: ["eau-arrosage-interieur", "rempoter", "vacances-plantes-interieur", "pourriture-racines"] }),

  g({ id: "saisons-plantes-interieur", titre: "Les saisons des plantes d'intérieur : repos d'hiver, sortie d'été, retour en septembre", emoji: "📆",
    resume: "Pourquoi une plante ne pousse plus en hiver (et ce qu'il faut changer), comment l'humidité de l'air se gère près des radiateurs, sortir les plantes au jardin l'été sans les brûler, et les rentrer sans ramener de ravageurs.",
    alias: ["plante qui ne pousse plus en hiver", "repos hivernal", "repos d'hiver plante", "plante en hiver", "plante près du radiateur", "chauffage plantes", "humidifier l'air", "humidité de l'air plantes", "air sec plantes", "sortir les plantes l'été", "sortir les plantes dehors", "rentrer les plantes", "rentrer les plantes en septembre", "plantes au balcon l'été", "plante brûlée au soleil"],
    etapes: [
      { titre: "L'hiver : le repos", texte: "De novembre à février, la lumière baisse de moitié : la plupart des plantes poussent peu ou pas. C'est normal. Arrosez 2 fois moins (laissez sécher davantage entre deux arrosages), arrêtez l'engrais, ne rempotez pas, et rapprochez-les des fenêtres (sans toucher la vitre froide). Les plantes près d'une lampe de culture, elles, continuent à pousser." },
      { titre: "Radiateurs et air sec", texte: "L'air chauffé descend souvent sous 30 % d'humidité : bouts de feuilles qui sèchent, araignées rouges. Éloignez les plantes des radiateurs (au moins 1 m), regroupez-les (elles s'humidifient entre elles), posez les pots sur un plateau de billes d'argile mouillées (sans que le pot trempe), ou utilisez un humidificateur dans la pièce. Brumiser les feuilles n'humidifie l'air que quelques minutes et favorise les taches sur certaines plantes." },
      { titre: "Mai-juin : sortir progressivement", texte: "Quand les nuits restent au-dessus de 12 °C, beaucoup de plantes d'intérieur adorent un été dehors, à l'ombre claire (sous un arbre, un balcon nord ou est). Habituez-les sur 10 à 15 jours : d'abord quelques heures à l'ombre, jamais en plein soleil d'un coup (les feuilles brûlent en une après-midi). Surveillez l'arrosage : dehors, elles boivent beaucoup plus." },
      { titre: "Septembre : rentrer sans ravageurs", texte: "Avant que les nuits passent sous 12 °C : inspectez chaque plante (dessous des feuilles, terre), douchez le feuillage, grattez le premier centimètre de terre, et gardez-les 2 semaines à l'écart des autres plantes de la maison. Elles perdront quelques feuilles en s'habituant à la lumière plus faible." },
      { titre: "Printemps : le redémarrage", texte: "Mars-avril, quand de nouvelles feuilles apparaissent : c'est le moment de rempoter si besoin, de reprendre l'engrais et d'augmenter l'arrosage. Tournez les pots d'un quart de tour chaque semaine pour qu'elles poussent droit." },
    ],
    conseils: ["Les plantes grasses et les cactus fleurissent mieux après un hiver au frais (10-12 °C) et presque au sec."],
    video: "plantes intérieur hiver repos sortir été", liens: ["air-sec", "coup-soleil", "plantes-interieur-bases", "engrais-interieur", "lutte-bio-interieur"] }),

  g({ id: "engrais-interieur", titre: "Nourrir ses plantes d'intérieur : quand, avec quoi, combien", emoji: "🍽️",
    resume: "Les plantes en pot n'ont que la terre de leur pot : l'engrais compte, mais à petite dose, au bon moment, et jamais sur une plante sèche ou malade.",
    alias: ["engrais plante intérieur", "engrais plantes vertes", "nourrir plante intérieur", "quel engrais plante intérieur", "engrais liquide", "bâtonnets d'engrais", "engrais orchidée", "engrais cactus", "trop d'engrais", "croûte blanche terreau", "dose engrais"],
    etapes: [
      { titre: "Quand", texte: "Pendant la pousse, de mars-avril à septembre : toutes les 2 à 4 semaines pour les plantes vertes, une fois par mois pour les cactus et succulentes. Rien en hiver (sauf sous lampe de culture), rien pendant les 2 mois qui suivent un rempotage (le terreau neuf contient déjà de quoi manger)." },
      { titre: "Avec quoi", texte: "Un engrais liquide pour plantes vertes (plus d'azote, N) pour le feuillage ; pour plantes fleuries (plus de potassium, K) pour les orchidées, violettes et plantes à fleurs ; un engrais spécial pour cactus et orchidées, très peu dosé. Les bâtonnets se dosent mal : préférez le liquide." },
      { titre: "Combien", texte: "Moitié de la dose indiquée sur l'étiquette : les plantes d'intérieur poussent moins vite que dehors, et le surplus brûle les racines. Toujours sur une terre déjà humide (arrosez d'abord à l'eau claire si elle est sèche)." },
      { titre: "Trop d'engrais : les signes", texte: "Croûte blanche sur la terre ou sur le bord du pot, bouts de feuilles brûlés, feuilles qui flétrissent alors que la terre est humide. Rincez la motte : faites couler sous le robinet un volume d'eau égal à 3 fois celui du pot, laissez égoutter, et arrêtez l'engrais 2 mois." },
      { titre: "Et les engrais maison ?", texte: "Le marc de café, les coquilles d'œuf et l'eau de cuisson n'apportent presque rien en pot et peuvent moisir ou attirer des moucherons. Un purin d'ortie très dilué (5 %) convient aux plantes vertes en été, à l'extérieur de préférence (odeur)." },
    ],
    erreurs: ["Donner de l'engrais à une plante qui va mal : elle a besoin qu'on trouve la cause, pas d'être nourrie."],
    video: "engrais plante intérieur dosage", liens: ["saisons-plantes-interieur", "sauver-plante", "eau-arrosage-interieur"] }),
];
