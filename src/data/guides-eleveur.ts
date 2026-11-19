import type { Guide } from "./types";

// Guides d'éleveur : reproduction, gestes sur les jeunes, poussins, volailles de chair, ponte
const g = (x: Omit<Guide, "niveau" | "duree" | "rubrique"> & Partial<Pick<Guide, "niveau" | "duree" | "rubrique">>): Guide => ({ niveau: 2, duree: "Lecture : 6 minutes", rubrique: "animaux", ...x });

export const GUIDES_ELEVEUR: Guide[] = [
  g({ id: "calendrier-reproduction", titre: "Calendrier de reproduction : chèvres, brebis, lapines", emoji: "📅",
    resume: "Saisons des chaleurs, préparation des mères, durée de la lutte, nombre de mâles, rythme de la lapine, âges de sevrage et de première reproduction.",
    alias: ["calendrier de reproduction", "lutte des brebis", "lutte", "mise au belier", "mise au bouc", "chaleurs chevre", "saison sexuelle", "effet bouc", "effet belier", "flushing", "rythme de reproduction lapine", "saillie lapine", "combien de portees par an", "sevrage agneaux", "sevrage chevreaux", "sevrage lapereaux"],
    etapes: [
      { titre: "Chèvres", texte: "La plupart des races sont « saisonnées » : chaleurs de septembre à janvier, tous les 21 jours, pendant 1 à 2 jours (chèvre qui bêle, remue la queue, mange moins). L'arrivée d'un bouc après plusieurs semaines d'absence déclenche les chaleurs (« effet bouc »). Un bouc pour 30 à 40 chèvres. Gestation de 150 jours : saillies en octobre, mises bas en mars." },
      { titre: "Brebis", texte: "Saison sexuelle de l'été à l'hiver selon les races (certaines, comme la Romane ou la Mérinos, se reproduisent presque toute l'année). Cycle de 17 jours ; une lutte dure 35 à 45 jours (deux cycles). Un bélier pour 30 à 50 brebis, marqué au crayon ou au harnais pour repérer les saillies. Gestation de 147 jours." },
      { titre: "Préparer les femelles", texte: "En bon état mais pas grasses : 3 semaines avant la lutte, un léger complément (flushing : 200 à 300 g de céréales) augmente le nombre d'ovulations. Vermifuge sur coproscopie, parage des onglons et vaccins à jour avant la lutte, pas pendant la gestation sans avis vétérinaire." },
      { titre: "Lapines", texte: "L'ovulation est provoquée par l'accouplement : on présente toujours la lapine au mâle, dans sa cage à lui. Rythme familial raisonnable : nouvelle saillie 10 à 12 jours après la mise bas ou après le sevrage, soit 4 à 6 portées par an, avec une pause l'été. Un mâle pour 8 à 10 lapines ; une lapine reproduit environ 3 ans. Gestation de 31 jours." },
      { titre: "Âges de sevrage", texte: "Lapereaux : 5 semaines (pas avant 4). Agneaux : 2,5 à 3 mois. Chevreaux : 2 à 3 mois (12-15 kg minimum). Sevrez progressivement, au calme, et séparez les mâles des femelles avant leur maturité (lapereaux dès 10-12 semaines, agneaux et chevreaux vers 4 mois)." },
      { titre: "Première reproduction", texte: "Chevrettes à 7-8 mois et 60 % de leur poids adulte ; agnelles à 7-9 mois (races précoces) ou 18 mois (races rustiques) ; lapines à 4,5-5 mois. La page Calculs donne les dates de mise bas, de préparation et de sevrage, et le carnet de reproduction garde l'historique de chaque femelle." },
    ],
    video: "calendrier de lutte brebis chèvres effet bouc", liens: ["chevre", "mouton", "lapin", "naissances", "reproduction-selection"] }),

  g({ id: "gestes-jeunes", titre: "Gestes sur les jeunes : écornage, castration, queue, boucles", emoji: "🏷️", niveau: 3,
    resume: "Ce qui se fait, à quel âge, avec quelle prise en charge de la douleur, et ce qui est interdit ou déconseillé, pour les agneaux, chevreaux, porcelets et volailles.",
    alias: ["ecornage", "ebourgeonnage", "ecornage chevreau", "castration agneau", "castration chevreau", "castrer", "anneau elastique", "elastrateur", "caudectomie", "couper la queue agneau", "boucle electronique", "boucler les agneaux", "identification agneaux", "epointage bec"],
    etapes: [
      { titre: "Une règle d'abord", texte: "Ces gestes sont douloureux : un antidouleur est recommandé dans tous les cas, et plusieurs ne peuvent se faire que par un vétérinaire ou avec anesthésie au-delà d'un certain âge. Les règles évoluent : vérifiez-les auprès de votre vétérinaire ou du GDS avant de vous lancer. Ne faites que ce qui est utile à votre élevage." },
      { titre: "Écorner (ébourgeonner) les chevreaux", texte: "Une chèvre cornue n'est pas une chèvre malade : les cornes servent à réguler la chaleur et à la hiérarchie. Si vous mélangez cornues et écornées, ou pour la sécurité des enfants, l'ébourgeonnage se fait dans les premiers jours (3 à 10 jours) au fer chaud, idéalement par le vétérinaire avec sédation et antidouleur. Plus tard, c'est une chirurgie lourde." },
      { titre: "Castrer", texte: "Inutile pour des agneaux ou chevreaux abattus jeunes (avant 4 à 5 mois). Pour les mâles gardés (compagnie, débroussaillage) : anneau élastique dans la première semaine, ou plus tard castration par le vétérinaire avec anesthésie. Un bouc castré trop jeune risque davantage les calculs urinaires. Porcelets : jamais sans anesthésie ni antidouleur (interdit)." },
      { titre: "Couper la queue des agneaux", texte: "Pratique courante chez les races à laine pour éviter les asticots (myiases) : anneau élastique dans les premiers jours, en laissant assez de queue pour couvrir l'anus (et la vulve des femelles). Inutile chez les races à queue courte ou à poils. Elle est limitée en agriculture biologique. Chez le porc, la coupe systématique est interdite." },
      { titre: "Boucler", texte: "Agneaux et chevreaux sont identifiés dans les premiers mois et avant toute sortie de l'élevage, avec les boucles commandées à l'EDE (boucle électronique selon la destination de l'animal). La pose se fait d'un geste sec, au bon endroit de l'oreille, entre les nervures, avec une pince propre. Notez chaque numéro au registre." },
      { titre: "Volailles", texte: "Pas d'épointage du bec chez soi : le picage se règle par l'espace, l'occupation (bain de poussière, parcours) et une alimentation riche en protéines." },
    ],
    video: "boucler des agneaux identification pince", liens: ["registre-elevage", "naissances", "calculs-urinaires", "myiase", "porc-familial"] }),

  g({ id: "poussins", titre: "Élever des poussins de 0 à 8 semaines", emoji: "🐣",
    resume: "Chauffage semaine par semaine, aliments démarrage et croissance, eau, litière, vaccins, et reconnaître les coqs des poules.",
    alias: ["poussins", "elever des poussins", "chauffer les poussins", "lampe chauffante poussins", "temperature poussins", "aliment demarrage", "aliment poussin", "eleveuse", "sexer les poussins", "reconnaitre un coq", "poussin coq ou poule", "poussins sans mere"],
    etapes: [
      { titre: "Préparer l'éleveuse", texte: "Un bac ou une cage propre, à l'abri des courants d'air, des chats et des rats, avec 5 cm de copeaux de bois (pas de journal glissant), une source de chaleur (plaque chauffante ou lampe infrarouge bien fixée, loin de la litière à cause du feu) et un thermomètre au niveau des poussins." },
      { titre: "La température", texte: "Sous la source de chaleur : 32-35 °C la première semaine, puis environ 3 °C de moins chaque semaine, jusqu'à 20 °C vers la 5e ou 6e semaine. Observez-les : serrés sous la lampe et piaillant, ils ont froid ; éloignés, haletants, ils ont trop chaud ; répartis et calmes, tout va bien. Laissez toujours une zone plus fraîche." },
      { titre: "Manger et boire", texte: "Aliment « démarrage » poussins (20-22 % de protéines, en miettes) les 4 premières semaines, puis aliment « croissance » jusqu'à 8-10 semaines. Abreuvoir à petite cuvette (les poussins se noient dans un bol), eau tiède et propre changée chaque jour. Trempez le bec des premiers poussins pour leur montrer l'eau." },
      { titre: "La santé", texte: "Achetez des poussins vaccinés contre la maladie de Marek. Surveillez les fientes collées au cloaque (nettoyez à l'eau tiède) et la coccidiose (sang dans les fientes, poussins en boule). Litière toujours sèche : l'humidité favorise coccidiose et aspergillose." },
      { titre: "Coq ou poule ?", texte: "Certaines races et croisements se sexent à la naissance par la couleur du duvet (souches « sexables »). Sinon, vers 6 à 10 semaines : crête et barbillons plus rouges et plus grands chez le coq, puis plumes pointues et brillantes sur le cou et le dos (camail, lancettes). Le chant arrive vers 3 à 5 mois." },
      { titre: "Sortir dehors", texte: "Entièrement emplumés vers 6 à 8 semaines, ils sortent par temps doux, d'abord quelques heures. On les mêle aux adultes vers 3 mois, progressivement (voir le guide sur l'intégration de nouveaux animaux)." },
    ],
    video: "élever des poussins température lampe semaine", liens: ["couvaison", "integrer-animaux", "marek", "coccidiose", "aspergillose"] }),

  g({ id: "volailles-chair", titre: "Élever des volailles pour la viande", emoji: "🍗", niveau: 2,
    resume: "Choisir des souches à croissance lente, durée d'élevage, alimentation, parcours, rendement, et ce qu'il faut savoir sur le chapon et le foie gras.",
    alias: ["poulet de chair", "poulets de chair", "engraisser des poulets", "elever des poulets", "souche croissance lente", "cou nu", "poulet label", "poulet fermier", "chapon", "chaponner", "foie gras", "gavage", "canard a rotir", "dinde de noel", "pintade de chair"],
    etapes: [
      { titre: "Choisir la souche", texte: "Pour un poulet savoureux : souches à croissance lente (cou nu, poulets fermiers « label », races mixtes comme la Sussex, la Faverolles ou la Gâtinaise). Les souches industrielles à croissance rapide grossissent en 6 semaines mais ont souvent des problèmes de pattes et de cœur : elles conviennent mal au plein air familial." },
      { titre: "Durée et parcours", texte: "Un poulet label rouge vit au moins 81 jours avec accès à un parcours herbeux ; en élevage familial, comptez 90 à 120 jours pour une chair ferme. Parcours ombragé (arbres, haies), abri contre les prédateurs la nuit. Pintades : 4 mois ; canards de Barbarie : 10 à 12 semaines (canes), 12 semaines (mâles) ; dindes de Noël : achetées en juin-juillet." },
      { titre: "Alimentation", texte: "Aliment démarrage puis croissance, puis les dernières semaines une finition riche en céréales (maïs, blé) qui donne une chair plus ferme et plus goûteuse. Un poulet de 120 jours consomme environ 10 à 12 kg d'aliment. Eau propre à volonté." },
      { titre: "Rendement", texte: "Un poulet fermier de 2,5 à 3 kg vif donne environ 1,8 à 2,1 kg prêt à cuire (environ 70 %). Notez dépenses et production dans Racines pour connaître votre coût de revient au kilo." },
      { titre: "Chapon et foie gras", texte: "Le chapon est un coq castré chirurgicalement jeune, puis élevé longtemps : c'est un geste chirurgical réservé à des opérateurs formés, à ne pas pratiquer soi-même. Le foie gras suppose le gavage, une pratique très encadrée réservée aux élevages déclarés et discutée pour le bien-être animal : il ne se pratique pas en basse-cour familiale." },
      { titre: "Abattage", texte: "Voir le guide d'abattage familial : animal à jeun 12 heures, étourdissement obligatoire, hygiène, consommation familiale uniquement." },
    ],
    video: "élever des poulets fermiers croissance lente plein air", liens: ["poule", "abattage-volaille", "poussins", "conserver-viande"] }),

  g({ id: "ponte-lumiere-mue", titre: "Ponte, lumière et mue : comprendre l'arrêt de ponte", emoji: "🥚", niveau: 1,
    resume: "Pourquoi les poules pondent moins en automne et en hiver, comment les accompagner pendant la mue, et ce qu'il faut savoir avant d'éclairer un poulailler.",
    alias: ["mue des poules", "poules ne pondent plus en hiver", "arret de ponte hiver", "eclairer le poulailler", "lumiere poulailler", "ponte et lumiere", "poule perd ses plumes", "combien d oeufs par an", "age des poules ponte"],
    etapes: [
      { titre: "La lumière commande la ponte", texte: "Une poule pond bien quand les jours dépassent 13 à 14 heures. En automne, la durée du jour baisse : la ponte ralentit puis s'arrête souvent de novembre à janvier, surtout chez les races anciennes. C'est un repos naturel, pas une maladie." },
      { titre: "La mue", texte: "Chaque automne, la poule renouvelle ses plumes en 6 à 10 semaines et arrête de pondre. Elle a besoin de plus de protéines (aliment pondeuse complet, pois, insectes séchés, un peu de graines de tournesol), de calme et d'un abri sec. Ne la manipulez pas trop : les plumes neuves sont sensibles." },
      { titre: "Éclairer ou non", texte: "Une lampe sur minuterie qui allonge le matin la journée à 14 heures maintient la ponte, mais fatigue plus vite les poules. Si vous éclairez : jamais plus de 16 heures de jour en tout, au moins 8 heures de nuit noire, allumage le matin (pas le soir : elles doivent pouvoir regagner le perchoir au crépuscule naturel), et jamais sur des poulettes trop jeunes. Beaucoup d'éleveurs familiaux préfèrent laisser le repos d'hiver." },
      { titre: "Combien d'œufs", texte: "Une poule hybride pond 250 à 300 œufs la première année, une poule de race 150 à 200. La ponte baisse d'environ 10 à 15 % chaque année ; une poule vit 8 à 10 ans mais pond peu après 4 ans. Notez la ponte chaque jour dans Racines : le taux de ponte s'affiche." },
      { titre: "Si la ponte s'arrête hors saison", texte: "Cherchez la cause : poux rouges, vers, chaleur, stress (prédateur, déménagement), manque d'eau ou de calcium, poule couveuse, œufs mangés ou pondus ailleurs. La fiche « Ponte en baisse » du diagnostic vous guide." },
    ],
    video: "mue des poules arrêt de ponte hiver lumière", liens: ["poule", "oeufs", "hiver-basse-cour", "arret-ponte"] }),
];
