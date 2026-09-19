# HokieGap

A working Virginia Tech gap planner: find a study or break space between two classes, compare usable time and class-change pressure, select a backup, and report visible seating conditions.

## What works

- Seven buildings: Classroom Building, Goodwin, Derring, Cowgill, Hancock, Bishop-Favrao and Newman Library.
- Seven candidate spaces across six of those buildings. Bishop-Favrao is a route endpoint only until a study space is verified.
- Same-day planning with walking limits, activity, arrival buffer, published library hours, estimated walking time, and at least 15 usable minutes.
- Class-change demand heuristic using actual Fall 2026 public timetable rows. Arrival and later surges during the visit influence ranking.
- Shared seating reports in Cloudflare D1. No seeded production reports. Reports expire from recommendation use after 15 minutes, use server timestamps, and are limited to one per browser session per minute.
- WebMCP `configure_gap_plan` updates the same interface and rejects invalid input.

## Important limits

This is an unvalidated prototype, not a trained ML model, occupancy sensor, seat reservation system, official VT app or guaranteed navigation system. Campus data are snapshots, not live building queries. Class capacity is not enrollment or actual attendance. There is no reliable seat capacity dataset. Exact room-level paths, current access to common spaces, outlets, furniture and present-day noise need on-site verification.

The forecast window is deliberately limited to Sept 19–25, 2026. Extending it requires checking the academic calendar, actual class meeting dates, cancellations and updated timetables. Forecasts do not run outside this window. Saturday/Sunday are interpreted using the published meeting-day codes. This is partial coverage of 14 subjects, not every class or event on campus. Timetable continuation rows are not yet imported. Shared room/time rows are conservatively deduplicated by maximum listed capacity.

Gemini, Databricks and HokieAI are **not connected**. Logging into those services does not supply this app with API access. Do not claim sponsor integration or eligibility based on this prototype. Track requirements still need to be checked against the opening slides and current sponsor instructions. No API keys are needed for this baseline app.

The initial hosted audience is private. Additional student/judge access requires an explicit audience change. Anonymous report rate limiting is basic, not fraud-proof. A public launch needs abuse controls and report-quality evaluation. No personal schedules are saved or sent to a model. A random browser session identifier is stored with reports but never returned publicly. Old observations are cleaned up on subsequent writes after seven days; there is no background retention job.

## Run and verify

Use Node 24 and npm. The included starter expects a portable profile outside managed Linux.

```sh
npm ci
npm run dev
node --test tests/planner.test.ts
npx tsc --noEmit
npm run build
```

The dev server uses localhost:5173. D1 binding `DB` is declared in `.openai/hosting.json`. Generated schema migrations are under `drizzle/`; apply them to the local D1 instance before testing seating reports. Sites applies production migrations while publishing. Never use local test observations as real crowd data.

Public data refresh (Python standard library, no login):

```sh
python scripts/collect-campus.py
python scripts/normalize-campus.py
python scripts/collect-hours.py
```

Before refreshing: update the term/year deliberately, verify parser output against the public page, review failures, and update the forecast window and displayed snapshot dates. The scripts do not automatically expand calendar coverage. Run tests after refreshing. Building hours outside the collected calendar become unknown.

## Structure

| File | Purpose |
|---|---|
| `app/page.tsx` | Planner, ranked spaces, timing view, reports and data explanations |
| `lib/planner.ts` | Deterministic eligibility, timing, class-change index and rankings |
| `app/api/reports/route.ts` | Shared report read/write API, validation and basic rate limit |
| `db/schema.ts`, `drizzle/` | Persistent report schema and migrations |
| `data/` | Sourced building, place, class and opening-hours snapshots |
| `tests/planner.test.ts` | Timing, deduplication, closed hours and freshness tests |
| `docs/DATA.md` | Dataset dictionary, provenance, assumptions and update process |
| `docs/DEMO.md` | Presentable demonstration and next validation steps |

Original team contribution: the gap-planning flow, space curation, demand heuristic, rankings and seating-report workflow. External libraries are listed in package.json/package-lock.json; the React/Vinext/Sites starter and UI components are external scaffolding. Public VT data and architect descriptions are attributed in the app and DATA.md. Record the event build period and all AI assistance accurately on Devpost.
