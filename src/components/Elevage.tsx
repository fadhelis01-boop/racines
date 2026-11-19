import { useState } from "react";
import { useStore, upsert, remove, uid, today, getState, type Troupeau, type TypeProduction, type TypeMouvement, type CategorieDepense } from "../lib/store";
import { animal } from "../data/index";
import { RACES } from "../data/races";
import { COUVAISON, datesCouvee, PRODUITS, UNITES, bilan, registreCsv, GESTATION, datesMiseBas, bilanFemelle, tauxPonte, laitParFemelle, gmq } from "../lib/elevage";
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
  const [indiv, setIndiv] = useState("");
  const femelles = useStore((st) => st.individus.filter((x) => x.troupeauId === (t?.id ?? "") && !x.sortie && x.sexe !== "M"));
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
        {typeOk === "lait" && femelles.length > 0 && <select value={indiv} onChange={(e) => setIndiv(e.target.value)} style={{ maxWidth: 160 }} aria-label="Femelle"><option value="">Tout le troupeau</option>{femelles.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}</select>}
        <button className="btn primary" disabled={qte === "" || !t} onClick={() => { upsert("production", { id: uid(), troupeauId: t!.id, date, type: typeOk, qte: Number(qte), individuId: typeOk === "lait" && indiv ? indiv : undefined }); setQte(""); toast("Production notée"); }}>Noter</button>
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

