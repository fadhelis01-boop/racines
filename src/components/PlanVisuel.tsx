import { useEffect, useRef, useState } from "react";
import { useStore, upsert, remove, uid, setSettings, type Espace, type ElementPlan, type TypeElementPlan } from "../lib/store";
import { download, imprimer } from "./ui";
import { href } from "../lib/router";
import { ELEMENTS, OMBRE_MIDI, hauteurMax, besoinEau } from "../lib/plan";
export { besoinEau };
import { plante, FAMILLES, PLANTES } from "../data/index";
import { TYPES_ESPACE } from "../lib/garden";
import { meteo, type Meteo } from "../lib/meteo";
import type { Famille } from "../data/types";

// Plan du jardin à l'échelle : chaque emplacement est un rectangle (en mètres)
// qu'on déplace au doigt ; la couleur indique la famille cultivée cette année.

const COULEURS: Partial<Record<Famille, string>> = {
  solanacees: "#e07a5f", cucurbitacees: "#f2cc8f", fabacees: "#81b29a", brassicacees: "#6d9dc5", apiacees: "#f4a259",
  amaryllidacees: "#b388eb", asteracees: "#9bc53d", amaranthacees: "#c75b7a", poacees: "#e9c46a", lamiacees: "#57a773", rosacees: "#ef476f",
};

export function famillesDe(espaceId: string, annee: number, cultures: { espaceId?: string; planteId: string; date: string; fini?: string }[]) {
  return [...new Set(cultures.filter((c) => c.espaceId === espaceId && c.date.startsWith(String(annee))).map((c) => plante(c.planteId)?.famille).filter(Boolean))] as Famille[];
}

