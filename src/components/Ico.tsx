import { useState } from "react";
import icones from "../data/local-icones.json";
import localImages from "../data/local-images.json";
import wiki from "../data/wiki.json";

// Illustrations à la place des pictogrammes :
//  • <Ico nom="calendrier" /> : icône aquarelle générée (public/ico), sinon l'emoji ;
//  • <Vignette id="tomate" /> : petite photo ronde de la fiche (illustration ou photo libre).
const ICONES = new Set(icones as string[]);
const LOCAL = new Set(localImages as string[]);
const W = wiki as unknown as Record<string, { photos?: { img: string }[] }>;

export function Ico({ nom, emoji, taille = 24, alt = "" }: { nom: string; emoji: string; taille?: number; alt?: string }) {
  const [err, setErr] = useState(false);
  if (!ICONES.has(nom) || err) return <span aria-hidden={!alt} style={{ fontSize: taille * 0.8, lineHeight: 1, display: "inline-block", width: taille, textAlign: "center" }}>{emoji}</span>;
  return <img src={`./ico/${nom}.webp`} alt={alt} width={taille} height={taille} loading="lazy" onError={() => setErr(true)} style={{ width: taille, height: taille, objectFit: "contain", verticalAlign: "middle", flexShrink: 0 }} />;
}

export function srcVignette(id?: string) {
  if (!id) return undefined;
  if (LOCAL.has(id)) return `./img/${id}.webp`;
  return W[id]?.photos?.[0]?.img;
}

export function Vignette({ id, emoji, taille = 36 }: { id?: string; emoji: string; taille?: number }) {
  const [err, setErr] = useState(false);
  const src = srcVignette(id);
  if (!src || err) return <span aria-hidden="true" style={{ width: taille, height: taille, borderRadius: "50%", background: "var(--surface-2)", display: "inline-grid", placeItems: "center", fontSize: taille * 0.5, flexShrink: 0 }}>{emoji}</span>;
  return <img src={src} alt="" crossOrigin={src.startsWith("http") ? "anonymous" : undefined} loading="lazy" onError={() => setErr(true)} style={{ width: taille, height: taille, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }} />;
}