// ——— Carnet de reproduction : saillies, mises bas, bilan par femelle
export function ReproductionCard({ troupeaux }: { troupeaux: Troupeau[] }) {
  const mammiferes = troupeaux.filter((t) => GESTATION[t.animalId]);
  const reps = useStore((st) => st.reproductions);
  const individus = useStore((st) => st.individus);
  const [tid, setTid] = useState(mammiferes[0]?.id ?? "");
  const t = mammiferes.find((x) => x.id === tid) ?? mammiferes[0];
  const [f, setF] = useState({ femelleId: "", femelle: "", male: "", saillie: today() });
  if (!mammiferes.length || !t) return null;
  const femelles = individus.filter((x) => x.troupeauId === t.id && !x.sortie && x.sexe !== "M");
  const mesReps = reps.filter((r) => r.troupeauId === t.id).sort((a, b) => b.saillie.localeCompare(a.saillie));
  const enCours = mesReps.filter((r) => !r.miseBas);
  const parFemelle = [...new Set(mesReps.map((r) => r.femelleId ?? r.femelle ?? ""))].filter(Boolean);
  const nomDe = (r: { femelleId?: string; femelle?: string }) => individus.find((x) => x.id === r.femelleId)?.nom ?? r.femelle ?? "Femelle";
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>🍼 Carnet de reproduction</b>
      {mammiferes.length > 1 && <select value={t.id} onChange={(e) => setTid(e.target.value)} style={{ maxWidth: 200, marginLeft: 8 }} aria-label="Groupe">{mammiferes.map((x) => <option key={x.id} value={x.id}>{animal(x.animalId)?.emoji} {x.nom}</option>)}</select>}
      {enCours.map((r) => {
        const d = datesMiseBas(t.animalId, r.saillie);
        return (
          <div key={r.id} className="card" style={{ marginTop: 8, background: "var(--surface-2)" }}>
            <b>{nomDe(r)}</b>{r.male ? ` × ${r.male}` : ""} : saillie le {fr(r.saillie)}, <b>mise bas prévue le {fr(d.miseBas)}</b> <span className="small muted">(préparation dès le {fr(d.preparation)})</span>
            <div className="row" style={{ marginTop: 6, gap: 6 }}>
              <button className="btn sm" onClick={() => { const n = prompt("Nombre de petits nés ?", "2"); if (n === null) return; const v = prompt("Dont vivants ?", n); const diff = confirm("Mise bas difficile (aide nécessaire) ?"); upsert("reproductions", { ...r, miseBas: today(), nes: Number(n) || 0, vivants: Number(v ?? n) || 0, difficulte: diff }); upsert("mouvements", { id: uid(), troupeauId: t.id, date: today(), type: "naissance", nombre: Number(v ?? n) || 0, note: `Mise bas de ${nomDe(r)}` }); toast("Mise bas notée (et ajoutée au registre)"); }}>Mise bas faite</button>
              <button className="btn sm ghost" onClick={() => confirm("La saillie n'a pas pris : supprimer cette gestation ?") && remove("reproductions", r.id)}>Pas pleine</button>
            </div>
          </div>
        );
      })}
      <details className="box" open={!mesReps.length}><summary>Noter une saillie</summary>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          {femelles.length ? (
            <select value={f.femelleId} onChange={(e) => setF({ ...f, femelleId: e.target.value })} aria-label="Femelle"><option value="">Femelle…</option>{femelles.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}</select>
          ) : <input type="text" placeholder="Nom de la femelle" value={f.femelle} onChange={(e) => setF({ ...f, femelle: e.target.value })} />}
          <input type="text" placeholder="Mâle (nom ou origine)" value={f.male} onChange={(e) => setF({ ...f, male: e.target.value })} />
          <label className="small">Date de saillie<input type="date" value={f.saillie} onChange={(e) => setF({ ...f, saillie: e.target.value })} /></label>
        </div>
        <p className="small muted">Mise bas prévue le {fr(datesMiseBas(t.animalId, f.saillie).miseBas)} ({GESTATION[t.animalId].jours} jours) : les étapes apparaîtront dans vos tâches.</p>
        <button className="btn sm primary" disabled={!f.femelleId && !f.femelle} onClick={() => { upsert("reproductions", { id: uid(), troupeauId: t.id, femelleId: f.femelleId || undefined, femelle: f.femelleId ? undefined : f.femelle, male: f.male || undefined, saillie: f.saillie }); setF({ femelleId: "", femelle: "", male: "", saillie: today() }); toast("Saillie notée"); }}>Enregistrer</button>
        {!femelles.length && <p className="small muted">Astuce : ajoutez vos femelles dans « Mes animaux un par un » pour les choisir dans une liste.</p>}
      </details>
      {parFemelle.length > 0 && (
        <table className="table small" style={{ marginTop: 8 }}>
          <thead><tr><th>Femelle</th><th>Mises bas</th><th>Petits par portée</th><th>Survie</th></tr></thead>
          <tbody>{parFemelle.map((k) => { const rs = mesReps.filter((r) => (r.femelleId ?? r.femelle) === k); const b = bilanFemelle(rs); return <tr key={k}><td>{nomDe(rs[0])}</td><td>{b.misesBas}{b.difficultes ? <span className="muted"> ({b.difficultes} difficile{b.difficultes > 1 ? "s" : ""})</span> : null}</td><td>{b.parPortee || "-"}</td><td>{b.nes ? `${b.survie} %` : "-"}</td></tr>; })}</tbody>
        </table>
      )}
      <p className="small"><a href={href("/calculs?s=misebas")}>Calculer une date de mise bas →</a> · <a href={href("/guide/calendrier-reproduction")}>Calendrier de reproduction →</a></p>
    </div>
  );
}

