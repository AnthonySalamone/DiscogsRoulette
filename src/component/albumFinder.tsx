'use client';

import { formatYear, yearOptionsFor } from "./select";
import { SelectComponent } from "./selectComponent";
import { getOneRandomAlbum } from "../services/getOneRandomAlbum";
import type AlbumFinderProps from "../types/albumFinder";

const AlbumFinder = ({
  genre,
  year,
  yearMode,
  style,
  genreOptions,
  styleOptions,
  isLoading,
  setGenre,
  setYear,
  setYearMode,
  setStyle,
  setAlbum,
  setAlbumError,
  setIsLoading,
}: AlbumFinderProps) => {
  const hasFilters = Boolean(genre || year || style);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <fieldset className="win95-groupbox">
        <legend>Select a Year</legend>
        <div className="flex gap-4 text-sm mb-2" role="radiogroup" aria-label="Year granularity">
          {([
            ["single", "One year"],
            [5, "5 years"],
            [10, "10 years"],
          ] as const).map(([mode, label]) => (
            <label key={mode} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="year-mode"
                className="win95-radio"
                checked={yearMode === mode}
                onChange={() => {
                  // une année "1994" n'a pas de sens dans la liste des tranches (et
                  // inversement) : on vide la sélection dans le handler même
                  setYearMode(mode);
                  setYear("");
                }}
              />
              {label}
            </label>
          ))}
        </div>
        <SelectComponent
          options={yearOptionsFor(yearMode)}
          instanceId="year-select"
          value={year}
          onChange={(option) => setYear(option?.value ?? "")}
        />
      </fieldset>
      <fieldset className="win95-groupbox">
        <legend>Select a Genre</legend>
        <SelectComponent
          options={genreOptions}
          instanceId="genre-select"
          value={genre}
          onChange={(option) => {
            // le style choisi peut ne plus exister dans le nouveau genre. Remis à zéro
            // ici plutôt que pendant le render (prevGenre) : genre et style peuvent
            // aussi changer ensemble depuis l'URL (bouton retour), et ce style-là
            // doit être conservé
            setGenre(option?.value ?? "");
            setStyle("");
          }}
        />
      </fieldset>
      <fieldset className="win95-groupbox">
        <legend>Select a Style</legend>
        <SelectComponent
          options={styleOptions}
          instanceId="style-select"
          value={style}
          onChange={(option) => setStyle(option?.value ?? "")}
        />
      </fieldset>
      <button
        onClick={() => {
          setGenre("");
          setYear("");
          setStyle("");
        }}
        disabled={!hasFilters}
        className="win95-raised px-3 py-1 cursor-pointer text-sm self-end"
      >
        Reset filters
      </button>
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
              const yearPart = year ? ` in ${formatYear(year)}` : "";
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
        className="win95-raised px-4 py-2 cursor-pointer mt-2 min-w-48 mx-auto block text-center font-bold"
      >
        {isLoading
          ? "Loading..."
          : `Find a random ${genre} ${style} album ${year ? `from ${formatYear(year)}` : ""}`}
      </button>
    </div>
  );
};

export default AlbumFinder;
