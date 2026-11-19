// Calculs d'élevage : couvaison, bilan de production et de dépenses, registre exportable.
import type { Reproduction, State, Couvee, TypeProduction } from "./store";
import { ANIMAUX } from "../data/index";

export const COUVAISON: Record<string, { nom: string; jours: number; temp: string; humidite: string; retournement: string }> = {
  poule: { nom: "Poule", jours: 21, temp: "37,7 °C (couveuse ventilée)", humidite: "50-55 %, puis 65-70 % les 3 derniers jours", retournement: "3 à 5 fois par jour jusqu'au 18e jour" },
  canard: { nom: "Cane (canard commun)", jours: 28, temp: "37,5 °C", humidite: "55-60 %, puis 70-75 %", retournement: "3 à 5 fois par jour jusqu'au 25e jour ; brumiser les œufs à partir du 10e jour" },
  barbarie: { nom: "Cane de Barbarie", jours: 35, temp: "37,5 °C", humidite: "55-60 %, puis 75 %", retournement: "Jusqu'au 31e jour, brumisation quotidienne" },
  oie: { nom: "Oie", jours: 30, temp: "37,4 °C", humidite: "55 %, puis 75 %", retournement: "Jusqu'au 27e jour, brumisation et refroidissement quotidiens" },
  pintade: { nom: "Pintade", jours: 27, temp: "37,6 °C", humidite: "50-55 %, puis 70 %", retournement: "Jusqu'au 24e jour" },
  caille: { nom: "Caille", jours: 17, temp: "37,7 °C", humidite: "45-50 %, puis 65-70 %", retournement: "Jusqu'au 14e jour" },
  dindon: { nom: "Dinde", jours: 28, temp: "37,5 °C", humidite: "55 %, puis 70 %", retournement: "Jusqu'au 25e jour" },
  pigeon: { nom: "Pigeon", jours: 18, temp: "Couvaison par les parents", humidite: "—", retournement: "Les parents s'en chargent" },
};

const plus = (iso: string, j: number) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + j); return d.toISOString().slice(0, 10); };

// Dates clés d'une couvée : 1er mirage (~1/3), 2e mirage (~2/3), arrêt du retournement (3 jours avant), éclosion
export function datesCouvee(espece: string, debut: string) {
  const c = COUVAISON[espece] ?? COUVAISON.poule;
  const j = c.jours;
  return {
    mirage1: plus(debut, Math.round(j / 3)),
    mirage2: plus(debut, Math.round((j * 2) / 3)),
    arretRetournement: plus(debut, j - 3),
    eclosion: plus(debut, j),
    finEclosion: plus(debut, j + 2),
  };
}

export function tachesCouvees(couvees: Couvee[], now = new Date()) {
  const auj = now.toISOString().slice(0, 10);
  const dans7 = plus(auj, 7);
  const out: { key: string; texte: string; quand: string }[] = [];
  for (const c of couvees.filter((x) => !x.fini)) {
    const d = datesCouvee(c.espece, c.debut);
    const nom = COUVAISON[c.espece]?.nom.toLowerCase() ?? c.espece;
    const etapes: [string, string][] = [[d.mirage1, "1er mirage : retirer les œufs clairs"], [d.mirage2, "2e mirage : retirer les embryons arrêtés"], [d.arretRetournement, "arrêter le retournement, monter l'humidité"], [d.eclosion, "éclosion prévue : ne pas ouvrir la couveuse"]];
    for (const [date, t] of etapes) if (date >= auj && date <= dans7) out.push({ key: `couvee:${c.id}:${date}`, texte: `Couvée de ${nom} (${c.oeufs} œufs) : ${t} le ${new Date(date + "T12:00:00").toLocaleDateString("fr-FR")}`, quand: date });
  }
  return out;
}

export const UNITES: Record<TypeProduction, string> = { oeufs: "œufs", lait: "L", miel: "kg", laine: "kg", viande: "kg" };
export const PRODUITS: Record<string, TypeProduction[]> = {
  poule: ["oeufs", "viande"], canard: ["oeufs", "viande"], oie: ["oeufs", "viande"], pintade: ["oeufs", "viande"], caille: ["oeufs", "viande"], dindon: ["oeufs", "viande"], pigeon: ["viande"],
  lapin: ["viande"], chevre: ["lait", "viande"], mouton: ["lait", "laine", "viande"], ane: [], cheval: [], cochon: ["viande"], abeille: ["miel"],
};

