import { PLANTES, CALENDRIER, ZONES, ANIMAUX, plante } from "../data/index";
import type { Mois, Plante } from "../data/types";
import type { ZoneId } from "../data/calendrier";
import type { Culture, State } from "./store";
import { isoDate } from "./store";
import { MOIS_NOMS } from "../data/util";
import { tachesCouvees } from "./elevage";
import { alertesStocks, finDeGarde } from "./conserverie";

// ---------- Décalage climatique ----------
// Chaque mois de référence est une fenêtre de dates ; on la décale de N semaines
// selon la zone et on garde les mois d'affichage recouverts d'au moins 10 jours.
const DEBUT = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

export function decalage(zone: ZoneId) {
  return ZONES.find((z) => z.id === zone)?.decalage ?? 0;
}

export function shiftMonths(months: Mois[] | undefined, weeks: number): Set<number> {
  const out = new Set<number>();
  if (!months?.length) return out;
  if (!weeks) return new Set(months);
  const days = weeks * 7;
  for (const m of months) {
    const a = DEBUT[m - 1] + days, b = DEBUT[m] + days;
    for (let x = 1; x <= 12; x++) {
      // recouvrement circulaire sur l'année
      let ov = 0;
      for (const off of [-365, 0, 365]) {
        const s = Math.max(a, DEBUT[x - 1] + off), e = Math.min(b, DEBUT[x] + off);
        if (e > s) ov += e - s;
      }
      if (ov >= 10) out.add(x);
    }
  }
  return out;
}

export type Action = "semisAbri" | "repiquage" | "semisPlace" | "plantation" | "recolte" | "taille" | "floraison";
export const ACTIONS: Record<Action, { label: string; emoji: string; verbe: string }> = {
  semisAbri: { label: "Semer à l'abri", emoji: "🏠", verbe: "Semer au chaud / sous abri (en caissette ou en godet)" },
  repiquage: { label: "Repiquer en godets", emoji: "🤲", verbe: "Repiquer les jeunes plants en godets (à l'abri)" },
  semisPlace: { label: "Semer en place", emoji: "🌱", verbe: "Semer en pleine terre" },
  plantation: { label: "Planter en place", emoji: "🌿", verbe: "Planter en place (mise en terre définitive)" },
  recolte: { label: "Récolter", emoji: "🧺", verbe: "Récolter" },
  taille: { label: "Tailler", emoji: "✂️", verbe: "Tailler" },
  floraison: { label: "En fleur", emoji: "🌸", verbe: "En fleur" },
};

// Mois d'une action, avec les semis d'automne réservés aux climats doux
const DOUX = new Set<ZoneId>(["mediterraneen", "oceanique"]);
// Plantes semées directement en godet individuel (grosses graines, racines fragiles) : pas de repiquage
const SANS_REPIQUAGE = new Set(["courge", "courgette", "concombre", "melon", "pasteque", "mais", "haricot", "pois", "feve", "tournesol", "capucine", "pois-senteur", "betterave", "blette"]);
export function aRepiquer(p: Plante) {
  return !!p.semisAbri?.length && !!p.plantation?.length && !SANS_REPIQUAGE.has(p.id) && p.categorie !== "arbre" && p.categorie !== "interieur";
}
export function moisDe(p: Plante, a: Action, zone: ZoneId): Mois[] | undefined {
  // Repiquage en godets : 2 à 4 semaines après le semis en caissette
  if (a === "repiquage") return aRepiquer(p) ? ([...new Set(p.semisAbri!.map((m) => (m % 12) + 1))] as Mois[]) : undefined;
  if (a === "semisPlace" && p.semisPlaceDoux && DOUX.has(zone)) return [...(p.semisPlace ?? []), ...p.semisPlaceDoux];
  return p[a as Exclude<Action, "repiquage">];
}

export function plantesDuMois(mois: number, zone: ZoneId, filtre?: (p: Plante) => boolean) {
  const w = decalage(zone);
  const res: Record<Action, Plante[]> = { semisAbri: [], repiquage: [], semisPlace: [], plantation: [], recolte: [], taille: [], floraison: [] };
  for (const p of PLANTES) {
    if (filtre && !filtre(p)) continue;
    for (const a of Object.keys(res) as Action[]) {
      if (a === "recolte" && p.floraison && (p.categorie === "fleur" || p.categorie === "ornement" || p.categorie === "interieur") && !p.comestible) continue;
      if (shiftMonths(moisDe(p, a, zone), w).has(mois)) res[a].push(p);
    }
  }
  return res;
}

export function moisAffiches(p: Plante, a: Action, zone: ZoneId) {
  return shiftMonths(moisDe(p, a, zone), decalage(zone));
}

export const travauxDuMois = (mois: number) => CALENDRIER[mois - 1];