export default function PlanVisuel() {
  const espaces = useStore((s) => s.espaces.filter((e) => !e.archive));
  const elements = useStore((s) => s.elementsPlan ?? []);
  const cultures = useStore((s) => s.cultures);
  const nord = useStore((s) => s.settings.planNord ?? 0);
  const terrain = useStore((s) => s.settings.planTerrain ?? { l: 20, h: 12 });
  const setTerrain = (t: { l: number; h: number }) => setSettings({ planTerrain: t });
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [sel, setSel] = useState<string>("");
  const [ombre, setOmbre] = useState<"" | keyof typeof OMBRE_MIDI>("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; kind: "espace" | "element"; dx: number; dy: number } | null>(null);

  // Place automatiquement les emplacements qui n'ont pas encore de position
  useEffect(() => {
    let x = 0.5, y = 0.5, maxH = 0;
    for (const e of espaces) {
      if (e.x !== undefined) continue;
      const w = e.l ?? Math.max(1, Math.min(10, Math.round(((e.surface ?? 3) / 1.2) * 2) / 2));
      const h = e.p ?? (e.surface ? Math.max(0.6, Math.round((e.surface / w) * 2) / 2) : 1.2);
      if (x + w > terrain.l) { x = 0.5; y += maxH + 0.6; maxH = 0; }
      upsert("espaces", { ...e, x, y, l: w, p: h });
      x += w + 0.6; maxH = Math.max(maxH, h);
    }
  }, [espaces, terrain.l]);

  const point = (ev: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * terrain.l, y: ((ev.clientY - r.top) / r.height) * terrain.h };
  };
  const arrondi = (v: number) => Math.round(v * 2) / 2;
  const e = espaces.find((x) => x.id === sel);
  const el = elements.find((x) => x.id === sel);
  const maj = (p: Partial<Espace>) => e && upsert("espaces", { ...e, ...p, surface: Math.round(((p.l ?? e.l ?? 1) * (p.p ?? e.p ?? 1)) * 10) / 10 });
  const majEl = (p: Partial<ElementPlan>) => el && upsert("elementsPlan", { ...el, ...p });
  const ajouter = (type: TypeElementPlan) => {
    const d = ELEMENTS[type];
    const id = uid();
    upsert("elementsPlan", { id, type, x: 0.5, y: 0.5, l: Math.min(d.l, terrain.l - 1), p: Math.min(d.p, terrain.h - 1), hauteur: type === "arbre" ? 8 : type === "haie" ? 2 : type === "maison" ? 7 : undefined });
    setSel(id);
  };
  // Vecteur « vers le nord » dans le repère du plan (y vers le bas)
  const rad = (nord * Math.PI) / 180;
  const vn = { x: Math.sin(rad), y: -Math.cos(rad) };
  const fs = Math.max(0.35, Math.min(terrain.l, terrain.h) / 30);
  const echelle = terrain.l >= 40 ? 10 : terrain.l >= 15 ? 5 : 1;
  const saisir = (id: string, kind: "espace" | "element", x: number, y: number) => (ev: React.PointerEvent) => {
    try { (ev.target as Element).setPointerCapture?.(ev.pointerId); } catch { /* pointeur déjà relâché */ }
    const p = point(ev);
    drag.current = { id, kind, dx: p.x - x, dy: p.y - y };
    setSel(id);
  };

  const exporterPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const w = 2000, h = Math.round((2000 * terrain.h) / terrain.l);
    clone.setAttribute("width", String(w)); clone.setAttribute("height", String(h));
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d")!; ctx.fillStyle = "#e8efd9"; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob((b) => b && download(`plan-du-jardin-${annee}.png`, b), "image/png");
    };
    img.src = url;
  };

  return (
    <div className="card plan-imprimable" style={{ marginTop: 12 }}>
      <div className="row between">
        <b>🗺️ Plan à l'échelle</b>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn sm" onClick={() => setAnnee(annee - 1)} aria-label="Année précédente">◀</button><b>{annee}</b><button className="btn sm" onClick={() => setAnnee(annee + 1)} aria-label="Année suivante">▶</button>
        </div>
      </div>
      <p className="small muted no-print">Faites glisser chaque élément au doigt ou à la souris (grille de 1 m). Les planches prennent la couleur de la famille cultivée l'année affichée ; ajoutez maison, allées, arbres (à leur taille adulte), haies ou point d'eau pour dessiner tout le jardin.</p>
      <div className="row small no-print" style={{ marginBottom: 6, gap: 8 }}>
        <span>Terrain : <input type="number" min="3" max="300" value={terrain.l} onChange={(ev) => setTerrain({ ...terrain, l: Number(ev.target.value) || 20 })} style={{ width: 70 }} aria-label="Longueur du terrain en mètres" /> ×{" "}
          <input type="number" min="3" max="300" value={terrain.h} onChange={(ev) => setTerrain({ ...terrain, h: Number(ev.target.value) || 12 })} style={{ width: 70 }} aria-label="Largeur du terrain en mètres" /> m</span>
        <span>Nord : <input type="number" min="0" max="359" step="15" value={nord} onChange={(ev) => setSettings({ planNord: ((Number(ev.target.value) % 360) + 360) % 360 })} style={{ width: 70 }} aria-label="Orientation du nord en degrés" />°</span>
        <select value={ombre} onChange={(ev) => setOmbre(ev.target.value as typeof ombre)} aria-label="Ombre portée à midi" style={{ width: "auto" }}>
          <option value="">Sans ombres</option><option value="ete">Ombres à midi en été</option><option value="equinoxe">Ombres à midi en mars et septembre</option><option value="hiver">Ombres à midi en hiver</option>
        </select>
      </div>
      <div className="chips no-print" style={{ marginBottom: 6 }} aria-label="Ajouter un élément">
        {(Object.keys(ELEMENTS) as TypeElementPlan[]).map((t) => <button key={t} className="chip" onClick={() => ajouter(t)}>+ {ELEMENTS[t].emoji} {ELEMENTS[t].nom}</button>)}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${terrain.l} ${terrain.h}`}
        style={{ width: "100%", background: "#e8efd9", borderRadius: 10, touchAction: "none", border: "1px solid var(--line)" }}
        onPointerMove={(ev) => {
          if (!drag.current) return;
          const p = point(ev);
          const nx = Math.max(0, arrondi(p.x - drag.current.dx)), ny = Math.max(0, arrondi(p.y - drag.current.dy));
          if (drag.current.kind === "espace") { const x = espaces.find((z) => z.id === drag.current!.id); if (x) upsert("espaces", { ...x, x: nx, y: ny }); }
          else { const x = elements.find((z) => z.id === drag.current!.id); if (x) upsert("elementsPlan", { ...x, x: nx, y: ny }); }
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        role="img"
        aria-label={`Plan du jardin, ${terrain.l} m sur ${terrain.h} m`}
      >
        {Array.from({ length: Math.floor(terrain.l) + 1 }, (_, i) => <line key={"v" + i} x1={i} y1={0} x2={i} y2={terrain.h} stroke="#cdd9b8" strokeWidth={0.03} />)}
        {Array.from({ length: Math.floor(terrain.h) + 1 }, (_, i) => <line key={"h" + i} x1={0} y1={i} x2={terrain.l} y2={i} stroke="#cdd9b8" strokeWidth={0.03} />)}
        {/* Ombres portées à midi, dirigées vers le nord, sous tout le reste */}
        {ombre && elements.filter((z) => z.hauteur && ["arbre", "haie", "maison", "abri"].includes(z.type)).map((z) => {
          const L = (z.hauteur ?? 0) * OMBRE_MIDI[ombre];
          if (z.type === "arbre") return <ellipse key={"o" + z.id} cx={z.x + z.l / 2 + vn.x * L} cy={z.y + z.p / 2 + vn.y * L} rx={z.l / 2} ry={z.p / 2} fill="rgba(40,50,40,0.18)" />;
          const pts = [[z.x, z.y], [z.x + z.l, z.y], [z.x + z.l, z.y + z.p], [z.x, z.y + z.p]];
          const decal = pts.map(([x, y]) => [x + vn.x * L, y + vn.y * L]);
          return <g key={"o" + z.id}>{pts.map((pt, i) => { const q = pts[(i + 1) % 4], dq = decal[(i + 1) % 4], dp = decal[i]; return <polygon key={i} points={`${pt[0]},${pt[1]} ${q[0]},${q[1]} ${dq[0]},${dq[1]} ${dp[0]},${dp[1]}`} fill="rgba(40,50,40,0.15)" />; })}</g>;
        })}
        {elements.filter((z) => z.type !== "arbre").map((z) => {
          const d = ELEMENTS[z.type];
          return (
            <g key={z.id} onPointerDown={saisir(z.id, "element", z.x, z.y)} style={{ cursor: "grab" }}>
              <rect x={z.x} y={z.y} width={z.l} height={Math.max(0.1, z.p)} rx={z.type === "eau" ? Math.min(z.l, z.p) / 2 : z.type === "haie" ? 0.4 : 0.1} fill={d.fill} stroke={sel === z.id ? "#1d3b22" : d.stroke} strokeWidth={sel === z.id ? 0.12 : 0.05} strokeDasharray={z.type === "allee" ? "0.3 0.2" : undefined} />
              {z.type !== "arrosage" && <text x={z.x + 0.15} y={z.y + Math.min(z.p, 1) * 0.6} fontSize={fs} fill="#1d1d1d">{d.emoji} {z.nom ?? d.nom}</text>}
            </g>
          );
        })}
        {espaces.filter((z) => z.x !== undefined).map((z) => {
          const fams = famillesDe(z.id, annee, cultures);
          const fill = fams.length ? COULEURS[fams[0]] ?? "#bbb" : z.type === "serre" ? "#dfe9ef" : "#c9b79c";
          return (
            <g key={z.id} onPointerDown={saisir(z.id, "espace", z.x ?? 0, z.y ?? 0)} style={{ cursor: "grab" }}>
              <rect x={z.x} y={z.y} width={z.l ?? 1} height={z.p ?? 1} rx={0.15} fill={fill} stroke={sel === z.id ? "#1d3b22" : "#7a6a52"} strokeWidth={sel === z.id ? 0.12 : 0.05} />
              <text x={(z.x ?? 0) + 0.15} y={(z.y ?? 0) + 0.5} fontSize={0.42} fill="#1d1d1d">{TYPES_ESPACE[z.type].emoji} {z.nom}</text>
              {fams.length > 1 && <rect x={(z.x ?? 0) + (z.l ?? 1) - 0.4} y={(z.y ?? 0) + 0.1} width={0.3} height={0.3} fill={COULEURS[fams[1]] ?? "#bbb"} />}
            </g>
          );
        })}
        {/* Arbres par-dessus : couronne à la taille adulte et tronc */}
        {elements.filter((z) => z.type === "arbre").map((z) => {
          const nom = z.nom ?? (z.planteId ? plante(z.planteId)?.nom : undefined) ?? ELEMENTS.arbre.nom;
          return (
            <g key={z.id} onPointerDown={saisir(z.id, "element", z.x, z.y)} style={{ cursor: "grab" }}>
              <ellipse cx={z.x + z.l / 2} cy={z.y + z.p / 2} rx={z.l / 2} ry={z.p / 2} fill={ELEMENTS.arbre.fill} stroke={sel === z.id ? "#1d3b22" : ELEMENTS.arbre.stroke} strokeWidth={sel === z.id ? 0.12 : 0.05} />
              <circle cx={z.x + z.l / 2} cy={z.y + z.p / 2} r={0.2} fill="#6b4a2b" />
              <text x={z.x + z.l / 2} y={z.y + z.p / 2 + fs * 1.4} fontSize={fs} textAnchor="middle" fill="#14321a">{nom}</text>
            </g>
          );
        })}
        {/* Flèche du nord */}
        <g transform={`translate(${terrain.l - 1.2} 1.3) rotate(${nord})`}>
          <circle r={0.9} fill="rgba(255,255,255,0.85)" stroke="#555" strokeWidth={0.04} />
          <path d="M0 -0.75 L0.3 0.35 L0 0.15 L-0.3 0.35 Z" fill="#b3261e" />
          <text y={-0.2} x={0} fontSize={0.45} textAnchor="middle" fill="#222" transform={`rotate(${-nord})`}>N</text>
        </g>
        {/* Barre d'échelle */}
        <g transform={`translate(0.5 ${terrain.h - 0.6})`}>
          <rect width={echelle} height={0.15} fill="#222" />
          <text y={-0.15} fontSize={Math.max(0.35, fs * 0.9)} fill="#222">{echelle} m</text>
        </g>
      </svg>
      <div className="legend">
        {(Object.keys(COULEURS) as Famille[]).map((f) => <span key={f}><i style={{ background: COULEURS[f] }} />{FAMILLES[f].split(" (")[0]}</span>)}
        <span><i style={{ background: "#c9b79c" }} />Rien de noté</span>
        {[...new Set(elements.map((z) => z.type))].map((t) => <span key={t}><i style={{ background: ELEMENTS[t].fill, border: `1px solid ${ELEMENTS[t].stroke}` }} />{ELEMENTS[t].nom}</span>)}
      </div>
      <div className="row no-print" style={{ gap: 6, marginTop: 8 }}>
        <button className="btn sm" onClick={exporterPng}>🖼️ Enregistrer en image</button>
        <button className="btn sm" onClick={() => imprimer(".plan-imprimable")}>🖨️ Imprimer le plan</button>
      </div>
      {e && (
        <div className="row small no-print" style={{ marginTop: 8 }}>
          <b>{e.nom}</b>
          Longueur <input type="number" step="0.5" min="0.5" value={e.l ?? 1} onChange={(ev) => maj({ l: Number(ev.target.value) })} style={{ width: 70 }} /> m
          Largeur <input type="number" step="0.5" min="0.5" value={e.p ?? 1} onChange={(ev) => maj({ p: Number(ev.target.value) })} style={{ width: 70 }} /> m
          <span className="muted">= {e.surface ?? "?"} m²</span>
        </div>
      )}
      {el && (
        <div className="row small no-print" style={{ marginTop: 8, gap: 6 }}>
          <b>{ELEMENTS[el.type].emoji}</b>
          <input type="text" placeholder={ELEMENTS[el.type].nom} value={el.nom ?? ""} onChange={(ev) => majEl({ nom: ev.target.value || undefined })} style={{ width: 150 }} aria-label="Nom de l'élément" />
          {el.type === "arbre" ? (
            <>
              <select value={el.planteId ?? ""} aria-label="Espèce" style={{ width: "auto" }} onChange={(ev) => {
                const id = ev.target.value;
                const h = hauteurMax(plante(id)?.hauteur);
                majEl({ planteId: id || undefined, ...(h ? { hauteur: h, l: Math.max(1, Math.round(h * 0.7)), p: Math.max(1, Math.round(h * 0.7)) } : {}) });
              }}>
                <option value="">Espèce…</option>{PLANTES.filter((p) => p.categorie === "arbre" || p.categorie === "fruit" || (p.categorie === "ornement" && p.cycle === "arbuste")).sort((a, b) => a.nom.localeCompare(b.nom)).map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
              Diamètre adulte <input type="number" step="0.5" min="0.5" value={el.l} onChange={(ev) => majEl({ l: Number(ev.target.value), p: Number(ev.target.value) })} style={{ width: 65 }} /> m
            </>
          ) : (
            <>
              Longueur <input type="number" step="0.5" min="0.1" value={el.l} onChange={(ev) => majEl({ l: Number(ev.target.value) })} style={{ width: 65 }} /> m
              Largeur <input type="number" step="0.1" min="0.1" value={el.p} onChange={(ev) => majEl({ p: Number(ev.target.value) })} style={{ width: 65 }} /> m
            </>
          )}
          {["arbre", "haie", "maison", "abri"].includes(el.type) && <> Hauteur <input type="number" step="0.5" min="0.5" value={el.hauteur ?? ""} onChange={(ev) => majEl({ hauteur: Number(ev.target.value) || undefined })} style={{ width: 60 }} /> m</>}
          <button className="btn sm ghost" onClick={() => { remove("elementsPlan", el.id); setSel(""); }} aria-label="Supprimer l'élément">🗑</button>
        </div>
      )}
      <p className="small muted no-print">Repère : à midi, l'ombre d'un arbre de 8 m s'étend vers le nord d'environ 4 m en été et de près de 20 m en hiver. Placez le potager hors de l'ombre d'hiver des grands arbres et de la maison. <a href={href("/guide/concevoir-jardin")}>Concevoir son jardin →</a></p>
    </div>
  );
}

export function ArrosageSemaine() {
  const espaces = useStore((s) => s.espaces.filter((e) => !e.archive));
  const cultures = useStore((s) => s.cultures);
  const ville = useStore((s) => s.settings.ville);
  const [wx, setWx] = useState<Meteo | null>(null);
  const [paille, setPaille] = useState(true);
  const [debit, setDebit] = useState(8);
  useEffect(() => { if (ville) meteo(ville.lat, ville.lon).then(setWx).catch(() => undefined); }, [ville]);
  const mois = new Date().getMonth() + 1;
  const tmaxDefaut = [8, 10, 14, 17, 21, 25, 28, 27, 23, 17, 11, 8][mois - 1];
  const jours = wx ? wx.jours.map((j) => ({ tmax: j.tmax, pluie: j.pluie })) : Array.from({ length: 7 }, () => ({ tmax: tmaxDefaut, pluie: 0 }));
  const lignes = espaces.filter((e) => e.type !== "interieur").map((e) => ({ e, b: besoinEau(e, cultures, jours, paille) })).filter((x) => x.b);
  const total = lignes.reduce((a, x) => a + x.b!.litres, 0);
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>💧 Arrosage des 7 prochains jours</b>
      <p className="small muted">{wx ? `D'après la météo de ${ville!.nom.split(",")[0]} (températures et pluie annoncées)` : "Sans ville enregistrée : estimation selon les températures moyennes du mois, sans pluie"}, la surface de chaque emplacement et ses cultures en cours. C'est un ordre de grandeur : vérifiez toujours l'humidité du sol à 10 cm.</p>
      <div className="row small">
        <label className="row"><input type="checkbox" checked={paille} onChange={(ev) => setPaille(ev.target.checked)} /> Sol paillé</label>
        <label className="row">Goutte-à-goutte : <input type="number" min="1" value={debit} onChange={(ev) => setDebit(Number(ev.target.value) || 8)} style={{ width: 60 }} /> L/h par m²</label>
      </div>
      {!lignes.length && <p className="small muted">Indiquez la surface de vos emplacements et notez les cultures en cours pour obtenir le calcul.</p>}
      {lignes.length > 0 && (
        <table className="table small" style={{ marginTop: 8 }}>
          <thead><tr><th>Emplacement</th><th>Besoin</th><th>Goutte-à-goutte</th></tr></thead>
          <tbody>
            {lignes.map(({ e, b }) => (
              <tr key={e.id}><td>{e.nom} <span className="muted">({e.surface} m²)</span></td><td>{b!.litres ? `${b!.litres} L (${b!.mm} mm)` : "Rien : la pluie suffit"}</td><td>{b!.litres ? `${Math.round((b!.litres / (debit * e.surface!)) * 60)} min sur la semaine, en 2 ou 3 fois` : "—"}</td></tr>
            ))}
            <tr><td><b>Total</b></td><td><b>{total} L</b></td><td className="muted">≈ {Math.ceil(total / 10)} arrosoirs de 10 L</td></tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
