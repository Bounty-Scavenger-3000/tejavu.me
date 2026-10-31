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
import { initTerminal } from './terminal.js';
import { boot as bootContent, noteDetails } from '../../content/desk.js';
import { board as boardContent } from '../../content/board.js';
import { channel, videos } from '../../content/videos.js';
import { panelIds, basePanels, embeds, timelineNodes } from './data.js';

const $ = id => document.getElementById(id);

// board panel
const board = createBoard({ board: boardContent, noteDetails, embeds });

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
  base: basePanels,
  displayFor: id => (id === 'desktop' ? 'flex' : 'block'),
  // The room's scanline overlay sits above panels, so the room hides whenever an app is
  // open. The desktop does not count: it belongs to the monitor and keeps the scanlines.
  onChange: open => {
    $('room').style.opacity = open.some(id => id !== 'desktop') ? '0' : '1';
    if (!open.includes('youtube')) youtube.reset();
    if (!open.includes('board')) board.reset();
    // A frame keeps keyboard focus after it closes, which would swallow the next ESC.
    if (!open.includes('graph') && document.activeElement === $('graphFrame')) { $('graphFrame').blur(); window.focus(); }
  },
  onAfterOpen: id => {
    if (id === 'board') board.relayout();
    if (id === 'terminal') terminal.focus();
    if (id === 'graph' && !$('graphFrame').src) $('graphFrame').src = '/graph/?embed';
  },
});

// timeline
const timeline = createTimeline({ nodes: timelineNodes, panels, openNote: board.openNote });

// ESC peels one layer at a time: the note overlay, then the board's open category, then the
// top app (a terminal stays open under an app it launched). The desktop is the "home" panel:
// ESC never closes it. ESC also skips a running boot.
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (board.isNoteOpen()) { board.closeNote(); return; }
  if (panels.top() === 'board' && board.back()) return;
  panels.closeTop();
  if (panels.top() === 'terminal') terminal.focus();
  if (boot.isRunning()) boot.skip();
});

// The graph page runs in a frame; it asks to be closed when ESC has nothing left to clear.
window.addEventListener('message', e => {
  if (e.origin !== location.origin || e.data !== 'graph:close') return;
  panels.close('graph');
  if (panels.top() === 'terminal') terminal.focus();
});

const terminal = initTerminal({ panels });
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
