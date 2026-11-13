import { useState } from "react";
import { setSettings, type Situation } from "../lib/store";
import { ZONES } from "../data/index";
import type { ZoneId } from "../data/calendrier";
import { chercherVille } from "../lib/meteo";
import { Logo } from "../App";
import { sayOnce } from "../lib/tts";

const SITUATIONS: { id: Situation; e: string; t: string; s: string }[] = [
  { id: "jardin", e: "🏡", t: "Maison avec jardin", s: "Potager, verger, peut-être des animaux" },
  { id: "petit-jardin", e: "🌿", t: "Petit jardin ou cour", s: "Quelques m² de terre ou de carrés" },
  { id: "balcon", e: "🏢", t: "Balcon ou terrasse", s: "Pots et jardinières" },
  { id: "appartement", e: "🏙️", t: "Appartement sans extérieur", s: "Rebord de fenêtre et plantes d'intérieur" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState<Situation>("jardin");
  const [zone, setZone] = useState<ZoneId>("tempere");
  const [q, setQ] = useState("");
  const [villes, setVilles] = useState<{ nom: string; lat: number; lon: number }[]>([]);
  const [ville, setVille] = useState<{ nom: string; lat: number; lon: number } | null>(null);
  const [err, setErr] = useState("");
  const [animaux, setAnimaux] = useState(true);

  const finish = () => setSettings({ onboarded: true, situation, zone, ville, animauxActifs: animaux });

  return (
    <div className="main" style={{ maxWidth: 640, paddingBottom: 40 }}>
      <div className="brand" style={{ marginBottom: 20 }}><Logo /> Racines</div>
      {step === 0 && (
        <div className="stack">
          <h1>Bienvenue au jardin 🌱</h1>
          <p>Racines vous accompagne pour créer votre potager de A à Z, savoir quoi faire chaque mois, soigner vos plantes (même d'intérieur), reconnaître maladies et parasites, et prendre soin de vos animaux.</p>
          <p>Chaque fiche et chaque tutoriel peuvent être <b>lus à voix haute</b> : pratique quand on a les mains dans la terre.</p>
          <p className="muted small">Tout fonctionne hors connexion et vos données restent sur cet appareil.</p>
          <div className="row">
            <button className="btn primary big" onClick={() => setStep(1)}>Commencer</button>
            <button className="btn" onClick={() => sayOnce("Bienvenue dans Racines. Chaque fiche et chaque tutoriel peuvent être lus à voix haute. Appuyez sur Commencer pour configurer votre jardin.")}>🔊 Tester la voix</button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="stack">
          <h1>Où jardinez-vous ?</h1>
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            {SITUATIONS.map((s) => (
              <button key={s.id} className={`card row ${situation === s.id ? "on" : ""}`} style={{ textAlign: "left", cursor: "pointer", borderColor: situation === s.id ? "var(--green)" : undefined, borderWidth: situation === s.id ? 2 : 1 }} onClick={() => setSituation(s.id)}>
                <span style={{ fontSize: "2rem" }}>{s.e}</span>
                <span><b>{s.t}</b><br /><span className="muted small">{s.s}</span></span>
              </button>
            ))}
          </div>
          <div className="row"><button className="btn" onClick={() => setStep(0)}>← Retour</button><button className="btn primary" onClick={() => setStep(2)}>Continuer</button></div>
        </div>
      )}
      {step === 2 && (
        <div className="stack">
          <h1>Votre climat</h1>
          <p className="muted">Le calendrier de toutes les fiches est décalé automatiquement selon votre climat.</p>
          {ZONES.map((z) => (
            <label key={z.id} className="card row" style={{ cursor: "pointer", borderColor: zone === z.id ? "var(--green)" : undefined }}>
              <input type="radio" name="zone" checked={zone === z.id} onChange={() => setZone(z.id)} />
              <span><b>{z.nom}</b><br /><span className="small muted">Dernières gelées : {z.gel}</span></span>
            </label>
          ))}
          <h2>Votre ville (facultatif)</h2>
          <p className="small muted">Pour la météo et les alertes gel, canicule, fortes pluies. Seules les coordonnées de la ville sont envoyées au service météo public Open-Meteo.</p>
          <form className="row" onSubmit={async (e) => { e.preventDefault(); setErr(""); try { setVilles(await chercherVille(q)); } catch { setErr("Recherche impossible (hors connexion ?). Vous pourrez l'ajouter plus tard dans les réglages."); } }}>
            <input type="search" placeholder="Nom de votre commune" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1 }} />
            <button className="btn">Chercher</button>
          </form>
          {err && <p className="small" style={{ color: "var(--danger)" }}>{err}</p>}
          {villes.length > 0 && (
            <div className="chips">{villes.map((v) => <button key={v.nom + v.lat} className={`chip ${ville?.nom === v.nom ? "on" : ""}`} onClick={() => setVille(v)}>{v.nom}</button>)}</div>
          )}
          <div className="row"><button className="btn" onClick={() => setStep(1)}>← Retour</button><button className="btn primary" onClick={() => setStep(situation === "jardin" ? 3 : 4)}>Continuer</button></div>
        </div>
      )}
      {step === 3 && (
        <div className="stack">
          <h1>Des animaux ?</h1>
          <p>Poules, canards, lapins, chèvres, moutons, ânes, abeilles… Racines vous aide à les soigner au quotidien, à les nourrir avec le jardin et à utiliser leur fumier.</p>
          <label className="card row" style={{ cursor: "pointer" }}><input type="radio" checked={animaux} onChange={() => setAnimaux(true)} /> Oui, ou j'y pense : afficher les conseils pour les animaux</label>
          <label className="card row" style={{ cursor: "pointer" }}><input type="radio" checked={!animaux} onChange={() => setAnimaux(false)} /> Non, seulement le jardin</label>
          <div className="row"><button className="btn" onClick={() => setStep(2)}>← Retour</button><button className="btn primary" onClick={() => setStep(4)}>Continuer</button></div>
        </div>
      )}
      {step === 4 && (
        <div className="stack">
          <h1>C'est prêt ! 🎉</h1>
          <p>Pour aller plus loin :</p>
          <ul className="ticks">
            <li><b>Créer mon potager</b> : un assistant vous propose un plan adapté à votre espace et à votre temps.</li>
            <li><b>Calendrier</b> : ce qu'il faut semer, planter, récolter et faire ce mois-ci, exportable dans l'agenda de votre téléphone.</li>
            <li><b>Santé</b> : diagnostic d'une plante malade en quelques questions, ou par photo.</li>
            <li><b>Installer l'application</b> : sur iPhone, bouton Partager puis « Sur l'écran d'accueil » ; sur Android et ordinateur, menu du navigateur puis « Installer ».</li>
          </ul>
          <button className="btn primary big" onClick={finish}>Aller au jardin</button>
        </div>
      )}
    </div>
  );
}
