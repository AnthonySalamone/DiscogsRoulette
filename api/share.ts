/// <reference types="node" />
// Lien de partage d'un album (Vercel Edge Function) : /api/share?release=123456
//
// L'app est une page statique : les robots d'aperçu (Discord, WhatsApp, iMessage,
// Slack…) n'exécutent pas le JS et ne verraient que les balises Open Graph génériques
// d'index.html. Cette fonction renvoie une mini page avec les balises de CET album
// (pochette, artiste, titre), puis redirige les humains vers /?release=123456.
//
// Même contrat query-param que api/discogs.ts (pas de route catch-all, cf. là-bas).
export const config = { runtime: "edge" };

type Release = {
  title?: string;
  year?: number;
  artists?: { name: string }[];
  genres?: string[];
  styles?: string[];
  images?: { uri?: string }[];
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fetchRelease = async (id: string): Promise<Release | null> => {
  const headers: Record<string, string> = { "User-Agent": "DiscoRoulette/1.0" };
  const token = process.env.DISCOGS_TOKEN;
  if (token) headers["Authorization"] = `Discogs token=${token}`;

  try {
    const res = await fetch(`https://api.discogs.com/releases/${id}`, { headers });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const release = url.searchParams.get("release") ?? "";
  const origin = url.origin;

  if (!/^\d+$/.test(release)) {
    return Response.redirect(`${origin}/`, 302);
  }

  const appUrl = `${origin}/?release=${release}`;
  const data = await fetchRelease(release);

  // "Mike McCoy (4)" → "Mike McCoy", cf. src/utils/searchQuery.ts
  const artist = (data?.artists?.[0]?.name ?? "").replace(/\s*\(\d+\)\s*$/, "").replace(/\*+$/, "");
  const title = data?.title
    ? [artist, data.title].filter(Boolean).join(" – ") + (data.year ? ` (${data.year})` : "")
    : "Discogs Roulette 🪩";
  const description = data
    ? [[...(data.genres ?? []), ...(data.styles ?? [])].join(", "), "Spin it on Discogs Roulette 🪩"]
        .filter(Boolean)
        .join(" — ")
    : "Spin a random record from Discogs and listen to it right away.";
  // l'image passe par notre proxy : les robots d'aperçu n'ont pas de souci de CORS,
  // mais i.discogs.com peut refuser les requêtes sans User-Agent "navigateur"
  const cover = data?.images?.[0]?.uri;
  const image = cover
    ? `${origin}/api/image-proxy?url=${encodeURIComponent(cover)}`
    : `${origin}/og-image.png`;
  // og:url = ce lien-ci : Facebook re-scrape l'og:url, qui doit donc garder ces balises
  const shareUrl = `${origin}/api/share?release=${release}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="music.album" />
<meta property="og:site_name" content="Discogs Roulette" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:url" content="${escapeHtml(shareUrl)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<meta http-equiv="refresh" content="0; url=${escapeHtml(appUrl)}" />
<script>location.replace(${JSON.stringify(appUrl)});</script>
</head>
<body><a href="${escapeHtml(appUrl)}">${escapeHtml(title)}</a></body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // les infos d'une release changent rarement : cache CDN d'un jour
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
