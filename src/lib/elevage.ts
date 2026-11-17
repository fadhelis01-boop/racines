// Calculs d'élevage : couvaison, bilan de production et de dépenses, registre exportable.
import type { State, Couvee, TypeProduction } from "./store";
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
  return { parType, depenses: total, parCat, coutOeuf: parType.oeufs ? total / parType.oeufs : undefined, coutLitre: parType.lait ? total / parType.lait : undefined };
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
