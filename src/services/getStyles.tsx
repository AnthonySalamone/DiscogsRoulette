//  Since the discogs API doesn't provide an Endpoint for the styles, we extract them all for a big release list (here 2000)

const getAllStyles = async () => {
  try {
    const allStyles = [];
    // pages 1-20 with 100 releases per page
    for (let page = 1; page <= 20; page++) {
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
      allStyles.push(...data.results);
    }

    // Reduce
    const uniqueStyles = allStyles.reduce((acc, release) => {
      if (release.style && Array.isArray(release.style)) {
        release.style.forEach(style => {
          if (acc.indexOf(style) === -1) {
            acc.push(style);
          }
        });
      }
      return acc;
    }, []).sort();

    console.log(`Total: ${uniqueStyles.length} unique styles on 20 pages`);

    return uniqueStyles;
  } catch {
    return [];
  }
};

export { getAllStyles };