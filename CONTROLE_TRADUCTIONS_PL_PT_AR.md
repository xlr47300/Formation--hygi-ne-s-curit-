# Contrôle des traductions PL / PT / AR

Date du contrôle : 10 août 2026.

## Méthode appliquée

- Source unique : `src/content/fr.ts`, version française maître.
- Traductions réalisées directement depuis le français : FR → PL, FR → PT et FR → AR.
- Aucun service, API ou moteur externe de traduction automatique n’a été utilisé.
- Première passe : traduction contextuelle de chaque règle pour un opérateur en production.
- Deuxième passe : comparaison avec le français pour vérifier l’obligation, l’interdiction, les quantités, les lieux, les températures et les actions de sécurité.
- Glossaire commun appliqué : `GLOSSAIRE_TRADUCTIONS.md`.

## Volume traduit

- PL : environ 270 unités textuelles, dont les 8 thèmes, 8 questions, réponses, corrections, récapitulatif et interface.
- PT : environ 270 unités textuelles en portugais européen.
- AR : environ 270 unités textuelles en arabe standard moderne.
- Total : environ 810 unités textuelles nouvelles.

Le comptage inclut les titres, descriptions, consignes, boutons, états, textes d’accessibilité et modèles de progression. Les identifiants techniques, chemins d’images et couleurs ne sont pas comptés.

## Architecture utilisée

- `src/content/fr.ts` : français maître, inchangé octet par octet.
- `src/content/pl.ts` : copie d’interface et contenu métier polonais.
- `src/content/pt.ts` : copie d’interface et contenu métier portugais européen.
- `src/content/ar.ts` : copie d’interface et contenu métier arabe standard moderne, direction RTL.
- `src/content/ui.ts` : textes complémentaires auparavant présents dans le composant, déclinés dans les quatre langues.
- `src/content/index.ts` : registre unique des langues, contenus et copies d’interface.
- `src/App.tsx` : composants communs ; aucun composant métier n’est dupliqué par langue.

La langue est mémorisée sous la clé `pomembal.language`. La progression utilise toujours la clé unique `pomembal.progress.v2`, indépendamment de la langue.

## Contrôle structurel automatique

Le test `tests/translations.test.mjs` vérifie pour PL, PT et AR :

- 8 thèmes dans le même ordre que le français ;
- mêmes identifiants, numéros, couleurs et disponibilités ;
- même nombre de sections par thème ;
- 8 questions dans le même ordre ;
- même nombre de réponses ;
- mêmes indices de bonnes réponses : `1, 1, 0, 1, 0, 1, 1, 2` ;
- 8 réflexes dans le récapitulatif ;
- aucune chaîne vide ;
- direction `rtl` uniquement pour AR ;
- structure complète des libellés d’interface ;
- empreinte SHA-256 inchangée du français maître : `da7fe2d227597c6e2cd5f35f32118158618fcce1d9c377264ab8255d824ffd45`.

## Contrôle métier de seconde passe

Les trois langues ont été comparées directement au français sur les points suivants :

- tenue complète, fermée et adaptée ;
- cheveux entièrement couverts ;
- seule l’alliance simple est tolérée ;
- téléphone, montres et bracelets interdits ;
- retrait et lavage du vêtement de travail à 60°C minimum ;
- tous les moments obligatoires de lavage des mains ;
- interdiction des gants personnels et absence de désinfection systématique ;
- pansement bleu détectable et signalement des symptômes ;
- médicaments uniquement en salle de pause ;
- interdiction de manger, boire, mâcher un chewing-gum ou introduire des aliments ;
- Pomembal conditionne des pommes et aucun allergène n’est manipulé dans le procédé ;
- matériel numéroté et inventorié, perte/casse, verre, plastique dur et fruit au sol ;
- correspondance exacte des 7 couleurs de nettoyage ;
- interdiction absolue de mélanger les produits chimiques ;
- nuisibles : ne pas toucher et signaler ;
- circulation piétons/engins, arrêt d’urgence, maintenance et interdiction d’intervenir dans la machine ;
- évacuation immédiate, interdiction de revenir en arrière et point de rassemblement au parking visiteurs.