// Bilan sur une période : production par type, dépenses, coût par œuf ou par litre
export function bilan(s: State, depuis: string, troupeauId?: string) {
  const prod = s.production.filter((p) => p.date >= depuis && (!troupeauId || p.troupeauId === troupeauId));
  const parType: Partial<Record<TypeProduction, number>> = {};
  for (const p of prod) parType[p.type] = (parType[p.type] ?? 0) + p.qte;
  // ancien suivi global de la ponte
  if (!troupeauId) for (const [d, n] of Object.entries(s.ponte)) if (d >= depuis) parType.oeufs = (parType.oeufs ?? 0) + n;
  const dep = s.depenses.filter((d) => d.date >= depuis && (!troupeauId || d.troupeauId === troupeauId));
  const total = dep.reduce((a, d) => a + d.montant, 0);
  const parCat: Record<string, number> = {};
  for (const d of dep) parCat[d.categorie] = (parCat[d.categorie] ?? 0) + d.montant;
  return { parType, depenses: total, parCat, coutOeuf: parType.oeufs ? total / parType.oeufs : undefined, coutLitre: parType.lait ? total / parType.lait : undefined, coutKgViande: parType.viande ? total / parType.viande : undefined };
}

// Registre des mouvements (entrées, naissances, sorties, morts) au format tableur
export function registreCsv(s: State) {
  const esc = (x: string | number | undefined) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const lignes = [["Date", "Espèce", "Groupe", "Mouvement", "Nombre", "Identifiants (boucles)", "Provenance / destination", "Note"].map(esc).join(";")];
  const TYPES = { entree: "Entrée", naissance: "Naissance", sortie: "Sortie (vente, don)", deces: "Mort" };
  for (const m of [...s.mouvements].sort((a, b) => a.date.localeCompare(b.date))) {
    const t = s.troupeaux.find((x) => x.id === m.troupeauId);
    const a = ANIMAUX.find((x) => x.id === t?.animalId);
    lignes.push([m.date, a?.nom ?? "", t?.nom ?? "", TYPES[m.type], m.nombre, m.boucles, m.provenance, m.note].map(esc).join(";"));
  }
  return "﻿" + lignes.join("\r\n");
}

// ——— Reproduction des mammifères : gestation, jalons, sevrage (repères courants)
export const GESTATION: Record<string, { nom: string; jours: number; marge: number; preparation: string; sevrage: string; sevrageJours: number; premiereMiseRepro: string }> = {
  chevre: { nom: "Chèvre", jours: 150, marge: 5, preparation: "Case de mise bas propre et paillée, ration augmentée progressivement les 6 dernières semaines, tarissement 2 mois avant.", sevrage: "chevreaux sevrés vers 2 à 3 mois (au moins 12-15 kg)", sevrageJours: 75, premiereMiseRepro: "chevrettes mises au bouc vers 7 à 8 mois, à environ 60 % de leur poids adulte" },
  mouton: { nom: "Brebis", jours: 147, marge: 5, preparation: "Case d'agnelage, ration augmentée les 6 dernières semaines (risque de toxémie), tonte des abords de la mamelle (« désaillage »).", sevrage: "agneaux sevrés vers 2,5 à 3 mois", sevrageJours: 80, premiereMiseRepro: "agnelles mises au bélier vers 7 à 9 mois (races précoces) ou 18 mois (races rustiques)" },
  lapin: { nom: "Lapine", jours: 31, marge: 2, preparation: "Boîte à nid avec paille ou foin propre posée au 28e jour (pas avant : elle y ferait ses crottes) ; la lapine s'arrache le poil pour faire son nid.", sevrage: "lapereaux sevrés à 5 semaines (pas avant 4)", sevrageJours: 35, premiereMiseRepro: "lapines mises au mâle vers 4,5 à 5 mois (races moyennes), plus tard pour les grandes races" },
  ane: { nom: "Ânesse", jours: 365, marge: 20, preparation: "Pré propre et calme près de la maison le dernier mois, vaccins à jour (tétanos) quelques semaines avant.", sevrage: "ânon sevré vers 6 à 8 mois", sevrageJours: 210, premiereMiseRepro: "pas avant 3 ans" },
  cheval: { nom: "Jument", jours: 340, marge: 15, preparation: "Box de poulinage ou pré propre, vaccins à jour, surveillance de la mamelle (« cire » sur les trayons 1 à 2 jours avant).", sevrage: "poulain sevré vers 6 mois", sevrageJours: 180, premiereMiseRepro: "pas avant 3 ans" },
  cochon: { nom: "Truie", jours: 114, marge: 3, preparation: "Case de mise bas avec barre anti-écrasement et nid de paille, coin chauffé pour les porcelets.", sevrage: "porcelets sevrés vers 4 à 6 semaines en élevage familial (au moins 28 jours)", sevrageJours: 35, premiereMiseRepro: "cochettes mises au verrat vers 7 à 8 mois" },
};

