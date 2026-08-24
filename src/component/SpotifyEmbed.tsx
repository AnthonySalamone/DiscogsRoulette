import { useEffect, useState } from "react";
import { getSpotifyEmbedUrl } from "../services/getSpotifyEmbedUrl";
import type { SpotifyEmbedProps } from "../types/spotifyEmbed";

const SpotifyEmbed = ({ albumTitle, artistName }: SpotifyEmbedProps) => {
  const key = `${albumTitle}::${artistName}`;
  // même pattern que AppleMusicEmbed : dérive "en cours" pendant le render, pas de
  // setState synchrone dans l'effect (cf. react-hooks/set-state-in-effect)
  const [result, setResult] = useState<{ key: string; url: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSpotifyEmbedUrl(albumTitle, artistName).then((url) => {
      if (!cancelled) setResult({ key, url });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumTitle, artistName]);

  const isLoading = result?.key !== key;

  if (isLoading) {
    return <p className="text-sm text-center py-10">Loading…</p>;
  }

  if (!result?.url) {
    return <p className="text-sm text-center py-10">No Spotify preview available.</p>;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <iframe
        title="Spotify album preview"
        width="100%"
        height={352}
        src={result.url}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="w-full border-0"
      />
    </div>
  );
};

export default SpotifyEmbed;
