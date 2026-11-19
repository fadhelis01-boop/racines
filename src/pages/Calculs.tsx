import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { href, useRoute, go } from "../lib/router";
import { Back, Listen, Titre } from "../components/ui";
import { Vignette } from "../components/Ico";
import { COUVAISON, datesCouvee, GESTATION, datesMiseBas, RATIONS, foinHiver } from "../lib/elevage";
import { besoinEau, dimensionner } from "../lib/arrosage";
import { PLANTES, plante } from "../data/index";
import { MOIS_NOMS } from "../data/util";

// Calculs pratiques : quantités indicatives, arrondies, pour un jardin familial
const Champ = ({ label, value, onChange, min = 0, max = 10000, step = 1, unite }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; unite?: string }) => (
  <label className="field">{label}
    <span className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
      <input type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} style={{ maxWidth: 140 }} />
      {unite && <span className="small muted">{unite}</span>}
    </span>
  </label>
);
const r = (n: number, d = 0) => { const k = 10 ** d; return (Math.round(n * k) / k).toLocaleString("fr-FR"); };

// Quantités par personne et par an pour une famille qui veut couvrir l'essentiel de la saison
const FAMILLE: { id: string; nom: string; emoji: string; parPers: number; unite: string; m2: number; note: string }[] = [
  { id: "tomate", nom: "Tomates", emoji: "🍅", parPers: 3, unite: "pieds", m2: 0.5, note: "≈ 4 à 6 kg par pied ; doublez pour faire des conserves" },
  { id: "courgette", nom: "Courgettes", emoji: "🥒", parPers: 0.75, unite: "pieds", m2: 1, note: "2 pieds suffisent pour 4 ; 1 pied ≈ 8 à 15 kg" },
  { id: "haricot", nom: "Haricots verts", emoji: "🌱", parPers: 2, unite: "m²", m2: 1, note: "en 2 ou 3 semis échelonnés" },
  { id: "laitue", nom: "Salades", emoji: "🥬", parPers: 15, unite: "pieds par an", m2: 0.05, note: "semez 6 à 10 pieds toutes les 3 semaines" },
  { id: "carotte", nom: "Carottes", emoji: "🥕", parPers: 1.5, unite: "m²", m2: 1, note: "≈ 4 kg/m²" },
  { id: "pomme-de-terre", nom: "Pommes de terre", emoji: "🥔", parPers: 10, unite: "m²", m2: 1, note: "≈ 3 kg/m² ; 10 m² ≈ 30 kg" },
  { id: "poireau", nom: "Poireaux", emoji: "🌱", parPers: 25, unite: "pieds", m2: 0.04, note: "pour l'hiver" },
  { id: "oignon", nom: "Oignons", emoji: "🌱", parPers: 1.5, unite: "m²", m2: 1, note: "≈ 3 kg/m², se conservent tout l'hiver" },
  { id: "ail", nom: "Ail", emoji: "🌱", parPers: 0.5, unite: "m²", m2: 1, note: "≈ 25 têtes/m²" },
  { id: "courge", nom: "Courges", emoji: "🎃", parPers: 0.5, unite: "pieds", m2: 2, note: "chaque pied donne 3 à 8 courges qui se gardent l'hiver" },
  { id: "chou", nom: "Choux", emoji: "🥬", parPers: 4, unite: "pieds", m2: 0.25, note: "mélangez choux d'été, d'automne et d'hiver" },
  { id: "fraisier", nom: "Fraisiers", emoji: "🍓", parPers: 8, unite: "pieds", m2: 0.1, note: "à renouveler tous les 3 ans" },
  { id: "radis", nom: "Radis", emoji: "🌶️", parPers: 0.5, unite: "m² par semis", m2: 0.5, note: "semez un rang toutes les 2 semaines" },
];

