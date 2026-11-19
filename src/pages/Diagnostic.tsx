import { useState } from "react";
import { PLANTES, SIGNES, plante, TYPES_PROBLEME } from "../data/index";
import { PictoSigne } from "../components/PictoSigne";
import { useRoute, href } from "../lib/router";
import { diagnostiquer, norm } from "../lib/garden";
import { Back, Listen, Titre } from "../components/ui";

const ORGANES = [
  { id: "feuilles", label: "Les feuilles", e: "🍃" },
  { id: "fruits", label: "Les fruits ou légumes", e: "🍅" },
  { id: "tiges", label: "Les tiges ou le tronc", e: "🌲" },
  { id: "racines", label: "Les racines, le pied, la terre", e: "🥕" },
  { id: "plante", label: "Toute la plante", e: "🌿" },
  { id: "plantule", label: "Les jeunes semis", e: "🌱" },
  { id: "fleurs", label: "Les fleurs", e: "🌸" },
];

export default function Diagnostic() {
  const route = useRoute();
  const [planteId, setPlanteId] = useState(route.query.get("plante") ?? "");
  const [interieur] = useState(route.query.get("interieur") === "1");
  const [organe, setOrgane] = useState("");
  const [signes, setSignes] = useState<string[]>([]);
  const [step, setStep] = useState(planteId ? 1 : 0);
  const [qp, setQp] = useState("");
  const pl = planteId ? plante(planteId) : undefined;
  const choix = PLANTES.filter((p) => (interieur ? p.categorie === "interieur" : true)).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const signesOrgane = Object.entries(SIGNES).filter(([, s]) => !organe || s.organe === organe || organe === "plante");
  const res = step === 3 ? diagnostiquer({ planteId: planteId || undefined, signes, mois: new Date().getMonth() + 1, interieur: interieur || pl?.categorie === "interieur" }) : [];

  return (
    <div>
      <Back />
      <Titre ico="diagnostic" emoji="🔎">Qu'est-ce qui ne va pas ?</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>Trois questions pour trouver les causes les plus probables. Observez la plante de près, dessus ET dessous des feuilles, idéalement avec une loupe.</p>

      {step === 0 && (
        <div className="card">
          <h3>1. Quelle plante ?</h3>
          <input type="search" placeholder="Tapez le nom : tomate, monstera, basilic…" value={qp} aria-label="Chercher la plante par son nom"
            onChange={(e) => { setQp(e.target.value); const n = norm(e.target.value.trim()); const t = n.length >= 2 ? choix.find((p) => norm([p.nom, ...(p.alias ?? [])].join(" ")).includes(n)) : undefined; if (t) setPlanteId(t.id); }} style={{ marginBottom: 6 }} />
          <select value={planteId} onChange={(e) => setPlanteId(e.target.value)}>
            <option value="">— Je ne sais pas / autre plante —</option>
            {choix.filter((p) => qp.trim().length < 2 || norm([p.nom, ...(p.alias ?? [])].join(" ")).includes(norm(qp.trim())) || p.id === planteId).map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nom}</option>)}
          </select>
          <p className="small muted" style={{ margin: "6px 0 0" }}>Vous ne connaissez pas son nom ? Choisissez « Je ne sais pas » : le diagnostic marche quand même.</p>
          <div className="row" style={{ marginTop: 12 }}><button className="btn primary" onClick={() => setStep(1)}>Continuer</button></div>
        </div>
      )}
      {step === 1 && (
        <div className="card">
          <h3>2. Où voyez-vous le problème{pl ? ` sur ${pl.nom.toLowerCase()}` : ""} ?</h3>
          <div className="grid-sm">
            {ORGANES.map((o) => (
              <button key={o.id} className={`btn big ${organe === o.id ? "primary" : ""}`} onClick={() => { setOrgane(o.id); setStep(2); }}>{o.e} {o.label}</button>
            ))}
          </div>
          <button className="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setStep(0)}>← Changer de plante</button>
        </div>
      )}
      {step === 2 && (
        <div className="card">
          <h3>3. Que voyez-vous ? <span className="muted small">(plusieurs choix possibles)</span></h3>
          <div className="stack">
            {signesOrgane.map(([k, s]) => (
              <label key={k} className="row" style={{ cursor: "pointer", padding: "6px 0" }}>
                <input type="checkbox" checked={signes.includes(k)} onChange={() => setSignes(signes.includes(k) ? signes.filter((x) => x !== k) : [...signes, k])} style={{ width: 22, height: 22 }} />
                <span className="row" style={{ gap: 8, flexWrap: "nowrap" }}><PictoSigne id={k} />{s.label}</span>
              </label>
            ))}
          </div>
          <details className="box"><summary>Autres signes (ailleurs sur la plante)</summary>
            {Object.entries(SIGNES).filter(([k]) => !signesOrgane.some(([j]) => j === k)).map(([k, s]) => (
              <label key={k} className="row" style={{ cursor: "pointer", padding: "4px 0" }}>
                <input type="checkbox" checked={signes.includes(k)} onChange={() => setSignes(signes.includes(k) ? signes.filter((x) => x !== k) : [...signes, k])} />
                <span className="row" style={{ gap: 8, flexWrap: "nowrap" }}><PictoSigne id={k} />{s.label}</span>
              </label>
            ))}
          </details>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => setStep(1)}>← Retour</button>
            <button className="btn primary" disabled={!signes.length} onClick={() => setStep(3)}>Voir les causes possibles</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div className="row between">
            <h2 style={{ margin: 0 }}>Causes les plus probables</h2>
            <Listen id="diag" title="Résultat du diagnostic" blocks={res.slice(0, 4).map((r, i) => `Hypothèse ${i + 1} : ${r.p.nom}. ${r.p.symptomes.join(" ")} À faire : ${r.p.traitements[0] ?? r.p.prevention[0]}`)} />
          </div>
          {!res.length && <p>Aucune correspondance. Essayez d'autres signes, ou l'<a href={href("/identifier")}>identification par photo</a>.</p>}
          {res.map((r, i) => (
            <a key={r.p.id} className="card" href={href(`/probleme/${r.p.id}`)} style={{ display: "block", textDecoration: "none", color: "inherit", borderColor: i === 0 ? "var(--green)" : undefined }}>
              <div className="row between">
                <b>{i + 1}. {r.p.nom}</b>
                <span className="badge">{TYPES_PROBLEME[r.p.type]}</span>
              </div>
              <p className="small" style={{ margin: "6px 0" }}>{r.p.symptomes[0]}</p>
              {r.p.confusion && <p className="small muted" style={{ margin: 0 }}>↔ {r.p.confusion}</p>}
              <p className="small" style={{ margin: "6px 0 0", color: "var(--green)" }}>Correspond à : {r.communs.map((c) => SIGNES[c].label.toLowerCase()).join(", ")} · voir la fiche →</p>
            </a>
          ))}
          <div className="callout info small" style={{ marginTop: 12 }}>
            <b>Bon à savoir</b>
            Avant d'accuser une maladie, vérifiez l'arrosage (trop ou pas assez), le soleil (brûlures), le froid et le pot : ce sont les causes les plus fréquentes. Un doute ? Prenez une photo et utilisez l'<a href={href("/identifier")}>identification par photo</a>, ou montrez un rameau à une jardinerie ou à un club de jardiniers.
          </div>
          <button className="btn" onClick={() => { setSignes([]); setOrgane(""); setStep(planteId ? 1 : 0); }}>Recommencer</button>
        </div>
      )}
    </div>
  );
}
