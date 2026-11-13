import { useState } from "react";
import { GUIDES, RUBRIQUES } from "../data/index";
import { href } from "../lib/router";
import { Photo } from "../components/ui";
import { norm } from "../lib/garden";
import type { Rubrique } from "../data/types";

export default function Guides() {
  const [q, setQ] = useState("");
  const [rub, setRub] = useState<Rubrique | "">("");
  const nq = norm(q);
  const list = GUIDES.filter((g) => (!rub || g.rubrique === rub) && (!nq || norm(g.titre + " " + g.resume).includes(nq)));
  const rubs = (Object.keys(RUBRIQUES) as Rubrique[]).filter((r) => list.some((g) => g.rubrique === r));
  return (
    <div>
      <h1>📘 Tutoriels</h1>
      <p className="muted small" style={{ marginTop: -6 }}>{GUIDES.length} tutoriels pas à pas, lisibles à voix haute, avec un mode « mains dans la terre » : grandes étapes, écran toujours allumé, commandes vocales.</p>
      <div className="search"><input type="search" placeholder="Rechercher : compost, oyas, poulailler…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="chips scroll-x" style={{ margin: "12px 0" }}>
        <button className={`chip ${!rub ? "on" : ""}`} onClick={() => setRub("")}>Tous</button>
        {(Object.keys(RUBRIQUES) as Rubrique[]).map((r) => <button key={r} className={`chip ${rub === r ? "on" : ""}`} onClick={() => setRub(r)}>{RUBRIQUES[r].emoji} {RUBRIQUES[r].label}</button>)}
      </div>
      {rubs.map((r) => (
        <section key={r}>
          <h2>{RUBRIQUES[r].emoji} {RUBRIQUES[r].label}</h2>
          <div className="grid">
            {list.filter((g) => g.rubrique === r).map((g) => (
              <a key={g.id} className="tile" href={href(`/guide/${g.id}`)}>
                <div className="ph" style={{ aspectRatio: "16/9" }}><Photo id={g.id} emoji={g.emoji} alt="" /></div>
                <div className="bd">
                <b>{g.emoji} {g.titre}</b>
                <div className="small muted" style={{ margin: "4px 0" }}>{g.resume}</div>
                <div className="row" style={{ gap: 4 }}>
                  <span className="badge">{["", "Facile", "Intermédiaire", "Avancé"][g.niveau]}</span>
                  <span className="badge green">⏱ {g.duree}</span>
                  {g.sensible && <span className="badge terra">Sensible</span>}
                </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
