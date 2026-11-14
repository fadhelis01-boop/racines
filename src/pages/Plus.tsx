import { href } from "../lib/router";
import { NAV } from "../App";
import { Ico } from "../components/Ico";

export default function Plus() {
  return (
    <div>
      <h1>☰ Tout Racines</h1>
      <div className="grid-sm">
        {NAV.map((n) => (
          <a key={n.to} className="btn big" href={href(n.to)} style={{ justifyContent: "flex-start" }}><Ico nom={n.ico} emoji={n.i} taille={36} /> {n.label}</a>
        ))}
        <a className="btn big" href={href("/recherche")} style={{ justifyContent: "flex-start" }}><Ico nom="recherche" emoji="🔍" taille={36} /> Rechercher</a>
        <a className="btn big" href={href("/diagnostic")} style={{ justifyContent: "flex-start" }}><Ico nom="diagnostic" emoji="🔎" taille={36} /> Diagnostic</a>
      </div>
    </div>
  );
}
