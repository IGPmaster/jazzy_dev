export default defineNuxtConfig({
  // Keep SSR true for Cloudflare Pages
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],
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
  },  // Added closing brace here
  tailwindcss: {
    cssPath: '~/assets/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
  css: [
    'swiper/css',
    'swiper/css/pagination',
    'swiper/css/navigation',
  ],

  build: {
    transpile: ['gsap'],
  },
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
  routeRules: {
    '/**': { isr: true }
  },
  experimental: {
    payloadExtraction: false
  },
  plugins: [
    '~/plugins/language.js',
    '~/plugins/hreflang.js',
  ],
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
});