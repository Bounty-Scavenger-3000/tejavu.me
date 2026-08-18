# Technical Architecture
**Project:** Tejas Portfolio — The Desk  
**File:** `architecture.md`  
**Upload when:** touching JS logic, panel system, boot sequence, or board string drawing

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| HTML | Vanilla, `index.html` | No build step; markup only, no inline CSS/JS |
| CSS | Vanilla, `style.css` + `mobile.css` | Split for readability; mobile.css loaded after style.css, contains only `@media` blocks |
| JS | Vanilla, `script.js` | Single external file, loaded at end of `<body>` |
| Fonts | Google Fonts via `<link>` | No local font files needed |
| 3D | CSS transforms only (deferred) | See DEC-017 |
| Forms | UI-only | Needs Formspree or similar |

---

## Folder structure

```
index.html            ← markup only
style.css              ← desktop/tablet styles
mobile.css              ← phone overrides (loaded after style.css)
script.js               ← all JS
docs/
  README.md
  element-registry.md
  design-system.md
  sitemap.md
  content-copy.md
  easter-eggs.md
  decisions.md
  architecture.md      ← this file
  responsive-behavior.md
  components.md        ← to be created
  assets.md
  seo-meta.md
```

---

## JS patterns

### Panel system

All panels share a single open/close API. This is the most important pattern to understand before touching any panel-related code.

```js
const PANELS = ['os','ledger','audit','dossier','contact','board'];

function openPanel(id)   // fades room out, shows panel, triggers pIn animation
function closePanel(id)  // removes active class, restores room if nothing else open
function switchPanel(fromId, toId)  // closes one panel, opens another after 340ms
```

**How it works:**
- `.panel` has `display:none` by default.
- `openPanel()` sets `display:block` then adds `.active` on the next frame — this lets the `pIn` CSS animation play.
- `closePanel()` removes `.active`, waits 320ms for the animation out, then sets `display:none` and checks if any other panel is open before restoring `#room` opacity.
- The 320ms delay and the 340ms delay in `switchPanel` must stay in sync with the panel animation duration (`0.3s`).

**The CSS specificity trap (documented bug, DEC-011):**
The base rule is `.panel { position: fixed }`. If any panel-specific rule also sets `position`, and that rule appears *later* in the stylesheet with equal specificity, it silently wins — making the panel render in document flow instead of as a full-screen overlay. Since `body { overflow: hidden }`, the panel then becomes completely invisible. Always check for stray `position` declarations when a panel appears blank.

---

### Boot sequence

```js
const bootMessages = [...]  // array of {t: string, c: colour-class}
let booted = false           // prevents re-running after first boot

function bootSequence()     // called on monitor click; runs sequence or reopens Projects
function skipBoot()         // clears sequence, calls finishBoot()
function finishBoot()       // sets booted=true, swaps monitor screen, opens Projects
```

Colour classes for boot lines: `''` = green, `'d'` = dim green, `'am'` = amber, `'er'` = red.

After `finishBoot()`, `#monIdle` is hidden and `#monOS` is shown — the monitor "wakes up" visually on the scene even as the Projects panel opens full-screen.

---

### Board string system

Two independent SVG-drawing functions. Both use `getBoundingClientRect()` after DOM layout, so strings are always accurate regardless of where notes sit.

```js
const connections = {
  humshakals: ['dean','verdict','record'],
  // ... etc
}

function drawBigStrings(highlighted)  // draws all connections on the expanded board
                                       // if highlighted is a key, its lines go solid red
function drawSceneStrings()           // draws simplified connections on the small scene board
function highlightConnections(id)     // calls drawBigStrings(id) + briefly scales the note
```

`drawBigStrings()` is called:
1. When the board panel opens (via `openPanel`, after 350ms delay to let the panel render)
2. When a note is clicked (via `openNoteDetail`, which calls `highlightConnections`)

`drawSceneStrings()` is called on `window load` (300ms delay) and on `resize`.

**To add a connection:** add the key pair to the `connections` object. Both directions don't need to be listed — the function deduplicates with a `Set`.

---

### Note detail system

