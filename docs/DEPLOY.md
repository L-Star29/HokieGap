# Deploy HokieGap on Cloudflare Workers

HokieGap already runs on the Workers runtime and stores reports in D1, so Cloudflare's free plan hosts it with no code changes. Nothing here depends on OpenAI hosting.

You need: a free Cloudflare account (https://dash.cloudflare.com/sign-up), Node 22.13+ (Node 24 recommended) and this repo.

## First deploy

```sh
npm ci
npx wrangler login
```

`wrangler login` opens a browser tab to authorize your Cloudflare account. Then create the database:

```sh
npx wrangler d1 create hokiegap-db
```

Copy the printed `database_id` into `d1_databases[0].database_id` in `wrangler.jsonc` (an ID is not a secret). Then build, migrate and deploy:

```sh
npm run db:remote     # applies drizzle/0000 and drizzle/0001 to the remote D1
npm run deploy        # vinext build + wrangler deploy
```

The first deploy asks you to pick a `*.workers.dev` subdomain and prints the live URL.

## Secrets (enables the AI planner)

Secrets never go in `wrangler.jsonc`, GitHub, or browser code. Wrangler prompts for the value and sends it straight to Cloudflare:

```sh
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put DATABRICKS_TOKEN     # after Databricks is set up, see SPONSOR-SETUP.md
```

Set `DATABRICKS_WAREHOUSE_ID` in the `vars` block of `wrangler.jsonc` (it is an ID, not a credential), then `npm run deploy` again.

`AGENT_ENABLED` is `"true"` in `vars`. The UI shows "AI setup is pending" whenever `AGENT_ENABLED` is not `"true"` or `GEMINI_API_KEY` is missing from the *hosted* environment. A key in local `.dev.vars` does not configure production.

## Verify

Open `https://<your-worker>.workers.dev/api/agent`. Expected:

```json
{"enabled":true,"databricksConfigured":true}
```

`enabled:false` means the Gemini secret or `AGENT_ENABLED` is missing. `databricksConfigured:false` means the token or warehouse ID is missing. It says nothing about whether the query succeeds. Only a real AI request that reports `Databricks SQL warehouse` as its source proves that.

## Local development

```sh
cp .dev.vars.example .dev.vars   # then fill in keys; this file is git-ignored
npm run db:local
npm run dev                      # http://localhost:5173
npm run check:agent              # real Gemini smoke test
npm run check:databricks         # real Databricks smoke test
```

## Custom domain (GoDaddy Registry / MLH "Best Domain Name")

Register a domain through the MLH/GoDaddy Registry offer (code `MLH0918VTH` in the VTHacks guide). To serve the Worker on it, add the domain to your Cloudflare account (Add a site, change the nameservers at the registrar), then Workers & Pages > hokiegap > Settings > Domains & Routes > Add > Custom domain.

## Other hosts

Vercel or Netlify would need the D1 code (`db/`, `app/api/*`) rewritten for Postgres or another store. A VM (for example Vultr) would need the Workers runtime replaced. Neither is worth it for this deadline.
