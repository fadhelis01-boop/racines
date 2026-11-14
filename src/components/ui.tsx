import { useEffect, useState, type ReactNode } from "react";
import { href, go } from "../lib/router";
import { play, pause, useTts } from "../lib/tts";
import { MOIS_COURTS, youtube, tiktok } from "../data/util";
import { ACTIONS, type Action, moisAffiches } from "../lib/calendar";
import { useStore, update, toggleFavori } from "../lib/store";
import type { Plante } from "../data/types";
import wiki from "../data/wiki.json";
import localImages from "../data/local-images.json";
const LOCAL = new Set(localImages as string[]);
import { loadPhoto } from "../lib/photos";

export const A = ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
  <a href={href(to)} className={className}>{children}</a>
);

export type PhotoLibre = { img: string; full: string; page: string; auteur: string; licence: string };
const WIKI = wiki as unknown as Record<string, { photos: PhotoLibre[]; article: string }>;
export const wikiOf = (id: string) => WIKI[id];
export const toutesLesPhotos = () => Object.values(WIKI).flatMap((w) => (w.photos ?? []).map((p) => p.img));

// Photo libre (Wikimedia) ou, à défaut, l'emoji de la fiche
export function Photo({ id, emoji, alt }: { id: string; emoji: string; alt: string; credit?: boolean }) {
  const w = WIKI[id];
  const [err, setErr] = useState(false);
  const local = `./img/${id}.webp`;
  const [src, setSrc] = useState<string | undefined>(LOCAL.has(id) ? local : w?.photos?.[0]?.img);
  if (err || !src) return <span aria-hidden="true">{emoji}</span>;
  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        crossOrigin={src.startsWith("http") ? "anonymous" : undefined}
        onError={() => {
          if (src === local && w?.photos?.[0]) setSrc(w.photos[0].img);
          else setErr(true);
        }}
      />

    </>
  );
}

export function Credit({ id, index = 0 }: { id: string; index?: number }) {
  const ph = WIKI[id]?.photos?.[index];
  if (!ph || (LOCAL.has(id) && index === 0)) return null;
  return (
    <div className="credit">
      Photo : {ph.auteur} — <a href={ph.page} target="_blank" rel="noreferrer">{ph.licence}</a>, via Wikimedia Commons
    </div>
  );
}

// Plusieurs vues de la plante (feuille, ensemble, fleur…) avec agrandissement
export function Galerie({ id, emoji, alt }: { id: string; emoji: string; alt: string }) {
  const photos = WIKI[id]?.photos ?? [];
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const local = LOCAL.has(id);
  if (local || photos.length <= 1) {
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
        <div className="t">{emoji} {title}</div>
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
  const acts = actions ?? (["semisAbri", "semisPlace", "plantation", "recolte", "taille"] as Action[]);
  return (
    <div>
      <div className="months" role="table" aria-label="Calendrier de culture">
        <div />
        {MOIS_COURTS.map((m, i) => <div key={m} className="head" style={{ fontWeight: i + 1 === now ? 900 : undefined }}>{m[0].toUpperCase()}</div>)}
        {plantes.flatMap((p) =>
          acts.filter((a) => p[a]?.length).map((a) => {
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
        {acts.map((a) => <span key={a}><i className={`m ${a}`} style={{ background: `var(--c-${a})` }} />{ACTIONS[a].emoji} {ACTIONS[a].label}</span>)}
      </div>
      <style>{`.legend i.semisAbri{background:#d7b46a}.legend i.semisPlace{background:#8bbf6a}.legend i.plantation{background:#4f9a5d}.legend i.recolte{background:#c9693c}.legend i.taille{background:#8a7a68}`}</style>
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

export function Empty({ emoji, children }: { emoji: string; children: ReactNode }) {
  return <div className="empty"><div className="e">{emoji}</div>{children}</div>;
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
