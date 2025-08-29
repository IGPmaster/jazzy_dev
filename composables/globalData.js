import { ref } from 'vue';

// Site-specific configuration
export const SITE_CONFIG = {
    siteName: 'Jazzy Spins',
    gtmId: 'GTM-NXQKF26Z',
};

export const lang = ref('');
export const tracker = ref('');
export const jurisdictionCode = ref('');
export const footerIcons = ref([]);
export const footerText = ref([]);
export const globalContent = ref({
  'About Us': 'aboutus',
  'Terms and conditions': 'terms',
  'Privacy Policy': 'privacy',
  'Bonus Policy': 'bonus',
  'Responsible Gaming': 'responsible',
  'Licence': 'license',
  'Payouts': 'payouts',
  'Depositing': 'deposits',
  'Cashing Out': 'withdrawals',
  'FAQ': 'faq',
  'Contact Us': 'contact',
});


// ProgressPlay data:
export const WHITELABEL_ID = 239;
export const PP_API_URL = 'https://content.progressplay.net/api23/api/';
const PP_PROMOTIONS_API = `${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&country=`;
export const PP_LOBBY_LINK = 'https://www.jazzyspins.com/';
// Games API with fallback strategy for UK/ISP blocking
const KV_GAMES_PRIMARY = 'https://access-ppgames.tech1960.workers.dev/';
const KV_GAMES_FALLBACK = `https://access-content-pp.tech1960.workers.dev/?type=games&whitelabelId=${WHITELABEL_ID}`;
const KV_GAMES = KV_GAMES_PRIMARY; // Default to primary


// WP-REST-API:
const WP_API = 'https://headless.jazzyspins.com/wp-json/wp/v2/';

//CloudFlare Workers KV data:
// KV_GAMES now defined above for games optimization
export const FILTERED_BY_NAME_KV = 'https://access-filterbyname.tech1960.workers.dev/';
const CF_GEO_WORKER = 'https://cf-geo-lookup.tech1960.workers.dev/';
const KV_SUPPORTED_COUNTRIES = "https://access-supportedcountries.tech1960.workers.dev/";
//const REST_COUNTRY_KV = "https://access-restcountries.tech1960.workers.dev/";
const IGP_SUPPORTED_COUNTRIES = "https://igp-supported-countries.tech1960.workers.dev/";
const KV_TRANSLATIONS ="https://access-translations.tech1960.workers.dev/";

const games = ref([]);
const newGames = ref([]);
const filterByName = ref([]);
const popularGames = ref([]);
const casinoGames = ref([]);
const jackpotGames = ref([]);
const slotGames = ref([]);
const liveGames = ref([]);
const scratchGames = ref([]);
const blackjackGames = ref([]);
const rouletteGames = ref([]);
const regLink = ref([null]);
const loginLink = ref([null]);
const playLink = ref([null]);
const msgTranslate = ref({});
const pp_promotions = ref([]);
const promotionsPosts = ref([]);
const countryCode = ref('');
const countryName = ref('');
const countries = ref('');
const country = ref('');
const countryNotSupported = ref(false);
const countriesData = ref([]);

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const apiCache = {
  games: { data: null, timestamp: null },
  // Add other cache entries as needed
};

// 🎮 GAMES API OPTIMIZATION - Critical for CPU time limit fix
let gamesCache = null;
let gamesCacheTime = 0;
let gamesRequestInFlight = null; // 🔑 CRITICAL: Prevents duplicate calls
const GAMES_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function isCacheValid(cacheEntry) {
  return cacheEntry?.data && 
         cacheEntry?.timestamp && 
         (Date.now() - cacheEntry.timestamp < CACHE_DURATION);
}

export async function checkCountry() {
  try {
    const workerResponse = await fetch(CF_GEO_WORKER);
    const workerData = await workerResponse.json();
    const countryCodeValue = workerData.countryCode;

    if (!countryCode.value.includes(countryCodeValue)) {
      countryName.value = workerData.countryName;
      countryNotSupported.value = true;
    }
  } catch (error) {
    console.error('Error checking country:', error);
  }
}

