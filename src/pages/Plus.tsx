import { Titre } from "../components/ui";
import { useState } from "react";
import { href, go } from "../lib/router";
import { Ico } from "../components/Ico";
import { useStore } from "../lib/store";
import { GROUPES, entreeVisible, filtrerMenu, raccourcis, type Entree } from "../lib/menu";

// Préférences d'affichage du menu, gardées sur l'appareil (sans incidence si le stockage est bloqué)
const lire = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const ecrire = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } };

export default function Plus() {
  const s = useStore((x) => ({ situation: x.settings.situation, animaux: x.settings.animauxActifs || x.troupeaux.length > 0, abeilles: x.troupeaux.some((t) => t.animalId === "abeille") || x.ruches.length > 0, debutant: !!x.settings.debutant }));
  const [tout, setTout] = useState(false);
  const [q, setQ] = useState("");
  const [fermes, setFermes] = useState<string[]>(() => lire("racines-menu-fermes", []));
  const usage = lire<Record<string, number>>("racines-menu-usage", {});
  const visible = (e: Entree) => entreeVisible(e, s, tout);
  const masquees = GROUPES.flatMap((g) => g.entrees).filter((e) => !visible(e)).length;
  const compter = (to: string) => ecrire("racines-menu-usage", { ...usage, [to]: (usage[to] ?? 0) + 1 });
  const basculer = (t: string) => { const f = fermes.includes(t) ? fermes.filter((x) => x !== t) : [...fermes, t]; setFermes(f); ecrire("racines-menu-fermes", f); };
  const trouves = q.trim() ? filtrerMenu(q) : null;
  const rac = raccourcis(usage).filter(visible);

  const Bouton = ({ e }: { e: Entree }) => (
    <a className={`btn big ${e.to === "/debuter" && s.debutant ? "primary" : ""}`} href={href(e.to)} onClick={() => compter(e.to)} style={{ justifyContent: "flex-start", textAlign: "left", flexWrap: "nowrap", gap: 10 }}>
      <Ico nom={e.ico} emoji={e.emoji} taille={36} />
      <span><b>{e.label}</b><br /><span className="small" style={{ fontWeight: 400, opacity: 0.8 }}>{e.desc}</span></span>
    </a>
  );
  const grille = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 } as const;

  return (
    <div>
      <Titre ico="plus" emoji="☰">Tout Racines</Titre>
      <form onSubmit={(ev) => { ev.preventDefault(); if (trouves?.length === 1) { compter(trouves[0].to); go(trouves[0].to); } else if (q.trim()) go(`/recherche?q=${encodeURIComponent(q.trim())}`); }}>
        <input type="search" value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Trouver une rubrique (sol, ruche, conserves…)" aria-label="Trouver une rubrique du menu" style={{ width: "100%" }} />
      </form>

      {trouves ? (
        <section>
          <h2 style={{ marginTop: 16 }}>Rubriques trouvées</h2>
          {trouves.length ? <div style={grille}>{trouves.map((e) => <Bouton key={e.to} e={e} />)}</div> : <p className="small muted">Aucune rubrique ne porte ce nom.</p>}
          <p className="small" style={{ marginTop: 10 }}><a className="btn sm" href={href(`/recherche?q=${encodeURIComponent(q.trim())}`)}>🔍 Chercher « {q.trim()} » dans toutes les fiches</a></p>
        </section>
      ) : (
        <>
          {rac.length > 0 && (
            <section>
              <h2 style={{ marginTop: 16 }}>⭐ Vos raccourcis</h2>
              <div style={grille}>{rac.map((e) => <Bouton key={e.to} e={e} />)}</div>
            </section>
          )}
          {GROUPES.map((g) => {
            const es = g.entrees.filter(visible);
            if (!es.length) return null;
            const ouvert = !fermes.includes(g.titre);
            return (
              <section key={g.titre}>
                <h2 style={{ marginTop: 16 }}>
                  <button className="btn ghost" aria-expanded={ouvert} onClick={() => basculer(g.titre)} style={{ font: "inherit", padding: 0, gap: 8 }}>
                    {g.titre} <span className="small muted" aria-hidden>{ouvert ? "▾" : `▸ ${es.length}`}</span>
                  </button>
                </h2>
                {ouvert && <div style={grille}>{es.map((e) => <Bouton key={e.to} e={e} />)}</div>}
              </section>
            );
          })}
          {(masquees > 0 || tout) && (
            <p className="small muted" style={{ marginTop: 14 }}>
              {tout ? "Toutes les rubriques sont affichées." : `${masquees} rubrique${masquees > 1 ? "s" : ""} masquée${masquees > 1 ? "s" : ""} selon votre profil (animaux, ruches, logement, niveau).`}{" "}
              <button className="btn sm ghost" onClick={() => setTout(!tout)}>{tout ? "Revenir à mon profil" : "Tout afficher"}</button>
            </p>
          )}
        </>
      )}
    </div>
  );
}
