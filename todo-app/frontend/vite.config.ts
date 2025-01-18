import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        hmr: {
            host: "188.245.213.55",
            port: 3000, 
        }
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    build: {
        manifest: true,
    },
});

