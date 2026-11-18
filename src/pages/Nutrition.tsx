import { useState } from "react";
import { NUTRIMENTS, BESOINS_PLANTES, ENGRAIS_NATURELS, ERREURS_ENGRAIS, NUTRITION_ANIMAUX } from "../data/nutrition";
import { SOL_PLANTE } from "../data/sols";
import { PLANTES, ANIMAUX, plante, animal, probleme, lienVers } from "../data/index";
import { useRoute, href, go } from "../lib/router";
import { Back, Listen, A } from "../components/ui";
import { Vignette, srcVignette } from "../components/Ico";

export default function Nutrition() {
  const route = useRoute();
  const onglet = route.query.get("t") ?? "plantes";
  return (
    <div>
      <Back />
      <h1>🍽️ Nourrir ses plantes et ses animaux</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Ce dont chacun a besoin, expliqué simplement : pour les légumes, les fruits, les fleurs, les plantes en pot et d'intérieur, et pour chaque animal de la basse-cour.</p>
      <div className="chips" role="tablist" style={{ margin: "10px 0 14px" }}>
        {[["plantes", "🌱 Les plantes"], ["engrais", "🧺 Les engrais naturels"], ["animaux", "🐔 Les animaux"]].map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/nutrition?t=${k}`)}>{l}</button>)}
        <a className="chip" href={href("/sol")}>🌍 Identifier mon sol</a>
      </div>
      {onglet === "plantes" && <Plantes />}
      {onglet === "engrais" && <Engrais />}
      {onglet === "animaux" && <Animaux />}
    </div>
  );
}

function Plantes() {
  const route = useRoute();
  const [pid, setPid] = useState(route.query.get("p") ?? "");
  const p = pid ? plante(pid) : undefined;
  const besoin = p ? BESOINS_PLANTES.find((b) => b.id === p.besoin) : undefined;
  const choix = PLANTES.filter((x) => x.categorie !== "toxique" && x.categorie !== "sauvage").sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Comment se nourrit une plante ?</h2>
      <div className="callout ok"><b>En une phrase</b>Avec ses feuilles, la plante fabrique son sucre grâce à la <b>lumière</b>, à l'<b>air</b> et à l'<b>eau</b> ; avec ses racines, elle puise dans le sol des <b>minéraux</b>, comme nous prenons des vitamines. C'est le sol vivant (vers, champignons, bactéries) qui prépare ces minéraux à partir du compost et des feuilles mortes.</div>
      <h3>Les trois lettres des engrais : N-P-K</h3>
      <p className="small">Sur un sac d'engrais, trois chiffres (par exemple 4-6-10) indiquent la quantité de chacun. Pour s'en souvenir : <b>N = en haut</b> (les feuilles), <b>P = en bas</b> (les racines) et les fleurs, <b>K = les fruits</b> et la santé.</p>
      <div className="grid">
        {NUTRIMENTS.map((n) => {
          const c = n.carence ? probleme(n.carence) : undefined;
          return (
            <div key={n.id} className="card">
              <b><span className="badge green" style={{ fontSize: "1rem" }}>{n.symbole}</span> {n.nom}</b>
              <p className="small" style={{ margin: "6px 0" }}>{n.role} <i>{n.image}</i></p>
              <p className="small" style={{ margin: "4px 0" }}><b>S'il manque :</b> {n.manque}</p>
              <p className="small" style={{ margin: "4px 0" }}><b>En trop :</b> {n.trop}</p>
              <p className="small" style={{ margin: "4px 0" }}><b>Où le trouver :</b> {n.sources.join(", ")}.</p>
              {c && <a className="small" href={href(`/probleme/${c.id}`)}>Fiche « {c.nom} » →</a>}
            </div>
          );
        })}
      </div>
      <h2>Toutes les plantes n'ont pas le même appétit</h2>
      <div className="grid">
        {BESOINS_PLANTES.map((b) => {
          const ex = PLANTES.filter((x) => x.besoin === b.id && ["legume", "aromatique", "fruit", "arbre"].includes(x.categorie)).slice(0, 10);
          return (
            <div key={b.id} className="card">
              <b>{b.emoji} {b.nom}</b>
              <p className="small" style={{ margin: "4px 0" }}>{b.explication}</p>
              <p className="small" style={{ margin: "4px 0" }}><b>Quoi :</b> {b.apport}</p>
              <p className="small" style={{ margin: "4px 0" }}><b>Quand :</b> {b.quand}</p>
              <div className="chips">{ex.map((x) => <a key={x.id} className="chip" href={href(`/plante/${x.id}`)}><Vignette id={x.id} emoji={x.emoji} taille={18} /> {x.nom}</a>)}</div>
            </div>
          );
        })}
      </div>
      <h2>Et ma plante, de quoi a-t-elle besoin ?</h2>
      <div className="card stack">
        <select value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Choisir une plante">
          <option value="">— Choisir une plante —</option>
          {choix.map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.nom}</option>)}
        </select>
        {p && (
          <div>
            <b>{p.nom}</b>
            {p.categorie === "interieur" ? (
              <ul className="ticks small">
                <li>Engrais liquide organique pour plantes vertes {p.fleurit ? "(ou « plantes fleuries » au moment de la floraison)" : ""}, à demi-dose, {p.soins?.engrais ? `environ toutes les ${Math.round(p.soins.engrais / 7)} semaine(s)` : "une fois par mois"} du printemps à fin août ; rien en hiver.</li>
                <li>Rempotage {p.rempotage ? p.rempotage.toLowerCase() : "tous les 2 à 3 ans"} : un terreau neuf est le meilleur des engrais.</li>
                <li>Cactus, succulentes, orchidées, carnivores : engrais spécifique ou aucun (carnivores : jamais).</li>
              </ul>
            ) : (
              <ul className="ticks small">
                {besoin && <li><b>{besoin.nom} :</b> {besoin.apport} {besoin.quand}</li>}
                {SOL_PLANTE[p.id] && <li><b>Sol idéal :</b> {SOL_PLANTE[p.id]}</li>}
                {p.categorie === "arbre" || p.categorie === "fruit" ? <li>Arbres et arbustes fruitiers : 3 à 5 kg de compost ou de fumier décomposé au pied, sur toute la largeur du feuillage, en fin d'hiver ; paillage permanent ; purin de consoude ou cendre (sol non calcaire) à la formation des fruits.</li> : null}
                {["tomate", "aubergine", "poivron", "courge", "courgette", "concombre", "melon", "fraisier"].includes(p.id) && <li>Purin d'ortie au départ (feuilles), puis purin de consoude dès les premières fleurs (fruits).</li>}
                {p.besoin === "peu" && <li>Évitez le fumier frais : racines fourchues, maladies, peu de goût.</li>}
                <li>En pot ou en bac : mêmes besoins, mais tout s'épuise plus vite : engrais liquide organique toutes les 2 à 3 semaines en saison.</li>
              </ul>
            )}
            <a className="small" href={href(`/plante/${p.id}`)}>Fiche complète →</a>
          </div>
        )}
      </div>
      <h2>Les erreurs à éviter</h2>
      <ul className="ticks">{ERREURS_ENGRAIS.map((e) => <li key={e}>{e}</li>)}</ul>
      <p className="small"><a href={href("/diagnostic")}>🔎 Feuilles jaunes ou plante chétive ? Le diagnostic guidé →</a></p>
    </div>
  );
}

function Engrais() {
  return (
    <div>
      {srcVignette("engrais-naturels") && <img src={srcVignette("engrais-naturels")} alt="Compost, orties et fumier au jardin" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} />}
      <p className="small">Tous ces engrais sont autorisés au jardin familial et en agriculture biologique. Les doses sont indicatives, par m² de potager.</p>
      {ENGRAIS_NATURELS.map((e) => {
        const l = e.lien ? lienVers(e.lien) : null;
        return (
          <details key={e.nom} className="box">
            <summary>{e.emoji} {e.nom} <span className="small muted" style={{ fontWeight: 400 }}>— {e.apporte}</span></summary>
            <ul className="ticks small">
              <li><b>Effet :</b> {e.vitesse}</li>
              <li><b>Comment :</b> {e.usage}</li>
              <li><b>⚠️ Attention :</b> {e.attention}</li>
            </ul>
            {l && <a className="chip" href={href(l.href)}>{l.emoji} {l.label}</a>}
          </details>
        );
      })}
      <p className="small"><A to="/guide/engrais-naturels">Tutoriel : nourrir son sol →</A> · <A to="/calculs?s=compost">Combien de compost pour ma surface ? →</A></p>
    </div>
  );
}

function Animaux() {
  const route = useRoute();
  const [aid, setAid] = useState(route.query.get("a") ?? "");
  const n = NUTRITION_ANIMAUX.find((x) => x.id === aid);
  const a = aid ? animal(aid) : undefined;
  return (
    <div>
      <div className="callout ok"><b>Les 5 besoins de tout animal</b>1. <b>De l'eau propre</b> à volonté (le plus oublié). 2. <b>De l'énergie</b> (herbe, céréales). 3. <b>Des protéines</b> pour grandir, pondre, produire du lait. 4. <b>Des fibres</b> pour les herbivores (foin, paille, branches) : lapins, chèvres, moutons, ânes et chevaux en ont besoin en permanence. 5. <b>Des minéraux</b> (calcium, sel, oligo-éléments) : coquilles d'huîtres pour les pondeuses, pierre à lécher pour les ruminants et les équidés.</div>
      <div className="grid-sm" style={{ margin: "10px 0" }}>
        {ANIMAUX.map((x) => <button key={x.id} className={`btn ${aid === x.id ? "primary" : ""}`} onClick={() => setAid(x.id)} style={{ justifyContent: "flex-start" }}><Vignette id={x.id} emoji={x.emoji} taille={26} /> {x.nom.split(" (")[0]}</button>)}
      </div>
      {n && a && (
        <div className="card">
          <div className="row between"><h2 style={{ margin: 0 }}>{a.emoji} {a.nom}</h2><Listen id={"nut-" + a.id} title={`Nourrir : ${a.nom}`} blocks={[`Eau : ${n.eau}`, `Ration de base : ${n.base}`, `Besoins essentiels : ${n.besoins.join(". ")}`, `Minéraux : ${n.mineraux}`, `Signes de manque : ${n.manque}`, n.astuce]} /></div>
          <ul className="ticks">
            <li><b>💧 Eau :</b> {n.eau}</li>
            <li><b>🍽️ Ration de base :</b> {n.base}</li>
            <li><b>⭐ Besoins essentiels :</b> {n.besoins.join(" ; ")}.</li>
            <li><b>🧂 Minéraux :</b> {n.mineraux}</li>
            <li><b>👀 Signes d'un manque :</b> {n.manque}</li>
          </ul>
          <div className="callout warn small"><b>Bon à savoir</b>{n.astuce}</div>
          <p className="small">🌿 Selon les principes bio : aliment certifié AB, sans additif médicamenteux, parcours en plein air. <a href={href("/guide/elevage-bio")}>Élever selon les principes bio →</a></p>
          <div className="grid">
            <div><b>✅ Ce que le jardin peut leur donner</b><ul className="ticks small">{a.jardinOK.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><b>⛔ Interdit ou dangereux</b><ul className="ticks small">{a.interdits.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <p className="small"><a href={href(`/animal/${a.id}`)}>Fiche complète →</a> · <a href={href("/guide/cultiver-pour-animaux")}>Cultiver pour les nourrir →</a> · <a href={href(`/diagnostic-animal?animal=${a.id}`)}>Il ne va pas bien →</a></p>
        </div>
      )}
      {!aid && <p className="muted small">Choisissez un animal pour voir ses besoins.</p>}
    </div>
  );
}
