export async function onRequest(context) {
  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      }
    })
  }

  try {
    const url = new URL(context.request.url)
    const whitelabelId = url.searchParams.get('whitelabelId') || '239'
    const country = url.searchParams.get('country') || 'GB'
    
    // Support both single code and multiple codes
    const codes = url.searchParams.get('codes') || url.searchParams.get('code')
    const type = url.searchParams.get('type') || 'content' // content, promotions
    
    // 🚀 KV CACHING: Check KV cache first for content requests
    if (type === 'content' && codes && context.env && context.env.CONTENT_KV) {
      const codeList = codes.split(',').map(c => c.trim())
      let allCached = true
      const cachedResults = {}
      
      for (const code of codeList) {
        const kvKey = `content:${code}:${whitelabelId}:${country}`
        try {
          const cached = await context.env.CONTENT_KV.get(kvKey)
          if (cached) {
            cachedResults[code] = JSON.parse(cached)
            console.log(`✅ KV CACHE HIT: ${kvKey}`)
          } else {
            allCached = false
            console.log(`❌ KV CACHE MISS: ${kvKey}`)
            break
          }
        } catch (error) {
          console.log(`⚠️ KV CACHE ERROR: ${kvKey}`, error)
          allCached = false
          break
        }
      }
      
      if (allCached) {
        console.log(`🚀 KV CACHE: Returning all cached content for ${codes}`)
        return new Response(JSON.stringify(cachedResults), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': 'public, max-age=900', // 15 minutes cache
            'X-Cache': 'HIT'
          }
        })
      }
    }
    
    // For promotions, codes parameter is not required
    if (!codes && type !== 'promotions') {
      return new Response(JSON.stringify({ error: 'Missing codes parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    console.log('🚀 UNIFIED CF FUNCTION: Fetching content via unified proxy')
    console.log(`🔍 Parameters: whitelabelId=${whitelabelId}, country=${country}, codes=${codes}, type=${type}`)

    const codeList = codes ? codes.split(',').map(c => c.trim()) : []
    const results = {}

    // Handle different content types
    if (type === 'promotions') {
      // Special case for promotions
      const progressPlayUrl = `https://content.progressplay.net/api23/api/PromotionsInfo?whitelabelId=${whitelabelId}&country=${country}`
      console.log(`📡 UNIFIED: Requesting promotions: ${progressPlayUrl}`)

      const response = await fetch(progressPlayUrl, {
        method: 'GET',
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

      console.log(`📊 UNIFIED: Promotions response status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        results.promotions = data
        console.log(`✅ UNIFIED: Successfully fetched promotions`)
      } else {
        console.error(`❌ UNIFIED: Promotions API error: ${response.status}`)
        results.promotions = []
      }
    } else {
      // Handle InfoContent requests (footer, compliance, etc.)
      for (const code of codeList) {
        const progressPlayUrl = `https://content.progressplay.net/api23/api/InfoContent?whitelabelId=${whitelabelId}&code=${code}`
        console.log(`📡 UNIFIED: Requesting content: ${progressPlayUrl}`)

        try {
          const response = await fetch(progressPlayUrl, {
            method: 'GET',
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

          console.log(`📊 UNIFIED: Content ${code} response status: ${response.status}`)

          if (response.ok) {
            const data = await response.json()
            results[code] = data
            console.log(`✅ UNIFIED: Successfully fetched content for ${code}`)
            
            // 🚀 KV CACHING: Store in KV cache for future requests
            if (context.env && context.env.CONTENT_KV) {
              const kvKey = `content:${code}:${whitelabelId}:${country}`
              try {
                await context.env.CONTENT_KV.put(kvKey, JSON.stringify(data), {
                  expirationTtl: 900 // 15 minutes TTL
                })
                console.log(`✅ KV CACHE: Stored ${kvKey}`)
              } catch (error) {
                console.log(`⚠️ KV CACHE: Failed to store ${kvKey}:`, error)
              }
            }
          } else {
            console.error(`❌ UNIFIED: Content API error for ${code}: ${response.status}`)
            results[code] = []
          }
        } catch (error) {
          console.error(`❌ UNIFIED: Error fetching ${code}:`, error)
          results[code] = []
        }
      }
    }

    console.log(`✅ UNIFIED: Returning ${Object.keys(results).length} content items`)

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Cache-Control': 'public, max-age=900', // 15 minutes cache
        'Vary': 'Origin'
      }
    })

  } catch (error) {
    console.error('💥 UNIFIED: Proxy error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
