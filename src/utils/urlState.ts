// État de l'app reflété dans l'URL (?release=…&genre=…&style=…&year=…&list=…) :
// c'est ce qui rend un album, une roulette filtrée ou une liste partageables, et
// ce que relit App au chargement et sur le bouton retour du navigateur.
type UrlState = {
  release: string;
  genre: string;
  style: string;
  year: string;
  // liste de favoris partagée, encodée par utils/sharedList.ts
  list: string;
};

const KEYS = ["release", "genre", "style", "year", "list"] as const;

const readUrlState = (): UrlState => {
  const params = new URLSearchParams(window.location.search);
  return {
    release: params.get("release") ?? "",
    genre: params.get("genre") ?? "",
    style: params.get("style") ?? "",
    year: params.get("year") ?? "",
    list: params.get("list") ?? "",
  };
};

// "?release=1&genre=Jazz", ou "" quand tout est vide
const buildSearch = (state: UrlState) => {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    if (state[key]) params.set(key, state[key]);
  }
  const search = params.toString();
  return search ? `?${search}` : "";
};

// lien partagé d'un album : en prod il passe par api/share.ts, qui sert les balises
// Open Graph (pochette, titre) aux aperçus Discord/WhatsApp/iMessage puis redirige
// vers /?release=… — cette fonction n'existe pas sous `npm run dev`
const albumShareUrl = (id: string) =>
  import.meta.env.DEV
    ? `${window.location.origin}/?release=${encodeURIComponent(id)}`
    : `${window.location.origin}/api/share?release=${encodeURIComponent(id)}`;

const listShareUrl = (encodedList: string) =>
  `${window.location.origin}/?list=${encodedList}`;

export { readUrlState, buildSearch, albumShareUrl, listShareUrl };
export type { UrlState };
