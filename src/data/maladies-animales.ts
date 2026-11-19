// Santé des animaux : problèmes fréquents, signes, gestes et urgence.
// Ces fiches aident à repérer et à réagir ; elles ne remplacent pas le vétérinaire.

export const SIGNES_ANIMAUX: Record<string, { label: string; emoji: string }> = {
  "ne-mange-plus": { label: "Ne mange plus ou presque plus", emoji: "🍽️" },
  abattu: { label: "Abattu, isolé, en boule, plumes ou poils ébouriffés", emoji: "😔" },
  diarrhee: { label: "Diarrhée, fientes anormales (liquides, vertes, sang)", emoji: "💩" },
  "plus-de-crottes": { label: "Ne fait plus de crottes ou de crottins", emoji: "🚫" },
  boiterie: { label: "Boite, marche mal, reste couché", emoji: "🦶" },
  maigrit: { label: "Maigrit, os saillants", emoji: "📉" },
  respiration: { label: "Tousse, éternue, respire bouche ouverte ou en sifflant", emoji: "😷" },
  "yeux-nez": { label: "Yeux gonflés, collés, écoulement du nez", emoji: "👁️" },
  gratte: { label: "Se gratte, perd ses plumes ou ses poils", emoji: "🐦" },
  parasites: { label: "Petits insectes ou points rouges/gris visibles (plumes, perchoirs, poils)", emoji: "🔍" },
  "ventre-gonfle": { label: "Ventre gonflé (surtout à gauche chez les ruminants)", emoji: "🎈" },
  "ponte-baisse": { label: "Ponte en baisse ou arrêtée", emoji: "🥚" },
  "oeufs-anormaux": { label: "Œufs mous, sans coquille, déformés ou picorés", emoji: "🥚" },
  "mort-subite": { label: "Mort brutale d'un ou plusieurs animaux", emoji: "⚠️" },
  gonflement: { label: "Gonflement, abcès, bosse", emoji: "🔴" },
  "coups-de-bec": { label: "Blessures, coups de bec, plumes arrachées entre eux", emoji: "🐔" },
  chaleur: { label: "Halète, ailes écartées, prostré par forte chaleur", emoji: "🥵" },
  "muqueuses-pales": { label: "Crête ou muqueuses de l'œil pâles", emoji: "⚪" },
  "se-roule": { label: "Se roule, gratte le sol, regarde ses flancs", emoji: "🌀" },
  "plaie-asticots": { label: "Plaie, laine ou poils souillés avec des asticots", emoji: "🐛" },
  couve: { label: "Reste au nid, gonfle les plumes, grogne", emoji: "🥚" },
  "tete-penchee": { label: "Tête penchée, perte d'équilibre, tourne en rond", emoji: "🌀" },
};

export interface MaladieAnimale {
  id: string; nom: string; especes: string[]; signesIds: string[]; alias: string[];
  urgence: 1 | 2 | 3; // 1 : à surveiller, 2 : vétérinaire dans les jours qui viennent, 3 : URGENCE
  signes: string; explication: string; quoiFaire: string[]; prevention: string[];
}

const V = ["poule", "canard", "oie", "pintade", "caille", "dindon", "pigeon"];
const R = ["chevre", "mouton"];
const EQ = ["ane", "cheval"];

