import MotsLexique from "../components/MotsLexique";
import { useState } from "react";
import { useStore, upsert, remove, uid, today, getState, type LieuStock, type Stock } from "../lib/store";
import { PLANTES, plante, GUIDES } from "../data/index";
import { CONSERV, METHODES_CONSERV, RENDEMENTS, CALENDRIER_CONSERVES, TEMPS_TRAITEMENT, majorationAltitude, type MethodeConserv } from "../data/conservation";
import { proposer, selLacto, sucreConfiture, LIEUX, GARDE_DEFAUT, finDeGarde, numeroLot, alertesStocks, planAnnee, stocksCsv, arrondi, type Materiel } from "../lib/conserverie";
import { useRoute, href, go } from "../lib/router";
import { Listen, toast, download, Photo, Videos, Titre } from "../components/ui";
import { MOIS_NOMS } from "../data/util";

const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR");
const ONGLETS: [string, string][] = [["methodes", "🥫 Méthodes"], ["assistant", "🤔 J'en ai trop"], ["temps", "⏱️ Temps"], ["calculs", "🧮 Calculs"], ["calendrier", "📅 Calendrier"], ["stock", "🏠 Garde-manger"]];
const AVEC_CONSERV = PLANTES.filter((p) => CONSERV[p.id]).sort((a, b) => a.nom.localeCompare(b.nom));

