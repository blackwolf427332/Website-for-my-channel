# LONEWOLF 427332 — Cloudflare website

A responsive, public creator website for YouTube channel `@lonewolf_223_YT`, using the channel's public Atom/RSS feed through a same-origin Cloudflare Worker endpoint.

## Included

- `public/` — static website files.
- `src/worker.js` — same-origin `/api/feed` proxy to YouTube's public channel feed. It caches upstream feed responses for about five minutes.
- `wrangler.jsonc` — Cloudflare Workers Static Assets configuration.

## Deploy to a free `workers.dev` address

1. Create or sign in to a Cloudflare account: https://dash.cloudflare.com/
2. Install Node.js (LTS) on your computer: https://nodejs.org/
3. Extract this ZIP file.
4. Open a terminal in the extracted `lonewolf-427332-site` folder.
5. Run:

   ```bash
   npx wrangler login
   npx wrangler deploy
   ```

6. Follow the prompts. Cloudflare will deploy the site and provide a `workers.dev` URL, typically `https://lonewolf-427332.<your-subdomain>.workers.dev`.

If the worker name is unavailable, change `"name"` in `wrangler.jsonc` to another unique name, such as `lonewolf-427332-hub`.

## How automatic updates work

The website requests `/api/feed` whenever a visitor opens the page, and refreshes the feed every five minutes while the page is open. The Worker fetches the public YouTube channel Atom feed and caches it for roughly five minutes. New public video uploads (including Shorts published as videos) can appear automatically without redeploying the website.

The ordinary channel RSS feed does **not** reliably provide Community posts. Shorts are not explicitly identified by the standard feed, so they appear among recent uploads rather than in a guaranteed separate Shorts category. This project does not use YouTube API keys or store private channel data.

## Test locally (optional)

With Node.js installed:

```bash
npx wrangler dev
```

Open the local URL printed by Wrangler. The feed endpoint is `/api/feed`.

## Notes

- Hosting on Cloudflare's `workers.dev` subdomain does not require buying a domain.
- Deployment requires you to sign in to your own Cloudflare account. I cannot publish into your account from this chat.
- This is a ready-to-deploy starter site, not a completed deployment. Your live URL exists only after you run the deployment steps above.
- See Cloudflare's official docs:
  - https://developers.cloudflare.com/workers/static-assets/
  - https://developers.cloudflare.com/workers/wrangler/commands/#deploy
