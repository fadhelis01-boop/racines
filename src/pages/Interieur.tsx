import { useState } from "react";
import { PLANTES, PROBLEMES, GUIDES, plante } from "../data/index";
import { AROMATES_INT, FENETRES, MULTIPLICATION, SUBSTRATS, SAISONS_INT, KIT, USAGES_LAMPE, type Fenetre } from "../data/interieur-hub";
import { useRoute, href, go } from "../lib/router";
import { Listen, Tile, A } from "../components/ui";
import { Vignette, srcVignette } from "../components/Ico";

const ONGLETS: [string, string, string][] = [
  ["choisir", "🔎", "Quelle plante pour chez moi ?"],
  ["aromates", "🌿", "Aromates en intérieur"],
  ["lampe", "💡", "Lampe de culture"],
  ["entretien", "🗓️", "Entretien et saisons"],
  ["multiplier", "✂️", "Bouturer, diviser"],
  ["soigner", "🩺", "Problèmes"],
  ["tutos", "📘", "Tous les tutoriels"],
];
// Aromates qui demandent du soleil direct quand on n'a pas de lampe
const SOLEIL = new Set(["basilic", "thym", "romarin", "origan", "sauge", "aneth", "estragon", "verveine", "Citronnelle (lemongrass)"]);
const OMBRE_OK = new Set(["cerfeuil", "Micro-pousses (radis, moutarde, roquette, pois, tournesol)", "Oignons verts et poireaux en repousse", "menthe", "melisse", "laurier"]);
const cle = (a: { id?: string; nom: string }) => a.id ?? a.nom;

export default function Interieur() {
  const route = useRoute();
  const onglet = route.query.get("t") ?? "choisir";
  const aller = (t: string) => go(`/interieur?t=${t}`);
  return (
    <div>
      <h1>🌿 Plantes d'intérieur et aromates</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Tout pour réussir dans la maison, avec ou sans lampe de culture : choisir selon sa lumière, cultiver ses herbes toute l'année, arroser, rempoter, multiplier, soigner.</p>
      <div className="grid-sm" role="tablist" aria-label="Rubriques de l'intérieur" style={{ marginBottom: 14 }}>
        {ONGLETS.map(([k, e, l]) => (
          <button key={k} role="tab" aria-selected={onglet === k} className={`btn ${onglet === k ? "primary" : ""}`} onClick={() => aller(k)} style={{ justifyContent: "flex-start", textAlign: "left" }}>{e} {l}</button>
        ))}
      </div>
      <div className="row small" style={{ gap: 8, marginBottom: 6 }}>
        <A to="/jardin" className="chip">🌿 Mes plantes : rappels d'arrosage</A>
        <A to="/identifier" className="chip">📷 Identifier une plante</A>
        <A to="/diagnostic?interieur=1" className="chip">🔎 Ma plante ne va pas bien</A>
      </div>
      {onglet === "choisir" && <Choisir />}
      {onglet === "aromates" && <Aromates />}
      {onglet === "lampe" && <Lampe />}
      {onglet === "entretien" && <Entretien />}
      {onglet === "multiplier" && <Multiplier />}
      {onglet === "soigner" && <Soigner />}
      {onglet === "tutos" && <Tutos />}
    </div>
  );
}

