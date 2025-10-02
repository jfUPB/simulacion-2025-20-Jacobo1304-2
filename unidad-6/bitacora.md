# Evidencias de la unidad 6

### Actividad 1
<img width="1181" height="884" alt="image" src="https://github.com/user-attachments/assets/4e1371ac-6ae2-4843-b4f5-d62b3e6cbb92" />

#### Random angle per vector
Esta obra me gusta mucho por su manejo del color, y porque a pesar de que hay algunas curvas claramente visibles, la obra está llena de un aparente caos, y de cosas que no se me ocurren intuitivamente de donde salieron.

<img width="982" height="985" alt="image" src="https://github.com/user-attachments/assets/f5cc4850-a95a-44b5-b721-4d2a8e071347" />

#### Detail from Loxodography 0.26, 2019
De esta obra, contrario a la anterior, me gusta su consistencia,y que a pesar de que usa valores random logra una apariencia tan parecida a unas grietas.
#### Qué me inspira de su trabajo?
En lo personal siento que es un muy buen referente para tomar ideas, sus trabajos son muy brutales y orgánicos, y las ideas que se le ocurren con esos algoritmos, además de que lo documenta, son muy útiles como inspiración en obras. Me quedo con el manejo de colores que usa. Y su mezcla de técnicas en las obras.
### Actividad 2

<img width="917" height="352" alt="image" src="https://github.com/user-attachments/assets/c8a3e949-38e4-4c4e-b361-58f15865fb77" />

#### ¿Qué es una fuerza de dirección (steering force)?
Una steering force es un vector resultante de restar un vector de deseo y un vector velocidad, para que un vehiculo logre variar su dirección basado en decisiones, y se repita constantemente basandose en su propio estado.
#### ¿Qué diferencia tiene este tipo de fuerza con las que ya hemos estudiado en el contexto de la simulación de agentes?
A diferencia de aplicar una gravedad al objeto que queremos que se caiga, o una fuerza de atraccion entre 2 objetos. Con la steering force podemos hacer que nuestros vehiculos tomen decisiones y hagan acciones con base en ellas. Estas acciones se ven manifestadas con la herramienta de steering, que en este caso ayuda al vehiculo a moverse por el canvas dependiendo las decisiones que tome con respecto a si mismo y un objetivo en la vida.
#### ¿Qué relación tiene la steering force con Craig Reynolds y su trabajo en simulación de comportamiento animal?
Tiene relación pues se pueden personalizar los vehiculos, y con la steering force hacer que varién su movimiento según las decisiones, y asi se pueden replicar comportamientos como andar en manada, el miedo, la atracción, la cacería entre otros.

### Actividad 3
# Resumen Flowfields y Vehicles
**1. ¿Cómo se controla la resolución del campo de flujo (tamaño de las celdas)?**  
Se define en el constructor de `FlowField` con `this.resolution = r`. Al dividir el ancho y alto por `resolution` se obtienen las filas y columnas (`cols` y `rows`).  
- `resolution` grande → celdas grandes, campo más grueso.  
- `resolution` pequeño → celdas pequeñas, campo más detallado.  

---

**2. ¿Cómo se controlan la velocidad máxima (maxspeed) y la fuerza máxima (maxforce)?**  
En el constructor de `Vehicle` se reciben como parámetros:  
```js
this.maxspeed = ms;
this.maxforce = mf;
```
**maxspeed:** limita la magnitud de la velocidad (qué tan rápido se mueve el agente).

**maxforce:** limita la fuerza de dirección o aceleración (qué tan rápido puede girar o cambiar de rumbo).

**3. ¿Cómo determina el agente qué vector del campo seguir según su posición?**  
```js
let column = constrain(floor(position.x / this.resolution), 0, this.cols - 1);
let row    = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
return this.field[column][row].copy();
```
- La posición (x, y) del vehículo se divide por la resolución.

- Se aplica floor() para convertir a índices de la cuadrícula.

- Con esos índices se accede al vector correspondiente en this.field[column][row].

