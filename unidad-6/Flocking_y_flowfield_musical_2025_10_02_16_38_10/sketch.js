// sketch.js — versión SIN auto-scaling por audio
// Requiere: FlowField.js, Boid.js, Flock.js cargados antes

// -----------------------------
// Globals / Estado
// -----------------------------
let flock;
let field;

let fft, amplitude, audio = null;
let playing = false;

// visual / flow
let showField = false;
let flowWeightBase = 0.3;

// flock params globales (ajustados por presets)
let boidMaxSpeed = 3.0;
let boidMaxForce = 0.05;
let neighborDist = 50;
let separationDist = 25;

// chorus color smoothing
let chorusThreshold = 100;
let chorusSmooth = 0.0;
let chorusLerpSpeed = 0.04;

// mouse spawn
let mouseGenerating = false;
let mouseSpawnRate = 8; // boids por segundo al sostener click
let mouseSpawnAccumulator = 0;

// keyboard state
const pressedKeys = new Set();

// burst size editable
let burstSizeManual = 40;

// DOM refs
let fileInputEl, playBtnEl, volEl, resEl, statusEl, fullscreenBtnEl;
let uiHeight = 0;

// preset state
let currentPreset = 1;

// audio helpers for bursts
let prevBass = 0;
let burstCooldown = 0;

// boid visual size (controlable con [ ])
let boidSize = 4;

// -----------------------------
// P5: setup
// -----------------------------
function setup() {
  const uiEl = document.getElementById('ui');
  uiHeight = uiEl ? uiEl.clientHeight : 0;
  createCanvas(windowWidth, windowHeight - uiHeight);
  pixelDensity(1);
  colorMode(HSB, 255);
  noStroke();

  // DOM references
  fileInputEl = document.getElementById('fileinput');
  playBtnEl = document.getElementById('playbtn');
  volEl = document.getElementById('vol');
  resEl = document.getElementById('res');
  statusEl = document.getElementById('status');
  fullscreenBtnEl = document.getElementById('fullscreenBtn');

  // wire DOM
  if (fileInputEl) fileInputEl.addEventListener('change', handleFileInput);
  if (playBtnEl) playBtnEl.addEventListener('click', togglePlay);
  if (volEl) volEl.addEventListener('input', () => {
    if (audio && audio.isLoaded()) audio.setVolume(parseFloat(volEl.value));
  });
  if (resEl) resEl.addEventListener('input', () => {
    let r = parseInt(resEl.value);
    if (field) field.setResolution(r);
  });
  if (fullscreenBtnEl) fullscreenBtnEl.addEventListener('click', toggleFullscreen);

  // audio analysis (usada sólo para visual/ráfagas)
  fft = new p5.FFT(0.8, 256);
  amplitude = new p5.Amplitude();
  amplitude.smooth(0.8);

  // world
  const initRes = parseInt((resEl && resEl.value) || 25);
  field = new FlowField(initRes);
  flock = new Flock(120); // baseMaxBoids = 120

  // initialize boids up to maxBoids for stable visual count
  for (let i = 0; i < flock.maxBoids; i++) {
    flock.addBoid(new Boid(random(width), random(height)));
  }

  // keyboard handlers
  window.addEventListener('keydown', onGlobalKeyDown, false);
  window.addEventListener('keyup', onGlobalKeyUp, false);

  // mouse press/release for generation (hold to spawn)
  window.addEventListener('mousedown', () => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      mouseGenerating = false;
    } else {
      mouseGenerating = true;
      mouseSpawnAccumulator = 0;
    }
  }, false);
  window.addEventListener('mouseup', () => { mouseGenerating = false; }, false);

  // bind burst size input if present in DOM
  const burstEl = document.getElementById('burstSize');
  if (burstEl) {
    burstEl.addEventListener('input', () => {
      burstSizeManual = Math.max(1, parseInt(burstEl.value) || 1);
    });
    burstSizeManual = Math.max(1, parseInt(burstEl.value) || burstSizeManual);
  }

  // bind optional size slider
  const sizeEl = document.getElementById('size');
  if (sizeEl) {
    sizeEl.addEventListener('input', () => {
      boidSize = constrain(parseFloat(sizeEl.value), 1, 60);
    });
    boidSize = parseFloat(sizeEl.value) || boidSize;
  }

  if (statusEl) statusEl.textContent = 'Listo. Carga un MP3 y presiona Play.';
}

// -----------------------------
// P5: window resized
// -----------------------------
function windowResized() {
  const uiEl = document.getElementById('ui');
  uiHeight = uiEl ? uiEl.clientHeight : 0;
  resizeCanvas(windowWidth, windowHeight - uiHeight);
  if (field && resEl) field.setResolution(parseInt(resEl.value));
}

