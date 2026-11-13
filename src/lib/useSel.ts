import { useRef, useSyncExternalStore } from "react";

// Sélecteur stable : renvoie la valeur précédente si la nouvelle est
// superficiellement égale (évite les boucles de rendu quand un sélecteur
// construit un objet ou un tableau).
export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
  return true;
}

export function useSel<S, T>(subscribe: (cb: () => void) => () => void, get: () => S, sel: (s: S) => T): T {
  const last = useRef<{ v: T } | null>(null);
  return useSyncExternalStore(subscribe, () => {
    const v = sel(get());
    if (last.current && shallowEqual(last.current.v, v)) return last.current.v;
    last.current = { v };
    return v;
  });
}
