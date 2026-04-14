import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/chat': {
        target: 'https://emilee-unmystic-nonprepositionally.ngrok-free.dev/',
        changeOrigin: true,
      },
      '/search-images': {
        target: 'https://octastyle-overbearingly-xzavier.ngrok-free.dev/',
        changeOrigin: true,
      }
    }
  }
})
