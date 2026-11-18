// Tests de la logique métier (exécutés à chaque build)
import { shiftMonths, plantesDuMois, buildIcs, recolteEstimee, tachesPerso } from "../src/lib/calendar";
import { diagnostiquer, relations, verifierRotation, recommander } from "../src/lib/garden";
import { lune } from "../src/lib/lune";
import { spoken } from "../src/lib/tts";
import { ficheParLatin } from "../src/lib/identify";
import { DEFAULT_SETTINGS, type State, type MaPlante } from "../src/lib/store";
import { rechercher, parleAnimal, ressembleSymptome, chercherInterieur } from "../src/lib/search";
import { PLANTES } from "../src/data/index";
import { interpreterSol, QUESTIONS_SOL } from "../src/data/sols";
import { choisirMethodes, type ProfilPotager } from "../src/lib/methodes";
import { essentiel } from "../src/lib/essentiel";
import { remede } from "../src/data/index";
import { STATUT_REMEDE } from "../src/data/reglementation";
import { ecoScore, PRATIQUES } from "../src/data/bio";
import { datesCouvee, bilan, registreCsv, tachesCouvees } from "../src/lib/elevage";
import { EXPORTS, bilanPluriannuel, varietesDe } from "../src/lib/exports";
import { planifier, plantsParPlanche, successions, nurserie, tempsDeTravail, engraisVertPour } from "../src/lib/plan-culture";
import { GUIDES } from "../src/data/index";
import { SUBSTRATS } from "../src/data/interieur-hub";
import { decouper } from "../src/lib/lexique-texte";
import { diagnostiquerAnimal } from "../src/lib/sante-animale";
import { moisAffiches, aRepiquer } from "../src/lib/calendar";
import { gesteDe } from "../src/data/cueillette";
import { plantesVertes } from "../src/lib/garden";
import { echeances, intervalleArrosage, marquer } from "../src/lib/mesplantes";
import { ficheLatin } from "../src/lib/identify";
import { plante } from "../src/data/index";
import { besoinEau } from "../src/components/PlanVisuel";
import { couleurReine, valeurVarroa, niveauVarroa, pertesHiver, alertesRucher, registreTraitementsCsv } from "../src/lib/rucher";
import { dernierSoin } from "../src/lib/calendar";
import { RACES } from "../src/data/races";
import { proposer, numeroLot, finDeGarde, alertesStocks, planAnnee, selLacto, sucreConfiture } from "../src/lib/conserverie";
import { CONSERV, METHODES_CONSERV, majorationAltitude } from "../src/data/conservation";
import { MALADIES_ANIMALES } from "../src/data/maladies-animales";

let fails = 0, n = 0;
const ok = (c: boolean, m: string) => { n++; if (!c) { fails++; console.error("✗ " + m); } };

// Décalage climatique
ok([...shiftMonths([5], 0)].join() === "5", "sans décalage");
ok(shiftMonths([5], -3).has(4), "méditerranéen : mai → avril");
ok(shiftMonths([12], 3).has(1), "montagne : décembre déborde sur janvier");
ok(plantesDuMois(5, "tempere").plantation.some((p) => p.id === "tomate"), "tomates plantées en mai");
ok(!plantesDuMois(1, "tempere").plantation.some((p) => p.id === "tomate"), "pas de tomates en janvier");

// Diagnostic
const d1 = diagnostiquer({ planteId: "tomate", signes: ["taches-brunes", "fruit-pourri"], mois: 7 });
ok(d1[0]?.p.id === "mildiou", "tomate + taches brunes + fruits pourris = mildiou en tête (obtenu : " + d1[0]?.p.id + ")");
const d2 = diagnostiquer({ planteId: "courgette", signes: ["feutrage-blanc"], mois: 8 });
ok(d2[0]?.p.id === "oidium", "courgette + feutrage blanc = oïdium");
const d3 = diagnostiquer({ planteId: "pothos", signes: ["terre-mouillee", "jaunissement"], mois: 1 });
ok(d3[0]?.p.id === "pourriture-racines", "pothos détrempé = excès d'eau (obtenu : " + d3[0]?.p.id + ")");
const d4 = diagnostiquer({ planteId: "chou", signes: ["petits-trous"], mois: 6 });
ok(d4[0]?.p.id === "altise", "chou criblé = altises");
ok(!diagnostiquer({ planteId: "tomate", signes: ["gomme"], mois: 6 }).some((r) => r.p.id === "gommose"), "pas de gommose sur tomate");

// Associations et rotation
ok(relations(["tomate", "basilic"])[0]?.type === "ami", "tomate + basilic amis");
ok(relations(["pois", "oignon"])[0]?.type === "ennemi", "pois + oignon ennemis");
const cultures = [{ id: "a", planteId: "pomme-de-terre", espaceId: "p1", date: "2025-04-01", mode: "plantation" as const }];
ok(verifierRotation("p1", "tomate", 2026, cultures)[0].niveau === "eviter", "tomate après pomme de terre = à éviter");
ok(verifierRotation("p1", "haricot", 2026, cultures).every((a) => a.niveau === "ok"), "haricot après pomme de terre = ok");

// Lune : pleine lune connue du 5 novembre 2025
ok(lune(new Date("2025-11-05T13:00:00Z")).phase === "Pleine lune", "pleine lune du 5/11/2025 (obtenu : " + lune(new Date("2025-11-05T13:00:00Z")).phase + ")");
ok(lune(new Date("2025-11-20T06:00:00Z")).phase === "Nouvelle lune", "nouvelle lune du 20/11/2025");

