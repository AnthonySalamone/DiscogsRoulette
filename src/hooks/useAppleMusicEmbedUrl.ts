import { useEffect, useState } from "react";
import { getItunesURL } from "../services/getItunesURL";

/**
 * undefined = recherche en cours, null = pas de preview trouvée, string = URL d'embed.
 * Extrait en hook (plutôt que dans AppleMusicEmbed) car EmbedTabs a besoin du résultat
 * pour décider si l'onglet Apple Music doit même être affiché.
 */
const useAppleMusicEmbedUrl = (albumTitle: string, artistName: string) => {
  const key = `${albumTitle}::${artistName}`;
  // { key, url } : à quelle recherche correspond le résultat stocké — permet de dériver
  // "en cours" pendant le render sans setState synchrone dans l'effect
  // (cf. https://react.dev/learn/you-might-not-need-an-effect)
  const [result, setResult] = useState<{ key: string; url: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;

    getItunesURL(albumTitle, artistName).then((url) => {
      if (!cancelled) setResult({ key, url });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumTitle, artistName]);

  return result?.key === key ? result.url : undefined;
};

export { useAppleMusicEmbedUrl };
