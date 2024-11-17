<template>

	<MainBanner />
	<ProvidersSlider />
	<NewGames />

	<!-- PP Promotions API -->
	<div class="section px-5 bg-primary">
		<div v-for="rest in promotionsPosts" :key="rest.code" class="container py-10 mx-auto text-primary">
			<div v-html="rest.acf.promo_over" class="leading-relaxed"></div>
		</div>

		<div class="container mx-auto py-5">
			<div class="grid grid-cols-2 md:grid-cols-2 gap-4 lg:gap-8">
				<div v-for="promo in pp_promotions" :key="promo.code">
					<div class="card overflow-hidden rounded-lg leading-relaxed">
						<div class="card-image">
							<a :href="regLink">
								<img class="activator w-full h-auto" :src="promo.bigImageUrl" loading="lazy"
									:alt="'Image of ' + promo.title + ' promotion.'"
									:title="promo.title + ', ' + promo.subTitle">
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="py-10">
			<div v-for="rest in promotionsPosts" :key="rest.code" class="container mx-auto py-2 info_content hide_this">
				<div class="text-primary" v-html="rest.acf.promo_under"></div>
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
						<div v-html="promotion.content.rendered" :key="promotion.id"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

import { ref, onMounted, defineEmits } from 'vue';
const loading = ref(true);

import { promotionsPosts, regLink, fetchPromotions } from '~/composables/globalData';

const emit = defineEmits(['loaded']);

const { fetch, error, $fetchState } = useFetch(async () => {
	await fetchApiPromotions();
});

onMounted(async () => {
	try {
		await fetchPromotions();
		loading.value = false;
	} catch (error) {
		console.error('Error fetching promotions:', error);
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