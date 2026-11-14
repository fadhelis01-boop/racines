import { useState } from "react";
import { useStore, upsert, uid, getState } from "../lib/store";
import { recommander, relations, type Profil } from "../lib/garden";
import { moisAffiches } from "../lib/calendar";
import { MOIS_NOMS } from "../data/util";
import { href, go } from "../lib/router";
import { Listen, MonthGrid, toast, A } from "../components/ui";
import type { Situation } from "../lib/store";

const OBJ = [
  { id: "faciles", label: "Des légumes faciles pour débuter", e: "🌱" },
  { id: "autonomie", label: "Gagner en autonomie alimentaire", e: "🥔" },
  { id: "aromatiques", label: "Des herbes aromatiques", e: "🌿" },
  { id: "fruits", label: "Des fruits", e: "🍓" },
  { id: "enfants", label: "Jardiner avec des enfants", e: "🧒" },
  { id: "animaux", label: "Nourrir mes animaux", e: "🐔" },
];

export default function Creer() {
  const settings = useStore((s) => s.settings);
  const [step, setStep] = useState(0);
  const [pr, setPr] = useState<Profil>({ situation: settings.situation as Situation, expo: "soleil", temps: "moyen", surface: settings.situation === "balcon" ? 4 : settings.situation === "appartement" ? 1 : 20, objectifs: ["faciles"] });
  const reco = step === 4 ? recommander(pr) : null;
  const tog = (o: string) => setPr({ ...pr, objectifs: pr.objectifs.includes(o) ? pr.objectifs.filter((x) => x !== o) : [...pr.objectifs, o] });

  const creerPlanches = () => {
    const n = pr.situation === "jardin" || pr.situation === "petit-jardin" ? Math.max(2, Math.min(8, Math.round(pr.surface / 5))) : 0;
    const type = pr.surface <= 6 ? "carre" : "planche";
    const base = getState().espaces.length;
    if (n) for (let i = 1; i <= n; i++) upsert("espaces", { id: uid(), nom: `${type === "carre" ? "Carré" : "Planche"} ${base + i}`, type, surface: Math.round((pr.surface / n) * 10) / 10 });
    else upsert("espaces", { id: uid(), nom: pr.situation === "balcon" ? "Balcon" : "Rebord de fenêtre", type: pr.situation === "balcon" ? "bac" : "interieur" });
    toast("Emplacements créés dans Mon jardin");
    go("/jardin/plan");
  };

  return (
    <div>
      <h1>👨‍🌾 Créer mon potager</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Cinq questions, et Racines vous propose quoi cultiver, comment installer votre potager et le planning de votre première année.</p>
      <div className="progress" style={{ margin: "10px 0 16px" }}><div style={{ width: `${(step / 4) * 100}%` }} /></div>

      {step === 0 && (
        <div className="card stack">
          <h3>Où ?</h3>
          {([["jardin", "🏡 Jardin (pleine terre)"], ["petit-jardin", "🌿 Petit jardin, cour, carrés"], ["balcon", "🏢 Balcon ou terrasse"], ["appartement", "🏙️ Appartement (rebord de fenêtre)"]] as [Situation, string][]).map(([k, l]) => (
            <label key={k} className="row" style={{ cursor: "pointer" }}><input type="radio" checked={pr.situation === k} onChange={() => setPr({ ...pr, situation: k })} /> {l}</label>
          ))}
          <label className="field">Surface disponible : <b>{pr.surface} m²</b>
            <input type="range" min={pr.situation === "appartement" ? 0.5 : 1} max={pr.situation === "jardin" ? 200 : pr.situation === "petit-jardin" ? 40 : 20} step={pr.situation === "appartement" ? 0.5 : 1} value={pr.surface} onChange={(e) => setPr({ ...pr, surface: Number(e.target.value) })} style={{ width: "100%" }} />
          </label>
          <button className="btn primary" onClick={() => setStep(1)}>Continuer</button>
        </div>
      )}
      {step === 1 && (
        <div className="card stack">
          <h3>Combien de soleil en été ?</h3>
          <label className="row"><input type="radio" checked={pr.expo === "soleil"} onChange={() => setPr({ ...pr, expo: "soleil" })} /> ☀️ Plus de 6 heures de soleil direct (sud, ouest)</label>
          <label className="row"><input type="radio" checked={pr.expo === "mi-ombre"} onChange={() => setPr({ ...pr, expo: "mi-ombre" })} /> ⛅ 3 à 6 heures (est, ou ombre d'arbres une partie du jour)</label>
          <label className="row"><input type="radio" checked={pr.expo === "ombre"} onChange={() => setPr({ ...pr, expo: "ombre" })} /> ☁️ Moins de 3 heures (nord, cour ombragée)</label>
          <div className="row"><button className="btn" onClick={() => setStep(0)}>← Retour</button><button className="btn primary" onClick={() => setStep(2)}>Continuer</button></div>
        </div>
      )}
      {step === 2 && (
        <div className="card stack">
          <h3>Combien de temps par semaine ?</h3>
          <label className="row"><input type="radio" checked={pr.temps === "peu"} onChange={() => setPr({ ...pr, temps: "peu" })} /> ⏱ Moins d'une heure</label>
          <label className="row"><input type="radio" checked={pr.temps === "moyen"} onChange={() => setPr({ ...pr, temps: "moyen" })} /> ⏱⏱ 1 à 3 heures</label>
          <label className="row"><input type="radio" checked={pr.temps === "beaucoup"} onChange={() => setPr({ ...pr, temps: "beaucoup" })} /> ⏱⏱⏱ Plus de 3 heures, j'aime ça !</label>
          <div className="row"><button className="btn" onClick={() => setStep(1)}>← Retour</button><button className="btn primary" onClick={() => setStep(3)}>Continuer</button></div>
        </div>
      )}
      {step === 3 && (
        <div className="card stack">
          <h3>Vos envies</h3>
          {OBJ.filter((o) => o.id !== "animaux" || pr.situation === "jardin").map((o) => (
            <label key={o.id} className="row" style={{ cursor: "pointer" }}><input type="checkbox" checked={pr.objectifs.includes(o.id)} onChange={() => tog(o.id)} /> {o.e} {o.label}</label>
          ))}
          <div className="row"><button className="btn" onClick={() => setStep(2)}>← Retour</button><button className="btn primary" onClick={() => setStep(4)}>Voir mon potager</button></div>
        </div>
      )}
      {reco && (
        <div>
          <div className="row between">
            <h2 style={{ margin: 0 }}>Votre potager sur mesure</h2>
            <Listen id="reco" title="Mon potager sur mesure" blocks={[`Méthode conseillée : ${reco.methode}`, `Plantes proposées : ${reco.plantes.map((p) => p.nom).join(", ")}.`, ...reco.conseils]} />
          </div>
          <div className="callout ok"><b>🛠️ Méthode conseillée</b>{reco.methode}</div>
          <h3>🌱 {reco.plantes.length} plantes proposées</h3>
          <div className="chips">{reco.plantes.map((p) => <a key={p.id} className="chip" href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom}</a>)}</div>
          {(() => {
            const rel = relations(reco.plantes.map((p) => p.id)).filter((r) => r.type === "ennemi");
            return rel.length ? <div className="callout warn small"><b>Placement</b>À ne pas mettre côte à côte : {rel.map((r) => `${r.a.nom} et ${r.b.nom}`).join(" ; ")}. <A to="/associations">Outil d'associations</A></div> : null;
          })()}
          {reco.verger.length > 0 && (
            <>
              <h3>🍎 Verger et petits fruits</h3>
              <div className="chips">{reco.verger.map((p) => <a key={p.id} className="chip" href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom}</a>)}</div>
              <p className="small muted">Ils produisent pendant des années : c'est le meilleur investissement d'un jardin familial.</p>
            </>
          )}
          <h3>📅 Votre première année</h3>
          <div className="card" style={{ overflowX: "auto" }}><div style={{ minWidth: 520 }}><MonthGrid plantes={reco.plantes} zone={settings.zone} /></div></div>
          <h3>Mois par mois</h3>
          {MOIS_NOMS.map((m, i) => {
            const mo = i + 1;
            const t = (a: "semisAbri" | "semisPlace" | "plantation" | "recolte") => reco.plantes.filter((p) => moisAffiches(p, a, settings.zone).has(mo)).map((p) => p.nom);
            const parts = [["Semer à l'abri", t("semisAbri")], ["Semer en place", t("semisPlace")], ["Planter", t("plantation")], ["Récolter", t("recolte")]].filter(([, l]) => (l as string[]).length);
            return parts.length ? <details key={m} className="box"><summary>{m}</summary>{parts.map(([k, l]) => <p key={k as string} className="small" style={{ margin: "4px 0" }}><b>{k as string} :</b> {(l as string[]).join(", ")}</p>)}</details> : null;
          })}
          <h3>💡 Conseils</h3>
          <ul className="ticks">{reco.conseils.map((c) => <li key={c}>{c}</li>)}</ul>
          <h3>Étapes suivantes</h3>
          <div className="grid-sm">
            <a className="btn" href={href("/guide/creer-potager")}>📘 Le guide complet A à Z</a>
            <a className="btn" href={href(pr.situation === "balcon" || pr.situation === "appartement" ? "/guide/potager-balcon" : "/guide/methodes-culture")}>🟫 Installer</a>
            <a className="btn" href={href("/guide/compost-tas")}>♻️ Démarrer le compost</a>
            <button className="btn primary" onClick={creerPlanches}>🗺️ Créer mes emplacements</button>
          </div>
          <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => setStep(0)}>Recommencer</button>
        </div>
      )}
    </div>
  );
}
