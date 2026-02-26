# Broken PP Game Image Fallback Fix

**Date:** 2026-02-26
**Commit:** `4fc2af3`
**Affects:** Homepage game sections, all category pages, all-games page

## Problem

Some games from the ProgressPlay API have image URLs that return 404. The previous fallback behaviour set `game.image = 'newGameImg.jpg'`, which created ugly rows of identical placeholder tiles across the game grids.

## Solution

Remove broken-image games from the grid entirely and let working games backfill the slots. On homepage sections (which show 16 games), the grid stays full because the computed pulls from the larger pool. On category pages, broken games simply disappear.

## How It Works

### GameCard.vue (shared component)

- Added `hasError` ref and `defineEmits(['image-error'])`
- On `@error`, the card sets `hasError = true` (hiding itself via `v-if="game && !hasError"`) and emits `image-error` upward with the game object
- The old `event.target.src = '/newGameImg.jpg'` fallback is removed

### Homepage Section Components (6 files)

**Files:** `NewGames.vue`, `PopularGames.vue`, `SlotGames.vue`, `CasinoGames.vue`, `JackpotGames.vue`, `LiveGames.vue`

Each component:
1. Maintains a `failedImages` Set ref
2. Listens for `@image-error` from GameCard and adds the game ID to the Set
3. The `displayedGames` computed filters out failed IDs **before** slicing to 16:
   ```js
   [...games].reverse().filter(g => !failedImages.value.has(g.id)).slice(0, 16)
   ```
   This means the grid always shows 16 games (backfilled from deeper in the pool).

### All-Games Page (special case)

**File:** `pages/all-games.vue`

- Uses inline `<img>` tags (not GameCard), so `@error="onImageError(game)"` calls the handler directly
- `failedImages` filter is added to the `sortedGames` computed (after provider/type filtering, before sort)

### Category Pages (6 files)

**Files:** `pages/slot-games.vue`, `popular-games.vue`, `casino-games.vue`, `jackpot-games.vue`, `live-games.vue`, `scratchcards.vue`

Each page:
1. Adds `ref` and `computed` imports
2. Adds `failedImages` Set, `onImageError()` function, and `visibleGames` computed
3. Template `v-for` iterates `visibleGames` instead of the raw games ref
4. `@error` calls `onImageError(game)` instead of swapping to placeholder

## Additional Changes

### server/api/pp/games.js (new file)

Nuxt server route for local dev — Cloudflare Functions don't run with `nuxi dev`. Proxies to the ProgressPlay API with the same headers as the production Cloudflare Function, falls back to the CloudFlare worker on failure. 8-second timeout via AbortController.

### composables/globalData.js (SSR URL fix)

```js
// Before
const KV_GAMES_PRIMARY = '/api/pp/games';
const KV_GAMES_FALLBACK = '/api/worker/games';

// After
const KV_GAMES_PRIMARY = process.client ? '/api/pp/games' : 'https://content.progressplay.net/api23/api/game?whitelabelId=239';
const KV_GAMES_FALLBACK = process.client ? '/api/worker/games' : 'https://access-ppgames.tech1960.workers.dev/';
```

Relative paths (`/api/pp/games`) don't work during SSR because there's no browser origin. Client-side keeps the relative paths (routed through Cloudflare Functions); server-side uses absolute URLs.

## Files Changed (16 total)

| # | File | Change |
|---|------|--------|
| 1 | `components/GameCard.vue` | Emit error + hide card on broken image |
| 2-7 | `components/{New,Popular,Slot,Casino,Jackpot,Live}Games.vue` | failedImages filter + backfill |
| 8 | `pages/all-games.vue` | failedImages filter in sortedGames computed |
| 9-14 | `pages/{slot,popular,casino,jackpot,live}-games.vue`, `scratchcards.vue` | failedImages + visibleGames computed |
| 15 | `server/api/pp/games.js` | New — local dev proxy |
| 16 | `composables/globalData.js` | SSR-safe fetch URLs |

## Verification

1. Run `npx nuxi dev` — games load on homepage and category pages
2. Open DevTools Network tab — find a game image that 404s and verify it disappears from the grid (no placeholder)
3. Homepage sections still show 16 games (backfilled from pool)
4. Category pages simply remove broken entries

## Jazzy-Specific Notes

Unlike hippozino (which uses inline `<img>` tags in homepage sections), Jazzy uses a shared `GameCard.vue` component. This required the emit pattern (`GameCard` emits `image-error` upward, parent components track failed IDs in a Set and filter them out of the computed).

The category pages (`pages/*.vue`) use inline `<img>` tags like hippozino, so the pattern there is the same: `@error="onImageError(game)"` with a `visibleGames` computed wrapper.
