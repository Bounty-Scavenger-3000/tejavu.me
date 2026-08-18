# Responsive Behavior
**Project:** Tejas Portfolio — The Desk  
**File:** `responsive-behavior.md`  
**Upload when:** touching `mobile.css`, changing breakpoint values, or debugging phone/tablet display issues

---

## Philosophy

The desk scene is a desktop metaphor — a front-facing view of cabinet, desk, and corkboard side by side, built from precisely positioned pixel-art layers. It doesn't shrink gracefully; at phone width it becomes either illegible or requires pinch-zoom, which defeats the point of a phone visit.

Rather than trying to force the desktop scene into a phone viewport, the site switches to a **completely different navigation pattern** below 480px: a tap grid. Same six destinations, same `openPanel()` functions, zero new logic — just a different way to reach them that doesn't depend on being able to see fine pixel-art detail.

Between 480px and 768px (tablet / narrow desktop), the scene stays but scales and becomes horizontally scrollable rather than switching to the tap grid — there's usually enough room at that width to still make out the scene, just not enough to fit it uncompressed.

---

## Breakpoint 1 — Tablet (`max-width: 768px`)

**File:** `mobile.css`

| Element | Change | Reason |
|---|---|---|
| `.star` | `display:none` | Decorative twinkle animation reads as visual noise at this size and isn't worth the render cost |
| `.scene-title` | Font size drops to `10px` | Keeps proportion as everything else shrinks |
| `.scene-sub` | `display:none` | The `[ CLICK AN OBJECT TO EXPLORE ]` hint isn't needed once things are close enough to tap directly |
| `.stage` | `overflow-x:auto`, `justify-content:flex-start` | Rather than squashing cabinet+desk+board to fit, let the user scroll sideways through them at a legible size |
| `.cabinet`, `.cab-body` | Width `160px → 130px` | Proportional shrink |
| `.cab-desc` | `display:none` | Drawer description text becomes too small to read at this size; the drawer label alone is still enough to navigate by |
| `.desk` | `min-width:420px` | Stops the desk's internal absolutely-positioned children (tower, monitor, dossier folder) from overlapping as the flex container shrinks |
| `.cork-board` | `360×420px → 260×340px` | Proportional shrink |
| `.mon-outer`, `.mon-screen`, `.mon-stand` | Proportional shrink | Keeps the monitor visually coherent at the smaller cabinet/desk scale |
| `.keyboard` | `185px → 150px` | Proportional shrink |

**Not changed at this breakpoint:** panels. They're already full-screen overlays and don't need special tablet handling — the existing `max-width:600px` grid-collapse rules (in `style.css`) handle narrow-panel layout regardless of whether the narrowness comes from a phone or a resized desktop window.

---

## Breakpoint 2 — Phone (`max-width: 480px`)

**File:** `mobile.css`

### Layout shift: scene → tap grid

| Element | Change |
|---|---|
| `html, body` | `overflow:auto`, `height:auto` — the page becomes a normal scrolling page instead of a viewport-locked scene |
| `#room` | `height:auto`, `min-height:100vh`, `flex-direction:column`, `overflow:visible` |
| `.stage` | `display:none` — the entire desk scene is hidden |
| `.mobile-nav` | `display:block` (overriding the `display:none` default in `style.css`) — the tap grid takes over |

### The mobile nav grid

A 2-column grid of 6 buttons, styled to still feel like part of the desk world (wood-toned cards, pixel-font labels) without needing any of the scene's precise positioning:

| Button | Icon | Opens |
|---|---|---|
| Skills | 📊 | `panel-ledger` |
| History | 📋 | `panel-audit` |
| Contact | ✉️ | `panel-contact` |
| Projects | 💾 | `panel-os` |
| About | 🗂️ | `panel-dossier` |
| The Board | 📌 | `panel-board` |

Each button calls `openPanel()` directly via `onclick` — no new JS was written for this. See `element-registry.md` for the full HTML structure (it's in `index.html`, inside `#room`, right after `.stage`).

**Important implementation detail (DEC-020):** `.mobile-nav` needs a `display:none` default in `style.css` (not `mobile.css`) — `mobile.css` only contains `@media`-scoped rules, so without that default the grid would render on desktop too, stacked underneath the scene. This was caught during verification and fixed before shipping. Any future component that's mobile-only needs the same pattern: default hidden in `style.css`, shown via `@media` override in `mobile.css`.

### Panel adjustments at this breakpoint

| Element | Change | Reason |
|---|---|---|
| `.panel` | `animation:none` | Skips the scale-in animation — feels snappier on phone, avoids janky animation on lower-powered devices |
| `.p-close` | `min-width/height:44px` | Meets the standard minimum touch target size |
| `.p-inner` | Padding reduced to `56px 16px 40px` | More content width on a narrow screen |
| `.panel-ledger::before`, `.panel-contact::before` | `display:none` | The fixed vertical red margin rule (positioned at `left:56px`) doesn't make sense at phone width; removed along with its matching `padding-left` on `.led-inner`/`.cq-inner` |
| `.sgrid`, `.finding`, `.d-fields` | Collapse to single column | Same treatment as the existing `max-width:600px` rules, just consolidated here for phone specifically |
| `.d-stamp` | `display:none` | The "ACTIVE" rotated stamp overlaps body text at narrow widths |
| `.cheque` | Reduced padding | More usable form width |
| `.cq-bottom` | `flex-direction:column` | Submit button and signature stack instead of competing for horizontal space |
| `.os-row` | `flex-direction:column` | Project icon and text stack instead of squeezing side by side |
| `.big-board` | `overflow-x:auto` | The expanded board's fixed-position notes don't reflow, so horizontal scroll is the fallback rather than letting notes overlap |
| `.note-detail` | Anchors to bottom (`align-items:flex-end`) | Becomes a bottom sheet rather than a centered modal — easier to reach and dismiss one-handed |
| `.note-detail-card` | `max-width:100%`, rounded top corners only | Standard bottom-sheet treatment |
| `.pin-note` | `min-width:80px` | Ensures board notes stay tappable even where their content is short |

---

## What's intentionally NOT handled yet

- **Hover-only hotspot tags** (`.htag`) — these show on `:hover`, which doesn't fire on touch. They're not critical (the tap still works without seeing the tag first), but there's no touch-friendly equivalent (like a persistent label) yet. Low priority since the mobile nav grid bypasses the scene — and therefore the hotspot tags — entirely below 480px. Only relevant in the 480–768px tablet range, where the scene is still visible and touch-only.
- **Landscape phone orientation** — not specifically tested or handled. The 480px breakpoint is based on width only.
- **Very small phones** (under ~360px) — the 2-column mobile nav grid hasn't been checked against the narrowest common phone widths.

---

## Testing checklist

Re-run after any change to `mobile.css`, `.stage`, or any panel layout:

- [ ] Scene scrolls horizontally and stays legible at 768px
- [ ] Scene fully hidden and mobile nav grid fully visible at 480px and below
- [ ] All 6 mobile nav buttons open their correct panel
- [ ] Every panel is readable and scrollable at 375px width (a common baseline phone width)
- [ ] Cheque form is usable one-handed
- [ ] Board note detail opens as a bottom sheet and is dismissible
- [ ] No horizontal page-level scrollbar appears anywhere except inside `.stage` (tablet) and `.big-board` (phone, board panel)
