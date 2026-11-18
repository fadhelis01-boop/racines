
import { useEffect, useState } from "react";
import { useStore, upsert, remove, uid, today } from "../lib/store";
import { ALIAS_CULTIVARS } from "../data/guides-recup";
import { toast } from "./ui";
import { chercherInterieur, rechercher } from "../lib/search";
import { TRAITS } from "../data/traits";
import { norm } from "../lib/garden";
import type { Plante } from "../data/types";
import { PLANTES, plante } from "../data/index";

import { useRoute, href } from "../lib/router";

import { Vignette } from "./Ico";
// Onglets « Catalogue » et « Ma collection » de la page Intérieur
const LUM: Record<string, string> = { soleil: "☀️ Forte", "mi-ombre": "⛅ Moyenne", ombre: "🌥️ Faible" };
const DIFF = ["", "Facile", "Moyenne", "Exigeante"];
const CLS = ["", "green", "sun", "terra"];
export function LignePlante({ p, via }: { p: Plante; via?: string }) {
  return (
    <a className="card row" href={href(`/plante/${p.id}`)} style={{ textDecoration: "none", color: "inherit", flexWrap: "nowrap", alignItems: "flex-start", marginTop: 8 }}>
      <Vignette id={p.id} emoji={p.emoji} taille={56} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <b>{p.nom}</b> <span className="small muted"><i>{p.latin}</i></span>
        {via && <span className="small" style={{ display: "block" }}>Aussi appelée « {via} »</span>}
        <span className="row" style={{ gap: 6, marginTop: 4 }}>
          <span className={`badge ${CLS[p.difficulte]}`}>{DIFF[p.difficulte]}</span>
          <span className="badge">{p.expo.map((e) => LUM[e]).join(" · ")}</span>
          {p.sansDangerAnimaux ? <span className="badge green">🐱 Sans danger</span> : <span className="badge danger">{p.danger ? "☠️ Très toxique" : "⚠️ Toxique animaux"}</span>}
          {(p.fleurit || TRAITS[p.id]?.fleurs) && <span className="badge">🌸 Fleurit</span>}
          {p.tailleAdulte && <span className="small muted">{p.tailleAdulte}</span>}
        </span>
      </span>
    </a>
  );
}

export function ResultatsNom({ q, res, effacer }: { q: string; res: ReturnType<typeof chercherInterieur>; effacer: () => void }) {
  const ailleurs = res.length ? [] : rechercher(q, 4).filter((h) => h.type !== "Plante d'intérieur");
  return (
    <section id="res-interieur" aria-live="polite" style={{ marginBottom: 18 }}>
      <div className="row between"><b>{res.length ? `${res.length} plante${res.length > 1 ? "s" : ""} d'intérieur pour « ${q} »` : `Aucune plante d'intérieur nommée « ${q} »`}</b><button className="btn sm ghost" onClick={effacer}>Effacer ✕</button></div>
      {res.map((r) => <LignePlante key={r.plante.id} p={r.plante} via={r.via} />)}
      {!res.length && (
        <div className="card stack">
          <span className="small">Vérifiez l'orthographe ou essayez un autre nom (nom courant, nom latin, nom de la variété sur l'étiquette).</span>
          {ailleurs.length > 0 && <span className="small">Ailleurs dans Racines : {ailleurs.map((h, i) => <span key={h.href}>{i ? " · " : ""}<a href={href(h.href)}>{h.titre}</a> <span className="muted">({h.type})</span></span>)}</span>}
          <span className="row" style={{ gap: 6 }}>
            <a className="chip" href={href("/identifier")}>📷 Identifier par photo ou par ses caractères</a>
            <a className="chip" href={href("/interieur?t=catalogue")}>🔤 Parcourir le catalogue</a>
          </span>
        </div>
      )}
    </section>
  );
}