function Choisir() {
  const [fen, setFen] = useState<Fenetre>("est");
  const [lampe, setLampe] = useState(false);
  const [chat, setChat] = useState(false);
  const [facile, setFacile] = useState(false);
  const [fleurs, setFleurs] = useState(false);
  const f = FENETRES.find((x) => x.id === fen)!;
  const expo = lampe ? ["soleil", "mi-ombre", "ombre"] : f.expo;
  const plantes = PLANTES.filter((p) => p.categorie === "interieur" && p.expo.some((e) => expo.includes(e)) && (!chat || p.sansDangerAnimaux) && (!facile || p.difficulte === 1) && (!fleurs || p.fleurit))
    .sort((a, b) => a.difficulte - b.difficulte || a.nom.localeCompare(b.nom, "fr"));
  const aromates = AROMATES_INT.filter((a) => lampe || (fen === "sud" || fen === "ouest" ? true : fen === "est" ? !SOLEIL.has(cle(a)) : fen === "aucune" ? false : OMBRE_OK.has(cle(a))));
  return (
    <div>
      <div className="card stack">
        <b>1. Où sera la plante ?</b>
        <div className="chips">{FENETRES.map((x) => <button key={x.id} className={`chip ${fen === x.id ? "on" : ""}`} onClick={() => setFen(x.id)}>{x.label}</button>)}</div>
        <p className="small muted" style={{ margin: 0 }}>{f.detail} Pas sûr ? Faites le <a href={href("/guide/lumiere-led")}>test de l'ombre de la main</a>.</p>
        <b>2. Vos conditions</b>
        <label className="row"><input type="checkbox" checked={lampe} onChange={(e) => setLampe(e.target.checked)} /> 💡 J'ai (ou je veux) une lampe de culture</label>
        <label className="row"><input type="checkbox" checked={chat} onChange={(e) => setChat(e.target.checked)} /> 🐱 J'ai un chat, un chien ou un jeune enfant (plantes sans danger)</label>
        <label className="row"><input type="checkbox" checked={facile} onChange={(e) => setFacile(e.target.checked)} /> 🌱 Très facile, j'oublie d'arroser</label>
        <label className="row"><input type="checkbox" checked={fleurs} onChange={(e) => setFleurs(e.target.checked)} /> 🌸 Je veux des fleurs</label>
      </div>
      {fen === "aucune" && !lampe ? (
        <div className="callout warn"><b>Sans fenêtre, il faut une lampe</b>Même les plantes « d'ombre » meurent dans le noir. Cochez la lampe pour voir ce qui est possible, ou choisissez des plantes artificielles et des plantes stabilisées.</div>
      ) : (
        <>
          <h2>🌿 {plantes.length} plante{plantes.length > 1 ? "s" : ""} d'intérieur adaptée{plantes.length > 1 ? "s" : ""}</h2>
          <div className="grid">{plantes.map((p) => <Tile key={p.id} to={`/plante/${p.id}`} id={p.id} emoji={p.emoji} title={p.nom} sub={p.tailleAdulte ?? p.lumiere?.split(".")[0]} badge={<>{["", <span key="1" className="badge green">Facile</span>, <span key="2" className="badge sun">Moyenne</span>, <span key="3" className="badge terra">Exigeante</span>][p.difficulte]}{p.sansDangerAnimaux && <span className="badge green">🐱 OK</span>}</>} />)}</div>
          {!plantes.length && <p className="muted">Aucune plante ne réunit tous ces critères : décochez-en un ou ajoutez une lampe.</p>}
          <h2>🌿 Aromates possibles {lampe ? "sous lampe" : "à cette fenêtre"}</h2>
          <div className="chips">{aromates.map((a) => <a key={cle(a)} className="chip" href={href("/interieur?t=aromates&a=" + encodeURIComponent(cle(a)))}>{a.id ? <Vignette id={a.id} emoji={a.emoji} taille={20} /> : a.emoji} {a.nom}</a>)}</div>
          {!aromates.length && <p className="muted small">Sans lampe, aucun aromate ne vit à cet emplacement.</p>}
          {!lampe && fen !== "sud" && fen !== "ouest" && <p className="small">Basilic, thym, romarin réclament une fenêtre sud ou ouest, ou une <a href={href("/interieur?t=lampe")}>lampe</a>.</p>}
        </>
      )}
      <p className="small"><a href={href("/guide/plantes-par-piece")}>Quelle plante pour quelle pièce (salle de bain, chambre, bureau) →</a> · <a href={href("/guide/choisir-plante")}>Choisir une plante saine en magasin →</a></p>
    </div>
  );
}

