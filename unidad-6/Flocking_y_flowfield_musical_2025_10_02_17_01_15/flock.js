// Flock.js
class Flock {
  constructor(maxBoids = 120) {
    this.boids = [];
    this.maxBoids = maxBoids;
    this.baseMaxBoids = maxBoids; // referencia para presets
    this.capacityLimit = 1000;    // límite absoluto configurable

    this.presets = {
      1: { speed: 1.8, force: 0.04, countFactor: 1.0, flowBiasAngle: null, flowBiasStrength: 0, colorMode: 'cold' },
      2: { speed: 4.0, force: 0.07, countFactor: 1.5, flowBiasAngle: -HALF_PI, flowBiasStrength: 0.55, colorMode: 'warm' },
      3: { speed: 1.0, force: 0.03, countFactor: 0.2, flowBiasAngle: null, flowBiasStrength: 0, colorMode: 'gray' }
    };

    this.defaultBurstSize = 30;
    this.currentColorMode = 'cold';

    // Para recortes graduales cuando maxBoids baja
    this.trimPerFrame = 4;
  }

  run(flowField, flowWeight, mid, treble, chorusFactor) {
    // comportamiento para cada boid
    for (let b of this.boids) {
      b.flock(this.boids);

      // Flowfield steering
      if (flowField) {
        let fieldDir = flowField.lookup(b.position);
        let desired = fieldDir.copy().mult(b.maxspeed);
        let steer = p5.Vector.sub(desired, b.velocity);
        steer.limit(b.maxforce);
        steer.mult(flowWeight);
        b.applyForce(steer);
      }

      // treble jitter
      if (treble !== undefined) {
        let jitter = p5.Vector.random2D().mult(map(treble, 0, 255, 0, 0.25));
        b.applyForce(jitter);
      }

      b.update();
      b.borders();
      b.render(chorusFactor);
    }

    // Limpieza: remover boids marcados como dead
    this.boids = this.boids.filter(b => !b.dead);

    // Si hay exceso frente a maxBoids, recortamos gradualmente (evita teletransportes)
    if (this.boids.length > this.maxBoids) {
      const excess = this.boids.length - this.maxBoids;
      const toRemove = min(this.trimPerFrame, excess);
      if (toRemove > 0) {
        // eliminamos los primeros (más viejos) de forma controlada
        this.boids.splice(0, toRemove);
      }
    }

    // Si estamos por debajo de maxBoids, rellenamos suavemente
    while (this.boids.length < this.maxBoids) {
      this.boids.push(new Boid(random(width), random(height)));
      // evitar añadir demasiados en un solo frame: rompemos si exceso
      if (this.boids.length - this.maxBoids > this.trimPerFrame) break;
    }

    // En cualquier caso: si superamos capacityLimit, recortamos los más antiguos de inmediato
    if (this.boids.length > this.capacityLimit) {
      const overflow = this.boids.length - this.capacityLimit;
      this.boids.splice(0, overflow);
    }
  }

  // allowOverflow: si true, se pushean boids aun si exceden maxBoids (usado por rafagas o mouse-hold)
  addBoid(b, allowOverflow = false) {
    if (allowOverflow) {
      this.boids.push(b);
      // si superamos capacityLimit, recortamos más antiguos
      if (this.boids.length > this.capacityLimit) {
        const overflow = this.boids.length - this.capacityLimit;
        this.boids.splice(0, overflow);
      }
      return;
    }

    if (this.boids.length < this.maxBoids) {
      this.boids.push(b);
    } else {
      // si ya estamos en maxBoids: reemplazamos un boid que no sea de burst y que sea "viejo" para evitar parpadeos
      let idx = -1;
      for (let i = 0; i < this.boids.length; i++) {
        if (!this.boids[i].isBurst) { idx = i; break; }
      }
      if (idx === -1) {
        // si no hay candidato no-burst, elegimos aleatorio
        idx = floor(random(this.boids.length));
      }
      // preservamos colores para minimizar parpadeo visual
      let old = this.boids[idx];
      b.colorSeed = old.colorSeed;
      b.coldHue = old.coldHue;
      b.warmHue = old.warmHue;
      this.boids[idx] = b;
    }
  }

  // Para el mouse: en vez de teletransportar, preferimos añadir con overflow (suave)
  addOrReplaceAt(x, y) {
    // Añadir como overflow para que no reemplace y termine su trayectoria visualmente
    const b = new Boid(x, y);
    b.wrapEnabled = true; // boids creados por mouse sí envuelven
    this.addBoid(b, true);
  }

  setMaxBoids(n) {
    // establecemos el objetivo de maxBoids pero no recortamos de golpe
    this.maxBoids = max(1, floor(n));
  }

  removeBoid() {
    if (this.boids.length) this.boids.pop();
  }

  clear() {
    this.boids.length = 0;
  }

  applyPreset(id, options = {}) {
    if (!this.presets[id]) {
      console.warn('Preset no existe:', id);
      return;
    }
    const p = this.presets[id];

    // velocidad/fuerza globales
    boidMaxSpeed = p.speed;
    boidMaxForce = p.force;

    // ajustar número objetivo usando baseMaxBoids (preserva referencia)
    let target = floor(this.baseMaxBoids * p.countFactor);
    if (target < 1) target = 1;
    this.setMaxBoids(target);

    // bias en flowField si existe
    if (typeof field !== 'undefined' && field instanceof FlowField) {
      if (p.flowBiasAngle !== null) field.setBias(p.flowBiasAngle, p.flowBiasStrength);
      else field.setBias(0, 0);
    }

    this.currentColorMode = options.overrideColorMode || p.colorMode;

    // aplicar color mode (suavemente actualizamos seeds/hues para evitar saltos)
    if (this.currentColorMode === 'cyan') {
      for (let b of this.boids) {
        b.coldHue = 50; b.warmHue = 0;
      }
    } else {
      for (let b of this.boids) {
        b.coldHue = map(noise(b.colorSeed), 0, 1, 160, 220);
        b.warmHue = map(noise(b.colorSeed + 7), 0, 1, 10, 40);
      }
    }

    if (typeof statusEl !== 'undefined' && statusEl) {
      statusEl.textContent = `Preset ${id} aplicado: ${p.colorMode}, speed ${p.speed}, count x${p.countFactor}`;
    }
  }

  // spawnBurst marca boids como isBurst, wrapEnabled=false y usa addBoid(..., true)
  spawnBurst(side = 'left', count = null) {
    let c = count || this.defaultBurstSize;
    c = max(1, floor(c));
    for (let i = 0; i < c; i++) {
      let y = random(0, height);
      let x = side === 'left' ? -10 : width + 10;
      let b = new Boid(x, y);
      b.isBurst = true;
      b.wrapEnabled = false;
      // hacer boids de ráfaga más grandes y rápidos
      if (typeof boidSize !== 'undefined') b.r = boidSize * 1.6;
      else b.r = 6;
      let dir = createVector(width / 2 + random(-100,100), random(height * 0.25, height * 0.75));
      b.velocity = p5.Vector.sub(dir, b.position).setMag(random(2.5, 6.0));
      b.velocity.add(p5.Vector.random2D().mult(0.5));
      this.addBoid(b, true); // overflow para que no sean reemplazados y terminen su recorrido
    }
  }
}
