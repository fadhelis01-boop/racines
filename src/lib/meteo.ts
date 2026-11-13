// Météo locale via Open-Meteo (service public gratuit, sans clé, sans compte).
// Seules les coordonnées de la ville choisie sont envoyées.

export interface Jour { date: string; tmin: number; tmax: number; pluie: number; vent: number; code: number }
export interface Meteo { jours: Jour[]; maj: number }
export interface Alerte { niveau: "info" | "attention" | "danger"; emoji: string; titre: string; conseils: string[] }

const CACHE = "racines-meteo";

export async function chercherVille(nom: string) {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nom)}&count=6&language=fr&format=json`);
  if (!r.ok) throw new Error("Recherche indisponible");
  const j = await r.json();
  return ((j.results ?? []) as { name: string; admin1?: string; country?: string; latitude: number; longitude: number }[]).map((x) => ({
    nom: [x.name, x.admin1, x.country].filter(Boolean).join(", "),
    lat: x.latitude,
    lon: x.longitude,
  }));
}

export async function meteo(lat: number, lon: number, force = false): Promise<Meteo> {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) ?? "null");
    if (!force && c && c.lat === lat && c.lon === lon && Date.now() - c.data.maj < 3 * 3600e3) return c.data;
  } catch {
    /* cache illisible */
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,wind_speed_10m_max,weather_code&timezone=auto&forecast_days=7`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Météo indisponible");
  const j = await r.json();
  const d = j.daily;
  const data: Meteo = {
    maj: Date.now(),
    jours: (d.time as string[]).map((date, i) => ({ date, tmin: d.temperature_2m_min[i], tmax: d.temperature_2m_max[i], pluie: d.precipitation_sum[i], vent: d.wind_speed_10m_max[i], code: d.weather_code[i] })),
  };
  try {
    localStorage.setItem(CACHE, JSON.stringify({ lat, lon, data }));
  } catch {
    /* stockage plein */
  }
  return data;
}

export function emojiMeteo(code: number) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67 || (code >= 80 && code <= 82)) return "🌧️";
  if (code <= 77 || code === 85 || code === 86) return "🌨️";
  return "⛈️";
}

// Traduit les prévisions en gestes concrets pour le jardin et les animaux
export function alertes(m: Meteo, animaux: boolean, situation = "jardin"): Alerte[] {
  const j = m.jours.slice(0, 4);
  const out: Alerte[] = [];
  if (situation === "appartement") return alertesInterieur(j);
  const minGel = Math.min(...j.map((x) => x.tmin));
  if (minGel <= 0) {
    out.push({
      niveau: minGel <= -5 ? "danger" : "attention", emoji: "🥶", titre: `Gel annoncé (jusqu'à ${Math.round(minGel)} °C)`,
      conseils: [
        "Couvrez les jeunes plants et les semis d'un voile d'hivernage le soir, retirez-le le matin.",
        "Rentrez les pots gélifs (agrumes, géraniums, aromatiques fragiles) ou regroupez-les contre un mur.",
        "Ne plantez pas les légumes d'été tant que le risque de gel persiste.",
        ...(animaux ? ["Vérifiez les abreuvoirs matin et soir (eau gelée), litière épaisse et sèche."] : []),
      ],
    });
  } else if (minGel <= 3) {
    out.push({ niveau: "info", emoji: "❄️", titre: `Nuits fraîches (${Math.round(minGel)} °C) : risque de gelée blanche`, conseils: ["Protégez les semis et les plants frileux (tomates, courges, basilic) avec un voile."] });
  }
  const maxT = Math.max(...j.map((x) => x.tmax));
  if (maxT >= 30) {
    out.push({
      niveau: maxT >= 35 ? "danger" : "attention", emoji: "🥵", titre: `Fortes chaleurs (jusqu'à ${Math.round(maxT)} °C)`,
      conseils: [
        "Arrosez tôt le matin, abondamment au pied, et paillez épais.",
        "Ombrez la serre et les semis, aérez la serre jour et nuit.",
        "Récoltez le matin ; ne repiquez pas pendant la vague de chaleur.",
        ...(animaux ? ["Animaux : ombre, eau fraîche renouvelée deux fois par jour, pas de manipulation aux heures chaudes. Lapins et volailles sont très sensibles (coup de chaleur au-delà de 30 °C)."] : []),
      ],
    });
  }
  const pluie = j.reduce((a, x) => a + (x.pluie ?? 0), 0);
  if (pluie >= 25) out.push({ niveau: "info", emoji: "🌧️", titre: `Fortes pluies (${Math.round(pluie)} mm sur 4 jours)`, conseils: ["Inutile d'arroser.", "Limaces de sortie : ramassage le soir à la lampe, pièges.", "Risque de mildiou sur tomates et pommes de terre : surveillez les feuilles dans les jours qui suivent."] });
  else if (pluie < 2 && maxT >= 22) out.push({ niveau: "info", emoji: "💧", titre: "Temps sec", conseils: ["Prévoyez un arrosage copieux des semis, des jeunes plants et des pots."] });
  const vent = Math.max(...j.map((x) => x.vent));
  if (vent >= 60) out.push({ niveau: "attention", emoji: "💨", titre: `Vent fort (rafales à ${Math.round(vent)} km/h)`, conseils: ["Vérifiez les tuteurs et l'ancrage de la serre, fermez-la.", "Rentrez ou couchez les pots hauts du balcon.", ...(animaux ? ["Contrôlez abris et clôtures après le coup de vent."] : [])] });
  // Conditions à mildiou : chaleur + humidité
  const mild = j.filter((x) => x.tmax >= 18 && x.tmax <= 28 && (x.pluie ?? 0) >= 2).length;
  if (mild >= 2 && pluie < 25) out.push({ niveau: "info", emoji: "🍅", titre: "Temps doux et humide : conditions à mildiou", conseils: ["Pulvérisez de la décoction de prêle en préventif sur tomates et pommes de terre, retirez les feuilles du bas."] });
  return out;
}

// Appartement sans extérieur : ce que la météo change pour les plantes de la maison
function alertesInterieur(j: Jour[]): Alerte[] {
  const out: Alerte[] = [];
  const maxT = Math.max(...j.map((x) => x.tmax));
  const minT = Math.min(...j.map((x) => x.tmin));
  if (maxT >= 28)
    out.push({ niveau: maxT >= 33 ? "attention" : "info", emoji: "🥵", titre: `Chaleur (jusqu'à ${Math.round(maxT)} °C)`, conseils: ["Éloignez les plantes des vitres plein sud et ouest l'après-midi (brûlures derrière la vitre), ou tirez un voilage.", "Vérifiez la terre plus souvent : les pots sèchent deux fois plus vite.", "Fermez les volets aux heures chaudes, aérez la nuit."] });
  if (minT <= 3)
    out.push({ niveau: "info", emoji: "❄️", titre: `Nuits froides (${Math.round(minT)} °C dehors)`, conseils: ["Écartez les plantes collées aux vitres froides et des courants d'air quand vous aérez.", "Avec le chauffage, l'air devient sec : regroupez les plantes, plateau de billes d'argile mouillées, éloignez-les des radiateurs.", "Arrosez moins : la plupart des plantes sont au repos."] });
  const sombre = j.filter((x) => x.code >= 3).length;
  if (sombre >= 3 && !out.length) out.push({ niveau: "info", emoji: "☁️", titre: "Plusieurs jours gris", conseils: ["Moins de lumière = moins d'eau : espacez les arrosages.", "Rapprochez les plantes exigeantes de la fenêtre ou allumez la lampe horticole."] });
  return out;
}
