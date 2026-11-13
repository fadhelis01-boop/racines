import { useEffect, useState } from "react";
import { guide, lienVers, RUBRIQUES } from "../data/index";
import { Back, Listen, Videos, A, Empty, Photo } from "../components/ui";
import { href } from "../lib/router";
import { useStore, setSettings } from "../lib/store";
import { play, pause, stop, keepAwake, listenCommands, voiceCommandsSupported, useTts } from "../lib/tts";
import type { EtapeGuide, Guide } from "../data/types";

const etapeTexte = (e: EtapeGuide, i: number) => [`Étape ${i + 1}. ${e.titre}.`, e.texte, e.attention ? `Attention : ${e.attention}` : "", e.astuce ? `Astuce : ${e.astuce}` : ""].filter(Boolean).join(" ");

export default function GuideFiche({ id }: { id?: string }) {
  const g = id ? guide(id) : undefined;
  const sensibleOk = useStore((s) => s.settings.sensible);
  const [accord, setAccord] = useState(false);
  const [pasAPas, setPasAPas] = useState(false);
  if (!g) return <Empty emoji="🤷">Tutoriel introuvable. <A to="/guides">Tous les tutoriels</A></Empty>;

  if (g.sensible && !sensibleOk && !accord) {
    return (
      <div>
        <Back />
        <div className="card" style={{ marginTop: 12 }}>
          <h1>{g.emoji} {g.titre}</h1>
          <p>Ce tutoriel décrit l'abattage et la préparation d'un animal pour la consommation familiale, de façon précise et sans images choquantes.</p>
          <p className="small muted">Il est réservé aux adultes qui élèvent leurs animaux pour leur viande. Les étapes sont détaillées pour que le geste soit rapide et respectueux de l'animal.</p>
          <div className="row">
            <button className="btn primary" onClick={() => setAccord(true)}>Afficher le tutoriel</button>
            <button className="btn" onClick={() => { setSettings({ sensible: true }); }}>Toujours afficher</button>
          </div>
        </div>
      </div>
    );
  }

  const blocs = [`${g.titre}. ${g.resume}`, ...(g.quand ? [`Quand : ${g.quand}`] : []), ...(g.materiel?.length ? ["Matériel : " + g.materiel.join(", ") + "."] : []), ...g.etapes.map(etapeTexte), ...(g.conseils ?? []).map((c) => `Conseil : ${c}`), ...(g.erreurs ?? []).map((c) => `Erreur à éviter : ${c}`)];

  return (
    <div>
      <Back />
      <span className="badge green" style={{ marginTop: 8 }}>{RUBRIQUES[g.rubrique].emoji} {RUBRIQUES[g.rubrique].label}</span>
      <h1 style={{ marginTop: 8 }}>{g.emoji} {g.titre}</h1>
      <div className="guide-hero"><Photo id={g.id} emoji="" alt="" /></div>
      <p>{g.resume}</p>
      <div className="row">
        <span className="badge">{["", "Facile", "Intermédiaire", "Avancé"][g.niveau]}</span>
        <span className="badge green">⏱ {g.duree}</span>
      </div>
      <div className="row" style={{ margin: "14px 0" }}>
        <button className="btn primary big" onClick={() => setPasAPas(true)}>👐 Mode pas à pas</button>
        <Listen id={`g-${g.id}`} title={g.titre} blocks={blocs} label="Tout écouter" />
      </div>
      {g.quand && <div className="callout info"><b>📆 Quand</b>{g.quand}</div>}
      {g.materiel && (
        <div className="card"><b>🧰 Matériel</b><ul className="ticks small">{g.materiel.map((m) => <li key={m}>{m}</li>)}</ul></div>
      )}
      <h2>Étapes</h2>
      <ol className="steps">
        {g.etapes.map((e) => (
          <li key={e.titre}>
            <b>{e.titre}</b>
            <p style={{ margin: "4px 0" }}>{e.texte}</p>
            {e.attention && <div className="callout danger small"><b>⚠️ Attention</b>{e.attention}</div>}
            {e.astuce && <div className="callout ok small"><b>💡 Astuce</b>{e.astuce}</div>}
          </li>
        ))}
      </ol>
      {g.conseils && <><h2>Conseils</h2><ul className="ticks">{g.conseils.map((c) => <li key={c}>{c}</li>)}</ul></>}
      {g.erreurs && <><h2>Erreurs à éviter</h2><ul className="ticks">{g.erreurs.map((c) => <li key={c}>{c}</li>)}</ul></>}
      <h2>🎬 En vidéo</h2>
      <Videos id={`g-${g.id}`} query={g.video} />
      {g.liens && g.liens.length > 0 && (
        <>
          <h2>Pour aller plus loin</h2>
          <div className="chips">{g.liens.map((l) => { const x = lienVers(l); return x ? <a key={l} className="chip" href={href(x.href)}>{x.emoji} {x.label}</a> : null; })}</div>
        </>
      )}
      {pasAPas && <PasAPas g={g} onClose={() => setPasAPas(false)} />}
    </div>
  );
}

