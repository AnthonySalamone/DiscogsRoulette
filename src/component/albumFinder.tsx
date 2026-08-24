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
    <div className="mb-6 flex flex-col gap-3">
      <fieldset className="win95-groupbox">
        <legend>Select a Year</legend>
        <SelectComponent
          options={yearOptions}
          instanceId="year-select"
          onChange={(option) => setYear(option?.value ?? "")}
        />
      </fieldset>
      <fieldset className="win95-groupbox">
        <legend>Select a Genre</legend>
        <SelectComponent
          options={genreOptions}
          instanceId="genre-select"
          onChange={(option) => setGenre(option?.value ?? "")}
        />
      </fieldset>
      <fieldset className="win95-groupbox">
        <legend>Select a Style</legend>
        <SelectComponent
          key={genre}
          options={styleOptions}
          instanceId="style-select"
          onChange={(option) => setStyle(option?.value ?? "")}
        />
      </fieldset>
      <button
        onClick={async () => {
          try {
            setIsLoading(true);
            setAlbumError(null);
            const result = await getOneRandomAlbum(genre, year, style);
            if (result.status === "ok") {
              setAlbum(result.album);
              setAlbumError(null);
            } else if (result.status === "empty") {
              const filters = [genre, style].filter(Boolean).join(" ");
              const yearPart = year ? ` in ${year}` : "";
              setAlbum(null);
              setAlbumError(
                `No ${filters || "matching"} album available${yearPart}. Try a different combination.`
              );
            } else {
              setAlbum(null);
              setAlbumError(
                "Too many requests. Wait a minute and try again."
              );
            }
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
        className="win95-raised px-4 py-2 cursor-pointer mt-6 min-w-48 mx-auto block text-center font-bold"
      >
        {isLoading
          ? "Loading..."
          : `Find a random ${genre} ${style} album ${year ? `from ${year}` : ""}`}
      </button>
    </div>
  );
};

export default AlbumFinder;
