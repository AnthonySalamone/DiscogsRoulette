const DISCOGS_API_BASE = "/api/discogs";

// le chemin+querystring Discogs voulu part en paramètre "path" plutôt qu'en route
// catch-all — cf. le commentaire dans api/discogs.ts pour le pourquoi
const discogsFetch = (path: string, init?: RequestInit): Promise<Response> => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${DISCOGS_API_BASE}?path=${encodeURIComponent(normalizedPath)}`;

  return fetch(url, {
    ...init,
    headers: {
      "User-Agent": "DiscoRoulette/1.0",
      ...init?.headers,
    },
  });
};

// messages des résultats "rate-limited" / "error" (cf. AlbumSearchResult), partagés
// entre la roulette (AlbumFinder) et le chargement par id (App)
const RATE_LIMITED_MESSAGE =
  "Lots of diggers right now 🪩 Discogs only lets us make 60 requests a minute for everyone. Try again in a few seconds.";
const FETCH_ERROR_MESSAGE = "Couldn't reach Discogs. Check your connection and try again.";

export { DISCOGS_API_BASE, discogsFetch, RATE_LIMITED_MESSAGE, FETCH_ERROR_MESSAGE };
