import { useStore } from "../lib/store";
import { Ico } from "../components/Ico";
import { useState } from "react";
import { GUIDES, RUBRIQUES } from "../data/index";
import { href } from "../lib/router";
import { Photo, Titre } from "../components/ui";
import { norm } from "../lib/garden";
import type { Rubrique } from "../data/types";

export default function Guides() {
  const [q, setQ] = useState("");
  const [rub, setRub] = useState<Rubrique | "">("");
  const debutant = useStore((s) => !!s.settings.debutant);
  const [niveau, setNiveau] = useState<0 | 1 | 2 | 3>(debutant ? 1 : 0);
  const nq = norm(q);
  const list = GUIDES.filter((g) => (!rub || g.rubrique === rub) && (!niveau || g.niveau === niveau) && (!nq || norm(g.titre + " " + g.resume).includes(nq)));
  const rubs = (Object.keys(RUBRIQUES) as Rubrique[]).filter((r) => list.some((g) => g.rubrique === r));
  // Sans filtre, chaque rubrique montre ses 6 premiers tutoriels ; « Voir tout » déplie la rubrique
  const [ouvertes, setOuvertes] = useState<string[]>([]);
  const replie = !rub && !nq;
  return (
    <div>
      <Titre ico="tutoriels" emoji="📘">Tutoriels</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>{GUIDES.length} tutoriels pas à pas, lisibles à voix haute, avec un mode « mains dans la terre » : grandes étapes, écran toujours allumé, commandes vocales.</p>
      <div className="search"><input type="search" placeholder="Rechercher : compost, oyas, poulailler…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="chips" style={{ marginTop: 10 }} aria-label="Niveau">
        {([[0, "Tous les niveaux"], [1, "🌱 Facile"], [2, "Intermédiaire"], [3, "Avancé"]] as [0 | 1 | 2 | 3, string][]).map(([n, l]) => <button key={n} className={`chip ${niveau === n ? "on" : ""}`} onClick={() => setNiveau(n)}>{l}{n ? ` (${GUIDES.filter((g) => g.niveau === n).length})` : ""}</button>)}
      </div>
      {debutant && niveau === 1 && <p className="small muted">Mode débutant : seuls les tutoriels faciles sont affichés. <a href={href("/debuter?t=saison2")}>Votre deuxième saison →</a></p>}
      <div className="chips scroll-x" style={{ margin: "12px 0" }}>
        <button className={`chip ${!rub ? "on" : ""}`} onClick={() => setRub("")}>Tous</button>
        {(Object.keys(RUBRIQUES) as Rubrique[]).map((r) => <button key={r} className={`chip ${rub === r ? "on" : ""}`} onClick={() => setRub(r)}><Ico nom={r === "interieur" ? "interieur" : r === "animaux" ? "animaux" : r} emoji={RUBRIQUES[r].emoji} taille={22} /> {RUBRIQUES[r].label}</button>)}
      </div>
      {rubs.map((r) => (
        <section key={r}>
          <h2 className="row" style={{ gap: 8 }}><Ico nom={r} emoji={RUBRIQUES[r].emoji} taille={34} /> {RUBRIQUES[r].label}</h2>
          <div className="grid">
            {list.filter((g) => g.rubrique === r).slice(0, replie && !ouvertes.includes(r) ? 6 : undefined).map((g) => (
              <a key={g.id} className="tile" href={href(`/guide/${g.id}`)}>
                <div className="ph" style={{ aspectRatio: "16/9" }}><Photo id={g.id} emoji={g.emoji} alt="" /></div>
                <div className="bd">
                <b>{g.titre}</b>
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
          {replie && !ouvertes.includes(r) && list.filter((g) => g.rubrique === r).length > 6 && <button className="btn sm" style={{ marginTop: 8 }} onClick={() => setOuvertes([...ouvertes, r])}>Voir les {list.filter((g) => g.rubrique === r).length - 6} autres tutoriels « {RUBRIQUES[r].label} »</button>}
        </section>
      ))}
    </div>
  );
}
