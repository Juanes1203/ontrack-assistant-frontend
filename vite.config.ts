import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    base: command === 'build' ? '/OnTrack_Assistant/' : '/',
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  // Solo agregar el proxy en desarrollo
  if (command === 'serve') {
    return {
      ...config,
      server: {
        host: "::",
        port: 8080,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
          '/api/straico': {
            target: 'https://api.straico.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/straico/, ''),
            secure: false,
          },
        },
      },
    };
  }

  return config;
});
