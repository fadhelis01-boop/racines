// Menu unique de Racines : utilisé par la page « Plus » (téléphone) et le menu latéral (ordinateur).
export interface Entree { to: string; label: string; desc: string; ico: string; emoji: string; si?: "animaux" | "abeilles" | "terre" | "confirme" }

// Le menu « Plus », rangé par usage. Chaque entrée dit en une phrase à quoi elle sert.
export const GROUPES: { titre: string; entrees: Entree[] }[] = [
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
    { to: "/cours", label: "Comprendre l'agronomie", desc: "Le sol, la plante, l'eau, la fertilité, la protection : un parcours en leçons", ico: "tutoriels", emoji: "🎓" },
    { to: "/agronome", label: "Outils de l'agronome", desc: "Texture, chaulage, bilan humique, azote, degrés-jours", ico: "sol", emoji: "🧮", si: "terre" },
    { to: "/references", label: "Sources et références", desc: "Les organismes et ouvrages pour aller plus loin", ico: "lexique", emoji: "📚" },
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


export interface Profil { situation: string; animaux: boolean; abeilles: boolean; debutant: boolean }
export const entreeVisible = (e: Entree, s: Profil, tout = false) => tout || !e.si || (e.si === "animaux" && s.animaux) || (e.si === "abeilles" && s.abeilles) || (e.si === "terre" && s.situation !== "appartement") || (e.si === "confirme" && !s.debutant && s.situation !== "appartement");

// Recherche dans le menu : tous les mots de la saisie (au pluriel ou à la terminaison près) dans le nom ou la description
const sansAccent = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe");
export function filtrerMenu(q: string): Entree[] {
  const mots = sansAccent(q).split(/[^a-z0-9]+/).filter((m) => m.length > 1);
  if (!mots.length) return [];
  return GROUPES.flatMap((g) => g.entrees).filter((e) => { const t = sansAccent(`${e.label} ${e.desc}`); return mots.every((m) => t.includes(m.length > 5 ? m.slice(0, m.length - 2) : m)); });
}

// Raccourcis : les rubriques les plus ouvertes depuis ce menu (compteur gardé sur l'appareil)
export function raccourcis(usage: Record<string, number>, n = 4): Entree[] {
  const toutes = GROUPES.flatMap((g) => g.entrees);
  return Object.entries(usage).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).map(([to]) => toutes.find((e) => e.to === to)).filter((e): e is Entree => !!e).slice(0, n);
}
