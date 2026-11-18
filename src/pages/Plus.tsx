import { Titre } from "../components/ui";
import { useState } from "react";
import { href } from "../lib/router";
import { Ico } from "../components/Ico";
import { useStore } from "../lib/store";
import { GROUPES, entreeVisible, type Entree } from "../lib/menu";

export default function Plus() {
  const s = useStore((x) => ({ situation: x.settings.situation, animaux: x.settings.animauxActifs || x.troupeaux.length > 0, abeilles: x.troupeaux.some((t) => t.animalId === "abeille") || x.ruches.length > 0, debutant: !!x.settings.debutant }));
  const [tout, setTout] = useState(false);
  const visible = (e: Entree) => entreeVisible(e, s, tout);
  const masquees = GROUPES.flatMap((g) => g.entrees).filter((e) => !visible(e)).length;
  return (
    <div>
      <Titre ico="plus" emoji="☰">Tout Racines</Titre>
      {GROUPES.map((g) => {
        const es = g.entrees.filter(visible);
        if (!es.length) return null;
        return (
          <section key={g.titre}>
            <h2 style={{ marginTop: 16 }}>{g.titre}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
              {es.map((e) => (
                <a key={e.to} className={`btn big ${e.to === "/debuter" && s.debutant ? "primary" : ""}`} href={href(e.to)} style={{ justifyContent: "flex-start", textAlign: "left", flexWrap: "nowrap", gap: 10 }}>
                  <Ico nom={e.ico} emoji={e.emoji} taille={36} />
                  <span><b>{e.label}</b><br /><span className="small" style={{ fontWeight: 400, opacity: 0.8 }}>{e.desc}</span></span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
      {(masquees > 0 || tout) && (
        <p className="small muted" style={{ marginTop: 14 }}>
          {tout ? "Toutes les rubriques sont affichées." : `${masquees} rubrique${masquees > 1 ? "s" : ""} masquée${masquees > 1 ? "s" : ""} selon votre profil (animaux, ruches, logement, niveau).`}{" "}
          <button className="btn sm ghost" onClick={() => setTout(!tout)}>{tout ? "Revenir à mon profil" : "Tout afficher"}</button>
        </p>
      )}
    </div>
  );
}
