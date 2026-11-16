import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [svelte()],
  base: "./",
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: "dist/ui",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/ui/popup.html"),
        default_popup: resolve(__dirname, "src/ui/default_popup.html"),
        options: resolve(__dirname, "src/ui/options.html"),
        tool: resolve(__dirname, "src/ui/tool.html"),
        workbench: resolve(__dirname, "src/ui/workbench.html")
      }
    }
  }
});
