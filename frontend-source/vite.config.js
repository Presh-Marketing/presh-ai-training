import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendOrigin = env.VITE_BACKEND_ORIGIN || 'http://localhost:5000'
  return {
    plugins: [react(),tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/auth': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
