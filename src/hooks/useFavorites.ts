import { useSyncExternalStore } from "react";
import type { Album } from "../types/albumResponce";
import type { Favorite } from "../types/favorite";
import { cleanArtistName } from "../utils/searchQuery";

// Favoris stockés dans le navigateur (localStorage), sans backend ni compte : la liste
// vit sur cet appareil uniquement (le partage passe par utils/sharedList.ts).
// Store externe + useSyncExternalStore plutôt qu'un useState : AlbumCard (♥) et le
// panneau Favorites lisent la même liste, et l'event "storage" synchronise les onglets.

const STORAGE_KEY = "discogsroulette:favorites";

// localStorage peut être absent ou lever (navigation privée, site data bloquées) :
// on bascule alors sur une copie en mémoire, la liste marche le temps de la session
let storageAvailable = true;
let memoryRaw = "[]";

const readRaw = () => {
  if (storageAvailable) {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "[]";
    } catch {
      storageAvailable = false;
    }
  }
  return memoryRaw;
};

const listeners = new Set<() => void>();

const writeFavorites = (favorites: Favorite[]) => {
  const raw = JSON.stringify(favorites);
  memoryRaw = raw;
  if (storageAvailable) {
    try {
      localStorage.setItem(STORAGE_KEY, raw);
    } catch {
      storageAvailable = false;
    }
  }
  listeners.forEach((listener) => listener());
};

// useSyncExternalStore exige un snapshot stable : on ne reparse que si le JSON a changé
let lastRaw: string | null = null;
let lastFavorites: Favorite[] = [];
const getSnapshot = () => {
  const raw = readRaw();
  if (raw !== lastRaw) {
    lastRaw = raw;
    try {
      const parsed: unknown = JSON.parse(raw);
      lastFavorites = Array.isArray(parsed) ? (parsed as Favorite[]) : [];
    } catch {
      lastFavorites = [];
    }
  }
  return lastFavorites;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const toFavorite = (album: Album): Favorite => ({
  id: String(album.id),
  artist: cleanArtistName(album.artists?.[0]?.name ?? ""),
  title: album.title,
  year: album.year ? String(album.year) : "",
  thumb: album.images?.[0]?.uri150 ?? album.images?.[0]?.resource_url ?? "",
});

const useFavorites = () => {
  const favorites = useSyncExternalStore(subscribe, getSnapshot);

  const isFavorite = (id: string | number) => favorites.some((f) => f.id === String(id));

  // le plus récent en tête
  const toggleFavorite = (album: Album) => {
    const id = String(album.id);
    writeFavorites(
      isFavorite(id) ? favorites.filter((f) => f.id !== id) : [toFavorite(album), ...favorites]
    );
  };

  const removeFavorite = (id: string) => writeFavorites(favorites.filter((f) => f.id !== id));

  // import d'une liste partagée : seulement ceux qu'on n'a pas déjà, ordre conservé
  const addFavorites = (incoming: Favorite[]) => {
    const fresh = incoming.filter((f) => !isFavorite(f.id));
    if (fresh.length > 0) writeFavorites([...fresh, ...favorites]);
  };

  return { favorites, isFavorite, toggleFavorite, removeFavorite, addFavorites };
};

export { useFavorites };
