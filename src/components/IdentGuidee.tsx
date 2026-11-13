import { useState } from "react";
import { TRAITS, PORTS, FEUILLES, MOTIFS, type Port, type Feuille, type Motif } from "../data/traits";
import { plante } from "../data/index";
import { Tile } from "./ui";

// Identification guidée, sans photo ni connexion : 3 questions sur l'aspect
export default function IdentGuidee() {
  const [port, setPort] = useState<Port | "">("");
  const [feuille, setFeuille] = useState<Feuille | "">("");
  const [motif, setMotif] = useState<Motif | "">("");
  const [fleurs, setFleurs] = useState(false);
  const res = Object.entries(TRAITS)
    .map(([id, t]) => ({ id, score: (port && t.port.includes(port) ? 3 : port ? -9 : 0) + (feuille && t.feuille.includes(feuille) ? 3 : feuille ? -9 : 0) + (motif && t.motif.includes(motif) ? 2 : motif ? -2 : 0) + (fleurs && t.fleurs ? 2 : fleurs ? -3 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9);
  const Q = <T extends string,>({ titre, opts, val, set }: { titre: string; opts: Record<T, string>; val: T | ""; set: (v: T | "") => void }) => (
    <div style={{ marginTop: 10 }}>
      <b>{titre}</b>
      <div className="chips" style={{ marginTop: 6 }}>
        {(Object.keys(opts) as T[]).map((k) => <button key={k} className={`chip ${val === k ? "on" : ""}`} onClick={() => set(val === k ? "" : k)}>{opts[k]}</button>)}
      </div>
    </div>
  );
  return (
    <div className="card">
      <h3>🔎 Identifier sans photo (plantes de la maison)</h3>
      <p className="small muted" style={{ marginTop: -4 }}>Répondez à ce que vous voyez ; les plantes possibles s'affichent au fur et à mesure.</p>
      <Q titre="1. L'allure générale" opts={PORTS} val={port} set={setPort} />
      <Q titre="2. Les feuilles" opts={FEUILLES} val={feuille} set={setFeuille} />
      <Q titre="3. Les couleurs" opts={MOTIFS} val={motif} set={setMotif} />
      <label className="row small" style={{ marginTop: 10 }}><input type="checkbox" checked={fleurs} onChange={(e) => setFleurs(e.target.checked)} /> Elle a (ou a eu) des fleurs</label>
      {(port || feuille || motif) && (
        <>
          <h3 style={{ marginTop: 14 }}>Plantes possibles</h3>
          {!res.length && <p className="muted small">Aucune plante de la base ne correspond : essayez Pl@ntNet ou Google Lens.</p>}
          <div className="grid">
            {res.map(({ id }) => { const p = plante(id)!; return <Tile key={id} to={`/plante/${id}`} id={id} emoji={p.emoji} title={p.nom} sub={p.sosies?.length ? `Attention aux sosies : ${p.sosies.map((s) => s.nom.split(" (")[0]).join(", ")}` : p.latin} />; })}
          </div>
          <p className="small muted">Comparez la photo de la fiche et la rubrique « Ne pas confondre avec » avant de conclure.</p>
        </>
      )}
    </div>
  );
}
