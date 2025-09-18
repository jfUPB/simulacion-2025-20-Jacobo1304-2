// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class Particle {
  constructor(x, y, img, col) {
    this.pos = createVector(x, y);
    let vx = randomGaussian() * 0.3;
    let vy = randomGaussian() * 0.3 - 1.0;
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.lifespan = 100.0;
    this.img = img;
    this.color = col || [245, 150, 34];
    this.size = 36; // default size in pixels
  }

  run() {
    this.update();
    this.show();
  }

  // Method to apply a force vector to the Particle object
  // Note we are ignoring "mass" here
  applyForce(f) {
    this.acc.add(f);
  }

  // Method to update position
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 2.5;
    this.acc.mult(0); // clear Acceleration
  }

  // Method to display
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // This is needed for the texture to use transparency
    noStroke();
    texture(this.img);
    rectMode(CENTER); // center the square on the emitter origin
    const [r,g,b] = this.color;
    tint(r, g, b, this.lifespan);
    square(0, 0, this.size);
    pop();
  }

  // Is the particle still useful?
  isDead() {
    if (this.lifespan <= 0.0) {
      return true;
    } else {
      return false;
    }
  }
}

// New particle type: behaves the same but can carry a different texture
class CloudParticle extends Particle {
  constructor(x, y, img, col) {
    super(x, y, img, col);
    this.size *= 0.25; // 75% smaller than the default size
  }
}
