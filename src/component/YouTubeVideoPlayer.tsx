import type { YouTubeVideoPlayerProps } from "../types/youTubeVideoPlayer";

const getYouTubeId = (url: string) => {
  return url.split('v=')[1]?.split('&')[0];
};

const YouTubeVideoPlayer = ({ videoUrl }: YouTubeVideoPlayerProps) => {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        Watch the video on youtube
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

export default YouTubeVideoPlayer;