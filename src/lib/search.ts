import { PLANTES, PROBLEMES, REMEDES, GUIDES, ANIMAUX, SIGNES } from "../data/index";
import { norm } from "./garden";
import { LEXIQUE } from "../data/lexique";
import { MALADIES_ANIMALES } from "../data/maladies-animales";
import { AMENAGEMENTS } from "../data/amenagements";
import { GESTES_RECOLTE } from "../data/cueillette";
import { AROMATES_INT } from "../data/interieur-hub";
import { PAILLAGES } from "../data/methodes";
import { RACES } from "../data/races";

// Moteur de recherche : noms courants et synonymes, texte complet des fiches,
// questions en phrase (« quand planter les tomates », « ma poule ne pond plus »),
// symptômes (→ diagnostic) et tolérance aux fautes de frappe.

export interface Hit { href: string; emoji: string; titre: string; type: string; score: number; id?: string }
interface Doc { href: string; emoji: string; titre: string; type: string; noms: string; texte: string; id?: string; principal: boolean; animal?: boolean }

// Autres noms des animaux (pour « coq », « brebis », « ruche »…)
const ALIAS_ANIMAUX: Record<string, string> = {
  poule: "poules coq coqs poussin poussins ponte oeuf oeufs volaille volailles poulailler pondeuse",
  canard: "canards cane canes caneton", oie: "oies jars oison", pintade: "pintades pintadeau", caille: "cailles",
  lapin: "lapins lapine lapereau clapier", chevre: "chevres bouc chevreau caprin", mouton: "moutons brebis agneau belier ovin",
  ane: "anes anesse anon", cheval: "chevaux poney poneys jument equide", cochon: "cochons porc porcs truie porcelet",
  abeille: "abeilles ruche ruches rucher apiculture apiculteur miel essaim essaims", dindon: "dinde dindes dindonneau", pigeon: "pigeons pigeonneau colombe",
};

const MOTS_ANIMAUX = new Set([...Object.keys(ALIAS_ANIMAUX), ...Object.values(ALIAS_ANIMAUX).flatMap((v) => v.split(" ")), "vache", "vaches", "veau", "alpaga", "alpagas", "lama", "lamas", "paon", "paons", "faisan", "faisans", "cobaye", "animal", "animaux", "betes"]);
export function animalDe(q: string): string | undefined {
  const nq = norm(q);
  return Object.entries(ALIAS_ANIMAUX).find(([k, v]) => new RegExp(`(^|[^a-z])(${k}|${v.split(" ").join("|")})($|[^a-z])`).test(nq))?.[0];
}

