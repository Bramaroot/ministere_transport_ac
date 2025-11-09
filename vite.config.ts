import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
 
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({

  plugins: [react()],
  server: {
    host: true, // This exposes the server to your network
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
