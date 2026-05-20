import { useEffect, useState } from "react";
import { getItunesURL } from "../services/getItunesURL";
import type { AppleMusicEmbedProps } from "../types/appleMusicEmbed";

const AppleMusicEmbed = ({ albumTitle, artistName }: AppleMusicEmbedProps) => {
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

export default AppleMusicEmbed;