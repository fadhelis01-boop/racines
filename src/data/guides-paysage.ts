import type { Guide } from "./types";

// Tutoriels du fleuriste et du paysagiste débutants
const g = (x: Omit<Guide, "niveau" | "duree" | "rubrique"> & Partial<Pick<Guide, "niveau" | "duree" | "rubrique">>): Guide => ({ niveau: 1, duree: "Lecture : 6 minutes", rubrique: "fleurs", ...x });

export const GUIDES_PAYSAGE: Guide[] = [
  // ───────── Fleuriste ─────────
  g({ id: "art-floral-bases", titre: "Composer et faire durer un bouquet", emoji: "💐", duree: "30 minutes",
    resume: "Couper au bon moment, conditionner les fleurs, préparer le vase, composer un bouquet équilibré (structure, fleurs vedettes, remplissage, feuillage), sans mousse florale, et le faire tenir deux fois plus longtemps.",
    alias: ["faire un bouquet", "composer un bouquet", "bouquet", "conserver un bouquet", "faire durer un bouquet", "eau du vase", "fleurs coupées", "fleurs coupees tiennent longtemps", "conditionner les fleurs", "bouquet de saison", "bouquet champêtre", "bouquet de mariée", "bouquet rond", "bouquet spiralé", "mousse florale", "pique-fleurs", "kenzan", "grillage à poule bouquet", "couronne de fleurs", "art floral", "composition florale"],
    materiel: ["Sécateur ou couteau très propre", "Seau d'eau fraîche", "Vase lavé (eau de Javel puis rinçage)", "Ficelle ou raphia", "Pique-fleurs (kenzan) ou boule de grillage à poule pour les compositions"],
    etapes: [
      { titre: "1. Couper au bon moment", texte: "Le matin, à la fraîche, ou le soir, jamais en plein soleil. Au bon stade pour chaque fleur (bouton coloré pour la rose et la tulipe, fleur ouverte pour le dahlia et le zinnia : voir la fiche de chaque fleur, rubrique « En bouquet »). Plongez aussitôt les tiges dans un seau d'eau emporté au jardin." },
      { titre: "2. Conditionner", texte: "Retirez toutes les feuilles qui tremperaient dans l'eau (elles pourrissent et nourrissent les bactéries). Recoupez chaque tige en biais de 2 cm, sous l'eau si possible. Tiges ligneuses (lilas, hortensia) : fendez-les sur 3 cm. Narcisses : à part 12 heures. Laissez reposer 2 heures au frais avant de composer : les fleurs se gorgent d'eau." },
      { titre: "3. Composer", texte: "Commencez par la structure (feuillages, branches), puis les fleurs vedettes en nombre impair (3, 5, 7), puis les fleurs de remplissage (alchémille, gypsophile, ammi) et enfin les fleurs légères qui dépassent (verveine, graminées). Hauteur du bouquet : environ une fois et demie celle du vase. Bouquet à la main : tournez-le d'un quart de tour en ajoutant chaque tige en biais dans le même sens (bouquet spiralé), liez au point de croisement." },
      { titre: "4. Sans mousse florale", texte: "La mousse florale verte est un plastique qui se délite en microparticules et ne se composte pas. Remplacez-la par un pique-fleurs (kenzan) au fond d'une coupe, une boule de grillage à poule froissée dans le vase, une grille de ruban adhésif sur l'ouverture, ou des branches entrecroisées." },
      { titre: "5. Faire durer", texte: "Vase propre, eau fraîche changée tous les 2 jours en recoupant les tiges de 1 cm. Loin des fruits (l'éthylène des pommes et des bananes fait faner), du soleil direct et des radiateurs. Le sachet de conservateur fourni par le fleuriste marche ; à défaut, une goutte d'eau de Javel par litre limite les bactéries (pas pour les tiges creuses)." },
      { titre: "6. Une couronne", texte: "Sur une base de branches souples (lierre, clématite sauvage, osier) roulées en cercle, ou un cercle de paille, fixez de petits bouquets de feuillage et de fleurs séchées avec du fil de fer fin, tous dans le même sens, chaque bouquet couvrant les tiges du précédent." },
    ],
    conseils: ["Fleurs toxiques pour les chats : lys (mortel, même le pollen), et dans une moindre mesure tulipes, narcisses, chrysanthèmes, hortensias, eucalyptus. Avec un chat, préférez roses, gerberas, zinnias, freesias, lisianthus, statice.", "Un bouquet du jardin vaut celui du fleuriste : un coin de fleurs à couper de 5 m² suffit pour un bouquet par semaine de juin à octobre."],
    erreurs: ["Laisser des feuilles dans l'eau.", "Mettre le bouquet à côté de la corbeille de fruits."],
    video: "composer un bouquet de fleurs du jardin conditionnement", liens: ["fleurs-a-couper", "fleurs-sechees", "couleurs-jardin", "zinnia", "dahlia", "lys"] }),

  g({ id: "fleurs-sechees", titre: "Faire sécher des fleurs et des bouquets", emoji: "🌾",
    resume: "Les fleurs qui sèchent le mieux, quand les couper, les trois méthodes (tête en bas, debout, au silica gel ou sous presse) et comment garder les couleurs.",
    alias: ["fleurs séchées", "faire sécher des fleurs", "sécher des fleurs", "bouquet sec", "bouquet séché", "fleurs stabilisées", "herbier", "presser des fleurs", "silica gel fleurs", "immortelles"],
    etapes: [
      { titre: "Les meilleures à sécher", texte: "Immortelles et statice, lavande, achillée, hortensia (fin d'été), gypsophile, nigelle (capsules), célosie, amarante, delphinium, rose en bouton, graminées (miscanthus, stipa, pennisetum), monnaie-du-pape, eucalyptus, chardons. Les fleurs très charnues (lys, tulipes) se sèchent mal." },
      { titre: "Quand couper", texte: "Par temps sec, en fin de matinée quand la rosée est partie, juste avant la pleine ouverture : la fleur continue de s'ouvrir en séchant. Retirez les feuilles." },
      { titre: "Tête en bas", texte: "Petites bottes de 5 à 10 tiges serrées par un élastique (les tiges rétrécissent), suspendues tête en bas dans un endroit sec, sombre et aéré (grenier, placard ventilé) pendant 2 à 4 semaines. L'obscurité garde les couleurs." },
      { titre: "Debout ou à plat", texte: "Hortensias et graminées : debout dans un vase avec 2 cm d'eau qu'on laisse s'évaporer. Fleurs fragiles (roses, pensées) : enfouies dans du silica gel (en vente en droguerie) 3 à 7 jours, couleurs intactes. Pour un herbier : entre deux feuilles de papier absorbant, sous des livres lourds, 2 à 3 semaines." },
      { titre: "Garder et entretenir", texte: "Loin du soleil direct (il blanchit les couleurs en quelques semaines) et de l'humidité. Dépoussiérez au sèche-cheveux froid. Une laque à cheveux légère fixe les graminées qui s'effritent." },
    ],
    video: "faire sécher des fleurs tête en bas bouquet sec", liens: ["statice", "lavande", "achillee", "hortensia", "art-floral-bases"] }),

  g({ id: "couleurs-jardin", titre: "Associer les couleurs au jardin et en bouquet", emoji: "🎨",
    resume: "Les trois harmonies simples (camaïeu, complémentaires, contraste doux), le rôle du blanc et du vert, l'effet des couleurs sur la profondeur, et des associations qui marchent à coup sûr.",
    alias: ["couleurs qui vont ensemble", "associer les couleurs", "harmonie de couleurs", "cercle chromatique jardin", "couleurs massif", "massif bleu et jaune", "camaïeu", "couleurs complémentaires", "jardin blanc"],
    etapes: [
      { titre: "Le camaïeu", texte: "Des couleurs voisines : roses, mauves et violets ; ou jaune, orange et rouge. Harmonie douce, facile à réussir, très reposante. Variez alors les formes (boules, épis, ombelles) et les hauteurs pour éviter la monotonie." },
      { titre: "Les complémentaires", texte: "Des couleurs opposées qui se renforcent : jaune et violet, orange et bleu, rouge et vert. Effet vif et joyeux : utilisez une couleur dominante et l'autre en touches (par exemple beaucoup de bleu et quelques taches d'orange)." },
      { titre: "Le blanc et le vert", texte: "Le blanc éclaire les coins d'ombre et le jardin du soir, et sépare des couleurs qui se heurtent. Les fleurs et feuillages vert acide (alchémille, euphorbe) lient toutes les couleurs entre elles : c'est le « sel » d'un massif ou d'un bouquet." },
      { titre: "Couleurs et profondeur", texte: "Les couleurs chaudes (rouge, orange, jaune) semblent plus proches : placez-les près de la maison ou de la terrasse. Les froides (bleu, violet, gris) semblent plus lointaines : au fond du jardin, elles l'agrandissent." },
      { titre: "Associations qui marchent", texte: "Népéta et rosiers roses ; rudbeckia et verveine de Buenos Aires ; lavande et achillée jaune ; hostas, fougères et astilbes blanches à l'ombre ; graminées blondes et orpin d'automne rose ; tulipes violettes et narcisses blancs. La page Fleurs propose des plantes de l'appli pour chaque harmonie." },
    ],
    video: "associer les couleurs massif de fleurs", liens: ["vivaces-guide", "art-floral-bases", "concevoir-jardin"] }),

  g({ id: "metier-fleuriste", titre: "Devenir fleuriste, vendre ses fleurs : les repères", emoji: "💐", rubrique: "demarrer", duree: "Lecture : 5 minutes",
    resume: "Les métiers des fleurs (fleuriste, horticulteur de fleurs coupées, paysagiste), les formations, et ce qu'il faut savoir pour vendre quelques bouquets de son jardin.",
    alias: ["devenir fleuriste", "métier fleuriste", "cap fleuriste", "formation fleuriste", "vendre des fleurs", "vendre ses fleurs", "fleurs locales", "fleurs françaises", "fleurs de france", "slow flower", "ferme florale", "producteur de fleurs", "devenir paysagiste", "cap jardinier paysagiste"],
    etapes: [
      { titre: "Les métiers", texte: "Fleuriste (art floral, conseil, boutique) ; horticulteur ou « fleuriculteur » qui produit des fleurs coupées (les fermes florales locales se multiplient) ; jardinier-paysagiste qui crée et entretient les jardins. Les trois demandent de l'endurance physique : froid, eau, port de charges, fêtes et week-ends." },
      { titre: "Les formations", texte: "Fleuriste : CAP fleuriste (1 ou 2 ans, accessible en reconversion et en apprentissage), puis brevet professionnel et brevet de maîtrise. Paysagiste : CAP jardinier paysagiste, bac pro aménagements paysagers, BTSA. Production : BPREA (brevet agricole) pour s'installer en fleurs coupées, avec des aides à l'installation comme en maraîchage." },
      { titre: "Vendre quelques fleurs de son jardin", texte: "Une vente occasionnelle entre particuliers reste tolérée ; dès que la vente devient régulière (marché, dépôt chez un commerçant, vente en ligne), il faut un statut (micro-entreprise agricole) et déclarer les revenus. Renseignez-vous auprès de la chambre d'agriculture." },
      { titre: "Les fleurs locales et de saison", texte: "Environ 85 % des fleurs vendues en France sont importées (Pays-Bas, Kenya, Équateur), souvent cultivées sous serre chauffée ou très traitées. Le label « Fleurs de France » et les collectifs de fleurs locales et de saison (type « slow flower ») référencent les producteurs proches de chez vous. La page Fleurs indique les fleurs locales disponibles chaque mois." },
    ],
    video: "devenir fleuriste cap reconversion", liens: ["art-floral-bases", "fleurs-a-couper", "vendre-surplus"] }),

  // ───────── Paysagiste : styles et situations ─────────
  g({ id: "jardin-mediterraneen", titre: "Créer un jardin méditerranéen (et sec)", emoji: "☀️", rubrique: "demarrer",
    resume: "Un jardin qui se passe d'arrosage une fois installé : sol drainé, paillage minéral, plantes à feuillage gris et aromatique, plantation d'automne.",
    alias: ["jardin méditerranéen", "jardin mediterraneen", "jardin provençal", "jardin sec sans arrosage", "jardin de graviers", "paillage minéral"],
    etapes: [
      { titre: "Le sol", texte: "La plupart des plantes méditerranéennes meurent l'hiver d'humidité, pas de froid. En sol lourd, ajoutez du gravier ou plantez sur une butte de 20-30 cm. Pas d'engrais : elles aiment les sols pauvres." },
      { titre: "Les plantes", texte: "Feuillages gris ou argentés et aromatiques : lavande, sauges, romarin, thym, santoline, perovskia, euphorbe characias, cistes, gaura, kniphofia, achillée, verveine de Buenos Aires, graminées (stipa, fétuque bleue). Arbres : olivier, arbre de Judée, grenadier ; arbustes : pittosporum, éléagnus, myrte, laurier-tin." },
      { titre: "Planter à l'automne", texte: "Plantez de jeunes plants (godets) en octobre-novembre : les racines s'installent tout l'hiver avec la pluie. Arrosez copieusement 2 ou 3 fois la première année, puis plus du tout." },
      { titre: "Le paillage minéral", texte: "Gravier, pouzzolane ou galets sur 5 à 8 cm, sans géotextile plastique dessous : il garde la fraîcheur, empêche les herbes et renvoie la chaleur que ces plantes aiment." },
    ],
    video: "créer jardin méditerranéen sec sans arrosage", liens: ["jardin-sec", "lavande", "olivier", "stipa", "euphorbe", "gaura"] }),

  g({ id: "jardin-japonais", titre: "Un jardin d'inspiration japonaise", emoji: "🎋", rubrique: "demarrer",
    resume: "Les principes (asymétrie, pierre, eau, végétal persistant, vides), les plantes qui donnent l'ambiance sous nos climats et les erreurs de « décor » à éviter.",
    alias: ["jardin japonais", "jardin zen", "jardin d'inspiration japonaise", "jardin sec japonais", "érable du japon", "pierre et mousse"],
    etapes: [
      { titre: "Les principes", texte: "Évoquer un paysage en petit : la pierre (montagne), le gravier ratissé ou l'eau (rivière, mer), le végétal taillé (collines). Asymétrie, groupes impairs, beaucoup de vide et de calme : moins d'objets, plus d'effet." },
      { titre: "Les plantes", texte: "Persistants taillés en nuages ou en boules (buis, osmanthe, pin), érable du Japon, cerisier à fleurs, azalées et rhododendrons en sol acide, nandina, bambous non traçants (Fargesia), fougères, hostas, carex, mousses à l'ombre fraîche. Peu de couleurs : surtout des verts, une floraison à la fois." },
      { titre: "Le minéral", texte: "Quelques belles pierres enterrées au tiers (elles doivent sembler sortir du sol), pas de pierres posées. Un gravier clair ratissé ou un pas japonais de dalles irrégulières qui ralentit la marche." },
      { titre: "À éviter", texte: "L'accumulation de lanternes, ponts rouges et bouddhas de jardinerie ; les bambous traçants (Phyllostachys) sans barrière anti-rhizome enterrée sur 70 cm : ils envahissent le jardin et celui des voisins." },
    ],
    video: "jardin japonais principes petit jardin", liens: ["erable-japon", "nandina", "carex", "allees-terrasses"] }),

  g({ id: "jardin-bord-de-mer", titre: "Jardiner en bord de mer : vent, sel et sable", emoji: "🌊", rubrique: "demarrer",
    resume: "Créer d'abord un brise-vent avec des arbustes qui supportent les embruns, puis planter à l'abri ; les plantes qui tiennent au sel et au sable.",
    alias: ["plantes bord de mer", "jardin bord de mer", "jardin en bord de mer", "embruns", "vent salé", "jardin sableux", "haie bord de mer"],
    etapes: [
      { titre: "D'abord le brise-vent", texte: "Le vent salé brûle les feuilles des plantes non adaptées. Plantez en premier une haie libre d'arbustes résistants aux embruns : éléagnus, pittosporum, tamaris, argousier, griselinia, fusain du Japon, chêne vert. Un brise-vent ajouré (qui laisse passer la moitié du vent) protège mieux qu'un mur, qui crée des tourbillons." },
      { titre: "À l'abri de la haie", texte: "Plantes à feuilles grises, charnues ou cireuses : lavande, armérie maritime, statice, santoline, sédums, agapanthe, kniphofia, achillée, graminées (fétuque bleue, stipa), rosier rugueux." },
      { titre: "Le sol sableux", texte: "Il sèche vite et ne retient rien : compost en surface chaque automne, paillage épais, arrosage au goutte-à-goutte la première année. Choisissez de jeunes plants qui s'enracinent profondément." },
    ],
    video: "jardin bord de mer plantes résistantes embruns", liens: ["eleagnus", "pittosporum", "statice", "kniphofia", "jardin-mediterraneen"] }),

  g({ id: "jardin-de-pluie", titre: "Un jardin de pluie (noue) pour l'eau du toit", emoji: "🌧️", rubrique: "arrosage",
    resume: "Une dépression plantée qui recueille l'eau des toits et des allées, l'infiltre en 24 à 48 heures, évite les inondations et nourrit une flore de milieu frais.",
    alias: ["jardin de pluie", "noue", "noue paysagère", "infiltration eau de pluie", "gestion eau pluviale", "eau du toit dans le jardin"],
    etapes: [
      { titre: "Où et quelle taille", texte: "À au moins 3 m de la maison (jamais contre les fondations), en pente douce, là où l'eau s'infiltre (test : un trou de 30 cm rempli d'eau doit se vider en moins de 24 heures). Surface : environ 10 à 20 % de la surface du toit raccordé." },
      { titre: "Creuser", texte: "Une cuvette de 15 à 30 cm de profondeur, à fond plat, avec un petit bourrelet en aval. Mélangez la terre du fond avec du compost et du sable si elle est lourde. Amenez l'eau de la descente de gouttière par une rigole de galets." },
      { titre: "Planter", texte: "Au fond, des plantes qui supportent d'avoir les pieds dans l'eau quelques jours puis la sécheresse : iris des marais, carex, salicaire, eupatoire, astilbe, hémérocalles, cornouillers. Sur les bords, des vivaces de sol frais à sec. Paillez avec du broyat." },
      { titre: "Entretien", texte: "Retirez les feuilles qui colmatent l'arrivée, arrosez la première année seulement. Aucun moustique : l'eau ne stagne pas plus de 48 heures." },
    ],
    video: "créer un jardin de pluie noue", liens: ["recuperateur-pluie", "iris-marais", "carex", "astilbe", "drainage-terrain"] }),

  g({ id: "bassin-ornement", titre: "Créer un petit bassin d'ornement", emoji: "💧", rubrique: "fabriquer", niveau: 2, duree: "Un week-end",
    resume: "Emplacement, bâche ou bac préformé, profondeurs étagées, plantes qui gardent l'eau claire, sécurité des enfants et réglementation.",
    alias: ["bassin", "bassin d'ornement", "creer un bassin", "bassin de jardin", "bâche bassin", "bassin préformé", "plantes de bassin", "eau verte bassin", "nénuphar"],
    materiel: ["Bâche EPDM (plus durable que le PVC) ou bassin préformé", "Feutre de protection", "Sable", "Pierres plates pour la margelle", "Plantes aquatiques en paniers"],
    etapes: [
      { titre: "Emplacement", texte: "Mi-ombre (5 à 6 heures de soleil : moins d'algues), loin des grands arbres (feuilles), visible de la maison. Prévoyez une plage en pente douce pour que les animaux qui tombent puissent ressortir." },
      { titre: "Creuser en paliers", texte: "Trois niveaux : bord à 10-20 cm (plantes de berge), palier à 30-40 cm (plantes immergées) et une fosse d'au moins 80 cm sur un tiers de la surface (l'eau n'y gèle pas et reste fraîche l'été). Ôtez cailloux et racines, étalez 5 cm de sable puis le feutre." },
      { titre: "Bâche et remplissage", texte: "Posez la bâche en laissant 50 cm de débord, remplissez progressivement à l'eau de pluie si possible, puis coupez et cachez le bord sous les pierres." },
      { titre: "Planter pour une eau claire", texte: "Un tiers à la moitié de la surface couverte de plantes : nénuphar (surface), plantes oxygénantes immergées (myriophylle, cornifle), plantes de berge (iris des marais, menthe aquatique, populage). Pas de poissons rouges dans un petit bassin : ils mangent têtards et larves et salissent l'eau." },
      { titre: "Sécurité", texte: "Un enfant peut se noyer dans 20 cm d'eau : grille rigide posée juste sous la surface, ou clôture, tant que les enfants sont petits." },
    ],
    video: "créer petit bassin de jardin bâche epdm", liens: ["nenuphar", "iris-marais"] }),

  g({ id: "mur-vegetal", titre: "Mur végétal et façade verte : ce qui marche vraiment", emoji: "🧱", rubrique: "fabriquer",
    resume: "La différence entre grimpantes en façade (simples, durables) et murs végétaux à poches (spectaculaires mais exigeants), et comment réussir chacun.",
    alias: ["mur végétal", "mur vegetal", "façade végétale", "végétaliser un mur", "jardin vertical décoratif", "grimpante sur façade", "mur vert"],
    etapes: [
      { titre: "La solution simple : les grimpantes", texte: "Lierre, vigne vierge et hortensia grimpant s'accrochent seuls (crampons, ventouses) sur un mur sain ; clématites, chèvrefeuilles, jasmins, glycine et rosiers grimpants ont besoin de câbles tendus à 5 cm du mur. Une seule plante bien choisie couvre 10 à 20 m² en quelques années, sans arrosage automatique." },
      { titre: "Le mur à poches", texte: "Des plantes dans un feutre ou des modules fixés au mur, avec arrosage automatique et engrais permanents. Spectaculaire, mais une coupure d'eau d'une semaine en été le tue, et il coûte cher. Réservez-le à une petite surface, à l'ombre ou mi-ombre, avec des plantes robustes (heuchères, fougères, carex, bergénias, fraisiers)." },
      { titre: "Protéger le bâtiment", texte: "Pas de plantes à crampons sur un crépi abîmé, un mur en bois ou un isolant par l'extérieur ; taillez chaque année autour des fenêtres, gouttières et tuiles. Accord de la copropriété pour une façade d'immeuble." },
    ],
    video: "végétaliser un mur grimpantes câbles", liens: ["grimpantes-supports", "vigne-vierge", "lierre-jardin", "clematite"] }),

  g({ id: "arbres-petit-jardin", titre: "Quel arbre pour un petit jardin, ou pour vite faire de l'ombre ?", emoji: "🌳", rubrique: "demarrer",
    resume: "Les arbres qui restent petits, ceux qui poussent vite sans devenir des monstres, les distances légales avec les voisins et les erreurs à ne pas faire.",
    alias: ["arbre petit jardin", "arbre pour petit jardin", "arbre à croissance rapide", "arbre croissance rapide", "ombre rapidement", "arbre pour faire de l'ombre", "arbre d'ombrage", "petit arbre", "arbre terrasse", "quel arbre planter"],
    etapes: [
      { titre: "Les petits arbres (4 à 8 m)", texte: "Amélanchier (fleurs, fruits, automne), arbre de Judée, cerisier à fleurs, érable du Japon, cornouiller des pagodes, lilas des Indes (Sud), pommier d'ornement, olivier (Sud), magnolia de Soulange, sorbier, mimosa (Sud, sol acide). Préférez les sujets en cépée (plusieurs troncs) : plus légers et naturels." },
      { titre: "Vite de l'ombre", texte: "Les arbres qui poussent vite (paulownia, peuplier, saule, bouleau, érable argenté) deviennent grands et fragiles. Pour une terrasse, une tonnelle avec glycine, vigne ou chèvrefeuille fait de l'ombre en 2 ou 3 ans ; un érable champêtre, un tilleul ou un mûrier platane (taillé en tête de chat) donnent une ombre durable en 5 à 8 ans." },
      { titre: "Les distances légales", texte: "Code civil : un arbre de plus de 2 m de haut doit être planté à au moins 2 m de la limite de propriété ; en dessous de 2 m de haut, à 50 cm. Des règles locales (PLU, lotissement) peuvent être plus strictes. Le voisin peut exiger l'élagage des branches qui dépassent chez lui." },
      { titre: "Bien placer", texte: "Regardez la taille ADULTE sur la fiche (pas celle du sujet acheté) : à 5 m au moins des fondations et des canalisations pour les grands arbres, jamais sous une ligne électrique. Plantez de novembre à mars, tuteurez 2 ans, arrosez 3 étés." },
    ],
    video: "quel arbre pour un petit jardin", liens: ["amelanchier", "arbre-judee", "erable-japon", "erable-champetre", "planter-arbre", "budget-reglementation"] }),
];
