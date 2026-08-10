# Hygiène & Sécurité Pomembal

Ce dépôt contient le site de sensibilisation **Hygiène & Sécurité Pomembal**. Il reprend fidèlement le site validé : accueil, choix de langue, huit thèmes, progression, bouton « J’ai compris », quiz final et récapitulatif.

Le projet est autonome. Il ne dépend pas de ChatGPT Sites, d’une base de données ni d’un serveur applicatif.

## Technologie utilisée

- React 19 pour l’interface ;
- TypeScript pour sécuriser le code ;
- Vite pour le développement et le build ;
- CSS pour le design et le responsive ;
- `lucide-react` pour les pictogrammes ;
- `localStorage` du navigateur pour mémoriser la langue et la progression.

Le résultat du build est un **site statique**. La plateforme recommandée est **Cloudflare Pages**. Cloudflare Workers, D1 et R2 ne sont pas nécessaires.

## Prérequis

Installez Node.js 22.13.0 ou une version plus récente de Node.js 22. Le fichier `.nvmrc` fixe la version recommandée à 22.13.0.

Vérifiez votre installation :

```bash
node --version
npm --version
```

## Ouvrir le projet

Dans le Terminal, placez-vous dans le dossier :

```bash
cd "/Volumes/Crucial X9/POMEMBAL/pomembal-hygiene-securite-github"
```

Installez exactement les dépendances prévues :

```bash
npm ci
```

Lancez le site en local :

```bash
npm run dev
```

Le Terminal affiche une adresse, généralement `http://localhost:5173`. Ouvrez cette adresse dans votre navigateur. Pour arrêter le serveur, revenez dans le Terminal et appuyez sur `Ctrl+C`.

## Créer et vérifier le build

Commande de production :

```bash
npm run build
```

Le dossier généré est :

```text
dist/
```

Pour tester automatiquement le build et la présence des images :

```bash
npm test
```

Pour prévisualiser le build final :

```bash
npm run preview
```

`dist/` est régénéré à chaque build et n’est pas envoyé sur GitHub.

## Où modifier le site

- `src/App.tsx` : navigation, progression, bouton « J’ai compris », quiz et récapitulatif ;
- `src/styles.css` : design, couleurs, mise en page et responsive ;
- `src/content/fr.ts` : textes français, huit thèmes, questions du quiz et récapitulatif ;
- `src/content/index.ts` : liste des langues et disponibilité ;
- `src/content/pl.ts` : emplacement prévu pour le polonais ;
- `src/content/pt.ts` : emplacement prévu pour le portugais ;
- `src/content/ar.ts` : emplacement prévu pour l’arabe ;
- `src/content/types.ts` : structure commune des contenus ;
- `public/images/` : les cinq images utilisées par le site ;
- `public/fonts/` : la police Geist locale ;
- `public/favicon.svg` : l’icône de l’onglet du navigateur.

Après une modification, exécutez toujours :

```bash
npm test
```

## Langues et arabe RTL

Le français est actuellement la seule langue active, comme dans le site validé. Les entrées PL, PT et AR restent visibles avec la mention « Bientôt disponible ».

La structure prévoit :

- les codes FR, PL, PT et AR ;
- une direction `ltr` pour le français, le polonais et le portugais ;
- une direction `rtl` pour l’arabe.

Les fichiers PL, PT et AR sont volontairement des emplacements à compléter. Leur activation demandera d’ajouter les traductions, puis de relier le contenu choisi dans `src/App.tsx`.

## Fonctionnement de la progression

La progression est enregistrée uniquement dans le navigateur de l’utilisateur :

- clé `pomembal.progress.v2` : thèmes en cours et terminés ;
- clé `pomembal.language` : langue sélectionnée.

Aucun compte et aucune base de données ne sont utilisés. Effacer les données du site dans le navigateur efface donc la progression locale.

## Mettre le projet sur GitHub

Créez d’abord un dépôt vide sur GitHub, sans ajouter automatiquement de README ni de `.gitignore`. Puis, dans le Terminal :

```bash
cd "/Volumes/Crucial X9/POMEMBAL/pomembal-hygiene-securite-github"
git init
git add .
git commit -m "Migration du site Pomembal vers GitHub et Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

Remplacez `VOTRE-COMPTE` et `VOTRE-DEPOT` par les valeurs de votre dépôt GitHub.

Le fichier `.gitignore` empêche l’envoi des dépendances, builds, caches, secrets, journaux et fichiers système macOS. Les images et polices nécessaires restent bien versionnées.

## Connecter GitHub à Cloudflare Pages

Dans le tableau de bord Cloudflare :

1. ouvrez **Workers & Pages** ;
2. choisissez **Create application**, puis **Pages** et **Connect to Git** ;
3. autorisez GitHub et sélectionnez votre dépôt ;
4. utilisez la branche de production `main` ;
5. choisissez le preset **React (Vite)**, ou saisissez manuellement les valeurs ci-dessous ;
6. enregistrez et lancez le déploiement.

Réglages exacts :

| Réglage Cloudflare | Valeur |
|---|---|
| Plateforme | Cloudflare Pages |
| Framework | React (Vite) |
| Branche de production | `main` |
| Dossier racine | racine du dépôt, donc laisser vide |
| Commande d’installation | automatique avec `npm ci` grâce à `package-lock.json` |
| Commande de build | `npm run build` |
| Dossier de sortie | `dist` |
| Version Node.js | `22.13.0`, fournie par `.nvmrc` |
| Variables métier | aucune |

Cloudflare Pages reconstruira et publiera automatiquement le site après chaque envoi sur la branche `main`. Les autres branches peuvent obtenir une adresse de prévisualisation.

Documentation officielle utile :

- [Intégration Git de Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Configuration des builds Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Versions de Node.js dans Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-image/)

## Variables d’environnement

Aucune variable d’environnement n’est nécessaire. Il n’existe donc pas de fichier `.env.example` dans ce dépôt.

## Structure du dépôt

```text
pomembal-hygiene-securite-github/
├── public/
│   ├── fonts/
│   ├── images/
│   ├── _redirects
│   └── favicon.svg
├── src/
│   ├── content/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── tests/
├── .gitignore
├── .nvmrc
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

Le rapport détaillé de la transformation se trouve dans `MIGRATION_CHATGPT_SITES_VERS_GITHUB_CLOUDFLARE.md`.