// ---------- Suivi des cultures de l'utilisateur ----------
export function recolteEstimee(c: Culture): Date | null {
  const p = plante(c.planteId);
  if (!p?.joursRecolte) return null;
  const d = new Date(c.date + "T12:00:00");
  // Une plantation a déjà quelques semaines d'avance sur un semis pour les légumes semés à l'abri
  const jours = p.joursRecolte + (c.mode === "semis" && p.semisAbri && !p.semisPlace ? 50 : 0);
  d.setDate(d.getDate() + jours);
  return d;
}

export interface TachePerso { key: string; texte: string; emoji: string; href: string; quand: string; urgent?: boolean }

// Tâches personnelles pour les 14 prochains jours
export function tachesPerso(s: State, now = new Date()): TachePerso[] {
  const out: TachePerso[] = [];
  const in14 = new Date(now); in14.setDate(in14.getDate() + 14);
  for (const c of s.cultures) {
    if (c.fini) continue;
    const p = plante(c.planteId);
    if (!p) continue;
    const r = recolteEstimee(c);
    if (r && r <= in14) {
      out.push({ key: `rec:${c.id}`, texte: `${p.nom} : récolte ${r < now ? "possible dès maintenant" : "prévue vers le " + r.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`, emoji: "🧺", href: `/plante/${p.id}`, quand: isoDate(r) });
    }
    const age = (now.getTime() - new Date(c.date).getTime()) / 864e5;
    if (c.mode === "semis" && age > 14 && age < 35 && (p.semisPlace?.length || p.semisAbri?.length) && p.categorie !== "interieur") {
      out.push({ key: `ecl:${c.id}`, texte: `${p.nom} : éclaircir ou repiquer les semis du ${new Date(c.date).toLocaleDateString("fr-FR")}`, emoji: "✂️", href: `/plante/${p.id}`, quand: isoDate(now) });
    }
  }
  for (const t of s.troupeaux) {
    const a = ANIMAUX.find((x) => x.id === t.animalId);
    if (!a) continue;
    for (const soin of a.soins) {
      if (soin.mois && !soin.mois.includes(now.getMonth() + 1)) continue;
      const last = dernierSoin(s, t.id, a.id, soin.type);
      const prochain = last ? new Date(last.prochain ?? addDays(last.date, soin.tousLesJours)) : null;
      if (!prochain) {
        out.push({ key: `soin:${t.id}:${soin.type}`, texte: `${t.nom} : ${soin.type} — pas encore noté, à planifier`, emoji: a.emoji, href: `/jardin/animaux`, quand: isoDate(now) });
      } else if (prochain <= in14) {
        out.push({ key: `soin:${t.id}:${soin.type}:${isoDate(prochain)}`, texte: `${t.nom} : ${soin.type} ${prochain < now ? "en retard (prévu le " : "prévu le "}${prochain.toLocaleDateString("fr-FR")}${prochain < now ? ")" : ""}`, emoji: a.emoji, href: `/jardin/animaux`, quand: isoDate(prochain), urgent: prochain < now });
      }
    }
  }
  for (const c of tachesCouvees(s.couvees ?? [], now)) out.push({ ...c, emoji: "🐣", href: "/jardin/animaux" });
  {
    const al = alertesStocks(s.stocks ?? [], isoDate(now));
    for (const x of al.depasses) out.push({ key: `stock:${x.id}:depasse`, texte: `Garde-manger : ${x.produit} (${x.quantite} ${x.unite}) à consommer en priorité, garde conseillée dépassée`, emoji: "🥫", href: "/conserver?t=stock", quand: isoDate(now), urgent: true });
    for (const x of al.bientot) out.push({ key: `stock:${x.id}:bientot`, texte: `Garde-manger : ${x.produit} à consommer avant le ${new Date(finDeGarde(x) + "T12:00:00").toLocaleDateString("fr-FR")}`, emoji: "🥫", href: "/conserver?t=stock", quand: finDeGarde(x) });
    if (al.cave && now.getMonth() >= 9 || al.cave && now.getMonth() <= 3) {
      const lundi = new Date(now); lundi.setDate(lundi.getDate() + ((8 - lundi.getDay()) % 7));
      out.push({ key: `cave:${isoDate(lundi)}`, texte: "Tournée de la cave : retirer ce qui pourrit ou germe, vérifier température et humidité", emoji: "🏚️", href: "/guide/cs-cave", quand: isoDate(lundi) });
    }
  }
  return out.sort((a, b) => a.quand.localeCompare(b.quand));
}

