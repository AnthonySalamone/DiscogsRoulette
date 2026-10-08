import type { AppleMusicEmbedProps } from "../types/appleMusicEmbed";

const AppleMusicEmbed = ({ embedUrl }: AppleMusicEmbedProps) => {
  return (
    <div className="win95-sunken w-full overflow-hidden">
      {/* key : iframe neuve plutôt que changement de src, cf. YouTubeVideoPlayer */}
      <iframe
        key={embedUrl}
        title="Apple Music album preview"
        allow="autoplay *; encrypted-media *;"
        width="100%"
        height={450}
        src={embedUrl}
        className="w-full border-0"
      />
    </div>
  );
};

export default AppleMusicEmbed;
