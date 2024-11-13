<template>
	<div class="py-10 md:py-20 bg-secondary_bg">
		<div class="lg:mb-4">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 lg:grid-cols-8 lg:gap-8 items-center">
					<div class="col-span-full lg:col-span-6">
						<p class="gamesSectionHead text-secondary text-center lg:text-left p-4 text-3xl font-bold">
							<TranslatedText translation-key="slot_games" />
						</p>
						<div v-for="promo in promotionsPosts" :key="promo.id">
							<p class="info_content text-secondary/90 font-light text-lg py-5 px-4">
								{{ promo.acf.slot_games_info }}
							</p>
						</div>
					</div>
					<div class="lg:col-span-2 p-4">
						<div class="flex justify-between items-center">
							<NuxtLink to="all-games"
								class="w-full rounded-md py-3 flex items-center justify-center bg-jazzy-green text-white uppercase cursor-pointer transition-all ease-in-out duration-500 hover:scale-110 shadow-lg">
								<span class="text-center">
									<TranslatedText translation-key="see_more" />
								</span>
								<i class="material-icons pl-2 font-extralight">arrow_forward</i>
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Loading state with accessibility -->
		<div v-if="loading" class="loading-placeholder" role="status" aria-live="polite">
			<svg class="spinner animate-spin w-12 h-12" viewBox="0 0 50 50">
				<circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
			</svg>
			<span class="sr-only">Loading...</span>
		</div>

		<!-- Games grid -->
		<div v-else class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
				<div v-for="game in slotGames.slice(-16).reverse()" :key="game.id" :class="'item-' + game.id"
					class="shadow-lg rounded-md">
					<div class="show show-first relative">
						<a :href="regLink" target="_blank">
							<img class="rounded-md w-full" :src="game.image" @error="game.image = 'newGameImg.jpg'"
								loading="lazy" :alt="'Image of ' + game.gameName + ' online slot. ' + game.description"
								:title="game.gameName + ' - ' + game.id" width="200" height="132" />
						</a>
						<div
							class="mask absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
							<a :href="regLink" target="_blank">
								<div class="gameDescr p-4 text-white text-center">
									<div v-if="game?.description">
										{{ game.description }} from {{ game.provider }}
									</div>
									<i v-else class="material-icons text-4xl scale-150">play_arrow</i>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- CTA Section -->
		<div class="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
			<div class="flex flex-col sm:flex-row items-center justify-between bg-jazzy-blue p-5 sm:p-10 rounded-sm">
				<div class="text-primary font-medium md:text-2xl xl:text-4xl mb-4 sm:mb-0">
					<TranslatedText translation-key="claim" />
				</div>
				<a :href="regLink"
					class="inline-block py-2 px-4 md:px-10 font-semibold rounded text-lg bg-jazzy-green text-white hover:opacity-90 transition-opacity duration-300">
					<TranslatedText translation-key="sign_up" />
				</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, defineEmits, computed } from 'vue';
import { WHITELABEL_ID, newGames, msgTranslate, regLink, loginLink, fetchGames } from '~/composables/globalData';
import { useCache } from '~/composables/useCache';
const { getCacheKey, getCache, setCache } = useCache();
const brandId = computed(() => WHITELABEL_ID);
const loading = ref(true);
const userId = ref(null); // Or get from your auth system if needed
const emit = defineEmits(['loaded']);
const cacheKey = computed(() => getCacheKey('slot-games', {
	brandId: brandId.value,
	lang: lang.value,
	...(userId.value ? { userId: userId.value } : {}) // Only include userId if it exists
}));

onMounted(async () => {
	try {
		// Check cache first
		const cachedGames = getCache(cacheKey.value);
		if (cachedGames) {
			newGames.value = cachedGames;
			loading.value = false;
			return;
		}

		// Fetch fresh data
		await fetchGames();
		setCache(cacheKey.value, newGames.value);
	} catch (error) {
		console.error('Error in NewGames:', error);
	} finally {
		loading.value = false;
	}
});

</script>