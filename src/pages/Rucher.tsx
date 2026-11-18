import MotsLexique from "../components/MotsLexique";
import { useState } from "react";
import { useStore, upsert, remove, uid, today, getState, type Ruche, type Visite, type MethodeVarroa } from "../lib/store";
import { RACES } from "../data/races";
import { href } from "../lib/router";
import { toast, download, Empty, Titre } from "../components/ui";
import { couleurReine, COULEURS_REINE, METHODES_VARROA, valeurVarroa, niveauVarroa, seuilsVarroa, LIB_NIVEAU, pertesHiver, derniereVisite, dernierComptage, alertesRucher, registreTraitementsCsv, dernieresPesees, visitesCsv, PRODUITS_VARROA, TYPES_RUCHE, ORIGINES, vivantes, type NiveauVarroa } from "../lib/rucher";

const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR");
const COUL: Record<NiveauVarroa, string> = { ok: "var(--green)", surveiller: "var(--sun)", traiter: "var(--danger)" };

function Pastille({ annee }: { annee?: number }) {
  if (!annee) return null;
  const c = couleurReine(annee);
  return <span title={`Reine ${annee} : marquage ${c.nom}`} style={{ display: "inline-block", width: 12, height: 12, borderRadius: 6, background: c.css, border: "1px solid #888", verticalAlign: "middle", marginRight: 4 }} />;
}

export default function Rucher() {
  const ruches = useStore((s) => s.ruches);
  const visites = useStore((s) => s.visites);
  const traitements = useStore((s) => s.traitementsApi);
  const actives = ruches.filter((r) => !r.morte);
  const alertes = alertesRucher({ ruches, visites, traitementsApi: traitements }, today());
  return (
    <div>
      <p className="small"><a href={href("/jardin/animaux")}>← Mes animaux</a> · <a href={href("/animal/abeille")}>Fiche abeille</a></p>
      <Titre ico="abeille" emoji="🐝">Mon rucher</Titre>
      <p className="muted">Chaque ruche suivie une par une : visites, comptages de varroa avec seuil d'alerte, registre des traitements, pertes d'hiver.</p>
      <details className="box small"><summary>📖 Les mots du rucher</summary><p style={{ margin: "6px 0 0" }}>Touchez un mot pour son explication : <MotsLexique texte="couvain, varroa, opercule, hausse, essaimage." /></p></details>
      <div className="chips" style={{ margin: "8px 0" }}>
        <a className="chip" href={href("/guide/api-calendrier")}>📅 L'année au rucher</a>
        <a className="chip" href={href("/guide/api-visite")}>🔍 Faire une visite</a>
        <a className="chip" href={href("/guide/api-varroa")}>🦠 Plan varroa</a>
        <a className="chip" href={href("/diagnostic-animal?animal=abeille")}>⚕️ Diagnostic de la ruche</a>
      </div>
      {alertes.length > 0 && (
        <div className="card" style={{ borderLeft: "4px solid var(--danger)" }}>
          <b>À faire au rucher</b>
          <ul className="small" style={{ margin: "6px 0 0" }}>{alertes.map((a, i) => <li key={i} style={{ color: a.grave ? "var(--danger)" : undefined }}>{a.texte}</li>)}</ul>
        </div>
      )}
      <NouvelleRuche />
      {!ruches.length && <Empty emoji="🐝">Ajoutez vos ruches pour noter les visites, les comptages de varroa et les traitements. Les données restent sur cet appareil.</Empty>}
      {actives.map((r) => <RucheCard key={r.id} r={r} />)}
      {actives.length > 0 && <VisiteForm />}
      {visites.some((v) => valeurVarroa(v) != null) && <CourbeVarroa />}
      {ruches.length > 0 && <Traitements />}
      {ruches.length > 0 && <Pertes />}
      {ruches.some((r) => r.morte) && (
        <details className="box"><summary>Colonies mortes ou retirées ({ruches.filter((r) => r.morte).length})</summary>
          <ul className="small">{ruches.filter((r) => r.morte).map((r) => <li key={r.id}>{r.nom} : le {fr(r.morte!)}{r.cause ? ` (${r.cause})` : ""} <button className="btn sm ghost" onClick={() => upsert("ruches", { ...r, morte: undefined, cause: undefined })}>Annuler</button></li>)}</ul>
        </details>
      )}
      <p className="small muted" style={{ marginTop: 14 }}>Ce carnet peut servir de registre d'élevage. Gardez les ordonnances et factures des médicaments 5 ans, et déclarez vos ruches chaque année (1er septembre - 31 décembre). <a href={href("/guide/api-reseau")}>Le réseau sanitaire →</a></p>
    </div>
  );
}

