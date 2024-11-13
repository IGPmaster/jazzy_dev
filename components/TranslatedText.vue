<script setup>
import { msgTranslate } from '~/composables/globalData';

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
</script>

<template>
    <component :is="tag" :class="class">
        {{ msgTranslate?.[translationKey] || loadingText }}
    </component>
</template>