import type { AlbumCardProps } from "../types/albumCard";
import { useFavorites } from "../hooks/useFavorites";
import { albumShareUrl } from "../utils/urlState";
import ShareButton from "./ShareButton";

const AlbumCard = ({ album }: AlbumCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(album.id);
  const artistName = album.artists?.[0]?.name;

  // mobile : pochette en haut sur toute la largeur (column-reverse, elle est 2e dans
  // le DOM), desktop : infos à gauche, pochette à droite
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-2 justify-between">
        <div>
          <h1 className="text-2xl font-bold">{album.title}</h1>
          {album.artists?.[0]?.name && (
            <p className="text-lg font-bold" style={{ color: "var(--win95-navy)" }}>
              {album.artists[0].name}
            </p>
          )}
          {album.year && (
            <p className="text-lg font-bold">{album.year}</p>
          )}
          {album.country && (
            <p className="text-lg font-bold">{album.country}</p>
          )}
          <div>
            {album.genres && album.genres.length > 0 && (
              <p className="text-sm uppercase" style={{ color: "var(--win95-gray-dark)" }}>
                {album.genres.join(", ")}
              </p>
            )}
            {album.styles && album.styles.length > 0 && (
              <p className="text-xs uppercase" style={{ color: "var(--win95-gray-dark)" }}>
                {album.styles.join(", ")}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="win95-raised flex-1 p-2 cursor-pointer"
              onClick={() => toggleFavorite(album)}
              aria-pressed={liked}
            >
              {liked ? "♥ liked" : "♡ like"}
            </button>
            <ShareButton
              className="flex-1"
              getUrl={() => albumShareUrl(String(album.id))}
              title={[artistName, album.title].filter(Boolean).join(" – ")}
            />
          </div>
          <div className="flex gap-2">
            {album.uri && (
              <a
                className="win95-raised block flex-1 text-center p-2 cursor-pointer"
                href={album.uri}
                target="_blank"
                rel="noopener noreferrer"
              >
                discogs page
              </a>
            )}
            <a
              className="win95-raised block flex-1 text-center p-2 cursor-pointer"
              href={`https://www.discogs.com/sell/release/${album.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              get your copy on discogs
            </a>
          </div>
        </div>
      </div>
      {album.images?.[0]?.resource_url && (
        // md:self-start : sans ça, la rangée flex étire la pochette à la hauteur de la
        // colonne de texte quand celle-ci est plus haute, et le ratio 1:1 saute
        <div className="win95-sunken flex-1 md:self-start aspect-square overflow-hidden p-1">
          <img
            src={album.images[0].resource_url}
            alt={album.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default AlbumCard;
