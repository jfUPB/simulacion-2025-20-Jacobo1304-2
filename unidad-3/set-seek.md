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
El coeficiente de fricción lo hice interactivo y fui jugando un poco con esto. Para ya después quitarle el negativo y volverlo positivo, algo que si afectaba, pues en vez de reducir, aumentaba la fuerza.
Para el drag o resistencia de liquidos y aire experimente con el area de los objetos: 
Cambie el objeto a rectangulos, e inclui un area en cada uno para comparar sus bajadas según su área.
### Conceptualmente cómo se relaciona la fuerza con la obra generativa.
Conceptualmente en la fricción, nos permite afectar directamente el "material" del suelo, pudiendo simular algo como el hielo o un suelo de madera, solo con el scroll. También nos permite salirnos de la realidad con el enter.
En la resistencia del aire, nos permite ver como diferente tamaño en cajas afectan su caida a un liquido como el agua, o si se quiere algo más viscoso como la miel.
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
Aqui el mover:
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
Para fluidos:
Sketch
```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Un solo Mover en el centro con fuerzas (gravedad + resistencia de fluido)

let mover;   // un solo objeto
let liquid;  // el fluido

function setup() {
  createCanvas(640, 240);

  // Crear el mover en el centro
  mover = new Mover(width / 2, 50, 2, random(100,200));

  // Crear liquid en la mitad inferior
  liquid = new Liquid(0, height / 2, width, height / 2, 0.1);
}

function draw() {
  background(255);

  // Dibujar el fluido
  liquid.show();

  // ¿El mover está dentro del líquido?
  if (liquid.contains(mover)) {
    // Calcular y aplicar fuerza de arrastre
    let dragForce = liquid.calculateDrag(mover);
    mover.applyForce(dragForce);
  }

  // Fuerza de gravedad proporcional a la masa
  let gravity = createVector(0, 0.1 * mover.mass);
  mover.applyForce(gravity);

  // Actualizar y dibujar
  mover.update();
  mover.show();
  mover.checkEdges();
}

function mousePressed() {
  // Reiniciar el mover en el centro
  mover = new Mover(width / 2, 50, 2, random(20,200));
}
```
Mover:
```js
class Mover {
  constructor(x, y, mass, area) {
    this.mass = mass;

    this.width = random(area * 0.1, area * 1.0);
    this.height = 50;

    this.area = this.width * this.height; // área frontal simple

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

    
    rect(this.position.x, this.position.y, this.width, this.height);
  }

  checkEdges() {
    // Suelo
    if (this.position.y > height - this.height / 2) {
      this.velocity.y *= -0.9;
      this.position.y = height - this.height / 2;
    }

    // Techo
    if (this.position.y < this.height / 2) {
      this.velocity.y *= -0.9;
      this.position.y = this.height / 2;
    }

    // Bordes laterales
    if (this.position.x > width - this.width / 2) {
      this.velocity.x *= -0.9;
      this.position.x = width - this.width / 2;
    }
    if (this.position.x < this.width / 2) {
      this.velocity.x *= -0.9;
      this.position.x = this.width / 2;
    }
  }
}

```
Liquid:
```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class Liquid {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  // Is the Mover in the Liquid?
  contains(mover) {
    let pos = mover.position;
    return (
      pos.x > this.x &&
      pos.x < this.x + this.w &&
      pos.y > this.y &&
      pos.y < this.y + this.h
    );
  }

  // Calculate drag force.,
  calculateDrag(mover) {
  let speedSq = mover.velocity.magSq();

  // Área efectiva del mover (ejemplo: su ancho)
  let surfaceArea = mover.area * 0.0005;

  let dragMagnitude = this.c * speedSq * surfaceArea;

  let dragForce = mover.velocity.copy();
  dragForce.mult(-1);
  dragForce.setMag(dragMagnitude);

  return dragForce;
}

  show() {
    noStroke();
    fill(220);
    rect(this.x, this.y, this.w, this.h);
  }
}
```
### Captura una imagen representativa de tu ejemplo.

