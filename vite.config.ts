import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
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
      allowedHosts: (env.ALLOWED_HOSTS || '').split(',').map(h => h.trim()),
    },
  }
})
