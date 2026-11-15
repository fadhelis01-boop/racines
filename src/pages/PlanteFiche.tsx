import { Ico, Vignette } from "../components/Ico";
import { useState } from "react";
import { plante, probleme, CATEGORIES, FAMILLES } from "../data/index";
import { Galerie, Back, Fav, Listen, MonthGrid, Videos, A, Empty, toast } from "../components/ui";
import { useStore, upsert, uid, today, getState } from "../lib/store";
const getSol = () => getState().settings.sol;
import { href } from "../lib/router";
import { moisAffiches } from "../lib/calendar";
import { AjoutMaPlante } from "../components/MesPlantes";
import { MOIS_NOMS } from "../data/util";
import { gesteDe } from "../data/cueillette";
import { SOL_PLANTE, TYPES_SOL } from "../data/sols";
import { srcVignette } from "../components/Ico";

const EXPO = { soleil: "☀️ Soleil", "mi-ombre": "⛅ Mi-ombre", ombre: "☁️ Ombre" };
const BESOIN = { gourmand: "Gourmand (sol riche, compost)", moyen: "Moyen", peu: "Peu exigeant", ameliorant: "Améliorant (enrichit le sol)" };
const EAU = { faible: "💧 Faible", moyen: "💧💧 Moyen", fort: "💧💧💧 Important" };

