import { useEffect, useRef, useState, type ReactNode } from "react";
import { href, go } from "../lib/router";
import { play, pause, useTts } from "../lib/tts";
import { MOIS_COURTS, youtube, tiktok } from "../data/util";
import { ACTIONS, type Action, moisAffiches } from "../lib/calendar";
import { useStore, update, toggleFavori } from "../lib/store";
import type { Plante } from "../data/types";
import { useWiki, wikiCharge, type PhotoLibre } from "../lib/wiki";
import localImages from "../data/local-images.json";
const LOCAL = new Set(localImages as string[]);
import { loadPhoto } from "../lib/photos";
import { Ico } from "./Ico";

export const A = ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
  <a href={href(to)} className={className}>{children}</a>
);

export type { PhotoLibre };
export const wikiOf = (id: string) => wikiCharge()?.[id];
export const toutesLesPhotos = () => [...Object.values(wikiCharge() ?? {}).flatMap((w) => (w.photos ?? []).map((p) => p.img)), ...[...LOCAL].map((id) => `./img/${id}.webp`)];

// Photo libre (Wikimedia) ou, à défaut, l'emoji de la fiche
export function Photo({ id, emoji, alt, repli }: { id: string; emoji: string; alt: string; credit?: boolean; repli?: ReactNode }) {
  const w = useWiki()?.[id];
  const [etat, setEtat] = useState<"local" | "wiki" | "err">(LOCAL.has(id) ? "local" : "wiki");
  const local = `./img/${id}.webp`;
  const src = etat === "local" ? local : etat === "wiki" ? w?.photos?.[0]?.img : undefined;
  if (!src) return repli ? <>{repli}</> : <span aria-hidden="true">{emoji}</span>;
  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        crossOrigin={src.startsWith("http") ? "anonymous" : undefined}
        onError={() => setEtat(etat === "local" ? "wiki" : "err")}
      />

    </>
  );
}

export function Credit({ id, index = 0 }: { id: string; index?: number }) {
  const ph = useWiki()?.[id]?.photos?.[index];
  if (!ph || (LOCAL.has(id) && index === 0)) return null;
  return (
    <div className="credit">
      Photo : {ph.auteur} — <a href={ph.page} target="_blank" rel="noreferrer">{ph.licence}</a>, via Wikimedia Commons
    </div>
  );
}

// Plusieurs vues de la plante (feuille, ensemble, fleur…) avec agrandissement
export function Galerie({ id, emoji, alt, photoFirst }: { id: string; emoji: string; alt: string; photoFirst?: boolean }) {
  const photos = useWiki()?.[id]?.photos ?? [];
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const local = LOCAL.has(id) && !(photoFirst && photos.length);
  if (local || (photos.length <= 1 && !photoFirst)) {
    return <div><div className="pic" onClick={() => photos.length && !local && setZoom(true)} style={{ cursor: photos.length && !local ? "zoom-in" : undefined }}><Photo id={id} emoji={emoji} alt={alt} /></div><Credit id={id} />{zoom && <Lightbox ph={photos[0]} alt={alt} onClose={() => setZoom(false)} />}</div>;
  }
  const ph = photos[i];
  return (
    <div>
      <div className="pic" onClick={() => setZoom(true)} style={{ cursor: "zoom-in" }}><img src={ph.img} alt={`${alt} — vue ${i + 1}`} crossOrigin="anonymous" loading="lazy" /></div>
      <div className="row" style={{ gap: 6, marginTop: 6, flexWrap: "nowrap", overflowX: "auto" }}>
        {photos.map((p, k) => (
          <button key={k + p.img} onClick={() => setI(k)} aria-label={`Vue ${k + 1}`} style={{ padding: 0, border: k === i ? "2px solid var(--green)" : "1px solid var(--line)", borderRadius: 8, overflow: "hidden", width: 56, height: 56, flexShrink: 0, background: "none", cursor: "pointer" }}>
            <img src={p.img} alt="" crossOrigin="anonymous" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
      <Credit id={id} index={i} />
      {zoom && <Lightbox ph={ph} alt={alt} onClose={() => setZoom(false)} />}
    </div>
  );
}

function Lightbox({ ph, alt, onClose }: { ph: PhotoLibre; alt: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={alt} onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,.88)", display: "grid", placeItems: "center", padding: 16, cursor: "zoom-out" }}>
      <img src={ph.full.match(/\.(jpe?g|png|webp)$/i) ? ph.img.replace(/\/500px-/, "/1280px-") : ph.img} alt={alt} style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }} onError={(e) => { (e.target as HTMLImageElement).src = ph.img; }} />
      <div className="small" style={{ color: "#ddd", marginTop: 8, textAlign: "center" }}>{ph.auteur} — {ph.licence} · touchez pour fermer</div>
    </div>
  );
}

