import { useRef, useState } from "react";
import { useStore, upsert, uid, today } from "../lib/store";
import { identifyPlantNet, identifyClaude, claudeErrorMessage, savePhoto, type PlantNetResult, type ClaudeDiag } from "../lib/identify";
import { plante, probleme, animal } from "../data/index";
import { href } from "../lib/router";
import { Back, Listen, A, toast } from "../components/ui";
import IdentGuidee from "../components/IdentGuidee";

export default function Identifier() {
  const settings = useStore((s) => s.settings);
  const [photos, setPhotos] = useState<{ blob: Blob; url: string }[]>([]);
  const [organe, setOrgane] = useState("auto");
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState<"" | "plantnet" | "claude">("");
  const [err, setErr] = useState("");
  const [pn, setPn] = useState<PlantNetResult[] | null>(null);
  const [cl, setCl] = useState<ClaudeDiag | null>(null);
  const abort = useRef<AbortController | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    const next = [...photos, ...[...files].slice(0, 5 - photos.length).map((f) => ({ blob: f as Blob, url: URL.createObjectURL(f) }))];
    setPhotos(next);
    setPn(null);
    setCl(null);
  };

  const runPn = async () => {
    setErr(""); setBusy("plantnet"); setPn(null);
    try { setPn(await identifyPlantNet(photos.map((p) => p.blob), organe)); } catch (e) { setErr((e as Error).message); }
    setBusy("");
  };
  const runCl = async () => {
    setErr(""); setBusy("claude"); setCl(null);
    abort.current = new AbortController();
    try { setCl(await identifyClaude(photos.map((p) => p.blob), question, abort.current.signal)); } catch (e) { setErr(claudeErrorMessage(e)); }
    setBusy("");
  };
  const garder = async () => {
    const key = await savePhoto(photos[0].blob);
    const texte = cl ? `Photo analysée : ${cl.resume}` : pn?.[0] ? `Photo identifiée : ${pn[0].noms[0] ?? pn[0].latin} (${Math.round(pn[0].score * 100)} %)` : "Photo";
    upsert("notes", { id: uid(), date: today(), texte, photo: key, planteId: cl?.plante.fiche || pn?.[0]?.ficheId });
    toast("Ajoutée au journal de Mon jardin");
  };

  return (
    <div>
      <Back />
      <h1>📷 Identifier par photo</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Une plante, un arbre, un fruit, une fleur, un insecte, une feuille malade… Prenez une ou plusieurs photos nettes, en gros plan, à la lumière du jour.</p>

      <div className="card">
        <div className="row">
          <button className="btn primary big" onClick={() => camRef.current?.click()}>📸 Prendre une photo</button>
          <button className="btn big" onClick={() => fileRef.current?.click()}>🖼️ Choisir dans la galerie</button>
        </div>
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => add(e.target.files)} />
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
        {photos.length > 0 && (
          <div className="row" style={{ marginTop: 12 }}>
            {photos.map((p, i) => (
              <div key={p.url} style={{ position: "relative" }}>
                <img src={p.url} alt={`Photo ${i + 1}`} className="photo-thumb" />
                <button className="icon-btn" style={{ position: "absolute", top: -8, right: -8, width: 28, height: 28, fontSize: ".8rem" }} onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label="Retirer">✕</button>
              </div>
            ))}
          </div>
        )}
        <p className="small muted" style={{ marginBottom: 0 }}>Conseils : une photo de l'ensemble + un gros plan de la feuille (dessus et dessous) ou du fruit ou de l'insecte. Jusqu'à 5 photos.</p>
      </div>

      {photos.length > 0 && (
        <div className="grid" style={{ marginTop: 12 }}>
          <div className="card">
            <h3>🌿 Nom de la plante (Pl@ntNet)</h3>
            <p className="small muted">Gratuit, très fiable pour les espèces sauvages et cultivées. Ne reconnaît pas les maladies.</p>
            <label className="field">Organe photographié
              <select value={organe} onChange={(e) => setOrgane(e.target.value)}>
                <option value="auto">Automatique</option><option value="leaf">Feuille</option><option value="flower">Fleur</option><option value="fruit">Fruit</option><option value="bark">Écorce</option><option value="habit">Plante entière</option>
              </select>
            </label>
            {settings.plantnetKey ? (
              <button className="btn primary" disabled={!!busy} onClick={runPn} style={{ marginTop: 10 }}>{busy === "plantnet" ? "Analyse…" : "Identifier la plante"}</button>
            ) : (
              <p className="small">Ajoutez une clé gratuite dans les <A to="/reglages">réglages</A> (2 minutes, la marche à suivre y est expliquée).</p>
            )}
          </div>
          <div className="card">
            <h3>🩺 Plante, maladie, ravageur (Claude)</h3>
            <p className="small muted">Analyse complète : identification, problèmes de santé probables, ce qu'il faut vérifier et les gestes à faire. Avec votre clé personnelle (quelques centimes par analyse).</p>
            <label className="field">Votre question (facultatif)<input type="text" placeholder="Ex. : pourquoi mes feuilles de tomate jaunissent ?" value={question} onChange={(e) => setQuestion(e.target.value)} /></label>
            {settings.claudeKey ? (
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn primary" disabled={!!busy} onClick={runCl}>{busy === "claude" ? "Analyse en cours… (jusqu'à une minute)" : "Analyser"}</button>
                {busy === "claude" && <button className="btn ghost" onClick={() => abort.current?.abort()}>Annuler</button>}
              </div>
            ) : (
              <p className="small">Ajoutez votre clé d'API Claude dans les <A to="/reglages">réglages</A>.</p>
            )}
          </div>
        </div>
      )}

      {err && <div className="callout danger"><b>Oups</b>{err}</div>}

      {(() => {
        const dangers = [...(pn ?? []).filter((r) => r.score >= 0.1).map((r) => r.ficheId), cl?.plante.fiche].filter((id): id is string => !!id && !!plante(id)?.danger);
        return dangers.length ? (
          <div className="callout danger" style={{ marginTop: 12, border: "2px solid var(--danger)" }}>
            <b>☠️ Attention : plante potentiellement très toxique</b>
            Parmi les résultats figure {[...new Set(dangers)].map((id) => plante(id)!.nom).join(", ")}. Ne la consommez pas, éloignez-la des enfants et des animaux (enclos, prés, foin), manipulez-la avec des gants.
            <div className="row" style={{ marginTop: 6 }}>{[...new Set(dangers)].map((id) => <a key={id} className="btn sm" href={href(`/plante/${id}`)}>Fiche {plante(id)!.nom}</a>)}</div>
          </div>
        ) : null;
      })()}

      {pn && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Résultats Pl@ntNet</h3>
          {!pn.length && <p>Aucune espèce reconnue : essayez une photo plus nette d'une feuille ou d'une fleur.</p>}
          {pn.map((r) => {
            const f = r.ficheId ? plante(r.ficheId) : undefined;
            return (
              <div key={r.latin} className="task">
                <span className="badge green" style={{ minWidth: 52, textAlign: "center" }}>{Math.round(r.score * 100)} %</span>
                <span style={{ flex: 1 }}>
                  <b>{r.noms[0] ?? r.latin}</b> <i className="muted small">{r.latin}</i>
                  {r.noms.length > 1 && <div className="small muted">Aussi appelé : {r.noms.slice(1, 4).join(", ")}</div>}
                  {f && <div><a href={href(`/plante/${f.id}`)}>→ {r.exact ? "Voir la fiche" : "Fiche la plus proche (même genre) :"} {f.nom}</a></div>}
                  {f?.sosies?.length ? <div className="small muted">À ne pas confondre avec : {f.sosies.map((s) => s.nom).join(", ")}</div> : null}
                </span>
              </div>
            );
          })}
          <p className="small muted">Un score faible signifie une identification incertaine. Ne consommez jamais une plante sauvage sur la seule foi d'une identification par photo.</p>
          <button className="btn sm" onClick={garder}>📓 Garder dans mon journal</button>
        </div>
      )}

      {cl && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="row between">
            <h3 style={{ margin: 0 }}>Analyse</h3>
            <Listen id="analyse" title="Analyse de la photo" blocks={[cl.resume, ...cl.problemes.map((p) => `${p.nom}, confiance ${p.confiance}. ${p.indices}`), ...(cl.a_verifier.length ? ["À vérifier : " + cl.a_verifier.join(". ")] : []), ...(cl.actions.length ? ["Que faire : " + cl.actions.join(". ")] : []), ...(cl.comestible ? [cl.comestible] : [])]} />
          </div>
          {cl.urgence !== "aucune" && <span className={`badge ${cl.urgence.startsWith("agir aujourd") ? "danger" : cl.urgence.startsWith("agir") ? "sun" : ""}`}>Urgence : {cl.urgence}</span>}
          <p>{cl.resume}</p>
          {cl.plante.nom && (
            <p><b>Identification :</b> {cl.plante.nom} {cl.plante.latin && <i className="muted">({cl.plante.latin})</i>} — confiance {cl.plante.confiance}
              {cl.plante.fiche && (plante(cl.plante.fiche) || animal(cl.plante.fiche)) && <> · <a href={href(plante(cl.plante.fiche) ? `/plante/${cl.plante.fiche}` : `/animal/${cl.plante.fiche}`)}>voir la fiche →</a></>}
            </p>
          )}
          {cl.problemes.length > 0 && (
            <>
              <h3>Problèmes possibles</h3>
              {cl.problemes.map((p) => (
                <div key={p.nom} className="task">
                  <span className={`badge ${p.confiance === "élevée" ? "danger" : p.confiance === "moyenne" ? "sun" : ""}`}>{p.confiance}</span>
                  <span><b>{p.nom}</b> — {p.indices} {p.fiche && probleme(p.fiche) && <a href={href(`/probleme/${p.fiche}`)}>Fiche →</a>}</span>
                </div>
              ))}
            </>
          )}
          {cl.a_verifier.length > 0 && <><h3>À vérifier pour confirmer</h3><ul className="ticks">{cl.a_verifier.map((x) => <li key={x}>{x}</li>)}</ul></>}
          {cl.actions.length > 0 && <><h3>Que faire</h3><ol className="steps">{cl.actions.map((x) => <li key={x}>{x}</li>)}</ol></>}
          {cl.comestible && <div className="callout danger"><b>⚠️ Comestibilité</b>{cl.comestible}</div>}
          <p className="small muted">Analyse automatique, indicative : elle peut se tromper. En cas de doute sur un animal, appelez votre vétérinaire.</p>
          <button className="btn sm" onClick={garder}>📓 Garder dans mon journal</button>
        </div>
      )}

      {!photos.length && (
        <>
          <div className="card" style={{ marginTop: 12 }}>
            <h3>📱 Sans clé : les applications gratuites</h3>
            <p className="small">Pas besoin de clé pour identifier une plante : utilisez directement l'une de ces applications, puis cherchez le nom trouvé dans Racines (les noms courants et scientifiques sont reconnus).</p>
            <div className="row">
              <a className="btn" href="https://identify.plantnet.org/fr" target="_blank" rel="noreferrer">🌿 Pl@ntNet (site et appli)</a>
              <a className="btn" href="https://lens.google.com/" target="_blank" rel="noreferrer">🔍 Google Lens</a>
              <a className="btn" href={href("/recherche")}>Rechercher le nom trouvé</a>
            </div>
            <p className="small muted">Conseils pour une bonne identification : une feuille entière bien à plat, le dessus ET le dessous, une vue d'ensemble, et la fleur si possible. Pour une maladie, le <a href={href("/diagnostic")}>diagnostic guidé</a> fonctionne hors ligne.</p>
          </div>
          <div style={{ marginTop: 12 }}><IdentGuidee /></div>
        </>
      )}
    </div>
  );
}
