import { useEffect, useState } from "react";
import { fetchGenresAndStyles } from "../services/getGenresAndStyles";
import type { SelectOption } from "../types/select";

const useGenreOptions = () => {
  const [genreOptions, setGenreOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGenresAndStyles().then((result) => {
      setGenreOptions(
        result.genres.map((genre) => ({
          value: genre,
          label: genre,
        }))
      );
      setIsLoading(false);
    });
  }, []);

  return { genreOptions, isLoading };
};

export { useGenreOptions };
