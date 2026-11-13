import { PLANTES, PROBLEMES, REMEDES, GUIDES, ANIMAUX, SIGNES } from "../data/index";
import { norm } from "./garden";

// Moteur de recherche : noms courants et synonymes, texte complet des fiches,
// symptômes (« feuilles jaunes » → diagnostic), et tolérance aux fautes de frappe.

export interface Hit { href: string; emoji: string; titre: string; type: string; score: number; extrait?: string }
interface Doc { href: string; emoji: string; titre: string; type: string; noms: string; texte: string }

let DOCS: Doc[] | null = null;
function docs(): Doc[] {
  if (DOCS) return DOCS;
  DOCS = [
    ...PLANTES.map((p) => ({ href: `/plante/${p.id}`, emoji: p.emoji, titre: p.nom, type: "Plante", noms: norm([p.nom, p.latin, ...(p.alias ?? []), ...(p.latins ?? [])].join(" | ")), texte: norm([p.intro, ...p.etapes, ...p.entretien, p.conservation ?? "", p.lumiere ?? "", p.arrosageDetail ?? ""].join(" ")) })),
    ...ANIMAUX.map((a) => ({ href: `/animal/${a.id}`, emoji: a.emoji, titre: a.nom, type: "Animal", noms: norm(a.nom), texte: norm([a.resume, ...a.quotidien, ...a.alimentation, ...a.interdits].join(" ")) })),
    ...PROBLEMES.map((p) => ({ href: `/probleme/${p.id}`, emoji: "🩺", titre: p.nom, type: "Santé", noms: norm([p.nom, ...(p.alias ?? []), ...p.signes.map((s) => SIGNES[s].label)].join(" | ")), texte: norm([p.cible, ...p.symptomes, p.conditions].join(" ")) })),
    ...REMEDES.map((r) => ({ href: `/remede/${r.id}`, emoji: r.emoji, titre: r.nom, type: "Remède", noms: norm(r.nom), texte: norm([r.role, ...r.usage].join(" ")) })),
    ...GUIDES.map((g) => ({ href: `/guide/${g.id}`, emoji: g.emoji, titre: g.titre, type: "Tutoriel", noms: norm(g.titre + " | " + g.resume), texte: norm(g.etapes.map((e) => e.titre + " " + e.texte).join(" ")) })),
  ];
  return DOCS;
}

function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    let best = d[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
      best = Math.min(best, d[j]);
    }
    if (best > max) return max + 1;
  }
  return d[b.length];
}

const STOP = new Set(["de", "la", "le", "les", "des", "du", "un", "une", "a", "au", "aux", "et", "en", "ma", "mon", "mes", "qui", "pour", "sur", "est", "ont", "pas", "plante", "plantes"]);
const radical = (t: string) => { const r = t.replace(/(ements|ement|ations|ation|ages|age|eurs|eur|ees|ee|ers|er|es|s|x)$/, ""); return r.length >= 4 ? r : t; };

export function rechercher(q: string, limit = 60): Hit[] {
  const nq = norm(q.trim()).replace(/['’-]/g, " ");
  if (nq.length < 2) return [];
  const toks = nq.split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));
  const hits: Hit[] = [];
  for (const d of docs()) {
    let score = 0;
    if (norm(d.titre) === nq) score += 100;
    if (d.noms.includes(nq)) score += 60;
    else if (d.texte.includes(nq)) score += 20;
    if (toks.length) {
      let all = true;
      for (const t of toks) {
        const r = radical(t);
        if (d.noms.includes(r)) score += 12;
        else if (d.texte.includes(r)) score += 4;
        else if (t.length >= 5 && d.noms.split(/[^a-z0-9]+/).some((w) => w.length >= 4 && lev(w, t, t.length >= 8 ? 2 : 1) <= (t.length >= 8 ? 2 : 1))) score += 8;
        else all = false;
      }
      if (!all) score = Math.min(score, toks.length > 1 ? score * 0.4 : 0);
    }
    if (score > 0) hits.push({ href: d.href, emoji: d.emoji, titre: d.titre, type: d.type, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

// La requête ressemble-t-elle à un symptôme ? → proposer le diagnostic
export function ressembleSymptome(q: string) {
  const nq = norm(q);
  return /jaun|tache|brun|noir|blanc|mou|fletri|tomb|sech|trou|insect|mouche|moucheron|pourri|colle|toile|pend|malade|meurt|crev|cloque|poudre|ver\b|vers/.test(nq);
}
