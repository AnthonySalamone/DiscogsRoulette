import { buildSearchQuery, cleanArtistName } from "../utils/searchQuery";

type ItunesAlbum = { collectionViewUrl?: string; artistName?: string; collectionName?: string };

const searchItunesAlbum = async (term: string): Promise<ItunesAlbum | null> => {
  const params = new URLSearchParams({ term, entity: "album", limit: "1" });
  const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`);

  if (!response.ok) {
    console.error("iTunes API error:", response.status);
    return null;
  }

  const data: { results?: ItunesAlbum[] } = await response.json();
  return data.results?.[0] ?? null;
};

// "Mike McCoy" vs "Mike McCoy & DJ X" : l'un contient l'autre, en ignorant la casse.
// On regarde aussi le nom de l'album : iTunes crédite parfois le label/compilateur
// ("Atom™ / Mike McCoy/Azid Ramcash I-IV")
const artistMatches = (found: ItunesAlbum | null, expected: string) => {
  if (!found || !expected) return true;
  const b = expected.toLowerCase();
  const artist = found.artistName?.toLowerCase() ?? "";
  return (
    (artist !== "" && (artist.includes(b) || b.includes(artist))) ||
    (found.collectionName?.toLowerCase().includes(b) ?? false)
  );
};

const getItunesURL = async (
  albumTitle: string,
  artistName: string,
) => {
  try {
    // d'abord la recherche précise (titre tel quel), puis le titre simplifié si elle
    // ne donne rien — cf. src/utils/searchQuery.ts
    const preciseTerm = buildSearchQuery(artistName, albumTitle, false);
    let album = await searchItunesAlbum(preciseTerm);

    const simplifiedTerm = buildSearchQuery(artistName, albumTitle, true);
    if (!album?.collectionViewUrl && simplifiedTerm !== preciseTerm) {
      const fallback = await searchItunesAlbum(simplifiedTerm);
      // une requête plus large ramène plus facilement un album sans rapport : on ne
      // garde le résultat que si c'est bien le même artiste
      if (artistMatches(fallback, cleanArtistName(artistName))) {
        album = fallback;
      }
    }

    if (!album?.collectionViewUrl) {
      console.log("No iTunes album found for:", preciseTerm);
      return null;
    }

    return album.collectionViewUrl
      .replace("https://music.apple.com/", "https://embed.music.apple.com/")
      .split("?")[0];
  } catch (error) {
    console.error("Error fetching iTunes URL:", error);
    return null;
  }
};

export { getItunesURL };
