import { LABELS, PRATIQUES, THEMES_ECO, ecoScore } from "../data/bio";
import { useStore, toggleFait } from "../lib/store";
import { useRoute, href, go } from "../lib/router";
import { Listen, A } from "../components/ui";

const ONGLETS: [string, string][] = [["score", "📊 Mon éco-score"], ["labels", "🏷️ Les labels"], ["guides", "📘 Jardiner bio et sobre"]];

export default function Bio() {
  const onglet = useRoute().query.get("t") ?? "score";
  return (
    <div>
      <h1>🌿 Jardin bio et écoresponsable</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Cultiver selon les principes de l'agriculture biologique, acheter les bons produits, et réduire l'empreinte de son jardin : énergie, eau, plastique, biodiversité.</p>
      <div className="chips" role="tablist" style={{ margin: "10px 0 14px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/bio?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "score" && <Score />}
      {onglet === "labels" && <Labels />}
      {onglet === "guides" && <Guides />}
    </div>
  );
}

function Score() {
  const s = useStore((x) => x);
  const animaux = s.troupeaux.length > 0 || s.settings.animauxActifs;
  const coches = new Set(Object.keys(s.fait).filter((k) => k.startsWith("eco:")).map((k) => k.slice(4)));
  const { score, parTheme, aFaire } = ecoScore(coches, animaux);
  const niveau = score >= 80 ? "🏆 Jardin exemplaire" : score >= 60 ? "🌳 Très bon jardin écologique" : score >= 35 ? "🌿 Sur la bonne voie" : "🌱 Premiers pas";
  return (
    <div>
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.6rem", fontWeight: 900, color: "var(--green)" }}>{score} / 100</div>
        <b>{niveau}</b>
        <div className="progress" style={{ margin: "10px 0" }}><div style={{ width: `${score}%` }} /></div>
        <p className="small muted" style={{ margin: 0 }}>Cochez ce que vous faites déjà. Le score n'est pas un label : c'est un repère pour progresser, à votre rythme.</p>
      </div>
      <div className="grid" style={{ marginTop: 10 }}>
        {parTheme.map((t) => (
          <div key={t.theme} className="card">
            <b>{THEMES_ECO[t.theme].e} {THEMES_ECO[t.theme].nom}</b> <span className="small muted">{t.ok}/{t.total}</span>
            <div className="progress" style={{ margin: "6px 0 8px" }}><div style={{ width: `${(t.ok / t.total) * 100}%` }} /></div>
            {PRATIQUES.filter((p) => p.theme === t.theme).map((p) => (
              <label key={p.id} className={`task ${coches.has(p.id) ? "done" : ""}`} style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={coches.has(p.id)} onChange={() => toggleFait("eco:" + p.id)} />
                <span className="small">{p.texte}{p.lien && <> · <a href={href(p.lien)} onClick={(e) => e.stopPropagation()}>comment ?</a></>}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
      {aFaire.length > 0 && (
        <div className="callout ok small">
          <b>👉 Vos 3 prochains pas</b>
          <ol style={{ margin: "4px 0 0", paddingLeft: 20 }}>{aFaire.slice(0, 3).map((p) => <li key={p.id}>{p.texte} {p.lien && <a href={href(p.lien)}>→</a>}</li>)}</ol>
        </div>
      )}
      <Listen id="eco-score" title="Mon éco-score" blocks={[`Votre éco-score est de ${score} sur 100. ${niveau}.`, ...aFaire.slice(0, 3).map((p, i) => `Prochain pas ${i + 1} : ${p.texte}.`)]} label="Écouter" />
    </div>
  );
}

function Labels() {
  return (
    <div>
      <p className="small">Ce que chaque mention garantit vraiment, et ce qu'elle ne garantit pas.</p>
      {LABELS.map((l) => (
        <div key={l.id} className="card">
          <b>{l.emoji} {l.nom}</b>
          <p className="small" style={{ margin: "4px 0" }}><b>Pour :</b> {l.pour}</p>
          <p className="small" style={{ margin: "4px 0" }}><b>✅ Garantit :</b> {l.garantit}</p>
          <p className="small" style={{ margin: "4px 0" }}><b>⚠️ À savoir :</b> {l.attention}</p>
        </div>
      ))}
      <div className="callout warn small"><b>Vendre ses légumes « bio » ?</b>Interdit sans certification : au jardin familial, on cultive « selon les principes de l'agriculture biologique ». <A to="/guide/jardiner-bio">En savoir plus</A></div>
    </div>
  );
}

function Guides() {
  const liens: [string, string][] = [["/guide/jardiner-bio", "🌿 Jardiner bio : principes, achats, ce qu'on n'a pas le droit de dire"], ["/guide/labels-bio", "🏷️ Les labels pour bien acheter"], ["/guide/jardin-sobre", "🌍 Un jardin sobre : énergie, plastique, eau, lumière"], ["/guide/elevage-bio", "🐓 Élever ses animaux selon les principes bio"], ["/guide/traiter-loi", "⚖️ Traiter au jardin : la loi et les seuils"], ["/guide/compost-cn", "🌡️ Le compost en vrai"], ["/guide/semences", "🌰 Les semences : F1, reproductibles"], ["/guide/nitrates", "🧪 Nitrates : légumes sains, nappe propre"], ["/amenagements?t=paillages", "🌾 Les paillages comparés"], ["/amenagements?t=techniques", "🛠️ Les techniques bio (faux-semis, auxiliaires…)"]];
  return <div className="grid-sm">{liens.map(([h, l]) => <a key={h} className="btn" href={href(h)} style={{ justifyContent: "flex-start", textAlign: "left" }}>{l}</a>)}</div>;
}
