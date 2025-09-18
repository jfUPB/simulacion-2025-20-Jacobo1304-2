// filepath: c:\\Users\\Jacobo\\OneDrive - UPB\\Desktop\\6to semestre\\Simulación Para Sistemas Interactivos\\mover.js
// Motion 101 Mover that reacts to a wind force
class Mover {
  constructor() {
    this.mass = 1; // For now, keep mass = 1
    this.position = createVector(0, 30);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    // Trail + wave rendering state
    this.history = [];
    this.maxHistory = 24; // shorter tail for performance (was 50)
    this.phase = 0;       // wave phase animation
    this.noff = random(1000); // noise offset for amplitude jitter
  }

  applyForce(force) {
    // F = ma -> a = F/m
    const f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // clear acceleration each frame

    // Record history for tail with heading at this frame
    const heading = this.velocity.heading();
    this.history.push({ pos: this.position.copy(), heading });
    if (this.history.length > this.maxHistory) this.history.shift();

    // Advance phase for wave animation (slower for smaller motion)
    this.phase += 0.11;
  }

  show() {
    push();
    noFill();

    // Colors: previous touched vs current target
    let prevColor = [255, 255, 255];
    let currColor = [255, 255, 255];
    if (typeof emitters !== 'undefined' && emitters.length === 6) {
      const prev = emitters[(typeof lastTouchedIndex === 'number' && lastTouchedIndex >= 0) ? lastTouchedIndex : (windTargetIndex || 0)];
      const curr = emitters[typeof windTargetIndex === 'number' ? windTargetIndex : 0];
      if (prev && prev.color) prevColor = prev.color;
      if (curr && curr.color) currColor = curr.color;
    }

    // Draw sine-wave slices along the recent history, fading out in the tail
    const nSlices = this.history.length;
    const baseAmp = 12;  // still noticeable but lighter (was 20)
    const waveLen = 40;  // slightly shorter than 48
    const steps = 16;    // fewer points per slice (was 24)

    const stride = nSlices > 18 ? 2 : 1; // skip some slices if many

    for (let i = 0; i < nSlices; i += stride) {
      const t = i / Math.max(1, nSlices - 1); // 0 = tail, 1 = head

      // Gradient along the tail: from previous color (tail) to current color (head)
      const r = lerp(prevColor[0], currColor[0], t);
      const g = lerp(prevColor[1], currColor[1], t);
      const b = lerp(prevColor[2], currColor[2], t);

      const alpha = lerp(0, 200, 1 - t); // newer = more opaque
      const sw = lerp(0.5, 2.0, 1 - t);  // newer = thicker

      const { pos, heading } = this.history[i];
      const ampNoise = noise(this.noff + frameCount * 0.01 + i * 0.05);
      const amp = baseAmp * (0.75 + 0.5 * ampNoise);

      push();
      translate(pos.x, pos.y);
      rotate(heading);
      stroke(r, g, b, alpha);
      strokeWeight(sw);

      beginShape();
      for (let s = 0; s <= steps; s++) {
        const x = lerp(-waveLen * 0.5, waveLen * 0.5, s / steps);
        const y = sin((x / waveLen) * TWO_PI * 2 + this.phase + i * 0.08) * amp;
        vertex(x, y);
      }
      endShape();
      pop();
    }

    pop();
  }
}
