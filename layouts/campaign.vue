<template>
  <div>
    <slot />
    <Footer />
    <CookieConsent />
  </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue';
import CookieConsent from '~/components/CookieConsent.vue';
</script> 