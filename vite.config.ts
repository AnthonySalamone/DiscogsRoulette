import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // lit .env.local (jamais commité) — même variable que celle attendue par
  // api/discogs/[...path].ts en prod sur Vercel
  const env = loadEnv(mode, process.cwd(), "");
  const discogsToken = env.DISCOGS_TOKEN;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api/discogs": {
          target: "https://api.discogs.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/discogs/, ""),
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
