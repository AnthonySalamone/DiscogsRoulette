/// <reference types="node" />
// Proxy Discogs pour la prod (Vercel Edge Function).
//
// En dev, vite.config.ts fait déjà ce travail via server.proxy — ce fichier ne sert
// qu'une fois le projet build+déployé en statique, où ce proxy dev n'existe plus.
// Il évite aussi le CORS (api.discogs.com le bloque, cf. commit "add proxy to fix
// CORS error") et permet d'attacher un token Discogs côté serveur, jamais exposé au
// navigateur : ajouter une variable d'env DISCOGS_TOKEN sur Vercel fait passer le
// quota de 25 à 60 requêtes/minute. Sans elle, ça marche quand même (non authentifié).
export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const discogsPath = url.pathname.replace(/^\/api\/discogs/, "");
  const discogsUrl = `https://api.discogs.com${discogsPath}${url.search}`;

  const headers: Record<string, string> = {
    "User-Agent": "DiscoRoulette/1.0",
  };
  const token = process.env.DISCOGS_TOKEN;
  if (token) headers["Authorization"] = `Discogs token=${token}`;

  const discogsRes = await fetch(discogsUrl, { headers });

  return new Response(discogsRes.body, {
    status: discogsRes.status,
    headers: {
      "Content-Type": discogsRes.headers.get("content-type") || "application/json",
    },
  });
}