export default function PlanteFiche({ id }: { id?: string }) {
  const p = id ? plante(id) : undefined;
  const zone = useStore((s) => s.settings.zone);
  const cultures = useStore((s) => s.cultures.filter((c) => c.planteId === id));
  const [tab, setTab] = useState("culture");
  const [ajout, setAjout] = useState(false);
  const [ajoutMp, setAjoutMp] = useState(false);
  const situation = useStore((s) => s.settings.situation);
  const mesExemplaires = useStore((s) => s.plantes.filter((x) => x.planteId === id).length);
  if (!p) return <Empty emoji="🤷">Fiche introuvable. <A to="/plantes">Toutes les plantes</A></Empty>;
  const interieur = p.categorie === "interieur";

  const facts: [string, string | undefined][] = interieur
    ? [["Lumière", p.lumiere], ["Arrosage", p.arrosageDetail], ["Humidité", p.humidite], ["Température", p.temperature], ["Rempotage", p.rempotage]]
    : [
        ["Où la cultiver", p.lieux.map((l) => ({ "pleine-terre": "jardin", pot: "en pot", balcon: "balcon", serre: "serre", interieur: "intérieur" })[l]).join(", ")],
        ["Exposition", p.expo.map((e) => EXPO[e]).join(", ")],
        ["Besoins du sol", BESOIN[p.besoin]],
        ["Sol idéal", SOL_PLANTE[p.id]],
        ["Eau", EAU[p.eau]],
        ["Espacement", p.espacement],
        ["Profondeur de semis", p.profondeur],
        ["Germination", p.levee],
        ["Délai de récolte", p.delai],
        ["En pot", p.contenant],
        ["Rendement", p.rendement],
        ["Famille (rotation)", FAMILLES[p.famille]],
        ["Cycle", p.cycle ? { annuelle: "Annuelle (un an)", bisannuelle: "Bisannuelle (fleurit la 2e année)", vivace: "Vivace (revient chaque année)", bulbe: "Bulbe ou tubercule", grimpante: "Grimpante", arbuste: "Arbuste" }[p.cycle] : undefined],
        ["Floraison", p.floraison ? [...moisAffiches(p, "floraison", zone)].sort((a, b) => a - b).map((x) => MOIS_NOMS[x - 1]).join(", ") : undefined],
        ["Couleurs", p.couleurs?.join(", ")],
        ["Hauteur", p.hauteur],
        ["Pollinisateurs", p.mellifere ? "🐝 Très appréciée des abeilles et papillons" : undefined],
      ];

  const lecture = [
    `${p.nom}. ${p.intro}`,
    ...facts.filter(([, v]) => v).map(([k, v]) => `${k} : ${v}.`),
    ...(!interieur ? cal(p) : []),
    "Culture, étape par étape.",
    ...p.etapes.map((e, i) => `Étape ${i + 1}. ${e}`),
    "Entretien.",
    ...p.entretien,
    ...(p.recolteConseil ? [`Récolte. ${p.recolteConseil}`] : []),
    ...(p.conservation ? [`Conservation. ${p.conservation}`] : []),
    ...(p.astuces ?? []).map((a) => `Astuce. ${a}`),
    ...(p.toxique ? [`Attention, toxicité. ${p.toxique}`] : []),
    ...(p.animaux ? [`Pour vos animaux. ${p.animaux}`] : []),
  ];
  function cal(pl: typeof p) {
    const parts: string[] = [];
    const lab = { semisAbri: "Semis à l'abri", semisPlace: "Semis en place", plantation: "Plantation", recolte: "Récolte", taille: "Taille" } as const;
    for (const a of Object.keys(lab) as (keyof typeof lab)[]) {
      const ms = [...moisAffiches(pl!, a, zone)].sort((x, y) => x - y);
      if (ms.length) parts.push(`${lab[a]} : ${ms.map((m) => MOIS_NOMS[m - 1]).join(", ")}.`);
    }
    return parts;
  }

  return (
    <div>
      <div className="row between"><Back /><div className="row"><Fav id={p.id} /></div></div>
      <div className="hero" style={{ marginTop: 8 }}>
        <div>
          <Galerie id={p.id} emoji={p.emoji} alt={p.nom} />
        </div>
        <div>
          <span className="badge green row" style={{ display: "inline-flex", gap: 4 }}><Ico nom={p.categorie} emoji={CATEGORIES[p.categorie].emoji} taille={18} /> {CATEGORIES[p.categorie].label}</span>{" "}
          <span className="badge">{["", "Facile", "Moyen", "Exigeant"][p.difficulte]}</span>
          <h1 style={{ marginTop: 8 }}>{p.nom}</h1>
          <p className="muted" style={{ marginTop: -8 }}><i>{p.latin}</i></p>
          <p>{p.intro}</p>
          <div className="row">
            <Listen id={`plante-${p.id}`} title={p.nom} blocks={lecture} label="Écouter la fiche" />
            {!interieur && situation !== "appartement" && <button className="btn primary" onClick={() => setAjout(!ajout)}>➕ J'ai semé / planté</button>}
            {!interieur && situation === "appartement" && p.lieux.includes("interieur") && <button className="btn" onClick={() => setAjout(!ajout)}>➕ J'ai semé</button>}
            {(interieur || p.lieux.includes("pot") || p.lieux.includes("interieur")) && <button className={`btn ${interieur ? "primary" : ""}`} onClick={() => setAjoutMp(!ajoutMp)}>🌿 {interieur ? "J'ai cette plante" : "Je la suis en pot"}</button>}
          </div>
          {ajout && <AjoutCulture planteId={p.id} onDone={() => setAjout(false)} />}
          {ajoutMp && <AjoutMaPlante planteId={p.id} onDone={() => setAjoutMp(false)} />}
          {mesExemplaires > 0 && <p className="small muted">Dans Mes plantes : {mesExemplaires} exemplaire(s). <A to="/jardin/mesplantes">Voir</A></p>}
          {cultures.length > 0 && <p className="small muted">Dans votre jardin : {cultures.length} culture(s) notée(s). <A to="/jardin">Voir</A></p>}
        </div>
      </div>

      {p.danger && (
        <div className="callout danger" style={{ border: "2px solid var(--danger)" }}>
          <b>☠️ PLANTE DANGEREUSE</b>
          {p.toxique}
          <div className="small" style={{ marginTop: 6 }}>Ingestion : ne faites pas vomir, appelez le centre antipoison (ou le 15, le 112). Animal : appelez votre vétérinaire immédiatement. <a href={href("/guide/plantes-toxiques")}>Toutes les plantes dangereuses →</a></div>
        </div>
      )}
      {p.toxique && !p.danger && (/^non toxique/i.test(p.toxique)
        ? <div className="callout ok"><b>🐱 Sans danger</b>{p.toxique}</div>
        : <div className="callout danger"><b>⚠️ Toxicité</b>{p.toxique}</div>)}
      {p.comestible && <div className="callout info"><b>🍽️ Comestible ?</b>{p.comestible} <span className="small muted">Ne consommez jamais une plante sauvage sans identification certaine (voir « Cueillir les plantes sauvages sans danger »).</span></div>}

      <div className="tabs" role="tablist">
        {[["culture", "Culture"], ["calendrier", "Calendrier"], ["voisins", "Voisins"], ["sante", "Santé"], ["animaux", "Animaux"], ["videos", "Vidéos"]]
          .filter(([k]) => !(interieur && (k === "calendrier" || k === "voisins")))
          .map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      {tab === "culture" && (
        <div>
          {p.sosies && p.sosies.length > 0 && (
            <div className="callout warn">
              <b>👀 Ne pas confondre avec</b>
              <ul className="ticks" style={{ margin: 0 }}>
                {p.sosies.map((s) => <li key={s.nom}>{s.id && plante(s.id) ? <a href={href(`/plante/${s.id}`)}><b>{s.nom}</b></a> : <b>{s.nom}</b>} : {s.difference}</li>)}
              </ul>
            </div>
          )}
          {(p.alias?.length || p.tailleAdulte || p.sansDangerAnimaux !== undefined) && (
            <p className="small muted">
              {p.alias?.length ? <>Aussi appelée : {p.alias.slice(0, 5).join(", ")}. </> : null}
              {p.tailleAdulte ? <>Taille adulte : {p.tailleAdulte}. </> : null}
              {p.sansDangerAnimaux === true && <span className="badge green">🐱 Sans danger chats et chiens</span>}
              {p.sansDangerAnimaux === false && <span className="badge danger">🐱 Toxique pour chats et chiens</span>}
            </p>
          )}
          <div className="facts">{facts.filter(([, v]) => v).map(([k, v]) => <div key={k} className="fact"><div className="k">{k}</div>{v}</div>)}</div>
          {!interieur && (() => {
            const sol = getSol();
            const types = sol ? [sol.texture, ...sol.traits].map((t) => TYPES_SOL.find((x) => x.id === t)).filter(Boolean) : [];
            const ok = types.some((t) => t!.aime.includes(p.id));
            return (
              <p className="small" style={{ margin: "8px 0 0" }}>
                {sol ? (ok ? <span className="badge green">✅ Se plaît dans votre sol ({types.map((t) => t!.nom.split(" (")[0].toLowerCase()).join(", ")})</span> : <span className="muted">Votre sol : {types.map((t) => t!.nom.split(" (")[0].toLowerCase()).join(", ")}. </span>) : <a href={href("/sol")}>🟫 Identifier mon sol</a>}
                {" · "}<a href={href(`/nutrition?p=${p.id}`)}>🍽️ Comment la nourrir</a>
              </p>
            );
          })()}
          <h2>{interieur ? "Installation" : "Culture pas à pas"}</h2>
          <ol className="steps">{p.etapes.map((e, i) => <li key={i}>{e}</li>)}</ol>
          <h2>Entretien</h2>
          <ul className="ticks">{p.entretien.map((e, i) => <li key={i}>{e}</li>)}</ul>
          {(() => {
            const g = gesteDe(p.id);
            if (!p.recolteConseil && !g) return null;
            const img = g && srcVignette(g.id);
            const mois = [...moisAffiches(p, "recolte", zone)].sort((a, b) => a - b);
            return (
              <>
                <h2>{p.categorie === "fleur" || p.categorie === "ornement" ? "Cueillir" : "Récolte"}</h2>
                {mois.length > 0 && <p className="small muted">Période chez vous : {mois.map((x) => MOIS_NOMS[x - 1]).join(", ")}.</p>}
                {p.recolteConseil && <p>{p.recolteConseil}</p>}
                {g && (
                  <a className="card row" href={href(`/cueillette?g=${g.id}`)} style={{ textDecoration: "none", color: "inherit", flexWrap: "nowrap", padding: 0, overflow: "hidden" }}>
                    {img ? <img src={img} alt="" loading="lazy" style={{ width: 120, height: 84, objectFit: "cover", flexShrink: 0 }} /> : <span style={{ fontSize: 36, padding: 12 }}>{g.emoji}</span>}
                    <span className="small" style={{ padding: "8px 10px 8px 0" }}><b>Le bon geste</b><br />{g.comment[0]}<br /><span className="muted">Voir le geste illustré →</span></span>
                  </a>
                )}
              </>
            );
          })()}
          {p.conservation && <><h2>Conservation</h2><p>{p.conservation}</p></>}
          {p.astuces?.map((a) => <div key={a} className="callout ok"><b>💡 Astuce</b>{a}</div>)}
          {p.graines && (
            <>
              <h2>Graines</h2>
              <p>Durée de germination : environ <b>{p.graines.ans} an{p.graines.ans > 1 ? "s" : ""}</b>.{p.graines.recolter ? " " + p.graines.recolter : ""}</p>
            </>
          )}
        </div>
      )}
      {tab === "calendrier" && (
        <div className="card" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 420 }}><MonthGrid plantes={[p]} zone={zone} onlyLabel /></div>
          {(() => {
            const m = (a: Parameters<typeof moisAffiches>[1]) => [...moisAffiches(p, a, zone)].sort((x, y) => x - y).map((x) => MOIS_NOMS[x - 1]).join(", ");
            const etapes = [
              m("semisAbri") && `🏠 Semer à l'abri en ${m("semisAbri")}`,
              m("repiquage") && `🤲 repiquer en godets en ${m("repiquage")}`,
              m("semisPlace") && `🌱 ${m("semisAbri") ? "ou semer directement en place" : "semer en place"} en ${m("semisPlace")}`,
              m("plantation") && `🌿 planter en place en ${m("plantation")}`,
              m("floraison") && `🌸 floraison en ${m("floraison")}`,
              m("recolte") && `🧺 récolter en ${m("recolte")}${p.delai ? ` (${p.delai})` : ""}`,
              m("taille") && `✂️ tailler en ${m("taille")}`,
            ].filter(Boolean);
            return etapes.length ? <p className="small" style={{ marginBottom: 0 }}><b>Chez vous :</b> {etapes.join(" → ")}. <a href={href("/calendrier")}>Semer, repiquer, planter : quelle différence ?</a></p> : null;
          })()}
          <p className="small muted">Calendrier adapté à votre zone climatique. En pratique, observez aussi la météo : la température du sol compte plus que la date.</p>
        </div>
      )}
      {tab === "voisins" && (
        <div className="grid">
          <div className="card">
            <b>👍 Bons voisins</b>
            <div className="chips" style={{ marginTop: 8 }}>{p.amis.length ? p.amis.map((x) => { const q = plante(x)!; return <a key={x} className="chip" href={href(`/plante/${x}`)}><Vignette id={q.id} emoji={q.emoji} taille={22} /> {q.nom}</a>; }) : <span className="muted small">Aucun connu</span>}</div>
          </div>
          <div className="card">
            <b>👎 À éloigner</b>
            <div className="chips" style={{ marginTop: 8 }}>{p.ennemis.length ? p.ennemis.map((x) => { const q = plante(x)!; return <a key={x} className="chip" href={href(`/plante/${x}`)}><Vignette id={q.id} emoji={q.emoji} taille={22} /> {q.nom}</a>; }) : <span className="muted small">Aucun connu</span>}</div>
          </div>
          <div className="card">
            <b>🔄 Rotation</b>
            <p className="small">Famille : {FAMILLES[p.famille]}. {BESOIN[p.besoin]}.</p>
            <A to="/guide/rotation" className="small">Comprendre la rotation →</A>
          </div>
        </div>
      )}
      {tab === "sante" && (
        <div>
          <div className="row" style={{ marginBottom: 10 }}>
            <a className="btn primary" href={href(`/diagnostic?plante=${p.id}`)}>🩺 Diagnostiquer un problème</a>
            <a className="btn" href={href("/identifier")}>📷 Par photo</a>
          </div>
          <div className="grid">
            {p.problemes.map((x) => {
              const pb = probleme(x)!;
              return (
                <a key={x} className="card" href={href(`/probleme/${x}`)} style={{ textDecoration: "none", color: "inherit" }}>
                  <b>{pb.nom}</b>
                  <div className="small muted">{pb.symptomes[0]}</div>
                </a>
              );
            })}
          </div>
        </div>
      )}
      {tab === "animaux" && (
        <div className="callout info">
          <b>🐔 Pour vos animaux</b>
          {p.animaux ?? "Pas d'information particulière : en cas de doute, ne donnez pas cette plante à vos animaux."}
          {p.toxique && <p className="small" style={{ marginBottom: 0 }}><b>Toxicité :</b> {p.toxique}</p>}
        </div>
      )}
      {tab === "videos" && (() => { const n = p.nom.split(" (")[0].toLowerCase(); return <Videos id={p.id} query={`${n} ${interieur ? "entretien plante d'intérieur" : "culture potager conseils"}`} gestes={interieur ? [`${n} arrosage`, `${n} rempotage`, `${n} bouture`, `${n} feuilles jaunes`] : [`semis ${n}`, `plantation ${n}`, `${n} taille entretien`, `récolte ${n}`, `${n} maladies traitement naturel`]} />; })()}
    </div>
  );
}

export function AjoutCulture({ planteId, onDone }: { planteId: string; onDone: () => void }) {
  const espaces = useStore((s) => s.espaces.filter((e) => !e.archive));
  const [date, setDate] = useState(today());
  const [mode, setMode] = useState<"semis" | "plantation">("semis");
  const [espaceId, setEspaceId] = useState(espaces[0]?.id ?? "");
  const [note, setNote] = useState("");
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
      <label className="field">Note (variété, quantité…)<input type="text" value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn primary" onClick={() => { upsert("cultures", { id: uid(), planteId, date, mode, espaceId: espaceId || undefined, note: note || undefined }); toast("Noté dans Mon jardin"); onDone(); }}>Enregistrer</button>
        <button className="btn ghost" onClick={onDone}>Annuler</button>
      </div>
    </div>
  );
}
