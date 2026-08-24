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
    <>
      <header className="bg-black text-white py-10 mb-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Discogs Roulette 🪩</h1>
        </div>
      </header>

      {isOptionsLoading && (
        <main className="mb-10 max-w-3xl mx-auto px-4">
          <p className="text-lg text-center">Loading…</p>
        </main>
      )}
      
      {!isOptionsLoading && !selectHasOptions && (
        <main className="mb-10 max-w-3xl mx-auto px-4">
          <p className="text-lg text-center">
            Too many requests. Wait a minute and reload the
            page.
          </p>
          <p className="text-sm text-center">Discogs Roulette allows 25 requests per minute.</p>
        </main>
      )}

      {!isOptionsLoading && selectHasOptions && (
        <main className="mb-10 max-w-3xl mx-auto px-4">
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
        </main>
      )}

      <footer className="bg-black text-white py-10">
        <div className="max-w-3xl mx-auto">
          <p>Digging for music since 2026</p>
        </div>
      </footer>
    </>
  );
}

export default App;
