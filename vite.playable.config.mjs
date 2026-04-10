import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";
import { existsSync, renameSync, rmSync } from "node:fs";

function renamePlayableHtmlPlugin() {
  return {
    name: "rename-playable-html",
    closeBundle() {
      const outDir = resolve(process.cwd(), "dist_vite");
      const from = resolve(outDir, "playable.index.html");
      const to = resolve(outDir, "index.html");
      if (existsSync(from)) {
        if (existsSync(to)) {
          rmSync(to, { force: true });
        }
        renameSync(from, to);
      }
    },
  };
}

export default defineConfig({
  plugins: [viteSingleFile({ useRecommendedBuildConfig: false }), renamePlayableHtmlPlugin()],
  base: "./",
  build: {
    outDir: "dist_vite",
    emptyOutDir: true,
    sourcemap: false,
    target: "es2018",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), "playable.index.html"),
      },
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