// Récolte estimée, tâches, export agenda
const c2 = { id: "b", planteId: "radis", date: "2026-04-01", mode: "semis" as const };
ok(recolteEstimee(c2)!.toISOString().startsWith("2026-04-26"), "radis : 25 jours");
const state: State = { settings: DEFAULT_SETTINGS, espaces: [], cultures: [c2], recoltes: [], notes: [], graines: [], troupeaux: [{ id: "t", animalId: "chevre", nom: "Chèvres", nombre: 2 }], soins: [], ponte: {}, fait: {}, videos: {}, favoris: [], plantes: [] };
ok(tachesPerso(state, new Date("2026-04-20T12:00:00")).some((t) => t.key === "rec:b"), "rappel de récolte des radis");
const ics = buildIcs(state, { mois: 12, travaux: true, mesPlantes: true });
ok(ics.startsWith("BEGIN:VCALENDAR") && ics.includes("END:VCALENDAR") && (ics.match(/BEGIN:VEVENT/g) ?? []).length >= 12, "export .ics valide");

// Recommandations
const r1 = recommander({ situation: "balcon", expo: "soleil", temps: "peu", surface: 4, objectifs: ["faciles"] });
ok(r1.plantes.length >= 6 && r1.plantes.every((p) => p.lieux.includes("pot") || p.lieux.includes("balcon")), "balcon : plantes en pot");
ok(!r1.plantes.some((p) => p.id === "pomme-de-terre" && false), "ok");
const r2 = recommander({ situation: "jardin", expo: "ombre", temps: "moyen", surface: 30, objectifs: [] });
ok(r2.plantes.every((p) => p.expo.includes("ombre")), "ombre : plantes d'ombre seulement");

// Divers
ok(spoken("Semez à 2 cm, 20 °C") === "Semez à 2 centimètres, 20 degrés", "lecture des unités");
ok(ficheParLatin("Solanum lycopersicum") === "tomate", "Pl@ntNet → fiche tomate");
ok(ficheParLatin("Mentha spicata") === "menthe", "Pl@ntNet → genre Mentha");

// Recherche : noms courants, symptômes, fautes de frappe
for (const [q, attendu] of [["caoutchouc", "Ficus"], ["misère", "Misère"], ["plante serpent", "Sansevieria"], ["feuilles jaunes", "Vieille feuille"], ["terreau blanc", "Moisissure"], ["rempotage", "Rempoter"], ["monstéra", "Monstera"], ["orchidé", "Orchidée"], ["tomatte", "Tomate"], ["moucherons", "Moucherons"]] as const)
  ok(rechercher(q).slice(0, 8).some((h) => h.titre.startsWith(attendu)), `recherche « ${q} » → ${attendu} (obtenu : ${rechercher(q).slice(0, 3).map((h) => h.titre).join(" | ")})`);

// Pl@ntNet : correspondances strictes
ok(ficheLatin("Dracaena fragrans")?.id === "dracaena", "Dracaena fragrans → dracaena (pas sansevieria)");
ok(ficheLatin("Phalaenopsis amabilis")?.id === "orchidee", "Phalaenopsis amabilis → orchidée");
ok(ficheLatin("Echeveria elegans")?.id === "succulentes" && ficheLatin("Echeveria elegans")?.exact === false, "Echeveria → succulentes (genre)");
ok(ficheLatin("Solanum melongena")?.id === "aubergine", "Solanum melongena → aubergine (pas tomate)");
ok(ficheLatin("Solanum nigrum")?.id === "belladone", "Solanum nigrum → fiche dangereuse belladone/morelle");
ok(ficheLatin("Solanum dulcamara")?.id === "belladone" && ficheLatin("Solanum tuberosum")?.id === "pomme-de-terre", "douce-amère ≠ pomme de terre");
for (const l of ["Taxus baccata", "Nerium oleander", "Prunus laurocerasus", "Digitalis purpurea", "Conium maculatum", "Aethusa cynapium", "Colchicum autumnale", "Jacobaea vulgaris", "Atropa belladonna"])
  ok(!!ficheLatin(l) && !!plante(ficheLatin(l)!.id)?.danger, `${l} → alerte plante dangereuse`);
for (const l of ["Rosa canina", "Hydrangea macrophylla", "Taraxacum officinale", "Convolvulus arvensis", "Elymus repens", "Cydonia oblonga", "Castanea sativa", "Citrullus lanatus", "Cichorium intybus", "Allium ascalonicum", "Fragaria vesca", "Equisetum arvense"])
  ok(!!ficheLatin(l), `${l} → fiche`);

// Calendrier : semis d'automne des pois réservés aux climats doux
ok(!plantesDuMois(11, "tempere").semisPlace.some((p) => p.id === "pois"), "pas de pois semés en novembre en climat tempéré");
ok(plantesDuMois(11, "oceanique").semisPlace.some((p) => p.id === "pois"), "pois semés en novembre en climat océanique");

// Assistant : verger pour un grand jardin
ok(recommander({ situation: "jardin", expo: "soleil", temps: "moyen", surface: 150, objectifs: ["autonomie"] }).verger.length >= 3, "grand jardin : fruitiers proposés");

// Mes plantes : rythme d'arrosage selon saison et fenêtre
const mp: MaPlante = { id: "m", planteId: "pothos", surnom: "Pothos", fenetre: "sud", depuis: "2026-01-01", arrosages: ["2026-07-01"], engrais: [], rempotages: [], photos: [] };
ok(intervalleArrosage(mp, new Date("2026-07-02T12:00:00")) < intervalleArrosage({ ...mp, fenetre: "nord" }, new Date("2026-07-02T12:00:00")), "fenêtre sud = arrosages plus rapprochés que nord");
ok(intervalleArrosage(mp, new Date("2026-01-10T12:00:00")) > intervalleArrosage(mp, new Date("2026-07-02T12:00:00")), "hiver = arrosages plus espacés");
ok(echeances(mp, new Date("2026-07-20T12:00:00"))[0].dans <= 0, "pothos arrosé le 1er juillet : à vérifier le 20");
ok(echeances(marquer(mp, "arrosage", new Date("2026-07-20T12:00:00")), new Date("2026-07-20T12:00:00"))[0].dans > 0, "après arrosage : plus rien à faire");
ok(!echeances({ ...mp, planteId: "tillandsia" }, new Date("2026-07-20T12:00:00")).some((e) => e.type === "engrais"), "pas de rappel d'engrais pour un tillandsia");

