const getSpotifyEmbedUrl = async (
  albumTitle: string,
  artistName: string
): Promise<string | null> => {
  try {
    const params = new URLSearchParams({ title: albumTitle, artist: artistName });
    const response = await fetch(`/api/spotify/search?${params}`);

    if (!response.ok) return null;

    const data: { embedUrl: string | null } = await response.json();
    return data.embedUrl;
  } catch (error) {
    console.error("Error fetching Spotify embed:", error);
    return null;
  }
};

export { getSpotifyEmbedUrl };
