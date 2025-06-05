<template>
  <div class="">
    <Header />
    <slot />
    <Footer />
    <CookieConsent />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import CookieConsent from '~/components/CookieConsent.vue';

// If you need to initialize cookie consent, do it here
onMounted(() => {
  // Any initialization code can go here
});

</script>