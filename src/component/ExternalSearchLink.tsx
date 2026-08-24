import type { ExternalSearchLinkProps } from "../types/externalSearchLink";

// Pas de preview intégrée possible (API fermée/payante côté service) : juste une
// recherche externe. Partagé par les onglets Spotify et SoundCloud.
const ExternalSearchLink = ({ serviceName, searchUrl, note }: ExternalSearchLinkProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      {note && (
        <p className="text-sm max-w-sm" style={{ color: "var(--win95-gray-dark)" }}>
          {note}
        </p>
      )}
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="win95-raised px-4 py-2"
      >
        Search on {serviceName} ↗
      </a>
    </div>
  );
};

export default ExternalSearchLink;
