# SEO & Meta
**Project:** Tejas Portfolio — The Desk  
**File:** `seo-meta.md`  
**Upload when:** changing page titles, meta descriptions, or social preview data

---

## Current meta (in `<head>`)

```html
<title>Tejas — The Desk</title>
<meta name="description" content="Tejas — Community Impact & Finance Fellow, ACCA part-qualified, occasional standup act.">
```

---

## Recommended meta (from content doc, not yet implemented)

**Title tag:** `Tejas MP | ACCA Part-Qualified, Audit & Finance | Bengaluru`  
**Meta description:** `ACCA part-qualified finance professional in Bengaluru, building toward audit. Community operations, financial systems, and a few unnecessary pitch-competition wins.`

---

## Crawler policy (robots.txt)

Fully open, deliberately. `robots.txt` lives at the site root and explicitly allows every major search engine and AI crawler — including AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, etc.), AI search/citation crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot), and live user-triggered fetch bots (ChatGPT-User, Claude-User, Perplexity-User). No `Disallow` rules exist anywhere. Full reasoning and the "why not just use a wildcard" explanation is in `decisions.md` DEC-021.

**Keep this list current:** new AI crawlers appear a few times a year. Worth a periodic check (a few times a year is enough) against a current source to see if any major new crawler needs adding.

---

## SEO strategy

Since `tejavu.me` is a personal-name domain, the SEO job is simple: when someone searches Tejas's name — or name plus ACCA, Broseph Foundation, or Christ University — this site should be the clearest answer.

- Keep full name near the top of whatever element renders as the semantic `<h1>` equivalent.
- The current page title `Tejas — The Desk` doesn't include a last name or any qualifiers. Recommend switching to the above.

---

## OG / social preview

Not yet implemented. To add:

```html
<meta property="og:title" content="Tejas MP | ACCA Part-Qualified, Finance & Community">
<meta property="og:description" content="ACCA part-qualified finance professional in Bengaluru. Portfolio site.">
<meta property="og:image" content="[URL to a screenshot or custom OG image]">
<meta property="og:url" content="https://tejavu.me">
<meta name="twitter:card" content="summary_large_image">
```

---

## Favicon

Not yet implemented. Placeholder to add:

```html
<link rel="icon" type="image/png" href="/favicon.png">
```

---

## Open items

- [ ] Switch page title to the recommended version above
- [ ] Add full name (first + last) somewhere visible near the top of the scene — currently just "TEJAS . V" which omits the last name and is in pixel font, potentially not read clearly by crawlers
- [ ] Implement OG tags
- [ ] Create and host a favicon
- [ ] Create OG image (suggested: a screenshot of the desk scene with the title overlay)
