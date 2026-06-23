import { defineConfig } from 'vite'
export default defineConfig({
  // Use root base for development so that localhost:5173 serves correctly.
  base: '/',
  server: { 
    port: 5173,
    host: '0.0.0.0',
    strictPort: false
  },
  build: { assetsInlineLimit: 0 }
})
