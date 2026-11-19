import { useState } from "react";
import { useStore } from "../lib/store";
import { useRoute, href, go } from "../lib/router";
import { Titre } from "../components/ui";
import { plante } from "../data/index";
import { MOIS_NOMS } from "../data/util";
import { classerTexture, chaulage, AMENDEMENTS_CALCIQUES, bilanHumique, AMENDEMENTS_ORGANIQUES, fumureAzotee, BESOIN_N, APPORTS_N, degresJours, BASE_DJ, type Texture } from "../lib/agronome";

const ONGLETS: [string, string][] = [["texture", "🔺 Texture du sol"], ["chaulage", "🧪 Chaulage"], ["humus", "🍂 Bilan humique"], ["azote", "🌱 Fumure azotée"], ["dj", "🌡️ Degrés-jours"]];
const fr = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
const n = (x: number, d = 0) => x.toLocaleString("fr-FR", { maximumFractionDigits: d });

export default function Agronome() {
  const onglet = useRoute().query.get("t") ?? "texture";
  return (
    <div>
      <Titre ico="sol" emoji="🧮">Outils de l'agronome</Titre>
      <p className="muted small">Les calculs de base de l'agronomie, appliqués à votre jardin : texture, correction du pH, entretien de la matière organique, besoin en azote, chaleur accumulée. Ce sont des ordres de grandeur pédagogiques : une analyse de sol de laboratoire les précise.</p>
      <div className="chips" role="tablist" style={{ margin: "8px 0 12px" }}>
        {ONGLETS.map(([k, l]) => <button key={k} role="tab" aria-selected={onglet === k} className={`chip ${onglet === k ? "on" : ""}`} onClick={() => go(`/agronome?t=${k}`)}>{l}</button>)}
      </div>
      {onglet === "texture" && <TextureOutil />}
      {onglet === "chaulage" && <Chaulage />}
      {onglet === "humus" && <Humus />}
      {onglet === "azote" && <Azote />}
      {onglet === "dj" && <DegresJours />}
      <p className="small" style={{ marginTop: 14 }}><a href={href("/guide/analyse-sol")}>Lire une analyse de sol →</a> · <a href={href("/cours")}>Parcours « Comprendre l'agronomie » →</a> · <a href={href("/references")}>Sources et références →</a></p>
    </div>
  );
}

const Num = ({ label, value, set, min = 0, max = 100, step = 1, unite }: { label: string; value: number; set: (v: number) => void; min?: number; max?: number; step?: number; unite?: string }) => (
  <label className="field">{label}<span className="row" style={{ gap: 6, flexWrap: "nowrap" }}><input type="number" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />{unite && <span className="small muted">{unite}</span>}</span></label>
);
const ChoixTexture = ({ value, set }: { value: Texture; set: (t: Texture) => void }) => (
  <label className="field">Texture<select value={value} onChange={(e) => set(e.target.value as Texture)}><option value="sableux">Sableuse (légère)</option><option value="limoneux">Limoneuse ou équilibrée</option><option value="argileux">Argileuse (lourde)</option></select></label>
);

function TextureOutil() {
  const [a, setA] = useState(20), [l, setL] = useState(40);
  const s = Math.max(0, 100 - a - l);
  const c = classerTexture(a, l, s);
  // Triangle : sommet argile en haut, limon en bas à droite, sable en bas à gauche
  const W = 300, H = 260;
  const pt = (ar: number, li: number) => ({ x: 20 + (li + ar / 2) / 100 * (W - 40), y: H - 20 - (ar / 100) * (H - 40) });
  const p = pt(a, l);
  return (
    <div className="card stack">
      <div className="grid-sm">
        <Num label="Argile" value={a} set={(v) => setA(Math.min(100, v))} unite="%" />
        <Num label="Limon" value={l} set={(v) => setL(Math.min(100 - a, v))} unite="%" />
        <label className="field">Sable (déduit)<input type="number" value={s} readOnly /></label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 360 }} role="img" aria-label={`Triangle des textures : ${a} % d'argile, ${l} % de limon, ${s} % de sable`}>
        <polygon points={`${pt(100, 0).x},${pt(100, 0).y} ${pt(0, 100).x},${pt(0, 100).y} ${pt(0, 0).x},${pt(0, 0).y}`} fill="var(--surface-2)" stroke="var(--line)" />
        {[20, 40, 60, 80].map((k) => <line key={k} x1={pt(k, 0).x} y1={pt(k, 0).y} x2={pt(k, 100 - k).x} y2={pt(k, 100 - k).y} stroke="var(--line)" strokeDasharray="3 3" />)}
        <text x={pt(100, 0).x} y={pt(100, 0).y - 6} textAnchor="middle" fontSize="11" fill="currentColor">Argile</text>
        <text x={pt(0, 100).x} y={pt(0, 100).y + 14} textAnchor="end" fontSize="11" fill="currentColor">Limon</text>
        <text x={pt(0, 0).x} y={pt(0, 0).y + 14} fontSize="11" fill="currentColor">Sable</text>
        <circle cx={p.x} cy={p.y} r="6" fill="var(--terra)" stroke="#fff" strokeWidth="2" />
      </svg>
      {c ? (
        <div>
          <b>Texture : {c.nom}</b>
          <ul className="ticks small"><li><b>Eau :</b> {c.eau}</li><li><b>Travail du sol :</b> {c.travail}</li><li><b>Fertilité :</b> {c.fertilite}</li></ul>
        </div>
      ) : <p className="small" style={{ color: "var(--danger)" }}>La somme argile + limon + sable doit faire 100 %.</p>}
      <p className="small muted">Les pourcentages figurent sur une analyse granulométrique de laboratoire. Sans analyse, le test du boudin et le test du bocal (onglet « Identifier mon sol ») donnent une idée. Classification simplifiée, inspirée du triangle du GEPPA.</p>
    </div>
  );
}

