import { useState } from "react";


import { ProductionCard, IndividusSection, CouveesCard, RegistreCard, DepensesBilanCard, ReproductionCard, PerformancesCard } from "./Elevage";
import { useStore, getState, upsert, remove, uid, today, type Troupeau, type Soin } from "../lib/store";
import type { Animal } from "../data/types";
import { ANIMAUX, animal } from "../data/index";
import { href } from "../lib/router";
import { addDays, dernierSoin } from "../lib/calendar";



import { Empty, toast } from "./ui";
import { attentesEnCours, texteAttente, PRODUITS, type Produit } from "../lib/attente";
// Produits consommés selon l'espèce (pour les délais d'attente)
const PRODUITS_ESPECE = (id: string): Produit[] => (["poule", "canard", "oie", "pintade", "caille", "dindon"].includes(id) ? ["oeufs", "viande"] : ["chevre", "mouton", "ane", "cheval"].includes(id) ? ["lait", "viande"] : id === "abeille" ? ["miel"] : ["viande"]);




// Onglet « Animaux » de Mon jardin : groupes, soins, couvées, registre, dépenses
export function MesAnimaux() {
  const troupeaux = useStore((s) => s.troupeaux);
  const soins = useStore((s) => s.soins);
  const [aid, setAid] = useState("");
  const [nom, setNom] = useState("");
  const [nombre, setNombre] = useState("1");
  return (
    <div>
      <div className="card">
        <b>➕ Ajouter un groupe d'animaux</b>
        <div className="row" style={{ marginTop: 8 }}>
          <select value={aid} onChange={(e) => { setAid(e.target.value); setNom(animal(e.target.value)?.nom ?? ""); }} style={{ flex: 1, minWidth: 140 }}>
            <option value="">— Espèce —</option>
            {ANIMAUX.map((a) => <option key={a.id} value={a.id}>{a.emoji} {a.nom}</option>)}
          </select>
          <input type="text" placeholder="Nom du groupe" value={nom} onChange={(e) => setNom(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
          <input type="number" min="1" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: 80 }} aria-label="Nombre" />
          <button className="btn primary" disabled={!aid} onClick={() => { upsert("troupeaux", { id: uid(), animalId: aid, nom: nom || animal(aid)!.nom, nombre: Number(nombre) || 1, depuis: today() }); setAid(""); setNom(""); }}>Ajouter</button>
        </div>
      </div>
      <ProductionCard troupeaux={troupeaux} />
      {!troupeaux.length && <Empty emoji="🐔">Aucun animal enregistré. Ajoutez vos poules, chèvres, lapins… pour suivre soins, vermifuges, vaccins et ponte, avec rappels.</Empty>}
      {troupeaux.map((t) => {
        const a = animal(t.animalId)!;
        const mes = soins.filter((x) => x.troupeauId === t.id).sort((x, y) => y.date.localeCompare(x.date));
        return <TroupeauCard key={t.id} t={t} a={a} soins={mes} />;
      })}
      <CouveesCard />
      <ReproductionCard troupeaux={troupeaux} />
      <PerformancesCard troupeaux={troupeaux} />
      <RegistreCard troupeaux={troupeaux} />
      <DepensesBilanCard troupeaux={troupeaux} />
      <p className="small muted" style={{ marginTop: 14 }}>Ce suivi peut servir de base à votre registre d'élevage, mais il ne remplace pas les documents officiels obligatoires (registre papier ou numérique de l'EDE pour les ruminants, etc.).</p>
    </div>
  );
}

