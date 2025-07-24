# Unidad 1

## 🛠 Fase: Apply
# Unidad 1

## 🛠 Fase: Apply
### Un texto donde expliques el concepto de obra generativa.
Para la interactividad de esta obra usaré el mouse, haciendo que el programa reaccione al hacer click, y mi idea inicial es mostrar como si se hubiera roto un vidrio, en donde al presionar en la pantalla el origen de la ruptura sea en el cursor y de ahi se desprendan una cantidad aleatoria de lineas que zigzageen con intervalos aleatorios. como un walker diagonal.

### Copia el código en tu bitácora.
El codigo inicial de la primera sesion es este:
```js
function setup() {
  createCanvas(1000, 1000);
  background(220);
}

function draw() {
  background(220); // Limpia el canvas cada frame para que el punto desaparezca cuando sueltes
  
  if (mouseIsPressed) {
    fill(255, 0, 0);
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);
  }
}

```
Y planeo combinarlo con el walker:
```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker;
let xPresionada;
let yPresionada
function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(255);
}

function draw() {
  walker.step();
  walker.show();
}
function onMousePressed()
{
  
}
class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(0);
    point(mouseX, mouseY);
  }

  step() {
    const choice = floor(random(4));
    if (choice == 0) {
      this.x++;
    } else if (choice == 1) {
      this.x--;
    } else if (choice == 2) {
      this.y++;
    } else {
      this.y--;
    }
  }
}

```
Añadimos luego una modificacion para que el punto no se mueva siempre con el mouse y el fondo negro, quedandonos asi
```js
let clickX = null;
let clickY = null;
let clicked = false;

function setup() {
  createCanvas(1000, 1000);
  background(220);
}

function draw() {
  background(0);

  if (clicked) {
    fill(255);
    noStroke();
    ellipse(clickX, clickY, 10, 10);
  }
}

// Cuando se presiona el mouse
function mousePressed() {
  clickX = mouseX;
  clickY = mouseY;
  clicked = true;
}

// Cuando se suelta el mouse
function mouseReleased() {
  clicked = false;
}
```
Idea inicial de cambio de dirección:
<img width="1721" height="683" alt="image" src="https://github.com/user-attachments/assets/cb6afaaa-4c1f-4810-8e46-bb58063a22bc" />

Cambio de logica para angulos más sutiles y ramificación:
<img width="1724" height="655" alt="image" src="https://github.com/user-attachments/assets/c35ceb69-18b0-4b9a-808c-0657cfa63d9b" />

Código final
```js
let clickX = null;
let clickY = null;
let clicked = false;
let walkers = [];

function setup() {
  createCanvas(1000, 1000);
  background(0);
}

function draw() {
  if (clicked) {
    fill(255);
    noStroke();
  //  ellipse(clickX, clickY, 10, 10);

    for (let w of walkers) {
      w.step();
      w.show();
    }
  }
}

function mousePressed() {
  clickX = mouseX;
  clickY = mouseY;
  clicked = true;
  walkers = [];

  // Inicial: 4 diagonales clásicas
  let angles = [PI / 4, (3 * PI) / 4, (5 * PI) / 4, (7 * PI) / 4];
  for (let angle of angles) {
    walkers.push(new Walker(clickX, clickY, angle));
  }
}
function mouseReleased() {
  clicked = false;
  background(0);
}
class Walker {
  constructor(x, y, initialAngle) {
    this.pos = createVector(x, y);
    this.baseAngle = initialAngle; // Guardamos dirección base
    this.dir = p5.Vector.fromAngle(initialAngle);
    this.t = 0; // Tiempo independiente para cada Walker
  }

  step() {
   
    let variacionAngular = map(noise(this.t), 0, 1, -PI/8, PI/8);
    let newAngle = this.baseAngle + variacionAngular;
    this.dir = p5.Vector.fromAngle(newAngle);
    this.t += 0.01;

    // Avanzar
    this.pos.add(this.dir);

    // Posibilidad de ramificar (a gusto del que juegue)
    if (random() < 1 / 400) {
      this.branch();
    }
  }
  show() {
    stroke(255);
    point(this.pos.x, this.pos.y);
  }
  branch() {
    let currentAngle = this.dir.heading();
    let angle1 = currentAngle + radians(45);
    let angle2 = currentAngle - radians(45);

    walkers.push(new Walker(this.pos.x, this.pos.y, angle1));
    walkers.push(new Walker(this.pos.x, this.pos.y, angle2));
  }
}
```
### Coloca en enlace a tu sketch en p5.js en tu bitácora.
[enlace](https://editor.p5js.org/natureofcode/sketches/UGJqLCZb_)
### Selecciona una captura de pantalla de tu sketch y colócala en tu bitácora.
Con variacion angular -PI,PI.
<img width="851" height="788" alt="image" src="https://github.com/user-attachments/assets/59236f04-f40f-45b1-93f2-83557607cce5" />

Con variacion angular menor para cambios más suaves:
<img width="863" height="782" alt="image" src="https://github.com/user-attachments/assets/c873cb98-77c8-4204-a64f-451ad1eb7936" />


