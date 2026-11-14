import { ANIMAUX, GUIDES } from "../data/index";
import { Tile, Section } from "../components/ui";
import { href } from "../lib/router";

export default function Animaux() {
  const guides = GUIDES.filter((g) => g.rubrique === "animaux" || g.rubrique === "boucherie");
  return (
    <div>
      <h1>🐔 Les animaux</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Soins quotidiens, alimentation avec le jardin, santé, fumier, services rendus au potager et réglementation, pour chaque animal.</p>
      <div className="grid-sm" style={{ marginBottom: 14 }}>
        <a className="btn big primary" href={href("/diagnostic-animal")}>🩺 Un animal ne va pas bien</a>
        <a className="btn big" href={href("/calculs?s=animaux")}>🧮 Combien d'animaux pour ma famille ?</a>
        <a className="btn big" href={href("/guide/fumiers-securite")}>💩 Utiliser leur fumier</a>
      </div>
      <div className="grid">
        {ANIMAUX.map((a) => (
          <Tile key={a.id} to={`/animal/${a.id}`} id={a.id} emoji={a.emoji} title={a.nom} sub={a.profil.espace.split(",")[0]} badge={<span className="badge">{["", "Débutant", "Intermédiaire", "Confirmé"][a.profil.niveau]}</span>} />
        ))}
      </div>
      <Section title="Tutoriels basse-cour et élevage">
        <div className="grid">
          {guides.map((g) => (
            <a key={g.id} className="card" href={href(`/guide/${g.id}`)} style={{ textDecoration: "none", color: "inherit" }}>
              <b>{g.emoji} {g.titre}</b>
              <div className="small muted">{g.resume}</div>
            </a>
          ))}
        </div>
      </Section>
      <p className="small muted" style={{ marginTop: 18 }}>Ces fiches ne remplacent pas un vétérinaire. Repérez-en un qui soigne les animaux de ferme et de basse-cour AVANT d'en avoir besoin. Réglementation française à vérifier auprès de votre mairie, de l'EDE ou de la DDPP de votre département.</p>
    </div>
  );
}
