import { useState } from "react";
import { useStore, upsert, remove, uid, today, getState, type TypeIntervention } from "../lib/store";
import { PLANTES, plante } from "../data/index";
import { MARAICH, TEMPS_METHODE } from "../data/maraichage";
import { planifier, plantsParPlanche, successions, engraisVertPour, nurserie, tempsDeTravail, occupation } from "../lib/plan-culture";
import { useRoute, href, go } from "../lib/router";
import { Back, Listen, toast, download, Titre } from "../components/ui";
import { Vignette } from "../components/Ico";
import { EXPORTS } from "../lib/exports";
import { economiePlanche, classementCultures, PRIX_BIO, PANIERS_TYPES, paniersPossibles } from "../lib/economie";

const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const ONGLETS: [string, string][] = [["planifier", "📆 Produire en continu"], ["planches", "🌍 Mes planches"], ["nurserie", "🌱 Nurserie"], ["economie", "💶 Économie"], ["temps", "⏱️ Temps de travail"]];
const legumes = () => PLANTES.filter((p) => MARAICH[p.id] && (p.categorie === "legume" || p.categorie === "aromatique")).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

export default function PlanCulture() {
  const onglet = useRoute().query.get("t") ?? "planifier";
  return (
    <div>
      <Back />
      <Titre ico="calendrier" emoji="📋">Plan de culture</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>Pour un potager qui produit en continu : séries de semis échelonnées, nombre de plants et de graines, plants par planche, successions sur une même planche, calendrier de la nurserie et temps de travail. Valeurs indicatives, à ajuster avec votre expérience.</p>
      <div className="chips" role="tablist" style={{ margin: "10px 0 14px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/plan-culture?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "planifier" && <Planifier />}
      {onglet === "planches" && <Planches />}
      {onglet === "nurserie" && <Nurserie />}
      {onglet === "temps" && <Temps />}
      {onglet === "economie" && <Economie />}
    </div>
  );
}

function Planifier() {
  const zone = useStore((s) => s.settings.zone);
  const [pid, setPid] = useState("laitue");
  const m = MARAICH[pid];
  const [qte, setQte] = useState(m?.unite === "pièces" ? "10" : "2");
  const r = planifier(pid, Number(qte) || 0, zone);
  const p = plante(pid);
  const total = r.series.reduce((a, s) => ({ plants: a.plants + s.plants, graines: a.graines + s.graines, surface: a.surface + s.surface }), { plants: 0, graines: 0, surface: 0 });
  const noter = (s: (typeof r.series)[number]) => { upsert("cultures", { id: uid(), planteId: pid, date: s.semis, mode: s.motte ? "plantation" : "semis", note: `Série planifiée : ${s.plants} plants` }); toast("Série ajoutée à vos cultures"); };
  return (
    <div>
      <div className="card stack">
        <div className="grid-sm">
          <label className="field">Légume<select value={pid} onChange={(e) => { setPid(e.target.value); setQte(MARAICH[e.target.value]?.unite === "pièces" ? "10" : "2"); }}>{legumes().map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.nom}</option>)}</select></label>
          <label className="field">Je veux par semaine<span className="row" style={{ gap: 6, flexWrap: "nowrap" }}><input type="number" min="0" step="0.5" value={qte} onChange={(e) => setQte(e.target.value)} style={{ maxWidth: 110 }} /> <span className="small muted">{m?.unite === "pièces" ? "pièces" : "kg"}</span></span></label>
        </div>
        {m && <p className="small muted" style={{ margin: 0 }}>Repères : {m.rang} cm sur le rang × {m.interRang} cm entre rangs ; une série se récolte environ {m.fenetre} semaine{m.fenetre > 1 ? "s" : ""} ; rendement indicatif {m.rdt} {m.unite === "pièces" ? "pièces" : "kg"}/m²{m.motte ? ` ; ${m.motte} semaines en motte avant plantation` : " ; semis direct ou plants"}.</p>}
      </div>
      {r.avertissement && <div className="callout warn small">{r.avertissement}</div>}
      {r.series.length > 0 && (
        <>
          <h2>{r.series.length} série{r.series.length > 1 ? "s" : ""}, une toutes les {r.intervalle} semaine{r.intervalle > 1 ? "s" : ""}</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table className="table small" style={{ minWidth: 520 }}>
              <thead><tr><th>{m?.motte ? "Semis en motte" : "Semis"}</th><th>Récolte</th><th>Plants</th><th>Graines</th><th>Surface</th><th></th></tr></thead>
              <tbody>{r.series.map((s) => <tr key={s.semis}><td>{fr(s.semis)}</td><td>{fr(s.recolteDebut)} → {fr(s.recolteFin)}</td><td>{s.plants}</td><td>{s.graines || "plants"}</td><td>{s.surface} m²</td><td><button className="btn sm ghost" onClick={() => noter(s)}>+ Mes cultures</button></td></tr>)}</tbody>
            </table>
          </div>
          <p className="small"><b>Total de la saison :</b> {total.plants} plants{total.graines ? `, environ ${total.graines} graines (germination et 20 % de pertes comptées)` : ""}, {Math.round(total.surface * 10) / 10} m² cumulés (une même planche peut porter plusieurs séries successives).</p>
          <Listen id={`plan-${pid}`} title={`Plan : ${p?.nom}`} blocks={r.series.map((s, i) => `Série ${i + 1} : semer le ${fr(s.semis)}, ${s.plants} plants, récolte à partir du ${fr(s.recolteDebut)}.`)} />
        </>
      )}
      <p className="small"><a href={href("/calculs?s=famille")}>Combien planter pour ma famille ? →</a> · <a href={href("/guide/semis-interieur")}>Réussir ses semis →</a></p>
    </div>
  );
}

