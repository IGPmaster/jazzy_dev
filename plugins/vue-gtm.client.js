import { createGtm } from "@gtm-support/vue-gtm";
import { SITE_CONFIG } from '~/composables/globalData';

export default defineNuxtPlugin((nuxtApp) => {
    if (typeof window === 'undefined') return;

    try {
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

        // Create GTM instance
        const gtmInstance = createGtm({
            id: SITE_CONFIG.gtmId,
            defer: true,
            compatibility: false,
            enabled: true,
            debug: process.env.NODE_ENV !== 'production',
            loadScript: false,
            vueRouter: useRouter(),
            trackOnNextTick: false,
        });

        // Add GTM instance to app
        nuxtApp.vueApp.use(gtmInstance);

        // Function to initialize GTM
        window.initializeGTM = () => {
            try {
                // Check if the script is already added
                if (!document.querySelector(`script[src="https://www.googletagmanager.com/gtm.js?id=${SITE_CONFIG.gtmId}"]`)) {
                    // Load GTM script
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = `https://www.googletagmanager.com/gtm.js?id=${SITE_CONFIG.gtmId}`;
                    
                    // Add success handler
                    script.onload = () => {
                        console.log('GTM script loaded successfully');
                        // Push initial pageview after script loads
                        window.dataLayer.push({
                            'event': 'pageview',
                            'page_path': window.location.pathname
                        });
                    };
                    
                    // Add error handler
                    script.onerror = (error) => {
                        console.warn('Failed to load GTM script:', error);
                    };
                    
                    document.head.appendChild(script);

                    // Add noscript iframe for better tracking coverage
                    const noscript = document.createElement('noscript');
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.googletagmanager.com/ns.html?id=${SITE_CONFIG.gtmId}`;
                    iframe.height = '0';
                    iframe.width = '0';
                    iframe.style.display = 'none';
                    iframe.style.visibility = 'hidden';
                    noscript.appendChild(iframe);
                    document.body.appendChild(noscript);

                    // Set a flag to indicate GTM has been initialized
                    localStorage.setItem('gtm_initialized', 'true');
                } else {
                    console.log('GTM script already loaded');
                }
            } catch (error) {
                console.warn('Error initializing GTM:', error);
            }
        };

        // Initialize GTM based on consent status - IMMEDIATE CHECK ON PAGE LOAD
        const checkAndInitGTM = () => {
            const savedConsent = localStorage.getItem('cookieConsent');
            if (savedConsent) {
                try {
                    const { preferences } = JSON.parse(savedConsent);
                    if (preferences.analytics) {
                        // If analytics consent is granted, initialize GTM
                        window.initializeGTM();
                        
                        // Also update dataLayer consent state
                        window.dataLayer.push({
                            'event': 'consent_update',
                            'analytics_storage': 'granted',
                            'ad_storage': 'granted',
                            'functionality_storage': 'granted',
                            'personalization_storage': 'granted',
                            'security_storage': 'granted'
                        });
                    }
                } catch (error) {
                    console.warn('Error checking consent status:', error);
                }
            }
        };

        // Run immediately and also after a short delay to ensure DOM is fully loaded
        checkAndInitGTM();
        setTimeout(checkAndInitGTM, 1000);
    } catch (error) {
        console.warn('Error setting up GTM:', error);
    }
});
