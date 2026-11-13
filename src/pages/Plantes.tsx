import { useState } from "react";
import { PLANTES, CATEGORIES } from "../data/index";
import { Tile } from "../components/ui";
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
      (!nq || norm([p.nom, p.latin, ...(p.alias ?? []), ...(p.latins ?? [])].join(" ")).includes(nq)),
  ).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return (
    <div>
      <h1>🌱 Les plantes</h1>
      <p className="muted small" style={{ marginTop: -6 }}>{PLANTES.length} fiches : culture pas à pas, calendrier, associations, maladies, vidéos, et ce que vos animaux peuvent en manger.</p>
      <div className="search"><input type="search" placeholder="Rechercher une plante…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher une plante" /></div>
      <div className="chips scroll-x" style={{ margin: "12px 0" }}>
        <button className={`chip ${cat === "tout" ? "on" : ""}`} onClick={() => setCat("tout")}>Toutes</button>
        <button className={`chip ${cat === "fav" ? "on" : ""}`} onClick={() => setCat("fav")}>★ Favoris</button>
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} className={`chip ${cat === k ? "on" : ""}`} onClick={() => setCat(k as Categorie)}>{v.emoji} {v.label}</button>
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
        {[["animaux", "🐱 Sans danger chats et chiens"], ["sombre", "🌑 Pièce sombre"], ["oublis", "🙈 Pardonne les oublis"], ["fleurs", "🌸 Fleurit en intérieur"]].map(([k, l]) => (
          <button key={k} className={`chip ${filtres.includes(k) ? "on" : ""}`} onClick={() => tog(k)}>{l}</button>
        ))}
      </div>
      <div className="grid">
        {list.map((p) => (
          <Tile key={p.id} to={`/plante/${p.id}`} id={p.id} emoji={p.emoji} title={p.nom} sub={p.latin} badge={<div className="row" style={{ gap: 4, marginTop: 4 }}><span className="badge">{["", "Facile", "Moyen", "Exigeant"][p.difficulte]}</span><span className="badge green">{CATEGORIES[p.categorie].label}</span></div>} />
        ))}
      </div>
      {!list.length && <p className="muted">Aucune plante ne correspond.</p>}
    </div>
  );
}
