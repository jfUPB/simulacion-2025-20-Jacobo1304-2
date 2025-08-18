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
#### Para la gravitación:
Sketch
```js
let movers = [];
let attractor;
let G = 10;

function setup() {
  createCanvas(640, 320);

  // Creamos un primer mover
  movers.push(new Mover(width / 2, 50, 5, 200,randomColor()));

  // Creamos el attractor (puede ser una clase distinta o un Mover especial)
  attractor = new Attractor(width / 2, height / 2, 5);
}

function draw() {
  background(0, 5);

  // Recorremos todos los movers
  for (let m of movers) {
    // Fuerza de atracción desde el attractor
    let force = attractor.attract(m);
    m.applyForce(force);

    // Actualizamos y mostramos cada mover
    m.update();
    m.checkEdges();
    m.show();
  }

  // Aplicamos fuerzas al attractor (si quieres que también se mueva)
  let gravity = createVector(0, 0.1);
  attractor.applyForce(gravity);

  if (mouseIsPressed) {
    let wind = createVector(0.5, 0);
    attractor.applyForce(wind);
  }

  // Actualizamos y mostramos el attractor solo una vez
  attractor.update();
  attractor.checkEdges();
  attractor.show();
}

// Agregar más movers con la barra espaciadora
function keyPressed() {
  if (key === ' ') {
    movers.push(new Mover(random(width), 50, random(2, 8), random(50, 200), randomColor()));
  }
}
function randomColor() {
  return color(random(0,255), random(0,255), random(0,255));
}

```
Mover
```js
class Mover {
  constructor(x, y, mass, c) {
    this.mass = mass;
    this.radius = mass * 8;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.c = c
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
    stroke(255);
    strokeWeight(3);
    fill(this.c);
    circle(this.position.x, this.position.y, this.radius * 2);
  }
   checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
     else if (this.position.y<0){
       this.velocity.y *=-1
       this.position.y = 0;
     }
  }
}
```
Attractor
```js
// Attractor ahora es un Mover
class Attractor extends Mover {
  constructor(x, y, mass) {
    super(x, y, mass); // hereda de Mover
    this.dragOffset = createVector(0, 0);
    this.dragging = false;
    this.rollover = false;
  }

  attract(mover) {
    let force = p5.Vector.sub(this.position, mover.position);
    let distanceSq = force.magSq();
    distanceSq = constrain(distanceSq, 25, 500); // límites ajustados
    let strength = (G * this.mass * mover.mass) / distanceSq;
    force.setMag(strength);
    return force;
  }

  show() {
    strokeWeight(4);
    stroke(255,200,0);
    fill(255, 255,0 );
    circle(this.position.x, this.position.y, this.radius * 2);
  }

  // Métodos de interacción con mouse
  handlePress(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.radius) {
      this.dragging = true;
      this.dragOffset.x = this.position.x - mx;
      this.dragOffset.y = this.position.y - my;
    }
  }

  handleDrag(mx, my) {
    if (this.dragging) {
      this.position.x = mx + this.dragOffset.x;
      this.position.y = my + this.dragOffset.y;
    }
  }

  stopDragging() {
    this.dragging = false;
  }
}

```

### Captura una imagen representativa de tu ejemplo.
#### Fricción:
<img width="1584" height="748" alt="{CA35B09C-CD43-4425-A1AA-50487C3EF405}" src="https://github.com/user-attachments/assets/1f359d31-3fff-47aa-a0ab-277aa199e5d6" />

#### Resistencia y drag:
<img width="809" height="324" alt="{66CFCC64-2B0E-42D1-B3CD-D65ABFBF52C6}" src="https://github.com/user-attachments/assets/fee5abc9-b8f7-408c-85d0-e1684ae87555" />

#### Gravitación:
<img width="849" height="442" alt="{E397650E-FE58-4575-939C-5FC87485F1B8}" src="https://github.com/user-attachments/assets/6e55cf2d-e130-48a0-9c42-8414d764843c" />