export async function loadLang() {
  if (typeof window !== 'undefined') {
    let langValue;

// List of EU country codes (ISO 3166-1 alpha-2)
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

// 1. Check CF_GEO_WORKER for originalLang and continent
try {
  console.log('🌍 GEO: Fetching geo data from CloudFlare Worker...');
  const workerResponse = await fetch(CF_GEO_WORKER);
  const workerData = await workerResponse.json();
  const originalLang = workerData.countryCode;
  const continent = workerData.continent;
  
  console.log('🌍 GEO: Detected country:', originalLang, 'continent:', continent);

  // 2:1 Verify value with KV_SUPPORTED_COUNTRIES
  const apiResponse = await fetch(KV_SUPPORTED_COUNTRIES);
  const apiData = await apiResponse.json();
  const foundLangKV = apiData.find(c => c.countryIntlCode === originalLang);

  // Verify value with IGP_SUPPORTED_COUNTRIES
  const igpResponse = await fetch(IGP_SUPPORTED_COUNTRIES);
  const igpData = await igpResponse.json();
  const foundLangIGP = Object.values(igpData).flat().includes(originalLang);

  // Check if the originalLang exists in both KV's
  if (foundLangKV && foundLangIGP) {
    console.log('🌍 GEO: Country', originalLang, 'is supported, using it');
    langValue = originalLang;
  } else {
    // Use continent-based fallback (more reliable than hardcoded array)
    if (continent === 'EU') {
      console.log('🌍 GEO: EU continent detected, falling back to IE');
      langValue = 'IE';
    } else if (EU_COUNTRIES.includes(originalLang)) {
      // Backup check if continent data is missing
      console.log('🌍 GEO: No continent data, but found', originalLang, 'in EU countries array, using IE');
      langValue = 'IE';
    } else {
      console.log('🌍 GEO: Non-EU country, falling back to CA');
      langValue = 'CA';
    }
  }
} catch (error) {
  console.error('❌ GEO: Error getting country code:', error);
  langValue = 'IE'; // Safe fallback
}

    // 2:2 Check if lang cookie exists
    const cookieLang = getCookie('lang');

    if (cookieLang) {
      // 2:3 Compare values, if same use cookie value
      if (langValue && langValue.toUpperCase() === cookieLang.toUpperCase()) {
        lang.value = cookieLang.toUpperCase();
      } else {
        // 2:4 If NOT same value (or empty lang cookie), set new lang cookie value from CF_GEO_WORKER value
        lang.value = langValue || 'IE';
        // Set the 'lang' cookie to the selected language for one month
        setCookie('lang', lang.value, 30, 'None', true);
      }
    } else {
      // 3. Fallback to "IE" if all the above fails
      lang.value = langValue || 'IE';
      // Set the 'lang' cookie to the selected language for one month
      setCookie('lang', lang.value, 30, 'None', true);
    }

    // Fetch the country data based on the selected language
    await fetchCountry();
  }
}