function NouvelleRuche() {
  const n = useStore((s) => s.ruches.length);
  const [f, setF] = useState({ nom: "", type: TYPES_RUCHE[0], origine: ORIGINES[0], race: "", reineAnnee: String(new Date().getFullYear()), installee: today() });
  const races = RACES.abeille ?? [];
  return (
    <details className="box" open={!n}><summary>➕ Ajouter une ruche</summary>
      <div className="grid-sm" style={{ marginTop: 6 }}>
        <input type="text" placeholder={`Nom ou numéro (ex. R${n + 1})`} value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} />
        <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} aria-label="Type de ruche">{TYPES_RUCHE.map((x) => <option key={x}>{x}</option>)}</select>
        <select value={f.origine} onChange={(e) => setF({ ...f, origine: e.target.value })} aria-label="Origine">{ORIGINES.map((x) => <option key={x}>{x}</option>)}</select>
        <select value={f.race} onChange={(e) => setF({ ...f, race: e.target.value })} aria-label="Race"><option value="">Race de l'abeille</option>{races.map((r) => <option key={r.nom}>{r.nom}</option>)}<option>Inconnue / locale</option></select>
        <label className="small">Année de la reine<input type="number" min="2000" max="2100" value={f.reineAnnee} onChange={(e) => setF({ ...f, reineAnnee: e.target.value })} /></label>
        <label className="small">Installée le<input type="date" value={f.installee} onChange={(e) => setF({ ...f, installee: e.target.value })} /></label>
      </div>
      {Number(f.reineAnnee) > 1999 && <p className="small"><Pastille annee={Number(f.reineAnnee)} />Une reine de {f.reineAnnee} se marque en <b>{couleurReine(Number(f.reineAnnee)).nom}</b>.</p>}
      <button className="btn sm primary" onClick={() => { upsert("ruches", { id: uid(), nom: f.nom || `R${n + 1}`, type: f.type, origine: f.origine, race: f.race || undefined, reineAnnee: Number(f.reineAnnee) || undefined, installee: f.installee }); setF({ ...f, nom: "" }); toast("Ruche ajoutée"); }}>Ajouter la ruche</button>
      <p className="small muted">Couleurs de marquage : {COULEURS_REINE.map((c) => `${c.chiffres.join(" ou ")} ${c.nom}`).join(" · ")} (dernier chiffre de l'année).</p>
    </details>
  );
}

