// Desk scene configuration: which panels exist, what the terminal opens, and where timeline nodes lead.
// Text lives in src/content/desk.js. Behaviour lives in src/core.

// Panel ids; the elements are #panel-<id> in desk/index.html.
export const panelIds = ['os', 'ledger', 'audit', 'dossier', 'contact', 'board', 'desktop', 'git', 'youtube', 'terminal', 'graph'];

// Panels that stay under every app (see core/engine/panel-system.js).
export const basePanels = ['desktop'];

// What the terminal can open: command word -> panel id, and the files `ls` lists.
// The hidden wiring graph is not listed here; see terminal.js.
export const terminalApps = {
  projects: 'os', skills: 'ledger', history: 'audit', about: 'dossier',
  contact: 'contact', timeline: 'git', videos: 'youtube', board: 'board',
};
export const terminalFiles = {
  'contact.mail': 'contact', 'projects.jira': 'os', 'timeline.git': 'git', 'youtube.mp4': 'youtube',
};

// Notes that show an embed in their overlay. The newsletter uses the same Beehiiv form as the root site.
export const embeds = {
  humshakals: { type: 'youtube', id: 'm_hjexjJEwg', title: 'Humshakals, Prachaara 2.0' },
  newsletter: { type: 'beehiiv', formId: '067f8e7e-6d96-43e1-a3df-c6b051fdd734' },
};

// Where each timeline node leads. `note` also opens that board note.
export const timelineNodes = {
  // 2023
  'node-bcom':          { to: 'ledger' },
  'node-broseph-start': { to: 'audit' },
  // 2024
  'node-retention':     { to: 'os' },
  'node-prachaara':     { to: 'board', note: 'prachaara' },
  // 2025
  'node-thakurs':       { to: 'os' },
  'node-venture':       { to: 'os' },
  'node-crescere':      { to: 'board', note: 'crescere' },
  'node-history':       { to: 'audit' },
  'node-civic':         { to: 'board', note: 'civic' },
  'node-rti':           { to: 'os' },
  // 2026
  'node-humshakals':    { to: 'board', note: 'humshakals' },
  'node-bcom-grad':     { to: 'ledger' },
};
