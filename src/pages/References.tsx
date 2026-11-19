import { Titre } from "../components/ui";
import { REFERENCES } from "../data/pedagogie";
import { href } from "../lib/router";

export default function References() {
  return (
    <div>
      <Titre ico="lexique" emoji="📚">Sources et références</Titre>
      <p className="muted small">Racines vulgarise des connaissances d'agronomie, d'horticulture, d'élevage et d'apiculture. Pour vérifier une information, approfondir ou connaître la réglementation à jour de votre région, voici les organismes de référence. Les repères chiffrés de l'appli sont des ordres de grandeur : les références locales (analyse de sol, conseiller, vétérinaire) priment toujours.</p>
      {Object.entries(REFERENCES).map(([k, d]) => (
        <section key={k} className="card" style={{ marginTop: 12 }}>
          <b>{d.titre}</b>
          <ul className="ticks small" style={{ margin: "6px 0 0" }}>
            {d.refs.map((r) => <li key={r.id}><b>{r.nom}</b> · <a href={`https://${r.site}`} target="_blank" rel="noreferrer">{r.site}</a><br />{r.role}</li>)}
          </ul>
        </section>
      ))}
      <p className="small" style={{ marginTop: 14 }}><a href={href("/cours")}>Parcours « Comprendre l'agronomie » →</a> · <a href={href("/lexique")}>Lexique →</a></p>
    </div>
  );
}
