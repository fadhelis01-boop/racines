import { useState } from "react";
import { PLANTES, plante } from "../data/index";
import { MOIS_NOMS } from "../data/util";
import { FLEURS_ACHAT } from "../data/fleurs-saison";
import { Titre, Tile, toast } from "../components/ui";
import { useRoute, href, go } from "../lib/router";
import { useStore, upsert, remove, uid } from "../lib/store";
import { HARMONIES, calculMassif, moisSansFleur, classeHauteur, hauteurCm, NOMS_SOLS, solsDeMonSol } from "../lib/ornement";
import type { Plante, Couleur, Mois, SolPlante } from "../data/types";

// Page du fleuriste et du paysagiste débutants : fleurs de saison, couleurs, composition d'un massif
const ONGLETS: [string, string][] = [["saison", "🗓️ Fleurs de saison"], ["couleurs", "🎨 Couleurs"], ["massif", "🌼 Composer un massif"]];
const ORNEMENT = PLANTES.filter((p) => ["fleur", "ornement"].includes(p.categorie) || (p.categorie === "arbre" && !!p.floraison));
const PASTILLE: Record<string, string> = { blanc: "#f2f2ea", jaune: "#f2d24b", orange: "#f29a3b", rouge: "#d9342b", rose: "#ec8fb7", violet: "#9b6ad1", bleu: "#5b8fe0", vert: "#8fbf6a", multicolore: "linear-gradient(90deg,#d9342b,#f2d24b,#5b8fe0)" };