** 4. Una vez que tiene el vector del campo, ¿cómo lo usa para calcular la fuerza de dirección (steering)? **
En el método follow(flow)
```js
let desired = flow.lookup(this.position);
desired.mult(this.maxspeed);                  // velocidad deseada
let steer = p5.Vector.sub(desired, this.velocity); // diferencia
steer.limit(this.maxforce);                   // limitar fuerza máxima
this.applyForce(steer);
```

- El vector del campo se multiplica por maxspeed → velocidad deseada.

- Se calcula la diferencia con la velocidad actual → fuerza de dirección (steering).

- Esa fuerza se limita con maxforce.

- Se aplica la fuerza resultante a la aceleración del vehículo.

# Parámetros y Variables Clave en Flowfields y Vehicles

## FlowField
- **resolution** → tamaño de cada celda del campo de flujo.  
- **cols** → número de columnas (`width / resolution`).  
- **rows** → número de filas (`height / resolution`).  
- **lookup(pos)** → función que devuelve el vector de flujo correspondiente a la posición `pos`.

## Vehicle
- **position** → posición actual del vehículo.  
- **velocity** → velocidad actual (vector).  
- **acceleration** → acumulación de fuerzas (se reinicia cada frame).  
- **maxspeed** → velocidad máxima que puede alcanzar el vehículo.  
- **maxforce** → fuerza máxima de giro o cambio de dirección.  
- **applyForce(force)** → suma la fuerza a la aceleración.  
- **update()** → actualiza posición y velocidad del vehículo.  
- **follow(flow)** → consulta el campo de flujo y ajusta el movimiento del vehículo.

## Steering (dirección)
- **desired** → vector deseado (dirección del flujo en la posición).  
- **steer** → vector de corrección (`desired - velocity`), limitado por `maxforce`.

## Experimento (modificaciones)
Con 1 de resolución y cambio en el patrón de flujo para usar una onda de seno:

<img width="867" height="325" alt="image" src="https://github.com/user-attachments/assets/bf44b434-d744-46b5-8665-8d129ae7f2ae" />

#### Nota: La aplicación se petó pero se ve muy cool.

Ahora con 2 de resolución se ve asi:
<img width="884" height="320" alt="image" src="https://github.com/user-attachments/assets/2b7db9d9-6f16-4737-b29c-78e64b95f28d" />

Bastante brutal en mi opinion pero el proceso sigue muy lento.

### Este es el código:

```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Flow Field Following
class FlowField {
  constructor(r) {
    this.resolution = r;
    //{!2} Determine the number of columns and rows.
    this.cols = width / this.resolution;
    this.rows = height / this.resolution;
    //{!4} A flow field is a two-dimensional array of vectors. The example includes as separate function to create that array
    this.field = new Array(this.cols);
    for (let i = 0; i < this.cols; i++) {
      this.field[i] = new Array(this.rows);
    }
    this.init();
  }
  // The init() function fills the 2D array with vectors
 init() {
  let xScale = 0.2; // frecuencia en x
  let yScale = 0.2; // frecuencia en y
  for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
      let x = i * this.resolution;
      let y = j * this.resolution;
      let angle = sin(x * xScale) * TWO_PI * 0.5 + cos(y * yScale) * TWO_PI * 0.5;
      this.field[i][j] = p5.Vector.fromAngle(angle);
    }
  }
}
  // Draw every vector
  show() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let w = width / this.cols;
        let h = height / this.rows;
        let v = this.field[i][j].copy();
        v.setMag(w * 0.5);
        let x = i * w + w / 2;
        let y = j * h + h / 2;
        strokeWeight(1);
        line(x, y, x + v.x, y + v.y);
      }
    }
  }

  //{.code-wide} A function to return a p5.Vector based on a position
  lookup(position) {
    let column = constrain(floor(position.x / this.resolution), 0, this.cols - 1);
    let row = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
    return this.field[column][row].copy();
  }
}
```

Con 32 de resolucion ya se veia bastante mas separado el flowfield, pero tuve que forzar seguridad en el codigo porque me arrojaba un error del array.

<img width="876" height="326" alt="image" src="https://github.com/user-attachments/assets/260cc813-0ed4-4311-913e-5cf802f99ef9" />


