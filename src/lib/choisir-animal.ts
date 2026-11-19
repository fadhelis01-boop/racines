// Comparateur « quel animal pour moi ? » et coûts de départ (ordres de grandeur, France, achat neuf ou
// d'occasion raisonnable : animaux, abri, clôture, matériel de base). Sans dépendance au routeur : testable.

export interface RepereAnimal { surface: number; minutes: number; depart: [number, number]; mois: [number, number]; groupe: string }

// surface : m² minimum pour le groupe conseillé ; minutes : temps par jour en moyenne sur l'année
export const REPERES: Record<string, RepereAnimal> = {
  poule: { surface: 30, minutes: 10, depart: [300, 900], mois: [10, 25], groupe: "3 poules" },
  caille: { surface: 3, minutes: 10, depart: [100, 300], mois: [5, 10], groupe: "6 cailles" },
  lapin: { surface: 6, minutes: 15, depart: [150, 500], mois: [15, 30], groupe: "2 lapins" },
  canard: { surface: 40, minutes: 15, depart: [300, 800], mois: [10, 25], groupe: "3 canes" },
  pintade: { surface: 50, minutes: 10, depart: [250, 700], mois: [10, 20], groupe: "4 pintades" },
  oie: { surface: 200, minutes: 10, depart: [300, 900], mois: [10, 20], groupe: "2 oies" },
  dindon: { surface: 50, minutes: 15, depart: [250, 700], mois: [15, 30], groupe: "2 dindes" },
  pigeon: { surface: 6, minutes: 15, depart: [300, 1000], mois: [10, 20], groupe: "6 pigeons" },
  abeille: { surface: 10, minutes: 10, depart: [400, 900], mois: [5, 15], groupe: "1 ou 2 ruches" },
  cochon: { surface: 300, minutes: 20, depart: [600, 1500], mois: [40, 80], groupe: "2 porcs, 6 à 10 mois" },
  chevre: { surface: 500, minutes: 30, depart: [1000, 3000], mois: [20, 40], groupe: "2 chèvres" },
  mouton: { surface: 2000, minutes: 20, depart: [800, 2500], mois: [15, 40], groupe: "2 brebis" },
  ane: { surface: 5000, minutes: 30, depart: [1500, 4000], mois: [40, 90], groupe: "2 ânes" },
  cheval: { surface: 10000, minutes: 45, depart: [3000, 8000], mois: [150, 300], groupe: "2 chevaux ou poneys" },
};

export interface CriteresAnimal { surface?: number; minutes?: number; budgetDepart?: number; debutant?: boolean }
export interface AnimalLite { id: string; profil: { niveau: number } }

export function animauxPossibles<T extends AnimalLite>(animaux: T[], c: CriteresAnimal): { a: T; ok: boolean; raisons: string[] }[] {
  return animaux.map((a) => {
    const r = REPERES[a.id];
    const raisons: string[] = [];
    if (r && c.surface != null && c.surface < r.surface) raisons.push(`il faut au moins ${r.surface.toLocaleString("fr-FR")} m²`);
    if (r && c.minutes != null && c.minutes < r.minutes) raisons.push(`environ ${r.minutes} min par jour`);
    if (r && c.budgetDepart != null && c.budgetDepart < r.depart[0]) raisons.push(`départ dès ${r.depart[0].toLocaleString("fr-FR")} €`);
    if (c.debutant && a.profil.niveau > 1) raisons.push("pas conseillé pour débuter");
    return { a, ok: !raisons.length, raisons };
  }).sort((x, y) => Number(y.ok) - Number(x.ok) || (REPERES[x.a.id]?.depart[0] ?? 0) - (REPERES[y.a.id]?.depart[0] ?? 0));
}

export const fourchette = ([a, b]: [number, number]) => `${a.toLocaleString("fr-FR")} à ${b.toLocaleString("fr-FR")} €`;

// Classement des tutoriels d'élevage par thème (page Animaux)
export const THEMES_ELEVAGE: [string, string[]][] = [
  ["🐣 Débuter", ["debuter-animaux", "veterinaire-urgences", "poulailler", "poulailler-palettes", "integrer-animaux", "registre-elevage", "vacances-animaux", "autres-animaux", "elevage-bio", "transport-animaux"]],
  ["⚕️ Santé et protection", ["hygiene-animaux", "nuisibles-predateurs", "rapaces-volailles", "paturage-tournant", "hiver-basse-cour", "deces-animal", "fumiers-securite"]],
  ["🍼 Reproduction et jeunes", ["couvaison", "poussins", "naissances", "calendrier-reproduction", "reproduction-selection", "gestes-jeunes"]],
  ["🥚 Produits", ["oeufs", "ponte-lumiere-mue", "traite-fromage", "tonte-laine", "volailles-chair", "porc-familial"]],
  ["🌱 Animaux et jardin", ["poules-potager", "cultiver-pour-animaux", "fumiers", "animaux-auxiliaires", "repulsifs-animaux"]],
  ["🐝 Abeilles", ["recolte-miel"]],
];
export function themeDuGuide(id: string, rubrique: string): string {
  if (id.startsWith("api-")) return "🐝 Abeilles";
  if (rubrique === "boucherie") return "🔪 Préparer la viande";
  return THEMES_ELEVAGE.find(([, ids]) => ids.includes(id))?.[0] ?? "📚 Autres";
}