export function Tile({ to, id, emoji, title, sub, badge }: { to: string; id: string; emoji: string; title: string; sub?: string; badge?: ReactNode }) {
  return (
    <a className="tile" href={href(to)}>
      <div className="ph"><Photo id={id} emoji={emoji} alt="" /></div>
      <div className="bd">
        <div className="t">{title}</div>
        {sub && <div className="s">{sub}</div>}
        {badge}
      </div>
    </a>
  );
}

// Bouton « Écouter » : lit une liste de blocs de texte à voix haute
export function Listen({ id, title, blocks, label = "Écouter" }: { id: string; title: string; blocks: string[]; label?: string }) {
  const { key, playing, supported } = useTts((s) => ({ key: s.key, playing: s.playing, supported: s.supported }));
  if (!supported) return null;
  const mine = key === id && playing;
  return (
    <button className="btn" onClick={() => (mine ? pause() : play({ key: id, title, blocks }))} aria-label={mine ? "Mettre la lecture en pause" : "Lire à voix haute"}>
      {mine ? "⏸ Pause" : `🔊 ${label}`}
    </button>
  );
}

export function Fav({ id }: { id: string }) {
  const on = useStore((s) => s.favoris.includes(id));
  return (
    <button className="icon-btn" onClick={() => toggleFavori(id)} aria-label={on ? "Retirer des favoris" : "Ajouter aux favoris"} title="Favori">
      {on ? "★" : "☆"}
    </button>
  );
}

export function Back() {
  return <button className="btn ghost sm" onClick={() => (history.length > 1 ? history.back() : go("/"))}>← Retour</button>;
}

export function MonthGrid({ plantes, actions, zone, onlyLabel }: { plantes: Plante[]; actions?: Action[]; zone: Parameters<typeof moisAffiches>[2]; onlyLabel?: boolean }) {
  const now = new Date().getMonth() + 1;
  const acts = actions ?? (["semisAbri", "repiquage", "semisPlace", "plantation", "recolte", "taille", "floraison"] as Action[]);
  return (
    <div>
      <div className="months" role="table" aria-label="Calendrier de culture">
        <div />
        {MOIS_COURTS.map((m, i) => <div key={m} className="head" style={{ fontWeight: i + 1 === now ? 900 : undefined }}>{m[0].toUpperCase()}</div>)}
        {plantes.flatMap((p) =>
          acts.filter((a) => moisAffiches(p, a, zone).size).map((a) => {
            const set = moisAffiches(p, a, zone);
            return [
              <div key={p.id + a} className="lab" title={`${p.nom} — ${ACTIONS[a].label}`}>{onlyLabel ? ACTIONS[a].label : `${p.emoji} ${p.nom}`}</div>,
              ...Array.from({ length: 12 }, (_, i) => (
                <div key={p.id + a + i} className={`m ${set.has(i + 1) ? a : ""} ${i + 1 === now ? "now" : ""}`} title={set.has(i + 1) ? `${ACTIONS[a].label} en ${MOIS_COURTS[i]}` : ""}>·</div>
              )),
            ];
          }),
        )}
      </div>
      <div className="legend">
        {acts.filter((a) => plantes.some((p) => moisAffiches(p, a, zone).size)).map((a) => <span key={a}><i className={`m ${a}`} style={{ background: `var(--c-${a})` }} />{ACTIONS[a].emoji} {ACTIONS[a].label}</span>)}
      </div>
    </div>
  );
}

