import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   "/sso": {
    //     target: "http://localhost:8001",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/sso/, ""),
    //   },
    //   "/api": {
    //     target: "http://localhost:8002",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
});
