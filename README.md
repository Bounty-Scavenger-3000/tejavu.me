# tejavu.me

Personal portfolio at [tejavu.me](https://tejavu.me). A static multi-page site built with [Vite](https://vite.dev): plain HTML, CSS and JavaScript, no framework.

## Pages

| URL | Source | What it is |
|---|---|---|
| `/` | `index.html`, `src/root/` | The plain version: a working resume |
| `/desk/` | `desk/index.html`, `src/scenes/desk/` | The desk scene: a retro desk where every object opens a panel |
| `/logo/` | `logo/index.html`, `src/logo/` | Logo export: five variants, PNG download |
| `/secret/` | `secret/index.html` | Redirect to `/desk/` (the scene's old URL) |

## Structure

```
src/
  core/        shared by every scene
    engine/      panel system, boot sequence, clock, strings
    panels/      board, timeline, contact
    styles/      panel styles, boot screen, brand tokens, Universa font
    fonts/
  content/     scene text (desk.js)
  scenes/      one folder per scene: its room, styles and wiring (main.js)
  root/ logo/  page-specific styles and scripts
public/        copied as is into the site root (CNAME, robots.txt)
```

A scene supplies its own environment and imports what it needs from `core`. See `src/scenes/desk/main.js`.

## Develop

```
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve dist/ locally
```

## Branches and deploy

| Branch | Purpose |
|---|---|
| `dev` | Working branch. A push runs the build as a check and deploys nothing. |
| `main` | Production. A push builds and deploys `dist/` to GitHub Pages through GitHub Actions. |

Work on `dev`, merge into `main` to deploy. After merging, sync `dev` back to `main`:

```
git checkout dev && git reset --hard origin/main && git push --force origin dev
```

## Adding a scene

1. Create `<name>/index.html` and `src/scenes/<name>/`.
2. Add the page to `build.rollupOptions.input` in `vite.config.js`.
3. Import the engine and panels it needs from `src/core`.

## Docs

Maintained in an Obsidian vault, not in this repo.
