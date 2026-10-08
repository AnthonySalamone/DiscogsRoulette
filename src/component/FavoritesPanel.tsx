import type { ReactNode } from "react";
import type { Favorite } from "../types/favorite";
import Win95Dialog from "./Win95Dialog";

// Sert pour ses propres favoris (avec ✕ par ligne) comme pour une liste partagée reçue
// par lien (lecture seule) — seules les actions du bas changent.
const FavoritesPanel = ({
  title,
  favorites,
  emptyMessage,
  onOpen,
  onRemove,
  onClose,
  actions,
}: {
  title: string;
  favorites: Favorite[];
  emptyMessage: string;
  onOpen: (id: string) => void;
  onRemove?: (id: string) => void;
  onClose: () => void;
  actions?: ReactNode;
}) => {
  return (
    <Win95Dialog title={`♥ ${title}`} onClose={onClose}>
      {favorites.length === 0 ? (
        <p className="win95-sunken p-4 text-center text-sm">{emptyMessage}</p>
      ) : (
        <ul className="win95-sunken max-h-80 overflow-y-auto">
          {favorites.map((favorite) => (
            <li key={favorite.id} className="flex items-center gap-2 p-1 hover:bg-[var(--win95-highlight)]">
              <button
                type="button"
                className="flex flex-1 items-center gap-2 text-left cursor-pointer min-w-0"
                onClick={() => onOpen(favorite.id)}
              >
                {favorite.thumb ? (
                  <img src={favorite.thumb} alt="" className="w-10 h-10 object-cover shrink-0" />
                ) : (
                  <span className="w-10 h-10 shrink-0 flex items-center justify-center text-xl" aria-hidden="true">
                    💿
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-bold truncate">{favorite.title}</span>
                  <span className="block text-sm truncate" style={{ color: "var(--win95-gray-dark)" }}>
                    {[favorite.artist, favorite.year].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </button>
              {onRemove && (
                <button
                  type="button"
                  className="win95-raised w-7 h-7 text-xs cursor-pointer shrink-0"
                  onClick={() => onRemove(favorite.id)}
                  aria-label={`Remove ${favorite.title} from favorites`}
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {actions && <div className="flex gap-2 justify-end">{actions}</div>}
    </Win95Dialog>
  );
};

export default FavoritesPanel;
