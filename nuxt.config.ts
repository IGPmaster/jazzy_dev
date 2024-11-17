export default defineNuxtConfig({
  // Add compatibility date
  compatibilityDate: '2024-11-17',

  // Add auto-imports for composables
  imports: {
    dirs: ['composables/**']
  },

  // Keep existing modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
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
      fallback: true,
      crawlLinks: true,
      routes: ['/']
    }
  },

  // Keep route rules
  routeRules: {
    '/**': { isr: true }
  },

  experimental: {
    payloadExtraction: false
  },

  // Keep plugins
  plugins: [
    '~/plugins/language.js',
    '~/plugins/hreflang.js',
  ],

  // Keep app head config
  app: {
    head: {
      title: 'Jazzy Spins',
      meta: [
        { name: 'description', content: "Jazzy" }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ],
    }
  },
})