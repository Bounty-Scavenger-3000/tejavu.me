// YOUTUBE panel: renders the video list as cards with click-to-load players.
// Players are swapped back to thumbnails whenever the panel closes (reset), so a video
// never keeps playing behind a closed panel.

import { videoFacade } from '../video.js';

export function initVideos({ videos, channel, gridId = 'ytGrid', channelId = 'ytChannel' }) {
  const grid = document.getElementById(gridId);
  const link = document.getElementById(channelId);
  if (link) link.href = channel;
  const cards = [];

  if (grid) {
    videos.forEach(v => {
      const card = document.createElement('article');
      card.className = 'yt-card';
      card.innerHTML = '<div class="yt-media"></div><div class="yt-caption"></div><div class="yt-meta"></div><p class="yt-body"></p>';
      card.querySelector('.yt-caption').textContent = v.title;
      card.querySelector('.yt-meta').textContent = v.meta;
      card.querySelector('.yt-body').textContent = v.body;
      const media = card.querySelector('.yt-media');
      media.append(videoFacade(v.id, v.title));
      cards.push({ media, v });
      grid.append(card);
    });
  }

  function reset() {
    cards.forEach(({ media, v }) => {
      if (media.querySelector('iframe')) media.replaceChildren(videoFacade(v.id, v.title));
    });
  }

  return { reset };
}
