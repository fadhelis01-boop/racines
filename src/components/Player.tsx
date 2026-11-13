import { useTts, pause, resume, skip, stop } from "../lib/tts";

// Barre de lecture audio, visible dès qu'une lecture est chargée
export function Player() {
  const s = useTts((x) => x);
  if (!s.key || s.key === "once" || !s.blocks.length) return null;
  return (
    <div className="player" role="region" aria-label="Lecture audio">
      <button onClick={() => skip(-1)} aria-label="Passage précédent">⏮</button>
      <button onClick={() => (s.playing ? pause() : resume())} aria-label={s.playing ? "Pause" : "Lecture"}>{s.playing ? "⏸" : "▶️"}</button>
      <button onClick={() => skip(1)} aria-label="Passage suivant">⏭</button>
      <div className="t">
        {s.title}
        <small>Passage {s.index + 1} / {s.blocks.length}</small>
      </div>
      <button onClick={stop} aria-label="Fermer le lecteur">✕</button>
    </div>
  );
}