export default function Conserver() {
  const route = useRoute();
  const onglet = route.query.get("t") ?? "methodes";
  return (
    <div>
      <Titre ico="recolte" emoji="🥫">Conserver ses récoltes</Titre>
      <p className="muted">Toutes les façons de manger son jardin toute l'année, de la cave à la confiture, avec les règles de sécurité et un garde-manger pour suivre ses bocaux.</p>
      <div className="callout warn" style={{ margin: "8px 0" }}><b>⚠️ Sécurité d'abord</b> Tomates : toujours acidifier. Ail, herbes et légumes à l'huile : au réfrigérateur seulement. Bocal bombé ou qui pétille : on jette sans goûter. <a href={href("/guide/cs-securite")}>Les règles →</a></div>
      <details className="box small"><summary>📖 Les mots de la conserverie</summary><p style={{ margin: "6px 0 0" }}>Touchez un mot pour son explication : <MotsLexique texte="blanchir, pasteuriser, stériliser, autoclave, conserve acide / peu acide, botulisme, lacto-fermentation, saumure, pectine." /></p></details>
      <div className="chips" role="tablist" style={{ margin: "8px 0 12px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/conserver?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "methodes" && <Methodes />}
      {onglet === "assistant" && <Assistant initial={route.query.get("p") ?? ""} />}
      {onglet === "temps" && <Temps />}
      {onglet === "calculs" && <Calculs />}
      {onglet === "calendrier" && <Calendrier />}
      {onglet === "stock" && <GardeManger prefill={route.query.get("p") ?? ""} kg={route.query.get("kg") ?? ""} />}
    </div>
  );
}

// ——— Méthodes illustrées (photo + vidéos) et guides
function Methodes() {
  const vus = new Set<string>();
  const methodes = (Object.keys(METHODES_CONSERV) as MethodeConserv[]).filter((m) => { const g = METHODES_CONSERV[m].guide; if (vus.has(g)) return false; vus.add(g); return true; });
  const guides = GUIDES.filter((g) => g.id.startsWith("cs-") || ["bocaux", "lactofermentation", "conserver-recoltes", "apres-recolte"].includes(g.id));
  return (
    <div>
      <Listen id="conserver-methodes" title="Les méthodes de conservation" blocks={methodes.map((m) => { const M = METHODES_CONSERV[m]; const g = GUIDES.find((x) => x.id === M.guide); return `${M.nom}. Garde : ${M.garde}. ${g?.resume ?? ""}`; })} />
      <div className="grid" style={{ marginTop: 10 }}>
        {methodes.map((m) => {
          const M = METHODES_CONSERV[m];
          const g = GUIDES.find((x) => x.id === M.guide);
          return (
            <a key={m} className="card" href={href(`/guide/${M.guide}`)} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="guide-hero" style={{ maxHeight: 140, overflow: "hidden", borderRadius: 8 }}><Photo id={M.guide} emoji={M.emoji} alt={M.nom} /></div>
              <b>{M.emoji} {g?.titre ?? M.nom}</b>
              <div className="small muted">Garde : {M.garde}{M.materiel ? ` · matériel : ${({ congelateur: "congélateur", sterilisateur: "stérilisateur", deshydrateur: "déshydrateur ou séchoir", cave: "cave", pressoir: "pressoir" })[M.materiel]}` : ""}</div>
              <div className="small"><MotsLexique texte={g?.resume ?? ""} /></div>
            </a>
          );
        })}
      </div>
      <h2>Tous les tutoriels</h2>
      <div className="chips">{guides.map((g) => <a key={g.id} className="chip" href={href(`/guide/${g.id}`)}>{g.emoji} {g.titre}</a>)}</div>
      <h2>En vidéo</h2>
      <Videos id="conserver" query="conserves maison débutant bocaux stérilisation" gestes={["Stériliser des bocaux", "Faire une confiture", "Lacto-fermentation", "Séchoir solaire", "Congeler les légumes"]} />
    </div>
  );
}

// ——— Assistant « j'en ai trop »
function Assistant({ initial }: { initial: string }) {
  const [pid, setPid] = useState(CONSERV[initial] ? initial : "tomate");
  const [kg, setKg] = useState("5");
  const [mat, setMat] = useState<Materiel[]>(["congelateur", "sterilisateur"]);
  const [temps, setTemps] = useState<1 | 2 | 3>(2);
  const [place, setPlace] = useState(true);
  const p = plante(pid);
  const c = CONSERV[pid];
  const res = proposer(pid, { kg: Number(kg) || 1, materiel: mat, temps, place });
  const toggle = (m: Materiel) => setMat(mat.includes(m) ? mat.filter((x) => x !== m) : [...mat, m]);
  return (
    <div>
      <div className="card">
        <b>J'ai trop de…</b>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <select value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Récolte">{AVEC_CONSERV.map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.nom}</option>)}</select>
          <label className="small">Quantité (kg)<input type="number" min="0.1" step="0.5" value={kg} onChange={(e) => setKg(e.target.value)} /></label>
          <select value={temps} onChange={(e) => setTemps(Number(e.target.value) as 1 | 2 | 3)} aria-label="Temps disponible"><option value={1}>Peu de temps (moins d'1 h)</option><option value={2}>Une demi-journée</option><option value={3}>Une journée entière</option></select>
          <label className="small"><input type="checkbox" checked={place} onChange={(e) => setPlace(e.target.checked)} /> J'ai de la place pour stocker</label>
        </div>
        <div className="chips" style={{ marginTop: 6 }}>
          {(["congelateur", "sterilisateur", "deshydrateur", "cave", "pressoir"] as Materiel[]).map((m) => <label key={m} className="chip"><input type="checkbox" checked={mat.includes(m)} onChange={() => toggle(m)} /> {({ congelateur: "Congélateur", sterilisateur: "Stérilisateur / marmite", deshydrateur: "Déshydrateur", cave: "Cave / cellier", pressoir: "Pressoir" })[m]}</label>)}
        </div>
      </div>
      {p && c && (
        <div className="card" style={{ marginTop: 10 }}>
          <b>{p.emoji} {p.nom}</b> <span className="small muted">— au frais : {c.frais}</span>
          {c.nonCongel && <div className="small">🚫 Ne se congèle pas : {c.nonCongel}</div>}
          <ol style={{ paddingLeft: 18, marginTop: 8 }}>
            {res.map((r, i) => { const M = METHODES_CONSERV[r.methode]; return (
              <li key={r.methode} style={{ marginBottom: 8, opacity: r.manque ? 0.6 : 1 }}>
                <b>{M.emoji} {M.nom}</b>{i === 0 && !r.manque ? <span className="badge" style={{ marginLeft: 6 }}>conseillé</span> : null} <span className="small muted">garde {M.garde}</span>
                <div className="small">{[r.manque, ...r.pourquoi].filter(Boolean).join(" ")}</div>
                {r.rendement && <div className="small">📦 {r.rendement}</div>}
                <div className="small"><a href={href(`/guide/${M.guide}`)}>Pas à pas →</a> · <a href={href(`/conserver?t=stock&p=${pid}&kg=${kg}`)}>Noter au garde-manger</a></div>
              </li>); })}
          </ol>
          <p className="small muted">Un surplus de frais se donne aussi : voisins, gratiféria, épicerie solidaire (légumes frais uniquement). <a href={href("/guide/vendre-surplus")}>Donner ou vendre son surplus →</a></p>
        </div>
      )}
    </div>
  );
}

// ——— Barème des temps
function Temps() {
  const [alt, setAlt] = useState("0");
  const maj = majorationAltitude(Number(alt) || 0);
  const fam: Record<string, string> = { blanchiment: "Blanchir avant de congeler", pasteurisation: "Pasteuriser (produits acides)", sterilisation: "Stériliser à 100 °C (bocaux couverts d'eau)", autoclave: "Stériliser sous pression (autoclave)" };
  return (
    <div>
      <label className="small">Altitude de votre cuisine (m) <input type="number" min="0" step="100" value={alt} onChange={(e) => setAlt(e.target.value)} style={{ width: 110 }} /></label>
      <p className="small">{maj === null ? <b style={{ color: "var(--danger)" }}>Au-delà de 1 800 m, l'eau bout trop bas : stérilisez sous pression ou congelez.</b> : maj ? <>À {alt} m, ajoutez <b>{maj} minutes</b> aux temps de pasteurisation et de stérilisation des produits acides. Au-delà de 900 m, les conserves peu acides se font sous pression.</> : "Au niveau de la mer : temps du tableau."}</p>
      {Object.entries(fam).map(([k, t]) => (
        <div key={k} className="card" style={{ marginTop: 10 }}>
          <b>{t}</b>
          <table className="table small" style={{ marginTop: 6 }}>
            <thead><tr><th>Produit</th>{k !== "blanchiment" && <th>0,5 L</th>}<th>{k === "blanchiment" ? "Durée" : "1 L"}</th><th>Température</th></tr></thead>
            <tbody>{TEMPS_TRAITEMENT.filter((x) => x.famille === k).map((x) => (
              <tr key={x.produit}><td>{x.acide ? "✅" : "🔴"} {x.produit}{x.note ? <><br /><span className="muted">{x.note}</span></> : null}</td>{k !== "blanchiment" && <td>{x.t05 ?? "-"}</td>}<td>{x.t1 ?? "-"}</td><td>{x.temp}</td></tr>
            ))}</tbody>
          </table>
        </div>
      ))}
      <p className="small muted">✅ produit acide (pH sous 4,6) · 🔴 peu acide : risque de botulisme, stérilisation sous pression recommandée. Temps comptés à partir de la reprise de l'ébullition, bocaux couverts de 2 à 3 cm d'eau. Repères indicatifs à vérifier : la notice de vos bocaux et de votre stérilisateur fait foi, et les tableaux officiels (guides des fabricants, recommandations sanitaires) priment sur cette page. <a href={href("/guide/cs-temps")}>Explications →</a></p>
    </div>
  );
}

// ——— Calculs : rendements, sel, sucre, plan de l'année
function Calculs() {
  const [rid, setRid] = useState(RENDEMENTS[0].id);
  const [kg, setKg] = useState("5");
  const r = RENDEMENTS.find((x) => x.id === rid)!;
  const [kgL, setKgL] = useState("2");
  const [lS, setLS] = useState("1");
  const sl = selLacto(Number(kgL) || 0, Number(lS) || 0);
  const [kgC, setKgC] = useState("2");
  const [taux, setTaux] = useState("800");
  const sc = sucreConfiture(Number(kgC) || 0, Number(taux) || 0);
  const [lignes, setLignes] = useState([
    { rendementId: "coulis", parMois: 4, mois: 9, contenance: 0.5 },
    { rendementId: "confiture", parMois: 2, mois: 12, contenance: 0.37 },
    { rendementId: "haricots-congeles", parMois: 4, mois: 9, contenance: 0.5 },
    { rendementId: "compote", parMois: 3, mois: 8, contenance: 0.5 },
  ]);
  const plan = planAnnee(lignes);
  const maj = (i: number, k: string, v: number | string) => setLignes(lignes.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  return (
    <div>
      <div className="card">
        <b>📦 Combien de bocaux avec ma récolte ?</b>
        <div className="row" style={{ marginTop: 6 }}>
          <select value={rid} onChange={(e) => setRid(e.target.value)} aria-label="Préparation">{RENDEMENTS.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}</select>
          <input type="number" min="0" step="0.5" value={kg} onChange={(e) => setKg(e.target.value)} style={{ width: 90 }} aria-label="Quantité" /> <span className="small">{r.par.replace(/^kg/, "kg")}</span>
        </div>
        <p>➡️ Environ <b>{arrondi((Number(kg) || 0) * r.facteur)} {r.unite}</b>{r.unite === "L" ? ` (≈ ${Math.ceil(((Number(kg) || 0) * r.facteur) / 0.5)} bocaux de 0,5 L)` : ""}. <span className="small muted">{r.note}</span></p>
      </div>
      <div className="card" style={{ marginTop: 10 }}>
        <b>🧂 Sel de la lacto-fermentation</b>
        <div className="row" style={{ marginTop: 6 }}>
          <label className="small">Légumes râpés (kg)<input type="number" min="0" step="0.5" value={kgL} onChange={(e) => setKgL(e.target.value)} style={{ width: 90 }} /></label>
          <label className="small">ou saumure (litres)<input type="number" min="0" step="0.5" value={lS} onChange={(e) => setLS(e.target.value)} style={{ width: 90 }} /></label>
        </div>
        <p className="small">Légumes râpés ou émincés : <b>{sl.rape} g de sel</b> (2 %). Légumes en morceaux : <b>{sl.saumure} g de sel</b> dans {lS} L d'eau non chlorée (30 g/L). Sel non iodé, sans antiagglomérant.</p>
      </div>
      <div className="card" style={{ marginTop: 10 }}>
        <b>🍓 Sucre de la confiture</b>
        <div className="row" style={{ marginTop: 6 }}>
          <label className="small">Fruits préparés (kg)<input type="number" min="0" step="0.5" value={kgC} onChange={(e) => setKgC(e.target.value)} style={{ width: 90 }} /></label>
          <select value={taux} onChange={(e) => setTaux(e.target.value)} aria-label="Taux de sucre"><option value="1000">Classique (1 kg/kg)</option><option value="800">Traditionnelle (800 g/kg)</option><option value="700">Moins sucrée (700 g/kg)</option><option value="500">Allégée (500 g/kg)</option></select>
        </div>
        <p className="small">Prévoir <b>{sc.sucre} kg de sucre</b>. {sc.allegee ? <b style={{ color: "var(--danger)" }}>Allégée : pasteurisez les pots 10 à 15 min et gardez-les au frais après ouverture.</b> : "Se garde 1 an au placard, fermée bouillante avec une capsule neuve."}</p>
      </div>
      <div className="card" style={{ marginTop: 10 }}>
        <b>📋 Mes conserves pour l'année</b>
        <p className="small muted">Combien en ouvrez-vous par mois, et pendant combien de mois ? L'appli calcule les bocaux et la récolte nécessaire.</p>
        <table className="table small"><tbody>
          {plan.map((l, i) => (
            <tr key={i}>
              <td><select value={l.rendementId} onChange={(e) => maj(i, "rendementId", e.target.value)} aria-label="Préparation">{RENDEMENTS.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}</select></td>
              <td><input type="number" min="0" value={l.parMois} onChange={(e) => maj(i, "parMois", Number(e.target.value))} style={{ width: 55 }} aria-label="Par mois" /> /mois</td>
              <td><input type="number" min="1" max="12" value={l.mois} onChange={(e) => maj(i, "mois", Number(e.target.value))} style={{ width: 50 }} aria-label="Mois" /> mois</td>
              <td><b>{l.bocaux}</b> × {lignes[i].contenance} {l.unite === "kg" ? "kg" : "L"}<br /><span className="muted">≈ {l.kgFrais} kg de {plante(l.planteId)?.nom.toLowerCase() ?? "produit frais"}</span></td>
              <td><button className="btn sm ghost" onClick={() => setLignes(lignes.filter((_, j) => j !== i))} aria-label="Retirer">✕</button></td>
            </tr>
          ))}
        </tbody></table>
        <button className="btn sm" onClick={() => setLignes([...lignes, { rendementId: "cornichons", parMois: 1, mois: 12, contenance: 0.5 }])}>+ Ajouter une préparation</button>
        <p className="small"><a href={href("/calculs?s=famille")}>Combien planter pour ma famille →</a> · <a href={href("/plan-culture")}>Plan de culture →</a></p>
      </div>
    </div>
  );
}

// ——— Calendrier des conserves
function Calendrier() {
  const m = new Date().getMonth() + 1;
  return (
    <div>
      <p className="small muted">Les pics de récolte décident des journées de conserves. Repères en climat tempéré : avancez de 2 à 4 semaines dans le Midi, retardez en montagne.</p>
      {[...Array(12)].map((_, i) => { const k = ((m - 1 + i) % 12) + 1; return (
        <div key={k} className="card" style={{ marginTop: 8, borderLeft: k === m ? "4px solid var(--green)" : undefined }}>
          <b>{MOIS_NOMS[k - 1]}{k === m ? " (ce mois-ci)" : ""}</b>
          <ul className="ticks small" style={{ margin: "4px 0 0" }}>{CALENDRIER_CONSERVES[k].map((x) => <li key={x}>{x}</li>)}</ul>
        </div>); })}
    </div>
  );
}

// ——— Garde-manger : inventaire, rappels, étiquettes
function GardeManger({ prefill, kg }: { prefill: string; kg: string }) {
  const stocks = useStore((s) => s.stocks);
  const p0 = plante(prefill);
  const m0 = (CONSERV[prefill]?.methodes.find((m) => !["frais", "terre"].includes(m)) ?? "sterilisation") as MethodeConserv;
  const [f, setF] = useState({ produit: p0 ? p0.nom : "", planteId: p0?.id ?? "", methode: m0 as string, lieu: (m0 === "congelation" ? "congelateur" : m0 === "cave" ? "cave" : "placard") as LieuStock, date: today(), quantite: kg ? String(Math.max(1, Math.round(Number(kg)))) : "6", unite: m0 === "congelation" ? "sachets" : m0 === "cave" ? "kg" : "bocaux", note: "" });
  const [filtre, setFiltre] = useState<"" | LieuStock>("");
  const [etiq, setEtiq] = useState<string[]>([]);
  const actifs = stocks.filter((s) => s.quantite > 0 && (!filtre || s.lieu === filtre)).sort((a, b) => finDeGarde(a).localeCompare(finDeGarde(b)));
  const al = alertesStocks(stocks, today());
  const ajout = () => {
    const lot = numeroLot(f.produit, f.date, getState().stocks);
    upsert("stocks", { id: uid(), produit: f.produit, planteId: f.planteId || undefined, methode: f.methode, lieu: f.lieu, date: f.date, quantite: Number(f.quantite) || 1, unite: f.unite, lot, gardeMois: GARDE_DEFAUT[f.methode] ?? 12, note: f.note || undefined });
    toast(`Ajouté au garde-manger (lot ${lot})`);
    setF({ ...f, note: "" });
  };
  const aImprimer = stocks.filter((s) => etiq.includes(s.id));
  return (
    <div>
      {(al.depasses.length > 0 || al.bientot.length > 0) && (
        <div className="card" style={{ borderLeft: "4px solid var(--danger)" }}>
          <b>À consommer en priorité</b>
          <ul className="small" style={{ margin: "4px 0 0" }}>{[...al.depasses, ...al.bientot].map((s) => <li key={s.id}>{s.produit} ({s.quantite} {s.unite}, {LIEUX[s.lieu].toLowerCase()}) : avant le {fr(finDeGarde(s))}</li>)}</ul>
        </div>
      )}
      <details className="box" open={!stocks.length}><summary>➕ Ajouter au garde-manger</summary>
        <div className="grid-sm" style={{ marginTop: 6 }}>
          <input type="text" placeholder="Produit (ex. Coulis de tomates)" value={f.produit} onChange={(e) => setF({ ...f, produit: e.target.value })} list="produits-conserves" />
          <datalist id="produits-conserves">{RENDEMENTS.map((r) => <option key={r.id} value={r.nom} />)}{AVEC_CONSERV.map((p) => <option key={p.id} value={p.nom} />)}</datalist>
          <select value={f.methode} onChange={(e) => { const m = e.target.value; setF({ ...f, methode: m, lieu: m === "congelation" ? "congelateur" : m === "cave" ? "cave" : f.lieu === "congelateur" ? "placard" : f.lieu }); }} aria-label="Méthode">{(Object.keys(METHODES_CONSERV) as MethodeConserv[]).filter((m) => !["frais", "terre"].includes(m)).map((m) => <option key={m} value={m}>{METHODES_CONSERV[m].emoji} {METHODES_CONSERV[m].nom}</option>)}</select>
          <select value={f.lieu} onChange={(e) => setF({ ...f, lieu: e.target.value as LieuStock })} aria-label="Lieu">{(Object.keys(LIEUX) as LieuStock[]).map((l) => <option key={l} value={l}>{LIEUX[l]}</option>)}</select>
          <label className="small">Préparé le<input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
          <input type="number" min="0" step="any" value={f.quantite} onChange={(e) => setF({ ...f, quantite: e.target.value })} aria-label="Quantité" />
          <select value={f.unite} onChange={(e) => setF({ ...f, unite: e.target.value })} aria-label="Unité">{["bocaux", "pots", "sachets", "bouteilles", "kg", "boîtes"].map((u) => <option key={u}>{u}</option>)}</select>
        </div>
        <input type="text" placeholder="Note (recette, temps de stérilisation, taille des bocaux…)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={{ marginTop: 6 }} />
        <button className="btn sm primary" style={{ marginTop: 6 }} disabled={!f.produit} onClick={ajout}>Ajouter</button>
        <p className="small muted">Un numéro de lot est créé automatiquement et une date de garde conseillée est calculée selon la méthode (modifiable par la note).</p>
      </details>
      <div className="chips" style={{ margin: "10px 0" }}>
        <button className={`chip ${!filtre ? "on" : ""}`} onClick={() => setFiltre("")}>Tout ({stocks.filter((s) => s.quantite > 0).length})</button>
        {(Object.keys(LIEUX) as LieuStock[]).map((l) => <button key={l} className={`chip ${filtre === l ? "on" : ""}`} onClick={() => setFiltre(l)}>{LIEUX[l]} ({stocks.filter((s) => s.quantite > 0 && s.lieu === l).length})</button>)}
      </div>
      {!actifs.length ? <p className="muted small">Votre garde-manger est vide. Ajoutez vos bocaux, sachets congelés et réserves de cave : l'appli vous rappellera ce qu'il faut consommer en premier.</p> : (
        <table className="table small"><tbody>
          {actifs.map((s) => { const fin = finDeGarde(s); const urgent = fin < today(); return (
            <tr key={s.id}>
              <td><input type="checkbox" checked={etiq.includes(s.id)} onChange={(e) => setEtiq(e.target.checked ? [...etiq, s.id] : etiq.filter((x) => x !== s.id))} aria-label="Étiquette" /></td>
              <td><b>{METHODES_CONSERV[s.methode as MethodeConserv]?.emoji} {s.produit}</b><br /><span className="muted">{LIEUX[s.lieu]} · {fr(s.date)}{s.lot ? ` · lot ${s.lot}` : ""}</span></td>
              <td><b>{s.quantite}</b> {s.unite}<br /><span style={{ color: urgent ? "var(--danger)" : undefined }} className={urgent ? "" : "muted"}>avant le {fr(fin)}</span></td>
              <td style={{ whiteSpace: "nowrap" }}><button className="btn sm" onClick={() => upsert("stocks", { ...s, quantite: Math.max(0, s.quantite - 1) })}>−1</button> <button className="btn sm ghost" onClick={() => upsert("stocks", { ...s, quantite: s.quantite + 1 })}>+1</button> <button className="btn sm ghost" onClick={() => confirm(`Supprimer « ${s.produit} » ?`) && remove("stocks", s.id)} aria-label="Supprimer">🗑</button></td>
            </tr>); })}
        </tbody></table>
      )}
      <div className="row" style={{ marginTop: 8, gap: 6 }}>
        {stocks.length > 0 && <button className="btn sm" onClick={() => download("garde-manger.csv", new Blob([stocksCsv(getState().stocks)], { type: "text/csv;charset=utf-8" }))}>Exporter (tableur)</button>}
        <button className="btn sm" disabled={!aImprimer.length} onClick={() => window.print()}>🏷️ Imprimer les étiquettes ({aImprimer.length})</button>
      </div>
      {aImprimer.length > 0 && <Etiquettes stocks={aImprimer} />}
      <p className="small muted" style={{ marginTop: 10 }}>Rappels : les produits dont la garde conseillée est dépassée ou proche apparaissent dans vos tâches, ainsi qu'une tournée hebdomadaire de la cave d'octobre à avril. <a href={href("/guide/cs-cave")}>Bien tenir sa cave →</a> · <a href={href("/guide/cs-atelier-collectif")}>Cahier de fabrication en atelier →</a></p>
    </div>
  );
}

function Etiquettes({ stocks }: { stocks: Stock[] }) {
  return (
    <div className="etiquettes" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginTop: 10 }}>
      {stocks.flatMap((s) => [...Array(Math.min(24, Math.max(1, s.quantite)))].map((_, i) => (
        <div key={s.id + i} style={{ border: "1px dashed #999", borderRadius: 6, padding: 6, fontSize: 12, background: "#fff", color: "#222", breakInside: "avoid" }}>
          <b style={{ fontSize: 13 }}>{s.produit}</b><br />
          {METHODES_CONSERV[s.methode as MethodeConserv]?.nom ?? s.methode}<br />
          Fait le {fr(s.date)}<br />
          À consommer avant {fr(finDeGarde(s))}{s.lot ? <><br />Lot {s.lot}</> : null}
        </div>
      )))}
    </div>
  );
}
