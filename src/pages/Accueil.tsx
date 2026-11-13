import { useEffect, useState } from "react";
import { useStore, toggleFait, getState } from "../lib/store";
import { meteo, alertes, emojiMeteo, type Meteo } from "../lib/meteo";
import { lune } from "../lib/lune";
import { travauxDuMois, plantesDuMois, tachesPerso, ACTIONS, type Action } from "../lib/calendar";
import { MOIS_NOMS } from "../data/util";
import { A, Listen, Section } from "../components/ui";
import { href, go } from "../lib/router";
import { Logo } from "../App";
import type { Plante } from "../data/types";

export function filtreSituation(sit: string) {
  return (p: Plante) =>
    sit === "appartement" ? p.lieux.includes("interieur") && p.categorie !== "interieur"
    : sit === "balcon" ? (p.lieux.includes("pot") || p.lieux.includes("balcon")) && p.categorie !== "interieur" && p.categorie !== "engrais-vert"
    : p.categorie !== "interieur";
}

export function sectionsSituation(sit: string, animaux: boolean) {
  const base: { k: "potager" | "verger" | "serre" | "interieur" | "compost" | "animaux" | "balcon"; t: string; e: string }[] =
    sit === "appartement" ? [{ k: "interieur", t: "Plantes d'intérieur", e: "🌿" }, { k: "balcon", t: "Fenêtre et pots", e: "🏙️" }]
    : sit === "balcon" ? [{ k: "balcon", t: "Balcon", e: "🏢" }, { k: "interieur", t: "Plantes d'intérieur", e: "🌿" }, { k: "compost", t: "Compost", e: "♻️" }]
    : [{ k: "potager", t: "Potager", e: "🥕" }, { k: "verger", t: "Verger et petits fruits", e: "🍎" }, { k: "serre", t: "Serre et abris", e: "🏡" }, { k: "compost", t: "Compost", e: "♻️" }, { k: "interieur", t: "Plantes d'intérieur", e: "🌿" }];
  if (animaux && sit === "jardin") base.splice(1, 0, { k: "animaux", t: "Animaux", e: "🐔" });
  return base;
}

