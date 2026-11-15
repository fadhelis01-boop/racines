// Parcours « Je débute » : pour ceux qui pensent ne pas avoir la main verte.

export const TROIS_ERREURS = [
  { titre: "Trop d'eau", e: "💧", texte: "C'est la cause n° 1 : les racines pourrissent. On n'arrose pas « tous les dimanches » mais quand la terre est sèche sous le doigt, à 2 ou 3 cm de profondeur. Un pot doit toujours être percé, et on vide la soucoupe." },
  { titre: "Pas assez de lumière", e: "☀️", texte: "À 2 mètres d'une fenêtre, une plante reçoit 4 à 10 fois moins de lumière. Placez-la près d'une fenêtre ; ce qui pousse « au fond du salon » est rare." },
  { titre: "La mauvaise plante au mauvais endroit", e: "🧭", texte: "Une plante de soleil dans un coin sombre, ou une plante qui aime l'humidité au-dessus d'un radiateur, ne survit pas, même bien soignée. Choisissez d'après votre lumière, pas d'après la photo du magasin." },
];

export const PREMIER_MOIS: { semaine: string; taches: { id: string; t: string; lien?: [string, string] }[] }[] = [
  { semaine: "Semaine 1 : observer et choisir", taches: [
    { id: "lumiere", t: "Repérer la lumière de vos fenêtres (test de l'ombre de la main)", lien: ["/guide/lumiere-led", "Le test"] },
    { id: "choisir", t: "Choisir 1 à 3 plantes increvables adaptées à cette lumière (pas plus pour commencer)", lien: ["/debuter?t=increvables", "Les increvables"] },
    { id: "courses", t: "Faire la liste de courses (pots percés, terreau, soucoupes)", lien: ["/debuter?t=courses", "La liste"] },
  ] },
  { semaine: "Semaine 2 : installer", taches: [
    { id: "acheter", t: "Acheter des plantes saines (feuilles fermes, pas de bêtes sous les feuilles, terre ni détrempée ni desséchée)", lien: ["/guide/choisir-plante", "Bien choisir"] },
    { id: "ajouter", t: "Les ajouter dans « Mes plantes » : l'appli vous dira quand vérifier l'arrosage", lien: ["/jardin", "Mes plantes"] },
    { id: "rappels", t: "Activer les rappels sur le téléphone (ou dans l'agenda)", lien: ["/jardin?rappels=1", "Activer"] },
    { id: "pas-rempoter", t: "Ne pas rempoter tout de suite : laisser la plante s'habituer 2 à 3 semaines" },
  ] },
  { semaine: "Semaine 3 : prendre le coup de main", taches: [
    { id: "doigt", t: "Tester la terre au doigt avant chaque arrosage, même si le rappel sonne" },
    { id: "aromate", t: "Ajouter un aromate facile : ciboulette ou menthe (ou diviser le pot de basilic du supermarché)", lien: ["/debuter?t=aromates", "Aromates faciles"] },
    { id: "photo", t: "Prendre une photo de chaque plante (pour comparer dans un mois)" },
  ] },
  { semaine: "Semaine 4 : faire le point", taches: [
    { id: "nouvelle-feuille", t: "Repérer une nouvelle feuille : c'est le signe que la plante va bien" },
    { id: "souci", t: "Une feuille jaune ou une tache ? Faire le diagnostic avant de paniquer (une vieille feuille qui jaunit est souvent normale)", lien: ["/diagnostic?interieur=1", "Diagnostic"] },
    { id: "suite", t: "Si tout va bien : ajouter une plante, ou se lancer dans un petit potager", lien: ["/debuter?t=potager", "Premier potager"] },
  ] },
];

export const INCREVABLES: { id: string; pourquoi: string }[] = [
  { id: "zamioculcas", pourquoi: "Supporte l'ombre et un mois sans eau : la plus pardonnante." },
  { id: "sansevieria", pourquoi: "Arrosage toutes les 3 à 4 semaines, toutes lumières." },
  { id: "pothos", pourquoi: "Ses feuilles pendent quand il a soif : il vous prévient, et repart après l'arrosage." },
  { id: "aspidistra", pourquoi: "Coin sombre, froid, oublis : elle tient des décennies. Sans danger pour les animaux." },
  { id: "chlorophytum", pourquoi: "Pousse partout, fait des bébés à donner. Sans danger pour les animaux." },
  { id: "beaucarnea", pourquoi: "Son tronc stocke l'eau : parfait au soleil pour qui oublie d'arroser. Sans danger pour les animaux." },
  { id: "chamaedorea", pourquoi: "Le palmier facile, lumière moyenne. Sans danger pour les animaux." },
  { id: "aloe", pourquoi: "Plante grasse de fenêtre ensoleillée, arrosage rare." },
];

