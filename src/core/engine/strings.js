// Draws SVG "strings" (straight lines) between pairs of elements.
// Positions come from getBoundingClientRect() after layout, so they are always accurate.
// Used by the expanded board and the scene board preview.

export function drawStrings({ svg, container, pairs, style }) {
  // svg        the <svg> to draw into (cleared first)
  // container  element whose top-left is the svg origin
  // pairs      [[idA, idB], ...] element ids to connect
  // style      (idA, idB) => { stroke, width, dash }
  if (!svg) return;
  svg.innerHTML = '';
  if (!container) return;
  const br = container.getBoundingClientRect();
  pairs.forEach(([a, b]) => {
    const na = document.getElementById(a);
    const nb = document.getElementById(b);
    if (!na || !nb) return;
    const ra = na.getBoundingClientRect();
    const rb = nb.getBoundingClientRect();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', ra.left - br.left + ra.width / 2);
    line.setAttribute('y1', ra.top - br.top + ra.height / 2);
    line.setAttribute('x2', rb.left - br.left + rb.width / 2);
    line.setAttribute('y2', rb.top - br.top + rb.height / 2);
    const s = style(a, b);
    line.setAttribute('stroke', s.stroke);
    line.setAttribute('stroke-width', s.width);
    line.setAttribute('stroke-dasharray', s.dash);
    svg.appendChild(line);
  });
}
