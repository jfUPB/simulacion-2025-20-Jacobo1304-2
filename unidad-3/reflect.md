# Unidad 3


## 🤔 Fase: Reflect

### Actividad 11
#### Parte 1: recuperación de conocimiento (Retrieval Practice)

#### Escribe la ecuación vectorial de la segunda ley de Newton y explica cada uno de sus componentes.
F = M*A en donde F es fuerza, M es masa y A es aceleración. También se puede entender como que la aceleración puede considerarse como la suma de fuerzas dividida la masa.
#### ¿Por qué es necesario multiplicar la aceleración por cero en cada frame del método update()?
Es para resetearla, y que no se acumule de maneras raras, si estamos modelando fuerzas y queremos lo s efectos que estamos buscando, hay que setear a 0 para volver a aplicarle una fuerza el siguiente frame, de no ser asi, habría un comportamiento erratico y poco predecible.
#### Explica la diferencia entre paso por valor y paso por referencia cuando aplicamos fuerzas a un objeto.
Cuando aplicamos fuerzas a un objeto estamos usando una función que recibe un parametro force, ese parámetro es una referencia directa al valor que se está usando, y si se llega a modificar desde la función en la que lo llamamos se afectaría el original, por eso usamos metodos como el Vector.Copy, que nos permite pasarle el * VALOR * de la referencia a un objeto nuevo, y con ese si podemos jugar, pues solo pasamos el valor y no estamos referenciando directamente el original.
#### ¿Cuál es la diferencia conceptual entre modelar fuerzas (como fricción, gravedad) y simplemente definir algoritmos de aceleración?
La diferencia principal que veo es que las fuerzas se pueden acumular, al aplicar algoritmos de aceleración tenemos ese unico algoritmo y ya, pero al modelar las fuerzas podemos usar el principio de la sumatoria de fuerzas para usar varias y ver esos comportamientos acumuulados.

#### Parte 2: reflexión sobre tu proceso (Metacognición)

¿Qué fue lo más desafiante en la Actividad 10 (problema de los n-cuerpos)? ¿El concepto creativo, la implementación de las fuerzas o la integración de la interactividad?
Definitivamente el guiño a Daniel Kalder, todo el marco de movimiento ya lo teníamos pero encontrar algo que hiciera referencia al escultor dinámico fue retador, al final decidí irme por lo simple y mantener los colores y formas, a la vez de suavizar el movimiento.
¿Las fuerzas que modelaste produjeron el comportamiento que esperabas? Describe un momento “sorpresa” (esperado o inesperado) durante el desarrollo.
En su mayoría si, pues me basé mucho en el ejemplo del sol, pero claramente no todo es perfecto y surgen cosas inesperadas, en este caso fue con el Levy Flight, en donde en mi cabeza con una probabilidad baja las hojas (bodies) iban a cambiar con una probabilidad baja a color morado, y se iban a quedar asi, lasitmosamente como eso se llama en el draw cada frame, solo dura 1 frame ese cambio, y al final se quedó viendo como un efecto morado raro, como si cada hoja estuviera buggeada en la matrix.
¿Cómo ha cambiado tu forma de pensar sobre la “física” en el arte generativo después de esta unidad?
Ha cambiado mucho pues, esa física compleja de segundo semestre se simplifica bastante con esta manera de verlo, y me asombra ver que con tan pocas lineas de código se pueda generar movimientos tan orgánicos.
Si tuvieras una semana más, ¿Qué otras fuerzas te gustaría modelar o cómo mejorarías tu simulación del problema de los n-cuerpos?
Añadiría más fluidez, más variabilidad, pues el noise me da una muy poca, mejoraría el aspecto visual general.

### Actividad 12
Intercambia la URL de tu bitácora con un compañero.
Analiza su Actividad 10 (problema de los n-cuerpos). Ejecuta su simulación, lee su concepto y revisa su código.
<img width="822" height="831" alt="{0A87BB32-15DE-427A-82C3-1C90807F9B0C}" src="https://github.com/user-attachments/assets/8fcee8c4-f860-4c49-bce5-159bca096cba" />
<Details >
  <Summary>Código del bro</Summary>
  
