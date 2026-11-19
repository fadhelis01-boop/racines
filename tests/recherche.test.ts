// Recherche : 100 questions réelles et la page qui doit sortir dans les 3 premiers résultats.
// Pour ajouter un cas : une ligne [question, page attendue].
import { rechercher, ciblesInconnues } from "../src/lib/search";
import { ok } from "./outils";

const QUESTIONS: [string, string][] = [
  // Débuter
  ["je tue toutes mes plantes", "/debuter"],
  ["par où commencer", "/debuter"],
  ["plantes faciles", "/debuter"],
  ["premier potager", "/debuter?t=potager"],
  ["liste de courses", "/debuter?t=courses"],
  ["quels outils pour débuter", "/debuter?t=courses"],
  ["idée cadeau jardinier", "/debuter?t=offrir"],
  ["jardiner avec les enfants", "/guide/jardin-pour-tous"],
  ["potager petit budget", "/guide/jardin-sans-argent"],
  ["j'oublie d'arroser", "/jardin"],
  // Arrosage
  ["arroser", "/guide/arrosage-bien-arroser"],
  ["combien d'eau pour le potager", "/calculs?s=arrosage"],
  ["nombre de goutteurs", "/calculs?s=goutte"],
  ["arroser en hiver", "/guide/hivernage-pots"],
  ["plantes qui résistent à la sécheresse", "/guide/jardin-sec"],
  // Problèmes des plantes
  ["feuilles marron", "/probleme/air-sec"],
  ["petites mouches blanches", "/probleme/cochenilles"],
  ["ma plante ne pousse plus", "/probleme/manque-lumiere"],
  ["semis qui tombent", "/probleme/fonte-semis"],
  ["graines qui ne germent pas", "/guide/graines-maison"],
  ["basilic du supermarché qui meurt", "/interieur?t=aromates&a=basilic"],
  ["oïdium", "/probleme/oidium"],
  ["mildiou tomate", "/probleme/mildiou"],
  ["pucerons", "/probleme/pucerons"],
  ["limaces", "/probleme/limaces"],
  // Plantes (noms, fautes de frappe)
  ["tomate", "/plante/tomate"],
  ["courgette", "/plante/courgette"],
  ["ail quand planter", "/plante/ail"],
  ["pois", "/plante/pois"],
  ["monstéra", "/plante/monstera"],
  ["caoutchouc", "/plante/ficus"],
  ["framboisier", "/plante/framboisier"],
  ["tomatte", "/plante/tomate"],
  ["poireaux", "/plante/poireau"],
  ["fraisier", "/plante/fraisier"],
  // Jardin, arbres, aménagement
  ["planter un arbre fruitier", "/guide/planter-arbre"],
  ["planter une haie", "/guide/haie"],
  ["arbustes résistants au gel", "/plantes?froid=-15"],
  ["faire une terrasse en bois", "/guide/allees-terrasses"],
  ["dessiner mon jardin", "/jardin/plan"],
  ["tailler la vigne", "/guide/taille-par-fruitier"],
  ["potager d'hiver", "/guide/potager-hiver"],
  ["que planter en mars", "/calendrier"],
  ["les chats font caca dans le potager", "/guide/nuisibles-predateurs"],
  ["chaulage", "/agronome"],
  // Sol, agronomie, cours
  ["triangle des textures", "/agronome"],
  ["bilan humique", "/agronome"],
  ["combien d'azote", "/agronome"],
  ["degrés jours", "/agronome"],
  ["quiz", "/cours"],
  ["cours d'agronomie", "/cours"],
  ["sources", "/references"],
  ["imprimer", "/guides"],
  // Maraîchage, économie
  ["rentabilité d'une planche", "/plan-culture?t=economie"],
  ["combien de paniers amap", "/plan-culture?t=economie"],
  ["faire son terreau", "/guide/produire-ses-plants"],
  ["tunnel pas cher", "/guide/tunnel-petit-prix"],
  // Conserverie
  ["botulisme", "/guide/cs-securite"],
  ["temps de stérilisation", "/conserver?t=temps"],
  ["confiture de fraises", "/guide/cs-confitures"],
  ["compote", "/guide/cs-fruits-sucre"],
  ["chutney", "/guide/cs-vinaigre"],
  ["jus de pomme", "/guide/cs-jus-cidre"],
  ["liqueur de cassis", "/guide/cs-alcool"],
  ["fumoir", "/guide/cs-sel-huile-fumage"],
  ["tomates séchées", "/guide/cs-sechage"],
  ["congeler les haricots", "/guide/cs-congelation"],
  ["ratatouille en bocaux", "/guide/cs-plats-bocaux"],
  ["garder les pommes de terre", "/guide/cs-cave"],
  ["joints de bocaux", "/guide/cs-materiel"],
  ["trop de courgettes", "/conserver?t=assistant"],
  // Élevage
  ["ma poule ne pond plus en hiver", "/guide/ponte-lumiere-mue"],
  ["rations", "/calculs?s=rations"],
  ["stock de foin pour l'hiver", "/calculs?s=rations"],
  ["date de mise bas brebis", "/calculs?s=misebas"],
  ["registre d'élevage", "/guide/registre-elevage"],
  ["couveuse combien de jours", "/calculs?s=eclosion"],
  ["agneau qui ne tète pas", "/guide/naissances"],
  ["poules au potager", "/guide/poules-potager"],
  ["abreuvoir gelé", "/guide/hiver-basse-cour"],
  ["traire une chèvre", "/guide/traite-fromage"],
  ["tonte des moutons", "/guide/tonte-laine"],
  ["salmonelle", "/guide/hygiene-animaux"],
  ["que planter pour mes poules", "/guide/cultiver-pour-animaux"],
  ["race de poule pondeuse", "/animal/poule?t=races"],
  ["alpaga", "/guide/autres-animaux"],
  // Rucher
  ["varroa", "/guide/api-varroa"],
  ["essaimage", "/guide/api-essaimage"],
  ["couleur de la reine", "/guide/api-reines"],
  ["sirop de nourrissement", "/rucher"],
  ["ruche dadant", "/guide/api-materiel"],
  ["miel cristallisé", "/guide/api-produits"],
  ["où installer mes ruches", "/guide/api-miellees"],
  ["piqûre d'abeille", "/guide/api-securite"],
  ["déclarer mes ruches", "/guide/api-reseau"],
  ["calendrier apicole", "/guide/api-calendrier"],
  ["visiter une ruche", "/guide/api-visite"],
  ["abeilles mortes devant la ruche", "/maladie-animale/intoxication-abeilles"],
  ["couvain en mosaïque", "/maladie-animale/loque-americaine"],
  ["néonicotinoïdes abeilles", "/guide/api-pesticides"],
  // Audit jardinier et éleveur amateur
  ["lentilles", "/plante/lentille"],
  ["pois chiche", "/plante/pois-chiche"],
  ["kaki", "/plante/kaki"],
  ["ail des ours", "/plante/ail-des-ours"],
  ["punaise diabolique", "/probleme/punaises"],
  ["hoplocampe", "/probleme/hoplocampe"],
  ["mousse dans la pelouse", "/probleme/mousse-pelouse"],
  ["traitement d'hiver arbres fruitiers", "/guide/verger-protection"],
  ["fièvre catarrhale", "/maladie-animale/fco-mhe"],
  ["chèvre qui tousse", "/maladie-animale/pneumonie-ruminants"],
  ["gale mouton", "/maladie-animale/gale-poux-ruminants"],
  ["gourme", "/maladie-animale/gourme"],
  ["paramyxovirose pigeon", "/maladie-animale/paramyxovirose-pigeon"],
  ["peste porcine", "/maladie-animale/ppa"],
  ["quand appeler le vétérinaire", "/guide/veterinaire-urgences"],
  ["pharmacie de l'éleveur", "/guide/veterinaire-urgences"],
  ["combien coûte une chèvre", "/guide/debuter-animaux"],
  ["déclarer des poules", "/guide/debuter-animaux"],
  ["épervier poussins", "/guide/rapaces-volailles"],
  ["œufs couvés combien de temps", "/calculs?s=eclosion"],
  ["abattre un coq", "/guide/abattage-volaille"],
  ["parer les sabots de l'âne", "/maladie-animale/dents-sabots-equides"],
  // Audit apiculteur et plantes d'intérieur débutants
  ["comment commencer l'apiculture", "/guide/api-debuter"],
  ["acheter un essaim", "/guide/api-debuter"],
  ["ruche en ville", "/guide/api-emplacement"],
  ["distance ruche voisin", "/guide/api-emplacement"],
  ["reine introuvable", "/guide/api-reine-perdue"],
  ["abeilles mortes en hiver", "/guide/api-ruche-morte"],
  ["pillage", "/guide/api-pillage"],
  ["abeilles dans la cheminée", "/guide/essaim-batiment"],
  ["isolation ruche", "/guide/api-hivernage"],
  ["frelon asiatique piège", "/guide/api-frelon"],
  ["sauver une plante", "/guide/sauver-plante"],
  ["arroser par le bas", "/guide/pots-arrosage"],
  ["pot sans trou", "/guide/pots-arrosage"],
  ["quel terreau plante intérieur", "/interieur?t=entretien"],
  ["sortir les plantes l'été", "/guide/saisons-plantes-interieur"],
  ["plante près du radiateur", "/guide/saisons-plantes-interieur"],
  ["engrais plante intérieur", "/guide/engrais-interieur"],
  ["plante d'intérieur facile", "/debuter?t=increvables"],
  ["plante pour salle de bain", "/guide/plantes-par-piece"],
];

const top = (q: string) => rechercher(q, 3).map((h) => h.href);
for (const [q, attendu] of QUESTIONS) {
  const r = top(q);
  ok(r.includes(attendu), `recherche « ${q} » → ${attendu} (obtenu : ${r.join(" | ")})`);
}
ok(QUESTIONS.length >= 100, `au moins 100 questions de référence (${QUESTIONS.length})`);

// Faux amis : un mot contenu dans un autre ne déclenche pas la mauvaise page
const jamais = (q: string, interdit: string) => ok(!top(q).includes(interdit), `« ${q} » ne renvoie pas vers ${interdit} (obtenu : ${top(q).join(" | ")})`);
jamais("déclaration de ruches", "/calculs?s=rations");
jamais("traitement bio", "/guide/traite-fromage");
jamais("sol desséché", "/guide/cs-sechage");
jamais("combien de temps pour avoir des tomates", "/conserver?t=temps");
jamais("plante facile", "/guide/autres-animaux");
jamais("taches brunes feuilles intérieur", "/probleme/fusariose");

ok(ciblesInconnues().length === 0, `toutes les pages visées par les intentions existent (inconnues : ${ciblesInconnues().join(", ")})`);
