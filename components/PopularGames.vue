<template>
	<div class="bg-jazzy-darkblue py-16">
		<!-- Header Section -->
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col lg:flex-row justify-between items-center mb-8">
				<div class="w-full lg:w-2/3">
					<h2 class="text-primary text-3xl font-bold mb-4 text-center lg:text-left">
						<TranslatedText translation-key="popular_games" />
					</h2>
					<div v-for="promo in promotionsPosts" :key="promo.id">
						<p class="text-primary/80 font-light text-sm md:text-lg mb-4">
							{{ promo.acf.popular_games_info }}
						</p>
					</div>
				</div>
				<div class="w-full lg:w-auto mt-4 lg:mt-0">
					<NuxtLink to="all-games"
						class="w-full lg:w-auto inline-flex items-center justify-center px-8 py-3 bg-jazzy-green text-white 
							   uppercase font-medium rounded-md hover:scale-105 transition-all duration-300 shadow-lg">
						<span class="text-white font-semibold"><TranslatedText translation-key="see_more" /></span>
						<i class="material-icons ml-2 text-white">arrow_forward</i>
					</NuxtLink>
				</div>
			</div>

			<!-- Loading state -->
			<LoadingSpinner v-if="loading" />

			<!-- Games Grid -->
			<div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-4">
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
import { useGameStore } from '~/stores/gameStore';
import { regLink, promotionsPosts, loadTranslations } from '~/composables/globalData';
import GameCard from './GameCard.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import TranslatedText from './TranslatedText.vue';

const loading = ref(true);
const emit = defineEmits(['loaded']);
const gameStore = useGameStore();

const displayedGames = computed(() => {
	const games = gameStore.popularGames || [];
	return games.slice(-16).reverse();
});

onMounted(async () => {
	try {
		loading.value = true;
		// Only load translations - games data should be loaded by parent/shared
		await loadTranslations();
		emit('loaded');
	} catch (error) {
		console.error('Error in PopularGames:', error);
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

@keyframes pulse {
	0% { transform: translate(-50%, -50%) scale(1); }
	50% { transform: translate(-50%, -50%) scale(1.05); }
	100% { transform: translate(-50%, -50%) scale(1); }
}
</style>