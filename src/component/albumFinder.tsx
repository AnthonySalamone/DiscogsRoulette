'use client';

import { yearOptions } from "./select";
import { SelectComponent } from "./selectComponent";
import { getOneRandomAlbum } from "../services/getOneRandomAlbum";
import type AlbumFinderProps from "../types/albumFinder";

const AlbumFinder = ({
  genre,
  year,
  style,
  genreOptions,
  styleOptions,
  isLoading,
  setGenre,
  setYear,
  setStyle,
  setAlbum,
  setAlbumError,
  setIsLoading,
}: AlbumFinderProps) => {
  return (
    <div className="mb-10 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold">Select a Year</h2>
        <SelectComponent
          options={yearOptions}
          instanceId="year-select"
          onChange={(option) => setYear(option?.value ?? "")}
        />
      </div>
      <div>
        <h2 className="text-lg font-bold">Select a Genre</h2>
        <SelectComponent
          options={genreOptions}
          instanceId="genre-select"
          onChange={(option) => setGenre(option?.value ?? "")}
        />
      </div>
      <div>
        <h2 className="text-lg font-bold">Select a Style</h2>
        <SelectComponent
          key={genre}
          options={styleOptions}
          instanceId="style-select"
          onChange={(option) => setStyle(option?.value ?? "")}
        />
      </div>
      <button
        onClick={async () => {
          try {
            setIsLoading(true);
            setAlbumError(null);
            const result = await getOneRandomAlbum(genre, year, style);
            if (!result) {
              setAlbum(null);
              setAlbumError(
                "Too many requests. Wait a minute and try again."
              );
            } else {
              setAlbum(result);
              setAlbumError(null);
            }
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
        className="bg-black text-white px-4 py-2 cursor-pointer hover:bg-black/80 mt-10 rounded-xl transition-all duration-300 min-w-48 mx-auto block text-center"
      >
        {isLoading
          ? "loading..."
          : `Find a random ${genre} ${style} album ${year ? `from ${year}` : ""}`}
      </button>
    </div>
  );
};

export default AlbumFinder;
