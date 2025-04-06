import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "FeastFinder",
        short_name: "FeastFinder",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffa500",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/, // Cache your Cloudinary images too
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
  },
});
