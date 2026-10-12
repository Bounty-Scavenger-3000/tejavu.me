import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = path => fileURLToPath(new URL(path, import.meta.url));

// Multi-page static site. Every entry below becomes a folder in dist/ that GitHub Pages
// serves as-is. To add a scene: create <name>/index.html, add it here.
export default defineConfig({
  appType: 'mpa',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        root: page('index.html'),          // tejavu.me/
        desk: page('desk/index.html'),     // tejavu.me/desk/
        logo: page('logo/index.html'),     // tejavu.me/logo/
        secret: page('secret/index.html'), // tejavu.me/secret/, redirects to /desk/
      },
    },
  },
});
