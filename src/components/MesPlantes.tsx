import { useRef, useState } from "react";
import { useStore, upsert, remove, uid, today, type MaPlante, type Fenetre } from "../lib/store";
import { PLANTES, plante } from "../data/index";
import { echeances, intervalleArrosage, marquer, FENETRES } from "../lib/mesplantes";
import { savePhoto } from "../lib/photos";
import { href } from "../lib/router";
import { chercherInterieur } from "../lib/search";
import { activerRappels, desactiverRappels, notifsPossibles } from "../lib/rappels";
import { buildIcs } from "../lib/calendar";
import { getState } from "../lib/store";
import { download } from "./ui";
import { norm } from "../lib/garden";
import { Empty, Photo, StoredPhoto, toast } from "./ui";

const PIECES = ["Salon", "Cuisine", "Chambre", "Salle de bain", "Bureau", "Entrée", "Véranda", "Balcon"];

// Formulaire d'ajout (utilisé ici et depuis une fiche plante)
export function AjoutMaPlante({ planteId: pid0, onDone }: { planteId?: string; onDone?: () => void }) {
  const [pid, setPid] = useState(pid0 ?? "");
  const [surnom, setSurnom] = useState("");
  const [piece, setPiece] = useState("Salon");
  const [fenetre, setFenetre] = useState<Fenetre>("est");
  const [depuis, setDepuis] = useState(today());
  const [q, setQ] = useState("");
  const tous = PLANTES.filter((p) => p.lieux.includes("interieur") || p.lieux.includes("pot")).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  // Filtre par nom : plantes d'intérieur (noms courants, latins, tolérance aux fautes) puis plantes en pot
  const trouves = q.trim().length >= 2 ? [...new Set([...chercherInterieur(q).map((h) => h.plante), ...tous.filter((p) => norm([p.nom, p.latin, ...(p.alias ?? [])].join(" ")).includes(norm(q.trim())))])] : tous;
  const choix = pid && !trouves.some((p) => p.id === pid) ? [...trouves, ...tous.filter((p) => p.id === pid)] : trouves;
  return (
    <div className="card stack" style={{ marginTop: 10 }}>
      {!pid0 && (
        <label className="field">Espèce
          <input type="search" placeholder="Taper le nom : monstera, plante ZZ, basilic…" value={q} aria-label="Chercher l'espèce par son nom"
            onChange={(e) => { setQ(e.target.value); const r = e.target.value.trim().length >= 2 ? chercherInterieur(e.target.value) : []; if (r[0]) setPid(r[0].plante.id); }} style={{ marginBottom: 6 }} />
          <select value={pid} onChange={(e) => setPid(e.target.value)}>
            <option value="">{q.trim().length >= 2 ? `— ${trouves.length} résultat(s) —` : "— Choisir —"}</option>
            {choix.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nom}</option>)}
          </select>
        </label>
      )}
      <label className="field">Surnom (facultatif)<input type="text" placeholder="Ex. : Le grand monstera du salon" value={surnom} onChange={(e) => setSurnom(e.target.value)} /></label>
      <div className="row">
        <label className="field" style={{ flex: 1, minWidth: 140 }}>Pièce
          <select value={piece} onChange={(e) => setPiece(e.target.value)}>{PIECES.map((x) => <option key={x}>{x}</option>)}</select>
        </label>
        <label className="field" style={{ flex: 1, minWidth: 160 }}>Lumière
          <select value={fenetre} onChange={(e) => setFenetre(e.target.value as Fenetre)}>{Object.entries(FENETRES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        </label>
      </div>
      <label className="field">Chez moi depuis<input type="date" value={depuis} onChange={(e) => setDepuis(e.target.value)} /></label>
      <div className="row">
        <button className="btn primary" disabled={!pid} onClick={() => {
          const f = plante(pid)!;
          upsert("plantes", { id: uid(), planteId: pid, surnom: surnom.trim() || f.nom.split(" (")[0], piece, fenetre, depuis, arrosages: [], engrais: [], rempotages: [], photos: [] });
          toast("Ajoutée à Mes plantes 🌿");
          setPid(pid0 ?? ""); setSurnom("");
          onDone?.();
        }}>Ajouter</button>
        {onDone && <button className="btn ghost" onClick={onDone}>Annuler</button>}
      </div>
    </div>
  );
}

