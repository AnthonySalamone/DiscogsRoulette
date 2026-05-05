//  Since the discogs API doesn't provide an Endpoint for the styles, we extract them all for a big release list (here 2000)
//  then we copy it in a table:
//  const styleOptions = [
//    { value: 'AOR', label: 'AOR' },
//    { value: 'Abstract', label: 'Abstract' },
//    ...
//  ];

const getAllStyles = async () => {
  const allStyles: string[] = [];

  try {
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

      data.results.forEach((release: { style?: string[] }) => {
        if (release.style && Array.isArray(release.style)) {
          allStyles.push(...release.style);
        }
      });

    const uniqueStyles = [...new Set(allStyles)].sort();
    console.log('All styles found:', uniqueStyles);
    console.log(`Total: ${uniqueStyles.length} unique styles on 20 pages`);

    return uniqueStyles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export { getAllStyles };