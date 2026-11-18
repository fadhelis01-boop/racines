

import { useState } from "react";

import { A, toast } from "./ui";
import { useStore, upsert, uid, today, getState } from "../lib/store";





import { varietesDe } from "../lib/exports";






// Formulaire « J'ai semé / planté » d'une fiche plante
export function AjoutCulture({ planteId, onDone }: { planteId: string; onDone: () => void }) {
  const espaces = useStore((s) => s.espaces.filter((e) => !e.archive));
  const [date, setDate] = useState(today());
  const [mode, setMode] = useState<"semis" | "plantation">("semis");
  const [espaceId, setEspaceId] = useState(espaces[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [variete, setVariete] = useState("");
  return (
    <div className="card" style={{ marginTop: 10 }}>
      <div className="row">
        <label className="row"><input type="radio" checked={mode === "semis"} onChange={() => setMode("semis")} /> Semis</label>
        <label className="row"><input type="radio" checked={mode === "plantation"} onChange={() => setMode("plantation")} /> Plantation</label>
      </div>
      <label className="field">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="field">Emplacement
        <select value={espaceId} onChange={(e) => setEspaceId(e.target.value)}>
          <option value="">— Non précisé —</option>
          {espaces.map((e) => <option key={e.id} value={e.id}>{e.nom}</option>)}
        </select>
      </label>
      {!espaces.length && <p className="small muted">Créez vos planches, carrés ou pots dans <A to="/jardin/plan">Mon jardin → Plan</A> pour suivre la rotation.</p>}
      <label className="field">Variété<input type="text" list="var-culture" placeholder="Ex. : Cœur de bœuf, Noire de Crimée…" value={variete} onChange={(e) => setVariete(e.target.value)} /><datalist id="var-culture">{varietesDe(getState(), planteId).map((v) => <option key={v} value={v} />)}</datalist></label>
      <label className="field">Note (quantité, origine des graines…)<input type="text" value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn primary" onClick={() => { upsert("cultures", { id: uid(), planteId, variete: variete.trim() || undefined, date, mode, espaceId: espaceId || undefined, note: note || undefined }); toast("Noté dans Mon jardin"); onDone(); }}>Enregistrer</button>
        <button className="btn ghost" onClick={onDone}>Annuler</button>
      </div>
    </div>
  );
}
