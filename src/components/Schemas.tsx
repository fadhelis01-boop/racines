// Schémas pédagogiques dessinés en SVG : nets à toute taille, légers, lisibles en clair et en sombre
// (couleurs du thème), avec un texte alternatif complet pour la lecture d'écran.
// Charte : traits de 2 px, coins arrondis, palette du thème (vert = vivant, terre = sol, bleu = eau,
// soleil = énergie, danger = menace), légendes courtes en minuscules, flèches pleines pour les flux.
import type { ReactNode } from "react";

const T = { texte: "var(--text)", muted: "var(--muted)", vert: "var(--green)", vertDoux: "var(--green-soft)", terre: "var(--terra)", terreDouce: "var(--terra-soft)", eau: "var(--info)", eauDouce: "var(--info-soft)", soleil: "var(--sun)", soleilDoux: "var(--sun-soft)", danger: "var(--danger)", fond: "var(--surface-2)", ligne: "var(--line)" };
const txt = (x: number, y: number, s: string, o: { taille?: number; ancre?: "start" | "middle" | "end"; gras?: boolean; couleur?: string } = {}) => (
  <text x={x} y={y} fontSize={o.taille ?? 12} textAnchor={o.ancre ?? "middle"} fontWeight={o.gras ? 700 : 400} style={{ fill: o.couleur ?? T.texte }}>{s}</text>
);
function Fleche({ id, couleur }: { id: string; couleur: string }) {
  return <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style={{ fill: couleur }} /></marker>;
}
function Cadre({ titre, alt, w, h, children, legende }: { titre: string; alt: string; w: number; h: number; children: ReactNode; legende?: string }) {
  return (
    <figure className="schema card" style={{ margin: "12px 0" }}>
      {/* Sur téléphone, le schéma garde une largeur lisible et défile de côté */}
      <div style={{ overflowX: "auto" }}><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={alt} style={{ width: "100%", minWidth: Math.min(w, 540), maxWidth: w * 1.2, display: "block", margin: "0 auto" }}>{children}</svg></div>
      <figcaption className="small muted" style={{ textAlign: "center", marginTop: 6 }}><b style={{ color: "var(--text)" }}>{titre}</b>{legende ? ` — ${legende}` : ""}</figcaption>
    </figure>
  );
}

export function CycleAzote() {
  const boites: [number, number, string, string, string][] = [
    [40, 30, "azote de l'air", "N₂ (78 % de l'air)", T.eauDouce],
    [250, 30, "légumineuses", "nodosités : fixation", T.vertDoux],
    [430, 140, "matière organique", "feuilles, fumier, compost", T.terreDouce],
    [250, 250, "nitrates du sol", "NO₃⁻ : nourriture des plantes", T.soleilDoux],
    [40, 140, "plantes", "absorbent les nitrates", T.vertDoux],
  ];
  return (
    <Cadre w={600} h={330} titre="Le cycle de l'azote" legende="les vers et les bactéries transforment la matière organique en nitrates ; en trop, ils filent vers la nappe" alt="Schéma du cycle de l'azote : l'azote de l'air est fixé par les légumineuses ; la matière organique (feuilles, fumier, compost) est décomposée par la vie du sol en nitrates ; les plantes absorbent les nitrates puis retournent au sol en matière organique ; les nitrates en excès sont lessivés vers la nappe par la pluie.">
      <defs><Fleche id="fa" couleur={T.vert} /><Fleche id="fd" couleur={T.danger} /></defs>
      {boites.map(([x, y, a, b, c]) => <g key={a}><rect x={x} y={y} width={150} height={52} rx={10} style={{ fill: c, stroke: T.ligne }} />{txt(x + 75, y + 22, a, { gras: true })}{txt(x + 75, y + 40, b, { taille: 10, couleur: T.muted })}</g>)}
      <g style={{ stroke: T.vert }} strokeWidth={2} fill="none" markerEnd="url(#fa)">
        <path d="M190 56 L246 56" />
        <path d="M400 70 Q480 90 500 136" />
        <path d="M500 192 Q480 260 404 272" />
        <path d="M246 276 Q120 270 115 196" />
        <path d="M190 160 Q320 120 426 160" />
      </g>
      {txt(318, 140, "chute des feuilles, résidus", { taille: 10, couleur: T.muted })}
      {txt(512, 236, "vie du sol", { taille: 10, couleur: T.muted, ancre: "start" })}
      {txt(128, 248, "racines", { taille: 10, couleur: T.muted, ancre: "end" })}
      <path d="M325 302 L325 322" style={{ stroke: T.danger }} strokeWidth={2} markerEnd="url(#fd)" />
      {txt(315, 318, "lessivage vers la nappe (sol nu en hiver)", { taille: 10, couleur: T.danger, ancre: "end" })}
    </Cadre>
  );
}