function Aromates() {
  const cible = useRoute().query.get("a") ?? "";
  const [lampe, setLampe] = useState<"sans" | "avec">("sans");
  return (
    <div>
      <div className="callout info"><b>Les 3 règles des aromates en intérieur</b>1. La lumière décide de tout : sans lampe, comptez sur une fenêtre sud ou ouest et sur la belle saison. 2. Le pot du supermarché est un semis serré destiné à être mangé vite : divisez-le en plusieurs touffes. 3. On récolte en coupant les tiges, ce qui fait ramifier la plante.</div>
      <div className="chips" style={{ margin: "10px 0" }}>
        <button className={`chip ${lampe === "sans" ? "on" : ""}`} onClick={() => setLampe("sans")}>🪟 Sans lampe (fenêtre)</button>
        <button className={`chip ${lampe === "avec" ? "on" : ""}`} onClick={() => setLampe("avec")}>💡 Avec lampe de culture</button>
      </div>
      {AROMATES_INT.map((a) => {
        const k = cle(a);
        return (
          <details key={k} className="box" id={k} open={cible === k}>
            <summary className="row" style={{ gap: 8, display: "flex" }}>
              {a.id ? <Vignette id={a.id} emoji={a.emoji} taille={34} /> : <span style={{ fontSize: 26 }}>{a.emoji}</span>}
              <span style={{ flex: 1 }}>{a.nom} <span className={`badge ${["", "green", "sun", "terra"][a.facile]}`}>{["", "Facile", "Moyen", "Délicat"][a.facile]}</span><br /><span className="small muted" style={{ fontWeight: 400 }}>{lampe === "sans" ? a.sansLampe : a.avecLampe}</span></span>
            </summary>
            <ul className="ticks small">
              <li><b>{lampe === "sans" ? "🪟 Sans lampe" : "💡 Avec lampe"} :</b> {lampe === "sans" ? a.sansLampe : a.avecLampe}</li>
              <li><b>Démarrer :</b> {a.demarrer}</li>
              <li><b>Arroser :</b> {a.arroser}</li>
              <li><b>Récolter :</b> {a.recolter}</li>
              <li><b>Durée de vie :</b> {a.duree}</li>
              <li><b>⚠️ Piège :</b> {a.piege}</li>
            </ul>
            <div className="row small" style={{ gap: 6 }}>
              {a.id && <a className="chip" href={href(`/plante/${a.id}`)}>Fiche complète</a>}
              <Listen id={"aro-" + k} title={a.nom} blocks={[a.nom, `Sans lampe : ${a.sansLampe}`, `Avec lampe : ${a.avecLampe}`, `Démarrer : ${a.demarrer}`, `Arroser : ${a.arroser}`, `Récolter : ${a.recolter}`, `Durée : ${a.duree}`, `Piège : ${a.piege}`]} label="Écouter" />
            </div>
          </details>
        );
      })}
      {srcVignette("couper-aromatiques") && <img src={srcVignette("couper-aromatiques")} alt="Couper le basilic au-dessus d'une paire de feuilles" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10, marginTop: 10 }} />}
      <p className="small"><a href={href("/cueillette?g=couper-aromatiques")}>Le geste de récolte illustré →</a> · <a href={href("/guide/herbes-interieur")}>Tutoriel aromates et micro-pousses →</a> · <a href={href("/guide/potager-interieur")}>Un potager d'intérieur complet →</a> · <a href={href("/guide/hydroponie")}>Sans terre (hydroponie) →</a></p>
    </div>
  );
}

