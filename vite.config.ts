/// <reference types="vitest/config" />
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  test: {
    globals: true,
    // Default environment for unit tests
    environment: "jsdom",

    // Exclude Playwright test files (seed.spec.ts and visual tests)
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/*.spec.ts', // Exclude Playwright spec files
      '**/tests/visual/**', // Exclude visual tests
    ],

    // Browser mode configuration
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: "chromium" },
      ],
      headless: true,
    },
  },
});
