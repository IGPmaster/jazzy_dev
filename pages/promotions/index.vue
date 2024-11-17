<template>
  <div class="min-h-screen bg-jazzy-darkblue pt-44 pb-16">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 mb-12">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          <TranslatedText translation-key="promotions" />
        </h1>
        <p class="text-white/70 text-lg max-w-2xl mx-auto">
          Discover exclusive bonuses and rewards designed to enhance your gaming experience
        </p>
      </div>
    </div>

    <!-- Promotions Grid -->
    <div class="container mx-auto px-4">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-jazzy-yellow"></div>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500">{{ error.message }}</p>
      </div>

      <div v-else class="space-y-8">
        <TransitionGroup 
          name="promotion-list" 
          tag="div"
          appear
        >
          <div v-for="promo in pp_promotions" 
               :key="promo.code"
               class="bg-jazzy-blue/30 backdrop-blur-sm rounded-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Image Section -->
              <div class="relative group">
                <img 
                  :src="promo.bigImageUrl"
                  :alt="'Promotion banner: ' + promo.name"
                  :title="promo.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-jazzy-darkblue/90 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div class="absolute bottom-4 left-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                bg-jazzy-yellow text-jazzy-darkblue">
                      {{ promo.name }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-8 flex flex-col justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-4">{{ promo.title }}</h2>
                  <h3 class="text-xl text-jazzy-yellow mb-6">{{ promo.subTitle }}</h3>
                  
                  <div v-if="promo.disclaimer" 
                       class="prose prose-sm prose-invert max-w-none mb-6"
                       v-html="promo.disclaimer">
                  </div>
                </div>

                <div class="space-y-4">
                  <!-- Registration Link -->
                  <a :href="regLink"
                     class="inline-flex items-center justify-center w-full md:w-auto px-8 py-3 
                            bg-jazzy-red-secondary hover:bg-jazzy-red text-white rounded-lg
                            transform transition-all duration-300 hover:scale-105
                            font-medium tracking-wide uppercase">
                    <TranslatedText translation-key="see_more" />
                    <svg xmlns="http://www.w3.org/2000/svg" 
                         class="h-4 w-4 ml-2" 
                         viewBox="0 0 20 20" 
                         fill="currentColor">
                      <path fill-rule="evenodd" 
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                            clip-rule="evenodd" />
                    </svg>
                  </a>

                  <!-- Terms & Conditions Link -->
                  <div v-if="promo.disclaimer" class="text-white/60 text-sm">
                    <a :href="regLink"
                       class="hover:text-jazzy-yellow transition-colors duration-300"
                       target="_blank" 
                       rel="noopener noreferrer">
                      View Full Terms & Conditions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { pp_promotions, regLink } from '~/composables/globalData';

// SEO
useHead({
  title: 'Exclusive Casino Promotions - Jazzy Spins',
  meta: [
    { 
      name: 'description', 
      content: 'Discover exciting casino promotions at Jazzy Spins. Enjoy welcome bonuses, free spins, and exclusive rewards designed to maximize your gaming experience.'
    },
    {
      name: 'keywords',
      content: 'casino promotions, welcome bonus, free spins, casino rewards, gaming offers, Jazzy Spins bonuses'
    }
  ]
});
</script>

<style scoped>
.promotion-list-move,
.promotion-list-enter-active,
.promotion-list-leave-active {
  transition: all 0.5s ease;
}

.promotion-list-enter-from,
.promotion-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.promotion-list-leave-active {
  position: absolute;
}

/* Tailwind Typography Overrides */
:deep(.prose) {
  @apply text-white/80;
}

:deep(.prose a) {
  @apply text-jazzy-yellow hover:text-jazzy-yellow/80 no-underline;
}

:deep(.prose strong) {
  @apply text-white;
}
</style>