Para arreglar el error relacionado al arreglo de filas y columnas utilice esto:
```
 this.cols = Math.ceil(width / this.resolution);
    this.rows = Math.ceil(height / this.resolution);
```
Asi la division por resolucion daba un entero.
### Actividad 4: Flocking

<img width="941" height="301" alt="image" src="https://github.com/user-attachments/assets/5eecabc8-d249-4b3e-ba8e-6d3260c1e604" />

### Explica las reglas: para cada una de las tres reglas, explica con tus propias palabras:
### Separación (Separation): evitar el hacinamiento con vecinos cercanos.

 - ¿Cuál es el objetivo de la regla?
   Evitar chocarse con tus compañeros, para esquivar cualquier tipo de posible colisión.
 - ¿Cómo calcula el agente la fuerza de dirección correspondiente? 
   Calcula un vector apuntando lejos de los vecinos demasiado cercanos, ignorandose a si mismo para no incurrer en calculos indeseados.
### Alineación (Alignment): dirigirse en la misma dirección promedio que los vecinos cercanos.
 - ¿Cuál es el objetivo de la regla?
   Alinear el agente con los demás en un circulo con radio determinado, para que compartan una misma dirección.
 - ¿Cómo calcula el agente la fuerza de dirección correspondiente? 
  Calcula un vector que ajusta tu dirección hacia la dirección promedio de los vecinos cercanos.
 
### Cohesión (Cohesion): moverse hacia la posición promedio de los vecinos cercanos.
- ¿Cuál es el objetivo de la regla?
  Mantener la posicion en un centro con sus compañeros, para que se muevan junticos en grupito.
- ¿Cómo calcula el agente la fuerza de dirección correspondiente? 
  Calcula un vector que apunta hacia la posición promedio (centro de masa) de los vecinos cercanos
### Identifica parámetros clave: localiza en el código las variables que controlan:
# Parámetros y variables clave — Boids / Flocking

## Variables de la clase `Boid` (estado y límites)
- `this.position`  
  - **Qué**: vector (x,y) con la posición actual del boid.  
  - **Dónde**: `constructor(x,y)` y se actualiza en `update()`.  
  - **Efecto**: determina dónde está el boid en el espacio y qué vecinos se consideran.

- `this.velocity`  
  - **Qué**: vector velocidad actual.  
  - **Dónde**: `constructor`, modificado en `update()` y usado en `show()` para orientar el triángulo.  
  - **Efecto**: dirección y rapidez instantánea del boid.

- `this.acceleration`  
  - **Qué**: vector que acumula fuerzas aplicadas (se resetea cada frame).  
  - **Dónde**: `applyForce()` y `update()` (`this.acceleration.mult(0)`).  
  - **Efecto**: determina el cambio de velocidad por frame (A = F).

- `this.r`  
  - **Qué**: radio / tamaño del boid (en píxeles).  
  - **Dónde**: `constructor` (`this.r = 3.0`).  
  - **Efecto**: tamaño gráfico y posible margen para colisiones / wraparound.

- `this.maxspeed`  
  - **Qué**: velocidad máxima (magnitud) permitida.  
  - **Dónde**: `constructor` (`this.maxspeed = 3`) y aplicada en `update()` con `this.velocity.limit(this.maxspeed)`.  
  - **Efecto**: controla qué tan rápido puede moverse un boid (afecta reacción y estilo del enjambre).

- `this.maxforce`  
  - **Qué**: máxima magnitud de fuerza de steering (aceleración máxima).  
  - **Dónde**: `constructor` (`this.maxforce = 0.05`) y aplicada en `seek()`, `separate()`, `align()`.  
  - **Efecto**: controla la maniobrabilidad; valores bajos → giros suaves, valores altos → giros bruscos.

## Parámetros de comportamiento / reglas (por boid)
- `desiredSeparation` (en `separate(boids)`)  
  - **Qué**: distancia (px) a la que se considera que un vecino está “demasiado cerca”.  
  - **Dónde**: `let desiredSeparation = 25;`  
  - **Efecto**: mayor valor → más separación entre boids; menor → más cercanía / posible agrupamiento.

