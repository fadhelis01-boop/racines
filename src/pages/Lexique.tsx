import { useEffect, useState } from "react";
import { LEXIQUE } from "../data/lexique";
import { lienVers } from "../data/index";
import { useRoute, href } from "../lib/router";
import { norm } from "../lib/garden";
import { youtube } from "../data/util";
import { Listen, Titre } from "../components/ui";
import { Vignette, srcVignette } from "../components/Ico";

export default function Lexique() {
  const route = useRoute();
  const cible = route.query.get("t") ?? "";
  const [q, setQ] = useState("");
  const nq = norm(q);
  const termes = [...LEXIQUE].sort((a, b) => norm(a.terme).localeCompare(norm(b.terme)));
  const list = termes.filter((t) => !nq || norm([t.terme, t.def, ...(t.alias ?? [])].join(" ")).includes(nq));
  const lettres = [...new Set(termes.map((t) => norm(t.terme)[0].toUpperCase()))];
  useEffect(() => {
    if (cible) setTimeout(() => document.getElementById("t-" + cible)?.scrollIntoView({ block: "center" }), 100);
  }, [cible]);
  return (
    <div>
      <Titre ico="lexique" emoji="📖">Lexique du jardinier</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>{LEXIQUE.length} termes techniques expliqués simplement, avec une photo quand c'est possible, la fiche ou le tutoriel qui montre le geste, et une vidéo.</p>
      <div className="search"><input type="search" placeholder="Chercher un terme : butter, gourmand, pH, bouture…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Chercher dans le lexique" /></div>
      {!q && (
        <div className="chips" style={{ margin: "10px 0" }} aria-label="Index alphabétique">
          {lettres.map((l) => <button key={l} className="chip" onClick={() => document.getElementById("l-" + l)?.scrollIntoView({ block: "start" })}>{l}</button>)}
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        {list.map((t, i) => {
          const l = norm(t.terme)[0].toUpperCase();
          const debut = !q && (i === 0 || norm(list[i - 1].terme)[0].toUpperCase() !== l);
          const lien = t.voir ? lienVers(t.voir) : null;
          return (
            <div key={t.id}>
              {debut && <h2 id={"l-" + l}>{l}</h2>}
              <div id={"t-" + t.id} className="card row" style={{ alignItems: "flex-start", flexWrap: "nowrap", borderColor: cible === t.id ? "var(--green)" : undefined, borderWidth: cible === t.id ? 2 : 1 }}>
                <Vignette id={srcVignette("lex-" + t.id) ? "lex-" + t.id : t.voir} emoji="📖" taille={84} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b>{t.terme}</b>
                  <p className="small" style={{ margin: "4px 0" }}>{t.def}</p>
                  <div className="row small" style={{ gap: 6 }}>
                    {lien && <a className="chip" href={href(lien.href)}>{lien.emoji} {lien.label}</a>}
                    <a className="chip" href={youtube((t.video ?? t.terme.split(" (")[0]) + " jardinage explication")} target="_blank" rel="noreferrer">▶️ Vidéo</a>
                    <Listen id={"lex-" + t.id} title={t.terme} blocks={[`${t.terme}. ${t.def}`]} label="Écouter" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!list.length && <p className="muted">Aucun terme ne correspond.</p>}
      </div>
    </div>
  );
}
