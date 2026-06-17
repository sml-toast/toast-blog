import { defineConfig } from 'vite'
export default defineConfig({
  base: '/toast-blog/',
  server: { port: 5173 },
  build: { assetsInlineLimit: 0 }
})