export function HorizonsSol() {
  const couches: [number, string, string, string][] = [
    [30, "O · litière", "feuilles, débris en décomposition", T.vertDoux],
    [30, "A · terre arable", "foncée, riche en humus et en vie : les racines y puisent l'essentiel", T.terreDouce],
    [60, "B · sous-sol", "plus clair, argile et minéraux lessivés d'en haut", T.soleilDoux],
    [60, "C · roche altérée", "cailloux et roche-mère qui se fragmente", T.fond],
  ];
  let y = 20;
  return (
    <Cadre w={640} h={250} titre="Les horizons du sol" legende="creusez un trou de 50 cm à la bêche : la couleur et la profondeur de l'horizon A disent la fertilité" alt="Coupe d'un sol en quatre couches : en haut la litière (O), puis la terre arable foncée riche en humus (A), le sous-sol plus clair (B), et la roche altérée (C) en bas.">
      {couches.map(([h, n, d, c]) => { const yy = y; y += h + 6; return <g key={n}><rect x={20} y={yy} width={200} height={h} rx={6} style={{ fill: c, stroke: T.ligne }} />{txt(232, yy + h / 2 - 2, n, { ancre: "start", gras: true })}{txt(232, yy + h / 2 + 13, d, { ancre: "start", taille: 10, couleur: T.muted })}</g>; })}
      <g style={{ stroke: T.vert }} strokeWidth={2} fill="none">
        <path d="M80 20 L80 4 M74 10 L80 4 L86 10" />
        <path d="M80 50 Q76 80 70 110 M80 70 Q90 90 98 100 M70 110 Q66 140 72 170" />
        <path d="M160 20 L160 8 M154 14 L160 8 L166 14" /><path d="M160 50 Q164 75 158 95 M158 95 Q150 115 156 130" />
      </g>
    </Cadre>
  );
}

export function BourgeonsFruitiers() {
  const bourgeon = (x: number, y: number, gros: boolean) => <ellipse cx={x} cy={y} rx={gros ? 9 : 5} ry={gros ? 12 : 9} style={{ fill: gros ? T.soleil : T.vert, stroke: T.texte }} strokeWidth={1} />;
  return (
    <Cadre w={560} h={250} titre="Bourgeon à bois ou à fleurs ?" legende="à la taille d'hiver, on garde assez de bourgeons à fleurs (ronds) et on raccourcit au-dessus d'un bourgeon à bois (pointu) tourné vers l'extérieur" alt="Rameau de pommier : le bourgeon à bois est petit, pointu et plaqué contre le rameau, il donnera une pousse feuillée ; le bourgeon à fleurs est gros, rond et duveteux, souvent au bout d'un court rameau (dard ou lambourde), il donnera fleurs puis fruits.">
      <path d="M40 200 Q200 170 520 120" style={{ stroke: T.terre }} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M200 176 L214 140" style={{ stroke: T.terre }} strokeWidth={5} strokeLinecap="round" />
      <path d="M380 146 L392 106" style={{ stroke: T.terre }} strokeWidth={5} strokeLinecap="round" />
      {bourgeon(120, 182, false)}{bourgeon(300, 156, false)}{bourgeon(470, 124, false)}
      {bourgeon(216, 128, true)}{bourgeon(394, 94, true)}
      <g style={{ stroke: T.muted }} strokeWidth={1}><path d="M120 172 L120 60" /><path d="M216 116 L250 50" /></g>
      {txt(120, 52, "bourgeon à bois", { gras: true, couleur: T.vert })}{txt(120, 36, "petit, pointu, plaqué", { taille: 10, couleur: T.muted })}
      {txt(300, 42, "bourgeon à fleurs", { gras: true, couleur: "var(--sun-text)" })}{txt(300, 26, "gros, rond, sur un court rameau", { taille: 10, couleur: T.muted })}
      {txt(470, 210, "coupe de taille : 5 mm au-dessus", { taille: 10, couleur: T.muted })}
      <path d="M455 104 L490 92" style={{ stroke: T.danger }} strokeWidth={2} strokeDasharray="4 3" />
    </Cadre>
  );
}

