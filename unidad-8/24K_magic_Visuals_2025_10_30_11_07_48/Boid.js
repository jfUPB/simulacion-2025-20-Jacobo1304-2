class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
  }

  update(boids) {
    // Aquí irán las reglas de flocking (separation, alignment, cohesion)
    this.pos.add(this.vel);
  }

  display(colorMode) {
    strokeWeight(1.5);
    if (colorMode === "warm") stroke(255, 180, 100, 150);
    else stroke(100, 180, 255, 150);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x * 5, this.pos.y - this.vel.y * 5);
  }
}
