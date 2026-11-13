import { probleme, remede, plante, TYPES_PROBLEME } from "../data/index";
import { Galerie, Back, Listen, Videos, A, Empty } from "../components/ui";
import { href } from "../lib/router";
import { MOIS_NOMS } from "../data/util";

export default function ProblemeFiche({ id }: { id?: string }) {
  const p = id ? probleme(id) : undefined;
  if (!p) return <Empty emoji="🤷">Fiche introuvable. <A to="/sante">Santé des plantes</A></Empty>;
  const lecture = [
    `${p.nom}. ${TYPES_PROBLEME[p.type]}. Concerne : ${p.cible}.`,
    "Comment le reconnaître.", ...p.symptomes,
    ...(p.confusion ? [`À ne pas confondre. ${p.confusion}`] : []),
    `Conditions favorables. ${p.conditions}`,
    "Prévention.", ...p.prevention,
    "Que faire.", ...p.traitements,
  ];
  const plantes = p.plantes.filter((x) => x !== "*").map(plante).filter(Boolean);
  return (
    <div>
      <Back />
      <div className="hero" style={{ marginTop: 8 }}>
        <Galerie id={p.id} emoji={"🩺"} alt={p.nom} />
        <div>
          <span className="badge">{TYPES_PROBLEME[p.type]}</span>{" "}
          <span className={`badge ${p.gravite === 3 ? "danger" : p.gravite === 2 ? "sun" : "green"}`}>{["", "Bénin", "Sérieux", "Grave"][p.gravite]}</span>
          <h1 style={{ marginTop: 8 }}>{p.nom}</h1>
          <p className="muted"><b>Concerne :</b> {p.cible}</p>
          <p className="small muted">Période : {p.mois.length === 12 ? "toute l'année" : p.mois.map((m) => MOIS_NOMS[m - 1]).join(", ")}</p>
          <Listen id={`pb-${p.id}`} title={p.nom} blocks={lecture} label="Écouter la fiche" />
        </div>
      </div>
      <h2>🔍 Comment le reconnaître</h2>
      <ul className="ticks">{p.symptomes.map((s) => <li key={s}>{s}</li>)}</ul>
      {p.confusion && <div className="callout warn"><b>↔ À ne pas confondre</b>{p.confusion}</div>}
      <p><b>Conditions favorables :</b> {p.conditions}</p>
      <h2>🛡️ Prévention</h2>
      <ul className="ticks">{p.prevention.map((s) => <li key={s}>{s}</li>)}</ul>
      <h2>🌿 Que faire</h2>
      <ol className="steps">{p.traitements.map((s) => <li key={s}>{s}</li>)}</ol>
      {p.remedes.length > 0 && (
        <>
          <h3>Préparations utiles</h3>
          <div className="chips">{p.remedes.map((r) => { const x = remede(r)!; return <a key={r} className="chip" href={href(`/remede/${r}`)}>{x.emoji} {x.nom}</a>; })}</div>
        </>
      )}
      {plantes.length > 0 && (
        <>
          <h2>Plantes concernées</h2>
          <div className="chips">{plantes.map((q) => <a key={q!.id} className="chip" href={href(`/plante/${q!.id}`)}>{q!.emoji} {q!.nom}</a>)}</div>
        </>
      )}
      <h2>🎬 Vidéos</h2>
      <Videos id={p.id} query={`${p.nom.split(" (")[0].toLowerCase()} traitement naturel`} gestes={[`reconnaître ${p.nom.split(" (")[0].toLowerCase()}`, `${p.nom.split(" (")[0].toLowerCase()} prévention`]} />
    </div>
  );
}