export function Catalogue() {
  const route = useRoute();
  const [lum, setLum] = useState("");
  const [chat, setChat] = useState(false), [facile, setFacile] = useState(route.query.get("facile") === "1"), [fleurs, setFleurs] = useState(false);
  useEffect(() => { if (route.query.get("facile") === "1") setFacile(true); }, [route.query]);
  const [port, setPort] = useState("");
  const [tri, setTri] = useState<"az" | "facile">("az");
  let list = PLANTES.filter((p) => p.categorie === "interieur" && (!lum || p.expo.includes(lum as never)) && (!chat || p.sansDangerAnimaux) && (!facile || p.difficulte === 1) && (!fleurs || p.fleurit || TRAITS[p.id]?.fleurs) && (!port || TRAITS[p.id]?.port.includes(port as never)));
  list = [...list].sort((a, b) => (tri === "facile" ? a.difficulte - b.difficulte : 0) || norm(a.nom).localeCompare(norm(b.nom)));
  const lettre = (p: Plante) => norm(p.nom)[0].toUpperCase();
  const lettres = [...new Set(list.map(lettre))];
  return (
    <div>
      <div className="card stack">
        <div className="row" style={{ gap: 8 }}>
          <select value={lum} onChange={(e) => setLum(e.target.value)} aria-label="Lumière" style={{ maxWidth: 210 }}>
            <option value="">Toutes les lumières</option><option value="soleil">☀️ Forte (sud, ouest)</option><option value="mi-ombre">⛅ Moyenne (est)</option><option value="ombre">🌥️ Faible (nord, loin)</option>
          </select>
          <select value={port} onChange={(e) => setPort(e.target.value)} aria-label="Forme" style={{ maxWidth: 210 }}>
            <option value="">Toutes les formes</option><option value="retombant">Retombante ou grimpante</option><option value="arbre">Petit arbre</option><option value="touffe">Touffe</option><option value="rosette">Rosette</option><option value="cactus">Cactus et plantes grasses</option><option value="dresse">Buissonnante</option>
          </select>
          <select value={tri} onChange={(e) => setTri(e.target.value as "az" | "facile")} aria-label="Tri" style={{ maxWidth: 180 }}>
            <option value="az">De A à Z</option><option value="facile">Les plus faciles d'abord</option>
          </select>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <label className="row"><input type="checkbox" checked={chat} onChange={(e) => setChat(e.target.checked)} /> 🐱 Sans danger animaux</label>
          <label className="row"><input type="checkbox" checked={facile} onChange={(e) => setFacile(e.target.checked)} /> 🌱 Faciles</label>
          <label className="row"><input type="checkbox" checked={fleurs} onChange={(e) => setFleurs(e.target.checked)} /> 🌸 À fleurs</label>
        </div>
      </div>
      <p className="small muted">{list.length} plante{list.length > 1 ? "s" : ""}</p>
      {tri === "az" && <div className="chips" aria-label="Index alphabétique" style={{ marginBottom: 6 }}>{lettres.map((l) => <button key={l} className="chip" onClick={() => document.getElementById("cat-" + l)?.scrollIntoView({ block: "start" })}>{l}</button>)}</div>}
      {list.map((p, i) => (
        <div key={p.id}>
          {tri === "az" && (i === 0 || lettre(list[i - 1]) !== lettre(p)) && <h2 id={"cat-" + lettre(p)} style={{ marginBottom: 0 }}>{lettre(p)}</h2>}
          <LignePlante p={p} />
        </div>
      ))}
      {!list.length && <p className="muted">Aucune plante ne réunit tous ces critères.</p>}
    </div>
  );
}

export function Collection() {
  const envies = useStore((s) => s.envies);
  const [pid, setPid] = useState("");
  const [texte, setTexte] = useState("");
  const choix = PLANTES.filter((p) => p.categorie === "interieur").sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const ouvertes = envies.filter((e) => !e.obtenue);
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>💭 Ma liste d'envies</h2>
      <div className="card">
        <div className="grid-sm">
          <select value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Plante"><option value="">— Plante (facultatif) —</option>{choix.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nom}</option>)}</select>
          <input type="text" placeholder="Cultivar ou précision (ex. : Pink Princess)" value={texte} onChange={(e) => setTexte(e.target.value)} />
        </div>
        <button className="btn primary sm" style={{ marginTop: 6 }} disabled={!pid && !texte} onClick={() => { upsert("envies", { id: uid(), planteId: pid || undefined, texte: texte || plante(pid)!.nom }); setPid(""); setTexte(""); toast("Ajoutée à vos envies"); }}>Ajouter</button>
      </div>
      {ouvertes.map((e) => (
        <div key={e.id} className="card row" style={{ flexWrap: "nowrap" }}>
          {e.planteId ? <Vignette id={e.planteId} emoji={plante(e.planteId)?.emoji ?? "🌿"} taille={44} /> : <span style={{ fontSize: 30 }}>🌿</span>}
          <span style={{ flex: 1 }}><b>{e.texte}</b>{e.planteId && <span className="small muted"> · <a href={href(`/plante/${e.planteId}`)}>{plante(e.planteId)?.nom}</a></span>}</span>
          <button className="btn sm" onClick={() => { upsert("envies", { ...e, obtenue: today() }); toast("Bravo ! Pensez à l'ajouter dans Mes plantes"); }}>Obtenue</button>
          <button className="btn sm ghost" onClick={() => remove("envies", e.id)} aria-label="Supprimer">🗑</button>
        </div>
      ))}
      {!ouvertes.length && <p className="muted small">Aucune envie pour l'instant.</p>}
      <p className="small">Partagez vos envies et vos doubles avec d'autres passionnés : onglet <a href={href("/jardin/partage")}>Partage</a> de Mon jardin.</p>
      <h2>💎 Cultivars recherchés</h2>
      <p className="small">Racines reconnaît ces noms dans la recherche et renvoie vers la fiche de l'espèce, dont les soins de base s'appliquent ; la panachure demande plus de lumière et de patience.</p>
      <div className="grid">{Object.entries(ALIAS_CULTIVARS).map(([id, noms]) => { const p = plante(id); return p ? <a key={id} className="card" href={href(`/plante/${id}`)} style={{ textDecoration: "none", color: "inherit" }}><b>{p.emoji} {p.nom}</b><div className="small muted">{noms.join(" · ")}</div></a> : null; })}</div>
      <div className="grid-sm" style={{ marginTop: 12 }}>
        <a className="btn" href={href("/guide/collection-plantes")}>💎 Plantes de collection, panachure, vitrine</a>
        <a className="btn" href={href("/guide/lutte-bio-interieur")}>🐞 Lutte biologique dans la maison</a>
        <a className="btn" href={href("/guide/echange-boutures")}>🔄 Échanger des boutures</a>
        <a className="btn" href={href("/jardin/multiplier")}>✂️ Suivre mes boutures</a>
      </div>
    </div>
  );
}
