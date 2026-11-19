import type { State, Visite, Ruche, MethodeVarroa } from "./store";

// Couleur internationale de marquage des reines selon le dernier chiffre de l'année
export const COULEURS_REINE = [
  { chiffres: [1, 6], nom: "blanc", css: "#f4f4f4" },
  { chiffres: [2, 7], nom: "jaune", css: "#f2c200" },
  { chiffres: [3, 8], nom: "rouge", css: "#d33" },
  { chiffres: [4, 9], nom: "vert", css: "#2a9d4b" },
  { chiffres: [5, 0], nom: "bleu", css: "#2f6fd6" },
];
export function couleurReine(annee: number) {
  return COULEURS_REINE.find((c) => c.chiffres.includes(((annee % 10) + 10) % 10))!;
}

export const METHODES_VARROA: Record<MethodeVarroa, { nom: string; unite: string; aide: string }> = {
  chute: { nom: "Chute naturelle (lange)", unite: "varroas / jour", aide: "Nombre de varroas comptés sur le lange, et nombre de jours de pose : l'appli calcule la chute par jour." },
  sucre: { nom: "Lavage au sucre glace (300 abeilles)", unite: "% d'abeilles infestées", aide: "Nombre de varroas tombés pour une demi-tasse d'abeilles (environ 300) : l'appli calcule le pourcentage." },
  alcool: { nom: "Lavage à l'alcool (300 abeilles)", unite: "% d'abeilles infestées", aide: "Même calcul que le sucre glace, un peu plus précis mais les abeilles meurent." },
};

/** Valeur ramenée à l'unité de la méthode : varroas par jour (chute) ou % (lavage). */
export function valeurVarroa(v: Pick<Visite, "varroaMethode" | "varroaValeur" | "varroaJours">): number | null {
  if (!v.varroaMethode || v.varroaValeur == null || isNaN(v.varroaValeur)) return null;
  if (v.varroaMethode === "chute") return Math.round((v.varroaValeur / Math.max(1, v.varroaJours ?? 1)) * 10) / 10;
  return Math.round((v.varroaValeur / 3) * 10) / 10; // varroas pour 300 abeilles → %
}

export type NiveauVarroa = "ok" | "surveiller" | "traiter";
/** Seuils indicatifs selon la saison (repères des GDSA et de l'ITSAP, à adapter à sa région). */
export function seuilsVarroa(methode: MethodeVarroa, mois: number): { surveiller: number; traiter: number } {
  const ete = mois >= 6 && mois <= 8;
  const hiver = mois === 12 || mois <= 2;
  if (methode === "chute") return ete ? { surveiller: 5, traiter: 10 } : hiver ? { surveiller: 0.5, traiter: 1 } : { surveiller: 1, traiter: 3 };
  return ete ? { surveiller: 2, traiter: 3 } : { surveiller: 1, traiter: 2 };
}
export function niveauVarroa(v: Visite): NiveauVarroa | null {
  const x = valeurVarroa(v);
  if (x == null) return null;
  const s = seuilsVarroa(v.varroaMethode!, Number(v.date.slice(5, 7)));
  return x >= s.traiter ? "traiter" : x >= s.surveiller ? "surveiller" : "ok";
}
export const LIB_NIVEAU: Record<NiveauVarroa, string> = { ok: "sous le seuil", surveiller: "à surveiller", traiter: "seuil dépassé : traiter" };

export function vivantes(ruches: Ruche[], date: string) {
  return ruches.filter((r) => (!r.installee || r.installee <= date) && (!r.morte || r.morte > date));
}

/** Pertes de l'hiver qui commence en novembre de l'année donnée (1er nov → 30 avril). */
export function pertesHiver(ruches: Ruche[], annee: number) {
  const debut = `${annee}-11-01`, fin = `${annee + 1}-04-30`;
  const avant = vivantes(ruches, debut);
  const mortes = avant.filter((r) => r.morte && r.morte <= fin);
  return { hivernees: avant.length, mortes: mortes.length, taux: avant.length ? Math.round((mortes.length / avant.length) * 100) : 0, causes: mortes.map((r) => r.cause || "cause non notée") };
}

