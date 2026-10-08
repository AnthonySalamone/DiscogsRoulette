type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

// Sur mobile : la feuille de partage native (WhatsApp, Messages…). Sur desktop :
// copie dans le presse-papiers — navigator.share y existe aussi (Safari, Chrome mac)
// mais ouvre un menu système moins pratique qu'un simple « lien copié ».
const shareLink = async (url: string, title: string): Promise<ShareOutcome> => {
  const isTouch = window.matchMedia?.("(pointer: coarse)").matches;
  if (isTouch && navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // autre échec : on retombe sur la copie
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
};

export { shareLink };
export type { ShareOutcome };
