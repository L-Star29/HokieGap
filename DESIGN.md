---
name: HokieGap
description: A calm campus departure board for the gap between two classes.
colors:
  chicago-maroon: "#861f41"
  chicago-maroon-deep: "#6f1936"
  maroon-mist: "#f5dce5"
  gap-amber: "#eea75b"
  ember: "#ce6a39"
  amber-wash: "#fff0df"
  amber-ink: "#8d4c1a"
  field-paper: "#f8f8f3"
  sage-panel: "#eeeee7"
  surface-white: "#ffffff"
  moss-ink: "#262b25"
  moss-gray: "#5b6157"
  hairline: "#dedfd7"
  input-line: "#d4d7ce"
  meadow-green: "#547246"
  meadow-wash: "#e6eddf"
  meadow-bar: "#9aab90"
  meadow-mist: "#f1f3e9"
  meadow-ink: "#52633f"
  alarm-red: "#a32136"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(30px, 3vw, 41px)"
    fontWeight: 750
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  numeral:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-2.2px"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  full: "50%"
spacing:
  hair: "6px"
  sm: "10px"
  field-gap: "15px"
  panel-pad: "22px"
  column-gap: "25px"
  page-top: "34px"
components:
  button-primary:
    backgroundColor: "{colors.chicago-maroon}"
    textColor: "{colors.surface-white}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: "46px"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.chicago-maroon-deep}"
  button-outline:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.moss-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.moss-ink}"
    typography: "{typography.caption}"
    height: "36px"
    padding: "0"
  button-ghost-selected:
    textColor: "{colors.chicago-maroon}"
  route-link:
    backgroundColor: "{colors.chicago-maroon}"
    textColor: "{colors.surface-white}"
    typography: "{typography.body-sm}"
    rounded: "7px"
    padding: "12px 14px"
  route-link-hover:
    backgroundColor: "{colors.chicago-maroon-deep}"
  field-input:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.moss-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: "41px"
    padding: "4px 12px"
  spot-card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.moss-ink}"
    rounded: "{rounded.lg}"
    padding: "19px 21px 8px"
  spot-card-selected:
    backgroundColor: "{colors.surface-white}"
  planner-panel:
    backgroundColor: "{colors.sage-panel}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel-pad}"
  activity-tag:
    backgroundColor: "{colors.meadow-mist}"
    textColor: "{colors.meadow-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: "3px 7px"
  activity-tag-high:
    backgroundColor: "{colors.amber-wash}"
    textColor: "{colors.amber-ink}"
  notice:
    backgroundColor: "{colors.amber-wash}"
    textColor: "{colors.moss-ink}"
    rounded: "{rounded.sm}"
    padding: "10px"
---

# Design System: HokieGap

## Overview

**Creative North Star: "The Between-Class Timetable"**

HokieGap looks like a calm campus departure board. The student arrives in a hurry, with a number in mind: the minutes between one class and the next. The interface answers with timing first. The big gap-minutes figure, the leave-by clock time and the "minutes available" count are the largest, boldest things on the page. Everything else is quiet warm paper and hairlines so those numbers can be read at a glance on a phone between buildings.

The mood is calm, honest and friendly to someone in a hurry. Surfaces are pale and slightly green-tinted, text is plain-language, and every heuristic wears an "ESTIMATE" tag rather than pretending to be live. One color acts. Chicago Maroon marks the primary action, the selected place, the leave-by number and links, and nothing decorative competes with it. Depth comes from tonal layers (paper, sage panel, white card) and 1px borders, not from shadows.

The system visually rejects gamified campus-app gloss, fake-live indicators and crowd-heatmap drama. Colors that suggest status (green, amber) are reserved for what the data actually says and never dress up guesses as measurements.

**Key Characteristics:**
- Timing numerals lead; labels and prose recede.
- One action color (Chicago Maroon) used sparingly against warm, green-tinted neutrals.
- Flat and precise: hairline-bordered white cards on paper, 6 to 12px radii, no real shadows.
- Numbered steps (01, 02, 03) turn the planner into a left-to-right procedure: your gap, places that fit, your route.
- Estimates are labeled as estimates, in small caps tags and caption text.
- System Arial throughout; no custom typeface is loaded.

