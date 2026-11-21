import { HEIGHT, WIDTH, painter } from './ink.js';

function makeArt(scene, version) {
  const art = document.createElement('canvas');
  art.width = WIDTH;
  art.height = HEIGHT;
  const context = art.getContext('2d');
  context.lineJoin = 'round';
  context.lineCap = 'round';
  scene.draw(context, version);
  return art;
}

export function createPlates(canvases) {
  const layers = canvases.map(element => ({ element, context: element.getContext('2d') }));
  let art = [];
  function setScene(scene) {
    art = [makeArt(scene, false), makeArt(scene, true)];
  }
  function render({ found, targets, pointer, hint, miss, now }) {
    layers.forEach(({ element, context }, index) => {
      context.drawImage(art[index], 0, 0);
      const ink = painter(context);
      for (const [targetIndex, foundAt] of found) {
        const [, x, y, radius] = targets[targetIndex];
        const age = (now - foundAt) / 440;
        const swell = age < 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches ? Math.sin(age * Math.PI) * 7 : 0;
        const ring = Math.max(15, radius * .81) + swell;
        ink.oval(x, y, ring + 1, ring + 1, '#162f301f', '#17362d', 5);
        ink.oval(x, y, ring, ring, null, '#d7f7a1', 2.5);
        ink.oval(x + ring*.74, y-ring*.74, 8.5, 8.5, '#d7f7a1', '#325044', 1.2);
        ink.beam([[x+ring*.74-3.8,y-ring*.74], [x+ring*.74-1,y-ring*.74+2.5],
          [x+ring*.74+3.6,y-ring*.74-3]], '#25463a', 1.7);
      }
      if (hint) {
        const r = 46, arm = 13;
        for (const dx of [-1, 1]) for (const dy of [-1, 1]) {
          const x = hint.x + dx*r, y = hint.y + dy*r;
          const bracket = [[x - dx*arm, y], [x, y], [x, y - dy*arm]];
          ink.beam(bracket, '#354038', 6);
          ink.beam(bracket, '#ffc781', 3);
        }
      }
      if (miss && miss.side === index) {
        const { x, y } = miss;
        ink.oval(x, y, 13, 13, '#1d1e23d9', '#ffaf92', 2);
        ink.beam([[x-4,y-4],[x+4,y+4]], '#ffaf92', 2);
        ink.beam([[x+4,y-4],[x-4,y+4]], '#ffaf92', 2);
      }
      if (pointer && document.activeElement === element) {
        const { x, y } = pointer;
        ink.oval(x, y, 10, 10, null, '#1b332e', 4);
        ink.oval(x, y, 10, 10, null, '#fff9e1', 1.6);
        ink.beam([[x-15,y],[x-5,y]], '#fff9e1', 1.6);
        ink.beam([[x+5,y],[x+15,y]], '#fff9e1', 1.6);
        ink.beam([[x,y-15],[x,y-5]], '#fff9e1', 1.6);
        ink.beam([[x,y+5],[x,y+15]], '#fff9e1', 1.6);
      }
    });
  }
  return { setScene, render };
}
