import type { ZoneId } from "../data/calendrier";

// Évapotranspiration de référence moyenne (ETP, mm par jour) par mois et par climat :
// ordres de grandeur pour la France (stations Météo-France typiques), à affiner localement.
export const ETP: Record<ZoneId, number[]> = {
  mediterraneen: [0.9, 1.4, 2.3, 3.4, 4.6, 5.6, 6.2, 5.3, 3.6, 2.1, 1.1, 0.8],
  oceanique: [0.6, 0.9, 1.6, 2.5, 3.3, 3.9, 4.1, 3.5, 2.3, 1.2, 0.6, 0.4],
  tempere: [0.5, 0.8, 1.5, 2.5, 3.5, 4.2, 4.5, 3.8, 2.5, 1.3, 0.6, 0.4],
  continental: [0.4, 0.7, 1.5, 2.6,3.6, 4.3, 4.6, 3.8, 2.4, 1.1, 0.5, 0.3],
  montagne: [0.3, 0.5, 1.1, 2.0, 3.0, 3.7, 4.0, 3.3, 2.1, 1.0, 0.4, 0.2],
};

/** Coefficient cultural (part de l'ETP consommée par une culture adulte) selon le besoin en eau de la fiche. */
export const KC: Record<"faible" | "moyen" | "fort", number> = { faible: 0.5, moyen: 0.8, fort: 1.05 };

export interface BesoinEau { litresM2Semaine: number; etp: number; kc: number }

/**
 * Besoin d'arrosage par m² et par semaine (litres) : ETP × Kc × 7, réduit par le paillage (environ -30 %),
 * moins la pluie utile de la semaine (on n'en compte que 80 %).
 */
export function besoinEau(zone: ZoneId, mois: number, eau: "faible" | "moyen" | "fort", opts: { paillage?: boolean; pluieMm?: number } = {}): BesoinEau {
  const etp = ETP[zone][mois - 1];
  const kc = KC[eau];
  let l = etp * kc * 7 * (opts.paillage ? 0.7 : 1);
  l -= (opts.pluieMm ?? 0) * 0.8;
  return { litresM2Semaine: Math.max(0, Math.round(l)), etp, kc };
}

export interface Reseau {
  goutteurs: number; debitTotalLh: number; maxParSecteur: number; secteurs: number;
  litresSemaine: number; arrosagesSemaine: number; minutesParArrosage: number; alerteLongueur: boolean;
}

/**
 * Dimensionne un goutte-à-goutte : débit du robinet (test du seau, L/min), débit et espacement des goutteurs,
 * longueur de ligne et largeur arrosée par ligne, besoin en L/m²/semaine.
 */
export function dimensionner(p: { debitRobinetLmin: number; debitGoutteurLh: number; espacementCm: number; longueurM: number; largeurM: number; besoinL: number; arrosagesSemaine?: number; longueurMaxLigneM?: number; nbLignes?: number }): Reseau {
  const goutteurs = Math.max(1, Math.floor((p.longueurM * 100) / p.espacementCm));
  const debitTotalLh = goutteurs * p.debitGoutteurLh;
  // On n'utilise que 80 % du débit du robinet pour garder une pression suffisante en bout de ligne
  const maxParSecteur = Math.max(1, Math.floor((p.debitRobinetLmin * 60 * 0.8) / p.debitGoutteurLh));
  const secteurs = Math.ceil(goutteurs / maxParSecteur);
  const surface = p.longueurM * p.largeurM;
  const litresSemaine = Math.round(surface * p.besoinL);
  const arrosagesSemaine = p.arrosagesSemaine ?? 3;
  const minutesParArrosage = Math.round((litresSemaine / arrosagesSemaine / debitTotalLh) * 60);
  const ligne = p.longueurM / Math.max(1, p.nbLignes ?? 1);
  return { goutteurs, debitTotalLh, maxParSecteur, secteurs, litresSemaine, arrosagesSemaine, minutesParArrosage, alerteLongueur: ligne > (p.longueurMaxLigneM ?? 50) };
}
