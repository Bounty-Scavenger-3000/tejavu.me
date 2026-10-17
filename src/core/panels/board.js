// THE BOARD panel: connection strings, the note detail overlay
// and optional embeds inside that overlay.
//
// To add a connection: add the key pair to `connections` (list each pair once; both
// directions are deduplicated). Then add a matching #bn-<key> note inside #bigBoard.
//
// DOM contract: #bigBoard, #bigStrings, #bn-<key>, #noteDetail, #ndMeta, #ndTitle,
// #ndBody, #ndEmbed and .nd-media inside #noteDetail.

import { drawStrings } from '../engine/strings.js';

export function createBoard({ connections, noteDetails, embeds = {} }) {
  // connections  { key: [keys it links to] }
  // noteDetails  { key: { meta, title, body } }
  // embeds       { key: { type: 'beehiiv', formId } } shown in that note's overlay
  const $ = id => document.getElementById(id);
  const embedLoaded = {};

  function bigPairs() {
    const drawn = new Set();
    const pairs = [];
    Object.entries(connections).forEach(([a, targets]) => {
      targets.forEach(b => {
        const key = [a, b].sort().join('|');
        if (drawn.has(key)) return;
        drawn.add(key);
        pairs.push(['bn-' + a, 'bn-' + b]);
      });
    });
    return pairs;
  }

  function drawBig(highlighted) {
    const hl = highlighted ? 'bn-' + highlighted : null;
    drawStrings({
      svg: $('bigStrings'),
      container: $('bigBoard'),
      pairs: bigPairs(),
      style: (a, b) => {
        const isHl = hl && (a === hl || b === hl);
        return {
          stroke: isHl ? '#ff3333' : 'rgba(180,60,60,.35)',
          width: isHl ? '2' : '1',
          dash: isHl ? '0' : '4 3',
        };
      },
    });
  }

  function highlight(id) {
    drawBig(id);
    const el = $('bn-' + id);
    if (el) {
      el.style.transition = 'transform .2s';
      el.style.transform = 'scale(1.05)';
      setTimeout(() => { el.style.transform = ''; }, 400);
    }
  }

  function mountBeehiiv(box, formId) {
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

  // Shows the embed for notes that have one and hides the photo slot.
  // Third-party scripts load once, the first time that note opens.
  function showEmbed(key) {
    const box = $('ndEmbed');
    const media = document.querySelector('#noteDetail .nd-media');
    const embed = embeds[key];
    box.style.display = embed ? 'block' : 'none';
    media.style.display = embed ? 'none' : '';
    if (embed && !embedLoaded[key]) {
      embedLoaded[key] = true;
      if (embed.type === 'beehiiv') mountBeehiiv(box, embed.formId);
    }
  }

  function openNote(key) {
    const d = noteDetails[key];
    if (!d) return;
    $('ndMeta').textContent = d.meta;
    $('ndTitle').textContent = d.title;
    $('ndBody').textContent = d.body;
    $('noteDetail').classList.add('active');
    highlight(key);
    showEmbed(key);
  }

  function closeNote() {
    $('noteDetail').classList.remove('active');
  }

  function isNoteOpen() {
    const nd = $('noteDetail');
    return !!(nd && nd.classList.contains('active'));
  }

  return { drawBig, openNote, closeNote, isNoteOpen };
}
