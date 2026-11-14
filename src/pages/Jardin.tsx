import { useRef, useState } from "react";
import { useStore, upsert, remove, uid, today, update, type Espace, type Recolte, type Troupeau, type Soin } from "../lib/store";
import type { Animal } from "../data/types";
import { PLANTES, ANIMAUX, plante, animal } from "../data/index";
import { href, go } from "../lib/router";
import { recolteEstimee, addDays } from "../lib/calendar";
import { verifierRotation, TYPES_ESPACE } from "../lib/garden";
import { savePhoto } from "../lib/photos";
import { A, Empty, StoredPhoto, toast } from "../components/ui";
import { AjoutCulture } from "./PlanteFiche";
import MesPlantes from "../components/MesPlantes";
import { PRIX_KG, POIDS_PIECE } from "../data/prix";
import PlanVisuel, { ArrosageSemaine } from "../components/PlanVisuel";

const TOUS: [string, string][] = [["mesplantes", "🌿 Mes plantes"], ["cultures", "🌱 Cultures"], ["plan", "🗺️ Plan et rotation"], ["recoltes", "🧺 Récoltes"], ["journal", "📓 Journal"], ["graines", "🏺 Graines"], ["animaux", "🐔 Animaux"]];
const PAR_PROFIL: Record<string, string[]> = {
  appartement: ["mesplantes", "cultures", "journal", "graines"],
  balcon: ["mesplantes", "cultures", "recoltes", "journal", "graines"],
  "petit-jardin": ["cultures", "plan", "recoltes", "mesplantes", "journal", "graines", "animaux"],
  jardin: ["cultures", "plan", "recoltes", "mesplantes", "journal", "graines", "animaux"],
};

export default function Jardin({ tab: tab0 }: { tab?: string }) {
  const situation = useStore((s) => s.settings.situation);
  const hasAnimals = useStore((s) => s.troupeaux.length > 0);
  const ids = PAR_PROFIL[situation].filter((k) => k !== "animaux" || situation === "jardin" || hasAnimals);
  const TABS = TOUS.filter(([k]) => ids.includes(k) || k === tab0).sort((a, b) => ids.indexOf(a[0]) - ids.indexOf(b[0]));
  const tab = tab0 ?? ids[0];
  return (
    <div>
      <h1>{situation === "appartement" ? "🌿 Mes plantes et ma maison" : "🧺 Mon jardin"}</h1>
      <div className="tabs" role="tablist">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => go(`/jardin/${k}`)}>{l}</button>)}
      </div>
      {tab === "mesplantes" && <MesPlantes />}
      {tab === "cultures" && <Cultures />}
      {tab === "plan" && <Plan />}
      {tab === "recoltes" && <Recoltes />}
      {tab === "journal" && <Journal />}
      {tab === "graines" && <Graines />}
      {tab === "animaux" && <MesAnimaux />}
    </div>
  );
}

function PlantePicker({ value, onChange, filter }: { value: string; onChange: (v: string) => void; filter?: (p: (typeof PLANTES)[number]) => boolean }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">— Choisir une plante —</option>
      {PLANTES.filter((p) => (filter ? filter(p) : true)).sort((a, b) => a.nom.localeCompare(b.nom, "fr")).map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nom}</option>)}
    </select>
  );
}