// Vidéos : recherches YouTube/TikTok + une vidéo préférée enregistrée par l'utilisateur
// Vidéos : recherches YouTube/TikTok toujours à jour + les vidéos que l'utilisateur
// a choisi de garder (plusieurs par fiche, lues dans l'application).
export function Videos({ id, query, gestes }: { id: string; query: string; gestes?: string[] }) {
  const saved = useStore((s) => s.videos[id]);
  const liste = (saved ?? "").split("\n").map((x) => x.trim()).filter(Boolean);
  const [url, setUrl] = useState("");
  const [edit, setEdit] = useState(false);
  const enregistrer = (l: string[]) => update((s) => { const v = { ...s.videos }; if (l.length) v[id] = l.join("\n"); else delete v[id]; return { ...s, videos: v }; });
  return (
    <div className="stack">
      <div className="row">
        <a className="btn" href={youtube(query + " tuto")} target="_blank" rel="noreferrer">▶️ Tutoriels YouTube</a>
        <a className="btn" href={tiktok(query)} target="_blank" rel="noreferrer">🎵 Vidéos TikTok</a>
        <button className="btn ghost sm" onClick={() => setEdit(!edit)}>📌 Garder une vidéo</button>
      </div>
      {gestes && gestes.length > 0 && (
        <div>
          <b className="small">Un geste précis :</b>
          <div className="chips" style={{ marginTop: 6 }}>{gestes.map((g) => <a key={g} className="chip" href={youtube(g)} target="_blank" rel="noreferrer">▶️ {g}</a>)}</div>
        </div>
      )}
      <p className="small muted">Les liens ouvrent une recherche à jour, en français. Quand une vidéo vous plaît, collez son adresse ici : elle sera lue directement dans la fiche (YouTube et TikTok).</p>
      {edit && (
        <div className="row">
          <input type="text" inputMode="url" placeholder="https://www.youtube.com/watch?v=… ou https://www.tiktok.com/@…/video/…" value={url} onChange={(e) => setUrl(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <button className="btn primary" disabled={!/^https?:\/\//.test(url.trim())} onClick={() => { enregistrer([...liste, url.trim()]); setUrl(""); setEdit(false); }}>Ajouter</button>
        </div>
      )}
      {liste.map((u) => (
        <div key={u}>
          <Lecteur url={u} />
          <button className="btn sm ghost" onClick={() => enregistrer(liste.filter((x) => x !== u))}>✕ Retirer cette vidéo</button>
        </div>
      ))}
    </div>
  );
}
function Lecteur({ url }: { url: string }) {
  const yt = youtubeId(url);
  const tk = url.match(/tiktok\.com\/.*\/video\/(\d+)/)?.[1];
  if (!yt && !tk) return <a className="btn" href={url} target="_blank" rel="noreferrer">▶️ Ouvrir la vidéo</a>;
  return (
    <div style={{ position: "relative", paddingTop: tk ? "177%" : "56.25%", maxWidth: tk ? 340 : undefined, borderRadius: 12, overflow: "hidden", background: "#000" }}>
      <iframe src={yt ? `https://www.youtube-nocookie.com/embed/${yt}` : `https://www.tiktok.com/embed/v2/${tk}`} title="Vidéo enregistrée" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
    </div>
  );
}
function youtubeId(u: string) {
  const m = u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section>
      <div className="row between" style={{ marginTop: "1.4em" }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {right}
      </div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </section>
  );
}

// État vide illustré : une petite scène (cercle, sol, pousses) autour de l'icône dessinée de la rubrique.
// L'icône est déduite de l'emoji quand elle n'est pas précisée.
const ICO_DE_EMOJI: Record<string, string> = { "🌱": "semis", "🗺️": "jardin", "🧺": "recolte", "📓": "lexique", "🏺": "semis", "🐝": "abeille", "🐔": "animaux", "🌿": "interieur", "🥫": "recolte-action", "🐐": "animaux", "📋": "calendrier" };
export function Scene({ ico, emoji, taille = 120 }: { ico?: string; emoji: string; taille?: number }) {
  return (
    <div style={{ position: "relative", width: taille, height: taille, margin: "0 auto 8px" }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width={taille} height={taille} style={{ position: "absolute", inset: 0 }}>
        <circle cx="60" cy="56" r="50" style={{ fill: "var(--green-soft)" }} />
        <circle cx="94" cy="22" r="9" style={{ fill: "var(--sun-soft)", stroke: "var(--sun)" }} strokeWidth="1.5" />
        <path d="M8 96 Q60 84 112 96 L112 120 L8 120 z" style={{ fill: "var(--terra-soft)" }} />
        <g style={{ stroke: "var(--green)" }} strokeWidth="2" fill="none" strokeLinecap="round"><path d="M22 96 q0 -10 -6 -14 M22 96 q0 -8 6 -12" /><path d="M100 95 q0 -9 -5 -12 M100 95 q0 -7 5 -10" /></g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: taille * 0.18, textAlign: "center" }}><Ico nom={ico ?? ICO_DE_EMOJI[emoji] ?? ""} emoji={emoji} taille={taille * 0.48} /></div>
    </div>
  );
}
export function Empty({ emoji, ico, children }: { emoji: string; ico?: string; children: ReactNode }) {
  if (emoji === "🤷") return <div className="empty"><div className="e">{emoji}</div>{children}</div>;
  return <div className="empty"><Scene ico={ico} emoji={emoji} />{children}</div>;
}

// Illustration de remplacement d'un tutoriel sans photo : paysage aux couleurs du thème et icône de la rubrique
const ICO_RUBRIQUE: Record<string, string> = { demarrer: "demarrer", fleurs: "fleur", sol: "sol", compost: "compost", arrosage: "arrosage", semis: "semis", serre: "serre", balcon: "balcon", interieur: "interieur", fabriquer: "fabriquer", recolte: "recolte", animaux: "animaux", boucherie: "boucherie", securite: "securite" };
export function BandeauRubrique({ rubrique, emoji, plein }: { rubrique: string; emoji: string; plein?: boolean }) {
  return (
    <div className="bandeau-rubrique" aria-hidden="true" style={{ position: "relative", ...(plein ? { height: "100%" } : { aspectRatio: "16 / 6" }), borderRadius: plein ? 0 : 14, overflow: "hidden", background: "linear-gradient(var(--sun-soft), var(--surface))" }}>
      <svg viewBox="0 0 400 150" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="330" cy="38" r="20" style={{ fill: "var(--sun)" }} opacity=".55" />
        <path d="M0 110 Q90 70 190 100 T400 92 L400 150 L0 150 z" style={{ fill: "var(--green-soft)" }} />
        <path d="M0 128 Q120 104 240 124 T400 120 L400 150 L0 150 z" style={{ fill: "var(--terra-soft)" }} />
        <g style={{ stroke: "var(--green)" }} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7">
          {[40, 70, 300, 360].map((x) => <path key={x} d={`M${x} 128 q0 -14 -8 -20 M${x} 128 q0 -11 8 -16`} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><Ico nom={ICO_RUBRIQUE[rubrique] ?? ""} emoji={emoji} taille={plein ? 64 : 96} /></div>
    </div>
  );
}

export function StoredPhoto({ k, className }: { k: string; className?: string }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let u: string | undefined;
    void loadPhoto(k).then((b) => { if (b) { u = URL.createObjectURL(b); setUrl(u); } });
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [k]);
  return url ? <img src={url} alt="" className={className} /> : null;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el!.style.display = "none"), 2600);
}

export function download(name: string, blob: Blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/** Bouton « Voir plus » qui se déclenche aussi tout seul quand on arrive en bas de la liste. */
export function VoirPlus({ reste, onPlus, quoi = "résultats" }: { reste: number; onPlus: () => void; quoi?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !reste || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) onPlus(); }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [reste, onPlus]);
  if (!reste) return null;
  return <button ref={ref} className="btn" style={{ width: "100%", marginTop: 12 }} onClick={onPlus}>Voir plus ({reste} autres {quoi})</button>;
}

