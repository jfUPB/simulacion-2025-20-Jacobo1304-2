# Evidencias de la unidad 7

### Actividad 1:

#### Tu análisis de 3-4 ejemplos de Ji Lee, explicando cómo logran la conexión palabra-imagen.
<img width="378" height="382" alt="image" src="https://github.com/user-attachments/assets/befc237d-03f8-4cc0-8902-2cddea2c4d0e" />

Por el canal

<img width="379" height="385" alt="image" src="https://github.com/user-attachments/assets/a38b9b26-575a-4d9b-adc8-d57be704513e" />

Ahora  ves la I, ahora no...

<img width="379" height="381" alt="image" src="https://github.com/user-attachments/assets/050238ea-1855-4e78-aba7-a17a6c97c5a8" />

Parche en el ojo, dibujando el concepto en la misma plabra y de manera muy sencilla


<img width="382" height="382" alt="image" src="https://github.com/user-attachments/assets/e4946a74-541a-42ff-9a33-337c2a5371b3" />

Esta me parece brutal, pues el mismo eclipse está pintado en la plabra sin afectar en absoluto la escritura.

#### Tus propias ideas (descripción o boceto simple) para representar visualmente 2-3 palabras distintas de forma estática.

#### OJO - Sencillo, se suele usar para estas cosas, pues se le puede pintar 

#### Shampoo - Las últimas 2 O pueden ser burbujas.

#### Gol - La o puede ser el balón y se puede dibujar un arco atrás, quedaría mejor con animación.

### Actividad 2:
Experimenté con el código de patt vira y logré hacer este entorno con circulos y cuadrados:
<img width="621" height="626" alt="image" src="https://github.com/user-attachments/assets/24b47535-4eb8-498d-9e43-d6d61eff5871" />

Cambié uno de los códigos de mi pastora Patt Vira en donde tenia un suelo y generaba cuadrados con el mouse usando matter y p5.js
Lo cambie por circulos que rebotan, añadiendole restituion.

Asi quedo la clase sketch:
```js
const { Engine, Body, Bodies, Composite } = Matter;

let engine;
let circles = [];
let ground;

function setup() {
  createCanvas(400, 400);
  engine = Engine.create();

  // Crear el suelo
  ground = new Ground(200, 350, 400, 20);
}

function draw() {
  background(220);
  Engine.update(engine);

  // Dibujar los círculos
  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
  }

  // Dibujar el suelo
  ground.display();
}

// Cada clic crea un círculo nuevo
function mousePressed() {
  circles.push(new Ball(mouseX, mouseY, random(10, 25))); // radio aleatorio
}
```

y Asi la clase Ball:

```js

class Ball {
  constructor(x, y, r) {
    this.r = r;
    // restitution controla el rebote (0 = sin rebote, 1 = muy elástico)
    this.body = Bodies.circle(x, y, this.r, {
      restitution: random(0.4,1),
      friction: 0.5
    });
    Composite.add(engine.world, this.body);
  }

  display() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    noStroke();
    fill(100, 150, 255);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}
```

Este es el [Link al codigo](https://editor.p5js.org/Jacobo1304-2/sketches/OFclV4Q5Z)
## Apply
Idea: RAP. lA r O LA p TIRAN UN MICROFONO.

<img width="480" height="640" alt="image" src="https://github.com/user-attachments/assets/d7cd2ac5-fa15-4f01-a1b1-eeb0316fdfbc" />


<img width="1210" height="930" alt="image" src="https://github.com/user-attachments/assets/b5f04992-7a5d-4cf7-bcc1-f592aaaa8f02" />

Este es el [Link a mi codigo](https://editor.p5js.org/Jacobo1304-2/full/EG2rUTy6j)

#### Como lo hice
Se hicieron letras estaticas excepto la i, que es un cuerpo, que empieza com propiedad isStatic, y despues de un tiempo se pone en falso.
Se puso un png de gorra en la P para darle apariencia más rapera, y el roesto de letras hacen un shake con "rotate" y un seno, para simular un scratch.

Todo esto se mezcla con efectos de sonido y obtenemos el resultado final.

Autoevaluación: Hice todas las actividades asi que 5.
