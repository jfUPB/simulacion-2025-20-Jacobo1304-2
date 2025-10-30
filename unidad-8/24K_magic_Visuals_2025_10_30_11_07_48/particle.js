class Particle {
  constructor(x, y, speed, fadeDuration) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, speed));
    this.baseSpeed = speed;
    this.lifespan = fadeDuration;
    this.fadeDuration = fadeDuration;

    // Color completamente aleatorio con tonos vibrantes
    this.color = color(random(255), random(255), random(255));
    this.size = random(3, 8);
  }

  update(level) {
    // Reacción al beat: si hay nivel alto, se expande y acelera un poco
    let intensity = map(level, 0, 0.5, 1, 3, true);
    this.vel.limit(this.baseSpeed * intensity);
    this.pos.add(this.vel);
    this.lifespan--;
  }

  display() {
    let alpha = map(this.lifespan, 0, this.fadeDuration, 0, 255);
    fill(
      red(this.color),
      green(this.color),
      blue(this.color),
      alpha
    );
    noStroke();

    // Tamaño pulsante con el tiempo (suave)
    let pulse = map(sin(frameCount * 0.1 + this.pos.x * 0.01), -1, 1, 0.8, 1.2);
    ellipse(this.pos.x, this.pos.y, this.size * pulse);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}