import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [
          [
            "@emotion/babel-plugin",
            {
              sourceMap: true,
              autoLabel: "dev-only",
              labelFormat: "[local]",
              cssPropOptimization: true,
            },
          ],
        ],
      },
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          injectScript: `
            // Preload critical chunks
            const preloadLinks = document.createElement('link');
            preloadLinks.rel = 'modulepreload';
            preloadLinks.href = '/src/main.tsx';
            document.head.appendChild(preloadLinks);
          `,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("@emotion")) {
              return "vendor-emotion";
            }
            if (id.includes("react")) {
              return "vendor-react";
            }
            if (id.includes("@mui")) {
              return "vendor-mui";
            }
            if (id.includes("markdown")) {
              return "vendor-markdown";
            }
            return "vendor";
          }
          if (id.includes("/components/")) {
            return "features";
          }
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "";
          if (name.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.includes("emotion")) {
            return "assets/emotion-[hash].js";
          }
          return "assets/[name]-[hash].js";
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: "esnext",
    modulePreload: {
      polyfill: true,
    },
  },
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/styled",
      "@emotion/babel-plugin",
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material"
    ],
    esbuildOptions: {
      target: "esnext"
    }
  },
  server: {
    open: true,
    cors: true,
  },
});
