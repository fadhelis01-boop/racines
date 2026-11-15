// Les sols expliqués simplement : types, test guidé, plantes indicatrices, préférences des plantes.

export type Texture = "sableux" | "limoneux" | "argileux" | "equilibre";
export interface TypeSol {
  id: Texture | "calcaire" | "acide" | "humifere" | "caillouteux";
  nom: string; emoji: string; image: string; // comparaison parlante
  reconnaitre: string; plus: string[]; moins: string[]; ameliorer: string[]; aime: string[]; // ids de plantes
}

export const TYPES_SOL: TypeSol[] = [
  { id: "sableux", nom: "Sol sableux (léger)", emoji: "🏖️", image: "Comme du sable de plage : l'eau passe à travers comme dans une passoire.",
    reconnaitre: "Grains qui crissent entre les doigts ; impossible de faire un boudin ; sèche très vite après la pluie.",
    plus: ["Facile à travailler toute l'année", "Se réchauffe vite au printemps : récoltes précoces", "Parfait pour carottes, radis, asperges, pommes de terre"],
    moins: ["Retient mal l'eau : arrosages fréquents", "Retient mal les engrais : ils partent avec la pluie", "Souvent pauvre"],
    ameliorer: ["Apportez beaucoup de matière organique chaque année (compost, fumier bien décomposé) : elle agit comme une éponge.", "Paillez en permanence pour garder l'humidité.", "Semez des engrais verts l'hiver.", "Nourrissez peu mais souvent plutôt qu'en une fois."],
    aime: ["carotte", "radis", "asperge", "pomme-de-terre", "patate-douce", "lavande", "thym", "romarin", "melon", "pasteque", "fraisier"] },
  { id: "limoneux", nom: "Sol limoneux (fin et doux)", emoji: "🌾", image: "Doux comme de la farine ou du talc quand il est sec.",
    reconnaitre: "Toucher doux et soyeux ; le boudin se forme mais casse quand on le courbe ; forme une croûte en surface après la pluie.",
    plus: ["Souvent fertile", "Retient bien l'eau"],
    moins: ["Croûte de battance après les averses qui étouffe les semis", "Se tasse facilement"],
    ameliorer: ["Ne laissez jamais la terre nue : paillage ou engrais vert.", "Compost en surface chaque année.", "Ne travaillez pas la terre mouillée."],
    aime: ["laitue", "chou", "poireau", "betterave", "haricot", "pois", "pommier", "poirier"] },
  { id: "argileux", nom: "Sol argileux (lourd)", emoji: "🏺", image: "Comme de la pâte à modeler : collant mouillé, dur comme de la brique sec.",
    reconnaitre: "Colle aux bottes ; le boudin se forme et se courbe en anneau sans casser ; flaques qui restent ; fentes en été.",
    plus: ["Très riche : il retient l'eau et les engrais", "Les légumes gourmands s'y régalent une fois le sol aéré"],
    moins: ["Difficile à travailler, froid au printemps", "Asphyxie des racines quand il est gorgé d'eau", "Se fend en été"],
    ameliorer: ["Compost et fumier chaque automne : la matière organique aère l'argile.", "Ne marchez jamais sur les planches, travaillez-le seulement « ressuyé » (ni collant ni dur).", "Buttes ou planches surélevées pour le drainage.", "Paillage pour éviter les fentes ; grelinette plutôt que bêche.", "Le sable seul ne l'allège pas (il fait du béton) : il faut de la matière organique."],
    aime: ["chou", "courge", "courgette", "poireau", "artichaut", "rhubarbe", "pommier", "poirier", "rosier", "haricot"] },
  { id: "equilibre", nom: "Sol équilibré (terre franche)", emoji: "👨‍🌾", image: "Le rêve du jardinier : il s'émiette comme un gâteau au chocolat.",
    reconnaitre: "Le boudin se forme mais s'émiette ; se travaille facilement ; ni flaques ni sécheresse rapide.",
    plus: ["Convient à presque tout", "Garde l'eau sans s'asphyxier"],
    moins: ["S'appauvrit si on ne le nourrit pas"],
    ameliorer: ["Entretenez-le : 2 à 3 kg de compost par m² et par an, paillage, rotation des cultures."],
    aime: ["tomate", "courgette", "haricot", "laitue", "carotte", "fraisier", "pommier"] },
  { id: "calcaire", nom: "Sol calcaire", emoji: "🐚", image: "Il contient de la craie ou du calcaire : il « mousse » au vinaigre.",
    reconnaitre: "Souvent clair, caillouteux ; mousse quand on verse du vinaigre dessus ; coquelicots, chicorée sauvage, sauge des prés poussent seuls.",
    plus: ["Se réchauffe vite", "Idéal pour la vigne, la lavande, les choux, les plantes méditerranéennes"],
    moins: ["Bloque le fer : feuilles jaunes à nervures vertes (chlorose) chez certaines plantes", "S'assèche vite"],
    ameliorer: ["Beaucoup de compost et de fumier (la matière organique corrige en partie).", "Choisissez des plantes qui aiment le calcaire.", "Plantes de terre acide (myrtille, hortensia bleu, azalée, camélia) : uniquement en bac rempli de terre de bruyère.", "Jamais de chaux ni de cendres en grande quantité."],
    aime: ["lavande", "thym", "romarin", "sauge", "vigne", "chou", "chou-fleur", "olivier", "amandier", "lilas", "figuier"] },
  { id: "acide", nom: "Sol acide", emoji: "🍂", image: "Comme une terre de forêt de pins ou de landes.",
    reconnaitre: "Mousse sur la pelouse, fougères, bruyère, digitales, oseille sauvage ; le test au chou rouge vire au rose.",
    plus: ["Parfait pour myrtilles, framboises, hortensias bleus, rhododendrons, pommes de terre"],
    moins: ["Certains légumes poussent mal (choux, poireaux, épinards, betteraves, haricots)", "Vie du sol ralentie s'il est très acide"],
    ameliorer: ["Compost mûr chaque année.", "Si besoin, un amendement calcaire doux à l'automne (lithothamne, dolomie, maërl de substitution), à petite dose : 100 à 200 g/m², une fois, puis on refait le test.", "Cendres de bois en petite quantité (une poignée par m² et par an au plus)."],
    aime: ["myrtillier", "framboisier", "pomme-de-terre", "hortensia", "azalee", "fraisier", "chataignier"] },
  { id: "humifere", nom: "Sol humifère (riche en humus)", emoji: "🍫", image: "Noir, léger, qui sent bon le sous-bois.",
    reconnaitre: "Couleur sombre, odeur de forêt, plein de vers de terre, souple sous le pied.",
    plus: ["Très fertile, retient l'eau et la rend aux plantes", "Plein de vie"],
    moins: ["S'épuise si on le laboure souvent ou si on le laisse nu"],
    ameliorer: ["Gardez-le : pas de bêchage profond, couverture permanente, compost en surface."],
    aime: ["tomate", "courge", "courgette", "poireau", "celeri", "chou", "laitue", "epinard"] },
  { id: "caillouteux", nom: "Sol caillouteux ou pauvre", emoji: "⛏️", image: "Plus de pierres que de terre : la bêche ne rentre pas.",
    reconnaitre: "Bêche qui bute ; terre mince sur la roche ou les remblais.",
    plus: ["Bien drainé, se réchauffe vite", "Idéal pour un jardin sec et les aromatiques"],
    moins: ["Peu de terre pour les racines, sèche très vite"],
    ameliorer: ["Ne retirez pas toutes les pierres (elles gardent la chaleur et l'humidité dessous).", "Cultivez en lasagne, en butte ou en carré surélevé par-dessus.", "Aromatiques et plantes de jardin sec directement en place."],
    aime: ["thym", "romarin", "lavande", "sauge", "origan", "figuier", "olivier", "vigne"] },
];

