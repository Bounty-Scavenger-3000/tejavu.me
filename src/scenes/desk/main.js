// THE DESK scene (tejavu.me/desk): the entry point that wires core to this scene.
//
// Core (src/core) holds the engine and the panels. This file supplies what is specific
// to the desk: the room, the monitor, which panels exist and what happens around them.
// A new scene follows the same shape: build its environment, create the panel system
// with its own hooks, and import only the panels it uses.

import { createPanelSystem } from '../../core/engine/panel-system.js';
import { createBoot } from '../../core/engine/boot.js';
import { startClock } from '../../core/engine/clock.js';
import { createBoard } from '../../core/panels/board.js';
import { createTimeline } from '../../core/panels/timeline.js';
import { initContact } from '../../core/panels/contact.js';
import { initBoardPreview } from './board-preview.js';
import { boot as bootContent, noteDetails } from '../../content/desk.js';
import { panelIds, connections, embeds, timelineNodes } from './data.js';

const $ = id => document.getElementById(id);

// [SEC-12] board panel
const board = createBoard({ connections, noteDetails, embeds });

// [SEC-00] boot. `panels` is declared below and only used when events fire.
const boot = createBoot({
  messages: bootContent.messages,
  phrases: bootContent.phrases,
  text: bootContent,
  onFinish() {
    $('monIdle').style.display = 'none';
    $('monOS').style.display = 'block';
    // the room stays visible: the desktop panel is position:fixed and covers it
    const desktop = $('panel-desktop');
    desktop.style.display = 'flex';
    requestAnimationFrame(() => desktop.classList.add('active'));
  },
  onAlreadyBooted: () => panels.open('desktop'),
});

// [COMP-01] panels, with the desk's hooks
const panels = createPanelSystem({
  ids: panelIds,
  displayFor: id => (id === 'desktop' ? 'flex' : 'block'),
  canReturn: () => boot.isBooted(),
  // the desktop panel is position:fixed, so the room only hides behind the other panels
  onBeforeOpen: id => { if (id !== 'desktop') $('room').style.opacity = '0'; },
  onAfterOpen: id => { if (id === 'board') setTimeout(() => board.drawBig(null), 350); },
  onAllClosed: id => { if (id !== 'desktop') $('room').style.opacity = '1'; },
});

// [SEC-14] timeline
const timeline = createTimeline({ nodes: timelineNodes, panels, openNote: board.openNote });

// ESC closes the note overlay first, then open panels, then skips a running boot.
// The desktop is the "home" panel: ESC never closes it directly.
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (board.isNoteOpen()) { board.closeNote(); return; }
  panels.closeAll({ except: ['desktop'] });
  if (boot.isRunning()) boot.skip();
});

initContact();            // [SEC-11-E01]
initBoardPreview();       // [SEC-04-E01]
startClock('osTime');     // [SEC-03-E07] clock on the in-scene monitor
startClock('desktopClock'); // [SEC-13] taskbar clock

// The markup still uses inline onclick handlers, so these stay global for now.
// Moving them to data attributes with delegated listeners is the next step.
Object.assign(window, {
  openPanel: panels.open,
  closePanel: panels.close,
  switchPanel: panels.switchTo,
  bootSequence: boot.start,
  skipBoot: boot.skip,
  openNoteDetail: board.openNote,
  closeNoteDetail: board.closeNote,
  treeNodeClick: timeline,
});
