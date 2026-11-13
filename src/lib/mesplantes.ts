import { plante } from "../data/index";
import type { Plante } from "../data/types";
import { isoDate, type Fenetre, type MaPlante } from "./store";

// Rythme de soins d'une plante de la maison, ajusté à la saison et à sa fenêtre.
// Ce sont des rappels « à vérifier » : on arrose seulement si la terre est sèche.

export const FENETRES: Record<Fenetre, { label: string; facteur: number }> = {
  sud: { label: "Fenêtre plein sud", facteur: 0.8 },
  ouest: { label: "Fenêtre ouest", facteur: 0.9 },
  est: { label: "Fenêtre est", facteur: 1 },
  nord: { label: "Fenêtre nord", facteur: 1.25 },
  lampe: { label: "Sous une lampe", facteur: 0.85 },
  sombre: { label: "Loin des fenêtres", facteur: 1.4 },
};

const DEFAUT = { arrosageEte: 7, arrosageHiver: 14, engrais: 30, rempotageAns: 2 };
export const estEte = (d: Date) => d.getMonth() + 1 >= 4 && d.getMonth() + 1 <= 9;

export function soinsDe(p?: Plante) {
  return { ...DEFAUT, ...(p?.soins ?? {}) };
}

export function intervalleArrosage(mp: MaPlante, d = new Date()) {
  if (mp.frequence) return mp.frequence;
  const s = soinsDe(plante(mp.planteId));
  const base = estEte(d) ? s.arrosageEte : s.arrosageHiver;
  return Math.max(1, Math.round(base * (mp.fenetre ? FENETRES[mp.fenetre].facteur : 1)));
}

const jours = (a: Date, b: Date) => Math.floor((b.getTime() - a.getTime()) / 864e5);
const last = (l: string[]) => [...l].sort().at(-1);
const d12 = (iso: string) => new Date(iso + "T12:00:00");

export interface Echeance { type: "arrosage" | "engrais" | "rempotage"; dans: number; texte: string }

export function echeances(mp: MaPlante, now = new Date()): Echeance[] {
  const p = plante(mp.planteId);
  const s = soinsDe(p);
  const out: Echeance[] = [];
  const la = last(mp.arrosages) ?? mp.depuis;
  const iv = intervalleArrosage(mp, now);
  const dansA = la ? iv - jours(d12(la), now) : 0;
  out.push({ type: "arrosage", dans: dansA, texte: dansA <= 0 ? "Vérifier la terre et arroser si elle est sèche" : `Arrosage dans ${dansA} j environ` });
  // Engrais seulement de mars à septembre, et jamais pour les plantes qui n'en veulent pas
  const mois = now.getMonth() + 1;
  if (s.engrais && p?.soins?.engrais !== undefined && mois >= 3 && mois <= 9) {
    const le = last(mp.engrais);
    const dansE = le ? s.engrais - jours(d12(le), now) : 0;
    out.push({ type: "engrais", dans: dansE, texte: dansE <= 0 ? "Engrais dilué avec le prochain arrosage" : `Engrais dans ${dansE} j` });
  }
  // Rempotage : au printemps, quand le délai conseillé est dépassé
  if (s.rempotageAns && mois >= 3 && mois <= 5) {
    const lr = last(mp.rempotages) ?? mp.depuis;
    if (lr && jours(d12(lr), now) >= s.rempotageAns * 365 - 30) out.push({ type: "rempotage", dans: 0, texte: "Printemps : vérifier si un rempotage est nécessaire (racines qui sortent du pot)" });
  }
  return out;
}

export function aFaire(plantes: MaPlante[], now = new Date()) {
  return plantes.flatMap((mp) => echeances(mp, now).filter((e) => e.dans <= 0).map((e) => ({ mp, e })));
}

export function marquer(mp: MaPlante, type: "arrosage" | "engrais" | "rempotage", d = new Date()): MaPlante {
  const iso = isoDate(d);
  const key = type === "arrosage" ? "arrosages" : type === "engrais" ? "engrais" : "rempotages";
  if (mp[key].includes(iso)) return mp;
  // L'engrais se donne avec l'eau : il compte aussi comme arrosage
  const arrosages = type === "engrais" && !mp.arrosages.includes(iso) ? [...mp.arrosages, iso] : mp.arrosages;
  return { ...mp, arrosages, [key]: [...(key === "arrosages" ? arrosages : mp[key]), iso].slice(-60) };
}
