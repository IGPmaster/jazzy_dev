import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchGames as fetchGamesApi, fetchFilterByName, games as globalGames } from '~/composables/globalData';

export const useGameStore = defineStore('game', () => {
  // State
  const allGames = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const lastFetchTime = ref(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Computed properties for different game categories
  const newGames = computed(() => 
    allGames.value?.filter(game => game?.gameFilters?.includes('New')) || []
  );

  const popularGames = computed(() => 
    allGames.value?.filter(game => game?.gameFilters?.includes('Featured')) || []
  );

  const casinoGames = computed(() => 
    allGames.value?.filter(game => game?.gameType?.includes('Casino')) || []
  );

  const slotGames = computed(() => 
    allGames.value?.filter(game => game?.gameType?.includes('Slots')) || []
  );

  const jackpotGames = computed(() => 
    allGames.value?.filter(game => game?.gameType?.includes('Jackpots')) || []
  );

  const liveGames = computed(() => 
    allGames.value?.filter(game => game?.gameType?.includes('Live')) || []
  );

  const scratchGames = computed(() => 
    allGames.value?.filter(game => game?.gameName?.toLowerCase().includes('scratch')) || []
  );

  const blackjackGames = computed(() => 
    allGames.value?.filter(game => game?.gameFilters?.includes('Blackjack')) || []
  );

  const rouletteGames = computed(() => 
    allGames.value?.filter(game => game?.gameFilters?.includes('Roulette')) || []
  );

  // Helper function to check if data is still fresh
  function isDataFresh() {
    return lastFetchTime.value && 
           (Date.now() - lastFetchTime.value < CACHE_DURATION) && 
           Array.isArray(allGames.value) && 
           allGames.value.length > 0;
  }

  // Actions
  async function fetchGames() {
    // Return cached data if it's still fresh
    if (isDataFresh()) {
      return allGames.value;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Call the API functions
      await fetchGamesApi();
      
      // Get the data from the global ref
      if (Array.isArray(globalGames.value)) {
        allGames.value = globalGames.value;
        lastFetchTime.value = Date.now();
        return allGames.value;
      } else {
        throw new Error('Invalid games data format');
      }
    } catch (e) {
      error.value = e;
      console.error('Error fetching games:', e);
      allGames.value = []; // Reset to empty array on error
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  // Reset store state
  function $reset() {
    allGames.value = [];
    isLoading.value = false;
    error.value = null;
    lastFetchTime.value = null;
  }

  return {
    // State
    allGames,
    isLoading,
    error,
    lastFetchTime,
    
    // Getters (computed)
    newGames,
    popularGames,
    casinoGames,
    slotGames,
    jackpotGames,
    liveGames,
    scratchGames,
    blackjackGames,
    rouletteGames,
    
    // Actions
    fetchGames,
    $reset
  };
}); 