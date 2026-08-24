import type { SoundCloudLinkProps } from "../types/soundCloudLink";

// Pas de lecteur intégré : l'API SoundCloud demande désormais un abonnement payant
// Artist Pro pour obtenir des credentials. On propose juste une recherche externe.
const SoundCloudLink = ({ albumTitle, artistName }: SoundCloudLinkProps) => {
  const query = [artistName, albumTitle].filter(Boolean).join(" ");
  const searchUrl = `https://soundcloud.com/search?q=${encodeURIComponent(query)}`;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <p className="text-sm text-black/60 max-w-sm">
        No inline preview here — SoundCloud's API now requires a paid Artist Pro
        subscription to search tracks.
      </p>
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-black rounded-xl px-4 py-2 hover:bg-black/10 transition-all duration-300"
      >
        Search on SoundCloud ↗
      </a>
    </div>
  );
};

export default SoundCloudLink;
