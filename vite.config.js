import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      store: path.resolve(__dirname, "./src/store"),
    },
  },

  server: {
    allowedHosts: [
      '771b-198-44-138-170.ngrok-free.app',
      'localhost'
    ],
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Your Django/backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

