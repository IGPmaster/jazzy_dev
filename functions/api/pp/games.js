export async function onRequest(context) {
  try {
    console.log('🎮 GAMES: Fetching artwork-validated games catalogue via CloudFlare Function')

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    // Primary: KV-backed worker serving the artwork-validated shared catalogue
    // (games_data_validated, refreshed every 12h by fetch-pp-games-v2).
    // ProgressPlay direct remains the fallback below. Catalogue scope is
    // identical between the two sources (verified 2026-07-11) — per-label
    // restrictions are filtered client-side from each game's exclusion fields.
    const workerUrl = 'https://access-ppgames.tech1960.workers.dev/'
    console.log(`📡 GAMES: Requesting: ${workerUrl}`)

    const response = await fetch(workerUrl, {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId);

    console.log(`📊 Games worker response status: ${response.status}`)

    if (!response.ok) {
      console.error(`❌ Games worker error: ${response.status} - ${response.statusText}`)

      // Fallback to ProgressPlay direct if the worker fails
      console.log('🔄 Falling back to ProgressPlay API...')
      const fallbackData = await fetchProgressPlayDirect()

      if (fallbackData) {
        console.log(`✅ Fallback successful: ${Array.isArray(fallbackData) ? fallbackData.length : 'unknown'} games`)

        return new Response(JSON.stringify(fallbackData), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300' // 5 minutes cache
          }
        })
      } else {
        throw new Error('Both CloudFlare Worker and ProgressPlay API failed')
      }
    }

    const data = await response.json()
    console.log(`✅ Successfully fetched ${Array.isArray(data) ? data.length : 'unknown'} games from worker`)

    return new Response(JSON.stringify(data), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      }
    })

  } catch (error) {
    console.error('💥 GAMES: Games proxy error:', error)

    // Worker timed out or failed — try ProgressPlay direct
    try {
      const fallbackData = await fetchProgressPlayDirect()
      if (fallbackData) {
        console.log(`✅ GAMES: Fallback successful: ${Array.isArray(fallbackData) ? fallbackData.length : 'unknown'} games`)

        return new Response(JSON.stringify(fallbackData), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          }
        })
      }
    } catch (fallbackError) {
      console.error('❌ GAMES: ProgressPlay fallback also failed:', fallbackError)
    }

    // Return empty array as ultimate fallback to prevent crashes
    return new Response(JSON.stringify([]), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Short cache for errors
      }
    })
  }
}

async function fetchProgressPlayDirect() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const progressPlayUrl = 'https://content.progressplay.net/api23/api/game?whitelabelId=239'

  const response = await fetch(progressPlayUrl, {
    method: 'GET',
    signal: controller.signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.jazzyspins.com/',
      'Origin': 'https://www.jazzyspins.com',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site'
    }
  })
  clearTimeout(timeoutId);

  if (!response.ok) return null;
  return response.json();
}
