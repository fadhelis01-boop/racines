import { GESTES_RECOLTE } from "../src/data/cueillette";
import { AMENAGEMENTS } from "../src/data/amenagements";
import { MULTIPLICATION, AROMATES_INT } from "../src/data/interieur-hub";
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
