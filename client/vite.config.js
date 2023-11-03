import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      },
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/auth/, ''),
        secure: false,
        ws: true
      },
    },
  },
})
