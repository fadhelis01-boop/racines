import type { Guide } from "./types";

// Guides des métiers du jardin (audit : technicien arrosage, arboriculteur, pépiniériste, paysagistes)
const g = (x: Omit<Guide, "niveau" | "duree"> & Partial<Pick<Guide, "niveau" | "duree">>): Guide => ({ niveau: 2, duree: "Lecture : 6 minutes", ...x });

export const GUIDES_METIERS: Guide[] = [
  // ───────────── Arrosage ─────────────
  g({ id: "arrosage-automatique", titre: "Installer un arrosage automatique", rubrique: "arrosage", emoji: "🚿", duree: "Une journée",
    resume: "Du robinet aux goutteurs : pression, filtre, programmateur, secteurs, goutte-à-goutte, asperseurs et arrosage enterré de pelouse, puis purge avant l'hiver.",
    alias: ["arrosage automatique", "arrosage enterre", "programmateur arrosage", "programmateur", "filtre arrosage", "reducteur de pression", "pression d eau", "asperseur", "arroseur", "tuyere", "turbine arrosage", "arrosage pelouse", "secteurs arrosage", "electrovanne", "purger arrosage", "hiverner arrosage"],
    etapes: [
      { titre: "Mesurer avant d'acheter", texte: "Débit du robinet : chronométrez le remplissage d'un seau de 10 L (débit en L/min = 10 ÷ secondes × 60). Pression : un manomètre à visser sur le robinet (2 à 4 bars habituellement). Ces deux chiffres décident du nombre de goutteurs ou d'asperseurs qu'on peut faire fonctionner en même temps : la page Calculs le calcule." },
      { titre: "La tête de réseau", texte: "Dans l'ordre depuis le robinet : programmateur, filtre à tamis (indispensable, surtout avec l'eau de pluie ou de puits), réducteur de pression à 1-1,5 bar pour le goutte-à-goutte, raccord au tuyau principal. Un clapet anti-retour protège le réseau d'eau potable." },
      { titre: "Goutte-à-goutte (potager, massifs, haies)", texte: "Tuyau de 16 mm à goutteurs intégrés (tous les 30 cm pour le potager, 50 cm pour les haies) : l'eau va au pied, sans mouiller les feuilles ni arroser les allées. Lignes de 50 m au plus (sinon goutteurs autorégulants), bouchon en bout, piquets tous les mètres, posé sous le paillage." },
      { titre: "Asperseurs et arrosage enterré (pelouse)", texte: "Tuyères (portée 2 à 5 m, petites surfaces) ou turbines (5 à 15 m) placées pour que chaque arroseur atteigne le suivant (recouvrement « tête à tête »). Ne mélangez jamais tuyères et turbines sur un même secteur (débits très différents). Arrosez tôt le matin : moins d'évaporation et de maladies. Une pelouse résistante (fétuques, trèfle) peut souvent se passer d'arrosage." },
      { titre: "Programmer", texte: "Peu souvent et longtemps plutôt que tous les jours un peu : les racines descendent. Repère : 2 à 3 arrosages par semaine en été, durée calculée selon le besoin du mois. Ajoutez une sonde de pluie, ou coupez le programmateur après un orage." },
      { titre: "Avant l'hiver", texte: "Coupez l'eau, ouvrez les bouchons de fin de ligne, videz le réseau (ou soufflez à l'air faible pression), rentrez programmateur, filtre et réducteur hors gel. Nettoyez le filtre chaque printemps." },
    ],
    video: "installer arrosage goutte à goutte programmateur filtre réducteur", liens: ["irrigation-raisonnee", "recuperateur-pluie", "jardin-sec", "puits-forage"] }),

  g({ id: "puits-forage", titre: "Puits, forage et restrictions d'eau", rubrique: "arrosage", emoji: "💧",
    resume: "Ce qu'il faut déclarer avant de creuser, la qualité de l'eau, et ce qui reste permis quand la préfecture prend des mesures de sécheresse.",
    alias: ["puits", "forage", "creuser un puits", "declarer un forage", "declaration de puits", "eau de puits", "secheresse arrete", "restrictions d eau", "arrete secheresse", "vigilance secheresse", "alerte secheresse", "interdiction d arroser", "vigieau"],
    etapes: [
      { titre: "Déclarer avant de creuser", texte: "Tout puits ou forage à usage domestique doit être déclaré en mairie au moins un mois avant les travaux (formulaire Cerfa n° 13837), puis à nouveau après réalisation. Au-delà de 1 000 m³ prélevés par an, ou en zone protégée, d'autres démarches s'ajoutent auprès de la direction départementale des territoires. Renseignez-vous aussi sur le règlement local (périmètres de captage d'eau potable)." },
      { titre: "Bien le réaliser", texte: "Faites appel à un foreur qualifié : tête de puits étanche et surélevée, protégée des ruissellements, loin des fosses septiques et des fumières (au moins 35 m conseillés). Un forage mal fait pollue la nappe de tout le voisinage." },
      { titre: "La qualité de l'eau", texte: "L'eau d'un puits n'est pas potable par défaut : faites-la analyser par un laboratoire agréé (nitrates, bactéries) avant tout usage alimentaire, y compris pour arroser des légumes mangés crus. Le réseau du puits ne doit jamais être relié à celui de l'eau potable de la maison (risque de retour d'eau)." },
      { titre: "Les restrictions de sécheresse", texte: "La préfecture fixe des niveaux (vigilance, alerte, alerte renforcée, crise) par zone : consultez la carte officielle des restrictions (site VigiEau) pour votre commune. Le plus souvent : arrosage des pelouses et massifs interdit ou limité aux heures fraîches, potager toléré le soir ou la nuit, goutte-à-goutte parfois autorisé plus longtemps. L'eau de pluie récupérée reste en général utilisable librement ; l'eau de puits ou de forage est en principe soumise aux mêmes restrictions." },
      { titre: "S'y préparer", texte: "Paillage, goutte-à-goutte, récupérateurs d'eau de pluie, plantes sobres et arrosage au pied : un jardin préparé passe une période d'alerte sans dommage." },
    ],
    video: "déclarer un forage puits mairie", liens: ["jardin-sec", "recuperateur-pluie", "arrosage-automatique", "voisinage-regles"] }),

  // ───────────── Arboriculture ─────────────
  g({ id: "taille-par-fruitier", titre: "Tailler chaque fruitier : formation et fructification", rubrique: "recolte", emoji: "✂️", niveau: 3,
    resume: "Chaque espèce porte ses fruits sur un bois différent : la taille du pommier ne convient pas au pêcher. Formation des jeunes arbres, puis taille de fructification espèce par espèce.",
    alias: ["taille du pommier", "tailler un pommier", "tailler un poirier", "tailler un pecher", "tailler un abricotier", "tailler un cerisier", "tailler un prunier", "tailler la vigne", "taille de la vigne", "tailler les framboisiers", "tailler un groseillier", "tailler un cassissier", "taille de fructification", "taille de formation", "lambourde", "dard", "brindille couronnee"],
    etapes: [
      { titre: "Formation (3 à 5 premières années)", texte: "On construit la charpente : 3 à 5 branches principales bien réparties autour du tronc, ou un axe central selon la forme choisie. On raccourcit les prolongements d'un tiers au-dessus d'un bourgeon bien orienté, on supprime ce qui part vers l'intérieur. L'arbre ne doit pas encore trop porter de fruits." },
      { titre: "Pommier et poirier", texte: "Ils fructifient sur du bois de 2 ans et plus : dards et lambourdes (rameaux courts à gros bourgeons ronds). En hiver : supprimez les gourmands (rameaux verticaux vigoureux), raccourcissez les rameaux à bois de l'année à 3-4 yeux, éclaircissez les vieilles lambourdes trop ramifiées. En été (juillet-août), une taille en vert raccourcit les pousses vigoureuses et favorise les boutons à fleurs." },
      { titre: "Pêcher et nectarinier", texte: "Ils ne fructifient que sur les rameaux de l'année précédente, une seule fois. Chaque année, au moment de la floraison (mars), coupez les rameaux qui ont déjà porté et gardez des rameaux de remplacement près des charpentières. Un pêcher non taillé ne porte plus qu'en bout de branches." },
      { titre: "Abricotier, cerisier, prunier", texte: "Taille légère et en été, juste après la récolte, par temps sec : la taille d'hiver favorise la gomme et les maladies du bois. Aérez le centre, supprimez le bois mort et les branches qui se croisent ; ne raccourcissez pas systématiquement." },
      { titre: "Vigne", texte: "Taille courte en fin d'hiver (février-mars, hors gel) : sur chaque bras, gardez un rameau de l'an passé taillé à 2 yeux (« coursons ») ; chaque œil donnera un rameau portant 1 à 2 grappes. En été, pincez les rameaux 2 feuilles après la dernière grappe et retirez les entre-cœurs." },
      { titre: "Petits fruits", texte: "Framboisier non remontant : après la récolte, coupez au ras du sol les cannes qui ont porté et gardez 6 à 8 jeunes cannes par mètre. Remontant : tout couper au ras en février pour une seule belle récolte d'automne. Groseillier et cassissier : en hiver, retirez à la base les branches de plus de 3 ans (écorce sombre) et gardez 8 à 10 branches." },
    ],
    erreurs: ["Tailler un pêcher comme un pommier (plus de fruits au bout de 2 ans).", "Tailler cerisiers et pruniers en plein hiver.", "Couper tous les rameaux courts d'un pommier : ce sont eux qui portent les fruits."],
    video: "taille de fructification pommier pêcher différence", liens: ["taille-fruitiers", "formes-fruitieres", "pommier", "pecher", "vigne", "framboisier"] }),

  g({ id: "formes-fruitieres", titre: "Les formes fruitières : palmette, cordon, gobelet, fuseau, haute-tige", rubrique: "recolte", emoji: "🍐", niveau: 3,
    resume: "Choisir la forme d'un fruitier selon la place, le porte-greffe et l'espèce, et la conduire les premières années.",
    alias: ["forme fruitiere", "formes fruitieres", "palmette", "palmette verrier", "cordon", "cordon de pommier", "cordon horizontal", "gobelet", "fuseau", "axe central", "haute tige", "demi tige", "basse tige", "espalier", "contre espalier", "arbre palisse"],
    etapes: [
      { titre: "Haute-tige et demi-tige", texte: "Tronc de 1,8 à 2 m (haute-tige) ou 1,2 à 1,5 m (demi-tige), sur porte-greffe vigoureux : grand arbre durable, sous lequel on peut faire pâturer des moutons ou tondre. Production plus tardive (5 à 8 ans), mais pendant des décennies." },
      { titre: "Fuseau (axe central)", texte: "Un tronc vertical garni de branches fruitières courtes, plus longues en bas : arbre de 2 à 3 m sur porte-greffe faible (M9, M106 pour le pommier), productif dès la 3e année, idéal au petit jardin, à 1,5-2,5 m d'intervalle." },
      { titre: "Gobelet", texte: "Centre ouvert, 3 à 4 charpentières en coupe : la forme naturelle du pêcher, de l'abricotier et du prunier, qui aiment la lumière au centre." },
      { titre: "Palmette et espalier", texte: "Arbre palissé à plat contre un mur ou des fils tendus : branches horizontales (palmette à branches horizontales) ou en U (palmette Verrier). Le mur restitue la chaleur : idéal pour poiriers, pêchers et abricotiers en région fraîche. Demande une taille en vert régulière." },
      { titre: "Cordon", texte: "Pommier ou poirier sur porte-greffe très faible, conduit sur un seul bras horizontal à 40-50 cm du sol : il borde une allée du potager, produit beaucoup pour sa taille. Plantez à 1,5-2 m d'intervalle, courbez la tige progressivement la 1re année." },
      { titre: "Accorder forme et porte-greffe", texte: "Une forme basse exige un porte-greffe faible (sinon l'arbre « s'emballe »), une haute-tige un porte-greffe vigoureux. Achetez un « scion » d'un an (tige simple) pour former vous-même, ou une forme déjà formée en pépinière." },
    ],
    video: "palmette cordon fuseau formes fruitières conduite", liens: ["taille-par-fruitier", "pommier", "poirier", "planter-verger"] }),

  g({ id: "planter-verger", titre: "Planter un verger, et le soigner en hiver", rubrique: "recolte", emoji: "🌳", niveau: 2,
    resume: "Combien d'arbres, à quelles distances, comment placer les pollinisateurs, le verger pâturé, et les traitements d'hiver avec leurs limites.",
    alias: ["planter un verger", "verger familial", "creer un verger", "distance entre arbres fruitiers", "verger pature", "pre verger", "traitement d hiver", "huile blanche", "huile de paraffine", "cuivre automne", "badigeon tronc", "traiter les fruitiers en hiver"],
    etapes: [
      { titre: "Combien et lesquels", texte: "Pour une famille : 2 à 3 pommiers de maturités échelonnées (été, automne, hiver de garde), 1 à 2 poiriers, 1 prunier ou mirabellier, 1 cerisier, et des petits fruits. Choisissez des variétés rustiques et résistantes adaptées à votre région (les associations de croqueurs de pommes conseillent les variétés locales)." },
      { titre: "Distances", texte: "Haute-tige : 8 à 10 m entre arbres. Demi-tige : 5 à 6 m. Basse-tige sur porte-greffe faible : 3 à 4 m. Fuseau : 1,5 à 2,5 m. Cordon : 1,5 à 2 m. Respectez 2 m de la limite de propriété pour les arbres de plus de 2 m de haut." },
      { titre: "Les pollinisateurs", texte: "Intercalez les variétés qui se pollinisent entre elles, à moins de 50 m les unes des autres, et à floraison simultanée : la fiche de chaque fruitier précise ses besoins. Les abeilles et pollinisateurs sauvages font le reste : haie fleurie, pas de traitement pendant la floraison." },
      { titre: "Le verger pâturé (pré-verger)", texte: "Hautes-tiges sur prairie, pâturée par des moutons : protégez chaque tronc par une cage solide (les moutons écorcent les jeunes arbres ; chèvres et chevaux sont à proscrire). L'herbe remplace la tonte, les animaux mangent les fruits tombés (et les larves de carpocapse)." },
      { titre: "Les traitements d'hiver et leurs limites", texte: "Huile de paraffine (« huile blanche », autorisée en bio) en fin d'hiver, avant le débourrement : étouffe les œufs de pucerons et les cochenilles, mais aussi les auxiliaires qui hivernent sur l'arbre : à réserver aux arbres très attaqués l'année précédente. Cuivre (bouillie bordelaise) à la chute des feuilles et au gonflement des bourgeons contre la cloque du pêcher et les chancres : à faible dose, car il s'accumule dans le sol (doses annuelles maximales réglementées). Le badigeon d'argile ou de chaux protège l'écorce du soleil d'hiver. Un verger varié, avec haies et nichoirs, demande de moins en moins de traitements." },
    ],
    video: "planter un verger familial distances pollinisation", liens: ["planter-arbre", "formes-fruitieres", "pommier", "cloque", "puceron-cendre", "paturage-tournant"] }),

  // ───────────── Pépinière ─────────────
  g({ id: "elever-en-pot", titre: "Élever des plantes en pot sur plusieurs années (méthode de pépinière)", rubrique: "semis", emoji: "🌱", niveau: 3,
    resume: "Le substrat, les rempotages successifs, le chignon racinaire, l'arrosage, l'engrais et l'hivernage des jeunes plantes cultivées en conteneur.",
    alias: ["elever en pot", "culture en conteneur", "conteneur", "pepiniere en pot", "chignon racinaire", "racines qui tournent", "air pot", "rempotage progressif", "hiverner des pots", "jeunes arbres en pot", "substrat pepiniere"],
    etapes: [
      { titre: "Le substrat", texte: "Plus grossier que le terreau de semis : écorce compostée, fibre de coco ou de bois, compost mûr et un peu de terre ou de sable pour le poids. Un substrat qui se tasse et reste détrempé fait pourrir les racines. Préférez les mélanges sans tourbe." },
      { titre: "Rempoter progressivement", texte: "Passez à un pot 1,5 à 2 fois plus grand dès que les racines atteignent les parois, pas avant (un trop grand pot reste humide et froid). Chaque rempotage, au printemps de préférence, en démêlant les racines extérieures." },
      { titre: "Éviter le chignon", texte: "Des racines qui tournent en rond au fond du pot continueront de tourner une fois plantées, et l'arbre tiendra mal. Pots ajourés (« air-pot ») ou pots à rainures verticales, rempotage à temps, et à la plantation, incisez les racines qui tournent." },
      { titre: "Arroser et nourrir", texte: "Arrosage regroupé et régulier (goutte-à-goutte ou capillarité sur une nappe) : un pot sèche en une journée d'été. Engrais à libération lente au printemps ; plus d'engrais après juillet, pour que le bois s'aoûte (durcisse) avant l'hiver." },
      { titre: "Hiverner", texte: "Les racines en pot sont bien plus sensibles au gel que la partie aérienne : groupez les pots contre un mur, enterrez-les dans du sable ou entourez-les de paille ou de feuilles. Les plantes rustiques restent dehors, à l'abri des vents." },
      { titre: "Endurcir avant de planter", texte: "Une plante élevée sous abri passe une à deux semaines dehors, à l'ombre puis au soleil, avant sa plantation définitive." },
    ],
    video: "culture en conteneur pépinière rempotage chignon racinaire", liens: ["produire-ses-plants", "rempoter", "hivernage-pots", "acheter-arbres"] }),

  g({ id: "acheter-arbres", titre: "Acheter des plants et des arbres de qualité", rubrique: "demarrer", emoji: "🏷️", niveau: 1,
    resume: "Ce qu'il faut regarder en pépinière : racines, collet, étiquette, passeport phytosanitaire, garantie de reprise, et quand préférer les racines nues.",
    alias: ["acheter des plants", "acheter un arbre", "bien choisir un arbre", "pepiniere", "pepinieriste", "plants certifies", "passeport phytosanitaire", "etiquette plante", "garantie de reprise", "vegetal local label", "jardinerie ou pepiniere"],
    etapes: [
      { titre: "Les racines d'abord", texte: "Sortez la motte du pot si on vous y autorise : racines claires et nombreuses, sans chignon serré ni odeur de pourri. Racines nues : fraîches, souples, sans dessèchement, abondant chevelu. Une plante très grande dans un petit pot reprend moins bien qu'un jeune sujet." },
      { titre: "Le collet et le tronc", texte: "Écorce saine, sans blessure ni chancre, point de greffe bien soudé. Pour un fruitier, préférez un scion d'un an ou un jeune arbre formé de 2 ans : il reprend mieux qu'un gros sujet." },
      { titre: "L'étiquette", texte: "Nom latin, variété (cultivar), et pour un fruitier le porte-greffe : c'est lui qui donne la taille adulte. Un « pommier » sans variété ni porte-greffe est un achat au hasard." },
      { titre: "Garanties et traçabilité", texte: "Le passeport phytosanitaire accompagne de nombreux végétaux vendus aux professionnels et certains végétaux vendus aux particuliers (notamment ceux sensibles à des organismes réglementés comme Xylella) : il garantit l'origine contrôlée. Le label « Végétal local » garantit des plantes sauvages d'origine régionale pour les haies. Demandez la garantie de reprise, fréquente chez les pépiniéristes." },
      { titre: "Racines nues, motte ou conteneur", texte: "Racines nues (novembre à mars) : moins chères, reprise excellente si plantées vite. Motte grillagée : arbres plus gros, persistants. Conteneur : toute l'année hors été et gel, plus cher. Un bon pépiniériste producteur conseille les variétés adaptées à votre sol et votre climat." },
    ],
    video: "bien choisir un arbre en pépinière racines", liens: ["planter-arbre", "elever-en-pot", "acheter-plants", "choisir-plante"] }),

  // ───────────── Conception ─────────────
  g({ id: "concevoir-jardin", titre: "Concevoir son jardin comme un paysagiste", rubrique: "demarrer", emoji: "📐", niveau: 2, duree: "Plusieurs semaines d'observation",
    resume: "Relevé du terrain, programme, esquisse, plan à l'échelle, strates et palette végétale : la méthode des concepteurs paysagistes, adaptée à un jardin familial.",
    alias: ["concevoir son jardin", "conception jardin", "plan de jardin", "faire un plan de jardin", "dessiner son jardin", "amenager son jardin", "creer un jardin", "palette vegetale", "strates vegetales", "strates", "esquisse jardin", "plan masse", "releve terrain", "paysagiste"],
    etapes: [
      { titre: "1. Le relevé", texte: "Mesurez le terrain et ce qui existe (maison, arbres, réseaux enterrés, regards, compteurs). Notez le nord, l'ensoleillement heure par heure en été et en hiver (les ombres changent beaucoup), les vents dominants, les vues à garder ou à cacher, la pente, les zones humides, et faites le test de votre sol." },
      { titre: "2. Le programme", texte: "Listez vos usages (repas dehors, jeux d'enfants, potager, poules, détente, stockage, compost), le budget, et surtout le temps d'entretien que vous acceptez par semaine : un jardin se conçoit pour l'entretien qu'on pourra vraiment lui donner." },
      { titre: "3. L'esquisse", texte: "Sur un calque posé sur le relevé, dessinez des « bulles » d'usages placées selon le soleil, les accès et l'intimité (terrasse au soleil près de la cuisine, potager près du point d'eau, compost loin des fenêtres), puis les circulations qui les relient." },
      { titre: "4. Le plan à l'échelle", texte: "Reportez le projet à l'échelle (1/100 : 1 cm = 1 m ; 1/50 pour les détails) : allées, terrasses, massifs, arbres dessinés à leur diamètre ADULTE (c'est l'erreur la plus fréquente). Le plan du jardin de Racines permet de placer ces éléments à l'échelle et de l'exporter." },
      { titre: "5. Les strates", texte: "Un jardin équilibré superpose les strates comme une lisière de forêt : arbres (ombre, structure), arbustes (écrans, haies), vivaces et graminées (masses fleuries), couvre-sols (sol toujours couvert), bulbes (printemps). Pensez aux quatre saisons : écorces, persistants et graminées pour l'hiver." },
      { titre: "6. La palette végétale", texte: "Choisissez un nombre limité d'espèces (5 à 7 plantes de structure, répétées) adaptées au sol et au climat (rusticité, exposition), plutôt qu'une plante de chaque. Répéter une même plante en plusieurs points unifie le jardin. Les fiches Racines donnent rusticité, hauteur, feuillage, floraison et sol de chaque plante." },
      { titre: "7. Phaser les travaux", texte: "Ordre logique : terrassements et réseaux (drainage, arrosage, électricité), allées et terrasses, arbres et haies (en hiver), puis arbustes, vivaces et gazon. Un jardin se construit souvent en 2 ou 3 saisons." },
    ],
    video: "concevoir son jardin comme un paysagiste étapes plan", liens: ["permaculture", "planter-arbre", "vivaces-guide", "jardin-accessible-pente", "budget-reglementation"] }),

  g({ id: "jardin-accessible-pente", titre: "Jardin accessible et jardin en pente", rubrique: "demarrer", emoji: "♿", niveau: 2,
    resume: "Un jardin praticable avec l'âge, un fauteuil ou une poussette, et l'aménagement d'un terrain en pente : terrasses, talus, escaliers, érosion.",
    alias: ["jardin accessible", "jardin pmr", "jardin fauteuil roulant", "jardin pour personnes agees", "jardiner assis", "bac sureleve hauteur", "terrain en pente", "jardin en pente", "talus", "restanques", "terrasses de culture", "escalier de jardin", "erosion", "gabion"],
    etapes: [
      { titre: "Circuler sans obstacle", texte: "Allées principales de 1,20 à 1,50 m de large, pente de 5 % au plus (au-delà, prévoir des paliers), revêtement stable et non glissant (stabilisé compacté, dalles jointives), sans marche ni bordure saillante. Éclairage des passages et mains courantes là où il y a un dénivelé." },
      { titre: "Cultiver à bonne hauteur", texte: "Bacs surélevés de 70 à 80 cm de haut pour jardiner debout sans se pencher ; 60 à 70 cm avec un espace libre dessous pour les genoux en fauteuil ; largeur de 1,20 m au plus si on travaille des deux côtés (60 cm d'un seul côté). Robinets et réserves d'eau à hauteur de main, outils à long manche légers." },
      { titre: "Moins d'efforts", texte: "Paillage permanent, goutte-à-goutte programmé, vivaces plutôt qu'annuelles, assises à l'ombre le long du parcours. Les plantes parfumées et à toucher (sauges, lavandes, graminées) enrichissent le jardin pour les personnes malvoyantes." },
      { titre: "Terrain en pente : travailler avec", texte: "Plantez et formez les rangs en suivant les courbes de niveau, jamais dans le sens de la pente (l'eau ravine). Sur un talus, couvre-sols et arbustes à racines traçantes (cornouiller, millepertuis, rosiers couvre-sol) sur un paillage ou une toile biodégradable tiennent la terre." },
      { titre: "Terrasses et soutènements", texte: "Des terrasses (restanques) retenues par des murets en pierre sèche, rondins ou gabions transforment une pente en planches cultivables. Au-delà d'environ 1 m de terre à retenir, un mur de soutènement se calcule : faites appel à un professionnel." },
      { titre: "Escaliers de jardin", texte: "Marches confortables quand deux hauteurs plus une profondeur font environ 63 cm (par exemple 15 cm de haut et 33 cm de profondeur), hauteurs toutes identiques, avec une légère pente vers l'avant pour l'écoulement de l'eau." },
    ],
    video: "aménager un jardin en pente terrasses talus", liens: ["muret-pierre-seche", "methodes-culture", "couvre-sols-rocaille", "concevoir-jardin"] }),

  // ───────────── Travaux paysagers ─────────────
  g({ id: "allees-terrasses", titre: "Allées et terrasses : gravier, stabilisé, dalles, bois", rubrique: "fabriquer", emoji: "🧱", niveau: 2, duree: "1 à 3 week-ends",
    resume: "Choisir le revêtement selon l'usage, préparer un fond solide, poser une allée de gravier ou de pas japonais, une terrasse en dalles ou en bois.",
    alias: ["allee de jardin", "allees", "faire une allee", "allee en gravier", "stabilise", "pas japonais", "faire une terrasse", "terrasse en bois", "terrasse en dalles", "dalles sur plots", "bordure", "geotextile", "terrasse sans beton"],
    etapes: [
      { titre: "Choisir selon l'usage", texte: "Passage quotidien, brouette, fauteuil : stabilisé compacté ou dalles. Allée secondaire : gravier, copeaux, pas japonais dans l'herbe. Terrasse de repas : dalles (pierre, béton, grès) ou bois. Privilégiez les sols perméables : l'eau de pluie s'infiltre au lieu de ruisseler vers la maison." },
      { titre: "Le fond, c'est la solidité", texte: "Décaissez de 15 à 20 cm (allée piétonne) ou davantage pour un passage de voiture, posez un géotextile (il empêche le mélange avec la terre et freine les herbes), puis une couche de grave (cailloux concassés de différentes tailles) compactée en plusieurs fois. Prévoyez une légère pente (1 à 2 %) pour l'écoulement de l'eau." },
      { titre: "Bordures", texte: "Bordures en acier, bois, pierre ou briques posées avant le revêtement : elles retiennent le gravier et rendent le dessin net. Indispensables pour le gravier et le stabilisé." },
      { titre: "Gravier et stabilisé", texte: "Gravier roulé (agréable mais instable sous les roues) ou concassé de 6/10 mm sur 4 à 5 cm. Stabilisé : sable calcaire ou concassé fin, arrosé et compacté au rouleau, très praticable. Pas japonais : dalles posées à fleur de gazon, espacées de 60 à 65 cm (un pas)." },
      { titre: "Terrasse en dalles", texte: "Sur lit de sable ou de gravillons compactés (pose « drainante », sans béton), avec joints de sable, ou sur plots réglables au-dessus d'un sol stable. Pente de 1 à 2 % à l'opposé de la maison." },
      { titre: "Terrasse en bois", texte: "Lambourdes posées sur plots ou sur dés de béton, jamais directement sur la terre, espacées de 40 à 50 cm ; essences durables (mélèze, châtaignier, robinier) ou bois traité classe 4 pour les lambourdes. Laissez 5 mm entre les lames et une bonne ventilation dessous." },
    ],
    video: "faire une allée en gravier géotextile bordure", liens: ["concevoir-jardin", "drainage-terrain", "budget-reglementation", "materiaux-recup"] }),

  g({ id: "muret-pierre-seche", titre: "Monter un muret en pierre sèche", rubrique: "fabriquer", emoji: "⛰️", niveau: 3, duree: "Un week-end par mètre linéaire",
    resume: "Un muret sans mortier, durable et plein de vie (lézards, insectes, plantes de rocaille) : fondation, fruit, boutisses, remplissage.",
    alias: ["muret", "muret en pierre seche", "pierre seche", "mur en pierres", "monter un muret", "restanque", "mur de soutenement", "gabion"],
    etapes: [
      { titre: "Les pierres", texte: "Trois sortes : de grosses pierres plates pour la base, des pierres de parement (la face visible) et des boutisses (pierres longues qui traversent le mur et le lient, une tous les mètres par rang), plus des cailloux de remplissage. Comptez environ 1,5 tonne de pierres par m² de mur de 50 cm d'épaisseur." },
      { titre: "La fondation", texte: "Une tranchée de 15 à 20 cm de profondeur, un peu plus large que le mur, au sol compacté : les plus grosses pierres y sont posées à plat, légèrement inclinées vers l'intérieur." },
      { titre: "Le fruit", texte: "Le mur se rétrécit en montant : ses faces s'inclinent vers l'intérieur d'environ 10 à 15 cm par mètre de hauteur. C'est ce « fruit » qui lui donne sa stabilité sans mortier. Un gabarit en bois tendu de cordeaux aide à le respecter." },
      { titre: "Monter", texte: "Chaque pierre repose sur deux pierres du rang inférieur (on « croise les joints », comme des briques), le côté le plus long vers l'intérieur du mur. Calez par derrière avec les cailloux de remplissage, jamais par devant. Finissez par un couronnement de pierres plates ou posées de chant." },
      { titre: "Soutènement : la limite", texte: "Un muret de soutènement doit être plus épais à la base, très incliné vers la terre retenue, et drainé (gravier derrière). Au-delà d'environ 1 m de terre retenue, faites calculer et réaliser l'ouvrage par un professionnel." },
    ],
    video: "monter un muret en pierre sèche fruit boutisses", liens: ["jardin-accessible-pente", "couvre-sols-rocaille", "hotel-insectes"] }),

  g({ id: "drainage-terrain", titre: "Drainer un terrain humide", rubrique: "sol", emoji: "💧", niveau: 2,
    resume: "Diagnostiquer pourquoi l'eau stagne, puis choisir la bonne solution : améliorer le sol, cultiver en buttes, créer une noue, ou poser un drain.",
    alias: ["drainage", "drainage jardin", "drainer un terrain", "terrain humide", "eau stagnante", "sol detrempe", "flaques jardin", "drain agricole", "noue", "puits perdu", "sol argileux humide"],
    etapes: [
      { titre: "Le test d'infiltration", texte: "Creusez un trou de 30 cm, remplissez-le d'eau, laissez s'écouler, remplissez à nouveau et mesurez la baisse en une heure. Plus de 2,5 cm par heure : drainage correct. Moins de 1 cm par heure : sol très mal drainé (argile compacte, semelle de labour, nappe proche)." },
      { titre: "Améliorer le sol", texte: "Sur une petite surface, apports réguliers de matière organique (compost, BRF), engrais verts à racines profondes (féverole, radis fourrager) et paillage améliorent la structure en 2 à 3 ans. Évitez de marcher ou de travailler un sol détrempé (il se tasse)." },
      { titre: "Cultiver au-dessus", texte: "Buttes, planches surélevées et bacs gardent les racines hors de l'eau d'hiver : la solution la plus simple pour un potager sur sol lourd." },
      { titre: "Une noue ou une mare", texte: "Plutôt que d'évacuer l'eau, recueillez-la : une noue (fossé large et peu profond, engazonné ou planté) ou une mare au point bas recueille le ruissellement et l'infiltre lentement. Plantez-y des plantes de milieu humide (iris des marais, cornouillers, saules)." },
      { titre: "Poser un drain", texte: "Tranchée de 50 à 80 cm, pente régulière d'au moins 0,5 à 1 % vers un exutoire (fossé, noue, puits perdu), géotextile, lit de gravier, drain annelé, gravier par-dessus, géotextile replié, terre. Un réseau de drains se pose en arêtes de poisson tous les 5 à 10 m. Le rejet dans le réseau public ou chez le voisin nécessite une autorisation : renseignez-vous en mairie." },
    ],
    video: "drainer un terrain humide drain gravier noue", liens: ["connaitre-sol", "methodes-culture", "hotel-insectes", "concevoir-jardin"] }),

  g({ id: "cloture-cache-vue", titre: "Clôtures, cache-vue et brise-vent", rubrique: "fabriquer", emoji: "🌿", niveau: 1,
    resume: "Clore, se protéger des regards et du vent : haie vivante, clôture doublée d'une haie, brise-vue en bois ou végétal, et les règles à respecter.",
    alias: ["cloture", "faire une cloture", "cache vue", "brise vue", "brise-vent", "brise vent", "se proteger du vis a vis", "vis a vis", "haie brise vent", "palissade", "grillage", "ganivelle", "hauteur cloture"],
    etapes: [
      { titre: "Ce que dit la règle", texte: "La hauteur et l'aspect des clôtures sont fixés par le plan local d'urbanisme (PLU) ou le règlement du lotissement ; dans certaines communes ou secteurs protégés, une déclaration préalable est exigée. Consultez la mairie avant d'acheter. Une haie plantée à moins de 2 m de la limite ne doit pas dépasser 2 m de haut." },
      { titre: "Le brise-vent qui marche", texte: "Un brise-vent efficace laisse passer environ 40 à 50 % du vent (haie champêtre, ganivelle, claie) : un mur plein crée des tourbillons derrière lui. Il protège sur une distance de 10 à 15 fois sa hauteur." },
      { titre: "Clôture + haie", texte: "Le plus durable : un grillage simple doublé d'une haie mélangée côté jardin. Le grillage protège tout de suite (animaux, enfants), la haie fera l'intimité en 3 à 5 ans et accueillera oiseaux et insectes. Laissez des passages de 15 cm au bas du grillage pour les hérissons." },
      { titre: "Brise-vue rapides", texte: "Claies et ganivelles en châtaignier, panneaux en osier, treillage couvert de grimpantes (chèvrefeuille, jasmin étoilé, clématites persistantes, lierre) : intimité en une saison. Évitez les bâches plastiques qui se dégradent vite et prennent le vent." },
      { titre: "Contre le bruit", texte: "Une haie n'arrête presque pas le bruit ; seuls un mur ou un merlon (talus de terre planté) massifs le réduisent. Le bruit de l'eau (fontaine) masque agréablement le fond sonore." },
    ],
    video: "brise vue végétal rapide haie grillage", liens: ["haie", "grimpantes-supports", "budget-reglementation", "voisinage-regles"] }),

  g({ id: "eclairage-jardin", titre: "Éclairer son jardin sans gêner la nuit", rubrique: "fabriquer", emoji: "💡", niveau: 1,
    resume: "Éclairer les passages et la terrasse en sécurité électrique, et limiter la pollution lumineuse qui perturbe hérissons, chauves-souris et insectes.",
    alias: ["eclairage jardin", "eclairer le jardin", "lumiere jardin", "spot jardin", "lampe solaire", "eclairage solaire", "eclairage basse tension", "pollution lumineuse", "eclairage terrasse"],
    etapes: [
      { titre: "Éclairer utile", texte: "Les passages, les marches, l'entrée et la terrasse quand on l'utilise. Inutile d'éclairer les arbres toute la nuit : la lumière artificielle désoriente les insectes et les chauves-souris, retarde le sommeil des oiseaux et attire les papillons de nuit, pollinisateurs eux aussi." },
      { titre: "Les bons réglages", texte: "Lumière orientée vers le sol (jamais vers le ciel), lampes chaudes (2 700 K ou moins, couleur ambrée), détecteur de présence ou minuterie qui éteint vers 23 h. Évitez les guirlandes et spots allumés en permanence." },
      { titre: "La sécurité électrique", texte: "Matériel conçu pour l'extérieur (indice de protection IP65 au moins pour les luminaires exposés à la pluie), câble enterré à 50 cm sous gaine rouge avec grillage avertisseur, circuit protégé par un disjoncteur différentiel 30 mA. Le plus simple et le plus sûr : un éclairage très basse tension (12 V) par transformateur, ou des lampes solaires." },
      { titre: "Les lampes solaires", texte: "Faciles à poser sans câble, mais à choisir de bonne qualité (batterie remplaçable) ; en hiver, elles éclairent peu. Recyclez les batteries en déchetterie." },
    ],
    video: "éclairage de jardin basse tension pollution lumineuse", liens: ["jardin-sobre", "hotel-insectes", "concevoir-jardin"] }),

  g({ id: "budget-reglementation", titre: "Budget et règles d'un aménagement de jardin", rubrique: "demarrer", emoji: "📋", niveau: 1,
    resume: "Des ordres de grandeur de coût au m² (en le faisant soi-même ou par un professionnel), et les autorisations à demander pour un abri, une clôture, une piscine ou une terrasse.",
    alias: ["budget amenagement jardin", "prix amenagement jardin", "cout jardin", "combien coute un jardin", "prix au m2 jardin", "devis paysagiste", "abri de jardin declaration", "declaration prealable", "permis de construire jardin", "piscine declaration", "plu jardin", "urbanisme jardin"],
    etapes: [
      { titre: "Ordres de grandeur (fournitures, en le faisant soi-même)", texte: "Pelouse semée : 1 à 3 € par m². Gazon en rouleaux : 5 à 10 € par m². Allée de gravier avec géotextile et bordure : 10 à 25 € par m². Massif de vivaces et couvre-sols : 15 à 40 € par m² selon la densité. Haie champêtre en jeunes plants : 5 à 15 € par mètre. Terrasse en dalles posées sur gravier : 30 à 80 € par m²." },
      { titre: "Par un professionnel", texte: "Comptez en général 2 à 4 fois ces montants, main-d'œuvre comprise (par exemple 30 à 80 € par m² pour une allée, 80 à 200 € par m² pour une terrasse, 150 à 400 € par m² de face pour un muret en pierre sèche). Ces chiffres varient beaucoup selon la région, l'accès et les matériaux : demandez plusieurs devis détaillés. Les services à la personne (entretien du jardin) ouvrent droit à un crédit d'impôt, pas les travaux de création." },
      { titre: "Abri de jardin", texte: "Moins de 5 m² : pas d'autorisation (hors secteur protégé). De 5 à 20 m² : déclaration préalable. Plus de 20 m² : permis de construire. Le PLU peut fixer des règles d'aspect et d'implantation. Un abri de plus de 5 m² peut entrer dans le calcul de la taxe d'aménagement." },
      { titre: "Piscine et terrasse", texte: "Piscine de moins de 10 m² : pas d'autorisation ; de 10 à 100 m² non couverte : déclaration préalable ; au-delà, permis. Une terrasse de plain-pied ne demande en général pas d'autorisation, mais une terrasse surélevée ou dans un secteur protégé peut en demander une." },
      { titre: "Murs et clôtures", texte: "Clôture : selon le PLU et la commune (déclaration préalable parfois exigée). Mur de plus de 2 m de haut : déclaration préalable. Dans tous les cas, renseignez-vous en mairie ou sur le PLU en ligne avant les travaux : une construction non autorisée peut devoir être démolie." },
    ],
    video: "abri de jardin déclaration préalable règles", liens: ["concevoir-jardin", "voisinage-regles", "cloture-cache-vue", "jardin-sans-argent"] }),
];
