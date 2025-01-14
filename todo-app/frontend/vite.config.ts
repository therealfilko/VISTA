import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Erlaubt Zugriff von extern (z. B. vom Docker-Container aus)
    port: 3000, // Entwicklungsport anpassen
    watch: {
      usePolling: true, // Notwendig für Dateisysteme wie Windows oder Docker-Mounts
    },
  },
});