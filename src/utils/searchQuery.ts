// Les noms Discogs ne sont pas faits pour être tapés dans un moteur de recherche :
// suffixes de désambiguïsation ("Mike McCoy (4)"), astérisque de nom alternatif
// ("Prince*"), mentions entre parenthèses/crochets ("(Remastered)", "[EP]"),
// numéros de volume ("Azid Ramcash II.")… qui font tomber la recherche à 0 résultat
// sur Bandcamp/Spotify/SoundCloud/iTunes alors que l'album y est.

// "Mike McCoy (4)" → "Mike McCoy", "Prince*" → "Prince"
const cleanArtistName = (name: string) =>
  name
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\*+$/, "")
    .trim();

// "Various" n'apporte rien à une recherche (compilations)
const isVariousArtists = (name: string) => /^various( artists)?$/i.test(name);

// enlève parenthèses/crochets et numéros de volume en fin de titre :
// "Azid Ramcash II." → "Azid Ramcash", "Blue Train (Remastered)" → "Blue Train",
// "Selected Ambient Works Vol. 2" → "Selected Ambient Works"
const simplifyTitle = (title: string) => {
  const simplified = title
    .replace(/[([][^)\]]*[)\]]/g, " ")
    .replace(/[\s,.:-]+(vol(ume)?\.?|part|pt\.?)\s*\w+\.?\s*$/i, "")
    .replace(/\s+([IVX]+|\d+)\.?\s*$/, "")
    .replace(/[\s.,:;-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
  // ne jamais vider complètement un titre ("II", "(Untitled)"…)
  return simplified || title.trim();
};

const buildSearchQuery = (artistName: string, title: string, simplified: boolean) => {
  const artist = cleanArtistName(artistName);
  return [
    isVariousArtists(artist) ? "" : artist,
    simplified ? simplifyTitle(title) : title.trim(),
  ]
    .filter(Boolean)
    .join(" ");
};

export { cleanArtistName, simplifyTitle, buildSearchQuery };