function Planches() {
  const s = useStore((x) => x);
  const zone = s.settings.zone;
  const espaces = s.espaces.filter((e) => !e.archive);
  const an = new Date().getFullYear();
  const occ = occupation(espaces, s.cultures, an);
  const [serie, setSerie] = useState({ n: "6", longueur: "10", largeur: "0.75", passe: "0.4", nom: "Planche" });
  const [calc, setCalc] = useState({ pid: "carotte", longueur: "10", largeur: "0.75" });
  const ppp = plantsParPlanche(calc.pid, Number(calc.longueur) || 0, Number(calc.largeur) || 0);
  const creer = () => {
    const n = Number(serie.n) || 1, L = Number(serie.longueur) || 10, l = Number(serie.largeur) || 0.75, pp = Number(serie.passe) || 0.4;
    const base = espaces.length;
    for (let i = 0; i < n; i++) upsert("espaces", { id: uid(), nom: `${serie.nom} ${base + i + 1}`, type: "planche", surface: Math.round(L * l * 10) / 10, x: 0.5 + i * (l + pp), y: 0.5, l, p: L });
    toast(`${n} planches créées dans le plan`);
  };
  const debutAn = new Date(an, 0, 1).getTime(), duree = new Date(an + 1, 0, 1).getTime() - debutAn;
  const pos = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - debutAn) / duree) * 100));
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Occupation des planches en {an}</h2>
      {!espaces.length && <p className="muted small">Créez vos planches ci-dessous ou dans <a href={href("/jardin/plan")}>Mon jardin → Plan</a>, puis rattachez vos cultures à une planche.</p>}
      {occ.map(({ espace, periodes }) => {
        const derniere = periodes.map((p) => p.fin).sort((a, b) => b.getTime() - a.getTime())[0];
        const libre = derniere ? (derniere.getFullYear() === an && derniere > new Date() ? derniere : derniere.getFullYear() === an ? new Date() : null) : new Date();
        const suite = libre ? successions(espace.id, libre, s.cultures, zone, 6) : [];
        const ev = libre ? engraisVertPour(libre.getMonth() + 1) : null;
        return (
          <div key={espace.id} className="card">
            <b>{espace.nom}</b> {espace.surface ? <span className="small muted">{espace.surface} m²</span> : null}
            <div style={{ position: "relative", height: 26, background: "var(--surface-2)", borderRadius: 6, margin: "6px 0", overflow: "hidden" }} aria-label={`Occupation de ${espace.nom}`}>
              {periodes.map(({ c, debut, fin }) => <div key={c.id} title={`${plante(c.planteId)?.nom} : ${debut.toLocaleDateString("fr-FR")} → ${fin.toLocaleDateString("fr-FR")}`} style={{ position: "absolute", left: `${pos(debut)}%`, width: `${Math.max(2, pos(fin) - pos(debut))}%`, top: 3, bottom: 3, background: "var(--green)", opacity: 0.75, borderRadius: 4, color: "#fff", fontSize: 11, overflow: "hidden", whiteSpace: "nowrap", paddingLeft: 4 }}>{plante(c.planteId)?.nom}</div>)}
            </div>
            <div className="small muted" style={{ display: "flex", justifyContent: "space-between" }}><span>janv.</span><span>avril</span><span>juil.</span><span>oct.</span><span>déc.</span></div>
            {libre && (
              <div className="small" style={{ marginTop: 6 }}>
                {libre.getTime() - Date.now() < 86400000 ? <b>Libre maintenant</b> : <>Libre vers le <b>{libre.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</b></>} : {suite.length ? <>à enchaîner {suite.map((p, i) => <span key={p.id}>{i ? ", " : ""}<a href={href(`/plante/${p.id}`)}>{p.nom}</a></span>)}{ev ? <> ; ou un engrais vert : {ev.texte}</> : null}.</> : <>rien à semer ni planter en cette saison. {ev?.texte}.</>}
              </div>
            )}
            <Interventions espaceId={espace.id} />
          </div>
        );
      })}
      <h2>Créer une série de planches</h2>
      <div className="card stack">
        <div className="grid-sm">
          <label className="field">Nombre<input type="number" min="1" max="50" value={serie.n} onChange={(e) => setSerie({ ...serie, n: e.target.value })} /></label>
          <label className="field">Longueur (m)<input type="number" min="1" step="0.5" value={serie.longueur} onChange={(e) => setSerie({ ...serie, longueur: e.target.value })} /></label>
          <label className="field">Largeur (m)<input type="number" min="0.4" step="0.05" value={serie.largeur} onChange={(e) => setSerie({ ...serie, largeur: e.target.value })} /></label>
          <label className="field">Passe-pied (m)<input type="number" min="0.2" step="0.05" value={serie.passe} onChange={(e) => setSerie({ ...serie, passe: e.target.value })} /></label>
        </div>
        <p className="small muted" style={{ margin: 0 }}>Standard maraîcher : planches de 75 cm (on enjambe) à 1,20 m (on atteint le milieu), passe-pieds de 40 cm. Surface cultivée : {Math.round((Number(serie.n) || 0) * (Number(serie.longueur) || 0) * (Number(serie.largeur) || 0) * 10) / 10} m², emprise totale : {Math.round((Number(serie.n) || 0) * (Number(serie.longueur) || 0) * ((Number(serie.largeur) || 0) + (Number(serie.passe) || 0)) * 10) / 10} m².</p>
        <button className="btn primary" onClick={creer}>Créer les planches</button>
      </div>
      <h2>Combien de plants sur une planche ?</h2>
      <div className="card stack">
        <div className="grid-sm">
          <label className="field">Légume<select value={calc.pid} onChange={(e) => setCalc({ ...calc, pid: e.target.value })}>{legumes().map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.nom}</option>)}</select></label>
          <label className="field">Longueur (m)<input type="number" min="0.5" step="0.5" value={calc.longueur} onChange={(e) => setCalc({ ...calc, longueur: e.target.value })} /></label>
          <label className="field">Largeur (m)<input type="number" min="0.3" step="0.05" value={calc.largeur} onChange={(e) => setCalc({ ...calc, largeur: e.target.value })} /></label>
        </div>
        {ppp && <p style={{ margin: 0 }}><b>{ppp.rangs} rang{ppp.rangs > 1 ? "s" : ""} × {ppp.parRang} plants = {ppp.plants} plants</b>, pour environ {ppp.rendement} {ppp.unite === "pièces" ? "pièces" : "kg"}.</p>}
      </div>
      <p className="small"><a href={href("/amenagements?t=comparer&id=am-planches")}>Planches permanentes pas à pas →</a> · <button className="btn sm ghost" onClick={() => { download(EXPORTS.cahier.fichier, new Blob([EXPORTS.cahier.faire(getState())], { type: "text/csv" })); toast("Cahier de culture exporté"); }}>⬇️ Exporter le cahier de culture</button></p>
    </div>
  );
}

