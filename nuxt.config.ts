// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],

  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },

  app: {
    head: {
      title: 'Splito - Split Expenses Fairly',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Splito is an open-source expense sharing app. Split bills with friends, track group expenses, and settle up in any currency.',
        },
        { name: 'theme-color', content: '#10B981' },
        { property: 'og:title', content: 'Splito - Split Expenses Fairly' },
        {
          property: 'og:description',
          content:
            'Open-source expense sharing app. Split bills, track expenses, settle in any currency.',
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
})
