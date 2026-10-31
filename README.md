# tejavu.me

Personal portfolio at [tejavu.me](https://tejavu.me). A static multi-page site built with [Vite](https://vite.dev): plain HTML, CSS and JavaScript, no framework.

## Pages

| URL | Source | What it is |
|---|---|---|
| `/` | `index.html`, `src/root/` | The resume, with a button that switches the site to the desk scene |
| `/desk/` | `desk/index.html`, `src/scenes/desk/` | The desk scene: a retro desk where every object opens a panel |
| `/logo/` | `logo/index.html`, `src/logo/` | Logo export: seven variants, PNG download |
| `/graph/` | `graph/index.html`, `src/graph/` | The site's own code drawn as an interactive graph |

## Structure

```
src/
  core/        shared by every scene
    engine/      panel system (stacking, ESC), boot sequence, clock, strings, click actions
    panels/      board, terminal, timeline, contact, videos, tabs
    styles/      panel styles, boot screen, video facade, brand tokens, Universa font
    fonts/
    video.js     YouTube thumbnail that loads the player on click
  content/     scene text (desk.js), the board's notes (board.js) and the video list (videos.js)
  scenes/      one folder per scene: its room, styles and wiring (main.js)
  root/ logo/  page-specific styles and scripts
  graph/       the code-graph page and its data snapshot
public/        copied as is into the site root (CNAME, robots.txt, sitemap.xml, favicon.svg)
```

A scene supplies its own environment and imports what it needs from `core`. See `src/scenes/desk/main.js`.

The desk's terminal commands are in `src/scenes/desk/terminal.js`; the board's notes are a tree in `src/content/board.js` (add a note or a category there and it appears).

## Develop

```
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve dist/ locally
```

## Refreshing the code graph

`/graph/` draws `src/graph/graph-data.json`, a snapshot of the code mapped with [graphify](https://graphify.com). After changing the code:

```
graphify extract . --code-only    # writes graphify-out/ (git-ignored)
npm run graph                     # trims it to src/ and rewrites the snapshot
```

## Branches and deploy

| Branch | Purpose |
|---|---|
| `dev` | Working branch. A push runs the build as a check and deploys nothing. |
| `main` | Production. A push builds and deploys `dist/` to GitHub Pages through GitHub Actions. |

Work on `dev`, merge into `main` to deploy. `main` is never edited directly, so after a merge both branches sit on the same commit:

```
git checkout main && git merge dev && git push origin main && git checkout dev
```

## Adding a scene

1. Create `<name>/index.html` and `src/scenes/<name>/`.
2. Add the page to `build.rollupOptions.input` in `vite.config.js`.
3. Import the engine and panels it needs from `src/core`.
