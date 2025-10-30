class PresetGrid extends Preset {
  constructor(numCircles = 20) {
    super();
    this.maxCircles = 50;
    this.numCircles = numCircles;
    this.circles = [];
    this.movementSpeed = 0.5;

    this.isDropped = false;
    this.dropFactor = 1;

    this.hueShift = random(360); // tono inicial aleatorio

    colorMode(HSB, 360, 100, 100, 255);

    for (let i = 0; i < this.numCircles; i++) {
      this.addCircle();
    }
  }

  addCircle() {
    if (this.circles.length >= this.maxCircles) return;
    this.circles.push({
      x: random(width),
      y: random(height),
      size: random(10, 80),
      phase: random(TWO_PI),
      hue: random(360),
      sat: random(60, 100),
      bri: random(60, 100),
      dx: random(-1, 1),
      dy: random(-1, 1),
    });
  }

  update(spectrum, level) {
    let speedFactor = this.isDropped ? 0.1 : 1;

    for (let c of this.circles) {
      c.x += c.dx * this.movementSpeed * speedFactor;
      c.y += c.dy * this.movementSpeed * speedFactor;

      if (c.x < 0 || c.x > width) c.dx *= -1;
      if (c.y < 0 || c.y > height) c.dy *= -1;

      let pulse = map(level, 0, 0.5, 0.8, 1.4);
      c.currentSize = c.size * pulse * (0.7 + 0.3 * sin(frameCount * 0.05 + c.phase));
    }
  }

  display() {
    background(0, 30);
    noStroke();

    for (let c of this.circles) {
      let hueAdjusted = (c.hue + this.hueShift) % 360;

      if (this.isDropped) {
        fill(0, 0, 80, 180); // gris tenue al caer
      } else {
        fill(hueAdjusted, c.sat, c.bri, 180);
      }

      ellipse(c.x, c.y, c.currentSize || c.size);
    }
  }

  // --- NUEVO: Control de color con rueda del mouse ---
  mouseWheel(event) {
    this.hueShift += event.delta > 0 ? 10 : -10;
    this.hueShift = (this.hueShift + 360) % 360;
  }

  keyPressed(k) {
    if (k === ' ') this.addCircle();
    if (k === 'ArrowUp') this.movementSpeed = min(this.movementSpeed + 0.1, 3);
    if (k === 'ArrowDown') this.movementSpeed = max(this.movementSpeed - 0.1, 0);

    if (k === 'ArrowRight') {
      this.numCircles = min(this.numCircles + 5, this.maxCircles);
      while (this.circles.length < this.numCircles) this.addCircle();
    }
    if (k === 'ArrowLeft') {
      this.numCircles = max(this.numCircles - 5, 1);
      this.circles.splice(this.numCircles);
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

  reset() {
    this.circles = [];
    for (let i = 0; i < this.numCircles; i++) this.addCircle();
  }
}