export const MALADIES_ANIMALES: MaladieAnimale[] = [
  { id: "poux-rouges", nom: "Poux rouges (acariens des volailles)", especes: V, signesIds: ["muqueuses-pales", "ponte-baisse", "parasites", "abattu"], alias: ["poux rouges", "dermanyssus", "acariens poulailler", "poux poules"], urgence: 2,
    signes: "Crêtes pâles, poules fatiguées, ponte en baisse, refus d'entrer au poulailler le soir ; la nuit, petits points gris ou rouges sur les perchoirs et dans les fissures.",
    explication: "Acariens qui vivent dans le poulailler (pas sur les poules) et viennent sucer le sang la nuit ; ils pullulent dès les premières chaleurs et peuvent tuer par anémie.",
    quoiFaire: ["Inspection de nuit à la lampe (passez un papier blanc sous les perchoirs : traces rouges = poux écrasés).", "Videz, grattez, nettoyez à l'eau très chaude sous pression, laissez sécher, saupoudrez de terre de diatomée les fissures (masque).", "Recommencez tous les 7 jours pendant un mois (les œufs éclosent après le traitement).", "Infestation forte : produit acaricide vétérinaire autorisé."],
    prevention: ["Poulailler simple, sans recoins, perchoirs amovibles.", "Bain de poussière à disposition.", "Inspection tous les 15 jours d'avril à octobre (rappel dans « Mon jardin → Animaux »)."] },
  { id: "poux-volailles", nom: "Poux et gale des pattes (volailles)", especes: V, signesIds: ["gratte", "parasites", "boiterie"], alias: ["poux poules", "gale des pattes", "pattes croûteuses"], urgence: 1,
    signes: "Poules qui se grattent, plumes abîmées autour du cloaque et sous les ailes (petits insectes beiges, œufs collés à la base des plumes) ; ou écailles des pattes soulevées et croûteuses.",
    explication: "Les poux broyeurs vivent sur la poule ; la gale des pattes est due à un acarien qui creuse sous les écailles.",
    quoiFaire: ["Poux : poudre insecticide autorisée pour volailles ou terre de diatomée dans les plumes, bain de poussière ; recommencez à 10 jours.", "Gale des pattes : badigeonnez les pattes d'huile végétale tous les 2-3 jours pendant 3 semaines, nettoyez les perchoirs."],
    prevention: ["Bain de poussière (terre fine + cendre), quarantaine des nouvelles poules."] },
  { id: "arret-ponte", nom: "Ponte en baisse ou arrêtée", especes: ["poule", "canard", "caille", "pintade", "oie", "dindon"], signesIds: ["ponte-baisse"], alias: ["poule ne pond plus", "poules ne pondent plus", "plus d'oeufs", "arret de ponte", "baisse de ponte"], urgence: 1,
    signes: "Moins d'œufs, voire plus du tout.",
    explication: "Causes normales : jours courts (novembre-février), mue d'automne, âge (la ponte baisse après 2-3 ans), poule couveuse. Causes à corriger : manque de protéines ou de calcium, stress (prédateur, nouvelles poules, chaleur), poux rouges, vers, œufs pondus cachés ailleurs ou mangés.",
    quoiFaire: ["Vérifiez la saison et la mue (perte de plumes) : c'est souvent normal.", "Aliment pondeuse complet (16-17 % de protéines) et coquilles d'huîtres à volonté.", "Inspectez les perchoirs la nuit (poux rouges), observez les fientes (vers).", "Cherchez des nids cachés dans le parcours ; fermez les poules le matin jusqu'à 10 h pour quelques jours.", "Si une poule est abattue, crête pâle, sans pondre : voir le diagnostic."],
    prevention: ["Alimentation équilibrée, calme, ombre en été, poulailler sain."] },
  { id: "oeufs-anormaux", nom: "Œufs mous, sans coquille ou picorés", especes: ["poule", "canard", "caille"], signesIds: ["oeufs-anormaux"], alias: ["oeufs mous", "oeuf sans coquille", "coquille molle", "poules mangent leurs oeufs", "oeufs picores"], urgence: 1,
    signes: "Coquilles fines, molles ou absentes ; œufs déformés ; œufs cassés et mangés au nid.",
    explication: "Le plus souvent un manque de calcium (ou de vitamine D par manque de soleil), la chaleur, un stress ou l'âge ; parfois une maladie respiratoire. Les œufs picorés viennent souvent d'un œuf cassé une première fois, de l'ennui ou d'un manque de protéines.",
    quoiFaire: ["Coquilles d'huîtres broyées à volonté dans une mangeoire séparée.", "Ramassez les œufs deux fois par jour, nids sombres et garnis de paille.", "Œufs mangés : glissez des œufs factices (ou une balle de golf) dans les nids, plus de protéines, occupez les poules (verdure suspendue, grattage)."],
    prevention: ["Aliment pondeuse complet, parcours au soleil, calme."] },
  { id: "coccidiose", nom: "Coccidiose", especes: ["poule", "lapin", "pintade", "dindon", "caille", "chevre", "mouton"], signesIds: ["diarrhee", "abattu", "maigrit"], alias: ["coccidiose", "diarrhée sang", "poussins malades"], urgence: 3,
    signes: "Diarrhée parfois sanglante, jeunes animaux (poussins, lapereaux, chevreaux) abattus, plumes ou poils ternes, amaigrissement, mortalité.",
    explication: "Parasite microscopique de l'intestin, favorisé par l'humidité, la surpopulation et les litières sales ; surtout chez les jeunes.",
    quoiFaire: ["Isolez les malades, appelez le vétérinaire rapidement (traitement dans l'eau de boisson).", "Litière sèche et propre, abreuvoirs nettoyés chaque jour."],
    prevention: ["Litière sèche, pas de surpopulation, abreuvoirs propres et surélevés, parcours tournants."] },
  { id: "vers-digestifs", nom: "Vers digestifs (parasitisme)", especes: [...V, "lapin", ...R, ...EQ, "cochon"], signesIds: ["maigrit", "diarrhee", "muqueuses-pales", "ponte-baisse"], alias: ["vers", "vermifuge", "strongles", "ascaris", "animal maigre", "chevre maigre", "mouton maigre", "anemie"], urgence: 2,
    signes: "Amaigrissement malgré l'appétit, diarrhée, poil terne, ponte en baisse ; chez les ruminants, muqueuses de l'œil pâles et parfois « bouteille » (gonflement sous la mâchoire).",
    explication: "Les vers se transmettent par l'herbe ou le sol contaminés ; leur nombre augmente quand les animaux restent longtemps sur la même parcelle.",
    quoiFaire: ["Faites faire une coproscopie (analyse des crottes) par le vétérinaire avant de vermifuger : on choisit le bon produit, au bon moment, sans créer de résistance.", "Respectez le délai d'attente du médicament avant de consommer œufs, lait ou viande.", "Méthode FAMACHA (ruminants) : comparez la couleur de la muqueuse de l'œil à une carte ; pâle = anémie."],
    prevention: ["Rotation des parcelles, pâturage alterné entre espèces, pas de surpâturage, chicorée et sainfoin pour les ruminants, ramassage des crottins (équidés)."] },
  { id: "respiratoire-volailles", nom: "Maladie respiratoire des volailles (coryza, mycoplasmose)", especes: V, signesIds: ["respiration", "yeux-nez", "abattu", "ponte-baisse"], alias: ["poule eternue", "poule tousse", "rhume poule", "oeil gonfle poule"], urgence: 2,
    signes: "Éternuements, écoulement du nez, yeux gonflés ou mousseux, respiration bruyante, ponte en baisse.",
    explication: "Infections contagieuses favorisées par l'humidité, les courants d'air, l'ammoniac des litières et l'arrivée de nouvelles volailles porteuses.",
    quoiFaire: ["Isolez les malades au sec, appelez le vétérinaire (traitement adapté, certains oiseaux restent porteurs).", "Améliorez la ventilation sans courant d'air, changez la litière."],
    prevention: ["Quarantaine des nouveaux oiseaux, poulailler sec et aéré."] },
  { id: "grippe-aviaire", nom: "Influenza aviaire (grippe aviaire)", especes: V, signesIds: ["mort-subite", "abattu", "respiration", "ponte-baisse"], alias: ["grippe aviaire", "influenza", "mortalite volailles"], urgence: 3,
    signes: "Mortalité brutale de plusieurs oiseaux, crêtes et barbillons bleuis ou gonflés, chute brutale de la ponte, troubles respiratoires ou nerveux.",
    explication: "Maladie virale très contagieuse, transmise par les oiseaux sauvages ; maladie à déclaration obligatoire.",
    quoiFaire: ["URGENCE : appelez immédiatement votre vétérinaire ou la DDPP.", "Ne déplacez ni les oiseaux ni les cadavres, n'en donnez pas, limitez les allées et venues."],
    prevention: ["Respect des mesures de mise à l'abri en période de risque élevé, aliment et eau à l'abri des oiseaux sauvages, déclaration en mairie."] },
  { id: "picage", nom: "Picage et cannibalisme", especes: ["poule", "caille", "dindon", "pintade"], signesIds: ["coups-de-bec", "gratte"], alias: ["poules se battent", "picage", "plumes arrachees", "poule blessee", "coq agressif"], urgence: 2,
    signes: "Plumes arrachées sur le dos ou la queue, blessures, une poule harcelée par les autres.",
    explication: "Ennui, manque d'espace, manque de protéines (méthionine), lumière trop forte, chaleur, ou présence de sang (une blessure attire les coups de bec). Un coq trop « actif » abîme le dos des poules.",
    quoiFaire: ["Isolez immédiatement la poule blessée jusqu'à cicatrisation (spray coloré qui masque le rouge du sang).", "Plus d'espace, de quoi gratter et picorer (verdure suspendue, bottes de foin), aliment plus riche en protéines.", "Coq trop vigoureux : plus de poules (8 à 10 par coq) ou un tablier de protection pour les poules."],
    prevention: ["Densité raisonnable, parcours occupé, quarantaine et intégration progressive des nouvelles."] },
  { id: "poule-couveuse", nom: "Poule couveuse", especes: ["poule", "canard", "oie", "dindon"], signesIds: ["couve", "ponte-baisse"], alias: ["poule couveuse", "poule reste au nid", "poule glousse"], urgence: 1,
    signes: "La poule reste au nid jour et nuit, gonfle ses plumes et grogne quand on approche, ne pond plus.",
    explication: "Comportement naturel de couvaison (certaines races beaucoup plus que d'autres).",
    quoiFaire: ["Avec des œufs fécondés : laissez-la couver (21 jours) dans un nid isolé, eau et nourriture à portée (voir le tutoriel couvaison).", "Sans coq : retirez-la du nid plusieurs fois par jour, fermez le pondoir quelques jours ou placez-la 2-3 jours dans une cage grillagée sans litière au sol."],
    prevention: ["Ramassage quotidien des œufs."] },
  { id: "coup-chaleur", nom: "Coup de chaleur", especes: [...V, "lapin", ...R, ...EQ, "cochon"], signesIds: ["chaleur", "abattu", "mort-subite"], alias: ["canicule animaux", "chaleur poules", "chaleur lapin", "poule halete"], urgence: 3,
    signes: "Volailles qui halètent bec ouvert, ailes écartées ; lapin prostré, oreilles chaudes ; animal qui s'effondre.",
    explication: "Au-delà de 30 °C, volailles et lapins sont en danger (ils ne transpirent pas) ; les cochons ont besoin de boue pour se rafraîchir.",
    quoiFaire: ["Mettez l'animal à l'ombre, au frais, eau fraîche à disposition ; mouillez les pattes et la crête (volailles), les oreilles (lapin) sans plonger l'animal dans l'eau glacée.", "Vétérinaire si l'animal ne récupère pas dans l'heure."],
    prevention: ["Ombre, eau fraîche renouvelée deux fois par jour, bouteilles d'eau congelées pour les lapins, brumisation, pas de manipulation aux heures chaudes."] },
  { id: "stase-lapin", nom: "Arrêt du transit (lapin)", especes: ["lapin"], signesIds: ["ne-mange-plus", "plus-de-crottes", "abattu"], alias: ["lapin ne mange plus", "lapin ne fait plus de crottes", "stase digestive", "lapin ballonne"], urgence: 3,
    signes: "Le lapin ne mange plus, ne fait plus de crottes (ou de toutes petites), reste voûté, grince des dents.",
    explication: "Le système digestif du lapin doit fonctionner en continu ; un arrêt de plus de 12 heures est mortel. Causes : manque de foin, stress, douleur dentaire, chaleur, changement d'alimentation.",
    quoiFaire: ["URGENCE : vétérinaire le jour même (pas le lendemain).", "En attendant : foin à volonté, eau, garder au calme et au chaud ; ne donnez pas de médicaments humains."],
    prevention: ["Foin à volonté (80 % de la ration), transitions alimentaires lentes, contrôle des dents."] },
  { id: "myxomatose", nom: "Myxomatose et maladie hémorragique (lapin)", especes: ["lapin"], signesIds: ["yeux-nez", "gonflement", "mort-subite", "abattu"], alias: ["myxomatose", "vhd", "lapin yeux gonfles", "lapin mort subite"], urgence: 3,
    signes: "Myxomatose : yeux, paupières et parties génitales gonflés. Maladie hémorragique (VHD) : mort subite, parfois saignement du nez.",
    explication: "Maladies virales transmises par les moustiques, les puces (myxomatose) ou par contact, chaussures, herbe cueillie (VHD) ; souvent mortelles.",
    quoiFaire: ["Isolez, appelez le vétérinaire, vaccinez les autres lapins.", "Désinfectez le matériel ; ne réintroduisez pas de lapin non vacciné."],
    prevention: ["Vaccination annuelle contre la myxomatose et la VHD (souches 1 et 2), moustiquaire en été, pas d'herbe cueillie dans les zones à lapins sauvages."] },
  { id: "dents-lapin", nom: "Problèmes dentaires (lapin)", especes: ["lapin"], signesIds: ["ne-mange-plus", "maigrit"], alias: ["lapin bave", "dents lapin", "lapin maigrit"], urgence: 2,
    signes: "Bave, mange moins ou seulement les aliments tendres, amaigrissement, larmes, abcès de la joue.",
    explication: "Les dents du lapin poussent toute sa vie et ne s'usent qu'avec beaucoup de foin ; sinon elles forment des pointes qui blessent.",
    quoiFaire: ["Vétérinaire : limage des dents sous sédation si besoin.", "Plus de foin et de branches à ronger."],
    prevention: ["Foin à volonté, branches de pommier ou de saule, peu de granulés."] },
  { id: "meteorisation", nom: "Météorisation (ruminants)", especes: R, signesIds: ["ventre-gonfle", "abattu", "respiration"], alias: ["chevre gonflee", "mouton gonfle", "ballonnement", "ventre gonfle"], urgence: 3,
    signes: "Ventre très gonflé, surtout du côté gauche, animal qui souffre, respire mal, ne rumine plus.",
    explication: "Le rumen se remplit de gaz ou de mousse, souvent après de l'herbe jeune très riche (trèfle, luzerne), des céréales ou du pain en excès.",
    quoiFaire: ["URGENCE vétérinaire immédiate.", "En attendant : faites marcher l'animal, avant du corps surélevé ; retirez toute nourriture."],
    prevention: ["Transition progressive à l'herbe de printemps, foin avant la mise à l'herbe, pas de pain ni de céréales en excès."] },
  { id: "enterotoxemie", nom: "Entérotoxémie (ruminants)", especes: R, signesIds: ["mort-subite", "abattu", "diarrhee"], alias: ["mort subite chevre", "mort subite mouton"], urgence: 3,
    signes: "Mort brutale d'un animal en bonne santé apparente, parfois convulsions ou diarrhée juste avant.",
    explication: "Toxines bactériennes libérées dans l'intestin après un changement d'alimentation (herbe riche, concentrés).",
    quoiFaire: ["Vétérinaire immédiatement pour les autres animaux du troupeau."],
    prevention: ["Vaccination, transitions alimentaires lentes."] },
  { id: "pietin", nom: "Piétin et parage des onglons", especes: R, signesIds: ["boiterie"], alias: ["chevre boite", "mouton boite", "onglons", "pietin"], urgence: 2,
    signes: "Boiterie, animal qui broute à genoux, odeur forte entre les doigts, onglons trop longs ou décollés.",
    explication: "Onglons non parés et sol humide favorisent l'infection bactérienne contagieuse (piétin).",
    quoiFaire: ["Parez les onglons, nettoyez, pédiluve au sulfate de zinc ; vétérinaire si plusieurs animaux boitent.", "Isolez les boiteux du troupeau."],
    prevention: ["Parage toutes les 6 à 8 semaines (rappel dans « Mon jardin »), zone sèche dans le parc."] },
  { id: "myiase", nom: "Myiase (asticots)", especes: [...R, "lapin"], signesIds: ["plaie-asticots", "abattu", "gratte"], alias: ["asticots", "mouches mouton", "lapin asticots"], urgence: 3,
    signes: "Animal qui s'agite, se mord l'arrière-train, laine ou poils souillés et humides, odeur ; asticots visibles.",
    explication: "Les mouches pondent dans la laine ou les poils souillés (diarrhée, urine) par temps chaud et humide ; les asticots attaquent la chair vivante en quelques heures.",
    quoiFaire: ["URGENCE : tondez ou coupez les poils de la zone, retirez tous les asticots, nettoyez, appelez le vétérinaire."],
    prevention: ["Surveillance quotidienne de l'arrière-train en été, tonte et coupe de la laine souillée, traitement préventif sur conseil vétérinaire, litière propre pour les lapins."] },
  { id: "fourbure", nom: "Fourbure (ânes, chevaux, poneys)", especes: EQ, signesIds: ["boiterie", "abattu"], alias: ["fourbure", "ane boite", "cheval boite", "pieds chauds"], urgence: 3,
    signes: "Boiterie des antérieurs, l'animal s'appuie sur les talons, sabots chauds, refuse d'avancer ou reste couché.",
    explication: "Inflammation très douloureuse des sabots, déclenchée le plus souvent par l'herbe riche en sucres (printemps, automne) chez les ânes et poneys en surpoids.",
    quoiFaire: ["URGENCE vétérinaire.", "Retirez immédiatement l'animal de l'herbe, sol souple, foin pauvre ou paille."],
    prevention: ["Herbe rationnée, poids surveillé, parage régulier, paille et foin grossier pour les ânes."] },
  { id: "coliques", nom: "Coliques (ânes, chevaux)", especes: EQ, signesIds: ["se-roule", "plus-de-crottes", "ne-mange-plus"], alias: ["colique", "cheval se roule", "ane se roule"], urgence: 3,
    signes: "L'animal se roule, gratte le sol, regarde ou mord ses flancs, ne fait plus de crottins, transpire.",
    explication: "Douleur abdominale (blocage, torsion, gaz) aux causes multiples : changement d'alimentation, manque d'eau, sable, vers.",
    quoiFaire: ["URGENCE vétérinaire.", "Retirez la nourriture, marchez en main calmement en attendant."],
    prevention: ["Eau propre et tiède en hiver, foin régulier, transitions lentes, vermifugation raisonnée."] },
  { id: "botulisme", nom: "Botulisme (canards, volailles)", especes: ["canard", "oie", "poule"], signesIds: ["boiterie", "abattu", "mort-subite"], alias: ["canard paralyse", "cou mou"], urgence: 3,
    signes: "Paralysie progressive des pattes, puis des ailes et du cou (cou mou) ; mortalité.",
    explication: "Toxine produite dans l'eau stagnante chaude et les cadavres en décomposition.",
    quoiFaire: ["Vétérinaire immédiatement ; vidangez et nettoyez mares et bassins ; retirez tous les cadavres."],
    prevention: ["Eau renouvelée, bassins nettoyés, cadavres d'animaux retirés rapidement."] },
  { id: "varroa", nom: "Varroa (abeilles)", especes: ["abeille"], signesIds: ["mort-subite", "parasites"], alias: ["varroa", "abeilles ailes deformees", "colonie faible"], urgence: 2,
    signes: "Abeilles aux ailes déformées, colonie qui s'affaiblit en fin d'été, acariens rouges sur les abeilles ou le couvain.",
    explication: "Acarien parasite présent dans presque toutes les ruches ; sans traitement, la colonie meurt en 1 à 3 ans.",
    quoiFaire: ["Comptage (plateau grillagé, sucre glace), traitement avec un médicament autorisé après la récolte d'été et en hiver hors couvain."],
    prevention: ["Suivi mensuel, traitements raisonnés, conseils du groupement sanitaire apicole (GDSA)."] },
  { id: "predation", nom: "Attaque de prédateur", especes: [...V, "lapin"], signesIds: ["mort-subite", "coups-de-bec"], alias: ["renard a tue", "poules tuees", "attaque poulailler", "fouine"], urgence: 2,
    signes: "Animaux tués ou disparus, plumes éparpillées, cadavres décapités ou saignés à la gorge (fouine, martre), cadavres emportés (renard).",
    explication: "Renard (crépuscule, aube, creuse sous les clôtures), fouine et martre (passent par 5 cm, tuent tout), chiens errants, rapaces (jeunes).",
    quoiFaire: ["Repérez le point d'entrée, réparez avant la nuit, fermez le poulailler chaque soir.", "Voir le tutoriel « Renard, fouine, rats… » pour les protections."],
    prevention: ["Porte automatique, grillage soudé à petites mailles, enterré ou rabattu, fil électrique bas."] },
];

