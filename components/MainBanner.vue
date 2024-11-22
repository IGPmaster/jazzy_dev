<template>
  <!-- Template stays exactly the same -->
  <ClientOnly>
    <div class="head-banner">
      <div 
        v-if="loading" 
        class="loading-placeholder bg-jazzy-darkblue banner-header-offset"
        aria-hidden="true"
      >
        <LoadingSpinner />
      </div>
      <div 
        v-else-if="currentPromo" 
        class="head-banner h-100 bg-jazzy-darkblue"
      >
        <div class="w-full banner-header-offset">
          <a 
            :href="regLink" 
            class="block w-full" 
            v-if="currentPromo.acf?.image_small"
          >
            <div class="relative w-full banner-container">
              <picture class="absolute inset-0">
                <source 
                  media="(min-width: 992px)" 
                  :srcset="currentPromo.acf.image_full"
                  type="image/webp"
                  width="1920"
                  height="768"
                >
                <img 
                  :src="currentPromo.acf.image_small"
                  class="w-full h-full object-cover"
                  :alt="currentPromo.yoast_head_json?.description || 'Promotion Banner'"
                  width="625"
                  height="625"
                  fetchpriority="high"
                  decoding="sync"
                >
              </picture>
            </div>
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
              <!-- Mobile payment methods -->
              <div class="w-full md:hidden relative payment-container-mobile">
                <img 
                  src="/images/payments_jazzy_mobile.webp" 
                  alt="Payment Methods" 
                  class="absolute inset-0 w-full h-full object-contain"
                  loading="lazy"
                  width="640"
                  height="80"
                  decoding="async"
                />
              </div>
              <!-- Desktop payment methods -->
              <div class="w-3/4 hidden md:block relative payment-container-desktop">
                <img 
                  src="/images/payments_jazzy.svg" 
                  alt="Payment Methods" 
                  class="absolute inset-0 w-full h-full object-contain"
                  loading="lazy"
                  width="960"
                  height="120"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #fallback>
      <div class="loading-placeholder bg-jazzy-darkblue banner-header-offset">
        <LoadingSpinner />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncData } from '#app';
import { promotionsPosts, regLink, fetchPromotions } from '~/composables/globalData';

const loading = ref(true);
const currentPromo = ref(null);
const emit = defineEmits(['loaded']);

await useAsyncData('promotions', async () => {
  try {
    await fetchPromotions();
    currentPromo.value = promotionsPosts.value[0];
    loading.value = false;
    emit('loaded');
  } catch (error) {
    console.error('Error fetching promotions:', error);
    loading.value = false;
    emit('loaded');
  }
});
</script>

<style scoped>
:root {
  --header-height-mobile: 87px;
  --header-height-desktop: 107px;
}

.loading-placeholder {
  min-height: clamp(31vw, 119vw, calc(100vh - 4rem));
}

.head-banner {
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

/* Header offset with exact mobile height */
.banner-header-offset {
  padding-top: 87px; /* Mobile header exact height */
}

/* Banner container with mobile aspect ratio (625x625 = 1:1) */
.banner-container {
  padding-top: 100%; /* 1:1 aspect ratio for mobile */
}

/* Payment images aspect ratios */
.payment-container-mobile {
  padding-top: calc(100% * (80/640)); /* Mobile payments ratio */
}

.payment-container-desktop {
  padding-top: calc(100% * (120/960)); /* Desktop payments ratio */
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Desktop styles */
@media (min-width: 992px) {
  .banner-header-offset {
    padding-top: 107px; /* Desktop header exact height */
  }
  
  .banner-container {
    padding-top: 40%; /* 2.5:1 aspect ratio for desktop (1920:768) */
  }
}

:deep(a) {
  @apply !text-jazzy-gold underline font-normal;
}

:deep(p) {
  @apply !text-jazzy-beige font-thin text-xs;
}
</style>