import { defineConfig } from 'vite'
export default defineConfig({
  // Use root base for development so that localhost:5174 serves correctly.
  base: '/',
  server: { 
    port: 5174,
    host: '0.0.0.0',
    strictPort: false
  },
  build: { assetsInlineLimit: 0 }
})
