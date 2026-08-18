# Element Registry
**Project:** Tejas Portfolio — The Desk  
**File:** `element-registry.md`  
**Upload in:** every session, along with `README.md`

This is the single source of truth for IDs. Every other doc, every code comment, and every conversation with the AI should reference these IDs instead of re-describing the same element in different words.

---

## ID Conventions

| Prefix | Meaning |
|---|---|
| `SEC-XX` | Top-level section or panel (page order) |
| `SEC-XX-EYY` | Element/sub-part within a section |
| `SEC-XX-EGGYY` | Easter egg within a section |
| `COMP-XX` | Component reused across multiple sections |

**Rules:**
- IDs are permanent. If something is removed, mark it `deprecated` — never reuse the number.
- Add `data-registry="SEC-XX"` as an attribute on the element in the HTML.
- Tag every related JS/CSS comment block with `// [SEC-XX-EYY]`.

---

## Sections

| ID | Name | Type | Location in code | Description | Status |
|---|---|---|---|---|---|
| SEC-00 | Boot Screen | Scene layer | `#boot-screen` | Terminal-text BIOS boot sequence shown when monitor is clicked. Green scrolling text + progress bar. | Live |
| SEC-01 | Room / Scene | Scene layer | `#room` | The full viewport — dark room background, stars, lamp cone, CRT scanlines overlay. Contains SEC-02, SEC-03, SEC-04. | Live |
| SEC-02 | Metal File Cabinet | Scene object | `.cabinet` | Tall grey metal cabinet, left of desk. Three clickable drawers. | Live |
| SEC-03 | Desk | Scene object | `.desk` | Centre piece. Contains wall shelf, lamp, tower PC, monitor, keyboard, mouse, dossier folder. | Live |
| SEC-04 | Cork Detective Board | Scene object | `.cork-board` | Right side. Small preview version on scene; click to expand full board panel. | Live |
| SEC-05 | Wall Shelf | Scene element | `.wall-shelf` | Decorative — books (ACCA, BCOM, OPS, TECH, MIC, CODE), plant, trophy. Nested inside `.desk`. | Live |
| SEC-06 | Lamp | Scene element | `.lamp-wrap` | Decorative desk lamp with light cone animation. Nested inside `.desk`. | Live |

---

## Panels (full-screen overlays)

| ID | Name | Type | HTML id | Opens from | Panel style | Status |
|---|---|---|---|---|---|---|
| SEC-07 | Projects | Panel | `panel-os` | Monitor (after boot) or OS icons | Win98 app window — dark blue bg, bezel, menu bar, issues list | Live |
| SEC-08 | Skills Ledger | Panel | `panel-ledger` | Cabinet drawer 1 | Ruled paper, red margin rule, DR/CR table | Live |
| SEC-09 | History / Audit Report | Panel | `panel-audit` | Cabinet drawer 2 | White paper, blue top border, findings grid | Live |
| SEC-10 | About / Dossier | Panel | `panel-dossier` | Dossier folder on desk mat | Dark bg, manila classified file, ACTIVE stamp | Live |
| SEC-11 | Contact / Cheque | Panel | `panel-contact` | Cabinet drawer 3 | Ruled paper + cheque-styled form | Live |
| SEC-12 | The Board (expanded) | Panel | `panel-board` | Corkboard on scene | Cork texture, pinned notes, red string connections | Live |

---

## Elements within sections