// Trois onglets au lieu d'une page de 11 écrans ; les anciens liens « ?s=section » ouvrent le bon onglet
type OngletCalcul = "jardin" | "eau" | "animaux";
const ONGLETS_CALCULS: [OngletCalcul, string][] = [["jardin", "🌱 Jardin"], ["eau", "💧 Eau"], ["animaux", "🐔 Animaux"]];
const SECTIONS_CALCULS: [string, string, OngletCalcul][] = [
  ["compost", "♻️ Compost et fumier", "jardin"], ["bacs", "🌿 Terreau des bacs", "jardin"], ["famille", "👪 Nourrir la famille", "jardin"],
  ["eau", "🌧️ Eau de pluie", "eau"], ["arrosage", "💧 Combien arroser", "eau"], ["goutte", "🚿 Goutte-à-goutte", "eau"],
  ["eclosion", "🐣 Éclosion", "animaux"], ["misebas", "🐐 Mise bas", "animaux"], ["rations", "🌾 Rations et foin", "animaux"], ["animaux", "🐔 Combien de poules ?", "animaux"],
];

export default function Calculs() {
  const zone = useStore((s) => s.settings.situation);
  const jardin = zone === "jardin" || zone === "petit-jardin";
  // compost et fumier
  const [surface, setSurface] = useState(jardin ? 30 : 4);
  // bacs
  const [lon, setLon] = useState(100), [lar, setLar] = useState(40), [hau, setHau] = useState(30), [nbBacs, setNbBacs] = useState(1);
  // famille
  const [pers, setPers] = useState(4);
  // eau
  const [toit, setToit] = useState(40), [pluie, setPluie] = useState(60);
  const climat = useStore((s) => s.settings.zone);
  const [ap, setAp] = useState("tomate"), [moisA, setMoisA] = useState(7), [paille, setPaille] = useState(true), [pluieSem, setPluieSem] = useState(0);
  const [robinet, setRobinet] = useState(12), [goutteur, setGoutteur] = useState(2), [espG, setEspG] = useState(30), [longueur, setLongueur] = useState(40), [largeur, setLargeur] = useState(0.6), [nbLignes, setNbLignes] = useState(4), [freq, setFreq] = useState(3);
  const pA = plante(ap);
  const be = besoinEau(climat, moisA, pA?.eau ?? "moyen", { paillage: paille, pluieMm: pluieSem });
  const dim = dimensionner({ debitRobinetLmin: robinet, debitGoutteurLh: goutteur, espacementCm: espG, longueurM: longueur, largeurM: largeur, besoinL: be.litresM2Semaine, arrosagesSemaine: freq, nbLignes });
  // animaux
  const [oeufs, setOeufs] = useState(12), [prixAliment, setPrixAliment] = useState(0.6);
  const { query } = useRoute();
  const section = query.get("s");
  const onglet = (query.get("t") as OngletCalcul | null) ?? SECTIONS_CALCULS.find((x) => x[0] === section)?.[2] ?? "jardin";
  useEffect(() => { if (section) setTimeout(() => document.getElementById(section)?.scrollIntoView({ block: "start" }), 100); }, [section]);

  const litresBac = (lon * lar * hau) / 1000;
  const totalLitres = litresBac * nbBacs;
  const poules = Math.max(2, Math.ceil(oeufs / 4)); // ≈ 4 œufs par semaine en moyenne sur l'année
  const alimentAn = poules * 0.125 * 365;
  const fientes = poules * 25; // kg de fumier frais par poule et par an (≈)
  const surfaceTotale = FAMILLE.reduce((s, l) => s + (l.unite.startsWith("m²") ? l.parPers * pers : l.parPers * pers * l.m2), 0);

  return (
    <div>
      <Back />
      <Titre ico="creer" emoji="🧮">Calculs pratiques</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>Des ordres de grandeur pour acheter juste et prévoir : compost, terreau, quantités à planter pour la famille, eau de pluie, poules. Les chiffres réels varient avec le sol, le climat et les variétés.</p>
      <div className="chips" role="tablist" style={{ margin: "8px 0 4px" }}>
        {ONGLETS_CALCULS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/calculs?t=${k}`)}>{l}</button>)}
      </div>
      <div className="chips small" style={{ margin: "4px 0 8px" }}>
        {SECTIONS_CALCULS.filter((x) => x[2] === onglet).map(([id, l]) => <a key={id} className="chip" href={href(`/calculs?s=${id}`)} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }}>{l}</a>)}
      </div>

      {onglet === "jardin" && <>
      <h2 id="compost">♻️ Compost et fumier pour ma surface</h2>
      <div className="card stack">
        <Champ label="Surface cultivée" value={surface} onChange={setSurface} max={5000} unite="m²" />
        <ul className="ticks small">
          <li><b>Compost mûr, entretien annuel :</b> {r(surface * 2)} à {r(surface * 3)} kg (2 à 3 kg/m²), soit environ {r((surface * 2.5) / 30)} brouettes de 60 L.</li>
          <li><b>Légumes gourmands</b> (tomates, courges, choux, poireaux) : jusqu'à {r(surface * 5)} kg si toute la surface en reçoit (5 kg/m²).</li>
          <li><b>Fumier composté</b> (vache, cheval) : {r(surface * 3)} à {r(surface * 5)} kg à l'automne. <b>Fientes de poules</b> : bien plus riches, {r(surface * 0.5)} à {r(surface * 1)} kg seulement, toujours compostées.</li>
          <li><b>Paillage</b> sur 5 à 10 cm : environ {r(surface * 0.075, 1)} m³ de paille, feuilles ou tonte séchée.</li>
          <li><b>Compost produit par une famille</b> de 4 (épluchures + jardin) : 200 à 400 kg par an, de quoi entretenir 100 à 150 m².</li>
        </ul>
        <p className="small"><a href={href("/guide/compost-tas")}>Faire un bon compost →</a> · <a href={href("/guide/fumiers")}>Les fumiers comparés →</a></p>
      </div>

      <h2 id="bacs">🌿 Terreau pour mes bacs et jardinières</h2>
      <div className="card stack">
        <div className="grid-sm">
          <Champ label="Longueur" value={lon} onChange={setLon} unite="cm" />
          <Champ label="Largeur" value={lar} onChange={setLar} unite="cm" />
          <Champ label="Hauteur de terre" value={hau} onChange={setHau} unite="cm" />
          <Champ label="Nombre de bacs" value={nbBacs} onChange={setNbBacs} min={1} max={100} />
        </div>
        <ul className="ticks small">
          <li><b>Volume :</b> {r(litresBac)} L par bac, {r(totalLitres)} L au total, soit {Math.ceil(totalLitres / 40)} sacs de 40 L (ou {Math.ceil(totalLitres / 50)} de 50 L), en comptant un léger tassement : prévoyez 10 % de plus.</li>
          <li><b>Poids une fois arrosé :</b> environ {r(totalLitres * 1.1)} kg. {totalLitres * 1.1 > 250 && !jardin ? "Sur un balcon, placez ces bacs contre le mur porteur et vérifiez la charge admise." : ""}</li>
          <li><b>Mélange conseillé pour légumes :</b> 2/3 terreau ou terre de jardin + 1/3 compost mûr ; une couche de 3 à 5 cm de billes d'argile au fond seulement si le pot n'est pas percé assez.</li>
          <li><b>Profondeur minimale :</b> 15 cm pour salades et aromatiques, 25 cm pour fraises et radis, 30 à 40 cm pour tomates, courgettes et carottes.</li>
        </ul>
        {!jardin && <p className="small"><a href={href("/guide/balcon-voisinage")}>Balcon : poids, eau qui coule, copropriété →</a></p>}
      </div>

      <h2 id="famille">👪 Combien planter pour ma famille ?</h2>
      <div className="card stack">
        <Champ label="Nombre de personnes" value={pers} onChange={setPers} min={1} max={20} />
        <div style={{ overflowX: "auto" }}>
          <table className="table small" style={{ minWidth: 480 }}>
            <thead><tr><th>Légume</th><th>Quantité</th><th>Remarque</th></tr></thead>
            <tbody>
              {FAMILLE.map((l) => (
                <tr key={l.id}>
                  <td><a href={href(`/plante/${l.id}`)} className="row" style={{ gap: 6, flexWrap: "nowrap" }}><Vignette id={l.id} emoji={l.emoji} taille={24} /> {l.nom}</a></td>
                  <td style={{ whiteSpace: "nowrap" }}><b>{r(Math.max(l.unite.startsWith("m²") ? 0.5 : 1, l.parPers * pers), l.unite.startsWith("m²") ? 1 : 0)}</b> {l.unite}</td>
                  <td>{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small"><b>Surface cultivée nécessaire :</b> environ {r(surfaceTotale)} m², plus 30 à 50 % pour les allées, soit {r(surfaceTotale * 1.4)} m². Un potager de 50 m² bien mené couvre une grande partie des légumes d'été d'une famille de 4 ; l'autonomie toute l'année demande 100 à 200 m².</p>
      </div>

      </>}
      {onglet === "eau" && <>
      <h2 id="eau">🌧️ Eau de pluie récupérable</h2>
      <div className="card stack">
        <div className="grid-sm">
          <Champ label="Surface de toit raccordée (au sol)" value={toit} onChange={setToit} max={2000} unite="m²" />
          <Champ label="Pluie d'un mois type" value={pluie} onChange={setPluie} max={400} unite="mm" />
        </div>
        <ul className="ticks small">
          <li><b>Récupérable ce mois-ci :</b> environ {r(toit * pluie * 0.8)} L (1 mm de pluie sur 1 m² = 1 L, moins 20 % de pertes).</li>
          <li><b>Une forte pluie de 10 mm</b> remplit déjà {r(toit * 10 * 0.8)} L : une cuve de {toit * 10 * 0.8 > 500 ? "1 000 L ou plus" : "300 à 500 L"} se justifie.</li>
          <li><b>Besoin d'un potager en été :</b> de 10 à 30 L par m² et par semaine selon le climat et la culture (voir le calcul ci-dessous), environ 30 % de moins avec un paillage.</li>
        </ul>
        <p className="small"><a href={href("/guide/recuperateur-pluie")}>Installer un récupérateur →</a></p>
      </div>

      <h2 id="arrosage">💧 Combien arroser ?</h2>
      <div className="card stack">
        <div className="grid-sm">
          <label className="field">Culture<select value={ap} onChange={(e) => setAp(e.target.value)}>{PLANTES.filter((p) => ["legume", "fruit", "arbre", "aromatique", "fleur", "ornement"].includes(p.categorie)).sort((a, b) => a.nom.localeCompare(b.nom)).map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}</select></label>
          <label className="field">Mois<select value={moisA} onChange={(e) => setMoisA(Number(e.target.value))}>{MOIS_NOMS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></label>
          <Champ label="Pluie tombée cette semaine" value={pluieSem} onChange={setPluieSem} max={200} unite="mm" />
          <label className="field"><span><input type="checkbox" checked={paille} onChange={(e) => setPaille(e.target.checked)} /> Sol paillé</span></label>
        </div>
        <p><b>{pA?.nom}</b> en {MOIS_NOMS[moisA - 1]} : environ <b>{be.litresM2Semaine} L par m² et par semaine</b>{be.litresM2Semaine ? `, soit ${r(be.litresM2Semaine / 2)} L par m² deux fois par semaine` : " : pas d'arrosage nécessaire"}.</p>
        <p className="small muted">Calcul : évaporation moyenne du mois dans votre climat ({r(be.etp, 1)} mm par jour) × besoin de la plante ({be.kc}) × 7 jours{paille ? ", moins 30 % grâce au paillage" : ""}, moins 80 % de la pluie de la semaine. 1 mm = 1 L par m². Les jeunes plants et les plantes en pot demandent des arrosages plus fréquents ; vérifiez toujours au doigt ou au tensiomètre.</p>
      </div>

      <h2 id="goutte">🚿 Dimensionner un goutte-à-goutte</h2>
      <div className="card stack">
        <div className="grid-sm">
          <Champ label="Débit du robinet (test du seau)" value={robinet} onChange={setRobinet} min={1} max={100} step={0.5} unite="L/min" />
          <Champ label="Débit d'un goutteur" value={goutteur} onChange={setGoutteur} min={0.5} max={8} step={0.5} unite="L/h" />
          <Champ label="Espacement des goutteurs" value={espG} onChange={setEspG} min={10} max={100} unite="cm" />
          <Champ label="Longueur totale de tuyau" value={longueur} onChange={setLongueur} min={1} max={2000} unite="m" />
          <Champ label="Nombre de lignes" value={nbLignes} onChange={setNbLignes} min={1} max={100} />
          <Champ label="Largeur arrosée par ligne" value={largeur} onChange={setLargeur} min={0.2} max={2} step={0.1} unite="m" />
          <Champ label="Arrosages par semaine" value={freq} onChange={setFreq} min={1} max={7} />
        </div>
        <ul className="ticks small">
          <li><b>{dim.goutteurs} goutteurs</b>, débit total {r(dim.debitTotalLh)} L/h. Votre robinet en alimente au plus <b>{dim.maxParSecteur}</b> à la fois{dim.secteurs > 1 ? <> : prévoyez <b>{dim.secteurs} secteurs</b> arrosés l'un après l'autre (programmateur multi-voies).</> : " : un seul secteur suffit."}</li>
          <li>Besoin de la surface ({r(longueur * largeur, 1)} m², avec le besoin calculé ci-dessus) : <b>{r(dim.litresSemaine)} L par semaine</b>, soit <b>{dim.minutesParArrosage} minutes</b> par arrosage, {dim.arrosagesSemaine} fois par semaine{dim.secteurs > 1 ? " et par secteur" : ""}.</li>
          {dim.alerteLongueur && <li style={{ color: "var(--danger)" }}>Lignes de plus de 50 m : le débit baisse en bout de ligne. Coupez-les en plusieurs départs ou utilisez des goutteurs autorégulants.</li>}
          <li>Test du seau : chronométrez le remplissage d'un seau de 10 L robinet grand ouvert ; débit = 10 ÷ secondes × 60.</li>
        </ul>
        <p className="small"><a href={href("/guide/arrosage-automatique")}>Installer un arrosage automatique →</a> · <a href={href("/guide/irrigation-raisonnee")}>Irrigation raisonnée →</a></p>
      </div>

      </>}
      {onglet === "animaux" && <>
      <h2 id="eclosion">🐣 Date d'éclosion</h2>
      <Eclosion />

      <h2 id="misebas">🐐 Date de mise bas</h2>
      <MiseBas />

      <h2 id="rations">🌾 Rations et foin pour l'hiver</h2>
      <Rations />

      <h2 id="animaux">🐔 Combien de poules pour ma famille ?</h2>
      <div className="card stack">
        <div className="grid-sm">
          <Champ label="Œufs souhaités par semaine" value={oeufs} onChange={setOeufs} min={1} max={100} />
          <Champ label="Prix de l'aliment pondeuse" value={prixAliment} onChange={setPrixAliment} step={0.05} max={5} unite="€/kg" />
        </div>
        <ul className="ticks small">
          <li><b>Nombre de poules :</b> {poules} (une poule pond en moyenne 4 œufs par semaine sur l'année, davantage au printemps, presque rien en hiver et pendant la mue). Jamais moins de 2 : la poule ne supporte pas la solitude.</li>
          <li><b>Poulailler :</b> au moins {r(Math.max(1, poules / 3), 1)} m² au sol, {poules * 25} cm de perchoir, {Math.ceil(poules / 4)} pondoir(s).</li>
          <li><b>Parcours :</b> {poules * 5} m² minimum, {poules * 10} m² ou plus pour qu'il reste de l'herbe ; une rotation sur deux parcelles est l'idéal.</li>
          <li><b>Aliment :</b> environ {r(alimentAn)} kg par an (≈ 125 g par jour et par poule), soit {r(alimentAn * prixAliment)} € par an, {r((alimentAn * prixAliment) / 12)} € par mois, hors restes de cuisine et parcours.</li>
          <li><b>Fumier produit :</b> environ {r(fientes)} kg de fientes par an, de quoi fertiliser {r(fientes / 0.75)} m² une fois composté.</li>
          <li><b>Un coq ?</b> Inutile pour avoir des œufs ; nécessaire seulement pour des poussins. Pensez au voisinage.</li>
        </ul>
        <p className="small"><a href={href("/animal/poule")}>Fiche poules →</a> · <a href={href("/guide/poulailler")}>Construire le poulailler →</a> · <a href={href("/guide/voisinage-regles")}>Règles et déclaration →</a></p>
        <details className="box"><summary>Et les autres animaux ?</summary>
          <ul className="ticks small">
            <li><b>Lapins de chair :</b> une lapine donne 30 à 40 lapereaux par an (5 à 6 portées), soit 40 à 60 kg de viande ; 1 m² de clapier par adulte au minimum, et beaucoup de foin (80 % de la ration).</li>
            <li><b>Chèvres :</b> toujours au moins deux. 500 à 1 000 m² de parcours avec des haies à brouter et un abri sec ; une chèvre laitière donne 1,5 à 3 L par jour pendant 8 à 10 mois après une mise bas.</li>
            <li><b>Moutons :</b> au moins deux ; environ 1 000 m² d'herbe par brebis (moins avec du foin l'hiver), tonte une fois par an.</li>
            <li><b>Canards :</b> 2 à 3 m² d'abri pour 4, un point d'eau pour se laver la tête ; les canes coureuses pondent 150 à 200 œufs par an et chassent les limaces.</li>
            <li><b>Ânes :</b> jamais seuls, 0,5 à 1 ha pour deux, abri obligatoire, herbe à rationner (fourbure).</li>
          </ul>
        </details>
      </div>
      </>}
      <Listen id="calculs" title="Calculs pratiques" blocks={[`Pour ${surface} mètres carrés : ${r(surface * 2)} à ${r(surface * 3)} kilos de compost par an.`, `Pour ${oeufs} œufs par semaine : ${poules} poules.`, `Pour ${pers} personnes : environ ${r(surfaceTotale * 1.4)} mètres carrés de potager avec les allées.`]} label="Écouter le résumé" />
    </div>
  );
}

function Eclosion() {
  const [esp, setEsp] = useState("poule");
  const [debut, setDebut] = useState(new Date().toISOString().slice(0, 10));
  const d = datesCouvee(esp, debut);
  const P = COUVAISON[esp];
  const fr = (x: string) => new Date(x + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="card stack">
      <div className="grid-sm">
        <label className="field">Espèce<select value={esp} onChange={(e) => setEsp(e.target.value)}>{Object.entries(COUVAISON).map(([k, v]) => <option key={k} value={k}>{v.nom} ({v.jours} jours)</option>)}</select></label>
        <label className="field">Début de la couvaison<input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></label>
      </div>
      <ul className="ticks small">
        <li><b>1er mirage</b> (retirer les œufs clairs) : {fr(d.mirage1)}</li>
        <li><b>2e mirage</b> (retirer les embryons arrêtés) : {fr(d.mirage2)}</li>
        <li><b>Arrêt du retournement</b>, humidité augmentée : {fr(d.arretRetournement)}</li>
        <li><b>Éclosion</b> : {fr(d.eclosion)} (jusqu'au {fr(d.finEclosion)})</li>
        <li><b>En couveuse</b> : {P.temp} ; humidité {P.humidite} ; retournement {P.retournement}.</li>
      </ul>
      <p className="small muted" style={{ margin: 0 }}>Mirer un œuf : dans le noir, une lampe torche puissante posée contre le gros bout ; un œuf fécondé montre des vaisseaux en toile d'araignée, un œuf clair reste translucide. Suivez votre couvée avec rappels dans <a href={href("/jardin/animaux")}>Mon jardin → Animaux</a>.</p>
    </div>
  );
}

function MiseBas() {
  const [esp, setEsp] = useState("chevre");
  const [saillie, setSaillie] = useState(new Date().toISOString().slice(0, 10));
  const g = GESTATION[esp];
  const d = datesMiseBas(esp, saillie);
  const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="card stack">
      <div className="grid-sm">
        <label className="field">Espèce<select value={esp} onChange={(e) => setEsp(e.target.value)}>{Object.entries(GESTATION).map(([k, v]) => <option key={k} value={k}>{v.nom} ({v.jours} jours)</option>)}</select></label>
        <label className="field">Date de saillie (ou mise au mâle)<input type="date" value={saillie} onChange={(e) => setSaillie(e.target.value)} /></label>
      </div>
      <ul className="ticks small">
        <li>Vérifier la gestation : {esp === "lapin" ? "palpation douce de l'abdomen" : "surveillez un retour en chaleurs"} vers le <b>{fr(d.controle)}</b>{esp === "lapin" ? "" : " (ou échographie à partir de 45 jours)"}.</li>
        <li>Ration augmentée à partir du <b>{fr(d.rationAugmentee)}</b>.</li>
        <li>Préparation à partir du <b>{fr(d.preparation)}</b> : {g.preparation}</li>
        <li><b>Mise bas prévue le {fr(d.miseBas)}</b> (entre le {fr(d.debut)} et le {fr(d.fin)}).</li>
        <li>Sevrage vers le <b>{fr(d.sevrage)}</b> : {g.sevrage}.</li>
        <li className="muted">Première mise à la reproduction : {g.premiereMiseRepro}.</li>
      </ul>
      <p className="small"><a href={href("/jardin/animaux")}>Noter la saillie dans le carnet de reproduction →</a> · <a href={href("/guide/calendrier-reproduction")}>Calendrier de reproduction →</a> · <a href={href("/guide/naissances")}>Préparer les mises bas →</a></p>
    </div>
  );
}

function Rations() {
  const [esp, setEsp] = useState("chevre");
  const [nb, setNb] = useState(4);
  const [jours, setJours] = useState(150);
  const R = RATIONS[esp];
  const kgJour = R.stades[0].foinKg[1];
  const f = foinHiver(nb, kgJour, jours);
  return (
    <div className="card stack">
      <label className="field">Espèce<select value={esp} onChange={(e) => setEsp(e.target.value)}>{Object.entries(RATIONS).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></label>
      <table className="table small">
        <thead><tr><th>Stade</th><th>Foin par jour</th><th>Concentré par jour</th></tr></thead>
        <tbody>{R.stades.map((s) => (
          <tr key={s.stade}><td><b>{s.stade}</b><br /><span className="muted">{s.note}</span></td><td>{s.foinKg[1] ? `${s.foinKg[0].toLocaleString("fr-FR")} à ${s.foinKg[1].toLocaleString("fr-FR")} kg` : "—"}</td><td>{s.concentreG[1] ? `${s.concentreG[0]} à ${s.concentreG[1]} g` : "aucun"}</td></tr>
        ))}</tbody>
      </table>
      <p className="small muted">{R.mineraux} Repères pour un animal de {R.poids} : adaptez à l'état de chaque animal (on sent les côtes sans les voir).</p>
      {kgJour > 0 && (
        <>
          <b>Foin à stocker pour l'hiver</b>
          <div className="grid-sm">
            <Champ label="Nombre d'animaux" value={nb} onChange={setNb} min={1} max={500} />
            <Champ label="Jours sans herbe" value={jours} onChange={setJours} min={30} max={240} unite="jours" />
          </div>
          <p>Environ <b>{r(f.kg / 1000, 1)} tonne{f.kg >= 2000 ? "s" : ""}</b> de foin ({r(f.kg)} kg, pertes comprises), soit à peu près <b>{f.petitesBottes} petites bottes</b> de 18 kg ou <b>{f.grossesBalles} grosses balles rondes</b> de 250 kg.</p>
          <p className="small muted">Repère du nombre de jours sans herbe : 90 à 120 jours en climat doux, 150 en plaine, 180 et plus en montagne. Stockez au sec et à l'abri ; un foin moisi est dangereux (listériose, aspergillose).</p>
        </>
      )}
    </div>
  );
}