export function GreffeFente() {
  return (
    <Cadre w={560} h={270} titre="La greffe en fente" legende="fin d'hiver, sève qui monte : les écorces (cambium) du greffon et du porte-greffe doivent se toucher sur un côté au moins" alt="Greffe en fente en trois étapes : 1, le porte-greffe est coupé net puis fendu au centre ; 2, le greffon, rameau de trois yeux, est taillé en biseau double ; 3, le greffon est glissé dans la fente en alignant les écorces sur un côté, puis la plaie est ligaturée et couverte de mastic.">
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 180;
        return (
          <g key={i}>
            {txt(x + 60, 24, `${i + 1}`, { gras: true, taille: 16, couleur: T.vert })}
            <rect x={x + 30} y={150} width={60} height={100} rx={4} style={{ fill: T.terreDouce, stroke: T.terre }} strokeWidth={2} />
            {i >= 0 && <path d={`M${x + 60} 150 L${x + 60} ${i === 0 ? 200 : 190}`} style={{ stroke: T.terre }} strokeWidth={2} />}
            {i >= 1 && (() => {
              // Étape 2 : le greffon taillé, posé à côté ; étape 3 : glissé dans la fente, pointe dans le porte-greffe
              const gx = i === 1 ? x + 104 : x + 44, haut = i === 1 ? 50 : 80;
              return <g><path d={`M${gx} ${haut} l0 70 l8 30 l8 -30 l0 -70 z`} style={{ fill: T.vertDoux, stroke: T.vert }} strokeWidth={2} />
                {[14, 34, 54].map((dy) => <circle key={dy} cx={gx + 16} cy={haut + dy} r={3} style={{ fill: T.vert }} />)}</g>;
            })()}
            {i === 2 && <rect x={x + 28} y={152} width={64} height={14} rx={3} style={{ fill: T.soleilDoux, stroke: T.soleil }} />}
          </g>
        );
      })}
      {txt(100, 264, "couper, fendre", { taille: 10, couleur: T.muted })}{txt(280, 264, "greffon en biseau, 3 yeux", { taille: 10, couleur: T.muted })}{txt(460, 264, "écorces alignées, lier, mastic", { taille: 10, couleur: T.muted })}
    </Cadre>
  );
}

