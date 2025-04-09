# Jazzy Spins - Casino Website Redesign

A modern Nuxt 3-based online casino website featuring game categorization, affiliate tracking, and localization capabilities.

## Overview

This project is a complete redesign of the Jazzy Spins online casino, built with Nuxt 3 and Vue.js. The site integrates with ProgressPlay's API for game data, promotions, and player management, while providing a fast and responsive user experience.

## Features

- **Game Management**: Display and categorization of various casino games (slots, jackpots, live games, etc.)
- **Affiliate Tracking**: Advanced affiliate tracking system with cookie management
- **Localization**: Multi-language support with dynamic content based on user location
- **Compliance**: Cookie consent management that follows regulatory requirements
- **Responsive Design**: Tailwind CSS-based responsive design for all device types
- **Performance Optimized**: SSR rendering with Cloudflare Pages deployment

## Technology Stack

- **Framework**: Nuxt 3 / Vue 3
- **CSS**: Tailwind CSS
- **State Management**: Pinia
- **Animations**: GSAP
- **Sliders**: Swiper
- **Hosting**: Cloudflare Pages
- **Analytics**: Google Tag Manager

## Project Structure

- **`/assets`**: Contains stylesheets and SVG files
- **`/components`**: Vue components organized by feature
- **`/composables`**: Shared logic and state management
  - `globalData.js`: Configuration and shared data
  - `useCookieConsent.js`: Cookie management and consent
  - `useLocalization.ts`: Internationalization
  - `useCache.js`: Caching strategies
- **`/pages`**: Page components that define routes
- **`/public`**: Static assets
- **`/layouts`**: Page layouts
- **`/plugins`**: Vue plugins for additional functionality
- **`/stores`**: Pinia stores
- **`/utils`**: Utility functions

## Key Components

- **Game Display**: Components like `SlotGames.vue`, `LiveGames.vue`, etc.
- **Cookie Management**: `CookieConsent.vue` and `CookieSettings.vue`
- **Header & Footer**: Site navigation and compliance information
- **Game Cards**: Display of individual games with provider information

## Setup and Development

### Prerequisites

- Node.js 18+ 
- NPM or Yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project is set up for Cloudflare Pages deployment, with ISR (Incremental Static Regeneration) enabled for optimal performance.

## Recent Updates

### Latest Updates
- **Affiliate Tracking Enhancement**: Updated the affiliate tracking system to prioritize URL parameters over existing cookies, allowing new affiliate links to override existing tracking. This change enables affiliates to "take over" tracking when users click their links with a tracker parameter.
- **Cookie Attributes Improvement**: Enhanced cookie attributes for better cross-site compatibility (SameSite=Lax, Secure flag, domain-specific) and implemented a localStorage backup for affiliate trackers.
- **Immediate Initialization**: Improved initialization flow to check for affiliate parameters as soon as the component is mounted.

### Previous Updates
- Added compliance pages and updated footer information
- Enhanced cookie consent banner with clearer options
- Implemented multi-language support
- Added game category pages
- Improved caching system

## Configuration

The site configuration is located in `composables/globalData.js` and can be customized for different environments or requirements.

## Notes for Developers

- The project uses both Composition API and Options API styles
- API calls to ProgressPlay are cached to improve performance
- Affiliate tracking is implemented via URL parameters and cookies
- The site detects user location and adjusts content accordingly
- Cookie management follows GDPR and other regulatory requirements

## License

Proprietary - All rights reserved
