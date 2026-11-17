import { useState } from "react";
import { useStore, upsert, remove, uid, today, getState, type Troupeau, type TypeProduction, type TypeMouvement, type CategorieDepense } from "../lib/store";
import { animal } from "../data/index";
import { RACES } from "../data/races";
import { COUVAISON, datesCouvee, PRODUITS, UNITES, bilan, registreCsv } from "../lib/elevage";
import { toast, download } from "./ui";
import { href } from "../lib/router";
import type { Animal } from "../data/types";

const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR");
const LIB_PROD: Record<TypeProduction, string> = { oeufs: "🥚 Œufs", lait: "🥛 Lait", miel: "🍯 Miel", laine: "🧶 Laine", viande: "🍖 Viande" };

// ——— Production (œufs par espèce, lait, miel, laine, viande)
export function ProductionCard({ troupeaux }: { troupeaux: Troupeau[] }) {
  const production = useStore((s) => s.production);
  const ponte = useStore((s) => s.ponte);
  const producteurs = troupeaux.filter((t) => (PRODUITS[t.animalId] ?? []).length);
  const [tid, setTid] = useState(producteurs[0]?.id ?? "");
  const t = producteurs.find((x) => x.id === tid) ?? producteurs[0];
  const types = t ? PRODUITS[t.animalId] : [];
  const [type, setType] = useState<TypeProduction>(types[0] ?? "oeufs");
  const [qte, setQte] = useState("");
  const [date, setDate] = useState(today());
  if (!producteurs.length) return null;
  const typeOk = types.includes(type) ? type : types[0];
  const d30 = [...Array(30)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); }).reverse();
  const val = (d: string) => production.filter((p) => p.date === d && p.type === typeOk && (!t || p.troupeauId === t.id)).reduce((a, p) => a + p.qte, 0) + (typeOk === "oeufs" && producteurs.filter((x) => PRODUITS[x.animalId]?.includes("oeufs")).length <= 1 ? ponte[d] ?? 0 : 0);
  const max = Math.max(1, ...d30.map(val));
  const total = d30.reduce((a, d) => a + val(d), 0);
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>📈 Production</b> <span className="small muted">— 30 derniers jours : {Math.round(total * 10) / 10} {UNITES[typeOk]} ({t?.nom})</span>
      <div className="row" style={{ marginTop: 8, gap: 6 }}>
        {producteurs.length > 1 && <select value={t?.id} onChange={(e) => setTid(e.target.value)} style={{ maxWidth: 180 }} aria-label="Groupe">{producteurs.map((x) => <option key={x.id} value={x.id}>{animal(x.animalId)?.emoji} {x.nom}</option>)}</select>}
        {types.length > 1 && <select value={typeOk} onChange={(e) => setType(e.target.value as TypeProduction)} style={{ maxWidth: 140 }} aria-label="Produit">{types.map((x) => <option key={x} value={x}>{LIB_PROD[x]}</option>)}</select>}
        <input type="number" min="0" step="any" placeholder={`Quantité (${UNITES[typeOk]})`} value={qte} onChange={(e) => setQte(e.target.value)} style={{ width: 150 }} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: 150 }} />
        <button className="btn primary" disabled={qte === "" || !t} onClick={() => { upsert("production", { id: uid(), troupeauId: t!.id, date, type: typeOk, qte: Number(qte) }); setQte(""); toast("Production notée"); }}>Noter</button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 60, marginTop: 10 }} aria-label="Production des 30 derniers jours">
        {d30.map((d) => { const n = val(d); return <div key={d} title={`${fr(d)} : ${n}`} style={{ flex: 1, height: `${(n / max) * 100}%`, minHeight: 2, background: n ? "var(--sun)" : "var(--surface-2)", borderRadius: 2 }} />; })}
      </div>
    </div>
  );
}

