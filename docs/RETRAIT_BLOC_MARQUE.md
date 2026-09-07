# Retrait du bloc-marque de l'État

| Emplacement | Retiré |
|---|---|
| `src/app/page.tsx` | Bloc-marque République Française / Ministère du Job et Bonheur, lien API recoloré |
| `src/app/not-found.tsx` | Bloc-marque, titre en Marianne |
| `src/app/error.tsx` | Bloc-marque, titre en Marianne |
| `src/app/loading.tsx` | Spinner recoloré |
| `src/components/Logo.tsx` | Accent `#1B3A6B` et police Marianne remplacés (teal `#0F766E`, police système) |
| `src/app/globals.css` | `@font-face` Marianne/Spectral et variables `--color-institutional-blue`, `--font-marianne`, `--font-spectral` supprimées |
| `src/app/layout.tsx` | Meta description remplacée |
| `public/logo-mark.svg` | `#1B3A6B` remplacé par `#0F766E` |
| `src/app/favicon.ico` | Régénéré depuis le SVG recoloré |
| `src/app/api/[[...route]]/route.ts` | Description OpenAPI remplacée |
| `src/lib/schemas.ts` | Exemple d'entreprise remplacé |
| `prisma/seed.ts` | Employeur « Ministère du job & bonheur » renommé Atlantique Logistique, adresse `.gouv.fr` remplacée, ancienne ligne supprimée en base locale et Neon (35 → 32 offres) |
| `public/fonts/*.woff2` | Fichiers Marianne/Spectral déplacés vers `archive/`, retirés du dossier public |
| `src/components/DemoNotice.tsx` | Mention « Démonstrateur technique, ne constitue pas un service public en exploitation. » ajoutée en pied de page (accueil, 404, 500) |

## Archivé dans `archive/2026-09-07-charte-etat/docs/`

- `CHARTE_CHECKLIST.md`
- `PRESS_KIT.md` + `PRESS_KIT_SCREENSHOTS/`
- `USER_GUIDE.md` + `user_guided_images/`
- `CONSENTEMENT_SCREENSHOTS/`
- `raw-survivor-pool.webm`, `video-benjamin-under-2min.webm`

## Captures après retrait

![Page d'accueil](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_ACCUEIL.png)

![Page de connexion](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_PAGE_CONNEXION.png)

![Liste des offres et pied de page](<SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_EMPLOI&PIED_DE_PAGE.png>)

![Écran de chargement](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_CHARGEMENT.png)

![Page d'erreur](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_PAGE_ERREUR.png)
