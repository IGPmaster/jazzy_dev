<template>
  <div>
    <footer class="bg-[#0F0B3D] pt-10">
      

      <div class="row pb-10">
        <div class="container mx-auto footerContainer">
          <ul class="container mx-auto flex list-none flex-wrap text-lg justify-center gap-6 py-8 text-jazzy-beige">
            <li>
              <NuxtLink to="/compliance/aboutus" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.aboutus }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/withdrawals" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.withdrawals }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/deposits" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.deposits }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/contact" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.contact }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/privacy" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.privacy }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/responsible" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.responsible }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/faq" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.faq }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/payouts" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.payouts }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/terms" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige p-1 font-sans">{{ msgTranslate.terms }}</NuxtLink>
          </li>
        </ul>
        <div v-for="icon in footerIcons" :key="icon.Name">
          <div v-html="icon.Html"></div>
        </div>
        <div v-for="text in footerText" :key="text.Name" class="py-5">
          <p v-html="text.Html"></p>
        </div>
        <div class="flex items-center justify-center">
          <img 
            src="/images/JazzySpins_logo_wh.svg" 
            loading="lazy" 
            alt="Jazzy Spins footer Logo"
            class="footer_logo p-5 shadow-md rounded-lg" height="" width="" />
        </div>
      </div>
    </div>

    <div class="w-full fixed bottom-0 lg:hidden">
        <div class="grid grid-cols-2">
          <div class="w-full bg-jazzy-green flex justify-center py-3 uppercase font-sans">
            <a :href="loginLink" class="flex items-center gap-4 text-[#313131] font-semibold">
              <TranslatedText translation-key="login" />
              <i class="material-icons text-jazzy-beige">arrow_forward</i>
            </a>
          </div>
          <div class="w-full bg-jazzy-red-secondary flex justify-center uppercase font-sans">
            <a :href="regLink" class="flex items-center gap-4 text-[#313131] font-semibold">
              <TranslatedText translation-key="sign_up" />
              <i class="material-icons text-jazzy-beige">security</i>
            </a>
          </div>
        </div>
      </div>
      
  </footer>
</div>
</template>

<script setup>
import { BRAND_CONFIG } from '~/config/brand';
const brandId = computed(() => BRAND_CONFIG.WHITELABEL_ID)

import { ref, onMounted } from 'vue';

import { fetchFooterIcons, fetchFooterText } from '~/composables/globalData.js';
import TranslatedText from './TranslatedText.vue';

const { fetch, error, $fetchState } = useFetch(async () => {
  //countriesData.value = await fetchCountriesData();
  await fetchFooterIcons(lang.value);
  await fetchFooterText(lang.value);
});

</script>

<style scoped>
.footer_logo {
  max-width: 200px;

}
.router-link-active {
  @apply text-secondary bg-secondary_bg;
}
:deep(span) {
  @apply text-jazzy-beige;
}

:deep(.disclaimer) {
  @apply text-jazzy-beige text-sm font-light;
}

:deep(.disclaimer a) {
  @apply text-jazzy-gold underline hover:text-white;
}

</style>
