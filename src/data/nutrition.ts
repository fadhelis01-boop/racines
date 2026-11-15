// Nourrir les plantes et les animaux, expliqué simplement.

export interface Nutriment { id: string; symbole: string; nom: string; role: string; image: string; manque: string; trop: string; sources: string[]; carence?: string }
export const NUTRIMENTS: Nutriment[] = [
  { id: "N", symbole: "N", nom: "Azote", role: "Fait pousser les feuilles et les tiges, donne le vert.", image: "Le « carburant de la croissance ».",
    manque: "Plante pâle, petite ; les VIEILLES feuilles (en bas) jaunissent en premier.", trop: "Feuillage énorme et mou, peu de fleurs et de fruits, pucerons attirés.",
    sources: ["Compost", "Fumiers (surtout de volailles)", "Purin d'ortie", "Corne broyée, sang séché", "Urine diluée", "Engrais verts de légumineuses (trèfle, vesce, féverole)"], carence: "carence-azote" },
  { id: "P", symbole: "P", nom: "Phosphore", role: "Fait les racines, les fleurs et les graines.", image: "L'« énergie des racines et des fleurs ».",
    manque: "Croissance bloquée, feuilles vert sombre virant au violet ou rougeâtre, peu de fleurs.", trop: "Rare au potager ; en excès il bloque le fer et le zinc.",
    sources: ["Compost", "Fumier", "Poudre d'os", "Guano", "Cendre de bois (un peu)"], carence: "carence-phosphore" },
  { id: "K", symbole: "K", nom: "Potassium (potasse)", role: "Donne des fruits sucrés et colorés, des fleurs, et rend la plante résistante aux maladies, au froid et à la sécheresse.", image: "La « vitamine des fruits ».",
    manque: "Bords des vieilles feuilles qui jaunissent puis brunissent comme brûlés ; fruits petits, peu sucrés, mûrissant mal.", trop: "Bloque le magnésium et le calcium.",
    sources: ["Purin et feuilles de consoude", "Cendre de bois (avec modération)", "Compost", "Fumier", "Peaux de banane compostées"], carence: "carence-potassium" },
  { id: "Ca", symbole: "Ca", nom: "Calcium", role: "Solidifie les parois des cellules : fruits fermes, pointes saines.", image: "Les « os » de la plante.",
    manque: "Cul noir des tomates et poivrons, pointes de salade brûlées. Souvent dû à des arrosages irréguliers plutôt qu'à un vrai manque.", trop: "Sol calcaire : bloque le fer (chlorose).",
    sources: ["Coquilles d'œufs broyées (très lent)", "Compost", "Lithothamne", "Arrosage régulier et paillage (pour qu'il circule)"], carence: "cul-noir" },
  { id: "Mg", symbole: "Mg", nom: "Magnésium", role: "Au cœur de la chlorophylle : permet à la feuille de capter la lumière.", image: "Le « cœur du vert ».",
    manque: "Jaunissement ENTRE les nervures des vieilles feuilles, nervures restées vertes.", trop: "Rare.",
    sources: ["Compost", "Dolomie", "Sel d'Epsom (sulfate de magnésium) en dépannage : 10 g par litre en arrosage"], carence: "carence-magnesium" },
  { id: "Fe", symbole: "Fe", nom: "Fer", role: "Indispensable pour fabriquer la chlorophylle.", image: "Il donne le vert des jeunes feuilles.",
    manque: "JEUNES feuilles (en haut) jaunes avec nervures vertes. Presque toujours un blocage par le calcaire, pas un vrai manque.", trop: "Rare.",
    sources: ["Compost et humus (débloquent le fer)", "Terre de bruyère pour les plantes de terre acide", "En dépannage, un engrais au fer portant la mention UAB (tous les chélates ne sont pas autorisés en bio)"], carence: "chlorose" },
  { id: "B", symbole: "B", nom: "Bore et oligo-éléments", role: "En toutes petites quantités : floraison, nouaison, qualité des racines.", image: "Les « vitamines » de la plante.",
    manque: "Cœur noir et creux des betteraves et céleris, tiges creuses des choux-fleurs, fruits déformés.", trop: "Toxique à forte dose : jamais de bore pur au hasard.",
    sources: ["Compost varié", "Algues", "Purin de consoude", "Fumiers"], carence: "carence-bore" },
];

