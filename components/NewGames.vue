<template>
  <div class="bg-jazzy-darkblue py-16">
    <div v-if="loading" class="loading-placeholder" role="status" aria-live="polite">
      <svg class="spinner animate-spin w-12 h-12" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
      </svg>
      <span class="sr-only">Loading...</span>
    </div>

    <div v-else class="container mx-auto px-4">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row justify-between items-center mb-8">
        <div class="w-full lg:w-2/3">
          <h2 class="text-primary text-3xl font-bold mb-4 text-center lg:text-left">
            <TranslatedText translation-key="new_games" />
          </h2>
          <div v-for="promo in promotionsPosts" :key="promo.id">
            <p class="text-primary/80 font-light text-lg mb-4">
              {{ promo.acf.new_games_info }}
            </p>
          </div>
        </div>
        <div class="w-full lg:w-auto mt-4 lg:mt-0">
          <NuxtLink to="all-games"
            class="w-full lg:w-auto inline-flex items-center justify-center px-8 py-3 bg-jazzy-green text-white 
                   uppercase font-medium rounded-md hover:scale-105 transition-all duration-300 shadow-lg">
            <span><TranslatedText translation-key="see_more" /></span>
            <i class="material-icons ml-2">arrow_forward</i>
          </NuxtLink>
        </div>
      </div>

      <!-- Games Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        <div v-for="game in newGames.slice(-16).reverse()" :key="game.id"
          class="group relative rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
          <a :href="regLink" target="_blank" class="block w-full pb-[133%] relative">
            <img class="absolute inset-0 w-full h-full object-cover" 
              :src="game.image"
              @error="game.image = 'newGameImg.jpg'" 
              loading="lazy"
              :alt="'Image of ' + game.gameName + ' online slot. ' + game.description"
              :title="game.gameName + ' - ' + game.id" />
            
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-all duration-300">
              <!-- Play Button -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <div class="bg-jazzy-red-secondary hover:bg-jazzy-red rounded-full 
                            shadow-lg ring-4 ring-white/10
                            w-12 h-12 relative"> <!-- Changed to relative positioning -->
                    <i class="material-icons text-white text-3xl 
                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"> <!-- Absolute centering -->
                    play_arrow
                    </i>
                </div>
            </div>

              <!-- Game Description -->
              <!-- <div class="absolute bottom-12 left-0 right-0 p-4 text-white">
                <p class="text-sm font-medium line-clamp-2" v-if="game?.description">
                  {{ game.description }}
                </p>
              </div> -->
              
              <!-- Provider Badge -->
              <div v-if="game?.provider" 
                class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm
                       border-t border-white/10 px-4 py-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-white/80">
                    Provider
                  </span>
                  <span class="text-xs font-bold text-jazzy-yellow">
                    {{ game.provider }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-16">
        <div class="bg-jazzy-liteblue rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
          <div class="text-primary font-medium text-xl md:text-2xl xl:text-3xl mb-4 sm:mb-0">
            <TranslatedText translation-key="claim" />
          </div>
          <a :href="regLink"
            class="inline-block py-3 px-8 font-semibold rounded-md text-lg bg-jazzy-red-secondary hover:bg-jazzy-red 
                   text-white hover:scale-105 transition-all duration-300">
            <TranslatedText translation-key="sign_up" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { regLink, fetchGames } from '~/composables/globalData';

const loading = ref(true);
const emit = defineEmits(['loaded']);

onMounted(async () => {
    try {
        // Fetch fresh data directly
        await fetchGames();
        emit('loaded');
    } catch (error) {
        console.error('Error in NewGames:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.loading-placeholder {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  color: #FEB708; /* jazzy-yellow */
}

.spinner .path {
  stroke: currentColor;
  stroke-linecap: round;
}

/* Optional: Add a pulse animation to the play button */
@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.group:hover .material-icons {
  animation: pulse 2s infinite;
}
</style>