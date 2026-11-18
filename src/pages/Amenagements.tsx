import MotsLexique from "../components/MotsLexique";
import { useEffect, useState } from "react";
import { AMENAGEMENTS, NIVEAU, type Amenagement } from "../data/amenagements";
import { PAS_A_PAS, PAILLAGES, TECHNIQUES } from "../data/methodes";
import { choisirMethodes, type ProfilPotager } from "../lib/methodes";
import { useStore } from "../lib/store";
import { lienVers } from "../data/index";
import { href, useRoute, go } from "../lib/router";
import { Back, Listen, Galerie, wikiOf, Titre } from "../components/ui";
import { srcVignette } from "../components/Ico";
import { youtube } from "../data/util";

const FAMILLES: Record<Amenagement["famille"], string> = { potager: "Potager", fruitier: "Fruits", agrement: "Agrément", biodiversite: "Biodiversité", organisation: "Organisation" };
const Jauge = ({ v, label, inverse }: { v: number; label: string; inverse?: boolean }) => (
  <span className="small" title={`${label} : ${NIVEAU[v]}`} style={{ whiteSpace: "nowrap" }}>
    {label} <b style={{ color: (inverse ? 4 - v : v) === 1 ? "var(--danger)" : (inverse ? 4 - v : v) === 3 ? "var(--green)" : undefined }}>{"●".repeat(v)}{"○".repeat(3 - v)}</b>
  </span>
);
const ONGLETS: [string, string][] = [["choisir", "🧭 Quelle méthode pour moi ?"], ["comparer", "🗺️ Toutes les méthodes"], ["paillages", "🌾 Les paillages"], ["techniques", "🛠️ Les techniques"]];

