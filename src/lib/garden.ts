import { PLANTES, PROBLEMES, plante } from "../data/index";
import type { Famille, Plante, Probleme } from "../data/types";
import type { Culture, Espace, Situation } from "./store";

// ---------- Diagnostic guidé ----------
export function diagnostiquer(opts: { planteId?: string; signes: string[]; mois: number; interieur?: boolean }): { p: Probleme; score: number; communs: string[] }[] {
  const pl = opts.planteId ? plante(opts.planteId) : undefined;
  const interieur = opts.interieur ?? pl?.categorie === "interieur";
  const res: { p: Probleme; score: number; communs: string[] }[] = [];
  for (const p of PROBLEMES) {
    const communs = p.signes.filter((s) => opts.signes.includes(s));
    if (!communs.length) continue;
    let score = communs.length * 10 + (communs.length / p.signes.length) * 4;
    if (pl) {
      const cible = p.plantes.includes(pl.id);
      if (cible) score += 8;
      else if (!p.plantes.includes("*")) continue; // ce problème ne touche pas cette plante
      else if (pl.problemes.includes(p.id)) score += 6;
    }
    // Plante d'intérieur : uniquement les problèmes d'intérieur ou ceux connus pour cette plante
    if (interieur && !p.interieur && !pl?.problemes.includes(p.id)) continue;
    // Plante du jardin : pas les troubles typiques de l'appartement, sauf s'ils la concernent
    if (!interieur && pl && ["air-sec", "chute-feuilles", "pas-floraison", "oedeme", "jaunissement-normal"].includes(p.id) && !pl.problemes.includes(p.id) && !p.plantes.includes(pl.id)) continue;
    if (!interieur && p.interieur && p.plantes.length === 1 && p.plantes[0] === "*" && ["pourriture-racines", "air-sec", "manque-lumiere", "sciarides", "coup-soleil"].includes(p.id)) score -= 4;
    if (p.mois.includes(opts.mois as never)) score += 2;
    if (pl?.problemes.includes(p.id)) score += 4;
    res.push({ p, score, communs });
  }
  return res.sort((a, b) => b.score - a.score).slice(0, 8);
}

// ---------- Rotation ----------
export const DELAI_FAMILLE: Partial<Record<Famille, number>> = {
  solanacees: 3, brassicacees: 4, amaryllidacees: 3, apiacees: 3, cucurbitacees: 2, fabacees: 2, amaranthacees: 2, asteracees: 1, poacees: 1,
};

export interface AvisRotation { niveau: "ok" | "attention" | "eviter"; texte: string }

export function verifierRotation(espaceId: string, planteId: string, annee: number, cultures: Culture[]): AvisRotation[] {
  const p = plante(planteId);
  if (!p) return [];
  if (p.categorie === "interieur" || p.categorie === "arbre") return [];
  const avis: AvisRotation[] = [];
  const precedentes = cultures.filter((c) => c.espaceId === espaceId && Number(c.date.slice(0, 4)) < annee);
  const delai = DELAI_FAMILLE[p.famille] ?? 0;
  for (const c of precedentes) {
    const q = plante(c.planteId);
    if (!q || q.famille !== p.famille || p.famille === "autres" || p.famille === "lamiacees" || p.famille === "rosacees") continue;
    const ecart = annee - Number(c.date.slice(0, 4));
    if (ecart < delai) avis.push({ niveau: ecart <= 1 ? "eviter" : "attention", texte: `${q.nom} (même famille) a poussé ici en ${c.date.slice(0, 4)}. Attendez ${delai} ans entre deux cultures de cette famille.` });
  }
  const anPasse = precedentes.filter((c) => Number(c.date.slice(0, 4)) === annee - 1).map((c) => plante(c.planteId)).filter(Boolean) as Plante[];
  if (p.besoin === "gourmand" && anPasse.some((q) => q.besoin === "gourmand")) avis.push({ niveau: "attention", texte: "Deux légumes gourmands de suite : apportez une bonne dose de compost avant de planter." });
  if (anPasse.some((q) => q.categorie === "engrais-vert" || q.besoin === "ameliorant") && p.besoin === "gourmand") avis.push({ niveau: "ok", texte: "Parfait : un légume gourmand après des légumineuses ou un engrais vert profite de l'azote laissé dans le sol." });
  if (!avis.length) avis.push({ niveau: "ok", texte: "Pas de conflit de rotation détecté sur cet emplacement." });
  return avis;
}

// Suggestions pour un emplacement : familles à éviter et légumes conseillés
export function suggestionsPour(espaceId: string, annee: number, cultures: Culture[]): Plante[] {
  return PLANTES.filter((p) => p.categorie === "legume" && verifierRotation(espaceId, p.id, annee, cultures).every((a) => a.niveau === "ok"));
}