export default function Accueil() {
  const s = useStore((x) => x);
  const { settings } = s;
  const now = new Date();
  const mois = now.getMonth() + 1;
  const [wx, setWx] = useState<Meteo | null>(null);
  const [wxErr, setWxErr] = useState(false);
  const l = lune(now);

  useEffect(() => {
    if (!settings.ville) return;
    meteo(settings.ville.lat, settings.ville.lon).then(setWx).catch(() => setWxErr(true));
  }, [settings.ville]);

  const perso = tachesPerso(s, now);
  const t = travauxDuMois(mois);
  const sections = sectionsSituation(settings.situation, settings.animauxActifs || s.troupeaux.length > 0);
  const pm = plantesDuMois(mois, settings.zone, filtreSituation(settings.situation));
  const al = wx ? alertes(wx, settings.animauxActifs || s.troupeaux.length > 0) : [];
  const heure = now.getHours();
  const salut = heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";
  const saison = mois <= 2 || mois === 12 ? "hiver" : mois <= 5 ? "printemps" : mois <= 8 ? "été" : "automne";

  const blocsLecture = [
    `${salut}. Nous sommes le ${now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}.`,
    ...al.map((a) => `Alerte météo : ${a.titre}. ${a.conseils.join(" ")}`),
    ...(perso.length ? ["Vos tâches : " + perso.map((p) => p.texte).join(". ")] : []),
    ...sections.map((x) => `${x.t} : ${t[x.k].join(" ")}`),
  ];

  return (
    <div>
      <div className="topbar">
        <a className="brand" href={href("/")}><Logo /> Racines</a>
        <div className="grow" />
        <button className="icon-btn" onClick={() => go("/recherche")} aria-label="Rechercher">🔍</button>
      </div>
      <h1>{salut} 🌿</h1>
      <p className="muted" style={{ marginTop: -6 }}>
        {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {saison}
      </p>
      <div className="row" style={{ marginBottom: 12 }}>
        <Listen id="jour" title="Le programme du jour" blocks={blocsLecture} label="Écouter le programme du jour" />
      </div>

      {settings.ville && (
        <div className="card">
          <div className="row between"><b>🌦️ Météo à {settings.ville.nom.split(",")[0]}</b>{wxErr && <span className="small muted">hors connexion</span>}</div>
          {wx && (
            <div className="wx" style={{ marginTop: 8 }}>
              {wx.jours.map((j) => (
                <div key={j.date}>
                  {new Date(j.date + "T12:00").toLocaleDateString("fr-FR", { weekday: "short" })}
                  <b>{emojiMeteo(j.code)}</b>
                  <span style={{ color: "var(--terra)" }}>{Math.round(j.tmax)}°</span> / <span style={{ color: "var(--info)" }}>{Math.round(j.tmin)}°</span>
                  {j.pluie > 0.4 && <div className="small">💧{Math.round(j.pluie)} mm</div>}
                </div>
              ))}
            </div>
          )}
          {al.map((a) => (
            <div key={a.titre} className={`callout ${a.niveau === "danger" ? "danger" : a.niveau === "attention" ? "warn" : "info"}`}>
              <b>{a.emoji} {a.titre}</b>
              <ul className="ticks" style={{ margin: 0 }}>{a.conseils.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
      {!settings.ville && (
        <div className="callout info small">🌦️ Ajoutez votre commune dans les <A to="/reglages">réglages</A> pour la météo et les alertes gel, canicule et fortes pluies.</div>
      )}

      <div className="card row" style={{ marginTop: 12 }}>
        <span style={{ fontSize: "2.2rem" }}>{l.emoji}</span>
        <div style={{ flex: 1 }}>
          <b>{l.phase} · lune {l.montante ? "montante" : "descendante"}</b>
          <div className="small muted">{l.conseil} <i>Tradition jardinière, sans effet démontré scientifiquement.</i></div>
        </div>
      </div>

      <div className="grid-sm" style={{ marginTop: 14 }}>
        <a className="btn big" href={href("/diagnostic")}>🩺 Ma plante est malade</a>
        <a className="btn big" href={href("/identifier")}>📷 Identifier par photo</a>
        <a className="btn big" href={href("/creer")}>👨‍🌾 Créer mon potager</a>
        <a className="btn big" href={href("/jardin")}>🧺 Noter un semis, une récolte</a>
      </div>

      <Section title="Mes tâches">
        {perso.length ? (
          <div className="card">
            {perso.map((p) => (
              <div key={p.key} className={`task ${s.fait[p.key] ? "done" : ""}`}>
                <input type="checkbox" checked={!!s.fait[p.key]} onChange={() => toggleFait(p.key)} aria-label="Fait" />
                <span>{p.emoji} <a href={href(p.href)} style={{ color: p.urgent ? "var(--danger)" : undefined }}>{p.texte}</a></span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted small">Notez vos semis, plantations et animaux dans <A to="/jardin">Mon jardin</A> : Racines calculera vos dates de récolte et vos rappels de soins.</p>
        )}
      </Section>

      <Section title={`À faire en ${MOIS_NOMS[mois - 1]}`} right={<A to="/calendrier" className="small">Tout le calendrier →</A>}>
        <div className="grid">
          {(["semisAbri", "semisPlace", "plantation", "recolte"] as Action[]).map((a) =>
            pm[a].length ? (
              <div key={a} className="card">
                <b>{ACTIONS[a].emoji} {ACTIONS[a].verbe}</b>
                <div className="chips" style={{ marginTop: 8 }}>
                  {pm[a].slice(0, 14).map((p) => <a key={p.id} className="chip" href={href(`/plante/${p.id}`)}>{p.emoji} {p.nom}</a>)}
                  {pm[a].length > 14 && <A to="/calendrier" className="chip">+{pm[a].length - 14}</A>}
                </div>
              </div>
            ) : null,
          )}
        </div>
        {sections.map((x) => (
          <div key={x.k} className="card">
            <b>{x.e} {x.t}</b>
            {t[x.k].map((txt, i) => {
              const key = `${now.getFullYear()}-${mois}:${x.k}:${i}`;
              return (
                <div key={key} className={`task ${s.fait[key] ? "done" : ""}`}>
                  <input type="checkbox" checked={!!s.fait[key]} onChange={() => toggleFait(key)} aria-label="Fait" />
                  <span>{txt}</span>
                </div>
              );
            })}
          </div>
        ))}
      </Section>
      <p className="small muted center" style={{ marginTop: 24 }}>Zone climatique : {settings.zone} · <A to="/reglages">modifier</A>{getState().settings.situation === "jardin" ? "" : ""}</p>
    </div>
  );
}
