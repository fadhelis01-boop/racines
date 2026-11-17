// Exports en tableur (CSV, séparateur « ; », compatible Excel et LibreOffice) et bilans pluriannuels.
import type { State } from "./store";
import { plante } from "../data/index";

const esc = (x: unknown) => `"${String(x ?? "").replace(/"/g, '""')}"`;
const csv = (entetes: string[], lignes: unknown[][]) => "﻿" + [entetes, ...lignes].map((l) => l.map(esc).join(";")).join("\r\n");
const nom = (id?: string) => (id ? plante(id)?.nom ?? id : "");

export const EXPORTS: Record<string, { label: string; fichier: string; faire: (s: State) => string; vide: (s: State) => boolean }> = {
  recoltes: { label: "Récoltes", fichier: "racines-recoltes.csv", vide: (s) => !s.recoltes.length,
    faire: (s) => csv(["Date", "Plante", "Variété", "Quantité", "Unité"], [...s.recoltes].sort((a, b) => a.date.localeCompare(b.date)).map((r) => [r.date, nom(r.planteId), r.variete, String(r.qte).replace(".", ","), r.unite])) },
  cultures: { label: "Semis et plantations", fichier: "racines-cultures.csv", vide: (s) => !s.cultures.length,
    faire: (s) => csv(["Date", "Plante", "Variété", "Mode", "Emplacement", "Terminée le", "Note"], [...s.cultures].sort((a, b) => a.date.localeCompare(b.date)).map((c) => [c.date, nom(c.planteId), c.variete, c.mode, s.espaces.find((e) => e.id === c.espaceId)?.nom, c.fini, c.note])) },
  graines: { label: "Graines", fichier: "racines-graines.csv", vide: (s) => !s.graines.length,
    faire: (s) => csv(["Plante", "Variété", "Année", "Quantité"], s.graines.map((g) => [nom(g.planteId), g.variete, g.annee, g.qte])) },
  journal: { label: "Journal", fichier: "racines-journal.csv", vide: (s) => !s.notes.length,
    faire: (s) => csv(["Date", "Plante", "Note"], [...s.notes].sort((a, b) => a.date.localeCompare(b.date)).map((n) => [n.date, nom(n.planteId), n.texte])) },
  plantes: { label: "Mes plantes", fichier: "racines-mes-plantes.csv", vide: (s) => !s.plantes.length,
    faire: (s) => csv(["Surnom", "Espèce", "Pièce", "Depuis", "Arrosages notés", "Dernier arrosage", "Dernier rempotage"], s.plantes.map((p) => [p.surnom, nom(p.planteId), p.piece, p.depuis, p.arrosages.length, p.arrosages[p.arrosages.length - 1], p.rempotages[p.rempotages.length - 1]])) },
  cahier: { label: "Cahier de culture", fichier: "racines-cahier-de-culture.csv", vide: (s) => !s.cultures.length && !s.interventions.length,
    faire: (s) => csv(["Date", "Planche", "Opération", "Plante / produit", "Variété / quantité", "Note"], [
      ...s.cultures.map((c) => [c.date, s.espaces.find((e) => e.id === c.espaceId)?.nom ?? "", c.mode === "semis" ? "Semis" : "Plantation", nom(c.planteId), c.variete, c.note]),
      ...s.cultures.filter((c) => c.fini).map((c) => [c.fini, s.espaces.find((e) => e.id === c.espaceId)?.nom ?? "", "Fin de culture", nom(c.planteId), c.variete, ""]),
      ...s.interventions.map((i) => [i.date, s.espaces.find((e) => e.id === i.espaceId)?.nom ?? "", i.type, i.produit, i.quantite, i.note]),
    ].sort((a, b) => String(a[0]).localeCompare(String(b[0])))) },
  multiplications: { label: "Boutures et semis", fichier: "racines-boutures-semis.csv", vide: (s) => !s.multiplications.length,
    faire: (s) => csv(["Date", "Type", "Plante", "Variété", "Nombre", "Réussis", "Taux", "Origine", "Note"], s.multiplications.map((m) => [m.date, m.type, nom(m.planteId), m.variete, m.nombre, m.reussis, m.reussis !== undefined ? `${Math.round((m.reussis / Math.max(1, m.nombre)) * 100)} %` : "", m.origine, m.note])) },
};

const kg = (r: { qte: number; unite: string }) => (r.unite === "kg" ? r.qte : r.unite === "g" ? r.qte / 1000 : 0);

// Récoltes par année (kg) et par variété, toutes années confondues
export function bilanPluriannuel(s: State) {
  const annees = [...new Set(s.recoltes.map((r) => r.date.slice(0, 4)))].sort();
  const parAnnee = annees.map((a) => ({ annee: a, kg: s.recoltes.filter((r) => r.date.startsWith(a)).reduce((t, r) => t + kg(r), 0), nb: s.recoltes.filter((r) => r.date.startsWith(a)).length }));
  const cle = (r: { planteId: string; variete?: string }) => `${r.planteId}|${r.variete ?? ""}`;
  const groupes = new Map<string, { planteId: string; variete?: string; parAnnee: Record<string, number>; premiere: string; derniere: string }>();
  for (const r of s.recoltes) {
    const k = cle(r);
    const g = groupes.get(k) ?? { planteId: r.planteId, variete: r.variete, parAnnee: {}, premiere: r.date.slice(5), derniere: r.date.slice(5) };
    const a = r.date.slice(0, 4);
    g.parAnnee[a] = (g.parAnnee[a] ?? 0) + kg(r);
    if (r.date.slice(5) < g.premiere) g.premiere = r.date.slice(5);
    if (r.date.slice(5) > g.derniere) g.derniere = r.date.slice(5);
    groupes.set(k, g);
  }
  return { annees, parAnnee, varietes: [...groupes.values()].sort((a, b) => nom(a.planteId).localeCompare(nom(b.planteId), "fr") || (a.variete ?? "").localeCompare(b.variete ?? "")) };
}

// Variétés connues pour une plante (graines + cultures + récoltes), pour proposer la saisie
export const varietesDe = (s: State, planteId: string) => [...new Set([...s.graines.filter((g) => g.planteId === planteId).map((g) => g.variete), ...s.cultures.filter((c) => c.planteId === planteId).map((c) => c.variete), ...s.recoltes.filter((r) => r.planteId === planteId).map((r) => r.variete)].filter((x): x is string => !!x))];
