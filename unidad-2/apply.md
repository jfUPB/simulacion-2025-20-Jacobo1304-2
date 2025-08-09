# Unidad 2


## 🛠 Fase: Apply
#### Actividad 8: Fase apply:
En esta fase experimentaré con una aceleración diferente, para ello responderé a los siguientes puntos:
#### Describe el concepto de tu obra generativa.
Explorando varias cosas, y haciendo experimentos con varias funciones que me parecían poco interesantes, decidí usar un fenomeno de repulsión para hacer un pequeño juego de fútbol. En donde jugadores podrán patear un balón.
#### ¿Cómo piensas aplicar el marco MOTION 101 y por qué?
Como ya vimos algo asi como una atracción hacia el mouse, planeo que con el motion 101 también haya una pelota moviendose por el canvas
#### ¿Qué algoritmo de aceleración vas a utilizar? ¿Por qué?
Haré un efecto de repulsión, en donde la aceleración empieza como una gravedad constante hacia la derecha. y cambie haciendo restas con la posición de los circulos. Estos circulos están en un vector, y se aplica un fenómeno de repulsión para cada círculo. Iba a incluir aceleraciones randoms, o algún patrón levy flight. Pero para efectos del juego lo mantuve controlado.
#### El contenido generado debe ser interactivo. Puedes utilizar mouse, teclado, cámara, micrófono, etc, para variar los parámetros del algoritmo en tiempo real.
La interactividad se basa en ubicar a tus pequeños jugadores de futbol para que pateen el baloncito y lograr meter gol. Puedes poner hasta 11 circulos y armar tu mejor jugada!
#### El código de la aplicación.
```js
let mover;
let players = [];
let maxPlayers = 11;
let goalZone;
let goalScored = false;

function setup() {
  
createCanvas(800, 600);
  mover = new Mover();
  goalZone = {
    x: 0,
    y: height / 2 -100,
    w: 50,
    h: 200
  };
}

function drawField() {
  stroke(255);
  strokeWeight(2);
  noFill();

  // Bordes del campo
  rect(0, 0, width, height);

  // Línea central
  line(width / 2, 0, width / 2, height);

  // Círculo central
  ellipse(width / 2, height / 2, 100);

  // Punto central
  fill(255);
  circle(width / 2, height / 2, 4);

  // Área de gol (portería a la izquierda)
  noFill();
  rect(goalZone.x, goalZone.y, goalZone.w, goalZone.h);

  // Línea de gol
  line(goalZone.x, goalZone.y + goalZone.h, goalZone.x + goalZone.w, goalZone.y + goalZone.h);
}

function draw() {
  background(34, 139, 34);
  drawField()
  // Dibujar la portería
  fill(0, 255, 0, 100);
  noStroke();
  rect(goalZone.x, goalZone.y, goalZone.w, goalZone.h);

  // Mostrar "GOL" si el balón entra en la portería
  if (mover.inGoal(goalZone)) {
    goalScored = true;
  }

  if (goalScored) {
    textAlign(CENTER, CENTER);
    textSize(64);
    fill(255, 255, 255);
    text("!!!GOL!!!", width / 2, height / 2);
  }

for (let p of players) {
  // Dibujar círculo azul
  fill(0, 0, 255);
  noStroke();
  circle(p.pos.x, p.pos.y, 32);

  // Dibujar dorsal
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(p.number, p.pos.x, p.pos.y);

  // Aplicar repulsión
  mover.applyRepulsion(p.pos);
}


  mover.update();
  mover.checkEdges();
  mover.show();
}

function mousePressed() {
  if (players.length < maxPlayers) {
    let player = {
      pos: createVector(mouseX, mouseY),
      number: players.length + 1
    };
    players.push(player);
  }
}


class Mover {
  constructor() {
    this.position = createVector(width / 2, height/2 );
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }

  applyRepulsion(repulsor) {
    let dir = p5.Vector.sub(this.position, repulsor);
    let d = dir.mag();
    d = constrain(d, 5, 100);
    dir.normalize();
    let strength = 100 / (d * d); // repulsión inversamente proporcional al cuadrado
    dir.mult(strength);
    this.acceleration.add(dir);
  }

  update() {

    this.acceleration.add(createVector(0.05, 0));

    this.velocity.add(this.acceleration);
    this.velocity.limit(6);
    this.position.add(this.velocity);

    // Reset aceleración
    this.acceleration.set(0, 0);
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(127);
    circle(this.position.x, this.position.y, 48);
  }

  checkEdges() {
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y *= -1;
    }

    this.position.x = constrain(this.position.x, 0, width);
    this.position.y = constrain(this.position.y, 0, height);
  }

  inGoal(goal) {
    return (
      this.position.x > goal.x &&
      this.position.x < goal.x + goal.w &&
      this.position.y > goal.y &&
      this.position.y < goal.y + goal.h
    );
  }
}
``` 
#### Un enlace al proyecto en el editor de p5.js.
[Empezar partido](https://editor.p5js.org/Jacobo1304-2/full/uqGo4Kq_U)
#### Una captura de pantalla representativa de tu pieza de arte generativo.
<img width="1004" height="736" alt="{CF0E181C-E085-4203-971B-6AFB8312590F}" src="https://github.com/user-attachments/assets/704f1ef7-2280-4e24-9674-68b3b02e52d3" />
Se puede hacer incluso un juego multijugador local y un marcador que cuente cuantas veces ha entrado el balón a la cancha.
