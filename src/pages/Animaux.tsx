import { useState } from "react";
import { ANIMAUX, GUIDES } from "../data/index";
import { Tile, Section, Titre } from "../components/ui";
import { href } from "../lib/router";
import { REPERES, animauxPossibles, fourchette, themeDuGuide } from "../lib/choisir-animal";

export default function Animaux() {
  const guides = GUIDES.filter((g) => g.rubrique === "animaux" || g.rubrique === "boucherie");
  const themes = [...new Set(guides.map((g) => themeDuGuide(g.id, g.rubrique)))];
  return (
    <div>
      <Titre ico="animaux" emoji="🐔">Les animaux</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>Soins quotidiens, alimentation avec le jardin, santé, fumier, services rendus au potager et réglementation, pour chaque animal.</p>
      <div className="grid-sm" style={{ marginBottom: 14 }}>
        <a className="btn big primary" href={href("/diagnostic-animal")}>⚕️ Un animal ne va pas bien</a>
        <a className="btn big" href={href("/guide/debuter-animaux")}>🐣 Je débute avec des animaux</a>
        <a className="btn big" href={href("/calculs?s=animaux")}>🧮 Combien d'animaux pour ma famille ?</a>
        <a className="btn big" href={href("/nutrition?t=animaux")}>🍽️ Bien les nourrir</a>
      </div>
      <Comparateur />
      <div className="grid" style={{ marginTop: 14 }}>
        {ANIMAUX.map((a) => (
          <Tile key={a.id} to={`/animal/${a.id}`} id={a.id} emoji={a.emoji} title={a.nom} sub={a.profil.espace.split(",")[0]} badge={<span className="badge">{["", "Débutant", "Intermédiaire", "Confirmé"][a.profil.niveau]}</span>} />
        ))}
      </div>
      <Section title="Tutoriels basse-cour et élevage">
        {themes.map((t, i) => {
          const gs = guides.filter((g) => themeDuGuide(g.id, g.rubrique) === t);
          return (
            <details key={t} className="box" open={i === 0}>
              <summary><b>{t}</b> <span className="muted small">({gs.length})</span></summary>
              <div className="grid" style={{ marginTop: 8 }}>
                {gs.map((g) => (
                  <a key={g.id} className="card" href={href(`/guide/${g.id}`)} style={{ textDecoration: "none", color: "inherit" }}>
                    <b>{g.emoji} {g.titre}</b>
                    <div className="small muted">{g.resume}</div>
                  </a>
                ))}
              </div>
            </details>
          );
        })}
      </Section>
      <p className="small muted" style={{ marginTop: 18 }}>Ces fiches ne remplacent pas un vétérinaire. Repérez-en un qui soigne les animaux de ferme et de basse-cour AVANT d'en avoir besoin : <a href={href("/guide/veterinaire-urgences")}>comment le trouver</a>.</p>
    </div>
  );
}

// « Quel animal pour moi ? » : place, temps, budget de départ, niveau
function Comparateur() {
  const [surface, setSurface] = useState("");
  const [minutes, setMinutes] = useState("");
  const [budget, setBudget] = useState("");
  const [debutant, setDebutant] = useState(true);
  const n = (x: string) => (x === "" ? undefined : Number(x));
  const res = animauxPossibles(ANIMAUX, { surface: n(surface), minutes: n(minutes), budgetDepart: n(budget), debutant });
  return (
    <details className="card" open>
      <summary><b>🤔 Quel animal pour moi ?</b> <span className="muted small">place, temps, budget</span></summary>
      <div className="grid-sm" style={{ marginTop: 8 }}>
        <label className="field">Place disponible (m²)<input type="number" min="0" inputMode="numeric" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="ex. 200" /></label>
        <label className="field">Temps par jour (minutes)<input type="number" min="0" inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="ex. 15" /></label>
        <label className="field">Budget de départ (€)<input type="number" min="0" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="ex. 800" /></label>
        <label className="row small" style={{ alignSelf: "end" }}><input type="checkbox" checked={debutant} onChange={(e) => setDebutant(e.target.checked)} /> Je débute</label>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table small" style={{ marginTop: 8 }}>
          <thead><tr><th>Animal</th><th>Pour</th><th>Place</th><th>Temps/jour</th><th>Départ</th><th>Par mois</th><th>Bruit</th></tr></thead>
          <tbody>
            {res.map(({ a, ok, raisons }) => {
              const r = REPERES[a.id];
              return (
                <tr key={a.id} style={{ opacity: ok ? 1 : 0.55 }}>
                  <td><a href={href(`/animal/${a.id}`)}>{a.emoji} {a.nom.split(" (")[0]}</a>{!ok && <div className="muted">{raisons.join(" ; ")}</div>}</td>
                  <td>{r?.groupe}</td>
                  <td>{r ? `${r.surface.toLocaleString("fr-FR")} m²` : "—"}</td>
                  <td>{r ? `${r.minutes} min` : "—"}</td>
                  <td>{r ? fourchette(r.depart) : "—"}</td>
                  <td>{r ? fourchette(r.mois) : a.profil.budget}</td>
                  <td>{a.profil.bruit.split(/[,;:(]/)[0]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="small muted">Ordres de grandeur : le départ comprend les animaux, l'abri, la clôture et le petit matériel ; le mois, l'aliment, la litière et une part de vétérinaire. Les animaux grégaires ne vivent jamais seuls. <a href={href("/guide/debuter-animaux")}>Par où commencer →</a></p>
    </details>
  );
}
