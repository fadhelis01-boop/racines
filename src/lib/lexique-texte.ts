import { LEXIQUE } from "../data/lexique";

// Rend un texte en soulignant les termes du lexique : un toucher affiche la définition.
// Correspondance insensible aux accents et à la casse ; chaque terme n'est souligné qu'une fois par texte.
const SANS = (s: string) => [...s.toLowerCase()].map((c) => c.normalize("NFD")[0]).join("");
const IGNORE = new Set(["plant", "compost", "famille", "aromatique", "botte", "epi", "oeil", "jauge", "voile", "f1", "lux", "rameau", "planche", "bulbe", "greffe", "bouture", "annuelle", "bisannuelle", "paillage", "rotation", "purin", "humus", "compagnonnage", "hydroponie", "lasagne", "auxiliaire"]);

interface Motif { re: RegExp; id: string }
let MOTIFS: Motif[] | null = null;
function motifs(): Motif[] {
  if (MOTIFS) return MOTIFS;
  const out: { m: string; id: string }[] = [];
  for (const t of LEXIQUE) {
    if (IGNORE.has(t.id)) continue;
    const base = t.terme.split(/ \(| \/ |, /)[0];
    for (const m of [base, ...(t.alias ?? [])]) {
      const n = SANS(m).replace(/[«»"]/g, "").trim();
      if (n.length >= 4) out.push({ m: n, id: t.id });
    }
  }
  out.sort((a, b) => b.m.length - a.m.length); // les expressions longues d'abord
  MOTIFS = out.map(({ m, id }) => ({ id, re: new RegExp(`(^|[^a-z0-9])(${m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s'’-]+")})(s|x)?(?=$|[^a-z0-9])`, "g") }));
  return MOTIFS;
}

export function decouper(texte: string): { t: string; id?: string }[] {
  const plat = SANS(texte);
  const pris: [number, number, string][] = [];
  const vus = new Set<string>();
  for (const { re, id } of motifs()) {
    if (vus.has(id)) continue;
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(plat))) {
      const debut = m.index + m[1].length, fin = debut + m[2].length + (m[3]?.length ?? 0);
      if (pris.some(([a, b]) => debut < b && fin > a)) continue;
      pris.push([debut, fin, id]); vus.add(id);
      break;
    }
  }
  pris.sort((a, b) => a[0] - b[0]);
  const out: { t: string; id?: string }[] = [];
  let i = 0;
  for (const [a, b, id] of pris) { if (a > i) out.push({ t: texte.slice(i, a) }); out.push({ t: texte.slice(a, b), id }); i = b; }
  if (i < texte.length) out.push({ t: texte.slice(i) });
  return out;
}