function Cultures() {
  const cultures = useStore((s) => s.cultures);
  const espaces = useStore((s) => s.espaces.filter((e) => !e.archive));
  const [pid, setPid] = useState("");
  const [fini, setFini] = useState(false);
  const list = cultures.filter((c) => !!c.fini === fini).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <div className="card">
        <b>➕ Noter un semis ou une plantation</b>
        <div style={{ marginTop: 8 }}><PlantePicker value={pid} onChange={setPid} /></div>
        {pid && <AjoutCulture planteId={pid} onDone={() => setPid("")} />}
      </div>
      <div className="chips" style={{ margin: "12px 0" }}>
        <button className={`chip ${!fini ? "on" : ""}`} onClick={() => setFini(false)}>En cours</button>
        <button className={`chip ${fini ? "on" : ""}`} onClick={() => setFini(true)}>Terminées</button>
      </div>
      {!list.length && <Empty emoji="🌱">Aucune culture {fini ? "terminée" : "en cours"}. Notez vos semis : Racines calculera les dates de récolte et vous rappellera quoi faire.</Empty>}
      {list.map((c) => {
        const p = plante(c.planteId);
        const r = recolteEstimee(c);
        const e = espaces.find((x) => x.id === c.espaceId);
        return (
          <div key={c.id} className="card row">
            <span style={{ fontSize: "1.8rem" }}>{p?.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <a href={href(`/plante/${c.planteId}`)}><b>{p?.nom}</b></a> {c.note && <span className="muted small">· {c.note}</span>}
              <div className="small muted">{c.mode === "semis" ? "Semé" : "Planté"} le {new Date(c.date).toLocaleDateString("fr-FR")}{e ? ` · ${e.nom}` : ""}</div>
              {r && !c.fini && <div className="small">🧺 Récolte estimée : vers le {r.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</div>}
            </div>
            <div className="row" style={{ gap: 4 }}>
              <button className="btn sm" onClick={() => upsert("cultures", { ...c, fini: c.fini ? undefined : today() })}>{c.fini ? "↩︎" : "✓ Terminée"}</button>
              <button className="btn sm danger" onClick={() => confirm("Supprimer cette culture ?") && remove("cultures", c.id)} aria-label="Supprimer">🗑</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Plan() {
  const espaces = useStore((s) => s.espaces.filter((e) => !e.archive));
  const cultures = useStore((s) => s.cultures);
  const [nom, setNom] = useState("");
  const [type, setType] = useState<Espace["type"]>("planche");
  const [surface, setSurface] = useState("");
  const [test, setTest] = useState<{ esp: string; pid: string }>({ esp: "", pid: "" });
  const annee = new Date().getFullYear();
  const avis = test.esp && test.pid ? verifierRotation(test.esp, test.pid, annee, cultures) : [];
  return (
    <div>
      <p className="muted small">Déclarez vos planches, carrés, bacs, serre… Chaque culture notée y est rattachée : l'application vérifie la rotation d'une année sur l'autre.</p>
      <div className="card">
        <b>➕ Nouvel emplacement</b>
        <div className="row" style={{ marginTop: 8 }}>
          <input type="text" placeholder="Nom (ex. Planche 1, Carré nord…)" value={nom} onChange={(e) => setNom(e.target.value)} style={{ flex: 2, minWidth: 160 }} />
          <select value={type} onChange={(e) => setType(e.target.value as Espace["type"])} style={{ flex: 1, minWidth: 140 }}>
            {Object.entries(TYPES_ESPACE).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
          </select>
          <input type="number" placeholder="m²" value={surface} onChange={(e) => setSurface(e.target.value)} style={{ width: 90 }} aria-label="Surface en m²" />
          <button className="btn primary" disabled={!nom.trim()} onClick={() => { upsert("espaces", { id: uid(), nom: nom.trim(), type, surface: surface ? Number(surface) : undefined }); setNom(""); setSurface(""); }}>Ajouter</button>
        </div>
      </div>
      {espaces.length > 0 && <PlanVisuel />}
      {espaces.length > 0 && <ArrosageSemaine />}
      {!espaces.length && <Empty emoji="🗺️">Aucun emplacement. Commencez par « Planche 1 », « Planche 2 »… ou utilisez l'assistant <A to="/creer">Créer mon potager</A>.</Empty>}
      <div className="grid" style={{ marginTop: 12 }}>
        {espaces.map((e) => {
          const cs = cultures.filter((c) => c.espaceId === e.id).sort((a, b) => b.date.localeCompare(a.date));
          const parAn = new Map<string, string[]>();
          for (const c of cs) { const y = c.date.slice(0, 4); parAn.set(y, [...(parAn.get(y) ?? []), plante(c.planteId)?.nom ?? "?"]); }
          return (
            <div key={e.id} className="card">
              <div className="row between"><b>{TYPES_ESPACE[e.type].emoji} {e.nom}</b><button className="btn sm danger" onClick={() => confirm(`Supprimer « ${e.nom} » ?`) && remove("espaces", e.id)} aria-label="Supprimer">🗑</button></div>
              {e.surface && <div className="small muted">{e.surface} m²</div>}
              {[...parAn.entries()].map(([y, l]) => <div key={y} className="small"><b>{y}</b> : {[...new Set(l)].join(", ")}</div>)}
              {!cs.length && <div className="small muted">Pas encore de culture notée.</div>}
            </div>
          );
        })}
      </div>
      {espaces.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <b>🔄 Vérifier une rotation avant de planter</b>
          <div className="row" style={{ marginTop: 8 }}>
            <select value={test.esp} onChange={(e) => setTest({ ...test, esp: e.target.value })} style={{ flex: 1, minWidth: 150 }}>
              <option value="">— Emplacement —</option>
              {espaces.map((e) => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
            <div style={{ flex: 1, minWidth: 180 }}><PlantePicker value={test.pid} onChange={(v) => setTest({ ...test, pid: v })} filter={(p) => p.categorie === "legume" || p.categorie === "aromatique"} /></div>
          </div>
          {avis.map((a) => <div key={a.texte} className={`callout ${a.niveau === "ok" ? "ok" : a.niveau === "attention" ? "warn" : "danger"}`}>{a.niveau === "ok" ? "✅" : a.niveau === "attention" ? "⚠️" : "⛔"} {a.texte}</div>)}
        </div>
      )}
    </div>
  );
}

function Recoltes() {
  const recoltes = useStore((s) => s.recoltes);
  const [pid, setPid] = useState("");
  const [qte, setQte] = useState("");
  const [unite, setUnite] = useState<Recolte["unite"]>("kg");
  const [date, setDate] = useState(today());
  const annee = new Date().getFullYear().toString();
  const totaux = new Map<string, Record<string, number>>();
  for (const r of recoltes.filter((x) => x.date.startsWith(annee))) {
    const t = totaux.get(r.planteId) ?? {};
    const u = r.unite === "g" ? "kg" : r.unite;
    t[u] = (t[u] ?? 0) + (r.unite === "g" ? r.qte / 1000 : r.qte);
    totaux.set(r.planteId, t);
  }
  const totalKg = [...totaux.values()].reduce((a, t) => a + (t.kg ?? 0), 0);
  const prixPerso = useStore((s) => s.prix);
  const prixDe = (id: string) => prixPerso[id] ?? PRIX_KG[id];
  const valeurDe = (id: string, t: Record<string, number>) => {
    const pk = prixDe(id);
    if (!pk) return 0;
    const kg = (t.kg ?? 0) + ((t["pièces"] ?? 0) + (t.bottes ?? 0)) * (POIDS_PIECE[id] ?? 0);
    return kg * pk;
  };
  const valeur = [...totaux.entries()].reduce((a, [id, t]) => a + valeurDe(id, t), 0);
  const [editPrix, setEditPrix] = useState(false);
  return (
    <div>
      <div className="card">
        <b>➕ Peser une récolte</b>
        <div className="row" style={{ marginTop: 8 }}>
          <div style={{ flex: 2, minWidth: 180 }}><PlantePicker value={pid} onChange={setPid} filter={(p) => p.categorie !== "interieur"} /></div>
          <input type="number" step="0.01" placeholder="Quantité" value={qte} onChange={(e) => setQte(e.target.value)} style={{ width: 110 }} />
          <select value={unite} onChange={(e) => setUnite(e.target.value as Recolte["unite"])} style={{ width: 110 }}><option>kg</option><option>g</option><option>pièces</option><option>bottes</option></select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: 160 }} />
          <button className="btn primary" disabled={!pid || !qte} onClick={() => { upsert("recoltes", { id: uid(), planteId: pid, qte: Number(qte), unite, date }); setQte(""); toast("Récolte notée 🧺"); }}>Ajouter</button>
        </div>
      </div>
      <h2>Bilan {annee} {totalKg > 0 && <span className="badge green">{totalKg.toFixed(1)} kg</span>} {valeur > 0 && <span className="badge sun">≈ {Math.round(valeur)} € économisés</span>}</h2>
      {valeur > 0 && <p className="small muted">Valeur estimée au prix moyen du bio en magasin. <button className="btn sm ghost" onClick={() => setEditPrix(!editPrix)}>{editPrix ? "Fermer" : "Ajuster les prix"}</button></p>}
      {editPrix && (
        <div className="card small">
          {[...totaux.keys()].map((id) => (
            <div key={id} className="row" style={{ justifyContent: "space-between" }}>
              <span>{plante(id)?.nom}</span>
              <span><input type="number" step="0.5" min="0" value={prixDe(id) ?? ""} onChange={(e) => update((s) => ({ ...s, prix: { ...s.prix, [id]: Number(e.target.value) } }))} style={{ width: 80 }} /> €/kg</span>
            </div>
          ))}
        </div>
      )}
      {!totaux.size && <Empty emoji="🧺">Aucune récolte notée cette année.</Empty>}
      <div className="grid-sm">
        {[...totaux.entries()].map(([id, t]) => (
          <div key={id} className="card"><b>{plante(id)?.emoji} {plante(id)?.nom}</b><div className="small">{Object.entries(t).map(([u, v]) => `${u === "kg" ? v.toFixed(2) : v} ${u}`).join(" · ")}{valeurDe(id, t) > 0 && <span className="muted"> · ≈ {Math.round(valeurDe(id, t))} €</span>}</div></div>
        ))}
      </div>
      {recoltes.length > 0 && (
        <>
          <h3 style={{ marginTop: 18 }}>Historique</h3>
          <table className="table"><tbody>
            {[...recoltes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50).map((r) => (
              <tr key={r.id}><td>{new Date(r.date).toLocaleDateString("fr-FR")}</td><td>{plante(r.planteId)?.nom}</td><td>{r.qte} {r.unite}</td><td><button className="btn sm ghost" onClick={() => remove("recoltes", r.id)} aria-label="Supprimer">🗑</button></td></tr>
            ))}
          </tbody></table>
        </>
      )}
    </div>
  );
}

function Journal() {
  const notes = useStore((s) => s.notes);
  const [texte, setTexte] = useState("");
  const [photo, setPhoto] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="card">
        <b>📓 Nouvelle note</b>
        <textarea placeholder="Observations, météo, ce qui a marché ou pas…" value={texte} onChange={(e) => setTexte(e.target.value)} style={{ marginTop: 8 }} />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn" onClick={() => ref.current?.click()}>📷 {photo ? "Photo ajoutée ✓" : "Ajouter une photo"}</button>
          <input ref={ref} type="file" accept="image/*" capture="environment" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await savePhoto(f)); }} />
          <button className="btn primary" disabled={!texte.trim() && !photo} onClick={() => { upsert("notes", { id: uid(), date: today(), texte: texte.trim(), photo }); setTexte(""); setPhoto(undefined); }}>Enregistrer</button>
        </div>
      </div>
      {!notes.length && <Empty emoji="📓">Votre carnet de jardin est vide. Une photo par semaine du même endroit raconte une saison entière.</Empty>}
      {[...notes].sort((a, b) => b.date.localeCompare(a.date)).map((n) => (
        <div key={n.id} className="card row" style={{ alignItems: "flex-start" }}>
          {n.photo && <StoredPhoto k={n.photo} className="photo-thumb" />}
          <div style={{ flex: 1 }}>
            <div className="small muted">{new Date(n.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}{n.planteId && plante(n.planteId) ? ` · ${plante(n.planteId)!.nom}` : ""}</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{n.texte}</div>
          </div>
          <button className="btn sm ghost" onClick={() => confirm("Supprimer cette note ?") && remove("notes", n.id)} aria-label="Supprimer">🗑</button>
        </div>
      ))}
    </div>
  );
}

function Graines() {
  const graines = useStore((s) => s.graines);
  const [pid, setPid] = useState("");
  const [variete, setVariete] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const now = new Date().getFullYear();
  return (
    <div>
      <p className="muted small">Votre grainothèque : Racines vous signale les graines trop vieilles pour bien germer.</p>
      <div className="card">
        <div className="row">
          <div style={{ flex: 2, minWidth: 180 }}><PlantePicker value={pid} onChange={setPid} filter={(p) => !!p.graines} /></div>
          <input type="text" placeholder="Variété" value={variete} onChange={(e) => setVariete(e.target.value)} style={{ flex: 1, minWidth: 120 }} />
          <input type="number" value={annee} onChange={(e) => setAnnee(e.target.value)} style={{ width: 100 }} aria-label="Année de récolte ou d'achat" />
          <button className="btn primary" disabled={!pid} onClick={() => { upsert("graines", { id: uid(), planteId: pid, variete, annee: Number(annee) }); setVariete(""); }}>Ajouter</button>
        </div>
      </div>
      {!graines.length && <Empty emoji="🏺">Aucun sachet enregistré.</Empty>}
      <table className="table" style={{ marginTop: 10 }}><tbody>
        {[...graines].sort((a, b) => (plante(a.planteId)?.nom ?? "").localeCompare(plante(b.planteId)?.nom ?? "")).map((g) => {
          const p = plante(g.planteId);
          const age = now - g.annee;
          const max = p?.graines?.ans ?? 3;
          return (
            <tr key={g.id}>
              <td>{p?.emoji} <b>{p?.nom}</b> {g.variete && <span className="muted">« {g.variete} »</span>}</td>
              <td>{g.annee}</td>
              <td>{age > max ? <span className="badge danger">Trop vieilles ? testez</span> : age === max ? <span className="badge sun">Dernière année</span> : <span className="badge green">OK</span>}</td>
              <td><button className="btn sm ghost" onClick={() => remove("graines", g.id)} aria-label="Supprimer">🗑</button></td>
            </tr>
          );
        })}
      </tbody></table>
      <p className="small"><a href={href("/guide/graines-maison")}>🏺 Récolter et conserver ses graines, tester la germination →</a></p>
    </div>
  );
}

function MesAnimaux() {
  const troupeaux = useStore((s) => s.troupeaux);
  const soins = useStore((s) => s.soins);
  const ponte = useStore((s) => s.ponte);
  const [aid, setAid] = useState("");
  const [nom, setNom] = useState("");
  const [nombre, setNombre] = useState("1");
  const [oeufs, setOeufs] = useState("");
  const d30 = [...Array(30)].map((_, i) => addDays(today(), -i));
  const total30 = d30.reduce((a, d) => a + (ponte[d] ?? 0), 0);
  const hasPoules = troupeaux.some((t) => ["poule", "canard", "caille", "oie", "pintade"].includes(t.animalId));
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
      {hasPoules && (
        <div className="card" style={{ marginTop: 12 }}>
          <b>🥚 Ponte</b> <span className="small muted">— 30 derniers jours : {total30} œufs</span>
          <div className="row" style={{ marginTop: 8 }}>
            <input type="number" min="0" placeholder="Œufs aujourd'hui" value={oeufs} onChange={(e) => setOeufs(e.target.value)} style={{ width: 160 }} />
            <button className="btn primary" disabled={oeufs === ""} onClick={() => { update((s) => ({ ...s, ponte: { ...s.ponte, [today()]: Number(oeufs) } })); setOeufs(""); toast("Ponte notée 🥚"); }}>Noter</button>
            {ponte[today()] !== undefined && <span className="small">Aujourd'hui : {ponte[today()]}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 60, marginTop: 10 }} aria-label="Ponte des 30 derniers jours">
            {[...d30].reverse().map((d) => { const n = ponte[d] ?? 0; const max = Math.max(1, ...d30.map((x) => ponte[x] ?? 0)); return <div key={d} title={`${d} : ${n}`} style={{ flex: 1, height: `${(n / max) * 100}%`, minHeight: 2, background: n ? "var(--sun)" : "var(--surface-2)", borderRadius: 2 }} />; })}
          </div>
        </div>
      )}
      {!troupeaux.length && <Empty emoji="🐔">Aucun animal enregistré. Ajoutez vos poules, chèvres, lapins… pour suivre soins, vermifuges, vaccins et ponte, avec rappels.</Empty>}
      {troupeaux.map((t) => {
        const a = animal(t.animalId)!;
        const mes = soins.filter((x) => x.troupeauId === t.id).sort((x, y) => y.date.localeCompare(x.date));
        return <TroupeauCard key={t.id} t={t} a={a} soins={mes} />;
      })}
      <p className="small muted" style={{ marginTop: 14 }}>Ce suivi peut servir de base à votre registre d'élevage, mais il ne remplace pas les documents officiels obligatoires (registre papier ou numérique de l'EDE pour les ruminants, etc.).</p>
    </div>
  );
}

function TroupeauCard({ t, a, soins }: { t: Troupeau; a: Animal; soins: Soin[] }) {
  const [type, setType] = useState(a.soins[0]?.type ?? "Autre soin");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="row between">
        <div><a href={href(`/animal/${a.id}`)}><b>{a.emoji} {t.nom}</b></a> <span className="badge">{t.nombre}</span></div>
        <button className="btn sm danger" onClick={() => confirm(`Supprimer « ${t.nom} » et son historique ?`) && remove("troupeaux", t.id)} aria-label="Supprimer">🗑</button>
      </div>
      {a.soins.length > 0 && (
        <div className="small" style={{ marginTop: 6 }}>
          {a.soins.map((s) => {
            const last = soins.find((x) => x.type === s.type);
            const next = last ? addDays(last.date, s.tousLesJours) : null;
            return <div key={s.type}>• {s.type} : {last ? <>dernier le {new Date(last.date).toLocaleDateString("fr-FR")}, prochain vers le <b style={{ color: next! < today() ? "var(--danger)" : undefined }}>{new Date(next!).toLocaleDateString("fr-FR")}</b></> : <span className="muted">jamais noté</span>}</div>;
          })}
        </div>
      )}
      <details className="box"><summary>Noter un soin</summary>
        <div className="row" style={{ marginTop: 8 }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1, minWidth: 160 }}>
            {[...a.soins.map((s) => s.type), "Vermifuge", "Vaccin", "Visite vétérinaire", "Traitement", "Pesée", "Naissance", "Décès", "Autre soin"].filter((x, i, arr) => arr.indexOf(x) === i).map((x) => <option key={x}>{x}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: 160 }} />
        </div>
        <input type="text" placeholder="Détail (produit, dose, délai d'attente…)" value={note} onChange={(e) => setNote(e.target.value)} style={{ marginTop: 8 }} />
        <button className="btn primary sm" style={{ marginTop: 8 }} onClick={() => { upsert("soins", { id: uid(), troupeauId: t.id, type, date, note: note || undefined }); setNote(""); toast("Soin noté"); }}>Enregistrer</button>
        {soins.length > 0 && (
          <table className="table small" style={{ marginTop: 8 }}><tbody>
            {soins.slice(0, 20).map((s) => <tr key={s.id}><td>{new Date(s.date).toLocaleDateString("fr-FR")}</td><td>{s.type}</td><td>{s.note}</td><td><button className="btn sm ghost" onClick={() => remove("soins", s.id)} aria-label="Supprimer">🗑</button></td></tr>)}
          </tbody></table>
        )}
      </details>
    </div>
  );
}
