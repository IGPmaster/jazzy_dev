<template>
  <div v-if="loading" class="loading-placeholder">
    <LoadingSpinner />
  </div>
  <div v-else-if="currentPromo" class="head-banner h-100 bg-jazzy-darkblue">
    <div class="w-full">
      <a :href="regLink" class="mb-[-5px]" v-if="currentPromo.acf?.image_small">
        <picture>
          <source 
            media="(min-width: 992px)" 
            :srcset="currentPromo.acf.image_full"
            type="image/webp"
            loading="eager"
          >
          <img 
            :src="currentPromo.acf.image_small"
            class="w-full h-auto pt-16 min-w-screen"
            :alt="currentPromo.yoast_head_json?.description || 'Promotion Banner'"
            :width="1920"
            :height="400"
            loading="eager"
            fetchpriority="high"
          >
        </picture>
      </a>
    </div>

    <BannerContent 
      :sig-terms="currentPromo.acf?.sig_terms"
      :one-two-three-icon="currentPromo.acf?.one_two_three_icon"
      :trust-icons="currentPromo.acf?.trust_icons"
    />
    
    <div class="bg-jazzy-beige">
      <div class="container mx-auto py-4 md:py-8">
        <div class="flex justify-center items-center">
          <img 
            src="/images/payments_jazzy_mobile.webp" 
            alt="Payment Methods" 
            class="w-full md:hidden"
            loading="lazy"
            width="640"
            height="80"
          />
          <img 
            src="/images/payments_jazzy.svg" 
            alt="Payment Methods" 
            class="w-3/4 hidden md:block"
            loading="lazy"
            width="960"
            height="120"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncData } from '#app';
import { promotionsPosts, regLink, fetchPromotions } from '~/composables/globalData';

const loading = ref(true);
const currentPromo = ref(null);
const emit = defineEmits(['loaded']);

// Prefetch promotions data
await useAsyncData('promotions', async () => {
  try {
    await fetchPromotions();
    currentPromo.value = promotionsPosts.value[0];
    loading.value = false;
    emit('loaded');
  } catch (error) {
    loading.value = false;
    emit('loaded');
  }
});
</script>

<style scoped>
.loading-placeholder {
  min-height: clamp(31vw, 119vw, calc(100vh - 4rem));
}

.head-banner {
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

:deep(a) {
  @apply !text-jazzy-gold underline font-normal;
}

:deep(p) {
  @apply !text-jazzy-beige font-thin text-xs;
}
</style>
