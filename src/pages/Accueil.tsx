import { Ico } from "../components/Ico";
import { useEffect, useState } from "react";
import { useStore, toggleFait } from "../lib/store";
import { meteo, alertes, emojiMeteo, type Meteo } from "../lib/meteo";
import { lune } from "../lib/lune";
import { travauxDuMois, plantesDuMois, tachesPerso, ACTIONS, type Action } from "../lib/calendar";
import { MOIS_NOMS } from "../data/util";
import { PREMIER_MOIS, DEUXIEME_SAISON } from "../data/debuter";
import { A, Listen, Section } from "../components/ui";
import { href } from "../lib/router";
import { Logo } from "../App";
import type { Plante } from "../data/types";
import { ZONES } from "../data/index";
import { aFaire, marquer } from "../lib/mesplantes";
import { upsert } from "../lib/store";

export function filtreSituation(sit: string) {
  return (p: Plante) =>
    sit === "appartement" ? p.lieux.includes("interieur") && p.categorie !== "interieur"
    : sit === "balcon" ? (p.lieux.includes("pot") || p.lieux.includes("balcon")) && p.categorie !== "interieur" && p.categorie !== "engrais-vert"
    : p.categorie !== "interieur";
}

export function sectionsSituation(sit: string, animaux: boolean) {
  const base: { k: "potager" | "verger" | "serre" | "interieur" | "compost" | "animaux" | "balcon"; t: string; e: string }[] =
    sit === "appartement" ? [{ k: "interieur", t: "Plantes de la maison", e: "🌿" }]
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
  const al = wx ? alertes(wx, settings.animauxActifs || s.troupeaux.length > 0, settings.situation) : [];
  const appart = settings.situation === "appartement";
  const aVerifier = aFaire(s.plantes, now);
  const heure = now.getHours();
  const salut = heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";
  const saison = mois <= 2 || mois === 12 ? "hiver" : mois <= 5 ? "printemps" : mois <= 8 ? "été" : "automne";

  const blocsLecture = [
    `${salut}. Nous sommes le ${now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}.`,
    ...al.map((a) => `Alerte météo : ${a.titre}. ${a.conseils.join(" ")}`),
    ...(aVerifier.length ? ["Plantes à vérifier aujourd'hui : " + aVerifier.map(({ mp, e }) => `${mp.surnom}, ${e.texte}`).join(". ")] : []),
    ...(perso.length ? ["Vos tâches : " + perso.map((p) => p.texte).join(". ")] : []),
    ...sections.map((x) => `${x.t} : ${t[x.k].join(" ")}`),
  ];

  return (
    <div>
      <div className="topbar">
        <a className="brand" href={href("/")}><Logo /> Racines</a>
        <div className="grow" />
      </div>
      <h1>{salut} 🌿</h1>
      <p className="muted" style={{ marginTop: -6 }}>
        {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {saison}
      </p>
      <div className="row" style={{ marginBottom: 12 }}>
        <Listen id="jour" title="Le programme du jour" blocks={blocsLecture} label="Écouter le programme du jour" />
        {(settings.situation === "appartement" || settings.situation === "balcon") && <A to="/interieur" className="btn sm">🌿 Intérieur et aromates</A>}
      </div>

      {settings.debutant && (() => {
        const toutes = PREMIER_MOIS.flatMap((w) => w.taches);
        const prochaine = toutes.find((x) => !s.fait["deb:" + x.id]);
        const faites = toutes.length - toutes.filter((x) => !s.fait["deb:" + x.id]).length;
        if (!prochaine) {
          const t2 = DEUXIEME_SAISON.flatMap((w) => w.taches).filter((x) => !(appart && x.jardin));
          const p2 = t2.find((x) => !s.fait["s2:" + x.id]);
          const f2 = t2.length - t2.filter((x) => !s.fait["s2:" + x.id]).length;
          return p2 ? (
            <a className="card row" href={href("/debuter?t=saison2")} style={{ textDecoration: "none", color: "inherit", flexWrap: "nowrap", borderColor: "var(--green)", borderWidth: 2, marginTop: 10 }}>
              <span style={{ fontSize: 34 }}>🌿</span>
              <span style={{ flex: 1 }}><b>Ma deuxième saison · {f2} / {t2.length}</b><br /><span className="small">{p2.t}</span></span>
            </a>
          ) : null;
        }
        return prochaine ? (
          <a className="card row" href={href("/debuter")} style={{ textDecoration: "none", color: "inherit", flexWrap: "nowrap", borderColor: "var(--green)", borderWidth: 2, marginTop: 10 }}>
            <span style={{ fontSize: 34 }}>🌱</span>
            <span style={{ flex: 1 }}><b>Je débute · étape {faites + 1} sur {toutes.length}</b><br /><span className="small">{prochaine.t}</span>
              <span className="progress" style={{ display: "block", marginTop: 6 }}><span style={{ display: "block", height: "100%", width: `${(faites / toutes.length) * 100}%`, background: "var(--green)" }} /></span></span>
          </a>
        ) : null;
      })()}
      {(s.plantes.length > 0 || appart || settings.situation === "balcon" || settings.debutant) && (
        <Section title="Mes plantes à vérifier" right={<a className="small" href={href("/jardin/mesplantes")}>Toutes →</a>}>
          {aVerifier.length ? (
            <div className="card">
              {aVerifier.map(({ mp, e }) => (
                <div key={mp.id + e.type} className="task">
                  <button className="btn sm" onClick={() => upsert("plantes", marquer(mp, e.type))} aria-label={`Noter : ${e.type} fait`}>{e.type === "arrosage" ? "💧" : e.type === "engrais" ? "🌱" : "🏺"} Fait</button>
                  <span><b>{mp.surnom}</b>{mp.piece ? <span className="muted"> · {mp.piece}</span> : null} — {e.texte}</span>
                </div>
              ))}
              <p className="small muted" style={{ margin: "6px 0 0" }}>Enfoncez un doigt dans la terre : n'arrosez que si elle est sèche sur 2 à 3 cm (succulentes : entièrement sèche).</p>
            </div>
          ) : s.plantes.length ? <p className="muted small">Rien à vérifier aujourd'hui. 🌿</p> : <p className="muted small">Ajoutez vos plantes dans <A to="/jardin/mesplantes">Mes plantes</A> pour recevoir les rappels d'arrosage, d'engrais et de rempotage.</p>}
        </Section>
      )}

      {settings.ville && (
        <div className="card">
          <div className="row between"><b className="row" style={{ gap: 6 }}><Ico nom="meteo" emoji="🌦️" taille={26} /> Météo à {settings.ville.nom.split(",")[0]}</b>{wxErr && <span className="small muted">hors connexion</span>}</div>
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
        <a className="callout warn small row" href={href("/reglages")} style={{ display: "flex", textDecoration: "none", color: "inherit" }}><span>🌦️ <b>Ajoutez votre commune</b> (30 secondes) : Racines vous préviendra avant un gel, une canicule ou de fortes pluies, ce qui sauve souvent les plantes d'un balcon ou d'un potager.</span></a>
      )}

      {settings.lune && <div className="card row" style={{ marginTop: 12 }}>
        <span style={{ position: "relative" }}><Ico nom="lune" emoji={l.emoji} taille={48} /><span style={{ position: "absolute", right: -4, bottom: -4, fontSize: "1.2rem" }}>{l.emoji}</span></span>
        <div style={{ flex: 1 }}>
          <b>{l.phase} · lune {l.montante ? "montante" : "descendante"}</b>
          <div className="small muted">{l.conseil} <i>Tradition jardinière, sans effet démontré scientifiquement.</i></div>
        </div>
      </div>}

      <div className="grid-sm" style={{ marginTop: 14 }}>
        <a className="btn big" href={href(appart ? "/diagnostic?interieur=1" : "/diagnostic")}><Ico nom="diagnostic" emoji="⚕️" taille={40} /> Ma plante est malade</a>
        <a className="btn big" href={href("/identifier")}><Ico nom="photo" emoji="📷" taille={40} /> Je ne connais pas son nom</a>
        {appart ? <>
          <a className="btn big" href={href("/jardin/mesplantes")}><Ico nom="mesplantes" emoji="🌿" taille={40} /> Mes plantes</a>
          <a className="btn big" href={href("/guide/potager-interieur")}><Ico nom="potager-interieur" emoji="🍅" taille={40} /> Potager d'intérieur</a>
        </> : <>
          <a className="btn big" href={href("/creer")}><Ico nom="creer" emoji="👨‍🌾" taille={40} /> Créer mon potager</a>
          <a className="btn big" href={href("/jardin")}><Ico nom="jardin" emoji="🧺" taille={40} /> Noter un semis, une récolte</a>
        </>}
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
          <p className="muted small">{appart ? "Notez vos semis d'aromatiques et de micro-pousses dans" : "Notez vos semis, plantations et animaux dans"} <A to="/jardin">{appart ? "Mes plantes et ma maison" : "Mon jardin"}</A> : Racines calculera vos dates de récolte et vos rappels de soins.</p>
        )}
      </Section>

      {(() => {
        // D'abord les plantes de la personne, puis quelques repères du mois, le reste replié
        const mes = new Set([...s.cultures.filter((c) => !c.fini).map((c) => c.planteId), ...s.plantes.map((p) => p.planteId)]);
        const actions = (["semisAbri", "repiquage", "semisPlace", "plantation", "recolte"] as Action[]);
        const pourMoi = actions.map((a) => ({ a, ps: pm[a].filter((p) => mes.has(p.id)) })).filter((x) => x.ps.length);
        const general = actions.filter((a) => pm[a].length).slice(0, 3);
        const abeilles = s.troupeaux.some((x) => x.animalId === "abeille") || s.ruches.length > 0;
        const travaux = sections.flatMap((x) => t[x.k].map((txt, i) => ({ x, txt, key: `${now.getFullYear()}-${mois}:${x.k}:${i}` }))).filter((w) => abeilles || !/ruche|varroa|abeille/i.test(w.txt));
        const essentiels = travaux.slice(0, 5);
        const tache = (w: typeof travaux[number]) => (
          <div key={w.key} className={`task ${s.fait[w.key] ? "done" : ""}`}>
            <input type="checkbox" checked={!!s.fait[w.key]} onChange={() => toggleFait(w.key)} aria-label="Fait" />
            <span><span aria-hidden="true">{w.x.e}</span> {w.txt}</span>
          </div>
        );
        return (
          <Section title={`À faire en ${MOIS_NOMS[mois - 1]}`} right={<A to="/calendrier" className="small">Tout le calendrier →</A>}>
            {pourMoi.length > 0 && (
              <div className="card" style={{ borderColor: "var(--green)", borderWidth: 2 }}>
                <b>🌱 Pour vos plantes</b>
                {pourMoi.map(({ a, ps }) => (
                  <div key={a} className="small" style={{ marginTop: 6 }}>{ACTIONS[a].emoji} <b>{ACTIONS[a].verbe}</b> : {ps.map((p, k) => <span key={p.id}>{k ? ", " : ""}<a href={href(`/plante/${p.id}`)}>{p.nom}</a></span>)}</div>
                ))}
              </div>
            )}
            {!pourMoi.length && <p className="small muted" style={{ margin: "0 0 6px" }}>Quelques idées pour ce mois-ci. Notez vos cultures dans <A to="/jardin">Mon jardin</A> et cette rubrique ne parlera plus que de vos plantes.</p>}
            <div className="card">
              <b>💡 Les essentiels du mois</b>
              {essentiels.map(tache)}
              {general.length > 0 && (
                <div className="small" style={{ marginTop: 8 }}>
                  {general.map((a) => <div key={a} style={{ marginTop: 4 }}>{ACTIONS[a].emoji} {ACTIONS[a].verbe} : {pm[a].slice(0, 5).map((p, k) => <span key={p.id}>{k ? ", " : ""}<a href={href(`/plante/${p.id}`)}>{p.nom}</a></span>)}{pm[a].length > 5 ? <> et <A to="/calendrier">{pm[a].length - 5} autres</A></> : null}</div>)}
                </div>
              )}
              {travaux.length > essentiels.length && (
                <details className="box" style={{ marginTop: 8 }}><summary>Tous les travaux du mois ({travaux.length})</summary>{travaux.slice(5).map(tache)}</details>
              )}
            </div>
          </Section>
        );
      })()}
      <p className="small muted center" style={{ marginTop: 24 }}>Climat : {ZONES.find((z) => z.id === settings.zone)?.nom} · <A to="/reglages">modifier</A></p>
    </div>
  );
}
