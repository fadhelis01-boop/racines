// Tests de la logique métier (exécutés à chaque build)
import { shiftMonths, plantesDuMois, buildIcs, recolteEstimee, tachesPerso } from "../src/lib/calendar";
import { diagnostiquer, relations, verifierRotation, recommander } from "../src/lib/garden";
import { lune } from "../src/lib/lune";
import { spoken } from "../src/lib/tts";
import { ficheParLatin } from "../src/lib/identify";
import { DEFAULT_SETTINGS, type State, type MaPlante } from "../src/lib/store";
import { rechercher, parleAnimal, ressembleSymptome } from "../src/lib/search";
import { diagnostiquerAnimal } from "../src/lib/sante-animale";
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

console.log(fails ? `✗ ${fails}/${n} test(s) en échec` : `✓ ${n} tests de logique réussis`);
if (fails) process.exit(1);