// ——— Animaux suivis un par un (nom, boucle, naissance, race, sexe)
export function IndividusSection({ t, a }: { t: Troupeau; a: Animal }) {
  const individus = useStore((s) => s.individus.filter((x) => x.troupeauId === t.id));
  const [f, setF] = useState({ nom: "", boucle: "", naissance: "", race: "", sexe: "" as "" | "F" | "M" });
  const races = RACES[a.id] ?? [];
  const obligatoire = ["chevre", "mouton", "cochon", "ane", "cheval"].includes(a.id);
  return (
    <details className="box"><summary>🏷️ Mes animaux un par un ({individus.filter((x) => !x.sortie).length})</summary>
      {obligatoire && <p className="small muted">Pour cette espèce, chaque animal doit être identifié (boucles ou puce) et inscrit au registre d'élevage. <a href={href("/guide/registre-elevage")}>Les règles</a></p>}
      <div className="grid-sm" style={{ marginTop: 6 }}>
        <input type="text" placeholder="Nom" value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} />
        <input type="text" placeholder={obligatoire ? "N° de boucle / puce" : "Bague (facultatif)"} value={f.boucle} onChange={(e) => setF({ ...f, boucle: e.target.value })} />
        <label className="small">Née le<input type="date" value={f.naissance} onChange={(e) => setF({ ...f, naissance: e.target.value })} /></label>
        <select value={f.race} onChange={(e) => setF({ ...f, race: e.target.value })} aria-label="Race"><option value="">Race</option>{races.map((r) => <option key={r.nom}>{r.nom}</option>)}<option>Autre / croisée</option></select>
        <select value={f.sexe} onChange={(e) => setF({ ...f, sexe: e.target.value as "" | "F" | "M" })} aria-label="Sexe"><option value="">Sexe</option><option value="F">Femelle</option><option value="M">Mâle</option></select>
      </div>
      <button className="btn sm primary" style={{ marginTop: 6 }} disabled={!f.nom} onClick={() => { upsert("individus", { id: uid(), troupeauId: t.id, nom: f.nom, boucle: f.boucle || undefined, naissance: f.naissance || undefined, race: f.race || undefined, sexe: f.sexe || undefined }); setF({ nom: "", boucle: "", naissance: "", race: "", sexe: "" }); toast("Animal ajouté"); }}>Ajouter</button>
      {individus.length > 0 && (
        <table className="table small" style={{ marginTop: 8 }}><tbody>
          {individus.map((x) => (
            <tr key={x.id} style={{ opacity: x.sortie ? 0.5 : 1 }}>
              <td><b>{x.nom}</b>{x.sexe ? ` (${x.sexe === "F" ? "♀" : "♂"})` : ""}<br /><span className="muted">{x.race ?? ""}{x.boucle ? ` · ${x.boucle}` : ""}</span></td>
              <td>{x.naissance ? `née le ${fr(x.naissance)}` : ""}{x.sortie ? <><br />sortie le {fr(x.sortie)}</> : null}</td>
              <td style={{ whiteSpace: "nowrap" }}>{!x.sortie && <button className="btn sm ghost" onClick={() => upsert("individus", { ...x, sortie: today() })}>Sortie</button>}<button className="btn sm ghost" onClick={() => remove("individus", x.id)} aria-label="Supprimer">🗑</button></td>
            </tr>
          ))}
        </tbody></table>
      )}
    </details>
  );
}

