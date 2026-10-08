import { useCallback, useEffect, useState } from "react";
import AlbumResponse from "./component/albumResponce";
import AlbumFinder from "./component/albumFinder";
import FavoritesPanel from "./component/FavoritesPanel";
import ShareButton from "./component/ShareButton";
import { useGenreOptions } from "./hooks/useGenreOptions";
import { useStylesOptions } from "./hooks/useStylesOptions";
import { useDominantColor } from "./hooks/useDominantColor";
import { useFavorites } from "./hooks/useFavorites";
import { getAlbumById } from "./services/getAlbumById";
import type { Album, AlbumSearchResult } from "./types/albumResponce";
import { formatYear, yearModeOf, type YearMode } from "./component/select";
import { buildSearch, listShareUrl, readUrlState } from "./utils/urlState";
import { decodeSharedList, encodeSharedList } from "./utils/sharedList";

const BASE_TITLE = "Discogs Roulette 🪩";

function App() {
  // l'URL est lue une seule fois pour l'état initial (lien partagé, rechargement) ;
  // ensuite c'est l'effect plus bas qui la tient à jour, et popstate qui la relit
  const [initialUrl] = useState(readUrlState);
  const [genre, setGenre] = useState<string>(initialUrl.genre);
  const [year, setYear] = useState<string>(initialUrl.year);
  const [yearMode, setYearMode] = useState<YearMode>(() => yearModeOf(initialUrl.year));
  const [style, setStyle] = useState<string>(initialUrl.style);
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumError, setAlbumError] = useState<string | null>(null);
  // un lien ?release=… démarre directement en chargement (cf. l'effect de montage)
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(initialUrl.release));
  const [sharedListParam, setSharedListParam] = useState<string>(initialUrl.list);
  const [showFavorites, setShowFavorites] = useState(false);

  const { favorites, removeFavorite, addFavorites } = useFavorites();
  const sharedList = sharedListParam ? decodeSharedList(sharedListParam) : null;

  // couleur dominante de la pochette trouvée — undefined/null retombe sur
  // l'anthracite par défaut défini dans index.css (background du body)
  const dominantColor = useDominantColor(album?.images?.[0]?.resource_url);

  const { genreOptions, isLoading: isGenresLoading } = useGenreOptions();
  // ne montre que les styles qui existent réellement dans le genre choisi
  // (tous les styles si aucun genre sélectionné)
  const { styleOptions, isLoading: isStylesLoading } = useStylesOptions(genre);
  const isOptionsLoading = isGenresLoading || isStylesLoading;
  const selectHasOptions =
    genreOptions.length > 0 && styleOptions.length > 0;

  // "Jazz · Bebop · 1959" — partagé entre l'onglet du navigateur et la barre de titre Win95
  const filterSummary = [genre, style, year && formatYear(year)]
    .filter(Boolean)
    .join(" · ");

  // synchronisation avec un système externe (le <title> du document), pas un setState :
  // un effect est légitime ici
  useEffect(() => {
    document.title = filterSummary ? `${filterSummary} — ${BASE_TITLE}` : BASE_TITLE;
  }, [filterSummary]);

  // résultat d'un chargement par id (lien partagé, favori, bouton retour)
  const showRelease = useCallback((result: AlbumSearchResult) => {
    if (result.status === "ok") {
      setAlbum(result.album);
      setAlbumError(null);
    } else {
      setAlbum(null);
      setAlbumError(
        result.status === "empty"
          ? "This release doesn't exist on Discogs (anymore?)."
          : "Too many requests. Wait a minute and try again."
      );
    }
    setIsLoading(false);
  }, []);

  const openRelease = useCallback(
    (id: string) => {
      setIsLoading(true);
      setAlbumError(null);
      getAlbumById(id).then(showRelease);
    },
    [showRelease]
  );

  // lien partagé ?release=… : isLoading est déjà à true depuis le useState, on ne
  // fait ici que l'appel (pas de setState synchrone dans l'effect)
  useEffect(() => {
    if (!initialUrl.release) return;
    let cancelled = false;
    getAlbumById(initialUrl.release).then((result) => {
      if (!cancelled) showRelease(result);
    });
    return () => {
      cancelled = true;
    };
  }, [initialUrl.release, showRelease]);

  // bouton retour/avant du navigateur : on relit l'URL et on remet l'app dans cet état
  // (les albums déjà vus sortent du cache de getAlbumById, sans appel Discogs)
  useEffect(() => {
    const onPopState = () => {
      const state = readUrlState();
      setGenre(state.genre);
      setStyle(state.style);
      setYear(state.year);
      setYearMode(yearModeOf(state.year));
      setSharedListParam(state.list);
      if (state.release) {
        openRelease(state.release);
      } else {
        setAlbum(null);
        setAlbumError(null);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [openRelease]);

  // l'URL suit l'état (synchronisation avec un système externe, l'historique) :
  // nouvel album → pushState, pour que le bouton retour ramène au précédent ;
  // simple changement de filtre → replaceState, pour ne pas polluer l'historique.
  // Rien pendant un chargement, sinon le ?release= d'un lien partagé serait effacé
  // avant même que l'album arrive.
  useEffect(() => {
    if (isLoading) return;
    const albumId = album ? String(album.id) : "";
    const next = buildSearch({ release: albumId, genre, style, year, list: sharedListParam });
    if (next === window.location.search) return;

    const currentRelease = new URLSearchParams(window.location.search).get("release") ?? "";
    const url = next || window.location.pathname;
    if (albumId && albumId !== currentRelease) {
      window.history.pushState(null, "", url);
    } else {
      window.history.replaceState(null, "", url);
    }
  }, [isLoading, album, genre, style, year, sharedListParam]);

  const openFavorite = (id: string) => {
    setShowFavorites(false);
    openRelease(id);
  };

  return (
    <div
      className="min-h-screen py-6 md:py-10 px-2 md:px-4 transition-colors duration-700"
      style={{ backgroundColor: dominantColor ?? undefined }}
    >
      <div className="win95-window max-w-3xl mx-auto">
        {/* barre de titre */}
        <div className="win95-titlebar flex items-center justify-between px-2 py-1">
          <span className="font-bold text-sm flex items-center gap-1.5 min-w-0">
            <span className="truncate">
              💿 Discogs Roulette.exe{filterSummary && ` - ${filterSummary}`}
            </span>
          </span>
          <div className="flex gap-1">
            <button className="win95-titlebar-btn w-5 h-5 text-xs" aria-hidden="true">
              _
            </button>
            <button className="win95-titlebar-btn w-5 h-5 text-xs" aria-hidden="true">
              □
            </button>
            <button className="win95-titlebar-btn w-5 h-5 text-xs" aria-hidden="true">
              ✕
            </button>
          </div>
        </div>

        {/* barre de menu */}
        <div
          className="text-sm px-2 py-1 border-b-2 border-[var(--win95-gray-dark)]"
          style={{ background: "var(--win95-gray)" }}
        >
          <span className="mr-4">File</span>
          <span className="mr-4">Edit</span>
          <span className="mr-4">View</span>
          <button
            type="button"
            className={`mr-4 px-1 cursor-pointer ${showFavorites ? "win95-sunken" : ""}`}
            onClick={() => setShowFavorites((open) => !open)}
            aria-expanded={showFavorites}
          >
            Favorites ({favorites.length})
          </button>
          <span>Help</span>
        </div>

        {/* contenu */}
        <div className="p-3 md:p-5" style={{ background: "var(--win95-gray)" }}>
          {isOptionsLoading && <p className="text-lg text-center">Loading…</p>}

          {!isOptionsLoading && !selectHasOptions && (
            <div className="win95-sunken p-4 text-center">
              <p className="text-lg">Too many requests. Wait a minute and reload the page.</p>
              <p className="text-sm">Discogs Roulette allows 25 requests per minute.</p>
            </div>
          )}

          {sharedList && (
            <FavoritesPanel
              title={`Shared favorites (${sharedList.length})`}
              favorites={sharedList}
              emptyMessage="This shared list is empty."
              onOpen={openRelease}
              onClose={() => setSharedListParam("")}
              actions={
                <button
                  type="button"
                  className="win95-raised px-3 py-1 cursor-pointer text-sm"
                  disabled={sharedList.every((f) => favorites.some((mine) => mine.id === f.id))}
                  onClick={() => addFavorites(sharedList)}
                >
                  Add all to my favorites
                </button>
              }
            />
          )}

          {sharedListParam && !sharedList && (
            <div className="win95-sunken p-4 mb-4 text-center">
              <p>This shared list link looks broken (maybe cut off when it was pasted?).</p>
            </div>
          )}

          {showFavorites && (
            <FavoritesPanel
              title={`My favorites (${favorites.length})`}
              favorites={favorites}
              emptyMessage="No favorites yet — hit ♡ like on an album you dig."
              onOpen={openFavorite}
              onRemove={removeFavorite}
              onClose={() => setShowFavorites(false)}
              actions={
                favorites.length > 0 && (
                  <ShareButton
                    className="px-3 py-1 text-sm"
                    label="Share my list"
                    title="My Discogs Roulette favorites"
                    getUrl={() => listShareUrl(encodeSharedList(favorites))}
                  />
                )
              }
            />
          )}

          {!isOptionsLoading && selectHasOptions && (
            <>
              <AlbumFinder
                genre={genre}
                year={year}
                yearMode={yearMode}
                style={style}
                genreOptions={genreOptions}
                styleOptions={styleOptions}
                isLoading={isLoading}
                setGenre={setGenre}
                setYear={setYear}
                setYearMode={setYearMode}
                setStyle={setStyle}
                setAlbum={setAlbum}
                setAlbumError={setAlbumError}
                setIsLoading={setIsLoading}
              />
              {(isLoading || album || albumError) && (
                <AlbumResponse album={album} error={albumError} />
              )}
            </>
          )}
        </div>

        {/* barre de statut */}
        <div className="win95-sunken mx-2 mb-2 px-2 py-1 text-xs">
          Digging for music since 2026
        </div>
      </div>
    </div>
  );
}

export default App;
