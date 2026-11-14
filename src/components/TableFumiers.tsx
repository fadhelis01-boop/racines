import { FUMIERS, fumierDe } from "../data/fumiers";
import { href } from "../lib/router";
import { Vignette } from "./Ico";
import { animal } from "../data/index";

// Comparatif des fumiers (tous) ou fiche d'un seul animal
export default function TableFumiers({ seul }: { seul?: string }) {
  const lignes = seul ? [fumierDe(seul)].filter(Boolean) : FUMIERS;
  if (!lignes.length) return null;
  return (
    <div className="card" style={{ overflowX: "auto", marginTop: 12 }}>
      <b>💩 {seul ? "Valeur de ce fumier" : "Les fumiers comparés"}</b>
      <p className="small muted" style={{ margin: "4px 0 8px" }}>Teneurs indicatives en % du produit brut (N azote, P phosphore, K potasse), très variables selon la litière et l'alimentation. « Chaud » : chauffe en compostant, convient aux sols froids ; « froid » : se décompose doucement.</p>
      <table className="table small" style={{ minWidth: 640 }}>
        <thead><tr><th>Fumier</th><th>N-P-K</th><th>Type</th><th>Compostage</th><th>Dose / m² / an</th><th>Usage</th><th>Précaution</th></tr></thead>
        <tbody>
          {lignes.map((f) => {
            const a = animal(f!.animal);
            return (
              <tr key={f!.animal}>
                <td><a href={href(`/animal/${f!.animal}`)} className="row" style={{ gap: 6, flexWrap: "nowrap" }}><Vignette id={f!.animal} emoji={a?.emoji ?? "🐾"} taille={26} /> {f!.nom}</a></td>
                <td style={{ whiteSpace: "nowrap" }}>{f!.N} / {f!.P} / {f!.K}</td>
                <td>{f!.type}</td><td>{f!.compostage}</td><td>{f!.dose}</td><td>{f!.usage}</td><td>{f!.precaution}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="small" style={{ marginBottom: 0 }}><a href={href("/guide/fumiers-securite")}>⚠️ Fumiers sans risque : désherbants du foin, vermifuges, germes →</a></p>
    </div>
  );
}
