import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Mirroir dev de api/image-proxy.ts. Contrairement à /api/discogs (une seule cible
// fixe, api.discogs.com), la cible ici varie par requête (?url=<image discogs
// complète>) — pas exprimable avec la simple config déclarative de server.proxy,
// donc middleware fait-main plutôt qu'une entrée server.proxy de plus.
const imageProxyPlugin = (): Plugin => ({
  name: "discogs-image-proxy",
  configureServer(server) {
    server.middlewares.use("/api/image-proxy", async (req, res) => {
      const target = new URL(req.url ?? "", "http://x").searchParams.get("url");
      if (!target) {
        res.statusCode = 400;
        res.end("missing url param");
        return;
      }

      let targetUrl: URL;
      try {
        targetUrl = new URL(target);
      } catch {
        res.statusCode = 400;
        res.end("invalid url param");
        return;
      }
      const allowedHost =
        targetUrl.protocol === "https:" &&
        (targetUrl.hostname === "discogs.com" || targetUrl.hostname.endsWith(".discogs.com"));
      if (!allowedHost) {
        res.statusCode = 400;
        res.end("host not allowed");
        return;
      }

      const imageRes = await fetch(targetUrl, { headers: { "User-Agent": "DiscoRoulette/1.0" } });
      res.statusCode = imageRes.status;
      res.setHeader("Content-Type", imageRes.headers.get("content-type") || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (!imageRes.body) {
        res.end();
        return;
      }
      const reader = imageRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // lit .env.local (jamais commité) — même variable que celle attendue par
  // api/discogs.ts en prod sur Vercel
  const env = loadEnv(mode, process.cwd(), "");
  const discogsToken = env.DISCOGS_TOKEN;

  return {
    plugins: [react(), tailwindcss(), imageProxyPlugin()],
    server: {
      proxy: {
        "/api/discogs": {
          target: "https://api.discogs.com",
          changeOrigin: true,
          // même format que api/discogs.ts : le vrai chemin Discogs est dans ?path=...
          rewrite: (path) => new URL(path, "http://x").searchParams.get("path") ?? "/",
          configure: (proxy) => {
            if (!discogsToken) return;
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Discogs token=${discogsToken}`);
            });
          },
        },
      },
    },
  };
})
