<template>
	<div class="min-h-screen bg-jazzy-darkblue lg:py-10">
		<div class="row bg-jazzy-darkblue/50 lg:mb-4 pt-20">
			<div class="container grid grid-cols-1 lg:grid-cols-8 lg:gap-10 items-center mx-auto p-4">
				<div class="col-span-full lg:col-span-6">
					<p class="gamesSectionHead text-center lg:text-left text-3xl text-primary py-4 px-4">
						<TranslatedText translation-key="all_games" />
					</p>
					<div v-for="promo in promotionsPosts" :key="promo.id">
						<div class="info_content text-primary font-extralight py-5 px-4">
							{{ promo.acf.slot_games_info }}
						</div>
					</div>
				</div>
				<div class="lg:block lg:col-span-2 p-4">
	                    <div class="flex justify-between items-center">
	                        <a :href="regLink" 
                            class="bg-secondary_bg w-full rounded-md py-3 flex text-secondary hover:text-primary hover:bg-tertiary_dark uppercase cursor-pointer transition ease-in-out duration-500 hover:scale-110">
	                            <span class="text-center w-full"><TranslatedText translation-key="sign_up" /></span>
	                            <i class="material-icons items-center pr-2 font-extralight">arrow_forward</i>
							</a>
	                    </div>
	                </div>
			</div>
		</div>
		<div class="row lg:mb-4 py-5">
			<div class="container mx-auto grid grid-cols-1 gap-0 lg:grid-cols-3 lg:gap-4 px-4">
				<!-- Wrapper div for Provider Dropdown and Icon -->
				<div class="relative w-full py-4 lg:py-0">
					<select v-model="selectedProvider" @change="filterGames" class="uppercase block appearance-none w-full bg-white/10 border border-white/20 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-jazzy-gold/50">
						<option value="all">All providers</option>
						<option v-for="provider in providers" :value="provider" :key="provider">
						{{ provider }}
						</option>
					</select>
					<!-- Icon -->
					<i class="material-icons absolute top-1/2 right-3 transform -translate-y-1/2">arrow_drop_down</i>
				</div>

				<!-- SubProvider Dropdown -->
				<div class="relative w-full py-4 lg:py-0">
					<select v-model="selectedSubProvider" @change="filterGames" class="uppercase block appearance-none w-full bg-white/10 border border-white/20 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-jazzy-gold/50">
						<option value="all">All subProviders</option>
						<option v-for="subProvider in subProviders" :value="subProvider" :key="subProvider">
						{{ subProvider }}
						</option>
					</select>
					<!-- Icon -->
					<i class="material-icons absolute top-1/2 right-3 transform -translate-y-1/2">arrow_drop_down</i>
				</div>

				<!-- GameType Dropdown -->
				<div class="relative w-full py-4 lg:py-0">
					<select v-model="selectedGameType" @change="filterGames" class="uppercase block appearance-none w-full bg-white/10 border border-white/20 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-jazzy-gold/50">
						<option value="all">All game types</option>
						<option v-for="gameType in gameTypes" :value="gameType" :key="gameType">
						{{ gameType }}
						</option>
					</select>
					<!-- Icon -->
					<i class="material-icons absolute top-1/2 right-3 transform -translate-y-1/2">arrow_drop_down</i>
				</div>
			</div>
		</div>
		<div class="px-4 sm:px-6 lg:px-0 py-10">
			<div class="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				<div v-for="game in sortedGames" :key="game.id" :class="'item-' + game.excludedCountries">
					<div class="relative h-full group overflow-hidden rounded-lg">
						<a :href="playLink + game.serverGameId" target="_blank" class="block h-full">
							<img :src="game.image"
								:alt="'Image of ' + game.gameName + ' online slot. ' + game.description"
								:title="game.gameName + ' - ' + game.id"
								loading="lazy"
								@error="game.image = 'newGameImg.jpg'"
								class="w-full h-full object-cover" />
							
							<!-- Hover Overlay -->
							<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
								opacity-0 group-hover:opacity-100 transition-all duration-300">
								<!-- Play Button -->
								<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
									transform scale-0 group-hover:scale-100 transition-transform duration-300">
									<div class="bg-jazzy-red-secondary hover:bg-jazzy-red rounded-full 
										shadow-lg ring-4 ring-white/10
										w-12 h-12 relative">
										<i class="material-icons text-white text-3xl 
											absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
											play_arrow
										</i>
									</div>
								</div>

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
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useHead } from '#imports';
import { games, regLink, loginLink, playLink } from '~/composables/globalData';
import { useGameStore } from '~/stores/gameStore';

let selectedProvider = ref('all');
let selectedSubProvider = ref('all');
let selectedGameType = ref('all');

let providers = computed(() => {
	if (selectedSubProvider.value === 'all') {
		let gameProviders = games.value.map(game => game.provider);
		return [...new Set(gameProviders)];
	} else {
		let gameProviders = games.value.filter(game => game.subProvider === selectedSubProvider.value)
			.map(game => game.provider);
		return [...new Set(gameProviders)];
	}
});

let subProviders = computed(() => {
	if (selectedProvider.value === 'all') {
		let gameSubProviders = games.value.map(game => game.subProvider);
		return [...new Set(gameSubProviders)];
	} else {
		let gameSubProviders = games.value.filter(game => game.provider === selectedProvider.value)
			.map(game => game.subProvider);
		return [...new Set(gameSubProviders)];
	}
});

let gameTypes = computed(() => {
	if (selectedProvider.value === 'all' && selectedSubProvider.value === 'all') {
		let gameGameTypes = games.value.map(game => game.gameType);
		return [...new Set(gameGameTypes)];
	} else {
		let filteredGames = games.value.filter(game =>
			(game.provider === selectedProvider.value || selectedProvider.value === 'all') &&
			(game.subProvider === selectedSubProvider.value || selectedSubProvider.value === 'all')
		);
		let gameGameTypes = filteredGames.map(game => game.gameType);
		return [...new Set(gameGameTypes)];
	}
});

let filteredGames = computed(() => {
	return games.value.filter(game => {
		if ((selectedProvider.value !== 'all' && game.provider !== selectedProvider.value) ||
			(selectedSubProvider.value !== 'all' && game.subProvider !== selectedSubProvider.value) ||
			(selectedGameType.value !== 'all' && game.gameType !== selectedGameType.value)) {
			return false;
		}
		return true;
	});
});

let sortedGames = computed(() => {
	return [...filteredGames.value].sort((a, b) => a.gameName.localeCompare(b.gameName));
});

const gameStore = useGameStore();

onMounted(async () => {
	// ✅ OPTIMIZED: Single shared games call via gameStore (with 10min cache)
	await gameStore.fetchGames();
});

const filterGames = () => {
	// filteredGames will reactively update based on the selectedProvider, selectedSubProvider and selectedGameType
}
// Set page-specific meta tags
useHead({
	title: 'All Casino Games - Jazzy Spins Online Casino',
	meta: [
		{ 
			name: 'description', 
			content: 'Explore our extensive collection of online casino games at Jazzy Spins. Play slots, live casino, table games, jackpots and more. New games added regularly!'
		},
		{
			name: 'keywords',
			content: 'online slots, casino games, live casino, table games, jackpot games, Jazzy Spins casino, online gambling, gaming library'
		}
	]
});
</script>

<style scoped>

</style>