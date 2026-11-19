// Compteur commun à tous les fichiers de tests
export const bilanTests = { fails: 0, n: 0 };
export const ok = (c: boolean, m: string) => { bilanTests.n++; if (!c) { bilanTests.fails++; console.error("✗ " + m); } };
export function bilan(nom: string) {
  const { fails, n } = bilanTests;
  console.log(fails ? `✗ ${fails}/${n} test(s) en échec` : `✓ ${n} tests ${nom} réussis`);
  if (fails) process.exit(1);
}