export const BESOINS_PLANTES: { id: "gourmand" | "moyen" | "peu" | "ameliorant"; nom: string; emoji: string; explication: string; apport: string; quand: string }[] = [
  { id: "gourmand", nom: "Gourmandes", emoji: "🍽️", explication: "Elles produisent beaucoup (fruits, grosses feuilles) et vident le sol : il faut les nourrir copieusement.",
    apport: "4 à 5 kg de compost ou 3 à 5 kg de fumier bien décomposé par m², plus un purin (ortie au début, consoude à la floraison) tous les 15 jours.", quand: "Compost à la plantation et en paillage ; fumier à l'automne précédent." },
  { id: "moyen", nom: "Moyennement exigeantes", emoji: "🥗", explication: "Un sol entretenu leur suffit.",
    apport: "2 à 3 kg de compost mûr par m².", quand: "Au printemps, en surface, avant de semer ou de planter." },
  { id: "peu", nom: "Peu exigeantes", emoji: "🌱", explication: "Trop d'engrais leur nuit : racines fourchues (carottes), feuillage au lieu des bulbes (ail, oignon), aromates sans parfum.",
    apport: "Rien, ou un peu de compost très mûr (1 kg/m²) ; jamais de fumier frais.", quand: "Placez-les après une culture gourmande (rotation) : elles profitent des restes." },
  { id: "ameliorant", nom: "Améliorantes", emoji: "♻️", explication: "Les légumineuses (haricots, pois, fèves, trèfle) captent l'azote de l'air grâce aux petites boules de leurs racines et enrichissent le sol.",
    apport: "Aucun azote (elles en fabriquent) ; un peu de compost suffit.", quand: "Laissez les racines en terre après la récolte : elles nourrissent la culture suivante." },
];