const TYPES_INT: Record<TypeIntervention, string> = { travail: "Travail du sol", amendement: "Amendement, fumure", paillage: "Paillage", desherbage: "Désherbage", traitement: "Traitement", irrigation: "Irrigation", autre: "Autre" };
function Interventions({ espaceId }: { espaceId: string }) {
  const liste = useStore((s) => s.interventions.filter((i) => i.espaceId === espaceId));
  const [f, setF] = useState({ type: "amendement" as TypeIntervention, date: today(), produit: "", quantite: "", note: "" });
  return (
    <details className="box"><summary>Cahier de la planche ({liste.length})</summary>
      <div className="grid-sm" style={{ marginTop: 6 }}>
        <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as TypeIntervention })} aria-label="Intervention">{Object.entries(TYPES_INT).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        <input type="text" placeholder="Produit (compost, purin…)" value={f.produit} onChange={(e) => setF({ ...f, produit: e.target.value })} />
        <input type="text" placeholder="Quantité, dose" value={f.quantite} onChange={(e) => setF({ ...f, quantite: e.target.value })} />
      </div>
      <button className="btn sm primary" style={{ marginTop: 6 }} onClick={() => { upsert("interventions", { id: uid(), espaceId, type: f.type, date: f.date, produit: f.produit || undefined, quantite: f.quantite || undefined, note: f.note || undefined }); setF({ ...f, produit: "", quantite: "" }); toast("Intervention notée"); }}>Noter</button>
      {f.type === "traitement" && <p className="small muted" style={{ margin: "6px 0 0" }}>Notez le produit, la dose et la date : si vous vendez, le registre des traitements est obligatoire, même en bio.</p>}
      {liste.length > 0 && <table className="table small" style={{ marginTop: 6 }}><tbody>{[...liste].sort((a, b) => b.date.localeCompare(a.date)).map((i) => <tr key={i.id}><td>{fr(i.date)}</td><td>{TYPES_INT[i.type]}</td><td>{i.produit} {i.quantite}</td><td><button className="btn sm ghost" onClick={() => remove("interventions", i.id)} aria-label="Supprimer">🗑</button></td></tr>)}</tbody></table>}
    </details>
  );
}