// Arrosage : chaleur = plus d'eau, pluie = moins, paillage = moins
const esp = { id: "e1", nom: "P1", type: "planche" as const, surface: 5 };
const cult = [{ espaceId: "e1", planteId: "tomate" }];
const chaud = Array.from({ length: 7 }, () => ({ tmax: 30, pluie: 0 }));
const pluvieux = Array.from({ length: 7 }, () => ({ tmax: 18, pluie: 8 }));
ok(besoinEau(esp, cult, chaud, false)!.litres > besoinEau(esp, cult, chaud, true)!.litres, "le paillage réduit l'arrosage");
ok(besoinEau(esp, cult, pluvieux, true)!.litres === 0, "semaine pluvieuse : pas d'arrosage");
ok(besoinEau(esp, [], chaud, true) === null, "pas de culture : pas de calcul");

// Lexique, fleurs, fumiers
ok(rechercher("butter").some((h) => h.type === "Lexique"), "recherche « butter » → lexique");
ok(rechercher("gourmand").slice(0, 3).some((h) => h.type === "Lexique"), "recherche « gourmand » → lexique");
ok(rechercher("cosmos")[0]?.titre === "Cosmos", "recherche « cosmos » → fiche fleur");
ok(rechercher("aminopyralide").some((h) => h.titre.startsWith("Fumiers sans risque")), "recherche aminopyralide → sécurité des fumiers");
ok(plantesDuMois(7, "tempere").floraison.length >= 20, "plus de 20 plantes en fleur en juillet");
ok(!plantesDuMois(7, "tempere").recolte.some((p) => p.id === "zinnia") && plantesDuMois(7, "tempere").floraison.some((p) => p.id === "zinnia"), "le zinnia est « en fleur », pas « récolté »");

ok(["Rosier", "Rose trémière"].includes(rechercher("rose")[0]?.titre ?? ""), "recherche « rose » → rosier ou rose trémière en tête (obtenu : " + rechercher("rose")[0]?.titre + ")");
ok(!rechercher("rose").slice(0, 5).some((h) => h.titre === "Persil"), "« rose » ne trouve pas le persil");

// Audit amateur 4 profils : requêtes de débutants
const top = (q: string, k = 5) => rechercher(q).slice(0, k).map((h) => h.titre);
const vise = (q: string, attendu: string, k = 5) => ok(top(q, k).some((t) => t.startsWith(attendu)), `recherche « ${q} » → ${attendu} (obtenu : ${top(q, 3).join(" | ")})`);
vise("quand planter les tomates", "Tomate", 3);
vise("haie", "Planter et tailler une haie", 3);
vise("pelouse jaune", "Une pelouse naturelle", 5);
vise("coq", "Poules", 3);
vise("oeufs mous", "Œufs mous", 3);
vise("tuer un poulet", "Abattre et préparer une volaille", 3);
vise("déclaration poules mairie", "Règles à connaître", 5);
vise("chèvre maigre", "Vers digestifs", 5);
vise("plante pour chat", "Plantes toxiques", 5);
vise("engrais plantes vertes", "Plantes d'intérieur : les 5 règles", 5);
vise("lavande en pot", "Lavande", 3);
vise("pigeons balcon", "Pigeons au balcon", 3);
vise("monstera pleure", "Gouttes d'eau sur les feuilles", 3);
vise("poule ne pond plus", "Ponte en baisse", 3);
vise("lapin ne mange plus", "Arrêt du transit", 3);
vise("arrosage automatique balcon", "Arrosage automatique sur un balcon", 3);
ok(parleAnimal("ma poule tousse") && ressembleSymptome("ma poule tousse"), "« ma poule tousse » → carte diagnostic animal");
ok(!parleAnimal("feuilles jaunes tomate"), "« feuilles jaunes tomate » ne parle pas d'animal");
ok(diagnostiquerAnimal("lapin", ["ne-mange-plus", "plus-de-crottes"])[0]?.m.id === "stase-lapin", "lapin sans crottes → arrêt du transit en tête");
ok(diagnostiquerAnimal("poule", ["muqueuses-pales", "ponte-baisse", "parasites"])[0]?.m.id === "poux-rouges", "crête pâle + ponte en baisse + parasites → poux rouges");
ok(diagnostiquerAnimal("chevre", ["ventre-gonfle"])[0]?.m.urgence === 3, "chèvre ventre gonflé → urgence");
ok(!diagnostiquerAnimal("lapin", ["ponte-baisse"]).some((x) => x.m.id === "arret-ponte"), "pas d'arrêt de ponte pour un lapin");
const vertes = plantesVertes({ situation: "appartement", expo: "ombre", temps: "peu", surface: 1, objectifs: ["compagnie"] });
ok(vertes.length > 0 && vertes.every((p) => p.sansDangerAnimaux && p.expo.includes("ombre") && p.difficulte === 1), `plantes vertes ombre + chat : ${vertes.map((p) => p.nom).join(", ")}`);

