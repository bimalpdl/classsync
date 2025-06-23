import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  root: "client",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./client/src', import.meta.url)),
      "@shared": fileURLToPath(new URL('./shared', import.meta.url)),
      "@assets": fileURLToPath(new URL('./attached_assets', import.meta.url)),
    },
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});
