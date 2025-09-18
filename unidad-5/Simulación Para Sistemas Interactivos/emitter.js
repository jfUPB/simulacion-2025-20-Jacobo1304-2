// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Smoke Particle System

// A class to describe a group of Particles
// An ArrayList is used to manage the list of Particles

class Emitter {

  constructor(x, y, img1, img2, col) {
    this.particles = []; // Initialize the arraylist
    this.origin = createVector(x,y); // Store the origin point
    this.img1 = img1; // primary texture
    this.img2 = img2; // alternate texture
    this.color = col; // per-emitter color [r,g,b]
  }

  rotate(angle) {
    // Rotate origin around (0,0) in WEBGL space
    this.origin.rotate(angle);
  }

  run() {
    for (let particle of this.particles) {
      particle.run();
    }
    this.particles = this.particles.filter(particle => !particle.isDead());
  }

  // Method to add a force vector to all particles currently in the system
  applyForce(dir) {
    // Enhanced loop!!!
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    // Randomly choose between Particle and CloudParticle
    if (random() < 0.5) {
      this.particles.push(new Particle(this.origin.x, this.origin.y, this.img1, this.color));
    } else {
      this.particles.push(new CloudParticle(this.origin.x, this.origin.y, this.img2, this.color));
    }
  }

}