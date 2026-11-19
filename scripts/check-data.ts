import { GESTES_RECOLTE } from "../src/data/cueillette";
import { AMENAGEMENTS } from "../src/data/amenagements";
import { MULTIPLICATION, AROMATES_INT } from "../src/data/interieur-hub";
import { TYPES_SOL, SOL_PLANTE } from "../src/data/sols";
import { NUTRIMENTS, ENGRAIS_NATURELS, NUTRITION_ANIMAUX } from "../src/data/nutrition";
import { PAS_A_PAS, TECHNIQUES } from "../src/data/methodes";
import { choisirMethodes } from "../src/lib/methodes";
import { INCREVABLES, AROMATES_FACILES, POTAGER_FACILE, OFFRIR } from "../src/data/debuter";
import { CONTENANT, RENDEMENT, PROFONDEUR, GERMINATION, FRUITIERS } from "../src/data/cultures-complements";
import { STATUT_REMEDE } from "../src/data/reglementation";

import { RACES } from "../src/data/races";
import { MARAICH } from "../src/data/maraichage";
import { CONSERV, METHODES_CONSERV, RENDEMENTS } from "../src/data/conservation";
import { VARIETES } from "../src/data/varietes";
import { QUIZ, PARCOURS_AGRONOMIE } from "../src/data/pedagogie";
import { ALIAS_GUIDES } from "../src/data/guides-balcon";
import { MALADIES_ANIMALES, SIGNES_ANIMAUX } from "../src/data/maladies-animales";
// Contrôle de cohérence du contenu, exécuté à chaque build.
// Échoue si une référence croisée pointe vers un id inexistant.
import { ENRICH } from "../src/data/interieur2";
import { TRAITS } from "../src/data/traits";
import { LEXIQUE } from "../src/data/lexique";
import { PLANTES, PROBLEMES, REMEDES, GUIDES, ANIMAUX, SIGNES, AUXILIAIRES, CALENDRIER, lienVers } from "../src/data/index";

const errors: string[] = [];
const ids = new Set<string>();
const dup = (kind: string, arr: { id: string }[]) => {
  for (const x of arr) {
    if (ids.has(x.id)) errors.push(`${kind} : id en double « ${x.id} »`);
    ids.add(x.id);
  }
};
dup("plante", PLANTES); dup("problème", PROBLEMES); dup("remède", REMEDES); dup("guide", GUIDES); dup("animal", ANIMAUX); dup("auxiliaire", AUXILIAIRES);

const P = new Set(PLANTES.map((p) => p.id));
const PB = new Set(PROBLEMES.map((p) => p.id));
const R = new Set(REMEDES.map((p) => p.id));

for (const p of PLANTES) {
  for (const a of [...p.amis, ...p.ennemis]) if (!P.has(a)) errors.push(`plante ${p.id} : voisin inconnu « ${a} »`);
  for (const a of p.amis) if (p.ennemis.includes(a)) errors.push(`plante ${p.id} : « ${a} » à la fois ami et ennemi`);
  for (const pb of p.problemes) if (!PB.has(pb)) errors.push(`plante ${p.id} : problème inconnu « ${pb} »`);
  if (!p.intro || !p.etapes.length) errors.push(`plante ${p.id} : fiche incomplète`);
}
for (const pb of PROBLEMES) {
  for (const k of Object.keys(ENRICH)) if (!P.has(k)) errors.push(`enrichissement : fiche inconnue « ${k} »`);
  for (const pl of pb.plantes) if (pl !== "*" && !P.has(pl)) errors.push(`problème ${pb.id} : plante inconnue « ${pl} »`);
  for (const r of pb.remedes) if (!R.has(r)) errors.push(`problème ${pb.id} : remède inconnu « ${r} »`);
  for (const s of pb.signes) if (!SIGNES[s]) errors.push(`problème ${pb.id} : signe inconnu « ${s} »`);
  if (!pb.signes.length) errors.push(`problème ${pb.id} : aucun signe pour le diagnostic`);
}
for (const r of REMEDES) for (const c of r.contre) if (!PB.has(c)) errors.push(`remède ${r.id} : problème inconnu « ${c} »`);
for (const g of GUIDES) {
  for (const l of g.liens ?? []) if (!lienVers(l)) errors.push(`guide ${g.id} : lien inconnu « ${l} »`);
  if (g.etapes.length < 2) errors.push(`guide ${g.id} : trop peu d'étapes`);
}
for (const k of Object.keys(TRAITS)) if (!P.has(k)) errors.push(`traits : fiche inconnue « ${k} »`);
for (const p of PLANTES) {
  for (const so of p.sosies ?? []) if (so.id && !P.has(so.id)) errors.push(`plante ${p.id} : sosie inconnu « ${so.id} »`);
  if (p.categorie === "interieur" && !p.soins) errors.push(`plante d'intérieur ${p.id} : rythme de soins manquant`);
  if (p.categorie === "interieur" && p.sansDangerAnimaux === undefined) errors.push(`plante d'intérieur ${p.id} : toxicité animaux non renseignée`);
  if (p.categorie === "interieur" && !TRAITS[p.id]) errors.push(`plante d'intérieur ${p.id} : caractères d'identification manquants`);
}
for (const t of LEXIQUE) if (t.voir && !lienVers(t.voir)) errors.push(`lexique ${t.id} : lien inconnu « ${t.voir} »`);
if (CALENDRIER.length !== 12) errors.push("calendrier : 12 mois attendus");
for (const s of Object.keys(SIGNES)) if (!PROBLEMES.some((p) => p.signes.includes(s))) errors.push(`signe « ${s} » jamais utilisé`);

