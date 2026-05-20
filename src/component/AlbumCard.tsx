import type { AlbumCardProps } from "../types/albumCard";

const AlbumCard = ({ album }: AlbumCardProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 flex flex-col gap-2 justify-between">
        <div>
          <h1 className="text-2xl font-bold">{album.title}</h1>
          <p className="text-lg font-bold">{album.artists[0].name}</p>
          <p className="text-lg font-bold">{album.year}</p>
          <div>
            <p className="text-sm uppercase">{album.genres.join(", ")}</p>
            <p className="text-xs uppercase">{album.styles.join(", ")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            className="block flex-1 text-center border border-black rounded-xl p-2 cursor-pointer hover:bg-black/10 transition-all duration-300"
            href={album.uri}
            target="_blank"
            rel="noopener noreferrer"
          >
            details page
          </a>
          <a
            className="block flex-1 text-center border border-black rounded-xl p-2 cursor-pointer hover:bg-black/10 transition-all duration-300"
            href={`https://www.discogs.com/sell/release/${album.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            get your copy
          </a>
        </div>
      </div>
      <div className="flex-1 aspect-square overflow-hidden rounded-xl">
        <img
          src={album.images[0].resource_url}
          alt={album.title}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default AlbumCard;