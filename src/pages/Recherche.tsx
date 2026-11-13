import { useState } from "react";
import { href } from "../lib/router";
import { rechercher, ressembleSymptome } from "../lib/search";
import { Listen } from "../components/ui";

export default function Recherche() {
  const [q, setQ] = useState("");
  const res = rechercher(q);
  return (
    <div>
      <h1>🔍 Rechercher</h1>
      <div className="search"><input type="search" autoFocus placeholder="Plante, nom courant, symptôme, technique… (ex. : caoutchouc, feuilles jaunes, rempotage)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher" /></div>
      {q.length >= 3 && ressembleSymptome(q) && (
        <a className="callout info row" href={href("/diagnostic")} style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
          <span>🩺 Cela ressemble à un symptôme : lancez le <b>diagnostic guidé</b> pour trouver la cause la plus probable.</span>
        </a>
      )}
      {res.length > 0 && (
        <div className="row between" style={{ marginTop: 10 }}>
          <span className="small muted">{res.length} résultat(s)</span>
          <Listen id={`rech-${q}`} title={`Recherche : ${q}`} blocks={[`${res.length} résultats pour ${q}.`, ...res.slice(0, 10).map((r) => `${r.type} : ${r.titre}.`)]} label="Lire les résultats" />
        </div>
      )}
      <ul className="clean">
        {res.map((r) => (
          <li key={r.href}><a className="card row" href={href(r.href)} style={{ textDecoration: "none", color: "inherit", marginTop: 8, flexWrap: "nowrap" }}><span style={{ fontSize: "1.5rem" }}>{r.emoji}</span><span><b>{r.titre}</b><br /><span className="small muted">{r.type}</span></span></a></li>
        ))}
      </ul>
      {q.length >= 2 && !res.length && <p className="muted">Aucun résultat. Essayez un autre mot, ou l'<a href={href("/identifier")}>identification par photo</a>.</p>}
    </div>
  );
}
