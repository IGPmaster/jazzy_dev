export default defineEventHandler(async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://content.progressplay.net/api23/api/game?whitelabelId=239', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.jazzyspins.com/',
        'Origin': 'https://www.jazzyspins.com',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`ProgressPlay API returned ${response.status}`);

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('⚠️ DEV PROXY: Primary failed, trying worker fallback:', err.message);

    const fallback = await fetch('https://access-ppgames.tech1960.workers.dev/');
    if (!fallback.ok) throw createError({ statusCode: 502, statusMessage: 'Both game sources failed' });

    const data = await fallback.json();
    return data.games || data;
  }
});
