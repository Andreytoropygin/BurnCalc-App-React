import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  base: '/BurnCalc-App-React/',
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      injectRegister: 'inline', 
      registerType: 'autoUpdate',
      workbox: {
        globIgnores: ['**/ort-wasm-simd-threaded.asyncify-*.wasm']
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'BurnCalc',
        short_name: 'BC',
        description: 'Расчет количества вещества по продуктам сгорания',
        theme_color: '#5389ae',
        background_color: '#def',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
    })
  ]
})
