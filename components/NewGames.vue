<template>
  <div class="bg-jazzy-darkblue py-16">
    <LoadingSpinner v-if="loading" />

    <div v-else class="container mx-auto px-4">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row justify-between items-center mb-8">
        <div class="w-full lg:w-2/3">
          <h2 class="text-primary text-3xl font-bold mb-4 text-center lg:text-left">
            <TranslatedText translation-key="new_games" />
          </h2>
          <div v-if="promotionsPosts?.length">
            <p v-for="promo in promotionsPosts" 
               :key="promo.id" 
               class="text-primary/80 font-light text-sm md:text-lg mb-4">
              {{ promo.acf?.new_games_info }}
            </p>
          </div>
        </div>
        <div class="w-full lg:w-auto mt-4 lg:mt-0">
          <NuxtLink to="/all-games"
            class="w-full lg:w-auto inline-flex items-center justify-center px-8 py-3 bg-jazzy-green text-white 
                   uppercase font-medium rounded-md hover:scale-105 transition-all duration-300 shadow-lg">
            <span><TranslatedText translation-key="see_more" /></span>
            <i class="material-icons ml-2">arrow_forward</i>
          </NuxtLink>
        </div>
      </div>

      <!-- Games Grid -->
      <div v-if="displayedGames?.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        <GameCard 
          v-for="game in displayedGames" 
          :key="game.id"
          :game="game"
          :reg-link="regLink"
        />
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
import { ref, computed, onMounted } from 'vue';
import { regLink, fetchGames, newGames, promotionsPosts } from '~/composables/globalData';

const loading = ref(true);
const error = ref(null);
const emit = defineEmits(['loaded']);

const displayedGames = computed(() => 
  newGames.value?.slice(-16).reverse() || []
);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch promotions and games in parallel
    await Promise.all([
      fetchPromotions(),
      fetchGames()
    ]);
    
    if (!newGames.value?.length) {
      error.value = 'No games data available';
    }
    
    emit('loaded');
  } catch (err) {
    console.error('Error in NewGames:', err);
    error.value = 'Failed to load games. Please try again later.';
  } finally {
    loading.value = false;
  }
});
</script>