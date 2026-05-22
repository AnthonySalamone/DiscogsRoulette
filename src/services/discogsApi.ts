const DISCOGS_API_BASE = "/api/discogs";

const discogsFetch = (path: string, init?: RequestInit): Promise<Response> => {
  const url = `${DISCOGS_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...init,
    headers: {
      "User-Agent": "DiscoRoulette/1.0",
      ...init?.headers,
    },
  });
};

export { DISCOGS_API_BASE, discogsFetch };
