# Charte d'illustration de Racines

Cette charte fixe les règles pour que les photos, les icônes, les schémas et les pictogrammes de l'application restent cohérents. Elle s'applique à tout nouveau visuel.

## 1. Ordre de priorité des visuels

Quand une fiche ou un tutoriel a besoin d'une image, on prend la première solution qui existe :

1. **Image locale** (`public/img/<id>.webp`) : créations originales, 1200 px de large au plus, format WebP, qualité 80.
2. **Photo libre de Wikimedia Commons** (récupérée par `npm run wiki`). L'auteur et la licence s'affichent sous l'image. Pour un tutoriel ou un problème sans article Wikipédia, ajouter une requête dans `PHOTOS_TECHNIQUES` (scripts/fetch-wiki.ts). Les requêtes sont en anglais et décrivent un geste ou une scène, pas un concept.
3. **Illustration de la rubrique** (`BandeauRubrique`, dans components/ui.tsx) : un paysage aux couleurs du thème et l'icône dessinée de la rubrique. Elle remplace un emoji isolé.

## 2. Icônes dessinées

- Elles sont dans `public/ico/<nom>.webp` et la liste se trouve dans `src/data/local-icones.json`.
- Format : 256 × 256 px, fond transparent, style aquarelle douce, contour léger, une seule idée par icône.
- On les utilise avec `<Ico nom="…" emoji="…" />`. L'emoji sert de secours si l'image manque.
- Les emojis restent permis dans le texte et les puces. N'utiliser que ceux d'Emoji 11 ou plus anciens, car Windows 10 n'affiche pas les suivants.

## 3. Schémas pédagogiques (components/Schemas.tsx)

- Ils sont en SVG pur, sans image : nets à toute taille et légers.
- Leurs couleurs viennent uniquement des jetons du thème. Pas de couleur codée en dur, pour qu'ils restent lisibles en mode sombre :

  | Jeton | Usage |
  | --- | --- |
  | `--green`, `--green-soft` | le vivant (plantes, racines, flux utiles) |
  | `--terra`, `--terra-soft` | le sol, le bois, la matière organique |
  | `--info`, `--info-soft` | l'eau, l'air |
  | `--sun`, `--sun-soft` | l'énergie, les fleurs, le miel |
  | `--danger` | une menace ou une perte (lessivage, varroa) |

- Traits de 2 px, coins arrondis (rayon 6 à 12), flèches pleines pour les flux.
- Légendes courtes, en minuscules, en 12 px ; les détails en 10 px avec `--muted`.
- Chaque schéma a un `aria-label` qui le décrit entièrement (lecture d'écran) et une légende `figcaption` qui dit ce qu'il faut en retenir.
- Pour qu'un schéma apparaisse dans un tutoriel ou une leçon, l'ajouter à `SCHEMAS` (guides) ou à `SCHEMAS_LECON` (pages/Cours.tsx).

## 4. Pictogrammes des signes (components/PictoSigne.tsx)

- Chaque pictogramme associe une forme de base (feuille, fruit, pot, plante, racine, tronc) à un motif qui montre le symptôme.
- Taille 48 × 48, lisibles à partir de 28 px, sur un fond `--surface-2`.
- Un nouveau signe dans `SIGNES` (data/problemes.ts) doit recevoir son pictogramme dans `PICTOS`.

## 5. États vides

- Un écran sans données affiche une petite scène illustrée (`Empty` ou `Scene` dans ui.tsx) et une phrase qui dit quoi faire ensuite.
- Pas de « Aucune donnée » sec : on explique ce que la rubrique apportera une fois remplie.

## 6. Graphiques et plan

- Les séries de courbes utilisent `--serie-1` à `--serie-7`.
- Le plan du jardin utilise `--plan-fond`, `--plan-grille`, `--plan-texte` et `--plan-trait`. Toutes ces couleurs sont redéfinies en mode sombre.
- L'export PNG du plan force les couleurs claires, quel que soit le thème de l'écran.

## 7. Ce qu'on ne fait pas

- Pas de texte incrusté dans une image générée : les textes restent dans le HTML ou dans le SVG, pour être lus à voix haute et traduits.
- Pas de photo sans licence libre ni sans crédit.
- Pas de visuel qui montre un traitement non autorisé, ou un geste dangereux sans protection.
