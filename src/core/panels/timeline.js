// [SEC-14] GIT TIMELINE panel: what a click on a commit node does.
//
// `nodes` maps a node id to a target: { to: 'panel-id' } opens that panel, and
// { to: 'board', note: 'key' } also opens a note on it. Nodes with no entry do
// nothing. Extend the map as content is added.

export function createTimeline({ nodes, panels, openNote, from = 'git', noteDelay = 400 }) {
  return function click(id) {
    const n = nodes[id];
    if (!n) return;
    panels.switchTo(from, n.to);
    if (n.note) setTimeout(() => openNote(n.note), noteDelay);
  };
}
