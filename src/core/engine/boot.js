// BOOT ENGINE
// Terminal-text BIOS simulation. The scene decides what happens when boot ends
// (onFinish) and what a click on an already-booted machine does (onAlreadyBooted).
//
// Message colour classes (m.c):
//   ''   green (default)    'd'  dim green    'am'  amber    'er'  red
//
// Note: start() has no re-entry guard, so clicking the monitor mid-boot restarts
// the sequence. This is intended.

export function createBoot({
  messages,            // [{ t: text, c: colour class }]
  phrases,             // status labels, cycled while the lines type out
  text,                // { done: 'Boot complete.', donePct: '100%' }
  onFinish,            // () runs once boot completes or is skipped
  onAlreadyBooted,     // () runs when start() is called after a finished boot
  ids = {
    screen: 'boot-screen', lines: 'bootLines', bar: 'bootBar',
    statusL: 'bootStatusL', statusR: 'bootStatusR',
  },
}) {
  let booted = false;
  const $ = id => document.getElementById(id);

  function finish() {
    booted = true;
    onFinish();
  }

  function skip() {
    const bs = $(ids.screen);
    const bar = $(ids.bar);
    const statusL = $(ids.statusL);
    const statusR = $(ids.statusR);
    if (bar) bar.style.width = '100%';
    if (statusL) statusL.textContent = text.done;
    if (statusR) statusR.textContent = text.donePct;
    if (bs) bs.classList.remove('active');
    finish();
  }

  function start() {
    if (booted) { onAlreadyBooted(); return; }
    const bs = $(ids.screen);
    const lines = $(ids.lines);
    const bar = $(ids.bar);
    lines.innerHTML = '';
    bar.style.width = '0%';
    bs.classList.add('active');
    // the scene stays visible: the boot screen is position:fixed and covers it

    const statusL = $(ids.statusL);
    const statusR = $(ids.statusR);

    let i = 0;
    function next() {
      if (i >= messages.length) {
        if (statusL) statusL.textContent = text.done;
        if (statusR) statusR.textContent = text.donePct;
        setTimeout(() => { bs.classList.remove('active'); finish(); }, 700);
        return;
      }
      const m = messages[i];
      const d = document.createElement('div');
      d.className = 'boot-line' + (m.c ? ' ' + m.c : '');
      d.textContent = m.t || '\u00A0';
      lines.appendChild(d);
      requestAnimationFrame(() => d.classList.add('show'));
      lines.scrollTop = lines.scrollHeight;
      const pct = Math.round((i + 1) / messages.length * 100);
      bar.style.width = pct + '%';
      if (statusL) statusL.textContent = phrases[Math.floor(i / messages.length * phrases.length)] || 'Loading...';
      if (statusR) statusR.textContent = pct + '%';
      i++;
      setTimeout(next, m.t === '' ? 60 : 110 + Math.random() * 70);
    }
    next();
  }

  const isRunning = () => {
    const bs = $(ids.screen);
    return !!(bs && bs.classList.contains('active'));
  };

  return { start, skip, isBooted: () => booted, isRunning };
}
