# Work on HokieGap together

Repository: https://github.com/L-Star29/HokieGap

Main local project: `C:\Users\lokir\Documents\Codex\HokieGap`. The earlier date/message folders were Codex's task storage; `work` held research and temporary files. They are not part of the application. Use this project folder from now on.

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

GitHub is code hosting. The live app is hosted separately. The owner explicitly approved public access to the existing Sites URL. This does not make API keys public, and visitors do not need a HokieGap/ChatGPT account for the app's planner. If moving hosting, keep the server API and provision the D1 database; GitHub Pages alone is insufficient.
