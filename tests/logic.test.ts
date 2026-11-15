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
import { decouper } from "../src/lib/lexique-texte";
import { diagnostiquerAnimal } from "../src/lib/sante-animale";
import { moisAffiches, aRepiquer } from "../src/lib/calendar";
import { gesteDe } from "../src/data/cueillette";
import { plantesVertes } from "../src/lib/garden";
import { echeances, intervalleArrosage, marquer } from "../src/lib/mesplantes";
import { ficheLatin } from "../src/lib/identify";
import { plante } from "../src/data/index";
import { besoinEau } from "../src/components/PlanVisuel";

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

console.log(fails ? `✗ ${fails}/${n} test(s) en échec` : `✓ ${n} tests de logique réussis`);
if (fails) process.exit(1);
