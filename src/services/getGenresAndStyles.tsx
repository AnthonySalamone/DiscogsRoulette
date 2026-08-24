// import direct des sous-chemins JSON (pas l'entrée principale du package, qui utilise
// node:module/createRequire en interne et ne fonctionne pas dans un bundle navigateur)
import genres from "discogs-dataset-genres-styles/genres";
import styles from "discogs-dataset-genres-styles/styles";
import type { GenresAndStylesResult } from "../types/discogAPI";

// La taxonomie genres/styles Discogs est fixe (~15 genres, ~750 styles) et n'existe pas
// via un endpoint de l'API : on utilise le dataset officiel (généré depuis le dump Discogs)
// plutôt que d'échantillonner 2000 releases via 20 requêtes /database/search à chaque
// chargement de page — ça évite de cramer le quota de requêtes avant même le premier spin.
const fetchGenresAndStyles = (): Promise<GenresAndStylesResult> =>
  Promise.resolve({ genres, styles });

export { fetchGenresAndStyles };
