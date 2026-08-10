# Migration de ChatGPT Sites vers GitHub et Cloudflare

Date de validation : 10 août 2026.

## Résultat

Le site a été transformé en application React/Vite autonome et statique. Le design, les contenus métier, les images, le responsive, les huit thèmes, le choix de langue, la progression, le bouton « J’ai compris », le passage au thème suivant, le quiz, le récapitulatif et le stockage local ont été conservés.

La cible retenue est **Cloudflare Pages**. Aucun Worker applicatif, aucune base D1, aucun stockage R2 et aucune variable d’environnement ne sont nécessaires.

## Architecture trouvée dans l’export original

L’export utilisait :

- React 19 et TypeScript ;
- une structure Next.js 16 App Router avec une seule page `app/page.tsx` ;
- Vinext et Vite pour compiler la structure Next.js en artefact Cloudflare Worker ;
- un Worker servant l’application Vinext et une route optionnelle d’optimisation d’images ;
- le plugin Vite de ChatGPT Sites et `.openai/hosting.json` pour emballer un artefact propre à Sites ;
- Drizzle et une structure D1 facultative, sans table et sans utilisation par l’interface ;
- Tailwind dans la chaîne CSS, mais aucun composant ne dépendait de classes utilitaires Tailwind ;
- `lucide-react` pour les icônes ;
- cinq images PNG locales ;
- la police Geist mise en cache localement par Vinext.

Le routage réel ne comportait qu’une route `/`. Les différents écrans sont des états React internes : accueil, langues, thèmes, détail d’un thème, quiz et récapitulatif.

L’audit du code n’a trouvé :

- aucun appel `fetch` métier ;
- aucune API utilisée par le parcours ;
- aucun import de la base dans l’interface ;
- aucune authentification utilisée ;
- aucun besoin de rendu serveur ;
- aucune image distante ;
- aucun secret ni jeton nécessaire.

## Fonctionnement conservé

- Les huit thèmes restent définis dans `src/content/fr.ts`.
- Les quatre langues FR, PL, PT et AR sont désormais actives ; l’arabe utilise la direction RTL.
- Le type de langue conserve les directions `ltr` et `rtl`.
- La progression utilise `pomembal.progress.v2` dans `localStorage`.
- La langue utilise `pomembal.language` dans `localStorage`.
- Le bouton « J’ai compris » enregistre immédiatement le thème, confirme l’action puis ouvre le thème suivant après 900 ms.
- Le thème 8 mène au quiz.
- Le quiz contient huit questions avec correction immédiate.
- Le récapitulatif affiche les huit réflexes essentiels.

## Fichiers conservés et adaptés

| Origine | Destination | Raison |
|---|---|---|
| `app/page.tsx` | `src/App.tsx` | Toute l’interface et la logique métier |
| `app/globals.css` | `src/styles.css` | Design et responsive validés |
| `app/content/*.ts` | `src/content/*.ts` | Contenus, langues et types |
| `public/images/*.png` | `public/images/*.png` | Les cinq images réellement utilisées |
| `public/favicon.svg` | `public/favicon.svg` | Favicon du site |
| cache local Geist | `public/fonts/*.woff2` | Police locale sans téléchargement externe |

Adaptations limitées :

- suppression de la directive Next.js `"use client"`, inutile dans une application Vite entièrement cliente ;
- remplacement de `next/font` par deux fichiers Geist locaux couvrant le latin et le latin étendu ;
- création d’un point d’entrée Vite standard (`index.html` et `src/main.tsx`) ;
- création d’une configuration Vite statique ;
- ajout d’un fallback Cloudflare Pages dans `public/_redirects` ;
- création d’un test de build et de présence des assets.

## Éléments volontairement non repris

