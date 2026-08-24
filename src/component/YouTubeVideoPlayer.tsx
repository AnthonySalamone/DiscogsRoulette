import type { YouTubeVideoPlayerProps } from "../types/youTubeVideoPlayer";

const YouTubeVideoPlayer = ({ videoId }: YouTubeVideoPlayerProps) => {
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