export default function Amenagements() {
  const route = useRoute();
  const onglet = route.query.get("t") ?? (route.query.get("id") ? "comparer" : "choisir");
  return (
    <div>
      <Back />
      <Titre ico="jardin" emoji="🗺️">Les façons de faire un potager et d'aménager son jardin</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>{AMENAGEMENTS.length} méthodes et aménagements comparés (planches, carrés, buttes, lasagnes, monticules, bottes de paille, pots, sacs…), les paillages et les techniques, avec avantages, inconvénients et un pas à pas pour débutant. Répondez à quelques questions : l'appli vous dit ce qui convient le mieux à votre cas.</p>
      <div className="chips" role="tablist" style={{ margin: "10px 0 14px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/amenagements?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "choisir" && <Choisir />}
      {onglet === "comparer" && <Comparer />}
      {onglet === "paillages" && <Paillages />}
      {onglet === "techniques" && <Techniques />}
    </div>
  );
}

// ——— Assistant de choix ———
type Opt<T extends string> = [T, string][];
function Question<T extends string>({ titre, aide, options, valeur, choisir }: { titre: string; aide?: string; options: Opt<T>; valeur: T; choisir: (v: T) => void }) {
  return (
    <div className="card">
      <b>{titre}</b>{aide && <span className="small muted" style={{ display: "block" }}>{aide}</span>}
      <div className="chips" style={{ marginTop: 8 }}>{options.map(([k, l]) => <button key={k} className={`chip ${valeur === k ? "on" : ""}`} aria-pressed={valeur === k} onClick={() => choisir(k)}>{l}</button>)}</div>
    </div>
  );
}

function Choisir() {
  const s = useStore((x) => x.settings);
  const solEnr = s.sol?.texture as ProfilPotager["sol"] | undefined;
  const [p, setP] = useState<ProfilPotager>({
    lieu: s.situation === "appartement" ? "appartement" : s.situation === "balcon" ? "balcon" : s.situation === "petit-jardin" ? "petit-jardin" : "jardin",
    surface: s.situation === "appartement" ? 1 : s.situation === "balcon" ? 4 : s.situation === "petit-jardin" ? 15 : 40,
    depart: "pelouse", sol: solEnr ?? "inconnu", temps: "moyen", budget: "moyen", corps: "ok", eau: "facile", materiaux: [], duree: "long", objectif: "debuter",
  });
  const set = <K extends keyof ProfilPotager>(k: K, v: ProfilPotager[K]) => setP({ ...p, [k]: v });
  const tog = (m: ProfilPotager["materiaux"][number]) => set("materiaux", p.materiaux.includes(m) ? p.materiaux.filter((x) => x !== m) : [...p.materiaux, m]);
  const terre = p.lieu === "jardin" || p.lieu === "petit-jardin";
  const res = choisirMethodes(p).slice(0, 3);
  const nom = (id: string) => AMENAGEMENTS.find((a) => a.id === id);
  return (
    <div>
      <Question titre="1. Où voulez-vous cultiver ?" options={[["jardin", "🏡 Grand jardin"], ["petit-jardin", "🌿 Petit jardin"], ["cour", "🧱 Cour bétonnée, terrasse au sol"], ["balcon", "🏢 Balcon"], ["appartement", "🏙️ Intérieur"]]} valeur={p.lieu} choisir={(v) => setP({ ...p, lieu: v, depart: v === "cour" ? "dur" : p.depart === "dur" ? "pelouse" : p.depart })} />
      <div className="card">
        <b>2. Quelle surface pour le potager ?</b> <span className="badge green">{p.surface} m²</span>
        <input type="range" min={p.lieu === "appartement" ? 0.5 : 1} max={terre ? 300 : 30} step={p.lieu === "appartement" ? 0.5 : 1} value={p.surface} onChange={(e) => set("surface", Number(e.target.value))} style={{ width: "100%" }} aria-label="Surface en m²" />
        <span className="small muted">Pour débuter, 10 à 20 m² bien tenus valent mieux qu'un grand potager envahi.</span>
      </div>
      {terre && <Question titre="3. Aujourd'hui, à cet endroit, il y a…" options={[["pelouse", "🌱 De la pelouse"], ["cultive", "🌍 Une terre déjà cultivée"], ["friche", "🌿 Une friche (herbes hautes, ronces)"], ["caillouteux", "⛰️ Un sol caillouteux ou très pauvre"], ["dur", "🧱 Du béton ou un sol pollué"]]} valeur={p.depart} choisir={(v) => set("depart", v)} />}
      {terre && p.depart !== "dur" && <Question titre="4. Votre sol" aide={solEnr ? "Prérempli d'après votre test « Mon sol »." : "Pas sûr ? Faites le test « Mon sol » en 15 minutes."} options={[["inconnu", "Je ne sais pas"], ["sableux", "Sableux, sèche vite"], ["limoneux", "Fin, fait une croûte"], ["argileux", "Argileux, colle"], ["humide", "Gorgé d'eau, flaques"], ["equilibre", "Équilibré"]]} valeur={p.sol} choisir={(v) => set("sol", v)} />}
      <Question titre="5. Combien de temps par semaine ?" options={[["peu", "Moins d'1 h"], ["moyen", "1 à 3 h"], ["beaucoup", "Plus de 3 h"]]} valeur={p.temps} choisir={(v) => set("temps", v)} />
      <Question titre="6. Votre budget pour démarrer" options={[["petit", "Le moins possible"], ["moyen", "Raisonnable"], ["confortable", "Confortable"]]} valeur={p.budget} choisir={(v) => set("budget", v)} />
      <Question titre="7. Votre corps" options={[["ok", "Je me baisse sans problème"], ["dos", "Mal de dos ou de genoux"], ["fauteuil", "Fauteuil ou station debout difficile"]]} valeur={p.corps} choisir={(v) => set("corps", v)} />
      <Question titre="8. L'eau" options={[["facile", "Arrosage facile"], ["rare", "Été sec, restrictions, pas de robinet proche"]]} valeur={p.eau} choisir={(v) => set("eau", v)} />
      {p.lieu !== "appartement" && (
        <div className="card">
          <b>9. Ce que vous avez sous la main</b> <span className="small muted">(plusieurs choix)</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {([["bois", "🌳 Branches, vieux bois"], ["feuilles", "🍂 Feuilles, tontes"], ["carton", "📦 Cartons bruns"], ["fumier", "🐴 Fumier"]] as [ProfilPotager["materiaux"][number], string][]).map(([k, l]) => <button key={k} className={`chip ${p.materiaux.includes(k) ? "on" : ""}`} aria-pressed={p.materiaux.includes(k)} onClick={() => tog(k)}>{l}</button>)}
          </div>
        </div>
      )}
      <Question titre="10. Vous êtes là pour longtemps ?" options={[["long", "Oui, propriétaire ou pour des années"], ["provisoire", "Location ou installation provisoire"]]} valeur={p.duree} choisir={(v) => set("duree", v)} />
      <Question titre="11. Ce qui compte le plus pour vous" options={[["debuter", "Apprendre simplement"], ["produire", "Produire beaucoup"], ["effort", "Le moins d'effort"], ["joli", "Un potager joli"]]} valeur={p.objectif} choisir={(v) => set("objectif", v)} />

      <h2>🧭 Les méthodes les mieux adaptées à votre cas</h2>
      {res.map((c, i) => {
        const a = nom(c.id);
        if (!a) return null;
        const img = wikiOf(a.id)?.photos?.[0]?.img ?? srcVignette(a.id);
        return (
          <div key={c.id} className="card" style={{ borderColor: i === 0 ? "var(--green)" : undefined, borderWidth: i === 0 ? 2 : 1 }}>
            <div className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
              {img && <img src={img} alt="" crossOrigin={wikiOf(a.id)?.photos?.length ? "anonymous" : undefined} style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <b>{i === 0 ? "🥇 " : i === 1 ? "🥈 " : "🥉 "}{a.nom}</b>
                <p className="small" style={{ margin: "2px 0" }}>{a.resume}</p>
              </div>
            </div>
            {c.pour.length > 0 && <ul className="ticks small" style={{ margin: "6px 0" }}>{c.pour.map((x) => <li key={x}>✅ {x}</li>)}</ul>}
            {c.contre.length > 0 && <ul className="ticks small" style={{ margin: "6px 0" }}>{c.contre.map((x) => <li key={x}>⚠️ {x}</li>)}</ul>}
            {PAS_A_PAS[a.id] && <button className={`btn ${i === 0 ? "primary" : ""}`} onClick={() => go(`/amenagements?t=comparer&id=${a.id}`)}>📋 Voir le pas à pas</button>}
          </div>
        );
      })}
      <div className="callout info small"><b>On peut combiner</b>Beaucoup de jardiniers mélangent : des planches ou une lasagne pour le gros du potager, un carré d'aromates près de la cuisine, des pots pour les tomates sur la terrasse, et du paillage partout. Le paillage convient à toutes les méthodes.</div>
      <p className="small"><a href={href("/sol")}>🌍 Identifier mon sol</a> · <a href={href("/calculs?s=bacs")}>🧮 Combien de terre pour mes bacs ?</a> · <a href={href("/creer")}>👨‍🌾 Choisir quoi planter</a></p>
    </div>
  );
}

// ——— Toutes les méthodes ———
function Etapes({ id }: { id: string }) {
  const e = PAS_A_PAS[id];
  if (!e) return null;
  return (
    <div className="card" style={{ background: "var(--surface-2)" }}>
      <div className="row between"><b>📋 Pas à pas pour débutant</b><Listen id={"pap-" + id} title="Pas à pas" blocks={[`Quand : ${e.quand}`, "Matériel : " + e.materiel.join(", "), ...e.etapes.map((x, i) => `Étape ${i + 1}, ${x.titre}. ${x.texte} ${x.astuce ?? ""}`), `La première année : ${e.premiereAnnee}`, "Erreurs à éviter : " + e.erreurs.join(" ")]} label="Écouter le pas à pas" /></div>
      <p className="small" style={{ margin: "6px 0" }}><b>🗓️ Quand :</b> {e.quand}</p>
      <b className="small">🧰 Matériel</b>
      <ul className="ticks small">{e.materiel.map((x) => <li key={x}>{x}</li>)}</ul>
      <ol className="steps">{e.etapes.map((x) => <li key={x.titre}><b>{x.titre}</b><br /><span className="small"><MotsLexique texte={x.texte} /></span>{x.astuce && <span className="small" style={{ display: "block", color: "var(--green)" }}>💡 {x.astuce}</span>}</li>)}</ol>
      <p className="small"><b>🌱 La première année :</b> {e.premiereAnnee}</p>
      <div className="callout warn small"><b>À éviter</b>{e.erreurs.join(" ")}</div>
    </div>
  );
}

function Comparer() {
  const situation = useStore((s) => s.settings.situation);
  const route = useRoute();
  const [lieu, setLieu] = useState<string>(route.query.get("id") ? "" : situation);
  const [fam, setFam] = useState(route.query.get("id") ? "" : "potager");
  const idUrl = route.query.get("id") ?? "";
  const [ouvert, setOuvert] = useState(idUrl);
  const [tri, setTri] = useState<"" | "entretien" | "cout" | "eau">("");
  // Arrivée par un lien vers une méthode précise : on retire les filtres et on la montre
  useEffect(() => {
    if (!idUrl) return;
    setOuvert(idUrl); setLieu(""); setFam("");
    setTimeout(() => document.getElementById(idUrl)?.scrollIntoView({ block: "start" }), 150);
  }, [idUrl]);
  let list = AMENAGEMENTS.filter((a) => (!lieu || a.pour.includes(lieu as never)) && (!fam || a.famille === fam));
  if (tri) list = [...list].sort((a, b) => a[tri] - b[tri]);
  return (
    <div>
      <div className="row" style={{ gap: 8, margin: "0 0 10px" }}>
        <select value={lieu} onChange={(e) => setLieu(e.target.value)} aria-label="Lieu" style={{ maxWidth: 220 }}>
          <option value="">Tous les lieux</option><option value="jardin">🏡 Grand jardin</option><option value="petit-jardin">🌿 Petit jardin, cour</option><option value="balcon">🏢 Balcon, terrasse</option><option value="appartement">🏙️ Appartement</option>
        </select>
        <select value={tri} onChange={(e) => setTri(e.target.value as typeof tri)} aria-label="Trier" style={{ maxWidth: 220 }}>
          <option value="">Trier : ordre conseillé</option><option value="entretien">Le moins d'entretien</option><option value="cout">Le moins cher</option><option value="eau">Le moins d'eau</option>
        </select>
      </div>
      <div className="chips" style={{ marginBottom: 10 }}>
        <button className={`chip ${!fam ? "on" : ""}`} onClick={() => setFam("")}>Tout</button>
        {Object.entries(FAMILLES).map(([k, l]) => <button key={k} className={`chip ${fam === k ? "on" : ""}`} onClick={() => setFam(k)}>{l}</button>)}
      </div>
      {list.map((a) => {
        const dessin = srcVignette(a.id)?.startsWith("./img/") ? srcVignette(a.id) : undefined; // dessin local seulement (sinon doublon de la photo)
        const photo = wikiOf(a.id)?.photos?.[0]?.img;
        const img = photo ?? dessin;
        const on = ouvert === a.id;
        return (
          <div key={a.id} className="card" id={a.id} style={{ padding: 0, overflow: "hidden" }}>
            <button onClick={() => setOuvert(on ? "" : a.id)} aria-expanded={on} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 12, width: "100%", alignItems: "stretch" }}>
              {img ? <img src={img} alt="" loading="lazy" crossOrigin={photo ? "anonymous" : undefined} style={{ width: 130, minHeight: 100, objectFit: "cover", flexShrink: 0 }} /> : <span style={{ fontSize: 48, padding: 16 }}>{a.emoji}</span>}
              <span style={{ padding: "10px 12px 10px 0", flex: 1 }}>
                <b>{a.emoji} {a.nom}</b> <span className="badge">{FAMILLES[a.famille]}</span> {PAS_A_PAS[a.id] && <span className="badge green">Pas à pas</span>}
                <span className="small" style={{ display: "block", margin: "4px 0" }}>{a.resume}</span>
                <span className="row" style={{ gap: 12 }}>
                  <Jauge v={a.installation} label="Installation" inverse /><Jauge v={a.entretien} label="Entretien" inverse /><Jauge v={a.cout} label="Coût" inverse /><Jauge v={a.eau} label="Eau" inverse />
                </span>
              </span>
            </button>
            {on && (
              <div style={{ padding: "0 14px 14px" }}>
                <div className="row" style={{ alignItems: "flex-start", gap: 12, margin: "8px 0" }}>
                  {photo && <div className="hero" style={{ flex: "1 1 280px", display: "block" }}><Galerie id={a.id} emoji={a.emoji} alt={a.nom} photoFirst /></div>}
                  {dessin && <figure style={{ flex: "1 1 240px", margin: 0 }}><img src={dessin} alt={`Illustration : ${a.nom}`} style={{ width: "100%", borderRadius: 10 }} /><figcaption className="small muted">{photo ? "Vue d'ensemble illustrée" : "Illustration"}</figcaption></figure>}
                </div>
                <p className="small"><b>Surface :</b> {a.surface} · <b>Idéal pour :</b> {a.ideal}</p>
                <div className="grid">
                  <div><b>✅ Avantages</b><ul className="ticks small">{a.avantages.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><b>⚠️ Inconvénients</b><ul className="ticks small">{a.inconvenients.map((x) => <li key={x}>{x}</li>)}</ul></div>
                </div>
                <Etapes id={a.id} />
                <div className="row" style={{ gap: 6, marginTop: 8 }}>
                  {a.liens.map((l) => { const x = lienVers(l); return x ? <a key={l} className="chip" href={href(x.href)}>{x.emoji} {x.label}</a> : null; })}
                  <a className="chip" href={youtube(a.video)} target="_blank" rel="noreferrer">▶️ Vidéos</a>
                  <Listen id={"am-" + a.id} title={a.nom} blocks={[`${a.nom}. ${a.resume}`, `Surface : ${a.surface}. Idéal pour : ${a.ideal}`, "Avantages.", ...a.avantages, "Inconvénients.", ...a.inconvenients]} label="Écouter" />
                </div>
              </div>
            )}
          </div>
        );
      })}
      {!list.length && <p className="muted">Aucun aménagement pour ce choix.</p>}
    </div>
  );
}

function Paillages() {
  return (
    <div>
      <div className="callout ok"><b>Pourquoi pailler ?</b>Couvrir la terre comme le fait la nature en forêt : jusqu'à 2 fois moins d'arrosage, beaucoup moins de mauvaises herbes, un sol qui ne se tasse pas sous la pluie, et des vers de terre qui le transforment en humus. On paille un sol humide et réchauffé (à partir de mai pour les légumes d'été), jamais un sol sec ou glacé.</div>
      {srcVignette("paillage") && <img src={srcVignette("paillage")} alt="Planche paillée de paille" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10, margin: "6px 0 10px" }} />}
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table small" style={{ minWidth: 640 }}>
          <thead><tr><th>Paillage</th><th>✅ Avantages</th><th>⚠️ Inconvénients</th><th>Épaisseur</th><th>Où</th></tr></thead>
          <tbody>{PAILLAGES.map((x) => <tr key={x.nom}><td><b>{x.emoji} {x.nom}</b></td><td>{x.plus}</td><td>{x.moins}</td><td>{x.epaisseur}</td><td>{x.ou}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="small"><a href={href("/guide/paillage")}>Le tutoriel paillage pas à pas →</a></p>
    </div>
  );
}

function Techniques() {
  return (
    <div>
      <p className="small">Ces techniques s'ajoutent à n'importe quelle méthode de potager.</p>
      <div className="grid">
        {TECHNIQUES.map((t) => {
          const l = t.lien.startsWith("lex-") ? { href: `/lexique?t=${t.lien.slice(4)}`, label: "Lexique", emoji: "📖" } : lienVers(t.lien);
          return (
            <div key={t.nom} className="card">
              <b>{t.emoji} {t.nom}</b>
              <p className="small" style={{ margin: "4px 0" }}>{t.quoi}</p>
              <p className="small" style={{ margin: "4px 0" }}>✅ {t.plus}</p>
              <p className="small" style={{ margin: "4px 0" }}>⚠️ {t.moins}</p>
              {l && <a className="chip" href={href(l.href)}>{l.emoji} {l.label}</a>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