export function TroupeauCard({ t, a, soins }: { t: Troupeau; a: Animal; soins: Soin[] }) {
  const [type, setType] = useState(a.soins[0]?.type ?? "Autre soin");
  const [date, setDate] = useState(today());
  const [indiv, setIndiv] = useState("");
  const [prochain, setProchain] = useState("");
  const [attente, setAttente] = useState<Partial<Record<Produit, number>>>({});
  const individus = useStore((s) => (s.individus ?? []).filter((i) => i.troupeauId === t.id && !i.sortie));
  const tousIndividus = useStore((s) => s.individus);
  const enCours = attentesEnCours(soins, [t], tousIndividus ?? []);
  const [note, setNote] = useState("");
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="row between">
        <div><a href={href(`/animal/${a.id}`)}><b>{a.emoji} {t.nom}</b></a> <span className="badge">{t.nombre}</span></div>
        <button className="btn sm danger" onClick={() => confirm(`Supprimer « ${t.nom} » et son historique ?`) && remove("troupeaux", t.id)} aria-label="Supprimer">🗑</button>
      </div>
      {enCours.length > 0 && <div className="callout warn small" role="status" style={{ marginTop: 6 }}>{enCours.map((x) => <div key={x.soinId + x.produit}>🚫 {texteAttente(x)}</div>)}</div>}
      {a.soins.length > 0 && (
        <div className="small" style={{ marginTop: 6 }}>
          {a.soins.map((s) => {
            const last = dernierSoin(getState(), t.id, a.id, s.type);
            const next = last ? addDays(last.date, s.tousLesJours) : null;
            return <div key={s.type}>• {s.type} : {last ? <>dernier le {new Date(last.date).toLocaleDateString("fr-FR")}, prochain vers le <b style={{ color: next! < today() ? "var(--danger)" : undefined }}>{new Date(next!).toLocaleDateString("fr-FR")}</b></> : <span className="muted">jamais noté</span>}</div>;
          })}
        </div>
      )}
      {a.id === "abeille" ? <p className="small" style={{ marginTop: 6 }}><a className="btn sm primary" href={href("/rucher")}>🐝 Ouvrir le carnet du rucher</a> <span className="muted">ruches une par une, visites, varroa, traitements</span></p> : <IndividusSection t={t} a={a} />}
      <details className="box"><summary>Noter un soin</summary>
        <div className="row" style={{ marginTop: 8 }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1, minWidth: 160 }}>
            {[...a.soins.map((s) => s.type), "Vermifuge", "Vaccin", "Visite vétérinaire", "Traitement", "Pesée", "Naissance", "Décès", "Autre soin"].filter((x, i, arr) => arr.indexOf(x) === i).map((x) => <option key={x}>{x}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: 160 }} />
        </div>
        {individus.length > 0 && (
          <label className="field small" style={{ marginTop: 8 }}>Animal soigné<select value={indiv} onChange={(e) => setIndiv(e.target.value)}><option value="">Tout le groupe</option>{individus.map((i) => <option key={i.id} value={i.id}>{i.nom}{i.boucle ? ` (${i.boucle})` : ""}</option>)}</select></label>
        )}
        <input type="text" placeholder="Détail (produit, dose, n° d'ordonnance…)" value={note} onChange={(e) => setNote(e.target.value)} style={{ marginTop: 8 }} />
        <label className="field small" style={{ marginTop: 8 }}>À refaire le (facultatif : rappel de vaccin, 2e vermifuge…)<input type="date" value={prochain} onChange={(e) => setProchain(e.target.value)} /></label>
        {/(vermifuge|vaccin|traitement|vétérinaire|antibio|soin)/i.test(type) && (
          <fieldset className="box small" style={{ marginTop: 8 }}>
            <legend>🚫 Délai d'attente (jours, sur la notice ou l'ordonnance)</legend>
            <div className="grid-sm">
              {PRODUITS_ESPECE(a.id).map((p) => <label key={p} className="field">{PRODUITS[p]}<input type="number" min="0" value={attente[p] ?? ""} onChange={(e) => setAttente({ ...attente, [p]: e.target.value === "" ? undefined : Number(e.target.value) })} /></label>)}
            </div>
            <span className="muted">Pendant ce délai, l'accueil et l'agenda rappellent de ne pas consommer ces produits. Sans indication, demandez au vétérinaire : en élevage familial, beaucoup de médicaments ne sont pas autorisés chez les animaux dont on mange les produits.</span>
          </fieldset>
        )}
        <button className="btn primary sm" style={{ marginTop: 8 }} onClick={() => { const att = Object.fromEntries(Object.entries(attente).filter(([, v]) => v)); upsert("soins", { id: uid(), troupeauId: t.id, type, date, note: note || undefined, individuId: indiv || undefined, prochain: prochain || undefined, attente: Object.keys(att).length ? att : undefined }); setNote(""); setProchain(""); setAttente({}); toast("Soin noté"); }}>Enregistrer</button>
        {soins.length > 0 && (
          <table className="table small" style={{ marginTop: 8 }}><tbody>
            {soins.slice(0, 20).map((s) => <tr key={s.id}><td>{new Date(s.date).toLocaleDateString("fr-FR")}</td><td>{s.type}{s.individuId ? ` · ${individus.find((i) => i.id === s.individuId)?.nom ?? ""}` : ""}</td><td>{s.note}{s.attente ? ` · attente : ${Object.entries(s.attente).map(([p, j]) => `${PRODUITS[p as Produit]} ${j} j`).join(", ")}` : ""}{s.prochain ? ` · à refaire le ${new Date(s.prochain).toLocaleDateString("fr-FR")}` : ""}</td><td><button className="btn sm ghost" onClick={() => remove("soins", s.id)} aria-label="Supprimer">🗑</button></td></tr>)}
          </tbody></table>
        )}
      </details>
    </div>
  );
}
