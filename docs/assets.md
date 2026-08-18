# Asset Manifest
**Project:** Tejas Portfolio — The Desk  
**File:** `assets.md`  
**Upload when:** adding images, changing fonts, or needing to audit what's in use

---

## Fonts

All loaded via a single Google Fonts `<link>` in `<head>`. No local font files.

| Family | Weights loaded | Used in (registry IDs) | Source |
|---|---|---|---|
| Press Start 2P | 400 | Scene title, hotspot tags, boot screen, drawer labels, OS chrome, close buttons — COMP-02, COMP-03, SEC-00, SEC-02, SEC-03 | Google Fonts |
| Fraunces | 400, 600 (opsz 9..144) | Panel headings, cheque brand, dossier title — SEC-07 through SEC-12 | Google Fonts |
| IBM Plex Sans | 400, 500 | Body copy in all panels | Google Fonts |
| Space Mono | 400, 700 | Ledger labels, dossier fields, OS rows, eyebrows, cert strip — SEC-07, SEC-08, SEC-09, SEC-10, SEC-11 | Google Fonts |
| Caveat | 600, 700 | Cheque inputs, board note titles, dossier signature — SEC-11-E01, SEC-12-E01 | Google Fonts |

**Google Fonts URL:** The `<link>` in `<head>` currently loads all five families in a single request. Don't split this into multiple requests without a reason.

---

## Images

No images currently used in the site. Everything visual is CSS (gradients, borders, box-shadows, pseudo-elements).

### Planned

| Asset | Used in | Format | Notes |
|---|---|---|---|
| Boot logo mark | SEC-00 (boot screen) | SVG | Not yet designed. Currently no logo in the boot screen (the v5 boot splash with a placeholder SVG was rolled back). |
| OG / social preview image | `<head>` meta | PNG, 1200×630 | Not yet created. Suggested: screenshot of the desk scene. |
| Favicon | `<head>` | PNG or ICO, 32×32 | Not yet created. |
| Gallery photos — competitions | SEC-14 (Gallery, not yet shipped) | JPG/PNG | Needs real photos from Humshakals, Prachaara, CRESCERE. |
| Gallery photos — Broseph Foundation | SEC-14 (Gallery, not yet shipped) | JPG/PNG | Needs real photos from field drives, Shikshana Vedike, Civic Drive. |
| Gallery photos — personal | SEC-14 (Gallery, not yet shipped) | JPG/PNG | TBD. |

---

## Icons

No icon library or icon files used. All icons in the codebase are emoji characters rendered inline in HTML (💾, 📊, 🗂️, 📋 on the OS icon grid). These are system emoji and don't require any asset files.

---

## Open items

- [ ] Design and host a boot logo mark (SVG preferred) — required before the boot splash can be rebuilt
- [ ] Create favicon
- [ ] Create OG image
- [ ] Collect real photos before building the Gallery panel
