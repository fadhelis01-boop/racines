import { useState } from "react";
import { TYPES_SOL, QUESTIONS_SOL, interpreterSol, PH_CHOU, SOL_PLANTE } from "../data/sols";
import { plante } from "../data/index";
import { useStore, setSettings, today } from "../lib/store";
import { useRoute, href, go } from "../lib/router";
import { Back, Listen, A, toast } from "../components/ui";
import { Vignette, srcVignette } from "../components/Ico";

const ONGLETS: [string, string][] = [["test", "🧪 Identifier mon sol"], ["types", "🌍 Les types de sol"], ["ph", "🎨 Acide ou calcaire ?"], ["vie", "🐛 Un sol vivant"]];
const typeSol = (id: string) => TYPES_SOL.find((t) => t.id === id);

export default function Sol() {
  const onglet = useRoute().query.get("t") ?? "test";
  const sol = useStore((s) => s.settings.sol);
  return (
    <div>
      <Back />
      <h1>🌍 Mon sol</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Connaître sa terre, c'est savoir quoi planter, comment l'arroser et comment la nourrir. Pas besoin de laboratoire : quelques tests de 5 minutes avec une poignée de terre, du vinaigre et un chou rouge.</p>
      {sol && onglet !== "test" && <div className="callout ok small"><b>Votre sol (test du {new Date(sol.date).toLocaleDateString("fr-FR")})</b>{[typeSol(sol.texture)?.nom, ...sol.traits.map((t) => typeSol(t)?.nom)].filter(Boolean).join(" · ")} <a href={href("/sol?t=test")}>Voir ou refaire</a></div>}
      <div className="chips" role="tablist" style={{ margin: "10px 0 14px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/sol?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "test" && <Test />}
      {onglet === "types" && <Types />}
      {onglet === "ph" && <Ph />}
      {onglet === "vie" && <Vie />}
      <p className="small" style={{ marginTop: 18 }}><a href={href("/nutrition")}>🍽️ Ensuite : nourrir ses plantes selon leurs besoins →</a></p>
    </div>
  );
}

function Resultat({ texture, traits, alertes }: { texture: string; traits: string[]; alertes: string[] }) {
  const types = [texture, ...traits].map(typeSol).filter(Boolean);
  const aime = [...new Set(types.flatMap((t) => t!.aime))].map(plante).filter(Boolean).slice(0, 16);
  const lecture = types.flatMap((t) => [t!.nom, t!.image, "Avantages : " + t!.plus.join(". "), "Inconvénients : " + t!.moins.join(". "), "Pour l'améliorer : " + t!.ameliorer.join(" ")]).concat(alertes);
  return (
    <div>
      <div className="row between"><h2 style={{ margin: 0 }}>Votre sol</h2><Listen id="sol-res" title="Mon sol" blocks={lecture} /></div>
      {types.map((t) => (
        <div key={t!.id} className="card">
          <b style={{ fontSize: "1.1rem" }}>{t!.emoji} {t!.nom}</b>
          <p className="small muted" style={{ margin: "2px 0 8px" }}>{t!.image}</p>
          <div className="grid">
            <div><b>✅ Ses atouts</b><ul className="ticks small">{t!.plus.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><b>⚠️ Ses défauts</b><ul className="ticks small">{t!.moins.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <b>🛠️ Pour l'améliorer</b>
          <ol className="steps small">{t!.ameliorer.map((x) => <li key={x}>{x}</li>)}</ol>
        </div>
      ))}
      {alertes.map((a) => <div key={a} className="callout info small">{a}</div>)}
      <h3>🌱 Ce qui s'y plaît sans effort</h3>
      <div className="chips">{aime.map((p) => <a key={p!.id} className="chip" href={href(`/plante/${p!.id}`)}><Vignette id={p!.id} emoji={p!.emoji} taille={20} /> {p!.nom}</a>)}</div>
      <p className="small muted">Toutes les autres cultures restent possibles : on corrige le sol peu à peu avec du compost et du paillage. Dans tous les cas, la matière organique améliore TOUS les types de sol.</p>
    </div>
  );
}

function Test() {
  const sol = useStore((s) => s.settings.sol);
  const [rep, setRep] = useState<Record<string, number>>({});
  const [voir, setVoir] = useState(false);
  const fini = QUESTIONS_SOL.every((q) => rep[q.id] !== undefined);
  const points: Record<string, number> = {};
  for (const q of QUESTIONS_SOL) if (rep[q.id] !== undefined) for (const [k, v] of Object.entries(q.reponses[rep[q.id]].effet)) points[k] = (points[k] ?? 0) + (v ?? 0);
  const res = interpreterSol(points);
  const enregistrer = () => { setSettings({ sol: { texture: res.texture, traits: res.traits, date: today() } }); toast("Résultat enregistré : il apparaîtra sur les fiches et dans les conseils"); };
  if (sol && !voir && !Object.keys(rep).length) {
    return (
      <div>
        <Resultat texture={sol.texture} traits={sol.traits} alertes={[]} />
        <button className="btn" onClick={() => setVoir(true)}>🔄 Refaire le test</button>
      </div>
    );
  }
  return (
    <div>
      <div className="callout info small"><b>Ce qu'il faut</b>Une bêche ou un transplantoir, un peu d'eau, du vinaigre blanc, une soucoupe. Faites les tests à plusieurs endroits si le terrain est grand : un jardin peut avoir deux sols différents. Comptez 15 minutes.</div>
      {srcVignette("connaitre-sol") && <img src={srcVignette("connaitre-sol")} alt="Bocal de terre et poignée de sol" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10, margin: "8px 0" }} />}
      {QUESTIONS_SOL.map((q, i) => (
        <fieldset key={q.id} className="card" style={{ border: rep[q.id] !== undefined ? "2px solid var(--green)" : undefined }}>
          <legend className="small muted">Question {i + 1} sur {QUESTIONS_SOL.length}</legend>
          <b>{q.titre}</b>
          <p className="small" style={{ margin: "4px 0 8px" }}>{q.comment}</p>
          <div className="stack">
            {q.reponses.map((r, k) => (
              <label key={k} className="row" style={{ cursor: "pointer" }}>
                <input type="radio" name={q.id} checked={rep[q.id] === k} onChange={() => setRep({ ...rep, [q.id]: k })} /> <span>{r.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {!fini && <p className="small muted">Encore {QUESTIONS_SOL.filter((q) => rep[q.id] === undefined).length} question(s).</p>}
      {fini && (
        <>
          <Resultat {...res} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={enregistrer}>💾 Enregistrer mon sol</button>
            <button className="btn ghost" onClick={() => setRep({})}>Recommencer</button>
          </div>
        </>
      )}
      <p className="small"><a href={href("/guide/connaitre-sol")}>Le tutoriel complet avec le test du bocal →</a> · <a href={href("/sol?t=ph")}>Mesurer l'acidité au chou rouge →</a></p>
    </div>
  );
}

function Types() {
  return (
    <div>
      <div className="callout info small"><b>Comprendre en une image</b>La terre est un mélange de grains de 3 tailles : le <b>sable</b> (gros grains, l'eau passe), le <b>limon</b> (grains fins comme de la farine) et l'<b>argile</b> (grains minuscules qui collent et retiennent l'eau). Ajoutez l'<b>humus</b> (les déchets végétaux décomposés, la « colle vivante ») et le <b>calcaire</b>, et vous avez votre sol.</div>
      {TYPES_SOL.map((t) => (
        <details key={t.id} className="box">
          <summary>{t.emoji} {t.nom} <span className="small muted" style={{ fontWeight: 400 }}>— {t.image}</span></summary>
          <p className="small"><b>Le reconnaître :</b> {t.reconnaitre}</p>
          <div className="grid">
            <div><b>✅ Atouts</b><ul className="ticks small">{t.plus.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><b>⚠️ Défauts</b><ul className="ticks small">{t.moins.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <b className="small">🛠️ L'améliorer</b><ul className="ticks small">{t.ameliorer.map((x) => <li key={x}>{x}</li>)}</ul>
          <div className="chips">{t.aime.map(plante).filter(Boolean).map((p) => <a key={p!.id} className="chip" href={href(`/plante/${p!.id}`)}><Vignette id={p!.id} emoji={p!.emoji} taille={18} /> {p!.nom}</a>)}</div>
        </details>
      ))}
      <h2>Ce que chaque plante préfère</h2>
      <div className="card" style={{ overflowX: "auto" }}><table className="table small"><tbody>
        {Object.entries(SOL_PLANTE).map(([id, t]) => { const p = plante(id); return p ? <tr key={id}><td style={{ whiteSpace: "nowrap" }}><a href={href(`/plante/${id}`)} className="row" style={{ gap: 6, flexWrap: "nowrap" }}><Vignette id={id} emoji={p.emoji} taille={22} /> {p.nom}</a></td><td>{t}</td></tr> : null; })}
      </tbody></table></div>
    </div>
  );
}

function Ph() {
  return (
    <div>
      <p>Le <b>pH</b> mesure si une terre est <b>acide</b> (comme le vinaigre), <b>neutre</b> ou <b>calcaire</b> (comme la craie). La plupart des légumes aiment une terre presque neutre (pH 6 à 7). Les myrtilles, azalées et hortensias bleus veulent une terre acide ; la lavande, les choux et la vigne aiment le calcaire.</p>
      <h2>Le test du chou rouge</h2>
      <ol className="steps">
        <li>Coupez un quart de chou rouge en morceaux, couvrez d'eau et faites bouillir 10 minutes. Filtrez : vous obtenez un jus violet (gardez-le au frigo 2 jours).</li>
        <li>Mélangez dans un verre 2 cuillères de terre et un peu d'eau distillée (ou de pluie). Laissez reposer 30 minutes.</li>
        <li>Prélevez l'eau claire du dessus et ajoutez-la à un peu de jus de chou. Regardez la couleur :</li>
      </ol>
      <div className="grid-sm">{PH_CHOU.map((c) => <div key={c.label} className="card" style={{ borderLeft: `10px solid ${c.couleur}` }}><b>{c.label}</b><div className="small">{c.ph}</div></div>)}</div>
      <p className="small muted">C'est une indication, pas une mesure précise. Pour être sûr : un kit de test de pH en jardinerie (quelques euros) ou une analyse de sol par un laboratoire (30 à 60 €), utile avant de planter un verger.</p>
      <h2>Le test du vinaigre (calcaire)</h2>
      <p>Une cuillère de terre sèche + quelques gouttes de vinaigre blanc : si ça mousse, la terre contient du calcaire. Plus ça mousse, plus il y en a.</p>
      <h2>Les plantes qui renseignent</h2>
      <div className="card" style={{ overflowX: "auto" }}><table className="table small"><thead><tr><th>Si vous voyez beaucoup de…</th><th>Votre sol est…</th></tr></thead><tbody>
        <tr><td>Mousse, fougère, bruyère, digitale, petite oseille</td><td>Acide</td></tr>
        <tr><td>Coquelicot, chicorée sauvage, sauge des prés, trèfle</td><td>Calcaire, sec</td></tr>
        <tr><td>Ortie, rumex, mouron des oiseaux, chénopode</td><td>Riche en azote (fertile)</td></tr>
        <tr><td>Prêle, renoncule rampante, jonc, menthe sauvage</td><td>Humide, mal drainé</td></tr>
        <tr><td>Pâquerette, plantain, pissenlit en masse dans l'herbe rase</td><td>Tassé (piétiné)</td></tr>
        <tr><td>Chiendent, liseron</td><td>Travaillé souvent, déséquilibré</td></tr>
      </tbody></table></div>
      <p className="small">Une plante seule ne suffit pas : c'est quand une espèce domine qu'elle renseigne.</p>
    </div>
  );
}

function Vie() {
  return (
    <div>
      <p>Un sol n'est pas de la « terre morte » : une poignée contient des milliards d'êtres vivants (vers, champignons, bactéries, insectes). Ce sont eux qui transforment les feuilles mortes et le compost en nourriture pour les plantes. <b>Nourrir le sol, c'est nourrir les plantes.</b></p>
      {srcVignette("paillage") && <img src={srcVignette("paillage")} alt="Planche paillée" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10 }} />}
      <h2>Les 5 règles d'un sol vivant</h2>
      <ol className="steps">
        <li><b>Jamais nu</b> : paillage (paille, feuilles, tontes séchées) ou engrais vert. Le soleil et la pluie abîment une terre nue. <a href={href("/guide/paillage")}>Pailler</a></li>
        <li><b>Nourri chaque année</b> : 2 à 3 kg de compost par m², posé en surface. <a href={href("/guide/compost-tas")}>Faire son compost</a></li>
        <li><b>Peu retourné</b> : on aère à la grelinette ou à la fourche sans retourner les couches ; le bêchage profond enterre la vie du dessus et remonte les graines de mauvaises herbes.</li>
        <li><b>Jamais piétiné</b> là où l'on cultive : des allées fixes.</li>
        <li><b>Sans produits chimiques</b> : désherbants et pesticides tuent la vie du sol (et sont interdits aux particuliers).</li>
      </ol>
      <div className="callout ok small"><b>Comment savoir si ça marche ?</b>Comptez les vers de terre dans une motte chaque printemps : plus de 10 par bêchée, votre sol est en pleine forme.</div>
      <p className="small"><A to="/guide/engrais-verts">Semer des engrais verts →</A> · <A to="/guide/sol-pollue">Sols pollués en ville →</A></p>
    </div>
  );
}