/** Résumé de la dernière visite d'une ruche, pour la carte. */
export function derniereVisite(s: Pick<State, "visites">, rucheId: string) {
  return s.visites.filter((v) => v.rucheId === rucheId).sort((a, b) => b.date.localeCompare(a.date))[0];
}
export function dernieresPesees(s: Pick<State, "visites">, rucheId: string) {
  return s.visites.filter((v) => v.rucheId === rucheId && v.poids != null).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
}
/** Seuil d'alerte de poids total (Dadant 10 cadres, bois compris) d'octobre à mars : en dessous, réserves insuffisantes. */
export const POIDS_ALERTE_HIVER = 30;

export function dernierComptage(s: Pick<State, "visites">, rucheId: string) {
  return s.visites.filter((v) => v.rucheId === rucheId && valeurVarroa(v) != null).sort((a, b) => b.date.localeCompare(a.date))[0];
}

/** Alertes du rucher : seuils dépassés, ruches non visitées, traitements en place depuis trop longtemps. */
export function alertesRucher(s: Pick<State, "ruches" | "visites" | "traitementsApi">, aujourdhui: string) {
  const out: { rucheId?: string; texte: string; grave: boolean }[] = [];
  for (const r of s.ruches.filter((x) => !x.morte)) {
    const c = dernierComptage(s, r.id);
    if (c && niveauVarroa(c) === "traiter") {
      const traitee = s.traitementsApi.some((t) => t.rucheIds.includes(r.id) && t.debut >= c.date);
      if (!traitee) out.push({ rucheId: r.id, texte: `${r.nom} : varroa au-dessus du seuil (${valeurVarroa(c)} ${METHODES_VARROA[c.varroaMethode!].unite}) le ${c.date.split("-").reverse().join("/")}. Traitez puis recomptez.`, grave: true });
    }
    const v = derniereVisite(s, r.id);
    if (v?.reine === "non" && !s.visites.some((x) => x.rucheId === r.id && x.date > v.date)) out.push({ rucheId: r.id, texte: `${r.nom} : ni reine ni œufs vus à la dernière visite. Revérifiez dans 8 jours (orphelinage ?).`, grave: false });
    const [p1] = dernieresPesees(s, r.id);
    const mois = Number(aujourdhui.slice(5, 7));
    if (p1 && (mois >= 10 || mois <= 3) && p1.poids! < POIDS_ALERTE_HIVER) out.push({ rucheId: r.id, texte: `${r.nom} : ${p1.poids} kg à la dernière pesée, réserves probablement insuffisantes. Candi posé sur la grappe (hiver) ou sirop épais (automne).`, grave: true });
    if (v?.cellules === "essaimage") out.push({ rucheId: r.id, texte: `${r.nom} : cellules d'essaimage vues. Divisez ou donnez de la place sans tarder.`, grave: false });
  }
  for (const t of s.traitementsApi.filter((x) => !x.fin)) {
    const jours = Math.round((new Date(aujourdhui).getTime() - new Date(t.debut).getTime()) / 86400000);
    if (jours > 70) out.push({ texte: `Traitement « ${t.produit} » posé depuis ${jours} jours sans date de retrait : retirez les lanières ou notez la fin (respectez la durée de la notice).`, grave: true });
  }
  return out;
}

/** Registre des traitements au format tableur (séparateur point-virgule). */
export function registreTraitementsCsv(s: Pick<State, "ruches" | "traitementsApi">) {
  const esc = (x: string | number | undefined) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const lignes = [["Début", "Fin", "Produit (médicament)", "N° de lot", "Dose / mode", "Ruches traitées", "Ordonnance / facture", "Note"].map(esc).join(";")];
  for (const t of [...s.traitementsApi].sort((a, b) => a.debut.localeCompare(b.debut))) {
    const noms = t.rucheIds.map((id) => s.ruches.find((r) => r.id === id)?.nom ?? "?").join(", ");
    lignes.push([t.debut, t.fin, t.produit, t.lot, t.dose, noms, t.ordonnance, t.note].map(esc).join(";"));
  }
  return "﻿" + lignes.join("\r\n");
}

