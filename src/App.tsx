import { lazy, Suspense, useEffect } from "react";
import { useRoute, href } from "./lib/router";
import { useLoaded, useStore } from "./lib/store";
import { Player } from "./components/Player";
import { usePwa, applyUpdate } from "./lib/pwa";
import { demarrerRappels } from "./lib/rappels";
import Accueil from "./pages/Accueil";
import Onboarding from "./pages/Onboarding";
import Garde from "./components/Garde";

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
const Lexique = lazy(() => import("./pages/Lexique"));
const MaladieAnimale = lazy(() => import("./pages/SanteAnimale"));
const DiagnosticAnimal = lazy(() => import("./pages/SanteAnimale").then((m) => ({ default: m.DiagnosticAnimal })));
const Calculs = lazy(() => import("./pages/Calculs"));
const PlanCulture = lazy(() => import("./pages/PlanCulture"));
const Bio = lazy(() => import("./pages/Bio"));
const Debuter = lazy(() => import("./pages/Debuter"));
const Sol = lazy(() => import("./pages/Sol"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Interieur = lazy(() => import("./pages/Interieur"));
const Cueillette = lazy(() => import("./pages/Cueillette"));
const Demenagement = lazy(() => import("./pages/Demenagement"));
const Amenagements = lazy(() => import("./pages/Amenagements"));
const Rucher = lazy(() => import("./pages/Rucher"));
import BarreRecherche from "./components/BarreRecherche";
import { Ico } from "./components/Ico";

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
  { to: "/", label: "Aujourd'hui", i: "🏡", ico: "aujourdhui", main: true },
  { to: "/calendrier", label: "Calendrier", i: "📅", ico: "calendrier", main: true },
  { to: "/plantes", label: "Plantes et fleurs", i: "🌱", ico: "plantes", main: true },
  { to: "/sante", label: "Santé", i: "🩺", ico: "sante", main: true },
  { to: "/interieur", label: "Intérieur et aromates", i: "🌿", ico: "interieur" },
  { to: "/sol", label: "Mon sol et les engrais", i: "🟫", ico: "compost" },
  { to: "/bio", label: "Bio et éco-score", i: "🌿", ico: "plantes" },
  { to: "/jardin", label: "Mon jardin", i: "🧺", ico: "jardin" },
  { to: "/creer", label: "Créer mon potager", i: "👨‍🌾", ico: "creer" },
  { to: "/guides", label: "Tutoriels", i: "📘", ico: "tutoriels" },
  { to: "/lexique", label: "Lexique", i: "📖", ico: "lexique" },
  { to: "/animaux", label: "Animaux", i: "🐔", ico: "animaux" },
  { to: "/identifier", label: "Identifier (photo)", i: "📷", ico: "identifier" },
  { to: "/associations", label: "Associations", i: "🤝", ico: "associations" },
  { to: "/reglages", label: "Réglages", i: "⚙️", ico: "reglages" },
];

export default function App() {
  const route = useRoute();
  const loaded = useLoaded();
  const onboarded = useStore((s) => s.settings.onboarded);
  const appart = useStore((s) => s.settings.situation === "appartement");
  const debutant = useStore((s) => !!s.settings.debutant);
  const nav = (debutant ? [NAV[0], { to: "/debuter", label: "Je débute", i: "🌱", ico: "plantes" }, ...NAV.slice(1)] : NAV).map((n) => (n.to === "/jardin" && appart ? { ...n, label: "Mes plantes", i: "🌿", ico: "mesplantes" } : n.to === "/creer" && appart ? { ...n, label: "Mon potager d'intérieur" } : n));
  const { updateReady } = usePwa();
  const [p0, p1] = route.parts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.path]);
  useEffect(() => { if (loaded) demarrerRappels(); }, [loaded]);

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
    case "lexique": page = <Lexique />; break;
    case "maladie-animale": page = <MaladieAnimale id={p1} />; break;
    case "diagnostic-animal": page = <DiagnosticAnimal />; break;
    case "calculs": page = <Calculs />; break;
    case "debuter": page = <Debuter />; break;
    case "bio": page = <Bio />; break;
    case "plan-culture": page = <PlanCulture />; break;
    case "sol": page = <Sol />; break;
    case "nutrition": page = <Nutrition />; break;
    case "interieur": page = <Interieur />; break;
    case "cueillette": page = <Cueillette />; break;
    case "demenagement": page = <Demenagement />; break;
    case "amenagements": page = <Amenagements />; break;
    case "rucher": page = <Rucher />; break;
    default: page = <Accueil />;
  }
  const isOn = (to: string) => (to === "/" ? route.path === "/" : route.path.startsWith(to) || (to === "/plantes" && p0 === "plante") || (to === "/sante" && ["diagnostic", "probleme", "remede"].includes(p0 ?? "")) || (to === "/guides" && p0 === "guide") || (to === "/jardin" && p0 === "rucher") || (to === "/interieur" && p0 === "interieur") || (to === "/sol" && p0 === "nutrition") || (to === "/animaux" && ["animal", "maladie-animale", "diagnostic-animal"].includes(p0 ?? "")));

  return (
    <div className="app">
      <nav className="side" aria-label="Navigation principale">
        <a className="brand" href={href("/")}><Logo /> Racines</a>
        {nav.map((n, i) => (
          <span key={n.to}>
            {i === (debutant ? 6 : 5) && <div className="sep" />}
            <a href={href(n.to)} className={isOn(n.to) ? "on" : ""}><Ico nom={n.ico} emoji={n.i} taille={26} /> {n.label}</a>
          </span>
        ))}
      </nav>
      <main className="main">
        {route.path !== "/recherche" && <BarreRecherche />}
        {updateReady && (
          <div className="callout info row between">
            <span>Une nouvelle version de Racines est prête.</span>
            <button className="btn sm primary" onClick={applyUpdate}>Mettre à jour</button>
          </div>
        )}
        <Garde cle={route.path}><Suspense fallback={<p className="muted">Chargement…</p>}>{page}</Suspense></Garde>
      </main>
      <nav className="bottom-nav" aria-label="Navigation">
        {(appart ? NAV.map((n) => (n.to === "/calendrier" ? { ...n, to: "/interieur", label: "Intérieur", i: "🌿", ico: "interieur" } : n)) : NAV).filter((n) => n.main).map((n) => (
          <a key={n.to} href={href(n.to)} className={isOn(n.to) ? "on" : ""}><span className="i"><Ico nom={n.ico} emoji={n.i} taille={28} /></span>{n.label.replace(" et fleurs", "")}</a>
        ))}
        <a href={href("/plus")} className={["plus", "jardin", "creer", "guides", "guide", "animaux", "animal", "identifier", "associations", "reglages", "lexique", "maladie-animale", "diagnostic-animal", "calculs", "demenagement", "amenagements", "cueillette", "sol", "nutrition", "debuter", "bio", "plan-culture"].includes(p0 ?? "") ? "on" : ""}><span className="i"><Ico nom="plus" emoji="☰" taille={28} /></span>Plus</a>
      </nav>
      <Player />
    </div>
  );
}

export { NAV };