function RucheCard({ r }: { r: Ruche }) {
  const v = useStore((s) => derniereVisite(s, r.id));
  const c = useStore((s) => dernierComptage(s, r.id));
  const pesees = useStore((s) => dernieresPesees(s, r.id));
  const nb = useStore((s) => s.visites.filter((x) => x.rucheId === r.id).length);
  const niv = c ? niveauVarroa(c) : null;
  const age = r.reineAnnee ? new Date().getFullYear() - r.reineAnnee : null;
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="row between">
        <div><b>🐝 {r.nom}</b> <span className="small muted">{[r.type, r.race].filter(Boolean).join(" · ")}</span></div>
        <div style={{ whiteSpace: "nowrap" }}>
          <button className="btn sm ghost" onClick={() => { const cause = prompt(`Colonie « ${r.nom} » morte ou retirée. Cause (famine, varroa, orpheline, frelon, réunie…) ?`, ""); if (cause !== null) { upsert("ruches", { ...r, morte: today(), cause: cause || undefined }); toast("Colonie notée comme perdue"); } }}>Perdue</button>
          <button className="btn sm danger" onClick={() => confirm(`Supprimer « ${r.nom} » et ses visites ?`) && (getState().visites.filter((x) => x.rucheId === r.id).forEach((x) => remove("visites", x.id)), remove("ruches", r.id))} aria-label="Supprimer">🗑</button>
        </div>
      </div>
      <div className="small" style={{ marginTop: 4 }}>
        <Pastille annee={r.reineAnnee} />{r.reineAnnee ? <>Reine {r.reineAnnee}{age != null && age >= 2 ? <b style={{ color: "var(--danger)" }}> · {age} ans : pensez à la remplacer</b> : null}</> : "Année de la reine non notée"}
        {r.origine ? ` · ${r.origine}` : ""}{r.installee ? ` le ${fr(r.installee)}` : ""}
      </div>
      <div className="small" style={{ marginTop: 4 }}>
        {v ? <>Dernière visite le <b>{fr(v.date)}</b> ({nb}) : {v.reine === "vue" ? "reine vue" : v.reine === "oeufs" ? "œufs vus" : v.reine === "non" ? "ni reine ni œufs" : "reine non cherchée"}{v.couvain != null ? `, ${v.couvain} cadres de couvain` : ""}{v.miel != null ? `, ${v.miel} de miel` : ""}</> : <span className="muted">Aucune visite notée</span>}
      </div>
      {pesees[0] && <div className="small" style={{ marginTop: 4 }}>⚖️ Poids le {fr(pesees[0].date)} : <b>{pesees[0].poids} kg</b>{pesees[1] ? <> ({pesees[0].poids! - pesees[1].poids! >= 0 ? "+" : ""}{Math.round((pesees[0].poids! - pesees[1].poids!) * 10) / 10} kg depuis le {fr(pesees[1].date)}{pesees[0].poids! - pesees[1].poids! >= 2 ? " : miellée en cours" : pesees[0].poids! - pesees[1].poids! <= -2 ? " : la colonie consomme ses réserves" : ""})</> : null}</div>}
      {c && niv && <div className="small" style={{ marginTop: 4 }}>Varroa le {fr(c.date)} : <b style={{ color: COUL[niv] }}>{valeurVarroa(c)} {METHODES_VARROA[c.varroaMethode!].unite} ({LIB_NIVEAU[niv]})</b></div>}
      <details className="box"><summary>Modifier la reine</summary>
        <div className="row" style={{ marginTop: 6 }}>
          <label className="small">Année de la nouvelle reine <input type="number" min="2000" max="2100" defaultValue={new Date().getFullYear()} id={`reine-${r.id}`} style={{ width: 100 }} /></label>
          <button className="btn sm" onClick={() => { const x = Number((document.getElementById(`reine-${r.id}`) as HTMLInputElement).value); if (x) { upsert("ruches", { ...r, reineAnnee: x }); toast(`Reine ${x} : marquage ${couleurReine(x).nom}`); } }}>Changer de reine</button>
        </div>
        <p className="small"><a href={href("/guide/api-reines")}>Marquer, remplacer, élever des reines →</a></p>
      </details>
    </div>
  );
}