// -----------------------------
// P5: draw
// -----------------------------
function draw() {
  // fondo con alpha para ligero trail
  background(220, 10, 8, 200);

  // update flow field
  if (field) {
    field.noiseScale = 0.08;
    field.timeScale = 0.002;
    field.update();
  }

  // audio metrics (solo usados para visual/ráfagas)
  let treble = 0, bass = 0, ampLevel = 0;
  if (audio && audio.isLoaded && audio.isPlaying && audio.isPlaying()) {
    fft.setInput(audio);
    treble = fft.getEnergy('treble');
    bass = fft.getEnergy('bass');
    ampLevel = amplitude.getLevel();
  }

  // chorus detection & smooth (solo color)
  let chorusTarget = (bass > chorusThreshold || ampLevel > 0.10) ? 1 : 0;
  chorusSmooth = lerp(chorusSmooth, chorusTarget, chorusLerpSpeed);

  // compute flowWeight influenced by bass (visual weight)
  let mapped = map(bass, 0, 255, 0.05, 1.6);
  let flowWeight = flowWeightBase + mapped;

  // burst detection (auto) - genera ráfagas, NO cambia población base
  if (burstCooldown <= 0) {
    let bassDelta = bass - prevBass;
    if (bassDelta > 55) {
      let bsize = constrain(floor(map(bassDelta, 55, 200, 6, 80)), 6, 200);
      flock.spawnBurst(random() < 0.5 ? 'left' : 'right', bsize);
      burstCooldown = 30;
    }
  } else {
    burstCooldown--;
  }
  prevBass = bass;

  // mouse-hold generation (solo si el mouse está fuera del UI)
  if (mouseGenerating && mouseY > uiHeight) {
    mouseSpawnAccumulator += (deltaTime / 1000) * mouseSpawnRate;
    while (mouseSpawnAccumulator >= 1) {
      // añadir con overflow para que no se teletransporten o sean reemplazados inmediatamente
      flock.addOrReplaceAt(mouseX + random(-6, 6), mouseY + random(-6, 6));
      mouseSpawnAccumulator--;
    }
  } else {
    mouseSpawnAccumulator = 0;
  }

  // draw flow field if toggled
  if (showField && field) {
    push();
    field.show(60);
    pop();
  }

  // run flock: pass chorusSmooth as color factor
  flock.run(field, flowWeight, 0, treble, chorusSmooth);

  // HUD
  drawHUD(bass, ampLevel);

  // held key M: seek mouse
  if (pressedKeys.has('m')) {
    push();
    noFill();
    stroke(40, 220, 255);
    strokeWeight(2);
    ellipse(mouseX, mouseY, neighborDist * 2);
    pop();
    for (let b of flock.boids) {
      let s = b.seek(createVector(mouseX, mouseY));
      s.mult(0.6);
      b.applyForce(s);
    }
  }
}

// -----------------------------
// HUD
// -----------------------------
function drawHUD(bass = 0, amp = 0) {
  push();
  noStroke();
  fill(0, 0, 100);
  textSize(13);
  textAlign(LEFT, TOP);
  let lines = [
    `Preset: ${currentPreset}  |  Boids: ${flock.boids.length} (max ${flock.maxBoids})`,
    `Burst size (Q/E): ${burstSizeManual}`,
    `Boid size: ${boidSize}`,
    `MaxSpeed W/S: ${boidMaxSpeed.toFixed(2)}  |  MaxForce A/D: ${boidMaxForce.toFixed(3)}`,
    `Separation Q/E: ${separationDist}  |  Neighbor Z/X: ${neighborDist}`,
    `Flow res (wheel/slider): ${field ? field.resolution : 'n/a'}`,
    `Flow base (B/N): ${flowWeightBase.toFixed(2)}`,
    `Chorus smooth: ${nf(chorusSmooth, 1, 2)} (threshold: ${chorusThreshold})`,
    `Hold mouse click to spawn boids`,
    `Hold M to SEEK mouse`
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], 10, 10 + i * 16);
  }

  // small bass meter
  fill(0, 0, 100);
  rect(10, height - 36, 140, 12);
  fill(200, 120, 200);
  let w = map(bass, 0, 255, 0, 140);
  rect(10, height - 36, w, 12);
  fill(0, 0, 100);
  text(`Bass: ${nf(bass, 1, 0)}`, 160, height - 38);

  pop();
}

// -----------------------------
// Audio file handling
// -----------------------------
function handleFileInput(evt) {
  const f = evt.target.files ? evt.target.files[0] : null;
  if (!f) {
    if (statusEl) statusEl.textContent = 'No file selected.';
    return;
  }
  if (!f.type.startsWith('audio')) {
    if (statusEl) statusEl.textContent = 'Seleccione un archivo de audio válido (mp3/ogg/wav).';
    return;
  }

  if (window._lastAudioURL) {
    try { URL.revokeObjectURL(window._lastAudioURL); } catch (e) {}
    window._lastAudioURL = null;
  }
  const url = URL.createObjectURL(f);
  window._lastAudioURL = url;

  try {
    if (audio && audio.isPlaying && audio.isPlaying()) {
      audio.stop();
      playing = false;
      if (playBtnEl) playBtnEl.textContent = 'Play / Pause';
    }
  } catch (e) {}

  if (statusEl) statusEl.textContent = 'Cargando audio...';
  loadSound(url,
    (s) => {
      audio = s;
      if (volEl) audio.setVolume(parseFloat(volEl.value));
      if (statusEl) statusEl.textContent = `Cargado: ${f.name} (presiona Play)`;
      fft.setInput(audio);
      amplitude.setInput(audio);
    },
    (err) => {
      console.error('Error loadSound:', err);
      if (statusEl) statusEl.textContent = 'Error decodificando audio. Re-encode y prueba de nuevo.';
      URL.revokeObjectURL(url);
      window._lastAudioURL = null;
    }
  );
}

