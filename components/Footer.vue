<template>
  <div>
    <footer class="bg-[#0F0B3D] text-white">
      <div class="container mx-auto">
        <!-- Main footer content -->
        <div class="flex flex-col lg:flex-row py-8 lg:gap-10 items-start">
          <!-- Logo Column -->
          <div class="w-full lg:w-1/6 mb-8 lg:mb-0 flex justify-center lg:justify-start align-top">
            <img src="/images/JazzySpins_logo_wh.svg" alt="Jazzy Spins Casino footer Logo" class="footer_logo px-8" />
          </div>
          
          <!-- Right Column Container -->
          <div class="w-full lg:w-5/6">
            <!-- Navigation Links -->
            <div class="flex flex-wrap gap-4 lg:gap-6 mb-8 justify-center lg:justify-start">
              <NuxtLink to="/home" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Home</NuxtLink>
              <NuxtLink to="/about-us" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">About Us</NuxtLink>
              <NuxtLink to="/deposits" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Deposits</NuxtLink>
              <NuxtLink to="/withdrawals" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Withdrawals</NuxtLink>
              <NuxtLink to="/rewards" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Rewards Programme</NuxtLink>
              <NuxtLink to="/responsible" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Play Responsibly</NuxtLink>
              <NuxtLink to="/terms" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Terms & Conditions</NuxtLink>
              <NuxtLink to="/privacy" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Privacy Policy</NuxtLink>
              <NuxtLink to="/casino" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Casino</NuxtLink>
              <NuxtLink to="/faq" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">FAQ</NuxtLink>
              <NuxtLink to="/contact" class="hover:text-jazzy-gold text-sm lg:text-jazzy-beige">Contact</NuxtLink>
            </div>

            <!-- Footer Text -->
            <div class="mb-8 px-4 lg:px-0 text-center lg:text-left">
              <div v-for="text in footerText" :key="text.Id" class="text-sm text-gray-300" v-html="text.Html"></div>
            </div>

            <!-- Footer Icons -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8">
              <div v-for="icon in footerIcons" :key="icon.Name" v-html="icon.Html"></div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-800">
          <div class="container mx-auto py-4">
            <div class="text-sm text-gray-400 w-full text-center">
              © {{ new Date().getFullYear() }} JazzySpins
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Fixed Bottom Bar -->
      <div class="w-full fixed bottom-0 lg:hidden z-50">
        <div class="grid grid-cols-2">
          <div class="w-full bg-jazzy-green flex justify-center py-3">
            <a :href="loginLink" class="flex items-center gap-4 text-jazzy-beige font-normal font-sans uppercase">
              <TranslatedText translation-key="login" />
              <i class="material-icons text-white">arrow_forward</i>
            </a>
          </div>
          <div class="w-full bg-jazzy-red-secondary flex justify-center">
            <a :href="regLink" class="flex items-center gap-4 text-jazzy-beige font-normal font-sans uppercase">
              <TranslatedText translation-key="sign_up" />
              <i class="material-icons">edit_note</i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { WHITELABEL_ID } from '~/composables/globalData'
const brandId = computed(() => WHITELABEL_ID)

import { ref, onMounted } from 'vue';

import { fetchFooterIcons, fetchFooterText } from '~/composables/globalData.js';

const { fetch, error, $fetchState } = useFetch(async () => {
  //countriesData.value = await fetchCountriesData();
  await fetchFooterIcons(lang.value);
  await fetchFooterText(lang.value);
});

</script>

<style scoped>
.footer_logo {
  max-width: 180px;
  @apply lg:max-w-[250px];
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

.router-link-active {
  @apply text-secondary bg-secondary_bg;
}

@media (max-width: 1024px) {
  :deep(.disclaimer) {
    @apply text-center;
  }
}
</style>