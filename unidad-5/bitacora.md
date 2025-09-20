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

#### Que hice?
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

#### Analiza el ejemplo 4.5: a Particle System with Inheritance and Polymorphism.

#### Analiza el ejemplo 4.6: a Particle System with Forces.

#### Analiza el ejemplo 4.7: a Particle System with a Repeller.

#### Rubrica
<img width="1438" height="858" alt="image" src="https://github.com/user-attachments/assets/f5673dbb-9800-4a11-8c97-4d9ac673c13c" />

#### Autoevaluación




