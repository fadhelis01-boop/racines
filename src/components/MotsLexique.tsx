import { useEffect, useRef, useState, type ReactNode } from "react";
import { LEXIQUE } from "../data/lexique";
import { href } from "../lib/router";

import { decouper } from "../lib/lexique-texte";

function Mot({ id, children }: { id: string; children: ReactNode }) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const t = LEXIQUE.find((x) => x.id === id)!;
  useEffect(() => {
    if (!ouvert) return;
    const f = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setOuvert(false); };
    document.addEventListener("pointerdown", f);
    return () => document.removeEventListener("pointerdown", f);
  }, [ouvert]);
  return (
    <span ref={ref} style={{ position: "relative" }}>
      <button type="button" className="mot-lex" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOuvert(!ouvert); }} aria-expanded={ouvert} title={t.def}>{children}</button>
      {ouvert && (
        <span role="tooltip" className="bulle-lex">
          <b>{t.terme}</b>
          <span style={{ display: "block", margin: "4px 0" }}>{t.def}</span>
          <a href={href(`/lexique?t=${t.id}`)}>Voir dans le lexique →</a>
        </span>
      )}
    </span>
  );
}

export default function MotsLexique({ texte }: { texte: string }) {
  return <>{decouper(texte).map((x, i) => (x.id ? <Mot key={i} id={x.id}>{x.t}</Mot> : <span key={i}>{x.t}</span>))}</>;
}
