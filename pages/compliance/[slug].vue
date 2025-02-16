<template>
    <div>
        <div class="">
            <div class="container mx-auto bg-white pt-32">
                <div class="px-4">
                    <NuxtLink to="/compliance" class="flex justify-center gap-4 p-2 border rounded border-primary text-gray-800 text-center w-1/2 md:w-1/5 cursor-pointer">
                        <i class="material-icons">arrow_back</i>
                        <TranslatedText translation-key="legal" />
                    </NuxtLink>
                    <div class="">
                        <div v-html="htmlContent"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
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

const route = useRoute();
const slug = route.params.slug;

async function fetchContent(slug) {
    try {
        const response = await fetch(
            `${PP_API_URL}GetInfoContentByCode?whitelabelId=${WHITELABEL_ID}&country=${lang.value}&code=${slug}`
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
            fetchContent(slug).then(content => {
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
