import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local dev: the browser calls /api/chat on the Vite server, which forwards it to
// your FastAPI app as /chat. Same origin for the browser, so main.py needs no CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
