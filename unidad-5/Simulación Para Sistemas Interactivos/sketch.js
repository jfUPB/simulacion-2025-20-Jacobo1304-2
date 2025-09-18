// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Smoke Particle System

// A basic smoke effect using a particle system
// Each particle is rendered as an alpha masked image

let emitters = [];
let img;
let img2;
let mover;
let hexVertices = [];
let windTargetIndex = 0;
let lastTouchedIndex = -1; // evita detectar el mismo vértice consecutivamente
let lastTargetIndex = -1;  // evita retargetear al mismo índice consecutivamente
let colorLerp = 1;         // factor de mezcla entre color previo y color objetivo actual
const WIND_STRENGTH = 0.06; // tune force strength (increased from 0.01)
const TARGET_THRESH = 20;   // distance to consider the vertex "touched"
let touchCooldown = 0;      // frames to avoid multiple triggers on the same vertex

// Fullscreen button and default canvas size
let fsBtn;
const DEFAULT_W = 640;
const DEFAULT_H = 240;

let flashes = [];
let synth;
const NOTES = ['C4','G4','D4','A5','E5','B5']; // C diminished (C, Eb, Gb) across two octaves

function preload() {
  img = loadImage("data/texture2.png"); 
  img2 = loadImage("data/Cloud-particle.png");
}

function setup() {

  createCanvas(DEFAULT_W, DEFAULT_H, WEBGL);
  createEmitters();
  mover = new Mover();
  windTargetIndex = floor(random(6));
  // Al inicio, aún no hay vértice tocado; preparar mezcla para el primer toque
  colorLerp = 1;

  // Initialize synth for notes
  synth = new p5.MonoSynth();

  // Create fullscreen toggle button
  fsBtn = createButton('Pantalla completa');
  fsBtn.position(10, 10);
  fsBtn.style('position', 'absolute');
  fsBtn.style('padding', '8px 12px');
  fsBtn.style('font-family', 'inherit');
  fsBtn.style('font-size', '14px');
  fsBtn.style('border', 'none');
  fsBtn.style('border-radius', '6px');
  fsBtn.style('background', '#1e1e1eaa');
  fsBtn.style('color', '#ffffff');
  fsBtn.style('cursor', 'pointer');
  fsBtn.style('z-index', '10');
  fsBtn.mousePressed(toggleFullscreen);

}

function createEmitters() {
  // Create 6 emitters placed at the vertices of a hexagon around the center
  emitters = [];
  hexVertices = [];
  const r = min(width, height) * 0.35; // radius of hexagon
  // Colors: light green, sky blue, pink, orange, brown, dark blue
  const colors = [
    [144, 238, 144],   // light green
    [135, 206, 235],   // sky blue (celeste)
    [255, 105, 180],   // pink (rosado)
    [245, 150, 34],    // orange (current)
    [240, 40, 50],     // brown (café)
    [0, 0, 139]        // dark blue (azul oscuro)
  ];
  for (let i = 0; i < 6; i++) {
    const angle = -HALF_PI + i * (TWO_PI / 6); // start at top, go around
    const x = r * cos(angle);
    const y = r * sin(angle);
    hexVertices.push(createVector(x, y));
    emitters.push(new Emitter(x, y, img, img2, colors[i]));
  }
}

function draw() {

  // Access WEBGL Directly for more blending options?
  // let gl = this._renderer.GL;
  // gl.enable(gl.BLEND);
   //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  background(0);

  // Ensure hex vertices match current emitter centers
  syncHexVerticesFromEmitters();

  // Decrease touch cooldown
  if (touchCooldown > 0) touchCooldown--;
  // Avanzar mezcla de color hacia el objetivo actual
  colorLerp = min(1, colorLerp + 0.03);

  // Draw imaginary hexagon lines (normal blending)
  blendMode(BLEND);
  drawHexBounds();
  drawRestartHint();

  // Draw and update vertex flashes
  updateFlashes();

  // Additive blending for particles
  blendMode(ADD);

  // Compute wind toward current target vertex from mover's position
  const target = hexVertices[windTargetIndex];
  let dir = p5.Vector.sub(target, mover.position);
  const distToTarget = dir.mag();
  let wind = dir.copy();
  if (wind.mag() > 0) wind.setMag(WIND_STRENGTH);

  // Apply wind to mover and update/draw it
  mover.applyForce(wind);
  mover.update();

  mover.show();

  // Update and render all emitters using the same wind
  for (let e of emitters) {
    // Add particles first so they receive wind this frame
    for (let i = 0; i < 2; i++) {
      e.addParticle();
    }
    e.applyForce(wind);
    e.run();
  }

  // Detect touch with ANY vertex (not only the target)
  let touchedIndex = -1;
  if (touchCooldown <= 0 && hexVertices.length === 6) {
    for (let i = 0; i < 6; i++) {
      if (lastTouchedIndex >= 0 && i === lastTouchedIndex) continue; // esta validación solo aplica después del primer toque
      if (p5.Vector.dist(mover.position, hexVertices[i]) < TARGET_THRESH) {
        touchedIndex = i;
        break;
      }
    }
  }

  if (touchedIndex >= 0) {
    lastTouchedIndex = touchedIndex; // actualizar para evitar bucles
    // Snap to touched vertex, trigger effects, and retarget
    const v = hexVertices[touchedIndex];
    mover.position.set(v.x, v.y);
    mover.velocity.set(0, 0);

    triggerFlash(touchedIndex);
    playNoteForIndex(touchedIndex);

    let next = touchedIndex;
    while (next === touchedIndex || next === lastTargetIndex) {
      next = floor(random(6));
    }
    // Reiniciar la mezcla de color desde el vértice tocado hacia el nuevo objetivo
    colorLerp = 0;

    lastTargetIndex = next;
    windTargetIndex = next;

    touchCooldown = 12; // debounce
  }
}

