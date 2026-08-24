import type { AppleMusicEmbedProps } from "../types/appleMusicEmbed";

const AppleMusicEmbed = ({ embedUrl }: AppleMusicEmbedProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <iframe
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
