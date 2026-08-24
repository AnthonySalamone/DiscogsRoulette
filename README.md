# Discogs Roulette 🪩

Tire un album au hasard sur Discogs (filtrable par année/genre/style) et écoute-le tout de
suite via YouTube ou Apple Music, avec un lien de recherche rapide vers Spotify/SoundCloud.
React + TypeScript + Vite, déployée en statique sur Vercel avec une fonction Edge en proxy
vers l'API Discogs.

## Développement local

```bash
npm install
cp .env.local.example .env.local   # colle ton DISCOGS_TOKEN dedans
npm run dev
```

- `npm run lint` — ESLint
- `npm run build` — vérif TypeScript (`tsc -b`) + build Vite

### Variables d'environnement

| Variable | Où | Pourquoi |
|---|---|---|
| `DISCOGS_TOKEN` | `.env.local` en local, Environment Variables sur Vercel en prod | Personal Access Token Discogs (gratuit, [discogs.com/settings/developers](https://www.discogs.com/settings/developers) → *Generate new token*). Fait passer le quota API de 25 à 60 requêtes/minute. L'app marche sans (juste avec le quota réduit). |

## Architecture

- **Genres/styles** (`src/data/genreStyleMap.ts`) : table statique (15 genres, 757 styles),
  vérifiée contre la taxonomie Discogs live. Zéro appel API pour peupler les selects —
  l'ancienne approche (échantillonner 2000 releases via 20 requêtes à chaque chargement de
  page) cramait le quota avant même le premier spin.
- **Proxy Discogs** (`api/discogs/[...path].ts`) : fonction Edge Vercel. En dev, le proxy
  équivalent est géré par `vite.config.ts` (`server.proxy`) — les deux existent parce que le
  proxy dev-only de Vite ne tourne pas une fois buildé en statique.
- **Spotify / SoundCloud** : pas de preview intégrée — les deux ont fermé/verrouillé leur API
  gratuite (Spotify exige un compte Premium depuis février 2026, SoundCloud un abonnement
  payant Artist Pro). Juste un lien de recherche externe.

## Déployer

1. [vercel.com](https://vercel.com) → connexion avec GitHub → *Add New* → *Project* → choisir
   ce repo. Vite est détecté automatiquement, rien à configurer.
2. Ajouter `DISCOGS_TOKEN` dans Project Settings → Environment Variables (sinon l'app tourne
   quand même, juste avec un quota API réduit).
3. Deploy.