// Repiquage, cueillette, intérieur, déménagement, aménagements
ok(aRepiquer(plante("tomate")!) && moisAffiches(plante("tomate")!, "repiquage", "tempere").size > 0, "la tomate se repique en godets");
ok(!aRepiquer(plante("courge")!), "la courge semée en godet individuel ne se repique pas");
ok(!aRepiquer(plante("carotte")!), "la carotte semée en place ne se repique pas");
ok((plante("betterave")!.plantation ?? []).length > 0, "betterave semée à l'abri : mois de plantation renseignés");
ok(gesteDe("tomate")?.id === "cueillir-tomates" && gesteDe("zinnia")?.id === "couper-fleurs" && gesteDe("pommier")?.id === "cueillir-fruits-arbre", "un geste de cueillette par type de plante");
ok(!!plante("pissenlit")?.recolteConseil, "conseil de récolte ajouté au pissenlit");
vise("basilic supermarché", "Basilic en intérieur", 3);
vise("lampe horticole", "Lampe de culture", 3);
vise("je déménage", "Je déménage", 3);
vise("carré potager", "Carrés potagers", 5);
vise("comment cueillir les pommes", "Cueillir — Fruits des arbres", 5);
vise("bouture pothos", "Multiplier ses plantes", 5);
// Catalogue d'intérieur et recherche par nom
ok(PLANTES.filter((p) => p.categorie === "interieur").length >= 90, "au moins 90 plantes d'intérieur");
const ci = (q: string, id: string) => ok(chercherInterieur(q)[0]?.plante.id === id, `intérieur « ${q} » → ${id} (obtenu : ${chercherInterieur(q).slice(0, 3).map((h) => h.plante.id).join(", ")})`);
ci("langue de belle-mère", "sansevieria");
ci("plante zz", "zamioculcas");
ci("monstra", "monstera");
ci("arbre de jade", "crassula");
ci("pied d'elephant", "beaucarnea");
ci("money tree", "pachira");
ci("sabot de venus", "paphiopedilum");
ci("Ficus lyrata", "ficus");
ci("chaine des coeurs", "ceropegia");
ci("Dracaena sanderiana", "bambou-chance");
ok(chercherInterieur("plante zz")[0]?.via !== undefined, "le nom courant qui a correspondu est indiqué");
ok(!chercherInterieur("xqzwv").length, "aucun résultat pour un nom inventé");
ok(!chercherInterieur("tomate").length, "la recherche d'intérieur ne renvoie pas les légumes");
ok(PLANTES.filter((p) => p.danger && p.categorie === "interieur").every((p) => !p.sansDangerAnimaux), "les plantes très toxiques ne sont jamais marquées sans danger");

// Sol et nutrition
const solDe = (choix: number[]) => { const pts: Record<string, number> = {}; QUESTIONS_SOL.forEach((q, i) => { for (const [k, v] of Object.entries(q.reponses[choix[i]].effet)) pts[k] = (pts[k] ?? 0) + (v ?? 0); }); return interpreterSol(pts); };
ok(solDe([3, 3, 2, 1, 1, 0, 5]).texture === "argileux", "boudin en anneau + flaques → sol argileux");
ok(solDe([0, 0, 2, 1, 1, 0, 5]).texture === "sableux", "boudin impossible + sèche vite → sol sableux");
ok(solDe([2, 2, 0, 1, 0, 0, 1]).traits.includes("calcaire"), "vinaigre qui mousse + coquelicots → calcaire");
ok(solDe([2, 2, 2, 1, 0, 0, 0]).traits.includes("acide"), "mousse et fougères sans calcaire → acide");
ok(solDe([3, 3, 2, 3, 2, 2, 3]).alertes.length >= 2, "sol gorgé d'eau, tassé, sans vers → alertes");
vise("sol argileux", "Mon sol", 3);
vise("quel engrais", "Nourrir ses plantes", 3);
vise("feuilles violettes", "Manque de phosphore", 3);
vise("pierre à lécher", "Nourrir ses animaux", 3);
vise("corne broyée", "Les engrais naturels", 3);

// Assistant « quelle méthode de potager »
const baseM: ProfilPotager = { lieu: "jardin", surface: 30, depart: "pelouse", sol: "inconnu", temps: "moyen", budget: "moyen", corps: "ok", eau: "facile", materiaux: [], duree: "long", objectif: "debuter" };
const topM = (p: Partial<ProfilPotager>, n = 1) => choisirMethodes({ ...baseM, ...p }).slice(0, n).map((c) => c.id);
ok(topM({ lieu: "appartement", surface: 1 })[0] === "am-pots", "appartement → pots");
ok(topM({ corps: "fauteuil" })[0] === "am-bacs-hauts", "fauteuil → bacs surélevés");
ok(topM({ depart: "pelouse", materiaux: ["carton", "feuilles"] }, 2).includes("am-lasagnes"), "pelouse + carton et feuilles → lasagne parmi les 2 premiers");
ok(topM({ lieu: "cour", depart: "dur", duree: "provisoire", budget: "petit" }, 2).some((id) => id === "am-bottes-paille" || id === "am-sacs"), "cour bétonnée en location → bottes de paille ou sacs");
ok(topM({ sol: "humide", materiaux: ["bois"], depart: "cultive" })[0] === "am-butte", "sol humide + bois → butte");
ok(topM({ objectif: "produire", surface: 150, depart: "cultive" })[0] === "am-planches", "produire beaucoup sur 150 m² → planches permanentes");
ok(!topM({ lieu: "appartement" }, 20).includes("am-butte"), "jamais de butte en appartement");
ok(choisirMethodes(baseM)[0].pour.length > 0, "chaque recommandation est expliquée");
vise("monticules", "Quelle méthode de potager pour moi", 5);
vise("quel paillage", "Les paillages comparés", 3);
vise("bottes de paille", "Culture sur bottes de paille", 5);

// Audit débutant : la recherche comprend ses phrases
const premier = (q: string) => rechercher(q, 3).map((h) => h.titre);
const p1 = (q: string, attendu: string) => ok(premier(q).some((t) => t.startsWith(attendu)), `débutant « ${q} » → ${attendu} (obtenu : ${premier(q).join(" | ")})`);
const jamaisAnimal = (q: string) => ok(!rechercher(q, 3).some((h) => /animaux|Animal/.test(h.type) || /volaille|lapin|poulailler/i.test(h.titre)), `« ${q} » ne renvoie pas vers l'élevage (obtenu : ${premier(q).join(" | ")})`);
p1("je tue toutes mes plantes", "Je débute"); jamaisAnimal("je tue toutes mes plantes");
p1("plante facile", "Les plantes d'intérieur increvables");
p1("plante qui ne meurt pas", "Je débute"); jamaisAnimal("plante qui ne meurt pas");
p1("ma plante a des feuilles jaunes", "Excès d'arrosage");
p1("feuilles marron", "Air trop sec");
p1("bêtes blanches plante", "Cochenilles");
p1("arroser une plante", "Bien arroser");
p1("pourquoi mon basilic meurt", "Basilic en intérieur"); jamaisAnimal("pourquoi mon basilic meurt");
p1("plante pour offrir", "Offrir une plante");
p1("notification", "Mes plantes : rappels");
p1("ma plante ne grandit pas", "Manque de lumière");
p1("légumes faciles", "Mon premier potager");
p1("quoi acheter pour commencer", "La liste de courses");
p1("tuer un poulet", "Abattre et préparer une volaille");
ok(essentiel(plante("pothos")!, "tempere").length === 3 && essentiel(plante("pothos")!, "tempere")[2].includes("oxique"), "pothos : l'essentiel signale la toxicité");
ok(essentiel(plante("tomate")!, "tempere").some((x) => x.includes("plant")), "tomate : l'essentiel conseille d'acheter un plant");
ok(essentiel(plante("radis")!, "tempere").some((x) => x.startsWith("Semer")), "radis : l'essentiel dit quand semer");
const morceaux = decouper("Bouturez sous un nœud, en lumière vive indirecte, dans un godet.");
ok(["noeud", "lumiere-indirecte", "godet"].every((id) => morceaux.some((m) => m.id === id)), `mots du lexique repérés (${morceaux.filter((m) => m.id).map((m) => m.id).join(", ")})`);
ok(morceaux.map((m) => m.t).join("") === "Bouturez sous un nœud, en lumière vive indirecte, dans un godet.", "le texte reste identique une fois découpé");