// Test guidé : chaque réponse ajoute des points aux caractéristiques
export interface QuestionSol { id: string; titre: string; comment: string; reponses: { label: string; effet: Partial<Record<string, number>> }[] }
export const QUESTIONS_SOL: QuestionSol[] = [
  { id: "boudin", titre: "Le test du boudin", comment: "Prenez une poignée de terre à 10 cm de profondeur, mouillez-la un peu et malaxez-la. Essayez de faire un boudin de la taille d'un crayon, puis de le courber en anneau.",
    reponses: [
      { label: "Impossible : la terre s'effrite, on sent des grains qui crissent", effet: { sableux: 3 } },
      { label: "Un boudin se forme mais il casse quand je le courbe ; toucher doux", effet: { limoneux: 3 } },
      { label: "Il se forme et casse un peu en anneau, la terre s'émiette", effet: { equilibre: 3 } },
      { label: "Il se courbe en anneau lisse sans casser, ça colle aux doigts", effet: { argileux: 3 } },
    ] },
  { id: "eau", titre: "Après une bonne pluie", comment: "Observez le jardin le lendemain d'une grosse pluie.",
    reponses: [
      { label: "Le sol est déjà sec en surface", effet: { sableux: 2, caillouteux: 1 } },
      { label: "Une croûte dure s'est formée en surface", effet: { limoneux: 2 } },
      { label: "Il est humide mais sans flaque", effet: { equilibre: 2 } },
      { label: "Des flaques restent plusieurs heures ou jours, ça colle", effet: { argileux: 2, humide: 2 } },
    ] },
  { id: "vinaigre", titre: "Le test du vinaigre", comment: "Posez une cuillère de terre sèche dans une soucoupe et versez dessus un peu de vinaigre blanc.",
    reponses: [
      { label: "Ça mousse et grésille fort", effet: { calcaire: 3 } },
      { label: "Quelques petites bulles", effet: { calcaire: 1 } },
      { label: "Rien du tout", effet: { noncalcaire: 1 } },
      { label: "Je n'ai pas fait le test", effet: {} },
    ] },
  { id: "couleur", titre: "Couleur et odeur", comment: "Regardez et sentez une poignée de terre humide.",
    reponses: [
      { label: "Noire ou brun foncé, odeur de sous-bois", effet: { humifere: 3 } },
      { label: "Brune ordinaire", effet: {} },
      { label: "Claire, blanchâtre ou beige, souvent avec des cailloux blancs", effet: { calcaire: 1, pauvre: 1 } },
      { label: "Grise ou bleutée, odeur d'œuf pourri ou de vase", effet: { humide: 3 } },
    ] },
  { id: "vers", titre: "Les vers de terre", comment: "Retournez une motte de la taille d'une bêche (20 × 20 × 20 cm) et comptez les vers de terre.",
    reponses: [
      { label: "Plus de 10", effet: { vivant: 2 } },
      { label: "Entre 3 et 10", effet: { vivant: 1 } },
      { label: "Moins de 3", effet: { pauvre: 2 } },
    ] },
  { id: "beche", titre: "La bêche ou la fourche", comment: "Enfoncez une bêche ou une fourche.",
    reponses: [
      { label: "Elle rentre facilement", effet: {} },
      { label: "Elle bute sur des cailloux", effet: { caillouteux: 3 } },
      { label: "Elle rentre difficilement, la terre est dure et compacte", effet: { tasse: 3 } },
    ] },
  { id: "plantes", titre: "Ce qui pousse tout seul", comment: "Quelles plantes sauvages poussent en abondance chez vous ? (le choix le plus visible)",
    reponses: [
      { label: "Mousse, fougères, bruyère, digitales, oseille sauvage", effet: { acide: 3 } },
      { label: "Coquelicots, chicorée sauvage, sauge des prés, trèfle", effet: { calcaire: 2 } },
      { label: "Orties, rumex, mouron, chénopode : de vraies mauvaises herbes « grasses »", effet: { riche: 3 } },
      { label: "Prêle, renoncule rampante, joncs", effet: { humide: 2, acide: 1 } },
      { label: "Pâquerettes, plantain, pissenlits très nombreux dans l'herbe rase", effet: { tasse: 2 } },
      { label: "Je ne sais pas / rien de particulier", effet: {} },
    ] },
];

