import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Chrome's dev console logs ERR_CACHE_OPERATION_NOT_SUPPORTED on HTTP 206
// Range responses for video files because its disk cache refuses to store
// partial-content responses cleanly. Tagging /videos/* with no-store in
// dev tells Chrome not to try caching them; the message stops appearing
// without affecting playback. Production hosting (Vercel etc.) sets its
// own headers — this middleware never runs there.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'no-store-videos-in-dev',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/videos/')) {
            res.setHeader('Cache-Control', 'no-store');
          }
          next();
        });
      },
    },
  ],
  server: { port: 5173, host: true },
});
