// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // listens on all network interfaces
    port: 5173,
    allowedHosts: ["773bd5a9f864.ngrok-free.app"],
  },
});