| ID | Name | Parent | HTML selector | Description | Status |
|---|---|---|---|---|---|
| SEC-02-E01 | Skills drawer | SEC-02 | `.cab-drawer:nth-child(1)` | Opens SEC-08 (Skills Ledger) | Live |
| SEC-02-E02 | History drawer | SEC-02 | `.cab-drawer:nth-child(2)` | Opens SEC-09 (Audit Report) | Live |
| SEC-02-E03 | Contact drawer | SEC-02 | `.cab-drawer:nth-child(3)` | Opens SEC-11 (Contact/Cheque) | Live |
| SEC-03-E01 | Tower PC | SEC-03 | `.tower` | Decorative. Has power LED (green, blinking) and drive activity LED (amber). | Live |
| SEC-03-E02 | Monitor | SEC-03 | `.monitor` | Clickable. Triggers boot sequence → opens SEC-07. After boot: shows OS icon grid. Click again → reopens SEC-07 directly. | Live |
| SEC-03-E03 | Keyboard | SEC-03 | `.keyboard` | Decorative. | Live |
| SEC-03-E04 | Mouse | SEC-03 | `.mouse-obj` | Decorative. | Live |
| SEC-03-E05 | Dossier folder | SEC-03 | `.dossier-desk` | Clickable. Opens SEC-10 (About/Dossier). Rotated ~-4deg on desk mat. | Live |
| SEC-03-E06 | Coffee mug | SEC-03 | `.mug` | Decorative. Has steam animation. Monogram "T" on face. | Live |
| SEC-03-E07 | OS icon grid | SEC-03 | `.mon-os` | Shown on monitor screen after boot. 4 icons: Projects, Skills, About, History. Each opens the matching panel. | Live |
| SEC-04-E01 | Scene board preview | SEC-04 | `.board-cork` | Small preview — 7 pinned notes with dashed red string connections. Click whole board to expand. | Live |
| SEC-04-E02 | Pinned notes (scene) | SEC-04 | `.pin-note[id^="sn-"]` | 7 notes: Humshakals, Prachaara, The Callback, CRESCERE, Civic Drive, Newsletter, 0-for-3. Click whole board to expand. | Live |
| SEC-12-E01 | Pinned notes (expanded) | SEC-12 | `.pin-note[id^="bn-"]` | 9 notes on the full board. Each opens a detail card (`SEC-12-E02`) and highlights its connection strings. | Live |
| SEC-12-E02 | Note detail card | SEC-12 | `.note-detail` | Full-text overlay for each board note. Shown on note click. Has placeholder slot for photos/attachments. ESC or click outside to close. | Live |
| SEC-08-E01 | Debit column | SEC-08 | `.sc.dr` | Left column — core competencies (what the skills cost). | Live |
| SEC-08-E02 | Credit column | SEC-08 | `.sc.cr` | Right column — technical tools (what they pay off). | Live |
| SEC-08-E03 | Certifications strip | SEC-08 | `.cert-strip` | Below the DR/CR table. Lists ACCA, Cisco Networking Academy, NPTEL certifications. | Live |
| SEC-09-E01 | Findings grid | SEC-09 | `.findings` | Six finding rows: Community Ops, Financial Ops, Legal & Case, Internal Systems, Shikshana Vedike, Education. Color coded: green = strength, amber = satisfactory, red = risk. | Live |
| SEC-10-E01 | Redacted ACCA bar | SEC-10 | `.d-redact` | Tap/click to reveal the 4 remaining ACCA papers (SBL, SBR, APM, AAA). Visible interactive bar, not hidden text. | Live |
| SEC-10-E02 | Quick facts strip | SEC-10 | `.d-quickfacts` | Below bio paragraphs. 4 bullet facts (competition record, languages, ACCA target, graduation). | Live |
| SEC-10-E03 | Jump links | SEC-10 | `.d-jumps` | At bottom of dossier. Cross-panel links: Work & Education, Projects, Wins & Losses, Skills. Uses `switchPanel()`. | Live |
| SEC-11-E01 | Cheque form | SEC-11 | `#chequeForm` | Name, email, memo fields in Caveat handwritten font. Submit shows success state. Needs Formspree wiring. | Live |
| SEC-11-E02 | Signature | SEC-11 | `.cq-sig-line` | "Tejas" in red Caveat, signed at bottom right of cheque. | Live |
| SEC-11-E03 | Social links | SEC-11 | `.socials` | Email, LinkedIn, GitHub, Instagram — currently all `href="#"`. | Needs real URLs |

---

## Easter Eggs

| ID | Name | Parent | Trigger | What happens | Discoverability hint | Status |
|---|---|---|---|---|---|---|
| SEC-10-EGG01 | ACCA redaction | SEC-10 | Click/tap the black striped bar on the dossier | Reveals the 4 remaining ACCA papers. Was invisible black-on-black text in v1; fixed in v4.1 to an obvious bar with a visible "(tap to declassify)" hint. | Visible hint text next to bar | Live |
| SEC-00-EGG01 | Boot ALERT line | SEC-00 | Just watch the boot sequence | Red line reads: "ALERT: Subject funnier in meetings than strictly professional." | None — reward for reading | Live |

---

## Components (reused across multiple sections)

| ID | Name | Used in | Selector | Description | Status |
|---|---|---|---|---|---|
| COMP-01 | Panel base | All panels | `.panel` | `position:fixed; inset:0; display:none; overflow-y:auto`. Active class + `pIn` animation. | Live |
| COMP-02 | Panel close button | All panels | `.p-close` | Fixed top-right, pixel font, yellow border. `closePanel(id)` on click. | Live |
| COMP-03 | Hotspot tag | All scene objects | `.htag` | Yellow pixel-font tooltip, `opacity:0`, revealed on `:hover`. | Live |
| COMP-04 | Pushpin | SEC-04, SEC-12 | `.pushpin` | CSS circle with ::after pin needle. Color customisable via `--pin-c` / `--pin-hi` CSS vars. | Live |
| COMP-05 | Note card | SEC-04, SEC-12 | `.nc` | Sticky-note-style card. Variants: `.yellow`, `.white`, `.pink`, `.blue`, `.green`, `.orange`. | Live |
