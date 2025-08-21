# Unidad 3


## 🛠 Fase: Apply
#### Concepto: La rosa orbitada
Walker (tallo) con tendencia hacia arriba, al que se le pueden pushear espinas o petalos, que orbitan con cada uno de los otros petalos, estos petalos tienen un contrain que es la rama (linea que va del tallo al petalo) y por eso no podrán orbitar más de ahi.

// Basado en The Nature of Code - Daniel Shiffman
// Modificado para formas poligonales, control con teclado y rotación

let movers = [];
let sun;
let noiseOffset = 0;

function setup() {
  createCanvas(640, 480);
  for (let i = 0; i < 20; i++) {
    addMover();
  }
  sun = new Mover(0, 0, 0, 0, 500);
  background(255);
}

function draw() {
  background(255, 50);
  translate(width / 2, height / 2);

  for (let mover of movers) {
    sun.attract(mover);
    for (let other of movers) {
      if (mover !== other) {
        mover.attract(other);
      }
    }
  }

  for (let mover of movers) {
    mover.update();
    mover.show();
  }
}

// -----------------------
// Interacción con teclado
// -----------------------
function keyPressed() {
  if (key === ' ') {
    addMover(); // Push
  }
  if (key === 'D' || key === 'd') {
    movers.pop(); // Delete
  }
}

// -----------------------
// Función para crear mover
// -----------------------
function addMover() {
  let pos = p5.Vector.random2D();
  let vel = pos.copy();
  vel.setMag(random(2, 5));
  pos.setMag(random(50, 200));
  vel.rotate(PI / 2);
  let m = random(8, 15);
  movers.push(new Mover(pos.x, pos.y, vel.x, vel.y, m));
}

// -----------------------
// Clase Mover
// -----------------------
class Mover {
  constructor(x, y, vx, vy, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;

    // Color aleatorio: rojo, amarillo o azul
    let c = int(random(3));
    if (c === 0) this.col = color(255, 0, 0, 150); // Rojo
    else if (c === 1) this.col = color(255, 255, 0, 150); // Amarillo
    else this.col = color(0, 0, 255, 150); // Azul

    // Rotación
    this.angle = random(TWO_PI);
    this.aVel = random(-0.05, 0.05); // velocidad angular
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  attract(mover) {
    let force = p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let G = 1;
    let strength = (G * (this.mass * mover.mass)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // Actualizar rotación
    this.angle += this.aVel;
  }

  // Dibujar polígono con variación (noise y Levy flight)
  show() {
    noStroke();
    fill(this.col);

    noiseOffset += 0.01;
    let n = noise(noiseOffset);

    let sides;
    if (random(1) < 0.01) {
      // Levy flight (ocasionalmente 8 lados)
      sides = 8;
    } else {
      // Usamos noise para variar entre 2, 3 y 4 lados
      if (n < 0.33) sides = 2;
      else if (n < 0.66) sides = 3;
      else sides = 4;
    }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle); // 🔄 rotación dinámica
    polygon(0, 0, this.r, sides);
    pop();
  }
}

// -----------------------
// Función para dibujar polígonos
// -----------------------
function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
