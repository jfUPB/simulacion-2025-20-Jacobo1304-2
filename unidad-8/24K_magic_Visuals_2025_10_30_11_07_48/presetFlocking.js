class PresetFlocking extends Preset {
  constructor(song) {
    super(song);
    this.isDropped = false;
    this.dropFactor = 1; // 1 = normal, <1 = más lento

    this.lines = [];
    this.maxLines = 10;
    this.amp = new p5.Amplitude();
    this.amp.setInput(this.song);

    colorMode(HSB);
    this.addLine();
  }

  update() {
    let level = this.amp.getLevel();
    let beat = map(level, 0, 0.3, 0, 1, true);

    let factor = this.isDropped ? this.dropFactor : 1;

    for (let line of this.lines) {
      line.update(level * factor, beat);
      line.speed *= factor;
    }
  }

  display() {
    if (this.isDropped) background(30, 30);
    for (let line of this.lines) {
      line.display(this.isDropped);
    }
  }

  addLine() {
    if (this.lines.length >= this.maxLines) {
      this.lines.shift();
    }
    this.lines.push(new BrushLine());
  }

  keyPressed(k) {
    if (k === 'w' || k === 'W') {
      for (let line of this.lines)
        line.speed = constrain(line.speed + 0.5, 0.5, 10);
    } else if (k === 's' || k === 'S') {
      for (let line of this.lines)
        line.speed = constrain(line.speed - 0.5, 0.5, 10);
    } else if (k === ' ') {
      this.addLine();
    }

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
    this.lines = [];
    this.addLine();
  }
}

// ---- Clase BrushLine ----
class BrushLine {
  constructor() {
    this.pos = this.randomEdgePosition();
    this.vel = p5.Vector.random2D();
    this.speed = random(1.5, 3);
    this.noiseOffset = random(1000);
    this.trail = [];
    this.maxTrail = 250;
    this.isWarm = random() < 0.5;
    this.brightness = 80;
  }

  randomEdgePosition() {
    let edge = floor(random(4));
    switch (edge) {
      case 0: return createVector(random(width), 0);
      case 1: return createVector(random(width), height);
      case 2: return createVector(0, random(height));
      case 3: return createVector(width, random(height));
    }
  }

  update(level, beat) {
    this.noiseOffset += 0.01;
    let angle = noise(this.noiseOffset) * TWO_PI * 2;
    this.vel = p5.Vector.fromAngle(angle).mult(this.speed);

    let nextPos = p5.Vector.add(this.pos, this.vel);
    let crossed = false;

    if (nextPos.x < 0) { this.pos.x = width; crossed = true; }
    else if (nextPos.x > width) { this.pos.x = 0; crossed = true; }
    else this.pos.x = nextPos.x;

    if (nextPos.y < 0) { this.pos.y = height; crossed = true; }
    else if (nextPos.y > height) { this.pos.y = 0; crossed = true; }
    else this.pos.y = nextPos.y;

    if (crossed) this.trail = [];

    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) this.trail.shift();

    if (beat > 0.8 && random() < 0.05) this.isWarm = !this.isWarm;
    this.brightness = map(level, 0, 0.3, 40, 100);
  }

  display(isDropped) {
    noFill();
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let n = noise(i * 0.05 + this.noiseOffset);
      let hueVal = isDropped
        ? 0
        : this.isWarm
        ? map(n, 0, 1, 20, 60)
        : map(n, 0, 1, 180, 250);
      let sat = isDropped ? 0 : 80 + 20 * n;
      let bri = isDropped ? 180 : this.brightness;
      stroke(hueVal, sat, bri);
      strokeWeight(2);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();
  }
}
