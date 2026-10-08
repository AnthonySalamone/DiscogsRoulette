import type { YouTubeVideoPlayerProps } from "../types/youTubeVideoPlayer";

const YouTubeVideoPlayer = ({ videoId }: YouTubeVideoPlayerProps) => {
  // key = videoId : une iframe neuve à chaque vidéo plutôt qu'un changement de src.
  // Naviguer une iframe existante ajoute une entrée à l'historique du navigateur, ce
  // qui casserait le bouton retour (un album = une entrée, cf. App.tsx)
  return (
    <iframe
      key={videoId}
      width="100%"
      height="auto"
      src={`https://www.youtube.com/embed/${videoId}`}
      allowFullScreen
      className="win95-sunken aspect-video w-full"
    />
  );
};

export default YouTubeVideoPlayer;
