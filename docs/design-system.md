# Design System
**Project:** Tejas Portfolio — The Desk  
**File:** `design-system.md`  
**Upload when:** touching visuals, colours, type, spacing, or animation

---

## Colour palette

All tokens are defined as literal hex values in the CSS — not CSS custom properties yet. If refactoring, add them to `:root` and replace all usages.

### Room / scene

| Name | Hex | Used in |
|---|---|---|
| Room dark | `#0a0812` | `body` background, `#room` gradient |
| Room purple glow | `rgba(40,20,80,0.55)` | `#room` radial gradient top |
| Star white | `#ffffff` | `.star` elements |

### Desk / wood

| Name | Hex | Used in |
|---|---|---|
| Wood highlight | `#b08040` | Desk top edge border |
| Wood mid | `#8a6030` – `#6a4820` | Desk top surface gradient |
| Wood dark | `#4a3010` – `#2a1808` | Desk front face, legs |
| Wood border | `#5c3d1a` | Desk left/right borders |

### Metal cabinet

| Name | Hex | Used in |
|---|---|---|
| Cabinet light | `#7a8090` | Cabinet body highlight |
| Cabinet mid | `#5a6070` | Cabinet body |
| Cabinet dark | `#484e5c` | Cabinet body shadow |
| Cabinet border | `#3a404e` | Cabinet edges |
| Cabinet handle | `#ccc` – `#888` | Drawer handles |

### Ledger / paper panels (SEC-08, SEC-11)

| Name | Hex | Used in |
|---|---|---|
| Paper | `#F1EBD8` | Panel background (repeating) |
| Paper deep | `#E9E1C8` | Alternating tone (not currently used in panels) |
| Rule blue | `rgba(147,166,196,0.38)` | Horizontal ledger lines |
| Rule red | `#A93E3E` | Vertical margin rule line (fixed left) |
| Ink | `#2B231C` | Body text on paper |
| Ink muted | `#6E6252` | Secondary text, labels |
| Gold accent | `#C9A85C` | Not currently used in panels — reserved |

### Audit panel (SEC-09)

| Name | Hex | Used in |
|---|---|---|
| Audit bg | `#f8f8f6` | Panel background |
| Audit blue | `#003366` | Top border, eyebrow text, meta labels |
| Finding green | `#1a5c3a` | STRENGTH findings border + rating |
| Finding amber | `#c07a00` | SATISFACTORY findings border + rating |
| Finding red | `#8b1a1a` | RISK findings border + rating |

### Dossier panel (SEC-10)

| Name | Hex | Used in |
|---|---|---|
| Dossier dark | `#1a1a1a` | Panel background |
| Dossier paper | `#f5f0e8` | File card background |
| Dossier tab | `#d4c9a8` | File tab background |
| Dossier tab border | `#8b7355` | File tab bottom border |
| Dossier red | `#cc2200` | CLASSIFIED stamp, flagged text, redaction border |
| Dossier field border | `#c4b89a` | Field table lines |
| Dossier field label | `#8b7355` | Field label text |

### OS / Projects panel (SEC-07)

| Name | Hex | Used in |
|---|---|---|
| OS bg | `#1a3a6a` – `#1a4a6a` | Panel background gradient |
| OS window | `#c8c0b8` | Window chrome |
| OS titlebar | `#000080` – `#1084d0` | Window titlebar gradient |
| OS row hover | `#000080` | Menu item hover |

### Terminal / boot (SEC-00)

| Name | Hex | Used in |
|---|---|---|
| Terminal bg | `#050505` | Boot screen background |
| Terminal green | `#00ff41` | Boot text, monitor idle screen |
| Terminal dim | `#005510` | Dim lines in boot |
| Terminal amber | `#ffb000` | Warning lines in boot, monitor idle |
| Terminal red | `#ff4444` | Error lines in boot |

### Corkboard (SEC-04, SEC-12)

| Name | Hex | Used in |
|---|---|---|
| Board wood | `#2a1808` – `#3a2208` | Board frame |
| Cork tan | `#7a5530` – `#8B6340` | Cork surface gradient |
| String red | `rgba(180,60,60,.35)` | Dashed string lines (default) |
| String red active | `#ff3333` | Highlighted string lines (on note click) |

### Note card variants (COMP-05)

| Class | Background | Border |
|---|---|---|
| `.nc.yellow` | `#ffe566` | `#e6c800` |
| `.nc.white` | `#f5f5f0` | `#d0ccc0` |
| `.nc.pink` | `#ffc0cc` | `#e090a0` |
| `.nc.blue` | `#b8deff` | `#70a8e0` |
| `.nc.green` | `#b8f0cc` | `#60c880` |
| `.nc.orange` | `#ffd0a0` | `#e0a060` |