/** Titre de page : une illustration de la famille d'icônes de Racines, l'émoji seulement en secours. */
export function Titre({ ico, emoji, children, style }: { ico: string; emoji: string; children: ReactNode; style?: React.CSSProperties }) {
  return <h1 className="titre-page" style={style}><Ico nom={ico} emoji={emoji} taille={44} /><span>{children}</span></h1>;
}

/** Imprime seulement l'élément désigné (étiquettes, plan) ; sans sélecteur, imprime la page sans les menus. */
export function imprimer(selecteur?: string) {
  const cible = selecteur ? document.querySelector(selecteur) : null;
  if (cible) { document.body.classList.add("impression-ciblee"); cible.classList.add("a-imprimer"); }
  const fin = () => { document.body.classList.remove("impression-ciblee"); cible?.classList.remove("a-imprimer"); window.removeEventListener("afterprint", fin); };
  window.addEventListener("afterprint", fin);
  window.print();
  setTimeout(fin, 1000);
}

// Sommaire des pages longues : une ligne de puces vers chaque titre (h2, ou élément marqué data-titre)
// de la page. Se met à jour quand le contenu change (onglets, cartes qui apparaissent).
export function Sommaire({ min = 3 }: { min?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [titres, setTitres] = useState<{ id: string; t: string }[]>([]);
  useEffect(() => {
    const page = ref.current?.parentElement;
    if (!page) return;
    const lire = () => {
      const els = [...page.querySelectorAll<HTMLElement>("h2, [data-titre]")].filter((e) => !e.closest("nav.sommaire") && e.offsetParent !== null);
      const t = els.map((e, i) => {
        if (!e.id) e.id = "s-" + i + "-" + (e.textContent ?? "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").slice(0, 30);
        const d = e.dataset.titre; // data-titre seul (valeur « true ») : on prend le texte du titre
        return { id: e.id, t: (d && d !== "true" ? d : e.textContent || "").trim() };
      }).filter((x) => x.t);
      setTitres((avant) => (JSON.stringify(avant) === JSON.stringify(t) ? avant : t));
    };
    lire();
    const mo = new MutationObserver(() => lire());
    mo.observe(page, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return (
    <nav ref={ref} className="sommaire chips small" aria-label="Sur cette page" style={{ margin: "6px 0 10px", display: titres.length >= min ? undefined : "none" }}>
      <span className="muted" style={{ alignSelf: "center" }}>Sur cette page :</span>
      {titres.map((x) => <a key={x.id} className="chip" href={`#${x.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(x.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{x.t}</a>)}
    </nav>
  );
}
