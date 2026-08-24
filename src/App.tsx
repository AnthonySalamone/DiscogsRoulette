import { useState } from "react";
import AlbumResponse from "./component/albumResponce";
import AlbumFinder from "./component/albumFinder";
import { useGenreOptions } from "./hooks/useGenreOptions";
import { useStylesOptions } from "./hooks/useStylesOptions";
import type { Album } from "./types/albumResponce";

function App() {
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumError, setAlbumError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { genreOptions, isLoading: isGenresLoading } = useGenreOptions();
  // ne montre que les styles qui existent réellement dans le genre choisi
  // (tous les styles si aucun genre sélectionné)
  const { styleOptions, isLoading: isStylesLoading } = useStylesOptions(genre);
  const isOptionsLoading = isGenresLoading || isStylesLoading;
  const selectHasOptions =
    genreOptions.length > 0 && styleOptions.length > 0;

  // le style choisi peut ne plus exister dans le nouveau genre : on le réinitialise
  // pendant le render (cf. https://react.dev/learn/you-might-not-need-an-effect),
  // pas dans un effect, pour éviter un rendu en cascade superflu
  const [prevGenre, setPrevGenre] = useState(genre);
  if (genre !== prevGenre) {
    setPrevGenre(genre);
    setStyle("");
  }

  return (
    <div className="min-h-screen py-6 md:py-10 px-2 md:px-4">
      <div className="win95-window max-w-3xl mx-auto">
        {/* barre de titre */}
        <div className="win95-titlebar flex items-center justify-between px-2 py-1">
          <span className="font-bold text-sm flex items-center gap-1.5">
            💿 Discogs Roulette.exe
          </span>
          <div className="flex gap-1">
            <button className="win95-titlebar-btn w-5 h-5 text-xs" aria-hidden="true">
              _
            </button>
            <button className="win95-titlebar-btn w-5 h-5 text-xs" aria-hidden="true">
              □
            </button>
            <button className="win95-titlebar-btn w-5 h-5 text-xs" aria-hidden="true">
              ✕
            </button>
          </div>
        </div>

        {/* barre de menu */}
        <div
          className="text-sm px-2 py-1 border-b-2 border-[var(--win95-gray-dark)]"
          style={{ background: "var(--win95-gray)" }}
        >
          <span className="mr-4">File</span>
          <span className="mr-4">Edit</span>
          <span className="mr-4">View</span>
          <span>Help</span>
        </div>

        {/* contenu */}
        <div className="p-3 md:p-5" style={{ background: "var(--win95-gray)" }}>
          {isOptionsLoading && <p className="text-lg text-center">Loading…</p>}

          {!isOptionsLoading && !selectHasOptions && (
            <div className="win95-sunken p-4 text-center">
              <p className="text-lg">Too many requests. Wait a minute and reload the page.</p>
              <p className="text-sm">Discogs Roulette allows 25 requests per minute.</p>
            </div>
          )}

          {!isOptionsLoading && selectHasOptions && (
            <>
              <AlbumFinder
                genre={genre}
                year={year}
                style={style}
                genreOptions={genreOptions}
                styleOptions={styleOptions}
                isLoading={isLoading}
                setGenre={setGenre}
                setYear={setYear}
                setStyle={setStyle}
                setAlbum={setAlbum}
                setAlbumError={setAlbumError}
                setIsLoading={setIsLoading}
              />
              {(isLoading || album || albumError) && (
                <AlbumResponse album={album} error={albumError} />
              )}
            </>
          )}
        </div>

        {/* barre de statut */}
        <div className="win95-sunken mx-2 mb-2 px-2 py-1 text-xs">
          Digging for music since 2026
        </div>
      </div>
    </div>
  );
}

export default App;
