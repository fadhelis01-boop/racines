// Version des données, rappel de sauvegarde et place occupée (sans dépendance au routeur : testable)
import type { State } from "./store";

// Numéro de version du format des données. À augmenter quand une migration est ajoutée dans store.ts.
export const SCHEMA = 2;

// Nombre de saisies de l'utilisateur (tout ce qui serait perdu sans sauvegarde)
export function nombreSaisies(s: State): number {
  let n = 0;
  for (const v of Object.values(s)) {
    if (Array.isArray(v)) n += v.length;
  }
  return n + Object.keys(s.ponte ?? {}).length;
}

const JOUR = 86_400_000;
export const RAPPEL_JOURS = 30;

// Rappel mensuel : seulement si l'utilisateur a des saisies, et ni sauvegarde ni rappel écarté depuis 30 jours
export function rappelSauvegarde(s: State, now = new Date()): { jours: number | null; saisies: number } | null {
  const saisies = nombreSaisies(s);
  if (saisies < 5) return null;
  const d = s.settings.derniereSauvegarde ? new Date(s.settings.derniereSauvegarde) : null;
  const ecarte = s.settings.rappelSauvegardeEcarte ? new Date(s.settings.rappelSauvegardeEcarte) : null;
  const depuis = (x: Date | null) => (x ? (now.getTime() - x.getTime()) / JOUR : Infinity);
  if (depuis(d) < RAPPEL_JOURS || depuis(ecarte) < RAPPEL_JOURS) return null;
  return { jours: d ? Math.floor(depuis(d)) : null, saisies };
}

export function tailleLisible(o: number): string {
  if (o < 1024) return `${o} o`;
  if (o < 1024 ** 2) return `${Math.round(o / 1024)} Ko`;
  if (o < 1024 ** 3) return `${(o / 1024 ** 2).toFixed(1).replace(".", ",")} Mo`;
  return `${(o / 1024 ** 3).toFixed(1).replace(".", ",")} Go`;
}

export function ilYa(iso: string | undefined, now = new Date()): string {
  if (!iso) return "jamais";
  const j = Math.floor((now.getTime() - new Date(iso).getTime()) / JOUR);
  return j <= 0 ? "aujourd'hui" : j === 1 ? "hier" : `il y a ${j} jours`;
}
