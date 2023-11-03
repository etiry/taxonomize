import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://taxonomize-2a1906a55331.herokuapp.com/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      },
      '/auth': {
        target: 'https://taxonomize-2a1906a55331.herokuapp.com/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/auth/, ''),
        secure: false,
        ws: true
      },
    },
  },
})