function Nurserie() {
  const zone = useStore((s) => s.settings.zone);
  const liste = nurserie(zone);
  return (
    <div>
      <p className="small">Les légumes à élever en plaques alvéolées ou en mottes pressées avant de les planter : semaine de semis pour planter au début de la période de plantation dans votre climat. Pour une production échelonnée, répétez les semis (onglet « Produire en continu »).</p>
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table small"><thead><tr><th>Légume</th><th>Semis en motte</th><th>Plantation</th><th>Durée</th></tr></thead>
          <tbody>{liste.map((n) => <tr key={n.plante.id}><td><a href={href(`/plante/${n.plante.id}`)} className="row" style={{ gap: 6, flexWrap: "nowrap" }}><Vignette id={n.plante.id} emoji={n.plante.emoji} taille={22} /> {n.plante.nom}</a></td><td>{fr(n.semis)}</td><td>{fr(n.plantation)}</td><td>{n.semaines} sem.</td></tr>)}</tbody>
        </table>
      </div>
      <p className="small"><a href={href("/guide/outils-maraichers")}>Plaques alvéolées, presse-mottes et outils du maraîcher →</a></p>
    </div>
  );
}

function Temps() {
  const [surface, setSurface] = useState("100");
  const [methode, setMethode] = useState<keyof typeof TEMPS_METHODE>("planches");
  const t = tempsDeTravail(Number(surface) || 0, methode);
  return (
    <div className="card stack">
      <div className="grid-sm">
        <label className="field">Surface cultivée (m²)<input type="number" min="1" value={surface} onChange={(e) => setSurface(e.target.value)} /></label>
        <label className="field">Façon de cultiver<select value={methode} onChange={(e) => setMethode(e.target.value as keyof typeof TEMPS_METHODE)}>{Object.entries(TEMPS_METHODE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
      </div>
      <p style={{ margin: 0 }}><b>Environ {t.moyenne} h par semaine</b> en saison (mars à octobre), jusqu'à {t.pointe} h en pointe (mai-juin : plantations, désherbage, récoltes qui commencent).</p>
      <ul className="ticks small">
        <li>Le paillage et le sol vivant divisent le temps de désherbage par 2 ou 3.</li>
        <li>Une houe maraîchère ou une binette oscillante fait en 10 minutes le travail d'une heure à la binette classique.</li>
        <li>Le goutte-à-goutte programmé supprime presque tout le temps d'arrosage.</li>
        <li>Prévoyez du temps pour la récolte et sa préparation : elles représentent souvent le tiers du temps total.</li>
      </ul>
      <p className="small muted" style={{ margin: 0 }}>Ordres de grandeur pour un jardinier entraîné ; un débutant met souvent 1,5 fois plus de temps la première année.</p>
    </div>
  );
}

function Economie() {
  const prixPerso = useStore((st) => st.prix);
  const cultures = useStore((st) => st.cultures);
  const espaces = useStore((st) => st.espaces);
  const [cid, setCid] = useState("tomate");
  const [surf, setSurf] = useState(10);
  const [prix, setPrix] = useState<string>("");
  const [critere, setCritere] = useState<"parM2" | "parHeure">("parHeure");
  const [surfTotale, setSurfTotale] = useState(1000);
  const prixDe = (id: string) => prixPerso[id] ?? PRIX_BIO[id];
  const e = economiePlanche(cid, surf, prix === "" ? prixDe(cid) : Number(prix));
  const tous = classementCultures(critere, prixPerso);
  const an = new Date().getFullYear();
  const plan = cultures.filter((c) => c.date.startsWith(String(an)) && c.espaceId).map((c) => { const esp = espaces.find((x) => x.id === c.espaceId); return esp?.surface ? economiePlanche(c.planteId, esp.surface, prixDe(c.planteId)) : null; }).filter(Boolean) as NonNullable<ReturnType<typeof economiePlanche>>[];
  const totPlan = plan.reduce((a, x) => ({ ca: a.ca + x.chiffre, marge: a.marge + x.marge, h: a.h + x.heures }), { ca: 0, marge: 0, h: 0 });
  const u = (id: string) => (MARAICH[id]?.unite === "pièces" ? "la pièce" : "le kg");
  return (
    <div>
      <div className="card stack">
        <b>💶 Économie d'une planche</b>
        <div className="grid-sm">
          <label className="field">Culture<select value={cid} onChange={(ev) => { setCid(ev.target.value); setPrix(""); }}>{Object.keys(MARAICH).sort((a, b) => (plante(a)?.nom ?? a).localeCompare(plante(b)?.nom ?? b)).map((id) => <option key={id} value={id}>{plante(id)?.nom ?? id}</option>)}</select></label>
          <label className="field">Surface (m²)<input type="number" min="1" value={surf} onChange={(ev) => setSurf(Number(ev.target.value) || 1)} /></label>
          <label className="field">Prix de vente ({u(cid)}, €)<input type="number" min="0" step="0.1" placeholder={String(prixDe(cid) ?? "")} value={prix} onChange={(ev) => setPrix(ev.target.value)} /></label>
        </div>
        {e && (
          <table className="table small"><tbody>
            <tr><td>Récolte vendable (15 % de pertes)</td><td><b>{e.recolte} {e.unite === "pièces" ? "pièces" : "kg"}</b></td></tr>
            <tr><td>Chiffre d'affaires</td><td><b>{e.chiffre} €</b></td></tr>
            <tr><td>Intrants (semences ou plants, compost, paillage)</td><td>− {e.intrants} €</td></tr>
            <tr><td>Marge</td><td><b>{e.marge} €</b> ({e.parM2} €/m²)</td></tr>
            <tr><td>Temps de travail</td><td>{e.heures} h</td></tr>
            <tr><td>Rémunération par heure</td><td><b style={{ color: e.parHeure < 12 ? "var(--danger)" : undefined }}>{e.parHeure} €/h</b></td></tr>
          </tbody></table>
        )}
        <p className="small muted">Repères de vente directe bio, de rendement et de temps de travail : à remplacer par vos chiffres (les prix saisis dans Mon jardin › Récoltes sont repris). Ne comptent pas : les charges fixes (foncier, serre, outils, irrigation, cotisations, transport), à couvrir par l'ensemble des cultures.</p>
      </div>

      {plan.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <b>Votre plan de culture {an}</b>
          <p className="small">{plan.length} cultures notées sur vos planches : chiffre d'affaires possible <b>{totPlan.ca} €</b>, marge <b>{totPlan.marge} €</b>, environ <b>{Math.round(totPlan.h)} h</b> de travail, soit <b>{totPlan.h ? Math.round((totPlan.marge / totPlan.h) * 10) / 10 : 0} €/h</b> avant charges fixes.</p>
        </div>
      )}

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row between"><b>Classement des cultures</b>
          <select value={critere} onChange={(ev) => setCritere(ev.target.value as typeof critere)} style={{ width: "auto" }} aria-label="Critère"><option value="parHeure">par rémunération horaire</option><option value="parM2">par marge au m²</option></select>
        </div>
        <table className="table small" style={{ marginTop: 6 }}><thead><tr><th>Culture</th><th>€/m²</th><th>€/h</th></tr></thead><tbody>
          {tous.slice(0, 15).map((x) => <tr key={x.cultureId}><td>{plante(x.cultureId)?.nom ?? x.cultureId}</td><td>{x.parM2}</td><td>{x.parHeure}</td></tr>)}
        </tbody></table>
        <p className="small muted">Les cultures les mieux rémunérées au m² (aromatiques, jeunes pousses, tomates sous abri) ne le sont pas forcément à l'heure ; un maraîcher équilibre les deux, et garde des cultures moins rentables mais attendues dans les paniers.</p>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <b>🧺 Paniers de saison</b>
        <label className="field" style={{ maxWidth: 260 }}>Surface cultivée (m²)<input type="number" min="10" step="10" value={surfTotale} onChange={(ev) => setSurfTotale(Number(ev.target.value) || 10)} /></label>
        <p className="small">Environ <b>{paniersPossibles(surfTotale)} paniers par semaine</b> sur l'année (repère : 25 à 35 m² cultivés par panier hebdomadaire, selon le climat et les abris).</p>
        <div className="grid">{PANIERS_TYPES.map((pn) => <div key={pn.saison} className="card" style={{ background: "var(--surface-2)" }}><b>{pn.saison}</b> <span className="badge">≈ {pn.valeur} €</span><ul className="ticks small" style={{ margin: "4px 0 0" }}>{pn.contenu.map((c) => <li key={c}>{c}</li>)}</ul></div>)}</div>
        <p className="small"><a href={href("/guide/devenir-maraicher")}>Devenir maraîcher bio →</a> · <a href={href("/guide/certification-bio")}>La certification bio →</a> · <a href={href("/guide/vendre-surplus")}>Vendre son surplus →</a></p>
      </div>
    </div>
  );
}
