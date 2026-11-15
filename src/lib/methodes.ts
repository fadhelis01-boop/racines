// Choisir la méthode de potager adaptée à sa situation : un score par méthode, avec les raisons.

export interface ProfilPotager {
  lieu: "jardin" | "petit-jardin" | "balcon" | "appartement" | "cour";
  surface: number; // m²
  depart: "pelouse" | "cultive" | "friche" | "dur" | "caillouteux"; // cour : surface dure, sol pollué
  sol: "sableux" | "limoneux" | "argileux" | "equilibre" | "humide" | "inconnu";
  temps: "peu" | "moyen" | "beaucoup";
  budget: "petit" | "moyen" | "confortable";
  corps: "ok" | "dos" | "fauteuil";
  eau: "facile" | "rare";
  materiaux: ("bois" | "feuilles" | "carton" | "fumier")[];
  duree: "long" | "provisoire";
  objectif: "debuter" | "produire" | "joli" | "effort";
}

export interface Choix { id: string; score: number; pour: string[]; contre: string[] }

const SURFACE_DURE = (p: ProfilPotager) => p.lieu === "cour" || p.depart === "dur";

export function choisirMethodes(p: ProfilPotager): Choix[] {
  const res: Choix[] = [];
  const add = (id: string, f: (c: Choix) => void, possible = true) => {
    if (!possible) return;
    const c: Choix = { id, score: 50, pour: [], contre: [] };
    f(c);
    res.push(c);
  };
  const plus = (c: Choix, n: number, r: string) => { c.score += n; c.pour.push(r); };
  const moins = (c: Choix, n: number, r: string) => { c.score -= n; c.contre.push(r); };
  const pleineTerre = (p.lieu === "jardin" || p.lieu === "petit-jardin") && !SURFACE_DURE(p);
  const exterieur = p.lieu !== "appartement";

  add("am-carres", (c) => {
    if (p.objectif === "debuter") plus(c, 20, "Le plus simple pour débuter : tout est délimité et lisible.");
    if (p.objectif === "joli") plus(c, 10, "Ordonné et décoratif.");
    if (p.depart === "pelouse") plus(c, 10, "Se pose directement sur la pelouse avec un carton au fond.");
    if (p.sol === "argileux" || p.sol === "humide") plus(c, 10, "On cultive au-dessus d'un sol lourd ou humide.");
    if (p.depart === "caillouteux" || SURFACE_DURE(p)) plus(c, 10, "Possible sur un sol caillouteux ou une cour (avec un fond).");
    if (p.surface <= 25) plus(c, 10, "Parfait pour une petite surface.");
    if (p.surface > 80) moins(c, 15, "Coûteux en bois et en terre pour une grande surface.");
    if (p.budget === "petit") moins(c, 10, "Bois et terre à acheter.");
    if (p.materiaux.includes("bois")) plus(c, 5, "Vous avez du bois sous la main.");
    if (p.corps === "dos") plus(c, 5, "Un peu surélevé : moins de flexion.");
    if (p.eau === "rare") moins(c, 5, "Sèche plus vite que la pleine terre (paillez).");
  }, p.lieu !== "appartement");

  add("am-bacs-hauts", (c) => {
    if (p.corps !== "ok") plus(c, 40, "Jardiner debout ou assis, sans se pencher.");
    if (SURFACE_DURE(p)) plus(c, 15, "Fonctionne sur une cour bétonnée ou un sol pollué.");
    if (p.budget === "petit") moins(c, 20, "C'est la solution la plus chère à construire et à remplir.");
    if (p.materiaux.includes("bois")) plus(c, 10, "Vos branches remplissent le fond et économisent de la terre.");
    if (p.eau === "rare") moins(c, 10, "Sèche très vite.");
    if (p.lieu === "balcon") moins(c, 10, "Lourd : vérifiez la charge du balcon.");
    if (p.surface > 40) moins(c, 10, "Peu adapté à une grande production.");
  }, exterieur);

  add("am-planches", (c) => {
    if (p.objectif === "produire") plus(c, 25, "La méthode des maraîchers pour produire beaucoup.");
    if (p.surface >= 30) plus(c, 15, "Idéal sur une grande surface.");
    if (p.surface < 15) moins(c, 10, "Un peu sous-exploité sur une très petite surface.");
    if (p.budget === "petit") plus(c, 10, "Ne coûte presque rien.");
    if (p.depart === "cultive") plus(c, 10, "Votre terre déjà cultivée s'y prête directement.");
    if (p.sol === "humide") moins(c, 10, "En sol gorgé d'eau, préférez les buttes.");
    if (p.corps !== "ok") moins(c, 20, "On travaille au ras du sol.");
    if (p.temps === "peu") moins(c, 5, "Désherbage la première année.");
  }, pleineTerre);

  add("am-lasagnes", (c) => {
    if (p.depart === "pelouse") plus(c, 30, "Transforme une pelouse en potager sans bêcher.");
    if (p.depart === "friche") plus(c, 10, "Étouffe les herbes sous le carton.");
    if (p.sol === "argileux" || p.sol === "sableux" || p.depart === "caillouteux") plus(c, 10, "Crée une bonne terre au-dessus d'un sol difficile.");
    if (p.materiaux.includes("carton") && p.materiaux.includes("feuilles")) plus(c, 15, "Vous avez carton et feuilles : la matière première est gratuite.");
    else if (!p.materiaux.includes("feuilles") && !p.materiaux.includes("fumier")) moins(c, 15, "Il faut beaucoup de matière (feuilles, tontes, fumier).");
    if (p.temps === "peu") plus(c, 5, "Peu de désherbage ensuite.");
    if (p.corps === "fauteuil") moins(c, 15, "Au niveau du sol.");
  }, pleineTerre || p.depart === "caillouteux");

  add("am-butte", (c) => {
    if (p.sol === "humide" || p.sol === "argileux") plus(c, 25, "Draine un sol lourd ou humide.");
    if (p.materiaux.includes("bois")) plus(c, 20, "Vos branches et vieux bois en forment le cœur.");
    else moins(c, 15, "Il faut beaucoup de branches et de bois.");
    if (p.eau === "rare" && p.sol !== "sableux") plus(c, 10, "Le bois enfoui retient l'eau : moins d'arrosage après 2 ans.");
    if (p.temps === "peu") moins(c, 10, "Gros travail d'installation.");
    if (p.duree === "provisoire") moins(c, 20, "Investissement sur plusieurs années.");
    if (p.corps === "dos") plus(c, 5, "Surélevée : moins de flexion.");
  }, pleineTerre);

  add("am-sol-vivant", (c) => {
    if (p.objectif === "effort" || p.temps === "peu") plus(c, 20, "Le moins de travail une fois installé.");
    if (p.eau === "rare") plus(c, 20, "Le paillage permanent garde l'eau dans le sol.");
    if (p.sol === "sableux") plus(c, 10, "Le paillis et le compost transforment un sol sableux.");
    if (p.depart === "cultive") plus(c, 10, "On repart d'une terre déjà cultivée sans la retourner.");
    if (p.materiaux.includes("feuilles") || p.materiaux.includes("fumier")) plus(c, 10, "Vous avez de quoi pailler.");
    if (p.corps === "fauteuil") moins(c, 15, "Au niveau du sol.");
  }, pleineTerre);

  add("am-rangs", (c) => {
    if (p.surface >= 100) plus(c, 15, "Pratique pour de grandes cultures (pommes de terre, maïs, courges).");
    if (p.budget === "petit") plus(c, 5, "Aucun achat.");
    if (p.temps !== "beaucoup") moins(c, 20, "Beaucoup de binage et de désherbage.");
    if (p.eau === "rare") moins(c, 10, "Terre nue qui sèche vite (à pailler).");
    if (p.corps !== "ok") moins(c, 25, "Travail au sol pénible pour le dos.");
  }, pleineTerre && p.surface >= 30);

  add("am-trois-soeurs", (c) => {
    if (p.objectif === "joli" || p.objectif === "debuter") plus(c, 10, "Ludique et spectaculaire.");
    if (p.surface >= 20) plus(c, 10, "Assez de place pour des monticules.");
    if (p.temps === "peu") plus(c, 10, "Une fois semé, la courge couvre le sol.");
    if (p.eau === "rare") plus(c, 5, "Les feuilles de courge gardent l'humidité.");
    if (p.surface < 15) moins(c, 20, "Demande de la place.");
    c.score -= 10; c.contre.push("Méthode d'été seulement : à combiner avec une autre pour le reste de l'année.");
  }, pleineTerre && p.surface >= 10);

  add("am-bottes-paille", (c) => {
    if (SURFACE_DURE(p)) plus(c, 25, "Pas besoin de sol : sur béton ou sol pollué.");
    if (p.duree === "provisoire") plus(c, 20, "Rien de définitif : idéal en location.");
    if (p.budget === "petit") plus(c, 10, "Une botte coûte quelques euros.");
    if (p.objectif === "debuter") plus(c, 5, "Bon test d'un premier potager.");
    if (p.eau === "rare") moins(c, 15, "Arrosage quotidien en été.");
    if (p.corps === "dos") plus(c, 5, "Hauteur de travail confortable.");
  }, exterieur);

  add("am-pots", (c) => {
    if (p.lieu === "balcon" || p.lieu === "appartement") plus(c, 35, "La solution naturelle d'un balcon ou d'un rebord de fenêtre.");
    if (p.duree === "provisoire") plus(c, 15, "Tout se déménage.");
    if (SURFACE_DURE(p)) plus(c, 15, "Possible partout.");
    if (p.eau === "rare") moins(c, 15, "Les pots sèchent vite (réserve d'eau conseillée).");
    if (p.objectif === "produire" && p.surface > 20) moins(c, 15, "Rendement limité.");
  });

  add("am-sacs", (c) => {
    if (p.lieu === "balcon" || SURFACE_DURE(p)) plus(c, 20, "Léger et posé n'importe où.");
    if (p.budget === "petit") plus(c, 10, "Moins cher que des bacs.");
    if (p.duree === "provisoire") plus(c, 15, "Se plie et se déménage.");
    if (p.eau === "rare") moins(c, 15, "Sèche très vite.");
  }, p.lieu !== "appartement");

  add("am-vertical", (c) => {
    if (p.lieu === "balcon" || p.lieu === "appartement" || p.lieu === "cour") plus(c, 20, "Multiplie la surface d'un petit espace.");
    if (p.surface < 6) plus(c, 15, "Utilise la hauteur quand le sol manque.");
    if (p.eau === "rare") moins(c, 15, "Petits volumes qui sèchent vite.");
    c.score -= 10; c.contre.push("À combiner avec des pots ou des bacs.");
  });

  add("am-hydroponie", (c) => {
    if (p.lieu === "appartement") plus(c, 20, "Salades et aromates toute l'année, même sans balcon.");
    if (p.budget === "petit") moins(c, 25, "Matériel et électricité.");
    if (p.objectif === "debuter") moins(c, 10, "Plus technique qu'un pot de terreau.");
    if (p.objectif === "effort") moins(c, 10, "pH et solution à surveiller.");
  }, p.lieu === "appartement" || p.lieu === "balcon");

  add("am-serrure", (c) => {
    if (p.eau === "rare") plus(c, 20, "Très économe en eau grâce au compost central.");
    if (p.corps === "dos") plus(c, 15, "Muret à hauteur de main.");
    if (p.materiaux.includes("feuilles")) plus(c, 5, "Vos déchets nourrissent le panier central.");
    if (p.budget === "petit" && !p.materiaux.includes("bois")) moins(c, 5, "Pierres ou briques à trouver.");
    if (p.objectif === "produire") moins(c, 10, "Surface cultivée limitée.");
  }, pleineTerre || p.depart === "caillouteux");

  return res.sort((a, b) => b.score - a.score);
}
