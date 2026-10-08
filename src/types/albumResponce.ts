// distingue "vraie erreur / rate-limit" de "0 résultat pour cette combinaison de filtres" —
// les deux ne doivent pas afficher le même message à l'utilisateur
export type AlbumSearchResult =
  | { status: "ok"; album: Album }
  | { status: "empty" }
  // 429 Discogs : quota de 60 req/min atteint, partagé par tous les visiteurs
  | { status: "rate-limited" }
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
