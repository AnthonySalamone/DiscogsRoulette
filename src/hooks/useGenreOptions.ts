import { useMemo } from "react";
import { allGenres } from "../data/genreStyleMap";
import type { SelectOption } from "../types/select";

// Donnée statique (voir src/data/genreStyleMap.ts) : plus besoin d'async/loading,
// mais on garde la même forme de retour pour ne pas toucher App.tsx.
const useGenreOptions = () => {
  const genreOptions = useMemo<SelectOption[]>(
    () => allGenres.map((genre) => ({ value: genre, label: genre })),
    []
  );

  return { genreOptions, isLoading: false };
};

export { useGenreOptions };