let DOCS: Doc[] | null = null;
function docs(): Doc[] {
  if (DOCS) return DOCS;
  DOCS = [
    ...PLANTES.map((p) => ({ principal: true, id: p.id, href: `/plante/${p.id}`, emoji: p.emoji, titre: p.nom, type: p.categorie === "fleur" || p.categorie === "ornement" ? "Fleur et jardin d'agrément" : p.categorie === "arbre" ? "Arbre fruitier" : p.categorie === "interieur" ? "Plante d'intérieur" : p.categorie === "toxique" ? "Plante dangereuse" : p.categorie === "sauvage" ? "Plante sauvage" : "Plante", noms: norm([p.nom, p.latin, ...(p.alias ?? []), ...(p.latins ?? [])].join(" | ")), texte: norm([p.intro, ...p.etapes, ...p.entretien, p.conservation ?? "", p.lumiere ?? "", p.arrosageDetail ?? "", p.toxique ?? "", p.sansDangerAnimaux ? "sans danger chats chiens" : ""].join(" ")) })),
    ...LEXIQUE.map((t) => ({ principal: false, id: t.wiki ? "lex-" + t.id : undefined, href: `/lexique?t=${t.id}`, emoji: "📖", titre: t.terme, type: "Lexique", noms: norm([t.terme, ...(t.alias ?? [])].join(" | ")), texte: norm(t.def) })),
    ...ANIMAUX.map((a) => ({ animal: true, principal: true, id: a.id, href: `/animal/${a.id}`, emoji: a.emoji, titre: a.nom, type: "Animal", noms: norm(a.nom + " | " + (ALIAS_ANIMAUX[a.id] ?? "")), texte: norm([a.resume, ...a.quotidien, ...a.alimentation, ...a.interdits, ...a.reglementation, ...a.sante.map((s) => s.signe)].join(" ")) })),
    ...MALADIES_ANIMALES.map((m) => ({ animal: true, principal: true, id: m.especes[0], href: `/maladie-animale/${m.id}`, emoji: "⚕️", titre: m.nom, type: "Santé des animaux", noms: norm([m.nom, ...m.alias].join(" | ")), texte: norm([m.signes, m.explication, ...m.especes.map((e) => ALIAS_ANIMAUX[e] ?? e)].join(" ")) })),
    ...PROBLEMES.map((p) => ({ principal: true, id: p.id, href: `/probleme/${p.id}`, emoji: "⚕️", titre: p.nom, type: "Santé des plantes", noms: norm([p.nom, ...(p.alias ?? []), ...p.signes.map((s) => SIGNES[s].label)].join(" | ")), texte: norm([p.cible, ...p.symptomes, p.conditions].join(" ")) })),
    ...AMENAGEMENTS.map((a) => ({ principal: false, id: a.id, href: `/amenagements?id=${a.id}`, emoji: a.emoji, titre: a.nom, type: "Aménagement", noms: norm([a.nom, "amenager amenagement jardin"].join(" | ")), texte: norm([a.resume, ...a.avantages, ...a.inconvenients].join(" ")) })),
    ...GESTES_RECOLTE.map((g) => ({ principal: false, id: g.id, href: `/cueillette?g=${g.id}`, emoji: g.emoji, titre: "Cueillir — " + g.titre, type: "Bien cueillir", noms: norm(["cueillir recolter cueillette comment recolter", g.titre].join(" | ")), texte: norm([g.quand, ...g.comment].join(" ")) })),
    { principal: false, href: "/interieur", emoji: "🌿", titre: "Plantes d'intérieur et aromates (avec ou sans lampe)", type: "Espace intérieur", noms: norm("plantes d'interieur | plante interieur | plantes vertes | aromates interieur | herbes interieur | lampe de culture | lampe horticole | sans lampe | appartement sombre | quelle plante pour ma fenetre"), texte: norm("fenetre sud nord est ouest lampe aromates bouture substrat") },
    { principal: false, href: "/interieur?t=lampe", emoji: "💡", titre: "Lampe de culture : calculer puissance, distance, coût", type: "Espace intérieur", noms: norm("lampe de culture | lampe horticole | led horticole | eclairage plantes | combien de watts"), texte: norm("puissance distance heures consommation kwh") },
    { principal: false, href: "/interieur?t=multiplier", emoji: "✂️", titre: "Multiplier ses plantes d'intérieur (boutures, divisions)", type: "Espace intérieur", noms: norm("bouturer plante interieur | bouture pothos | bouture monstera | diviser plante | rejets | keiki"), texte: norm("bouture tige noeud eau division") },
    ...AROMATES_INT.map((a) => ({ principal: false, id: a.id, href: "/interieur?t=aromates&a=" + encodeURIComponent(a.id ?? a.nom), emoji: a.emoji, titre: `${a.nom} en intérieur`, type: "Aromate en intérieur", noms: norm([`${a.nom} en interieur`, `${a.nom} interieur`, `${a.nom} lampe`, `${a.nom} appartement`, `${a.nom} supermarche`].join(" | ")), texte: norm([a.sansLampe, a.avecLampe, a.demarrer, a.piege].join(" ")) })),
    { principal: false, href: "/sol", emoji: "🌍", titre: "Mon sol : identifier son type de sol (test guidé)", type: "Outil", noms: norm("type de sol | quel sol | mon sol | sol argileux | sol sableux | sol calcaire | sol acide | terre argileuse | analyse de sol | ph du sol | test du sol"), texte: norm("boudin vinaigre chou rouge vers de terre plantes indicatrices ameliorer") },
    { principal: false, href: "/sol?t=ph", emoji: "🎨", titre: "Acide ou calcaire ? Le pH du sol et le test du chou rouge", type: "Outil", noms: norm("ph | ph du sol | sol acide | sol calcaire | chou rouge | plantes indicatrices"), texte: norm("vinaigre mousse indicateur couleur") },
    { principal: false, href: "/nutrition", emoji: "🍽️", titre: "Nourrir ses plantes : besoins, N-P-K, carences", type: "Outil", noms: norm("engrais | nourrir les plantes | npk | azote phosphore potassium | besoins des plantes | carence | quel engrais | fertiliser"), texte: norm("gourmand compost fumier purin feuilles jaunes") },
    { principal: false, href: "/nutrition?t=engrais", emoji: "🧺", titre: "Les engrais naturels comparés", type: "Outil", noms: norm("engrais naturel | engrais bio | corne broyee | sang seche | poudre d'os | cendre | marc de cafe | coquilles d'oeufs | guano"), texte: norm("dose vitesse attention") },
    { principal: false, href: "/nutrition?t=animaux", emoji: "🐔", titre: "Nourrir ses animaux : besoins de chaque espèce", type: "Outil", noms: norm("nourrir les animaux | alimentation animaux | ration | besoins animaux | mineraux | pierre a lecher | coquilles d'huitres | quoi donner"), texte: norm("eau proteines fibres mineraux poules chevres lapins") },
    { principal: false, href: "/amenagements", emoji: "🧭", titre: "Quelle méthode de potager pour moi ? (assistant)", type: "Outil", noms: norm("quelle methode potager | methode de potager | type de potager | choisir potager | modes de culture | techniques de potager | monticule | monticules | butte | lasagne | carre potager | bottes de paille | sacs de culture | potager en rangs"), texte: norm("avantages inconvenients pas a pas debutant") },
    { principal: false, href: "/amenagements?t=paillages", emoji: "🌾", titre: "Les paillages comparés (paille, tonte, feuilles, BRF, carton…)", type: "Outil", noms: norm("paillage | pailler | paillis | quel paillage | mulch | brf | toile de paillage | paillettes de lin"), texte: norm(PAILLAGES.map((x) => x.nom + " " + x.plus + " " + x.moins).join(" ")) },
    ...ANIMAUX.map((a) => ({ animal: true, principal: false, id: a.id, href: `/animal/${a.id}?t=races`, emoji: a.emoji, titre: `Races : ${a.nom.split(" (")[0].toLowerCase()}`, type: "Animal", noms: norm(`races ${a.nom} | race ${a.id} | ${(RACES[a.id] ?? []).map((r) => r.nom).join(" | ")}`), texte: norm((RACES[a.id] ?? []).map((r) => r.pour + " " + r.texte).join(" ")) })),
    { animal: true, principal: false, href: "/calculs?s=eclosion", emoji: "🐣", titre: "Calculer la date d'éclosion (poule, cane, oie, caille…)", type: "Outil", noms: norm("eclosion | date d eclosion | couvaison | incubation | mirage | mirer les oeufs | couveuse"), texte: norm("21 jours 28 jours retournement humidite temperature") },
    { principal: true, href: "/conserver", emoji: "🥫", titre: "Conserver ses récoltes : méthodes, temps, garde-manger", type: "Outil", noms: norm("conserver | conservation | conserves | conserver ses recoltes | conserver les legumes | conserver les fruits | garde manger | inventaire conserves | stock de conserves | mes bocaux | etiquettes bocaux | etiquette bocaux | numero de lot"), texte: norm("cave congelation sterilisation lacto fermentation sechage confiture vinaigre jus cidre huile sel fumage") },
    { principal: false, href: "/conserver?t=assistant", emoji: "🤔", titre: "J'ai trop de… : que faire de mon surplus ?", type: "Outil", noms: norm("j ai trop de | trop de tomates | trop de courgettes | surplus | surplus de courgettes | surplus de tomates | que faire de mes | ecouler | abondance de recolte | gaspillage"), texte: norm("conserver congeler bocaux secher donner") },
    { principal: false, href: "/conserver?t=temps", emoji: "⏱️", titre: "Temps de stérilisation, de pasteurisation et de blanchiment", type: "Outil", noms: norm("temps de sterilisation | combien de temps steriliser | temps de blanchiment | temps de pasteurisation | bareme sterilisation | sterilisation en altitude"), texte: norm("bocaux 0,5 l 1 l haricots tomates compote fruits au sirop autoclave") },
    { principal: false, href: "/conserver?t=calculs", emoji: "🧮", titre: "Calculs de conserverie : bocaux, sel, sucre, conserves de l'année", type: "Outil", noms: norm("combien de bocaux | combien de sucre confiture | quantite de sel lacto | combien de conserves pour l annee | rendement coulis | combien de kilos de tomates"), texte: norm("rendement saumure sucre plan annee") },
    { principal: false, href: "/conserver?t=calendrier", emoji: "📅", titre: "Calendrier des conserves, mois par mois", type: "Outil", noms: norm("calendrier des conserves | quand faire ses conserves | conserves du mois | quelles conserves ce mois"), texte: norm("confitures coulis sirops jus") },
    { animal: true, principal: true, href: "/rucher", emoji: "🐝", titre: "Mon rucher : ruches, visites, varroa, traitements", type: "Outil", noms: norm("mon rucher | carnet du rucher | carnet de visites | suivi des ruches | registre des traitements | registre ruches | comptage varroa | pertes hivernales | pertes d hiver | mortalite hivernale | couleur de la reine"), texte: norm("visite reine oeufs couvain cadres varroa seuil traitement lot ordonnance") },
    { principal: false, href: "/plantes?froid=-15", emoji: "❄️", titre: "Plantes rustiques : trier selon le froid qu'elles supportent", type: "Outil", noms: norm("plantes rustiques | resistantes au froid | resiste au gel | rusticite | plantes qui supportent le gel | arbustes rustiques"), texte: norm("rusticite degres hiver gel montagne") },
    { principal: false, href: "/calculs?s=arrosage", emoji: "💧", titre: "Combien arroser : besoin en eau par culture et par mois", type: "Outil", noms: norm("combien arroser | besoin en eau | litres par m2 | arrosage calcul | evapotranspiration | etp"), texte: norm("tomate potager pelouse paillage pluie") },
    { principal: false, href: "/calculs?s=goutte", emoji: "🚿", titre: "Dimensionner un goutte-à-goutte (débit, goutteurs, secteurs, durée)", type: "Outil", noms: norm("dimensionner goutte a goutte | debit robinet | test du seau | nombre de goutteurs | secteurs arrosage | duree d arrosage"), texte: norm("goutteur ligne programmateur") },
    { principal: false, href: "/jardin/plan", emoji: "🗺️", titre: "Plan du jardin à l'échelle (maison, arbres, allées, ombres, export)", type: "Outil", noms: norm("plan du jardin | plan a l echelle | dessiner son jardin | plan de masse | ombre des arbres | exporter le plan"), texte: norm("maison terrasse allee arbre haie mare nord echelle imprimer image") },
    { principal: false, href: "/calculs?s=rations", emoji: "🌾", titre: "Rations des animaux et foin à stocker pour l'hiver", type: "Outil", noms: norm("ration | rations | combien de foin | foin pour l hiver | stock de foin | concentre | granules lapin | ration chevre | ration brebis"), texte: norm("chevre brebis lapin poule gestation lactation entretien bottes balles") },
    { principal: false, animal: true, href: "/calculs?s=misebas", emoji: "🐐", titre: "Date de mise bas : gestation, préparation, sevrage", type: "Outil", noms: norm("date de mise bas | calcul gestation | gestation | agnelage | chevrotage | mise bas prevue | sevrage"), texte: norm("chevre brebis lapine anesse jument truie saillie") },
    { principal: false, animal: true, href: "/jardin/animaux", emoji: "🍼", titre: "Carnet de reproduction et performances de l'élevage", type: "Outil", noms: norm("carnet de reproduction | carnet d agnelage | saillies | mises bas | taux de ponte | cout de revient | croissance | pesee | lait par chevre"), texte: norm("bilan femelle prolificite survie gain moyen quotidien") },
    { principal: false, href: "/calendrier", emoji: "📅", titre: "Calendrier du mois : que semer, planter, récolter maintenant", type: "Outil", noms: norm("calendrier | calendrier du potager | que planter ce mois | que semer maintenant | quoi semer | travaux du mois | calendrier lunaire | semis du mois | plantations du mois"), texte: norm("janvier fevrier mars avril mai juin juillet aout septembre octobre novembre decembre semis plantation recolte") },
    { principal: false, href: "/plan-culture", emoji: "📋", titre: "Plan de culture : produire en continu, séries, successions", type: "Outil", noms: norm("plan de culture | planifier | planning potager | echelonner | semis echelonnes | succession | successions | relais | production continue | combien de plants | nombre de plants | plants par planche"), texte: norm("series semis graines surface planche nurserie temps de travail") },
    { principal: false, href: "/plan-culture?t=planches", emoji: "🌍", titre: "Mes planches : occupation, successions, cahier de culture", type: "Outil", noms: norm("occupation des planches | apres les feves | quoi planter apres | interculture | cahier de culture | serie de planches | planches de 75"), texte: norm("libre engrais vert interventions") },
    { principal: false, href: "/plan-culture?t=nurserie", emoji: "🌱", titre: "Nurserie : quand semer en mottes", type: "Outil", noms: norm("nurserie | plants en mottes | plaque alveolee | semis en motte | quand semer les plants"), texte: norm("semaines plantation") },
    { principal: false, href: "/plan-culture?t=temps", emoji: "⏱️", titre: "Temps de travail au potager", type: "Outil", noms: norm("temps de travail | combien d heures | heures par semaine potager"), texte: norm("surface methode paillage") },
    { principal: false, href: "/bio", emoji: "📊", titre: "Mon éco-score : où en est mon jardin bio et écoresponsable ?", type: "Outil", noms: norm("eco score | ecoscore | jardin ecologique | jardin bio | ecoresponsable | empreinte | mes pratiques"), texte: norm("sol eau biodiversite energie dechets intrants animaux") },
    { principal: false, href: "/bio?t=labels", emoji: "🏷️", titre: "Les labels bio et écologiques expliqués", type: "Outil", noms: norm("label | labels | logo bio | ab | uab | ecolabel | vegetal local | plante bleue | demeter | nature et progres"), texte: norm("terreau sans tourbe semences bio") },
    { principal: false, href: "/jardin", emoji: "🔔", titre: "Mes plantes : rappels d'arrosage sur le téléphone", type: "Débuter", noms: norm("rappel | rappels | notification | notifications | alerte arrosage | j oublie d arroser | me prevenir"), texte: norm("agenda telephone arrosage verifier") },
    { principal: false, href: "/debuter", emoji: "🌱", titre: "Je débute : par où commencer (même sans la main verte)", type: "Débuter", noms: norm("debuter | je debute | debutant | main verte | par ou commencer | plantes increvables | plantes faciles"), texte: norm("premier mois increvables aromates legumes balcon liste de courses") },
    { principal: false, href: "/interieur?t=catalogue&facile=1", emoji: "💪", titre: "Les plantes d'intérieur increvables", type: "Débuter", noms: norm("increvable | increvables | plante facile | plantes faciles | plante robuste | indestructible"), texte: norm("facile oubli arrosage peu de lumiere") },
    { principal: false, href: "/debuter?t=offrir", emoji: "🎁", titre: "Offrir une plante (facile, sans danger)", type: "Débuter", noms: norm("offrir une plante | plante cadeau | cadeau"), texte: norm("facile sans danger animaux fleurs") },
    { principal: false, href: "/debuter?t=courses", emoji: "🛒", titre: "La liste de courses pour débuter", type: "Débuter", noms: norm("liste de courses | quoi acheter | materiel debutant"), texte: norm("pots terreau arrosoir graines plants") },
    { principal: false, href: "/debuter?t=potager", emoji: "🥗", titre: "Mon premier potager : les légumes les plus faciles", type: "Débuter", noms: norm("potager facile | legumes faciles | premier potager"), texte: norm("radis salade courgette tomate cerise haricot") },
    { principal: false, href: "/demenagement", emoji: "📦", titre: "Je déménage (appartement ↔ maison avec jardin)", type: "Outil", noms: norm("je demenage | demenagement | demenager | emmenager | nouvelle maison | quitter la maison | transporter plantes"), texte: norm("emporter plantes boutures graines animaux transport declaration") },
    { principal: false, href: "/calculs", emoji: "🧮", titre: "Calculs pratiques", type: "Outil", noms: norm("calcul | calculs | combien | quantite | combien de poules | combien de compost | combien de terreau | combien planter"), texte: norm("compost fumier terreau famille eau de pluie poules") },
    { principal: false, href: "/amenagements", emoji: "🗺️", titre: "Aménager son jardin : les façons de faire comparées", type: "Outil", noms: norm("amenager | amenagement | amenager jardin | organiser jardin | plan du jardin | idees jardin"), texte: norm("potager carre butte lasagnes jardin foret verger prairie mare") },
    ...REMEDES.map((r) => ({ principal: false, href: `/remede/${r.id}`, emoji: r.emoji, titre: r.nom, type: "Remède", noms: norm(r.nom), texte: norm([r.role, ...r.usage].join(" ")) })),
    ...GUIDES.map((g) => ({ animal: g.rubrique === "animaux" || g.rubrique === "boucherie", principal: false, id: g.id, href: `/guide/${g.id}`, emoji: g.emoji, titre: g.titre, type: "Tutoriel", noms: norm([g.titre, g.resume, ...(g.alias ?? [])].join(" | ")), texte: norm(g.etapes.map((e) => e.titre + " " + e.texte).join(" ")) })),
  ];
  return DOCS;
}