export default function MesPlantes() {
  const plantes = useStore((s) => s.plantes);
  const [ajout, setAjout] = useState(false);
  const [filtre, setFiltre] = useState("");
  const pieces = [...new Set(plantes.map((p) => p.piece).filter(Boolean))] as string[];
  const now = new Date();
  const list = plantes.filter((p) => !filtre || p.piece === filtre).map((mp) => ({ mp, e: echeances(mp, now) })).sort((a, b) => a.e[0].dans - b.e[0].dans);
  const dus = list.filter((x) => x.e[0].dans <= 0);
  return (
    <div>
      <p className="muted small">Chaque plante de la maison avec ses rappels d'arrosage, d'engrais et de rempotage, adaptés à la saison et à sa lumière. Les rappels disent « vérifier » : on n'arrose que si la terre est sèche au doigt.</p>
      <div className="row">
        <button className="btn primary" onClick={() => setAjout(!ajout)}>➕ Ajouter une plante</button>
        {dus.length > 1 && <button className="btn" onClick={() => { dus.forEach(({ mp }) => upsert("plantes", marquer(mp, "arrosage"))); toast(`${dus.length} plantes notées arrosées 💧`); }}>💧 J'ai fait le tour ({dus.length})</button>}
      </div>
      {ajout && <AjoutMaPlante onDone={() => setAjout(false)} />}
      <Rappels />
      {pieces.length > 1 && (
        <div className="chips" style={{ marginTop: 10 }}>
          <button className={`chip ${!filtre ? "on" : ""}`} onClick={() => setFiltre("")}>Toutes</button>
          {pieces.map((p) => <button key={p} className={`chip ${filtre === p ? "on" : ""}`} onClick={() => setFiltre(p)}>{p}</button>)}
        </div>
      )}
      {!plantes.length && !ajout && <Empty emoji="🌿">Ajoutez vos plantes : vous saurez chaque jour lesquelles vérifier, et vous garderez l'historique de leurs soins et de leurs photos.</Empty>}
      <div className="grid" style={{ marginTop: 12 }}>
        {list.map(({ mp, e }) => <CartePlante key={mp.id} mp={mp} e={e} />)}
      </div>
    </div>
  );
}

function CartePlante({ mp, e }: { mp: MaPlante; e: ReturnType<typeof echeances> }) {
  const f = plante(mp.planteId);
  const [ouvert, setOuvert] = useState(false);
  const [freq, setFreq] = useState(String(mp.frequence ?? ""));
  const ref = useRef<HTMLInputElement>(null);
  const photo = [...mp.photos].sort((a, b) => b.date.localeCompare(a.date))[0];
  const urgent = e[0].dans <= 0;
  return (
    <div className="card" style={{ borderColor: urgent ? "var(--sun)" : undefined, borderWidth: urgent ? 2 : 1 }}>
      <div className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
        <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "var(--surface-2)", display: "grid", placeItems: "center", fontSize: "2rem" }}>
          {photo ? <StoredPhoto k={photo.key} className="photo-thumb" /> : <Photo id={mp.planteId} emoji={f?.emoji ?? "🌿"} alt="" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>{mp.surnom}</b>
          <div className="small muted">{f && <a href={href(`/plante/${f.id}`)}>{f.nom}</a>}{mp.piece ? ` · ${mp.piece}` : ""}{mp.fenetre ? ` · ${FENETRES[mp.fenetre].label.toLowerCase()}` : ""}</div>
          {(() => {
            const jours = mp.depuis ? Math.floor((Date.now() - new Date(mp.depuis + "T12:00:00").getTime()) / 86400000) : 0;
            const palier = jours >= 365 ? "🏆 Un an avec vous !" : jours >= 180 ? "🎉 Six mois : vous avez la main verte" : jours >= 90 ? "🌟 Trois mois, elle est bien installée" : jours >= 30 ? "🌱 Un mois, bravo" : "";
            return jours > 0 ? <div className="small" style={{ color: "var(--green)" }}>{palier || `Avec vous depuis ${jours} jour${jours > 1 ? "s" : ""}`} · {mp.arrosages.length} arrosage{mp.arrosages.length > 1 ? "s" : ""} noté{mp.arrosages.length > 1 ? "s" : ""}</div> : null;
          })()}
          {e.map((x) => <div key={x.type} className="small" style={{ color: x.dans <= 0 ? "var(--terra)" : undefined, fontWeight: x.dans <= 0 ? 800 : undefined }}>{x.type === "arrosage" ? "💧" : x.type === "engrais" ? "🌱" : "🏺"} {x.texte}</div>)}
        </div>
      </div>
      <div className="row" style={{ marginTop: 10, gap: 6 }}>
        <button className="btn sm primary" onClick={() => { upsert("plantes", marquer(mp, "arrosage")); toast("Arrosage noté 💧"); }}>💧 Arrosée</button>
        <button className="btn sm" onClick={() => { upsert("plantes", marquer(mp, "engrais")); toast("Engrais noté"); }}>🌱 Engrais</button>
        <button className="btn sm" onClick={() => ref.current?.click()}>📷</button>
        <button className="btn sm ghost" onClick={() => setOuvert(!ouvert)}>{ouvert ? "▲" : "Plus…"}</button>
        <input ref={ref} type="file" accept="image/*" capture="environment" hidden onChange={async (ev) => { const fl = ev.target.files?.[0]; if (!fl) return; const key = await savePhoto(fl); upsert("plantes", { ...mp, photos: [...mp.photos, { date: today(), key }] }); toast("Photo ajoutée à son album"); }} />
      </div>
      {ouvert && (
        <div className="stack" style={{ marginTop: 10 }}>
          {mp.photos.length >= 2 && (() => {
            const tri = [...mp.photos].sort((x, y) => x.date.localeCompare(y.date));
            const [av, ap] = [tri[0], tri[tri.length - 1]];
            return (
              <div>
                <b className="small">📷 Avant / après</b>
                <div className="row" style={{ gap: 8, flexWrap: "nowrap" }}>
                  <figure style={{ margin: 0, flex: 1 }}><StoredPhoto k={av.key} className="photo-thumb" /><figcaption className="small muted">{new Date(av.date).toLocaleDateString("fr-FR")}</figcaption></figure>
                  <figure style={{ margin: 0, flex: 1 }}><StoredPhoto k={ap.key} className="photo-thumb" /><figcaption className="small muted">{new Date(ap.date).toLocaleDateString("fr-FR")}</figcaption></figure>
                </div>
              </div>
            );
          })()}
          <div className="row">
            <button className="btn sm" onClick={() => { upsert("plantes", marquer(mp, "rempotage")); toast("Rempotage noté"); }}>🏺 Rempotée aujourd'hui</button>
            <a className="btn sm" href={href(`/diagnostic?plante=${mp.planteId}`)}>⚕️ Un souci ?</a>
          </div>
          <label className="field small">Arroser tous les … jours (vide = automatique : {intervalleArrosage({ ...mp, frequence: undefined })} j en ce moment)
            <div className="row"><input type="number" min="1" value={freq} onChange={(ev) => setFreq(ev.target.value)} style={{ width: 100 }} /><button className="btn sm" onClick={() => { upsert("plantes", { ...mp, frequence: freq ? Number(freq) : undefined }); toast("Rythme enregistré"); }}>OK</button></div>
          </label>
          <div className="small muted">
            Derniers arrosages : {mp.arrosages.slice(-5).reverse().map((d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })).join(", ") || "aucun"}
            {mp.rempotages.length > 0 && <> · Dernier rempotage : {new Date(mp.rempotages.at(-1)!).toLocaleDateString("fr-FR")}</>}
          </div>
          {mp.photos.length > 0 && (
            <div>
              <b className="small">📸 Album ({mp.photos.length})</b>
              <div className="row" style={{ overflowX: "auto", flexWrap: "nowrap", marginTop: 6 }}>
                {[...mp.photos].sort((a, b) => a.date.localeCompare(b.date)).map((ph) => (
                  <figure key={ph.key} style={{ margin: 0, textAlign: "center" }}>
                    <StoredPhoto k={ph.key} className="photo-thumb" />
                    <figcaption className="small muted">{new Date(ph.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" })}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
          <button className="btn sm danger" onClick={() => confirm(`Retirer « ${mp.surnom} » de Mes plantes ?`) && remove("plantes", mp.id)}>🗑 Retirer</button>
        </div>
      )}
    </div>
  );
}

// Être prévenu sans ouvrir l'appli
function Rappels() {
  const notifs = useStore((s) => !!s.settings.notifs);
  const ios = /iphone|ipad/i.test(navigator.userAgent);
  const installee = window.matchMedia?.("(display-mode: standalone)").matches;
  const agenda = () => { download("racines-mes-plantes.ics", new Blob([buildIcs(getState(), { mois: 3, travaux: false, mesPlantes: true })], { type: "text/calendar" })); toast("Ouvrez le fichier : le « tour des plantes » du samedi s'ajoute à votre agenda, avec une alarme."); };
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <b>🔔 Être prévenu, même sans ouvrir l'appli</b>
      {notifs ? (
        <p className="small" style={{ margin: "6px 0" }}>✅ Rappels activés sur cet appareil : une notification par jour au plus, quand une plante est à vérifier. <button className="btn sm ghost" onClick={desactiverRappels}>Désactiver</button></p>
      ) : (
        <p className="small" style={{ margin: "6px 0" }}>Une notification par jour au plus, seulement quand une plante est à vérifier. Rien n'est envoyé sur Internet.</p>
      )}
      <div className="row" style={{ gap: 8 }}>
        {!notifs && notifsPossibles() && <button className="btn primary" onClick={async () => { const r = await activerRappels(); toast(r === "ok" ? "Rappels activés 🔔" : r === "refuse" ? "Notifications refusées : autorisez-les dans les réglages du navigateur, ou utilisez l'agenda." : "Notifications impossibles ici : utilisez l'agenda."); }}>🔔 Me prévenir sur ce téléphone</button>}
        <button className="btn" onClick={agenda}>📅 Ajouter un rappel à mon agenda</button>
      </div>
      <p className="small muted" style={{ margin: "6px 0 0" }}>{ios && !installee ? "Sur iPhone, les notifications ne marchent que si Racines est installée sur l'écran d'accueil (Partager → « Sur l'écran d'accueil »). En attendant, l'agenda est le plus fiable." : "Appli fermée, les notifications dépendent du téléphone (Android avec l'appli installée : oui ; sinon à l'ouverture). L'agenda marche partout."}</p>
    </div>
  );
}
