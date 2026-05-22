import type { Dispatch, SetStateAction } from "react";
import type { Album } from "./albumResponce";
import type { SelectOption } from "./select";

type AlbumFinderProps = {
    genre: string;
    year: string;
    style: string;
    genreOptions: SelectOption[];
    isLoading: boolean;
    setGenre: Dispatch<SetStateAction<string>>;
    setYear: Dispatch<SetStateAction<string>>;
    setStyle: Dispatch<SetStateAction<string>>;
    setAlbum: Dispatch<SetStateAction<Album | null>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  };
export type { AlbumFinderProps as default };
