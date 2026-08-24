import { useState } from "react";
import type { Album } from "../types/albumResponce";
import YouTubeVideoPlayer from "./YouTubeVideoPlayer";
import AppleMusicEmbed from "./AppleMusicEmbed";
import SpotifyEmbed from "./SpotifyEmbed";
import SoundCloudLink from "./SoundCloudLink";

type TabId = "youtube" | "apple" | "spotify" | "soundcloud";

const TABS: { id: TabId; label: string }[] = [
  { id: "youtube", label: "YouTube" },
  { id: "apple", label: "Apple Music" },
  { id: "spotify", label: "Spotify" },
  { id: "soundcloud", label: "SoundCloud" },
];

const EmbedTabs = ({ album }: { album: Album }) => {
  const [activeTab, setActiveTab] = useState<TabId>("youtube");
  const artistName = album.artists?.[0]?.name ?? "";

  return (
    <div className="w-full">
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-black text-white"
                : "bg-black/5 hover:bg-black/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "youtube" && <YouTubeVideoPlayer videoUrl={album.videos?.[0]?.uri} />}
      {activeTab === "apple" && (
        <AppleMusicEmbed albumTitle={album.title} artistName={artistName} />
      )}
      {activeTab === "spotify" && (
        <SpotifyEmbed albumTitle={album.title} artistName={artistName} />
      )}
      {activeTab === "soundcloud" && (
        <SoundCloudLink albumTitle={album.title} artistName={artistName} />
      )}
    </div>
  );
};

export default EmbedTabs;
