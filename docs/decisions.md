# Decision Log
**Project:** Tejas Portfolio — The Desk  
**File:** `decisions.md`  
**Upload when:** before making a significant design or product decision, to check if it's already been made; after making one, to record it.

Entries are in reverse chronological order (newest first). Reference affected `SEC-XX` IDs where relevant.

---

## Decisions

### DEC-021 — robots.txt: fully open to every crawler, deliberately
**Date:** Aug 2026  
**Affects:** `robots.txt` (new file, site root)  
**Decision:** No `Disallow` rules anywhere. Every major search engine and AI crawler — training crawlers, AI search/citation crawlers, and live user-triggered fetch bots — is explicitly allowed, individually named, in addition to a wildcard `Allow: /` that would already cover everyone by itself.  
**Reason:** Explicit goal is maximum discoverability — showing up in traditional search, in AI-generated summaries (e.g. a Google AI Overview or Gemini summary), in chatbot citations (ChatGPT, Claude, Perplexity live-fetching this site when someone asks about Tejas), and in the training data of future models. Naming crawlers individually rather than relying only on the wildcard makes the intent explicit and future-proofs against any single company changing its default wildcard-handling behavior.  
**Distinction worth knowing:** as of 2026, most major AI companies split their crawlers into three categories — training (e.g. `GPTBot`, `ClaudeBot`, `Google-Extended`), search/citation indexing (e.g. `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`), and live user-triggered fetches (e.g. `ChatGPT-User`, `Claude-User`, `Perplexity-User`). All three categories are allowed here — the usual advice to allow only search/citation bots and block training bots does not apply, since training visibility is explicitly wanted too.  
**No Sitemap directive included:** the site is currently a single HTML document with JS-driven panel navigation, not multiple real URLs — a conventional XML sitemap doesn't map well onto that structure yet. Revisit if the site ever gains real multi-page routes.

---

### DEC-020 — Real mobile support built: tap-grid nav below 480px
**Date:** Aug 2026  
**Affects:** `mobile.css`, `index.html` (`.mobile-nav`)  
**Decision:** Below 480px, the 3D desk scene (`.stage`) is hidden entirely and replaced by a simple 2-column tap-grid of 6 buttons (Skills, History, Contact, Projects, About, The Board), reusing the exact same `openPanel()` calls as the desk objects — no separate logic.  
**Why not just shrink the scene:** the desk scene relies on precise pixel-level layering (cabinet, desk, board side by side, each with internal absolutely-positioned sub-objects) that doesn't meaningfully scale down to phone width without becoming illegible or requiring pinch-zoom. A tap grid is a known, reliable pattern instead of trying to force a desktop-metaphor scene into a phone viewport.  
**Bug caught during build:** the mobile nav grid was initially styled entirely inside `mobile.css`'s `@media` block with no corresponding `display:none` default in `style.css` — meaning it would have rendered on desktop too, stacked underneath the scene. Caught during verification before shipping; fixed by adding `.mobile-nav{display:none;}` as a base rule in `style.css`. See the "known patterns to avoid" table in `architecture.md`.

---

### DEC-019 — Split single file into index.html / style.css / mobile.css / script.js
**Date:** Aug 2026  
**Affects:** entire codebase  
**Decision:** Split the single `desk-demo-v2.html` file into four files.  
**Reason:** The site now has real GitHub Pages hosting, so the original justification for single-file (must work by double-clicking with zero setup) no longer applies. The CSS had grown to ~330 rules and was becoming hard to navigate as one inline block. Splitting makes each layer independently readable, editable, and diffable.  
**Old file removed:** `desk-demo-v2.html` deleted after the split was verified — cross-checked every `getElementById` call in `script.js` against actual IDs in `index.html`, every `onclick` call against defined functions, and every board note ID (`sn-*`, `bn-*`) between the HTML and the `connections`/`noteDetails` objects in `script.js`. All matched with zero gaps before the old file was removed.

---

