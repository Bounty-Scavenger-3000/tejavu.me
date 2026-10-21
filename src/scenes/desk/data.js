// Desk scene configuration: which panels exist and how the board and timeline connect.
// Text lives in src/content/desk.js. Behaviour lives in src/core.

// Panel ids; the elements are #panel-<id> in desk/index.html.
export const panelIds = ['os', 'ledger', 'audit', 'dossier', 'contact', 'board', 'desktop', 'git', 'youtube'];

// Strings between board notes. List each pair once; both directions are deduplicated.
export const connections = {
  humshakals: ['dean', 'verdict', 'record'],
  dean:       ['humshakals'],
  verdict:    ['humshakals', 'prachaara'],
  prachaara:  ['verdict', 'record'],
  crescere:   ['record'],
  civic:      ['broseph'],
  potluck:    ['broseph', 'civic'],
  record:     ['humshakals', 'prachaara', 'crescere', 'broseph'],
  broseph:    ['civic', 'record'],
  newsletter: ['broseph'],
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
