const testDiscogsAPI = async () => {
    try {
      const response = await fetch('https://api.discogs.com/releases/249504', {
        headers: {
          'User-Agent': 'DiscoRoulette/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Discogs API Response:', data);
        alert(`Album found: ${data.title} by ${data.artists[0].name}`);
      } else {
        console.error('API error:', response.status);
        alert('Error calling API');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Connection error');
    }
  };

export { testDiscogsAPI };