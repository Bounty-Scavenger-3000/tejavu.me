// THE BOARD panel: top-level notes that open into the notes branching off them, plus the
// note detail overlay and optional embeds inside that overlay.
//
// The tree comes from src/content/board.js. Click a note that has sub-notes: the others fall
// away, the note moves to the top, and red string branches out to its sub-notes, which pop
// onto the board. A note without sub-notes opens its detail card straight away.
//
// DOM contract: #bigBoard (the cork), #bigStrings (the branch layer inside it), #noteDetail,
// #ndMeta, #ndTitle, #ndBody and #ndEmbed inside #noteDetail.

import { videoFacade } from '../video.js';

const PINS = { // pin colour, pin highlight
  yellow: ['#cc2200', '#ff6666'], orange: ['#aa4400', '#f78166'], blue: ['#1a3a8a', '#58a6ff'],
  pink: ['#6a1a8a', '#c070ff'], green: ['#1a6a2a', '#3fb950'], white: ['#aa8800', '#ffcc00'],
};
const TILT = [-1.5, 1, -0.6, 1.6, -1, 0.7]; // degrees, so the notes sit a little crooked
const wait = (fn, ms) => setTimeout(fn, ms);

export function createBoard({ board, noteDetails, embeds = {} }) {
  // board        { back, categories: [{ key, title, sub, color, notes?: [...] }] }
  // noteDetails  { key: { meta, title, body } }
  // embeds       { key: { type: 'beehiiv', formId } | { type: 'youtube', id, title } }
  //              shown in that note's overlay
  const $ = id => document.getElementById(id);
  const cork = $('bigBoard');
  const svg = $('bigStrings');
  const mounted = {};
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let open = null;   // the expanded category, or null while the top level shows
  let busy = false;  // true while the other notes fall away

  const h = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  };

  function noteEl(n, i, cls) {
    const el = h('button', 'bb-note ' + cls);
    el.type = 'button';
    el.id = 'bn-' + n.key;
    el.dataset.bk = n.key;
    el.style.setProperty('--rot', TILT[i % TILT.length] + 'deg');
    el.style.setProperty('--i', i);
    const pin = h('div', 'pushpin');
    pin.style.setProperty('--pin-c', PINS[n.color][0]);
    pin.style.setProperty('--pin-hi', PINS[n.color][1]);
    const card = h('div', 'nc ' + n.color);
    card.append(h('div', 'nc-title', n.title), h('div', 'nc-sub', n.sub));
    if (n.notes) card.append(h('div', 'nc-count', `${n.notes.length} notes`));
    el.append(pin, card);
    return el;
  }

  function renderTop() {
    open = null;
    cork.classList.remove('bb-open', 'bb-leaving');
    const stage = h('div', 'bb-stage bb-top');
    board.categories.forEach((c, i) => stage.append(noteEl(c, i, 'bb-cat')));
    cork.replaceChildren(svg, stage);
    svg.replaceChildren();
  }

  function renderOpen(cat) {
    open = cat;
    cork.classList.remove('bb-leaving');
    cork.classList.add('bb-open');
    const back = h('button', 'bb-back', board.back);
    back.type = 'button';
    back.dataset.bk = '';
    const kids = h('div', 'bb-kids');
    cat.notes.forEach((n, i) => kids.append(noteEl(n, i, 'bb-kid')));
    const stage = h('div', 'bb-stage');
    stage.append(noteEl(cat, 0, 'bb-root'), kids);
    cork.replaceChildren(svg, back, stage);
  }

  // One curved string from the root note down to each sub-note, drawn with a dash animation.
  // Positions use offsetLeft/offsetTop, which animations and tilts do not change.
  function drawBranches(animate) {
    svg.replaceChildren();
    if (!open || !cork.offsetWidth) return;
    const root = $('bn-' + open.key);
    const x1 = root.offsetLeft + root.offsetWidth / 2, y1 = root.offsetTop + root.offsetHeight - 4;
    open.notes.forEach((n, i) => {
      const k = $('bn-' + n.key);
      const x2 = k.offsetLeft + k.offsetWidth / 2, y2 = k.offsetTop + 4, dy = (y2 - y1) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x1} ${y1} C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`);
      path.setAttribute('class', 'bb-branch');
      path.style.setProperty('--i', i);
      svg.append(path);
      path.style.setProperty('--len', Math.ceil(path.getTotalLength()));
      if (!animate) { path.style.animation = 'none'; path.style.strokeDashoffset = '0'; }
    });
  }

  // `instant` skips every animation (used when a note elsewhere asks for one of these notes).
  function expand(cat, instant) {
    if (busy || open === cat) return;
    if (!cat.notes) { openNote(cat.key); return; }
    const chosen = $('bn-' + cat.key);
    const from = chosen && chosen.getBoundingClientRect();
    const plain = instant || still() || !from;
    cork.classList.toggle('bb-instant', plain);
    const finish = () => {
      busy = false;
      renderOpen(cat);
      if (!plain) {
        const to = $('bn-' + cat.key).getBoundingClientRect();
        $('bn-' + cat.key).animate(
          [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }],
          { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
      drawBranches(!plain);
    };
    if (plain) { finish(); return; }
    busy = true;
    chosen.classList.add('bb-chosen');
    cork.classList.add('bb-leaving');
    wait(finish, 220);
  }

  function collapse(instant) {
    cork.classList.toggle('bb-instant', !!instant || still());
    renderTop();
  }

  // Goes up one level. Returns true if it did, false if the board was already at the top.
  function back() {
    if (!open) return false;
    collapse();
    return true;
  }

  cork.addEventListener('click', e => {
    const el = e.target.closest('[data-bk]');
    if (!el) return;
    const key = el.dataset.bk;
    if (!key || (open && key === open.key)) { collapse(); return; }
    const cat = board.categories.find(c => c.key === key);
    if (cat) expand(cat); else openNote(key);
  });
  window.addEventListener('resize', () => drawBranches(false));

  // The Beehiiv form is third-party and privacy extensions block it. The note sits behind
  // the form (see .beehiiv-box in panels.css) and only shows if the form never loads.
  function mountBeehiiv(slot, formId) {
    slot.className = 'beehiiv-box';
    slot.innerHTML = '<p class="beehiiv-note">Can\u2019t see the subscribe box? A blocker (DuckDuckGo, uBlock and similar) is probably stopping it. Turn it off for this site and reload.</p><div class="beehiiv-form"></div>';
    const box = slot.querySelector('.beehiiv-form');
    const form = document.createElement('script');
    form.async = true;
    form.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
    form.setAttribute('data-beehiiv-form', formId);
    const attr = document.createElement('script');
    attr.async = true;
    attr.src = 'https://subscribe-forms.beehiiv.com/attribution.js';
    box.appendChild(form);
    box.appendChild(attr);
  }

  // Shows the embed for notes that have one. Each embed mounts once, into its own slot, the
  // first time its note opens; opening another note hides the slot instead of removing it.
  function showEmbed(key) {
    const box = $('ndEmbed');
    const embed = embeds[key];
    box.style.display = embed ? 'block' : 'none';
    Object.values(mounted).forEach(slot => { slot.hidden = true; });
    if (!embed) return;
    if (!mounted[key]) {
      const slot = document.createElement('div');
      box.appendChild(slot);
      mounted[key] = slot;
      if (embed.type === 'beehiiv') mountBeehiiv(slot, embed.formId);
      if (embed.type === 'youtube') slot.replaceChildren(videoFacade(embed.id, embed.title));
    }
    mounted[key].hidden = false;
  }

  // A playing video must stop when its note closes: swap the player back to the thumbnail.
  function resetVideos() {
    Object.entries(mounted).forEach(([key, slot]) => {
      const embed = embeds[key];
      if (embed.type === 'youtube' && slot.querySelector('iframe')) {
        slot.replaceChildren(videoFacade(embed.id, embed.title));
      }
    });
  }

  function openNote(key) {
    const d = noteDetails[key];
    if (!d) return;
    const parent = board.categories.find(c => c.notes?.some(n => n.key === key));
    if (parent && open !== parent) { busy = false; expand(parent, true); }
    $('ndMeta').textContent = d.meta;
    $('ndTitle').textContent = d.title;
    $('ndBody').textContent = d.body;
    $('noteDetail').classList.add('active');
    showEmbed(key);
  }

  function closeNote() {
    $('noteDetail').classList.remove('active');
    resetVideos();
  }

  function isNoteOpen() {
    const nd = $('noteDetail');
    return !!(nd && nd.classList.contains('active'));
  }

  renderTop();
  return {
    openNote, closeNote, isNoteOpen, back,
    reset: () => collapse(true),
    relayout: () => drawBranches(false),
  };
}
