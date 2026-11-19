import { usePaquets } from "../lib/paquets";
import { href } from "../lib/router";
import { Ico } from "../components/Ico";
import { useState } from "react";
import { PLANTES, CATEGORIES } from "../data/index";
import { Tile, VoirPlus, Titre } from "../components/ui";
import { norm } from "../lib/garden";
import { useStore } from "../lib/store";
import type { Categorie } from "../data/types";

export default function Plantes() {
  const [q, setQ] = useState("");
  const situation = useStore((s) => s.settings.situation);
  const [cat, setCat] = useState<Categorie | "tout" | "fav">(situation === "appartement" ? "interieur" : "tout");
  const [lieu, setLieu] = useState<string>("");
  const [facile, setFacile] = useState(false);
  const [filtres, setFiltres] = useState<string[]>([]);
  const [couleur, setCouleur] = useState("");
  const [froid, setFroid] = useState(() => Number(new URLSearchParams(location.hash.split("?")[1] ?? "").get("froid")) || 0); // 0 = indifférent ; sinon température minimale à supporter
  const tog = (f: string) => setFiltres(filtres.includes(f) ? filtres.filter((x) => x !== f) : [...filtres, f]);
  const fav = useStore((s) => s.favoris);
  const nq = norm(q);
  const list = PLANTES.filter(
    (p) =>
      (cat === "tout" || (cat === "fav" ? fav.includes(p.id) : p.categorie === cat)) &&
      (!lieu || p.lieux.includes(lieu as never)) &&
      (!facile || p.difficulte === 1) &&
      (!filtres.includes("animaux") || p.sansDangerAnimaux === true) &&
      (!filtres.includes("sombre") || p.ombreOk === true || p.expo.includes("ombre")) &&
      (!filtres.includes("oublis") || (p.difficulte === 1 && p.eau !== "fort")) &&
      (!filtres.includes("fleurs") || p.fleurit === true) &&
      (!filtres.includes("comestible") || !!p.comestible) &&
      (!filtres.includes("mellifere") || p.mellifere === true) &&
      (!filtres.includes("enfleur") || (p.floraison ?? []).includes((new Date().getMonth() + 1) as never)) &&
      (!couleur || (p.couleurs ?? []).includes(couleur as never)) &&
      (!froid || (p.rusticite != null && p.rusticite <= froid)) &&
      (!filtres.includes("persistant") || p.feuillage === "persistant") &&
      (!nq || norm([p.nom, p.latin, ...(p.alias ?? []), ...(p.latins ?? [])].join(" ")).includes(nq)),
  ).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const paquet = usePaquets(list, [q, cat, lieu, facile, filtres.join(","), couleur, froid].join("|"));
  return (
    <div>
      <Titre ico="plantes" emoji="🌱">Les plantes</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>{PLANTES.length} fiches : culture pas à pas, calendrier, associations, maladies, vidéos, et ce que vos animaux peuvent en manger.</p>
      <div className="row small" style={{ gap: 8, marginBottom: 8 }}>
        <a className="chip" href={href("/interieur")}>🌿 Plantes d'intérieur et aromates (avec ou sans lampe)</a>
        <a className="chip" href={href("/amenagements")}>🗺️ Aménager le jardin</a>
        <a className="chip" href={href("/cueillette")}>🧺 Bien cueillir</a>
      </div>
      <div className="search"><input type="search" placeholder="Rechercher une plante…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher une plante" /></div>
      <div className="chips scroll-x" style={{ margin: "12px 0" }}>
        <button className={`chip ${cat === "tout" ? "on" : ""}`} onClick={() => setCat("tout")}>Toutes</button>
        <button className={`chip ${cat === "fav" ? "on" : ""}`} onClick={() => setCat("fav")}>★ Favoris</button>
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} className={`chip ${cat === k ? "on" : ""}`} onClick={() => setCat(k as Categorie)}><Ico nom={k} emoji={v.emoji} taille={22} /> {v.label}</button>
        ))}
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <select value={lieu} onChange={(e) => setLieu(e.target.value)} style={{ maxWidth: 230 }} aria-label="Lieu de culture">
          <option value="">Tous les lieux</option>
          <option value="pleine-terre">En pleine terre</option>
          <option value="pot">En pot</option>
          <option value="balcon">Sur un balcon</option>
          <option value="serre">Sous serre</option>
          <option value="interieur">En intérieur</option>
        </select>
        <label className="row small"><input type="checkbox" checked={facile} onChange={(e) => setFacile(e.target.checked)} /> Faciles seulement</label>
      </div>
      <div className="chips" style={{ marginBottom: 12 }}>
        {[["enfleur", "🌸 En fleur ce mois-ci"], ["comestible", "🍽️ Comestible"], ["mellifere", "🐝 Pour les abeilles"], ["animaux", "🐱 Sans danger chats et chiens"], ["sombre", "🌑 Pièce sombre"], ["oublis", "🙈 Pardonne les oublis"], ["fleurs", "🌸 Fleurit en intérieur"]].map(([k, l]) => (
          <button key={k} className={`chip ${filtres.includes(k) ? "on" : ""}`} onClick={() => tog(k)}>{l}</button>
        ))}
      </div>
      <div className="row" style={{ marginBottom: 12, gap: 8 }}>
        <label className="small" style={{ display: "flex", alignItems: "center", gap: 6 }}>❄️ Doit supporter
          <select value={froid} onChange={(e) => setFroid(Number(e.target.value))} aria-label="Froid à supporter" style={{ width: "auto" }}>
            <option value={0}>peu importe</option>{[-5, -10, -15, -20, -25].map((t) => <option key={t} value={t}>{t} °C</option>)}
          </select>
        </label>
        <button className={`chip ${filtres.includes("persistant") ? "on" : ""}`} onClick={() => tog("persistant")}>🌲 Feuillage persistant</button>
      </div>
      <div className="chips" style={{ marginBottom: 12 }} aria-label="Couleur des fleurs">
        {[["", "Toutes couleurs", "transparent"], ["blanc", "Blanc", "#f5f5f0"], ["jaune", "Jaune", "#f2d24b"], ["orange", "Orange", "#f29a3b"], ["rouge", "Rouge", "#d9342b"], ["rose", "Rose", "#ec8fb7"], ["violet", "Violet", "#8f5bbf"], ["bleu", "Bleu", "#4f7fd1"]].map(([k, l, col]) => (
          <button key={k} className={`chip ${couleur === k ? "on" : ""}`} onClick={() => setCouleur(k)}><span style={{ width: 12, height: 12, borderRadius: 6, background: col, border: "1px solid var(--line)", display: "inline-block" }} />{l}</button>
        ))}
      </div>
      <p className="small muted" aria-live="polite">{list.length} plante{list.length > 1 ? "s" : ""}</p>
      <div className="grid">
        {paquet.visibles.map((p) => (
          <Tile key={p.id} to={`/plante/${p.id}`} id={p.id} emoji={p.emoji} title={p.nom} sub={p.latin} badge={<div className="row" style={{ gap: 4, marginTop: 4 }}><span className="badge">{["", "Facile", "Moyen", "Exigeant"][p.difficulte]}</span><span className="badge green">{CATEGORIES[p.categorie].label}</span></div>} />
        ))}
      </div>
      <VoirPlus reste={paquet.reste} onPlus={paquet.plus} quoi="plantes" />
      {!list.length && <p className="muted">Aucune plante ne correspond.</p>}
    </div>
  );
}
