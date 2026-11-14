import { useState } from "react";
import { AMENAGEMENTS, NIVEAU, type Amenagement } from "../data/amenagements";
import { useStore } from "../lib/store";
import { lienVers } from "../data/index";
import { href, useRoute } from "../lib/router";
import { Back, Listen, Galerie, wikiOf } from "../components/ui";
import { srcVignette } from "../components/Ico";
import { youtube } from "../data/util";

const FAMILLES: Record<Amenagement["famille"], string> = { potager: "Potager", fruitier: "Fruits", agrement: "Agrément", biodiversite: "Biodiversité", organisation: "Organisation" };
const Jauge = ({ v, label, inverse }: { v: number; label: string; inverse?: boolean }) => (
  <span className="small" title={`${label} : ${NIVEAU[v]}`} style={{ whiteSpace: "nowrap" }}>
    {label} <b style={{ color: (inverse ? 4 - v : v) === 1 ? "var(--danger)" : (inverse ? 4 - v : v) === 3 ? "var(--green)" : undefined }}>{"●".repeat(v)}{"○".repeat(3 - v)}</b>
  </span>
);

export default function Amenagements() {
  const situation = useStore((s) => s.settings.situation);
  const route = useRoute();
  const [lieu, setLieu] = useState<string>(situation);
  const [fam, setFam] = useState("");
  const [ouvert, setOuvert] = useState(route.query.get("id") ?? "");
  const [tri, setTri] = useState<"" | "entretien" | "cout" | "eau">("");
  let list = AMENAGEMENTS.filter((a) => (!lieu || a.pour.includes(lieu as never)) && (!fam || a.famille === fam));
  if (tri) list = [...list].sort((a, b) => a[tri] - b[tri]);
  return (
    <div>
      <Back />
      <h1>🗺️ Aménager son jardin : les façons de faire comparées</h1>
      <p className="muted small" style={{ marginTop: -6 }}>{AMENAGEMENTS.length} façons d'aménager, illustrées, avec leurs avantages et leurs inconvénients. On peut en combiner plusieurs : des planches au potager, des carrés près de la maison, un verger dans l'herbe, une prairie fleurie au fond.</p>
      <div className="row" style={{ gap: 8, margin: "10px 0" }}>
        <select value={lieu} onChange={(e) => setLieu(e.target.value)} aria-label="Lieu" style={{ maxWidth: 220 }}>
          <option value="">Tous les lieux</option><option value="jardin">🏡 Grand jardin</option><option value="petit-jardin">🌿 Petit jardin, cour</option><option value="balcon">🏢 Balcon, terrasse</option><option value="appartement">🏙️ Appartement</option>
        </select>
        <select value={tri} onChange={(e) => setTri(e.target.value as typeof tri)} aria-label="Trier" style={{ maxWidth: 220 }}>
          <option value="">Trier : ordre conseillé</option><option value="entretien">Le moins d'entretien</option><option value="cout">Le moins cher</option><option value="eau">Le moins d'eau</option>
        </select>
      </div>
      <div className="chips" style={{ marginBottom: 10 }}>
        <button className={`chip ${!fam ? "on" : ""}`} onClick={() => setFam("")}>Tout</button>
        {Object.entries(FAMILLES).map(([k, l]) => <button key={k} className={`chip ${fam === k ? "on" : ""}`} onClick={() => setFam(k)}>{l}</button>)}
      </div>
      {list.map((a) => {
        const dessin = srcVignette(a.id);
        const photo = wikiOf(a.id)?.photos?.[0]?.img;
        const img = photo ?? dessin;
        const on = ouvert === a.id;
        return (
          <div key={a.id} className="card" id={a.id} style={{ padding: 0, overflow: "hidden" }}>
            <button onClick={() => setOuvert(on ? "" : a.id)} aria-expanded={on} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 12, width: "100%", alignItems: "stretch" }}>
              {img ? <img src={img} alt="" loading="lazy" crossOrigin={photo ? "anonymous" : undefined} style={{ width: 130, minHeight: 100, objectFit: "cover", flexShrink: 0 }} /> : <span style={{ fontSize: 48, padding: 16 }}>{a.emoji}</span>}
              <span style={{ padding: "10px 12px 10px 0", flex: 1 }}>
                <b>{a.emoji} {a.nom}</b> <span className="badge">{FAMILLES[a.famille]}</span>
                <span className="small" style={{ display: "block", margin: "4px 0" }}>{a.resume}</span>
                <span className="row" style={{ gap: 12 }}>
                  <Jauge v={a.installation} label="Installation" inverse /><Jauge v={a.entretien} label="Entretien" inverse /><Jauge v={a.cout} label="Coût" inverse /><Jauge v={a.eau} label="Eau" inverse />
                </span>
              </span>
            </button>
            {on && (
              <div style={{ padding: "0 14px 14px" }}>
                <div className="row" style={{ alignItems: "flex-start", gap: 12, margin: "8px 0" }}>
                  {photo && <div className="hero" style={{ flex: "1 1 280px", display: "block" }}><Galerie id={a.id} emoji={a.emoji} alt={a.nom} photoFirst /></div>}
                  {dessin && <figure style={{ flex: "1 1 240px", margin: 0 }}><img src={dessin} alt={`Illustration : ${a.nom}`} style={{ width: "100%", borderRadius: 10 }} /><figcaption className="small muted">{photo ? "Vue d'ensemble illustrée" : "Illustration"}</figcaption></figure>}
                </div>
                <p className="small"><b>Surface :</b> {a.surface} · <b>Idéal pour :</b> {a.ideal}</p>
                <div className="grid">
                  <div><b>✅ Avantages</b><ul className="ticks small">{a.avantages.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><b>⚠️ Inconvénients</b><ul className="ticks small">{a.inconvenients.map((x) => <li key={x}>{x}</li>)}</ul></div>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  {a.liens.map((l) => { const x = lienVers(l); return x ? <a key={l} className="chip" href={href(x.href)}>{x.emoji} {x.label}</a> : null; })}
                  <a className="chip" href={youtube(a.video)} target="_blank" rel="noreferrer">▶️ Vidéos</a>
                  <Listen id={"am-" + a.id} title={a.nom} blocks={[`${a.nom}. ${a.resume}`, `Surface : ${a.surface}. Idéal pour : ${a.ideal}`, "Avantages.", ...a.avantages, "Inconvénients.", ...a.inconvenients]} label="Écouter" />
                </div>
              </div>
            )}
          </div>
        );
      })}
      {!list.length && <p className="muted">Aucun aménagement pour ce choix.</p>}
      <div className="callout info small" style={{ marginTop: 14 }}><b>Par où commencer ?</b>Observez une saison, placez près de la maison ce que vous visitez chaque jour (aromatiques, salades), commencez petit et agrandissez. L'assistant <a href={href("/creer")}>Créer mon potager</a> vous propose une méthode selon votre surface, votre soleil et votre temps.</div>
    </div>
  );
}