- `neighborDistance` (en `align(boids)` y `cohere(boids)`)  
  - **Qué**: radio (px) para considerar vecinos en alineación y cohesión.  
  - **Dónde**: `let neighborDistance = 50;` en ambos métodos.  
  - **Efecto**: define el vecindario social: mayor radio → influencias desde más lejos (mayor cohesión/alineación).

- Pesos de las fuerzas en `flock(boids)`  
  - **Qué**: multiplicadores que equilibran la influencia de cada regla.  
  - **Dónde**:
    ```js
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    ```
  - **Efecto**: ajustar estos valores cambia la conducta global (ej. aumentar `sep` hace al enjambre dispersarse más; aumentar `coh` hace que converjan).

## Variables / constantes globales y de simulación
- Número de boids (`f.boids.length` / cómo se instancia en `sketch.js`)  
  - **Qué**: cuántos agentes hay.  
  - **Efecto**: más boids → interacciones más densas y mayor coste computacional.

- `width`, `height`, `createCanvas(...)`  
  - **Qué**: dimensiones del área de simulación.  
  - **Efecto**: tamaño del espacio (influye en densidad y visualización).

## Funciones clave (lógica / flujo)
- `applyForce(force)`  
  - **Qué**: añade `force` a `acceleration`.  
  - **Efecto**: interfaz para combinar fuerzas (separation, alignment, cohesion).

- `seek(target)`  
  - **Qué**: calcula el steering vector que apunta hacia `target`.  
  - **Efecto**: base para la cohesión (steer hacia el centro) y otros comportamientos de seguimiento.

- `update()`  
  - **Qué**: integra aceleración → velocidad → posición y limita velocidad.  
  - **Efecto**: aplica la física básica cada frame.

- `borders()`  
  - **Qué**: wraparound (teletransporta al boid al otro lado del canvas si sale).  
  - **Efecto**: evita que los boids desaparezcan fuera del canvas; condiciona patrones de movimiento.

## Valores que conviene exponer para experimentar
- `this.maxspeed` (velocidad máxima) — ej. `1..6`  
- `this.maxforce` (maniobrabilidad) — ej. `0.01..0.5`  
- `desiredSeparation` — ej. `10..50`  
- `neighborDistance` — ej. `30..120`  
- Pesos: `sep`, `ali`, `coh` — ej. `sep 0..3`, `ali 0..2`, `coh 0..2`  
- `boidCount` — cantidad de boids para la simulación  
- `this.r` — tamaño visual del boid



### Experimenta con modificaciones: realiza al menos una de las siguientes modificaciones en el código, ejecuta y describe el efecto observado en el comportamiento colectivo del enjambre:
Cambia drásticamente el peso de una de las reglas (ej: pon la cohesión a cero, o la separación muy alta).
Modifica significativamente el radio de percepción (hazlo muy pequeño o muy grande).
Introduce un objetivo (target) que todos los boids intenten seguir (usando una fuerza de seek) además de las reglas de flocking, y ajusta su influencia.

<img width="871" height="488" alt="image" src="https://github.com/user-attachments/assets/4b186c4e-3b1e-42c9-a8e8-73546a239bc9" />
### Moodificaciones realizadas:
Implementé un target al que siguen todos los boids, mientras siguen aplicando las otras reglas.
Le baje un poco al radio de deteccion de vecinos, y ahora se hacen grupos más pequeños.
### Código:
<details> <summary><strong>📄 sketch.js</strong></summary>

```js
// sketch.js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let flock;
let target;

function setup() {
  createCanvas(640, 360);
  flock = new Flock();

  // Crear boids iniciales
  for (let i = 0; i < 100; i++) {
    let b = new Boid(random(width), random(height));
    flock.addBoid(b);
  }

  // Inicialmente, el target está en el centro
  target = createVector(width / 2, height / 2);
}

function draw() {
  background(51);

  // Actualizar target con el mouse
  target.set(mouseX, mouseY);

  // Dibujar el target como un círculo rojo
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 16, 16);

  flock.run();
}
```
</details>
<details>
<summary><strong>🕊️ Boid.js </strong></summary>

**Qué hace:** define la clase `Boid` con estado (posición, velocidad, aceleración), implementa las tres reglas de flocking (separación, alineación, cohesión), la función `seek()` y la integración física (`applyForce`, `update`). Además incorpora la fuerza de `seek(target)` para que los boids persigan el objetivo global.

