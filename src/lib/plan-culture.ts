// Planification maraîchère : plants par planche, production échelonnée, successions, nurserie, temps de travail.
import { MARAICH, TEMPS_METHODE } from "../data/maraichage";
import { PLANTES, plante } from "../data/index";
import { moisAffiches, decalage } from "./calendar";
import { verifierRotation } from "./garden";
import type { ZoneId } from "../data/calendrier";
import type { Culture, Espace } from "./store";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const ajoute = (d: Date, jours: number) => { const x = new Date(d); x.setDate(x.getDate() + jours); return x; };

// Nombre de plants sur une planche (longueur × largeur en m)
export function plantsParPlanche(planteId: string, longueur: number, largeur: number) {
  const m = MARAICH[planteId];
  if (!m) return null;
  const rangs = Math.max(1, Math.floor((largeur * 100) / m.interRang));
  const parRang = Math.max(1, Math.floor((longueur * 100) / m.rang));
  return { rangs, parRang, plants: rangs * parRang, rendement: Math.round(m.rdt * longueur * largeur * 10) / 10, unite: m.unite };
}

export interface Serie { semis: string; recolteDebut: string; recolteFin: string; plants: number; graines: number; surface: number; motte: boolean }

// Séries de semis pour obtenir une quantité régulière par semaine sur une période
export function planifier(planteId: string, parSemaine: number, zone: ZoneId, an = new Date().getFullYear()): { series: Serie[]; intervalle: number; avertissement?: string } {
  const p = plante(planteId);
  const m = MARAICH[planteId];
  if (!p || !m) return { series: [], intervalle: 0, avertissement: "Pas de données de planification pour cette plante." };
  const moisSemis = [...new Set([...moisAffiches(p, "semisAbri", zone), ...moisAffiches(p, "semisPlace", zone)])].sort((a, b) => a - b);
  const moisRecolte = moisAffiches(p, "recolte", zone);
  if (!moisSemis.length) return { series: [], intervalle: 0, avertissement: "Cette plante se multiplie par plants, bulbes ou tubercules : une seule plantation par saison (voir la fiche)." };
  const intervalle = Math.max(1, Math.min(m.fenetre, 26));
  const premiereRecolte = Math.min(...moisRecolte);
  // Rendement d'un plant : kg (ou pièces) par plant
  const surfacePlant = (m.rang * m.interRang) / 10000;
  const parPlant = m.unite === "pièces" ? 1 : m.rdt * surfacePlant;
  const besoinSerie = parSemaine * intervalle;
  const series: Serie[] = [];
  const depart = new Date(an, moisSemis[0] - 1, 1, 12);
  for (let semaine = 0; semaine < 53; semaine += intervalle) {
    const date = ajoute(depart, semaine * 7);
    if (!moisSemis.includes(date.getMonth() + 1)) continue;
    let debut = ajoute(date, p.joursRecolte ?? 60);
    // Récolte prête avant la saison : elle commence au premier mois de récolte
    if (m.fenetre >= 8 && debut.getFullYear() === an && debut.getMonth() + 1 < premiereRecolte && !moisRecolte.has(debut.getMonth() + 1)) debut = new Date(an, premiereRecolte - 1, 1, 12);
    if (debut.getFullYear() > an + 1 || !moisRecolte.has(debut.getMonth() + 1)) continue;
    const plants = Math.ceil(besoinSerie / Math.max(0.0001, parPlant));
    const graines = m.germ ? Math.ceil(plants / m.germ * 1.2) : 0;
    series.push({ semis: iso(date), recolteDebut: iso(debut), recolteFin: iso(ajoute(debut, intervalle * 7)), plants, graines, surface: Math.round(plants * surfacePlant * 10) / 10, motte: m.motte > 0 });
  }
  return { series, intervalle, avertissement: series.length ? undefined : "Aucune série possible dans votre climat avec ces dates." };
}

