import { useEffect, useState } from "react";
import { fetchGenresAndStyles } from "../services/getGenresAndStyles";
import type { SelectOption } from "../types/select";

const useStylesOptions = () => {
  const [styleOptions, setStyleOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGenresAndStyles().then((result) => {
      setStyleOptions(
        result.styles.map((style) => ({
          value: style,
          label: style,
        }))
      );
      setIsLoading(false);
    });
  }, []);

  return { styleOptions, isLoading };
};

export { useStylesOptions };
