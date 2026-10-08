import type { Album, AlbumSearchResult } from "../types/albumResponce";
import { discogsFetch } from "./discogsApi";

// cache de session : revenir en arrière dans l'historique, rouvrir un favori ou le
// double effect du StrictMode ne refait pas d'appel Discogs. On cache la promesse
// (pas le résultat) pour dédoublonner aussi les requêtes en cours.
const releaseCache = new Map<string, Promise<AlbumSearchResult>>();

const rememberAlbum = (album: Album) => {
  releaseCache.set(String(album.id), Promise.resolve({ status: "ok", album }));
};

const fetchRelease = async (id: string): Promise<AlbumSearchResult> => {
  try {
    const response = await discogsFetch(`/releases/${encodeURIComponent(id)}`);
    if (response.status === 404) return { status: "empty" };
    if (!response.ok) {
      console.error("Discogs release error:", response.status);
      return { status: "error" };
    }
    return { status: "ok", album: await response.json() };
  } catch (error) {
    console.error("Error fetching release:", error);
    return { status: "error" };
  }
};

// "empty" = cette release n'existe pas (404), "error" = rate-limit / réseau
const getAlbumById = (id: string): Promise<AlbumSearchResult> => {
  const cached = releaseCache.get(id);
  if (cached) return cached;

  const pending = fetchRelease(id).then((result) => {
    // seuls les succès restent en cache : une erreur doit pouvoir être retentée
    if (result.status !== "ok") releaseCache.delete(id);
    return result;
  });
  releaseCache.set(id, pending);
  return pending;
};

export { getAlbumById, rememberAlbum };
