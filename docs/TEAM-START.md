# Work on HokieGap together

Repository: https://github.com/L-Star29/HokieGap

Work from a fresh clone of the repository; do not rely on any other local copy.

## Teammate setup

1. Ask the repository owner to invite your GitHub username through repository Settings > Collaborators. Accept the invitation.
2. Install Node.js 24 and Git, then clone the repository into a folder you choose. Open that folder in VS Code.
3. In the project terminal:

```sh
npm ci
npm run db:local
npm run dev
```

Open http://localhost:5173. The manual planner needs no Gemini or Databricks credentials. For AI development, copy `.dev.vars.example` to `.dev.vars` and configure keys securely. Never commit `.dev.vars`; never use a browser-exposed `NEXT_PUBLIC_` variable for secrets.

Before sharing changes:

```sh
npm test
npm run typecheck
npm run build
```

Create a feature branch for each person's work and open a pull request. Avoid editing the same file simultaneously. Suggested split: one person owns page.tsx/styles and presentation; the other owns the agent, dataset ingestion and tests. Keep the main branch runnable.

## Where to edit

| File | Purpose |
| --- | --- |
| app/page.tsx | Planner UI, device memory, favorites, Plan B, AI form |
| app/product.css and app/globals.css | Layout and styling |
| lib/planner.ts | Deterministic travel, opening-hours and class-change calculations |
| lib/agent.ts | Gemini tool-calling and Databricks SQL data access |
| app/api/agent/route.ts | Server-only AI endpoint and shared request budget |
| app/api/reports/route.ts | Shared seating reports |
| data/ | Public campus snapshots |
| databricks/01_load_campus.ipynb | Import campus data into your Databricks workspace |
| docs/SPONSOR-SETUP.md | Sponsor requirements, credentials and evidence |
| docs/HOKIEAI-SIDEKICK.md | Standalone Side Kick instructions and post draft |

GitHub is code hosting only. The live app runs on Cloudflare Workers + D1; follow [DEPLOY.md](DEPLOY.md). Secrets live in Cloudflare (`wrangler secret put`) and in each developer's git-ignored `.dev.vars`, never in the repo. GitHub Pages alone is insufficient because the app needs a server API and a database.
