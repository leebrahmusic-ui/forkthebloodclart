import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            ssr: "resources/js/ssr.jsx",
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
            "@/Components": path.resolve(__dirname, "resources/js/Components"),
        },
    },
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: false,
        cors: {
            origin: "*",
            credentials: true,
        },
        hmr: {
            host: process.env.VITE_HMR_HOST || "localhost",
            port: 5173,
        },
    },
});