## Colors

A pale, green-tinted paper palette with a single deep maroon action color, a warm amber reserved for warnings and the logo glyph, and a muted meadow green for "quiet, open, fine" signals.

### Primary
- **Chicago Maroon** (#861f41): VT's official maroon. The only action color: primary buttons, the route-link slab, the selected card's border, the leave-by numeral, the "settle in" timeline step, text-button links, focus rings (at 50% alpha) and the logo tile.
- **Deep Maroon** (#6f1936): hover state for maroon slabs (route link, primary button).
- **Maroon Mist** (#f5dce5): small text set on a maroon surface, such as the route-link subtitle.

### Secondary
- **Gap Amber** (#eea75b): the "g" in the logo glyph. Not an action color.
- **Ember** (#ce6a39): the bar color when forecast class-change activity is high.
- **Amber Wash** (#fff0df) and **Amber Ink** (#8d4c1a): the "high class activity" tag; the pale-amber notice strip (#fff3df in the CSS) shares this family.

### Tertiary
- **Meadow Green** (#547246): student seat-report text, the only place green means "someone saw seats".
- **Meadow Mist** (#f1f3e9) and **Meadow Ink** (#52633f): the calm-state activity tag. **Meadow Wash** (#e6eddf): the Plan B panel background. **Meadow Bar** (#9aab90): forecast bars with low activity, and status dots near #93a386.

### Neutral
- **Field Paper** (#f8f8f3): page background. Pale, warm, faintly green.
- **Sage Panel** (#eeeee7): the planner panel and other tinted containers (mini-map #eeeee5, forecast #efefe7, route panel #f0f1e8 on tablet).
- **Surface White** (#ffffff): topbar, cards, inputs, outline buttons.
- **Moss Ink** (#262b25): body text and headings; a near-black with olive undertone, never pure black.
- **Moss Gray** (#5b6157): all secondary text: captions, metadata, locations, results copy. It holds at least 5.3:1 on every surface in the system, including Sage Panel and Meadow Wash. One role; do not add lighter grays.
- **Hairline** (#dedfd7): card and section borders (variants #dce0d5, #dfe1d7 exist in the CSS). **Input Line** (#d4d7ce): field borders.
- **Alarm Red** (#a32136): inline errors only.

### Named Rules
**The One Action Color Rule.** Chicago Maroon is the only color that asks the student to do something. Amber and green describe data; they never appear on buttons.

**The Tinted Neutral Rule.** Neutrals carry a faint yellow-green tint (paper, sage, moss). Do not introduce pure white backgrounds beside them except for raised surfaces (cards, topbar, fields), and never pure black text.

**The No False Status Rule.** Green and amber appear only where the data says so (seat reports, class-change activity). Never use them as decoration or to suggest availability the product cannot know.

## Typography

**Display Font:** Arial (with Helvetica, sans-serif)
**Body Font:** Arial (with Helvetica, sans-serif)
**Label/Mono Font:** none; labels are Arial, uppercase with wide tracking for the smallest tags.

**Character:** A single system sans, tightened at large sizes (negative letter-spacing on the headline, numerals and card names) and opened at the smallest uppercase labels. The face is a default, not a commitment; hierarchy comes from size, weight and tracking, not from font pairing. Weight 750 on the H1 renders as bold in Arial.

### Hierarchy
- **Display** (750, clamp(30px, 3vw, 43px), 1.15, -1.8px): the page H1 "A little gap. A good place." (30px on phones). Tracking is -0.03em.
- **Numeral** (700, 56px, 1, -2.2px): the gap-minutes figure in Chicago Maroon at the top right; hidden on phones. The card-level "minutes available" numeral is the same idea at 34px (30px on phones), set beside its label on one baseline.
- **Headline** (700, 20px, -0.5px): place name on a card; panel headings (H2) sit at 19px.
- **Title** (700, 17px): H3 sections in the detail panel and empty state.
- **Body** (400, 16px, 1.5): page background text and intro paragraph; most interface copy is 14px.
- **Body Small** (400, 14px, 1.5): the working size for form values, results copy, timeline steps and details.
- **Label** (600, 14px): field labels, summaries, secondary buttons. Colored #52584e.
- **Caption** (400, 12px, 1.5): location lines, metadata, forecast disclaimers, card footers.

### Named Rules
**The Numbers Lead Rule.** The largest, tightest type on any screen is a duration or a clock time. Headlines describe; numerals decide.

**The Small-Caps Honesty Rule.** Every heuristic, forecast or snapshot gets a small uppercase tag or a caption saying what it is. Estimates are never set in the same voice as facts.

## Layout

A three-column workspace on wide screens: a fixed-width planner (280px, 300px above 1450px), a flexible results list and a route-and-timing panel (340px, 360px above 1450px), separated by a 28px gap (32px above 1450px). Main content is capped at 1500px with 4% side gutters and a 28px top offset. The topbar is 72px (60px on phones). The "Ask HokieGap" request sits above the workspace as one compact row so the answer starts high on the page.

Responsive behavior is by column collapse, and the DOM order is the procedure order (your gap, places that fit, your route) at every size. At 1120px and below the workspace is two columns: the planner on the left, places above the route panel on the right; the route panel becomes a white bordered block. At 700px and below everything is a single column. The planner folds into a one-line summary of the gap ("3:55 AM – 4:55 AM · 60 min", the two buildings and the intent) with a Change control, so the first place is visible without scrolling through the form; the gap numeral and campus label are hidden; card actions grow to a 44px touch height.

Rhythm is loose and pragmatic rather than a strict scale: 15px between form fields, 22px panel padding (20px on phones), 13px between cards, 19 to 21px card padding. A page's intro and steps are labeled 01, 02, 03 so the layout reads as a procedure.

## Elevation & Depth

Flat by design. Depth is tonal: Field Paper (page), Sage Panel (containers), Surface White (raised cards, topbar, fields). Borders are 1px hairlines. The product draws no shadows of its own; selection is carried by a 1.5px Chicago Maroon border and keyboard focus by a 2px maroon outline (custom controls) or a 3px maroon ring at 50% alpha (shadcn controls). The shadcn components ship a subtle `shadow-xs`, but the planner's inputs and selects reset it to none.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Selection and focus show up as borders and rings, not shadows.

## Shapes

Softly squared, never pill-shaped. Radius steps by container size: 4px for small tags, 6px for buttons, fields and the Plan B and notice strips, 7px for the route-link slab, 8px for the tinted forecast and mini-map panels, 10px for cards and the AI planner block, 12px for the planner panel, 9px on the logo tile. Circles (50%) are reserved for the step badges and status dots. Forecast bars round only their top corners (3px). The empty state uses a 1px dashed border in #c4cebb on a 10px radius.

## Components

Tone: precise and matter-of-fact. Everything is a bordered white block on a paper or sage ground; the maroon slab is the one thing that shouts.

### Buttons
- **Shape:** gently squared (6px radius).
- **Primary:** Chicago Maroon fill, white text, 15px, 46px tall and full width in the planner ("Find my spot"). The shadcn default button in the same maroon is 36px tall with 16px side padding.
- **Hover / Focus:** hover darkens to Deep Maroon (#6f1936) or 90% maroon on shadcn buttons; keyboard focus shows a 3px maroon ring at 50% alpha (shadcn) and a 4px outline offset globally.
- **Outline:** white fill, 1px hairline border, hover to the pale accent tint (#f1ebe6) with maroon text; used for "Save this gap", seat-report choices and "Show more places".
- **Ghost / card actions:** transparent, 12px text, 36px tall (42px on phones); the selected card's first action turns Chicago Maroon.
- **Text button:** underlined Chicago Maroon, 13px, for low-priority actions ("Start now", "Remove").

### Chips (activity tags)
- **Style:** 12px text on a 4px-radius tag with a 3px 7px padding; calm state is Meadow Ink on Meadow Mist, high state is Amber Wash on Amber Ink.
- **State:** state is carried by both color and label text ("Class activity: Low"), never color alone.

### Best-fit tag
- **Style:** solid Chicago Maroon, white 12px bold text, 4px radius, 3px 8px padding. It appears on the first card only, top right beside the place name. Other cards carry no rank label; order is the rank.

### Cards / Containers
- **Corner Style:** 10px for place cards, 12px for the planner panel, 8px for forecast and map.
- **Background:** Surface White for cards; Sage Panel for the planner and forecast; Meadow Wash for Plan B.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px hairline (#dce0d5); the selected card uses 1.5px Chicago Maroon.
- **Internal Padding:** 18px 20px 6px on cards (the card actions row supplies the bottom rhythm), 20px on panels.

### Inputs / Fields
- **Style:** 41px tall, white fill, 1px Input Line border, 6px radius, 14px text, no shadow. Native `select` and `input[type=time]` are used for reliability; the select chevron is a decorative lucide icon.
- **Focus:** border shifts to maroon and a 3px maroon ring at 50% alpha appears.
- **Error / Disabled:** inline errors in Alarm Red (14px, role="alert"); disabled controls drop to 50% opacity and lose pointer events.

### Navigation
- A white 72px topbar (60px on phones) with a bottom hairline: the wordmark (a 36px maroon logo tile with a white "h" and an amber "g", then "hokiegap" at 25px, 800, -1px) on the left, a "Virginia Tech" campus label (hidden below 1120px) and an "About the data" text link on the right. There is no menu; it is a single-page tool.

### Route-and-timing timeline (signature component)
A vertical ordered list with a 69px time column and a 1px left rule per step. Each step has a 7px dot on the rule. The primary "settle in" step turns Chicago Maroon and bold; other dots are a pale sage (#a9b39c). The four steps are leave, settle in, head to class, next class starts. It turns the timing-check principle into something scannable.

### Forecast bars (signature component)
Seven bars, equal width, 86px tall track, with their top corners rounded and heights mapped to the class-change score (6px to 58px). Meadow Bar for low, a sand tone (#d8ad72) for medium, Ember for high. Time labels appear on every third bar. It is always paired with an "ESTIMATE" tag and a caption that says low activity does not mean seats are available.

### Gap summary (phone only)
A full-width row at the top of the folded planner: the 01 step badge, the time range and duration in 15px bold, the two buildings and the intent in 12px Moss Gray (wrapping, never truncated to nothing), and a Chicago Maroon "Change" control with a chevron that flips when open. It is a button with aria-expanded; it disappears above 700px, where the planner is always open.

### Route link
A full-width Chicago Maroon slab (7px radius, 12px 14px padding) with a navigation icon, a 14px bold title "Open walking directions", an 11px Maroon Mist subtitle and an arrow. It is the single most prominent action in the detail panel.

## Do's and Don'ts

### Do:
- **Do** use Chicago Maroon (#861f41) as the only action color and keep it to primary actions, selected states, the leave-by numeral and links.
- **Do** lead with durations and clock times in the largest, tightest type on the screen.
- **Do** tag every estimate or snapshot with an uppercase "ESTIMATE" label or a caption saying what it is, in the voice already used ("Estimated activity from classes, not total crowds").
- **Do** express depth with tonal layers (Field Paper, Sage Panel, Surface White) and 1px hairlines (#dedfd7).
- **Do** carry meaning in text as well as color: class activity tags, seat reports and errors always include words.
- **Do** keep touch targets at least 42px tall on phones (card actions) and 41 to 46px for form controls.

### Don't:
- **Don't** put an eyebrow or kicker label above a heading. The heading carries its own weight.
- **Don't** add gamified campus-app gloss: badges, streaks, confetti or leaderboards.
- **Don't** use live indicators, pulsing dots or "now" styling for data that is a snapshot or a heuristic.
- **Don't** design crowd-heatmap drama: no red-to-green gradients or dense heat overlays for the class-change forecast.
- **Don't** use amber or green as decoration or as action colors; they mean "class activity" and "student seat report" and nothing else.
- **Don't** introduce real drop shadows for depth. Selection is a 1.5px maroon border; focus is a ring.
- **Don't** use pure black text or pure white page backgrounds; the neutrals carry the faint moss tint.
- **Don't** make cards pill-shaped or fully rounded; the largest container radius is 12px, and only step badges and dots are circles.
