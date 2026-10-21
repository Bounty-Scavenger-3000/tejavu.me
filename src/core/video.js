// YouTube facade: shows the video's thumbnail with a play button and loads the real
// player on click, so a page with several videos does not load several players up front.
// Styles: core/styles/video.css.

export function videoFacade(id, title) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'yt-facade';
  button.setAttribute('aria-label', 'Play: ' + title);
  button.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
  button.innerHTML = '<span class="yt-play" aria-hidden="true"></span>';
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    frame.title = title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    button.replaceWith(frame);
  });
  return button;
}

// Fills every <div data-yt="VIDEO_ID" data-title="..."> under root with a facade.
export function mountVideos(root = document) {
  root.querySelectorAll('[data-yt]').forEach(box => {
    box.replaceChildren(videoFacade(box.dataset.yt, box.dataset.title || 'YouTube video'));
  });
}
