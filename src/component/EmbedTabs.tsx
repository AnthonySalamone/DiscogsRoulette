import { useState, type ReactNode } from "react";
import type { Album } from "../types/albumResponce";
import YouTubeVideoPlayer from "./YouTubeVideoPlayer";
import AppleMusicEmbed from "./AppleMusicEmbed";
import ExternalSearchLink from "./ExternalSearchLink";
import { useAppleMusicEmbedUrl } from "../hooks/useAppleMusicEmbedUrl";
import { getYouTubeVideoId } from "../utils/youtube";

type TabId = "youtube" | "apple" | "spotify" | "soundcloud";

const EmbedTabs = ({ album }: { album: Album }) => {
  const artistName = album.artists?.[0]?.name ?? "";
  const searchQuery = [artistName, album.title].filter(Boolean).join(" ");

  const youTubeVideoId = getYouTubeVideoId(album.videos?.[0]?.uri);
  const appleEmbedUrl = useAppleMusicEmbedUrl(album.title, artistName);

  // seuls YouTube et Apple Music dépendent d'un contenu trouvé ou non ; Spotify et
  // SoundCloud sont de simples liens de recherche, donc toujours affichés
  const tabs: { id: TabId; label: string; content: ReactNode }[] = [
    ...(youTubeVideoId
      ? [{ id: "youtube" as const, label: "YouTube", content: <YouTubeVideoPlayer videoId={youTubeVideoId} /> }]
      : []),
    ...(appleEmbedUrl
      ? [{ id: "apple" as const, label: "Apple Music", content: <AppleMusicEmbed embedUrl={appleEmbedUrl} /> }]
      : []),
    {
      id: "spotify",
      label: "Spotify",
      content: (
        <ExternalSearchLink
          serviceName="Spotify"
          searchUrl={`https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`}
          note="Spotify won't hand out free API access anymore — Premium subscription required just to ask nicely. Petty."
        />
      ),
    },
    {
      id: "soundcloud",
      label: "SoundCloud",
      content: (
        <ExternalSearchLink
          serviceName="SoundCloud"
          searchUrl={`https://soundcloud.com/search?q=${encodeURIComponent(searchQuery)}`}
          note="SoundCloud's pulling the same move — paid Artist Pro plan required for API access. Cheapskates, both of them."
        />
      ),
    },
  ];

  // l'onglet actif suit l'album affiché : dérivé pendant le render (pas un effect) pour
  // retomber sur le premier onglet dispo quand l'album change, cf. App.tsx / genre-style
  const [state, setState] = useState<{ albumId: string; activeTab: TabId }>({
    albumId: album.id,
    activeTab: tabs[0].id,
  });
  if (state.albumId !== album.id) {
    setState({ albumId: album.id, activeTab: tabs[0].id });
  }
  const activeTab = tabs.find((t) => t.id === state.activeTab) ?? tabs[0];

  return (
    <div className="w-full">
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setState({ albumId: album.id, activeTab: tab.id })}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
              tab.id === activeTab.id ? "bg-black text-white" : "bg-black/5 hover:bg-black/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab.content}
    </div>
  );
};

export default EmbedTabs;
