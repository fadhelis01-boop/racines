// Rappels sur le téléphone : notifications locales (aucun serveur, aucune donnée envoyée).
// - À l'ouverture de l'appli et toutes les heures tant qu'elle est ouverte : une notification par jour au plus.
// - Appli fermée : synchronisation périodique (Chrome / Android, appli installée) ; le service worker lit
//   la liste des prochains rappels déposée dans le cache par l'appli.
import { getState, setSettings, today } from "./store";
import { aFaire, echeances } from "./mesplantes";
import { tachesPerso } from "./calendar";

const CLE_JOUR = "racines-notif-jour";
export const notifsPossibles = () => typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
export const notifsAutorisees = () => notifsPossibles() && Notification.permission === "granted";

export function resumeDuJour(now = new Date()): string | null {
  const s = getState();
  const plantes = aFaire(s.plantes, now);
  const taches = tachesPerso(s, now).filter((t) => !s.fait[t.key]);
  const parts: string[] = [];
  if (plantes.length) parts.push(`${plantes.length} plante${plantes.length > 1 ? "s" : ""} à vérifier : ${plantes.slice(0, 4).map(({ mp }) => mp.surnom).join(", ")}${plantes.length > 4 ? "…" : ""}`);
  if (taches.length) parts.push(`${taches.length} tâche${taches.length > 1 ? "s" : ""} au jardin`);
  return parts.length ? parts.join(" · ") + ". Touchez la terre avant d'arroser." : null;
}

async function montrer(corps: string) {
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification("Racines 🌿", { body: corps, icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: "racines-jour", data: { url: "./#/" } } as NotificationOptions);
}

// Prochaines échéances déposées pour le service worker (appli fermée)
async function deposerEcheances() {
  try {
    const s = getState();
    const now = new Date();
    const liste = s.plantes.flatMap((mp) => echeances(mp, now).map((e) => ({ date: new Date(now.getTime() + e.dans * 86400000).toISOString().slice(0, 10), texte: mp.surnom })));
    const cache = await caches.open("racines-content");
    await cache.put("./rappels.json", new Response(JSON.stringify(liste), { headers: { "Content-Type": "application/json" } }));
  } catch { /* pas de cache disponible */ }
}

export async function verifierRappels() {
  if (!getState().settings.notifs || !notifsAutorisees()) return;
  await deposerEcheances();
  let deja = "";
  try { deja = localStorage.getItem(CLE_JOUR) ?? ""; } catch { /* stockage indisponible */ }
  const jour = today();
  if (deja === jour || new Date().getHours() < 8) return;
  const corps = resumeDuJour();
  if (!corps) return;
  await montrer(corps);
  try { localStorage.setItem(CLE_JOUR, jour); } catch { /* idem */ }
}

export async function activerRappels(): Promise<"ok" | "refuse" | "impossible"> {
  if (!notifsPossibles()) return "impossible";
  const p = await Notification.requestPermission();
  if (p !== "granted") { setSettings({ notifs: false }); return "refuse"; }
  setSettings({ notifs: true });
  try {
    const reg = await navigator.serviceWorker.ready;
    const ps = (reg as unknown as { periodicSync?: { register: (tag: string, o: { minInterval: number }) => Promise<void> } }).periodicSync;
    if (ps) await ps.register("racines-rappels", { minInterval: 12 * 3600 * 1000 });
  } catch { /* synchronisation périodique non disponible : rappels à l'ouverture seulement */ }
  await deposerEcheances();
  await montrer("Les rappels sont activés. Vous serez prévenu quand une plante est à vérifier.");
  return "ok";
}

export function desactiverRappels() { setSettings({ notifs: false }); }

export function demarrerRappels() {
  verifierRappels();
  setInterval(verifierRappels, 3600 * 1000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") verifierRappels(); });
}
