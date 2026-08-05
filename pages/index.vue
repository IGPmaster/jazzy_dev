<template>

	<MainBanner />
	<ProvidersSlider />
	<NewGames />

	<!-- Promotions -->
	<div class="bg-jazzy-beige py-16">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-lg shadow-lg py-6 md:py-10 px-4 sm:px-6">
				<div class="flex flex-col lg:flex-row justify-between items-center">
					<div class="w-full lg:w-2/3">
						<h2 class="text-jazzy-darkblue text-3xl font-bold mb-4 text-center lg:text-left">Promotions</h2>
						<p class="text-jazzy-darkblue/80 font-light text-sm md:text-lg mb-4">
							Keep the good times swinging — check out the promotions page for the bonuses
							and offers currently playing at JazzySpins. There is always a fresh number
							on the bill.
						</p>
					</div>
					<div class="w-full lg:w-auto mt-4 lg:mt-0">
						<a :href="promotionsLink"
							class="w-full lg:w-auto inline-flex items-center justify-center px-8 py-3 bg-jazzy-green text-white
								   uppercase font-medium rounded-md hover:scale-105 transition-all duration-300 shadow-lg">
							<span class="text-white font-semibold">Promotions</span>
							<i class="material-icons ml-2 text-white">arrow_forward</i>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<PopularGames />
	<SlotGames />
	<CasinoGames />
	<JackpotGames />
	<div class="section px-5 bg-jazzy-darkblue">
		<div class="container mx-auto py-10 bg-jazzy-darkblue">
			<div class="px-4">
				<div class="text-sm text-primary">
					<div v-for="promotion in promotionsPosts" :key="promotion.id">
						<div class="cms-content" v-html="promotion.content.rendered" :key="promotion.id"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<CookieConsent />
</template>

<script setup>

import { ref, onMounted, defineEmits } from 'vue';
const loading = ref(true);

import {
	promotionsPosts,
	promotionsLink,
	fetchPromotions,
	fetchCachedContent,
	lang
} from '~/composables/globalData';
import { useGameStore } from '~/stores/gameStore';

const emit = defineEmits(['loaded']);
const gameStore = useGameStore();

async function fetchContent() {
	try {
		// Use the new CORS-safe function
		return await fetchCachedContent('compliance', lang.value);
	} catch (error) {
		console.error(error);
		return ''; // Return empty string on error
	}
}

onMounted(async () => {
	try {
		// Load games data first (this will be shared across all game components)
		await Promise.all([
			fetchPromotions(),
			fetchContent(),
			gameStore.fetchGames() // ✅ Single games API call for entire page via gameStore
		]);
		loading.value = false;
	} catch (error) {
		console.error('Error fetching content:', error);
	}
	loading.value = false;
	emit('loaded');
});

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
p {
    line-height: 1.7rem;
}

.seoContent {
    color: #f2f4e8;
    background: transparent;
    border-radius: 5px;
}
</style>