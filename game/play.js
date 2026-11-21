import { coast } from './coast.js';
import { glasshouse } from './glasshouse.js';
import { summit } from './summit.js';
import { createPlates } from './plates.js';
import { chime } from './chimes.js';
import { WIDTH, HEIGHT } from './ink.js';

const scenes = [coast, glasshouse, summit];
const get = id => document.getElementById(id);
const canvases = [get('plate-a'), get('plate-b')];
const plates = createPlates(canvases);
const timer = get('timer');
const remaining = get('remaining');
const dialogue = get('pause-dialog');
const hintButton = get('hint');
const pauseButton = get('pause');
const inspectButton = get('inspect');
const advance = get('advance');
const sound = get('sound');
const relax = get('relax');
const feedback = get('feedback');
const tabs = [];
let sceneIndex = 0;
let untimed = false;
let muted = true;
let pointer = null;
let inspection = false;
let inspectionPoint = null;
const centerPoint = () => ({ x: WIDTH/2, y: HEIGHT/2 });
let nextFrameTime = performance.now();

function freshCase(scene) {
  return {
    left: scene.seconds * 1000, hints: 2, found: new Map(), active: false,
    done: false, expired: false, hint: null, miss: null,
    message: ['Compare the plates', 'The clock starts with your first mark.'],
  };
}

let cases = scenes.map(freshCase);
const scene = () => scenes[sceneIndex];
const current = () => cases[sceneIndex];

function announce(title, detail) {
  current().message = [title, detail];
  showFeedback();
}

function showFeedback() {
  const [title, detail] = current().message;
  const bold = document.createElement('strong');
  bold.textContent = title;
  feedback.classList.toggle('warning', ['No difference there', 'Time is up', 'Hint'].includes(title));
  feedback.replaceChildren(bold, document.createTextNode(detail ? ` · ${detail}` : ''));
}

function updatePanel() {
  const state = current();
  const count = scene().targets.length;
  remaining.textContent = `${count - state.found.size} / ${count}`;
  get('found-count').textContent = `✓ ${state.found.size} found`;
  get('ticks').replaceChildren(...Array.from({ length: count }, (_, i) => {
    const tick = document.createElement('span');
    if (i < state.found.size) tick.className = 'done';
    return tick;
  }));
  hintButton.disabled = state.done || state.expired || state.hints === 0 || state.hint !== null;
  hintButton.firstChild.textContent = `Hint (${state.hints}) `;
  pauseButton.disabled = state.done || state.expired;
  advance.hidden = !state.done && !state.expired;
  if (state.expired) advance.firstChild.textContent = 'Try again ';
  else advance.firstChild.textContent = cases.every(item => item.done) ? 'Review first scene ' : 'Next station ';
  for (const [i, tab] of tabs.entries()) {
    tab.firstChild.textContent = cases[i].done ? '✓' : String(i + 1).padStart(2, '0');
    if (i === sceneIndex) tab.setAttribute('aria-current', 'step');
    else tab.removeAttribute('aria-current');
  }
}

function selectScene(index) {
  if (dialogue.open) dialogue.close();
  sceneIndex = index;
  nextFrameTime = performance.now();
  pointer = null;
  inspectionPoint = inspection ? centerPoint() : null;
  get('location').textContent = `${scene().region}  /  ${scene().difficulty}`;
  get('title').textContent = scene().title;
  plates.setScene(scene());
  updatePanel();
  showFeedback();
  draw(performance.now());
}

function playSound(event) {
  if (!muted) chime(event);
}

function usable() {
  const state = current();
  return !state.done && !state.expired && !dialogue.open;
}

function mark(x, y, side) {
  if (!usable()) return;
  const state = current();
  const now = performance.now();
  if (!state.active) nextFrameTime = now;
  state.active = true;

  const hits = scene().targets.flatMap((target, index) => {
    const [, tx, ty, radius] = target;
    const distance = Math.hypot(x - tx, y - ty) / radius;
    return distance <= 1 ? [{ index, distance }] : [];
  });
  hits.sort((a, b) => a.distance - b.distance);
  const hit = hits[0];
  if (!hit) {
    state.miss = { x, y, side, until: now + 640 };
    if (!untimed) state.left = Math.max(0, state.left - 4000);
    announce('No difference there', untimed ? 'Compare the matching area on both plates.' : '−4 seconds');
    playSound('miss');
    draw(now);
    return;
  }
  if (state.found.has(hit.index)) {
    announce('Already marked', 'Keep looking for another difference.');
    return;
  }

  state.found.set(hit.index, now);
  state.miss = null;
  if (state.hint?.target === hit.index) state.hint = null;
  const [name] = scene().targets[hit.index];
  state.done = state.found.size === scene().targets.length;
  if (state.done) {
    const total = cases.reduce((sum, item) => sum + item.found.size, 0);
    if (cases.every(item => item.done)) announce('Expedition complete', `All ${total} differences found across three stations.`);
    else announce('Station cleared', `All ${state.found.size} differences marked. Expedition total ${total} / 24.`);
    playSound('clear');
  } else {
    announce(name, 'Marked on both plates.');
    playSound('find');
  }
  updatePanel();
}

