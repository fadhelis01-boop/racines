import { useEffect, useRef, useState } from "react";
import { useStore, toggleFait } from "../lib/store";
import { plantesDuMois, travauxDuMois, ACTIONS, buildIcs, type Action } from "../lib/calendar";
import { MOIS_NOMS } from "../data/util";
import { CATEGORIES, PLANTES, ZONES } from "../data/index";
import { href } from "../lib/router";
import { Listen, MonthGrid, download, toast, A } from "../components/ui";
import { filtreSituation, sectionsSituation } from "./Accueil";
import { lune } from "../lib/lune";

export default function Calendrier() {
  const s = useStore((x) => x);
  const now = new Date();
  const [mois, setMois] = useState(now.getMonth() + 1);
  const [filtre, setFiltre] = useState<string>("situation");
  const [vue, setVue] = useState<"mois" | "annee">("mois");
  const moisRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    moisRef.current?.querySelector(".chip.on")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [mois]);
  const mine = new Set(s.cultures.map((c) => c.planteId));
  const f =
    filtre === "mes" ? (p: (typeof PLANTES)[number]) => mine.has(p.id)
    : filtre === "situation" ? filtreSituation(s.settings.situation)
    : filtre === "tout" ? undefined
    : (p: (typeof PLANTES)[number]) => p.categorie === filtre;
  const pm = plantesDuMois(mois, s.settings.zone, f);
  const t = travauxDuMois(mois);
  const sections = sectionsSituation(s.settings.situation, s.settings.animauxActifs || s.troupeaux.length > 0);
  const zone = ZONES.find((z) => z.id === s.settings.zone)!;
  const annee = mois < now.getMonth() + 1 ? now.getFullYear() + 1 : now.getFullYear();

  // Phases de lune du mois affiché
  const lunes: { d: number; e: string; p: string }[] = [];
  let prev = "";
  for (let d = 1; d <= new Date(annee, mois, 0).getDate(); d++) {
    const l = lune(new Date(annee, mois - 1, d, 12));
    if (["Nouvelle lune", "Premier quartier", "Pleine lune", "Dernier quartier"].includes(l.phase) && l.phase !== prev) lunes.push({ d, e: l.emoji, p: l.phase });
    prev = l.phase;
  }

  const exportIcs = () => {
    download("racines-calendrier.ics", new Blob([buildIcs(s, { mois: 12, travaux: true, mesPlantes: true })], { type: "text/calendar" }));
    toast("Fichier créé : ouvrez-le pour l'ajouter à votre agenda.");
  };

  return (
    <div>
      <h1>📅 Calendrier du jardin</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Adapté à votre climat : {zone.nom} (dernières gelées : {zone.gel}). <A to="/reglages">Changer</A></p>
      <div className="chips scroll-x" role="tablist" aria-label="Mois" ref={moisRef}>
        {MOIS_NOMS.map((m, i) => (
          <button key={m} className={`chip ${mois === i + 1 ? "on" : ""}`} onClick={() => setMois(i + 1)} style={i + 1 === now.getMonth() + 1 ? { fontWeight: 900 } : undefined}>{m}</button>
        ))}
      </div>
      <div className="row" style={{ margin: "12px 0" }}>
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)} style={{ maxWidth: 260 }} aria-label="Plantes affichées">
          <option value="situation">Adapté à mon espace</option>
          <option value="mes">Mes cultures seulement ({mine.size})</option>
          <option value="tout">Toutes les plantes</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
        </select>
        <div className="chips">
          <button className={`chip ${vue === "mois" ? "on" : ""}`} onClick={() => setVue("mois")}>Le mois</button>
          <button className={`chip ${vue === "annee" ? "on" : ""}`} onClick={() => setVue("annee")}>L'année</button>
        </div>
        <Listen id={`cal-${mois}`} title={`Le jardin en ${MOIS_NOMS[mois - 1]}`} blocks={[
          `Le jardin en ${MOIS_NOMS[mois - 1]}.`,
          ...(Object.keys(pm) as Action[]).filter((a) => pm[a].length).map((a) => `${ACTIONS[a].verbe} : ${pm[a].map((p) => p.nom).join(", ")}.`),
          ...sections.map((x) => `${x.t} : ${t[x.k].join(" ")}`),
        ]} />
      </div>

      {vue === "annee" ? (
        <div className="card" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 560 }}>
            <MonthGrid plantes={PLANTES.filter((p) => (f ? f(p) : true))} zone={s.settings.zone} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {(Object.keys(pm) as Action[]).map((a) =>
              pm[a].length ? (
                <div key={a} className="card">
                  <b>{ACTIONS[a].emoji} {ACTIONS[a].verbe}</b> <span className="badge">{pm[a].length}</span>
                  <div className="chips" style={{ marginTop: 8 }}>
                    {pm[a].map((p) => <a key={p.id} className="chip" href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom}</a>)}
                  </div>
                </div>
              ) : null,
            )}
          </div>
          {Object.values(pm).every((x) => !x.length) && <p className="muted">Rien de prévu pour ce filtre ce mois-ci.</p>}
          <h2>Les travaux de {MOIS_NOMS[mois - 1]}</h2>
          {sections.map((x) => (
            <div key={x.k} className="card">
              <b>{x.e} {x.t}</b>
              {t[x.k].map((txt, i) => {
                const key = `${annee}-${mois}:${x.k}:${i}`;
                return (
                  <div key={key} className={`task ${s.fait[key] ? "done" : ""}`}>
                    <input type="checkbox" checked={!!s.fait[key]} onChange={() => toggleFait(key)} aria-label="Fait" />
                    <span>{txt}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {s.settings.lune && <div className="card">
            <b>🌙 La lune en {MOIS_NOMS[mois - 1]}</b>
            <div className="chips" style={{ marginTop: 8 }}>{lunes.map((l) => <span key={l.d} className="chip">{l.e} {l.d} : {l.p.toLowerCase()}</span>)}</div>
            <p className="small muted">Indicatif : le jardinage avec la lune est une tradition sans effet démontré.</p>
          </div>}
        </>
      )}

      <h2>📲 Rappels sur votre téléphone</h2>
      <div className="card">
        <p>Exportez les 12 prochains mois (travaux, vos cultures, dates de récolte estimées, soins des animaux) dans l'agenda de votre téléphone ou de votre ordinateur : vous recevrez les rappels même application fermée.</p>
        <button className="btn primary" onClick={exportIcs}>⬇️ Exporter vers mon agenda (.ics)</button>
        <p className="small muted">iPhone : ouvrez le fichier puis « Tout ajouter ». Android : ouvrez-le avec Google Agenda. Ordinateur : importez-le dans Outlook, Google Agenda ou Calendrier.</p>
      </div>
    </div>
  );
}
