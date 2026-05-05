'use client';

import { yearOptions, styleOptions, genreOptions } from "./select";
import { SelectComponent } from "./selectComponent";
import { getOneRandomAlbum } from "../services/getOneRandomAlbum";
import type AlbumFinderProps from "../types/albumFinder";

const AlbumFinder = ({
  genre,
  year,
  style,
  isLoading,
  setGenre,
  setYear,
  setStyle,
  setAlbum,
  setIsLoading,
}: AlbumFinderProps) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold">Select a Year</h2>
      <SelectComponent
        options={yearOptions}
        instanceId="year-select"
        onChange={(option) => setYear(option?.value ?? "")}
      />
      <h2 className="text-lg font-bold">Select a Genre</h2>
      <SelectComponent
        options={genreOptions}
        instanceId="genre-select"
        onChange={(option) => setGenre(option?.value ?? "")}
      />
      <h2 className="text-lg font-bold">Select a Style</h2>
      <SelectComponent
        options={styleOptions}
        instanceId="style-select"
        onChange={(option) => setStyle(option?.value ?? "")}
      />
      <button
        onClick={async () => {
          try {
            setIsLoading(true);
            const result = await getOneRandomAlbum(genre, year, style);
            setAlbum(result);
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
