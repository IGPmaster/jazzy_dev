<script setup>
import { msgTranslate } from '~/composables/globalData';
import { computed } from 'vue';

const props = defineProps({
    translationKey: {
        type: String,
        required: true
    },
    loadingText: {
        type: String,
        default: '...'
    },
    tag: {
        type: String,
        default: 'span'
    },
    class: {
        type: String,
        default: ''
    }
});

// Compute the fallback text by converting the translation key to Title Case
const fallbackText = computed(() => {
    return props.translationKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
});
</script>

<template>
    <component :is="tag" :class="class">
        {{ msgTranslate?.[props.translationKey] || fallbackText }}
    </component>
</template>