import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    headers: {
      "Content-Type": "application/javascript",
    },
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
  },
  build: {
    sourcemap: true,
    manifest: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});

