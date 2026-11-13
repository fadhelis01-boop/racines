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

const WIKI = wiki as Record<string, { img: string; page: string; titre: string }>;
export const wikiOf = (id: string) => WIKI[id];

// Photo libre (Wikimedia) ou, à défaut, l'emoji de la fiche
export function Photo({ id, emoji, alt }: { id: string; emoji: string; alt: string; credit?: boolean }) {
  const w = WIKI[id];
  const [err, setErr] = useState(false);
  const local = `./img/${id}.webp`;
  const [src, setSrc] = useState<string | undefined>(LOCAL.has(id) ? local : w?.img);
  if (err || !src) return <span aria-hidden="true">{emoji}</span>;
  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        crossOrigin={src.startsWith("http") ? "anonymous" : undefined}
        onError={() => {
          if (src === local && w) setSrc(w.img);
          else setErr(true);
        }}
      />

    </>
  );
}

export function Credit({ id }: { id: string }) {
  const w = WIKI[id];
  if (!w || LOCAL.has(id)) return null;
  return (
    <div className="credit">
      Photo : <a href={w.page} target="_blank" rel="noreferrer">Wikipédia / Wikimedia Commons</a> (licence libre, auteur sur la page source)
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
export function Videos({ id, query }: { id: string; query: string }) {
  const saved = useStore((s) => s.videos[id]);
  const [edit, setEdit] = useState(false);
  const [url, setUrl] = useState(saved ?? "");
  const yt = saved ? youtubeId(saved) : null;
  return (
    <div className="stack">
      <div className="row">
        <a className="btn" href={youtube(query)} target="_blank" rel="noreferrer">▶️ Tutoriels YouTube</a>
        <a className="btn" href={tiktok(query)} target="_blank" rel="noreferrer">🎵 Vidéos TikTok</a>
        <button className="btn ghost sm" onClick={() => setEdit(!edit)}>{saved ? "Changer ma vidéo" : "📌 Garder une vidéo"}</button>
      </div>
      <p className="small muted">Les liens ouvrent une recherche à jour (« {query} »). Quand vous trouvez une vidéo qui vous plaît, collez son adresse ici pour la retrouver directement dans la fiche.</p>
      {edit && (
        <div className="row">
          <input type="text" inputMode="url" placeholder="https://www.youtube.com/watch?v=… ou lien TikTok" value={url} onChange={(e) => setUrl(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <button className="btn primary" onClick={() => { update((s) => { const v = { ...s.videos }; if (url.trim()) v[id] = url.trim(); else delete v[id]; return { ...s, videos: v }; }); setEdit(false); }}>Enregistrer</button>
        </div>
      )}
      {saved && yt && (
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <iframe src={`https://www.youtube-nocookie.com/embed/${yt}`} title="Vidéo enregistrée" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        </div>
      )}
      {saved && !yt && <a className="btn" href={saved} target="_blank" rel="noreferrer">▶️ Ma vidéo enregistrée</a>}
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
