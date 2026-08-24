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
        <div className="p-4 md:p-8 border border-black rounded-xl">
          <p className="text-lg text-center">{error}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 border border-black rounded-xl">
      <AlbumCard album={album} />
      <EmbedTabs album={album} />
    </div>
  );
};

export default AlbumResponse;
