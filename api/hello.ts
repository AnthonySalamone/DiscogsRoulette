// fonction de diagnostic temporaire — à supprimer une fois le vrai proxy Discogs confirmé fonctionnel
export const config = { runtime: "edge" };

export default function handler() {
  return new Response("hello from vercel");
}
