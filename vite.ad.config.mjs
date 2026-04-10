import { defineConfig } from "vite";
import { resolve } from "node:path";

const rawSingleLevel = Number.parseInt(process.env.PIXELFLOW_SINGLE_LEVEL || "", 10);
const singleLevel = Number.isInteger(rawSingleLevel) && rawSingleLevel > 0 ? rawSingleLevel : null;

export default defineConfig({
  build: {
    outDir: "dist_adbundle",
    emptyOutDir: true,
    sourcemap: false,
    target: "es2017",
    minify: "esbuild",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    lib: {
      entry: resolve(process.cwd(), "src/ad-playable-entry.js"),
      name: "PixelFlowPlayable",
      formats: ["iife"],
      fileName: () => "playable-bundle.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    __PIXELFLOW_SINGLE_LEVEL__: JSON.stringify(singleLevel),
    __PIXELFLOW_INITIAL_LEVEL__: JSON.stringify(singleLevel),
  },
});
