---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface brief: HokieGap planner (app/page.tsx)

Scope: the single-page planner. Visitor mode: Operate. Audience: a VT student between classes, on a phone or laptop, in a hurry. Job: decide where to spend the gap and leave in time. Proof: real timing math from lib/planner.ts; nothing invented.

## Direction contract

THESIS: The page answers "what should I do with this gap" with one committed answer and the whole gap drawn to scale. It refuses the three-column dashboard of equal white cards.

OWN-WORLD: Chicago Maroon on Field Paper, hairline-bordered white blocks, tonal sage panels, no shadows. Barlow (signage-derived) for text, Barlow Semi Condensed for times and minutes. Time is the material: a ruler with tick marks, a maroon settle-in segment, sage walking segments, a hatched buffer segment.

STORY: The student sees where to go and when to leave, sees at a glance that it fits, then compares alternatives in aligned columns, and only touches the inputs to change the gap.

FIRST VIEWPORT: Desktop, top to bottom: slim topbar; headline left and the Ask HokieGap input right; a one-row gap bar (From, Next class in, Free from, Class starts, I want to, Find my spot); the answer band with the place name, a very large Leave-by time, the walking-directions button and the to-scale ruler with its four-step strip; the ranked comparison rows begin under the fold line. Phone: the gap folds to a one-line summary and the answer band follows immediately.

FORM: The Answer Board, first on my ordered list of seven structures; seed key 1ce804d6 (the roll dealt 7, 1, 5; the user chose the board).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Plan B and seat reports keep their existing behavior. Arial is replaced by self-hosted Barlow (user confirmed).
