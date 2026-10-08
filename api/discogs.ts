/// <reference types="node" />
// Proxy Discogs pour la prod (Vercel Edge Function).
//
// En dev, vite.config.ts fait déjà ce travail via server.proxy — ce fichier ne sert
// qu'une fois le projet build+déployé en statique, où ce proxy dev n'existe plus. Il
// évite aussi le CORS (api.discogs.com le bloque) et permet d'attacher un token Discogs
// côté serveur, jamais exposé au navigateur.
//
// Le chemin cible arrive en paramètre de requête (?path=/database/search?type=...)
// plutôt qu'en route catch-all ([...path].ts) : cette dernière syntaxe, pourtant standard
// chez Vercel, ne se déployait pas sur ce projet (bracket routes silencieusement 404,
// confirmé en isolant le problème avec des fonctions de diagnostic) — ce contournement
// évite complètement le souci.
export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetPath = url.searchParams.get("path");

  if (!targetPath || !targetPath.startsWith("/")) {
    return Response.json({ error: "missing or invalid path param" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    "User-Agent": "DiscoRoulette/1.0",
  };
  const token = process.env.DISCOGS_TOKEN;
  if (token) headers["Authorization"] = `Discogs token=${token}`;

  const discogsRes = await fetch(`https://api.discogs.com${targetPath}`, { headers });

  // relaie aussi les en-têtes de rate-limit Discogs (x-discogs-ratelimit*) — pratique
  // pour vérifier que DISCOGS_TOKEN est bien pris en compte (60/min vs 25/min)
  const resHeaders = new Headers({
    "Content-Type": discogsRes.headers.get("content-type") || "application/json",
  });
  for (const [key, value] of discogsRes.headers.entries()) {
    if (key.toLowerCase().startsWith("x-discogs-ratelimit")) resHeaders.set(key, value);
  }

  // Cache CDN Vercel : le quota Discogs (60 req/min) est commun à TOUS les visiteurs
  // (même token, mêmes IP sortantes), donc chaque réponse servie depuis le cache est
  // une requête de gagnée. Une release ne change quasi jamais (un album partagé dans
  // un groupe ne coûte qu'un appel) ; une page de recherche peut bouger un peu plus.
  // Jamais les erreurs : un 429 mis en cache bloquerait tout le monde.
  if (discogsRes.ok) {
    const cacheControl = targetPath.startsWith("/releases/")
      ? "public, s-maxage=86400, stale-while-revalidate=604800"
      : targetPath.startsWith("/database/search")
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : null;
    if (cacheControl) resHeaders.set("Cache-Control", cacheControl);
  }

  return new Response(discogsRes.body, {
    status: discogsRes.status,
    headers: resHeaders,
  });
}
