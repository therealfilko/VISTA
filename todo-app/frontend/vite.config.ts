import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/auth": {
        target: "http://app:9000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://app:9000",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
    // Fallback für SPA
    middlewareMode: false,
    fs: {
      strict: false, // Verhindert restriktive File-Zugriffe
    },
  },
  build: {
    sourcemap: true,
    manifest: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});

