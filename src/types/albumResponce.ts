// distingue "vraie erreur / rate-limit" de "0 résultat pour cette combinaison de filtres" —
// les deux ne doivent pas afficher le même message à l'utilisateur
export type AlbumSearchResult =
  | { status: "ok"; album: Album }
  | { status: "empty" }
  | { status: "error" };

export type Album = {
  uri: string;
  id: string;
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
  }[];
  videos: {
    uri: string;
  }[];
};
