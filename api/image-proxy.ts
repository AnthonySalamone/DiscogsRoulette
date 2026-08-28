/// <reference types="node" />
// Proxy d'image Discogs (Vercel Edge Function) — même contrat query-param que
// api/discogs.ts (cf. le commentaire là-bas pour le pourquoi du query-param plutôt
// qu'une route catch-all).
//
// Sert uniquement à contourner le CORS : les images Discogs (i.discogs.com) ne
// renvoient pas d'en-tête Access-Control-Allow-Origin, donc un <canvas> qui dessine
// l'image directement depuis ce domaine est "tainted" et getImageData() lève une
// SecurityError — impossible d'en extraire la couleur dominante côté client. En
// repassant par notre propre origine, le navigateur ne voit plus de requête
// cross-origin. Restreint aux hosts *.discogs.com pour éviter d'exposer un proxy
// ouvert (SSRF).
export const config = { runtime: "edge" };

const isAllowedHost = (hostname: string): boolean =>
  hostname === "discogs.com" || hostname.endsWith(".discogs.com");

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return Response.json({ error: "missing url param" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return Response.json({ error: "invalid url param" }, { status: 400 });
  }

  if (targetUrl.protocol !== "https:" || !isAllowedHost(targetUrl.hostname)) {
    return Response.json({ error: "host not allowed" }, { status: 400 });
  }

  const imageRes = await fetch(targetUrl, {
    headers: { "User-Agent": "DiscoRoulette/1.0" },
  });

  return new Response(imageRes.body, {
    status: imageRes.status,
    headers: {
      "Content-Type": imageRes.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
