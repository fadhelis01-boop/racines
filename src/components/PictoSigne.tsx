// Pictogrammes des signes de maladie (diagnostic) : une forme de base (feuille, fruit, pot, plante,
// racine, tronc) et un motif qui montre le symptôme. Dessinés en SVG avec les couleurs du thème,
// pour reconnaître d'un coup d'œil « taches », « poudre », « trous »… même sans lire le libellé.
type Base = "feuille" | "fruit" | "pot" | "plante" | "racine" | "tronc";
type Motif =
  | "taches" | "taches-jaunes" | "poudre" | "duvet" | "pustules" | "trous" | "petits-trous" | "enroulee" | "jaune" | "nervures"
  | "fletrie" | "pourri" | "cul-noir" | "ver" | "fendu" | "colonies" | "mouches" | "toile" | "fourmis" | "miellat" | "carapaces"
  | "galeries" | "bave" | "couchee" | "abimees" | "chenille" | "rayures" | "montee" | "points" | "mosaique" | "coupee" | "monticule"
  | "pointes" | "etiolee" | "moucherons" | "mouillee" | "gomme" | "chute" | "momies" | "brulure" | "seche" | "tombent" | "terreau"
  | "violet" | "gouttes" | "sans-fleur" | "racines-sortent" | "vieille-jaune" | "nid" | "cloques";

const PICTOS: Record<string, [Base, Motif]> = {
  "taches-brunes": ["feuille", "taches"], "taches-jaunes": ["feuille", "taches-jaunes"], "feutrage-blanc": ["feuille", "poudre"], "duvet-gris": ["fruit", "duvet"],
  pustules: ["feuille", "pustules"], "trous-feuilles": ["feuille", "trous"], "petits-trous": ["feuille", "petits-trous"], "feuilles-deformees": ["feuille", "enroulee"],
  jaunissement: ["feuille", "jaune"], "nervures-vertes": ["feuille", "nervures"], fletrissement: ["plante", "fletrie"], "fruit-pourri": ["fruit", "pourri"],
  "cul-noir": ["fruit", "cul-noir"], "fruit-vereux": ["fruit", "ver"], "fruit-fendu": ["fruit", "fendu"], colonies: ["feuille", "colonies"],
  "mouches-blanches": ["feuille", "mouches"], toile: ["feuille", "toile"], fourmis: ["pot", "fourmis"], miellat: ["feuille", "miellat"],
  carapaces: ["feuille", "carapaces"], galeries: ["feuille", "galeries"], bave: ["feuille", "bave"], "plantule-couchee": ["plante", "couchee"],
  "racines-abimees": ["racine", "abimees"], chenilles: ["feuille", "chenille"], "larves-rayees": ["feuille", "rayures"], montaison: ["plante", "montee"],
  "points-argentes": ["feuille", "points"], mosaique: ["feuille", "mosaique"], disparition: ["plante", "coupee"], monticules: ["plante", "monticule"],
  "pointes-brunes": ["feuille", "pointes"], etiolement: ["plante", "etiolee"], moucherons: ["pot", "moucherons"], "terre-mouillee": ["pot", "mouillee"],
  gomme: ["tronc", "gomme"], "fleurs-tombent": ["plante", "chute"], "fruits-momifies": ["fruit", "momies"], "coup-soleil": ["feuille", "brulure"],
  "terre-seche": ["pot", "seche"], "feuilles-tombent": ["plante", "tombent"], "terreau-blanc": ["pot", "terreau"], "feuilles-violacees": ["feuille", "violet"],
  "gouttes-feuilles": ["feuille", "gouttes"], "pas-de-fleurs": ["plante", "sans-fleur"], "racines-sortent": ["pot", "racines-sortent"],
  "vieilles-feuilles-jaunes": ["plante", "vieille-jaune"], "nids-soyeux": ["tronc", "nid"], "cloques-liegeuses": ["feuille", "cloques"],
};
export const signesSansPicto = (ids: string[]) => ids.filter((id) => !PICTOS[id]);

