import type { DiscogRelease, DiscogResponse, GenresAndStylesResult } from "../types/discogAPI";

const fetchGenresAndStyles = async (): Promise<GenresAndStylesResult> => {
  try {
    const allReleases: DiscogRelease[] = [];

    //check si il y a next plutot que de boucler
    // "pagination": {
    //   "page": 3,
    //   "pages": 100,
    //   "per_page": 100,
    //   "items": 19270728,
    //   "urls": {
    //     "first": "https://api.discogs.com/database/search?type=release&per_page=100&page=1",
    //     "last": "https://api.discogs.com/database/search?type=release&per_page=100&page=100",
    //     "prev": "https://api.discogs.com/database/search?type=release&per_page=100&page=2",
    //     "next": "https://api.discogs.com/database/search?type=release&per_page=100&page=4"
    //   }
    // },

    // @YannG, ici après réflexion, le fait de boucler ne pose pas de problème
    // car on pioche dans toutes les releases de discogs.
    // On est donc sur qu'il y aura toujours les 20 pages disponibles.

    for (let page = 1; page <= 20; page++) {
      const response = await fetch(`https://api.discogs.com/database/search?type=release&per_page=100&page=${page}`, {
        headers: {
          'User-Agent': 'DiscoRoulette/1.0'
        }
      });

      if (!response.ok) {
        console.error('API error:', response.status);
        alert('Error calling API');
        return { genres: [], styles: [] };
      }

      const data: DiscogResponse = await response.json();
      allReleases.push(...data.results);
    }

    // Reduce Genres 
    const uniqueGenres = allReleases.reduce((acc: string[], release) => {
      if (release.genre && Array.isArray(release.genre)) {
        release.genre.forEach(genre => {
          if (acc.indexOf(genre) === -1) {
            acc.push(genre);
          }
        });
      }
      return acc;
    }, []).sort();

    // Reduce Styles
    const uniqueStyles = allReleases.reduce((acc: string[], release) => {
      if (release.style && Array.isArray(release.style)) {
        release.style.forEach(style => {
          if (acc.indexOf(style) === -1) {
            acc.push(style);
          }
        });
      }
      return acc;
    }, []).sort();

    console.log(`Total: ${uniqueGenres.length} unique genres`);
    console.log(`Total: ${uniqueStyles.length} unique styles`);

    return {
      genres: uniqueGenres,
      styles: uniqueStyles
    };

  } catch (error) {
    console.error('Error:', error);
    return { genres: [], styles: [] };
  }
};

export { fetchGenresAndStyles };