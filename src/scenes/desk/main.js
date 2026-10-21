// THE DESK scene (tejavu.me/desk): the entry point that wires core to this scene.
//
// Core (src/core) holds the engine and the panels. This file supplies what is specific
// to the desk: the room, the monitor, which panels exist and what happens around them.
// A new scene follows the same shape: build its environment, create the panel system
// with its own hooks, and import only the panels it uses.

import { bindActions } from '../../core/engine/actions.js';
import { createPanelSystem } from '../../core/engine/panel-system.js';
import { createBoot } from '../../core/engine/boot.js';
import { startClock } from '../../core/engine/clock.js';
import { createBoard } from '../../core/panels/board.js';
import { createTimeline } from '../../core/panels/timeline.js';
import { initContact } from '../../core/panels/contact.js';
import { initVideos } from '../../core/panels/videos.js';
import { initTabs } from '../../core/panels/tabs.js';
import { initBoardPreview } from './board-preview.js';
import { boot as bootContent, noteDetails } from '../../content/desk.js';
import { channel, videos } from '../../content/videos.js';
import { panelIds, connections, embeds, timelineNodes } from './data.js';

const $ = id => document.getElementById(id);

// board panel
const board = createBoard({ connections, noteDetails, embeds });

// boot. `panels` is declared below and only used when events fire.
const boot = createBoot({
  messages: bootContent.messages,
  phrases: bootContent.phrases,
  text: bootContent,
  onFinish() {
    $('monIdle').style.display = 'none';
    $('monOS').style.display = 'block';
    panels.open('desktop');
  },
  onAlreadyBooted: () => panels.open('desktop'),
});

// panels, with the desk's hooks. The desktop stays open under the apps it launches.
const panels = createPanelSystem({
  ids: panelIds,
  displayFor: id => (id === 'desktop' ? 'flex' : 'block'),
  // The room's scanline overlay sits above panels, so the room hides whenever an app is
  // open. The desktop does not count: it belongs to the monitor and keeps the scanlines.
  onChange: open => {
    $('room').style.opacity = open.some(id => id !== 'desktop') ? '0' : '1';
    if (!open.includes('youtube')) youtube.reset();
  },
  onAfterOpen: id => { if (id === 'board') setTimeout(() => board.drawBig(null), 350); },
});

// timeline
const timeline = createTimeline({ nodes: timelineNodes, panels, openNote: board.openNote });

// ESC closes the note overlay first, then open panels, then skips a running boot.
// The desktop is the "home" panel: ESC never closes it directly.
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (board.isNoteOpen()) { board.closeNote(); return; }
  panels.closeAll({ except: ['desktop'] });
  if (boot.isRunning()) boot.skip();
});

initContact();
const youtube = initVideos({ videos, channel });
initTabs($('panel-audit'));
initBoardPreview();
startClock('osTime');     // clock on the in-scene monitor
startClock('desktopClock'); // taskbar clock

// Clicks (and Enter on [data-key] elements) are routed by the data-* attributes in desk/index.html.
bindActions({
  open: id => panels.open(id),
  close: id => panels.close(id),
  switch: (v, el) => {
    panels.switchTo(...v.split(':'));
    if (el.dataset.noteAfter) setTimeout(() => board.openNote(el.dataset.noteAfter), 400);
  },
  note: id => board.openNote(id),
  'note-close': () => board.closeNote(),
  node: id => timeline(id),
  boot: () => boot.start(),
  skip: () => boot.skip(),
  toggle: (cls, el) => el.classList.toggle(cls),
  stop: () => {},
});