### DEC-018 — v5 rolled back in full
**Date:** Aug 2026  
**Affects:** All of v5 additions  
**Decision:** Rolled back the entire v5 build (CSS 3D scene, boot splash redesign, Desktop panel, Gallery, Tickets, Timeline Tree) after Tejas reviewed it and called it worse than the previous version.  
**Action taken:** Each change was individually reverted. File verified back to exact v4.1 line count (1174 lines), zero residual references.  
**What to do differently:** Get specific direction on what isn't landing before rebuilding it the same way. The 3D scene, the boot splash, and the new apps are all still valid ideas — they just need a clearer brief.

---

### DEC-017 — 3D approach: CSS transforms over WebGL/Three.js
**Date:** Aug 2026  
**Affects:** SEC-01, SEC-02, SEC-03, SEC-04  
**Decision:** CSS 3D transforms (perspective, preserve-3d, translateZ) chosen over Three.js/WebGL.  
**Reason:** Claude cannot preview a WebGL render before delivering it, which means there's a meaningful risk of shipping something that looks broken. CSS 3D is verifiable in the code itself. The intended aesthetic (tilted diorama, not a walkable 3D room) doesn't require a full 3D engine anyway.  
**Status:** Decision stands. Implementation was attempted in v5 but the full build was rolled back. Revisit with more specific direction.

---

### DEC-016 — Gallery/Tickets/Timeline Tree deferred until real content exists
**Date:** Aug 2026  
**Affects:** Planned SEC-14, SEC-15, SEC-16  
**Decision:** All three new panels were scaffolded in v5 and then rolled back with the rest of the build. The rationale for deferring remains: Gallery needs real photos before it's worth shipping, Tickets is nice but tertiary, and Timeline Tree's value depends entirely on the 3D/visual direction being stable first.

---

### DEC-015 — Board notes open full detail card on click, not just highlight strings
**Date:** Aug 2026  
**Affects:** SEC-12, SEC-12-E01, SEC-12-E02  
**Decision:** Clicking a note on the expanded board now opens a full-text detail card (`.note-detail`). The connection string highlight still happens alongside it, not instead of it. Before this fix, clicking a note only ran `highlightConnections()` which drew the SVG lines but didn't surface the actual text content — a dead-end interaction.  
**Feedback that triggered it:** "clicking a note only highlights the path instead of opening the entire thing."

---

### DEC-014 — Sticky note on desk removed (duplicate path)
**Date:** Aug 2026  
**Affects:** SEC-03  
**Decision:** The yellow sticky note that was on the right side of the desk's front face opened the same board panel as the corkboard sitting immediately next to it. Removed as a redundant click target. The corkboard is now the single entry point to the board.

---

### DEC-013 — ACCA redaction fixed from invisible easter egg to obvious interactive element
**Date:** Aug 2026  
**Affects:** SEC-10, SEC-10-EGG01  
**Decision:** Changed from black-on-black text toggle to a visible striped bar with a "(tap the black bar to declassify)" hint.  
**Reason:** An easter egg with zero discoverability that hides behind "(click to reveal)" text you can't see has no value. If the intent is that it's a real easter egg, it should at least look like something is there.

---

### DEC-012 — About panel expanded with quick facts and jump links
**Date:** Aug 2026  
**Affects:** SEC-10, SEC-10-E02, SEC-10-E03  
**Decision:** Added a Quick Facts strip and cross-panel jump links (Work & Education / Projects / Wins & Losses / Skills) to the dossier.  
**Reason:** The About panel was too thin — a short bio and a field table doesn't give enough to someone who lands there first. The jump links turn it into a real hub.

---

### DEC-011 — Root cause: stray position:relative broke Skills and Contact panels
**Date:** Aug 2026  
**Affects:** SEC-08 (`panel-ledger`), SEC-11 (`panel-contact`)  
**Decision:** Removed `position:relative` from `.panel-ledger` and `.panel-contact`.  
**Root cause:** Both had `position:relative` in their panel-specific CSS rule. The base `.panel` class has `position:fixed`. Both rules have equal specificity; the later rule wins, so `position:relative` silently overrode `position:fixed`. With `position:relative`, the panels rendered in normal document flow — but since `body{overflow:hidden}`, they were invisible. The other 4 panels didn't have this stray rule, which is why only the top and bottom cabinet drawers appeared broken.

---