export function Rotation4Ans() {
  const p: [string, string, string, number, number][] = [
    ["1 · légumes-fruits", "tomate, courge, aubergine", T.terreDouce, 150, 70],
    ["2 · légumes-feuilles", "chou, salade, poireau", T.vertDoux, 410, 70],
    ["3 · légumes-racines", "carotte, betterave, oignon", T.soleilDoux, 410, 210],
    ["4 · légumineuses", "pois, fève, haricot", T.eauDouce, 150, 210],
  ];
  return (
    <Cadre w={560} h={290} titre="La rotation sur 4 ans" legende="chaque famille change de planche chaque année : moins de maladies, un sol moins épuisé, et les légumineuses rendent l'azote aux gourmands" alt="Quatre planches en cercle : année 1 légumes-fruits gourmands avec compost, année 2 légumes-feuilles, année 3 légumes-racines, année 4 légumineuses qui enrichissent le sol en azote, puis retour aux légumes-fruits.">
      <defs><Fleche id="fr" couleur={T.vert} /></defs>
      {p.map(([a, b, c, x, y]) => <g key={a}><rect x={x - 115} y={y - 32} width={230} height={64} rx={12} style={{ fill: c, stroke: T.ligne }} />{txt(x, y - 4, a, { gras: true })}{txt(x, y + 14, b, { taille: 10, couleur: T.muted })}</g>)}
      <g style={{ stroke: T.vert }} strokeWidth={2.5} fill="none" markerEnd="url(#fr)">
        <path d="M268 70 L292 70" /><path d="M410 104 L410 176" /><path d="M292 210 L268 210" /><path d="M150 176 L150 104" />
      </g>
      {txt(280, 146, "compost avant", { taille: 10, couleur: T.muted })}{txt(280, 160, "les légumes-fruits", { taille: 10, couleur: T.muted })}
      {txt(280, 272, "azote rendu au sol par les nodosités", { taille: 10, couleur: T.muted })}
    </Cadre>
  );
}

export function CycleVarroa() {
  const etapes: [string, string][] = [["phorésie", "sur l'abeille adulte, 5 à 10 jours"], ["entrée", "dans la cellule juste avant l'operculation"], ["ponte", "sous l'opercule : la mère pond 4 à 6 œufs"], ["sortie", "avec l'abeille qui naît : 1 à 2 filles fécondées"]];
  const cx = 340, cy = 150, r = 100;
  return (
    <Cadre w={680} h={310} titre="Le cycle du varroa" legende="il se multiplie surtout dans le couvain de mâles ; un traitement n'atteint que les varroas sur les abeilles, d'où les traitements hors couvain (hiver, encagement de reine)" alt="Cycle du varroa en quatre étapes : phase phorétique sur l'abeille adulte ; entrée dans une cellule de larve juste avant l'operculation ; ponte sous l'opercule pendant la nymphose ; sortie avec la jeune abeille, accompagné de nouvelles femelles fécondées. La population double environ chaque mois en saison.">
      <defs><Fleche id="fv" couleur={T.danger} /></defs>
      <circle cx={cx} cy={cy} r={r} fill="none" style={{ stroke: T.ligne }} strokeWidth={10} />
      {etapes.map(([a, b], i) => {
        const ang = (-90 + i * 90) * (Math.PI / 180);
        const x = cx + Math.cos(ang) * (r + 0), y = cy + Math.sin(ang) * (r + 0);
        const cote = i === 1 ? 1 : i === 3 ? -1 : 0;
        const lx = cote ? x + cote * 26 : x, ly = cote ? y : i === 0 ? y - 32 : y + 34;
        const ancre = cote === 1 ? "start" : cote === -1 ? "end" : "middle";
        return <g key={a}><circle cx={x} cy={y} r={16} style={{ fill: T.danger }} /><ellipse cx={x} cy={y} rx={9} ry={6} style={{ fill: "var(--surface)" }} />{txt(lx, ly - 2, a, { gras: true, ancre })}{txt(lx, ly + 13, b, { taille: 10, couleur: T.muted, ancre })}</g>;
      })}
      <path d={`M${cx + 72} ${cy - 72} A ${r} ${r} 0 0 1 ${cx + 72} ${cy + 72}`} fill="none" style={{ stroke: T.danger }} strokeWidth={2} markerEnd="url(#fv)" />
      <path d={`M${cx - 72} ${cy + 72} A ${r} ${r} 0 0 1 ${cx - 72} ${cy - 72}`} fill="none" style={{ stroke: T.danger }} strokeWidth={2} markerEnd="url(#fv)" />
      {txt(cx, cy - 4, "×2", { gras: true, taille: 22, couleur: T.danger })}{txt(cx, cy + 16, "par mois en saison", { taille: 10, couleur: T.muted })}
    </Cadre>
  );
}

