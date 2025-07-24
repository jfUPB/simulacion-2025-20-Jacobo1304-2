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
### Coloca en enlace a tu sketch en p5.js en tu bitácora.
### Selecciona una captura de pantalla de tu sketch y colócala en tu bitácora.

