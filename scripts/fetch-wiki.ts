// Récupère, pour chaque fiche qui a un titre Wikipédia, la photo principale de
// l'article (Wikimedia Commons, licences libres) et le lien vers l'article.
// Usage : npm run wiki   (à relancer quand on ajoute des fiches)
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { PLANTES, PROBLEMES, ANIMAUX, AUXILIAIRES } from "../src/data/index";

const OUT = "src/data/wiki.json";
const old: Record<string, unknown> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const items = [...PLANTES, ...PROBLEMES, ...ANIMAUX, ...AUXILIAIRES].filter((x) => x.wiki) as { id: string; wiki: string }[];
const out: Record<string, { img: string; page: string; titre: string }> = {};
const missing: string[] = [];

async function get(title: string) {
  const r = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
    headers: { "User-Agent": "RacinesJardinApp/1.0 (application de jardinage hors ligne)" },
  });
  if (r.status === 429) { await new Promise((s) => setTimeout(s, 5000)); return get(title); }
  if (!r.ok) { console.log(title, r.status); return null; }
  return r.json();
}

for (const it of items) {
  if (old[it.id] && !process.env.FORCE) { out[it.id] = old[it.id] as (typeof out)[string]; continue; }
  try {
    const j = await get(it.wiki);
    const img = j?.thumbnail?.source as string | undefined;
    if (j && img) {
      out[it.id] = { img: img.replace(/\/(\d+)px-/, "/500px-"), page: j.content_urls?.desktop?.page ?? `https://fr.wikipedia.org/wiki/${encodeURIComponent(it.wiki)}`, titre: j.title };
    } else {
      missing.push(`${it.id} (${it.wiki})`);
      if (old[it.id]) out[it.id] = old[it.id] as (typeof out)[string];
    }
  } catch (e) {
    missing.push(`${it.id} (${it.wiki}) : ${(e as Error).message}`);
    if (old[it.id]) out[it.id] = old[it.id] as (typeof out)[string];
  }
  await new Promise((r) => setTimeout(r, 400));
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`${Object.keys(out).length} images sur ${items.length}.`);
if (missing.length) console.log("Sans image :\n  " + missing.join("\n  "));