function VisiteForm() {
  const ruches = useStore((s) => s.ruches.filter((r) => !r.morte));
  const vide = { rucheId: ruches[0]?.id ?? "", date: today(), reine: "" as "" | "vue" | "oeufs" | "non", couvain: "", miel: "", pollen: "", humeur: "" as "" | "1" | "2" | "3", cellules: "" as "" | "non" | "essaimage" | "remplacement", poids: "", methode: "" as "" | MethodeVarroa, valeur: "", jours: "3", action: "", note: "" };
  const [f, setF] = useState(vide);
  const rid = ruches.some((r) => r.id === f.rucheId) ? f.rucheId : ruches[0]?.id;
  const essai: Visite = { id: "", rucheId: rid, date: f.date, varroaMethode: f.methode || undefined, varroaValeur: f.valeur === "" ? undefined : Number(f.valeur), varroaJours: Number(f.jours) || 1 };
  const val = valeurVarroa(essai);
  const niv = val != null ? niveauVarroa(essai) : null;
  const num = (x: string) => (x === "" ? undefined : Number(x));
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>📝 Noter une visite</b>
      <div className="grid-sm" style={{ marginTop: 6 }}>
        <select value={rid} onChange={(e) => setF({ ...f, rucheId: e.target.value })} aria-label="Ruche">{ruches.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}</select>
        <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-label="Date" />
        <select value={f.reine} onChange={(e) => setF({ ...f, reine: e.target.value as typeof f.reine })} aria-label="Reine"><option value="">Reine : non cherchée</option><option value="vue">Reine vue</option><option value="oeufs">Œufs vus (reine présente)</option><option value="non">Ni reine ni œufs</option></select>
        <input type="number" min="0" max="30" placeholder="Cadres de couvain" value={f.couvain} onChange={(e) => setF({ ...f, couvain: e.target.value })} />
        <input type="number" min="0" max="40" placeholder="Cadres de miel" value={f.miel} onChange={(e) => setF({ ...f, miel: e.target.value })} />
        <input type="number" min="0" max="30" placeholder="Cadres de pollen" value={f.pollen} onChange={(e) => setF({ ...f, pollen: e.target.value })} />
        <select value={f.humeur} onChange={(e) => setF({ ...f, humeur: e.target.value as typeof f.humeur })} aria-label="Humeur"><option value="">Humeur</option><option value="1">Douce</option><option value="2">Nerveuse</option><option value="3">Agressive</option></select>
        <label className="small">Poids de la ruche (kg)<input type="number" min="5" max="120" step="0.5" value={f.poids} onChange={(e) => setF({ ...f, poids: e.target.value })} /></label>
        <select value={f.cellules} onChange={(e) => setF({ ...f, cellules: e.target.value as typeof f.cellules })} aria-label="Cellules royales"><option value="">Cellules royales : non regardé</option><option value="non">Pas de cellules royales</option><option value="essaimage">Cellules d'essaimage (bas des cadres)</option><option value="remplacement">Cellules de remplacement (milieu)</option></select>
      </div>
      <details className="box" open={!!f.methode}><summary>🦠 Comptage du varroa</summary>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <select value={f.methode} onChange={(e) => setF({ ...f, methode: e.target.value as typeof f.methode })} aria-label="Méthode"><option value="">Pas de comptage</option>{(Object.keys(METHODES_VARROA) as MethodeVarroa[]).map((k) => <option key={k} value={k}>{METHODES_VARROA[k].nom}</option>)}</select>
          {f.methode && <input type="number" min="0" placeholder="Varroas comptés" value={f.valeur} onChange={(e) => setF({ ...f, valeur: e.target.value })} />}
          {f.methode === "chute" && <label className="small">Jours de pose du lange<input type="number" min="1" value={f.jours} onChange={(e) => setF({ ...f, jours: e.target.value })} /></label>}
        </div>
        {f.methode && <p className="small muted">{METHODES_VARROA[f.methode].aide}</p>}
        {val != null && niv && (() => { const s = seuilsVarroa(f.methode as MethodeVarroa, Number(f.date.slice(5, 7))); return <p className="small">Résultat : <b style={{ color: COUL[niv] }}>{val} {METHODES_VARROA[f.methode as MethodeVarroa].unite}, {LIB_NIVEAU[niv]}</b>. Repères de ce mois : surveiller à partir de {s.surveiller}, traiter à partir de {s.traiter}. {niv === "traiter" && <a href={href("/guide/api-varroa")}>Que faire →</a>}</p>; })()}
      </details>
      <input type="text" placeholder="Intervention (hausse posée, division, nourrissement, cadres changés…)" value={f.action} onChange={(e) => setF({ ...f, action: e.target.value })} style={{ marginTop: 6 }} />
      <input type="text" placeholder="Note" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={{ marginTop: 6 }} />
      <button className="btn primary sm" style={{ marginTop: 8 }} disabled={!rid} onClick={() => {
        upsert("visites", { id: uid(), rucheId: rid, date: f.date, reine: f.reine || undefined, couvain: num(f.couvain), miel: num(f.miel), pollen: num(f.pollen), humeur: f.humeur ? (Number(f.humeur) as 1 | 2 | 3) : undefined, cellules: f.cellules || undefined, poids: num(f.poids), varroaMethode: f.methode && f.valeur !== "" ? f.methode : undefined, varroaValeur: f.methode && f.valeur !== "" ? Number(f.valeur) : undefined, varroaJours: f.methode === "chute" ? Number(f.jours) || 1 : undefined, action: f.action || undefined, note: f.note || undefined });
        setF({ ...vide, rucheId: rid, methode: f.methode });
        toast("Visite notée");
      }}>Enregistrer la visite</button>
      <Historique />
    </div>
  );
}

