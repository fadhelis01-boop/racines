import { useState } from "react";
import { useStore, upsert, remove, uid, today, getState, type TypeMultiplication, type Partage } from "../lib/store";
import { plante, PLANTES } from "../data/index";
import { EXPORTS, bilanPluriannuel } from "../lib/exports";
import { download, toast } from "./ui";
import { href } from "../lib/router";

const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR");

// ——— Exports en tableur
export function ExportsCard() {
  const s = useStore((x) => x);
  return (
    <div className="card">
      <b>📤 Exporter mes données (tableur)</b>
      <p className="small muted" style={{ margin: "4px 0 8px" }}>Fichiers CSV qui s'ouvrent dans Excel, LibreOffice ou Google Sheets : pour vos bilans, vos archives, ou les comparer d'une année sur l'autre.</p>
      <div className="row" style={{ gap: 6 }}>
        {Object.entries(EXPORTS).map(([k, e]) => <button key={k} className="btn sm" disabled={e.vide(s)} onClick={() => { download(e.fichier, new Blob([e.faire(getState())], { type: "text/csv" })); toast(`${e.label} exportés`); }}>⬇️ {e.label}</button>)}
      </div>
    </div>
  );
}

// ——— Bilan pluriannuel des récoltes, par variété
export function BilanPluriannuel() {
  const s = useStore((x) => x);
  const b = bilanPluriannuel(s);
  if (!b.annees.length) return null;
  const jm = (x: string) => new Date(`2000-${x}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return (
    <div style={{ marginTop: 18 }}>
      <h3>📅 D'une année sur l'autre</h3>
      <div className="row" style={{ gap: 8 }}>{b.parAnnee.map((a) => <div key={a.annee} className="fact"><div className="k">{a.annee}</div>{a.kg.toFixed(1)} kg · {a.nb} pesées</div>)}</div>
      <div className="card" style={{ overflowX: "auto", marginTop: 10 }}>
        <table className="table small" style={{ minWidth: 420 }}>
          <thead><tr><th>Plante et variété</th>{b.annees.map((a) => <th key={a}>{a}</th>)}<th>Période</th></tr></thead>
          <tbody>{b.varietes.map((v) => (
            <tr key={v.planteId + (v.variete ?? "")}><td><a href={href(`/plante/${v.planteId}`)}>{plante(v.planteId)?.nom}</a>{v.variete ? <b> · {v.variete}</b> : <span className="muted"> · variété non notée</span>}</td>{b.annees.map((a) => <td key={a}>{v.parAnnee[a] ? `${v.parAnnee[a].toFixed(1)} kg` : "—"}</td>)}<td>{jm(v.premiere)} → {jm(v.derniere)}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <p className="small muted">Notez la variété à chaque semis et chaque pesée : en quelques années, vous saurez lesquelles réussissent vraiment chez vous.</p>
    </div>
  );
}

// ——— Boutures, semis maison, divisions : taux de réussite
const TYPES: Record<TypeMultiplication, string> = { bouture: "✂️ Bouture", semis: "🌱 Semis maison", division: "➗ Division", marcottage: "🌿 Marcottage", rejet: "🌵 Rejet" };
export function Multiplications() {
  const liste = useStore((s) => s.multiplications);
  const [f, setF] = useState({ type: "bouture" as TypeMultiplication, planteId: "", variete: "", date: today(), nombre: "1", origine: "", note: "" });
  const choix = [...PLANTES].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const enCours = liste.filter((m) => !m.fini).sort((a, b) => b.date.localeCompare(a.date));
  const finies = liste.filter((m) => m.fini);
  const taux = (() => { const t = finies.reduce((a, m) => a + m.nombre, 0); const r = finies.reduce((a, m) => a + (m.reussis ?? 0), 0); return t ? Math.round((r / t) * 100) : undefined; })();
  return (
    <div>
      <p className="muted small">Boutures, semis faits maison, divisions : notez-les pour savoir ce qui réussit chez vous, et ne plus rien oublier sur le rebord de la fenêtre. Plantes multipliées = plantes gratuites.</p>
      <div className="card">
        <b>➕ Nouvelle multiplication</b>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as TypeMultiplication })} aria-label="Type">{Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <select value={f.planteId} onChange={(e) => setF({ ...f, planteId: e.target.value })} aria-label="Plante"><option value="">— Plante —</option>{choix.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nom}</option>)}</select>
          <input type="text" placeholder="Variété (facultatif)" value={f.variete} onChange={(e) => setF({ ...f, variete: e.target.value })} />
          <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          <input type="number" min="1" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} aria-label="Nombre" />
          <input type="text" placeholder="Origine (troc, voisin, graines maison…)" value={f.origine} onChange={(e) => setF({ ...f, origine: e.target.value })} />
        </div>
        <input type="text" placeholder="Note (dans l'eau, à l'étouffée, substrat…)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={{ marginTop: 6 }} />
        <button className="btn primary sm" style={{ marginTop: 6 }} disabled={!f.planteId} onClick={() => { upsert("multiplications", { id: uid(), type: f.type, planteId: f.planteId, variete: f.variete || undefined, date: f.date, nombre: Number(f.nombre) || 1, origine: f.origine || undefined, note: f.note || undefined }); setF({ ...f, variete: "", nombre: "1", note: "" }); toast("Noté"); }}>Enregistrer</button>
        <p className="small" style={{ margin: "6px 0 0" }}><a href={href("/guide/bouturage")}>Bouturer</a> · <a href={href("/interieur?t=multiplier")}>Comment multiplier chaque plante d'intérieur</a> · <a href={href("/guide/semences")}>Garder ses graines</a></p>
      </div>
      {taux !== undefined && <p className="small"><b>Votre taux de réussite :</b> {taux} % sur {finies.length} essai(s) terminé(s).</p>}
      <h3>En cours ({enCours.length})</h3>
      {enCours.map((m) => {
        const j = Math.floor((Date.now() - new Date(m.date + "T12:00:00").getTime()) / 86400000);
        return (
          <div key={m.id} className="card row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.6rem" }}>{plante(m.planteId)?.emoji}</span>
            <div style={{ flex: 1 }}>
              <b>{TYPES[m.type]} · {plante(m.planteId)?.nom}{m.variete ? ` « ${m.variete} »` : ""}</b> <span className="badge">× {m.nombre}</span>
              <div className="small muted">Depuis le {fr(m.date)} ({j} jour{j > 1 ? "s" : ""}){m.origine ? ` · ${m.origine}` : ""}{m.note ? ` · ${m.note}` : ""}</div>
            </div>
            <div className="row" style={{ gap: 4 }}>
              <button className="btn sm" onClick={() => { const r = prompt(`Combien ont réussi sur ${m.nombre} ?`, String(m.nombre)); if (r !== null) upsert("multiplications", { ...m, reussis: Math.min(m.nombre, Number(r) || 0), fini: today() }); }}>Bilan</button>
              <button className="btn sm ghost" onClick={() => remove("multiplications", m.id)} aria-label="Supprimer">🗑</button>
            </div>
          </div>
        );
      })}
      {!enCours.length && <p className="muted small">Rien en cours.</p>}
      {finies.length > 0 && (
        <details className="box"><summary>Terminées ({finies.length})</summary>
          <table className="table small"><tbody>{finies.map((m) => <tr key={m.id}><td>{fr(m.date)}</td><td>{TYPES[m.type]} {plante(m.planteId)?.nom}{m.variete ? ` « ${m.variete} »` : ""}</td><td>{m.reussis ?? 0}/{m.nombre}</td><td><button className="btn sm ghost" onClick={() => remove("multiplications", m.id)} aria-label="Supprimer">🗑</button></td></tr>)}</tbody></table>
        </details>
      )}
    </div>
  );
}

// ——— Liste à partager : prêts, dons, recherches (outils, matériaux, boutures, graines)
const TP: Record<Partage["type"], string> = { pret: "🔁 Je peux prêter", don: "🎁 Je donne", recherche: "🔎 Je cherche" };
export function PartageCard() {
  const liste = useStore((s) => s.partages);
  const [f, setF] = useState({ objet: "", type: "pret" as Partage["type"], note: "" });
  const texte = () => ["Mon jardin — à partager entre voisins :", ...(["pret", "don", "recherche"] as Partage["type"][]).flatMap((t) => { const l = liste.filter((x) => x.type === t); return l.length ? [`${TP[t]} :`, ...l.map((x) => `• ${x.objet}${x.note ? ` (${x.note})` : ""}`)] : []; })].join("\n");
  const partager = async () => {
    const t = texte();
    try {
      if (navigator.share) await navigator.share({ title: "À partager", text: t });
      else { await navigator.clipboard.writeText(t); toast("Liste copiée : collez-la dans un message"); }
    } catch { /* partage annulé */ }
  };
  return (
    <div>
      <p className="muted small">Outils, matériaux de récup, boutures, graines, fumier, broyat : listez ce que vous prêtez, donnez ou cherchez, et envoyez la liste à vos voisins, à votre jardin partagé ou à un groupe d'entraide. Rien n'est publié : c'est vous qui l'envoyez.</p>
      <div className="card">
        <div className="grid-sm">
          <input type="text" placeholder="Objet (broyeur, palettes, boutures de figuier…)" value={f.objet} onChange={(e) => setF({ ...f, objet: e.target.value })} />
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as Partage["type"] })} aria-label="Type">{Object.entries(TP).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <input type="text" placeholder="Précision (quand, combien…)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        </div>
        <button className="btn primary sm" style={{ marginTop: 6 }} disabled={!f.objet} onClick={() => { upsert("partages", { id: uid(), objet: f.objet, type: f.type, note: f.note || undefined }); setF({ ...f, objet: "", note: "" }); }}>Ajouter</button>
      </div>
      {(["pret", "don", "recherche"] as Partage["type"][]).map((t) => {
        const l = liste.filter((x) => x.type === t);
        return l.length ? <div key={t} className="card"><b>{TP[t]}</b><ul className="ticks small" style={{ margin: "6px 0 0" }}>{l.map((x) => <li key={x.id}>{x.objet}{x.note ? <span className="muted"> · {x.note}</span> : null} <button className="btn sm ghost" onClick={() => remove("partages", x.id)} aria-label="Retirer">✕</button></li>)}</ul></div> : null;
      })}
      {liste.length > 0 && <button className="btn" style={{ marginTop: 10 }} onClick={partager}>📨 Envoyer ma liste</button>}
      <p className="small"><a href={href("/guide/jardin-sans-argent")}>Jardiner sans argent : les filières gratuites →</a></p>
    </div>
  );
}
