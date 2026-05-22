import { useEffect, useState } from "react";
import { fetchGenresAndStyles } from "../services/getGenresAndStyles";
import type { SelectOption } from "../types/select";

const useStylesOptions = (): SelectOption[] => {
  const [styleOptions, setStyleOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchGenresAndStyles().then((result) => {
      setStyleOptions(
        result.styles.map((style) => ({
          value: style,
          label: style,
        }))
      );
    });
  }, []);

  return styleOptions;
};

export { useStylesOptions };
