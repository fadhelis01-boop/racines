import { Titre } from "../components/ui";
import { SCHEMAS } from "../components/Schemas";
// Schémas montrés dans chaque leçon
const SCHEMAS_LECON: Record<string, string[]> = { sol: ["horizons"], plante: ["azote"], fertilite: ["rotation", "azote"], protection: ["varroa"] };
import { PARCOURS_AGRONOMIE, QUIZ } from "../data/pedagogie";
import { GUIDES } from "../data/index";
import { LEXIQUE } from "../data/lexique";
import { useStore, toggleFait } from "../lib/store";
import { href } from "../lib/router";

export default function Cours() {
  const fait = useStore((s) => s.fait);
  const total = PARCOURS_AGRONOMIE.length;
  const finies = PARCOURS_AGRONOMIE.filter((l) => fait[`cours:${l.id}`]).length;
  return (
    <div>
      <Titre ico="tutoriels" emoji="🎓">Comprendre l'agronomie</Titre>
      <p className="muted small">Un parcours en 5 leçons pour comprendre pourquoi on fait ce qu'on fait au jardin : le sol, la plante, l'eau, la fertilité et la protection des cultures. Chaque leçon combine des tutoriels, des outils de calcul, du vocabulaire et un quiz. Utilisable seul ou en classe (chaque page s'imprime).</p>
      <div className="row between"><b>Votre progression : {finies} / {total}</b>{finies === total && <span className="badge green">🎉 Parcours terminé</span>}</div>
      <div className="progress" style={{ margin: "6px 0 12px" }}><div style={{ width: `${(finies / total) * 100}%` }} /></div>
      {PARCOURS_AGRONOMIE.map((l) => {
        const guides = l.guides.map((id) => GUIDES.find((g) => g.id === id)).filter(Boolean);
        const quiz = l.guides.filter((id) => QUIZ[id]);
        const quizOk = quiz.filter((id) => fait[`quiz:${id}`]).length;
        return (
          <section key={l.id} className="card" style={{ marginTop: 12 }}>
            <div className="row between"><b>{l.emoji} {l.titre}</b><label className="small"><input type="checkbox" checked={!!fait[`cours:${l.id}`]} onChange={() => toggleFait(`cours:${l.id}`)} /> Leçon terminée</label></div>
            <p className="small" style={{ margin: "6px 0 2px" }}><b>À la fin de la leçon, vous saurez :</b></p>
            <ul className="ticks small" style={{ margin: 0 }}>{l.objectifs.map((o) => <li key={o}>{o}</li>)}</ul>
            {(SCHEMAS_LECON[l.id] ?? []).length > 0 && <details className="box small" style={{ marginTop: 8 }}><summary>🖼️ Le schéma de la leçon</summary>{SCHEMAS.filter((x) => SCHEMAS_LECON[l.id].includes(x.id)).map(({ id, C }) => <C key={id} />)}</details>}
            <p className="small" style={{ margin: "8px 0 2px" }}><b>Lire</b></p>
            <div className="chips">{guides.map((g) => <a key={g!.id} className="chip" href={href(`/guide/${g!.id}`)}>{g!.emoji} {g!.titre}{QUIZ[g!.id] ? (fait[`quiz:${g!.id}`] ? " ✓" : " · quiz") : ""}</a>)}</div>
            <p className="small" style={{ margin: "8px 0 2px" }}><b>Pratiquer</b></p>
            <div className="chips">{l.outils.map(([to, nom]) => <a key={to} className="chip" href={href(to)}>🧮 {nom}</a>)}</div>
            {l.mots.length > 0 && <p className="small" style={{ margin: "8px 0 0" }}><b>Vocabulaire :</b> {l.mots.map((m) => LEXIQUE.find((t) => t.id === m)).filter(Boolean).map((t, i) => <span key={t!.id}>{i ? ", " : ""}<a href={href(`/lexique?t=${t!.id}`)}>{t!.terme}</a></span>)}</p>}
            {quiz.length > 0 && <p className="small muted" style={{ margin: "6px 0 0" }}>Quiz réussis dans cette leçon : {quizOk} / {quiz.length} (en bas de chaque tutoriel).</p>}
          </section>
        );
      })}
      <p className="small" style={{ marginTop: 14 }}><a href={href("/agronome")}>Outils de l'agronome →</a> · <a href={href("/references")}>Sources et références →</a></p>
    </div>
  );
}
