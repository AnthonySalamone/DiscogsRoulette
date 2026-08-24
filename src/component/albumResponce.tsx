import type { Album } from "../types/albumResponce";
import EmbedTabs from "./EmbedTabs";
import AlbumCard from "./AlbumCard";

const AlbumResponse = ({
  album,
  error,
}: {
  album: Album | null;
  error: string | null;
}) => {
  if (!album) {
    if (error) {
      return (
        <div className="win95-sunken p-4 md:p-6 mt-4">
          <p className="text-lg text-center">{error}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="win95-sunken flex flex-col gap-4 md:gap-6 p-4 md:p-6 mt-4">
      <AlbumCard album={album} />
      <EmbedTabs album={album} />
    </div>
  );
};

export default AlbumResponse;
