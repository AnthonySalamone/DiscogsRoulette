import type { Album } from "../types/albumResponce";
import YouTubeVideoPlayer from "./YouTubeVideoPlayer";
import AppleMusicEmbed from "./AppleMusicEmbed";
import AlbumCard from "./AlbumCard";

const AlbumResponse = ({ album }: { album: Album | null }) => {
  if (!album) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 border border-black rounded-xl">
      <AlbumCard album={album} />
      {album.videos && album.videos[0] && (
        <YouTubeVideoPlayer videoUrl={album.videos[0].uri} />
      )}
      <AppleMusicEmbed
        albumTitle={album.title}
        artistName={album.artists[0]?.name ?? ""}
      />
    </div>
  );
};

export default AlbumResponse;