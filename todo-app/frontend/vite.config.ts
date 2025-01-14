import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
    },
    strictPort: true,
    hmr: {
      clientPort: 3000,
      host: "0.0.0.0",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
