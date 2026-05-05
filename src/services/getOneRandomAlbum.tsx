import type { Album } from "../types/albumResponce";

const getOneRandomAlbum = async (
  genre: string,
  year: string,
  style: string
) => {
  try {
    // voir si on peut jouer avec le parametre sort() pour changer l'ordre des labums rendus et pas toujours taper dans les premiers
    const params = new URLSearchParams({ type: 'release', per_page: '50' });
    if (genre) params.append('genre', genre);
    if (style) params.append('style', style);
    if (year) params.append('year', year);

    const response = await fetch(`https://api.discogs.com/database/search?${params}`, {
      headers: { 'User-Agent': 'DiscoRoulette/1.0' }
    });

    const data = await response.json();

    if (data.results?.length > 0) {
      const album = data.results[Math.floor(Math.random() * data.results.length)];

      // Récupérer les détails complets avec les images
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
      return null;
    }
  } catch {
    alert('Error');
    return null;
  }
};

export { getOneRandomAlbum };