class SoundManager {
  constructor() {
    if (!SoundManager.instance) {
      this.sounds = {}; // Stores sound effects for re-use
      this.volume = 1.0; // Default volume (1.0 = 100%)
      this.soundEnabled = true; // Flag to control whether sound effects are enabled
      this.backgroundMusic = null;
      SoundManager.instance = this;
    }
    return SoundManager.instance;
  }

  // Set the global volume for all sounds
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    Object.values(this.sounds).forEach((sound) => (sound.volume = this.volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
  }

  // Load a sound effect
  loadSound(name, src) {
    if (!this.sounds[name]) {
      const audio = new Audio(src);
      audio.volume = this.volume;
      this.sounds[name] = audio;
    }
  }

  // Play a sound effect
  playSound(name) {
    if (!this.soundEnabled) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    } else {
      console.warn(`Sound "${name}" not loaded.`);
    }
  }

  // Play background music
  playBackgroundMusic(src) {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
    this.backgroundMusic = new Audio(src);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.volume;
    this.backgroundMusic.play();
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }
  }

  // Enable sound effects
  enableSounds() {
    this.soundEnabled = true;
  }

  // Disable sound effects only (without affecting background music)
  disableSounds() {
    this.soundEnabled = false;
  }
}

const soundManager = new SoundManager();
export default soundManager;