function Historique() {
  const ruches = useStore((s) => s.ruches);
  const visites = useStore((s) => s.visites);
  if (!visites.length) return null;
  const liste = [...visites].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <details className="box"><summary>Carnet de visites ({visites.length})</summary>
      <table className="table small" style={{ marginTop: 6 }}><tbody>
        {liste.slice(0, 40).map((v) => { const val = valeurVarroa(v); const niv = niveauVarroa(v); return (
          <tr key={v.id}>
            <td>{fr(v.date)}<br /><b>{ruches.find((r) => r.id === v.rucheId)?.nom ?? "?"}</b></td>
            <td>{[v.reine === "vue" ? "reine vue" : v.reine === "oeufs" ? "œufs" : v.reine === "non" ? "ni reine ni œufs" : "", v.couvain != null ? `couvain ${v.couvain}` : "", v.miel != null ? `miel ${v.miel}` : "", v.cellules === "essaimage" ? "cellules d'essaimage" : v.cellules === "remplacement" ? "cellules de remplacement" : "", v.poids != null ? `${v.poids} kg` : "", v.action ?? "", v.note ?? ""].filter(Boolean).join(" · ")}{val != null && niv && <><br /><span style={{ color: COUL[niv] }}>varroa {val} {METHODES_VARROA[v.varroaMethode!].unite}</span></>}</td>
            <td><button className="btn sm ghost" onClick={() => remove("visites", v.id)} aria-label="Supprimer">🗑</button></td>
          </tr>); })}
      </tbody></table>
      <button className="btn sm" onClick={() => download("carnet-de-visites.csv", new Blob([visitesCsv(getState())], { type: "text/csv;charset=utf-8" }))}>Exporter le carnet (tableur)</button>
    </details>
  );
}

