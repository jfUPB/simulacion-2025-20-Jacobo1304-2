# Evidencias de la unidad 4

## Explicación conceptual de la obra

* ¿Qué concepto de la unidad 4 y cómo lo aplicaste en la obra?
> Tu respuesta aquí:
> Utilicé el consepto de las ondas sinoidales, como movimiento principal de las particulas (Movers)

* ¿Qué concepto de la unidad 3 y cómo lo aplicaste en la obra?
> Tu respuesta aquí:
> Utilice el método de applyForce() y utilicé dragforce, simulando resistencia en el espacio. Con la clase liquid.

* ¿Qué concepto de la unidad 2 y cómo lo aplicaste en la obra?
> Tu respuesta aquí:
> Utilice el marco de motion 101, donde se añade la aceleracion a la velocidad, y la velocidad a la posicion.

* ¿Qué concepto de la unidad 1 y cómo lo aplicaste en la obra?
> Tu respuesta aquí:
> Noise para el cambio de color,  Variacion de la onda seno entre movers.

## ¿Cómo resolviste la interacción?
> Tu respuesta aquí:
> Click para pausar y despausar, flechas para umentar y disminuir numero.

## Enlace a la obra en el editor de p5.js

[Aquí está mi obra](https://editor.p5js.org/Jacobo1304-2/sketches/oj5N8vqOV)

## Código de la obra 

``` js
let movers = [];
const escalaAMenor = ["C4","E4","G4","B4","C5","E5", "G5","B5","C6"];
let destellos = [];
let liquid;
let paused = true; // Control de flujo
let terminado = false;
let numMovers = 1; //Control de cantidades
const maxMovers = 24;
const minMovers = 1;
let stars = []; // Vector de estrellas ára un fondo estrellado
const numStars = 200; // cantidad de estrellas

function setup() {
  createCanvas(800, 360);
  Tone.start(); // Activar audio
  liquid = new LiquidCircular(width/2, height/2, 110, 0.4);
  crearMovers(numMovers);
  for (let i = 0; i < numStars; i++) { //Generacion de estrellas
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 2.5),
      brightness: random(150,255)
    });
  }
}

function draw() {
  let allStopped = true;
  background(0);
  liquid.show();
   for (let s of stars) {
    let d = dist(s.x, s.y, liquid.x, liquid.y);
    if (d > liquid.r) { // solo si está fuera de la isla
      noStroke();
      fill(s.brightness);
      circle(s.x, s.y, s.size);
    }
   }
  
  for (let m of movers) {
          if (!paused && !terminado){
         m.applyForce(m.getThrust());
    const dragAir = m.velocity.copy().mult(-0.01);
    m.applyForce(dragAir);
    if (liquid.contains(m)) {
      const dragLiquid = liquid.calculateDrag(m);
      m.applyForce(dragLiquid);
    }
    m.update(liquid, destellos);
    m.checkDestello(); 
        // Revisar si se detuvo por bordes
    m.checkOffscreenStop();
   if (m.velocity.mag() > 0.001) allStopped = false;
  

  if (allStopped) terminado = true; // pausar todo si todos los movers se detienen
      }
   for (let i = destellos.length-1; i >= 0; i--) {
    destellos[i].update();
    destellos[i].show();
    if (destellos[i].isFinished()) destellos.splice(i,1);
  }
   m.show();
  }
  mostrarUI();
}

// ---- INTERACTIVIDAD ----
function mousePressed() {
  if (mouseButton === LEFT) paused = !paused;
  Tone.start(); 
  if (terminado){
    crearMovers(numMovers);
    terminado=false;
    paused=false;
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (numMovers < maxMovers) {
      numMovers++;
      añadirMover();
    }
  } else if (keyCode === DOWN_ARROW) {
    if (numMovers > minMovers) {
      numMovers--;
      eliminarUltimoMover();
    }
  }
}

// ---- CREAR MOVERS ----
function crearMovers(n) {
  movers = [];
  const step = 360 / n;
  for (let i = 0; i < n; i++) {
    const angle = radians(i * step);
    const dir = p5.Vector.fromAngle(angle).normalize();
    let c = color(random(255), random(255), random(255));
    
    // Nota según índice (repite si hay más de 12)
    let nota = escalaAMenor[i % escalaAMenor.length];
    movers.push(new Mover(random(1.1, 5), random(105, 120), random(0.4, 0.6), dir, c, nota));
  }
}

function añadirMover() {
  const i = movers.length;
  const angle = radians((360 / maxMovers) * i);
  const dir = p5.Vector.fromAngle(angle).normalize();
  let c = color(random(255), random(255), random(255));

  let nota = escalaAMenor[i % escalaAMenor.length];
  let nuevoMover = new Mover(random(1.1, 5), random(105, 120), random(0.4, 0.6), dir, c, nota);
  movers.push(nuevoMover);
}

function eliminarUltimoMover() {
  if (movers.length > minMovers) {
    movers.pop();
  }
}

// ---- UI ----
function mostrarUI() {
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  if (paused) text("PAUSED — click izquierdo para reanudar", width / 2, 20);
  if (terminado) text("Terminado — click izquierdo para reiniciar", width / 2, 20);
  text("Ondas activas: " + numMovers, width / 2, 40);
}

class Mover {
  constructor(amplitude, wavelength, speed, dir, strokeColor, nota) {
    this.center = createVector(width / 2, height / 2);
    this.dir = dir.copy().normalize();
    this.normal = createVector(-this.dir.y, this.dir.x);

    this.baseAmplitude = amplitude;
    this.baseWavelength = wavelength;
    this.baseSpeed = speed;

    this.strokeColor = strokeColor;
    this.colorOffsetR = random(1000);
    this.colorOffsetG = random(1000);
    this.colorOffsetB = random(1000);

    this.distance = 0;
    this.phase = 0;

    this.path = [this.center.copy()];
    this.pathMax = 150;

    this.noiseOffsetAmp = random(1000);
    this.noiseOffsetWl = random(1000);
    this.noiseOffsetSpd = random(1000);
    this.noiseOffsetThrust = random(1000);

    const initialAmpNoise = map(noise(this.noiseOffsetAmp), 0, 1, -8, 8);
    const initialAmp = this.baseAmplitude + initialAmpNoise;
    const initialOffset = initialAmp * sin((TWO_PI / this.baseWavelength) * this.distance + this.phase);
    const along0 = p5.Vector.mult(this.dir, this.distance);
    const perp0 = p5.Vector.mult(this.normal, initialOffset);
    this.position = p5.Vector.add(p5.Vector.add(this.center.copy(), along0), perp0);
    this.path.push(this.position.copy());

    this.velocity = this.dir.copy().mult(this.baseSpeed * 0.25);
    this.acceleration = createVector(0, 0);

    this.nota = nota;
    this.synth = new Tone.Synth().toDestination();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  getThrust() {
    const thrustNoise = noise(this.noiseOffsetThrust);
    const thrustFactor = map(thrustNoise, 0, 1, 0.05, 0.15);
    return this.dir.copy().mult(this.baseSpeed * thrustFactor);
  }

  update(liquid, destellos) {
    const ampNoise = map(noise(this.noiseOffsetAmp), 0, 1, -8, 8);
    const wlNoise = map(noise(this.noiseOffsetWl), 0, 1, -15, 15);
    const spdNoise = map(noise(this.noiseOffsetSpd), 0, 1, -0.3, 0.3);

    this.amplitude = this.baseAmplitude + ampNoise;
    this.wavelength = this.baseWavelength + wlNoise;
    this.speed = max(0.01, this.baseSpeed + spdNoise);

    this.noiseOffsetAmp += 0.01;
    this.noiseOffsetWl += 0.01;
    this.noiseOffsetSpd += 0.01;
    this.noiseOffsetThrust += 0.005;

    this.velocity.add(this.acceleration);
    this.velocity.limit(max(0.001, this.baseSpeed * 6));

    const forwardComponent = this.velocity.dot(this.dir);
    const forwardStep = max(0, forwardComponent);
    this.distance += forwardStep;

    this.phase += 0.05;

    const offset = sin((TWO_PI / this.wavelength) * this.distance + this.phase) * this.amplitude;
    const along = p5.Vector.mult(this.dir, this.distance);
    const perp = p5.Vector.mult(this.normal, offset);
    this.position = p5.Vector.add(p5.Vector.add(this.center.copy(), along), perp);

    this.path.push(this.position.copy());
    if (this.path.length > this.pathMax) this.path.shift();

    this.acceleration.mult(0);
  }

  show() {
    noFill();

    // Color dinámico basado en ruido
    this.strokeColor = color(
      noise(this.colorOffsetR) * 255,
      noise(this.colorOffsetG) * 255,
      noise(this.colorOffsetB) * 255
    );
    this.colorOffsetR += 0.01;
    this.colorOffsetG += 0.01;
    this.colorOffsetB += 0.01;

    // --- GLOW EFFECT ---
    const glowLayers = 3;
    for (let g = glowLayers; g > 0; g--) {
      const glowAlpha = 25 * g; // más difuso en capas externas
      const glowWeight = g * 1.2;

      for (let i = 1; i < this.path.length; i++) {
        const p1 = this.path[i - 1];
        const p2 = this.path[i];
        const alpha = map(i, 0, this.path.length - 1, 0, glowAlpha);
        stroke(
          red(this.strokeColor),
          green(this.strokeColor),
          blue(this.strokeColor),
          alpha
        );
        strokeWeight(glowWeight);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }

    // --- MAIN PATH ---
    for (let i = 1; i < this.path.length; i++) {
      const p1 = this.path[i - 1];
      const p2 = this.path[i];
      const alpha = map(i, 0, this.path.length - 1, 0, 255);
      stroke(
        red(this.strokeColor),
        green(this.strokeColor),
        blue(this.strokeColor),
        alpha
      );
      strokeWeight(2);
      line(p1.x, p1.y, p2.x, p2.y);
    }

    // Cabeza del Mover
    const head = this.position;
    fill(0);
    circle(head.x, head.y, 3);
  }

  checkDestello() {
    if (random(1) < 0.008) { // levy flight
      const outside = liquid.contains(this);

      destellos.push(new Destello(this.position, this.strokeColor));

      let freq = Tone.Frequency(this.nota).toFrequency();
      if (outside) freq /= 2;
      console.log("Frecuencia de la nota: " + freq);
      console.log("Liquido contiene el mover: " + outside);
      this.synth.triggerAttackRelease(freq, "8n");
    }
  }

  checkOffscreenStop() {
    if (!this.position) return false;

    let stopped = false;

    if (
      this.position.x <= 0 || this.position.x >= width ||
      this.position.y <= 0 || this.position.y >= height
    ) {
      this.velocity.set(0, 0);
      stopped = true;
    }

    return stopped;
  }
}
class LiquidCircular {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }

  contains(mover) {
    let d = dist(mover.position.x, mover.position.y, this.x, this.y);
    return d > this.r;
  }

  calculateDrag(mover) {
    let speed = mover.velocity.mag();
    let dragMagnitude = this.c * speed * speed;
    let dragForce = mover.velocity.copy();
    dragForce.mult(-1);
    dragForce.setMag(dragMagnitude);
    return dragForce;
  }

  show() {
    noStroke();
    fill(77,77,200);
    ellipse(this.x, this.y, this.r * 2);
    noFill();
    stroke(0, 220, 0);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r * 2 + 4);
  }
}
class Destello {
  constructor(pos, col) {
    this.pos = pos.copy();
    this.r = 0;
    this.alpha = 255;
    this.color = col; // color heredado del mover
  }

  update() {
    this.r += 2;        // expansión
    this.alpha -= 4;    // desvanecimiento
  }

  isFinished() {
    return this.alpha <= 0;
  }

  show() {
    noFill();
    stroke(red(this.color), green(this.color), blue(this.color), this.alpha);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
```


## Captura de pantalla representativa
<img width="706" height="315" alt="image" src="https://github.com/user-attachments/assets/8291de8f-792d-4bff-ad70-e81e9d7b8ba8" />








