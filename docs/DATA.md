# Data contract and evidence

Snapshot collected September 19, 2026. File-level timestamps are in buildings.json, hours.json and snapshot.json. A retrieval date confirms what the source said, not a physical inspection.

## Static reference data

| Dataset | Contents | Update pattern |
|---|---|---|
| buildings.json | id, name, latitude, longitude, source, checkedAt | Curated copy of VT GIS; refresh when footprint changes |
| spaces.json | id, buildingId, name, location, allowed intents, note, verification, source, hoursKey, historic | Curated source review plus optional field verification |
| classes.json | CRN, course, buildingId, room, day codes, start/end minutes, section capacity, null enrollment | Public term timetable snapshot, 573 meetings from selected subjects |
| hours.json | source, checkedAt, exact ISO date -> library -> opening intervals in minutes | Dated VT LibCal snapshot; 91 dates, no guessed recurring hours |
| timetable-rows.json | Raw public section table rows for 14 selected subjects | Intermediate audit data; app consumes normalized classes.json |
| snapshot.json | term, subjects, timestamp, fetch failures, coverage warning | Produced during timetable collection |

Classroom Building=NCB; Goodwin=GOODW in timetable, GOODWIN internally; Derring=DER/DERR; Cowgill=CO/COW; Hancock=HAN; Bishop-Favrao=BFH; Hitt=HITT; Newman=LIBR/NEWMAN. Never treat scheduled classroom capacity as study-area seating capacity.

Day codes: M Monday, T Tuesday, W Wednesday, R Thursday, F Friday, S Saturday, U Sunday. Times are campus-local Eastern time; numeric times are minutes since midnight. The user-selected schedule stays in browser memory only.

Timetable source: https://selfservice.banner.vt.edu/ssb/HZSKVTSC.P_ProcRequest (POST term 202609, campus 0, subject). Public section capacity is available; enrollment requires authenticated access and is not collected. The 14 subjects are ECE, ENGE, ME, AOE, CEE, CS, MATH, PHYS, STAT, BIOL, GEOS, CHEM, ARCH, BC. Missing subjects, continuation meetings, events and cancellations reduce confidence. 4,414 raw primary section rows yielded 573 qualifying meetings in the selected buildings. These are not all-campus attendance data.

GIS: https://arcgis-central.gis.vt.edu/arcgis/rest/services/vtcampusmap/Buildings/FeatureServer/0/query

Hours: https://lib.vt.edu/about-us/hours.html and its public calendar https://api3.libcal.com/api_hours_full.php?iid=3029&months=3 . Newman and Art & Architecture Library hours are matched by exact date. Missing hours remain unknown. Common spaces have no verified access-hour dataset.

## Places and sources

- NCB alcoves: https://ssd.vt.edu/Prospective_Students.html — listed among places for quiet/solitude. No exact floor, count, opening time or current noise guarantee.
- Goodwin common spaces: https://www.zgf.com/work/987-virginia-tech-goodwin-hall — building architect describes casual study areas. Current access and exact zones unknown.
- Cowgill library: https://lib.vt.edu/about-us/libraries/artarch-library.html — 100 Cowgill, first floor. Noise policy not verified, so not offered under the explicit quiet filter.
- Hancock atrium: https://bov.vt.edu/assets/Attachment%20C_Report%20of%20the%20Information%20Session_Aug%202018.pdf — historical tables/outlets description. Current arrangement unverified; ranking penalty applied.
- Derring overhang: https://neuroscience.vt.edu/latest-news/welcome-students.html — historical 2020 outdoor study-furniture reference. Weather and current setup unverified; ranking penalty applied.
- Newman: https://lib.vt.edu/study-learn/study-spaces.html — quiet floors 3/5, group floors 2/4. Open seating, no room reservation implied.
- Hitt Hall: https://www.facilities.vt.edu/design-construction/capital-construction/campus-construction-projects/HITTHall.html — official description of open collaboration zones and a 600-seat dining facility. Exact collaboration-zone access hours remain unverified.
- Perry Place: https://dining.vt.edu/dining_centers/perryplace.html — official description of nine dining venues. Live venue hours and menus are not imported.

## Dynamic observations

D1 reports table: random id, random browser sessionId (private), spaceId, level (plenty/few/none), server createdAt. Read API omits sessionId, returns only the last 15 minutes, and disables caching. A current report affects a plan only when it would still be fresh at the estimated arrival. Future dates do not inherit current reports. Missing reports mean unknown, never empty. Reports have no model-generated values and are never backdated from a client timestamp.

The one-minute session limit is enforced by a conditional SQL insert. Cookie replacement can bypass it; further anti-abuse controls are needed before broad public use. Expired observations are omitted immediately; records older than seven days are deleted on subsequent report writes. Older storage may remain while there are no writes.

## Initial model — explicit hypotheses

Walking minutes = ceiling(straight-line building distance × 1.35 / 70 m per minute) + 2 minutes indoors; same building = 2 minutes. These are illustrative walk estimates, not validated routes or accessible paths.

Class-change index uses 8% of section capacity immediately after a class ends, fading linearly over 25 minutes. Pre-class contribution uses 2.5% over the final 10 minutes. Same building weight=1; other buildings within 250m receive at most 0.2, fading with distance. Shared room and time meetings are deduplicated using the maximum capacity. No attendance or linger percentage has been measured.

The peak sampled every five minutes during a planned visit determines its warning and ranking penalty. Index >=30: higher surge; >=10: some surge; otherwise lower surge. This is a relative demand index, **not a number of occupants, percentage full, seat-availability probability, or learned model**. Lower surge does not mean seats available. The forecast applies only Sept 19–25, 2026.

Ranking = usable minutes - 0.4 × peak demand index - report penalty (75 no seats, 20 few seats) - 12 for historical-only descriptions - 5 for unknown opening hours. These are transparent product heuristics to validate, not optimized coefficients. Known closed spaces are excluded; known closing times truncate the visit. Both walking legs must fit the chosen maximum; usable time must be >=15 minutes.

## What training would actually require

Repeated anonymous observations of each specific space before/after class changes, time/date, seat categories or counted free seats, source age and confidence, relevant schedule features, and ideally total available seats. A temporal held-out test should compare a learned model against time-of-day and this simple heuristic, reporting error and false 'available' predictions. Do not report ML accuracy before collecting labels and testing. A few hackathon samples can validate the interaction, not predictive accuracy.
