import { lazy, Suspense, useEffect } from "react";
import { useRoute, href } from "./lib/router";
import { useLoaded, useStore } from "./lib/store";
import { Player } from "./components/Player";
import { usePwa, applyUpdate } from "./lib/pwa";
import Accueil from "./pages/Accueil";
import Onboarding from "./pages/Onboarding";

const Calendrier = lazy(() => import("./pages/Calendrier"));
const Plantes = lazy(() => import("./pages/Plantes"));
const PlanteFiche = lazy(() => import("./pages/PlanteFiche"));
const Sante = lazy(() => import("./pages/Sante"));
const Diagnostic = lazy(() => import("./pages/Diagnostic"));
const ProblemeFiche = lazy(() => import("./pages/ProblemeFiche"));
const RemedeFiche = lazy(() => import("./pages/RemedeFiche"));
const Identifier = lazy(() => import("./pages/Identifier"));
const Animaux = lazy(() => import("./pages/Animaux"));
const AnimalFiche = lazy(() => import("./pages/AnimalFiche"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideFiche = lazy(() => import("./pages/GuideFiche"));
const Jardin = lazy(() => import("./pages/Jardin"));
const Creer = lazy(() => import("./pages/Creer"));
const Associations = lazy(() => import("./pages/Associations"));
const Reglages = lazy(() => import("./pages/Reglages"));
const Plus = lazy(() => import("./pages/Plus"));
const Recherche = lazy(() => import("./pages/Recherche"));

export const Logo = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="var(--green)" />
    <path d="M32 40 C32 26 22 20 14 20 C14 30 20 38 32 40Z" fill="#a8e0a0" />
    <path d="M32 36 C32 22 42 14 51 15 C50 27 44 34 32 36Z" fill="#d6f2c8" />
    <path d="M32 18 V46" stroke="#fffdf7" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 46 C26 48 22 52 20 56 M32 46 C38 48 42 52 44 56 M32 46 V56" stroke="#e7c9a0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const NAV = [
  { to: "/", label: "Aujourd'hui", i: "🏡", main: true },
  { to: "/calendrier", label: "Calendrier", i: "📅", main: true },
  { to: "/plantes", label: "Plantes", i: "🌱", main: true },
  { to: "/sante", label: "Santé", i: "🩺", main: true },
  { to: "/jardin", label: "Mon jardin", i: "🧺" },
  { to: "/creer", label: "Créer mon potager", i: "👨‍🌾" },
  { to: "/guides", label: "Tutoriels", i: "📘" },
  { to: "/animaux", label: "Animaux", i: "🐔" },
  { to: "/identifier", label: "Identifier (photo)", i: "📷" },
  { to: "/associations", label: "Associations", i: "🤝" },
  { to: "/reglages", label: "Réglages", i: "⚙️" },
];

export default function App() {
  const route = useRoute();
  const loaded = useLoaded();
  const onboarded = useStore((s) => s.settings.onboarded);
  const { updateReady } = usePwa();
  const [p0, p1] = route.parts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.path]);

  if (!loaded) return null;
  if (!onboarded) return <Onboarding />;

  let page;
  switch (p0) {
    case undefined: page = <Accueil />; break;
    case "calendrier": page = <Calendrier />; break;
    case "plantes": page = <Plantes />; break;
    case "plante": page = <PlanteFiche id={p1} />; break;
    case "sante": page = <Sante />; break;
    case "diagnostic": page = <Diagnostic />; break;
    case "probleme": page = <ProblemeFiche id={p1} />; break;
    case "remede": page = <RemedeFiche id={p1} />; break;
    case "identifier": page = <Identifier />; break;
    case "animaux": page = <Animaux />; break;
    case "animal": page = <AnimalFiche id={p1} />; break;
    case "guides": page = <Guides />; break;
    case "guide": page = <GuideFiche id={p1} />; break;
    case "jardin": page = <Jardin tab={p1} />; break;
    case "creer": page = <Creer />; break;
    case "associations": page = <Associations />; break;
    case "reglages": page = <Reglages />; break;
    case "plus": page = <Plus />; break;
    case "recherche": page = <Recherche />; break;
    default: page = <Accueil />;
  }
  const isOn = (to: string) => (to === "/" ? route.path === "/" : route.path.startsWith(to) || (to === "/plantes" && p0 === "plante") || (to === "/sante" && ["diagnostic", "probleme", "remede"].includes(p0 ?? "")) || (to === "/guides" && p0 === "guide") || (to === "/animaux" && p0 === "animal"));

  return (
    <div className="app">
      <nav className="side" aria-label="Navigation principale">
        <a className="brand" href={href("/")}><Logo /> Racines</a>
        {NAV.map((n, i) => (
          <span key={n.to}>
            {i === 4 && <div className="sep" />}
            <a href={href(n.to)} className={isOn(n.to) ? "on" : ""}><span aria-hidden="true">{n.i}</span> {n.label}</a>
          </span>
        ))}
      </nav>
      <main className="main">
        {updateReady && (
          <div className="callout info row between">
            <span>Une nouvelle version de Racines est prête.</span>
            <button className="btn sm primary" onClick={applyUpdate}>Mettre à jour</button>
          </div>
        )}
        <Suspense fallback={<p className="muted">Chargement…</p>}>{page}</Suspense>
      </main>
      <nav className="bottom-nav" aria-label="Navigation">
        {NAV.filter((n) => n.main).map((n) => (
          <a key={n.to} href={href(n.to)} className={isOn(n.to) ? "on" : ""}><span className="i" aria-hidden="true">{n.i}</span>{n.label}</a>
        ))}
        <a href={href("/plus")} className={["plus", "jardin", "creer", "guides", "guide", "animaux", "animal", "identifier", "associations", "reglages"].includes(p0 ?? "") ? "on" : ""}><span className="i" aria-hidden="true">☰</span>Plus</a>
      </nav>
      <Player />
    </div>
  );
}

export { NAV };
