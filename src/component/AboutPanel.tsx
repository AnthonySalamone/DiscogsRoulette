import Win95Dialog from "./Win95Dialog";

const LINK_STYLE = { color: "var(--win95-navy)" };

const AboutPanel = ({ onClose }: { onClose: () => void }) => {
  return (
    <Win95Dialog title="About Discogs Roulette" onClose={onClose}>
      <div className="win95-sunken p-4 flex gap-4 items-start">
        <span className="text-4xl shrink-0" aria-hidden="true">💿</span>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="text-lg font-bold">Discogs Roulette</p>
            <p>
              Spin a random record from Discogs, filter it by year, genre and style, and
              listen to it right away.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p>
              Made by <strong>Anthony Salamone</strong>, developer and vinyl addict who
              spends way too much time digging on Discogs.
            </p>
            <p>
              <a
                href="https://www.discogs.com/seller/anthonysa/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={LINK_STYLE}
              >
                Check out my record shop on Discogs ↗
              </a>
              {" · "}
              <a
                href="https://www.linkedin.com/in/anthony-salamone-377397306"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={LINK_STYLE}
              >
                LinkedIn ↗
              </a>
              {" · "}
              <a
                href="https://github.com/AnthonySalamone/DiscogsRoulette"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={LINK_STYLE}
              >
                source code on GitHub ↗
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* le QR ne sert qu'à scanner depuis un téléphone quand on est sur desktop */}
            <img
              src="/paypal-qr.png"
              alt="QR code to support me on PayPal"
              className="hidden md:block w-24 h-24 shrink-0 bg-white"
            />
            <div className="flex flex-col gap-2 items-start">
              <p>Enjoying the digging? You can support the project (and my record habit):</p>
              <a
                href="https://paypal.me/AnthonySalamone106"
                target="_blank"
                rel="noopener noreferrer"
                className="win95-raised px-3 py-1"
              >
                Support me on PayPal ↗
              </a>
            </div>
          </div>
          <p>
            Record data from{" "}
            <a href="https://www.discogs.com" target="_blank" rel="noopener noreferrer" className="underline" style={LINK_STYLE}>
              Discogs
            </a>
            . Previews from YouTube and Apple Music.
          </p>
          {/* mention demandée par les conditions d'utilisation de l'API Discogs */}
          <p className="text-xs" style={{ color: "var(--win95-gray-dark)" }}>
            This application uses Discogs' API but is not affiliated with, sponsored or
            endorsed by Discogs. 'Discogs' is a trademark of Zink Media, LLC.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="win95-raised px-6 py-1 cursor-pointer" onClick={onClose}>
          OK
        </button>
      </div>
    </Win95Dialog>
  );
};

export default AboutPanel;
