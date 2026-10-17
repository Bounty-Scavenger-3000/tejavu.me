// PANEL SYSTEM
// One API for every full-screen overlay. A scene creates one panel system and
// passes its own hooks, so the engine knows nothing about rooms, boards or boots.
//
// A panel is an element with id "panel-<id>" and the .panel class.
//
// Gotcha: .panel { position: fixed } is the base rule. Adding position:relative to a
// panel-specific CSS class overrides it at equal specificity, and the panel turns
// invisible because body { overflow: hidden }.
//
// `prev` is the panel a switch came from. When the last open panel closes and
// canReturn() allows it, that panel opens again; this is how Projects, Timeline
// and the rest hand control back to the OS desktop. Re-test every panel path before
// simplifying the return logic.

export function createPanelSystem({
  ids,                              // panel ids, e.g. ['os', 'ledger', ...]
  displayFor = () => 'block',       // CSS display value used when a panel opens
  canReturn = () => false,          // may a closing panel hand control back to `prev`?
  onBeforeOpen = () => {},          // (id) runs before the panel is shown
  onAfterOpen = () => {},           // (id) runs right after the panel starts opening
  onAllClosed = () => {},           // (id) runs when the last open panel closes
  switchDelay = 340,                // ms between closing one panel and opening the next
}) {
  let prev = null;
  const el = id => document.getElementById('panel-' + id);

  function open(id) {
    const node = el(id);
    if (!node) return;
    // Reset stale prev state from an earlier switch. switchTo() sets prev before its
    // timeout fires, so this only clears it for direct open() calls.
    if (!prev || prev === id) prev = null;
    onBeforeOpen(id);
    node.style.display = displayFor(id);
    requestAnimationFrame(() => node.classList.add('active'));
    onAfterOpen(id);
  }

  function close(id) {
    const node = el(id);
    if (!node) return;
    node.classList.remove('active');
    node.style.display = 'none';
    const anyOpen = ids.some(p => {
      const pe = el(p);
      return pe && pe.classList.contains('active');
    });
    if (!anyOpen) {
      if (prev && canReturn()) {
        if (el(prev)) { const back = prev; open(back); prev = null; return; }
      }
      prev = null;
      onAllClosed(id);
    }
  }

  function switchTo(fromId, toId) {
    prev = fromId;
    close(fromId);
    setTimeout(() => open(toId), switchDelay);
  }

  // Close every active panel except the listed ones (used by ESC).
  function closeAll({ except = [] } = {}) {
    ids.forEach(id => {
      if (except.includes(id)) return;
      const node = el(id);
      if (node && node.classList.contains('active')) close(id);
    });
  }

  return { open, close, switchTo, closeAll };
}
