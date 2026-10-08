// résumé d'album stocké dans les favoris : de quoi afficher la liste sans rappeler
// Discogs (60 req/min), l'album complet est rechargé via getAlbumById au clic
type Favorite = {
  id: string;
  artist: string;
  title: string;
  year: string;
  thumb: string;
};

export type { Favorite };
