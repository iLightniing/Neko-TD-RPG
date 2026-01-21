// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron/simple'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  vite: {
    plugins: [
      tailwindcss(),
      electron({
        main: {
          entry: 'electron/main.ts', // Ton fichier point d'entrée
        },
        renderer: {}, // Active le support du rendu Electron
      }),
    ],
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@pinia/nuxt',
  ]
})