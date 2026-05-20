import { useState } from "react";
import AlbumResponse from "./component/albumResponce";
import AlbumFinder from "./component/albumFinder";
import type { Album } from "./types/albumResponce";

function App() {
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <header className="bg-black text-white py-10 mb-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Discogs Roulette 🪩</h1>
        </div>
      </header>
      <main className="mb-10 max-w-3xl mx-auto">
        <AlbumFinder
          genre={genre}
          year={year}
          style={style}
          isLoading={isLoading}
          setGenre={setGenre}
          setYear={setYear}
          setStyle={setStyle}
          setAlbum={setAlbum}
          setIsLoading={setIsLoading}
        />
        {(isLoading || album) && (
          <AlbumResponse album={album} />
        )}
      </main>
      <footer className="bg-black text-white py-10">
        <div className="max-w-3xl mx-auto">
          <p>Footer content</p>
        </div>
      </footer>
    </>
  );
}

export default App;
