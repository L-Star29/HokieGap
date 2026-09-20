# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Virginia Tech students who have a gap between two classes (roughly 15 to 120 free minutes) and are on campus deciding where to spend it. Their job: find a good place for what they need in that gap (study, quiet work, group work, eating, or a break) without losing time to searching, and still reach the next class on time.

## Product Purpose

HokieGap helps a student decide where to spend the time between two classes. General map tools answer "how do I get there"; they do not know which campus spots suit studying, quiet work, group work, food or rest, or which of them still leave time to reach the next class. HokieGap answers "where should I spend this gap". Success is a student picking a workable place in seconds and leaving in time for their next class.

## Positioning

This is about the study spots and best areas to do things during the gaps between classes, which Google Maps is not useful for. What a neighboring product could not truthfully copy:

- Timing-checked picks: only places reachable from the current building AND leavable in time for the next class, using walking time both ways, an arrival buffer and published hours, with a one-tap Plan B.
- A class-change pressure estimate built from actual Fall 2026 public timetable rows (a heuristic, not measured occupancy).
- Plain-language planning: an AI planner turns a sentence into a validated plan and can only choose from real, checked campus options.
- Student-reported seating: anonymous reports that expire from recommendations after 15 minutes.

## Operating Context

Used on a phone or laptop between classes, often in a hurry, in the engineering-cluster area of Virginia Tech's campus. Inputs are the current building, the next class's building, the date and the gap's start and end times. Output is a ranked list of places, a timeline (leave, settle in, leave for class), and a Google Maps walking handoff.

## Capabilities and Constraints

- Core flow: the manual planner works with no account, no API key and no AI.
- Privacy-light: no accounts. Preferences, favorites, saved gaps and the current plan live on the device. Text sent to the AI planner goes to Gemini, and the interface says so. Seating reports carry a random browser session ID that is never shown publicly.
- Known limits from the project docs (facts, not marketing): campus data are snapshots, not live building queries; class capacity is not enrollment or attendance; there is no seat-capacity dataset; indoor paths, outlets, noise and current access need on-site verification; coverage is 8 buildings, 9 places and 14 timetable subjects; the forecast window is Sept 19 to 25, 2026.
- Terminology: "gap" is the free time between two classes; "Plan B" is the recalculated backup place; "class change" is the period when many classes end and start.
- Undecided: whether coverage expands beyond the engineering cluster, and whether seat reports get abuse controls beyond basic rate limiting.

## Evidence on Hand

- Public VT data snapshots in `data/` (buildings, places, timetable rows, library hours) with sources documented in `docs/DATA.md`.
- Working production app at https://hokiegap.club, with the AI planner verified against real Gemini and Databricks calls.
- Absent, so future work must not fabricate them: student testimonials, usability-test results, measured forecast accuracy, university adoption, and real seat-report volume.

## Product Principles

1. The next class is the boundary. Never suggest a place the student cannot reach and leave in time.
2. Be honest about what is estimated. Label heuristics as estimates and never imply live seat counts or guaranteed access.
3. The core must work without AI or an account. AI is a convenience layered on a deterministic planner and never the only way in.
4. Fit the purpose of the gap. Recommend places for studying, quiet, groups, food or rest, not just directions.
5. Keep student data on their device where possible and say plainly when text leaves it.
