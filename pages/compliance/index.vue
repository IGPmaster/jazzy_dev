<template>
    <div>
        <div class="bg-white py-10">
            <div class="container mx-auto px-0">
                <div class="g-btn-wrapper mt-10 md:mt-20 flex flex-wrap justify-center">
                    <button v-for="(value, key) in globalContent" :key="key" @click="handleClick(key)"
                        class="h-10 px-4 md:px-8 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800 uppercase text-xs md:text-base">
                        <TranslatedText :translation-key="value" />
                    </button>
                </div>

                <div class="px-4">
                    <div v-html="htmlContent"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
    msgTranslate, 
    globalContent, 
    loadTranslations,
    PP_API_URL,
    WHITELABEL_ID,
    lang
} from '~/composables/globalData';
import TranslatedText from '~/components/TranslatedText.vue';

function updateCode(key, globalContent) {
    const code = globalContent[key];
    return code;
}

async function fetchContent(code) {
    try {
        const response = await fetch(
            `${PP_API_URL}GetInfoContentByCode?whitelabelId=${WHITELABEL_ID}&country=${lang.value}&code=${code}`
        );
        const data = await response.json();
        return data[0].Html;
    } catch (error) {
        console.error(error);
        return ''; // Return empty string on error
    }
}

const htmlContent = ref('');

onMounted(async () => {
    try {
        await Promise.all([
            loadTranslations(),
            fetchContent('aboutus').then(content => {
                htmlContent.value = content;
            })
        ]);
    } catch (error) {
        console.error('Error loading content:', error);
    }
});

const handleClick = async (key) => {
    const code = updateCode(key, globalContent.value);
    htmlContent.value = await fetchContent(code);
};
</script>

<style scoped></style>
