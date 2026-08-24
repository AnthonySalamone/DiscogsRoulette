import { useMemo } from "react";
import { getStylesForGenre } from "../data/genreStyleMap";
import type { SelectOption } from "../types/select";

// Filtre les styles sur le genre sélectionné (tous les styles si aucun genre choisi).
const useStylesOptions = (genre: string) => {
  const styleOptions = useMemo<SelectOption[]>(
    () => getStylesForGenre(genre).map((style) => ({ value: style, label: style })),
    [genre]
  );

  return { styleOptions, isLoading: false };
};

export { useStylesOptions };