function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    let best = d[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
      best = Math.min(best, d[j]);
    }
    if (best > max) return max + 1;
  }
  return d[b.length];
}

// Mots qui ne portent pas le sens de la question
const STOP = new Set([
  "de", "la", "le", "les", "des", "du", "un", "une", "a", "au", "aux", "et", "en", "ma", "mon", "mes", "ta", "ton", "tes", "sa", "son", "ses", "nos", "vos", "leur", "leurs",
  "qui", "que", "quoi", "quand", "comment", "pourquoi", "quel", "quelle", "quels", "quelles", "ou", "est", "sont", "ont", "pas", "ne", "plus", "tres", "trop", "peu",
  "pour", "sur", "dans", "avec", "sans", "par", "chez", "je", "j", "il", "elle", "ils", "elles", "on", "nous", "vous", "ce", "cet", "cette", "ces", "faire", "faut", "peut", "doit",
  "plante", "plantes", "mon", "bien", "mal", "y", "l", "d", "qu", "c", "s", "n", "m",
  "tout", "tous", "toute", "toutes", "ai", "as", "avez", "avoir", "moi", "toi", "encore", "deja", "toujours", "jamais", "rien", "vraiment", "souvent", "chaque", "fois", "alors", "donc", "aussi", "voudrais", "veux", "aimerais", "besoin", "svp", "aide", "aidez",
]);
// Synonymes : un mot de la question est satisfait si l'un de ses équivalents est trouvé
const SYN: Record<string, string[]> = {
  abattre: ["abattage"], saigner: ["saignee", "abattage"],
  meurt: ["malade", "diagnostic", "sauver"], mourir: ["malade", "diagnostic"], creve: ["malade", "diagnostic"], malade: ["diagnostic", "maladie"],
  jaunit: ["jaune", "jaunissement"], jaunissent: ["jaune", "jaunissement"], jaunes: ["jaune", "jaunissement"],
  mous: ["molle", "molles"], mou: ["molle"], maigre: ["amaigrissement", "maigrit"], maigrit: ["amaigrissement"],
  declaration: ["declarer", "reglementation"], declarer: ["declaration"], mairie: ["declaration"],
  pond: ["ponte"], pondent: ["ponte"], oeufs: ["oeuf", "ponte"], chat: ["chats", "animaux"], chien: ["chiens", "animaux"],
  planter: ["plantation", "plantez"], semer: ["semis", "semez"], arroser: ["arrosage", "arrosez"], tailler: ["taille", "taillez"], rempoter: ["rempotage"],
  hiverner: ["hivernage", "hiver"], pigeons: ["pigeon"], nourrir: ["alimentation", "nourrir", "manger"], manger: ["alimentation", "nourrir"],
  pucerons: ["puceron"], limace: ["limaces"], vers: ["ver", "vermifuge"], tomates: ["tomate"], fraises: ["fraisier", "fraise"], pommes: ["pommier", "pomme"],
  automatique: ["programmateur", "goutte"], voisin: ["voisinage", "voisins"], copropriete: ["syndic", "voisinage"],
};
// Expressions transformées avant l'analyse
const PHRASES: [RegExp, string][] = [
  [/plantes? vertes?/g, "plante interieur"],
  [/plantes? pour (les )?(chats?|chiens?)/g, "sans danger chats chiens"],
  [/sans danger (pour )?(les )?(chats?|chiens?)/g, "sans danger chats chiens"],
  [/\boeufs? mous\b|\boeufs? sans coquille/g, "coquilles molles oeufs"],
  [/arrosage automatique/g, "arrosage automatique programmateur"],
];

