import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/zoom-earth': {
        target: 'https://tiles.zoom.earth',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zoom-earth/, ''),
        headers: {
          'Origin': 'https://zoom.earth',
          'Referer': 'https://zoom.earth/'
        }
      }
    }
  }
})