### Global UI

| Name | Hex | Used in |
|---|---|---|
| Pixel gold | `#ffcc00` | Scene title, hotspot tags, push pins, close button |
| Pixel gold dim | `rgba(255,200,0,.4)` | Scene subtitle |

---

## Typography

| Role | Family | Weight | Where |
|---|---|---|---|
| Pixel / labels | `'Press Start 2P', monospace` | 400 | Scene title, hotspot hints, drawer labels, boot screen, OS chrome, push-pin text, close buttons |
| Display | `'Fraunces', serif` | 400 / 600 | Panel headings (`font-size: clamp(24px,4vw,40px)`), cheque brand, dossier title |
| Body | `'IBM Plex Sans', sans-serif` | 400 / 500 | Paragraph copy in all panels (`font-size: 13–15px`, `line-height: 1.65–1.8`) |
| Mono | `'Space Mono', monospace` | 400 / 700 | Ledger tags, dossier field labels, OS issue rows, eyebrow labels, certifications strip |
| Handwriting | `'Caveat', cursive` | 600 / 700 | Cheque input fields, pinned note titles on the board, dossier signature |

All fonts loaded from Google Fonts via a single `<link>` in `<head>`. No local font files.

---

## Spacing

No formal grid system yet. Key values in use:

| Value | Used for |
|---|---|
| `56px` top / `60px` bottom | `.p-inner` panel padding (top/bottom) |
| `32px` left/right | `.p-inner` panel padding (sides) |
| `80px` left | `.led-inner` / `.cq-inner` — accounts for the fixed red margin rule at `left: 56px` |
| `12px–20px` | Gap between drawer items, finding rows, note cards |
| `48px` | Repeating ledger rule interval (background-size) |

---

## Animation

| Name | Property | Duration | Easing | Used on |
|---|---|---|---|---|
| Panel entrance | `opacity`, `transform: scale` | `0.3s` | `cubic-bezier(.22,1,.36,1)` | All panels on `.active` |
| Room fade | `opacity` | `0.5s` | `ease` | `#room` when panels open/close |
| LED blink | `opacity` | `2.3s` / `0.35s` | `ease-in-out` | Green power LED / amber activity LED |
| Star twinkle | `opacity` | `3–6s` (per star) | `ease-in-out` | `.star` elements in room |
| Lamp flicker | `opacity` | `7s` | `ease-in-out` | `.lamp-cone` |
| Steam rise | `transform: translateY`, `opacity` | `3s` | `ease-in-out` | `.steam` on mug |
| Title glow | `text-shadow` | `4s` | `ease-in-out` | `.scene-title` |
| Boot bar fill | `width` | `0.1s` per step | `linear` | `.boot-bar` |
| Boot line reveal | `opacity`, `transform: translateY` | `0.25s` | default | `.boot-line` |
| Note scale | `transform: scale` | `0.2s` | default | Board note on `highlightConnections()` |
| Cursor blink | `opacity` | `0.9s` | `step-end` | `.cur` on monitor idle screen |

**Convention:** entrances use `cubic-bezier(.22,1,.36,1)` (spring-like). Ambient animations are `ease-in-out` infinite loops. Micro-interactions default to `0.15–0.2s ease`.

---

## Breakpoints

Two real breakpoints, both in `mobile.css`. Full per-decision detail is in `responsive-behavior.md` — this table is just the values.

| Breakpoint | Value | File | What changes |
|---|---|---|---|
| Tablet | `max-width: 768px` | `mobile.css` | Scene scales down and becomes horizontally scrollable; stars hidden; scene subtitle hidden |
| Phone | `max-width: 480px` | `mobile.css` | Scene (`.stage`) hidden entirely, replaced by `.mobile-nav` tap grid; panels get larger tap targets and single-column layouts; note detail becomes a bottom sheet |
| Panel-internal | `max-width: 600px` | `style.css` (inline in the panel section) | Ledger/audit/dossier grids collapse to single column — this is separate from the two breakpoints above and applies even on a narrow desktop window, not just phones |

**Load order matters:** `mobile.css` is linked after `style.css` in `index.html`, so its rules can override desktop defaults. Any new component that should be hidden on phone needs an explicit `display:none` default in `style.css` — `mobile.css` only adds `@media`-scoped overrides, it has no unscoped rules of its own. See DEC-020 in `decisions.md` for why this matters (a real bug this exact gap caused).
