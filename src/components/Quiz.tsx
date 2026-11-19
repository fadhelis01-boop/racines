import { useState } from "react";
import { QUIZ, REFERENCES, sourcesDe } from "../data/pedagogie";
import { toggleFait, useStore } from "../lib/store";
import { href } from "../lib/router";
import type { Guide } from "../data/types";

/** Quiz de fin de tutoriel : une réponse à la fois, avec l'explication. */
export function Quiz({ id }: { id: string }) {
  const qs = QUIZ[id];
  const fait = useStore((s) => s.fait[`quiz:${id}`]);
  const [rep, setRep] = useState<Record<number, number>>({});
  if (!qs) return null;
  const repondues = Object.keys(rep).length;
  const justes = qs.filter((q, i) => rep[i] === q.bonne).length;
  return (
    <section className="card" style={{ marginTop: 16 }}>
      <b>🎓 Vérifiez ce que vous avez retenu</b> {fait && <span className="badge green">déjà réussi</span>}
      {qs.map((q, i) => (
        <div key={i} style={{ marginTop: 10 }}>
          <p style={{ margin: "0 0 6px" }}><b>{i + 1}.</b> {q.q}</p>
          <div className="chips">
            {q.choix.map((c, k) => {
              const choisi = rep[i] === k, bon = k === q.bonne, montre = rep[i] !== undefined;
              return <button key={k} className={`chip ${choisi ? "on" : ""}`} disabled={montre} onClick={() => setRep({ ...rep, [i]: k })} style={montre && bon ? { borderColor: "var(--green)", fontWeight: 800 } : undefined} aria-pressed={choisi}>{montre && bon ? "✓ " : montre && choisi ? "✗ " : ""}{c}</button>;
            })}
          </div>
          {rep[i] !== undefined && <p className="small" style={{ margin: "6px 0 0", color: rep[i] === q.bonne ? "var(--green)" : "var(--danger)" }}>{rep[i] === q.bonne ? "Bonne réponse. " : "Pas tout à fait. "}<span style={{ color: "var(--text)" }}>{q.explication}</span></p>}
        </div>
      ))}
      {repondues === qs.length && (
        <p style={{ marginTop: 10 }}><b>{justes} / {qs.length}</b> {justes === qs.length ? "Bravo, tout est juste !" : "Relisez les étapes concernées et réessayez."}{" "}
          {justes === qs.length && !fait && <button className="btn sm" onClick={() => toggleFait(`quiz:${id}`)}>Marquer comme réussi</button>}
          {justes < qs.length && <button className="btn sm ghost" onClick={() => setRep({})}>Recommencer</button>}
        </p>
      )}
    </section>
  );
}

/** « Pour aller plus loin » : organismes de référence du domaine du tutoriel. */
export function Sources({ g }: { g: Pick<Guide, "id" | "rubrique"> }) {
  const domaines = sourcesDe(g);
  return (
    <section className="small" style={{ marginTop: 16 }}>
      <b>📚 Pour vérifier et aller plus loin</b>
      <ul className="ticks" style={{ margin: "4px 0" }}>
        {domaines.flatMap((d) => REFERENCES[d]?.refs.slice(0, 3) ?? []).map((r) => <li key={r.id}><b>{r.nom}</b> ({r.site}) : {r.role}</li>)}
      </ul>
      <a href={href("/references")}>Toutes les sources et références →</a>
    </section>
  );
}
