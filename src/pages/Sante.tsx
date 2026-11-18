import { Ico } from "../components/Ico";
import { useState } from "react";
import { PROBLEMES, REMEDES, AUXILIAIRES, TYPES_PROBLEME } from "../data/index";
import { href } from "../lib/router";
import { Photo, Section } from "../components/ui";
import { norm } from "../lib/garden";

export default function Sante() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [interieur, setInterieur] = useState(false);
  const nq = norm(q);
  const list = PROBLEMES.filter((p) => (!type || p.type === type) && (!interieur || p.interieur) && (!nq || norm(p.nom + " " + p.cible + " " + p.symptomes.join(" ")).includes(nq))).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return (
    <div>
      <h1>⚕️ Santé des plantes</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Maladies, ravageurs, carences et troubles de culture, avec des solutions naturelles autorisées au jardin familial.</p>
      <div className="grid-sm" style={{ marginBottom: 14 }}>
        <a className="btn big primary" href={href("/diagnostic")}>🔎 Diagnostic guidé</a>
        <a className="btn big" href={href("/identifier")}>📷 Par photo</a>
        <a className="btn big" href={href("/diagnostic?interieur=1")}>🌿 Plante d'intérieur</a>
        <a className="btn big" href={href("/diagnostic-animal")}>🐔 Un animal malade</a>
      </div>
      <div className="callout info small">
        <b>Rappel</b>
        Depuis 2019, les particuliers ne peuvent plus utiliser de pesticides de synthèse (loi Labbé). Restent autorisés les produits de biocontrôle, ceux utilisables en agriculture biologique et les préparations naturelles (purins, décoctions). La prévention (rotation, paillage, aération, auxiliaires) reste de loin la plus efficace.
      </div>

      <Section title={`Problèmes (${list.length})`}>
        <div className="search"><input type="search" placeholder="Rechercher : pucerons, taches, tomate…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="chips scroll-x" style={{ margin: "10px 0" }}>
          <button className={`chip ${!type ? "on" : ""}`} onClick={() => setType("")}>Tous</button>
          {Object.entries(TYPES_PROBLEME).map(([k, v]) => <button key={k} className={`chip ${type === k ? "on" : ""}`} onClick={() => setType(k)}><Ico nom={k} emoji="⚕️" taille={22} /> {v}</button>)}
          <button className={`chip ${interieur ? "on" : ""}`} onClick={() => setInterieur(!interieur)}>🌿 Intérieur</button>
        </div>
        <div className="grid">
          {list.map((p) => (
            <a key={p.id} className="tile" href={href(`/probleme/${p.id}`)}>
              <div className="ph" style={{ aspectRatio: "16/9" }}><Photo id={p.id} emoji="⚕️" alt="" /></div>
              <div className="bd">
                <div className="t">{p.nom}</div>
                <div className="s">{p.cible}</div>
                <div className="row" style={{ gap: 4, marginTop: 4 }}>
                  <span className="badge">{TYPES_PROBLEME[p.type]}</span>
                  <span className={`badge ${p.gravite === 3 ? "danger" : p.gravite === 2 ? "sun" : "green"}`}>{["", "Bénin", "Sérieux", "Grave"][p.gravite]}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section title="Remèdes naturels faits maison">
        <div className="grid-sm">
          {REMEDES.map((r) => (
            <a key={r.id} className="card" href={href(`/remede/${r.id}`)} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ fontSize: "1.6rem" }}>{r.emoji}</div>
              <b>{r.nom}</b>
            </a>
          ))}
        </div>
      </Section>

      <Section title="Les auxiliaires : vos alliés">
        <p className="muted small">Ils mangent les ravageurs gratuitement, à condition de leur offrir gîte et couvert et de ne pas les tuer avec des traitements.</p>
        <div className="grid">
          {AUXILIAIRES.map((a) => (
            <details key={a.id} className="box">
              <summary>{a.emoji} {a.nom}</summary>
              <div className="row" style={{ alignItems: "flex-start", marginTop: 8 }}>
                <div style={{ width: 90, flexShrink: 0, borderRadius: 10, overflow: "hidden" }}><Photo id={a.id} emoji={a.emoji} alt={a.nom} /></div>
                <div>
                  <p className="small"><b>Il mange :</b> {a.mange}</p>
                  <ul className="ticks small">{a.attirer.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            </details>
          ))}
        </div>
        <p><a href={href("/guide/hotel-insectes")}>🐞 Tutoriel : accueillir les auxiliaires →</a></p>
      </Section>
    </div>
  );
}
