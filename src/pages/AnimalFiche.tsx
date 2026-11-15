import { MALADIES_ANIMALES } from "../data/maladies-animales";
import { useState } from "react";
import { animal, GUIDES } from "../data/index";
import { Galerie, Back, Listen, Videos, A, Empty, toast } from "../components/ui";
import { href } from "../lib/router";
import TableFumiers from "../components/TableFumiers";
import { upsert, uid, today } from "../lib/store";

export default function AnimalFiche({ id }: { id?: string }) {
  const a = id ? animal(id) : undefined;
  const [tab, setTab] = useState("quotidien");
  if (!a) return <Empty emoji="🤷">Fiche introuvable. <A to="/animaux">Tous les animaux</A></Empty>;
  const guides = GUIDES.filter((g) => g.liens?.includes(a.id));
  const L = (t: string, l: string[]) => (l.length ? [t + ".", ...l] : []);
  const lectures: Record<string, string[]> = {
    quotidien: [`${a.nom}. ${a.resume}`, ...L("Chaque jour", a.quotidien), ...L("Chaque semaine", a.hebdo), ...L("Chaque mois", a.mensuel), ...L("Au printemps", a.saisons.printemps), ...L("En été", a.saisons.ete), ...L("En automne", a.saisons.automne), ...L("En hiver", a.saisons.hiver)],
    logement: L("Logement", a.logement),
    alimentation: [...L("Alimentation", a.alimentation), `L'eau. ${a.eau}`, ...L("Ce que le jardin peut leur donner", a.jardinOK), ...L("Interdit", a.interdits)],
    sante: [...a.sante.map((s) => `Si vous observez : ${s.signe}. Alors : ${s.action}`), ...a.maladies.map((m) => `${m.nom}. Signes : ${m.signes}. Prévention : ${m.prevention}. Soin : ${m.soin}`)],
    jardin: [`Le fumier. ${a.fumier.valeur}`, ...a.fumier.usage, ...L("Au jardin", a.auJardin)],
    regles: [...L("Réglementation", a.reglementation), ...L("Reproduction", a.reproduction)],
  };
  const TABS: [string, string][] = [["quotidien", "Au quotidien"], ["logement", "Logement"], ["alimentation", "Alimentation"], ["sante", "Santé"], ["jardin", "Fumier et jardin"], ["regles", "Règles et reproduction"], ["videos", "Vidéos"]];
  return (
    <div>
      <Back />
      <div className="hero" style={{ marginTop: 8 }}>
        <Galerie id={a.id} emoji={a.emoji} alt={a.nom} />
        <div>
          <h1>{a.nom}</h1>
          <p>{a.resume}</p>
          <div className="row">
            <button className="btn primary" onClick={() => { upsert("troupeaux", { id: uid(), animalId: a.id, nom: a.nom, nombre: 1, depuis: today() }); toast("Ajouté à Mon jardin → Animaux"); }}>➕ J'en ai</button>
          </div>
        </div>
      </div>
      <div className="facts" style={{ marginTop: 14 }}>
        {[["Espace", a.profil.espace], ["Temps", a.profil.temps], ["Budget", a.profil.budget], ["Durée de vie", a.profil.vie], ["Bruit", a.profil.bruit]].map(([k, v]) => <div key={k} className="fact"><div className="k">{k}</div>{v}</div>)}
      </div>
      <div className="tabs" role="tablist">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab !== "videos" && <div style={{ marginBottom: 10 }}><Listen id={`an-${a.id}-${tab}`} title={`${a.nom} — ${TABS.find((t) => t[0] === tab)![1]}`} blocks={lectures[tab]} /></div>}

      {tab === "quotidien" && (
        <div className="grid">
          {[["☀️ Chaque jour", a.quotidien], ["📆 Chaque semaine", a.hebdo], ["🗓️ Chaque mois", a.mensuel], ["🌸 Printemps", a.saisons.printemps], ["🌞 Été", a.saisons.ete], ["🍂 Automne", a.saisons.automne], ["❄️ Hiver", a.saisons.hiver]].map(([t, l]) => (
            <div key={t as string} className="card"><b>{t as string}</b><ul className="ticks small">{(l as string[]).map((x) => <li key={x}>{x}</li>)}</ul></div>
          ))}
        </div>
      )}
      {tab === "logement" && <ul className="ticks">{a.logement.map((x) => <li key={x}>{x}</li>)}</ul>}
      {tab === "alimentation" && (
        <div>
          <ul className="ticks">{a.alimentation.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="small"><a href={href(`/nutrition?t=animaux&a=${a.id}`)}>🍽️ Ses besoins expliqués : eau, protéines, fibres, minéraux, signes de manque →</a></p>
          <div className="callout info"><b>💧 L'eau</b>{a.eau}</div>
          <div className="grid">
            <div className="card"><b>✅ Ce que le jardin peut leur donner</b><ul className="ticks small">{a.jardinOK.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="card" style={{ borderColor: "var(--danger)" }}><b>⛔ Interdit, toxique ou dangereux</b><ul className="ticks small">{a.interdits.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <p><a href={href("/guide/cultiver-pour-animaux")}>🌽 Cultiver pour nourrir ses animaux →</a></p>
        </div>
      )}
      {tab === "sante" && (
        <div>
          <a className="btn big primary" href={href(`/diagnostic-animal?animal=${a.id}`)}>🩺 Diagnostic guidé : mon animal ne va pas bien</a>
          {MALADIES_ANIMALES.some((m) => m.especes.includes(a.id)) && <div className="chips" style={{ margin: "10px 0" }}>{MALADIES_ANIMALES.filter((m) => m.especes.includes(a.id)).map((m) => <a key={m.id} className="chip" href={href(`/maladie-animale/${m.id}`)}>🩺 {m.nom}</a>)}</div>}
          <h3>Signes d'alerte : que faire ?</h3>
          {a.sante.map((s) => <div key={s.signe} className="card"><b>👁️ {s.signe}</b><p className="small" style={{ margin: "4px 0 0" }}>→ {s.action}</p></div>)}
          <h3 style={{ marginTop: 18 }}>Maladies et parasites courants</h3>
          {a.maladies.map((m) => (
            <details key={m.nom} className="box"><summary>{m.nom}</summary>
              <p className="small"><b>Signes :</b> {m.signes}</p><p className="small"><b>Prévention :</b> {m.prevention}</p><p className="small"><b>Soin :</b> {m.soin}</p>
            </details>
          ))}
          <div className="callout warn small"><b>Vétérinaire</b>Ces informations aident à repérer un problème, pas à le soigner seul. Pas de médicament sans prescription, et respect des délais d'attente avant de consommer œufs, lait ou viande.</div>
          <p><a href={href("/guide/animaux-auxiliaires")}>🛡️ Parasites : prévention naturelle →</a></p>
        </div>
      )}
      {tab === "jardin" && (
        <div>
          <div className="callout ok"><b>💩 Le fumier</b>{a.fumier.valeur}</div>
          <TableFumiers seul={a.id} />
          <p className="small"><a href={href("/guide/repulsifs-animaux")}>🧶 Les produits des animaux contre les nuisibles →</a> · <a href={href("/guide/fumiers")}>Tous les fumiers comparés →</a></p>
          <ul className="ticks">{a.fumier.usage.map((x) => <li key={x}>{x}</li>)}</ul>
          <h3>Services rendus au jardin</h3>
          <ul className="ticks">{a.auJardin.map((x) => <li key={x}>{x}</li>)}</ul>
          {a.produits && <><h3>Ce qu'ils produisent</h3><ul className="ticks">{a.produits.map((x) => <li key={x}>{x}</li>)}</ul></>}
          {a.cohabitation && <p><b>Cohabitation :</b> {a.cohabitation}</p>}
        </div>
      )}
      {tab === "regles" && (
        <div>
          <div className="callout info"><b>⚖️ Réglementation (France)</b><ul className="ticks" style={{ margin: 0 }}>{a.reglementation.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <h3>Reproduction</h3>
          <ul className="ticks">{a.reproduction.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
      {tab === "videos" && <Videos id={`an-${a.id}`} query={a.video} />}

      {guides.length > 0 && (
        <>
          <h2>Tutoriels liés</h2>
          <div className="chips">{guides.map((g) => <a key={g.id} className="chip" href={href(`/guide/${g.id}`)}>{g.emoji} {g.titre}</a>)}</div>
        </>
      )}
    </div>
  );
}