function drawRestartHint() {
  push();
  // Position at bottom-left in WEBGL coordinates
  translate(-width / 2, height / 2);
  noStroke();
  fill(255); // suave y casi transparente
  textSize(20);
  textAlign(LEFT, BOTTOM);
  text('R para reiniciar', 12, -12);
  pop();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    restartSketch();
  }
}

function restartSketch() {
  // Reset mover
  mover = new Mover();

  // Clear all particles but preserve emitter positions/rotation
  if (emitters && emitters.length) {
    for (let e of emitters) {
      e.particles = [];
    }
  }

  // Reset visual effects and state
  flashes = [];
  touchCooldown = 0;
  lastTouchedIndex = -1; // no vertex touched yet
  lastTargetIndex = -1;
  colorLerp = 1;         // start with current color once first touch happens
  windTargetIndex = floor(random(6));
}

function toggleFullscreen() {
  const fs = fullscreen();
  fullscreen(!fs);
  ensureAudio();
  // Sizing and label will be adjusted in windowResized()
}

function windowResized() {
  if (fullscreen()) {
    // Fill the screen when in fullscreen
    resizeCanvas(windowWidth, windowHeight);
    if (fsBtn) fsBtn.html('Salir de pantalla completa');
  } else {
    // Restore default size when exiting fullscreen
    resizeCanvas(DEFAULT_W, DEFAULT_H);
    if (fsBtn) fsBtn.html('Pantalla completa');
  }
  // Recreate emitters to reposition with new canvas size
  createEmitters();
}

// Draw the hexagon boundary
function drawHexBounds() {
  if (hexVertices.length !== 6) return;
  push();
  noFill();
  stroke(255, 60);
  strokeWeight(0);
  beginShape();
  for (let v of hexVertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
  pop();
}

// Return true if point p is inside a convex polygon defined by verts (in order)
function pointInConvexPolygon(p, verts) {
  if (!verts || verts.length < 3) return false;
  let sign = 0;
  for (let i = 0; i < verts.length; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % verts.length];
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const apx = p.x - a.x;
    const apy = p.y - a.y;
    const cross = abx * apy - aby * apx; // z-component of 2D cross
    if (abs(cross) < 1e-6) continue; // on edge: ignore small
    if (sign === 0) sign = Math.sign(cross);
    else if (Math.sign(cross) !== sign) return false;
  }
  return true;
}

// Compute closest point to p on the polygon edges
function closestPointOnPolygon(p, verts) {
  let bestPt = null;
  let bestDist2 = Infinity;
  for (let i = 0; i < verts.length; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % verts.length];
    const q = closestPointOnSegment(a, b, p);
    const d2 = (q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y);
    if (d2 < bestDist2) {
      bestDist2 = d2;
      bestPt = q;
    }
  }
  return bestPt || p.copy();
}

// Closest point on segment AB to point P
function closestPointOnSegment(a, b, p) {
  const ab = p5.Vector.sub(b, a);
  const ap = p5.Vector.sub(p, a);
  const abLen2 = ab.x * ab.x + ab.y * ab.y;
  let t = abLen2 > 0 ? (ap.x * ab.x + ap.y * ab.y) / abLen2 : 0;
  t = constrain(t, 0, 1);
  return createVector(a.x + ab.x * t, a.y + ab.y * t);
}

// Create a flash at a vertex index
function triggerFlash(i) {
  const o = emitters[i].origin;
  const col = emitters[i].color || [255,255,255];
  flashes.push({ pos: createVector(o.x, o.y), r: 0, alpha: 220, col });
}

// Update and draw all active flashes
function updateFlashes() {
  if (!flashes.length) return;
  // Update
  for (let f of flashes) {
    f.r += 3.5;      // expansion speed
    f.alpha -= 6;    // fade speed
  }
  // Draw
  push();
  noFill();
  strokeWeight(2);
  for (let f of flashes) {
    const [r, g, b] = f.col;
    stroke(r, g, b, constrain(f.alpha, 0, 255));
    circle(f.pos.x, f.pos.y, f.r * 2);
  }
  pop();
  // Remove finished
  flashes = flashes.filter(f => f.alpha > 0);
}

// Play the note assigned to the vertex index
function playNoteForIndex(i) {
  ensureAudio();
  const note = NOTES[i % NOTES.length];
  if (synth && note) {
    // velocity, start time offset, duration (seconds)
    synth.play(note, 0.6, 0, 0.2);
  }
}

function ensureAudio() {
  const ac = getAudioContext();
  if (ac && ac.state !== 'running') {
    userStartAudio();
  }
}

function mouseWheel(event) {
  // Wheel down -> +1, wheel up -> -1 (radians)
  const angle = event.delta > 0 ? 1 : -1;

  // Rotate emitters around the center
  for (let e of emitters) {
    e.rotate(angle);
  }

  // Keep hexVertices exactly on emitter centers
  syncHexVerticesFromEmitters();

  ensureAudio();

  // Prevent page scroll
  return false;
}

// Sync hexVertices array to emitters' current origins (keep order)
function syncHexVerticesFromEmitters() {
  if (!emitters || emitters.length !== 6) return;
  for (let i = 0; i < 6; i++) {
    const o = emitters[i].origin;
    if (hexVertices[i]) {
      hexVertices[i].set(o.x, o.y);
    } else {
      hexVertices[i] = createVector(o.x, o.y);
    }
  }
}
