# Evidencias de la unidad 5

#### Correcciones y añadiduras:
Despues de aprender como subir el proyecto desde visual studio a p5.js, por fin puedo compartir la obra por aca.

[Link a la obra ya subida en p5.js](https://editor.p5js.org/Jacobo1304-2/sketches/nsLyWiOWz)

<details>
  <summary>Sketch</summary>

```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Smoke Particle System

// A class to describe a group of Particles
// An ArrayList is used to manage the list of Particles

class Emitter {

  constructor(x, y, img1, img2, col) {
    this.particles = []; // Initialize the arraylist
    this.origin = createVector(x,y); // Store the origin point
    this.img1 = img1; // primary texture
    this.img2 = img2; // alternate texture
    this.color = col; // per-emitter color [r,g,b]
  }

  rotate(angle) {
    // Rotate origin around (0,0) in WEBGL space
    this.origin.rotate(angle);
  }

  run() {
    for (let particle of this.particles) {
      particle.run();
    }
    this.particles = this.particles.filter(particle => !particle.isDead());
  }

  // Method to add a force vector to all particles currently in the system
  applyForce(dir) {
    // Enhanced loop!!!
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    // Randomly choose between Particle and CloudParticle
    if (random() < 0.5) {
      this.particles.push(new Particle(this.origin.x, this.origin.y, this.img1, this.color));
    } else {
      this.particles.push(new CloudParticle(this.origin.x, this.origin.y, this.img2, this.color));
    }
  }

}
```
</details> 
<details>
  <summary>Particle</summary>

```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class Particle {
  constructor(x, y, img, col) {
    this.pos = createVector(x, y);
    let vx = randomGaussian() * 0.3;
    let vy = randomGaussian() * 0.3 - 1.0;
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.lifespan = 100.0;
    this.img = img;
    this.color = col || [245, 150, 34];
    this.size = 36; // default size in pixels
  }

  run() {
    this.update();
    this.show();
  }

  // Method to apply a force vector to the Particle object
  // Note we are ignoring "mass" here
  applyForce(f) {
    this.acc.add(f);
  }

  // Method to update position
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 2.5;
    this.acc.mult(0); // clear Acceleration
  }

  // Method to display
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // This is needed for the texture to use transparency
    noStroke();
    texture(this.img);
    rectMode(CENTER); // center the square on the emitter origin
    const [r,g,b] = this.color;
    tint(r, g, b, this.lifespan);
    square(0, 0, this.size);
    pop();
  }

  // Is the particle still useful?
  isDead() {
    if (this.lifespan <= 0.0) {
      return true;
    } else {
      return false;
    }
  }
}

// New particle type: behaves the same but can carry a different texture
class CloudParticle extends Particle {
  constructor(x, y, img, col) {
    super(x, y, img, col);
    this.size *= 0.25; // 75% smaller than the default size
  }
}

```
</details> 
<details>
  <summary>Mover</summary>

```js
// filepath: c:\\Users\\Jacobo\\OneDrive - UPB\\Desktop\\6to semestre\\Simulación Para Sistemas Interactivos\\mover.js
// Motion 101 Mover that reacts to a wind force
class Mover {
  constructor() {
    this.mass = 1; // For now, keep mass = 1
    this.position = createVector(0, 30);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    // Trail + wave rendering state
    this.history = [];
    this.maxHistory = 24; // shorter tail for performance (was 50)
    this.phase = 0;       // wave phase animation
    this.noff = random(1000); // noise offset for amplitude jitter
  }

  applyForce(force) {
    // F = ma -> a = F/m
    const f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // clear acceleration each frame

    // Record history for tail with heading at this frame
    const heading = this.velocity.heading();
    this.history.push({ pos: this.position.copy(), heading });
    if (this.history.length > this.maxHistory) this.history.shift();

    // Advance phase for wave animation (slower for smaller motion)
    this.phase += 0.11;
  }

  show() {
    push();
    noFill();

    // Colors: previous touched vs current target
    let prevColor = [255, 255, 255];
    let currColor = [255, 255, 255];
    if (typeof emitters !== 'undefined' && emitters.length === 6) {
      const prev = emitters[(typeof lastTouchedIndex === 'number' && lastTouchedIndex >= 0) ? lastTouchedIndex : (windTargetIndex || 0)];
      const curr = emitters[typeof windTargetIndex === 'number' ? windTargetIndex : 0];
      if (prev && prev.color) prevColor = prev.color;
      if (curr && curr.color) currColor = curr.color;
    }

    // Draw sine-wave slices along the recent history, fading out in the tail
    const nSlices = this.history.length;
    const baseAmp = 12;  // still noticeable but lighter (was 20)
    const waveLen = 40;  // slightly shorter than 48
    const steps = 16;    // fewer points per slice (was 24)

    const stride = nSlices > 18 ? 2 : 1; // skip some slices if many

    for (let i = 0; i < nSlices; i += stride) {
      const t = i / Math.max(1, nSlices - 1); // 0 = tail, 1 = head

      // Gradient along the tail: from previous color (tail) to current color (head)
      const r = lerp(prevColor[0], currColor[0], t);
      const g = lerp(prevColor[1], currColor[1], t);
      const b = lerp(prevColor[2], currColor[2], t);

      const alpha = lerp(0, 200, 1 - t); // newer = more opaque
      const sw = lerp(0.5, 2.0, 1 - t);  // newer = thicker

      const { pos, heading } = this.history[i];
      const ampNoise = noise(this.noff + frameCount * 0.01 + i * 0.05);
      const amp = baseAmp * (0.75 + 0.5 * ampNoise);

      push();
      translate(pos.x, pos.y);
      rotate(heading);
      stroke(r, g, b, alpha);
      strokeWeight(sw);

      beginShape();
      for (let s = 0; s <= steps; s++) {
        const x = lerp(-waveLen * 0.5, waveLen * 0.5, s / steps);
        const y = sin((x / waveLen) * TWO_PI * 2 + this.phase + i * 0.08) * amp;
        vertex(x, y);
      }
      endShape();
      pop();
    }

    pop();
  }
}

```
</details> 
<details>
  <summary>Emmiter</summary>

```js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Smoke Particle System

// A class to describe a group of Particles
// An ArrayList is used to manage the list of Particles

class Emitter {

  constructor(x, y, img1, img2, col) {
    this.particles = []; // Initialize the arraylist
    this.origin = createVector(x,y); // Store the origin point
    this.img1 = img1; // primary texture
    this.img2 = img2; // alternate texture
    this.color = col; // per-emitter color [r,g,b]
  }

  rotate(angle) {
    // Rotate origin around (0,0) in WEBGL space
    this.origin.rotate(angle);
  }

  run() {
    for (let particle of this.particles) {
      particle.run();
    }
    this.particles = this.particles.filter(particle => !particle.isDead());
  }

  // Method to add a force vector to all particles currently in the system
  applyForce(dir) {
    // Enhanced loop!!!
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    // Randomly choose between Particle and CloudParticle
    if (random() < 0.5) {
      this.particles.push(new Particle(this.origin.x, this.origin.y, this.img1, this.color));
    } else {
      this.particles.push(new CloudParticle(this.origin.x, this.origin.y, this.img2, this.color));
    }
  }

}
```
</details> 


#### Actividad 2 
#### Revisa detalladamente el ejemplo 4.2: an Array of Particles.

#### Analiza el [ejemplo 4.4: a System of Systems](https://editor.p5js.org/natureofcode/sketches/-xTbGZMim).
<img width="873" height="325" alt="image" src="https://github.com/user-attachments/assets/93e3132e-6b10-45f4-b24d-e155bbdd3abc" />


### Que hice?
Apliqué el concepto de aplicar fuerza de la unidad 2, a pesar de que ahi ya se aplicaba, en la clase particula y su gravedad. Decidí repasarlo agregandole un viento a las particulas cada vez que se da click, dandole una fuerza horizontal a las particulas.
#### Como lo hice?
Simplemente añadiendo este código al sketch, logramos un viento cada vez que se da click, a las partículas actuales.
```js
function mousePressed() {
  let wind = createVector(2, 0); // fuerza hacia la derecha
  for (let p of particles) {
    p.applyForce(wind);
  }
}
```
 ⚠️ **Pequeño problema**
 con el código de arriba.
Solo sucede en un click, si se queda presionado no funciona. Asi que mejor añadi esto en el bucle draw y se soluciono el problema:
```js
 if (mouseIsPressed){
     let wind = createVector(0.01, 0); // fuerza hacia la derecha
  for (let p of particles) {
    p.applyForce(wind);
  }
  }
```
#### Analiza el [ejemplo 4.4: a System of Systems.](https://editor.p5js.org/natureofcode/sketches/s_Y3-Mmo7)

<img width="880" height="331" alt="image" src="https://github.com/user-attachments/assets/a9578608-4d09-4ac4-87c4-432f86de712c" />

#### Que hice?
Aplique el concepto de walker de la unidad 1 a los emitters que se creaban en el ejemplo, en este caso los walkers tenian un sesgo vertical. Lo hice para repasar la parte de las aleatoriedades recargadas y ver como un walker podia mover un sistema de particulas completo.
#### Como lo hice?
Simplemente cambie un poco el aspecto del fondo en sketch (negro), de la particula en particle (blanca). Y el walker importante se encuentra en la clase emitter.
```js
class Emitter {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.particles = [];
    this.trail = []; // ⬅️ aquí guardamos las posiciones previas
    this.maxTrail = 240; // ⬅️ largo máximo del trail
  }

  addParticle() {
    this.particles.push(new Particle(this.origin.x, this.origin.y));
  }

  run() {
    this.updateWalker();
    this.showWalker();

    // Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].run();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  updateWalker() {
    let stepX = floor(random(-1, 2)); // -1, 0, 1
    let stepY;

    if (this.origin.y < height / 2) {
      stepY = random() < 0.7 ? 1 : -1;
    } else {
      stepY = random() < 0.7 ? -1 : 1;
    }

    this.origin.x += stepX;
    this.origin.y += stepY;

    // Mantener dentro de pantalla
    this.origin.x = constrain(this.origin.x, 0, width - 1);
    this.origin.y = constrain(this.origin.y, 0, height - 1);

    // Guardar posición actual en el trail
    this.trail.push(this.origin.copy());
    if (this.trail.length > this.maxTrail) {
      this.trail.shift(); // eliminar la más vieja
    }
  }

  showWalker() {
    noFill();
    stroke(50, 150, 200, 150);
    beginShape();
    for (let pos of this.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();

    // Dibujar el punto actual encima
    noStroke();
    fill(150, 150, 200, 255);
    circle(this.origin.x, this.origin.y, 10);
  }
}
```
Aqui utilizamos el metodo de walker, en donde con unos random, favorece en un 70% a ir hacia abajo si esta de la mitad para arriba de la pantalla, y visceversa. Luego, avanzamos el origen en x y en Y  mostramos un pequeño trail para mostrar donde va. Utilizando shift si se supera el maxtrail, manteniendo rendimiento 🏎️.

#### Analiza el [ejemplo 4.5: a Particle System with Inheritance and Polymorphism](https://editor.p5js.org/natureofcode/sketches/2ZlNJp2EW).

<img width="875" height="338" alt="image" src="https://github.com/user-attachments/assets/4c4cc3ec-8300-47da-ba18-92af97b12023" />


### Que hice?
Repasando un poco el motion 101 crudo de la unidad 2, decidí implementar aceleraciones random como parte del polimorfismo. Y asi lograr esa explosión de confetti. Lo hice porque sentí que era apropiado para este ejemplo, pues al tener 2 particulas podríamos ver como se sentía tener 2 aceleraciones.
#### Como lo hice?
Simplemente añadíamos lo siguiente a particle y confetti.
```js
// Simple Particle class
class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    
    // aceleración inicial random entre 1 y 2
    let angle = random(TWO_PI);
    let mag = random(1, 2);
    this.acceleration = p5.Vector.fromAngle(angle).mult(mag);
    
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.lifespan = 255.0;
  }

  run() {
    let gravity = createVector(0, 0.05);
    this.applyForce(gravity);
    this.update();
    this.show();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;

    // reiniciar aceleración después de aplicar fuerzas
    this.acceleration.mult(0);
  }

  show() {
    stroke(0, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    circle(this.position.x, this.position.y, 8);
  }

  isDead() {
    return this.lifespan < 0.0;
  }
}

// Confetti extiende Particle
class Confetti extends Particle {
  constructor(x, y) {
    super(x, y);

    // aceleración inicial random entre 2 y 4
    let angle = random(TWO_PI);
    let mag = random(2, 4);
    this.acceleration = p5.Vector.fromAngle(angle).mult(mag);
  }

  show() {
    let angle = map(this.position.x, 0, width, 0, TWO_PI * 2);

    rectMode(CENTER);
    fill(127, this.lifespan);
    stroke(0, this.lifespan);
    strokeWeight(2);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    square(0, 0, 12);
    pop();
  }
}

```
Aqui usamos cosas como super, map y algo nuevo para mi que me dio chatGPT, el fromAngle, que nos sirve para vectores con direcciones aleatorias. Ya después con el polimorfismo, en el constructor de confetti le damos la aceleracion distinta a los cuadrados.

#### Analiza el [ejemplo 4.6: a Particle System with Forces](https://editor.p5js.org/natureofcode/sketches/uZ9CfjLHL).

<img width="947" height="651" alt="image" src="https://github.com/user-attachments/assets/a76c0d83-411e-4487-bc98-331a4d5e0074" />

### Que hice?
Como este sistema que se le aplicaba gravedad parecía una fuente, decidi repasar otro concepto de la unidad 1, el noise. Porque siento que me puede servir para futuras unidades.
#### Como lo hice?
Simplemente añadíamos lo siguiente a particle.
```js
class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0.0);
    this.velocity = createVector(random(-1, 1), random(-2, 0));
    this.lifespan = 255.0;
    this.mass = 1;

    // Color inicial basado en ruido
    this.noiseOffset = random(1000); // semilla única por partícula
  }

  run() {
    this.update();
    this.show();
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2.0;
  }

  show() {
    // Usamos noise para generar color
    let n = noise(this.noiseOffset, frameCount * 0.01);
    let r = map(n, 0, 1, 50, 255);
    let g = map(noise(this.noiseOffset + 100, frameCount * 0.01), 0, 1, 50, 255);
    let b = map(noise(this.noiseOffset + 200, frameCount * 0.01), 0, 1, 50, 255);

    stroke(r, g, b, this.lifespan);
    strokeWeight(2);
    fill(r, g, b, this.lifespan);
    circle(this.position.x, this.position.y, 8);
  }

  isDead() {
    return this.lifespan < 0.0;
  }
}

```

Este repaso fue más simple, pero clave para recordar los conceptos del noise y familiarizarme cada vez más con métodos como el "map" algo que no había visto mucho antes de javaScript. Aqui, se le da una semilla única a cada particula con ese random entre 1000, y luego en show, se calcula el noise con el metodo noise, el offset, y el conteo de frames, para luego pasar eso a los valores RGB con el metodo map, y luego dibujar cada particula de manera única. El color por supuesto va cambiando, ya que show se va llamando constantemente en un draw.
#### Analiza el [ejemplo 4.7: a Particle System with a Repeller](https://editor.p5js.org/natureofcode/sketches/H4TMayNak).

<img width="868" height="327" alt="image" src="https://github.com/user-attachments/assets/ed86f7cd-072a-44c2-adeb-0fcde0b29292" />


### Que hice?
Para repasar la unidad 4, meti rotacion angular al repeller, para que pudiera cambiar su posicion respecto al centro, girando su sistema de coordenadas. Esto lo hago porque siento que me servirá para el apply, pues quiero rotar algunas cosas con la rueda del mouse.
#### Como lo hice?
Añadi un metodo rotate con cambio en rotacion en el repeller, y luego con un método update position se actualiza la posición de origen, a diferencia de la vez pasada, este es un método diferente al de usar push y pop.
Simplemente añadimos este codigo a repeller y sketch.
```js
class Repeller {
  constructor(x, y) {
    this.center = createVector(x, y); // centro de rotación
    this.radius = 150
    ;                // distancia al centro
    this.angle = 0;                   // ángulo inicial
    this.power = 150;
    this.updatePosition();
  }

  updatePosition() {
    this.position = createVector(
      this.center.x + this.radius * cos(this.angle),
      this.center.y + this.radius * sin(this.angle)
    );
  }

  rotate(deltaAngle) {
    this.angle += radians(deltaAngle); // convertimos grados a radianes
    this.updatePosition();
  }

  show() {
    push();
    stroke(0);
    strokeWeight(2);
    fill(127);
    circle(this.position.x, this.position.y, 32);
    pop();
  }

  repel(particle) {
    let force = p5.Vector.sub(this.position, particle.position);
    let distance = force.mag();
    distance = constrain(distance, 5, 50);
    let strength = (-1 * this.power) / (distance * distance);
    force.setMag(strength);
    return force;
  }
}
```
Con esto logramos una distancia a un centro, y rota angularmente desde ahi, para luego guardar esa posicion. Y en show, con push y pop, dibujar la figura.
Y cambiamos esto en sketch:
```js

function mouseWheel(event) {
  if (event.delta < 0) {
    // rueda hacia arriba
    repeller.rotate(10);
  } else {
    // rueda hacia abajo
    repeller.rotate(-10);
  }
  return false; // evita el scroll de la página
```
Aqui controlamos lo anterior con la ruedita del mouse.

#### Cómo gestionan todos estos ejemplos el rendimiento y espacio? para qué nos sirve esto?

Los sistemas de partículas revisados gestionan el rendimiento principalmente con:

- **Ciclo de vida (`lifespan`)** → cada partícula tiene un tiempo limitado que se va reduciendo en cada frame.  
- **Chequeo con `isDead()`** → determina cuándo una partícula debe ser eliminada.  
- **Eliminación con `splice` recorriendo de atrás hacia adelante** → evita errores de índice y mantiene rendimiento aceptable.

### ¿Por qué es importante?
- Mantiene un **número controlado de partículas activas**.  
- Evita saturar el **garbage collector** con objetos que ya no se usan.  
- Asegura un **renderizado fluido** incluso con cientos o miles de partículas.

### Alternativas más eficientes
- **Object Pooling** → reciclar partículas en lugar de destruir y crear nuevas.  
- **Swap + Pop** → intercambiar la partícula muerta con la última del array y eliminarla con `pop()` (O(1) en lugar de O(n)).  
- **Eliminación por batch** → marcar partículas muertas y borrarlas cada cierto tiempo.  

---
✅ En resumen: el `lifespan` y `isDead()` son la base para controlar memoria y rendimiento; `splice` funciona bien en sistemas pequeños, pero en simulaciones grandes es mejor usar **pooling** o **swap + pop**.
#### Rubrica
<img width="1438" height="858" alt="image" src="https://github.com/user-attachments/assets/f5673dbb-9800-4a11-8c97-4d9ac673c13c" />


#### Autoevaluación

1. **Investigación y Experimentación (Evidencia en Actividad 2)**
   - Considero que logré un nivel excelente porque no solo implementé las modificaciones solicitadas, sino que también entendí la interrelación entre los componentes del código. Pude justificar la elección de las técnicas aplicadas y cómo estas se conectan entre sí para lograr el resultado esperado. La experimentación fue intencionada y siempre con un objetivo claro de aprendizaje.

2. **Intención y Diseño (Proceso de Actividad 3)**
   - La bitácora incluye un concepto definido acompañado de artefactos de diseño (diagramas, bocetos y explicaciones). Cada elemento principal de la obra se vincula directamente con decisiones tomadas durante el proceso. El diseño se reflejó en la obra final de forma coherente, mostrando una implementación clara de lo planeado. A pesar de que hubieron algunos cambios y decisiones de última hora con respecto al boceto, se mantuvo coherente a las bases y conceptos escogidos.

3. **Aplicación Técnica (Código de Actividad 3)**
   - El código está organizado en clases modulares que encapsulan datos y comportamientos, lo que permite mayor legibilidad y reutilización. Utilicé herencia y composición para diferenciar comportamientos, y documenté claramente cada parte del proceso. El manejo de memoria y arrays se optimizó para mantener un rendimiento estable, en este caso con el splice que ya usaba shiffman en su libro, y el bool isDead(), mostrando un entendimiento de la técnica, además de que logré explorar de nuevo cosas como p5.sound y la rotación de la unidad 4, cosas bastante útiles. La obra no llega a petar pues el numero de particulas es fijo y no aumenta.

4. **Calidad de la Obra Final (Artefacto Entregado)**
   - La obra final es estable, con un frame rate constante y respuesta interactiva clara. No se limita solo a “funcionar”, sino que además incorpora detalle en la respuesta visual, generando una experiencia amplia y variada. La interacción se mantiene coherente con el concepto planteado (los 6 elementos), evitando errores visuales y garantizando consistencia en la ejecución.

Nota final: 5





