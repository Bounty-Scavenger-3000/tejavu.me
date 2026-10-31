// TERMINAL panel: a small fake shell. The scene supplies the commands; this file handles
// typing, history, tab completion and printing.
//
// commands  { name: (args, io) => void }; io is { print(text, cls?), clear() }.
// aliases   { typed word: command name }. A command whose name starts with "_" never
//           completes on Tab, so it is reachable only through its aliases.
// DOM contract: #panel-terminal (scroll container), #termOut (printed lines), #termPrompt
// (the prompt label) and #termIn (input).

export function createTerminal({ commands, prompt, banner = [], aliases = {} }) {
  const $ = id => document.getElementById(id);
  const panel = $('panel-terminal');
  const out = $('termOut');
  const input = $('termIn');
  $('termPrompt').textContent = prompt;
  const history = [];
  let at = 0;
  let greeted = false;

  const print = (text = '', cls = '') => {
    const row = document.createElement('div');
    row.className = 'term-line' + (cls ? ' ' + cls : '');
    row.textContent = text || '\u00A0';
    out.append(row);
    panel.scrollTop = panel.scrollHeight;
  };
  const io = { print, clear: () => out.replaceChildren() };

  function run(line) {
    print(`${prompt} ${line}`, 'term-cmd');
    const [word = '', ...args] = line.trim().split(/\s+/);
    if (!word) return;
    const name = (aliases[word.toLowerCase()] ?? word).toLowerCase();
    const fn = commands[name];
    if (fn) fn(args, io);
    else print(`command not found: ${word}. Type help.`, 'term-err');
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const line = input.value;
      input.value = '';
      if (line.trim()) { history.push(line); at = history.length; }
      run(line);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      at = Math.max(0, Math.min(history.length, at + (e.key === 'ArrowUp' ? -1 : 1)));
      input.value = history[at] ?? '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const hits = Object.keys(commands).filter(c => !c.startsWith('_') && c.startsWith(input.value.toLowerCase()));
      if (input.value && hits.length === 1) input.value = hits[0] + ' ';
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      io.clear();
    }
  });

  // A click anywhere in the terminal focuses the input, unless the visitor is selecting text.
  panel.addEventListener('click', () => { if (!getSelection().toString()) input.focus(); });

  return {
    // Call when the panel opens: prints the banner once, then focuses the input.
    focus() {
      if (!greeted) { greeted = true; banner.forEach(l => print(l, 'term-dim')); }
      input.focus();
    },
  };
}
