// Fleurs coupées françaises de saison, mois par mois (production locale de plein champ ou sous abri froid,
// Var et Alpes-Maritimes l'hiver, partout ailleurs au printemps et en été). Repères pour acheter local.
export const FLEURS_ACHAT: Record<number, { fleurs: string[]; note: string }> = {
  1: { fleurs: ["Anémones", "Renoncules", "Mimosa", "Hellébores", "Tulipes (bulbes forcés)", "Branches de saule et de noisetier"], note: "L'hiver, les fleurs françaises viennent surtout du Var." },
  2: { fleurs: ["Mimosa", "Anémones", "Renoncules", "Tulipes", "Narcisses", "Giroflées"], note: "Saint-Valentin : les roses de février sont presque toutes importées ; préférez anémones et renoncules." },
  3: { fleurs: ["Tulipes", "Narcisses", "Renoncules", "Anémones", "Giroflées", "Branches de forsythia et de cerisier"], note: "Le printemps arrive par les bulbes." },
  4: { fleurs: ["Tulipes", "Renoncules", "Lilas", "Giroflées", "Boules-de-neige (viorne)", "Premières pivoines du Sud"], note: "Le lilas ne se trouve qu'en saison, deux à trois semaines." },
  5: { fleurs: ["Pivoines", "Muguet (1er mai)", "Lilas", "Iris", "Premières roses", "Pois de senteur", "Alchémille"], note: "Le mois des pivoines : profitez-en, la saison est courte." },
  6: { fleurs: ["Roses", "Pivoines", "Pois de senteur", "Delphiniums", "Alstroemerias", "Lavande", "Ammi", "Campanules"], note: "Le plus grand choix de l'année." },
  7: { fleurs: ["Dahlias", "Zinnias", "Tournesols", "Lavande", "Gypsophile", "Lisianthus", "Agapanthes", "Cosmos"], note: "Fleurs d'été qui tiennent en vase malgré la chaleur." },
  8: { fleurs: ["Dahlias", "Zinnias", "Cosmos", "Tournesols", "Glaïeuls", "Célosies", "Amarantes", "Scabieuses"], note: "Coupez tôt le matin, l'eau du vase chauffe vite." },
  9: { fleurs: ["Dahlias", "Cosmos", "Asters", "Hortensias", "Rudbeckias", "Premiers chrysanthèmes", "Graminées"], note: "Les dahlias sont au sommet jusqu'aux premières gelées." },
  10: { fleurs: ["Dahlias (jusqu'aux gelées)", "Chrysanthèmes", "Asters", "Hortensias à sécher", "Graminées", "Branches colorées d'automne"], note: "Saison des bouquets chauds : feuillages rouges, baies, graminées." },
  11: { fleurs: ["Chrysanthèmes", "Feuillages persistants", "Baies (houx, rosier, viorne)", "Fleurs séchées", "Hortensias séchés"], note: "Les fleurs séchées de l'été prennent le relais." },
  12: { fleurs: ["Houx", "Sapin et pin", "Eucalyptus", "Fleurs séchées", "Amaryllis (bulbes forcés)", "Hellébores (roses de Noël)"], note: "Couronnes et compositions de Noël en feuillages et fleurs sèches." },
};
