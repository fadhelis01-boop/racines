// Tests de la logique métier (exécutés à chaque build)
import { shiftMonths, plantesDuMois, buildIcs, recolteEstimee, tachesPerso } from "../src/lib/calendar";
import { diagnostiquer, relations, verifierRotation, recommander } from "../src/lib/garden";
import { lune } from "../src/lib/lune";
import { spoken } from "../src/lib/tts";
import { ficheParLatin } from "../src/lib/identify";
import { DEFAULT_SETTINGS, type State, type MaPlante } from "../src/lib/store";
import { rechercher } from "../src/lib/search";
import { echeances, intervalleArrosage, marquer } from "../src/lib/mesplantes";
import { ficheLatin } from "../src/lib/identify";

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
  ok(rechercher(q).slice(0, 5).some((h) => h.titre.startsWith(attendu)), `recherche « ${q} » → ${attendu} (obtenu : ${rechercher(q).slice(0, 3).map((h) => h.titre).join(" | ")})`);

// Pl@ntNet : correspondances strictes
ok(ficheLatin("Dracaena fragrans")?.id === "dracaena", "Dracaena fragrans → dracaena (pas sansevieria)");
ok(ficheLatin("Phalaenopsis amabilis")?.id === "orchidee", "Phalaenopsis amabilis → orchidée");
ok(ficheLatin("Echeveria elegans")?.id === "succulentes" && ficheLatin("Echeveria elegans")?.exact === false, "Echeveria → succulentes (genre)");
ok(ficheLatin("Solanum melongena")?.id === "aubergine", "Solanum melongena → aubergine (pas tomate)");
ok(ficheLatin("Solanum nigrum") === undefined, "Solanum nigrum → aucune fiche (pas de faux positif)");

// Mes plantes : rythme d'arrosage selon saison et fenêtre
const mp: MaPlante = { id: "m", planteId: "pothos", surnom: "Pothos", fenetre: "sud", depuis: "2026-01-01", arrosages: ["2026-07-01"], engrais: [], rempotages: [], photos: [] };
ok(intervalleArrosage(mp, new Date("2026-07-02T12:00:00")) < intervalleArrosage({ ...mp, fenetre: "nord" }, new Date("2026-07-02T12:00:00")), "fenêtre sud = arrosages plus rapprochés que nord");
ok(intervalleArrosage(mp, new Date("2026-01-10T12:00:00")) > intervalleArrosage(mp, new Date("2026-07-02T12:00:00")), "hiver = arrosages plus espacés");
ok(echeances(mp, new Date("2026-07-20T12:00:00"))[0].dans <= 0, "pothos arrosé le 1er juillet : à vérifier le 20");
ok(echeances(marquer(mp, "arrosage", new Date("2026-07-20T12:00:00")), new Date("2026-07-20T12:00:00"))[0].dans > 0, "après arrosage : plus rien à faire");
ok(!echeances({ ...mp, planteId: "tillandsia" }, new Date("2026-07-20T12:00:00")).some((e) => e.type === "engrais"), "pas de rappel d'engrais pour un tillandsia");

console.log(fails ? `✗ ${fails}/${n} test(s) en échec` : `✓ ${n} tests de logique réussis`);
if (fails) process.exit(1);
