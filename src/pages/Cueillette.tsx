import { useEffect } from "react";
import { GESTES_RECOLTE } from "../data/cueillette";
import { plante } from "../data/index";
import { useRoute, href } from "../lib/router";
import { Back, Listen, Galerie, wikiOf } from "../components/ui";
import { srcVignette, Vignette } from "../components/Ico";
import { youtube } from "../data/util";

// Comment cueillir chaque type de plante : un geste illustré par famille de récolte
export default function Cueillette() {
  const cible = useRoute().query.get("g") ?? "";
  useEffect(() => { if (cible) setTimeout(() => document.getElementById(cible)?.scrollIntoView({ block: "start" }), 100); }, [cible]);
  return (
    <div>
      <Back />
      <h1>🧺 Bien cueillir et récolter</h1>
      <p className="muted small" style={{ marginTop: -6 }}>Le bon moment et le bon geste pour chaque type de récolte : on cueille sans abîmer la plante, elle produit plus longtemps et la récolte se garde mieux. Chaque fiche de plante renvoie ici, avec sa période de récolte selon votre climat.</p>
      <div className="callout info small"><b>Règles communes</b>Outils propres et affûtés ; récolte au frais (matin ou soir) ; feuillage sec pour ne pas propager les maladies ; un panier ou une caisse, pas un sac où tout s'écrase ; on met à l'ombre tout de suite.</div>
      <div className="chips" style={{ margin: "10px 0" }}>
        {GESTES_RECOLTE.map((g) => <a key={g.id} className="chip" href={href(`/cueillette?g=${g.id}`)}>{g.emoji} {g.titre.split(" :")[0]}</a>)}
      </div>
      {GESTES_RECOLTE.map((g) => {
        const img = srcVignette(g.id)?.startsWith("./img/") ? srcVignette(g.id) : undefined;
        return (
          <section key={g.id} id={g.id} className="card" style={{ borderColor: cible === g.id ? "var(--green)" : undefined, borderWidth: cible === g.id ? 2 : 1 }}>
            <h2 style={{ marginTop: 0 }}>{g.emoji} {g.titre}</h2>
            <div className="row" style={{ alignItems: "flex-start", gap: 12 }}>
              {wikiOf(g.id)?.photos?.length ? <div className="hero" style={{ flex: "1 1 260px", display: "block" }}><Galerie id={g.id} emoji={g.emoji} alt={g.titre} photoFirst /></div> : null}
              {img && <figure style={{ flex: "1 1 240px", margin: 0 }}><img src={img} alt={g.titre} loading="lazy" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10 }} /><figcaption className="small muted">Illustration</figcaption></figure>}
            </div>
            <p><b>Quand :</b> {g.quand}</p>
            <ol className="steps">{g.comment.map((c) => <li key={c}>{c}</li>)}</ol>
            <div className="callout warn small"><b>À éviter</b>{g.erreurs.join(" ")}</div>
            <div className="chips" style={{ margin: "8px 0" }}>
              {g.plantes.map(plante).filter(Boolean).slice(0, 24).map((p) => <a key={p!.id} className="chip" href={href(`/plante/${p!.id}`)}><Vignette id={p!.id} emoji={p!.emoji} taille={20} /> {p!.nom}</a>)}
            </div>
            <div className="row" style={{ gap: 6 }}>
              <a className="chip" href={youtube(g.video)} target="_blank" rel="noreferrer">▶️ Voir le geste en vidéo</a>
              <Listen id={"cueil-" + g.id} title={g.titre} blocks={[g.titre, `Quand. ${g.quand}`, ...g.comment, `À éviter. ${g.erreurs.join(" ")}`]} label="Écouter" />
            </div>
          </section>
        );
      })}
      <p className="small"><a href={href("/guide/conserver-recoltes")}>Conserver ses récoltes →</a> · <a href={href("/guide/graines-maison")}>Récolter ses graines →</a></p>
    </div>
  );
}
