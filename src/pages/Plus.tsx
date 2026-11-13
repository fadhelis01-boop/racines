import { href } from "../lib/router";
import { NAV } from "../App";

export default function Plus() {
  return (
    <div>
      <h1>☰ Tout Racines</h1>
      <div className="grid-sm">
        {NAV.map((n) => (
          <a key={n.to} className="btn big" href={href(n.to)} style={{ justifyContent: "flex-start" }}><span aria-hidden="true">{n.i}</span> {n.label}</a>
        ))}
        <a className="btn big" href={href("/recherche")} style={{ justifyContent: "flex-start" }}>🔍 Rechercher</a>
        <a className="btn big" href={href("/diagnostic")} style={{ justifyContent: "flex-start" }}>🔎 Diagnostic</a>
      </div>
    </div>
  );
}
