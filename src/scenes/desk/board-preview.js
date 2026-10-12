// [SEC-04-E01] Scene board preview: the small corkboard on the desk wall, drawn as
// simplified hub-and-spoke strings (everything links back to the 0-for-3 note).

import { drawStrings } from '../../core/engine/strings.js';

const sceneConnections = [
  ['sn-humshakals', 'sn-dean'],
  ['sn-humshakals', 'sn-record'],
  ['sn-prachaara',  'sn-record'],
  ['sn-crescere',   'sn-record'],
  ['sn-civic',      'sn-record'],
  ['sn-newsletter', 'sn-record'],
];

export function initBoardPreview() {
  function draw() {
    drawStrings({
      svg: document.getElementById('sceneStrings'),
      container: document.querySelector('.board-cork'),
      pairs: sceneConnections,
      style: () => ({ stroke: 'rgba(200,60,60,.5)', width: '1', dash: '3 2' }),
    });
  }
  window.addEventListener('load', () => { setTimeout(draw, 300); });
  window.addEventListener('resize', draw);
}
