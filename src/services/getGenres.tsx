//  Since the discogs API doesn't provide an Endpoint for the genders, we extract them all for a big release list (here 2000)
//  then we copy it in a table:
//  const genreOptions = [
//    { value: 'rock', label: 'Rock' },
//    { value: 'electronic', label: 'Electronic' },
//    ...
//  ];

const getAllGenres = async () => {
  const allGenres: string[] = [];

  try {
    // todo recursion to get multiple pages
      const response = await fetch(`https://api.discogs.com/database/search?type=release&per_page=100&page=20`, {
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

      // todo use for map or reduce instead of forEach
      data.results.forEach((release: { genre?: string[] }) => {
        if (release.genre && Array.isArray(release.genre)) {
          allGenres.push(...release.genre);
        }
      });

    const uniqueGenres = [...new Set(allGenres)].sort();
    console.log('All genres found:', uniqueGenres);
    console.log(`Total: ${uniqueGenres.length} unique genres on 20 pages`);

    return uniqueGenres;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export { getAllGenres };