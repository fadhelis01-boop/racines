import { useSyncExternalStore } from "react";
import { dbGet, dbSet } from "./db";
import { useSel } from "./useSel";
import type { ZoneId } from "../data/calendrier";

// État de l'utilisateur, conservé sur l'appareil (IndexedDB), jamais envoyé ailleurs.

export type Situation = "jardin" | "petit-jardin" | "balcon" | "appartement";

export interface Settings {
  onboarded: boolean;
  zone: ZoneId;
  situation: Situation;
  ville: { nom: string; lat: number; lon: number } | null;
  voix: string;
  debit: number;
  texte: "normal" | "grand" | "tres-grand";
  theme: "auto" | "clair" | "sombre";
  claudeKey: string;
  plantnetKey: string;
  sensible: boolean; // afficher les tutoriels d'abattage sans avertissement
  animauxActifs: boolean;
  lune: boolean;
  sol?: { texture: string; traits: string[]; date: string }; // résultat du test « Mon sol »
  debutant?: boolean; // parcours « Je débute » mis en avant
  notifs?: boolean; // rappels sur le téléphone
}

export type TypeEspace = "planche" | "carre" | "bac" | "pot" | "serre" | "interieur" | "verger";
export interface Espace { id: string; nom: string; type: TypeEspace; surface?: number; x?: number; y?: number; l?: number; p?: number; archive?: string; lieu?: string } // archive : date du déménagement
export interface Culture { id: string; planteId: string; espaceId?: string; date: string; mode: "semis" | "plantation"; note?: string; fini?: string }
export interface Recolte { id: string; planteId: string; date: string; qte: number; unite: "kg" | "g" | "pièces" | "bottes" }
export interface Note { id: string; date: string; texte: string; photo?: string; planteId?: string }
export interface Graine { id: string; planteId: string; variete: string; annee: number; qte?: string }
export interface Troupeau { id: string; animalId: string; nom: string; nombre: number; depuis?: string; notes?: string }
export interface Soin { id: string; troupeauId: string; type: string; date: string; prochain?: string; note?: string }
// Élevage : animaux suivis un par un, registre des mouvements, production, dépenses, couvées
export interface Individu { id: string; troupeauId: string; nom: string; boucle?: string; naissance?: string; race?: string; sexe?: "F" | "M"; sortie?: string; note?: string }
export type TypeMouvement = "entree" | "naissance" | "sortie" | "deces";
export interface Mouvement { id: string; troupeauId: string; date: string; type: TypeMouvement; nombre: number; boucles?: string; provenance?: string; note?: string }
export type TypeProduction = "oeufs" | "lait" | "miel" | "laine" | "viande";
export interface Production { id: string; troupeauId: string; date: string; type: TypeProduction; qte: number }
export type CategorieDepense = "aliment" | "litiere" | "veterinaire" | "materiel" | "achat" | "autre";
export interface Depense { id: string; troupeauId?: string; date: string; categorie: CategorieDepense; montant: number; note?: string }
export interface Couvee { id: string; espece: string; debut: string; oeufs: number; mode: "poule" | "couveuse"; eclos?: number; fini?: string; note?: string }
export type Fenetre = "sud" | "ouest" | "est" | "nord" | "lampe" | "sombre";
// Une plante de la maison suivie individuellement (intérieur, pots)
export interface MaPlante {
  id: string;
  planteId: string;
  surnom: string;
  piece?: string;
  fenetre?: Fenetre;
  depuis?: string;
  arrosages: string[];
  engrais: string[];
  rempotages: string[];
  photos: { date: string; key: string }[];
  frequence?: number; // jours entre deux arrosages, réglé par l'utilisateur (sinon calculé)
  note?: string;
}

export interface State {
  settings: Settings;
  espaces: Espace[];
  cultures: Culture[];
  recoltes: Recolte[];
  notes: Note[];
  graines: Graine[];
  troupeaux: Troupeau[];
  soins: Soin[];
  ponte: Record<string, number>; // date ISO → nombre d'œufs (ancien suivi global, conservé)
  individus: Individu[];
  mouvements: Mouvement[];
  production: Production[];
  depenses: Depense[];
  couvees: Couvee[];
  fait: Record<string, string>; // tâche cochée → date
  videos: Record<string, string>; // vidéo préférée par fiche
  favoris: string[];
  plantes: MaPlante[];
  prix: Record<string, number>; // prix au kg choisis par l'utilisateur
}

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  zone: "tempere",
  situation: "jardin",
  ville: null,
  voix: "",
  debit: 1,
  texte: "normal",
  theme: "auto",
  claudeKey: "",
  plantnetKey: "",
  sensible: false,
  animauxActifs: true,
  lune: true,
};

