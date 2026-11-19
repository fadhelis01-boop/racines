// Estimation de la lumière d'un emplacement intérieur : orientation de la fenêtre, distance et voilage.
// La caméra d'un téléphone ne mesure pas des lux fiables (elle règle son exposition toute seule) :
// on estime donc à partir de ce que chacun peut observer, avec le test de l'ombre de la main pour confirmer.
export type Expo = "soleil" | "mi-ombre" | "ombre";
export type Distance = 0 | 1 | 2 | 3; // 0 : contre la vitre, 1 : vers 1 m, 2 : vers 2 m, 3 : 3 m et plus

const BASE: Record<string, number> = { sud: 4, ouest: 4, est: 3, nord: 2, loin: 1, aucune: 0 };

export const NIVEAUX: { lux: string; label: string; ombre: string; expo: Expo[] }[] = [
  { lux: "moins de 200 lux", label: "Sombre : aucune plante n'y vit sans lampe", ombre: "pas d'ombre visible", expo: [] },
  { lux: "200 à 800 lux", label: "Lumière faible : plantes d'ombre seulement", ombre: "ombre de la main à peine visible", expo: ["ombre"] },
  { lux: "800 à 2 000 lux", label: "Lumière moyenne : plantes d'ombre et de mi-ombre", ombre: "ombre floue", expo: ["ombre", "mi-ombre"] },
  { lux: "2 000 à 10 000 lux", label: "Lumineux sans soleil brûlant : la majorité des plantes vertes", ombre: "ombre nette aux bords un peu flous", expo: ["mi-ombre"] },
  { lux: "plus de 10 000 lux (soleil direct)", label: "Très lumineux : cactus, succulentes, agrumes, plantes de soleil", ombre: "ombre très nette", expo: ["soleil", "mi-ombre"] },
];

export function lumiereEstimee(fenetre: string, distance: Distance, voilage: boolean) {
  const base = BASE[fenetre] ?? 0;
  const d = fenetre === "loin" || fenetre === "aucune" ? 0 : distance;
  const niveau = Math.max(0, Math.min(4, base - d - (voilage ? 1 : 0))) as 0 | 1 | 2 | 3 | 4;
  return { niveau, ...NIVEAUX[niveau] };
}