// ——— Performances : taux de ponte, lait par femelle, croissance des jeunes, coût de revient
export function PerformancesCard({ troupeaux }: { troupeaux: Troupeau[] }) {
  const st = useStore((x) => ({ production: x.production, troupeaux: x.troupeaux, individus: x.individus, pesees: x.pesees, depenses: x.depenses, ponte: x.ponte, mouvements: x.mouvements }));
  const [p, setP] = useState({ troupeauId: troupeaux[0]?.id ?? "", nom: "", kg: "", date: today() });
  if (!troupeaux.length) return null;
  const an = new Date(); an.setFullYear(an.getFullYear() - 1);
  const depuis = an.toISOString().slice(0, 10);
  const pondeuses = troupeaux.filter((t) => (PRODUITS[t.animalId] ?? []).includes("oeufs"));
  const laitieres = troupeaux.filter((t) => (PRODUITS[t.animalId] ?? []).includes("lait"));
  const nomsPeses = [...new Set(st.pesees.map((x) => `${x.troupeauId}|${x.nom ?? x.individuId}`))];
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>📊 Performances</b>
      <ul className="ticks small" style={{ marginTop: 6 }}>
        {pondeuses.map((t) => { const tp = tauxPonte(st, t.id); return tp != null ? <li key={t.id}>{t.nom} : taux de ponte sur 30 jours <b>{tp} %</b> <span className="muted">({t.nombre} poules ; 70 à 85 % est très bon pour des hybrides, 40 à 60 % pour des races)</span></li> : null; })}
        {laitieres.map((t) => { const l = laitParFemelle(st, t.id, depuis); const ids = Object.keys(l); return ids.length ? <li key={t.id}>{t.nom}, lait sur 12 mois : {ids.map((id) => `${st.individus.find((x) => x.id === id)?.nom ?? "?"} ${Math.round(l[id])} L`).join(" · ")}</li> : null; })}
        {troupeaux.map((t) => { const b = bilan(st as never, depuis, t.id); const items = [b.coutOeuf ? `${(b.coutOeuf).toFixed(2)} € l'œuf` : "", b.coutLitre ? `${(b.coutLitre).toFixed(2)} € le litre` : "", b.coutKgViande ? `${(b.coutKgViande).toFixed(2)} € le kilo de viande` : ""].filter(Boolean); return items.length ? <li key={"c" + t.id}>{t.nom}, coût de revient sur 12 mois : <b>{items.join(" · ")}</b> <span className="muted">(dépenses notées ÷ production notée)</span></li> : null; })}
      </ul>
      <details className="box"><summary>⚖️ Peser un jeune (croissance)</summary>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <select value={p.troupeauId} onChange={(e) => setP({ ...p, troupeauId: e.target.value })} aria-label="Groupe">{troupeaux.map((t) => <option key={t.id} value={t.id}>{animal(t.animalId)?.emoji} {t.nom}</option>)}</select>
          <input type="text" placeholder="Nom ou numéro du jeune" value={p.nom} onChange={(e) => setP({ ...p, nom: e.target.value })} />
          <input type="number" step="0.01" min="0" placeholder="Poids (kg)" value={p.kg} onChange={(e) => setP({ ...p, kg: e.target.value })} />
          <input type="date" value={p.date} onChange={(e) => setP({ ...p, date: e.target.value })} aria-label="Date" />
        </div>
        <button className="btn sm primary" style={{ marginTop: 6 }} disabled={!p.nom || !p.kg} onClick={() => { upsert("pesees", { id: uid(), troupeauId: p.troupeauId, nom: p.nom, date: p.date, kg: Number(p.kg) }); setP({ ...p, kg: "" }); toast("Pesée notée"); }}>Noter la pesée</button>
        {nomsPeses.length > 0 && (
          <table className="table small" style={{ marginTop: 8 }}><tbody>
            {nomsPeses.map((k) => { const [tid, nom] = k.split("|"); const ps = st.pesees.filter((x) => x.troupeauId === tid && (x.nom ?? x.individuId) === nom).sort((a, b) => a.date.localeCompare(b.date)); const g = gmq(ps); return <tr key={k}><td><b>{nom}</b></td><td>{ps[ps.length - 1].kg} kg le {fr(ps[ps.length - 1].date)}</td><td>{g != null ? `${g} g/jour` : "1 pesée"}</td></tr>; })}
          </tbody></table>
        )}
        <p className="small muted">Repères de croissance : agneau 200 à 300 g/jour, chevreau 150 à 200 g/jour, lapereau 30 à 40 g/jour après le sevrage. Une croissance qui stagne signale souvent des vers ou un manque de lait.</p>
      </details>
    </div>
  );
}