export default function Fleurs() {
  const { query } = useRoute();
  const onglet = query.get("t") ?? "saison";
  return (
    <div>
      <Titre ico="fleur" emoji="🌸">Fleurs et massifs</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>Pour le fleuriste et le paysagiste débutants : quoi couper ou acheter chaque mois, quelles couleurs associer, et combien de plantes pour un massif fleuri toute l'année.</p>
      <div className="chips" style={{ margin: "6px 0 10px" }}>
        <a className="chip" href={href("/guide/art-floral-bases")}>💐 Composer un bouquet</a>
        <a className="chip" href={href("/guide/fleurs-sechees")}>🌾 Fleurs séchées</a>
        <a className="chip" href={href("/plantes?mois=" + (new Date().getMonth() + 1))}>🔎 Toutes les plantes en fleur ce mois</a>
      </div>
      <div className="chips" role="tablist" style={{ margin: "8px 0 12px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/fleurs?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "saison" && <Saison />}
      {onglet === "couleurs" && <Couleurs />}
      {onglet === "massif" && <MassifOutil surfaceInit={Number(query.get("surface")) || 0} nomInit={query.get("nom") ?? ""} />}
    </div>
  );
}

function Saison() {
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const aCouper = PLANTES.filter((p) => p.bouquet && (p.floraison ?? p.recolte ?? []).includes(mois as Mois)).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const achat = FLEURS_ACHAT[mois];
  return (
    <div>
      <label className="field" style={{ maxWidth: 240 }}>Mois<select value={mois} onChange={(e) => setMois(Number(e.target.value))}>{MOIS_NOMS.map((n, i) => <option key={n} value={i + 1}>{n}</option>)}</select></label>
      <div className="card" style={{ marginTop: 10 }}>
        <b data-titre>🛒 Fleurs françaises de saison à acheter en {MOIS_NOMS[mois - 1]}</b>
        <p className="small" style={{ margin: "6px 0" }}>{achat.fleurs.join(" · ")}</p>
        <p className="small muted" style={{ margin: 0 }}>{achat.note} Demandez l'origine à votre fleuriste ; le label « Fleurs de France » la garantit.</p>
      </div>
      <h2>✂️ À couper au jardin en {MOIS_NOMS[mois - 1]} ({aCouper.length})</h2>
      {aCouper.length ? (
        <div className="grid">{aCouper.map((p) => <Tile key={p.id} to={`/plante/${p.id}`} id={p.id} emoji={p.emoji} title={p.nom} sub={`En vase : ${p.bouquet!.vase}`} />)}</div>
      ) : <p className="small muted">Peu de fleurs au jardin ce mois-ci : branches à forcer (forsythia, cerisier), feuillages persistants, baies et fleurs séchées font les bouquets d'hiver.</p>}
      {aCouper.some((p) => p.id === "lys") && <div className="callout warn small"><b>🐱 Lys et chats</b>Le lys est mortel pour les chats, même le pollen léché sur le pelage : pas de lys dans une maison avec un chat.</div>}
    </div>
  );
}

function Couleurs() {
  const [c, setC] = useState<Couleur>("bleu");
  const [mois, setMois] = useState(0);
  const h = HARMONIES[c];
  const avec = (cols: string[]) => ORNEMENT.filter((p) => (p.couleurs ?? []).some((x) => cols.includes(x)) && (!mois || (p.floraison ?? []).includes(mois as Mois))).slice(0, 24);
  const Liste = ({ titre, cols }: { titre: string; cols: string[] }) => {
    const ps = avec(cols);
    return (
      <div className="card" style={{ marginTop: 10 }}>
        <b data-titre>{titre}</b> <span className="row" style={{ display: "inline-flex", gap: 4, marginLeft: 6 }}>{cols.map((x) => <span key={x} title={x} style={{ width: 14, height: 14, borderRadius: 7, background: PASTILLE[x], border: "1px solid var(--line)" }} />)}</span>
        <div className="chips" style={{ marginTop: 6 }}>{ps.map((p) => <a key={p.id} className="chip" href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom.split(" (")[0]}</a>)}</div>
        {!ps.length && <p className="small muted">Aucune plante de cette harmonie ne fleurit ce mois-là.</p>}
      </div>
    );
  };
  return (
    <div>
      <div className="chips" aria-label="Couleur de départ">
        {(Object.keys(HARMONIES) as Couleur[]).map((k) => <button key={k} className={`chip ${c === k ? "on" : ""}`} onClick={() => setC(k)}><span style={{ width: 12, height: 12, borderRadius: 6, background: PASTILLE[k], border: "1px solid var(--line)", display: "inline-block", marginRight: 4 }} />{k}</button>)}
      </div>
      <label className="field" style={{ maxWidth: 240 }}>En fleur en<select value={mois} onChange={(e) => setMois(Number(e.target.value))}><option value={0}>toute l'année</option>{MOIS_NOMS.map((n, i) => <option key={n} value={i + 1}>{n}</option>)}</select></label>
      <div className="callout info small" style={{ marginTop: 8 }}>{h.note}</div>
      <Liste titre="Camaïeu (couleurs voisines, effet doux)" cols={h.camaieu} />
      <Liste titre="Contraste (couleurs complémentaires, effet vif)" cols={[c, ...h.complementaire]} />
      <p className="small"><a href={href("/guide/couleurs-jardin")}>Associer les couleurs au jardin et en bouquet →</a></p>
    </div>
  );
}

function MassifOutil({ surfaceInit, nomInit }: { surfaceInit: number; nomInit: string }) {
  const massifs = useStore((s) => s.massifs ?? []);
  const monSol = useStore((s) => s.settings.sol);
  const [id, setId] = useState<string>("");
  const [nom, setNom] = useState(nomInit || "Mon massif");
  const [surface, setSurface] = useState(surfaceInit || 6);
  const [expo, setExpo] = useState<"soleil" | "mi-ombre" | "ombre">("soleil");
  const [sol, setSol] = useState<string>(monSol && solsDeMonSol(monSol).length ? "monsol" : "");
  const [lignes, setLignes] = useState<{ id: string; part: number }[]>([]);
  const [ajout, setAjout] = useState("");
  const sols: string[] = sol === "monsol" ? solsDeMonSol(monSol) : sol ? [sol] : [];
  const choix = ORNEMENT.filter((p) => p.expo.includes(expo) && (!sols.length || sols.some((x) => (p.sols ?? []).includes(x as SolPlante))) && !lignes.some((l) => l.id === p.id)).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const ps = lignes.map((l) => plante(l.id)).filter(Boolean) as Plante[];
  const calc = calculMassif(surface, lignes, ps);
  const trous = moisSansFleur(ps);
  const charger = (mid: string) => { const m = massifs.find((x) => x.id === mid); setId(mid); if (m) { setNom(m.nom); setSurface(m.surface); setLignes(m.lignes); } };
  const enregistrer = () => { const nid = id || uid(); upsert("massifs", { id: nid, nom, surface, lignes }); setId(nid); toast("Massif enregistré"); };
  return (
    <div>
      {massifs.length > 0 && (
        <label className="field">Massifs enregistrés<select value={id} onChange={(e) => charger(e.target.value)}><option value="">— nouveau massif —</option>{massifs.map((m) => <option key={m.id} value={m.id}>{m.nom} ({m.surface} m²)</option>)}</select></label>
      )}
      <div className="grid-sm">
        <label className="field">Nom<input type="text" value={nom} onChange={(e) => setNom(e.target.value)} /></label>
        <label className="field">Surface (m²)<input type="number" min="0.5" step="0.5" value={surface} onChange={(e) => setSurface(Number(e.target.value) || 1)} /></label>
        <label className="field">Exposition<select value={expo} onChange={(e) => setExpo(e.target.value as typeof expo)}><option value="soleil">Soleil</option><option value="mi-ombre">Mi-ombre</option><option value="ombre">Ombre</option></select></label>
        <label className="field">Sol<select value={sol} onChange={(e) => setSol(e.target.value)}><option value="">peu importe</option>{monSol && solsDeMonSol(monSol).length > 0 && <option value="monsol">Mon sol (test)</option>}{Object.entries(NOMS_SOLS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
      </div>
      <div className="row" style={{ marginTop: 8 }}>
        <select value={ajout} onChange={(e) => setAjout(e.target.value)} style={{ flex: 1 }} aria-label="Plante à ajouter"><option value="">Ajouter une plante adaptée ({choix.length})…</option>{choix.map((p) => <option key={p.id} value={p.id}>{p.nom}{p.hauteur ? ` — ${p.hauteur}` : ""}</option>)}</select>
        <button className="btn primary" disabled={!ajout} onClick={() => { setLignes([...lignes, { id: ajout, part: 20 }]); setAjout(""); }}>Ajouter</button>
      </div>
      {lignes.length > 0 && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="table small" style={{ marginTop: 10 }}>
              <thead><tr><th>Plante (du fond vers l'avant)</th><th>Part de la surface</th><th>Nombre</th><th>Achat</th><th /></tr></thead>
              <tbody>
                {[...calc.details].sort((a, b) => hauteurCm(plante(b.id)?.hauteur) - hauteurCm(plante(a.id)?.hauteur)).map((d) => {
                  const p = plante(d.id)!; const l = lignes.find((x) => x.id === d.id)!;
                  return (
                    <tr key={d.id}>
                      <td><a href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom.split(" (")[0]}</a><div className="muted">{p.hauteur ?? ""}{classeHauteur(p) === "basse" ? " · devant" : classeHauteur(p) === "moyenne" ? " · milieu" : " · fond"}</div></td>
                      <td><input type="number" min="1" max="100" value={l.part} onChange={(e) => setLignes(lignes.map((x) => (x.id === d.id ? { ...x, part: Number(e.target.value) || 1 } : x)))} style={{ width: 60 }} /> % · {d.m2} m²</td>
                      <td><b>{d.nombre}</b><div className="muted">{d.godet}</div></td>
                      <td>{d.prixMin} à {d.prixMax} €</td>
                      <td><button className="btn sm ghost" onClick={() => setLignes(lignes.filter((x) => x.id !== d.id))} aria-label="Retirer">🗑</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p><b>{calc.nombre} plantes</b> pour {surface} m², environ <b>{calc.prixMin} à {calc.prixMax} €</b> en jardinerie ou pépinière (bien moins en divisant les touffes d'amis ou en semant).</p>
          <Frise plantes={ps} />
          {trous.length > 0 ? <div className="callout warn small"><b>Mois sans fleurs</b>{trous.map((m) => MOIS_NOMS[m - 1]).join(", ")} : ajoutez une plante qui fleurit à ce moment (filtre « En fleur en » de la page Plantes).</div> : <div className="callout ok small"><b>🎉 Fleuri de mars à octobre</b>Il y a toujours quelque chose en fleur dans ce massif.</div>}
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn primary" onClick={enregistrer}>💾 Enregistrer ce massif</button>
            {id && <button className="btn ghost" onClick={() => { if (confirm("Supprimer ce massif ?")) { remove("massifs", id); setId(""); setLignes([]); } }}>Supprimer</button>}
          </div>
          <p className="small muted">Densités de plantation courantes : couvre-sols 9 au m², vivaces 5 à 7, grandes vivaces 3, graminées 4, arbustes 1 pour 1 à 2 m². Paillez entre les plantes la première année. Le massif enregistré peut être relié à un massif du plan du jardin.</p>
        </>
      )}
    </div>
  );
}

// Frise de floraison : une ligne par plante, colorée aux mois de floraison
function Frise({ plantes }: { plantes: Plante[] }) {
  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <b data-titre>Floraison du massif</b>
      <table className="small" style={{ borderCollapse: "collapse", marginTop: 6, minWidth: 420 }}>
        <thead><tr><th />{MOIS_NOMS.map((n) => <th key={n} style={{ fontWeight: 400, padding: "0 2px" }}>{n.slice(0, 1).toUpperCase()}</th>)}</tr></thead>
        <tbody>{plantes.map((p) => (
          <tr key={p.id}><td style={{ paddingRight: 6, whiteSpace: "nowrap" }}>{p.nom.split(" (")[0]}</td>
            {MOIS_NOMS.map((_, i) => { const fl = (p.floraison ?? []).includes((i + 1) as Mois); return <td key={i} style={{ padding: 1 }}><div style={{ width: 18, height: 14, borderRadius: 3, background: fl ? PASTILLE[p.couleurs?.[0] ?? "vert"] : "var(--surface-2)", border: "1px solid var(--line)" }} title={fl ? `${p.nom} en fleur` : ""} /></td>; })}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