function Lampe() {
  const [l, setL] = useState(60), [p, setP] = useState(30), [usage, setUsage] = useState("aromates"), [prix, setPrix] = useState(0.25);
  const u = USAGES_LAMPE.find((x) => x.id === usage)!;
  const m2 = (l * p) / 10000;
  const w = Math.max(6, Math.round(u.wm2 * m2));
  const kwh = (w * u.heures * 30) / 1000;
  return (
    <div>
      <div className="card stack">
        <b>Calculer ma lampe</b>
        <div className="grid-sm">
          <label className="field">Longueur de l'étagère (cm)<input type="number" value={l} min={10} max={300} onChange={(e) => setL(Number(e.target.value) || 0)} /></label>
          <label className="field">Profondeur (cm)<input type="number" value={p} min={10} max={150} onChange={(e) => setP(Number(e.target.value) || 0)} /></label>
          <label className="field">Prix du kWh (€)<input type="number" value={prix} step={0.01} min={0} max={2} onChange={(e) => setPrix(Number(e.target.value) || 0)} /></label>
        </div>
        <label className="field">Pour quoi faire ?<select value={usage} onChange={(e) => setUsage(e.target.value)}>{USAGES_LAMPE.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
        <ul className="ticks">
          <li><b>Puissance réelle :</b> environ {w} W (consommés à la prise, pas l'« équivalent » écrit en gros sur l'emballage).</li>
          <li><b>Hauteur :</b> {u.distance} au-dessus des feuilles.</li>
          <li><b>Durée :</b> {u.heures} h par jour, avec une prise programmable ; toujours une nuit noire.</li>
          <li><b>Consommation :</b> {kwh.toFixed(1)} kWh par mois, soit environ {(kwh * prix).toFixed(2)} € par mois.</li>
        </ul>
      </div>
      <h2>Bien choisir</h2>
      <ul className="ticks">
        <li><b>Lumière blanche « spectre complet »</b> : aussi efficace que les lampes violettes, et vivable dans un salon.</li>
        <li><b>Barre ou réglette LED</b> pour une étagère ; <b>ampoule horticole E27</b> dans une lampe articulée pour 1 ou 2 pots ; <b>panneau</b> au-delà de 60 × 60 cm ou pour des tomates.</li>
        <li>Une ampoule LED ordinaire de 15 W à 20 cm aide une plante verte, mais ne suffit pas pour des aromates de soleil.</li>
        <li>Signes de réglage : tiges longues et pâles = trop loin ou trop peu d'heures ; feuilles décolorées ou brûlées en haut = trop près.</li>
        <li>Lampe à plus de 30 cm d'un rideau, pas de multiprise surchargée, étagère stable : sécurité d'abord.</li>
      </ul>
      <h2>Sans lampe : tirer le meilleur de la fenêtre</h2>
      <ul className="ticks">
        <li>Plantes au plus près de la vitre (la lumière baisse de moitié à 1 m), vitres et feuilles propres.</li>
        <li>Miroir ou mur blanc derrière les pots pour renvoyer la lumière.</li>
        <li>Tournez les pots d'un quart de tour par semaine.</li>
        <li>L'hiver, attendez-vous à une pause : arrosez moins, pas d'engrais, et réservez les aromates de soleil à la belle saison.</li>
      </ul>
      {srcVignette("lumiere-led") && <img src={srcVignette("lumiere-led")} alt="Étagère de plantes sous lampe" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10 }} />}
      <p className="small"><a href={href("/guide/lumiere-led")}>Tutoriel complet sur la lumière →</a></p>
    </div>
  );
}

function Entretien() {
  return (
    <div>
      <h2>🗓️ L'année d'une plante d'intérieur</h2>
      <div className="grid">{SAISONS_INT.map((s) => <div key={s.saison} className="card"><b>{s.e} {s.saison}</b><ul className="ticks small">{s.taches.map((t) => <li key={t}>{t}</li>)}</ul></div>)}</div>
      <h2>💧 Arroser juste</h2>
      <ul className="ticks">
        <li><b>Le test du doigt</b> : enfoncez-le de 2 à 3 cm ; sec = on arrose (cactus : sec sur toute la hauteur ; fougères : dès que le dessus sèche).</li>
        <li><b>Arroser à fond puis vider</b> : l'eau doit ressortir par le trou, on vide la soucoupe ou le cache-pot après 15 minutes.</li>
        <li><b>Par le bas</b> pour les plantes à feuilles velues ou en rosette (violette africaine, cyclamen) : 20 minutes dans une soucoupe d'eau.</li>
        <li><b>L'eau</b> : du robinet reposée une nuit convient à la plupart ; eau de pluie pour calathea, orchidées, carnivores. <a href={href("/guide/eau-arrosage-interieur")}>Quelle eau ?</a></li>
        <li>Les rappels personnalisés sont dans <a href={href("/jardin")}>Mes plantes</a> (rythme été/hiver par plante).</li>
      </ul>
      <h2>🪨 Le bon mélange de terre</h2>
      <div className="card" style={{ overflowX: "auto" }}><table className="table small"><thead><tr><th>Plantes</th><th>Mélange</th></tr></thead><tbody>{SUBSTRATS.map((s) => <tr key={s.pour}><td>{s.pour}</td><td>{s.melange}</td></tr>)}</tbody></table></div>
      <p className="small"><a href={href("/guide/rempoter")}>Rempoter pas à pas →</a></p>
      <h2>🌫️ Humidité, engrais, propreté</h2>
      <ul className="ticks">
        <li>Humidité : regroupez les plantes, posez-les sur un plateau de billes d'argile mouillées ; le brumisateur seul ne sert presque à rien.</li>
        <li>Engrais : liquide, à demi-dose, du printemps à fin août seulement ; jamais sur une terre sèche ni sur une plante qui vient d'être rempotée.</li>
        <li>Dépoussiérez les feuilles à l'éponge humide tous les mois (la poussière coupe la lumière) ; pas de lustrant.</li>
      </ul>
      <h2>🧰 Le matériel utile</h2>
      <div className="card" style={{ overflowX: "auto" }}><table className="table small"><tbody>{KIT.map((k) => <tr key={k.objet}><td><b>{k.objet}</b></td><td>{k.pourquoi}</td></tr>)}</tbody></table></div>
      <p className="small"><a href={href("/guide/plantes-interieur-bases")}>Les 5 règles d'or →</a> · <a href={href("/guide/vacances-plantes-interieur")}>Partir en vacances →</a> · <a href={href("/guide/plantes-toxiques")}>Plantes et animaux de compagnie →</a></p>
    </div>
  );
}

