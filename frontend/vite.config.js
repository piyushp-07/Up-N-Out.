// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // <- Make sure this is imported
import tailwindcss from "@tailwindcss/vite"; // <- Your new plugin

export default defineConfig({
  plugins: [
    react(), // <- Essential for React JSX
    tailwindcss(), // <- The Tailwind Vite plugin
  ],
  // (Keep your esbuild config if you still need it for .js files containing JSX)
  // esbuild: { ... }
});