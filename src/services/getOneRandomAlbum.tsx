import type { Album } from "../types/albumResponce";

const getOneRandomAlbum = async (
  genre: string,
  year: string,
  style: string
) => {
  try {
    const sortOptions = ['year,desc', 'year,asc', 'title,asc', 'title,desc', 'format', 'rating,desc', 'rating,asc', 'added,desc', 'added,asc'];
    const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

    const params = new URLSearchParams({ type: 'release', per_page: '100', sort: randomSort });
    if (genre) params.append('genre', genre);
    if (style) params.append('style', style);
    if (year) params.append('year', year);

    const fullUrl = `https://api.discogs.com/database/search?${params}`;
    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': 'DiscoRoulette/1.0' }
    });

    const data = await response.json();

    if (data.results?.length > 0) {
      const album = data.results[Math.floor(Math.random() * data.results.length)];

      const releaseInfo = await fetch(album.resource_url, {
        headers: { 'User-Agent': 'DiscoRoulette/1.0' }
      });

      if (releaseInfo.ok) {
        const fullAlbum = await releaseInfo.json();
        console.log(fullAlbum);
        return fullAlbum;
      }

      return album as Album;
    } else {
      alert('No album found');
      new Error('No album found');
      return null;
    }
  } catch {
    alert('Error, too many requests, max is 60 requests per minute');
    new Error('Error, too many requests, max is 60 requests per minute');
    return null;
  }
};

export { getOneRandomAlbum };