export function StructureRuche() {
  const el: [number, number, string, string, string][] = [
    [20, 26, "toit", "tôle ou bois, protège de la pluie", T.fond],
    [16, 18, "couvre-cadres", "isole, nourrisseur au-dessus", T.ligne],
    [60, 46, "hausse", "le miel du récolteur (cadres bas)", T.soleilDoux],
    [8, 0, "grille à reine", "la reine ne monte pas pondre", T.muted],
    [100, 90, "corps", "couvain et réserves de la colonie : on n'y récolte pas", T.terreDouce],
    [16, 0, "plateau", "grillagé, avec lange de comptage du varroa", T.ligne],
  ];
  let y = 14;
  return (
    <Cadre w={620} h={300} titre="La ruche Dadant, de haut en bas" legende="on ne récolte que les hausses posées au-dessus de la grille à reine" alt="Ruche Dadant en coupe, de haut en bas : toit ; couvre-cadres ; hausse à cadres bas pour le miel récolté ; grille à reine ; corps à grands cadres où vivent la reine, le couvain et les réserves de la colonie ; plateau grillagé avec un lange pour compter les varroas ; trou de vol à l'avant.">
      {el.map(([h, , n, d, c]) => {
        const yy = y; y += h + 4;
        return <g key={n}>
          <rect x={n === "toit" ? 30 : 40} y={yy} width={n === "toit" ? 220 : 200} height={h} rx={3} style={{ fill: c, stroke: T.texte }} strokeWidth={n === "grille à reine" ? 0 : 1.2} strokeDasharray={n === "grille à reine" ? "" : undefined} />
          {(n === "hausse" || n === "corps") && Array.from({ length: 9 }, (_, i) => <line key={i} x1={58 + i * 20} x2={58 + i * 20} y1={yy + 6} y2={yy + h - 6} style={{ stroke: T.terre }} strokeWidth={2} />)}
          <line x1={252} x2={290} y1={yy + h / 2} y2={yy + h / 2} style={{ stroke: T.muted }} strokeWidth={1} />
          {txt(296, yy + h / 2 - 1, n, { ancre: "start", gras: true })}{txt(296, yy + h / 2 + 13, d, { ancre: "start", taille: 10, couleur: T.muted })}
        </g>;
      })}
      <rect x={110} y={y - 22} width={60} height={6} rx={2} style={{ fill: T.texte }} />
      {txt(140, y - 2, "trou de vol", { taille: 10, couleur: T.muted })}
    </Cadre>
  );
}

// Où chaque schéma apparaît : tutoriels et leçons du cours d'agronomie
export const SCHEMAS: { id: string; titre: string; C: () => JSX.Element; guides: string[] }[] = [
  { id: "azote", titre: "Le cycle de l'azote", C: CycleAzote, guides: ["nitrates", "compost-cn", "engrais-verts", "jardiner-bio"] },
  { id: "horizons", titre: "Les horizons du sol", C: HorizonsSol, guides: ["connaitre-sol", "analyse-sol", "drainage-terrain", "climat-erosion"] },
  { id: "bourgeons", titre: "Bourgeon à bois ou à fleurs", C: BourgeonsFruitiers, guides: ["taille-par-fruitier", "formes-fruitieres", "taille-fruitiers", "arbo-eclaircissage-gel"] },
  { id: "greffe", titre: "La greffe en fente", C: GreffeFente, guides: ["greffe", "produire-ses-plants"] },
  { id: "rotation", titre: "La rotation sur 4 ans", C: Rotation4Ans, guides: ["rotation", "engrais-verts"] },
  { id: "varroa", titre: "Le cycle du varroa", C: CycleVarroa, guides: ["api-varroa"] },
  { id: "ruche", titre: "La ruche Dadant", C: StructureRuche, guides: ["api-materiel", "api-visite", "recolte-miel"] },
];
export const schemasDuGuide = (id: string) => SCHEMAS.filter((s) => s.guides.includes(id));