const C = { vert: "var(--green)", vertDoux: "var(--green-soft)", terre: "var(--terra)", terreDouce: "var(--terra-soft)", jaune: "var(--sun)", brun: "#7a4a22", noir: "var(--text)", blanc: "#f4f4ef", danger: "var(--danger)", eau: "var(--info)", gris: "var(--muted)" };
const s = (fill: string, stroke?: string) => ({ fill, stroke: stroke ?? "none" });
const FEUILLE = "M24 42 C8 34 6 16 24 6 C42 16 40 34 24 42 z";

function base(b: Base, m: Motif) {
  const feuilleCouleur = m === "jaune" || m === "nervures" ? C.jaune : m === "violet" ? "#6b3a6e" : m === "mosaique" ? C.vertDoux : C.vertDoux;
  switch (b) {
    case "feuille": return <>{m === "enroulee" ? <path d="M24 42 C10 36 4 22 16 10 C20 18 30 12 34 8 C44 22 36 36 24 42 z" style={s(feuilleCouleur, C.vert)} strokeWidth={2} /> : <path d={FEUILLE} style={s(feuilleCouleur, C.vert)} strokeWidth={2} />}<path d="M24 42 L24 10" style={s("none", m === "nervures" ? C.vert : C.vert)} strokeWidth={m === "nervures" ? 2.5 : 1.2} />{m === "nervures" && <path d="M24 30 L14 22 M24 30 L34 22 M24 20 L16 14 M24 20 L32 14" style={s("none", C.vert)} strokeWidth={2} />}</>;
    case "fruit": return <><circle cx={24} cy={27} r={15} style={s(m === "momies" ? C.brun : "#e05a3a", "#9a2f1a")} strokeWidth={1.5} /><path d="M24 12 l-4 -5 M24 12 l5 -5 M24 12 l0 -6" style={s("none", C.vert)} strokeWidth={2} /></>;
    case "pot": return <><path d="M12 24 L36 24 L33 44 L15 44 z" style={s(C.terre, C.terre)} /><rect x={10} y={21} width={28} height={5} rx={1.5} style={s(C.terre)} /><path d="M24 21 L24 10 M24 14 q-6 -4 -9 -2 M24 12 q6 -4 9 -2" style={s("none", C.vert)} strokeWidth={2} /></>;
    case "plante": return <><path d="M6 44 L42 44" style={s("none", C.terre)} strokeWidth={3} /></>;
    case "racine": return <><path d="M6 14 L42 14" style={s("none", C.terre)} strokeWidth={3} /><path d="M24 4 L24 14" style={s("none", C.vert)} strokeWidth={3} /></>;
    case "tronc": return <><rect x={18} y={4} width={12} height={40} rx={4} style={s(C.terreDouce, C.brun)} strokeWidth={1.5} /></>;
  }
}

