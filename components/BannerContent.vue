<template>
  <div>
    <div class="container mx-auto text-center sig_terms lg:py-2">
      <div 
        class="px-5 text-jazzy-beige !text-xs !font-light" 
        v-html="sigTerms"
      />
    </div>
    
    <div class="bg-jazzy-beige">
      <div class="container mx-auto px-4 py-4 md:py-8">
        <div class="flex justify-center items-center mx-auto">
          <img 
            :src="oneTwoThreeIcon" 
            class="center"
            loading="lazy"
            alt="Steps"
          />
        </div>
      </div>
    </div>

    <div class="container mx-auto">
      <div class="flex justify-center py-4 md:py-8">
        <img 
          :src="trustIcons"
          class="w-6/8 lg:w-2/5 place-items-center"
          alt="100% Licensed and fast payouts"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sigTerms: String,
  oneTwoThreeIcon: String,
  trustIcons: String
});
</script> 