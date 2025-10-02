// Boid.js
// Boid con colores variables por noise y render suave
class Boid {
  constructor(x, y) {
    this.position = createVector((x !== undefined) ? x : random(width), (y !== undefined) ? y : random(height));
    this.velocity = p5.Vector.random2D().mult(random(0.5, 2));
    this.acceleration = createVector(0, 0);

    // tamaño por variable global boidSize, con fallback
    this.r = (typeof boidSize !== 'undefined') ? boidSize : 4;

    this.maxspeed = boidMaxSpeed;
    this.maxforce = boidMaxForce;

    // Flags para burst y control de vida
    this.isBurst = false;     // si viene de una ráfaga
    this.dead = false;        // marcado para eliminar
    this.wrapEnabled = true;  // si false no envuelve (usado para bursts)

    // color seed (estable para evitar parpadeos al reemplazar)
    this.colorSeed = random(1000);
    let n = noise(this.position.x * 0.005 + this.colorSeed, this.position.y * 0.005 + this.colorSeed);
    this.coldHue = map(n, 0, 1, 160, 220);
    this.warmHue = map(noise(this.colorSeed + 7), 0, 1, 10, 40);
    this.colorMix = 0;
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  flock(boids) {
    // calcular fuerzas de separación / alineamiento / cohesión
    let sep = this.separate(boids).mult(1.6);
    let ali = this.align(boids).mult(1.0);
    let coh = this.cohesion(boids).mult(1.0);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    // sincroniza tamaño si cambió globalmente
    if (typeof boidSize !== 'undefined') this.r = boidSize;

    this.maxspeed = boidMaxSpeed;
    this.maxforce = boidMaxForce;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // suaviza la mezcla de color local hacia el estado global (chorusSmooth)
    if (typeof chorusSmooth !== 'undefined') {
      this.colorMix = lerp(this.colorMix, chorusSmooth, 0.03);
    }
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  render(globalChorusFactor = 0) {
    // Si el flock actual está en modo 'gray' (preset 3), dibujamos en escala de grises.
    const grayMode = (typeof flock !== 'undefined' && flock.currentColorMode === 'gray');

    if (grayMode) {
      // brillo modulable por chorusFactor para dar algo de dinamismo
      let bri = lerp(180, 245, globalChorusFactor);
      colorMode(HSB, 255);
      push();
      translate(this.position.x, this.position.y);
      rotate(this.velocity.heading() + HALF_PI);
      noStroke();
      // sat = 0 para gris; hue ignored
      fill(0, 0, bri, 230);
      beginShape();
      vertex(0, -this.r * 1.6);
      vertex(-this.r, this.r * 1.6);
      vertex(this.r, this.r * 1.6);
      endShape(CLOSE);
      pop();
      return;
    }

    // mezcla entre coldHue y warmHue; usamos combinación entre global (rápido) y local colorMix (suave)
    let mixFactor = lerp(this.colorMix, globalChorusFactor, 0.6); // evita transiciones instant
    let hueVal = lerp(this.coldHue, this.warmHue, mixFactor);
    colorMode(HSB, 255);
    let sat = lerp(160, 230, mixFactor);
    let bri = lerp(210, 255, mixFactor);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + HALF_PI);
    noStroke();
    fill(hueVal, sat, bri, 220);
    beginShape();
    vertex(0, -this.r * 1.6);
    vertex(-this.r, this.r * 1.6);
    vertex(this.r, this.r * 1.6);
    endShape(CLOSE);
    pop();
  }

  borders() {
    // Si wrapEnabled = false (usado para bursts) dejamos que salgan y luego los marcamos dead
    if (!this.wrapEnabled) {
      const margin = 120; // margen amplio para completar recorrido
      if (this.position.x < -margin || this.position.x > width + margin || this.position.y < -margin || this.position.y > height + margin) {
        this.dead = true;
      }
      return;
    }

    // comportamiento normal: wraparound
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  separate(boids) {
    let desiredSeparation = separationDist;
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) steer.div(count);
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  align(boids) {
    let neighborDistance = neighborDist;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDistance) {
        sum.add(other.velocity);
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
    }
    return createVector(0, 0);
  }

  cohesion(boids) {
    let neighborDistance = neighborDist;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDistance) {
        sum.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return createVector(0, 0);
  }
}
