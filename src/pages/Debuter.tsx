import { TROIS_ERREURS, PREMIER_MOIS, DEUXIEME_SAISON, INCREVABLES, AROMATES_FACILES, POTAGER_FACILE, COURSES, OFFRIR } from "../data/debuter";
import { plante } from "../data/index";
import { useStore, toggleFait } from "../lib/store";
import { useRoute, href, go } from "../lib/router";
import { Listen, Tile, Titre } from "../components/ui";

const ONGLETS: [string, string][] = [["parcours", "📅 Mon premier mois"], ["saison2", "🌿 Ma deuxième saison"], ["increvables", "💪 Plantes increvables"], ["aromates", "🌿 Aromates faciles"], ["potager", "🥗 Premier potager"], ["courses", "🛒 Liste de courses"], ["animaux", "🐔 Des animaux"], ["offrir", "🎁 Offrir une plante"]];

export default function Debuter() {
  const onglet = useRoute().query.get("t") ?? "parcours";
  return (
    <div>
      <Titre ico="demarrer" emoji="🌱">Je débute</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>« Je n'ai pas la main verte » n'existe pas : les plantes meurent presque toujours pour les mêmes 3 raisons. Évitez-les, commencez petit, avec des plantes qui pardonnent, et l'appli vous guide semaine après semaine.</p>
      <div className="grid">
        {TROIS_ERREURS.map((e) => <div key={e.titre} className="card"><b>{e.e} {e.titre}</b><p className="small" style={{ margin: "4px 0 0" }}>{e.texte}</p></div>)}
      </div>
      <div className="callout ok small"><b>👆 Le seul geste à retenir : le test du doigt</b>Enfoncez un doigt dans la terre jusqu'à la deuxième phalange. Sec ? On arrose à fond, jusqu'à ce que l'eau sorte par le trou, puis on vide la soucoupe. Encore humide ? On attend, même si le rappel a sonné.</div>
      <Listen id="debuter" title="Je débute" blocks={[...TROIS_ERREURS.map((e) => `${e.titre}. ${e.texte}`), "Le test du doigt : enfoncez un doigt dans la terre. Sec, on arrose à fond puis on vide la soucoupe. Humide, on attend."]} label="Écouter l'essentiel" />
      <div className="chips" role="tablist" style={{ margin: "14px 0" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/debuter?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "parcours" && <Parcours />}
      {onglet === "saison2" && <Saison2 />}
      {onglet === "increvables" && <Liste items={INCREVABLES.map((x) => ({ id: x.id, texte: x.pourquoi }))} intro="Elles supportent les oublis et la lumière moyenne. Choisissez-en une ou deux selon votre fenêtre." suite={["/interieur?t=catalogue&facile=1", "Toutes les plantes faciles du catalogue"]} />}
      {onglet === "aromates" && <Liste items={AROMATES_FACILES.map((x) => ({ id: x.id, texte: x.conseil }))} intro="Les aromates les plus faciles d'abord. Le basilic est facile dehors l'été, beaucoup moins à l'intérieur." suite={["/interieur?t=aromates", "Tous les aromates en intérieur, avec ou sans lampe"]} />}
      {onglet === "potager" && <Liste items={POTAGER_FACILE.map((x) => ({ id: x.id, texte: `${x.ou} · ${x.conseil}` }))} intro="Commencez par 3 ou 4 de ces cultures sur 2 à 10 m² (ou 2 jardinières). Une réussite la première année donne envie de continuer." suite={["/amenagements", "Quelle méthode de potager pour moi ?"]} />}
      {onglet === "courses" && <Courses />}
      {onglet === "animaux" && <Animaux />}
      {onglet === "offrir" && <Liste items={OFFRIR.map((x) => ({ id: x.id, texte: x.pourquoi }))} intro="Des plantes faciles et sans danger pour les animaux : le cadeau qui ne culpabilise personne." />}
    </div>
  );
}

function Parcours() {
  const fait = useStore((s) => s.fait);
  const total = PREMIER_MOIS.reduce((n, w) => n + w.taches.length, 0);
  const ok = PREMIER_MOIS.reduce((n, w) => n + w.taches.filter((t) => fait["deb:" + t.id]).length, 0);
  return (
    <div>
      <div className="row between"><b>Votre progression : {ok} / {total}</b>{ok === total && <span className="badge green">🎉 Premier mois réussi !</span>}</div>
      {ok === total && <p className="callout ok small"><b>Et maintenant ?</b> Votre deuxième saison vous fait découvrir le compost, les semis, les boutures et les conserves, un geste à la fois. <a href={href("/debuter?t=saison2")}>Commencer →</a></p>}
      <div className="progress" style={{ margin: "6px 0 12px" }}><div style={{ width: `${(ok / total) * 100}%` }} /></div>
      {PREMIER_MOIS.map((w) => (
        <div key={w.semaine} className="card">
          <b>{w.semaine}</b>
          {w.taches.map((t) => (
            <label key={t.id} className={`task ${fait["deb:" + t.id] ? "done" : ""}`} style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={!!fait["deb:" + t.id]} onChange={() => toggleFait("deb:" + t.id)} />
              <span>{t.t}{t.lien && <> · <a href={href(t.lien[0])} onClick={(e) => e.stopPropagation()}>{t.lien[1]} →</a></>}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function Saison2() {
  const fait = useStore((s) => s.fait);
  const appart = useStore((s) => s.settings.situation === "appartement");
  const themes = DEUXIEME_SAISON.map((w) => ({ ...w, taches: w.taches.filter((t) => !(appart && t.jardin)) }));
  const total = themes.reduce((n, w) => n + w.taches.length, 0);
  const ok = themes.reduce((n, w) => n + w.taches.filter((t) => fait["s2:" + t.id]).length, 0);
  return (
    <div>
      <p className="small">Le premier mois vous a appris à garder une plante en vie. Cette saison, à votre rythme, vous découvrez un geste nouveau à la fois. Rien n'est obligatoire : cochez ce que vous avez essayé.</p>
      <div className="row between"><b>Votre progression : {ok} / {total}</b>{ok === total && <span className="badge green">🎉 Jardinier confirmé !</span>}</div>
      <div className="progress" style={{ margin: "6px 0 12px" }}><div style={{ width: `${total ? (ok / total) * 100 : 0}%` }} /></div>
      {themes.map((w) => (
        <div key={w.theme} className="card">
          <b>{w.theme}</b>
          {w.taches.map((t) => (
            <label key={t.id} className={`task ${fait["s2:" + t.id] ? "done" : ""}`} style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={!!fait["s2:" + t.id]} onChange={() => toggleFait("s2:" + t.id)} />
              <span>{t.t}{t.lien && <> · <a href={href(t.lien[0])} onClick={(e) => e.stopPropagation()}>{t.lien[1]} →</a></>}</span>
            </label>
          ))}
        </div>
      ))}
      {ok === total && <p className="small">Vous pouvez maintenant afficher tous les niveaux dans les <a href={href("/guides")}>tutoriels</a> et désactiver le mode débutant dans les <a href={href("/reglages")}>réglages</a>.</p>}
    </div>
  );
}

function Liste({ items, intro, suite }: { items: { id: string; texte: string }[]; intro: string; suite?: [string, string] }) {
  return (
    <div>
      <p className="small">{intro}</p>
      <div className="grid">
        {items.map(({ id, texte }) => { const p = plante(id); return p ? <Tile key={id} to={`/plante/${id}`} id={id} emoji={p.emoji} title={p.nom} sub={texte} badge={p.sansDangerAnimaux ? <span className="badge green">🐱 Sans danger</span> : p.categorie === "interieur" ? <span className="badge danger">⚠️ Toxique animaux</span> : undefined} /> : null; })}
      </div>
      {suite && <p className="small"><a href={href(suite[0])}>{suite[1]} →</a></p>}
    </div>
  );
}

function Courses() {
  const situation = useStore((s) => s.settings.situation);
  const cles: ("interieur" | "balcon" | "jardin")[] = situation === "appartement" ? ["interieur"] : situation === "balcon" ? ["interieur", "balcon"] : ["interieur", "jardin"];
  const titres = { interieur: "🌤️ Pour des plantes d'intérieur", balcon: "🏢 Pour un petit potager de balcon", jardin: "🏡 Pour un premier potager au jardin (10 m²)" };
  return (
    <div>
      <p className="small">Le strict nécessaire, adapté à votre lieu (modifiable dans les réglages). Les prix sont des ordres de grandeur.</p>
      {cles.map((k) => (
        <div key={k} className="card">
          <b>{titres[k]}</b>
          <ul className="ticks small">{COURSES[k].map((c) => <li key={c.objet}><b>{c.objet}</b> — {c.prix}{c.note ? ` (${c.note})` : ""}</li>)}</ul>
        </div>
      ))}
      <div className="callout warn small"><b>Inutile au début</b>Billes d'argile au fond des pots (elles ne drainent pas, un pot percé suffit), brumisateur, gadgets « auto-arrosants » sans réserve, engrais « miracle ».</div>
    </div>
  );
}

// Débuter avec des animaux : les étapes et les liens utiles
function Animaux() {
  const etapes: [string, string, string][] = [
    ["🤔", "Choisir l'espèce selon sa place, son temps et son budget", "/animaux"],
    ["📝", "Faire les déclarations (mairie pour les volailles, EDE pour chèvres, moutons et porcs)", "/guide/debuter-animaux"],
    ["⚕️", "Trouver un vétérinaire qui soigne les animaux de ferme, préparer la pharmacie", "/guide/veterinaire-urgences"],
    ["🏠", "Préparer l'abri, la clôture, l'eau et un mois de nourriture", "/guide/poulailler"],
    ["🧳", "Accueillir les nouveaux : quarantaine et transition alimentaire", "/guide/integrer-animaux"],
    ["📒", "Noter les animaux dans Mon jardin : les rappels de soins se font tout seuls", "/jardin/animaux"],
  ];
  return (
    <div>
      <p className="small">Trois poules sont le meilleur premier élevage : peu de place, 10 minutes par jour, des œufs dès le premier printemps. Avant d'acheter, suivez ces étapes dans l'ordre.</p>
      <ol className="steps">{etapes.map(([e, t, to]) => <li key={t}><a href={href(to)}>{e} {t} →</a></li>)}</ol>
    </div>
  );
}
