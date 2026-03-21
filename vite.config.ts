/// <reference types="vitest" />
import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 4040,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": [
            "@reduxjs/toolkit",
            "react-redux",
          ],
          "vendor-sentry": [
            "@sentry/react",
          ],
          "vendor-stripe": [
            "@stripe/react-stripe-js",
            "@stripe/stripe-js",
          ],
          "vendor-charts": ["recharts"],
          "vendor-maps": ["@react-google-maps/api"],
          "vendor-ui": ["lucide-react", "zod"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-redux"],
  },
});