function Multiplier() {
  const lignes = Object.entries(MULTIPLICATION).map(([id, m]) => ({ p: plante(id), m })).filter((x) => x.p).sort((a, b) => a.p!.nom.localeCompare(b.p!.nom, "fr"));
  return (
    <div>
      <div className="callout info"><b>Quand et comment ?</b>Au printemps ou au début de l'été, avec un outil propre. Bouture de tige : coupez juste sous un nœud (là où sort la feuille), retirez les feuilles du bas, mettez dans l'eau ou un terreau léger humide, à la lumière sans soleil direct. Rempotez quand les racines font 3 à 5 cm. Succulentes et cactus : laissez sécher la coupe avant de planter.</div>
      {srcVignette("bouturage") && <img src={srcVignette("bouturage")} alt="Boutures qui s'enracinent dans des bocaux d'eau" style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 10, margin: "8px 0" }} />}
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table small"><thead><tr><th>Plante</th><th>Comment la multiplier</th></tr></thead>
          <tbody>{lignes.map(({ p, m }) => <tr key={p!.id}><td><a href={href(`/plante/${p!.id}`)} className="row" style={{ gap: 6, flexWrap: "nowrap" }}><Vignette id={p!.id} emoji={p!.emoji} taille={26} /> {p!.nom}</a></td><td>{m}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="small"><a href={href("/guide/bouturage")}>Tutoriel bouturage →</a></p>
    </div>
  );
}

function Soigner() {
  const pbs = PROBLEMES.filter((p) => p.interieur).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return (
    <div>
      <a className="btn big primary" href={href("/diagnostic?interieur=1")}>🔎 Diagnostic guidé : ma plante ne va pas bien</a>
      <div className="callout warn small" style={{ marginTop: 10 }}><b>Dans 8 cas sur 10</b>c'est l'arrosage (trop, surtout l'hiver) ou la lumière (trop peu). Vérifiez la terre au doigt et la place de la plante avant de chercher un parasite.</div>
      <h2>Problèmes fréquents en intérieur ({pbs.length})</h2>
      <div className="grid">{pbs.map((p) => <Tile key={p.id} to={`/probleme/${p.id}`} id={p.id} emoji="🩺" title={p.nom} sub={p.symptomes[0]?.slice(0, 80)} />)}</div>
    </div>
  );
}

function Tutos() {
  const ids = new Set(["plantes-interieur-bases", "choisir-plante", "plantes-par-piece", "lumiere-led", "eau-arrosage-interieur", "rempoter", "bouturage", "vacances-plantes-interieur", "herbes-interieur", "potager-interieur", "repousses-cuisine", "hydroponie", "champignons-maison", "terrarium", "lombricompost", "bokashi", "plantes-toxiques"]);
  const gs = GUIDES.filter((g) => ids.has(g.id) || g.rubrique === "interieur");
  return <div className="grid">{gs.map((g) => <Tile key={g.id} to={`/guide/${g.id}`} id={g.id} emoji={g.emoji} title={g.titre} sub={g.resume.slice(0, 90) + "…"} />)}</div>;
}
