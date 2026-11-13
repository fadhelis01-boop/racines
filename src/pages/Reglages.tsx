import { useRef, useState } from "react";
import { useStore, setSettings, exportBackup, importBackup } from "../lib/store";
import { ZONES } from "../data/index";
import type { ZoneId } from "../data/calendrier";
import { chercherVille } from "../lib/meteo";
import { frenchVoices, preview, useTts } from "../lib/tts";
import { download, toast, toutesLesPhotos } from "../components/ui";
import { promptInstall, usePwa, isIos, isStandalone, checkForAppUpdate } from "../lib/pwa";
import { isoDate } from "../lib/store";

export default function Reglages() {
  const s = useStore((x) => x.settings);
  useTts((x) => x.supported); // re-rendu quand les voix arrivent
  const voices = frenchVoices();
  const [q, setQ] = useState("");
  const [villes, setVilles] = useState<{ nom: string; lat: number; lon: number }[]>([]);
  const { canInstall } = usePwa();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h1>⚙️ Réglages</h1>

      <h2>Mon jardin</h2>
      <div className="card stack">
        <label className="field">Où je jardine
          <select value={s.situation} onChange={(e) => setSettings({ situation: e.target.value as typeof s.situation })}>
            <option value="jardin">🏡 Maison avec jardin</option>
            <option value="petit-jardin">🌿 Petit jardin ou cour</option>
            <option value="balcon">🏢 Balcon ou terrasse</option>
            <option value="appartement">🏙️ Appartement sans extérieur</option>
          </select>
        </label>
        <label className="field">Climat (décale tout le calendrier)
          <select value={s.zone} onChange={(e) => setSettings({ zone: e.target.value as ZoneId })}>
            {ZONES.map((z) => <option key={z.id} value={z.id}>{z.nom}</option>)}
          </select>
        </label>
        <div>
          <b>Ville pour la météo</b> {s.ville && <span className="muted">: {s.ville.nom} <button className="btn sm ghost" onClick={() => setSettings({ ville: null })}>Retirer</button></span>}
          <form className="row" style={{ marginTop: 6 }} onSubmit={async (e) => { e.preventDefault(); try { setVilles(await chercherVille(q)); } catch { toast("Recherche impossible hors connexion"); } }}>
            <input type="search" placeholder="Commune" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1 }} />
            <button className="btn">Chercher</button>
          </form>
          <div className="chips" style={{ marginTop: 6 }}>{villes.map((v) => <button key={v.nom + v.lat} className="chip" onClick={() => { setSettings({ ville: v }); setVilles([]); toast("Ville enregistrée"); }}>{v.nom}</button>)}</div>
        </div>
        <label className="row"><input type="checkbox" checked={s.lune} onChange={(e) => setSettings({ lune: e.target.checked })} /> Afficher la lune (tradition jardinière, sans effet démontré)</label>
        <label className="row"><input type="checkbox" checked={s.animauxActifs} onChange={(e) => setSettings({ animauxActifs: e.target.checked })} /> Afficher les conseils pour les animaux dans le calendrier</label>
      </div>

      <h2>Lecture à voix haute</h2>
      <div className="card stack">
        {!voices.length && <p className="small muted">Aucune voix française détectée sur cet appareil pour l'instant. Sur Android, installez « Synthèse vocale Google » ; sur iPhone, Réglages → Accessibilité → Contenu énoncé → Voix → Français.</p>}
        {voices.length > 0 && (
          <label className="field">Voix
            <select value={s.voix} onChange={(e) => setSettings({ voix: e.target.value })}>
              <option value="">Automatique (la plus naturelle disponible)</option>
              {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
          </label>
        )}
        <label className="field">Vitesse : {s.debit.toFixed(2)}×
          <input type="range" min="0.6" max="1.6" step="0.05" value={s.debit} onChange={(e) => setSettings({ debit: Number(e.target.value) })} style={{ width: "100%" }} />
        </label>
        <button className="btn" onClick={() => preview(s.voix || voices[0]?.name || "", s.debit)}>🔊 Tester</button>
      </div>

      <h2>Affichage</h2>
      <div className="card stack">
        <label className="field">Taille du texte
          <select value={s.texte} onChange={(e) => setSettings({ texte: e.target.value as typeof s.texte })}>
            <option value="normal">Normale</option><option value="grand">Grande</option><option value="tres-grand">Très grande</option>
          </select>
        </label>
        <label className="field">Thème
          <select value={s.theme} onChange={(e) => setSettings({ theme: e.target.value as typeof s.theme })}>
            <option value="auto">Comme l'appareil</option><option value="clair">Clair (plein soleil)</option><option value="sombre">Sombre</option>
          </select>
        </label>
        <label className="row"><input type="checkbox" checked={s.sensible} onChange={(e) => setSettings({ sensible: e.target.checked })} /> Afficher les tutoriels d'abattage sans avertissement</label>
      </div>

      <h2>Identification par photo</h2>
      <div className="card stack">
        <label className="field">Clé Pl@ntNet (gratuite, identification des plantes)
          <input type="password" value={s.plantnetKey} onChange={(e) => setSettings({ plantnetKey: e.target.value.trim() })} placeholder="Collez votre clé ici" autoComplete="off" />
        </label>
        <details className="box small"><summary>Comment obtenir une clé Pl@ntNet ?</summary>
          <ol>
            <li>Créez un compte gratuit sur <a href="https://my.plantnet.org" target="_blank" rel="noreferrer">my.plantnet.org</a>.</li>
            <li>Dans « Settings », copiez votre clé d'API (« API key »).</li>
            <li>Dans « Authorized domains », ajoutez l'adresse de cette application ({location.host || "votre domaine"}), sinon le navigateur sera bloqué.</li>
            <li>Collez la clé ci-dessus. 500 identifications par jour sont offertes.</li>
          </ol>
        </details>
        <label className="field">Clé d'API Claude (analyse des maladies et ravageurs)
          <input type="password" value={s.claudeKey} onChange={(e) => setSettings({ claudeKey: e.target.value.trim() })} placeholder="sk-ant-…" autoComplete="off" />
        </label>
        <details className="box small"><summary>Comment obtenir une clé Claude ?</summary>
          <ol>
            <li>Créez un compte sur <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>, ajoutez un petit crédit (paiement à l'usage, quelques centimes par analyse de photo).</li>
            <li>Dans « API Keys », créez une clé et collez-la ci-dessus.</li>
            <li>Conseil : fixez une limite de dépense mensuelle dans la console.</li>
          </ol>
          <p>La clé reste sur cet appareil ; les photos ne sont envoyées que lorsque vous lancez une analyse. Elle n'est jamais incluse dans les sauvegardes.</p>
        </details>
      </div>

      <h2>Installer l'application</h2>
      <div className="card stack">
        {isStandalone() ? <p>✅ Racines est installée sur cet appareil.</p> : canInstall ? (
          <button className="btn primary" onClick={() => void promptInstall()}>📲 Installer Racines</button>
        ) : isIos() ? (
          <p>Sur iPhone / iPad : touchez le bouton <b>Partager</b> (carré avec une flèche) dans Safari, puis <b>« Sur l'écran d'accueil »</b>.</p>
        ) : (
          <p>Dans le menu de votre navigateur (⋮ ou ⋯), choisissez <b>« Installer l'application »</b> ou <b>« Ajouter à l'écran d'accueil »</b>.</p>
        )}
        <p className="small muted">Une fois installée, Racines s'ouvre comme une application et fonctionne sans connexion (sauf météo, vidéos et identification par photo).</p>
        <button className="btn sm" onClick={async () => toast((await checkForAppUpdate()) ? "Mise à jour trouvée : elle s'installe…" : "Vous avez la dernière version.")}>Vérifier les mises à jour</button>
      </div>

      <h2>Photos hors connexion</h2>
      <div className="card stack">
        <p className="small">Les photos des fiches viennent d'Internet et sont gardées sur l'appareil quand vous les voyez. Pour tout consulter sans connexion (jardin sans réseau, voyage), téléchargez-les une fois (environ {Math.round(toutesLesPhotos().length * 0.045)} Mo).</p>
        <button className="btn" onClick={async (e) => {
          const b = e.currentTarget; b.disabled = true;
          const all = toutesLesPhotos(); let ok = 0;
          for (let i = 0; i < all.length; i += 6) {
            await Promise.all(all.slice(i, i + 6).map((u) => fetch(u, { mode: "cors" }).then((r) => { if (r.ok) ok++; }).catch(() => undefined)));
            b.textContent = `Téléchargement… ${Math.min(i + 6, all.length)} / ${all.length}`;
          }
          b.textContent = `✅ ${ok} photos disponibles hors connexion`; b.disabled = false;
        }}>⬇️ Télécharger toutes les photos</button>
        <p className="small muted">Nécessite que l'application soit installée ou ouverte depuis le site publié (le stockage hors ligne est géré par le navigateur).</p>
      </div>

      <h2>Sauvegarde</h2>
      <div className="card stack">
        <p className="small">Vos données (cultures, récoltes, journal et photos, animaux, réglages) sont sur cet appareil uniquement. Sauvegardez-les régulièrement, ou pour les transférer sur un autre appareil.</p>
        <div className="row">
          <button className="btn primary" onClick={async () => { download(`racines-sauvegarde-${isoDate(new Date())}.json`, await exportBackup()); }}>⬇️ Exporter ma sauvegarde</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>⬆️ Restaurer</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; if (!confirm("Remplacer les données actuelles par cette sauvegarde ?")) return; try { await importBackup(f); toast("Sauvegarde restaurée"); } catch (err) { toast((err as Error).message); } }} />
        </div>
      </div>

      <h2>À propos</h2>
      <div className="card small">
        <p><b>Racines</b> — potager, verger, plantes d'intérieur et basse-cour. Contenus rédigés pour la France métropolitaine, à adapter à votre terrain : rien ne remplace l'observation, les conseils des jardiniers de votre région et, pour les animaux, votre vétérinaire.</p>
        <p>Photos des fiches : Wikimedia Commons, sous licences libres ; l'auteur et la licence de chaque photo sont indiqués sous l'image. Illustrations des tutoriels : créations originales. Météo : Open-Meteo. Identification : Pl@ntNet, Anthropic Claude (avec vos clés).</p>
        <p>Aucune publicité, aucun traceur, aucun compte.</p>
      </div>
    </div>
  );
}
