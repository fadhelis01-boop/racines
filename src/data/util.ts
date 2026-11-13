import type { Mois } from "./types";

// m("3-5,9") → [3, 4, 5, 9] ; m("11-2") → [11, 12, 1, 2]
export function m(spec: string): Mois[] {
  const out: number[] = [];
  for (const part of spec.split(",").map((s) => s.trim()).filter(Boolean)) {
    const [a, b] = part.split("-").map(Number);
    if (b === undefined) out.push(a);
    else if (a <= b) for (let i = a; i <= b; i++) out.push(i);
    else {
      for (let i = a; i <= 12; i++) out.push(i);
      for (let i = 1; i <= b; i++) out.push(i);
    }
  }
  return out as Mois[];
}

export const MOIS_NOMS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Recherche vidéo : liens de recherche plutôt que des vidéos figées,
// ils ne cassent jamais et proposent toujours les contenus les plus récents.
export const youtube = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
export const tiktok = (q: string) => `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`;
