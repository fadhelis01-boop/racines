// Délais d'attente après un traitement : les œufs, le lait ou la viande d'un animal traité ne se
// consomment pas avant la fin du délai indiqué sur la notice ou l'ordonnance.
// Rappels de soins par animal (vaccin d'un lapin, parage d'une chèvre…).
import type { Soin, Troupeau, Individu } from "./store";

export type Produit = "oeufs" | "lait" | "viande" | "miel";
export const PRODUITS: Record<Produit, string> = { oeufs: "œufs", lait: "lait", viande: "viande", miel: "miel" };
const JOUR = 86_400_000;
// Date locale (et non UTC : un soin noté juste après minuit compte pour le bon jour)
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const finAttente = (date: string, jours: number) => iso(new Date(new Date(date + "T12:00:00").getTime() + jours * JOUR));

export interface AttenteEnCours { soinId: string; troupeau: string; individu?: string; produit: Produit; jusquau: string; traitement: string }

// Délais encore en cours à la date donnée (le dernier jour d'attente compris)
export function attentesEnCours(soins: Soin[], troupeaux: Troupeau[], individus: Individu[] = [], now = new Date()): AttenteEnCours[] {
  const auj = iso(now);
  const out: AttenteEnCours[] = [];
  for (const s of soins) {
    if (!s.attente) continue;
    const t = troupeaux.find((x) => x.id === s.troupeauId);
    if (!t) continue;
    for (const [p, j] of Object.entries(s.attente) as [Produit, number | undefined][]) {
      if (!j || j <= 0) continue;
      const fin = finAttente(s.date, j);
      if (fin >= auj && s.date <= auj) out.push({ soinId: s.id, troupeau: t.nom, individu: individus.find((i) => i.id === s.individuId)?.nom, produit: p, jusquau: fin, traitement: s.note ? `${s.type} (${s.note})` : s.type });
    }
  }
  return out.sort((a, b) => b.jusquau.localeCompare(a.jusquau));
}

// Soins à refaire dont l'utilisateur a noté la date (« prochain »), pour un animal ou tout le groupe :
// on garde le plus récent de chaque (groupe, animal, type) et on le signale s'il tombe dans les 14 jours.
export function soinsAPrevoir(soins: Soin[], now = new Date(), jours = 14): Soin[] {
  const dernier = new Map<string, Soin>();
  for (const s of soins) {
    const k = `${s.troupeauId}|${s.individuId ?? ""}|${s.type}`;
    const d = dernier.get(k);
    if (!d || s.date > d.date) dernier.set(k, s);
  }
  const limite = iso(new Date(now.getTime() + jours * JOUR));
  return [...dernier.values()].filter((s) => s.prochain && s.prochain <= limite);
}

const fr = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
export const texteAttente = (a: AttenteEnCours) => `${a.individu ? a.individu + " (" + a.troupeau + ")" : a.troupeau} : ${PRODUITS[a.produit]} à ne pas consommer jusqu'au ${fr(a.jusquau)} inclus — ${a.traitement}`;
