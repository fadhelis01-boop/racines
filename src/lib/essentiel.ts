// « L'essentiel en 3 points » d'une fiche : ce qu'un débutant doit retenir avant tout le reste.
import type { Plante } from "../data/types";
import type { ZoneId } from "../data/calendrier";
import { moisAffiches } from "./calendar";
import { MOIS_NOMS } from "../data/util";

// Première phrase d'un texte, sans parenthèse laissée ouverte, terminée par un point
const phrase = (t?: string) => {
  if (!t) return "";
  let x = t.split(/\.\s|\s;\s|;\s/)[0].trim();
  if ((x.match(/\(/g) ?? []).length > (x.match(/\)/g) ?? []).length) x = x.slice(0, x.lastIndexOf("(")).trim();
  x = x.replace(/[\s,;:]+$/, "");
  return x.endsWith(".") ? x : x + ".";
};
const mois = (p: Plante, a: Parameters<typeof moisAffiches>[1], z: ZoneId) => [...moisAffiches(p, a, z)].sort((x, y) => x - y).map((m) => MOIS_NOMS[m - 1].toLowerCase());
const de = (m: string) => (/^[aeiouy]/.test(m) ? `d'${m}` : `de ${m}`);
const plage = (l: string[]) => (l.length > 2 ? `${de(l[0])} à ${l[l.length - 1]}` : "en " + l.join(" et "));
const EXPO = { soleil: "en plein soleil (6 h et plus)", "mi-ombre": "à mi-ombre (3 à 6 h de soleil)", ombre: "à l'ombre" } as const;

export function essentiel(p: Plante, zone: ZoneId): string[] {
  const out: string[] = [];
  if (p.categorie === "interieur") {
    { const l = phrase(p.lumiere) || "Moyenne, sans soleil brûlant."; out.push(/^lumi[eè]re/i.test(l) ? l : `Lumière : ${l}`); }
    out.push(`Eau : ${phrase(p.arrosageDetail) || "Quand le dessus de la terre est sec."} Touchez toujours la terre avant d'arroser.`);
    out.push(p.sansDangerAnimaux ? "Sans danger pour les chats et les chiens." : `Attention : ${phrase(p.toxique) || "Toxique pour les animaux."}`);
    return out;
  }
  out.push(`Place : ${p.expo.map((e) => EXPO[e]).join(" ou ")}${p.contenant ? ` ; en pot : ${p.contenant[0].toLowerCase() + p.contenant.slice(1)}` : ""}.`);
  const semer = [...new Set([...mois(p, "semisAbri", zone), ...mois(p, "semisPlace", zone)])];
  const planter = mois(p, "plantation", zone);
  if (planter.length && p.difficulte >= 2) out.push(`Le plus simple : acheter un plant et le planter ${plage(planter)}.`);
  else if (semer.length) out.push(`Semer ${plage(semer)}${planter.length ? `, ou planter ${plage(planter)}` : ""}.`);
  else if (planter.length) out.push(`Planter ${plage(planter)}.`);
  const rec = mois(p, "recolte", zone);
  out.push(p.eau === "fort" ? `Arrosage régulier : la terre ne doit pas sécher${rec.length ? ` ; récolte ${plage(rec)}` : ""}.` : p.eau === "faible" ? `Peu d'eau : l'excès la fait pourrir${rec.length ? ` ; récolte ${plage(rec)}` : ""}.` : `Arroser quand la terre est sèche en surface${rec.length ? ` ; récolte ${plage(rec)}` : ""}.`);
  return out.slice(0, 3);
}
