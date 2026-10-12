// Keeps a clock element in sync, formatted HH:MM (24h). Used by the in-scene monitor
// [SEC-03-E07] and the OS desktop taskbar [SEC-13]. Polls once a minute.

export function startClock(elementId, intervalMs = 60000) {
  const tick = () => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const now = new Date();
    el.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  };
  tick();
  setInterval(tick, intervalMs);
}
