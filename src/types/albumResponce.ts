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