// Courbe : chaque comptage rapporté au seuil de traitement du mois (1 = seuil)
function CourbeVarroa() {
  const ruches = useStore((s) => s.ruches);
  const visites = useStore((s) => s.visites);
  const debut = new Date(); debut.setFullYear(debut.getFullYear() - 1);
  const d0 = debut.toISOString().slice(0, 10);
  const pts = visites.filter((v) => v.date >= d0 && valeurVarroa(v) != null).map((v) => ({ v, r: valeurVarroa(v)! / seuilsVarroa(v.varroaMethode!, Number(v.date.slice(5, 7))).traiter }));
  if (!pts.length) return null;
  const W = 320, H = 140, P = 24;
  const t0 = debut.getTime(), t1 = Date.now();
  const max = Math.max(1.5, ...pts.map((p) => p.r));
  const x = (d: string) => P + ((new Date(d + "T12:00:00").getTime() - t0) / (t1 - t0)) * (W - P - 6);
  const y = (r: number) => H - P - (r / max) * (H - P - 8);
  const palette = ["#2f6fd6", "#d33", "#2a9d4b", "#a050c0", "#e08000", "#008c9e", "#806040"];
  const ids = [...new Set(pts.map((p) => p.v.rucheId))];
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>📉 Varroa sur 12 mois</b>
      <p className="small muted">Chaque comptage est comparé au seuil de traitement de sa saison : au-dessus de la ligne rouge, il faut traiter.</p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 520 }} role="img" aria-label="Évolution du varroa par ruche">
        <rect x={P} y={y(max)} width={W - P - 6} height={y(1) - y(max)} style={{ fill: "var(--danger-soft)" }} />
        <line x1={P} x2={W - 6} y1={y(1)} y2={y(1)} style={{ stroke: "var(--danger)" }} strokeDasharray="4 3" />
        <text x={P + 2} y={y(1) - 3} fontSize="9" style={{ fill: "var(--danger)" }}>seuil de traitement</text>
        <line x1={P} x2={P} y1={8} y2={H - P} stroke="currentColor" opacity=".3" />
        <line x1={P} x2={W - 6} y1={H - P} y2={H - P} stroke="currentColor" opacity=".3" />
        <text x={P} y={H - 8} fontSize="9" fill="currentColor" opacity=".6">{fr(d0)}</text>
        <text x={W - 6} y={H - 8} fontSize="9" fill="currentColor" opacity=".6" textAnchor="end">aujourd'hui</text>
        {ids.map((id, i) => {
          const s = pts.filter((p) => p.v.rucheId === id).sort((a, b) => a.v.date.localeCompare(b.v.date));
          const c = palette[i % palette.length];
          return <g key={id}>
            <polyline points={s.map((p) => `${x(p.v.date)},${y(p.r)}`).join(" ")} fill="none" stroke={c} strokeWidth="1.5" />
            {s.map((p) => <circle key={p.v.id} cx={x(p.v.date)} cy={y(p.r)} r="3" fill={c}><title>{`${ruches.find((r) => r.id === id)?.nom} le ${fr(p.v.date)} : ${valeurVarroa(p.v)} ${METHODES_VARROA[p.v.varroaMethode!].unite}`}</title></circle>)}
          </g>;
        })}
      </svg>
      <div className="small">{ids.map((id, i) => <span key={id} style={{ marginRight: 10 }}><span style={{ color: palette[i % palette.length] }}>●</span> {ruches.find((r) => r.id === id)?.nom ?? "?"}</span>)}</div>
    </div>
  );
}

