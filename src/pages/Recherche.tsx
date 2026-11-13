import { useState } from "react";
import { PLANTES, PROBLEMES, REMEDES, GUIDES, ANIMAUX } from "../data/index";
import { norm } from "../lib/garden";
import { href } from "../lib/router";

export default function Recherche() {
  const [q, setQ] = useState("");
  const nq = norm(q.trim());
  const hit = (s: string) => nq.length >= 2 && norm(s).includes(nq);
  const res = nq.length < 2 ? [] : [
    ...PLANTES.filter((p) => hit(p.nom + " " + p.latin)).map((p) => ({ to: `/plante/${p.id}`, e: p.emoji, t: p.nom, s: "Plante" })),
    ...ANIMAUX.filter((a) => hit(a.nom)).map((a) => ({ to: `/animal/${a.id}`, e: a.emoji, t: a.nom, s: "Animal" })),
    ...PROBLEMES.filter((p) => hit(p.nom + " " + p.cible)).map((p) => ({ to: `/probleme/${p.id}`, e: "🩺", t: p.nom, s: "Santé" })),
    ...REMEDES.filter((r) => hit(r.nom + " " + r.role)).map((r) => ({ to: `/remede/${r.id}`, e: r.emoji, t: r.nom, s: "Remède" })),
    ...GUIDES.filter((g) => hit(g.titre + " " + g.resume)).map((g) => ({ to: `/guide/${g.id}`, e: g.emoji, t: g.titre, s: "Tutoriel" })),
    ...GUIDES.filter((g) => !hit(g.titre + " " + g.resume) && g.etapes.some((e) => hit(e.texte))).map((g) => ({ to: `/guide/${g.id}`, e: g.emoji, t: g.titre, s: "Mentionné dans un tutoriel" })),
  ].slice(0, 60);
  return (
    <div>
      <h1>🔍 Rechercher</h1>
      <div className="search"><input type="search" autoFocus placeholder="Tomate, pucerons, compost, poules, fiel…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <ul className="clean" style={{ marginTop: 12 }}>
        {res.map((r) => (
          <li key={r.to + r.s}><a className="card row" href={href(r.to)} style={{ textDecoration: "none", color: "inherit", marginTop: 8 }}><span style={{ fontSize: "1.5rem" }}>{r.e}</span><span><b>{r.t}</b><br /><span className="small muted">{r.s}</span></span></a></li>
        ))}
      </ul>
      {nq.length >= 2 && !res.length && <p className="muted">Aucun résultat.</p>}
    </div>
  );
}
