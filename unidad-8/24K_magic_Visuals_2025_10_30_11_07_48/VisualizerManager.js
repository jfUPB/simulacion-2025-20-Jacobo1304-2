class VisualizerManager {
  constructor(song) {
    this.song = song;
    this.presets = [];
    this.activePreset = 0;
  }

  addPreset(preset) {
    this.presets.push(preset);
  }

  setPreset(index) {
    if (index >= 0 && index < this.presets.length) {
      this.activePreset = index;
      console.log("Preset cambiado a:", index + 1);
      if (this.presets[index].reset) this.presets[index].reset();
    }
  }

  update() {
    if (!this.song.isPlaying()) return;
    let spectrum = fft.analyze();
    let level = amplitude.getLevel();
    this.presets[this.activePreset].update(spectrum, level);
  }

  display() {
    this.presets[this.activePreset].display();
  }

  reset() {
    for (let p of this.presets) {
      if (p.reset) p.reset();
    }
  }
}