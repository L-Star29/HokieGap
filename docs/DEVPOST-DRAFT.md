# HokieGap

## Tagline
Find a good place between classes, with enough time to make the next one.

## Inspiration
An 80-minute gap between classes sounds useful until you spend it deciding where to go, checking the clock and looking for a seat. Our starting example was a 9:55 AM class ending in Classroom Building and an 11:15 AM class in nearby Derring Hall. We built HokieGap for any student facing that decision in the engineering cluster.

## What it does
HokieGap compares nearby places for studying, quiet work, group work, eating or a break. It accounts for walking both ways, the next class, an arrival buffer, published hours where available and recent student seating reports. It shows expected class-change activity, available time, a departure deadline and Google Maps directions. Students can save preferences and gaps on their own device and switch to a Plan B if the first place is unsuitable.

## How we built it
React and TypeScript power the interface. A deterministic planner enforces time constraints. Public VT building, space, class and library-hours data are curated into snapshots. A class-change heuristic uses section capacity and proximity to estimate disruption; it does not claim measured occupancy. A server-side Gemini agent calls a campus-options tool and explains a validated recommendation. Shared seating reports are stored in Cloudflare D1.

Databricks holds the campus data: a notebook loads the public building, space, timetable and library-hours snapshots into Delta tables (`campus_datasets`, `scheduled_classes`, `buildings`, `spaces`, and a `building_class_load` view). The deployed agent queries a Databricks SQL warehouse through the SQL Statement API for its planning evidence, and validates every recommendation against timing and opening-hours rules. Verified on 2026-09-20: `npm run check:databricks` returned all four datasets (8 buildings, 9 spaces, 573 class meetings) from the warehouse, and live AI requests report `Databricks SQL warehouse` as their source. The app falls back to its bundled snapshot only when Databricks is not configured. If a Gemini model is rate-limited or overloaded, the agent immediately switches to another Flash model.

## Challenges
Class capacity is not attendance, and nearby class dismissals do not directly reveal seats. Public opening-hours and indoor-location coverage are incomplete. We distinguish those unknowns from live student observations, and validate model-selected destinations instead of accepting invented places.

## What we learned and next steps
The immediate value is helping students make a feasible choice quickly. Next steps are verified indoor locations and dining hours, observation-based calibration, broader timetable coverage and usability testing with students. We have not yet demonstrated real-world forecast accuracy or university adoption.

## Attribution and honest scope
Built with AI coding assistance (OpenAI Codex and Claude Code), external React/Vinext scaffolding and UI libraries, hosted on Cloudflare Workers + D1. Dependencies are listed in package.json; dataset sources and assumptions are in docs/DATA.md. Team-specific contributions include the campus gap workflow, data curation, timing rules, class-change heuristic, report workflow and agent integration. Record both contributors' actual work and any work performed outside the official hacking period. Add real testing feedback only after it is collected.

## Before submitting
- Add every teammate as a contributor (each needs a Devpost account) and choose at least one VTHacks category (suggested: Best UI/UX Hack and Best Ut Prosim Hack; Best First-Time Hack only if every member qualifies).
- MLH categories (no limit): Best Use of Gemini API (verified live) and Best Domain Name from GoDaddy Registry (hokiegap.club). No others.
- Sponsor challenges (max three): Deloitte x Databricks (verified live). Select Cloudforce only after creating/testing the HokieAI Side Kick and making the required post. Leave the third empty.
- Links: https://github.com/L-Star29/HokieGap (push the latest commit first), demo https://hokiegap.club (fallback https://hokiegap.hokiegap.workers.dev).
- Disclose the build period, that AI assistants (OpenAI Codex, Claude Code) wrote much of the code, and all external libraries/data.
- Submit before September 20, 8 AM Eastern unless organizers explicitly update the deadline. Confirm the final submission, not just the project draft.
