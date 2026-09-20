# HokieGap

## Tagline
Find a good place between classes, with enough time to make the next one.

## Inspiration
An 80-minute gap between classes sounds useful until you spend it deciding where to go, checking the clock and looking for a seat. Our starting example was a 9:55 AM class ending in Classroom Building and an 11:15 AM class in nearby Derring Hall. We built HokieGap for any student facing that decision in the engineering cluster.

## What it does
HokieGap compares nearby places for studying, quiet work, group work, eating or a break. It accounts for walking both ways, the next class, an arrival buffer, published hours where available and recent student seating reports. It shows expected class-change activity, available time, a departure deadline and Google Maps directions. Students can save preferences and gaps on their own device and switch to a Plan B if the first place is unsuitable.

## How we built it
React and TypeScript power the interface. A deterministic planner enforces time constraints. Public VT building, space, class and library-hours data are curated into snapshots. A class-change heuristic uses section capacity and proximity to estimate disruption; it does not claim measured occupancy. A server-side Gemini agent calls a campus-options tool and explains a validated recommendation. Shared seating reports are stored in Cloudflare D1.

Only include the following after a successful real workspace test: Databricks stores the campus snapshot and normalized schedule tables, and the agent queries the SQL warehouse for its planning evidence. Show the query and returned source in the demo. Do not list this as complete while credentials/data setup are pending.

## Challenges
Class capacity is not attendance, and nearby class dismissals do not directly reveal seats. Public opening-hours and indoor-location coverage are incomplete. We distinguish those unknowns from live student observations, and validate model-selected destinations instead of accepting invented places.

## What we learned and next steps
The immediate value is helping students make a feasible choice quickly. Next steps are verified indoor locations and dining hours, observation-based calibration, broader timetable coverage and usability testing with students. We have not yet demonstrated real-world forecast accuracy or university adoption.

## Attribution and honest scope
Built with AI coding assistance (Codex), external React/Vinext/Sites scaffolding and UI libraries. Dependencies are listed in package.json; dataset sources and assumptions are in docs/DATA.md. Team-specific contributions include the campus gap workflow, data curation, timing rules, class-change heuristic, report workflow and agent integration. Record both contributors' actual work and any work performed outside the official hacking period. Add real testing feedback only after it is collected.

## Before submitting
- Add both contributors and choose at least one VTHacks category.
- Select Gemini under MLH only after the real API demo succeeds.
- Select Deloitte + Databricks only after a real workspace-backed agent demo succeeds and official requirements are met.
- Select Cloudforce only after creating/testing the HokieAI Side Kick and meeting its post/entry requirements.
- No more than three sponsor challenges; MLH categories are a separate unlimited list.
- Add https://github.com/L-Star29/HokieGap and the public demo URL, plus screenshots/video if requested by the form.
- Submit before September 20, 8 AM Eastern unless organizers explicitly update the deadline. Confirm the final submission, not just the project draft.
