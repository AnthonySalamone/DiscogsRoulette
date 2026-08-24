import type { ExternalSearchLinkProps } from "../types/externalSearchLink";

// Pas de preview intégrée possible (API fermée/payante côté service) : juste une
// recherche externe. Partagé par les onglets Spotify et SoundCloud.
const ExternalSearchLink = ({ serviceName, searchUrl, note }: ExternalSearchLinkProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      {note && <p className="text-sm text-black/60 max-w-sm">{note}</p>}
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-black rounded-xl px-4 py-2 hover:bg-black/10 transition-all duration-300"
      >
        Search on {serviceName} ↗
      </a>
    </div>
  );
};

export default ExternalSearchLink;
