# Racines — potager, plantes et basse-cour

Application (PWA) pour particuliers, en maison ou en appartement : créer son potager de A à Z, savoir quoi faire chaque mois, soigner ses plantes (y compris d'intérieur), reconnaître maladies et parasites, et prendre soin de ses animaux. Fonctionne sur ordinateur, tablette, Android et iPhone, **hors connexion**, avec **lecture à voix haute** de chaque fiche et de chaque tutoriel.

## Ce que contient l'application

| Rubrique | Contenu |
|---|---|
| Aujourd'hui | Programme du jour (lisible à voix haute), météo locale et alertes gel / canicule / pluie / vent / mildiou, lune, tâches personnelles, travaux du mois |
| Calendrier | Semis, plantations, récoltes et tailles par mois, décalés selon 5 zones climatiques ; travaux du mois par espace ; vue annuelle ; export **.ics** vers l'agenda du téléphone (rappels même app fermée) |
| Plantes | 97 fiches : 37 légumes, 16 aromatiques, 11 fleurs utiles et engrais verts, 14 arbres et petits fruits, 19 plantes d'intérieur. Culture pas à pas, calendrier, voisins, rotation, maladies, graines, conservation, toxicité, ce que les animaux peuvent en manger, vidéos |
| Santé | 76 problèmes (maladies, ravageurs, carences, troubles), diagnostic guidé hors ligne, 23 remèdes naturels autorisés (loi Labbé), 10 auxiliaires |
| Identifier | Photo → Pl@ntNet (plante, arbre, fruit ; clé gratuite) et Claude (maladie, ravageur, plan d'action ; clé personnelle) |
| Tutoriels | 47 tutoriels pas à pas, illustrés, avec **mode « mains dans la terre »** : plein écran, lecture automatique de chaque étape, écran maintenu allumé, commandes vocales « suivant / précédent / répète / stop » |
| Animaux | 11 fiches (poules, canards, oies, pintades, cailles, lapins, chèvres, moutons, ânes, abeilles, cochons) : quotidien, saisons, logement, alimentation et interdits, santé, fumier, services au jardin, réglementation française |
| Préparer la viande | Abattage et préparation de la volaille (dont le retrait du fiel), du lapin, valorisation de toute la carcasse, conservation (accès volontaire, avertissement) |
| Mon jardin | Cultures avec dates de récolte estimées, plan des planches et vérification de rotation, récoltes pesées, journal photo, grainothèque (péremption), troupeau (soins, rappels, ponte) |
| Créer mon potager | Assistant en 5 questions → plantes adaptées, méthode, planning de la première année, création des planches |
| Associations | Bons et mauvais voisinages d'une sélection, suggestions |

Les vidéos sont proposées sous forme de **recherches YouTube et TikTok à jour** (elles ne cassent jamais) ; chaque fiche permet d'enregistrer « sa » vidéo préférée, qui s'affiche ensuite directement.

## Développement

```bash
npm install
npm run dev        # http://localhost:5198
npm run build      # contrôle du contenu + tests + typage + compilation
npm run preview    # version compilée, http://localhost:5199
```

- `src/data/` : tout le savoir de l'application (plantes, problèmes, remèdes, animaux, tutoriels, calendrier). Ajouter une fiche = ajouter une entrée ; `npm run check` vérifie toutes les références croisées.
- `npm run wiki` : récupère les photos libres Wikimédia des nouvelles fiches (`src/data/wiki.json`).
- `scripts/gen-illustrations.py` : illustrations des tutoriels avec ComfyUI local (Animagine XL), à lancer avec le Python de ComfyUI ; aucune image ne contient de texte.
- `tests/logic.test.ts` : décalage climatique, diagnostic, rotation, associations, lune, export agenda, recommandations.

## Publier (GitHub Pages)

Créer un dépôt GitHub, l'ajouter comme `origin`, puis `npm run deploy` (compile et pousse `dist/` sur la branche `gh-pages`). Le site s'installe ensuite comme une application depuis le navigateur du téléphone.

## Limites connues

- Contenus rédigés pour la France métropolitaine ; l'outre-mer et les climats tropicaux ne sont pas couverts par le calendrier.
- L'identification par photo dépend de clés personnelles (Pl@ntNet gratuite, Claude payante à l'usage) ; elle n'a pas été testée avec de vraies clés. Le diagnostic guidé fonctionne sans clé ni connexion.
- Les rappels « push » nécessiteraient un serveur : ils passent par l'export vers l'agenda du téléphone.
- Les fiches animaux ne remplacent pas un vétérinaire ; la réglementation évolue (à vérifier en mairie, à l'EDE ou à la DDPP).
