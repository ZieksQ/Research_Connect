import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      "/user": "http://127.0.0.1:5000",
      "/survey": "http://127.0.0.1:5000",
      "/oauth": "http://127.0.0.1:5000",
      "/api": "http://127.0.0.1:5000",
    },
  },
});
