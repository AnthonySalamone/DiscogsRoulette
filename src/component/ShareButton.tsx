import { useRef, useState } from "react";
import { shareLink, type ShareOutcome } from "../utils/share";

const FEEDBACK: Partial<Record<ShareOutcome, string>> = {
  copied: "Link copied!",
  failed: "Copy failed",
};

// `getUrl` plutôt qu'une url figée : le lien d'une liste n'est encodé qu'au clic
const ShareButton = ({
  getUrl,
  title,
  label = "share",
  className = "",
}: {
  getUrl: () => string;
  title: string;
  label?: string;
  className?: string;
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  return (
    <button
      type="button"
      className={`win95-raised p-2 cursor-pointer ${className}`}
      onClick={async () => {
        const outcome = await shareLink(getUrl(), title);
        const message = FEEDBACK[outcome];
        if (!message) return;
        setFeedback(message);
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setFeedback(null), 2000);
      }}
    >
      {feedback ?? label}
    </button>
  );
};

export default ShareButton;
