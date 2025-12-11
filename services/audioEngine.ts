class AudioEngine {
  private ctx: AudioContext | null = null;
  private mainGain: GainNode | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private volume: number = 0.15;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.mainGain = this.ctx.createGain();
      this.mainGain.connect(this.ctx.destination);
      this.mainGain.gain.value = this.volume;

      // Setup hum channel
      this.humGain = this.ctx.createGain();
      this.humGain.connect(this.mainGain);
      this.humGain.gain.value = 0;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Starts a low background drone that reacts to gameplay
  startEngineHum() {
    if (!this.ctx || !this.humGain || this.humOsc) return;

    this.humOsc = this.ctx.createOscillator();
    this.humOsc.type = 'sawtooth';
    this.humOsc.frequency.setValueAtTime(40, this.ctx.currentTime); // Low bass
    this.humOsc.connect(this.humGain);
    this.humOsc.start();
    
    // Fade in
    this.humGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 1.0);
  }

  updateEngineHum(heat: number) {
    if (!this.ctx || !this.humOsc || !this.humGain) return;
    
    // Pitch rises with heat (40Hz -> 80Hz max)
    const targetFreq = 40 + (heat * 2);
    this.humOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);

    // Volume rises slightly with heat
    const targetVol = 0.02 + (heat * 0.001); 
    this.humGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.5);
  }

  stopEngineHum() {
    if (this.humOsc) {
        try {
            this.humOsc.stop();
            this.humOsc.disconnect();
        } catch(e) {}
        this.humOsc = null;
    }
  }

  playKeystroke() {
    if (!this.ctx || !this.mainGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.mainGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playError() {
    if (!this.ctx || !this.mainGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.mainGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playSuccess() {
    if (!this.ctx || !this.mainGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.mainGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playShield() {
    if (!this.ctx || !this.mainGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.mainGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playDamage() {
    if (!this.ctx || !this.mainGain) return;
    
    // Static burst
    const bufferSize = this.ctx.sampleRate * 0.2; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    noise.connect(gain);
    gain.connect(this.mainGain);
    noise.start();
  }

  playLevelUp() {
    if (!this.ctx || !this.mainGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(554, t + 0.1);
    osc.frequency.setValueAtTime(659, t + 0.2);
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.5);

    osc.connect(gain);
    gain.connect(this.mainGain);
    osc.start();
    osc.stop(t + 0.5);
  }
}

export const audioEngine = new AudioEngine();