function Traitements() {
  const ruches = useStore((s) => s.ruches);
  const traitements = useStore((s) => s.traitementsApi);
  const actives = ruches.filter((r) => !r.morte);
  const [f, setF] = useState({ produit: PRODUITS_VARROA[0], autre: "", lot: "", debut: today(), dose: "", ordonnance: "", ids: [] as string[] });
  const ids = f.ids.length ? f.ids : actives.map((r) => r.id);
  const tri = [...traitements].sort((a, b) => b.debut.localeCompare(a.debut));
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>💊 Registre des traitements</b>
      <p className="small callout warn" style={{ margin: "6px 0" }}>Liste de médicaments donnée à titre d'exemple, à vérifier : seuls comptent les médicaments autorisés pour l'abeille, listés dans l'index officiel des médicaments vétérinaires (ANSES-ANMV) ; demandez à votre vétérinaire ou à votre GDSA.</p>
      <p className="small muted">Obligatoire : date, médicament, numéro de lot, ruches traitées, et l'ordonnance ou la facture conservée 5 ans. N'utilisez que des médicaments autorisés pour l'abeille.</p>
      <div className="grid-sm">
        <select value={f.produit} onChange={(e) => setF({ ...f, produit: e.target.value })} aria-label="Médicament">{PRODUITS_VARROA.map((x) => <option key={x}>{x}</option>)}<option>Autre</option></select>
        {f.produit === "Autre" && <input type="text" placeholder="Nom du médicament" value={f.autre} onChange={(e) => setF({ ...f, autre: e.target.value })} />}
        <input type="text" placeholder="N° de lot" value={f.lot} onChange={(e) => setF({ ...f, lot: e.target.value })} />
        <label className="small">Pose le<input type="date" value={f.debut} onChange={(e) => setF({ ...f, debut: e.target.value })} /></label>
        <input type="text" placeholder="Dose (ex. 2 lanières par ruche)" value={f.dose} onChange={(e) => setF({ ...f, dose: e.target.value })} />
        <input type="text" placeholder="Ordonnance ou facture (n°, fournisseur)" value={f.ordonnance} onChange={(e) => setF({ ...f, ordonnance: e.target.value })} />
      </div>
      <div className="chips" style={{ marginTop: 6 }}>
        {actives.map((r) => <label key={r.id} className="chip"><input type="checkbox" checked={ids.includes(r.id)} onChange={(e) => setF({ ...f, ids: e.target.checked ? [...ids, r.id] : ids.filter((x) => x !== r.id) })} /> {r.nom}</label>)}
      </div>
      <button className="btn sm primary" style={{ marginTop: 6 }} disabled={!ids.length || (f.produit === "Autre" && !f.autre)} onClick={() => { upsert("traitementsApi", { id: uid(), rucheIds: ids, produit: f.produit === "Autre" ? f.autre : f.produit, lot: f.lot || undefined, debut: f.debut, dose: f.dose || undefined, ordonnance: f.ordonnance || undefined }); setF({ ...f, lot: "", dose: "", ordonnance: "", ids: [] }); toast("Traitement inscrit au registre"); }}>Inscrire au registre</button>
      {tri.length > 0 && (
        <table className="table small" style={{ marginTop: 8 }}><tbody>
          {tri.map((t) => (
            <tr key={t.id}>
              <td>{fr(t.debut)}{t.fin ? <> → {fr(t.fin)}</> : <><br /><button className="btn sm" onClick={() => upsert("traitementsApi", { ...t, fin: today() })}>Retiré aujourd'hui</button></>}</td>
              <td><b>{t.produit}</b>{t.lot ? ` · lot ${t.lot}` : ""}{t.dose ? ` · ${t.dose}` : ""}<br /><span className="muted">{t.rucheIds.map((id) => ruches.find((r) => r.id === id)?.nom ?? "?").join(", ")}</span></td>
              <td><button className="btn sm ghost" onClick={() => confirm("Supprimer cette ligne du registre ?") && remove("traitementsApi", t.id)} aria-label="Supprimer">🗑</button></td>
            </tr>
          ))}
        </tbody></table>
      )}
      {tri.length > 0 && <button className="btn sm" style={{ marginTop: 6 }} onClick={() => download("registre-traitements-ruches.csv", new Blob([registreTraitementsCsv(getState())], { type: "text/csv;charset=utf-8" }))}>Exporter le registre (tableur)</button>}
      <p className="small muted">Alternez les familles de molécules d'une année à l'autre (amitraze, thymol, acides organiques). Comptez à nouveau 2 à 3 semaines après la fin du traitement.</p>
    </div>
  );
}

function Pertes() {
  const ruches = useStore((s) => s.ruches);
  const an = new Date().getFullYear();
  const hivers = [an - 3, an - 2, an - 1, an].map((a) => ({ a, ...pertesHiver(ruches, a) })).filter((h) => h.hivernees > 0);
  const now = vivantes(ruches, today()).length;
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>❄️ Pertes d'hiver</b> <span className="small muted">— {now} colonie{now > 1 ? "s" : ""} en vie aujourd'hui</span>
      {!hivers.length ? <p className="small muted">Les pertes se calculent du 1er novembre au 30 avril, à partir des colonies notées « perdues ».</p> : (
        <table className="table small" style={{ marginTop: 6 }}><tbody>
          {hivers.map((h) => <tr key={h.a}><td>Hiver {h.a}-{h.a + 1}</td><td>{h.mortes} / {h.hivernees} colonies perdues</td><td><b style={{ color: h.taux > 20 ? "var(--danger)" : undefined }}>{h.taux} %</b></td><td className="muted">{h.causes.join(", ")}</td></tr>)}
        </tbody></table>
      )}
      <p className="small muted">Repère : des pertes au-delà de 10 à 15 % chaque hiver signalent souvent un varroa mal maîtrisé ou des réserves trop faibles. <a href={href("/guide/api-nourrissement")}>Préparer l'hivernage →</a></p>
    </div>
  );
}