export interface EngraisNaturel { nom: string; emoji: string; apporte: string; vitesse: string; usage: string; attention: string; lien?: string }
export const ENGRAIS_NATURELS: EngraisNaturel[] = [
  { nom: "Compost mûr", emoji: "♻️", apporte: "Un peu de tout + humus (le meilleur pour le sol)", vitesse: "Lente et durable", usage: "2 à 5 kg/m² par an en surface, pour tout le potager, les pots (1/3 du mélange), les fruitiers.", attention: "Mûr = noir, odeur de forêt, on ne reconnaît plus les déchets.", lien: "compost-tas" },
  { nom: "Fumier composté", emoji: "🐴", apporte: "Azote, potasse, humus", vitesse: "Moyenne", usage: "3 à 5 kg/m² à l'automne sur les planches des gourmands.", attention: "Jamais frais au contact des racines ; vérifier l'absence de désherbant dans le foin des chevaux.", lien: "fumiers" },
  { nom: "Purin d'ortie", emoji: "🌿", apporte: "Azote (feuilles, croissance)", vitesse: "Rapide", usage: "Dilué à 10 % en arrosage au pied, tous les 15 jours au printemps.", attention: "Stop à la floraison des légumes-fruits (sinon feuilles au lieu des fruits).", lien: "purin-ortie" },
  { nom: "Purin de consoude", emoji: "🍃", apporte: "Potasse (fleurs, fruits)", vitesse: "Rapide", usage: "Dilué à 10 à 20 % pour tomates, courges, fraisiers, dès la floraison.", attention: "Odeur forte : fût couvert.", lien: "purin-consoude" },
  { nom: "Cendre de bois", emoji: "🔥", apporte: "Potasse, calcium (remonte le pH)", vitesse: "Rapide", usage: "Une poignée par m² et par an au plus, sur sol acide, au pied des fruitiers et des tomates.", attention: "Seulement du bois naturel non traité ; à éviter en sol calcaire ; jamais en tas.", lien: "cendre" },
  { nom: "Corne broyée", emoji: "🐂", apporte: "Azote lent", vitesse: "Lente (2 à 3 mois)", usage: "50 à 100 g/m² à la plantation des gourmands, des rosiers, des fruitiers.", attention: "Hors de portée des chiens (ils la mangent)." },
  { nom: "Sang séché", emoji: "🔴", apporte: "Azote très rapide", vitesse: "Très rapide", usage: "30 g/m² en coup de fouet au printemps.", attention: "À petite dose : brûle les racines en excès." },
  { nom: "Poudre d'os", emoji: "🦴", apporte: "Phosphore et calcium", vitesse: "Lente", usage: "50 à 100 g/m² à la plantation des bulbes, fruitiers, rosiers.", attention: "Attire les chiens." },
  { nom: "Fientes de poules compostées", emoji: "🐔", apporte: "Azote, phosphore (très concentré)", vitesse: "Rapide", usage: "0,5 à 1 kg/m² seulement, compostées au moins 6 mois.", attention: "Fraîches, elles brûlent tout.", lien: "fumiers" },
  { nom: "Urine diluée", emoji: "💧", apporte: "Azote, potasse (engrais complet gratuit)", vitesse: "Rapide", usage: "1 volume pour 10 volumes d'eau, au pied, sur sol humide ; 2 fois par mois au plus.", attention: "Jamais pure, jamais sur les feuilles ni sur les légumes à manger crus juste avant la récolte ; pas pendant un traitement médicamenteux.", lien: "urine" },
  { nom: "Lombricompost et thé de vers", emoji: "🐛", apporte: "Engrais complet doux", vitesse: "Moyenne", usage: "Une poignée par pot, ou thé dilué 1 pour 10 en arrosage : parfait pour les plantes d'intérieur et les semis.", attention: "Le « jus » doit sentir la forêt, pas l'œuf pourri.", lien: "lombricompost" },
  { nom: "Engrais verts", emoji: "🌾", apporte: "Humus, azote (légumineuses), structure du sol", vitesse: "Une saison", usage: "Semés après une récolte, fauchés avant floraison, laissés en surface.", attention: "Ne pas laisser monter en graines.", lien: "engrais-verts" },
  { nom: "Marc de café", emoji: "☕", apporte: "Un peu d'azote", vitesse: "Lente", usage: "Mélangé au compost plutôt qu'épandu pur.", attention: "En couche épaisse il forme une croûte et freine la germination ; ce n'est ni un engrais miracle ni un anti-limaces fiable." },
  { nom: "Coquilles d'œufs broyées", emoji: "🥚", apporte: "Calcium (très lent)", vitesse: "Des années", usage: "Broyées fin, dans le compost.", attention: "N'empêchent pas le cul noir des tomates (c'est l'arrosage irrégulier)." },
  { nom: "Engrais liquide organique du commerce", emoji: "🧴", apporte: "Selon l'étiquette (N-P-K)", vitesse: "Rapide", usage: "Pots, jardinières, plantes d'intérieur : à demi-dose, du printemps à fin août.", attention: "Lisez les 3 chiffres : le 1er (N) pour les plantes vertes, le 3e (K) pour les fleurs et les fruits." },
];

export const ERREURS_ENGRAIS = [
  "Plus n'est pas mieux : l'excès d'engrais brûle les racines, attire les pucerons et pollue l'eau.",
  "Jamais d'engrais sur une terre sèche (arrosez avant) ni sur une plante qui vient d'être rempotée ou transplantée (attendez 1 mois).",
  "Un sol vivant (compost, paillage, vers de terre) nourrit mieux les plantes que n'importe quel engrais.",
  "Les feuilles jaunes ne sont pas toujours un manque d'engrais : trop d'eau, manque de lumière, vieillissement normal… vérifiez avec le diagnostic.",
  "En pot, tout s'épuise en 2 à 3 mois : rempotage tous les 1 à 3 ans et engrais en saison.",
  "Pas d'engrais en hiver pour les plantes d'intérieur et les arbres au repos.",
];