/** Dernier soin noté ; pour les abeilles, les visites et traitements du carnet du rucher comptent aussi. */
export function dernierSoin(s: Pick<State, "soins"> & Partial<Pick<State, "visites" | "traitementsApi">>, troupeauId: string, animalId: string, type: string): { date: string; prochain?: string } | undefined {
  const dates: { date: string; prochain?: string }[] = s.soins.filter((x) => x.troupeauId === troupeauId && x.type === type);
  if (animalId === "abeille") {
    const m = (d: string) => Number(d.slice(5, 7));
    if (type === "Comptage varroa") dates.push(...(s.visites ?? []).filter((v) => v.varroaMethode && v.varroaValeur != null).map((v) => ({ date: v.date })));
    if (type.startsWith("Traitement varroa d'été")) dates.push(...(s.traitementsApi ?? []).filter((x) => m(x.debut) >= 6 && m(x.debut) <= 10).map((x) => ({ date: x.debut })));
    if (type.startsWith("Traitement varroa d'hiver")) dates.push(...(s.traitementsApi ?? []).filter((x) => m(x.debut) >= 11 || m(x.debut) <= 2).map((x) => ({ date: x.debut })));
  }
  return dates.sort((x, y) => y.date.localeCompare(x.date))[0];
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

// ---------- Export calendrier (.ics) ----------
// Compatible Google Agenda, Apple Calendrier, Outlook : les rappels arrivent
// ainsi sur le téléphone même quand l'application est fermée.
function icsEsc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function icsDate(d: Date) {
  return isoDate(d).replace(/-/g, "");
}

export function buildIcs(s: State, opts: { mois: number; travaux: boolean; mesPlantes: boolean }): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Racines//Jardin//FR", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Racines — jardin"];
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const ev = (uid: string, d: Date, titre: string, desc: string, alarme = true) => {
    const end = new Date(d); end.setDate(end.getDate() + 1);
    lines.push("BEGIN:VEVENT", `UID:${uid}@racines`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDate(d)}`, `DTEND;VALUE=DATE:${icsDate(end)}`, `SUMMARY:${icsEsc(titre)}`, `DESCRIPTION:${icsEsc(desc)}`);
    if (alarme) lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(titre)}`, "TRIGGER:PT9H", "END:VALARM");
    lines.push("END:VEVENT");
  };
  const now = new Date();
  const zone = s.settings.zone;
  const mine = new Set(s.cultures.map((c) => c.planteId));
  for (let i = 0; i < opts.mois; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1, 12);
    const m = d.getMonth() + 1;
    if (opts.travaux) {
      const t = travauxDuMois(m);
      const corps = [...t.potager, ...t.verger, ...(s.troupeaux.length ? t.animaux : [])].map((x) => "• " + x).join("\n");
      ev(`travaux-${d.getFullYear()}-${m}`, d, `🌱 Jardin : les travaux de ${MOIS_NOMS[m - 1]}`, corps);
    }
    if (opts.mesPlantes && mine.size) {
      const pm = plantesDuMois(m, zone, (p) => mine.has(p.id));
      const parts: string[] = [];
      for (const a of Object.keys(pm) as Action[]) if (pm[a].length) parts.push(`${ACTIONS[a].verbe} : ${pm[a].map((p) => p.nom).join(", ")}`);
      if (parts.length) {
        const d2 = new Date(d); d2.setDate(5);
        ev(`mesplantes-${d.getFullYear()}-${m}`, d2, `🥕 Mes cultures en ${MOIS_NOMS[m - 1]}`, parts.join("\n"));
      }
    }
  }
  for (const c of s.cultures) {
    const r = recolteEstimee(c);
    const p = plante(c.planteId);
    if (r && p && r > now && !c.fini) ev(`rec-${c.id}`, r, `🧺 Récolte de ${p.nom} (estimation)`, `Semé/planté le ${new Date(c.date).toLocaleDateString("fr-FR")}. ${p.recolteConseil ?? ""}`);
  }
  for (const t of s.troupeaux) {
    const a = ANIMAUX.find((x) => x.id === t.animalId);
    for (const soin of a?.soins ?? []) {
      const last = dernierSoin(s, t.id, a!.id, soin.type);
      if (!last) continue;
      const d = new Date((last.prochain ?? addDays(last.date, soin.tousLesJours)) + "T12:00:00");
      if (d > now) ev(`soin-${t.id}-${soin.type}-${isoDate(d)}`, d, `${a!.emoji} ${t.nom} : ${soin.type}`, "Rappel Racines");
    }
  }
  if (s.plantes.length) {
    // Un rappel hebdomadaire « tour des plantes », le samedi matin
    const d = new Date(now); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    lines.push("BEGIN:VEVENT", `UID:tour-plantes@racines`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDate(d)}`, "RRULE:FREQ=WEEKLY", `SUMMARY:${icsEsc("🌿 Tour des plantes : vérifier la terre, arroser si sec")}`, `DESCRIPTION:${icsEsc(s.plantes.map((p) => p.surnom).join(", "))}`, "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Tour des plantes", "TRIGGER:PT10H", "END:VALARM", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
