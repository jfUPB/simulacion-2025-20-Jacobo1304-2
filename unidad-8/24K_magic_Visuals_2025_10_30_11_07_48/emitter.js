class Emitter {
  constructor(x, y, count, speed, fadeDuration) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, speed, fadeDuration));
    }
  }

  update(level) {
    for (let p of this.particles) p.update(level);
    this.particles = this.particles.filter(p => !p.isDead());
  }

  display() {
    for (let p of this.particles) p.display();
  }
}