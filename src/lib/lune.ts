// Phase de la lune et lune montante/descendante (calcul approché, précision
// d'environ une demi-journée : largement suffisant pour un calendrier).
// Le jardinage avec la lune est une tradition : aucune étude sérieuse n'a
// démontré d'effet sur les cultures. L'application l'affiche pour ceux qui
// la suivent, sans en faire une règle.

const SYNODIQUE = 29.530588853;
const REF_NOUVELLE = Date.UTC(2000, 0, 6, 18, 14) / 864e5; // nouvelle lune de référence

export interface InfoLune {
  age: number; // jours depuis la nouvelle lune
  illumination: number; // 0..1
  phase: string;
  emoji: string;
  montante: boolean;
  conseil: string;
}

export function lune(date = new Date()): InfoLune {
  const jd = date.getTime() / 864e5;
  const age = (((jd - REF_NOUVELLE) % SYNODIQUE) + SYNODIQUE) % SYNODIQUE;
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIQUE)) / 2;
  const phases: [number, string, string][] = [
    [1.85, "Nouvelle lune", "🌑"],
    [5.54, "Premier croissant", "🌒"],
    [9.23, "Premier quartier", "🌓"],
    [12.92, "Lune gibbeuse croissante", "🌔"],
    [16.61, "Pleine lune", "🌕"],
    [20.3, "Lune gibbeuse décroissante", "🌖"],
    [23.99, "Dernier quartier", "🌗"],
    [27.68, "Dernier croissant", "🌘"],
    [99, "Nouvelle lune", "🌑"],
  ];
  const [, phase, emoji] = phases.find(([lim]) => age < lim)!;
  // Longitude écliptique approchée (Meeus simplifié)
  const d = jd - 10957.5; // jours depuis J2000
  const L = 218.316 + 13.176396 * d;
  const M = (134.963 + 13.064993 * d) * (Math.PI / 180);
  const lon = ((((L + 6.289 * Math.sin(M)) % 360) + 360) % 360);
  // La déclinaison augmente quand la longitude va de 270° à 90° (en passant par 0°)
  const montante = lon >= 270 || lon < 90;
  const conseil = montante
    ? "Lune montante : selon la tradition, la sève monte. Période dite favorable aux semis, aux greffes et à la récolte des fruits et des feuilles."
    : "Lune descendante : selon la tradition, la sève descend. Période dite favorable aux plantations, repiquages, à la taille et aux travaux du sol.";
  return { age, illumination, phase, emoji, montante, conseil };
}
