import { remede, probleme } from "../data/index";
import { Back, Listen, Videos, A, Empty } from "../components/ui";
import { href } from "../lib/router";
import { STATUT_REMEDE, STATUTS } from "../data/reglementation";

export default function RemedeFiche({ id }: { id?: string }) {
  const r = id ? remede(id) : undefined;
  if (!r) return <Empty emoji="🤷">Fiche introuvable. <A to="/sante">Santé des plantes</A></Empty>;
  const lecture = [`${r.nom}. ${r.role}`, "Ingrédients. " + r.ingredients.join(". "), "Préparation.", ...r.preparation, "Utilisation.", ...r.usage, ...(r.precautions.length ? ["Précautions.", ...r.precautions] : []), ...(r.conservation ? [`Conservation. ${r.conservation}`] : [])];
  return (
    <div>
      <Back />
      <h1 style={{ marginTop: 8 }}>{r.emoji} {r.nom}</h1>
      {(() => {
        const st = STATUT_REMEDE[r.id];
        if (!st) return null;
        const S = STATUTS[st.statut];
        return <span className={`badge ${S.classe}`}>{S.label}</span>;
      })()}
      <p>{r.role}</p>
      <Listen id={`rem-${r.id}`} title={r.nom} blocks={lecture} label="Écouter la recette" />
      <div className="card" style={{ marginTop: 14 }}>
        <h3>🧾 Ingrédients et matériel</h3>
        <ul className="ticks">{r.ingredients.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      {r.preparation.length > 0 && <><h2>Préparation</h2><ol className="steps">{r.preparation.map((x) => <li key={x}>{x}</li>)}</ol></>}
      <h2>Utilisation</h2>
      <ul className="ticks">{r.usage.map((x) => <li key={x}>{x}</li>)}</ul>
      {r.precautions.length > 0 && <div className="callout warn"><b>⚠️ Précautions</b><ul className="ticks" style={{ margin: 0 }}>{r.precautions.map((x) => <li key={x}>{x}</li>)}</ul></div>}
      {r.conservation && <p><b>Conservation :</b> {r.conservation}</p>}
      {(() => {
        const st = STATUT_REMEDE[r.id];
        if (!st) return null;
        const S = STATUTS[st.statut];
        return (
          <div className="callout info small">
            <b>⚖️ Ce que dit la réglementation</b>
            {S.explication} {st.note}
            {st.dar && <><br /><b>Délai avant récolte :</b> {st.dar}</>}
            <br /><a href="https://ephy.anses.fr/" target="_blank" rel="noreferrer">Vérifier un produit sur ephy.anses.fr</a> · <a href={href("/guide/traiter-loi")}>Traiter au jardin : les règles</a>
          </div>
        );
      })()}
      {r.contre.length > 0 && (
        <>
          <h2>Contre</h2>
          <div className="chips">{r.contre.map((c) => <a key={c} className="chip" href={href(`/probleme/${c}`)}>{probleme(c)!.nom}</a>)}</div>
        </>
      )}
      <h2>🎬 Vidéos</h2>
      <Videos id={`rem-${r.id}`} query={`${r.nom.split(" (")[0].toLowerCase()} recette jardin`} />
    </div>
  );
}
