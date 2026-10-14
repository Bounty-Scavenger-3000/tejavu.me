// Delegated click handling for data-* attributes, in place of inline onclick handlers.
//
// handlers maps an attribute name to a function: { open: (value, el) => ... } runs for
// clicks on [data-open="..."]. The innermost element carrying a handled attribute wins
// and its ancestors are skipped, which is what the old inline stopPropagation() did.
// An element that also has data-key reacts to Enter the same way as a click.

export function bindActions(handlers) {
  const names = Object.keys(handlers);
  const sel = names.map(n => `[data-${n}]`).join(',');
  const run = el => {
    for (const n of names) if (el.hasAttribute(`data-${n}`)) handlers[n](el.getAttribute(`data-${n}`), el);
  };
  document.addEventListener('click', e => {
    const el = e.target.closest?.(sel);
    if (el) run(el);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const el = e.target.closest?.('[data-key]');
    if (el?.matches(sel)) run(el);
  });
}
