// PANEL SYSTEM
// One API for every full-screen overlay. A scene creates one panel system and
// passes its own hooks, so the engine knows nothing about rooms, boards or boots.
//
// A panel is an element with id "panel-<id>" and the .panel class.
//
// Panels stack. A scene can keep a base panel open (the desk keeps its OS desktop)
// and open apps on top of it; closing an app leaves the base panel showing. The system
// remembers nothing between opens, so there is no "return to" state that can go stale.
//
// Stacking rule: base panels always sit under every app, and each app opens above the one
// opened before it (a terminal launches an app, the app covers the terminal). This is set
// here with inline z-index, not by DOM order or per-panel CSS, so no panel can hide behind
// another because of where it sits in the page.
//
// Gotcha: .panel { position: fixed } is the base rule. Adding position:relative to a
// panel-specific CSS class overrides it at equal specificity, and the panel turns
// invisible because body { overflow: hidden }.

export function createPanelSystem({
  ids,                              // panel ids, e.g. ['os', 'ledger', ...]
  base = [],                        // ids that stay under every app (the desk's OS desktop)
  displayFor = () => 'block',       // CSS display value used when a panel opens
  onChange = () => {},              // (activeIds) runs after a panel opens or closes
  onAfterOpen = () => {},           // (id) runs right after a panel starts opening
  switchDelay = 340,                // ms between closing one panel and opening the next
}) {
  const el = id => document.getElementById('panel-' + id);
  const isActive = id => !!el(id)?.classList.contains('active');
  // ids of the open panels, counting `pending` (a panel that is opening this frame)
  const active = pending => ids.filter(id => id === pending || isActive(id));
  const apps = () => ids.filter(id => !base.includes(id) && isActive(id));

  // Layers: base panels at 700, apps from 800 upward. The counter resets once no app is open.
  // Everything else on the page (boot screen, overlays) sits above 900.
  let depth = 0;
  const layer = id => (base.includes(id) ? 700 : 800 + ++depth);

  function open(id) {
    const node = el(id);
    if (!node) return;
    node.style.zIndex = layer(id);
    node.style.display = displayFor(id);
    onChange(active(id));
    requestAnimationFrame(() => node.classList.add('active'));
    onAfterOpen(id);
  }

  function hide(id) {
    const node = el(id);
    if (!node) return;
    node.classList.remove('active');
    node.style.display = 'none';
    if (!apps().length) depth = 0;
  }

  function close(id) {
    hide(id);
    onChange(active());
  }

  // Close one panel and open another after a short pause. Panels underneath stay open.
  function switchTo(fromId, toId) {
    if (!el(toId)) return;
    hide(fromId);
    setTimeout(() => open(toId), switchDelay);
  }

  // Close every open panel except the listed ones (used by ESC).
  function closeAll({ except = [] } = {}) {
    ids.forEach(id => { if (!except.includes(id) && isActive(id)) hide(id); });
    onChange(active());
  }

  // Close only the app on top (used by ESC, so a terminal under an app stays open).
  function closeTop() {
    const id = top();
    if (id) hide(id);
    onChange(active());
  }

  // Id of the app on top, or undefined when only base panels are open.
  const top = () => apps().sort((a, b) => el(b).style.zIndex - el(a).style.zIndex)[0];

  return { open, close, switchTo, closeAll, closeTop, top };
}