```js
const noteDetails = {
  humshakals: { meta: '...', title: '...', body: '...' },
  // ...
}

function openNoteDetail(key)   // populates overlay, shows it, highlights connections
function closeNoteDetail()     // hides overlay
```

The overlay (`#noteDetail`, `.note-detail`) is a `position:fixed` div that sits above the board panel (z-index: 950). Clicking outside the card closes it. ESC also closes it — handled in the keydown listener, which checks `noteDetail` *before* checking PANELS so it intercepts the key correctly.

---

### Clock

```js
function updateClock()  // sets #osTime to current HH:MM
```

Called immediately on load and every 10 seconds via `setInterval`. The `#osTime` element is inside the tiny in-scene monitor's taskbar.

---

## CSS organisation

`style.css` is structured top-to-bottom in this order. Mobile-specific overrides (breakpoints, the mobile nav grid) live separately in `mobile.css` — see `responsive-behavior.md`:

1. **Reset & base** — `*`, `html,body`, `prefers-reduced-motion`
2. **Room** — `#room`, `.star`, `.wall-glow`, `.lamp-cone`
3. **Scene title** — `.scene-title`, `.scene-sub`
4. **Stage** — `.stage`
5. **Wall shelf** — `.wall-shelf`, `.shelf-*`, `.book`, plant, trophy
6. **Lamp** — `.lamp-*`
7. **Metal cabinet** — `.cabinet`, `.cab-*`
8. **Desk** — `.desk`, `.desk-*`, `.tower`, `.monitor`, `.mon-*`, `.keyboard`, `.mouse-obj`, `.dossier-desk`, `.desk-right`, `.mug*`
9. **Corkboard** — `.cork-board`, `.board-*`, `.strings-svg`, `.pin-note`, `.pushpin`, `.nc*`
10. **Hotspot tags** — `.htag`
11. **Boot screen** — `#boot-screen`, `.boot-*`
12. **Panel base** — `.panel`, `.p-close`, `.p-inner`
13. **Panel: OS/Projects** — `.panel-os`, `.os-*`, `.oi*`, `.il*`
14. **Panel: Skills** — `.panel-ledger`, `.led-*`, `.sgrid`, `.sc`, `.sr`, `.cert-strip`
15. **Panel: Audit** — `.panel-audit`, `.audit-*`, `.findings`, `.finding`, `.f-*`
16. **Panel: Dossier** — `.panel-dossier`, `.d-*`
17. **Panel: Contact** — `.panel-contact`, `.cq-*`, `.cheque`, `.socials`
18. **Panel: Board** — `.panel-board`, `.board-expand-*`, `.big-board`, `.big-strings-svg`
19. **Note detail overlay** — `.note-detail`, `.note-detail-card`, `.nd-*`

**Naming convention:** component prefix + descriptor + optional modifier. No BEM enforced but classes try to follow `[component]-[part]` (e.g. `.cab-drawer`, `.d-tab`, `.cq-row`).

**Safe to edit freely:** panel-specific rules (items 13–19 above).  
**Edit with care:** `#room`, `.stage`, `.panel` (items 1–4, 12) — changes here affect everything.  
**Don't touch without reading:** `body { overflow: hidden }` and `.panel { position: fixed }` — these two rules underpin the entire scene/panel architecture.

---

## Known patterns to avoid

| Anti-pattern | Why | Example where it caused a bug |
|---|---|---|
| Adding `position: relative` to a panel-specific class | Overrides `.panel { position: fixed }` at equal specificity; panel becomes invisible | `panel-ledger`, `panel-contact` — DEC-011 |
| Duplicate click targets opening the same panel | Dilutes the scene metaphor and confuses the navigation model | Desk sticky note + corkboard both opened the board — DEC-014 |
| Copying content from one panel to another | Violates DEC-003; creates maintenance burden | — |
| Using a hardcoded pixel offset to position `.wall-shelf` or `.lamp-wrap` | Breaks when the desk's width changes | Fixed by nesting them inside `.desk` — DEC-006 |
| Styling a component fully in `mobile.css` without a default `display:none` in `style.css` | The component renders on desktop too, since there's nothing to hide it outside the media query | `.mobile-nav` — caught and fixed during the same session it was introduced, DEC-020 |
