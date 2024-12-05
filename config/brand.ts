export const BRAND_CONFIG = {
  WHITELABEL_ID: 239,
  WP_API: 'https://headless.jazzyspins.com/wp-json/wp/v2/',
  PP_LOBBY_LINK: 'https://jazzyspins.casino-pp.net/',
  BRAND_NAME: 'Jazzy Spins',
} as const;

// Shared API endpoints that use the brand config
export const API_ENDPOINTS = {
  PP_API: 'https://prd-api.casino-pp.net/CmSHelper/',
  KV_GAMES: 'https://access-ppgames.tech1960.workers.dev/',
  FILTERED_BY_NAME_KV: 'https://access-filterbyname.tech1960.workers.dev/',
  CF_GEO_WORKER: 'https://cf-geo-lookup.tech1960.workers.dev/',
  KV_SUPPORTED_COUNTRIES: 'https://access-supportedcountries.tech1960.workers.dev/',
  IGP_SUPPORTED_COUNTRIES: 'https://igp-supported-countries.tech1960.workers.dev/',
  KV_TRANSLATIONS: 'https://access-translations.tech1960.workers.dev/',
} as const;

// Helper function to get full API URLs
export const getApiUrls = () => ({
  promotionsApi: `${API_ENDPOINTS.PP_API}GetPromotionsInfo?whitelabelId=${BRAND_CONFIG.WHITELABEL_ID}&country=`,
  wpApi: BRAND_CONFIG.WP_API,
  lobbyLink: BRAND_CONFIG.PP_LOBBY_LINK,
}); 