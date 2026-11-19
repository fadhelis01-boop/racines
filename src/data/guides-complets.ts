// Tutoriels complets (texte des étapes, matériel, conseils) : chargés à la demande.
import type { Guide } from "./types";
import { GUIDES_AGRO } from "./agronomie";
import { GUIDES_BIO } from "./bio";
import { GUIDES_ELEVAGE } from "./guides-elevage";
import { GUIDES_RECUP, ETAPES_EN_PLUS } from "./guides-recup";
import { GUIDES_MARAICHAGE } from "./guides-maraichage";
import { GUIDES_APICULTURE } from "./guides-apiculture";
import { GUIDES_CONSERVERIE } from "./guides-conserverie";
import { GUIDES_EXPERT } from "./guides-expert";
import { GUIDES_HORTICULTURE } from "./guides-horticulture";
import { GUIDES_METIERS } from "./guides-metiers";
import { GUIDES_ELEVEUR } from "./guides-eleveur";
import { GUIDES_BIO_LOWTECH } from "./guides-bio-lowtech";
import { GUIDE_SEUILS, GUIDE_API_PESTICIDES } from "./pedagogie";
import { GUIDES_JARDIN } from "./guides-jardin";
import { GUIDES_MAISON } from "./guides-maison";
import { GUIDES_ANIMAUX } from "./guides-animaux";
import { GUIDES_INTERIEUR } from "./guides-interieur";
import { GUIDES_JARDIN2 } from "./guides-jardin2";
import { GUIDES_BALCON, ALIAS_GUIDES } from "./guides-balcon";
import { GUIDES_AMATEUR } from "./guides-amateur";
import { GUIDES_API_DEBUTANT } from "./guides-api-debutant";
import { GUIDES_INTERIEUR_DEBUTANT } from "./guides-interieur-debutant";

export const GUIDES_COMPLETS: Guide[] = [...GUIDES_JARDIN, ...GUIDES_JARDIN2, ...GUIDES_MAISON, ...GUIDES_INTERIEUR, ...GUIDES_BALCON, ...GUIDES_AGRO, ...GUIDES_BIO, ...GUIDES_ANIMAUX, ...GUIDES_ELEVAGE, ...GUIDES_RECUP, ...GUIDES_MARAICHAGE, ...GUIDES_APICULTURE, ...GUIDES_CONSERVERIE, ...GUIDES_EXPERT, ...GUIDES_HORTICULTURE, ...GUIDES_METIERS, ...GUIDES_ELEVEUR, GUIDE_SEUILS, GUIDE_API_PESTICIDES, ...GUIDES_BIO_LOWTECH, ...GUIDES_AMATEUR, ...GUIDES_API_DEBUTANT, ...GUIDES_INTERIEUR_DEBUTANT].map((g) => (ETAPES_EN_PLUS[g.id] ? { ...g, etapes: [...g.etapes, ...ETAPES_EN_PLUS[g.id]] } : g)).map((g) => (ALIAS_GUIDES[g.id] ? { ...g, alias: [...(g.alias ?? []), ...ALIAS_GUIDES[g.id]] } : g));

const G = new Map(GUIDES_COMPLETS.map((g) => [g.id, g]));
export const guideComplet = (id: string) => G.get(id);
