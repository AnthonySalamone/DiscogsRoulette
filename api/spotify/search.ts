// Cherche un album sur Spotify (titre + artiste) et renvoie son URL d'embed officielle
// (preview audio + bouton "se connecter à Spotify" intégrés au widget, rien à recoder).
//
// Nécessite SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET en variable d'env (Client Credentials
// flow : auth app-à-app, pas de login utilisateur requis). Le secret ne quitte jamais cette
// fonction — le navigateur ne voit que l'URL d'embed finale.
// Ne fonctionne qu'une fois déployé sur Vercel (ou via `vercel dev`) : contrairement au proxy
// Discogs, il n'y a pas d'équivalent vite dev pour cette logique métier.
export const config = { runtime: "edge" };

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;

  const data: { access_token: string; expires_in: number } = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? "";
  const artist = url.searchParams.get("artist") ?? "";

  if (!title && !artist) {
    return Response.json({ embedUrl: null });
  }

  const token = await getAccessToken();
  if (!token) {
    // pas de credentials configurées : dégrade proprement plutôt que planter
    return Response.json({ embedUrl: null });
  }

  const q = encodeURIComponent(`album:${title} artist:${artist}`.trim());
  const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=album&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!searchRes.ok) {
    return Response.json({ embedUrl: null });
  }

  const data: { albums?: { items?: { id: string }[] } } = await searchRes.json();
  const albumId = data.albums?.items?.[0]?.id;
  const embedUrl = albumId ? `https://open.spotify.com/embed/album/${albumId}` : null;

  return Response.json({ embedUrl });
}