| Élément original | Motif de non-reprise |
|---|---|
| `.openai/hosting.json` | Identifiant propriétaire ChatGPT Sites, D1/R2 désactivés |
| `app/chatgpt-auth.ts` | Authentification ChatGPT facultative et jamais utilisée |
| `app/layout.tsx` | Remplacé par le document HTML Vite standard |
| `next.config.ts` | Aucun runtime Next.js dans la version statique |
| `worker/` | Le site ne nécessite ni rendu serveur ni Worker |
| `build/` | Plugin d’emballage réservé à ChatGPT Sites |
| `db/` | Aucun accès aux données et schéma vide |
| `drizzle/` et `drizzle.config.ts` | Aucune migration ni base nécessaire |
| `examples/` | Démonstration D1 non reliée au site |
| `scripts/` | Scripts Linux de build/validation propres à Sites |
| anciens `tests/` | Test de l’artefact Worker Vinext, devenu sans objet |
| `postcss.config.mjs` | La feuille finale ne nécessite plus PostCSS |
| `eslint.config.mjs` | Configuration Next.js non applicable |
| SVG génériques `file`, `globe`, `window` | Jamais référencés par le site |
| `.vinext/` | Cache généré ; seuls les fichiers de police utiles ont été repris |
| fichiers `._*` | Métadonnées AppleDouble macOS inutiles |
| `node_modules/`, `dist/`, caches et logs | Régénérés et exclus par `.gitignore` |

## Dépendances supprimées

- `next` ;
- `vinext` ;
- `@cloudflare/vite-plugin` ;
- `@vitejs/plugin-rsc` ;
- `react-server-dom-webpack` ;
- `wrangler` ;
- `drizzle-orm` ;
- `drizzle-kit` ;
- `tailwindcss` et `@tailwindcss/postcss` ;
- `eslint` et `eslint-config-next` ;
- les types Node, devenus inutiles pour le code source.

Dépendances conservées : React, React DOM, Lucide React, Vite, le plugin React Vite, TypeScript et les types React.

## Dépendances à ChatGPT Sites

Toutes les dépendances d’exécution et de build propres à ChatGPT Sites ont été supprimées. Une recherche dans le projet final ne doit trouver ni `chatgpt.site`, ni API interne Sites, ni en-tête `oai-*`, ni runtime Vinext.

## Solution Cloudflare retenue

**Cloudflare Pages avec intégration GitHub.**

Justification : le site produit uniquement des fichiers HTML, CSS, JavaScript, images et polices. Toute la navigation se déroule dans React et la progression reste dans le navigateur. Un Worker ajouterait un serveur inutile.

Configuration exacte :

- installation : `npm ci` ;
- développement : `npm run dev` ;
- build : `npm run build` ;
- sortie : `dist` ;
- Node.js : 22.13.0, fixé par `.nvmrc` ;
- variables d’environnement : aucune ;
- base de données : aucune ;
- Worker : aucun.

## Tests réalisés

- installation verrouillée avec `npm ci` : réussie ;
- contrôle TypeScript : réussi ;
- build Vite de production : réussi ;
- test automatique du HTML et des images/polices du build : réussi ;
- ouverture de l’accueil dans Chromium : réussie ;
- choix de langue FR et présence des entrées PL/PT/AR : vérifiés ;
- ouverture et contenu des huit thèmes : vérifiés ;
- bouton « J’ai compris » et passage automatique : vérifiés sur les huit thèmes ;
- retour aux thèmes et progression 8/8 : vérifiés ;
- persistance de la langue et de la progression après rechargement : vérifiée ;
- huit questions, correction immédiate et navigation du quiz : vérifiées ;
- récapitulatif final : vérifié ;
- viewport mobile 375 × 812 : vérifié visuellement ;
- console navigateur : zéro erreur et zéro avertissement ;
- présence des cinq images et des deux fontes utiles dans `dist` : vérifiée.

## Limitations restantes

- Les traductions polonaise, portugaise européenne et arabe standard moderne ont été ajoutées après la migration initiale. Elles doivent faire l’objet d’une relecture native avant validation métier définitive, notamment pour les intitulés internes Pomembal.
- La progression est volontairement locale au navigateur ; elle ne suit pas un utilisateur entre plusieurs appareils.
- Le déploiement Cloudflare lui-même n’a pas été déclenché : le dépôt est préparé pour être connecté au compte GitHub et au compte Cloudflare du propriétaire.

Ces limites correspondent au fonctionnement du site original et ne constituent pas une régression de la migration.
