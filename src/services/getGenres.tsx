//  Since the discogs API doesn't provide an Endpoint for the genders, we extract them all for a big release list (here 500)

const getAllGenres = async () => {
  try {
    const allReleases = [];

    // pages 1-5 with 100 releases per page
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(`https://api.discogs.com/database/search?type=release&per_page=100&page=${page}`, {
        headers: {
          'User-Agent': 'DiscoRoulette/1.0'
        }
      });

      if (!response.ok) {
        console.error('API error:', response.status);
        alert('Error calling API');
        return [];
      }

      const data = await response.json();
      allReleases.push(...data.results);
    }
    
    // Reduce
    const uniqueGenres = allReleases.reduce((acc, release) => {
      if (release.genre && Array.isArray(release.genre)) {
        release.genre.forEach(genre => {
          if (acc.indexOf(genre) === -1) {
            acc.push(genre);
          }
        });
      }
      return acc;
    }, []).sort();

    console.log(`Total: ${uniqueGenres.length} unique genres on 5 pages`);

    return uniqueGenres;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export { getAllGenres };