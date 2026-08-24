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

  return new Response(discogsRes.body, {
    status: discogsRes.status,
    headers: {
      "Content-Type": discogsRes.headers.get("content-type") || "application/json",
    },
  });
}
