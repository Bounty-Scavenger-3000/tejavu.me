# Tejas Portfolio — README
**Project name:** The Desk  
**Domain:** tejavu.me  
**Repo:** Bounty-Scavenger-3000 (GitHub Pages)

---

## What this is

A personal portfolio site where the homepage is a front-facing **retro desk scene** — metal file cabinet (left), CRT desktop computer (centre), cork detective board (right). Every object on the desk is clickable and opens a full-screen panel in its own distinct visual style. No traditional navbar; the desk is the navigation.

On phones (below 480px), the desk scene is replaced by a simple tap-grid menu — see `responsive-behavior.md`.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| HTML/CSS/JS | Vanilla, split into 4 files | No build step; works anywhere; fits GitHub Pages hosting |
| Fonts | Google Fonts (Press Start 2P, Fraunces, IBM Plex Sans, Space Mono, Caveat) | Loaded via `<link>` in `<head>` |
| 3D | CSS transforms only (not currently implemented — see decisions.md DEC-017/DEC-018) | Reliable without a preview step; Three.js/WebGL explicitly ruled out |
| Animation | CSS `@keyframes` + `requestAnimationFrame` | No library dependency |
| Forms | UI-only (cheque form) | Needs Formspree or similar wired in |

---

## Files

```
index.html                 ← page shell + all markup (no inline CSS/JS)
style.css                  ← all styles for desktop/tablet
mobile.css                 ← phone-specific overrides, loaded after style.css
script.js                  ← all interactive behaviour
robots.txt                 ← fully open crawler policy (see decisions.md DEC-021)
docs/
  README.md                ← this file
  element-registry.md      ← master ID index (upload every session)
  design-system.md         ← colours, type, spacing, animation, breakpoints
  sitemap.md               ← section map, nav structure
  components.md            ← design-level component inventory
  content-copy.md          ← all actual text, by section ID
  easter-eggs.md           ← hidden interactions, triggers, status
  decisions.md             ← design/product decisions log
  architecture.md          ← technical choices and patterns
  assets.md                ← images, icons, fonts inventory
  seo-meta.md              ← titles, descriptions, OG data
  responsive-behavior.md   ← per-breakpoint mobile decisions
```

**There are exactly four site code files** (`index.html`, `style.css`, `mobile.css`, `script.js`) plus `robots.txt` and the `docs/` folder. No other HTML/CSS/JS files should exist in `/outputs/`.

**Why split instead of single-file:** the project now has real hosting (GitHub Pages), so the "must work by just double-clicking the file" constraint that originally justified the single-file approach no longer applies. Splitting makes the ~330-rule CSS file and the JS logic far easier to read, edit, and diff. GitHub Pages serves relative `<link>`/`<script src>` paths natively, so nothing about hosting changes. See `decisions.md` DEC-019.

---

## How to run locally

Open `index.html` in any browser. It loads `style.css`, `mobile.css`, and `script.js` via relative paths, so the four files need to stay in the same folder — no server required for local viewing, though a local server (or GitHub Pages itself) is needed if you ever browser-block local relative file loads.

---

## Hosting

- **Host:** GitHub Pages
- **Repo:** `Bounty-Scavenger-3000`
- **Domain:** tejavu.me (managed on Hostinger)
- **DNS:** 4× GitHub A records + CNAME → `Bounty-Scavenger-3000.github.io`
- **Branch workflow:** `dev` for work, `main` for production

---

## AI session guide

**Upload every session:**
1. `README.md` (this file)
2. `element-registry.md`

**Upload by task:**
- Touching visuals → also upload `design-system.md`
- Touching mobile/responsive behaviour → also upload `responsive-behavior.md`
- Touching copy → also upload `content-copy.md`
- Touching JS/easter eggs → also upload `easter-eggs.md`, `architecture.md`
- New section/component → also upload `sitemap.md`, `components.md`

**After every session:** ask the AI to return updated versions of any docs it changed, and the actual code files it touched. Nothing persists automatically.

---

## Key rules (enforced across all sessions)

1. **Four files, no more** — `index.html`, `style.css`, `mobile.css`, `script.js`. Never create a new HTML/CSS/JS file for existing work; edit these four in place.
2. **No new draft files** — if an old draft exists, delete it; don't accumulate versions.
3. **IDs are permanent** — use `element-registry.md` IDs in all code comments and doc references. Deprecated = marked deprecated, never reused.
4. **No content duplication** — if something's in one panel, the other panels link to it, not copy it.
5. **Competitions & public speaking live on the board only** — not repeated elsewhere.
6. **Legal & Case Support content is written straight** — no humor; it covers supporting crime victims through the FIR process.
7. **Never add `position:relative` to a panel-specific CSS class** — see `architecture.md` for the specificity bug this caused once already (DEC-011).