Aucune règle métier n’a été ajoutée ou supprimée. Les formulations ont été rendues naturelles sans réduire le niveau d’obligation ou d’interdiction.

## Termes à faire confirmer par un locuteur natif ou Pomembal

| Texte français | Traductions proposées | Raison du doute |
|---|---|---|
| Chef de file | PL `liderka zespołu` · PT `chefe de equipa` · AR `قائدة الفريق` | Intitulé interne Pomembal non défini dans le projet. La fonction a été traduite, pas un titre officiel. |
| Suppléante SST | PL `zastępczyni SST` · PT `substituta SST` · AR `بديلتها في السلامة والإسعافات الأولية المهنية (SST)` | L’acronyme français peut désigner une qualification interne précise. Le titre officiel local doit être confirmé. |
| Station | PL `hala sortowni` · PT `central de acondicionamento` · AR `محطة التعبئة` | Les traductions correspondent à une station de conditionnement de pommes ; le vocabulaire réellement employé par chaque équipe peut différer. |
| Fiche de zone | PL `karta strefy` · PT `ficha da zona` · AR `بطاقة المنطقة` | Le document interne peut porter un nom officiel différent sur les sites traduits. |
| Pansement bleu détectable | PL `wykrywalny niebieski plaster` · PT `penso rápido azul detetável` · AR `ضماد لاصق أزرق قابل للكشف` | Le sens de sécurité est complet, mais la terminologie fournisseur ou qualité locale peut être plus spécifique. |

Ces termes ne sont pas laissés en français dans l’interface. Seuls **POMEMBAL** et l’acronyme métier **SST** restent volontairement inchangés.

## Contrôles fonctionnels et visuels effectués

- FR : accueil, sélecteur, quiz et récapitulatif contrôlés ; rendu français inchangé.
- PL : grille des 8 thèmes, thème détaillé, bouton `Rozumiem`, passage au thème suivant et mobile contrôlés.
- PT : thème détaillé, progression venant du PL, quiz, correction immédiate et mobile contrôlés.
- AR : accueil, sélecteur, grille des 8 thèmes, thème détaillé, boutons, quiz, correction, récapitulatif, mobile et écran large contrôlés en RTL.
- Changement PL → PT pendant un thème : thème affiché et progression conservés.
- Changement AR → FR pendant le quiz : question 2 et score conservés.
- Rechargement : langue et progression conservées par `localStorage`.
- Photos : jamais retournées en RTL.
- Flèches directionnelles : inversées de manière cohérente en RTL.
- Console navigateur : 0 erreur, 0 avertissement.
- Viewport mobile principal : 390 × 844 px.
- Viewport large de contrôle : 1280 × 900 px.
- Build Vite et contrôle TypeScript : réussis.

## Fichiers créés

- `src/content/ui.ts`
- `tests/translations.test.mjs`
- `GLOSSAIRE_TRADUCTIONS.md`
- `CONTROLE_TRADUCTIONS_PL_PT_AR.md`

## Fichiers modifiés

- `src/content/pl.ts`
- `src/content/pt.ts`
- `src/content/ar.ts`
- `src/content/index.ts`
- `src/App.tsx`
- `src/styles.css`
- `package.json`
- `README.md`
- `MIGRATION_CHATGPT_SITES_VERS_GITHUB_CLOUDFLARE.md`

## Points restant à vérifier

Une relecture par au moins un locuteur natif de chaque langue est recommandée avant validation métier définitive. Elle doit porter en priorité sur les cinq termes sensibles ci-dessus. Aucun doute identifié ne concerne la logique de sécurité, l’ordre du parcours ou les réponses correctes du quiz.
