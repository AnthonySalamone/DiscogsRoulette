const getItunesURL = async (
  albumTitle: string,
  artistName: string,
) => {
  try {
    const searchTerm = `${artistName} ${albumTitle}`.trim();
    const params = new URLSearchParams({
      term: searchTerm,
      entity: "album",
      limit: "1",
    });

    const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`);

    if (!response.ok) {
      console.error("iTunes API error:", response.status);
      return null;
    }

    const data: {
      results?: Array<{ collectionViewUrl?: string }>;
    } = await response.json();

    const collectionViewUrl = data.results?.[0]?.collectionViewUrl;
    if (!collectionViewUrl) {
      console.log("No iTunes album found for:", searchTerm);
      return null;
    }

    return collectionViewUrl
      .replace("https://music.apple.com/", "https://embed.music.apple.com/")
      .split("?")[0];
  } catch (error) {
    console.error("Error fetching iTunes URL:", error);
    return null;
  }
};

export { getItunesURL };