// ——— Couvées : dates de mirage, d'arrêt du retournement, d'éclosion
export function CouveesCard() {
  const couvees = useStore((s) => s.couvees);
  const [esp, setEsp] = useState("poule");
  const [debut, setDebut] = useState(today());
  const [oeufs, setOeufs] = useState("8");
  const [mode, setMode] = useState<"poule" | "couveuse">("poule");
  const actives = couvees.filter((c) => !c.fini);
  const P = COUVAISON[esp];
  const d = datesCouvee(esp, debut);
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>🐣 Couvées</b>
      {actives.map((c) => {
        const x = datesCouvee(c.espece, c.debut);
        const jour = Math.floor((Date.now() - new Date(c.debut + "T12:00:00").getTime()) / 86400000);
        const tot = COUVAISON[c.espece]?.jours ?? 21;
        return (
          <div key={c.id} className="card" style={{ marginTop: 8, background: "var(--surface-2)" }}>
            <b>{COUVAISON[c.espece]?.nom} · {c.oeufs} œufs · {c.mode === "couveuse" ? "en couveuse artificielle" : "sous une poule couveuse"}</b> <span className="badge">jour {Math.max(0, jour)} / {tot}</span>
            <div className="progress" style={{ margin: "6px 0" }}><div style={{ width: `${Math.min(100, (jour / tot) * 100)}%` }} /></div>
            <div className="small">Mirages : {fr(x.mirage1)} et {fr(x.mirage2)} · arrêt du retournement : {fr(x.arretRetournement)} · <b>éclosion : {fr(x.eclosion)}</b></div>
            <button className="btn sm" style={{ marginTop: 6 }} onClick={() => { const n = prompt("Combien de poussins sont nés ?", "0"); if (n !== null) { upsert("couvees", { ...c, eclos: Number(n) || 0, fini: today() }); toast("Couvée terminée"); } }}>Terminée</button>
          </div>
        );
      })}
      <details className="box" open={!actives.length}><summary>Nouvelle couvée ou calcul de date</summary>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <select value={esp} onChange={(e) => setEsp(e.target.value)} aria-label="Espèce">{Object.entries(COUVAISON).map(([k, v]) => <option key={k} value={k}>{v.nom} ({v.jours} j)</option>)}</select>
          <label className="small">Mise en couvaison<input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></label>
          <input type="number" min="1" value={oeufs} onChange={(e) => setOeufs(e.target.value)} aria-label="Nombre d'œufs" />
          <select value={mode} onChange={(e) => setMode(e.target.value as "poule" | "couveuse")} aria-label="Mode"><option value="poule">Couveuse naturelle (une poule)</option><option value="couveuse">Couveuse artificielle</option></select>
        </div>
        <ul className="ticks small">
          <li>1er mirage le <b>{fr(d.mirage1)}</b>, 2e mirage le <b>{fr(d.mirage2)}</b></li>
          <li>Arrêt du retournement et hausse d'humidité le <b>{fr(d.arretRetournement)}</b></li>
          <li>Éclosion prévue le <b>{fr(d.eclosion)}</b> (jusqu'au {fr(d.finEclosion)})</li>
          {mode === "couveuse" && <li>Couveuse : {P.temp}, humidité {P.humidite}, retournement {P.retournement}.</li>}
        </ul>
        <button className="btn sm primary" onClick={() => { upsert("couvees", { id: uid(), espece: esp, debut, oeufs: Number(oeufs) || 1, mode }); toast("Couvée enregistrée : les étapes apparaîtront dans vos tâches"); }}>Enregistrer cette couvée</button>
        <p className="small"><a href={href("/guide/couvaison")}>Couvaison et élevage des poussins →</a></p>
      </details>
    </div>
  );
}

// ——— Registre des mouvements
export function RegistreCard({ troupeaux }: { troupeaux: Troupeau[] }) {
  const mouvements = useStore((s) => s.mouvements);
  const [f, setF] = useState({ tid: troupeaux[0]?.id ?? "", type: "entree" as TypeMouvement, date: today(), nombre: "1", boucles: "", provenance: "", note: "" });
  const LIB: Record<TypeMouvement, string> = { entree: "Entrée (achat, don reçu)", naissance: "Naissance", sortie: "Sortie (vente, don)", deces: "Mort" };
  const valider = () => {
    const t = troupeaux.find((x) => x.id === f.tid);
    if (!t) return;
    const n = Number(f.nombre) || 1;
    upsert("mouvements", { id: uid(), troupeauId: t.id, date: f.date, type: f.type, nombre: n, boucles: f.boucles || undefined, provenance: f.provenance || undefined, note: f.note || undefined });
    upsert("troupeaux", { ...t, nombre: Math.max(0, t.nombre + (f.type === "entree" || f.type === "naissance" ? n : -n)) });
    setF({ ...f, nombre: "1", boucles: "", provenance: "", note: "" });
    toast("Mouvement inscrit au registre ; effectif mis à jour");
  };
  if (!troupeaux.length) return null;
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>📒 Registre d'élevage</b> <span className="small muted">— entrées, naissances, sorties, morts</span>
      <div className="grid-sm" style={{ marginTop: 6 }}>
        <select value={f.tid} onChange={(e) => setF({ ...f, tid: e.target.value })} aria-label="Groupe">{troupeaux.map((t) => <option key={t.id} value={t.id}>{animal(t.animalId)?.emoji} {t.nom}</option>)}</select>
        <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as TypeMouvement })} aria-label="Mouvement">{Object.entries(LIB).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        <input type="number" min="1" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} aria-label="Nombre" />
        <input type="text" placeholder="N° de boucles (si obligatoire)" value={f.boucles} onChange={(e) => setF({ ...f, boucles: e.target.value })} />
        <input type="text" placeholder="Provenance ou destination" value={f.provenance} onChange={(e) => setF({ ...f, provenance: e.target.value })} />
      </div>
      <input type="text" placeholder="Note (cause du décès, n° d'équarrissage…)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={{ marginTop: 6 }} />
      <div className="row" style={{ marginTop: 6, gap: 6 }}>
        <button className="btn sm primary" onClick={valider}>Inscrire</button>
        <button className="btn sm" disabled={!mouvements.length} onClick={() => { download("registre-elevage.csv", new Blob([registreCsv(getState())], { type: "text/csv" })); toast("Registre exporté (ouvrable dans un tableur)"); }}>⬇️ Exporter le registre</button>
        <a className="small" href={href("/guide/registre-elevage")}>Ce que doit contenir le registre</a>
      </div>
      {mouvements.length > 0 && (
        <table className="table small" style={{ marginTop: 8 }}><tbody>
          {[...mouvements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).map((m) => <tr key={m.id}><td>{fr(m.date)}</td><td>{troupeaux.find((t) => t.id === m.troupeauId)?.nom}</td><td>{LIB[m.type].split(" (")[0]} × {m.nombre}</td><td>{m.boucles ?? ""} {m.provenance ?? ""}</td><td><button className="btn sm ghost" onClick={() => remove("mouvements", m.id)} aria-label="Supprimer">🗑</button></td></tr>)}
        </tbody></table>
      )}
    </div>
  );
}

