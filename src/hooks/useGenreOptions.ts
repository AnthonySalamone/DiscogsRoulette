import { useEffect, useState } from "react";
import { fetchGenresAndStyles } from "../services/getGenresAndStyles";
import type { SelectOption } from "../types/select";

const useGenreOptions = (): SelectOption[] => {
  const [genreOptions, setGenreOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchGenresAndStyles().then((result) => {
      setGenreOptions(
        result.genres.map((genre) => ({
          value: genre,
          label: genre,
        }))
      );
    });
  }, []);

  return genreOptions;
};

export { useGenreOptions };
