import MotsLexique from "../components/MotsLexique";
import { useState } from "react";
import { MALADIES_ANIMALES, SIGNES_ANIMAUX } from "../data/maladies-animales";
import { diagnostiquerAnimal } from "../lib/sante-animale";
import { ANIMAUX, animal } from "../data/index";
import { useRoute, href } from "../lib/router";
import { Back, Listen, Videos, A, Empty } from "../components/ui";
import { Vignette } from "../components/Ico";

const URGENCE = ["", "À surveiller", "Vétérinaire dans les jours qui viennent", "URGENCE : vétérinaire aujourd'hui"];
const CLASSE = ["", "green", "sun", "danger"];

const Urgence = ({ u }: { u: number }) => <span className={`badge ${CLASSE[u]}`}>{URGENCE[u]}</span>;

export function DiagnosticAnimal() {
  const route = useRoute();
  const [espece, setEspece] = useState(route.query.get("animal") ?? "");
  const [signes, setSignes] = useState<string[]>([]);
  const [step, setStep] = useState(espece ? 1 : 0);
  const a = espece ? animal(espece) : undefined;
  const utiles = new Set(MALADIES_ANIMALES.filter((m) => !espece || m.especes.includes(espece)).flatMap((m) => m.signesIds));
  // Signes propres aux oiseaux (ponte, couvaison, coups de bec) : masqués pour les mammifères et les abeilles
  if (["lapin", "chevre", "mouton", "ane", "cheval", "cochon", "abeille"].includes(espece)) for (const k of ["ponte-baisse", "oeufs-anormaux", "couve", "coups-de-bec"]) utiles.delete(k);
  const res = step === 2 ? diagnostiquerAnimal(espece, signes) : [];
  const urgent = res.some((r) => r.m.urgence === 3 && r.score >= 10);
  return (
    <div>
      <Back />
      <h1>⚕️ Mon animal ne va pas bien</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Deux questions pour orienter vers les causes les plus probables et savoir s'il faut appeler le vétérinaire. Ce n'est pas un diagnostic : en cas de doute, appelez.</p>
      <div className="callout warn"><b>Appelez le vétérinaire sans attendre</b> si l'animal ne mange plus depuis plus de 12 h (lapin) ou 24 h, respire bouche ouverte, saigne, a le ventre gonflé, se roule, ou si plusieurs animaux meurent brutalement (et dans ce cas, prévenez aussi la DDPP).</div>
      {step === 0 && (
        <div className="card">
          <h3>1. Quel animal ?</h3>
          <div className="grid-sm">
            {ANIMAUX.map((x) => (
              <button key={x.id} className={`btn big ${espece === x.id ? "primary" : ""}`} onClick={() => { setEspece(x.id); setStep(1); }}>
                <Vignette id={x.id} emoji={x.emoji} taille={28} /> {x.nom}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="card">
          <h3>2. Que voyez-vous{a ? ` chez vos ${a.nom.split(" (")[0].toLowerCase()}` : ""} ? <span className="muted small">(plusieurs choix possibles)</span></h3>
          <div className="stack">
            {Object.entries(SIGNES_ANIMAUX).filter(([k]) => utiles.has(k)).map(([k, s]) => (
              <label key={k} className="row" style={{ cursor: "pointer", padding: "6px 0" }}>
                <input type="checkbox" checked={signes.includes(k)} onChange={() => setSignes(signes.includes(k) ? signes.filter((x) => x !== k) : [...signes, k])} style={{ width: 22, height: 22 }} />
                <span>{s.emoji} {s.label}</span>
              </label>
            ))}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={!signes.length} onClick={() => setStep(2)}>Voir les causes possibles</button>
            <button className="btn ghost sm" onClick={() => { setStep(0); setSignes([]); }}>← Changer d'animal</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          {urgent && <div className="callout danger"><b>⚠️ Une des causes possibles est une urgence.</b> Appelez votre vétérinaire maintenant ; isolez l'animal au calme en attendant.</div>}
          <h2>Causes possibles, de la plus probable à la moins probable</h2>
          {res.map(({ m }) => (
            <a key={m.id} className="card row" href={href(`/maladie-animale/${m.id}`)} style={{ alignItems: "flex-start", flexWrap: "nowrap", textDecoration: "none", color: "inherit" }}>
              <span style={{ fontSize: 28 }}>⚕️</span>
              <span style={{ flex: 1 }}>
                <b>{m.nom}</b> <Urgence u={m.urgence} />
                <p className="small" style={{ margin: "4px 0 0" }}>{m.signes}</p>
              </span>
            </a>
          ))}
          {!res.length && <p className="muted">Aucune cause ne correspond à ces signes dans nos fiches. Décrivez-les au vétérinaire ; consultez aussi l'onglet Santé de la fiche de l'animal.</p>}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => setStep(1)}>← Modifier les signes</button>
            {a && <A to={`/animal/${a.id}`} className="btn ghost">Fiche {a.nom.split(" (")[0].toLowerCase()}</A>}
          </div>
        </div>
      )}
      <h2>Toutes les fiches santé{a ? "" : " des animaux"}</h2>
      <div className="chips">
        {MALADIES_ANIMALES.filter((m) => !espece || m.especes.includes(espece)).map((m) => <a key={m.id} className="chip" href={href(`/maladie-animale/${m.id}`)}>⚕️ {m.nom}</a>)}
      </div>
    </div>
  );
}

export default function MaladieAnimaleFiche({ id }: { id?: string }) {
  const m = MALADIES_ANIMALES.find((x) => x.id === id);
  if (!m) return <Empty emoji="🤷">Fiche introuvable. <A to="/diagnostic-animal">Santé des animaux</A></Empty>;
  const especes = m.especes.map(animal).filter(Boolean);
  const lecture = [`${m.nom}. ${URGENCE[m.urgence]}.`, `Signes. ${m.signes}`, `Explication. ${m.explication}`, "Que faire.", ...m.quoiFaire, "Prévention.", ...m.prevention];
  return (
    <div>
      <Back />
      <div style={{ marginTop: 8 }}>
        <span className="badge">Santé des animaux</span> <Urgence u={m.urgence} />
        <h1 style={{ marginTop: 8 }}>⚕️ {m.nom}</h1>
        <Listen id={`ma-${m.id}`} title={m.nom} blocks={lecture} label="Écouter la fiche" />
      </div>
      {m.urgence === 3 && <div className="callout danger"><b>Urgence</b> Appelez votre vétérinaire aujourd'hui. Les gestes ci-dessous aident en attendant, ils ne remplacent pas les soins.</div>}
      <h2>🔍 Comment le reconnaître</h2>
      <p><MotsLexique texte={m.signes} /></p>
      <h2>💡 Pourquoi</h2>
      <p><MotsLexique texte={m.explication} /></p>
      <h2>💊 Que faire</h2>
      <ol className="steps">{m.quoiFaire.map((s) => <li key={s}><MotsLexique texte={s} /></li>)}</ol>
      <h2>🛡️ Prévention</h2>
      <ul className="ticks">{m.prevention.map((s) => <li key={s}><MotsLexique texte={s} /></li>)}</ul>
      <div className="callout info">Médicaments : respectez toujours la dose et le <b>délai d'attente</b> avant de consommer œufs, lait ou viande. N'utilisez pas de médicaments humains ou pour chiens et chats sans avis vétérinaire.</div>
      <h2>Animaux concernés</h2>
      <div className="chips">{especes.map((x) => <a key={x!.id} className="chip" href={href(`/animal/${x!.id}`)}><Vignette id={x!.id} emoji={x!.emoji} taille={22} /> {x!.nom}</a>)}</div>
      <p><A to={`/diagnostic-animal${especes[0] ? "?animal=" + especes[0].id : ""}`} className="btn">⚕️ Diagnostic guidé des animaux</A></p>
      <h2>🎬 Vidéos</h2>
      <Videos id={`ma-${m.id}`} query={`${m.nom.split(" (")[0].toLowerCase()} ${especes[0]?.nom.split(" (")[0].toLowerCase() ?? ""} soigner`} />
    </div>
  );
}
