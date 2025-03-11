import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Ensure correct asset paths
  build: {
    outDir: "dist", // Default output folder
  },
  server: {
    historyApiFallback: true, // Ensure client-side routing works
  }
});
