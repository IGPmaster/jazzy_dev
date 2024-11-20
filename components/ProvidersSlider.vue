<template>
  <div class="bg-jazzy-liteblue py-0 md:py-2 overflow-hidden relative">
    <div class="slider">
      <div class="slide-track">
        <div v-for="provider in [...providers, ...providers]" :key="`logo-${provider.id}`"
          class="slide flex-shrink-0 w-48 h-24 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300 mx-4">
          <img :src="provider.path" :alt="`Provider ${provider.id}`"
            class="w-36 h-16 object-contain transition-all duration-300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Generate array of image paths
const providers = Array.from({ length: 29 }, (_, i) => ({
  id: i + 1,
  path: `/images/providers/providers_${String(i + 1).padStart(2, '0')}.png`
}));
</script>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slide-track {
  display: flex;
  width: calc(192px * 12);
  animation: scroll 20s linear infinite;
}

.slide {
  flex-shrink: 0;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(calc(-192px * 6));
  }
}

/* Optional: Pause on hover */
.slide-track:hover {
  animation-play-state: paused;
}
</style> 