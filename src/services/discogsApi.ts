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

export { DISCOGS_API_BASE, discogsFetch };