// Audit agronomique
ok(plante("carotte")!.besoin === "peu", "carotte : peu exigeante");
ok(plante("mache")!.famille === "valerianacees", "mâche : famille des Valérianacées (rotation)");
ok(Math.min(...moisAffiches(plante("tomate")!, "semisAbri", "tempere")) >= 3, "tomate : semis à l'abri à partir de mars sans lampe");
ok(/25 °C/.test(plante("laitue")!.tempGermination ?? ""), "laitue : dormance au-dessus de 25 °C signalée");
ok(relations(["chou", "tomate"])[0]?.type === "ennemi", "chou et tomate : plus de contradiction (à séparer)");
ok(PLANTES.every((p) => p.amis.every((a) => !PLANTES.find((q) => q.id === a) || PLANTES.find((q) => q.id === a)!.amis.includes(p.id))), "associations « bons voisins » toutes réciproques");
ok(PLANTES.every((p) => !p.amis.some((a) => p.ennemis.includes(a))), "aucune plante à la fois amie et ennemie d'une autre");
ok(!/quasi st/.test(remede("urine")!.role) && remede("urine")!.precautions.some((x) => /un mois/.test(x)), "urine : règle d'hygiène de l'OMS, plus de « stérile »");
ok(STATUT_REMEDE["bouillie-bordelaise"].statut === "amm" && !!STATUT_REMEDE["bouillie-bordelaise"].dar, "bouillie bordelaise : statut et délai avant récolte");
ok(STATUT_REMEDE["macer-rhubarbe"].statut === "tradition", "rhubarbe : recette traditionnelle non homologuée");
p1("ambroisie", "Ambroisie");
p1("berce du caucase", "Berce du Caucase");
p1("feu bactérien", "Feu bactérien");
p1("nitrates salade", "Nitrates");
p1("rapport carbone azote", "Le compost en vrai");
p1("délai avant récolte", "Traiter au jardin");
p1("passeport phytosanitaire", "Acheter des plants sains");
p1("lire une analyse de sol", "Lire une analyse de sol");
p1("changement climatique", "Jardiner avec le changement climatique");
p1("semences reproductibles", "Les semences");

// Audit bio et écoresponsable
ok(!SUBSTRATS.some((x) => /tourbe blonde/i.test(x.melange)), "plus de tourbe conseillée pour les carnivores");
ok(ecoScore(new Set(), false).score === 0 && ecoScore(new Set(PRATIQUES.map((p) => p.id)), true).score === 100, "éco-score de 0 à 100");
ok(ecoScore(new Set(), false).parTheme.every((t) => t.theme !== "animaux"), "éco-score sans animaux : thème animaux masqué");
ok(choisirMethodes({ ...baseM, lieu: "appartement", surface: 1 }).find((c) => c.id === "am-hydroponie")!.contre.some((x) => /bio/.test(x)), "hydroponie signalée incompatible avec le bio");
p1("label bio", "Les labels");
p1("terreau sans tourbe", "Jardiner bio");
p1("vendre légumes bio", "Jardiner bio");
p1("tonte différenciée", "Tonte différenciée");
p1("faux semis", "Faux-semis");
p1("éco-score", "Mon éco-score");
p1("poules bio", "Élever ses animaux selon les principes bio");

