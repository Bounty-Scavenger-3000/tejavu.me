// Trims graphify's output to the JS source files and writes the snapshot the /graph/ page draws.
// Refresh: graphify extract . --code-only && npm run graph
import { readFileSync, writeFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync('graphify-out/graph.json', 'utf8'));
const area = f =>
  f.startsWith('src/core/engine') ? 'engine' :
  f.startsWith('src/core/') ? 'panels' :
  f.startsWith('src/scenes/') ? 'desk' :
  f.startsWith('src/content/') ? 'content' :
  f.startsWith('src/root/') ? 'root' : 'logo';
const kind = { contains: 0, declares: 0, calls: 1, indirect_call: 1, imports: 2, imports_from: 2 };

const nodes = raw.nodes.filter(n => n.file_type === 'code' && n.source_file?.startsWith('src/'));
const index = new Map(nodes.map((n, i) => [n.id, i]));
const seen = new Set();
const links = [];
for (const e of raw.links) {
  const s = index.get(e.source), t = index.get(e.target);
  if (s === undefined || t === undefined || s === t || !(e.relation in kind)) continue;
  const key = `${Math.min(s, t)}-${Math.max(s, t)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  links.push([s, t, kind[e.relation]]);
}

const out = {
  nodes: nodes.map(n => ({
    n: n.label, f: n.source_file, l: n.source_location || '', a: area(n.source_file),
    k: n.label.endsWith('.js') ? 'file' : 'fn',
  })),
  links,
};
writeFileSync('src/graph/graph-data.json', JSON.stringify(out));
console.log(`${out.nodes.length} nodes, ${links.length} links`);
