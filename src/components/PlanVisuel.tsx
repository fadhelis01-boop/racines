import { useEffect, useRef, useState } from "react";
import { useStore, upsert, type Espace } from "../lib/store";
import { plante, FAMILLES } from "../data/index";
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
  const cultures = useStore((s) => s.cultures);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [sel, setSel] = useState<string>("");
  const [terrain, setTerrain] = useState({ l: 20, h: 12 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

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
  const maj = (p: Partial<Espace>) => e && upsert("espaces", { ...e, ...p, surface: Math.round(((p.l ?? e.l ?? 1) * (p.p ?? e.p ?? 1)) * 10) / 10 });

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="row between">
        <b>🗺️ Plan à l'échelle</b>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn sm" onClick={() => setAnnee(annee - 1)}>◀</button><b>{annee}</b><button className="btn sm" onClick={() => setAnnee(annee + 1)}>▶</button>
        </div>
      </div>
      <p className="small muted">Faites glisser chaque emplacement au doigt ou à la souris (grille de 1 m). La couleur montre la famille cultivée l'année affichée : comparez les années pour voir votre rotation d'un coup d'œil.</p>
      <div className="row small" style={{ marginBottom: 6 }}>
        Terrain : <input type="number" min="3" max="200" value={terrain.l} onChange={(ev) => setTerrain({ ...terrain, l: Number(ev.target.value) || 20 })} style={{ width: 70 }} aria-label="Longueur du terrain en mètres" /> ×
        <input type="number" min="3" max="200" value={terrain.h} onChange={(ev) => setTerrain({ ...terrain, h: Number(ev.target.value) || 12 })} style={{ width: 70 }} aria-label="Largeur du terrain en mètres" /> m
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${terrain.l} ${terrain.h}`}
        style={{ width: "100%", background: "#e8efd9", borderRadius: 10, touchAction: "none", border: "1px solid var(--line)" }}
        onPointerMove={(ev) => {
          if (!drag.current) return;
          const p = point(ev);
          const x = espaces.find((z) => z.id === drag.current!.id);
          if (x) upsert("espaces", { ...x, x: Math.max(0, arrondi(p.x - drag.current.dx)), y: Math.max(0, arrondi(p.y - drag.current.dy)) });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        role="img"
        aria-label="Plan du jardin"
      >
        {Array.from({ length: terrain.l + 1 }, (_, i) => <line key={"v" + i} x1={i} y1={0} x2={i} y2={terrain.h} stroke="#cdd9b8" strokeWidth={0.03} />)}
        {Array.from({ length: terrain.h + 1 }, (_, i) => <line key={"h" + i} x1={0} y1={i} x2={terrain.l} y2={i} stroke="#cdd9b8" strokeWidth={0.03} />)}
        {espaces.filter((z) => z.x !== undefined).map((z) => {
          const fams = famillesDe(z.id, annee, cultures);
          const fill = fams.length ? COULEURS[fams[0]] ?? "#bbb" : z.type === "serre" ? "#dfe9ef" : "#c9b79c";
          return (
            <g key={z.id} onPointerDown={(ev) => { (ev.target as Element).setPointerCapture?.(ev.pointerId); const p = point(ev); drag.current = { id: z.id, dx: p.x - (z.x ?? 0), dy: p.y - (z.y ?? 0) }; setSel(z.id); }} style={{ cursor: "grab" }}>
              <rect x={z.x} y={z.y} width={z.l ?? 1} height={z.p ?? 1} rx={0.15} fill={fill} stroke={sel === z.id ? "#1d3b22" : "#7a6a52"} strokeWidth={sel === z.id ? 0.12 : 0.05} />
              <text x={(z.x ?? 0) + 0.15} y={(z.y ?? 0) + 0.5} fontSize={0.42} fill="#1d1d1d">{TYPES_ESPACE[z.type].emoji} {z.nom}</text>
              {fams.length > 1 && <rect x={(z.x ?? 0) + (z.l ?? 1) - 0.4} y={(z.y ?? 0) + 0.1} width={0.3} height={0.3} fill={COULEURS[fams[1]] ?? "#bbb"} />}
            </g>
          );
        })}
      </svg>
      <div className="legend">
        {(Object.keys(COULEURS) as Famille[]).map((f) => <span key={f}><i style={{ background: COULEURS[f] }} />{FAMILLES[f].split(" (")[0]}</span>)}
        <span><i style={{ background: "#c9b79c" }} />Rien de noté</span>
      </div>
      {e && (
        <div className="row small" style={{ marginTop: 8 }}>
          <b>{e.nom}</b>
          Longueur <input type="number" step="0.5" min="0.5" value={e.l ?? 1} onChange={(ev) => maj({ l: Number(ev.target.value) })} style={{ width: 70 }} /> m
          Largeur <input type="number" step="0.5" min="0.5" value={e.p ?? 1} onChange={(ev) => maj({ p: Number(ev.target.value) })} style={{ width: 70 }} /> m
          <span className="muted">= {e.surface ?? "?"} m²</span>
        </div>
      )}
    </div>
  );
}

// Besoin en eau de la semaine par emplacement, d'après la météo et les cultures
const MM_JOUR = (tmax: number) => (tmax < 15 ? 1 : tmax < 20 ? 2 : tmax < 25 ? 3 : tmax < 30 ? 4.5 : 6);
const KC = { faible: 0.5, moyen: 0.85, fort: 1.1 } as const;

export function besoinEau(e: Espace, cultures: { espaceId?: string; planteId: string; fini?: string }[], jours: { tmax: number; pluie: number }[], paille: boolean) {
  const actives = cultures.filter((c) => c.espaceId === e.id && !c.fini).map((c) => plante(c.planteId)).filter(Boolean);
  if (!actives.length || !e.surface) return null;
  const kc = Math.max(...actives.map((p) => KC[p!.eau]));
  const evap = jours.reduce((a, j) => a + MM_JOUR(j.tmax), 0) * kc * (paille ? 0.7 : 1);
  const pluie = jours.reduce((a, j) => a + (j.pluie ?? 0), 0) * 0.8; // une partie de la pluie ruisselle
  const mm = Math.max(0, evap - pluie);
  return { litres: Math.round(mm * e.surface), mm: Math.round(mm), pluie: Math.round(pluie) };
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