export const AROMATES_FACILES: { id: string; conseil: string }[] = [
  { id: "ciboulette", conseil: "La plus facile : une touffe divisée, on coupe aux ciseaux, elle repousse. Toute fenêtre lumineuse." },
  { id: "menthe", conseil: "Une tige achetée en botte fait des racines dans un verre d'eau en une semaine. Terre toujours fraîche." },
  { id: "persil", conseil: "Achetez un pot et divisez-le ; coupez les tiges extérieures." },
  { id: "laurier", conseil: "Un petit arbuste qui vit des années ; une feuille dans chaque plat." },
  { id: "thym", conseil: "Facile DEHORS au soleil (balcon sud) ; délicat à l'intérieur sans lampe. Arrosage rare." },
  { id: "basilic", conseil: "Facile dehors l'été ; délicat à l'intérieur l'hiver. Le pot du supermarché meurt parce qu'il contient 30 plants serrés : divisez-le en 4 à 6 touffes." },
];

export const POTAGER_FACILE: { id: string; ou: string; conseil: string }[] = [
  { id: "radis", ou: "Balcon ou jardin", conseil: "Récolte en 4 semaines : idéal pour une première réussite." },
  { id: "laitue", ou: "Balcon ou jardin", conseil: "Salade « à couper » : on récolte les feuilles, elle repousse 2 à 3 fois." },
  { id: "tomate", ou: "Balcon sud ou jardin", conseil: "Prenez une tomate CERISE en plant (pas en graines la première année), pot de 20 L minimum." },
  { id: "fraisier", ou: "Balcon ou jardin", conseil: "Achetez des plants en avril ; 3 plants par jardinière de 60 cm." },
  { id: "haricot", ou: "Jardin ou grand bac", conseil: "Gros graines faciles à semer en mai, récolte en 2 mois." },
  { id: "courgette", ou: "Jardin (ou grand bac de 40 L)", conseil: "Un seul pied suffit pour 2 personnes : il produit énormément." },
  { id: "pomme-de-terre", ou: "Jardin ou sac de culture", conseil: "Récolte « trésor » appréciée des enfants ; marche même dans un sac sur un balcon." },
];

export const COURSES: Record<"interieur" | "balcon" | "jardin", { objet: string; prix: string; note?: string }[]> = {
  interieur: [
    { objet: "1 à 3 plantes increvables", prix: "10 à 30 € chacune" },
    { objet: "Pots percés un peu plus grands que la motte + soucoupes ou cache-pots", prix: "5 à 15 € pièce" },
    { objet: "Un sac de terreau plantes vertes SANS TOURBE, mention UAB (10 à 20 L)", prix: "8 à 15 €" },
    { objet: "Un petit arrosoir à bec fin", prix: "5 à 10 €" },
    { objet: "Un engrais liquide organique plantes vertes (pour le printemps)", prix: "5 à 8 €", note: "Une bouteille dure 1 à 2 ans." },
    { objet: "Facultatif : un hygromètre-thermomètre", prix: "5 à 15 €" },
  ],
  balcon: [
    { objet: "2 jardinières de 60 cm (ou à réserve d'eau)", prix: "10 à 30 € pièce" },
    { objet: "1 grand pot de 20 L pour une tomate cerise", prix: "10 à 20 €" },
    { objet: "Terreau potager sans tourbe, mention UAB (2 sacs de 40 L) + un peu de compost", prix: "20 à 35 €" },
    { objet: "Plants bio : 1 tomate cerise, 3 fraisiers, 1 ciboulette ; graines bio non traitées : radis, salade à couper", prix: "15 à 30 €" },
    { objet: "Arrosoir de 5 L, soucoupes, paillage (paillettes de lin)", prix: "15 à 25 €" },
  ],
  jardin: [
    { objet: "Une bêche-fourche ou une grelinette, un transplantoir, un râteau", prix: "40 à 100 €" },
    { objet: "Compost ou fumier composté (gratuit en déchetterie dans beaucoup de communes)", prix: "0 à 30 €" },
    { objet: "Paille pour pailler (une botte)", prix: "5 à 10 €" },
    { objet: "Plants et graines bio faciles pour 10 m² (voir « Premier potager »)", prix: "25 à 50 €" },
    { objet: "Arrosoir de 10 L, tuyau, et si possible un récupérateur d'eau de pluie", prix: "20 à 80 €" },
  ],
};

export const OFFRIR: { id: string; pourquoi: string }[] = [
  { id: "orchidee", pourquoi: "Fleurie pendant des mois, sans danger pour les animaux, très facile si on l'arrose peu." },
  { id: "chlorophytum", pourquoi: "Increvable et sans danger : parfait pour quelqu'un qui « tue tout »." },
  { id: "pilea", pourquoi: "Jolie, facile, sans danger, fait des bébés à partager." },
  { id: "peperomia", pourquoi: "Petite, facile, sans danger pour les animaux." },
  { id: "streptocarpus", pourquoi: "Fleurs pendant des mois, sans danger." },
  { id: "hoya", pourquoi: "Fleurs parfumées, peu d'arrosage, sans danger." },
];