// ——— Dépenses et bilan
const CATS: Record<CategorieDepense, string> = { aliment: "Aliment", litiere: "Litière, paille, foin", veterinaire: "Vétérinaire, soins", materiel: "Matériel", achat: "Achat d'animaux", autre: "Autre" };
export function DepensesBilanCard({ troupeaux }: { troupeaux: Troupeau[] }) {
  const s = useStore((x) => x);
  const [f, setF] = useState({ date: today(), categorie: "aliment" as CategorieDepense, montant: "", tid: "", note: "" });
  const [periode, setPeriode] = useState<"30" | "an">("30");
  if (!troupeaux.length) return null;
  const depuis = periode === "30" ? (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })() : `${new Date().getFullYear()}-01-01`;
  const b = bilan(s, depuis);
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="row between"><b>💶 Dépenses et bilan</b>
        <select value={periode} onChange={(e) => setPeriode(e.target.value as "30" | "an")} style={{ maxWidth: 170 }} aria-label="Période"><option value="30">30 derniers jours</option><option value="an">Depuis le 1er janvier</option></select>
      </div>
      <div className="grid-sm" style={{ marginTop: 6 }}>
        {Object.entries(b.parType).map(([k, v]) => <div key={k} className="fact"><div className="k">{LIB_PROD[k as TypeProduction]}</div>{Math.round((v ?? 0) * 10) / 10} {UNITES[k as TypeProduction]}</div>)}
        <div className="fact"><div className="k">Dépenses</div>{b.depenses.toFixed(2)} €</div>
        {b.coutOeuf !== undefined && <div className="fact"><div className="k">Coût par œuf</div>{b.coutOeuf.toFixed(2)} €</div>}
        {b.coutLitre !== undefined && <div className="fact"><div className="k">Coût par litre</div>{b.coutLitre.toFixed(2)} €</div>}
      </div>
      <details className="box"><summary>Noter une dépense</summary>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          <select value={f.categorie} onChange={(e) => setF({ ...f, categorie: e.target.value as CategorieDepense })} aria-label="Catégorie">{Object.entries(CATS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <input type="number" min="0" step="0.01" placeholder="Montant (€)" value={f.montant} onChange={(e) => setF({ ...f, montant: e.target.value })} />
          <select value={f.tid} onChange={(e) => setF({ ...f, tid: e.target.value })} aria-label="Groupe"><option value="">Tous mes animaux</option>{troupeaux.map((t) => <option key={t.id} value={t.id}>{t.nom}</option>)}</select>
        </div>
        <input type="text" placeholder="Note" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={{ marginTop: 6 }} />
        <button className="btn sm primary" style={{ marginTop: 6 }} disabled={!f.montant} onClick={() => { upsert("depenses", { id: uid(), date: f.date, categorie: f.categorie, montant: Number(f.montant), troupeauId: f.tid || undefined, note: f.note || undefined }); setF({ ...f, montant: "", note: "" }); toast("Dépense notée"); }}>Enregistrer</button>
      </details>
    </div>
  );
}
