import { createGtm } from "@gtm-support/vue-gtm";
import { SITE_CONFIG } from '~/composables/globalData';

export default defineNuxtPlugin((nuxtApp) => {
    // Initialize dataLayer with default consent state
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        'event': 'gtm.js',
        'site_name': SITE_CONFIG.siteName,
        // Default consent state - wait for user input
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': 'denied',
        'security_storage': 'granted'
    });

    // Create GTM instance but don't load script yet
    const gtmInstance = createGtm({
        id: SITE_CONFIG.gtmId,
        defer: true, // Defer script loading
        compatibility: false,
        enabled: true,
        debug: process.env.NODE_ENV !== 'production',
        loadScript: false, // Don't load script automatically
        vueRouter: useRouter(),
        trackOnNextTick: false,
    });

    // Add GTM instance to app but don't initialize yet
    nuxtApp.vueApp.use(gtmInstance);

    // Function to initialize GTM when consent is granted
    window.initializeGTM = () => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${SITE_CONFIG.gtmId}`;
        document.head.appendChild(script);
    };
});
