import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  css: {
    postcss: './postcss.config.ts',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: ['localhost', 'intriqathon-frontend-dhu8bm-9b4abe-51-15-223-131.traefik.me', '51.15.223.131'],
  },
})
