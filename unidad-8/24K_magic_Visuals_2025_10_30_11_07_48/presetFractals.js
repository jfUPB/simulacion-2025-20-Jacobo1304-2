class PresetFractals extends Preset {
  constructor() {
    super();
    this.angle = 0;
    this.radius = 200;
    this.waveDetail = 200;
    this.amp = 80;
    this.noiseOffset = random(1000);
    this.distortion = 0;
    this.strokeColor = color(255);

    this.isDropped = false;
    this.dropFactor = 1; // 1 = normal, <1 = más lento

    this.hueShift = 0;

    // --- Círculos de clímax ---
    this.circles = [];
    for (let i = 0; i < 12; i++) {
      this.circles.push({
        r: random(100, 400),
        speed: random(0.005, 0.02),
        alpha: random(100, 255),
      });
    }

    // --- Mini flocks iniciales ---
    this.flocks = [];
    this.baseFlockSpeed = 2;
    for (let i = 0; i < 5; i++) {
      this.flocks.push(new MiniFlock(random(width), random(height), this.baseFlockSpeed));
    }
  }

  update(spectrum, level) {
    // Aplicar ralentización global si está en drop
    let speedFactor = this.isDropped ? this.dropFactor : 1;

    this.angle += map(level, 0, 0.5, 0.005, 0.05) * speedFactor;
    this.pulse = map(level, 0, 0.4, 0.8, 1.3);

    // Actualizar flocks
    for (let f of this.flocks) {
      f.update(speedFactor);
    }

    // Vibración y expansión de los círculos
    for (let c of this.circles) {
      c.alpha = 100 + sin(frameCount * c.speed) * 100 * level * 3;
      if (c.expanding) c.r += 2 * speedFactor;
    }

    // Suavizado de distorsión
    this.distortion *= 0.9;

    this.noiseOffset += 0.005 * speedFactor;
  }

  display() {
    background(0, this.isDropped ? 100 : 40); // más opaco en drop
    colorMode(HSB);

    let baseHue = (noise(this.noiseOffset) * 360 + this.hueShift) % 360;
    let baseColor = this.isDropped ? color(0, 0, 180) : color(baseHue, 80, 100);

    push();
    translate(width / 2, height / 2);
    rotate(this.angle);

    // --- FIGURA FRACTAL ---
    stroke(baseColor);
    noFill();
    strokeWeight(2);

    beginShape();
    for (let i = 0; i < this.waveDetail; i++) {
      let a = map(i, 0, this.waveDetail, 0, TWO_PI);
      let n = noise(this.noiseOffset + i * 0.05, frameCount * 0.01);
      let wave = sin(a * 3 + frameCount * 0.02 + this.distortion) * this.amp * n;
      let r = (this.radius + wave) * this.pulse;
      let x = cos(a) * r;
      let y = sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);

    // --- CÍRCULOS CLÍMAX ---
    for (let c of this.circles) {
      stroke(hue(baseColor), saturation(baseColor), brightness(baseColor), c.alpha);
      ellipse(0, 0, c.r * this.pulse);
    }

    pop();

    // --- FLOCKS CON TRAIL ---
    for (let f of this.flocks) {
      f.display(baseColor);
    }
  }

  keyPressed(k) {
    if (k === 'ArrowUp') this.amp = min(this.amp + 10, 200);
    if (k === 'ArrowDown') this.amp = max(this.amp - 10, 10);
    if (k === 'ArrowLeft') this.waveDetail = max(50, this.waveDetail - 10);
    if (k === 'ArrowRight') this.waveDetail = min(400, this.waveDetail + 10);

    if (k === 'b' || k === 'B') {
      this.flocks.push(new MiniFlock(random(width), random(height), this.baseFlockSpeed));
    }

    if (k === 'q' || k === 'Q') this.spawnBurst('left');
    if (k === 'e' || k === 'E') this.spawnBurst('right');

    if (k === 'c' || k === 'C') {
      let c = random(this.circles);
      c.expanding = true;
    }

    if (k === 'd' || k === 'D') this.distortion = random(TWO_PI);

    if (k === 'w' || k === 'W') {
      this.baseFlockSpeed = min(this.baseFlockSpeed + 0.5, 6);
      for (let f of this.flocks) f.speed = this.baseFlockSpeed;
    }
    if (k === 's' || k === 'S') {
      this.baseFlockSpeed = max(this.baseFlockSpeed - 0.5, 0.5);
      for (let f of this.flocks) f.speed = this.baseFlockSpeed;
    }

    // Drop / Resume
    if (k === 'x' || k === 'X') {
      this.isDropped = true;
      this.dropFactor = 0.1;
    }
    if (k === 'z' || k === 'Z') {
      this.isDropped = false;
      this.dropFactor = 1;
    }
  }

  mouseWheel(event) {
    this.hueShift += event.delta * 0.1;
  }

  spawnBurst(side) {
    for (let i = 0; i < 5; i++) {
      let y = random(height);
      let x = side === 'left' ? -50 : width + 50;
      let dir = side === 'left'
        ? createVector(random(2, 4), random(-1, 1))
        : createVector(random(-4, -2), random(-1, 1));
      this.flocks.push(new MiniFlock(x, y, this.baseFlockSpeed, dir));
    }
  }

  reset() {
    this.angle = 0;
    this.noiseOffset = random(1000);
    this.flocks = [];
    for (let i = 0; i < 5; i++)
      this.flocks.push(new MiniFlock(random(width), random(height), this.baseFlockSpeed));
    for (let c of this.circles) c.expanding = false;
  }
}

class MiniFlock {
  constructor(x, y, baseSpeed = 2, customVel = null) {
    this.pos = createVector(x, y);
    this.vel = customVel ? customVel : p5.Vector.random2D().mult(baseSpeed);
    this.speed = baseSpeed;
    this.size = random(3, 6);
    this.trail = [];
    this.maxTrail = 25;
  }

  update(speedFactor = 1) {
    this.pos.add(p5.Vector.mult(this.vel, speedFactor));
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) this.trail.shift();

    // Rebote con límites
    if (this.pos.x < -100 || this.pos.x > width + 100) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display(baseColor) {
    noStroke();
    // --- Trail con puntos suaves y alpha decreciente ---
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      let alpha = map(i, 0, this.trail.length, 0, 200);
      let sz = map(i, 0, this.trail.length, 1, this.size);
      fill(hue(baseColor), saturation(baseColor), brightness(baseColor), alpha);
      ellipse(p.x, p.y, sz);
    }

    // --- Cuerpo principal del boid ---
    fill(hue(baseColor), saturation(baseColor), brightness(baseColor), 255);
    ellipse(this.pos.x, this.pos.y, this.size * 1.5);
  }

  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(this.speed);
    this.trail = [];
  }
}