const EMPTY: State = {
  settings: DEFAULT_SETTINGS,
  espaces: [],
  cultures: [],
  recoltes: [],
  notes: [],
  graines: [],
  troupeaux: [],
  soins: [],
  ponte: {},
  individus: [],
  mouvements: [],
  production: [],
  depenses: [],
  couvees: [],
  fait: {},
  videos: {},
  favoris: [],
  plantes: [],
  prix: {},
};

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export async function loadState() {
  const saved = await dbGet<Partial<State>>("state");
  if (saved) state = migrate({ ...EMPTY, ...saved, settings: { ...DEFAULT_SETTINGS, ...(saved.settings ?? {}) } });
  if (saved && saved.settings && (saved.settings as Partial<Settings>).lune === undefined && state.settings.situation === "appartement") state = { ...state, settings: { ...state.settings, lune: false } };
  loaded = true;
  applyAppearance();
  emit();
}

export const isLoaded = () => loaded;
export const getState = () => state;

let saveTimer: ReturnType<typeof setTimeout> | undefined;
export function update(fn: (s: State) => State) {
  state = fn(state);
  emit();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => void dbSet("state", state), 150);
}

export function setSettings(p: Partial<Settings>) {
  update((s) => ({ ...s, settings: { ...s.settings, ...p } }));
  applyAppearance();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
export function useStore<T>(sel: (s: State) => T): T {
  return useSel(subscribe, () => state, sel);
}
export const useLoaded = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => loaded,
  );

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const today = () => isoDate(new Date());
export function isoDate(d: Date) {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

// Ajout/modification/suppression génériques dans une liste de l'état
type ListKey = "espaces" | "cultures" | "recoltes" | "notes" | "graines" | "troupeaux" | "soins" | "plantes" | "individus" | "mouvements" | "production" | "depenses" | "couvees";
export function upsert<K extends ListKey>(key: K, item: State[K][number]) {
  update((s) => {
    const list = s[key] as { id: string }[];
    const i = list.findIndex((x) => x.id === (item as { id: string }).id);
    const next = i >= 0 ? list.map((x, j) => (j === i ? item : x)) : [...list, item];
    return { ...s, [key]: next };
  });
}
export function remove<K extends ListKey>(key: K, id: string) {
  update((s) => ({ ...s, [key]: (s[key] as { id: string }[]).filter((x) => x.id !== id) }));
}

export function toggleFait(key: string) {
  update((s) => {
    const fait = { ...s.fait };
    if (fait[key]) delete fait[key];
    else fait[key] = today();
    return { ...s, fait };
  });
}

export function toggleFavori(id: string) {
  update((s) => ({ ...s, favoris: s.favoris.includes(id) ? s.favoris.filter((x) => x !== id) : [...s.favoris, id] }));
}

function applyAppearance() {
  const s = state.settings;
  const root = document.documentElement;
  root.dataset.texte = s.texte;
  if (s.theme === "auto") delete root.dataset.theme;
  else root.dataset.theme = s.theme === "sombre" ? "dark" : "light";
}

// ---------- Sauvegarde complète (avec photos) ----------
import { dbKeys } from "./db";
export async function exportBackup(): Promise<Blob> {
  const photos: Record<string, string> = {};
  for (const k of await dbKeys("photo:")) {
    const b = await dbGet<Blob>(k);
    if (b) photos[k] = await blobToDataUrl(b);
  }
  const data = { app: "racines", version: 1, date: new Date().toISOString(), state: { ...state, settings: { ...state.settings, claudeKey: "", plantnetKey: "" } }, photos };
  return new Blob([JSON.stringify(data)], { type: "application/json" });
}

export async function importBackup(file: File) {
  const data = JSON.parse(await file.text());
  if (data?.app !== "racines" || !data.state) throw new Error("Ce fichier n'est pas une sauvegarde Racines.");
  const keys = { claudeKey: state.settings.claudeKey, plantnetKey: state.settings.plantnetKey };
  for (const [k, v] of Object.entries(data.photos ?? {})) await dbSet(k, await (await fetch(v as string)).blob());
  update(() => ({ ...EMPTY, ...data.state, settings: { ...DEFAULT_SETTINGS, ...data.state.settings, ...keys } }));
  applyAppearance();
}

export function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(b);
  });
}

// Les plantes d'intérieur notées comme « cultures » (anciennes versions) deviennent des « Mes plantes »
import { plante as ficheDe } from "../data/index";
function migrate(s: State): State {
  const restantes: Culture[] = [];
  const plantes = [...(s.plantes ?? [])];
  for (const c of s.cultures) {
    const f = ficheDe(c.planteId);
    if (f?.categorie === "interieur") plantes.push({ id: c.id, planteId: c.planteId, surnom: f.nom.split(" (")[0], depuis: c.date, arrosages: [], engrais: [], rempotages: [], photos: [] });
    else restantes.push(c);
  }
  return { ...s, cultures: restantes, plantes };
}
