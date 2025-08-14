# Unidad 3

## 🔎 Fase: Set + Seek

### Inventa tres obras generativas interactivas, uno para cada una de las siguientes fuerzas:

### Fricción.
### Resistencia del aire y de fluidos.
### Atracción gravitacional.
### Explica cómo modelaste cada fuerza.
Para la fricción lo mantuve simple y experimenté con 2 cosas:
El coeficiente de fricción
El multiplicador -1 (completo fracaso pero aprendí, pues se puede multiplicar por -200 y no pasa nada, se normaliza.) 
El coeficiente de fricción lo hice interactivo y fui jugando un poco con esto. Para ya des
### Conceptualmente cómo se relaciona la fuerza con la obra generativa.
### Copia el enlace a tu ejemplo en p5.js.
### Copia el código.
#### Para fricción:
```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let mover;
let frictionCoef = 0.05;
let enterPressed = false;

function setup() {
  createCanvas(640, 240);
  mover = new Mover(width / 2, 30, 5);
  createP('Click mouse to apply wind force.');
}
function mouseWheel(event) {
  if (event.deltaY > 0) {
    frictionCoef += 0.01;
  } else {
    frictionCoef -= 0.01;
  }
  frictionCoef = constrain(frictionCoef, 0, 10);
  return false;
}

function draw() {
  background(255);

  let gravity = createVector(0, 10);
  //{!1} I should scale by mass to be more accurate, but this example only has one circle
  mover.applyForce(gravity);
// Mostrar fricción
  fill(0);
  textSize(16);
  text("Fricción: " + frictionCoef.toFixed(2), 10, 20);
  
 
  
  if (mouseIsPressed) {
    let wind = createVector(0.5, 0);
    mover.applyForce(wind);
  }

  if (mover.contactEdge()) {
  let friction = mover.velocity.copy();
  if (enterPressed) {
    friction.mult(1);
    console.log("enter tocado, multiplicador de friccion es: 1");
  } else {
    friction.mult(-1);
    console.log("enter no tocado, multiplicador de friccion es: -1")
  }
  friction.setMag(frictionCoef);
  mover.applyForce(friction);
}


  mover.bounceEdges();
  mover.update();
  mover.show();
}
function keyPressed() {
  if (keyCode === ENTER) {
    enterPressed = true;
  }
}

function keyReleased() {
  if (keyCode === ENTER) {
    enterPressed = false;
  }
}
```
```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class Mover {
  constructor(x, y, m) {
    this.mass = m;
    this.radius = m * 8;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(127, 127);
    circle(this.position.x, this.position.y, this.radius * 2);
  }

  contactEdge() {
    // The mover is touching the edge when it's within one pixel
    return (this.position.y > height - this.radius - 1);
  }

  bounceEdges() {
    // A new variable to simulate an inelastic collision
    // 10% of the velocity's x or y component is lost
    let bounce = -0.9;
    if (this.position.x > width - this.radius) {
      this.position.x = width - this.radius;
      this.velocity.x *= bounce;
    } else if (this.position.x < this.radius) {
      this.position.x = this.radius;
      this.velocity.x *= bounce;
    }
    if (this.position.y > height - this.radius) {
      this.position.y = height - this.radius;
      this.velocity.y *= bounce;
    }
  }

}
```
### Captura una imagen representativa de tu ejemplo.