function Chaulage() {
  const [ph, setPh] = useState(5.6), [vise, setVise] = useState(6.5), [tex, setTex] = useState<Texture>("limoneux"), [surf, setSurf] = useState(50), [prod, setProd] = useState<keyof typeof AMENDEMENTS_CALCIQUES>("calcaire");
  const r = chaulage({ phActuel: ph, phVise: vise, texture: tex, surfaceM2: surf, produit: prod });
  return (
    <div className="card stack">
      <div className="grid-sm">
        <Num label="pH actuel (à l'eau)" value={ph} set={setPh} min={3} max={9} step={0.1} />
        <Num label="pH visé" value={vise} set={setVise} min={4} max={8} step={0.1} />
        <ChoixTexture value={tex} set={setTex} />
        <Num label="Surface" value={surf} set={setSurf} min={1} max={100000} unite="m²" />
        <label className="field">Produit<select value={prod} onChange={(e) => setProd(e.target.value as keyof typeof AMENDEMENTS_CALCIQUES)}>{Object.entries(AMENDEMENTS_CALCIQUES).map(([k, v]) => <option key={k} value={k}>{v.nom}{v.bio ? "" : " (non conseillé)"}</option>)}</select></label>
      </div>
      {r.ecart <= 0 ? <p>Pas de chaulage nécessaire : le pH est déjà au niveau visé. Un apport d'entretien léger (50 à 100 g/m² de calcaire tous les 3-4 ans) suffit en sol qui s'acidifie.</p> : (
        <>
          <p>Pour remonter le pH de {n(r.ecart, 1)} unité : environ <b>{n(r.produitGM2)} g/m²</b> de {AMENDEMENTS_CALCIQUES[prod].nom.toLowerCase()}, soit <b>{n(r.totalKg, 1)} kg</b> pour {surf} m².</p>
          {r.annees > 1 && <p className="small">À répartir sur <b>{r.annees} ans</b> (environ {n(r.parAnGM2)} g/m² par an) : on ne relève pas le pH de plus d'une demi-unité par an.</p>}
        </>
      )}
      <p className="small muted">{AMENDEMENTS_CALCIQUES[prod].note} Épandez en automne ou en fin d'hiver, sur sol ressuyé, sans l'associer au fumier frais (perte d'azote). Ne chaulez pas les plantes de terre de bruyère (myrtilliers, rhododendrons, camélias). Hypothèse : besoin en chaux selon la texture et le pouvoir tampon moyen ; une analyse de sol donne le besoin précis.</p>
    </div>
  );
}

function Humus() {
  const [surf, setSurf] = useState(50), [mo, setMo] = useState(3), [tex, setTex] = useState<Texture>("limoneux"), [am, setAm] = useState<keyof typeof AMENDEMENTS_ORGANIQUES>("compost");
  const r = bilanHumique({ surfaceM2: surf, moPct: mo, texture: tex, amendement: am });
  return (
    <div className="card stack">
      <div className="grid-sm">
        <Num label="Surface" value={surf} set={setSurf} min={1} max={100000} unite="m²" />
        <Num label="Matière organique du sol" value={mo} set={setMo} min={0.5} max={15} step={0.1} unite="%" />
        <ChoixTexture value={tex} set={setTex} />
        <label className="field">Amendement<select value={am} onChange={(e) => setAm(e.target.value as keyof typeof AMENDEMENTS_ORGANIQUES)}>{Object.entries(AMENDEMENTS_ORGANIQUES).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></label>
      </div>
      <ul className="ticks small">
        <li>Stock de matière organique dans les 25 premiers cm : environ <b>{n(r.stockKg)} kg</b>.</li>
        <li>Perte par minéralisation chaque année : environ <b>{n(r.perteKg, 1)} kg</b> (plus rapide en sol sableux et chaud).</li>
        <li>Pour maintenir ce taux : <b>{n(r.amendementKg)} kg de {AMENDEMENTS_ORGANIQUES[am].nom.toLowerCase()} par an</b>, soit environ <b>{n(r.kgM2, 1)} kg/m²</b>. Pour augmenter le taux, prévoyez davantage.</li>
      </ul>
      <p className="small muted">Méthode du bilan humique (dite de Hénin-Dupuis) : stock × vitesse de minéralisation (k2) = humus perdu ; chaque amendement apporte une part d'humus stable (k1). Les engrais verts et les résidus de culture laissés au sol comptent aussi. Repères : un sol de potager vise 3 à 5 % de matière organique.</p>
    </div>
  );
}

function Azote() {
  const [cult, setCult] = useState("tomate"), [mo, setMo] = useState(3), [prec, setPrec] = useState<"aucun" | "legumineuse" | "engrais-vert-legumineuse">("aucun"), [ap, setAp] = useState<keyof typeof APPORTS_N>("compost");
  const r = fumureAzotee({ culture: cult, moPct: mo, precedent: prec, apport: ap });
  return (
    <div className="card stack">
      <div className="grid-sm">
        <label className="field">Culture<select value={cult} onChange={(e) => setCult(e.target.value)}>{Object.keys(BESOIN_N).sort().map((k) => <option key={k} value={k}>{plante(k)?.nom ?? k}</option>)}</select></label>
        <Num label="Matière organique du sol" value={mo} set={setMo} min={0.5} max={15} step={0.1} unite="%" />
        <label className="field">Culture précédente<select value={prec} onChange={(e) => setPrec(e.target.value as typeof prec)}><option value="aucun">Autre culture</option><option value="legumineuse">Haricots, pois, fèves</option><option value="engrais-vert-legumineuse">Engrais vert de légumineuses enfoui</option></select></label>
        <label className="field">Apport choisi<select value={ap} onChange={(e) => setAp(e.target.value as keyof typeof APPORTS_N)}>{Object.entries(APPORTS_N).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></label>
      </div>
      <table className="table small"><tbody>
        <tr><td>Besoin de la culture</td><td><b>{r.besoin} kg N/ha</b></td></tr>
        <tr><td>Fourni par le sol (minéralisation)</td><td>− {r.sol}</td></tr>
        {r.precedent > 0 && <tr><td>Arrière-effet du précédent</td><td>− {r.precedent}</td></tr>}
        <tr><td><b>À apporter</b></td><td><b>{r.aApporter} kg N/ha</b> = {n(r.gNparM2, 1)} g d'azote par m²</td></tr>
      </tbody></table>
      {r.aApporter > 0 ? <p>Soit environ <b>{r.produitGM2 >= 1000 ? `${n(r.produitGM2 / 1000, 1)} kg` : `${n(r.produitGM2)} g`} de {APPORTS_N[ap].nom.toLowerCase()} par m²</b>{ap === "compost" ? ", une partie seulement de l'azote du compost étant disponible la première année (le reste nourrit le sol à long terme)" : ""}.</p> : <p>Pas d'apport azoté nécessaire cette saison.</p>}
      <p className="small muted">Méthode du bilan simplifiée : besoin − fourniture du sol − arrière-effets = apport. Ordres de grandeur : un sol à 3 % de matière organique libère environ 90 kg d'azote par hectare et par saison. Fractionnez les apports, ne fertilisez pas les légumineuses, et évitez les excès (pucerons, nitrates dans les légumes et dans l'eau).</p>
    </div>
  );
}

function DegresJours() {
  const zone = useStore((s) => s.settings.zone);
  const [cult, setCult] = useState("mais"), [debut, setDebut] = useState(`${new Date().getFullYear()}-05-01`);
  const B = BASE_DJ[cult];
  const [dj, setDj] = useState(B.dj), [base, setBase] = useState(B.base);
  const choisir = (c: string) => { setCult(c); setDj(BASE_DJ[c].dj); setBase(BASE_DJ[c].base); };
  const r = degresJours(zone, base, debut, dj);
  return (
    <div className="card stack">
      <div className="grid-sm">
        <label className="field">Culture<select value={cult} onChange={(e) => choisir(e.target.value)}>{Object.keys(BASE_DJ).map((k) => <option key={k} value={k}>{plante(k)?.nom ?? k}</option>)}</select></label>
        <label className="field">Départ ({B.depuis})<input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></label>
        <Num label="Température de base" value={base} set={setBase} min={-2} max={15} unite="°C" />
        <Num label="Besoin" value={dj} set={setDj} min={50} max={4000} step={10} unite="degrés-jours" />
      </div>
      <p>{r.atteint ? <>Dans votre climat, la culture devrait atteindre ce stade vers le <b>{fr(r.date)}</b>, environ <b>{r.jours} jours</b> après le départ.</> : <>Le besoin n'est pas atteint dans l'année avec ce départ : la saison est trop courte ou trop fraîche.</>}</p>
      <div className="small">{r.parMois.map((m) => <span key={m.mois} className="badge" style={{ marginRight: 4 }}>{MOIS_NOMS[m.mois - 1].slice(0, 4)} : {m.dj}</span>)}</div>
      <p className="small muted">Degrés-jours : chaque jour, on additionne la température moyenne moins la température de base (en dessous, la plante ne pousse pas). Calcul sur les températures moyennes de votre climat ; un printemps froid retarde, un été chaud avance. Les besoins indiqués sont des repères à ajuster avec vos propres observations.</p>
    </div>
  );
}
