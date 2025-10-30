class PresetParticles extends Preset {
  constructor() {
    super();
    this.emitters = [];
    this.particleCount = 50; // cantidad inicial de partículas
    this.particleSpeed = 3; // velocidad inicial
    this.fadeDuration = 120; // frames hasta desaparecer
  }

  mousePressed(mx, my) {
    if (this.emitters.length > 8) this.emitters.shift(); // evitar saturación
    this.emitters.push(new Emitter(mx, my, this.particleCount, this.particleSpeed, this.fadeDuration));
  }

  update(spectrum, level) {
    // Aumenta el tamaño o la velocidad de las partículas según el beat
    for (let e of this.emitters) {
      e.update(level);
    }
  }

  display() {
    for (let e of this.emitters) e.display();
  }

  keyPressed(k) {
    if (k === 'ArrowUp') this.particleCount += 5;
    if (k === 'ArrowDown') this.particleCount = max(5, this.particleCount - 5);

    if (k === 'ArrowRight') this.particleSpeed += 0.5;
    if (k === 'ArrowLeft') this.particleSpeed = max(0.5, this.particleSpeed - 0.5);

    if (k === '+') this.fadeDuration += 10;
    if (k === '-') this.fadeDuration = max(20, this.fadeDuration - 10);
  }

  reset() {
    this.emitters = [];
  }
}