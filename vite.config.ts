/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'IRON QUEST',
        short_name: 'Iron Quest',
        description: 'Coach + nutritionniste de poche transformé en jeu de rôle.',
        start_url: '/',
        display: 'standalone',
        background_color: '#14171d',
        theme_color: '#14171d',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Le nouveau SW prend la main immédiatement (au lieu d'attendre la fermeture de tous les
        // onglets) : réduit la fenêtre où un onglet resté ouvert référence des chunks JS d'un
        // déploiement précédent qui n'existent plus sur le serveur.
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
