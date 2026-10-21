// Root site behaviour: video facades and the skin switch.
import { mountVideos } from '../core/video.js';

mountVideos();

// The PC button plays a CRT shut-off, then loads the desk scene, which plays the matching
// open (see .crt-close in root.css and .crt-open in scenes/desk/scene.css).
const pc = document.querySelector('[data-skin-switch]');
if (pc) {
  pc.addEventListener('click', () => {
    const go = () => { window.location.href = '/desk/'; };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
    try { sessionStorage.setItem('skin-wipe', '1'); } catch (e) { /* storage blocked: skip the open animation */ }
    document.body.insertAdjacentHTML('beforeend', '<div class="crt-close" aria-hidden="true"><i></i><i></i></div>');
    setTimeout(go, 900);
  });
}

// Coming back with the browser's Back button restores this page as it was left, overlay included.
window.addEventListener('pageshow', () => document.querySelector('.crt-close')?.remove());
