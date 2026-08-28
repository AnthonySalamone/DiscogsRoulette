import { useEffect, useState } from "react";
import { extractDominantColor } from "../utils/dominantColor";

/**
 * undefined = pas d'album -> fond par défaut, null = extraction terminée mais
 * échouée, string = couleur hex trouvée.
 *
 * Contrairement à useAppleMusicEmbedUrl, le résultat n'est volontairement PAS
 * remis à zéro dès que imageUrl change : le temps de calculer la couleur du
 * nouvel album, on continue de renvoyer celle de l'album précédent. Sinon le
 * fond retombe brièvement sur l'anthracite par défaut entre deux pochettes
 * (rouge -> anthracite -> jaune) au lieu d'un fondu direct (rouge -> jaune).
 */
const useDominantColor = (imageUrl: string | undefined) => {
  const [lastResolved, setLastResolved] = useState<{ url: string; hex: string | null } | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    let cancelled = false;

    extractDominantColor(imageUrl).then((hex) => {
      if (!cancelled) setLastResolved({ url: imageUrl, hex });
    });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  if (!imageUrl) return undefined;
  return lastResolved?.hex ?? undefined;
};

export { useDominantColor };
