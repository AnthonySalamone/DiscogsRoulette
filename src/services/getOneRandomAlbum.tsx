import type { AlbumSearchResult } from "../types/albumResponce";
import { discogsFetch } from "./discogsApi";

const getOneRandomAlbum = async (
  genre: string,
  year: string,
  style: string
): Promise<AlbumSearchResult> => {
  try {
    const sortOptions = ['year,desc', 'year,asc', 'title,asc', 'title,desc', 'format', 'rating,desc', 'rating,asc', 'added,desc', 'added,asc'];
    const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

    const params = new URLSearchParams({ type: 'release', per_page: '100', sort: randomSort });
    if (genre) params.append('genre', genre);
    if (style) params.append('style', style);
    if (year) params.append('year', year);

    const response = await discogsFetch(`/database/search?${params}`);

    if (!response.ok) {
      // vraie erreur (429 rate-limit, 5xx, etc.) : pas la même chose qu'une recherche
      // qui aboutit à 0 résultat
      console.error('Discogs search error:', response.status);
      return { status: "error" };
    }

    const data = await response.json();

    if (data.results?.length > 0) {
      const album = data.results[Math.floor(Math.random() * data.results.length)];

      const releasePath = new URL(album.resource_url).pathname;
      const releaseInfo = await discogsFetch(releasePath);

      if (releaseInfo.ok) {
        const fullAlbum = await releaseInfo.json();
        return { status: "ok", album: fullAlbum };
      }

      return { status: "ok", album };
    }

    // requête ok, juste aucun résultat pour cette combinaison genre/style/année
    return { status: "empty" };
  } catch (error) {
    console.error('Error fetching a random album:', error);
    return { status: "error" };
  }
};

export { getOneRandomAlbum };