// Intentions de débutant : la page qui répond vraiment à la question passe en tête
const INTENTIONS: [RegExp, string[]][] = [
  [/(tue|tuer|meurent|meurt|crevent).*(plantes?|tout)|main verte|increvable|indestructible|qui ne meur|qui meurt pas|plantes? faciles?|debutant|debuter|je debute|commencer le jardinage|par ou commencer|plantes? (robustes?|resistantes?)$/, ["/debuter", "/interieur?t=catalogue&facile=1"]],
  [/feuilles? (marron|brunes?|seches?|grillees?)|bouts? (des feuilles )?(marron|bruns?|secs?)/, ["/probleme/air-sec", "/probleme/soif", "/probleme/coup-soleil", "/probleme/pourriture-racines"]],
  [/betes? blanches?|bestioles? blanches?|insectes? blancs?|coton blanc|duvet blanc sur (la )?plante|petites? mouches? blanches?/, ["/probleme/cochenilles", "/probleme/aleurode"]],
  [/^(arroser|arrosage|comment arroser|arroser (une|mes|ma|les) plantes?|combien arroser|quand arroser)$/, ["/guide/arrosage-bien-arroser", "/guide/eau-arrosage-interieur"]],
  [/basilic.*(meurt|creve|seche|noircit|fane|jaunit|mort|tient pas)|(meurt|creve|fane).*basilic|basilic (du |de )?supermarche/, ["/interieur?t=aromates&a=basilic"]],
  [/offrir|cadeau/, ["/debuter?t=offrir"]],
  [/rappels?|notifications?|alertes? (d )?arrosage|oublie d arroser|j oublie/, ["/jardin"]],
  [/(grandit|pousse) (pas|plus)|ne (grandit|pousse) (pas|plus)|croissance (lente|bloquee)/, ["/probleme/manque-lumiere", "/probleme/racines-etroit", "/probleme/carence-azote"]],
  [/registre.*(ruche|rucher|abeille|traitement|varroa)|(ruche|rucher|abeille).*registre|carnet (de visite|du rucher)|suivi des ruches|mon rucher|pertes? (hivernales?|d hiver).*(ruche|abeille|colonie)?|mortalite hivernale/, ["/rucher"]],
  [/botulisme|bocal bombe|couvercle bombe|conserve qui petille|(ail|herbes?|legumes?|tomates? sechees?) (dans l|a l) ?huile|conserves? (a|dans) l huile|huile parfumee|acidit.*conserve|ph.*conserve|conserves? (pour|de) bebe|conserve dangereuse|acidifier/, ["/guide/cs-securite"]],
  [/(combien de temps|temps de|duree de) (steril|pasteur|blanch)|steriliser en altitude|bareme de sterilisation/, ["/conserver?t=temps", "/guide/cs-temps"]],
  [/^(pasteuris|blanchi|blanchir|steriliser|sterilisation|autoclave|sterilisateur)/, ["/guide/cs-temps", "/guide/cs-securite"]],
  [/confiture|gelee de|marmelade|pectine/, ["/guide/cs-confitures"]],
  [/fruits? au sirop|compote|pate de (fruits?|coing)|fruits? confits?|sirop de (sureau|fleurs?|menthe|violette|fruits?)|cotignac/, ["/guide/cs-fruits-sucre"]],
  [/pickles?|chutney|vinaigre (maison|de cidre maison)|mere de vinaigre|au vinaigre|ketchup/, ["/guide/cs-vinaigre"]],
  [/jus de (pomme|raisin|fruits?)|pressoir|presser (les |des )?pommes|^cidre|cidre maison|poire maison|nectar/, ["/guide/cs-jus-cidre"]],
  [/eau de vie|liqueur|ratafia|vin de noix|alambic|distill|bouilleur|creme de cassis|limoncello/, ["/guide/cs-alcool"]],
  [/sel aux herbes|au sel|haricots au sel|^fumer|fumage|fumoir|fume[es]? (maison)?$|ail fume|piment fume/, ["/guide/cs-sel-huile-fumage"]],
  [/secher|sechage|deshydrat|sechoir|tomates? sechees?|pruneaux|chips de pommes|fruits secs maison|mites alimentaires/, ["/guide/cs-sechage"]],
  [/congel|recongeler|decongeler|surgel/, ["/guide/cs-congelation"]],
  [/(ratatouille|soupe|plats?|sauce) en bocaux|conserver (la |une )?(ratatouille|soupe)/, ["/guide/cs-plats-bocaux"]],
  [/cave|cellier|fruitier|garder (les |des )?(pommes|courges|pommes de terre)|conserver (les |des )?(pommes|courges|pommes de terre|oignons|carottes)|pommes de terre (qui )?germent|varietes? de garde/, ["/guide/cs-cave"]],
  [/le parfait|familia|joints? (de )?bocaux|capsules?|bocaux de recup|reutiliser (les |des )?(bocaux|pots)|materiel (de )?conserv/, ["/guide/cs-materiel"]],
  [/atelier (de )?conserv|conserverie (partagee|associative|mobile)|legumerie|cahier de (fabrication|sterilisation)/, ["/guide/cs-atelier-collectif"]],
  [/vendre (ses |des |mes )?(conserves|confitures|bocaux)|etiquetage.*(conserve|confiture)|donner (ses |des |mes )?conserves/, ["/guide/cs-donner-vendre"]],
  [/trop de (tomates?|courgettes?|haricots?|pommes?|poires?|prunes?|fraises?|framboises?|concombres?|cornichons?|courges?|potirons?|choux?|salades?|fruits?|legumes?|recoltes?|cerises?|figues?|poivrons?|aubergines?|basilic|herbes?|abricots?|peches?|raisins?|noix|carottes?|betteraves?|oignons?|ail|mures?|groseilles?|rhubarbe|coings?|epinards?|blettes?)|surplus|que faire (de|avec) (mes|mon|ma) (tomates?|courgettes?|haricots?|pommes?|poires?|prunes?|fraises?|framboises?|concombres?|cornichons?|courges?|potirons?|choux?|salades?|fruits?|legumes?|recoltes?|cerises?|figues?|poivrons?|aubergines?|basilic|herbes?|abricots?|peches?|raisins?|noix|carottes?|betteraves?|oignons?|ail|mures?|groseilles?|rhubarbe|coings?|epinards?|blettes?)|ecouler/, ["/conserver?t=assistant"]],
  [/(que|quoi|qu est ce qu on peut) (planter|semer|faire|recolter|cultiver|mettre en terre)( au jardin| au potager)? (en (janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)|maintenant|ce mois|en ce moment|cette semaine|cette saison|cet (hiver|automne|ete)|ce printemps)|^(semis|plantations?|travaux|jardin|potager) (de |d |en )?(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)$|^(semer|planter) en (janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)$/, ["/calendrier"]],
  [/semis (qui |qui ne )?(meurent|tombent|pourrissent|fondent|couchent)|plantules? (qui )?(meurent|tombent|couchees)|fonte des semis|semis couches/, ["/probleme/fonte-semis", "/guide/semis-interieur"]],
  [/graines? (qui )?ne (germent|levent|poussent) (pas|plus)|pas de (germination|levee)|semis (qui )?ne (levent|sortent) pas|tester (la )?germination|graines (trop )?vieilles/, ["/guide/graines-maison", "/guide/semis-interieur", "/guide/semis-place"]],
  [/outils? (de base|indispensables?|pour (debuter|commencer)|du debutant)|quels? outils|(premiers?|bons) outils/, ["/debuter?t=courses", "/guide/outils-tondeuse"]],
  [/(potager|jardin|jardiner|planter|semer) avec (des |les |mes )?enfants|enfants? au (jardin|potager)|jardin pour enfants|activite jardin enfant/, ["/guide/jardin-pour-tous"]],
  [/budget|pas cher|sans argent|petit budget|economiser|gratuit|combien (ca )?coute (un |le )?potager/, ["/guide/jardin-sans-argent"]],
  [/chats?.*(besoins|crottes|font caca|grattent|potager|jardinieres?|bac)|chiens?.*(potager|creusent|urinent)/, ["/guide/nuisibles-predateurs"]],
  [/arros.*hiver|hiver.*arros|arroser (quand il )?(gele|fait froid)/, ["/guide/hivernage-pots", "/guide/arrosage-bien-arroser"]],
  [/potager (d |en )hiver|legumes? d hiver|(que|quoi) (recolter|cultiver|planter) (en|pour l) hiver/, ["/guide/potager-hiver"]],
  [/pes(er|ee|ees) (la |les |une |mes )?ruches?|poids (de la |des |d une )?ruches?|balance (de )?ruche/, ["/rucher", "/guide/api-nourrissement"]],
  [/vendre (son |du |mon )?miel|etiquet.*miel/, ["/guide/api-miellerie", "/guide/api-produits"]],
  [/plant(er|ation) (d |d un |un |une |des |les )?(arbre|arbuste|fruitier)s?|tuteurer (un |les )?arbres?|trou de plantation/, ["/guide/planter-arbre"]],
  [/(plantes?|fleurs?|arbustes?|vivaces?) (qui )?(resist\w*|supportent|tiennent) (a |à )?(la )?secheresse|secheresse|sans arrosage|jardin sec/, ["/guide/jardin-sec", "/amenagements?id=am-jardin-sec"]],
  [/(planter|plantation|creer|choisir) (d |d une |une |la |ma )?haie|quelle haie/, ["/guide/haie", "/guide/planter-arbre"]],
  [/(plantes?|arbustes?|vivaces?|fleurs?) (rustiques?|resistant\w* au (froid|gel))|resiste au gel|supporte le gel/, ["/plantes?froid=-15", "/lexique?t=rusticite"]],
  [/(faire|construire|poser) (une |la |ma )?terrasse|terrasse en (bois|dalles|pierre)|dalles sur plots/, ["/guide/allees-terrasses"]],
  [/(combien|quelle quantite) (d eau|arroser)|besoin en eau|litres? par (m2|metre)|arroser combien/, ["/calculs?s=arrosage", "/guide/arrosage-bien-arroser"]],
  [/dimensionner|nombre de goutteurs|debit (du )?robinet|combien de goutteurs|secteurs? d arrosage/, ["/calculs?s=goutte", "/guide/arrosage-automatique"]],
  [/plan (du|de mon|de) jardin|dessiner (mon |son |le )?jardin|plan a l echelle|plan du terrain/, ["/jardin/plan", "/guide/concevoir-jardin"]],
  [/tailler (la |un |une |les |mes |mon )?(vigne|pecher|pechers|abricotier|cerisier|prunier|pommier|poirier|framboisiers?|groseilliers?|cassissiers?|kiwi)|taille (du|de la|des) (vigne|pecher|abricotier|cerisier|prunier|pommier|poirier|framboisiers?)/, ["/guide/taille-par-fruitier"]],
  [/(ne pondent|pondent plus|arret de ponte|plus d oeufs).*(hiver|automne|novembre|decembre)|mue des poules|poules? (qui )?(perd|perdent) (ses|leurs) plumes|eclairer (le )?poulailler|lumiere (dans le |au )?poulailler/, ["/guide/ponte-lumiere-mue", "/maladie-animale/arret-ponte"]],
  [/(^|[^a-z])rations?($|[^a-z])|combien de (foin|granules|cereales|concentre)|foin (pour l |d )?hiver|stock de foin|quantite de foin|combien nourrir/, ["/calculs?s=rations"]],
  [/(date|calcul\w*) (de |du )?(la )?(mise bas|gestation|agnelage|chevrotage|mise bas)|gestation (brebis|chevre|lapine|anesse|jument|truie)|quand (va|doit) (mettre bas|agneler|chevroter)|mise bas prevue/, ["/calculs?s=misebas", "/guide/calendrier-reproduction"]],
  [/carnet (d agnelage|de reproduction|de mise bas)|suivi des (mises bas|saillies)|noter (une )?saillie|taux de ponte|cout de revient|prix de revient|rentabilite|croissance des (agneaux|chevreaux|lapereaux)|peser (les )?(agneaux|chevreaux|lapereaux)|lait par chevre/, ["/jardin/animaux"]],
  [/^registre$|registre (d )?elevage|registre des (animaux|mouvements)/, ["/guide/registre-elevage"]],
  [/abeilles? (mortes?|tremblantes?|qui tremblent|qui meurent|par terre|rampent)|(mortalite|mortes?) devant (la )?ruche|tas d abeilles mortes/, ["/maladie-animale/intoxication-abeilles", "/maladie-animale/maladie-noire", "/maladie-animale/famine"]],
  [/couvain (troue|en mosaique|clairseme|irregulier)|odeur.*(ruche|couvain)|opercules? (affaisse|perce)/, ["/maladie-animale/loque-americaine", "/maladie-animale/loque-europeenne", "/maladie-animale/orpheline"]],
  [/essaim|essaimage|essaimer|division (de )?ruche|diviser (une |ma )?ruche|cellules? royales?|barbe devant la ruche/, ["/guide/api-essaimage"]],
  [/(marquer|marquage|couleur).*reine|reine.*(couleur|marqu|annee|remplacer|changer|perdu|disparu)|elever des reines|elevage de reines|orphelin|ouvrieres? pondeuses?|reunir (deux )?(colonies|ruches)|^reine$/, ["/guide/api-reines"]],
  [/varroa|apivar|amitraze|acide oxalique|oxalique|acide formique|thymol|apiguard|maqs|sucre glace|lange graisse|chute naturelle/, ["/guide/api-varroa", "/maladie-animale/varroa", "/rucher"]],
  [/(nourrir|nourrissement).*abeilles?|sirop|candi|pillage|reserves? (d )?hiver|hivernage.*(ruche|abeille)|(ruche|abeille).*hiver|ruche legere/, ["/guide/api-nourrissement"]],
  [/dadant|langstroth|warre|kenyane|ruchette|grille a reine|plateau grillage|trappe a pollen|chasse abeilles|enfumoir|combinaison (d )?apicult|materiel apicole|choisir (sa |une )?ruche/, ["/guide/api-materiel"]],
  [/miel.*(cristallis|dur|creme|fermente|humidite|eau)|cristallis.*miel|refractometre|maturateur|cerificateur|fondre (la )?cire|propolis|gelee royale|recolter (le )?pollen|etiquet.*miel|miel de (lavande|acacia|chataignier|tilleul|colza|fleurs)/, ["/guide/api-produits"]],
  [/miellee|transhumance|emplacement (du |d un )?rucher|ou (installer|mettre|placer) (une |mes |ma )?ruches?/, ["/guide/api-miellees"]],
  [/piqu(re|e)s? (d )?abeilles?|piqu(e|ee|re).*abeille|allergi.*(abeille|venin|piqu)|choc anaphylactique|abeilles? agressives?|voisins?.*(abeilles?|ruches?)/, ["/guide/api-securite"]],
  [/gdsa|osad|technicien sanitaire apicole|rucher ecole|formation (en )?apicult|syndicat apicole|declarer (mes |les |ses )?ruches|declaration (des )?ruches/, ["/guide/api-reseau"]],
  [/calendrier apicole|annee apicole|(que faire|travaux).*(rucher|ruches?)|quand (visiter|ouvrir) (la |une |mes )?ruches?|visite de printemps/, ["/guide/api-calendrier"]],
  [/visiter (une |la |ma )?ruche|ouvrir (une |la |ma )?ruche|lire (un |les )?cadres?|visite (de )?ruche/, ["/guide/api-visite"]],
  [/(eclo|eclos|mirer|mirage|couveuse|incubat|combien de (temps|jours).*(couv|oeufs?)|couvaison)/, ["/calculs?s=eclosion", "/guide/couvaison"]],
  [/colostrum|mise bas|mettre bas|agnel|chevreau|agneau|porcelet|naissance|ne tete pas|biberon/, ["/guide/naissances"]],
  [/alpaga|lama|vache|veau|paon|faisan|cochon d inde|cobaye|lapin nain|lapin de compagnie/, ["/guide/autres-animaux"]],
  [/(lacher|laisser|mettre|sortir).*poules?.*(potager|jardin)|poules? (et|au|dans le) potager|poules au jardin/, ["/guide/poules-potager"]],
  [/(eau|abreuvoir).*(gel|glace)|lumiere.*poulailler|ponte.*hiver|poules? en hiver|basse cour.*hiver|froid.*poul/, ["/guide/hiver-basse-cour"]],
  [/traire|traite|fromage|lait de (chevre|brebis)|faisselle/, ["/guide/traite-fromage"]],
  [/(tondre|tonte).*(mouton|brebis)|laine/, ["/guide/tonte-laine"]],
  [/miel|extracteur|hausse|recolte.*ruche/, ["/guide/recolte-miel"]],
  [/salmonel|zoonose|enfants?.*(poule|animaux|chevre|lapin|ane)|laver les oeufs|hygiene.*(oeuf|poule|animaux)/, ["/guide/hygiene-animaux"]],
  [/que (planter|semer|cultiver) pour (mes |les )?(poules|chevres|lapins|animaux)/, ["/guide/cultiver-pour-animaux"]],
  [/liste de courses|quoi acheter|que faut il acheter|materiel (pour )?(debuter|commencer)/, ["/debuter?t=courses"]],
  [/potager facile|legumes? faciles?|premier potager|legumes? pour debutant/, ["/debuter?t=potager", "/creer"]],
];

