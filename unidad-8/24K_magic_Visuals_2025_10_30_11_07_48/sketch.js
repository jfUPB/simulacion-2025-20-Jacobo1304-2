// ---- Sketch base para visuales en vivo ----
// Canción: 24K Magic - Bruno Mars
// Fondo limpio + sistema de presets + pantalla completa
// Hecho por: Jacobo Rodríguez

let song;
let isPlaying = false;
let visualizer;

let playButton, resetButton, fullscreenButton;
let fft, amplitude;

// Sistema independiente de partículas
let emittersGlobal = [];

function preload() {
  // Cargar la canción desde archivos locales
  song = loadSound("Bruno Mars - 24K Magic (Official Music Video).mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noCursor();

  createUI();

  // Inicializar análisis de sonido
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  // Crear el administrador de visuales
  visualizer = new VisualizerManager(song);
  visualizer.addPreset(new PresetFlocking(120)); // 1
  visualizer.addPreset(new PresetParticles());   // 2
  visualizer.addPreset(new PresetFractals());    // 3
  visualizer.addPreset(new PresetGrid(10, 8));   // 4

  console.log("Presets cargados: 1=Flocking, 2=Particles, 3=Fractals, 4=Grid");
}

function draw() {
  background(0);

  if (isPlaying && visualizer) {
    visualizer.update();
    visualizer.display();
  }

  // Actualizar y mostrar los emisores independientes
  for (let e of emittersGlobal) e.update();
  for (let e of emittersGlobal) e.display();

  // Eliminar los emisores que ya no tienen partículas activas
  emittersGlobal = emittersGlobal.filter(e => e.particles.length > 0);

  // Mostrar nombre del preset activo
  fill(255);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(14);
  text("Preset: " + (visualizer.activePreset + 1), 20, height - 20);
}

// -----------------------------------------
// INTERFAZ DE USUARIO
// -----------------------------------------
function createUI() {
  playButton = createButton("▶️ Play");
  playButton.parent(document.body);
  playButton.style("margin", "10px");
  playButton.mousePressed(togglePlay);

  resetButton = createButton("⏮️ Reiniciar");
  resetButton.parent(document.body);
  resetButton.style("margin", "10px");
  resetButton.mousePressed(resetSong);

  fullscreenButton = createButton("⛶ Pantalla completa");
  fullscreenButton.parent(document.body);
  fullscreenButton.style("margin", "10px");
  fullscreenButton.mousePressed(toggleFullscreen);
}

// -----------------------------------------
// CONTROLES DE AUDIO
// -----------------------------------------
function togglePlay() {
  if (!isPlaying) {
    song.play();
    playButton.html("⏸️ Pausa");
    isPlaying = true;
  } else {
    song.pause();
    playButton.html("▶️ Play");
    isPlaying = false;
  }
}

function resetSong() {
  song.stop();
  song.play();
  playButton.html("⏸️ Pausa");
  isPlaying = true;

  if (visualizer && visualizer.presets[visualizer.activePreset].reset) {
    visualizer.presets[visualizer.activePreset].reset();
  }

  // Resetear también los emisores globales
  emittersGlobal = [];
}

// -----------------------------------------
// CONTROL DE PANTALLA COMPLETA
// -----------------------------------------
function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}

// -----------------------------------------
// CAMBIO DE PRESETS CON TECLAS 1–4
// -----------------------------------------
function keyPressed() {
  if (keyCode >= 49 && keyCode <= 57) { // teclas 1–9
    let presetIndex = keyCode - 49;
    visualizer.setPreset(presetIndex);
  }
   // Reiniciar con R
  if (key === 'r' || key === 'R') {
    resetSong();
  }

  // Enviar eventos de teclado a los presets
if (visualizer && visualizer.presets[visualizer.activePreset].keyPressed) {
  visualizer.presets[visualizer.activePreset].keyPressed(key);
}
  }
 

// -----------------------------------------
// CLICK DEL MOUSE: añadir un emisor global
// -----------------------------------------
function mousePressed() {
  let count = 50; // cantidad de partículas
  let speed = 2;  // velocidad base
  let fadeDuration = 100; // duración del fade

  emittersGlobal.push(new Emitter(mouseX, mouseY, count, speed, fadeDuration));
}

// -----------------------------------------
// AJUSTE DE TAMAÑO DE VENTANA
// -----------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