// ---------- Associations ----------
export interface Relation { a: Plante; b: Plante; type: "ami" | "ennemi" }
export function relations(ids: string[]): Relation[] {
  const ps = ids.map(plante).filter(Boolean) as Plante[];
  const out: Relation[] = [];
  for (let i = 0; i < ps.length; i++)
    for (let j = i + 1; j < ps.length; j++) {
      const a = ps[i], b = ps[j];
      if (a.ennemis.includes(b.id) || b.ennemis.includes(a.id)) out.push({ a, b, type: "ennemi" });
      else if (a.amis.includes(b.id) || b.amis.includes(a.id)) out.push({ a, b, type: "ami" });
    }
  return out;
}

// ---------- Assistant de création ----------
export interface Profil {
  situation: Situation;
  expo: "soleil" | "mi-ombre" | "ombre";
  temps: "peu" | "moyen" | "beaucoup";
  surface: number; // m²
  objectifs: string[]; // "faciles", "aromatiques", "fruits", "autonomie", "enfants", "animaux"
}

// Plantes d'intérieur conseillées selon la lumière, le temps et la présence d'animaux de compagnie
export function plantesVertes(pr: Profil): Plante[] {
  const diffMax = pr.temps === "peu" ? 1 : pr.temps === "moyen" ? 2 : 3;
  const compagnie = pr.objectifs.includes("compagnie");
  return PLANTES.filter((p) => p.categorie === "interieur" && p.expo.includes(pr.expo) && p.difficulte <= diffMax && (!compagnie || p.sansDangerAnimaux))
    .sort((a, b) => a.difficulte - b.difficulte || a.nom.localeCompare(b.nom, "fr"))
    .slice(0, 12);
}

