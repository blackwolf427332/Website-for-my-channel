const CHANNEL_ID = "UCYeoO4rw6CmSFkkliCuxhAA";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/feed") {
      if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
      }
      try {
        const upstream = await fetch(FEED_URL, {
          headers: { "User-Agent": "Lonewolf427332Website/1.0", "Accept": "application/atom+xml, application/xml, text/xml" },
          cf: { cacheTtl: 300, cacheEverything: true }
        });
        if (!upstream.ok) {
          return new Response("YouTube feed is temporarily unavailable.", {
            status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
          });
        }
        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=300",
            "X-Content-Type-Options": "nosniff"
          }
        });
      } catch (error) {
        return new Response("Unable to reach the YouTube feed.", {
          status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
