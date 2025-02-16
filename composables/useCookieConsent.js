import { ref, onMounted, watch } from 'vue';
import { PP_LOBBY_LINK, getCookie, setCookie, updateLinks } from './globalData';

// Create global reactive state
const globalShowBanner = ref(false);
const globalPreferences = ref({
  necessary: true,
  analytics: true,
  affiliate: true
});
const globalIsPreferencesOpen = ref(false);
const hasUserMadeChoice = ref(false);

export function useCookieConsent() {
  const showBanner = globalShowBanner;
  const isPreferencesOpen = globalIsPreferencesOpen;
  const pendingTracker = ref(null);
  
  const regLink = ref('');
  const loginLink = ref('');
  const playLink = ref('');
  
  const preferences = globalPreferences;

  const cookieCategories = [
    {
      id: 'necessary',
      label: 'Necessary Cookies',
      description: 'Essential for website functionality. These cookies are required and cannot be disabled.',
      required: true
    },
    {
      id: 'analytics',
      label: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website. These cookies collect anonymous information.',
      required: false
    },
    {
      id: 'affiliate',
      label: 'Affiliate Tracking',
      description: 'Essential for our business operations. We use a unique identifier stored for 30 days to credit our partners when you visit gaming sites. No personal data is collected.',
      required: false
    }
  ];

  const getTrackerFromURL = () => {
    if (typeof window === 'undefined' || !hasUserMadeChoice.value || !preferences.value.affiliate) return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tracker');
  };

  const updateLobbyLinks = (tracker) => {
    const urlParams = new URLSearchParams(window.location.search);
    const btag = urlParams.get('btag');
    const affid = urlParams.get('affid');
    
    // Only include tracker if affiliate tracking is consented to and user has made a choice
    let finalTracker = null;
    if (preferences.value.affiliate && hasUserMadeChoice.value) {
        // Only check for tracker if we have consent
        const urlTracker = tracker || urlParams.get('tracker') || getCookie('affiliateTracker');
        finalTracker = urlTracker;
    }
    
    // Build query string with all available parameters
    const queryParams = new URLSearchParams();
    if (finalTracker) queryParams.set('tracker', finalTracker);
    if (btag) queryParams.set('btag', btag);
    if (affid) queryParams.set('affid', affid);
    
    const queryString = queryParams.toString();
    const queryStringWithQuestionMark = queryString ? `?${queryString}` : '';
    
    regLink.value = `${PP_LOBBY_LINK}${queryStringWithQuestionMark}#registration`;
    loginLink.value = `${PP_LOBBY_LINK}${queryStringWithQuestionMark}#login`;
    playLink.value = `${PP_LOBBY_LINK}${queryStringWithQuestionMark}#play/`;
  };

  const setAffiliateTracking = (tracker) => {
    // Only set the cookie if affiliate tracking is consented to and user has made a choice
    if (!tracker || !preferences.value.affiliate || !hasUserMadeChoice.value) {
        updateLobbyLinks(null);
        return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    document.cookie = `affiliateTracker=${tracker}; max-age=${30*24*60*60}; path=/; SameSite=Strict; Secure`;
    updateLobbyLinks(tracker);
  };

  const clearNonEssentialCookies = () => {
    if (typeof document === 'undefined') return;
    
    const cookiesToKeep = ['PHPSESSID'];
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!cookiesToKeep.includes(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }
    });
  };

  const handleAnalytics = (enabled) => {
    if (typeof window === 'undefined') return;
    
    // Check Do Not Track setting
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    if (dnt === "1" || dnt === "yes") {
      enabled = false;
    }

    // Update GTM consent state
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'consent_update',
        'analytics_storage': enabled ? 'granted' : 'denied',
        'ad_storage': enabled ? 'granted' : 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': enabled ? 'granted' : 'denied',
        'security_storage': 'granted'
      });

      // Initialize GTM only if analytics is enabled and user has made a choice
      if (enabled && hasUserMadeChoice.value && window.initializeGTM) {
        window.initializeGTM();
      }
    }
  };

  const saveToLocalStorage = (prefs) => {
    if (!hasUserMadeChoice.value) return;
    
    // Only clear cookies if user has explicitly declined
    if (!prefs.analytics && !prefs.affiliate) {
      clearNonEssentialCookies();
    }

    localStorage.setItem('cookieConsent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));

    if (prefs.affiliate) {
      const urlTracker = getTrackerFromURL();
      const trackerToUse = urlTracker || pendingTracker.value;
      if (trackerToUse) {
        setAffiliateTracking(trackerToUse);
      } else {
        const existingTracker = getCookie('affiliateTracker');
        updateLobbyLinks(existingTracker);
      }
    } else {
      updateLobbyLinks(null);
    }

    handleAnalytics(prefs.analytics);
  };

  const handleAcceptAll = () => {
    hasUserMadeChoice.value = true;
    const allAccepted = {
      necessary: true,
      analytics: true,
      affiliate: true
    };
    preferences.value = allAccepted;
    saveToLocalStorage(allAccepted);
    updateLinks();
    showBanner.value = false;
  };

  const clearAllStorage = () => {
    if (typeof window === 'undefined') return;
    
    // Clear cookies
    const cookiesToKeep = ['PHPSESSID'];
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!cookiesToKeep.includes(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }
    });

    // Clear localStorage except for essential items
    const localStorageKeep = ['cookieConsent'];
    Object.keys(localStorage).forEach(key => {
      if (!localStorageKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage completely
    sessionStorage.clear();
  };

  const handleDeclineAll = () => {
    hasUserMadeChoice.value = true;
    const allDeclined = {
      necessary: true,
      analytics: false,
      affiliate: false
    };
    preferences.value = allDeclined;
    clearAllStorage();
    saveToLocalStorage(allDeclined);
    updateLinks();
    showBanner.value = false;
  };

  const savePreferences = () => {
    hasUserMadeChoice.value = true;
    const finalPreferences = {
      ...preferences.value,
      necessary: true
    };
    preferences.value = finalPreferences;
    saveToLocalStorage(finalPreferences);
    updateLinks();
    showBanner.value = false;
    isPreferencesOpen.value = false;
  };

  const handleOpenPreferences = () => {
    if (!localStorage.getItem('cookieConsent')) {
      preferences.value = {
        necessary: true,
        analytics: true,
        affiliate: true
      };
    } else {
      try {
        const { preferences: savedPreferences } = JSON.parse(localStorage.getItem('cookieConsent'));
        preferences.value = {
          ...savedPreferences,
          necessary: true
        };
      } catch (e) {
        preferences.value = {
          necessary: true,
          analytics: true,
          affiliate: true
        };
      }
    }
    isPreferencesOpen.value = true;
  };

  const getConsentStatus = () => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) return null;
    
    try {
      return JSON.parse(savedConsent);
    } catch (e) {
      return null;
    }
  };

  const withdrawConsent = () => {
    clearAllStorage();
    localStorage.removeItem('cookieConsent');
    preferences.value = {
      necessary: true,
      analytics: false,
      affiliate: false
    };
    updateLobbyLinks(null);
    showBanner.value = true;
  };

  onMounted(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    
    if (savedConsent) {
      try {
        const { preferences: savedPreferences } = JSON.parse(savedConsent);
        hasUserMadeChoice.value = true;
        preferences.value = {
          ...savedPreferences,
          necessary: true
        };
        
        // Only handle affiliate tracking if consent exists and user has made a choice
        if (savedPreferences.affiliate && hasUserMadeChoice.value) {
          const urlTracker = getTrackerFromURL();
          if (urlTracker) {
            setAffiliateTracking(urlTracker);
          } else {
            const existingTracker = getCookie('affiliateTracker');
            updateLobbyLinks(existingTracker);
          }
        } else {
          updateLobbyLinks(null);
        }

        handleAnalytics(savedPreferences.analytics);
        
        showBanner.value = false;
      } catch (e) {
        console.error('Error parsing saved consent:', e);
        hasUserMadeChoice.value = false;
        preferences.value = {
          necessary: true,
          analytics: true,
          affiliate: true
        };
        showBanner.value = true;
        updateLobbyLinks(null);
      }
    } else {
      // First visit - set default preferences to all enabled but don't apply them yet
      hasUserMadeChoice.value = false;
      preferences.value = {
        necessary: true,
        analytics: true,
        affiliate: true
      };
      updateLobbyLinks(null);
      showBanner.value = true;
    }
  });

  // Add watch effect for preferences changes
  watch(preferences, (newPrefs) => {
    if (typeof window === 'undefined') return;
    
    // Update all necessary state when preferences change
    saveToLocalStorage(newPrefs);
    handleAnalytics(newPrefs.analytics);
    
    if (newPrefs.affiliate) {
      const urlTracker = getTrackerFromURL();
      const trackerToUse = urlTracker || pendingTracker.value;
      if (trackerToUse) {
        setAffiliateTracking(trackerToUse);
      } else {
        const existingTracker = getCookie('affiliateTracker');
        updateLobbyLinks(existingTracker);
      }
    } else {
      updateLobbyLinks(null);
    }
  }, { deep: true });

  return {
    showBanner,
    isPreferencesOpen,
    preferences,
    cookieCategories,
    handleAcceptAll,
    handleDeclineAll,
    savePreferences,
    handleOpenPreferences,
    withdrawConsent,
    getConsentStatus,
    regLink,
    loginLink,
    playLink
  };
} 