// Apiculture : signes, maladies et dangers propres aux abeilles ; fiche Varroa enrichie
import { MALADIES_ABEILLES, SIGNES_ABEILLES, VARROA_ENRICHI } from "./apiculture";
Object.assign(SIGNES_ANIMAUX, SIGNES_ABEILLES);
{
  const v = MALADIES_ANIMALES.find((m) => m.id === "varroa");
  if (v) Object.assign(v, VARROA_ENRICHI);
}
MALADIES_ANIMALES.push(...MALADIES_ABEILLES);

// Porcs : deux maladies fréquentes en élevage familial plein air
MALADIES_ANIMALES.push(
  { id: "rouget-porc", nom: "Rouget du porc", especes: ["cochon"], signesIds: ["abattu", "boiterie", "ne-mange-plus"], alias: ["rouget", "rouget du porc", "plaques rouges cochon", "losanges rouges"], urgence: 3,
    signes: "Fièvre, abattement, plaques rouges en losange sur la peau, boiteries ; parfois mort brutale.",
    explication: "Bactérie présente dans le sol et chez les porcs porteurs ; fréquente en plein air.",
    quoiFaire: ["Vétérinaire rapidement : un antibiotique est efficace s'il est donné tôt.", "Isoler l'animal malade, surveiller les autres."],
    prevention: ["Vaccination avec rappel annuel, souvent conseillée en plein air.", "Rotation des parcs."] },
  { id: "gale-porc", nom: "Gale du porc", especes: ["cochon"], signesIds: ["gratte", "maigrit"], alias: ["gale porc", "cochon se gratte", "croutes oreilles cochon"], urgence: 2,
    signes: "Démangeaisons intenses, le porc se frotte partout, croûtes sur les oreilles, retard de croissance.",
    explication: "Acarien qui creuse la peau ; il passe d'un porc à l'autre et survit quelques jours dans la cabane.",
    quoiFaire: ["Traitement vétérinaire de tous les porcs en même temps.", "Nettoyer et changer la litière, laisser la cabane vide quelques jours si possible."],
    prevention: ["Acheter des porcelets d'un élevage sain, quarantaine de 3 semaines."] },
);

// Maladies courantes en élevage expert (ruminants, lapins, volailles)
import { MALADIES_ELEVAGE, SIGNES_ELEVAGE } from "./maladies-elevage";
Object.assign(SIGNES_ANIMAUX, SIGNES_ELEVAGE);
MALADIES_ANIMALES.push(...MALADIES_ELEVAGE.filter((m) => !MALADIES_ANIMALES.some((x) => x.id === m.id)));
