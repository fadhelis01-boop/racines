import type { Guide } from "./types";

// Maraîchage bio professionnel et fait-maison écologique à petit prix
const g = (x: Omit<Guide, "niveau" | "duree"> & Partial<Pick<Guide, "niveau" | "duree">>): Guide => ({ niveau: 2, duree: "Lecture : 6 minutes", ...x });

export const GUIDES_BIO_LOWTECH: Guide[] = [
  g({ id: "devenir-maraicher", titre: "Devenir maraîcher bio : les étapes et le réalisme", rubrique: "demarrer", emoji: "🧑‍🌾", niveau: 3,
    resume: "Formation, test d'activité, accès à la terre, statut, investissements et premières années : ce qu'il faut savoir avant de s'installer en maraîchage bio diversifié.",
    alias: ["devenir maraicher", "devenir maraicher bio", "s installer en maraichage", "installation agricole", "bprea", "dja", "dotation jeunes agriculteurs", "espace test agricole", "terre de liens", "trouver des terres", "reconversion agricole", "vivre du maraichage"],
    etapes: [
      { titre: "Se former et se tester", texte: "Le BPREA (brevet professionnel de responsable d'entreprise agricole) est la formation de référence pour adultes ; il ouvre droit aux aides à l'installation. Avant de s'engager, travaillez une ou deux saisons chez des maraîchers (wwoofing, salariat, stages) puis testez votre projet en grandeur réelle dans un espace-test agricole, qui prête terre, matériel et accompagnement pendant 1 à 3 ans." },
      { titre: "Trouver la terre", texte: "Il faut de l'eau d'abord, puis un sol correct, un accès, et si possible un bâtiment. Pistes : le point accueil installation de la chambre d'agriculture, la SAFER (ventes de terres), Terre de Liens (terres achetées par épargne citoyenne et louées en bail rural), les communes qui créent des régies ou des fermes municipales, et les cédants qui partent à la retraite." },
      { titre: "Le statut et les aides", texte: "Au-delà d'une surface ou d'un temps de travail minimal, on cotise à la MSA comme chef d'exploitation. Les aides (dotation jeunes agriculteurs avant 40 ans, aides régionales, prêts d'honneur) demandent un plan d'entreprise validé. Le point accueil installation oriente gratuitement vers les bons interlocuteurs." },
      { titre: "Investir juste", texte: "Irrigation, tunnels, chambre froide, outils, véhicule de livraison : de quelques dizaines de milliers d'euros au strict minimum à bien davantage pour une ferme équipée. Le matériel d'occasion, l'autoconstruction et les CUMA (matériel en commun) réduisent fortement la facture." },
      { titre: "Le réalisme économique", texte: "Un maraîchage diversifié bio en vente directe occupe en général une personne à temps plein pour moins d'un hectare cultivé, avec des semaines de 50 heures en saison. Les premières années servent à apprendre : visez une commercialisation simple (paniers, marché, magasin de producteurs) et une gamme stable. L'onglet Économie du plan de culture aide à repérer les cultures qui rémunèrent." },
    ],
    video: "devenir maraîcher bio installation témoignage", liens: ["certification-bio", "outils-maraichers", "vendre-surplus", "budget-reglementation"] }),

  g({ id: "certification-bio", titre: "La certification bio pour un producteur", rubrique: "demarrer", emoji: "🏷️", niveau: 2,
    resume: "Pour vendre sous le label bio : organisme certificateur, conversion, semences, intrants, registres et contrôles. Ce qui change par rapport au simple jardinage bio.",
    alias: ["certification bio", "certifier bio", "label ab", "conversion bio", "organisme certificateur", "ecocert", "semences bio obligatoires", "derogation semences", "cahier des charges bio", "vendre en bio", "agence bio notification"],
    etapes: [
      { titre: "Jardiner bio ou être certifié", texte: "Pour sa consommation, chacun jardine comme il veut. Mais pour vendre en utilisant les mots « bio » ou « biologique », ou le logo AB et l'eurofeuille, il faut être certifié : sinon c'est une tromperie du consommateur. On peut toujours dire « cultivé sans produits chimiques de synthèse » si c'est exact." },
      { titre: "S'engager", texte: "Choisissez un organisme certificateur agréé (il en existe plusieurs, comparez les tarifs : quelques centaines d'euros par an pour une petite ferme), signez le contrat et notifiez votre activité auprès de l'Agence Bio. Des certifications de groupe existent pour les très petits producteurs." },
      { titre: "La conversion", texte: "Les parcelles doivent être cultivées selon le cahier des charges pendant au moins 2 ans avant le semis (cultures annuelles) et 3 ans avant la récolte (cultures pérennes, fruitiers) pour vendre en bio. Pendant la conversion, la mention « en conversion vers l'agriculture biologique » est possible sous conditions. Un historique prouvé sans intrants interdits peut parfois réduire cette période." },
      { titre: "Semences et intrants", texte: "Les semences et plants doivent être bio. Si une variété n'existe pas en bio, une dérogation est possible via la base nationale des semences biologiques, à demander avant d'acheter. Engrais, amendements et traitements doivent figurer dans la liste des intrants autorisés (mention « utilisable en agriculture biologique »)." },
      { titre: "Registres et contrôle", texte: "Tenez à jour : achats d'intrants et de semences (factures), cahier de culture (dates, parcelles, traitements), récoltes et ventes. Un contrôle annuel au moins, parfois inopiné. Le cahier de culture de Racines (export dans Plan de culture) aide à garder ces traces." },
      { titre: "Les aides", texte: "Selon les années : aides à la conversion et au maintien de la politique agricole commune, crédit d'impôt pour l'agriculture biologique, aides régionales. Renseignez-vous auprès du groupement d'agriculture biologique (GAB) ou de la chambre d'agriculture de votre département." },
    ],
    video: "certification bio producteur conversion organisme certificateur", liens: ["labels-bio", "devenir-maraicher", "semences"] }),

  g({ id: "idees-recues", titre: "Idées reçues du jardin : ce qui marche, ce qui ne marche pas, ce qui est interdit", rubrique: "demarrer", emoji: "🤔", niveau: 1,
    resume: "Peau de banane, coquilles d'œufs, vinaigre, sel, bicarbonate, cendres, marc de café, lune : le tri entre astuces utiles, croyances et pratiques nuisibles.",
    alias: ["idees recues", "astuces de grand mere", "peau de banane engrais", "peau de banane", "coquilles d oeufs limaces", "vinaigre desherbant", "sel desherbant", "bicarbonate jardin", "eau de cuisson", "mythe jardin", "fausses astuces", "arroser en plein soleil"],
    etapes: [
      { titre: "Peau de banane et coquilles d'œufs", texte: "La peau de banane contient un peu de potassium, mais enterrée entière au pied d'une plante, elle pourrit lentement et attire mouches et rongeurs : mettez-la plutôt au compost. Les coquilles d'œufs broyées apportent du calcium très lentement ; contre les limaces, les essais montrent qu'elles ne les arrêtent pas." },
      { titre: "Vinaigre et sel : non", texte: "Utiliser du vinaigre ou du sel comme désherbant est interdit (ce ne sont pas des herbicides autorisés) et nuisible : le sel stérilise durablement le sol, le vinaigre détruit aussi la vie du sol en surface. Pour désherber : paillage, binage, eau bouillante de cuisson (non salée) sur les allées." },
      { titre: "Bicarbonate et lait : à petite dose", texte: "Le bicarbonate de soude (5 g par litre) ou le lait dilué (1 pour 9) freinent l'oïdium en préventif. À forte dose, le bicarbonate brûle les feuilles et accumule du sodium dans le sol." },
      { titre: "Cendres et marc de café : avec modération", texte: "Les cendres de bois (non traité) apportent potasse et calcaire : une poignée par m² et par an au plus, jamais sur les plantes de terre acide. Le marc de café se composte ou s'étale en fine couche : en couche épaisse il moisit et peut freiner certaines plantes." },
      { titre: "Ce qui marche vraiment", texte: "Le paillage, le compost, la rotation, l'arrosage au pied le matin, les filets et voiles, les fleurs pour les auxiliaires, le purin d'ortie dilué, le savon noir sur pucerons, le piège à bière pour les limaces. Arroser en plein soleil ne « brûle » pas les feuilles, mais l'eau s'évapore : c'est surtout du gaspillage." },
      { titre: "Et la lune ?", texte: "Aucune étude sérieuse n'a montré d'effet des phases de la lune sur les cultures : si le calendrier lunaire vous aide à vous organiser, rien n'empêche de le suivre, mais la météo et l'état du sol comptent bien davantage." },
    ],
    video: "idées reçues jardinage vrai faux", liens: ["engrais-naturels", "desherbage", "traiter-loi", "limaces"] }),

  g({ id: "tunnel-petit-prix", titre: "Tunnels et voiles à petit prix", rubrique: "fabriquer", emoji: "⛺", niveau: 2, duree: "Une journée",
    resume: "Construire un tunnel ou un mini-tunnel avec des arceaux en tube ou en bois, une bâche adaptée ou de récupération, solidement ancré contre le vent.",
    alias: ["tunnel pas cher", "tunnel maison", "fabriquer un tunnel", "mini tunnel", "arceaux", "arceaux en noisetier", "arceaux en tube", "tunnel de culture", "bache de serre", "abri de culture pas cher", "chenille", "tunnel nantais"],
    etapes: [
      { titre: "Mini-tunnels (chenilles)", texte: "Pour une planche : arceaux tous les 1,2 à 1,5 m (fil de fer épais, tube d'irrigation de 20-25 mm sur fers à béton, ou baguettes de noisetier ou de châtaignier courbées fraîches), recouverts d'un voile de forçage, d'un filet anti-insectes ou d'une bâche perforée. Bords enterrés ou lestés de sacs de sable, aération en soulevant un côté." },
      { titre: "Tunnel de culture où l'on entre", texte: "Arceaux en tube d'irrigation de 32 à 40 mm emmanchés sur des fers à béton plantés tous les 1,2 m, ou en bois cintré pour les plus habiles ; faîtage et contreventement en diagonale ; portes aux deux bouts pour l'aération. Largeur 3 à 5 m, hauteur au moins 2 m au centre." },
      { titre: "La bâche", texte: "Une bâche de serre traitée anti-UV (180 à 200 microns) dure 4 à 5 ans ; une bâche ordinaire ou de récupération se déchire en un an au soleil. Posez-la par temps doux et sans vent (elle se tend en refroidissant). Une bâche « thermique » garde mieux la chaleur la nuit." },
      { titre: "Ancrer contre le vent", texte: "C'est le vent qui détruit les tunnels : bâche enterrée dans une tranchée de 30 cm sur les côtés, ou fixée sur des planches vissées, cordes ou sangles croisées par-dessus d'un côté à l'autre, ancrages en spirale. Fermez le tunnel par grand vent (un tunnel ouvert d'un seul côté s'envole comme un parachute)." },
      { titre: "Faire durer", texte: "Ruban adhésif spécial serre pour les accrocs, protection des arceaux sous la bâche (ruban mousse) aux points de frottement, rangement au sec et à l'ombre des voiles hors saison. En fin de vie, la bâche se recycle (filières agricoles ou déchetterie) : jamais brûlée ni enterrée." },
    ],
    video: "fabriquer un tunnel de culture pas cher arceaux tube", liens: ["tunnel-pilotage", "serre", "chassis", "plastique-jardin"] }),

  g({ id: "eau-sans-electricite", titre: "L'eau sans électricité : gravité, cuve IBC et pompe à bélier", rubrique: "arrosage", emoji: "💧", niveau: 3,
    resume: "Arroser par gravité depuis une cuve surélevée, choisir et préparer une cuve IBC, et monter l'eau d'un ruisseau sans moteur grâce au bélier hydraulique.",
    alias: ["irrigation gravitaire", "arrosage par gravite", "cuve ibc", "cuve de 1000 litres", "pompe a belier", "belier hydraulique", "pompe sans electricite", "pompe manuelle", "pompe solaire", "arroser sans electricite", "goutte a goutte gravitaire"],
    etapes: [
      { titre: "La gravité", texte: "Chaque mètre de hauteur donne 0,1 bar de pression. Une cuve posée à 1 ou 2 m de haut suffit pour un goutte-à-goutte « basse pression » (gaines poreuses, goutteurs gravitaires, tuyau à trous de gros diamètre), pas pour un goutte-à-goutte classique qui demande 1 bar. Prévoyez un filtre et des lignes courtes (20 à 30 m)." },
      { titre: "La cuve IBC", texte: "Une cuve de 1 000 L sur palette, d'occasion, ayant contenu un produit ALIMENTAIRE (sirop, huile) uniquement : refusez celles qui ont contenu des produits chimiques. Rincez-la, couvrez-la ou peignez-la d'une teinte sombre (sinon des algues s'y développent à la lumière), posez-la sur un socle très solide (une tonne d'eau), fermez le haut contre les moustiques, et reliez plusieurs cuves par le bas." },
      { titre: "Pompe manuelle ou solaire", texte: "Pour remonter l'eau d'une cuve enterrée ou d'un puits peu profond : pompe à bras (jusqu'à 7 m de profondeur), ou petite pompe solaire qui remplit une cuve haute pendant la journée ; ensuite, tout se fait par gravité." },
      { titre: "La pompe à bélier", texte: "Si vous avez un ruisseau ou une source avec une petite chute (au moins 1 m), le bélier hydraulique utilise l'énergie de l'eau qui descend pour en remonter une partie, sans électricité, jour et nuit : environ un dixième du débit d'entrée, jusqu'à une hauteur de l'ordre de dix fois la chute. Il se fabrique avec des raccords de plomberie (deux clapets et une cloche d'air)." },
      { titre: "Les autorisations", texte: "Prélever dans un cours d'eau, une source ou une nappe peut être soumis à déclaration ou autorisation (direction départementale des territoires) et aux restrictions de sécheresse. L'eau de pluie récupérée sur votre toit reste libre d'usage pour le jardin." },
    ],
    video: "pompe à bélier hydraulique fabrication", liens: ["recuperateur-pluie", "puits-forage", "arrosage-automatique", "jardin-sec"] }),

  g({ id: "germoir", titre: "Graines germées et jeunes pousses à la maison", rubrique: "interieur", emoji: "🌱", niveau: 1, duree: "3 à 10 jours",
    resume: "Faire germer des graines en bocal ou en germoir, en toute sécurité, et cultiver des jeunes pousses sur un plateau : des légumes frais toute l'année pour quelques centimes.",
    alias: ["germoir", "graines germees", "faire germer des graines", "germination en bocal", "jeunes pousses", "micro pousses", "pousses de tournesol", "pousses de radis", "luzerne germee", "lentilles germees"],
    etapes: [
      { titre: "Le matériel", texte: "Un bocal en verre fermé par un tissu fin ou une grille (vendue « couvercle de germination »), ou un germoir à étages. Des graines vendues « pour germination », bio : jamais de graines traitées destinées au semis." },
      { titre: "Faire germer", texte: "Faites tremper les graines 8 à 12 heures dans de l'eau fraîche, égouttez, puis rincez et égouttez matin et soir, bocal incliné tête en bas. En 3 à 6 jours : luzerne, radis, brocoli, moutarde, lentilles, pois chiches, haricot mungo, fenugrec. Mettez à la lumière le dernier jour pour qu'elles verdissent." },
      { titre: "La sécurité", texte: "La chaleur et l'humidité qui font germer les graines conviennent aussi aux bactéries : eau potable, rinçages réguliers, bocal lavé à chaque fois, conservation au réfrigérateur et consommation en 2 à 3 jours. Jetez tout ce qui sent mauvais ou moisit. Les enfants, les femmes enceintes et les personnes fragiles les mangent de préférence cuites." },
      { titre: "À ne pas faire germer", texte: "Haricots secs rouges et blancs (crus : toxiques), graines de tomate, d'aubergine, de pomme de terre et de rhubarbe (famille toxique), et toute graine traitée." },
      { titre: "Jeunes pousses sur plateau", texte: "Tournesol, pois, radis, roquette, moutarde semés serrés sur 2 cm de terreau ou de fibre de coco, près d'une fenêtre : coupe aux ciseaux en 7 à 14 jours, quand les deux premières feuilles sont formées. Voir les aromates et micro-pousses en intérieur." },
    ],
    video: "graines germées bocal débutant", liens: ["herbes-interieur", "potager-interieur"] }),

  g({ id: "etagere-semis", titre: "Une étagère de semis éclairée, avec du matériel de récup", rubrique: "semis", emoji: "💡", niveau: 2, duree: "Une demi-journée",
    resume: "Des plants trapus en février-mars sans serre : étagère, réglettes LED, minuterie, réflecteurs et chaleur douce, pour quelques dizaines d'euros.",
    alias: ["etagere de semis", "etagere de semis lampe", "eclairer les semis", "lampe pour semis", "led semis", "semis qui filent", "station de semis", "tapis chauffant semis"],
    etapes: [
      { titre: "La structure", texte: "Une étagère métallique ou en bois de récupération, 3 à 4 niveaux espacés de 40 cm, dans une pièce fraîche (15 à 18 °C). Les plateaux de récupération (caisses de fruits, bacs) reçoivent les godets." },
      { titre: "La lumière", texte: "Des réglettes LED « lumière du jour » (4 000 à 6 500 K) ou horticoles, 2 réglettes par niveau, suspendues par des chaînettes à 5-10 cm au-dessus des plants et remontées à mesure qu'ils poussent. Une minuterie : 14 à 16 heures par jour. Des parois de carton couvert d'aluminium ou de papier blanc renvoient la lumière." },
      { titre: "La chaleur", texte: "Les solanacées (tomates, poivrons, aubergines) lèvent mieux sur un tapis chauffant (20-25 °C) ; une fois levées, enlevez-le : des plants au chaud et sans assez de lumière filent." },
      { titre: "L'air", texte: "Un petit ventilateur quelques heures par jour, ou simplement passer la main sur les plants chaque jour : le mouvement rend les tiges plus solides et limite la fonte des semis." },
      { titre: "La consommation", texte: "Deux réglettes de 20 W allumées 15 heures pendant 8 semaines consomment environ 34 kWh, quelques euros d'électricité : bien moins que des plants achetés. Voir l'outil lampe de culture pour calculer selon votre installation." },
    ],
    video: "étagère de semis LED fabrication", liens: ["semis-interieur", "produire-ses-plants", "fonte-semis", "lumiere-led"] }),

  g({ id: "outils-maraicher-maison", titre: "Fabriquer ses outils de maraîcher", rubrique: "fabriquer", emoji: "🛠️", niveau: 3, duree: "Quelques heures par outil",
    resume: "Grelinette, houe oscillante, rabot à planches, marqueur de lignes, plantoir à mottes, tamis : des outils efficaces fabriqués avec du matériel de récupération.",
    alias: ["grelinette maison", "fabriquer une grelinette", "fabriquer ses outils", "outils maison", "houe oscillante maison", "rabot a planche", "marqueur de lignes", "plantoir a mottes", "tamis a terreau", "outils de recup"],
    etapes: [
      { titre: "La grelinette", texte: "Une barre horizontale en tube d'acier carré (60 cm) sur laquelle on soude 4 ou 5 dents (fers plats ou fers à béton épais forgés, 25-30 cm), et deux manches verticaux en bois ou en tube. Il faut un poste à souder et un peu d'expérience, ou l'aide d'un atelier partagé ; les associations d'autoconstruction agricole proposent des plans et des formations." },
      { titre: "La houe oscillante (désherbage rapide)", texte: "Un étrier en fer plat qui pivote au bout d'un manche, dont la lame (un morceau de lame de scie ou de fer plat affûté) coupe les herbes juste sous la surface en poussant et en tirant : l'outil qui fait gagner le plus de temps sur une planche." },
      { titre: "Rabot à planches et marqueur de lignes", texte: "Une planche de bois de la largeur de la planche de culture, fixée à un manche, nivelle la surface après le travail du sol. Un râteau en bois à dents réglables (chevilles tous les 10, 15 ou 30 cm) trace en un passage les lignes de semis ou de plantation." },
      { titre: "Plantoir à mottes et tamis", texte: "Plantoir : un tube ou une planchette percée de la taille de vos mottes, monté sur manche, pour préparer en une fois les trous d'une rangée. Tamis : un cadre en bois et un grillage de 5 à 10 mm pour le terreau de semis et le compost." },
      { titre: "Sécurité et entretien", texte: "Lunettes et gants pour la meuleuse et la soudure ; aiguisez les lames régulièrement ; huilez les manches en bois et rangez les outils à l'abri." },
    ],
    video: "fabriquer une grelinette soudure", liens: ["outils-maraichers", "reparer-outils", "petits-outils-maison"] }),

  g({ id: "ou-trouver-gratuit", titre: "Où trouver gratuitement fumier, broyat, cartons et matériaux", rubrique: "demarrer", emoji: "🎁", niveau: 1,
    resume: "Les ressources qu'on vous donne volontiers, où les demander, et les précautions pour chacune (fumier traité, bois traité, plastiques).",
    alias: ["ou trouver gratuitement", "recuperer du fumier gratuit", "fumier gratuit", "broyat gratuit", "copeaux gratuits", "feuilles mortes gratuites", "dreches de brasserie", "marc de cafe gratuit", "cartons gratuits", "seaux gratuits", "palettes gratuites", "palette traitee", "palettes hT", "ressources gratuites jardin"],
    etapes: [
      { titre: "Fumier", texte: "Centres équestres, élevages de chevaux, fermes, voisins qui ont des poules ou des lapins. Précautions : demandez si le foin ou la paille a été traité aux désherbants à base de pyridine (aminopyralide, clopyralid), qui persistent dans le fumier et déforment les tomates et haricots ; faites un test sur quelques plants de haricots. Compostez-le 6 mois avant usage." },
      { titre: "Broyat, copeaux, feuilles", texte: "Élagueurs et paysagistes (ils paient souvent pour s'en débarrasser), services espaces verts des communes (feuilles à l'automne, broyat). Le broyat frais s'utilise en surface (paillage des allées, des arbustes), pas mélangé à la terre (faim d'azote)." },
      { titre: "Matières riches", texte: "Drêches de brasserie (orge humide très riche en azote : à composter vite, elle fermente), marc de café des cafés et restaurants, tontes de gazon non traitées, algues de plage là où le ramassage est autorisé (rincées, en petites quantités), épluchures d'un marché ou d'une cantine." },
      { titre: "Contenants et cartons", texte: "Cartons bruns sans adhésif plastique ni encre brillante (paillage, occultation), seaux alimentaires de boulangeries et restaurants, pots de jardineries et de paysagistes, bocaux en verre. Évitez les bidons ayant contenu des produits chimiques." },
      { titre: "Bois de palette", texte: "Seules les palettes marquées « HT » (traitement thermique) conviennent au jardin et au poulailler ; refusez celles marquées « MB » (bromure de méthyle) ou sans marquage, et les palettes tachées de produits. Les palettes de couleur appartiennent à des sociétés de location : ne les récupérez pas." },
      { titre: "Graines et plants", texte: "Grainothèques des médiathèques, bourses aux graines et aux plantes, trocs entre voisins, jardins partagés, et vos propres graines gardées d'une année sur l'autre." },
    ],
    video: "récupérer du fumier broyat gratuit jardin", liens: ["jardin-sans-argent", "materiaux-recup", "fumiers-securite", "graines-maison"] }),

  g({ id: "plastique-jardin", titre: "Le plastique au jardin : choisir, réparer, recycler", rubrique: "fabriquer", emoji: "♻️", niveau: 1,
    resume: "Voiles, bâches, filets, goutte-à-goutte et pots : choisir ce qui dure, réparer, limiter les microplastiques, et que faire en fin de vie.",
    alias: ["plastique au jardin", "zero dechet jardin", "bache plastique", "voile de forcage duree", "microplastiques jardin", "recycler les baches", "toile tissee", "reutiliser les pots"],
    etapes: [
      { titre: "Choisir durable", texte: "Une toile tissée (occultation, allées) dure 10 ans ; un film fin se déchire en une saison et part en morceaux dans le sol. Pour l'occultation, une bâche d'ensilage de récupération (épaisse) fait très bien l'affaire. Un voile de forçage léger dure 1 à 2 saisons, un filet anti-insectes de bonne qualité 5 à 10 ans." },
      { titre: "Remplacer quand c'est possible", texte: "Paillage organique (paille, foin, broyat, feuilles) au lieu des films ; godets en papier journal ou en mottes pressées ; tuteurs en bois ou en bambou ; liens en raphia ou en ficelle de chanvre ; carton pour l'occultation." },
      { titre: "Réparer", texte: "Ruban adhésif spécial serre et bâche pour les accrocs, raccords et bouchons pour le goutte-à-goutte (un tuyau percé se répare en 2 minutes), couture pour les filets. Rangez voiles et bâches propres et secs, à l'abri de la lumière, roulés plutôt que pliés." },
      { titre: "Les microplastiques", texte: "Un film qui vieillit au soleil se fragmente en particules qui restent dans le sol des dizaines d'années : ramassez les vieux films avant qu'ils ne se déchirent, évitez les toiles « biodégradables » de qualité douteuse (certaines ne le sont qu'en compostage industriel)." },
      { titre: "En fin de vie", texte: "Bâches et films propres : déchetterie (filière plastique) ou, pour les professionnels, la filière de collecte agricole. Pots : rapportez-les en jardinerie ou donnez-les. Jamais brûlés (fumées toxiques et interdiction de brûlage) ni enterrés." },
    ],
    video: "réduire le plastique au jardin", liens: ["jardin-sobre", "paillage", "tunnel-petit-prix"] }),
];
