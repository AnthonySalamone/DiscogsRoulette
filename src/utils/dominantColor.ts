const IMAGE_PROXY_BASE = "/api/image-proxy";

// une pochette noire + typo vert fluo doit donner du vert fluo, pas du noir/gris —
// donc on ne cherche pas "la couleur la plus fréquente", on cherche la couleur la
// plus *vive* parmi celles qui sont assez présentes. En dessous de ces seuils une
// couleur est considérée grise/noire/blanche, peu importe sa fréquence.
const MIN_SATURATION = 0.35;
const MIN_LIGHTNESS = 0.15;
const MAX_LIGHTNESS = 0.85;

const rgbToHsl = (r: number, g: number, b: number): { s: number; l: number } => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { s: 0, l };
  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  return { s, l };
};

/**
 * Charge la pochette via le proxy same-origin (voir api/image-proxy.ts — les images
 * Discogs n'ont pas d'en-tête CORS, donc dessiner directement leur URL sur un canvas
 * le rend "tainted" et getImageData() lève une SecurityError) puis calcule sa
 * couleur d'accent : la couleur vive la plus présente, pas la couleur la plus
 * fréquente tout court (sinon un fond noir/gris écrase systématiquement un accent
 * minoritaire, genre une typo vert fluo sur pochette noire).
 */
const extractDominantColor = (imageUrl: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const size = 48;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 128) continue;
          // quantise à 24 niveaux par canal pour regrouper les pixels proches — clampé
          // à 255 car arrondir un canal proche du max (ex. 255) peut dépasser la borne
          // (255/24 → arrondi à 11×24 = 264) et produire un hex invalide
          const qr = Math.min(255, Math.round(r / 24) * 24);
          const qg = Math.min(255, Math.round(g / 24) * 24);
          const qb = Math.min(255, Math.round(b / 24) * 24);
          const key = `${qr},${qg},${qb}`;
          const bucket = buckets.get(key) ?? { count: 0, r: qr, g: qg, b: qb };
          bucket.count += 1;
          buckets.set(key, bucket);
        }

        if (buckets.size === 0) {
          resolve(null);
          return;
        }

        const candidates = [...buckets.values()].map((b) => ({ ...b, ...rgbToHsl(b.r, b.g, b.b) }));

        const vivid = candidates.filter(
          (c) => c.s >= MIN_SATURATION && c.l >= MIN_LIGHTNESS && c.l <= MAX_LIGHTNESS,
        );

        // parmi les couleurs vives : la plus présente, en favorisant quand même la
        // plus saturée à fréquence comparable (le vrai néon plutôt qu'une teinte pâle)
        // pas de couleur vive du tout (pochette vraiment mono) : retombe sur la plus
        // saturée disponible, même terne, plutôt que sur un gris pur
        const pool = vivid.length > 0 ? vivid : candidates;
        const scoreOf = (c: (typeof candidates)[number]) =>
          vivid.length > 0 ? c.count * c.s : c.count * (0.35 + c.s);
        const best = pool.sort((a, b) => scoreOf(b) - scoreOf(a))[0];

        const hex = `#${[best.r, best.g, best.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
        resolve(hex);
      } catch {
        // canvas "tainted" (CORS) ou autre échec de lecture pixel : le fond garde sa teinte par défaut
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = `${IMAGE_PROXY_BASE}?url=${encodeURIComponent(imageUrl)}`;
  });
};

export { extractDominantColor };
