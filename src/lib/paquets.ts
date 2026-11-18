import { useState } from "react";

/** Affiche une longue liste par paquets ; revient au premier paquet quand les filtres changent. */
export function usePaquets<T>(list: T[], cle: string, taille = 30) {
  const [n, setN] = useState(taille);
  const [k, setK] = useState(cle);
  if (k !== cle) { setK(cle); setN(taille); }
  return { visibles: list.slice(0, n), reste: Math.max(0, list.length - n), plus: () => setN((x) => x + taille * 2) };
}
