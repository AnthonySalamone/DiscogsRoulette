import type { AlbumSearchResult } from "../types/albumResponce";
import { discogsFetch } from "./discogsApi";
import { rememberAlbum } from "./getAlbumById";

const SORT_OPTIONS = ['year,desc', 'year,asc', 'title,asc', 'title,desc', 'format', 'rating,desc', 'rating,asc', 'added,desc', 'added,asc'];

// Discogs refuse toute page au-delà de 100 (10 000 résultats par tri, vérifié sur l'API)
const MAX_PAGE = 100;

// nombre de pages connu par combinaison de filtres (il ne dépend pas du tri) : le
// 1er tirage d'une combinaison lit la page 1 et l'apprend, les suivants tirent une
// page au hasard sans requête supplémentaire. Tri × page au hasard = jusqu'à 90 000
// albums atteignables par combinaison, au lieu des 100 premiers résultats par tri.
const pageCounts = new Map<string, number>();

const randomInt = (max: number) => Math.floor(Math.random() * max);

const getOneRandomAlbum = async (
  genre: string,
  year: string,
  style: string
): Promise<AlbumSearchResult> => {
  try {
    const filterKey = `${genre}|${style}|${year}`;
    const knownPages = pageCounts.get(filterKey);
    const page = knownPages ? randomInt(knownPages) + 1 : 1;

    const params = new URLSearchParams({
      type: 'release',
      per_page: '100',
      sort: SORT_OPTIONS[randomInt(SORT_OPTIONS.length)],
      page: String(page),
    });
    if (genre) params.append('genre', genre);
    if (style) params.append('style', style);
    if (year) params.append('year', year);

    const response = await discogsFetch(`/database/search?${params}`);

    if (response.status === 404 && page > 1) {
      // page hors limites : le catalogue a bougé depuis qu'on a compté, on réapprend
      pageCounts.delete(filterKey);
      return getOneRandomAlbum(genre, year, style);
    }
    if (response.status === 429) return { status: "rate-limited" };
    if (!response.ok) {
      // vraie erreur (5xx, réseau…) : pas la même chose qu'une recherche
      // qui aboutit à 0 résultat
      console.error('Discogs search error:', response.status);
      return { status: "error" };
    }

    const data = await response.json();
    const pages = Number(data.pagination?.pages);
    if (pages > 0) pageCounts.set(filterKey, Math.min(pages, MAX_PAGE));

    if (data.results?.length > 0) {
      const album = data.results[randomInt(data.results.length)];

      const releasePath = new URL(album.resource_url).pathname;
      const releaseInfo = await discogsFetch(releasePath);

      if (releaseInfo.ok) {
        const fullAlbum = await releaseInfo.json();
        rememberAlbum(fullAlbum);
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
