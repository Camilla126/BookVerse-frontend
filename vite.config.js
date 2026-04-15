import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ajuste a porta se necessário
        changeOrigin: true,
        secure: false,
      },
    },
  },
})