export function datesMiseBas(espece: string, saillie: string) {
  const g = GESTATION[espece] ?? GESTATION.chevre;
  const d = (n: number) => { const x = new Date(saillie + "T12:00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  return {
    miseBas: d(g.jours),
    debut: d(g.jours - g.marge),
    fin: d(g.jours + g.marge),
    preparation: espece === "lapin" ? d(28) : d(g.jours - 14),
    rationAugmentee: espece === "lapin" ? d(21) : d(Math.max(0, g.jours - 42)),
    sevrage: d(g.jours + g.sevrageJours),
    // Retour en chaleurs si la saillie n'a pas pris : 21 jours chez chèvre, brebis, truie, jument ; lapine : palpation à 12-14 jours
    controle: espece === "lapin" ? d(12) : d(espece === "mouton" ? 17 : 21),
  };
}

// ——— Rations journalières indicatives (animal adulte moyen), en foin et en concentré (céréales ou aliment complet)
export interface Ration { stade: string; foinKg: [number, number]; concentreG: [number, number]; note: string }
export const RATIONS: Record<string, { nom: string; poids: string; stades: Ration[]; mineraux: string }> = {
  chevre: { nom: "Chèvre (55 à 70 kg)", poids: "60 kg", mineraux: "Pierre à lécher ou minéraux pour chèvres (avec cuivre) à volonté, eau propre à volonté.", stades: [
    { stade: "Entretien (tarie, non gestante)", foinKg: [2, 2.5], concentreG: [0, 0], note: "Foin de qualité ou pâturage + broussailles ; pas de céréales nécessaires." },
    { stade: "Fin de gestation (6 dernières semaines)", foinKg: [2, 2.5], concentreG: [200, 400], note: "Augmentez le concentré progressivement : prévient la toxémie de gestation." },
    { stade: "Lactation", foinKg: [2.5, 3], concentreG: [300, 1000], note: "Environ 300 à 400 g de concentré par litre de lait au-delà du premier litre, en 2 repas ; jamais plus d'1 kg par jour sans avis (acidose)." },
  ] },
  mouton: { nom: "Brebis (60 à 70 kg)", poids: "65 kg", mineraux: "Pierre à lécher SPÉCIALE MOUTON (sans cuivre ajouté), eau propre à volonté.", stades: [
    { stade: "Entretien", foinKg: [1.5, 2], concentreG: [0, 0], note: "L'herbe suffit l'été ; foin l'hiver." },
    { stade: "Fin de gestation (6 dernières semaines)", foinKg: [1.8, 2.2], concentreG: [200, 600], note: "200 à 400 g pour un agneau, 400 à 600 g pour des jumeaux : la toxémie guette les brebis à gestation multiple." },
    { stade: "Allaitement", foinKg: [2, 2.5], concentreG: [400, 800], note: "Selon le nombre d'agneaux allaités ; réduisez progressivement avant le sevrage." },
  ] },
  lapin: { nom: "Lapin (3 à 5 kg)", poids: "4 kg", mineraux: "Eau propre à volonté (biberon ou bol), pierre à ronger facultative.", stades: [
    { stade: "Adulte à l'entretien", foinKg: [0.1, 0.2], concentreG: [80, 120], note: "Foin à volonté (la base, indispensable aux dents et au transit), granulés limités, verdure introduite progressivement." },
    { stade: "Lapine gestante", foinKg: [0.15, 0.2], concentreG: [120, 180], note: "Augmentez les granulés la dernière semaine." },
    { stade: "Lapine allaitante", foinKg: [0.2, 0.3], concentreG: [250, 400], note: "Granulés presque à volonté : une lapine allaitante mange beaucoup ; eau abondante." },
  ] },
  poule: { nom: "Poule pondeuse", poids: "2 kg", mineraux: "Coquilles d'huîtres ou carbonate de calcium à volonté, grit (petits cailloux), eau propre.", stades: [
    { stade: "Ponte", foinKg: [0, 0], concentreG: [120, 130], note: "Aliment complet pondeuse, ou céréales + protéines ; restes de jardin en complément (pas plus d'un quart de la ration)." },
  ] },
};

/** Foin à stocker pour l'hiver : animaux × kg par jour × jours d'hiver, avec 10 % de pertes. */
export function foinHiver(nb: number, kgJour: number, jours: number) {
  const kg = Math.round(nb * kgJour * jours * 1.1);
  return { kg, petitesBottes: Math.ceil(kg / 18), grossesBalles: Math.ceil(kg / 250) };
}

// ——— Performances
/** Taux de ponte sur une période : œufs ramassés / (nombre de poules × jours), en %. */
export function tauxPonte(s: Pick<State, "production" | "troupeaux">, troupeauId: string, jours = 30, aujourdhui = new Date().toISOString().slice(0, 10)) {
  const t = s.troupeaux.find((x) => x.id === troupeauId);
  if (!t || !t.nombre) return undefined;
  const d = new Date(aujourdhui + "T12:00:00"); d.setDate(d.getDate() - jours + 1);
  const depuis = d.toISOString().slice(0, 10);
  const oeufs = s.production.filter((p) => p.troupeauId === troupeauId && p.type === "oeufs" && p.date >= depuis && p.date <= aujourdhui).reduce((a, p) => a + p.qte, 0);
  return Math.round((oeufs / (t.nombre * jours)) * 1000) / 10;
}

/** Lait par femelle sur une période (litres), à partir des productions notées par animal. */
export function laitParFemelle(s: Pick<State, "production">, troupeauId: string, depuis: string) {
  const out: Record<string, number> = {};
  for (const p of s.production) if (p.troupeauId === troupeauId && p.type === "lait" && p.individuId && p.date >= depuis) out[p.individuId] = (out[p.individuId] ?? 0) + p.qte;
  return out;
}

/** Gain moyen quotidien (g/jour) entre la première et la dernière pesée d'un même animal. */
export function gmq(pesees: { date: string; kg: number }[]) {
  if (pesees.length < 2) return undefined;
  const t = [...pesees].sort((a, b) => a.date.localeCompare(b.date));
  const jours = (new Date(t[t.length - 1].date).getTime() - new Date(t[0].date).getTime()) / 86400000;
  return jours > 0 ? Math.round(((t[t.length - 1].kg - t[0].kg) * 1000) / jours) : undefined;
}

/** Bilan d'une reproductrice : mises bas, nés, vivants, moyenne par portée, survie. */
export function bilanFemelle(reps: Reproduction[]) {
  const faites = reps.filter((r) => r.miseBas);
  const nes = faites.reduce((a, r) => a + (r.nes ?? 0), 0);
  const vivants = faites.reduce((a, r) => a + (r.vivants ?? r.nes ?? 0), 0);
  return { misesBas: faites.length, nes, vivants, parPortee: faites.length ? Math.round((nes / faites.length) * 10) / 10 : 0, survie: nes ? Math.round((vivants / nes) * 100) : 0, difficultes: faites.filter((r) => r.difficulte).length };
}

/** Tâches à venir pour les gestations en cours (préparation, mise bas, sevrage), comme pour les couvées. */
export function tachesReproduction(reps: Reproduction[], troupeaux: { id: string; animalId: string; nom: string }[], now: Date) {
  const auj = now.toISOString().slice(0, 10);
  const lim = new Date(now); lim.setDate(lim.getDate() + 14);
  const limite = lim.toISOString().slice(0, 10);
  const out: { key: string; texte: string; quand: string; urgent?: boolean }[] = [];
  for (const r of reps) {
    const t = troupeaux.find((x) => x.id === r.troupeauId);
    if (!t || !GESTATION[t.animalId]) continue;
    const d = datesMiseBas(t.animalId, r.saillie);
    const qui = r.femelle ?? t.nom;
    if (!r.miseBas) {
      if (d.preparation >= auj && d.preparation <= limite) out.push({ key: `rep:${r.id}:prep`, texte: `${qui} : préparer la mise bas (${GESTATION[t.animalId].preparation.split(",")[0].toLowerCase()})`, quand: d.preparation });
      if (d.debut <= limite && d.fin >= auj) out.push({ key: `rep:${r.id}:mb`, texte: `${qui} : mise bas prévue vers le ${new Date(d.miseBas + "T12:00:00").toLocaleDateString("fr-FR")}`, quand: d.miseBas, urgent: d.miseBas <= auj });
    } else {
      const sev = new Date(r.miseBas + "T12:00:00"); sev.setDate(sev.getDate() + GESTATION[t.animalId].sevrageJours);
      const s = sev.toISOString().slice(0, 10);
      if (s >= auj && s <= limite) out.push({ key: `rep:${r.id}:sevrage`, texte: `${qui} : sevrage des petits (${GESTATION[t.animalId].sevrage})`, quand: s });
    }
  }
  return out;
}