function motif(m: Motif) {
  const pts = (l: [number, number][], r: number, f: string, st?: string) => l.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} style={s(f, st)} />);
  switch (m) {
    case "taches": return pts([[18, 20], [30, 26], [21, 32]], 3.5, C.brun);
    case "taches-jaunes": return pts([[18, 20], [30, 26], [21, 32]], 3.5, C.jaune);
    case "poudre": return <g>{[[18, 18], [26, 16], [30, 24], [22, 26], [18, 32], [27, 32]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.2} style={s("#ffffff", "#a9a99f")} strokeWidth={0.8} />)}</g>;
    case "duvet": return <g>{[[18, 22], [26, 20], [30, 28], [20, 30], [26, 32]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} style={s("#c9c9c3")} />)}</g>;
    case "pustules": return pts([[17, 18], [22, 24], [30, 22], [19, 31], [28, 32], [25, 15]], 2, "#d4791f");
    case "trous": return <><path d="M14 22 q4 -5 8 0 q-3 6 -8 0 z" style={s("var(--surface-2)", C.brun)} strokeWidth={1} /><circle cx={29} cy={29} r={4.5} style={s("var(--surface-2)", C.brun)} strokeWidth={1} /><path d="M32 13 q-5 3 -2 7 l5 -2 z" style={s("var(--surface-2)", C.brun)} strokeWidth={1} /></>;
    case "petits-trous": return pts([[17, 18], [22, 24], [30, 21], [19, 31], [28, 32], [25, 15], [31, 27], [15, 25]], 1.8, "var(--surface-2)", C.brun);
    case "enroulee": return null;
    case "jaune": case "nervures": case "violet": return null;
    case "fletrie": return <path d="M24 44 C24 34 26 26 20 22 C16 20 12 24 10 30 M20 22 C26 18 34 22 36 30" style={s("none", C.vert)} strokeWidth={3} strokeLinecap="round" />;
    case "pourri": return <path d="M16 30 C16 22 26 20 32 28 C34 36 24 40 18 36 z" style={s("#5a3a1e")} opacity={0.85} />;
    case "cul-noir": return <ellipse cx={24} cy={39} rx={7} ry={3.5} style={s("#1e1a16")} />;
    case "ver": return <><circle cx={30} cy={24} r={2.4} style={s("#3a2a1a")} /><path d="M30 24 q-6 4 -4 10" style={s("none", "#3a2a1a")} strokeWidth={1.5} /></>;
    case "fendu": return <path d="M18 18 L22 26 L19 32 L24 38" style={s("none", "#5a1a0a")} strokeWidth={2} />;
    case "colonies": return pts([[18, 22], [21, 25], [24, 22], [27, 26], [22, 29], [26, 31]], 1.8, "#2f4f2a");
    case "mouches": return <g>{[[16, 12], [30, 10], [36, 18], [12, 20]].map(([x, y], i) => <g key={i}><ellipse cx={x - 1.5} cy={y} rx={2} ry={1.2} style={s(C.blanc, C.gris)} strokeWidth={0.6} /><ellipse cx={x + 1.5} cy={y} rx={2} ry={1.2} style={s(C.blanc, C.gris)} strokeWidth={0.6} /></g>)}</g>;
    case "toile": return <path d="M14 14 L34 34 M34 14 L14 34 M24 10 L24 38 M12 24 L36 24 M18 18 Q24 20 30 18 Q28 24 30 30 Q24 28 18 30 Q20 24 18 18" style={s("none", C.gris)} strokeWidth={0.8} />;
    case "fourmis": return <g>{[[14, 40], [24, 46], [34, 40]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y - 4} r={1.6} style={s(C.noir)} /><circle cx={x + 3} cy={y - 4} r={1.2} style={s(C.noir)} /><circle cx={x + 5.5} cy={y - 4} r={1.8} style={s(C.noir)} /></g>)}</g>;
    case "miellat": return <path d="M16 18 C20 14 30 16 32 24 C34 32 22 36 16 30 z" style={s("#2a2a26")} opacity={0.7} />;
    case "carapaces": return <>{pts([[19, 22], [28, 27]], 3, "#8a5a2a")}<circle cx={22} cy={32} r={3.5} style={s(C.blanc)} /></>;
    case "galeries": return <path d="M16 30 C18 22 22 26 24 20 C26 14 30 18 31 24" style={s("none", "#f4f1e4")} strokeWidth={2.6} strokeLinecap="round" />;
    case "bave": return <path d="M14 34 C18 26 26 32 30 22 C32 18 34 16 35 14" style={s("none", "#cfd8e6")} strokeWidth={2.5} strokeLinecap="round" />;
    case "couchee": return <><path d="M14 44 Q16 40 26 38 L36 36" style={s("none", C.vert)} strokeWidth={2.5} /><circle cx={15} cy={43} r={2} style={s(C.brun)} /><path d="M36 36 q4 -4 6 -2 M36 36 q3 2 6 0" style={s("none", C.vert)} strokeWidth={2} /></>;
    case "abimees": return <path d="M24 14 C22 24 26 30 22 40 M24 20 L16 28 M23 28 L32 34" style={s("none", "#c8a27a")} strokeWidth={3} strokeLinecap="round" strokeDasharray="5 2" />;
    case "chenille": return <g>{[14, 19, 24, 29].map((x, i) => <circle key={i} cx={x} cy={28 - i} r={3} style={s("#7fae3f", "#3f6a1f")} strokeWidth={0.8} />)}<circle cx={34} cy={23} r={3.2} style={s("#3f6a1f")} /></g>;
    case "rayures": return <><ellipse cx={24} cy={26} rx={6} ry={8} style={s("#e8c66a", C.noir)} strokeWidth={1} /><path d="M21 19 L21 33 M24 18 L24 34 M27 19 L27 33" style={s("none", C.noir)} strokeWidth={1.2} /></>;
    case "montee": return <><path d="M24 44 L24 8" style={s("none", C.vert)} strokeWidth={2.5} /><path d="M24 40 q-10 -2 -12 -8 M24 40 q10 -2 12 -8" style={s("none", C.vert)} strokeWidth={3} />{pts([[24, 7], [20, 12], [28, 12], [21, 18], [27, 18]], 2, C.jaune)}</>;
    case "points": return pts([[17, 18], [22, 24], [30, 21], [19, 31], [28, 32], [25, 15], [31, 27]], 1.8, "#e6eaee", "#8a96a0");
    case "mosaique": return <><path d="M14 24 L22 16 L28 22 L20 30 z" style={s(C.vert)} opacity={0.8} /><path d="M26 30 L32 24 L34 32 L28 36 z" style={s(C.vert)} opacity={0.8} /></>;
    case "coupee": return <><path d="M24 44 L24 34" style={s("none", C.vert)} strokeWidth={3} /><path d="M20 34 L28 34" style={s("none", C.danger)} strokeWidth={2} /><path d="M30 20 q4 -6 10 -4" style={s("none", C.vert)} strokeWidth={2} strokeDasharray="3 2" /></>;
    case "monticule": return <><path d="M10 44 Q18 30 26 44 z" style={s(C.terre)} /><path d="M28 44 Q34 34 40 44 z" style={s(C.terre)} /></>;
    case "pointes": return <><path d="M24 6 C30 10 33 13 35 16 L30 14 z" style={s(C.brun)} /><path d={FEUILLE} style={s("none", C.vert)} strokeWidth={2} /><path d="M18 8 L24 6 L22 12 z" style={s(C.brun)} /></>;
    case "etiolee": return <><path d="M24 44 C24 30 26 18 34 8" style={s("none", "#b9d48a")} strokeWidth={2} /><path d="M30 14 q4 -2 6 0" style={s("none", "#b9d48a")} strokeWidth={2} /><circle cx={42} cy={6} r={3} style={s(C.jaune)} /></>;
    case "moucherons": return pts([[16, 12], [22, 8], [30, 12], [34, 6], [12, 6]], 1.3, C.noir);
    case "mouillee": return <><path d="M14 30 L34 30" style={s("none", C.eau)} strokeWidth={2} /><path d="M18 34 l0 4 M24 33 l0 5 M30 34 l0 4" style={s("none", C.eau)} strokeWidth={2} strokeLinecap="round" /></>;
    case "gomme": return <><path d="M24 20 C20 22 20 28 22 30 C24 32 26 30 25 26" style={s("#d9a640", "#a07020")} strokeWidth={1} /><circle cx={23} cy={33} r={2} style={s("#d9a640")} /></>;
    case "chute": return <><path d="M24 44 L24 14" style={s("none", C.vert)} strokeWidth={2.5} /><circle cx={24} cy={12} r={4} style={s("#f2a9c4")} /><circle cx={34} cy={36} r={3} style={s("#f2a9c4")} /><circle cx={14} cy={40} r={3} style={s("#f2a9c4")} /><path d="M34 26 l0 6 M14 30 l0 6" style={s("none", C.gris)} strokeWidth={1} strokeDasharray="2 2" /></>;
    case "momies": return <><circle cx={24} cy={27} r={9} fill="none" style={{ stroke: "#e0d6b0" }} strokeWidth={1.5} /><circle cx={24} cy={27} r={4} fill="none" style={{ stroke: "#e0d6b0" }} strokeWidth={1.5} /></>;
    case "brulure": return <path d="M13 22 C15 15 25 13 29 18 C31 25 24 31 17 29 z" style={s("#efe6cf", "#b8a47a")} strokeWidth={1} />;
    case "seche": return <path d="M14 30 L18 34 L22 30 L26 34 L30 30 L34 34" style={s("none", "#a07a50")} strokeWidth={1.5} />;
    case "tombent": return <><path d="M24 44 L24 10" style={s("none", C.vert)} strokeWidth={2.5} /><path d={"M28 30 c4 -4 8 -2 8 2 c-4 2 -6 2 -8 -2 z"} style={s(C.jaune)} /><path d={"M14 38 c-4 -2 -6 2 -4 4 c4 0 4 -2 4 -4 z"} style={s(C.vertDoux, C.vert)} /><path d="M24 18 q6 -6 10 -4" style={s("none", C.vert)} strokeWidth={2} /></>;
    case "terreau": return <>{pts([[16, 25], [21, 24], [27, 25], [32, 24]], 2.2, C.blanc)}</>;
    case "gouttes": return <>{[[24, 4], [34, 14], [12, 18]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q-3 5 0 7 q3 -2 0 -7 z`} style={s(C.eau)} />)}</>;
    case "sans-fleur": return <><path d="M24 44 L24 14 M24 30 q-10 -2 -12 -10 M24 24 q10 -2 12 -10" style={s("none", C.vert)} strokeWidth={2.5} /><circle cx={24} cy={10} r={4} fill="none" style={{ stroke: C.gris }} strokeDasharray="2 2" /></>;
    case "racines-sortent": return <path d="M19 44 q-2 3 -6 3 M24 44 q0 3 2 4 M29 44 q3 2 6 1" style={s("none", "#c8a27a")} strokeWidth={2} />;
    case "vieille-jaune": return <><path d="M24 44 L24 8" style={s("none", C.vert)} strokeWidth={2.5} /><path d="M24 36 q-10 0 -14 6 q8 2 14 -6" style={s(C.jaune)} /><path d="M24 26 q10 -2 13 -8 q-9 0 -13 8" style={s(C.vertDoux, C.vert)} /><path d="M24 16 q-8 -2 -10 -8 q8 0 10 8" style={s(C.vertDoux, C.vert)} /></>;
    case "nid": return <><ellipse cx={24} cy={16} rx={10} ry={7} style={s("#ece9de", C.gris)} strokeWidth={0.8} /><path d="M10 34 q4 -3 8 0 q4 3 8 0 q4 -3 8 0" style={s("none", "#7a5a3a")} strokeWidth={3} strokeLinecap="round" /></>;
    case "cloques": return pts([[18, 22], [26, 18], [30, 28], [20, 31], [25, 26]], 2.4, "#c9b48a", "#8a7450");
  }
}

export function PictoSigne({ id, taille = 40 }: { id: string; taille?: number }) {
  const p = PICTOS[id];
  if (!p) return null;
  const [b, m] = p;
  return (
    <svg viewBox="0 0 48 48" width={taille} height={taille} aria-hidden="true" style={{ flexShrink: 0, verticalAlign: "middle", background: "var(--surface-2)", borderRadius: 8 }}>
      {base(b, m)}{motif(m)}
    </svg>
  );
}