// -----------------------------
// Play / Pause robusto
// -----------------------------
function togglePlay() {
  if (!audio) {
    if (statusEl) statusEl.textContent = 'No hay audio cargado.';
    console.warn('togglePlay: no audio variable');
    return;
  }
  if (typeof audio.isLoaded === 'function' && !audio.isLoaded()) {
    if (statusEl) statusEl.textContent = 'Audio aún no cargado completamente.';
    console.warn('togglePlay: audio no cargado todavía');
    return;
  }

  if (togglePlay._busy) return;
  togglePlay._busy = true;

  userStartAudio().then(() => {
    try {
      const playingNow = (typeof audio.isPlaying === 'function') ? audio.isPlaying() : (audio.playing || false);
      if (!playingNow) {
        audio.loop();
        if (volEl) audio.setVolume(parseFloat(volEl.value));
        if (playBtnEl) playBtnEl.textContent = 'Pause';
        playing = true;
        if (statusEl) statusEl.textContent = 'Reproduciendo 🎶';
        console.log('Audio started (loop).');
      } else {
        audio.pause();
        if (playBtnEl) playBtnEl.textContent = 'Play / Pause';
        playing = false;
        if (statusEl) statusEl.textContent = 'Pausado';
        console.log('Audio paused.');
      }
    } catch (err) {
      console.error('togglePlay error:', err);
      if (statusEl) statusEl.textContent = 'Error al reproducir audio: ' + err;
    } finally {
      setTimeout(() => { togglePlay._busy = false; }, 120);
    }
  }).catch((err) => {
    console.warn('userStartAudio error', err);
    if (statusEl) statusEl.textContent = 'No se pudo iniciar audio. Interactúa con la página y reintenta.';
    togglePlay._busy = false;
  });
}

// -----------------------------
// Fullscreen
// -----------------------------
function toggleFullscreen() {
  fullscreen(!fullscreen());
}

// -----------------------------
// Mouse wheel: change field resolution
// -----------------------------
function mouseWheel(event) {
  if (!field) return false;
  let delta = event.deltaY > 0 ? 2 : -2;
  let newRes = constrain(field.resolution + delta, 8, 80);
  field.setResolution(newRes);
  if (resEl) resEl.value = newRes;
  return false; // prevent page scroll
}

// -----------------------------
// Keyboard handlers
// -----------------------------
function onGlobalKeyDown(e) {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

  const k = (e.key || '').toLowerCase();
  const wasPressed = pressedKeys.has(k);
  pressedKeys.add(k);

  if (!wasPressed) {
    switch (k) {
      case '1': applyPreset(1); break;
      case '2': applyPreset(2); break;
      case '3': applyPreset(3); break;
      case 'q': if (flock) flock.spawnBurst('left', burstSizeManual); break;
      case 'e': if (flock) flock.spawnBurst('right', burstSizeManual); break;
      case 'w': boidMaxSpeed = min(12, boidMaxSpeed + 0.25); break;
      case 's': boidMaxSpeed = max(0.1, boidMaxSpeed - 0.25); break;
      case 'a': boidMaxForce = min(1, boidMaxForce + 0.01); break;
      case 'd': boidMaxForce = max(0.001, boidMaxForce - 0.01); break;
      case 'z': neighborDist = min(500, neighborDist + 2); break;
      case 'x': neighborDist = max(1, neighborDist - 2); break;
      case 'r': if (field) { field.init(); if (statusEl) statusEl.textContent = 'FlowField reseed'; } break;
      case 'f': showField = !showField; break;
      case '+': case '=': if (flock) flock.addBoid(new Boid(mouseX, mouseY)); break;
      case '-': if (flock) flock.removeBoid(); break;
      case 'c': if (flock) flock.clear(); break;
      case 'b': flowWeightBase = min(5, flowWeightBase + 0.1); break;
      case 'n': flowWeightBase = max(-2, flowWeightBase - 0.1); break;
      case 'k': toggleFullscreen(); break;
      case 'm': /* handled as held key */ break;
      case ']': boidSize = min(60, boidSize + 1); break;
      case '[': boidSize = max(1, boidSize - 1); break;
    }
  }
}

function onGlobalKeyUp(e) {
  const k = (e.key || '').toLowerCase();
  pressedKeys.delete(k);
}

// -----------------------------
// Helper global used by index.html
// -----------------------------
function applyPreset(n) {
  if (flock && typeof flock.applyPreset === 'function') {
    flock.applyPreset(n);
    currentPreset = n;
  }
}

// -----------------------------
// Cleanup
// -----------------------------
window.addEventListener('beforeunload', () => {
  if (window._lastAudioURL) {
    try { URL.revokeObjectURL(window._lastAudioURL); } catch (e) {}
  }
});
