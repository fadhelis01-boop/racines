import { useSel } from "./useSel";
import { getState } from "./store";

// Lecture à voix haute avec la synthèse vocale de l'appareil (Web Speech API :
// iPhone/iPad, Android, Windows, Mac, sans connexion pour la plupart des voix).
// Le texte est découpé en blocs (paragraphes ou étapes) : on peut avancer,
// reculer, répéter l'étape en cours.

export interface TtsState { supported: boolean; key: string; title: string; blocks: string[]; index: number; playing: boolean; continu: boolean }

let st: TtsState = { supported: typeof window !== "undefined" && "speechSynthesis" in window, key: "", title: "", blocks: [], index: 0, playing: false, continu: true };
const listeners = new Set<() => void>();
const set = (p: Partial<TtsState>) => {
  st = { ...st, ...p };
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
export const useTts = <T,>(sel: (s: TtsState) => T) => useSel(subscribe, () => st, sel);

let voices: SpeechSynthesisVoice[] = [];
export function frenchVoices() {
  if (!st.supported) return [];
  const v = speechSynthesis.getVoices().filter((x) => x.lang.toLowerCase().startsWith("fr"));
  if (v.length) voices = v;
  return voices;
}
if (st.supported) {
  speechSynthesis.onvoiceschanged = () => {
    frenchVoices();
    listeners.forEach((l) => l());
  };
}
function pickVoice() {
  const all = frenchVoices();
  const name = getState().settings.voix;
  if (name) {
    const v = all.find((x) => x.name === name);
    if (v) return v;
  }
  for (const re of [/natural|neural|online/i, /premium|enhanced|amélioré/i, /amélie|thomas|audrey|marie|denise|henri/i, /google/i]) {
    const v = all.find((x) => re.test(x.name) && x.lang.toLowerCase() === "fr-fr");
    if (v) return v;
  }
  return all.find((x) => x.lang.toLowerCase() === "fr-fr") ?? all[0];
}

// Rend le texte agréable à l'oreille : unités, abréviations, symboles
export function spoken(t: string) {
  return t
    .replace(/[*_#>`]/g, "")
    .replace(/(\d)\s?°C/g, "$1 degrés")
    .replace(/(\d)\s?%/g, "$1 pour cent")
    .replace(/(\d)\s?m²/g, "$1 mètres carrés")
    .replace(/(\d)\s?m³/g, "$1 mètres cubes")
    .replace(/(\d)\s?cm\b/g, "$1 centimètres")
    .replace(/(\d)\s?mm\b/g, "$1 millimètres")
    .replace(/(\d)\s?km\/h/g, "$1 kilomètres heure")
    .replace(/(\d)\s?kg\b/g, "$1 kilos")
    .replace(/(\d)\s?g\b/g, "$1 grammes")
    .replace(/(\d)\s?L\b/g, "$1 litres")
    .replace(/(\d)\s?ml\b/g, "$1 millilitres")
    .replace(/\bJ(\d+)/g, "jour $1")
    .replace(/\be\. ?g\./gi, "par exemple")
    .replace(/→/g, ", puis ")
    .replace(/×/g, " par ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunks(text: string): string[] {
  const sentences = text.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [text];
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > 200 && cur) {
      out.push(cur);
      cur = "";
    }
    cur += s;
  }
  if (cur.trim()) out.push(cur);
  return out.map((c) => c.trim()).filter(Boolean);
}

let gen = 0;
let onEnd: (() => void) | null = null;

function speakFrom(i: number) {
  if (!st.supported) return;
  const g = ++gen;
  speechSynthesis.cancel();
  if (i >= st.blocks.length) {
    set({ playing: false, index: Math.max(0, st.blocks.length - 1) });
    onEnd?.();
    return;
  }
  set({ index: i, playing: true });
  const parts = chunks(spoken(st.blocks[i]));
  const voice = pickVoice();
  const rate = getState().settings.debit || 1;
  let p = 0;
  const next = () => {
    if (g !== gen) return;
    if (p >= parts.length) {
      if (st.continu) return speakFrom(i + 1);
      set({ playing: false });
      return;
    }
    const u = new SpeechSynthesisUtterance(parts[p++]);
    u.lang = "fr-FR";
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = () => setTimeout(next, 80);
    u.onerror = (e) => {
      if (g !== gen || e.error === "interrupted" || e.error === "canceled") return;
      setTimeout(next, 80);
    };
    speechSynthesis.speak(u);
  };
  setTimeout(next, 80); // Safari : délai après cancel()
  try {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: st.title, artist: "Racines" });
      navigator.mediaSession.setActionHandler("play", () => resume());
      navigator.mediaSession.setActionHandler("pause", () => pause());
      navigator.mediaSession.setActionHandler("nexttrack", () => skip(1));
      navigator.mediaSession.setActionHandler("previoustrack", () => skip(-1));
    }
  } catch {
    /* non supporté */
  }
}

