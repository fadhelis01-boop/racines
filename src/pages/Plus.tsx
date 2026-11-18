import { useState } from "react";
import { href } from "../lib/router";
import { Ico } from "../components/Ico";
import { useStore } from "../lib/store";

interface Entree { to: string; label: string; desc: string; ico: string; emoji: string; si?: "animaux" | "abeilles" | "terre" | "confirme" }

// Le menu « Plus », rangé par usage. Chaque entrée dit en une phrase à quoi elle sert.
const GROUPES: { titre: string; entrees: Entree[] }[] = [
  { titre: "🏡 Mon jardin", entrees: [
    { to: "/jardin", label: "Mon jardin", desc: "Vos plantes, semis, récoltes et rappels", ico: "jardin", emoji: "🧺" },
    { to: "/calendrier", label: "Calendrier", desc: "Ce qui se sème, se plante et se récolte ce mois-ci", ico: "calendrier", emoji: "📅" },
    { to: "/creer", label: "Créer mon potager", desc: "5 questions, puis un plan pour votre première année", ico: "creer", emoji: "👨‍🌾" },
    { to: "/amenagements", label: "Choisir une méthode de potager", desc: "Carrés, buttes, lasagnes, pots… et laquelle vous convient", ico: "jardin", emoji: "🗺️" },
    { to: "/plan-culture", label: "Plan de culture", desc: "Pour produire beaucoup et en continu (niveau avancé)", ico: "calendrier", emoji: "📋", si: "confirme" },
    { to: "/demenagement", label: "Je déménage", desc: "Emporter ses plantes et repartir dans un nouveau lieu", ico: "reglages", emoji: "📦" },
  ] },
  { titre: "📘 Apprendre", entrees: [
    { to: "/debuter", label: "Je débute : par où commencer", desc: "Les premiers pas, étape par étape", ico: "plantes", emoji: "🌱" },
    { to: "/guides", label: "Tutoriels", desc: "Tous les pas-à-pas, du plus facile au plus avancé", ico: "tutoriels", emoji: "📘" },
    { to: "/interieur", label: "Intérieur et aromates", desc: "Plantes vertes et herbes de la maison", ico: "interieur", emoji: "🌿" },
    { to: "/sol", label: "Mon sol", desc: "Reconnaître sa terre et l'améliorer", ico: "compost", emoji: "🌍", si: "terre" },
    { to: "/nutrition", label: "Nourrir ses plantes", desc: "Engrais, compost, carences expliqués simplement", ico: "compost", emoji: "🍽️" },
    { to: "/associations", label: "Bons voisins au potager", desc: "Quelles plantes cultiver côte à côte", ico: "associations", emoji: "🤝" },
    { to: "/bio", label: "Jardiner bio", desc: "Les labels, les pratiques et votre éco-score", ico: "plantes", emoji: "♻️" },
    { to: "/calculs", label: "Calculs pratiques", desc: "Combien planter, compost, terreau, eau de pluie", ico: "creer", emoji: "🧮" },
    { to: "/lexique", label: "Lexique", desc: "Les mots du jardin expliqués", ico: "lexique", emoji: "📖" },
  ] },
  { titre: "🔎 Reconnaître", entrees: [
    { to: "/identifier", label: "Identifier une plante (photo)", desc: "Trouver le nom d'une plante", ico: "identifier", emoji: "📷" },
    { to: "/recherche", label: "Rechercher", desc: "Posez votre question avec vos mots", ico: "recherche", emoji: "🔍" },
  ] },
  { titre: "🧺 Récolter et conserver", entrees: [
    { to: "/cueillette", label: "Bien cueillir", desc: "Le bon geste et le bon moment pour chaque récolte", ico: "recolte-action", emoji: "🧺" },
    { to: "/conserver", label: "Conserver ses récoltes", desc: "Cave, congélation, bocaux, confitures et garde-manger", ico: "recolte-action", emoji: "🥫" },
  ] },
  { titre: "🐔 Animaux", entrees: [
    { to: "/animaux", label: "Animaux", desc: "Poules, lapins, chèvres… : bien les choisir et les soigner", ico: "animaux", emoji: "🐔", si: "animaux" },
    { to: "/diagnostic-animal", label: "Diagnostic des animaux", desc: "Un animal ne va pas bien ?", ico: "sante", emoji: "⚕️", si: "animaux" },
    { to: "/rucher", label: "Mon rucher", desc: "Visites, varroa et traitements de vos ruches", ico: "animaux", emoji: "🐝", si: "abeilles" },
  ] },
  { titre: "⚙️ Réglages", entrees: [
    { to: "/reglages", label: "Réglages", desc: "Climat, commune, voix, rappels, sauvegarde", ico: "reglages", emoji: "⚙️" },
  ] },
];

export default function Plus() {
  const s = useStore((x) => ({ situation: x.settings.situation, animaux: x.settings.animauxActifs || x.troupeaux.length > 0, abeilles: x.troupeaux.some((t) => t.animalId === "abeille") || x.ruches.length > 0, debutant: !!x.settings.debutant }));
  const [tout, setTout] = useState(false);
  const visible = (e: Entree) => tout || !e.si || (e.si === "animaux" && s.animaux) || (e.si === "abeilles" && s.abeilles) || (e.si === "terre" && s.situation !== "appartement") || (e.si === "confirme" && !s.debutant && s.situation !== "appartement");
  const masquees = GROUPES.flatMap((g) => g.entrees).filter((e) => !visible(e)).length;
  return (
    <div>
      <h1>☰ Tout Racines</h1>
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
