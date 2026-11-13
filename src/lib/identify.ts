import Anthropic from "@anthropic-ai/sdk";
import { PLANTES, PROBLEMES, ANIMAUX } from "../data/index";
import { getState } from "./store";
import { resizeImage } from "./photos";
export { savePhoto, loadPhoto, resizeImage } from "./photos";

// Identification par photo :
//  • Pl@ntNet (clé gratuite, 500 identifications/jour) pour reconnaître une plante,
//    un arbre, un fruit, une fleur ;
//  • Claude (clé API personnelle, payante à l'usage) pour reconnaître aussi les
//    maladies, ravageurs, carences et donner un plan d'action.
// Les photos ne partent vers ces services que lorsque l'utilisateur le demande.

async function toBase64(b: Blob): Promise<string> {
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

// ---------- Pl@ntNet ----------
export interface PlantNetResult { score: number; latin: string; noms: string[]; famille: string; ficheId?: string }

export function ficheParLatin(latin: string): string | undefined {
  const bin = latin.toLowerCase().split(" ").slice(0, 2).join(" ");
  const genre = bin.split(" ")[0];
  const exact = PLANTES.find((p) => p.latin.toLowerCase().includes(bin));
  if (exact) return exact.id;
  return PLANTES.find((p) => p.latin.toLowerCase().split(/[ ,/]+/).includes(genre) && /spp|×/.test(p.latin))?.id
    ?? PLANTES.find((p) => p.latin.toLowerCase().startsWith(genre + " "))?.id;
}

export async function identifyPlantNet(photos: Blob[], organe: string): Promise<PlantNetResult[]> {
  const key = getState().settings.plantnetKey.trim();
  if (!key) throw new Error("Ajoutez votre clé Pl@ntNet dans les réglages (gratuite).");
  const fd = new FormData();
  for (const p of photos) {
    fd.append("images", await resizeImage(p, 1280), "photo.jpg");
    fd.append("organs", organe);
  }
  const r = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(key)}&lang=fr&nb-results=5`, { method: "POST", body: fd });
  if (r.status === 404) return [];
  if (r.status === 401) throw new Error("Clé Pl@ntNet refusée. Vérifiez-la, et que le domaine de l'application est autorisé dans votre compte Pl@ntNet.");
  if (r.status === 429) throw new Error("Quota Pl@ntNet du jour atteint.");
  if (!r.ok) throw new Error(`Pl@ntNet indisponible (erreur ${r.status}).`);
  const j = await r.json();
  return (j.results ?? []).map((x: { score: number; species: { scientificNameWithoutAuthor: string; commonNames?: string[]; family?: { scientificNameWithoutAuthor: string } } }) => ({
    score: x.score,
    latin: x.species.scientificNameWithoutAuthor,
    noms: x.species.commonNames ?? [],
    famille: x.species.family?.scientificNameWithoutAuthor ?? "",
    ficheId: ficheParLatin(x.species.scientificNameWithoutAuthor),
  }));
}

// ---------- Claude (vision) ----------
export interface ClaudeDiag {
  sujet: string;
  resume: string;
  plante: { nom: string; latin: string; confiance: string; fiche: string };
  problemes: { nom: string; confiance: string; fiche: string; indices: string }[];
  a_verifier: string[];
  actions: string[];
  urgence: string;
  comestible: string;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["sujet", "resume", "plante", "problemes", "a_verifier", "actions", "urgence", "comestible"],
  properties: {
    sujet: { type: "string", enum: ["plante-saine", "plante-malade", "ravageur", "fruit-ou-legume", "arbre", "animal", "autre"] },
    resume: { type: "string" },
    plante: {
      type: "object", additionalProperties: false, required: ["nom", "latin", "confiance", "fiche"],
      properties: { nom: { type: "string" }, latin: { type: "string" }, confiance: { type: "string", enum: ["élevée", "moyenne", "faible", "aucune"] }, fiche: { type: "string" } },
    },
    problemes: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["nom", "confiance", "fiche", "indices"],
        properties: { nom: { type: "string" }, confiance: { type: "string", enum: ["élevée", "moyenne", "faible"] }, fiche: { type: "string" }, indices: { type: "string" } },
      },
    },
    a_verifier: { type: "array", items: { type: "string" } },
    actions: { type: "array", items: { type: "string" } },
    urgence: { type: "string", enum: ["aucune", "à surveiller", "agir cette semaine", "agir aujourd'hui"] },
    comestible: { type: "string" },
  },
};

function catalogue() {
  const pl = PLANTES.map((p) => `${p.id}=${p.nom} (${p.latin})`).join("; ");
  const pb = PROBLEMES.map((p) => `${p.id}=${p.nom}`).join("; ");
  const an = ANIMAUX.map((a) => `${a.id}=${a.nom}`).join("; ");
  return `FICHES PLANTES : ${pl}\n\nFICHES PROBLÈMES : ${pb}\n\nFICHES ANIMAUX : ${an}`;
}

const SYSTEM = `Tu es un jardinier-maraîcher et botaniste avec vingt ans d'expérience, spécialiste de la santé des plantes (phytopathologie, entomologie) et de l'agriculture biologique familiale en France. Tu aides un particulier à partir d'une ou plusieurs photos.

Ta mission :
1. Identifier ce qui est photographié (plante, arbre, fruit, légume, feuille, insecte, symptôme).
2. Si la plante semble malade ou attaquée, proposer les causes les plus probables, de la plus probable à la moins probable, avec les indices visibles qui t'orientent.
3. Donner des actions concrètes, naturelles et autorisées pour un particulier en France (pas de pesticides de synthèse : loi Labbé), dans l'ordre où les faire.
4. Dire ce qu'il faut vérifier pour confirmer (dessous des feuilles, racines, loupe, odeur…).

Règles :
- Honnêteté avant tout : si la photo est floue, partielle ou ambiguë, dis-le, baisse la confiance et demande la photo qui manque. N'invente jamais.
- Plusieurs causes peuvent donner le même symptôme (carence, arrosage, maladie) : mentionne-les.
- Pour « fiche », donne l'identifiant EXACT d'une fiche du catalogue ci-dessous si elle correspond, sinon une chaîne vide.
- « comestible » : uniquement si la photo montre une plante, un fruit ou un champignon que la personne pourrait vouloir manger, rappelle qu'une identification par photo ne suffit JAMAIS à garantir la comestibilité (confusions mortelles : ciguës, colchique, champignons) ; sinon chaîne vide.
- Si un animal de la ferme semble malade sur la photo, oriente vers le vétérinaire.
- Français simple, phrases courtes, pas de jargon non expliqué.

${catalogue()}`;

export async function identifyClaude(photos: Blob[], question: string, signal?: AbortSignal): Promise<ClaudeDiag> {
  const key = getState().settings.claudeKey.trim();
  if (!key) throw new Error("Ajoutez votre clé d'API Claude dans les réglages.");
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2 });
  const images = await Promise.all(photos.map(async (p) => ({ type: "image" as const, source: { type: "base64" as const, media_type: "image/jpeg" as const, data: await toBase64(await resizeImage(p, 1568, 0.85)) } })));
  const msg = await client.beta.messages.create(
    {
      model: "claude-opus-5-5",
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: [...images, { type: "text", text: question || "Qu'est-ce que c'est, et est-ce que tout va bien ?" }] }],
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    } as Parameters<typeof client.beta.messages.create>[0],
    { signal },
  ) as Anthropic.Beta.BetaMessage;
  if (msg.stop_reason === "refusal") throw new Error("La demande n'a pas pu être traitée. Essayez avec une autre photo.");
  const text = msg.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")?.text;
  if (!text) throw new Error("Réponse vide.");
  return JSON.parse(text) as ClaudeDiag;
}

export function claudeErrorMessage(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return "Clé d'API Claude refusée : vérifiez-la dans les réglages.";
  if (e instanceof Anthropic.RateLimitError) return "Trop de demandes en peu de temps : réessayez dans une minute.";
  if (e instanceof Anthropic.APIConnectionError) return "Pas de connexion à Internet (ou service injoignable).";
  if (e instanceof Anthropic.APIError) return `Erreur du service (${e.status}) : ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}
