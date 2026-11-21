export const WIDTH = 640;
export const HEIGHT = 450;

export function painter(ctx) {
  function path(points, fill, stroke, weight = 1, close = true) {
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    if (close) ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = weight; ctx.stroke(); }
  }
  function box(x, y, w, h, fill, stroke, weight = 1) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = weight; ctx.strokeRect(x, y, w, h); }
  }
  function oval(x, y, rx, ry, fill, stroke, weight = 1, rotation = 0) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = weight; ctx.stroke(); }
  }
  function beam(points, color, weight = 1) {
    path(points, null, color, weight, false);
  }
  function label(text, x, y, size, color, family = 'Georgia') {
    ctx.font = `bold ${size}px ${family}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
  function sky(top, bottom, height = HEIGHT) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    box(0, 0, WIDTH, HEIGHT, gradient);
  }
  return { path, box, oval, beam, label, sky };
}

export function seeded(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function grain(ink, seed, count = 2600) {
  const random = seeded(seed);
  for (let i = 0; i < count; i++) {
    const x = random() * WIDTH, y = random() * HEIGHT;
    ink.box(x, y, 1 + random() * 1.1, .7, i % 2 ? '#fff2cd15' : '#111a1d15');
  }
}

export function crescent(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, -1.4, .91, true);
  ctx.quadraticCurveTo(x-radius*.68, y+radius*.57, x+radius*.17, y-radius*.986);
  ctx.fillStyle = color;
  ctx.fill();
}

export function pine(ink, x, base, height, color) {
  const width = height * .23;
  ink.box(x - 1.5, base - height * .17, 3, height * .17, color);
  for (let tier = 0; tier < 4; tier++) {
    const spread = width * (.46 + tier * .18);
    const head = base - height + tier * height * .2;
    ink.path([[x, head], [x - spread, head + height * .40], [x, head + height * .33],
      [x + spread, head + height * .39]], color);
  }
}