{
  for (const k of Object.keys(ALIAS_GUIDES)) if (!GUIDES.some((g) => g.id === k)) errors.push(`alias de tutoriel pour un id inconnu « ${k} »`);
  dup("maladie animale", MALADIES_ANIMALES);
  for (const k of Object.keys(MARAICH)) if (!PLANTES.some((p) => p.id === k)) errors.push(`maraîchage : plante inconnue « ${k} »`);
  for (const [id, qs] of Object.entries(QUIZ)) { if (!GUIDES.some((g) => g.id === id)) errors.push(`quiz : guide inconnu « ${id} »`); for (const q of qs) if (q.bonne < 0 || q.bonne >= q.choix.length) errors.push(`quiz ${id} : réponse hors des choix (« ${q.q} »)`); }
  for (const l of PARCOURS_AGRONOMIE) { for (const g of l.guides) if (!GUIDES.some((x) => x.id === g)) errors.push(`parcours ${l.id} : guide inconnu « ${g} »`); for (const m of l.mots) if (!LEXIQUE.some((t) => t.id === m)) errors.push(`parcours ${l.id} : mot inconnu « ${m} »`); }
  for (const k of Object.keys(VARIETES)) if (!PLANTES.some((p) => p.id === k)) errors.push(`variétés : plante inconnue « ${k} »`);
  for (const p of PLANTES.filter((x) => ["legume", "fruit", "arbre"].includes(x.categorie))) if (!VARIETES[p.id] && !/variét/i.test(JSON.stringify(p))) errors.push(`variétés manquantes pour « ${p.id} »`);
  for (const k of Object.keys(CONSERV)) if (!PLANTES.some((p) => p.id === k)) errors.push(`conservation : plante inconnue « ${k} »`);
  for (const p of PLANTES.filter((x) => ["legume", "aromatique", "fruit", "arbre"].includes(x.categorie))) if (!CONSERV[p.id]) errors.push(`conservation : données manquantes pour « ${p.id} »`);
  for (const m of Object.values(METHODES_CONSERV)) if (!GUIDES.some((g) => g.id === m.guide)) errors.push(`conservation : guide inconnu « ${m.guide} »`);
  for (const r of RENDEMENTS) if (!PLANTES.some((p) => p.id === r.planteId)) errors.push(`rendement : plante inconnue « ${r.planteId} »`);
  for (const p of PLANTES.filter((x) => x.categorie === "legume" || x.categorie === "aromatique")) if (!MARAICH[p.id]) errors.push(`maraîchage : données manquantes pour « ${p.id} »`);
  for (const k of Object.keys(RACES)) if (!ANIMAUX.some((a) => a.id === k)) errors.push(`races : animal inconnu « ${k} »`);
  for (const a of ANIMAUX) { if (!RACES[a.id]?.length) errors.push(`animal ${a.id} : aucune race décrite`); if (!a.soins.length) errors.push(`animal ${a.id} : aucun soin planifié`); }
  for (const g of GUIDES) for (const e of g.etapes) if (/tourbe blonde/i.test(e.texte)) errors.push(`tutoriel ${g.id} : tourbe recommandée`);
  for (const p of PLANTES) for (const t of [p.rempotage ?? "", ...p.etapes, ...p.entretien]) if (/tourbe blonde|^tourbe/i.test(t)) errors.push(`plante ${p.id} : tourbe recommandée`);
  for (const id of [...Object.keys(CONTENANT), ...Object.keys(RENDEMENT), ...Object.keys(PROFONDEUR), ...Object.keys(GERMINATION), ...Object.keys(FRUITIERS)]) if (!PLANTES.some((p) => p.id === id)) errors.push(`complément cultural : plante inconnue « ${id} »`);
  for (const r of REMEDES) if (!STATUT_REMEDE[r.id] && !AUXILIAIRES.some((a) => a.id === r.id)) errors.push(`remède ${r.id} : statut réglementaire manquant`);
  for (const p of PLANTES.filter((x) => x.categorie === "legume")) { if (!p.contenant) errors.push(`légume ${p.id} : taille de pot manquante`); if (!p.rendement) errors.push(`légume ${p.id} : rendement manquant`); }
  for (const p of PLANTES.filter((x) => x.categorie === "arbre" || x.categorie === "fruit")) if (!FRUITIERS[p.id]) errors.push(`fruitier ${p.id} : pollinisation non renseignée`);
  for (const x of [...INCREVABLES, ...AROMATES_FACILES, ...POTAGER_FACILE, ...OFFRIR]) if (!PLANTES.some((p) => p.id === x.id)) errors.push(`débuter : plante inconnue « ${x.id} »`);
  for (const x of OFFRIR) if (!PLANTES.find((p) => p.id === x.id)?.sansDangerAnimaux) errors.push(`débuter : « ${x.id} » proposée en cadeau sans danger mais toxique pour les animaux`);
  for (const x of INCREVABLES) if ((PLANTES.find((p) => p.id === x.id)?.difficulte ?? 3) > 1) errors.push(`débuter : « ${x.id} » présentée comme increvable mais pas « facile »`);
  dup("aménagement", AMENAGEMENTS);
  for (const id of Object.keys(PAS_A_PAS)) if (!AMENAGEMENTS.some((a) => a.id === id)) errors.push(`pas à pas pour un aménagement inconnu « ${id} »`);
  for (const t of TECHNIQUES) if (!t.lien.startsWith("lex-") && !lienVers(t.lien)) errors.push(`technique ${t.nom} : lien inconnu « ${t.lien} »`);
  const tous = choisirMethodes({ lieu: "jardin", surface: 50, depart: "pelouse", sol: "inconnu", temps: "moyen", budget: "moyen", corps: "ok", eau: "facile", materiaux: [], duree: "long", objectif: "debuter" });
  for (const c of tous) { if (!AMENAGEMENTS.some((a) => a.id === c.id)) errors.push(`assistant : méthode inconnue « ${c.id} »`); if (!PAS_A_PAS[c.id]) errors.push(`assistant : pas à pas manquant pour « ${c.id} »`); }
  for (const t of TYPES_SOL) for (const id of t.aime) if (!PLANTES.some((p) => p.id === id)) errors.push(`sol ${t.id} : plante inconnue « ${id} »`);
  for (const id of Object.keys(SOL_PLANTE)) if (!PLANTES.some((p) => p.id === id)) errors.push(`sol idéal : plante inconnue « ${id} »`);
  for (const n of NUTRIMENTS) if (n.carence && !PROBLEMES.some((p) => p.id === n.carence)) errors.push(`nutriment ${n.id} : carence inconnue « ${n.carence} »`);
  for (const e of ENGRAIS_NATURELS) if (e.lien && !lienVers(e.lien)) errors.push(`engrais ${e.nom} : lien inconnu « ${e.lien} »`);
  for (const a of ANIMAUX) if (!NUTRITION_ANIMAUX.some((n) => n.id === a.id)) errors.push(`besoins alimentaires manquants pour l'animal « ${a.id} »`);
  for (const n of NUTRITION_ANIMAUX) if (!ANIMAUX.some((a) => a.id === n.id)) errors.push(`besoins alimentaires : animal inconnu « ${n.id} »`);
  for (const id of Object.keys(MULTIPLICATION)) if (!PLANTES.some((p) => p.id === id)) errors.push(`multiplication : plante inconnue « ${id} »`);
  for (const a of AROMATES_INT) if (a.id && !PLANTES.some((p) => p.id === a.id)) errors.push(`aromate intérieur : plante inconnue « ${a.id} »`);
  for (const g of GESTES_RECOLTE) for (const id of g.plantes) if (!PLANTES.some((p) => p.id === id)) errors.push(`geste ${g.id} : plante inconnue « ${id} »`);
  for (const a of AMENAGEMENTS) for (const l of a.liens) if (!lienVers(l)) errors.push(`aménagement ${a.id} : lien inconnu « ${l} »`);
  for (const m of MALADIES_ANIMALES) {
    for (const e of m.especes) if (!ANIMAUX.some((a) => a.id === e)) errors.push(`maladie ${m.id} : espèce inconnue « ${e} »`);
    for (const x of m.signesIds) if (!SIGNES_ANIMAUX[x]) errors.push(`maladie ${m.id} : signe inconnu « ${x} »`);
  }
}
if (errors.length) {
  console.error(`✗ ${errors.length} erreur(s) dans le contenu :\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ Contenu cohérent : ${PLANTES.length} plantes, ${PROBLEMES.length} problèmes, ${REMEDES.length} remèdes, ${GUIDES.length} tutoriels, ${ANIMAUX.length} animaux.`);