/** Visites au format tableur : le carnet de visites. */
export function visitesCsv(s: Pick<State, "ruches" | "visites">) {
  const esc = (x: string | number | undefined) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const lignes = [["Date", "Ruche", "Reine", "Cadres de couvain", "Cadres de miel", "Cadres de pollen", "Humeur", "Cellules royales", "Varroa", "Poids (kg)", "Intervention", "Note"].map(esc).join(";")];
  for (const v of [...s.visites].sort((a, b) => a.date.localeCompare(b.date))) {
    const val = valeurVarroa(v);
    lignes.push([v.date, s.ruches.find((r) => r.id === v.rucheId)?.nom, v.reine === "vue" ? "vue" : v.reine === "oeufs" ? "œufs vus" : v.reine === "non" ? "ni reine ni œufs" : "", v.couvain, v.miel, v.pollen, v.humeur ? ["", "douce", "nerveuse", "agressive"][v.humeur] : "", v.cellules === "essaimage" ? "essaimage" : v.cellules === "remplacement" ? "remplacement" : "", val != null ? `${val} ${METHODES_VARROA[v.varroaMethode!].unite}` : "", v.poids, v.action, v.note].map(esc).join(";"));
  }
  return "﻿" + lignes.join("\r\n");
}

export const PRODUITS_VARROA = [
  "Apivar (amitraze, lanières)",
  "Apitraz (amitraze, lanières)",
  "Apiguard (thymol)",
  "Thymovar (thymol)",
  "Apilife Var (thymol)",
  "MAQS (acide formique)",
  "Formicpro (acide formique)",
  "Api-Bioxal (acide oxalique)",
  "Oxybee (acide oxalique)",
  "Varromed (acide oxalique et formique)",
  "Polyvar Yellow (fluméthrine)",
];
export const TYPES_RUCHE = ["Dadant 10 cadres", "Dadant 12 cadres", "Langstroth", "Warré", "Kényane", "Ruchette 5-6 cadres", "Autre"];
export const ORIGINES = ["Essaim acheté", "Essaim naturel capturé", "Division de mes ruches", "Paquet d'abeilles", "Ruche achetée peuplée", "Autre"];

// ——— Force des colonies, récolte par ruche, sirop
/** Cadres couverts d'abeilles au fil des visites (indicateur de force de la colonie). */
export function forceColonie(s: Pick<State, "visites">, rucheId: string) {
  return s.visites.filter((v) => v.rucheId === rucheId && v.cadresAbeilles != null).sort((a, b) => a.date.localeCompare(b.date)).map((v) => ({ date: v.date, cadres: v.cadresAbeilles! }));
}
/** Miel récolté par ruche pour une année (kg), trié du meilleur au moins bon. */
export function recolteParRuche(s: Pick<State, "visites" | "ruches">, annee: number) {
  const tot: Record<string, number> = {};
  for (const v of s.visites) if (v.mielRecolte && v.date.startsWith(String(annee))) tot[v.rucheId] = (tot[v.rucheId] ?? 0) + v.mielRecolte;
  return s.ruches.filter((r) => tot[r.id] != null).map((r) => ({ ruche: r, kg: Math.round(tot[r.id] * 10) / 10 })).sort((a, b) => b.kg - a.kg);
}
/** Sirop épais (2 kg de sucre pour 1 L d'eau) pour combler les réserves manquantes avant l'hiver. */
export function siropHiver(poidsActuel: number, poidsCible: number) {
  const manque = Math.max(0, poidsCible - poidsActuel);
  const sucre = Math.round(manque * 10) / 10; // repère : environ 1 kg de sucre pour 1 kg de réserves stockées
  return { manque: Math.round(manque * 10) / 10, sucreKg: sucre, eauL: Math.round((sucre / 2) * 10) / 10, siropL: Math.round((sucre * 0.62 + sucre / 2) * 10) / 10 };
}
