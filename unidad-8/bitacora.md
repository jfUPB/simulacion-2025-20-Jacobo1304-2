# Evidencias de la unidad 8

## Actividad 1
Exploración de enlaces:

<img width="1842" height="1026" alt="image" src="https://github.com/user-attachments/assets/8718a3e2-bdfc-4fb0-adaa-7368fde1a29f" />


<img width="2419" height="1126" alt="image" src="https://github.com/user-attachments/assets/b3493df1-c8d1-4dc8-aa3e-e34b2e722df0" />


<img width="885" height="550" alt="image" src="https://github.com/user-attachments/assets/900a911e-a095-4d11-a287-f9ed1423e5e0" />


<img width="1842" height="1026" alt="image" src="https://github.com/user-attachments/assets/086beaa8-d1a2-4a55-b2d3-375cbb33929c" />


<img width="1548" height="998" alt="image" src="https://github.com/user-attachments/assets/25e733eb-7c34-424b-8a7f-0a90728a7991" />

Todas estas obras me parece que tienen en comun que van con la vibra de la canción. No tienen cosas muy exactas, sino que juegan con las atmosferas que va transmitiendo el audio en ese momento. Alba corral con su lapicito y su consola va moviendo cosas segun el sentimiento que vaya tocando el pianista. Pero tambien se toma de la mano de factores como el rimo, y si la melodia es ascendente o descendente para hacer cosas mas rigidas en los visuales. Como la dirección hacia la que se mueven unas ondas y el beat de la música como guía del movimiento.

Hay varias cosas que parecen generativas, todo tiene un toque inesperado e impredecible, muy probablemente por el uso de aleatoriedades controladas dentro de los diseños. En las imagenes de arriba se pueden ver circulos de diferentes tamaños, un grid, que puede ser un campo de flujo, en donde esos puntos luego empiezan a moverse y a hacerse lineas en las pantallas gigantes. Todo eso es lo que me resulta generativo.

El liveness me parece clave. Es lo que le da a cada sesion un toque unico, y hace que la verdadera magia del arte generativo suceda. Ahi lo inportante es prevenir errores y saberlos manejar. Para que cosas como el rendimiento, o uin botón mal apretado no se tiren toda la experiencia. Pero en este momento siento que tocar unas visuales en vivo está agarrando un valor igual al de interpretar un instrumento en vivo. En donde, a pesar de que una canción ya pueda existir, agarra más valor si se tocan en vivo.


## Actividad 2
Iniciarás el proceso de diseño. Define el concepto visual general, selecciona la pieza musical y determina qué inputs utilizarás para interpretar la música en tiempo real:

### Bocetos:

Posibles temas:

Cant stop - RHCP
Humo - Rupa trupa 
Breathe (in the air) - pink floyd.
Ojalá (Silvio Rodríguez)
Love never felt so good - Michael Jackson
24K magic - Bruno Mars /// Elegida.
Back in black. - ACDC

#### Elección final: 24K magic - Bruno Mars

<img width="1000" height="1000" alt="image" src="https://github.com/user-attachments/assets/89ecae6a-cc17-4e73-a284-3fde5cc57042" />


Ventajas: Climax y breakDowns claros.

### La pregunta del millón: Que algoritmos uso??
En principio y las bases que quiero que tenga el boceto son las siguientes.

Un crescendo en lo visual al inicio que acompañe la introducción. 
Flocks que se muevan a velocidad variable según lo vaya controlando. Para dividir las partes.
Presets para las diferentes etapas. Intro - Verso - Coro - Puente y final.

#### Bocetos:

![Imagen de WhatsApp 2025-10-29 a las 22 26 55_ee71a5b7](https://github.com/user-attachments/assets/632edd3d-ea11-4688-8bb2-2ceada82d4ad)


## Actividad 3
#### El código fuente completo de tu sketch en p5.js.
```js
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
```
#### Un enlace a tu sketch en el editor de p5.js.
[Enlace al editor](https://editor.p5js.org/Jacobo1304-2/sketches/TRnjZIfbg)

#### Capturas de pantalla mostrando tu pieza en acción.
<img width="1472" height="1007" alt="image" src="https://github.com/user-attachments/assets/ffd2289b-994d-42c7-a6d8-1efdac9b5fce" />

<img width="1435" height="998" alt="image" src="https://github.com/user-attachments/assets/a97746d3-fdbd-4629-9096-39cccf0b2c79" />


<img width="1446" height="1026" alt="image" src="https://github.com/user-attachments/assets/9d4e34c4-1ce1-4e6b-908b-e8d5490ce2f5" />