const radical = (t: string) => { const r = t.replace(/(ements|ement|ations|ation|ages|age|eurs|eur|ees|ee|ers|er|es|s|x)$/, ""); return r.length >= 4 ? r : t; };
const echappe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Mots de 4 lettres ou moins : le mot entier (au pluriel près) — « coq » ne trouve pas « coquelicot ».
// Mots de 5 lettres : début de mot. Au-delà : n'importe où.
const contient = (hay: string, tok: string) =>
  tok.length >= 6 ? hay.includes(tok) : tok.length === 5 ? new RegExp(`(^|[^a-z0-9])${echappe(tok)}`).test(hay) : new RegExp(`(^|[^a-z0-9])${echappe(tok)}(s|x)?($|[^a-z0-9])`).test(hay);

export function rechercher(q: string, limit = 60): Hit[] {
  let nq = norm(q.trim()).replace(/['’-]/g, " ").replace(/\s+/g, " ");
  if (nq.length < 2) return [];
  const brut = nq;
  for (const [re, rep] of PHRASES) nq = nq.replace(re, rep);
  const animalQ = parleAnimal(q);
  const toks = nq.split(" ").filter((t) => t.length > 1 && !STOP.has(t));
  // La question sans les petits mots (« ma plante a des feuilles jaunes » → « feuilles jaunes »)
  const coeur = toks.join(" ");
  if (coeur && coeur !== nq) nq = coeur;
  const syn = (t: string) => (animalQ && (t === "tuer" || t === "tue") ? ["abattre", "abattage"] : SYN[t] ?? []);
  const variantes = (t: string) => [t, radical(t), ...syn(t)];
  const motEntier = (t: string) => MOTS_ANIMAUX.has(t) || MOTS_ANIMAUX.has(radical(t));
  const trouve = (hay: string, t: string, v: string) => (motEntier(t) ? new RegExp(`(^|[^a-z0-9])${echappe(v)}(s|x)?($|[^a-z0-9])`).test(hay) : contient(hay, v));
  const motsBete = toks.filter((t) => motEntier(t) && !["animal", "animaux", "betes"].includes(t));
  const cibles = INTENTIONS.filter(([re]) => re.test(brut)).flatMap(([, h]) => h);
  const bete = animalDe(q);
  if (bete && /(mort|morte|morts|meurt|deced|cadavre|enterrer|equarriss)/.test(brut)) cibles.unshift("/guide/deces-animal");
  if (/enterrer un animal|animal mort|animaux morts/.test(brut)) cibles.unshift("/guide/deces-animal");
  if (bete && /races?|pond beaucoup|meilleure pondeuse|laitiere|quelle (poule|chevre|brebis|lapine|cane)|calme|naine?/.test(brut)) cibles.unshift(`/animal/${bete}?t=races`);
  if (bete === "dindon" || /dinde/.test(brut)) cibles.push("/animal/dindon");
  if (bete && /vacances|absence|partir|garder|nourrit|nourrir pendant/.test(brut)) cibles.unshift("/guide/vacances-animaux");
  const radQ = new Set(toks.flatMap((t) => [radical(t), ...syn(t).map(radical)]));
  const hits: Hit[] = [];
  for (const d of docs()) {
    let score = 0;
    const titre = norm(d.titre);
    if (titre === nq) score += 100;
    else if (titre.startsWith(nq)) score += 50;
    // Un nom ou un alias identique à la question (« haie », « pelouse jaune ») : c'est la fiche attendue
    if (d.noms.split(" | ").some((x) => x === nq)) score += 40;
    if (contient(d.noms, nq)) score += 60;
    else if (contient(d.texte, nq)) score += 20;
    // Le sujet de la fiche est nommé dans la question (« tomates » dans « quand planter les tomates »)
    const motsTitre = titre.split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w)).map(radical);
    if (d.principal && motsTitre.length && radical(motsTitre[0]) && radQ.has(motsTitre[0])) score += 45;
    if (motsTitre.length && motsTitre.every((w) => radQ.has(w))) score += 30;
    if (toks.length) {
      let manquants = 0;
      for (const t of toks) {
        const vs = variantes(t);
        if (vs.some((v) => trouve(d.noms, t, v))) score += 12;
        else if (vs.some((v) => trouve(d.texte, t, v))) score += 4;
        else if (!motEntier(t) && t.length >= 5 && d.noms.split(/[^a-z0-9]+/).some((w) => w.length >= 4 && lev(w, t, t.length >= 8 ? 2 : 1) <= (t.length >= 8 ? 2 : 1))) score += 8;
        else manquants++;
      }
      // Tous les mots doivent être trouvés ; dans une phrase de 3 mots et plus, on tolère un mot absent
      if (manquants && !(toks.length >= 3 && manquants === 1)) score = toks.length > 1 ? score * 0.35 : 0;
      else if (manquants) score *= 0.75;
    }
    // Une question sur les plantes ne doit pas remonter des fiches d'élevage
    if (d.animal && !animalQ) score *= 0.3;
    // Question sur un animal : les fiches qui ne parlent pas de cet animal passent derrière
    if (motsBete.length && !motsBete.some((t) => trouve(d.noms, t, t) || trouve(d.texte, t, t))) score *= 0.2;
    // Les plantes dangereuses ne remontent que si la question parle de danger
    if (d.type === "Plante dangereuse" && !/toxi|dang|poison|mortel|enfant|chien|chat|cigue|belladone|datura|if/.test(brut)) score *= 0.3;
    // La conserverie ne remonte que si la question parle de conserver (« combien de temps pour avoir des tomates » ≠ temps de stérilisation)
    if ((d.href.startsWith("/guide/cs-") || d.href.startsWith("/conserver")) && !/conserv|bocal|bocaux|steril|pasteur|blanch|congel|confit|sirop|seche|sechage|secher|deshydrat|cave|cellier|fruitier|jus|cidre|vinaigre|pickle|chutney|lacto|ferment|saumure|huile|fum|garde|stock|surplus|trop de|etiquet|vend|donner|atelier|alcool|liqueur|eau de vie|gelee|compote|pate de|pesto|botul|autoclave|parfait|capsule|joint|recup|materiel|ecouler|pression|altitude|calcul|calendrier des|marmelade|pectine|ratatouille|soupe|plat|presse|germent|varietes? de garde/.test(brut)) score *= 0.25;
    // La fiche d'une plante dont le nom court est dans la question (« ail quand planter », « pois », « chou »)
    if (d.href.startsWith("/plante/") && toks.some((t) => d.href === `/plante/${t}` || d.href === `/plante/${t.replace(/s$/, "")}`)) score += 60;
    const k = cibles.indexOf(d.href);
    if (k >= 0) score += 300 - k * 10;
    else if (cibles.length) score *= 0.5; // une intention reconnue : le reste passe derrière
    if (score > 0) hits.push({ id: d.id, href: d.href, emoji: d.emoji, titre: d.titre, type: d.type, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

// La requête ressemble-t-elle à un symptôme ? → proposer le diagnostic
export function ressembleSymptome(q: string) {
  const nq = norm(q);
  return /jaun|tache|brun|noir|blanc|mou|fletri|tomb|sech|trou|insect|mouche|moucheron|pourri|colle|toile|pend|malade|meurt|crev|cloque|poudre|ver\b|vers|pond|maigr|boite|diarrh|tousse|gratte/.test(nq);
}
export function parleAnimal(q: string) {
  const nq = norm(q);
  return Object.entries(ALIAS_ANIMAUX).some(([k, v]) => new RegExp(`(^|[^a-z])(${k}|${v.split(" ").join("|")})($|[^a-z])`).test(nq));
}

// Recherche d'une plante d'intérieur par son nom (courant, ancien, commercial ou latin),
// tolérante aux fautes de frappe. Renvoie aussi le nom qui a correspondu (« aussi appelée … »).
export interface HitInterieur { plante: (typeof PLANTES)[number]; score: number; via?: string }
export function chercherInterieur(q: string, limit = 30): HitInterieur[] {
  const nq = norm(q.trim()).replace(/['’-]/g, " ").replace(/\s+/g, " ");
  if (nq.length < 2) return [];
  const toks = nq.split(" ").filter((t) => t.length > 1 && !STOP.has(t));
  const out: HitInterieur[] = [];
  for (const p of PLANTES) {
    if (p.categorie !== "interieur") continue;
    const noms: [string, boolean][] = [[p.nom, false], [p.latin, false], ...(p.alias ?? []).map((a): [string, boolean] => [a, true]), ...(p.latins ?? []).map((a): [string, boolean] => [a, true])];
    let best = 0, via: string | undefined;
    for (const [n, alias] of noms) {
      const nn = norm(n).replace(/['’-]/g, " ");
      let sc = 0;
      if (nn === nq) sc = 100;
      else if (nn.startsWith(nq)) sc = 80;
      else if (new RegExp(`(^|[^a-z0-9])${echappe(nq)}`).test(nn)) sc = 65;
      else if (nq.length >= 4 && nn.includes(nq)) sc = 50;
      else if (toks.length) {
        const mots = nn.split(/[^a-z0-9]+/).filter(Boolean);
        const trouve = toks.filter((t) => mots.some((w) => w.startsWith(t) || (t.length >= 5 && w.length >= 4 && lev(w, t, t.length >= 8 ? 2 : 1) <= (t.length >= 8 ? 2 : 1))));
        if (trouve.length === toks.length) sc = 40;
      }
      if (sc > best) { best = sc; via = alias ? n : undefined; }
    }
    if (best) out.push({ plante: p, score: best - p.difficulte, via });
  }
  return out.sort((a, b) => b.score - a.score || a.plante.nom.localeCompare(b.plante.nom, "fr")).slice(0, limit);
}
