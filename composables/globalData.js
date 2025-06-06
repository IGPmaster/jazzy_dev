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
//const KV_GAMES = `https://content.progressplay.net/api23/api/game?whitelabelId=${WHITELABEL_ID}`; // Test API


// WP-REST-API:
const WP_API = 'https://headless.jazzyspins.com/wp-json/wp/v2/';

//CloudFlare Workers KV data:
export const KV_GAMES = 'https://access-ppgames.tech1960.workers.dev/';
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

// 1. Check CF_GEO_WORKER for originalLang
try {
  const workerResponse = await fetch(CF_GEO_WORKER);
  const workerData = await workerResponse.json();
  const originalLang = workerData.countryCode;

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
    langValue = originalLang;
  } else if (EU_COUNTRIES.includes(originalLang)) {
    // If unsupported but in EU, fallback to IE
    langValue = 'IE';
  } else {
    // Otherwise, fallback to CA
    langValue = 'CA';
  }
} catch (error) {
  console.error('Error getting country code:', error);
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
    const response = await fetch(`${PP_API_URL}PromotionsInfo?whitelabelId=${WHITELABEL_ID}&country=${lang.value}`);
    const data = await response.json();
    pp_promotions.value = data;
    //console.log('this.pp_promotions 123: ', pp_promotions.value);
  } catch (error) {
    console.error(error);
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

export async function fetchGames() {
  try {
    await fetchFilterByName();
    const response = await fetch(KV_GAMES);
    const data = await response.json();

    // Add your logic for processing the games data here
    const filteredGames = data.filter(game => {
      const hasName = filterByName.value.some(name => game.gameName.toLowerCase().includes(name.toLowerCase()));
      const hasId = filterByName.value.some(id => game.gameId == id);

      // Check for jurisdictionCode and excluded countries
      const isExcludedJurisdiction = game.excludedJurisdictions?.includes(jurisdictionCode.value);
      const isExcludedCountry = game.excludedCountries?.includes(lang.value);

      return !(hasName || hasId || isExcludedJurisdiction || isExcludedCountry);
    });

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

    await updateLinks();

  } catch (error) {
    console.error('Error fetching games:', error);
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

export async function fetchFooterIcons(lang) {
  if (footerIconsCache.has(lang)) {
    footerIcons.value = footerIconsCache.get(lang);
  } else {
    const response = await fetch(`${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&country=${lang}&code=footericon`);
    const data = await response.json();
    footerIcons.value = data;
    footerIconsCache.set(lang, data);
  }
}

export async function fetchFooterText(lang) {
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
  const [icons, text] = await Promise.all([
    fetchFooterIcons(lang),
    fetchFooterText(lang)
  ]);
  
  return { icons, text };
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