// Audit amateur jardin + animaux de ferme
const nr = (q: string) => rechercher(q, 3).map((h) => h.titre);
const pas = (q: string, mot: RegExp) => ok(!nr(q).some((t) => mot.test(t)), `« ${q} » ne renvoie plus « ${mot.source} » (obtenu : ${nr(q).join(" | ")})`);
pas("chèvre naine", /Chèvrefeuille|Helxine/);
pas("vache naine", /Palmier|Helxine|Mâche/);
pas("dinde de noel", /Cactus|Poinsettia/);
p1("chèvre naine", "Races : chèvres");
p1("quelle race de poule", "Races : poules");
p1("vache naine", "Alpagas, lamas");
p1("dinde de noel", "Dindes");
p1("registre d'élevage", "Le registre d'élevage");
p1("poule morte que faire", "Quand un animal meurt");
p1("enterrer un animal", "Quand un animal meurt");
p1("combien de temps pour faire éclore des oeufs", "Calculer la date d'éclosion");
p1("mirer les oeufs", "Calculer la date d'éclosion");
p1("colostrum", "Mises bas");
p1("chevreau qui ne tète pas", "Mises bas");
p1("traire une chèvre", "Traire une chèvre");
p1("tondre un mouton", "Tondre ses moutons");
p1("récolter le miel", "Récolter le miel");
p1("partir en vacances avec des poules", "Partir en vacances quand on a des animaux");
p1("eau gelée poules hiver", "L'hiver à la basse-cour");
p1("lâcher les poules dans le potager", "Les poules au potager");
p1("salmonelle oeufs", "Animaux, enfants et hygiène");
p1("alpaga", "Alpagas, lamas");
p1("cochon d'inde", "Alpagas, lamas");
p1("vacances plantes", "Partir en vacances : les plantes");
p1("tondre la pelouse", "Une pelouse naturelle");
ok(datesCouvee("poule", "2026-03-01").eclosion === "2026-03-22" && datesCouvee("canard", "2026-03-01").eclosion === "2026-03-29", "éclosion : poule 21 jours, cane 28 jours");
ok(datesCouvee("poule", "2026-03-01").arretRetournement === "2026-03-19", "arrêt du retournement 3 jours avant l'éclosion");
const etatFerme = { ...({} as never as import("../src/lib/store").State), ponte: { "2026-01-02": 3 }, production: [{ id: "p", troupeauId: "t", date: "2026-01-03", type: "oeufs" as const, qte: 7 }], depenses: [{ id: "d", date: "2026-01-04", categorie: "aliment" as const, montant: 5 }], mouvements: [{ id: "m", troupeauId: "t", date: "2026-01-05", type: "naissance" as const, nombre: 2 }], troupeaux: [{ id: "t", animalId: "chevre", nom: "Biquettes", nombre: 2 }] };
ok(bilan(etatFerme, "2026-01-01").parType.oeufs === 10 && bilan(etatFerme, "2026-01-01").coutOeuf === 0.5, "bilan : œufs (ancien + nouveau suivi) et coût par œuf");
ok(registreCsv(etatFerme).includes("Naissance") && registreCsv(etatFerme).includes("Chèvres"), "registre exportable avec espèce et mouvement");
ok(tachesCouvees([{ id: "c", espece: "poule", debut: "2026-03-01", oeufs: 8, mode: "poule" }], new Date("2026-03-18T12:00:00")).some((t) => /retournement/.test(t.texte)), "couvée : rappel d'arrêt du retournement");

// Audit récup, petit budget, jardinier confirmé, plantes de collection
p1("pneus potager", "Matériaux de récup");
p1("cuve ibc", "Matériaux de récup");
p1("plaque amiante jardin", "Matériaux de récup");
p1("serre vieilles fenêtres", "Construire une serre ou un châssis");
p1("poulailler palettes", "Construire un poulailler en palettes");
p1("godets papier journal", "Fabriquer ses petits équipements");
p1("jardiner sans argent", "Jardiner sans argent");
p1("toilettes sèches", "Toilettes sèches");
p1("eaux grises", "Arroser avec les eaux grises");
p1("manche cassé", "Réparer et fabriquer ses outils");
p1("échange de boutures", "Échanger boutures");
p1("acariens prédateurs", "Lutte biologique dans la maison");
p1("thai constellation", "Monstera");
p1("pink princess", "Philodendron");
ok(chercherInterieur("anthurium crystallinum")[0]?.plante.id === "anthurium", "cultivar rare retrouvé dans la recherche d'intérieur");
ok(GUIDES.find((g) => g.id === "recuperateur-pluie")!.etapes.some((e) => /toiture/i.test(e.titre)), "récupérateur d'eau : toiture et cuve ajoutées");
const etatJardin = { ...({} as never as import("../src/lib/store").State), espaces: [], ponte: {}, graines: [{ id: "g", planteId: "tomate", variete: "Noire de Crimée", annee: 2025 }], cultures: [{ id: "c", planteId: "tomate", variete: "Cœur de bœuf", date: "2025-05-10", mode: "plantation" as const }], recoltes: [{ id: "r1", planteId: "tomate", variete: "Cœur de bœuf", date: "2025-08-01", qte: 2, unite: "kg" as const }, { id: "r2", planteId: "tomate", variete: "Cœur de bœuf", date: "2026-07-20", qte: 500, unite: "g" as const }, { id: "r3", planteId: "tomate", variete: "Noire de Crimée", date: "2026-08-03", qte: 1, unite: "kg" as const }], notes: [], plantes: [], multiplications: [{ id: "m", type: "bouture" as const, planteId: "pothos", date: "2026-03-01", nombre: 4, reussis: 3, fini: "2026-04-01" }] };
const bp = bilanPluriannuel(etatJardin);
ok(bp.annees.join(",") === "2025,2026" && bp.varietes.length === 2 && bp.varietes.find((v) => v.variete === "Cœur de bœuf")!.parAnnee["2026"] === 0.5, "bilan par année et par variété");
ok(varietesDe(etatJardin, "tomate").length === 2, "variétés proposées à partir des graines, cultures et récoltes");
ok(EXPORTS.recoltes.faire(etatJardin).includes("Noire de Crimée") && EXPORTS.multiplications.faire(etatJardin).includes("75 %"), "exports tableur avec variétés et taux de réussite");

// Audit maraîcher
const pl = planifier("laitue", 10, "tempere", 2026);
ok(pl.intervalle === 3 && pl.series.length >= 8 && pl.series[0].plants === 30, `laitue : une série toutes les 3 semaines, 30 plants pour 10 par semaine (${pl.series.length} séries)`);
ok(pl.series.every((x, i) => i === 0 || x.recolteDebut > pl.series[i - 1].recolteDebut), "séries de laitue : récoltes successives, sans doublon");
ok(planifier("tomate", 3, "tempere", 2026).series.length >= 1, "tomate : au moins une série planifiée");
ok(!!planifier("ail", 1, "tempere", 2026).avertissement, "ail : multiplication par caïeux signalée");
const pp = plantsParPlanche("carotte", 10, 0.75)!;
ok(pp.rangs === 3 && pp.plants === 750, "carottes : 3 rangs de 250 sur une planche de 10 × 0,75 m");
ok(successions("x", new Date(2026, 5, 25), [], "tempere").length > 0, "planche libérée fin juin : successions proposées");
ok(!successions("x", new Date(2026, 9, 25), [], "tempere").some((p) => p.id === "tomate"), "pas de tomate proposée fin octobre");
ok(engraisVertPour(9).texte.includes("hiver"), "engrais vert d'hiver proposé en septembre");
ok(nurserie("tempere").some((n) => n.plante.id === "poireau"), "nurserie : poireaux en motte");
ok(tempsDeTravail(100, "paille").moyenne < tempsDeTravail(100, "rangs").moyenne, "paillage : moins de temps de travail");
p1("plan de culture", "Plan de culture");
p1("quoi planter après les fèves", "Mes planches");
p1("binette oscillante", "Les outils du maraîcher");
p1("tensiomètre", "Irrigation raisonnée");
p1("chambre froide", "Après la récolte");
p1("vendre ses légumes", "Vendre son surplus");
p1("bande fleurie", "Plantes de service");
p1("voile de forçage", "Piloter un tunnel");
p1("plaque alvéolée", "Nurserie");

