// The desk's terminal commands. Strings live in src/content/desk.js, targets in data.js.
// The wiring graph is a hidden command: help never lists it, ls -a reveals the file,
// and tree, graph and open .wiring all reach it.

import { createTerminal } from '../../core/panels/terminal.js';
import { terminal as text } from '../../content/desk.js';
import { terminalApps, terminalFiles } from './data.js';

export function initTerminal({ panels }) {
  const launch = (id, name, io) => { io.print(`opening ${name}...`, 'term-dim'); panels.open(id); };
  const wiring = (_, io) => { io.print(text.wiring, 'term-dim'); panels.open('graph'); };

  const commands = {
    help: (_, io) => text.help.forEach(l => io.print(l)),
    ls: ([flag], io) => {
      const names = Object.keys(terminalFiles);
      io.print((flag?.includes('a') ? ['.', '..', '.wiring', ...names] : names).join('  '));
    },
    open: ([name = ''], io) => {
      const n = name.toLowerCase();
      if (n === '.wiring') { wiring(null, io); return; }
      const id = terminalFiles[n] ?? terminalApps[n];
      if (id) launch(id, n, io);
      else io.print(n ? `no such file: ${name}` : 'usage: open NAME', 'term-err');
    },
    clear: (_, io) => io.clear(),
    exit: () => panels.close('terminal'),
    whoami: (_, io) => io.print(text.whoami),
    pwd: (_, io) => io.print('/home/guest'),
    date: (_, io) => io.print(new Date().toString()),
    echo: (args, io) => io.print(args.join(' ')),
    sudo: (_, io) => io.print(text.sudo),
    rm: (_, io) => io.print(text.rm),
    _wiring: wiring,
  };
  for (const [word, id] of Object.entries(terminalApps)) commands[word] = (_, io) => launch(id, word, io);

  return createTerminal({
    commands,
    prompt: text.prompt,
    banner: text.banner,
    aliases: { tree: '_wiring', graph: '_wiring', './.wiring': '_wiring' },
  });
}