```javascript
// Boid.js
// Boid class
// Métodos para Separation, Cohesion, Alignment añadidos
// Ahora incluye fuerza de seek hacia un target

class Boid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 3.0;
    this.maxspeed = 3;     // Velocidad máxima
    this.maxforce = 0.05;  // Fuerza de giro máxima
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.show();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  flock(boids) {
    let sep = this.separate(boids);    // Separación
    let ali = this.align(boids);       // Alineación
    let coh = this.cohere(boids);      // Cohesión
    let seekTarget = this.seek(target); // Fuerza hacia el objetivo global

    // Ponderación de fuerzas
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    seekTarget.mult(0.5); // Ajusta la influencia del target

    // Aplicar fuerzas
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(seekTarget);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  show() {
    let angle = this.velocity.heading();
    fill(127);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);
    pop();
  }

  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // -------------------
  // Reglas de flocking
  // -------------------

  // Separación: alejarse de los vecinos cercanos
  separate(boids) {
    let desiredSeparation = 25;
    let steer = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Más fuerte cuanto más cerca
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alineación: ajustar dirección hacia la de los vecinos
  align(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesión: moverse hacia el centro de los vecinos
  cohere(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
  }
}
```
</details>

<details>
<summary><strong>📦 Flock.js </strong></summary>

**Qué hace:** clase simple que contiene el array `boids`, ejecuta `run()` sobre todos y permite añadir boids con `addBoid()`.


```js
// Flock.js
// Flock object
// Maneja el array de todos los boids

class Flock {
  constructor() {
    this.boids = [];
  }

  run() {
    for (let boid of this.boids) {
      boid.run(this.boids);
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
</details>
```
## Apply: Actividad 5
### Etapa 1: Decisiones e ideas de diseño:
Por ahora tengo 2 opciones:
#### Opcion 1:
Un programa que basado en la frecuencia de los sonidos vaya modificando las direcciones del flujo y el color de los vehiculos en tiempo real. Dependiendo los graves y agudos, y la amplitud en decibeles del sonido.
Tambien puede ser con la batería, para que se vea claramente que es rítmico, siento que con ciertas canciones puede ser bastante wow.

#### Opcion 2
Algo más conceptual en donde la letra del tema vaya afectando el comportamiento del flocking por ejemplo. 
Ej: Si la canción de merengue dice "nos separamos" se separan los boids.
Ej2: Si uptown funk de bruno mars dice "Stop... wait a minute" Los boids paran. Y asi.

El reto con esto es que no se si se puede identificar la letra de la canción, para hacer algo asi.

#### 3 Un flock grande  con remoras que lo sigan
Darle comportamientos bacanos al flock grande y que haya pequeños flocksitos que le hagan segunda. Como los bailarines de un cantante.
#### Componente manual
Como haremos para controlar las cosas, y tocar las visuales de esa obra como un instrumento músical?
Varias opciones que se me ocurren también aqui, basado en lo más sencillo pero efectivo:
Radio del circulo para grupos de flocking
Resolución del flowfiled.
Algo con el brillo del color, o la velocidad.

#### Cancion colaborativa:
Con una canción en donde cante un hombre y una mujer, tener un array de boids para el hombre y un array de boids para la mujer, y aparecen en los momentos que canta cada uno, y cuando cantan los 2, salen los 2

#### Posibles temas:
Bohemian rhapsody. Buena separacion de partes, en la parte de la opera se puede jugar bastante, oscureciendo el fondo yd emás.
Billie Jean - Buen beat y los instrumentos lo siguen bastante.
Back in black - AC/DC Misma razon, beat muy marcado y separacion de partes clara.
Die With a smile (Colaboracion)
Colgando en tus manos. (Colaboracion)
Enter Sand man - Muy bacana.

### Recursos clave:
let fft = new p5.FFT();
let spectrum = fft.analyze();
let bass = fft.getEnergy("bass");
let treble = fft.getEnergy("treble");



### El código fuente completo de tu sketch en p5.js.

### Un enlace a tu sketch en el editor de p5.js.

### Capturas de pantalla mostrando tu pieza en acción.








