type DiscogRelease = {
  genre?: string[];
  style?: string[];
};

type DiscogResponse = {
  results: DiscogRelease[];
};

type GenresAndStylesResult = {
  genres: string[];
  styles: string[];
};

export type { DiscogRelease, DiscogResponse, GenresAndStylesResult };