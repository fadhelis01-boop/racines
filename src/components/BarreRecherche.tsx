import { useEffect, useRef, useState } from "react";
import { rechercher } from "../lib/search";
import { go, href } from "../lib/router";
import { Vignette } from "./Ico";

// Barre de recherche présente sur toutes les pages : plantes, fleurs, arbres,
// maladies, ravageurs, animaux, tutoriels, remèdes et termes du lexique.
export default function BarreRecherche() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const res = q.trim().length >= 2 ? rechercher(q, 8) : [];
  useEffect(() => {
    const f = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const fermer = () => { setOpen(false); setQ(""); };
    document.addEventListener("pointerdown", f);
    window.addEventListener("hashchange", fermer);
    return () => { document.removeEventListener("pointerdown", f); window.removeEventListener("hashchange", fermer); };
  }, []);
  const aller = (to: string) => { setOpen(false); setQ(""); go(to); };
  return (
    <div className="barre-recherche" ref={ref} role="search">
      <div className="search">
        <input
          type="search"
          placeholder="Rechercher une plante, une fleur, un arbre, une maladie, un terme…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setI(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setI(Math.min(i + 1, res.length)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setI(Math.max(i - 1, 0)); }
            if (e.key === "Enter") { e.preventDefault(); if (res[i] && i < res.length) aller(res[i].href); else aller(`/recherche?q=${encodeURIComponent(q)}`); }
            if (e.key === "Escape") setOpen(false);
          }}
          aria-label="Rechercher dans Racines"
          aria-expanded={open && res.length > 0}
          aria-controls="resultats-recherche"
        />
      </div>
      {open && res.length > 0 && (
        <ul id="resultats-recherche" className="barre-res" role="listbox">
          {res.map((r, k) => (
            <li key={r.href} role="option" aria-selected={k === i}>
              <a href={href(r.href)} onClick={(e) => { e.preventDefault(); aller(r.href); }} className={k === i ? "on" : ""}>
                <Vignette id={r.id} emoji={r.emoji} />
                <span><b>{r.titre}</b><br /><span className="small muted">{r.type}</span></span>
              </a>
            </li>
          ))}
          <li><a href={href(`/recherche?q=${encodeURIComponent(q)}`)} onClick={(e) => { e.preventDefault(); aller(`/recherche?q=${encodeURIComponent(q)}`); }} className="small">Tous les résultats pour « {q} » →</a></li>
        </ul>
      )}
    </div>
  );
}
