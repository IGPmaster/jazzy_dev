<template>
  <div v-if="game" class="group relative rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
    <a :href="regLink || '#'" target="_blank" class="block w-full pb-[133%] relative">
      <img class="absolute inset-0 w-full h-full object-cover" 
        :src="game.image"
        @error="handleImageError" 
        loading="lazy"
        :alt="gameAltText"
        :title="gameTitleText" />
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-all duration-300">
        <PlayButton />
        <ProviderBadge 
          v-if="game.provider"
          :provider="game.provider" 
        />
      </div>
    </a>
  </div>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true,
    default: () => ({})
  },
  regLink: {
    type: String,
    default: '#'
  }
});

const gameAltText = computed(() => 
  props.game?.gameName 
    ? `Image of ${props.game.gameName} online slot. ${props.game.description || ''}`
    : 'Game image'
);

const gameTitleText = computed(() => 
  props.game?.gameName 
    ? `${props.game.gameName} - ${props.game.id || ''}`
    : 'Game'
);

function handleImageError(event) {
  event.target.src = '/newGameImg.jpg';  // Make sure path is correct
}
</script> 