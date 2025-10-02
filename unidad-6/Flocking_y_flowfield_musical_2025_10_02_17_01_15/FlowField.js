// FlowField (mejorada) - soporta bias direccional para presets
class FlowField {
  constructor(resolution = 25) {
    this.setResolution(resolution);
    this.noiseScale = 0.08;
    this.timeScale = 0.004;
    this.bias = { angle: 0, strength: 0 };
  }

  setResolution(res) {
    this.resolution = Math.max(4, Math.round(res));
    this.cols = Math.ceil(width / this.resolution);
    this.rows = Math.ceil(height / this.resolution);
    this.cellW = width / this.cols;
    this.cellH = height / this.rows;
    this.field = new Array(this.cols);
    for (let i = 0; i < this.cols; i++) {
      this.field[i] = new Array(this.rows);
    }
    this.init();
  }

  init() {
    noiseSeed(floor(random(10000)));
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = i * this.cellW + this.cellW * 0.5;
        let y = j * this.cellH + this.cellH * 0.5;
        let n = noise(x * this.noiseScale, y * this.noiseScale);
        let angle = map(n, 0, 1, 0, TWO_PI);
        this.field[i][j] = p5.Vector.fromAngle(angle);
      }
    }
    if (this.bias && this.bias.strength > 0) this.applyBias();
  }

  update() {
    let t = frameCount * this.timeScale;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = i * this.cellW + this.cellW * 0.5;
        let y = j * this.cellH + this.cellH * 0.5;
        let n = noise(x * this.noiseScale, y * this.noiseScale, t);
        let angle = map(n, 0, 1, 0, TWO_PI);
        if (this.field[i][j]) this.field[i][j].set(p5.Vector.fromAngle(angle));
        else this.field[i][j] = p5.Vector.fromAngle(angle);
      }
    }
    if (this.bias && this.bias.strength > 0) this.applyBias();
  }

  lookup(position) {
    let column = constrain(floor(position.x / this.cellW), 0, this.cols - 1);
    let row = constrain(floor(position.y / this.cellH), 0, this.rows - 1);
    if (!this.field[column] || !this.field[column][row]) return createVector(1, 0);
    return this.field[column][row].copy();
  }

  show(opacity = 100) {
    stroke(180, 120, opacity);
    strokeWeight(1);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let v = this.field[i][j];
        if (!v) continue;
        let vv = v.copy().setMag(min(this.cellW, this.cellH) * 0.4);
        let x = i * this.cellW + this.cellW * 0.5;
        let y = j * this.cellH + this.cellH * 0.5;
        push();
        translate(x, y);
        line(0, 0, vv.x, vv.y);
        pop();
      }
    }
  }

  setBias(angle, strength) {
    this.bias.angle = angle;
    this.bias.strength = constrain(strength, 0, 1);
    this.applyBias();
  }

  applyBias() {
    let biasVec = p5.Vector.fromAngle(this.bias.angle);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let v = this.field[i][j];
        if (!v) continue;
        let mixed = p5.Vector.lerp(v, biasVec, this.bias.strength);
        mixed.normalize();
        this.field[i][j].set(mixed);
      }
    }
  }
}