async function fetchCountry() {
  try {
    const response = await fetch(KV_SUPPORTED_COUNTRIES);
    if (!response.ok) {
      throw new Error(`Failed to fetch country data (status ${response.status})`);
    }
    const data = await response.json();
    //console.log('Selected language:', lang.value);
    const country = data.find(c => c.countryIntlCode === lang.value);
    //console.log('Found country:', country);
    if (country) {
      jurisdictionCode.value = country.jurisdictionCode;
      //console.log('jurisdictionCode:', jurisdictionCode.value);
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
  await loadTranslations();
}

export async function loadTranslations() {
  try {
    const response = await fetch(IGP_SUPPORTED_COUNTRIES);
    const IGP_SUPPORTED_COUNTRIES_KV = await response.json();
    let langCode = lang.value;
    const countryCode = langCode;
    if (!Object.values(IGP_SUPPORTED_COUNTRIES_KV).flat().includes(countryCode)) {
      // If country not found in supported countries, default to English with IE country code
      langCode = 'EN';
      lang.value = 'IE';
    } else {
      for (const [key, value] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
        if (value.includes(countryCode)) {
          langCode = key.toLowerCase();
          break;
        }
      }
    }

    // Fetch translations from the worker
    const translationsResponse = await fetch(`${KV_TRANSLATIONS}?lang=${langCode}`);
    const allTranslations = await translationsResponse.json();

    msgTranslate.value = allTranslations;
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

async function fetchApiPromotions() {
  try {
    console.log('🎁 UNIFIED: Starting fetchApiPromotions()');
    console.log('🔍 UNIFIED: lang.value =', lang.value);
    console.log('🔍 UNIFIED: WHITELABEL_ID =', WHITELABEL_ID);
    console.log('🔍 UNIFIED: process.client =', process.client);
    
    // Always use CloudFlare Worker - NO DIRECT API FALLBACK (CORS blocked)
    const apiUrl = `https://access-content-pp.tech1960.workers.dev/?type=promotions&whitelabelId=${WHITELABEL_ID}&country=${lang.value}`;
    
    console.log('📡 UNIFIED: Fetching promotions from URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('📊 UNIFIED: Response status:', response.status);
    console.log('📊 UNIFIED: Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('❌ UNIFIED: CloudFlare Worker failed with status:', response.status);
      pp_promotions.value = [];
      return;
    }
    
    const responseData = await response.json();
    console.log('📄 UNIFIED: Raw response:', JSON.stringify(responseData).substring(0, 300));
    
    // Handle unified response format
    const data = responseData.promotions || responseData;
    
    console.log('✅ UNIFIED: Data received:', Array.isArray(data) ? `Array with ${data.length} items` : typeof data);
    
    pp_promotions.value = data || [];
    console.log('✅ UNIFIED: pp_promotions.value set to length:', pp_promotions.value.length);
  } catch (error) {
    console.error('❌ UNIFIED: Error fetching promotions:', error);
    console.error('❌ UNIFIED: Error stack:', error.stack);
    pp_promotions.value = []; // Ensure it's always an array on error
  }
}

export async function fetchPromotions() {
  try {
    const response = await fetch(`${WP_API}promotions?per_page=100`);
    const data = await response.json();

    // First try to find content for current country
    let filteredData = data.filter((item) => {
      const geoTarget = item.acf.geo_target_country_sel;
      return geoTarget && geoTarget.includes(lang.value);
    });

    // If no content found for current country, fallback to IE content
    if (filteredData.length === 0) {
      filteredData = data.filter((item) => {
        const geoTarget = item.acf.geo_target_country_sel;
        return geoTarget && geoTarget.includes('IE');
      });
    }

    promotionsPosts.value = filteredData;
  } catch (error) {
    console.error('Error fetching promotions:', error);
  }
}

export async function fetchFilterByName() {
  try {
    const response = await fetch(FILTERED_BY_NAME_KV);
    const data = await response.json();
    filterByName.value = data;
  } catch (error) {
    console.error('Error fetching filterByName:', error);
  }
}

// Helper function to actually fetch games (only called when needed)
async function actuallyFetchGames() {
  console.log('🎮 GAMES: Making actual API call to CloudFlare Worker...');
  
  await fetchFilterByName();
  
  let response;
  let data;
  
  try {
    // Try primary games worker first
    console.log('🎮 GAMES: Trying primary worker:', KV_GAMES_PRIMARY);
    response = await fetch(KV_GAMES_PRIMARY);
    
    if (!response.ok) {
      throw new Error(`Primary worker failed with status: ${response.status}`);
    }
    
    data = await response.json();
    console.log('✅ GAMES: Primary worker succeeded');
    
  } catch (primaryError) {
    console.warn('⚠️ GAMES: Primary worker failed, trying fallback:', primaryError.message);
    console.log('🎮 GAMES: Trying fallback worker:', KV_GAMES_FALLBACK);
    
    try {
      response = await fetch(KV_GAMES_FALLBACK);
      
      if (!response.ok) {
        throw new Error(`Fallback worker failed with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      // Handle different response formats from fallback worker
      data = responseData.games || responseData;
      console.log('✅ GAMES: Fallback worker succeeded');
      
    } catch (fallbackError) {
      console.error('❌ GAMES: Both primary and fallback workers failed');
      console.error('❌ GAMES: Primary error:', primaryError.message);
      console.error('❌ GAMES: Fallback error:', fallbackError.message);
      throw new Error('All games API endpoints failed');
    }
  }

  // Add your logic for processing the games data here
  const filteredGames = data.filter(game => {
    const hasName = filterByName.value.some(name => game.gameName.toLowerCase().includes(name.toLowerCase()));
    const hasId = filterByName.value.some(id => game.gameId == id);

    // Check for jurisdictionCode and excluded countries
    const isExcludedJurisdiction = game.excludedJurisdictions?.includes(jurisdictionCode.value);
    const isExcludedCountry = game.excludedCountries?.includes(lang.value);

    return !(hasName || hasId || isExcludedJurisdiction || isExcludedCountry);
  });

  // Set all game categories
  games.value = filteredGames;
  newGames.value = filteredGames.filter(game => game.gameFilters?.includes('New'));
  popularGames.value = filteredGames.filter(game => game.gameFilters?.includes('Featured'));
  casinoGames.value = filteredGames.filter(game => game.gameType?.includes('Casino'));
  slotGames.value = filteredGames.filter(game => game.gameType?.includes('Slots'));
  jackpotGames.value = filteredGames.filter(game => game.gameType?.includes('Jackpots'));
  liveGames.value = filteredGames.filter(game => game.gameType?.includes('Live'));
  scratchGames.value = filteredGames.filter(game => game.gameName?.toLowerCase().includes('scratch'));
  blackjackGames.value = filteredGames.filter(game => game.gameFilters?.includes('Blackjack'));
  rouletteGames.value = filteredGames.filter(game => game.gameFilters?.includes('Roulette'));

  // Cache the results
  gamesCache = {
    games: filteredGames,
    newGames: newGames.value,
    popularGames: popularGames.value,
    casinoGames: casinoGames.value,
    slotGames: slotGames.value,
    jackpotGames: jackpotGames.value,
    liveGames: liveGames.value,
    scratchGames: scratchGames.value,
    blackjackGames: blackjackGames.value,
    rouletteGames: rouletteGames.value,
  };
  gamesCacheTime = Date.now();
  
  console.log('✅ GAMES: API call completed, cached', filteredGames.length, 'games');
  
  await updateLinks();
}

export async function fetchGames() {
  try {
    // 1. Check cache FIRST (before Worker call)
    const now = Date.now();
    if (gamesCache && (now - gamesCacheTime) < GAMES_CACHE_DURATION) {
      console.log('🎮 GAMES: Using cached games data (', Math.round((now - gamesCacheTime) / 1000), 'seconds old)');
      // Set all game categories from cache
      games.value = gamesCache.games;
      newGames.value = gamesCache.newGames;
      popularGames.value = gamesCache.popularGames;
      casinoGames.value = gamesCache.casinoGames;
      slotGames.value = gamesCache.slotGames;
      jackpotGames.value = gamesCache.jackpotGames;
      liveGames.value = gamesCache.liveGames;
      scratchGames.value = gamesCache.scratchGames;
      blackjackGames.value = gamesCache.blackjackGames;
      rouletteGames.value = gamesCache.rouletteGames;
      await updateLinks();
      return; // No Worker call needed!
    }
    
    // 2. Check if request already in flight (prevent duplicate calls)
    if (gamesRequestInFlight) {
      console.log('🎮 GAMES: Request already in progress, waiting...');
      await gamesRequestInFlight;
      // After waiting, use data from completed request
      if (gamesCache) {
        console.log('🎮 GAMES: Using data from completed request');
        games.value = gamesCache.games;
        newGames.value = gamesCache.newGames;
        popularGames.value = gamesCache.popularGames;
        casinoGames.value = gamesCache.casinoGames;
        slotGames.value = gamesCache.slotGames;
        jackpotGames.value = gamesCache.jackpotGames;
        liveGames.value = gamesCache.liveGames;
        scratchGames.value = gamesCache.scratchGames;
        blackjackGames.value = gamesCache.blackjackGames;
        rouletteGames.value = gamesCache.rouletteGames;
        await updateLinks();
      }
      return; // No duplicate Worker call!
    }
    
    // 3. Start new request (only one at a time)
    console.log('🎮 GAMES: Fetching fresh games data...');
    gamesRequestInFlight = actuallyFetchGames();
    await gamesRequestInFlight;
    gamesRequestInFlight = null;

  } catch (error) {
    console.error('❌ GAMES: Error fetching games:', error);
    gamesRequestInFlight = null; // Reset on error
  }
}

export async function handleParameter(parameterName) {
  if (typeof window === 'undefined') return '';

  try {
    const params = new URLSearchParams(window.location.search);
    const parameterFromURL = params.get(parameterName);
    const parameterFromCookie = getCookie(parameterName);

    if (parameterFromURL) {
      setCookie(parameterName, parameterFromURL, 30, 'None', true);
      return parameterFromURL;
    } else if (parameterFromCookie) {
      return parameterFromCookie;
    }
    return '';
  } catch (error) {
    console.error(`Error handling parameter ${parameterName}:`, error);
    return '';
  }
}

export async function fetchSupportedCountries() {
  const response = await fetch(IGP_SUPPORTED_COUNTRIES);
  return await response.json();
}



// globalData.js
const footerIconsCache = new Map();
const footerTextCache = new Map();
const contentCache = new Map();
const CONTENT_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function fetchCachedContent(code, country = lang.value) {
  // CRITICAL: Ensure we use supported country, not raw detected country
  // If no country provided, use the resolved lang.value (which should be the fallback)
  const resolvedCountry = country;
  // KV key format: content:aboutus:239:IE (content:code:whitelabel:country)
  const cacheKey = `content:${code}:${WHITELABEL_ID}:${resolvedCountry}`;
  const now = Date.now();
  
  // Check cache first
  if (contentCache.has(cacheKey)) {
    const cached = contentCache.get(cacheKey);
    if ((now - cached.timestamp) < CONTENT_CACHE_DURATION) {
      console.log('📄 CONTENT: Using cached content for', code);
      return cached.data;
    }
  }
  
  try {
    console.log('📄 CONTENT: Fetching fresh content for', code);
    console.log('🔍 CONTENT DEBUG: country parameter =', resolvedCountry);
    console.log('🔍 CONTENT DEBUG: lang.value =', lang.value);
    console.log('🔍 CONTENT DEBUG: cache key =', cacheKey);
    console.log('🔍 CONTENT DEBUG: WHITELABEL_ID =', WHITELABEL_ID);
    
    // Use unified Worker for KV caching - NO DIRECT API FALLBACK (CORS blocked)
    const apiUrl = `https://access-content-pp.tech1960.workers.dev/?type=content&codes=${code}&whitelabelId=${WHITELABEL_ID}&country=${resolvedCountry}`;
    console.log('🔍 CONTENT DEBUG: Full API URL =', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('📊 CONTENT: Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ CONTENT: CloudFlare Worker failed with status:', response.status);
      return '';
    }
    
    const responseData = await response.json();
    console.log('📄 CONTENT: Raw response keys:', Object.keys(responseData));
    
    const data = responseData[code];
    const htmlContent = data && data[0] ? data[0].Html : '';
    
    console.log('📄 CONTENT: Extracted HTML length:', htmlContent.length);
    
    // Cache the result
    contentCache.set(cacheKey, {
      data: htmlContent,
      timestamp: now
    });
    
    console.log('✅ CONTENT: Content cached for', code, 'for', CONTENT_CACHE_DURATION / 60000, 'minutes');
    return htmlContent;
    
  } catch (error) {
    console.error('❌ CONTENT: Error fetching content:', error);
    return '';
  }
}

async function fetchFooterIconsServer(lang) {
  if (footerIconsCache.has(lang)) {
    footerIcons.value = footerIconsCache.get(lang);
  } else {
    const response = await fetch(`${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&country=${lang}&code=footericon`);
    const data = await response.json();
    footerIcons.value = data;
    footerIconsCache.set(lang, data);
  }
}

async function fetchFooterTextServer(lang) {
  if (footerTextCache.has(lang)) {
    footerText.value = footerTextCache.get(lang);
  } else {
    const response = await fetch(`${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&country=${lang}&code=footertext`);
    const data = await response.json();
    footerText.value = data;
    footerTextCache.set(lang, data);
  }
}



function setCookie(name, value, days, sameSite, secure) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  const sameSiteAttribute = sameSite ? '; SameSite=' + sameSite : '';
  const secureAttribute = secure ? '; Secure' : '';
  document.cookie = name + '=' + (value || '') + expires + sameSiteAttribute + secureAttribute + '; path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function fetchCountriesData() {
  try {
    const IGP_SUPPORTED_COUNTRIES_KV = await fetchSupportedCountries();
    const countries = [];

    for (const [language, countryCodes] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
      for (const countryCode of countryCodes) {
        try {
          countries.push({
            name: countryCode,
            code: countryCode,
            language: language,
            // Since REST_COUNTRY_KV is commented out, we'll use simple flags
            flagUrl: `/flags/${countryCode.toLowerCase()}.svg`
          });
        } catch (error) {
          console.error(`Error processing country ${countryCode}:`, error);
          continue;
        }
      }
    }

    return countries.filter(country => country.language !== '');
  } catch (error) {
    console.error('Error in fetchCountriesData:', error);
    return [];
  }
}


export { 
    fetchApiPromotions, 
    games, 
    newGames, 
    popularGames, 
    jackpotGames, 
    casinoGames, 
    slotGames, 
    scratchGames, 
    liveGames,
    blackjackGames,
    rouletteGames,
    regLink,
    loginLink,
    playLink,
    msgTranslate,
    pp_promotions,
    promotionsPosts,
    countryCode,
    countryName,
    countries,
    country,
    countriesData,
    countryNotSupported,
    getCookie, 
    setCookie, 
};

export async function fetchFooterContent(lang) {
  const cacheKey = `footer_${lang}`;
  
  if (footerIconsCache.has(cacheKey)) {
    const cached = footerIconsCache.get(cacheKey);
    footerIcons.value = cached.footericon || [];
    footerText.value = cached.footertext || [];
    console.log('🚀 UNIFIED: Using cached footer content');
    return;
  }

  try {
    // UNIFIED API CALL: Always use CloudFlare Worker - NO DIRECT API FALLBACK (CORS blocked)
    const apiUrl = `https://access-content-pp.tech1960.workers.dev/?type=content&codes=footericon,footertext&whitelabelId=${WHITELABEL_ID}&country=${lang}`;

    console.log('🚀 UNIFIED: Fetching footer content (icons + text) in single call');
    console.log('📡 UNIFIED: Footer URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('📊 UNIFIED: Footer response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ UNIFIED: Footer CloudFlare Worker failed with status:', response.status);
      footerIcons.value = [];
      footerText.value = [];
      return;
    }
    
    const data = await response.json();
    console.log('📄 UNIFIED: Footer response keys:', Object.keys(data));
    
    // Extract individual results from unified response
    footerIcons.value = data.footericon || [];
    footerText.value = data.footertext || [];
    
    console.log('✅ UNIFIED: Footer icons length:', footerIcons.value.length);
    console.log('✅ UNIFIED: Footer text length:', footerText.value.length);
    
    // Cache the unified result
    footerIconsCache.set(cacheKey, data);
    console.log('✅ UNIFIED: Footer content cached successfully');
  } catch (error) {
    console.error('❌ UNIFIED: Error fetching footer content:', error);
    footerIcons.value = [];
    footerText.value = [];
  }
}

export function cleanup() {
  // Clear all refs
  games.value = [];
  newGames.value = [];
  popularGames.value = [];
  // ... clear other refs

  // Clear caches
  Object.keys(apiCache).forEach(key => {
    apiCache[key] = { data: null, timestamp: null };
  });
  footerIconsCache.clear();
  footerTextCache.clear();
}

export const CONFIG = Object.freeze({
  CACHE_DURATION: 30 * 60 * 1000,
  MAX_RETRIES: 3,
  DEFAULT_COUNTRY: 'IE',
  COOKIE_EXPIRY_DAYS: 30,
  API_TIMEOUT: 5000,
  SUPPORTED_LANGUAGES: ['EN', 'DE', 'ES']
});

async function updateGameCategories(filteredGames) {
  games.value = filteredGames;
  
  // Filter new games
  newGames.value = filteredGames.filter(game => 
    game.gameFilters?.includes('New')
  );
  
  popularGames.value = filteredGames.filter(game => 
    game.gameFilters?.includes('Featured')
  );
  
  casinoGames.value = filteredGames.filter(game => 
    game.gameType?.includes('Casino')
  );
  
  slotGames.value = filteredGames.filter(game => 
    game.gameType?.includes('Slots')
  );
  
  jackpotGames.value = filteredGames.filter(game => 
    game.gameType?.includes('Jackpots')
  );
  
  liveGames.value = filteredGames.filter(game => 
    game.gameType?.includes('Live')
  );
  
  scratchGames.value = filteredGames.filter(game => 
    game.gameName?.toLowerCase().includes('scratch')
  );
  
  blackjackGames.value = filteredGames.filter(game => 
    game.gameFilters?.includes('Blackjack')
  );
  
  rouletteGames.value = filteredGames.filter(game => 
    game.gameFilters?.includes('Roulette')
  );
}

export async function updateLinks() {
  if (typeof window === 'undefined') return;

  try {
    const trackerValue = await handleParameter('tracker');
    const btagValue = await handleParameter('btag');
    const affidValue = await handleParameter('affid');

    const queryParams = new URLSearchParams();
    
    if (trackerValue) queryParams.set('tracker', trackerValue);
    if (btagValue) queryParams.set('btag', btagValue);
    if (affidValue) queryParams.set('affid', affidValue);

    const queryString = queryParams.toString();
    const baseUrl = PP_LOBBY_LINK.endsWith('/') ? PP_LOBBY_LINK : `${PP_LOBBY_LINK}/`;

    regLink.value = `${baseUrl}${queryString ? '?' + queryString : ''}#registration`;
    loginLink.value = `${baseUrl}${queryString ? '?' + queryString : ''}#login`;
    playLink.value = `${baseUrl}${queryString ? '?' + queryString : ''}#play/`;

    // Store tracker in cookie if it exists
    if (trackerValue) {
      setCookie('tracker', trackerValue, 30, 'None', true);
    }
  } catch (error) {
    console.error('Error updating links:', error);
  }
}
