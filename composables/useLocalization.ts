import { ref } from 'vue';
import { API_ENDPOINTS } from '~/config/brand';
import { setCookie, getCookie } from '~/utils/cookies';

export const lang = ref('');
export const jurisdictionCode = ref('');
export const countryCode = ref('');
export const countryName = ref('');
export const countryNotSupported = ref(false);

export const useLocalization = () => {
  const loadLang = async () => {
    if (typeof window === 'undefined') {
      // Set default language for SSR
      lang.value = 'IE';
      return;
    }

    try {
      // 1. Get user's country from CF_GEO_WORKER
      const workerResponse = await fetch(API_ENDPOINTS.CF_GEO_WORKER);
      if (!workerResponse.ok) {
        throw new Error(`Failed to fetch geo data: ${workerResponse.status}`);
      }
      const workerData = await workerResponse.json();
      const originalLang = workerData.countryCode;

      // 2. Verify with supported countries
      const [kvResponse, igpResponse] = await Promise.all([
        fetch(API_ENDPOINTS.KV_SUPPORTED_COUNTRIES),
        fetch(API_ENDPOINTS.IGP_SUPPORTED_COUNTRIES)
      ]);

      if (!kvResponse.ok || !igpResponse.ok) {
        throw new Error('Failed to fetch supported countries');
      }

      const kvData = await kvResponse.json();
      const igpData = await igpResponse.json();

      const foundLangKV = kvData.find((c: any) => c.countryIntlCode === originalLang);
      const foundLangIGP = Object.values(igpData).flat().includes(originalLang);

      let langValue = 'IE'; // Default fallback

      if (foundLangKV && foundLangIGP) {
        langValue = originalLang;
      }

      // Handle cookie
      const cookieLang = getCookie('lang');
      if (cookieLang) {
        if (langValue && langValue.toUpperCase() === cookieLang.toUpperCase()) {
          lang.value = cookieLang.toUpperCase();
        } else {
          lang.value = langValue;
          setCookie('lang', lang.value, 30, 'None', true);
        }
      } else {
        lang.value = langValue;
        setCookie('lang', lang.value, 30, 'None', true);
      }

      await fetchCountry();
    } catch (error) {
      console.error('Error in loadLang:', error);
      lang.value = 'IE'; // Ultimate fallback
      setCookie('lang', 'IE', 30, 'None', true);
      await fetchCountry();
    }
  };

  const fetchCountry = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.KV_SUPPORTED_COUNTRIES);
      if (!response.ok) {
        throw new Error(`Failed to fetch country data (status ${response.status})`);
      }
      const data = await response.json();
      const country = data.find((c: any) => c.countryIntlCode === lang.value);
      if (country) {
        jurisdictionCode.value = country.jurisdictionCode;
        countryCode.value = country.countryIntlCode;
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const checkCountry = async () => {
    try {
      const workerResponse = await fetch(API_ENDPOINTS.CF_GEO_WORKER);
      const workerData = await workerResponse.json();
      const countryCodeValue = workerData.countryCode;

      if (!countryCode.value.includes(countryCodeValue)) {
        countryName.value = workerData.countryName;
        countryNotSupported.value = true;
      }
    } catch (error) {
      console.error('Error checking country:', error);
    }
  };

  return {
    lang,
    jurisdictionCode,
    countryCode,
    countryName,
    countryNotSupported,
    loadLang,
    checkCountry,
    fetchCountry
  };
}; 