// Interprétation simple des points
export function interpreterSol(points: Record<string, number>) {
  const textures: Texture[] = ["sableux", "limoneux", "argileux", "equilibre"];
  const texture = textures.reduce((a, b) => ((points[b] ?? 0) > (points[a] ?? 0) ? b : a), "equilibre" as Texture);
  const traits: string[] = [];
  if ((points.calcaire ?? 0) >= 3) traits.push("calcaire");
  if ((points.acide ?? 0) >= 3 && (points.calcaire ?? 0) < 2) traits.push("acide");
  if ((points.humifere ?? 0) >= 3) traits.push("humifere");
  if ((points.caillouteux ?? 0) >= 3) traits.push("caillouteux");
  const alertes: string[] = [];
  if ((points.humide ?? 0) >= 3) alertes.push("Sol mal drainé : l'eau stagne et les racines manquent d'air. Cultivez en buttes ou planches surélevées, apportez du compost, évitez de piétiner ; plantez des arbres qui aiment l'eau (saule, aulne) dans le coin le plus humide.");
  if ((points.tasse ?? 0) >= 3) alertes.push("Sol tassé : aérez à la grelinette sans retourner, ne marchez plus sur les zones cultivées, semez des engrais verts à racines profondes (radis fourrager, phacélie) et paillez.");
  if ((points.pauvre ?? 0) >= 2) alertes.push("Peu de vie dans le sol : apportez compost et fumier bien décomposé, couvrez le sol en permanence, arrêtez tout produit chimique. Les vers reviennent en une à deux saisons.");
  if ((points.riche ?? 0) >= 3) alertes.push("Bonne nouvelle : orties et rumex signalent un sol riche en azote. Parfait pour les légumes gourmands ; inutile d'ajouter beaucoup d'engrais.");
  if ((points.vivant ?? 0) >= 2) alertes.push("Beaucoup de vers de terre : votre sol est vivant, gardez-le ainsi (paillage, pas de bêchage profond).");
  return { texture, traits, alertes };
}

