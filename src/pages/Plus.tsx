import { href } from "../lib/router";
import { NAV } from "../App";
import { Ico } from "../components/Ico";

export default function Plus() {
  return (
    <div>
      <h1>☰ Tout Racines</h1>
      <div className="grid-sm">
        <a className="btn big primary" href={href("/debuter")} style={{ justifyContent: "flex-start" }}><Ico nom="plantes" emoji="🌱" taille={36} /> Je débute : par où commencer</a>
        {NAV.map((n) => (
          <a key={n.to} className="btn big" href={href(n.to)} style={{ justifyContent: "flex-start" }}><Ico nom={n.ico} emoji={n.i} taille={36} /> {n.label}</a>
        ))}
        <a className="btn big" href={href("/recherche")} style={{ justifyContent: "flex-start" }}><Ico nom="recherche" emoji="🔍" taille={36} /> Rechercher</a>
        <a className="btn big" href={href("/diagnostic")} style={{ justifyContent: "flex-start" }}><Ico nom="diagnostic" emoji="🔎" taille={36} /> Diagnostic des plantes</a>
        <a className="btn big" href={href("/diagnostic-animal")} style={{ justifyContent: "flex-start" }}><Ico nom="sante" emoji="🩺" taille={36} /> Diagnostic des animaux</a>
        <a className="btn big" href={href("/calculs")} style={{ justifyContent: "flex-start" }}><Ico nom="creer" emoji="🧮" taille={36} /> Calculs pratiques</a>
        <a className="btn big" href={href("/amenagements")} style={{ justifyContent: "flex-start" }}><Ico nom="jardin" emoji="🗺️" taille={36} /> Aménager son jardin</a>
        <a className="btn big" href={href("/nutrition")} style={{ justifyContent: "flex-start" }}><Ico nom="compost" emoji="🍽️" taille={36} /> Nourrir plantes et animaux</a>
        <a className="btn big" href={href("/rucher")} style={{ justifyContent: "flex-start" }}><Ico nom="animaux" emoji="🐝" taille={36} /> Mon rucher</a>
        <a className="btn big" href={href("/plan-culture")} style={{ justifyContent: "flex-start" }}><Ico nom="calendrier" emoji="📋" taille={36} /> Plan de culture (maraîchage)</a>
        <a className="btn big" href={href("/cueillette")} style={{ justifyContent: "flex-start" }}><Ico nom="recolte-action" emoji="🧺" taille={36} /> Bien cueillir</a>
        <a className="btn big" href={href("/demenagement")} style={{ justifyContent: "flex-start" }}><Ico nom="reglages" emoji="📦" taille={36} /> Je déménage</a>
      </div>
    </div>
  );
}
