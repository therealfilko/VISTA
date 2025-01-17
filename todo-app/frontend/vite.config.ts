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
        changeOrigin: true
      },
      "/api": {
        target: "http://app:9000",
        changeOrigin: true
      }
    },
    watch: {
      usePolling: true,
    }
  },
  build: {
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  }
});