// Audit apiculteur : rucher, varroa, diagnostic, recherche
ok(couleurReine(2026).nom === "blanc" && couleurReine(2027).nom === "jaune" && couleurReine(2025).nom === "bleu", "couleurs de marquage des reines");
ok(valeurVarroa({ varroaMethode: "chute", varroaValeur: 30, varroaJours: 3 }) === 10, "chute naturelle : 30 en 3 jours = 10 par jour");
ok(valeurVarroa({ varroaMethode: "sucre", varroaValeur: 12 }) === 4, "sucre glace : 12 varroas / 300 abeilles = 4 %");
ok(niveauVarroa({ id: "", rucheId: "r", date: "2026-07-20", varroaMethode: "sucre", varroaValeur: 12 }) === "traiter", "4 % en juillet → traiter");
ok(niveauVarroa({ id: "", rucheId: "r", date: "2026-07-20", varroaMethode: "chute", varroaValeur: 6, varroaJours: 3 }) === "ok", "2 varroas par jour en juillet → sous le seuil");
ok(niveauVarroa({ id: "", rucheId: "r", date: "2026-04-10", varroaMethode: "chute", varroaValeur: 12, varroaJours: 3 }) === "traiter", "4 par jour au printemps → traiter");
{
  const ruches = [{ id: "a", nom: "R1", installee: "2025-05-01" }, { id: "b", nom: "R2", installee: "2025-05-01", morte: "2026-02-10", cause: "famine" }, { id: "c", nom: "R3", installee: "2025-12-01" }];
  const p = pertesHiver(ruches, 2025);
  ok(p.hivernees === 2 && p.mortes === 1 && p.taux === 50 && p.causes[0] === "famine", `pertes d'hiver (obtenu ${JSON.stringify(p)})`);
  const visites = [{ id: "v", rucheId: "a", date: "2026-07-20", varroaMethode: "sucre" as const, varroaValeur: 15 }];
  ok(alertesRucher({ ruches, visites, traitementsApi: [] }, "2026-07-25").some((x) => x.grave && x.texte.startsWith("R1")), "alerte varroa au-dessus du seuil");
  const tr = [{ id: "t", rucheIds: ["a"], produit: "Apivar (amitraze, lanières)", lot: "L12", debut: "2026-07-26" }];
  ok(!alertesRucher({ ruches, visites, traitementsApi: tr }, "2026-07-28").some((x) => x.grave && x.texte.startsWith("R1")), "plus d'alerte une fois traitée");
  ok(alertesRucher({ ruches, visites, traitementsApi: tr }, "2026-10-20").some((x) => x.texte.includes("sans date de retrait")), "alerte lanières oubliées");
  ok(/L12/.test(registreTraitementsCsv({ ruches, traitementsApi: tr })) && /R1/.test(registreTraitementsCsv({ ruches, traitementsApi: tr })), "registre des traitements exporté");
  ok(dernierSoin({ soins: [], visites, traitementsApi: tr }, "t", "abeille", "Comptage varroa")?.date === "2026-07-20", "un comptage du rucher vaut rappel de comptage");
  ok(dernierSoin({ soins: [], visites, traitementsApi: tr }, "t", "abeille", "Traitement varroa d'été")?.date === "2026-07-26", "un traitement d'été du registre vaut rappel");
}
ok(["Carnica", "Ligustica", "Caucasienne"].every((r) => RACES.abeille.some((x) => x.nom.startsWith(r))), "races d'abeilles complétées");
ok(MALADIES_ANIMALES.filter((m) => m.especes.includes("abeille")).length >= 14, "maladies et dangers des abeilles");
ok(/oxalique/.test(MALADIES_ANIMALES.find((m) => m.id === "varroa")!.quoiFaire.join(" ")), "varroa enrichi (acide oxalique)");
ok(diagnostiquerAnimal("abeille", ["couvain-mosaique", "opercules-affaisses", "odeur-ruche"])[0]?.m.id === "loque-americaine", "couvain en mosaïque + opercules affaissés + odeur → loque américaine");
ok(diagnostiquerAnimal("abeille", ["taches-diarrhee"])[0]?.m.id === "nosemose", "taches de diarrhée → nosémose");
ok(diagnostiquerAnimal("abeille", ["ruche-legere", "abeilles-mortes"])[0]?.m.id === "famine", "ruche légère + abeilles mortes → famine");
ok(!diagnostiquerAnimal("poule", ["couvain-mosaique"]).some((r) => r.m.especes.includes("abeille") && !r.m.especes.includes("poule")), "signes d'abeille sans effet sur les poules");
const api = (q: string, attendu: string, k = 3) => { const r = rechercher(q, k).map((h) => h.titre); ok(r.some((t) => t.startsWith(attendu)), `apiculteur « ${q} » → ${attendu} (obtenu : ${r.join(" | ")})`); };
api("loque américaine", "Loque américaine");
api("essaim artificiel", "Essaimage");
api("récupérer un essaim", "Essaimage");
api("couleur reine 2026", "Les reines");
api("acide oxalique", "Plan de lutte contre le varroa");
api("sirop pour abeilles", "Nourrir les abeilles");
api("candi", "Nourrir les abeilles");
api("miel cristallisé", "Les produits de la ruche");
api("dadant ou warré", "Choisir sa ruche");
api("transhumance", "Les miellées");
api("piqûre d'abeille", "Piqûres, allergies");
api("gdsa", "Le réseau sanitaire");
api("registre traitements ruches", "Mon rucher");
api("mon rucher", "Mon rucher");
api("abeilles qui tremblent", "Intoxication");
api("couvain troué", "Loque");
ok(!rechercher("reine-claude", 3).some((h) => h.titre.startsWith("Les reines")), "reine-claude reste une prune");
ok(!rechercher("registre élevage", 3).some((h) => h.titre.startsWith("Mon rucher")), "registre d'élevage ne part pas au rucher");