```js
let squares = [];
let numSquares = 10;
let G = 2;
let mouseStrength = 20;
let maxSpeed = 5;

function setup() {
  createCanvas(600, 600);
  noStroke();
  for (let i = 0; i < numSquares; i++) {
    squares.push(new BlueSquare());
  }
}

function draw() {
  background(20, 30, 60);

  for (let i = 0; i < squares.length; i++) {
    for (let j = i + 1; j < squares.length; j++) {
      let force = squares[i].attract(squares[j]);
      squares[i].applyForce(force);
      squares[j].applyForce(p5.Vector.mult(force, -1));
    }
  }

  let mousePos = createVector(mouseX, mouseY);
  for (let s of squares) {
    let dir = p5.Vector.sub(mousePos, s.pos);
    let d = constrain(dir.mag(), 5, 50); 
    dir.normalize();
    let strength = (mouseStrength * s.mass) / (d * d);
    dir.mult(strength);
    s.applyForce(dir);
  }

  for (let s of squares) {
    s.update();
    s.display();
  }
}

class BlueSquare {
  constructor() {
    this.reset();
    this.alpha = random(50, 200);
    this.fadeSpeed = random(0.5, 2);
    this.fadingOut = random([true, false]);
  }

  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(0.5);
    this.acc = createVector(0, 0);
    this.size = random(80, 200);
    
    this.mass = randomGaussian(50, 15); 
    this.mass = constrain(this.mass, 10, 100);
    
    this.col = color(random(0, 100), random(50, 150), random(150, 255));
  }

  applyForce(f) {
    let force = p5.Vector.div(f, this.mass);
    this.acc.add(force);
  }

  attract(other) {
    let dir = p5.Vector.sub(this.pos, other.pos);
    let d = constrain(dir.mag(), 10, 200);
    dir.normalize();
    let strength = (G * this.mass * other.mass) / (d * d);
    dir.mult(strength);
    return dir;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    if (this.fadingOut) {
      this.alpha -= this.fadeSpeed;
      if (this.alpha <= 0) {
        this.reset();
        this.alpha = 0;
        this.fadingOut = false;
      }
    } else {
      this.alpha += this.fadeSpeed;
      if (this.alpha >= 255) {
        this.alpha = 255;
        this.fadingOut = true;
      }
    }
  }

  display() {
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}
```
</Details>

En tu propia bitácora, escribe una retroalimentación constructiva para tu compañero, evaluando:
#### Claridad del Concepto: ¿La obra visual refleja la inspiración en las esculturas cinéticas de Calder y el problema de los n-cuerpos?
Veo claramente el problema  de los N-cuerpos y con los cuadrados si logro aprecial algo de cinética de calder, pues son movimientos suaves que van interactuando con el mouse. 
Implementación de Fuerzas: ¿Se aplican correctamente las leyes de Newton? ¿Las fuerzas se acumulan apropiadamente?
Si, asi es, usa mtion 101 apropiadamente, resetea la aceleraci[on, y divide bien por la masas con el valor en una copia.
Creatividad en el Modelado: ¿El modelado de fuerzas es interesante y genera comportamientos únicos?
Juego muy bien con los fades de los cuadrados, el numero de cuadrados es personalizable, si me parece unico.
Calidad de la Interactividad: ¿La interacción permite explorar diferentes aspectos del sistema de fuerzas?
En este caso si es más limitado, pues la interacción que tiene es una simple aceleración hacia el mouse (usando la posición actual del mouse como un attractor) por lo que solo se puede ver esa interacción con las fuerzas.
Conversa con tu compañero sobre las obras que cada uno creó. En tu bitácora, comenta:
¿Qué fue lo que más te llamó la atención del trabajo de tu compañero?
QUe es bastante fluido, solo tiene un archivo sketch, en donde saca su clas e BlueSquare, y ahi puede personalizar el numero de cuadrados y demás parpametros. Añadiría más interacción.
¿Qué aprendiste de su enfoque para modelar fuerzas?
Que la atracción mutua puede mezclarse con el attractor al mouse que vimos antes.
¿Qué técnica o idea de su implementación te gustaría aplicar en tus futuros proyectos?
El fade in y fade out me pareció muy interesante, definitivamente una técnica que anotaré.

### Actividad 13
Continuar: ¿Qué actividad o concepto de esta unidad te resultó más “revelador” para entender las fuerzas en el arte generativo?
Poder ver con mis propios ojos como la sumatoria de fuerzas actua tan organicamente usando el modelo de Shiffman.
Dejar de hacer: ¿Hubo alguna actividad que te pareció redundante o menos efectiva para comprender el modelado de fuerzas?
No, todas me parecieron valiosas para la comprensión.
Progresión conceptual: ¿El paso de manipular aceleración directamente (unidad 2) a modelar fuerzas (unidad 3) te pareció una progresión natural y efectiva? ¿Por qué?
Me pareció bastante efectiva, pues oabordamos primero el marco de motion 101, vemos como la aceleración lo puede afectar, y luego vemos formas mas complejas de afectar esa aceleración, asi que todo fue escalando bien.
Conexión arte-física: ¿Cómo te ha ayudado esta unidad a ver la conexión entre conceptos físicos y expresión artística? ¿Te sientes más cómodo “jugando” con las leyes de la física en tus creaciones?
Fue un reto por la limitante que hubo en términos del guiño a shiffman, por alguna razón no podía separar el ejercicio de imaginar planetas orbitando a algo, pero veo que se puede hacer mucho más, y con un poco de cabeza usar este movimiento para crear arte muy bacano.
Comentario adicional: ¿Algo más que quieras compartir sobre tu experiencia explorando fuerzas en el arte generativo?
Muy buena unidad, ¡sigamos adelante!

