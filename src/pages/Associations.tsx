import { preuve, NIVEAUX } from "../data/associations-preuves";
import { useState } from "react";
import { PLANTES, plante } from "../data/index";
import { relations } from "../lib/garden";
import { useStore } from "../lib/store";
import { href } from "../lib/router";
import { A, Titre } from "../components/ui";

export default function Associations() {
  const mes = useStore((s) => [...new Set(s.cultures.filter((c) => !c.fini).map((c) => c.planteId))]);
  const [sel, setSel] = useState<string[]>([]);
  const choix = PLANTES.filter((p) => (p.categorie === "legume" || p.categorie === "aromatique" || p.categorie === "fleur" || p.categorie === "fruit") && (p.amis.length || p.ennemis.length)).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const rel = relations(sel);
  const amis = rel.filter((r) => r.type === "ami");
  const ennemis = rel.filter((r) => r.type === "ennemi");
  // Suggestions : plantes amies de plusieurs sélectionnées et ennemies d'aucune
  const sugg = sel.length
    ? choix.filter((p) => !sel.includes(p.id) && !sel.some((s) => plante(s)!.ennemis.includes(p.id) || p.ennemis.includes(s))).map((p) => ({ p, n: sel.filter((s) => plante(s)!.amis.includes(p.id) || p.amis.includes(s)).length })).filter((x) => x.n >= 1).sort((a, b) => b.n - a.n).slice(0, 10)
    : [];
  return (
    <div>
      <Titre ico="associations" emoji="🤝">Associations de cultures</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>Choisissez ce que vous voulez cultiver ensemble : Racines indique les bons voisins et ceux à séparer. <A to="/guide/associations">Ce qu'il faut savoir sur les associations</A></p>
      <div className="callout info small"><b>Niveau de preuve</b>Chaque association porte une étiquette : <span className="badge green">Étudiée</span> (effet observé dans des essais), <span className="badge sun">Plausible</span> (mécanisme connu, résultats variables) ou <span className="badge">Tradition</span> (savoir de jardinier, sans preuve solide). Les bases sûres restent la rotation, la diversité et un sol vivant.</div>
      {mes.length > 0 && <button className="btn sm" onClick={() => setSel(mes.filter((x) => choix.some((p) => p.id === x)))}>Utiliser mes cultures en cours ({mes.length})</button>}
      <div className="chips" style={{ margin: "12px 0" }}>
        {choix.map((p) => <button key={p.id} className={`chip ${sel.includes(p.id) ? "on" : ""}`} onClick={() => setSel(sel.includes(p.id) ? sel.filter((x) => x !== p.id) : [...sel, p.id])}>{p.emoji} {p.nom}</button>)}
      </div>
      {sel.length >= 2 && (
        <div className="grid">
          <div className="card">
            <b>👍 Bons voisins ({amis.length})</b>
            <ul className="ticks small">{amis.map((r) => { const pr = preuve(r.a.id, r.b.id); return <li key={r.a.id + r.b.id}>{r.a.nom} + {r.b.nom} <span className={`badge ${NIVEAUX[pr.niveau].classe}`} title={NIVEAUX[pr.niveau].explication}>{NIVEAUX[pr.niveau].label}</span>{pr.note && <span className="small muted" style={{ display: "block" }}>{pr.note}</span>}</li>; })}</ul>
            {!amis.length && <p className="small muted">Aucune association connue dans votre sélection.</p>}
          </div>
          <div className="card" style={{ borderColor: ennemis.length ? "var(--danger)" : undefined }}>
            <b>👎 À séparer ({ennemis.length})</b>
            <ul className="ticks small">{ennemis.map((r) => { const pr = preuve(r.a.id, r.b.id); return <li key={r.a.id + r.b.id}>{r.a.nom} ✕ {r.b.nom} <span className={`badge ${NIVEAUX[pr.niveau].classe}`} title={NIVEAUX[pr.niveau].explication}>{NIVEAUX[pr.niveau].label}</span>{pr.note && <span className="small muted" style={{ display: "block" }}>{pr.note}</span>}</li>; })}</ul>
            {!ennemis.length && <p className="small muted">Aucun conflit. 👌</p>}
          </div>
        </div>
      )}
      {sugg.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <b>💡 À ajouter dans la sélection</b>
          <div className="chips" style={{ marginTop: 8 }}>{sugg.map(({ p, n }) => <a key={p.id} className="chip" href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom} {n > 1 && <span className="badge green">×{n}</span>}</a>)}</div>
        </div>
      )}
      {sel.length < 2 && <p className="muted">Sélectionnez au moins deux plantes.</p>}
    </div>
  );
}
