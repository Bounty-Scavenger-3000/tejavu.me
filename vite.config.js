import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = path => fileURLToPath(new URL(path, import.meta.url));

// The footer's "Updated <month year>" comes from the build date, so it moves with each deploy.
// index.html carries the {{UPDATED}} placeholder.
const updated = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
const stamp = { name: 'updated-stamp', transformIndexHtml: html => html.replaceAll('{{UPDATED}}', updated) };

// Multi-page static site. Every entry below becomes a folder in dist/ that GitHub Pages
// serves as-is. To add a scene: create <name>/index.html, add it here.
export default defineConfig({
  appType: 'mpa',
  base: '/',
  plugins: [stamp],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        root: page('index.html'),          // tejavu.me/
        desk: page('desk/index.html'),     // tejavu.me/desk/
        logo: page('logo/index.html'),     // tejavu.me/logo/
      },
    },
  },
});
