import { SITE_CONFIG } from './composables/globalData';

export default defineNuxtConfig({
  // Add compatibility date
  compatibilityDate: '2024-11-17',

  // Add auto-imports for composables
  imports: {
    dirs: ['composables/**']
  },

  // Update modules configuration
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'acceptHMRUpdate'],
    }]
  ],

  // Keep Google Fonts config
  googleFonts: {
    families: {
      'Open+Sans': [300, 400, 600, 700],
      'Oswald': [300, 400, 600, 700],
      'Inter': [300, 400, 600, 700],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
    download: true,
  },

  // Update Tailwind config
  tailwindcss: {
    cssPath: '~/assets/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  // Keep existing CSS imports
  css: [
    '~/assets/main.css', // Add your main CSS file
    'swiper/css',
    'swiper/css/pagination',
    'swiper/css/navigation',
  ],

  // Keep existing build config
  build: {
    transpile: ['gsap'],
  },

  // Keep SSR and Cloudflare config
  ssr: true,
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      dir: '.output',
      publicDir: '.output/public'
    },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/promotion/50freespins', '/promotion/upto500']
    }
  },

  // Keep route rules
  routeRules: {
    '/**': { isr: true }
  },

  experimental: {
    payloadExtraction: false
  },

  // Keep existing plugins
  plugins: [
    '~/plugins/language.js',
    '~/plugins/hreflang.js',
    '~/plugins/vue-gtm.client.js',
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      gtmId: SITE_CONFIG.gtmId
    }
  },

  // Keep app head config
  app: {
    head: {
      title: 'Jazzy Spins',
      meta: [
        { name: 'description', content: "Jazzy Spins - Premium Online Casino with the best games and promotions" }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined'
        }
      ],
    }
  },
})