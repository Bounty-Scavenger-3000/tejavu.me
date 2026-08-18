# Sitemap
**Project:** Tejas Portfolio — The Desk  
**File:** `sitemap.md`  
**Upload when:** adding/moving/removing sections or changing navigation

---

## Navigation model

There is no traditional navbar. The desk scene IS the navigation. Every object that opens something is listed in the object map in `element-registry.md`. The only "nav" visible to a user is:

- **Hotspot tags** (`.htag`) — pixel-font tooltips on hover over clickable objects
- **OS icon grid** on the monitor screen post-boot — 4 icons linking to Projects, Skills, About, History
- **Jump links** inside the About/Dossier panel (SEC-10-E03) — cross-panel links to Work & Education, Projects, Wins & Losses, Skills

---

## Section map

| SEC ID | Panel ID | "Fake" label | What it really shows | Entry point(s) |
|---|---|---|---|---|
| SEC-07 | `panel-os` | Projects | 4 real projects: RTI Master Tracker, NGO Volunteer Retention Study, Project Thakurs (18/20), Campus Venture (240 sales) | Monitor → boot → OS icon; About jump link |
| SEC-08 | `panel-ledger` | Skills | DR/CR statement of competencies (community management, finance, legal, content, public speaking, automation, research) + technical tools + ACCA/Cisco/NPTEL cert strip | Cabinet drawer 1; About jump link |
| SEC-09 | `panel-audit` | History | 6 audit findings on the Broseph Foundation role + B.Com/ACCA education | Cabinet drawer 2; About jump link |
| SEC-10 | `panel-dossier` | About | Bio, philosophy, quick facts, redactable ACCA papers, classified fields table, cross-panel jump links | Dossier folder on desk mat; monitor OS icon |
| SEC-11 | `panel-contact` | Contact | Cheque-styled contact form + social links | Cabinet drawer 3 |
| SEC-12 | `panel-board` | The Board | Competitions & public speaking: Humshakals, Prachaara, The Callback, CRESCERE, Civic Drive, 0-for-3, newsletter | Cork board on scene; sticky note on desk (removed v4.1); About dossier body text points here |

---

## Content location rules

| Content type | Lives in | Reason |
|---|---|---|
| Competitions & public speaking | SEC-12 (Board) only | Performance/story content fits the corkboard format; repeating elsewhere would duplicate |
| Work experience detail | SEC-09 (Audit) only | Findings format suits factual role breakdown |
| Projects | SEC-07 (Projects) only | OS-window issues format suits project listing |
| Skills / certifications | SEC-08 (Ledger) only | DR/CR metaphor is the most specific fit |
| Philosophy / "who I am" | SEC-10 (Dossier) only | About file is the natural home |
| Contact form + socials | SEC-11 (Contact) only | |
| Legal & Case Support detail | SEC-09 (Audit) finding REF-003 | Written straight, no humor |

**Rule:** if you want to surface something from one panel inside another, use a **link or jump**, not a copy.

---

## Sections not yet built

| Planned ID | Planned name | Notes |
|---|---|---|
| SEC-13 | Testimonials | Needs real quotes; no real content yet |
| SEC-14 | Gallery | Scaffolded in v5, rolled back with the rest of v5. Ready to re-add when real photos exist |
| SEC-15 | Tickets / Roadmap | Kanban view of site's own build state. Scaffolded in v5, rolled back |
| SEC-16 | Timeline Tree | Branching git-graph sitemap. Every node = pointer to existing panel, never duplicate content. Scaffolded in v5, rolled back |
