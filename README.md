# Racines — potager, plantes et basse-cour

Application (PWA) pour particuliers, en maison ou en appartement : créer son potager de A à Z, savoir quoi faire chaque mois, soigner ses plantes (y compris d'intérieur), reconnaître maladies et parasites, et prendre soin de ses animaux. Fonctionne sur ordinateur, tablette, Android et iPhone, **hors connexion**, avec **lecture à voix haute** de chaque fiche et de chaque tutoriel.

## Ce que contient l'application

| Rubrique | Contenu |
|---|---|
| Aujourd'hui | Programme du jour (lisible à voix haute), météo locale et alertes gel / canicule / pluie / vent / mildiou, lune, tâches personnelles, travaux du mois |
| Calendrier | Semis, plantations, récoltes et tailles par mois, décalés selon 5 zones climatiques ; travaux du mois par espace ; vue annuelle ; export **.ics** vers l'agenda du téléphone (rappels même app fermée) |
| Plantes | 123 fiches dont 45 plantes d'intérieur, avec noms courants, synonymes scientifiques, sosies (« ne pas confondre avec »), 630 photos libres (jusqu'à 4 vues, auteur et licence) et filtres (sans danger pour les animaux, pièce sombre, pardonne les oublis, fleurit). Culture pas à pas, calendrier, voisins, rotation, maladies, graines, conservation, toxicité, ce que les animaux peuvent en manger, vidéos |
| Santé | 83 problèmes (dont soif, chute de feuilles, moisissure du terreau, absence de floraison, œdème) (maladies, ravageurs, carences, troubles), diagnostic guidé hors ligne, 23 remèdes naturels autorisés (loi Labbé), 10 auxiliaires |
| Identifier | Sans clé : identification guidée (allure, feuilles, couleurs) et liens Pl@ntNet / Google Lens. Avec clés : Pl@ntNet (correspondance stricte espèce / genre) et Claude (maladie, ravageur, plan d'action) |
| Mes plantes | Suivi plante par plante (pièce, fenêtre, photos datées), rappels d'arrosage selon la saison et la lumière, engrais, rempotage ; « tour des plantes » hebdomadaire dans l'agenda |
| Recherche | Noms courants, synonymes, symptômes (renvoi au diagnostic), texte des fiches, fautes de frappe, lecture des résultats |
| Tutoriels | 57 tutoriels (dont lumière et lampes LED, potager d'intérieur, repousses de cuisine, billes d'argile, terrarium, pleurotes, choisir une plante, eau d'arrosage, plantes par pièce, vacances) pas à pas, illustrés, avec **mode « mains dans la terre »** : plein écran, lecture automatique de chaque étape, écran maintenu allumé, commandes vocales « suivant / précédent / répète / stop » |
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
