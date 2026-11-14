import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { href, useRoute } from "../lib/router";
import { Back, Listen } from "../components/ui";
import { Vignette } from "../components/Ico";

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
  { id: "poireau", nom: "Poireaux", emoji: "🧅", parPers: 25, unite: "pieds", m2: 0.04, note: "pour l'hiver" },
  { id: "oignon", nom: "Oignons", emoji: "🧅", parPers: 1.5, unite: "m²", m2: 1, note: "≈ 3 kg/m², se conservent tout l'hiver" },
  { id: "ail", nom: "Ail", emoji: "🧄", parPers: 0.5, unite: "m²", m2: 1, note: "≈ 25 têtes/m²" },
  { id: "courge", nom: "Courges", emoji: "🎃", parPers: 0.5, unite: "pieds", m2: 2, note: "chaque pied donne 3 à 8 courges qui se gardent l'hiver" },
  { id: "chou", nom: "Choux", emoji: "🥬", parPers: 4, unite: "pieds", m2: 0.25, note: "mélangez choux d'été, d'automne et d'hiver" },
  { id: "fraisier", nom: "Fraisiers", emoji: "🍓", parPers: 8, unite: "pieds", m2: 0.1, note: "à renouveler tous les 3 ans" },
  { id: "radis", nom: "Radis", emoji: "🌶️", parPers: 0.5, unite: "m² par semis", m2: 0.5, note: "semez un rang toutes les 2 semaines" },
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
  // animaux
  const [oeufs, setOeufs] = useState(12), [prixAliment, setPrixAliment] = useState(0.6);
  const section = useRoute().query.get("s");
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
      <h1>🧮 Calculs pratiques</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Des ordres de grandeur pour acheter juste et prévoir : compost, terreau, quantités à planter pour la famille, eau de pluie, poules. Les chiffres réels varient avec le sol, le climat et les variétés.</p>
      <div className="chips" style={{ margin: "8px 0 4px" }}>
        <a className="chip" href="#/calculs?s=compost" onClick={(e) => { e.preventDefault(); document.getElementById("compost")?.scrollIntoView(); }}>♻️ Compost et fumier</a>
        <a className="chip" href="#/calculs?s=bacs" onClick={(e) => { e.preventDefault(); document.getElementById("bacs")?.scrollIntoView(); }}>🌿 Terreau des bacs</a>
        <a className="chip" href="#/calculs?s=famille" onClick={(e) => { e.preventDefault(); document.getElementById("famille")?.scrollIntoView(); }}>👪 Nourrir la famille</a>
        <a className="chip" href="#/calculs?s=eau" onClick={(e) => { e.preventDefault(); document.getElementById("eau")?.scrollIntoView(); }}>🌧️ Eau de pluie</a>
        <a className="chip" href="#/calculs?s=animaux" onClick={(e) => { e.preventDefault(); document.getElementById("animaux")?.scrollIntoView(); }}>🐔 Combien de poules ?</a>
      </div>

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

      <h2 id="eau">🌧️ Eau de pluie récupérable</h2>
      <div className="card stack">
        <div className="grid-sm">
          <Champ label="Surface de toit raccordée (au sol)" value={toit} onChange={setToit} max={2000} unite="m²" />
          <Champ label="Pluie d'un mois type" value={pluie} onChange={setPluie} max={400} unite="mm" />
        </div>
        <ul className="ticks small">
          <li><b>Récupérable ce mois-ci :</b> environ {r(toit * pluie * 0.8)} L (1 mm de pluie sur 1 m² = 1 L, moins 20 % de pertes).</li>
          <li><b>Une forte pluie de 10 mm</b> remplit déjà {r(toit * 10 * 0.8)} L : une cuve de {toit * 10 * 0.8 > 500 ? "1 000 L ou plus" : "300 à 500 L"} se justifie.</li>
          <li><b>Besoin d'un potager en été :</b> 3 à 5 L par m² et par semaine paillé, le double sans paillage.</li>
        </ul>
        <p className="small"><a href={href("/guide/recuperateur-pluie")}>Installer un récupérateur →</a></p>
      </div>

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
      <Listen id="calculs" title="Calculs pratiques" blocks={[`Pour ${surface} mètres carrés : ${r(surface * 2)} à ${r(surface * 3)} kilos de compost par an.`, `Pour ${oeufs} œufs par semaine : ${poules} poules.`, `Pour ${pers} personnes : environ ${r(surfaceTotale * 1.4)} mètres carrés de potager avec les allées.`]} label="Écouter le résumé" />
    </div>
  );
}