// Fin d'occupation estimée d'une culture (fin de récolte)
export function finCulture(c: Culture) {
  if (c.fini) return new Date(c.fini + "T12:00:00");
  const p = plante(c.planteId);
  const m = MARAICH[c.planteId];
  return ajoute(new Date(c.date + "T12:00:00"), (p?.joursRecolte ?? 90) + (m?.fenetre ?? 4) * 7);
}

// Cultures qui peuvent suivre sur une planche libérée à une date donnée
export function successions(espaceId: string, libre: Date, cultures: Culture[], zone: ZoneId, max = 10) {
  const mois = libre.getMonth() + 1;
  const suivants = [mois, (mois % 12) + 1];
  const finSaison = new Date(libre.getFullYear(), 10, 15); // gelées vers mi-novembre en climat tempéré, décalées selon la zone
  const marge = decalage(zone) * 7;
  const legumes = PLANTES.filter((p) => p.categorie === "legume" && MARAICH[p.id]);
  const ok = legumes.filter((p) => {
    const quand = [...moisAffiches(p, "plantation", zone), ...moisAffiches(p, "semisPlace", zone)];
    if (!suivants.some((m) => quand.includes(m))) return false;
    const recolte = ajoute(libre, p.joursRecolte ?? 90);
    const hiver = [...moisAffiches(p, "recolte", zone)].some((m) => m >= 11 || m <= 3);
    if (!hiver && recolte > ajoute(finSaison, marge)) return false;
    return verifierRotation(espaceId, p.id, libre.getFullYear(), cultures).every((a) => a.niveau !== "eviter");
  });
  return ok.sort((a, b) => (a.joursRecolte ?? 90) - (b.joursRecolte ?? 90)).slice(0, max);
}

// Engrais vert conseillé selon le mois où la planche se libère
export function engraisVertPour(mois: number) {
  if (mois >= 3 && mois <= 6) return { id: "phacelie", texte: "Phacélie ou sarrasin (6 à 8 semaines, interculture courte d'été)" };
  if (mois >= 7 && mois <= 8) return { id: "phacelie", texte: "Phacélie, moutarde ou trèfle incarnat (avant l'hiver)" };
  if (mois >= 9 && mois <= 10) return { id: "moutarde", texte: "Seigle et vesce, féverole ou moutarde (couvert d'hiver)" };
  return { id: "trefle", texte: "Laisser un paillage épais jusqu'au printemps" };
}

// Calendrier de la nurserie : semaine de semis en motte pour planter au début de la période de plantation
export function nurserie(zone: ZoneId) {
  const an = new Date().getFullYear();
  return PLANTES.filter((p) => MARAICH[p.id]?.motte).map((p) => {
    const pl = [...moisAffiches(p, "plantation", zone)].sort((a, b) => a - b)[0];
    if (!pl) return null;
    const plantation = new Date(an, pl - 1, 1, 12);
    const semis = ajoute(plantation, -MARAICH[p.id].motte * 7);
    return { plante: p, semis: iso(semis), plantation: iso(plantation), semaines: MARAICH[p.id].motte };
  }).filter((x): x is NonNullable<typeof x> => !!x).sort((a, b) => a.semis.localeCompare(b.semis));
}

// Temps de travail hebdomadaire moyen en saison
export function tempsDeTravail(surface: number, methode: keyof typeof TEMPS_METHODE) {
  const h = surface * TEMPS_METHODE[methode].h;
  return { moyenne: Math.round(h * 10) / 10, pointe: Math.round(h * 1.6 * 10) / 10 };
}

// Occupation des planches : périodes de chaque culture
export function occupation(espaces: Espace[], cultures: Culture[], an: number) {
  return espaces.map((e) => ({
    espace: e,
    periodes: cultures.filter((c) => c.espaceId === e.id).map((c) => ({ c, debut: new Date(c.date + "T12:00:00"), fin: finCulture(c) }))
      .filter((x) => x.debut.getFullYear() <= an && x.fin.getFullYear() >= an),
  }));
}
