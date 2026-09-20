# Sponsor setup and evidence

## Correct category structure

- MLH categories: optional, no category limit; choose only integrations actually demonstrated.
- VTHacks categories: choose at least one. Consider Best First-Time Hack if every applicable eligibility condition is met, and Ut Prosim for student usefulness.
- Sponsor challenges: up to three. Intended: Deloitte x Databricks ("AI Agent for the Virginia Tech Student Experience": smart campus / campus life hub) and Cloudforce ("HokieAI Side Kick": a standalone HokieAI experience plus a post). Gemini is MLH and does not consume a sponsor slot.
- Third sponsor slot: leave it empty. On Devpost the GoDaddy sponsor challenge is "Best Use of ANS" (agents discovering each other over the open web), a real build HokieGap does not have. The custom-domain prize, "Best Domain Name from GoDaddy Registry" (code `MLH0918VTH`), is an MLH category and costs no sponsor slot: select it under MLH (hokiegap.club). Capital One (Nessie banking API), Impiricus (healthcare-professional engagement), Peraton (mission-critical AI) and Procedura (photo to 3D building) do not fit HokieGap. Leaving the slot empty is better than a claim the demo cannot support.
- MLH categories to select (no limit): Best Use of Gemini API and Best Domain Name from GoDaddy Registry. Do not select ElevenLabs, Solana, Tiger Data, Presage, Vultr or MongoDB Atlas: HokieGap does not use them.

## Gemini: server-side API

The project ID/number is not an API credential. In Google AI Studio, import the hokiegap project and create a Gemini key. Save it only in `.dev.vars` as `GEMINI_API_KEY`. That file is ignored by Git. The model is configured with `GEMINI_MODEL`; test availability using the actual account rather than assuming a listed model accepts new users.

The application invokes Gemini function calling to select activity/walk preferences, executes `find_campus_options`, validates timing with the planner, then asks Gemini to select and explain an option from the returned IDs. It rejects invented destinations. Without Databricks credentials, evidence is explicitly labeled `Bundled campus snapshot`. It is not a trained occupancy model.

Run `node --env-file=.dev.vars scripts/check-agent.mjs` for a real, synthetic-example smoke test. Public AI requests have a global limit of 60 per hour (up to two model requests per plan). If the configured model is overloaded, the agent retries once and then falls back to the newest other plain Flash model the key can call. Configure a provider-side budget as appropriate. The host must also receive secrets (`npx wrangler secret put GEMINI_API_KEY`; see DEPLOY.md); local `.dev.vars` does not configure hosted production. `npm run check:agent` runs the same smoke test.

## Deloitte + Databricks

Workspace host: https://dbc-31de3f1b-fd1c.cloud.databricks.com

1. In your usual signed-in Databricks browser, import `databricks/01_load_campus.ipynb` into Workspace (Workspace > Create/Import). Select serverless compute and Run all. Set `CATALOG` to a catalog you can write to if `workspace` is unavailable. The notebook creates/replaces only HokieGap tables in the selected schema: `campus_datasets` (what the app queries), typed `scheduled_classes`, `buildings`, `spaces`, and a `building_class_load` view. Its last cells assert that `campus_datasets` holds all four datasets. (An earlier version crashed on the all-null `enrollment` column; regenerate with `npm run notebook` if you edit data.)
2. Open SQL Warehouses and select a running warehouse. Copy its warehouse ID from Connection details (the HTTP path ends with the ID). Set `DATABRICKS_WAREHOUSE_ID` in `.dev.vars`.
3. Configure an API credential allowed by your workspace. If personal access tokens are enabled: user Settings > Developer > Access tokens > Manage > Generate new token. Give it a short expiry and save it only as `DATABRICKS_TOKEN` in `.dev.vars`. If tokens are disabled, use the workspace's supported OAuth setup; do not change admin policy merely to get around that restriction.
4. Match `DATABRICKS_CATALOG` and `DATABRICKS_SCHEMA` to the notebook. Keep the host without a `/browse` path.
5. Run `npm run check:databricks`. It prints `OK  source: Databricks SQL warehouse` and the row counts, or the exact failure. Then run `npm run check:agent`. A successful sponsor demonstration must show `Databricks SQL warehouse`, real returned options, and successful query execution in the workspace. A configured-but-failing workspace produces an error, not silent local fallback.

Do not claim the challenge is satisfied merely because the notebook exists or because the AI Dev Kit is installed. The complete path must run. Obtain official sponsor rules and confirm any sponsor-specific entry requirement. The supplied challenge's Campus life intelligence hub is the primary fit; data-backed space utilization is a secondary benefit.

## Cloudforce / HokieAI

Create a standalone Side Kick inside HokieAI using `docs/HOKIEAI-SIDEKICK.md`. It must function independently of HokieGap. Test three different inputs. Follow the event's entry instructions and post the real Side Kick link/demo from your own social account. The opening slides say to show the live post during judging; LinkedIn tags for Cloudforce and Virginia Tech receive a stated 10% bonus. No social post has been published by this project.

## Submission evidence

Record a short real demo of the working manual planner, Plan B, Gemini tool flow, and Databricks query if connected. Include repository and public demo links. List both contributors. Disclose AI assistance, the external Sites/Vinext/React/UI scaffolding, and public data sources. Do not label mocks as successful sponsor calls. Keep a local demo available for network failures. Submit by the earlier published deadline: September 20, 8 AM Eastern, unless organizers explicitly update it. Slides say be ready for judging at 9 AM in NCB; verify live announcements.
