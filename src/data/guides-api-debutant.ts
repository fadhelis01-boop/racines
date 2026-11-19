import type { Guide } from "./types";

// Tutoriels de l'apiculteur débutant (audit « apiculteur débutant ») : par où commencer, où installer,
// la reine, la ruche morte, le pillage, l'essaim dans un mur, l'hivernage.
const g = (x: Omit<Guide, "niveau" | "duree" | "rubrique"> & Partial<Pick<Guide, "niveau" | "duree" | "rubrique">>): Guide => ({ niveau: 1, duree: "Lecture : 6 minutes", rubrique: "animaux", ...x });

export const GUIDES_API_DEBUTANT: Guide[] = [
  g({ id: "api-debuter", titre: "Débuter en apiculture : la première année", emoji: "🐝", duree: "Lecture : 8 minutes",
    resume: "Se former avant d'acheter, commencer avec deux ruches, choisir entre essaim sur cadres et ruchette, le vrai budget, la déclaration, et ce qu'on peut attendre la première année (souvent peu ou pas de miel).",
    alias: ["débuter en apiculture", "debuter apiculture", "commencer l'apiculture", "comment commencer l'apiculture", "première ruche", "premiere ruche", "combien de ruches pour débuter", "acheter un essaim", "acheter des abeilles", "où acheter des abeilles", "prix d'une ruche", "budget apiculture", "essaim sur cadres", "ruchette", "paquet d'abeilles", "essaim nu", "apiculteur débutant"],
    etapes: [
      { titre: "1. Se former d'abord", texte: "Suivez une saison dans un rucher-école (syndicat ou association apicole de votre département) avant d'acheter : vous ouvrirez des ruches avec quelqu'un d'expérimenté, vous apprendrez à lire un cadre et à lutter contre le varroa. L'inscription coûte peu et ouvre souvent l'accès à du matériel partagé (extracteur)." },
      { titre: "2. Deux ruches plutôt qu'une", texte: "Avec deux colonies, on compare (l'une est-elle anormalement faible ?) et on peut dépanner l'une avec un cadre de couvain de l'autre si elle perd sa reine. Une seule ruche qui meurt, c'est tout à recommencer." },
      { titre: "3. Essaim sur cadres ou ruchette ?", texte: "Achetez un essaim de l'année sur 5 ou 6 cadres (couvain, réserves, reine marquée de l'année), chez un apiculteur local qui peut vous le montrer, avec un certificat sanitaire. Les livraisons ont lieu d'avril à juin. Les « paquets d'abeilles » sans cadres et les essaims nus récupérés sont pour plus tard : ils demandent plus de savoir-faire. Évitez les abeilles importées de loin." },
      { titre: "4. Le vrai budget", texte: "Par ruche : 150 à 250 € l'essaim, 100 à 200 € la ruche Dadant 10 cadres avec une hausse, et une fois pour toutes 100 à 250 € d'équipement (vareuse avec voile, gants, enfumoir, lève-cadre, brosse, nourrisseur). L'extracteur se loue ou s'emprunte au syndicat. Comptez ensuite 20 à 40 € par ruche et par an (traitements contre le varroa, cire, sucre)." },
      { titre: "5. Déclarer et installer", texte: "Déclarez vos ruches chaque année (entre le 1er septembre et le 31 décembre, en ligne sur le site du ministère de l'Agriculture), dès la première ruche. Choisissez l'emplacement avant l'arrivée des abeilles (voir « Où installer ses ruches ») et respectez les distances fixées par arrêté préfectoral." },
      { titre: "6. La première année", texte: "La colonie construit ses cadres et grossit : on ne récolte souvent rien, ou une petite hausse en fin d'été si la saison est bonne. Visitez toutes les 1 à 2 semaines au printemps, comptez le varroa en juillet, traitez en août, nourrissez si la ruche est légère en septembre. Notez chaque visite dans le carnet du rucher : les alertes vous guident." },
    ],
    conseils: ["Choisissez une abeille douce et locale (votre fournisseur sait comment se comportent ses colonies) : à la première saison, une colonie calme fait toute la différence.", "Trouvez un parrain ou une marraine apiculteur près de chez vous : un coup de fil pendant une visite vaut tous les livres."],
    erreurs: ["Acheter la ruche en kit et les abeilles sur internet sans avoir jamais ouvert une ruche.", "Vouloir du miel la première année et récolter les réserves dont la colonie a besoin pour l'hiver."],
    video: "débuter apiculture première année conseils", liens: ["abeille", "api-materiel", "api-emplacement", "api-visite", "api-calendrier", "api-reseau", "api-varroa"] }),

  g({ id: "api-emplacement", titre: "Où installer ses ruches : jardin, ville, toit et voisins", emoji: "📍",
    resume: "Les distances à respecter, la bonne exposition, une ruche dans un petit jardin, en ville ou sur un toit, et comment éviter les ennuis avec les voisins.",
    alias: ["emplacement ruche", "où mettre une ruche", "ou installer une ruche", "distance ruche voisin", "distance ruche maison", "ruche dans un petit jardin", "ruche en ville", "ruche sur un toit", "ruche sur un balcon", "apiculture urbaine", "arrêté préfectoral ruche", "ruche voisinage"],
    etapes: [
      { titre: "Les distances", texte: "Elles sont fixées par un arrêté préfectoral ou un arrêté municipal propre à chaque département : renseignez-vous en mairie ou auprès du GDSA. Souvent 10 à 20 m des habitations et de la voie publique, moins (ou rien) si la ruche est derrière une haie, un mur ou une palissade d'au moins 2 m de haut qui dépasse la ruche de chaque côté : les abeilles prennent alors de la hauteur en sortant." },
      { titre: "La bonne place", texte: "Trou de vol orienté au sud-est (soleil du matin), à l'abri des vents dominants, sur un support à 40 cm du sol, légèrement penché vers l'avant (l'eau de condensation s'écoule), avec un point d'eau proche (abreuvoir avec flotteurs, pour éviter qu'elles aillent boire à la piscine du voisin). Jamais dans un creux humide ni en plein courant d'air." },
      { titre: "Un petit jardin", texte: "C'est possible avec une ou deux ruches, une haie ou un brise-vue devant le trou de vol pour faire monter les abeilles, et en éloignant le passage des enfants et du linge qui sèche. Plantez des fleurs mellifères, mais les abeilles butinent surtout jusqu'à 3 km : le jardin seul ne les nourrit pas." },
      { titre: "En ville ou sur un toit", texte: "Le toit demande l'accord du propriétaire ou de la copropriété, un accès sûr (pas d'échelle avec une hausse pleine dans les bras), une protection contre le vent et la chaleur (toit noir l'été) et un point d'eau. En ville, la nourriture manque souvent : trop de ruches dans un quartier affament aussi les abeilles sauvages. Une ou deux ruches suffisent." },
      { titre: "Les voisins", texte: "Prévenez-les avant l'arrivée des abeilles, offrez un pot de miel, et expliquez quoi faire en cas d'essaim (vous appeler). Évitez les visites quand ils déjeunent dehors ou par temps orageux. En cas de personne allergique à proximité, cherchez un autre emplacement." },
    ],
    conseils: ["Pas de place ? Beaucoup d'agriculteurs et de jardins partagés accueillent volontiers une ou deux ruches."],
    erreurs: ["Poser la ruche face à une allée ou à une terrasse : les abeilles passent à hauteur de visage."],
    video: "emplacement ruche jardin distance voisins", liens: ["api-debuter", "api-securite", "api-miellees", "jardin-pollinisateurs"] }),

  g({ id: "api-reine-perdue", titre: "La reine a-t-elle disparu ? Le savoir et réagir", emoji: "👑",
    resume: "Trouver la reine sans perdre une heure, ce qui prouve qu'elle est là même sans la voir, reconnaître une colonie orpheline ou des ouvrières pondeuses, et que faire dans chaque cas.",
    alias: ["pas de reine", "reine introuvable", "trouver la reine", "comment trouver la reine", "ruche orpheline", "colonie orpheline", "reine morte", "reine perdue", "ouvrières pondeuses", "plus d'oeufs dans la ruche", "plus de couvain", "bourdonneuse", "introduire une reine"],
    etapes: [
      { titre: "Pas besoin de voir la reine", texte: "Des œufs (petits bâtonnets blancs dressés au fond des cellules, un par cellule) prouvent qu'il y avait une reine il y a moins de 3 jours. Regardez à contre-jour, soleil dans le dos, sur un cadre de couvain du centre. S'il y a des œufs, refermez : tout va bien." },
      { titre: "Si on veut la trouver", texte: "Fumez peu, ouvrez calmement, commencez par un cadre de rive, puis regardez d'abord la face du cadre que vous sortez (elle fuit vers l'ombre). Elle est plus longue, l'abdomen dépasse des ailes, les ouvrières se tournent vers elle ; une reine marquée se voit par sa pastille de couleur. Ne cherchez pas plus de 10 minutes : le couvain refroidit." },
      { titre: "Signes d'une colonie orpheline", texte: "Plus d'œufs ni de jeunes larves, colonie bruyante (un « bourdonnement plaintif » à l'ouverture), abeilles nerveuses, cellules royales en cours (la colonie essaie de refaire une reine), réserves de pollen qui s'accumulent." },
      { titre: "Ouvrières pondeuses", texte: "Plusieurs œufs par cellule, collés sur les parois, couvain de mâles bombé dans des cellules d'ouvrières : la colonie est orpheline depuis plusieurs semaines. Elle n'acceptera presque plus de reine : on la réunit à une colonie forte (méthode du papier journal) ou on secoue ses abeilles devant une autre ruche." },
      { titre: "Que faire", texte: "Si des cellules royales sont là, attendez 3 à 4 semaines sans ouvrir (la jeune reine éclot, part se faire féconder, puis pond). Sans cellules royales, donnez un cadre d'œufs et de jeunes larves d'une autre ruche : elle élèvera une reine. Ou introduisez une reine fécondée achetée, en cage, après avoir vérifié l'absence de cellules royales. Notez tout dans le carnet du rucher." },
    ],
    conseils: ["Faites marquer la reine (couleur de l'année) : vous saurez son âge et la trouverez trois fois plus vite."],
    erreurs: ["Ouvrir tous les jours pour voir si la nouvelle reine pond : on la dérange pendant ses vols de fécondation."],
    video: "trouver la reine abeille colonie orpheline", liens: ["api-reines", "api-visite", "orpheline", "api-debuter"] }),

  g({ id: "api-ruche-morte", titre: "Ma ruche est morte : comprendre pourquoi et repartir", emoji: "🔍",
    resume: "Lire ce qui reste dans une ruche morte (famine, varroa, humidité, orphelinage, pillage, maladie), éviter de contaminer les autres ruches, et nettoyer le matériel.",
    alias: ["ruche morte", "abeilles mortes en hiver", "colonie morte", "ruche vide au printemps", "ruche vide", "perte hivernale", "pourquoi ma ruche est morte", "autopsie ruche", "abeilles mortes dans la ruche", "abeilles tête dans les cellules"],
    etapes: [
      { titre: "D'abord, fermer", texte: "Fermez le trou de vol dès que vous constatez la mort : les abeilles des autres ruches viendraient piller le miel, et avec lui d'éventuelles maladies. Emportez la ruche à l'abri pour l'examiner." },
      { titre: "Famine", texte: "Abeilles mortes la tête dans les cellules, en grappe serrée, à côté de cadres vides ; parfois du miel au bout de la ruche, que la grappe n'a pas pu atteindre par le froid. Leçon : peser les ruches à l'automne et en fin d'hiver, nourrir au candi si besoin." },
      { titre: "Varroa et virus", texte: "Peu d'abeilles mortes dans une ruche avec encore des réserves, quelques abeilles aux ailes déformées, couvain abandonné en petites plaques, nombreux points blancs (déjections de varroa) au plafond des cellules. C'est la cause la plus fréquente : la colonie s'est effondrée à l'automne. Leçon : compter en juillet, traiter en août, contrôler après." },
      { titre: "Humidité, orphelinage, pillage", texte: "Cadres moisis, eau au plancher : ruche mal aérée ou mal penchée. Plus de couvain du tout, peu d'abeilles, couvain de mâles : orphelinage. Cire déchiquetée, opercules arrachés, réserves vidées en quelques jours : pillage (souvent la suite d'une colonie déjà faible)." },
      { titre: "Maladie : ne rien réutiliser", texte: "Couvain en mosaïque, cellules affaissées, odeur aigre ou de colle, larve qui s'étire en fil quand on y plonge une allumette : suspicion de loque. Ne réutilisez ni cadres ni miel, et appelez votre GDSA ou un technicien sanitaire : la loque américaine est à déclaration obligatoire." },
      { titre: "Nettoyer et repartir", texte: "Sans maladie : grattez la ruche, passez les parois à la flamme du chalumeau, fondez les vieux cadres (cire), gardez les cadres de miel sains au congélateur 48 heures (fausse teigne) pour un futur essaim. Déclarez la perte dans le carnet du rucher : le taux de pertes de l'hiver s'y calcule." },
    ],
    conseils: ["Prenez des photos des cadres et montrez-les à votre rucher-école : un diagnostic à plusieurs est plus fiable."],
    erreurs: ["Laisser la ruche morte ouverte : elle devient une source de pillage et de maladies pour tout le voisinage."],
    video: "ruche morte autopsie cause famine varroa", liens: ["api-varroa", "api-nourrissement", "famine", "loque-americaine", "api-hivernage"] }),

  g({ id: "api-pillage", titre: "Le pillage : le reconnaître et l'arrêter", emoji: "⚔️",
    resume: "Quand des abeilles étrangères (ou des guêpes) attaquent une ruche pour voler son miel : les signes, les gestes qui l'arrêtent, et comment l'éviter.",
    alias: ["pillage", "pillage ruche", "abeilles qui se battent", "ruche pillée", "réduire le trou de vol", "réducteur d'entrée", "guêpes ruche"],
    etapes: [
      { titre: "Reconnaître", texte: "Agitation désordonnée devant le trou de vol, abeilles qui se battent et roulent au sol, vol en zigzag devant les fentes de la ruche, abeilles qui repartent lourdes ; dans la ruche, opercules arrachés, débris de cire au plancher. Une activité intense en fin d'été, sans pollen aux pattes, est suspecte." },
      { titre: "Arrêter", texte: "Réduisez le trou de vol à la largeur d'une ou deux abeilles, bouchez toutes les fentes, posez une planche ou un drap mouillé devant l'entrée pour désorienter les pillardes. Ne réouvrez pas la ruche pillée ce jour-là. Si la colonie est trop faible, réunissez-la à une autre." },
      { titre: "Éviter", texte: "Ne laissez jamais traîner de miel, de cadres ni de cire près du rucher. Nourrissez le soir, dans un nourrisseur couvre-cadres étanche, sans faire couler de sirop. Visites courtes en période de disette (fin d'été). Réducteurs d'entrée posés dès la fin de la miellée." },
    ],
    conseils: ["Les colonies faibles ou orphelines sont les premières pillées : surveillez-les en septembre."],
    video: "pillage ruche que faire réducteur", liens: ["api-nourrissement", "api-ruche-morte", "api-frelon"] }),

  g({ id: "essaim-batiment", titre: "Un essaim dans un mur, une cheminée ou un arbre", emoji: "🏚️",
    resume: "Qui appeler quand des abeilles s'installent dans une maison, ce qu'il ne faut pas faire, et la différence entre un essaim de passage et une colonie installée.",
    alias: ["abeilles dans la cheminée", "abeilles dans un mur", "abeilles dans le toit", "essaim dans mon jardin", "essaim dans un arbre", "abeilles installées maison", "qui appeler pour un essaim", "enlever un essaim", "essaim pompiers"],
    etapes: [
      { titre: "Essaim de passage ou colonie installée ?", texte: "Une grappe d'abeilles accrochée à une branche, un volet ou une boîte aux lettres est un essaim en transit : il repart souvent sous 1 à 3 jours, et un apiculteur peut le récupérer facilement. Des abeilles qui entrent et sortent d'un trou de mur ou d'une cheminée depuis plusieurs jours ont construit des rayons : c'est une colonie installée." },
      { titre: "Qui appeler", texte: "Essaim visible : la liste des récupérateurs d'essaims du syndicat apicole ou du GDSA de votre département, ou la mairie. Les pompiers n'interviennent plus pour les abeilles sauf danger immédiat. Colonie dans un mur : un apiculteur équipé ou une entreprise spécialisée en retrait d'abeilles (travaux d'ouverture parfois nécessaires, à la charge du propriétaire)." },
      { titre: "Ce qu'il ne faut pas faire", texte: "Ne pas pulvériser d'insecticide (les rayons et le miel restent dans le mur, pourrissent et attirent d'autres insectes), ne pas boucher l'entrée d'une colonie installée (elles cherchent une autre sortie, parfois dans la maison), ne pas l'enfumer soi-même dans un conduit." },
      { titre: "Frelons ou guêpes ?", texte: "Si ce sont des frelons ou des guêpes (corps plus lisse, jaune vif ou noir, nid en papier), appelez un désinsectiseur ; pour le frelon asiatique, signalez le nid à la mairie ou sur la plateforme de votre région." },
    ],
    video: "récupérer essaim abeilles cheminée mur", liens: ["api-essaimage", "api-reseau", "api-frelon"] }),

  g({ id: "api-hivernage", titre: "Préparer la ruche à l'hiver : réserves, isolation, aération", emoji: "❄️",
    resume: "Ce qui tue une colonie en hiver (faim, humidité, varroa, dérangement), comment vérifier les réserves, isoler sans étouffer, et que faire en fin d'hiver.",
    alias: ["hivernage ruche", "hiverner une ruche", "isolation ruche", "isoler la ruche", "ruche en hiver", "humidité ruche", "partition ruche", "candi", "pain de sucre abeilles", "sucre en pain abeilles"],
    etapes: [
      { titre: "Septembre : vérifier les réserves", texte: "Une colonie a besoin de 15 à 20 kg de miel et de sucre pour l'hiver (davantage en montagne). Soupesez la ruche par l'arrière ou pesez-la (carnet du rucher) ; si elle est légère, nourrissez au sirop épais (2 kg de sucre pour 1 L d'eau) jusqu'à mi-octobre, quand les abeilles peuvent encore le transformer." },
      { titre: "Resserrer et isoler", texte: "Retirez la hausse, réduisez le trou de vol, posez une grille anti-souris. Une partition (planche) réduit le volume d'une colonie petite. Un isolant (plaque de liège ou de polystyrène) sur le couvre-cadres, sous le toit, réduit les pertes de chaleur ; les parois en bois de 25 mm suffisent dans la plupart des régions." },
      { titre: "Aérer sans courant d'air", texte: "L'ennemi n'est pas le froid mais l'humidité : la grappe produit de la vapeur qui se condense et retombe sur elle. Plateau grillagé ouvert, toit qui laisse circuler l'air au-dessus de l'isolant, ruche penchée vers l'avant. Pas de bâche collée sur la ruche." },
      { titre: "Ne pas déranger", texte: "On n'ouvre plus de novembre à février. On soupèse, on écoute (un léger bourdonnement en collant l'oreille), on dégage le trou de vol des abeilles mortes après le froid. Traitement d'hiver contre le varroa quand il n'y a plus de couvain, selon le plan de lutte." },
      { titre: "Fin d'hiver : le moment critique", texte: "En février-mars, le couvain reprend et les réserves fondent. Une ruche légère reçoit du candi (pâte de sucre) posé au-dessus de la grappe ; un pain de sucre humidifié dépanne. Jamais de sirop liquide par temps froid : les abeilles ne peuvent pas l'évaporer." },
    ],
    conseils: ["Notez le poids de chaque ruche à l'automne : la comparaison au printemps dit si la colonie a manqué."],
    erreurs: ["Calfeutrer complètement la ruche : l'humidité moisit les cadres et refroidit la grappe."],
    video: "préparer ruche hiver isolation candi", liens: ["api-nourrissement", "api-varroa", "api-ruche-morte", "famine"] }),
];