### DEC-010 — Content placement: competitions only on the board, never elsewhere
**Date:** Aug 2026  
**Affects:** SEC-12 exclusively; SEC-07, SEC-08, SEC-09, SEC-10 explicitly excluded  
**Decision:** All competition and public speaking content (Humshakals, Prachaara, CRESCERE, Civic Drive, 0-for-3 record) lives on the board only.  
**Reason:** These are story/performance-shaped content. The board's pinned-notes format suits them far better than a findings grid or a bullet list. Duplicating them elsewhere would dilute both formats.

---

### DEC-009 — Legal & Case Support written straight, no humor
**Date:** Aug 2026  
**Affects:** SEC-09, finding REF-003  
**Decision:** The Legal & Case Support finding in the audit panel uses a plain factual tone — no audit-report jokes, no dry comedy.  
**Reason:** The work involves supporting crime victims through FIR filings and accompanying them to police stations. The ledger/audit metaphor's humor doesn't belong there.

---

### DEC-008 — ACCA figure corrected to 9/13, not 9/12
**Date:** Aug 2026  
**Affects:** SEC-00, SEC-08, SEC-09, SEC-10  
**Decision:** Earlier drafts said "9 of 12 papers done." The correct figures are: 9 done via exemptions (BT, MA, FA, LW, PM, TX, FR, AA, FM), 4 advanced papers remaining (SBL, SBR, APM, AAA) = 13 total papers in the ACCA qualification. Fixed everywhere.

---

### DEC-007 — Desk-front duplicate drawers removed
**Date:** Aug 2026  
**Affects:** SEC-03  
**Decision:** Removed the second set of drawers (Skills / History / Contact) that existed on the desk's own front face in v3. They opened identical content to the metal cabinet drawers. Two different-looking objects opening identical content dilutes both.

---

### DEC-006 — Wall shelf and lamp nested inside .desk, not .stage
**Date:** Aug 2026  
**Affects:** SEC-05, SEC-06  
**Decision:** Shelf and lamp are `position:absolute` children of `.desk`, not of `.stage`.  
**Reason:** If they're children of `.stage`, they need hardcoded pixel offsets to visually align above the desk — and those offsets break as soon as the desk's width changes. Nesting them inside `.desk` means they inherit the desk's own width naturally.

---

### DEC-005 — Single file, no build step (superseded by DEC-019)
**Date:** project start  
**Affects:** everything  
**Decision:** The entire site lived in `desk-demo-v2.html`. No build step, no bundler, no component files.  
**Reason:** Fit GitHub Pages self-hosting. Easy to upload, share, and debug without a local dev environment.  
**Status:** Superseded Aug 2026 by DEC-019 — split into `index.html`/`style.css`/`mobile.css`/`script.js` once real hosting removed the "must work by double-clicking" constraint. The *no build step* principle still holds; only the single-file part changed.

---

### DEC-004 — CSS 3D chosen over Three.js (original decision)
**Date:** Aug 2026  
**Affects:** SEC-01, SEC-02, SEC-03, SEC-04  
**Decision:** Discussed directly with Tejas. CSS 3D transforms chosen after explicit tradeoff consideration. See DEC-017 for the v5 retry and rollback.

---

### DEC-003 — No content duplication across panels
**Date:** project start  
**Affects:** all panels  
**Decision:** If something is in one panel, other panels link to it rather than copy it. The Timeline Tree concept (when built) must follow this rule — every node is a pointer to existing content, never a new copy.

---

### DEC-002 — No fabricated blog posts
**Date:** early build  
**Affects:** Writing section (no longer exists as a standalone panel)  
**Decision:** Earlier design drafts had placeholder blog post sticky notes ("Post title — finance or ops," etc.). These were cut because faking content that doesn't exist is worse than not having a writing section at all. Replaced with a single honest Newsletter note pointing to Beehiiv.

---

### DEC-001 — Front-facing desk view, not top-down
**Date:** Aug 2026 (v3 redesign)  
**Affects:** SEC-01, SEC-02, SEC-03, SEC-04  
**Decision:** Changed from a bird's-eye-view desk layout to a front-facing view — as if sitting across from the desk, not looking down at it.  
**Reason:** The front view allows distinct visual depth between the cabinet, desk, and board. The top-down view was flat and read as a diagram, not a room.