// Plein écran, grandes étapes, lecture automatique, écran maintenu allumé,
// commandes vocales « suivant », « précédent », « répète », « stop ».
function PasAPas({ g, onClose }: { g: Guide; onClose: () => void }) {
  const [i, setI] = useState(-1); // -1 = matériel
  const [voix, setVoix] = useState(false);
  const playing = useTts((s) => s.playing && s.key === `pap-${g.id}`);
  const total = g.etapes.length;
  const lire = (k: number) => {
    const txt = k < 0 ? `${g.titre}. Préparez le matériel : ${(g.materiel ?? ["rien de particulier"]).join(", ")}. Dites « suivant » ou appuyez sur Suivant quand vous êtes prêt.` : etapeTexte(g.etapes[k], k);
    play({ key: `pap-${g.id}`, title: g.titre, blocks: [txt], continu: false });
  };
  const aller = (k: number) => {
    const n = Math.max(-1, Math.min(total - 1, k));
    setI(n);
    lire(n);
  };
  useEffect(() => {
    void keepAwake(true);
    lire(-1);
    return () => {
      void keepAwake(false);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!voix) return;
    return listenCommands({ suivant: () => setI((x) => { const n = Math.min(total - 1, x + 1); lire(n); return n; }), precedent: () => setI((x) => { const n = Math.max(-1, x - 1); lire(n); return n; }), repeter: () => setI((x) => { lire(x); return x; }), stop: () => pause() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voix]);
  const e = i >= 0 ? g.etapes[i] : null;
  return (
    <div className="stepper" role="dialog" aria-modal="true" aria-label={`Mode pas à pas : ${g.titre}`}>
      <div className="row between" style={{ maxWidth: 760, width: "100%", margin: "0 auto" }}>
        <button className="btn ghost" onClick={onClose}>✕ Fermer</button>
        <span className="small muted">{i < 0 ? "Préparation" : `Étape ${i + 1} / ${total}`}</span>
        {voiceCommandsSupported() && <button className={`btn sm ${voix ? "primary" : ""}`} onClick={() => setVoix(!voix)} title="Dites : suivant, précédent, répète, stop">🎙️ {voix ? "Écoute" : "Voix"}</button>}
      </div>
      <div className="progress" style={{ maxWidth: 760, width: "100%", margin: "10px auto 0" }}><div style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
      <div className="body">
        {e ? (
          <>
            <h2>{e.titre}</h2>
            <p>{e.texte}</p>
            {e.attention && <div className="callout danger"><b>⚠️ Attention</b>{e.attention}</div>}
            {e.astuce && <div className="callout ok"><b>💡 Astuce</b>{e.astuce}</div>}
          </>
        ) : (
          <>
            <h2>{g.emoji} {g.titre}</h2>
            <p>Préparez tout avant de commencer.</p>
            {g.materiel ? <ul className="ticks" style={{ fontSize: "1.15rem" }}>{g.materiel.map((m) => <li key={m}>{m}</li>)}</ul> : <p>Pas de matériel particulier.</p>}
          </>
        )}
        {voix && <p className="small muted">🎙️ Dites « suivant », « précédent », « répète » ou « stop ».</p>}
      </div>
      <div className="bar">
        <button className="btn big" disabled={i < 0} onClick={() => aller(i - 1)}>⬅️ Préc.</button>
        <button className="btn big" onClick={() => (playing ? pause() : lire(i))}>{playing ? "⏸ Pause" : "🔊 Répéter"}</button>
        {i < total - 1 ? <button className="btn big primary" onClick={() => aller(i + 1)}>Suiv. ➡️</button> : <button className="btn big primary" onClick={onClose}>✅ Terminé</button>}
      </div>
    </div>
  );
}