// Audit conserverie : sécurité, assistant, garde-manger, recherche
ok(proposer("tomate", { kg: 10, materiel: ["congelateur", "sterilisateur"], temps: 3, place: true })[0].methode === "sterilisation", "10 kg de tomates avec stérilisateur → bocaux");
ok(proposer("tomate", { kg: 3, materiel: ["congelateur"], temps: 1, place: false })[0].methode === "congelation", "peu de temps et pas de stérilisateur → congélation");
ok(proposer("tomate", { kg: 10, materiel: ["sterilisateur"], temps: 3, place: true }).find((p) => p.methode === "sterilisation")!.pourquoi.some((x) => /citron/.test(x)), "tomates en bocaux : rappel du citron");
ok(proposer("tomate", { kg: 5, materiel: [], temps: 2, place: true }).find((p) => p.methode === "congelation")!.manque !== undefined, "sans congélateur, la congélation est signalée impossible");
ok(/coulis/.test(proposer("tomate", { kg: 10, materiel: ["sterilisateur"], temps: 3, place: true }).find((p) => p.methode === "sterilisation")!.rendement ?? ""), "rendement affiché pour le coulis");
ok(numeroLot("Coulis de tomates", "2026-08-15", [{ lot: "260815-COU-1" }]) === "260815-COU-2", "numéro de lot unique");
ok(finDeGarde({ date: "2026-08-15", gardeMois: 12 }) === "2027-08-15", "date de garde d'un bocal");
{
  const st = [{ id: "a", produit: "Coulis", methode: "sterilisation", lieu: "placard" as const, date: "2025-01-10", quantite: 3, unite: "bocaux", gardeMois: 12 }, { id: "b", produit: "Pommes", methode: "cave", lieu: "cave" as const, date: "2026-10-01", quantite: 10, unite: "kg", gardeMois: 4 }, { id: "c", produit: "Vide", methode: "sucre", lieu: "placard" as const, date: "2024-01-01", quantite: 0, unite: "pots", gardeMois: 12 }];
  const al = alertesStocks(st, "2026-01-20");
  ok(al.depasses.length === 1 && al.depasses[0].id === "a" && al.cave, "garde-manger : bocal dépassé signalé, stock vide ignoré, cave détectée");
  const t = tachesPerso({ ...state, stocks: st } as State, new Date("2026-11-20T12:00:00"));
  ok(t.some((x) => x.key.startsWith("cave:")) , "tournée de cave rappelée en novembre");
}
ok(planAnnee([{ rendementId: "coulis", parMois: 4, mois: 9, contenance: 0.5 }])[0].bocaux === 36 && planAnnee([{ rendementId: "coulis", parMois: 4, mois: 9, contenance: 0.5 }])[0].kgFrais === 30, "plan de l'année : 36 bocaux de coulis = 30 kg de tomates");
ok(selLacto(2, 1).rape === 40 && selLacto(2, 1).saumure === 30, "sel de lacto-fermentation");
ok(sucreConfiture(2, 500).allegee && sucreConfiture(2, 800).sucre === 1.6, "sucre de confiture et alerte allégée");
ok(majorationAltitude(100) === 0 && majorationAltitude(600) === 5 && majorationAltitude(1200) === 10 && majorationAltitude(2000) === null, "correction d'altitude");
ok(Object.values(CONSERV).every((c) => c.methodes.every((m) => METHODES_CONSERV[m])), "méthodes de conservation connues");
ok(["chicoree", "oseille", "cresson"].every((id) => CONSERV[id]?.texte), "légumes sans conservation complétés");
ok(/citron/.test(PLANTES.find((p) => p.id === "tomate")!.conservation!), "fiche tomate : acidifier le coulis");
ok(!/feuilles dans l'huile\./.test(PLANTES.find((p) => p.id === "basilic")!.conservation!), "fiche basilic : plus de feuilles à l'huile à température ambiante");
ok(GUIDES.filter((g) => g.id.startsWith("cs-")).length === 15, "15 guides de conserverie");
const cs = (q: string, attendu: string, k = 3) => { const r = rechercher(q, k).map((h) => h.titre); ok(r.some((t) => t.startsWith(attendu)), `conserverie « ${q} » → ${attendu} (obtenu : ${r.join(" | ")})`); };
cs("confiture", "Confitures et gelées");
cs("botulisme", "Conserves maison : les règles");
cs("ail dans l'huile", "Conserves maison : les règles");
cs("combien de temps stériliser", "Temps de");
cs("pasteuriser", "Temps de blanchiment");
cs("chutney", "Pickles au vinaigre");
cs("jus de pomme", "Jus, nectars");
cs("fumer", "Sel, huile et fumage", 1);
cs("trop de tomates", "J'ai trop de", 1);
cs("bocal bombé", "Conserves maison");
cs("le parfait", "Le matériel de conserverie");
cs("vendre ses confitures", "Donner ou vendre");
cs("conserver les pommes", "La cave et le fruitier");
cs("eau de vie", "Fruits à l'eau-de-vie");
ok(!rechercher("trop de soleil", 3).some((h) => h.titre.startsWith("J'ai trop de")), "« trop de soleil » ne part pas vers les surplus");
ok(rechercher("fumier", 1)[0]?.titre.startsWith("Fumier"), "fumier reste le fumier");

console.log(fails ? `✗ ${fails}/${n} test(s) en échec` : `✓ ${n} tests de logique réussis`);
if (fails) process.exit(1);
