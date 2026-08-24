import type { YouTubeVideoPlayerProps } from "../types/youTubeVideoPlayer";

const getYouTubeId = (url: string) => {
  return url.split('v=')[1]?.split('&')[0];
};

const YouTubeVideoPlayer = ({ videoUrl }: YouTubeVideoPlayerProps) => {
  const videoId = videoUrl ? getYouTubeId(videoUrl) : undefined;

  if (!videoId) {
    return <p className="text-sm text-center py-10">No YouTube video available.</p>;
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

export default YouTubeVideoPlayer;
