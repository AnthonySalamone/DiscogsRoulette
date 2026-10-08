import type { Favorite } from "../types/favorite";

// Une liste partagée voyage entière dans l'URL (?list=…) plutôt qu'en ids seuls :
// l'ouvrir ne coûte aucun appel Discogs (sinon 1 requête par album, et le quota de
// 60/min saute dès 30 albums). Les miniatures sont laissées de côté — ~175 caractères
// chacune, elles feraient exploser la longueur du lien.
// Format : base64url(JSON [[id, artist, title, year], …]).

const toBase64Url = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (encoded: string) => {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};

const encodeSharedList = (favorites: Favorite[]) =>
  toBase64Url(JSON.stringify(favorites.map((f) => [f.id, f.artist, f.title, f.year])));

// null si le paramètre est illisible (lien tronqué, bricolé…)
const decodeSharedList = (encoded: string): Favorite[] | null => {
  try {
    const rows: unknown = JSON.parse(fromBase64Url(encoded));
    if (!Array.isArray(rows)) return null;
    return rows
      .filter(
        (row): row is string[] =>
          Array.isArray(row) && row.length === 4 && row.every((v) => typeof v === "string")
      )
      .map(([id, artist, title, year]) => ({ id, artist, title, year, thumb: "" }));
  } catch {
    return null;
  }
};

export { encodeSharedList, decodeSharedList };