function hint() {
  const state = current();
  if (!usable() || !state.hints || state.hint) return;
  const now = performance.now();
  const targets = scene().targets;
  const target = targets.findIndex((_, index) => !state.found.has(index));
  const [, x, y] = targets[target];
  if (!state.active) nextFrameTime = now;
  state.active = true;
  state.hints--;
  if (!untimed) state.left = Math.max(0, state.left - 6000);
  state.hint = {
    target, x: Math.min(WIDTH-48, Math.max(48, x + (target%2 ? 12 : -12))),
    y: Math.min(HEIGHT-48, Math.max(48, y + 9)), until: now + 3600,
  };
  announce('Hint', untimed ? 'Look inside the amber brackets.' : 'Look inside the amber brackets. −6 seconds.');
  playSound('hint');
  updatePanel();
}

function pause() {
  if (dialogue.open) dialogue.close();
  else if (usable()) {
    draw(performance.now());
    if (usable()) dialogue.showModal();
  }
}

function toggleInspection() {
  if (dialogue.open) return;
  inspection = !inspection;
  inspectionPoint = inspection ? { ...(pointer ?? centerPoint()) } : null;
  inspectButton.setAttribute('aria-pressed', String(inspection));
}

function canvasPoint(canvas, event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: (event.clientX-bounds.left)/bounds.width*WIDTH,
    y: (event.clientY-bounds.top)/bounds.height*HEIGHT,
  };
}

function draw(now) {
  const state = current();
  const delta = Math.max(0, now - nextFrameTime);
  nextFrameTime = now;
  if (usable() && state.active && !untimed) {
    state.left = Math.max(0, state.left - delta);
    if (!state.left) {
      state.expired = true;
      state.hint = null;
      announce('Time is up', `${state.found.size} of ${scene().targets.length} differences marked.`);
      playSound('timeout');
      updatePanel();
    }
  }
  if (state.hint && now >= state.hint.until) {
    state.hint = null;
    updatePanel();
  }
  if (state.miss && now >= state.miss.until) state.miss = null;

  const seconds = Math.ceil(state.left / 1000);
  timer.textContent = untimed ? '—' : `${Math.floor(seconds / 60)}:${String(seconds%60).padStart(2,'0')}`;
  timer.parentElement.classList.toggle('urgent', !untimed && seconds < 20 && !state.done);
  get('timer-label').textContent = untimed ? 'UNTIMED' : 'TIME LEFT';
  get('time-fill').style.width = untimed ? '100%' : `${state.left / (scene().seconds*10)}%`;
  plates.render({ ...state, pointer, inspectionPoint, targets: scene().targets, now });
}

function loop(now) {
  draw(now);
  requestAnimationFrame(loop);
}

scenes.forEach(({ tab }, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.append(document.createElement('b'), document.createTextNode(tab));
  button.addEventListener('click', () => selectScene(index));
  get('stations').append(button);
  tabs.push(button);
});

canvases.forEach((canvas, side) => {
  canvas.addEventListener('click', event => {
    if (!event.detail) return;
    const position = canvasPoint(canvas, event);
    pointer = null;
    if (inspection) inspectionPoint = position;
    mark(position.x, position.y, side);
  });
  canvas.addEventListener('pointermove', event => {
    if (inspection) {
      pointer = null;
      inspectionPoint = canvasPoint(canvas, event);
    }
  });
  canvas.addEventListener('pointerdown', () => { pointer = null; });
  canvas.addEventListener('keydown', event => {
    const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (move || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pointer ??= inspectionPoint ? { ...inspectionPoint } : centerPoint();
    }
    if (move) {
      const step = event.shiftKey ? 3 : 10;
      pointer.x = Math.max(0, Math.min(WIDTH, pointer.x + move[0]*step));
      pointer.y = Math.max(0, Math.min(HEIGHT, pointer.y + move[1]*step));
      if (inspection) inspectionPoint = { ...pointer };
    } else if (!event.repeat && (event.key === 'Enter' || event.key === ' ')) {
      mark(pointer.x, pointer.y, side);
    }
  });
});

dialogue.addEventListener('close', () => { nextFrameTime = performance.now(); });
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key.toLowerCase() === 'h') hint();
  if (event.key.toLowerCase() === 'p') pause();
  if (event.key.toLowerCase() === 'z') toggleInspection();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && current().active && usable()) pause();
});

hintButton.addEventListener('click', hint);
pauseButton.addEventListener('click', pause);
inspectButton.addEventListener('click', toggleInspection);
const restartScene = () => {
  cases[sceneIndex] = freshCase(scene());
  selectScene(sceneIndex);
};
get('restart').addEventListener('click', restartScene);
advance.addEventListener('click', () => {
  if (current().expired) restartScene();
  else {
    const order = scenes.map((_, offset) => (sceneIndex + offset + 1) % scenes.length);
    selectScene(order.find(index => !cases[index].done) ?? 0);
  }
});
sound.addEventListener('click', () => {
  muted = !muted;
  sound.textContent = muted ? 'Sound off' : 'Sound on';
  sound.setAttribute('aria-pressed', String(!muted));
  playSound('find');
});
relax.addEventListener('click', () => {
  untimed = !untimed;
  relax.setAttribute('aria-pressed', String(untimed));
  for (const [index, state] of cases.entries()) {
    if (!state.expired) continue;
    state.expired = false;
    state.left = scenes[index].seconds*1000;
    state.active = false;
    state.message = ['Search resumed', untimed ? 'Take as long as you like.' : 'The clock restarts with your next mark.'];
  }
  if (!current().done) announce(untimed ? 'Untimed mode' : 'Timed mode', untimed ? 'Take as long as you like.' : 'The clock is on.');
  nextFrameTime = performance.now();
  updatePanel();
});
selectScene(0);
requestAnimationFrame(loop);
