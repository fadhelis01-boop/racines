// Races courantes pour un élevage familial : usage, caractère, production indicative.
export interface Race { nom: string; pour: string; texte: string; prod?: string; enfants?: boolean; rustique?: boolean }

export const RACES: Record<string, Race[]> = {
  poule: [
    { nom: "Sussex", pour: "Ponte et chair", texte: "Calme, familière, très rustique ; plumage blanc herminé. Idéale pour débuter et avec des enfants.", prod: "180 à 220 œufs crème par an", enfants: true, rustique: true },
    { nom: "Marans", pour: "Ponte (œufs extra-roux)", texte: "Rustique et bonne fourrageuse ; célèbre pour ses œufs chocolat.", prod: "150 à 200 œufs par an", rustique: true },
    { nom: "Poule rousse (hybride ISA Brown, Lohmann)", pour: "Ponte intensive", texte: "Très docile, pond énormément les 2 premières années puis s'épuise ; vit moins longtemps. Souvent adoptée en réforme.", prod: "280 à 300 œufs par an", enfants: true },
    { nom: "Brahma", pour: "Ornement, compagnie", texte: "Géante, pattes emplumées, très douce ; supporte bien le froid mais craint la boue.", prod: "120 à 150 œufs par an", enfants: true, rustique: true },
    { nom: "Faverolles", pour: "Chair et ponte", texte: "Race française calme, à barbe, excellente chair ; supporte l'hiver.", prod: "150 à 180 œufs par an", enfants: true, rustique: true },
    { nom: "Pékin (naine)", pour: "Petit jardin, enfants", texte: "Minuscule, pattes emplumées, très familière, ne gratte presque pas : la poule des petits espaces.", prod: "80 à 100 petits œufs par an", enfants: true },
    { nom: "Araucana", pour: "Ponte (œufs bleus-verts)", texte: "Vive et rustique ; œufs à coquille bleu-vert.", prod: "150 à 180 œufs par an", rustique: true },
  ],
  canard: [
    { nom: "Coureur indien", pour: "Ponte et chasse aux limaces", texte: "Se tient droit comme une bouteille, ne vole pas, arpente le potager en mangeant les limaces.", prod: "150 à 200 œufs par an", rustique: true },
    { nom: "Khaki Campbell", pour: "Ponte", texte: "La meilleure pondeuse des canards, discrète et active.", prod: "250 à 300 œufs par an", rustique: true },
    { nom: "Pékin", pour: "Chair", texte: "Grand canard blanc à croissance rapide, calme.", prod: "100 à 150 œufs par an" },
    { nom: "Barbarie", pour: "Chair, peu bruyant", texte: "Presque muet (il siffle), excellente viande, couveuse remarquable ; vole un peu.", prod: "60 à 120 œufs par an", rustique: true },
  ],
  oie: [
    { nom: "Oie de Toulouse", pour: "Chair, foie", texte: "Lourde et placide, peu de vol, garde moins que les autres." },
    { nom: "Oie de Guinée (Chine)", pour: "Garde, désherbage", texte: "Très bruyante (excellente « alarme »), bonne pondeuse, légère.", prod: "40 à 60 œufs par an" },
    { nom: "Oie de Normandie", pour: "Rustique, mixte", texte: "Sobre et rustique, bonne au pâturage.", rustique: true },
  ],
  pintade: [
    { nom: "Pintade grise perlée", pour: "Chair, chasse aux insectes", texte: "Bruyante, vole bien, chasse les tiques et les insectes ; à habituer jeune au poulailler.", prod: "60 à 100 œufs par an" },
  ],
  caille: [
    { nom: "Caille japonaise", pour: "Ponte", texte: "Petite, précoce (ponte dès 7 semaines), parfaite en volière.", prod: "250 à 300 petits œufs par an" },
    { nom: "Caille de Chine (naine)", pour: "Ornement", texte: "Toute petite, en volière plantée, discrète." },
  ],
  dindon: [
    { nom: "Dindon noir (de Sologne)", pour: "Chair", texte: "Rustique, bon marcheur, chair goûteuse.", rustique: true },
    { nom: "Dindon bronzé", pour: "Chair", texte: "Grand dindon majestueux, croissance plus rapide.", },
    { nom: "Dindon rouge des Ardennes", pour: "Chair, rustique", texte: "Rustique et bonne couveuse.", rustique: true },
  ],
  pigeon: [
    { nom: "Mondain, Romain, King", pour: "Chair", texte: "Gros pigeons de chair, sédentaires." },
    { nom: "Pigeon paon, boulant", pour: "Ornement", texte: "Races d'exposition et de compagnie." },
  ],
  lapin: [
    { nom: "Néo-zélandais blanc", pour: "Chair", texte: "Croissance rapide, bonne mère, calme.", prod: "6 à 9 lapereaux par portée" },
    { nom: "Fauve de Bourgogne", pour: "Chair, rustique", texte: "Race française robuste, bonne au clapier extérieur.", rustique: true },
    { nom: "Géant des Flandres", pour: "Chair, compagnie", texte: "Énorme (7 kg et plus) et très doux ; demande beaucoup de place.", enfants: true },
    { nom: "Rex", pour: "Fourrure, compagnie", texte: "Poil ras velouté, caractère calme.", enfants: true },
  ],
  chevre: [
    { nom: "Alpine chamoisée", pour: "Lait", texte: "La laitière la plus répandue, robuste et active.", prod: "600 à 900 L par lactation" },
    { nom: "Saanen", pour: "Lait", texte: "Grande chèvre blanche très productive, calme ; craint le soleil fort.", prod: "700 à 1 000 L par lactation" },
    { nom: "Chèvre naine (Pygmée, Nigériane)", pour: "Compagnie, débroussaillage", texte: "Petite, sociable, idéale pour un grand jardin ; la Nigériane donne aussi un lait très riche.", prod: "Naine nigériane : 1 L par jour", enfants: true },
    { nom: "Chèvre des Fossés, Poitevine, Rove", pour: "Races locales rustiques", texte: "Races françaises à petits effectifs, rustiques et sobres : les élever aide à les sauver.", rustique: true },
  ],
  mouton: [
    { nom: "Ouessant", pour: "Tonte écologique, compagnie", texte: "Le plus petit mouton (45 cm), rustique, sobre, idéal pour entretenir 1 000 m².", enfants: true, rustique: true },
    { nom: "Solognot, Shetland", pour: "Laine, rustique", texte: "Races rustiques, peu exigeantes.", rustique: true },
    { nom: "Mouton d'Avranches, Charollais", pour: "Viande", texte: "Plus lourds, pour la boucherie familiale." },
    { nom: "Mouton du Cameroun", pour: "Sans tonte", texte: "Poil ras qui mue seul : pas de tonte ; rustique et vif.", rustique: true },
  ],
  ane: [
    { nom: "Âne de Provence, du Cotentin, Grand noir du Berry", pour: "Compagnie, attelage, entretien des prés", texte: "Races françaises calmes et robustes ; un âne vit 30 à 40 ans.", enfants: true, rustique: true },
    { nom: "Âne miniature", pour: "Compagnie, petits terrains", texte: "Moins de 90 cm, doux ; même sensibilité à l'herbe riche (fourbure).", enfants: true },
  ],
  cheval: [
    { nom: "Shetland, Haflinger, Fjord", pour: "Loisir, enfants, rusticité", texte: "Petits chevaux et poneys rustiques, vivant dehors toute l'année avec un abri.", enfants: true, rustique: true },
    { nom: "Mérens, Camargue", pour: "Loisir rustique", texte: "Chevaux sobres et robustes.", rustique: true },
  ],
  cochon: [
    { nom: "Porc de Bayeux, Pie noir du Pays basque, Gascon", pour: "Plein air, viande de qualité", texte: "Races locales rustiques adaptées au plein air ; croissance plus lente, viande persillée.", rustique: true },
    { nom: "Cochon kunekune", pour: "Pâturage, petits terrains", texte: "Petit cochon de Nouvelle-Zélande qui broute l'herbe plus qu'il ne fouille ; calme.", enfants: true },
  ],
  abeille: [
    { nom: "Abeille noire (locale)", pour: "Rusticité", texte: "Abeille d'origine en France, sobre, adaptée au climat local ; parfois plus défensive.", rustique: true },
    { nom: "Buckfast", pour: "Douceur, production", texte: "Sélectionnée pour sa douceur et sa production, idéale pour débuter." },
  ],
};
