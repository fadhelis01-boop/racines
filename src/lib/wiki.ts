import { useSyncExternalStore } from "react";

// Les crédits et adresses des photos libres (≈ 1,5 Mo) ne bloquent plus le premier affichage :
// ils sont chargés juste après, puis les vignettes et photos apparaissent.
export type PhotoLibre = { img: string; full: string; page: string; auteur: string; licence: string };
export type WikiMap = Record<string, { photos: PhotoLibre[]; article: string }>;

let data: WikiMap | null = null;
let promesse: Promise<WikiMap> | null = null;
const abonnes = new Set<() => void>();

export function chargerWiki(): Promise<WikiMap> {
  if (!promesse) {
    promesse = import("../data/wiki.json").then((m) => {
      data = m.default as unknown as WikiMap;
      abonnes.forEach((f) => f());
      return data;
    });
  }
  return promesse;
}

/** Lance le chargement quand le navigateur a fini le premier affichage. */
export function chargerWikiPlusTard() {
  const go = () => void chargerWiki();
  const w = globalThis as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => void };
  if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 1500 });
  else setTimeout(go, 300);
}

export const wikiCharge = () => data;

/** Re-rend le composant quand les photos sont disponibles. */
export function useWiki(): WikiMap | null {
  return useSyncExternalStore(
    (cb) => { abonnes.add(cb); return () => abonnes.delete(cb); },
    () => data,
    () => data,
  );
}