export function play(opts: { key: string; title: string; blocks: string[]; start?: number; continu?: boolean; onEnd?: () => void }) {
  onEnd = opts.onEnd ?? null;
  set({ key: opts.key, title: opts.title, blocks: opts.blocks.filter(Boolean), continu: opts.continu ?? true });
  speakFrom(opts.start ?? 0);
}
export function pause() {
  gen++;
  if (st.supported) speechSynthesis.cancel();
  set({ playing: false });
}
export const resume = () => speakFrom(st.index);
export const skip = (d: number) => speakFrom(Math.max(0, Math.min(st.blocks.length - 1, st.index + d)));
export const jumpTo = (i: number) => speakFrom(i);
export function stop() {
  pause();
  set({ key: "", title: "", blocks: [], index: 0 });
}
export function sayOnce(text: string) {
  if (!st.supported) return;
  play({ key: "once", title: "", blocks: [text], continu: false });
}
export function preview(name: string, rate: number) {
  if (!st.supported) return;
  pause();
  const u = new SpeechSynthesisUtterance("Bonjour ! Semez les radis tous les quinze jours, à un centimètre de profondeur.");
  const v = frenchVoices().find((x) => x.name === name);
  if (v) u.voice = v;
  u.lang = "fr-FR";
  u.rate = rate;
  speechSynthesis.speak(u);
}

// ---------- Écran toujours allumé (mode pas à pas, mains dans la terre) ----------
let lock: { release: () => Promise<void> } | null = null;
export async function keepAwake(on: boolean) {
  try {
    const wl = (navigator as unknown as { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock;
    if (on && wl && !lock) lock = await wl.request("screen");
    if (!on && lock) {
      await lock.release();
      lock = null;
    }
  } catch {
    /* refusé ou non supporté */
  }
}

// ---------- Commandes vocales (Chrome, Edge, Safari récents) ----------
type Rec = { lang: string; continuous: boolean; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void; onend: () => void; onerror: () => void; start: () => void; stop: () => void };
export const voiceCommandsSupported = () => typeof window !== "undefined" && !!((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition);

export function listenCommands(handlers: { suivant: () => void; precedent: () => void; repeter: () => void; stop: () => void }): () => void {
  const W = window as unknown as Record<string, new () => Rec>;
  const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
  if (!Ctor) return () => undefined;
  let active = true;
  const rec = new Ctor();
  rec.lang = "fr-FR";
  rec.continuous = true;
  rec.interimResults = false;
  rec.onresult = (e) => {
    const t = e.results[e.results.length - 1][0].transcript.toLowerCase();
    if (/suivant|après|continue/.test(t)) handlers.suivant();
    else if (/précédent|retour|avant/.test(t)) handlers.precedent();
    else if (/répète|encore|redis/.test(t)) handlers.repeter();
    else if (/stop|arrête|pause/.test(t)) handlers.stop();
  };
  rec.onend = () => {
    if (active) setTimeout(() => active && rec.start(), 300);
  };
  rec.onerror = () => undefined;
  try {
    rec.start();
  } catch {
    /* déjà démarré */
  }
  return () => {
    active = false;
    try {
      rec.stop();
    } catch {
      /* ignoré */
    }
  };
}