// Besoins des animaux
export interface NutritionAnimal { id: string; eau: string; base: string; besoins: string[]; mineraux: string; manque: string; astuce: string }
export const NUTRITION_ANIMAUX: NutritionAnimal[] = [
  { id: "poule", eau: "0,25 à 0,5 L par jour et par poule (le double par forte chaleur).", base: "Aliment complet « pondeuse » (16 à 17 % de protéines), de préférence certifié AB et sans anticoccidien : 120 à 130 g par jour, + parcours, verdure, restes autorisés (au plus 1/4 de la ration).",
    besoins: ["Protéines pour les œufs (insectes, vers, aliment pondeuse)", "Calcium pour les coquilles", "Petits graviers pour broyer (gésier)", "Énergie l'hiver (un peu de blé ou de maïs le soir)"],
    mineraux: "Coquilles d'huîtres broyées à volonté, à part ; grit (petits cailloux) si le parcours n'en a pas.", manque: "Œufs mous ou sans coquille (calcium), picage et plumes mangées (protéines), ponte faible.", astuce: "Le mélange de graines seul (blé, maïs) est trop pauvre en protéines pour des pondeuses : c'est l'erreur n° 1." },
  { id: "canard", eau: "1 à 2 L par jour, dans un récipient assez profond pour plonger la tête (ils nettoient leurs narines et leurs yeux).", base: "Aliment pour palmipèdes ou pondeuse (sans médicament anticoccidien pour volailles), 150 à 200 g par jour, + herbe, limaces.",
    besoins: ["Beaucoup d'eau pour avaler", "Vitamine B3 pour les canetons (pattes)", "Verdure"], mineraux: "Coquilles d'huîtres pour les canes pondeuses ; grit.", manque: "Canetons qui boitent ou ont les pattes arquées (manque de niacine : aliment pour canetons ou levure de bière).", astuce: "Jamais de pain : il gonfle et n'apporte rien (et pollue les mares)." },
  { id: "oie", eau: "1 à 2 L par jour, récipient profond.", base: "Essentiellement de l'herbe (1 à 2 kg par jour) : l'oie est un « mouton à plumes » ; complément de céréales l'hiver et à la ponte.",
    besoins: ["Herbe jeune en quantité", "Céréales l'hiver", "Grit"], mineraux: "Grit et coquilles à la ponte.", manque: "Amaigrissement l'hiver sans complément.", astuce: "Une oie entretient environ 200 à 300 m² d'herbe." },
  { id: "pintade", eau: "0,3 L par jour.", base: "Aliment complet volailles (plus riche en protéines pour les jeunes), parcours avec insectes.", besoins: ["Protéines (grandes chasseuses d'insectes)", "Calcium à la ponte"], mineraux: "Coquilles, grit.", manque: "Pintadeaux fragiles au froid et à l'humidité.", astuce: "Les pintadeaux ont besoin d'un aliment « démarrage » très riche (22 à 24 % de protéines)." },
  { id: "caille", eau: "Toujours disponible, abreuvoir à petits trous (noyade des poussins).", base: "Aliment pour cailles ou « démarrage dinde » (20 à 24 % de protéines), environ 25 à 30 g par jour.", besoins: ["Beaucoup de protéines (elles pondent presque un œuf par jour)", "Calcium"], mineraux: "Coquilles très fines.", manque: "Ponte qui chute, picage.", astuce: "Un aliment pour poules ordinaires est trop pauvre pour elles." },
  { id: "dindon", eau: "0,5 à 1 L par jour.", base: "Aliment « dinde » (dindonneaux : démarrage 26 à 28 % de protéines), herbe et parcours.", besoins: ["Protéines élevées pour les jeunes", "Herbe"], mineraux: "Grit, coquilles pour les pondeuses.", manque: "Croissance ralentie, pattes faibles chez les jeunes.", astuce: "Ne les élevez pas avec des poules au même endroit (histomonose transmise par les poules)." },
  { id: "pigeon", eau: "Eau propre renouvelée chaque jour, ils se baignent aussi.", base: "Mélange de graines pour pigeons (pois, maïs, blé, sorgho, vesces), 30 à 50 g par jour.", besoins: ["Graines variées", "Minéraux pour le « lait de jabot » des petits"], mineraux: "Grit minéralisé pour pigeons, pierre à picorer.", manque: "Pigeonneaux chétifs (manque de minéraux).", astuce: "Les parents nourrissent les petits avec un lait de jabot : ils ont besoin de plus de nourriture pendant cette période." },
  { id: "lapin", eau: "Toujours à volonté (0,1 L par kg de poids), surtout avec granulés.", base: "Foin à volonté (80 % de la ration), verdure fraîche (une poignée par kg de lapin), granulés en petite quantité (20 à 40 g/kg).",
    besoins: ["Fibres longues (foin) pour les dents et l'intestin", "Verdure variée", "Peu de sucre et d'amidon"], mineraux: "Le foin et les granulés suffisent ; pierre à lécher facultative.", manque: "Dents trop longues, arrêt du transit, diarrhée (trop de granulés ou de pain).", astuce: "Les changements d'alimentation se font sur 10 à 15 jours ; pas de salade iceberg, de pain ni de restes sucrés." },
  { id: "chevre", eau: "4 à 10 L par jour (beaucoup plus en lactation), eau propre : elles boudent l'eau sale.", base: "Foin et herbe, branches et haies à brouter ; céréales ou aliment chèvre seulement en lactation, en petite quantité.",
    besoins: ["Fibres (foin, broussailles)", "Minéraux (elles en sont très demandeuses)", "Peu de concentrés"], mineraux: "Pierre à lécher ou minéraux pour chèvres (avec cuivre) à volonté ; jamais de minéraux pour moutons (pas de cuivre).", manque: "Poils ternes, rêches ou roux, amaigrissement (cuivre, vers), boiteries.", astuce: "Trop de céréales ou de pain d'un coup = météorisation ou entérotoxémie, souvent mortelles." },
  { id: "mouton", eau: "4 à 8 L par jour.", base: "Herbe ; foin l'hiver (1,5 à 2 kg par brebis) ; complément en fin de gestation et allaitement.",
    besoins: ["Fibres", "Minéraux SANS cuivre", "Énergie en fin de gestation"], mineraux: "Pierre à lécher pour ovins (sans cuivre : il est toxique pour le mouton).", manque: "Toxémie de gestation (brebis couchée, faible avant l'agnelage) si sous-alimentée en fin de gestation.", astuce: "Ne leur donnez jamais d'aliment ou de minéraux pour chèvres, vaches ou chevaux (cuivre)." },
  { id: "ane", eau: "15 à 30 L par jour, eau tiède l'hiver (ils boivent moins l'eau glacée).", base: "Paille et foin grossier à volonté, herbe RATIONNÉE (l'âne est fait pour les terrains pauvres).",
    besoins: ["Beaucoup de fibres pauvres", "Peu de sucre (herbe riche = fourbure)", "Minéraux"], mineraux: "Pierre à lécher pour équidés.", manque: "Surpoids, bourrelets sur l'encolure, fourbure : c'est l'excès, pas le manque, qui menace les ânes.", astuce: "Un âne en bonne santé a presque toujours trop à manger : surveillez son tour de cou." },
  { id: "cheval", eau: "25 à 50 L par jour.", base: "Foin ou herbe (1,5 à 2 kg de matière sèche pour 100 kg de poids), aliment concentré seulement s'il travaille.", besoins: ["Fibres en continu (petits repas fréquents)", "Minéraux", "Eau à volonté"], mineraux: "Pierre à lécher, complément minéral équin.", manque: "Coliques (manque d'eau ou de fibres), amaigrissement.", astuce: "Toute transition alimentaire dure au moins 15 jours." },
  { id: "cochon", eau: "5 à 15 L par jour, eau claire à volonté.", base: "Aliment complet porc ou mélange céréales + protéines (pois, féverole), + légumes du jardin, fruits tombés.",
    besoins: ["Énergie (céréales)", "Protéines", "Minéraux"], mineraux: "Aliment complet ou complément minéral porc.", manque: "Croissance lente.", astuce: "INTERDIT par la loi : nourrir un cochon avec des restes de cuisine contenant viande, poisson ou produits laitiers (risque de peste porcine)." },
  { id: "abeille", eau: "Un point d'eau peu profond avec des appuis (cailloux, mousse) près du rucher.", base: "Nectar et pollen des fleurs ; en cas de disette, sirop de sucre (automne) ou candi (hiver) donné par l'apiculteur.",
    besoins: ["Pollen varié (protéines) au printemps", "Nectar (énergie)", "Réserves de miel pour l'hiver"], mineraux: "Ceux du pollen et de l'eau.", manque: "Colonie faible, pas de couvain (manque de pollen) ; famine en fin d'hiver.", astuce: "Plantez des fleurs mellifères étalées du printemps à l'automne : c'est leur garde-manger." },
];
