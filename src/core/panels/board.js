// THE BOARD panel: connection strings, the note detail overlay
// and optional embeds inside that overlay.
//
// To add a connection: add the key pair to `connections` (list each pair once; both
// directions are deduplicated). Then add a matching #bn-<key> note inside #bigBoard.
//
// DOM contract: #bigBoard, #bigStrings, #bn-<key>, #noteDetail, #ndMeta, #ndTitle,
// #ndBody and #ndEmbed inside #noteDetail.

import { drawStrings } from '../engine/strings.js';
import { videoFacade } from '../video.js';

export function createBoard({ connections, noteDetails, embeds = {} }) {
  // connections  { key: [keys it links to] }
  // noteDetails  { key: { meta, title, body } }
  // embeds       { key: { type: 'beehiiv', formId } | { type: 'youtube', id, title } }
  //              shown in that note's overlay
  const $ = id => document.getElementById(id);
  const mounted = {};

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
    $('ndMeta').textContent = d.meta;
    $('ndTitle').textContent = d.title;
    $('ndBody').textContent = d.body;
    $('noteDetail').classList.add('active');
    highlight(key);
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

  return { drawBig, openNote, closeNote, isNoteOpen };
}
