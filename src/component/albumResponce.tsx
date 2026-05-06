import type { Album } from "../types/albumResponce";
import { useEffect, useState } from "react";
import { getItunesURL } from "../services/getItunesURL";

//youtube video player -> todo create a component for this
const getYouTubeId = (url: string) => {
  return url.split('v=')[1]?.split('&')[0];
};
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        Watch the video
      </a>
    );
  }

  return (
    <iframe
      width="100%"
      height="auto"
      src={`https://www.youtube.com/embed/${videoId}`}
      allowFullScreen
      className="rounded-xl aspect-video w-full"
    />
  );
};

//apple music embed player -> todo create a component for this
const AppleMusicPlayer = ({ albumTitle, artistName }: { albumTitle: string; artistName: string }) => {
  const [appleEmbedUrl, setAppleEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppleEmbed = async () => {
      try {
        const embedUrl = await getItunesURL(albumTitle, artistName);
        setAppleEmbedUrl(embedUrl);
      } catch {
        setAppleEmbedUrl(null);
      }
    };

    fetchAppleEmbed();
  }, [albumTitle, artistName]);

  if (!appleEmbedUrl) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <iframe
        title="Apple Music album preview"
        allow="autoplay *; encrypted-media *;"
        width="100%"
        height={450}
        src={appleEmbedUrl}
        className="w-full border-0"
      />
    </div>
  );
};

// album card -> todo create a component for this
const AlbumCard = ({ album }: { album: Album }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 flex flex-col gap-2 justify-between">
        <div>
          <h1 className="text-2xl font-bold">{album.title}</h1>
          <p className="text-lg font-bold">{album.artists[0].name}</p>
          <p className="text-lg font-bold">{album.year}</p>
          <div>
            <p className="text-sm uppercase">{album.genres.join(", ")}</p>
            <p className="text-xs uppercase">{album.styles.join(", ")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a className="block flex-1 text-center border border-black rounded-xl p-2 cursor-pointer hover:bg-black/10 transition-all duration-300" href={album.uri} target="_blank" rel="noopener noreferrer">
            details page
          </a>
          {/* filter if available on discogs */}
          <a className="block flex-1 text-center border border-black rounded-xl p-2 cursor-pointer hover:bg-black/10 transition-all duration-300" href={`https://www.discogs.com/sell/release/${album.id}`} target="_blank" rel="noopener noreferrer">
            get your copy
          </a>
        </div>
      </div>
      <div className="flex-1 aspect-square overflow-hidden rounded-xl">
        <img
          src={album.images[0].resource_url}
          alt={album.title}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

//album response
const AlbumResponse = ({ album }: { album: Album | null }) => {
  if (!album) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 border border-black rounded-xl">
      <AlbumCard album={album} />
      {/* filter if available on youtube */}
      {album.videos && album.videos[0] && (
        <VideoPlayer videoUrl={album.videos[0].uri} />
      )}
      <AppleMusicPlayer
        albumTitle={album.title}
        artistName={album.artists[0]?.name ?? ""}
      />
    </div>
  );
};

export default AlbumResponse;