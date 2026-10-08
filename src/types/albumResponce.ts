// distingue "vraie erreur / rate-limit" de "0 résultat pour cette combinaison de filtres" —
// les deux ne doivent pas afficher le même message à l'utilisateur
export type AlbumSearchResult =
  | { status: "ok"; album: Album }
  | { status: "empty" }
  | { status: "error" };

export type Album = {
  uri: string;
  // Discogs renvoie un nombre ; comparer via String(album.id)
  id: string | number;
  title: string;
  artists: {
    name: string;
  }[];
  year: string | number;
  country: string;
  genres: string[];
  styles: string[];
  images: {
    resource_url: string;
    uri150?: string;
  }[];
  videos: {
    uri: string;
  }[];
};