export function recommander(pr: Profil): { plantes: Plante[]; methode: string; conseils: string[]; verger: Plante[] } {
  const lieux = pr.situation === "appartement" ? ["interieur"] : pr.situation === "balcon" ? ["pot", "balcon"] : ["pleine-terre"];
  const diffMax = pr.temps === "peu" ? 1 : pr.temps === "moyen" ? 2 : 3;
  let liste = PLANTES.filter(
    (p) => p.categorie !== "interieur" && p.categorie !== "engrais-vert" && p.lieux.some((l) => lieux.includes(l)) && p.expo.includes(pr.expo) && p.difficulte <= diffMax,
  );
  if (pr.situation === "appartement") liste = PLANTES.filter((p) => p.lieux.includes("interieur") && p.categorie !== "interieur" && p.expo.includes(pr.expo === "ombre" ? "mi-ombre" : pr.expo));
  if (pr.situation !== "jardin") liste = liste.filter((p) => p.categorie !== "arbre" || p.lieux.includes("pot"));
  if (pr.surface < 15) liste = liste.filter((p) => !["courge", "melon", "mais", "artichaut", "asperge", "topinambour", "pomme-de-terre", "noyer", "rhubarbe"].includes(p.id) || pr.situation === "balcon");
  const score = (p: Plante) =>
    (pr.objectifs.includes("faciles") ? (3 - p.difficulte) * 2 : 0) +
    (pr.objectifs.includes("aromatiques") && p.categorie === "aromatique" ? 4 : 0) +
    (pr.objectifs.includes("fruits") && (p.categorie === "fruit" || p.categorie === "arbre") ? 4 : 0) +
    (pr.objectifs.includes("autonomie") && ["pomme-de-terre", "courge", "haricot", "poireau", "chou", "carotte", "oignon", "ail", "tomate", "feve", "pois"].includes(p.id) ? 5 : 0) +
    (pr.objectifs.includes("enfants") && ["radis", "fraisier", "tournesol", "tomate", "pois", "capucine", "courge"].includes(p.id) ? 4 : 0) +
    (pr.objectifs.includes("animaux") && ["mais", "tournesol", "courge", "topinambour", "betterave", "chou-kale", "feve", "trefle"].includes(p.id) ? 4 : 0) +
    (p.categorie === "legume" ? 3 : 0) +
    // les grands classiques d'un premier potager
    (["tomate", "courgette", "laitue", "radis", "haricot", "carotte", "pomme-de-terre", "basilic", "persil", "fraisier", "blette", "poireau"].includes(p.id) ? 4 : 0);
  liste = liste.filter((p) => !["ortie", "consoude"].includes(p.id));
  liste.sort((a, b) => score(b) - score(a) || a.difficulte - b.difficulte);
  const n = Math.max(6, Math.min(24, Math.round(pr.surface / (pr.situation === "balcon" ? 0.6 : 1.5))));
  // Composition équilibrée : 2 fleurs compagnes au plus, pas plus de 3 plantes d'une même famille
  const plantes: Plante[] = [];
  const parFamille = new Map<string, number>();
  let fleurs = 0;
  for (const p of liste) {
    if (plantes.length >= n) break;
    if (p.categorie === "fleur") {
      if (fleurs >= 2) continue;
      fleurs++;
    } else if (p.famille !== "autres" && p.famille !== "lamiacees") {
      const k = parFamille.get(p.famille) ?? 0;
      if (k >= 3) continue;
      parFamille.set(p.famille, k + 1);
    }
    plantes.push(p);
  }
  if (pr.situation !== "appartement" && !fleurs) {
    const f = PLANTES.find((p) => p.id === "capucine");
    if (f && f.expo.includes(pr.expo)) plantes.push(f);
  }
  const methode =
    pr.situation === "appartement" ? "Pots sur le rebord de la fenêtre la plus lumineuse, éventuellement complétés d'une lampe LED horticole en hiver, et un lombricomposteur pour l'engrais."
    : pr.situation === "balcon" ? "Pots et jardinières de grande taille (15 à 40 L), regroupés contre le mur, avec un substrat terreau + compost et un paillage de surface."
    : pr.surface <= 6 ? "Un ou deux carrés potagers de 1,2 × 1,2 m, faciles à entretenir et très productifs."
    : pr.temps === "peu" ? "Planches permanentes paillées en permanence (ou lasagnes sur la pelouse) : très peu de désherbage et d'arrosage."
    : "Planches permanentes de 1,2 m de large, séparées par des allées, avec une rotation sur 4 zones.";
  const conseils = [
    pr.expo === "ombre" ? "À l'ombre, misez sur les légumes-feuilles et les aromatiques d'ombre (persil, menthe, cerfeuil) : les légumes-fruits ne mûriront pas." : "Réservez les emplacements les plus ensoleillés aux tomates, poivrons, courges et aromatiques méditerranéennes.",
    pr.temps === "peu" ? "Paillez tout et installez un arrosage économe (oyas, goutte-à-goutte) : c'est le duo qui fait gagner le plus de temps." : "Prévoyez 10 minutes de visite quotidienne : on repère les problèmes quand ils sont encore petits.",
    "Commencez petit et agrandissez l'année suivante : un petit potager bien tenu produit plus qu'un grand envahi d'herbes.",
  ];
  if (pr.objectifs.includes("animaux")) conseils.push("Réservez une zone aux cultures pour les animaux (maïs, tournesol, courges, betteraves) et une autre clôturée pour le potager : les poules y feraient des dégâts.");
  // Verger et petits fruits pour les jardins assez grands ou l'autonomie
  let verger: Plante[] = [];
  if ((pr.situation === "jardin" || pr.situation === "petit-jardin") && (pr.surface >= 40 || pr.objectifs.includes("fruits") || pr.objectifs.includes("autonomie"))) {
    const petits = ["framboisier", "groseillier", "cassissier", "groseille-maquereau", "murier", "myrtillier", "kiwi", "sureau"];
    const arbres = ["pommier", "poirier", "prunier", "cerisier", "figuier", "cognassier", "pecher", "noyer", "amandier", "chataignier"];
    const ok = (id: string) => { const p = PLANTES.find((x) => x.id === id); return p && p.expo.includes(pr.expo) && p.difficulte <= diffMax ? p : undefined; };
    const nbArbres = pr.surface >= 300 ? 4 : pr.surface >= 100 ? 3 : pr.surface >= 40 ? 2 : 1;
    verger = [...arbres.map(ok).filter(Boolean).slice(0, nbArbres), ...petits.map(ok).filter(Boolean).slice(0, pr.surface >= 100 ? 4 : 2)] as Plante[];
    if (verger.length) conseils.push("Fruitiers : plantez en hiver (novembre à mars), deux variétés de pommiers ou de poiriers pour la pollinisation, à au moins 2 m des limites de propriété pour les arbres de plus de 2 m.");
  }
  return { plantes, methode, conseils, verger };
}

export const TYPES_ESPACE: Record<Espace["type"], { label: string; emoji: string }> = {
  planche: { label: "Planche / parcelle", emoji: "🟫" },
  carre: { label: "Carré potager", emoji: "🟩" },
  bac: { label: "Bac / jardinière", emoji: "🧺" },
  pot: { label: "Pot", emoji: "🌿" },
  serre: { label: "Serre", emoji: "🏡" },
  interieur: { label: "Intérieur", emoji: "🏠" },
  verger: { label: "Verger / haie", emoji: "🌳" },
};

// Normalisation pour la recherche (sans accents ni casse)
export const norm = (s: string) => s.toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").normalize("NFD").replace(/[̀-ͯ]/g, "");
