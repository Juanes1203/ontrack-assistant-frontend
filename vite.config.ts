import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    base: '/mentorai-virtual-teacher/',
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
