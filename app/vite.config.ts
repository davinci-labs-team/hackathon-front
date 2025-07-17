import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  css: {
    postcss: './postcss.config.ts',
  }
})