// Test du pH au chou rouge (indicateur coloré naturel)
export const PH_CHOU = [
  { couleur: "#d0407a", label: "Rose ou rouge", ph: "Acide (pH < 6)" },
  { couleur: "#8a4fb0", label: "Violet", ph: "Neutre (pH 6,5 à 7,5) : convient à presque tout" },
  { couleur: "#3f7fbf", label: "Bleu", ph: "Légèrement calcaire (pH 7,5 à 8)" },
  { couleur: "#2f9a6a", label: "Vert ou jaune-vert", ph: "Calcaire (pH > 8)" },
];

// Préférences de sol des plantes les plus concernées
export const SOL_PLANTE: Record<string, string> = {
  myrtillier: "Terre acide (terre de bruyère, pH 4,5 à 5,5) obligatoire ; en sol calcaire, uniquement en grand bac.",
  hortensia: "Plutôt acide : fleurs bleues en sol acide, roses en sol calcaire ; craint le calcaire fort (chlorose).",
  azalee: "Terre de bruyère, eau de pluie : n'aime pas du tout le calcaire.",
  gardenia: "Terre de bruyère, eau non calcaire.",
  framboisier: "Frais, riche, plutôt acide à neutre ; craint le calcaire actif.",
  fraisier: "Riche en humus, légèrement acide ; craint l'excès de calcaire.",
  "pomme-de-terre": "Léger, plutôt acide à neutre : la gale (taches liégeuses) est plus fréquente en sol calcaire.",
  carotte: "Léger, profond, sans cailloux ni fumier frais (racines fourchues).",
  radis: "Léger et frais.",
  asperge: "Sableux, profond, bien drainé.",
  chou: "Riche, frais et plutôt calcaire ; les choux souffrent en sol acide (hernie du chou).",
  "chou-fleur": "Riche, profond, calcaire.",
  poireau: "Profond, riche et frais.",
  tomate: "Riche en humus, profond, bien drainé ; pH 6 à 7.",
  courge: "Très riche (compost, fumier) ; elle pousse même sur le tas de compost.",
  courgette: "Très riche et frais.",
  lavande: "Pauvre, sec, caillouteux, calcaire : l'excès d'eau et d'engrais la tue.",
  thym: "Pauvre, sec, drainant, calcaire.",
  romarin: "Pauvre, drainant ; craint l'humidité stagnante l'hiver.",
  vigne: "Pauvre à moyen, drainant, calcaire accepté.",
  olivier: "Drainant, pauvre, calcaire accepté.",
  figuier: "Tous sols drainants, même calcaires ou caillouteux.",
  pommier: "Profond, frais, ni trop calcaire ni trop humide.",
  poirier: "Profond et frais ; le cognassier porte-greffe craint le calcaire.",
  cerisier: "Drainant, léger ; craint l'eau stagnante.",
  pecher: "Léger, chaud, drainant ; craint le calcaire (chlorose) sauf porte-greffe adapté.",
  rhubarbe: "Riche, frais, profond, beaucoup de fumier.",
  artichaut: "Riche, profond, drainant l'hiver.",
  melon: "Léger, chaud, riche en compost.",
  haricot: "Léger, chaud, sans excès d'azote ; craint le froid et l'humidité au semis.",
  pois: "Frais, pas trop riche en azote.",
  ail: "Léger, drainant, sans fumier frais.",
  oignon: "Léger, drainant, sans fumier frais.",
  epinard: "Riche et frais, neutre à calcaire.",
  betterave: "Profond, riche, neutre ; craint l'acidité.",
  celeri: "Très riche et frais.",
  rosier: "Riche, profond, argileux accepté.",
  chataignier: "Acide, sans calcaire.",
  lilas: "Calcaire accepté, drainant.",
};
