# Unidad 3

## 🛠 Fase: Apply
#### Concepto: 
Obra generativa interactiva en tiempo real

Mi obra generativa consiste en un sistema de atracción gravitacional de N-cuerpos, inspirado en The Nature of Code, pero reinterpretado en clave artística. En lugar de partículas simples como circulos, busque formas inspiradas en Daniel Kalder, cada cuerpo se representa como una hoja generativa orgánica dibujada con noise, lo que aporta una estética natural y viva.

#### Interactividad

Con la tecla ESPACIO se agregan nuevas hojas al sistema.

Con la tecla D se eliminan hojas.

Las hojas rotan dinámicamente y se colorean aleatoriamente en rojo, amarillo o azul.

Con una baja probabilidad ocurre un Lévy flight, en cuyo caso la hoja se dibuja de color morado, diferenciándose del resto.

#### Algoritmos de la unidad 1 utilizados

Perlin Noise: Se usa para deformar el contorno de cada hoja y darle una forma orgánica, no rígida.

Además, utilizo random tanto para la asignación de colores como para inicializar posiciones, masas y velocidades.

Como extra, implemento la idea de Lévy flight para introducir rarezas en el sistema (hojas moradas), aunque la verdad no se vieron como esperaba, pues solo se ve un destello morado y en seguida vuelve a ser amarilla.

#### Modelado del problema de los N-cuerpos

Cada hoja es un objeto de la clase Mover, con propiedades de posición, velocidad, aceleración y masa.

La atracción se modela usando la ley de gravitación universal simplificada que aparece en el libro.
	​
Cada Mover aplica fuerzas sobre los demás, generando trayectorias emergentes y caóticas.

La simulación se ejecuta en tiempo real y se visualiza a través de la animación de las hojas.

#### Enlace a la simulación en p5.js
https://editor.p5js.org/Jacobo1304-2/sketches/pXI4fdV_t

👉 Enlace a mi simulación (editor.p5js.org)
```js
class Mover {
  constructor(x, y, vx, vy, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 6; // tamaño base de hoja

    // Color aleatorio: rojo, amarillo o azul
    let c = int(random(3));
    if (c === 0) this.col = color(255, 0, 0, 180); // Rojo
    else if (c === 1) this.col = color(255, 255, 0, 180); // Amarillo
    else this.col = color(0, 0, 255, 180); // Azul

    // Rotación
    this.angle = random(TWO_PI);
    this.aVel = random(-0.02, 0.02); // velocidad angular
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

    // Rotación
    this.angle += this.aVel;
  }

  // Dibujar hoja con noise
  show() {
    noStroke();

    noiseOffset += 0.01;
    let n = noise(noiseOffset);

    let isLevy = false;
    if (random(1) < 0.01) {
      isLevy = true; // Lévy flight → hoja especial
    }

    // Color: morado si es Levy, si no el asignado
    if (isLevy) {
      fill(180, 0, 180, 180); // morado
    } else {
      fill(this.col);
    }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    beginShape();
    let sides = 60; // resolución para forma orgánica
    for (let a = 0; a < TWO_PI; a += TWO_PI / sides) {
      let r = this.r + noise(cos(a) * 0.8, sin(a) * 0.8, frameCount * 0.01) * 20;
      let x = cos(a) * r * 0.5; // achatamos en X para forma de hoja
      let y = sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);

    // nervadura central
    stroke(50, 120);
    line(0, -this.r, 0, this.r);
    pop();
  }
}
```
#### Sketch:
```js
let movers = [];
let sun;
let noiseOffset = 0;

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 30; i++) {
    addMover();
  }
  sun = new Mover(0, 0, 0, 0, 5);
  background(255);
}

function draw() {
  background(200, 50);
  translate(width / 2, height / 2);

  // Atracción mutuag
  for (let mover of movers) {
    sun.attract(mover);
    for (let other of movers) {
      if (mover !== other) {
        mover.attract(other);
      }
    }
  }

  // Actualizar y mostrar
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
// Crear nuevo mover
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
```
### Captura de la obra:
<img width="1121" height="893" alt="image" src="https://github.com/user-attachments/assets/954953bc-f503-4d0f-a5a9-df42eed1b741" />




