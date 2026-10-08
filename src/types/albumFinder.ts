import type { Dispatch, SetStateAction } from "react";
import type { Album } from "./albumResponce";
import type { SelectOption } from "./select";
import type { YearMode } from "../component/select";

type AlbumFinderProps = {
    genre: string;
    year: string;
    yearMode: YearMode;
    style: string;
    genreOptions: SelectOption[];
    styleOptions: SelectOption[];
    isLoading: boolean;
    setGenre: Dispatch<SetStateAction<string>>;
    setYear: Dispatch<SetStateAction<string>>;
    setYearMode: Dispatch<SetStateAction<YearMode>>;
    setStyle: Dispatch<SetStateAction<string>>;
    setAlbum: Dispatch<SetStateAction<Album | null>>;
    setAlbumError: Dispatch<SetStateAction<string | null>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  };
export type { AlbumFinderProps as default };
