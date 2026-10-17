/** Metronome voices: deep kick on the downbeat, high ping on accents, soft click on the rest. */
export type ClickVoice = "downbeat" | "accent" | "note";

/** Synthesised drum voices. Keys match `DrumKey` in `core/drums`. */
export type DrumVoice = "kick" | "snare" | "hat" | "ohat" | "ride" | "crash" | "tomh" | "toml";

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/**
 * Small Web Audio synth for the metronome and drum lab. Everything is generated
 * from oscillators and a noise buffer, so no samples need to be loaded.
 * The AudioContext is created lazily on `resume()`, which must run in a user gesture.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private noise: AudioBuffer | null = null;

  resume(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      if (!this.noise) this.noise = this.createNoise(this.ctx);
    } catch {
      this.ctx = null;
    }
  }

  click(voice: ClickVoice): void {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);

    switch (voice) {
      case "downbeat":
        o.type = "sine";
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(45, t + 0.14);
        g.gain.setValueAtTime(0.9, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t);
        o.stop(t + 0.26);
        break;
      case "accent":
        o.type = "triangle";
        o.frequency.setValueAtTime(1700, t);
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        o.start(t);
        o.stop(t + 0.09);
        break;
      case "note":
        o.type = "square";
        o.frequency.setValueAtTime(900, t);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        o.start(t);
        o.stop(t + 0.05);
        break;
    }
  }

  /** Plays a drum voice at `velocity` (0–1). */
  drum(voice: DrumVoice, velocity: number): void {
    const c = this.ctx;
    if (!c || velocity <= 0) return;
    const t = c.currentTime + 0.005;
    const out = c.createGain();
    out.gain.value = velocity;
    out.connect(c.destination);

    const noiseBuffer = this.noise;

    function tone(type: OscillatorType, f0: number, f1: number, dur: number, gain: number): void {
      if (!c) return;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g);
      g.connect(out);
      o.start(t);
      o.stop(t + dur + 0.02);
    }

    function noise(type: BiquadFilterType, freq: number, dur: number, gain: number, q?: number): void {
      if (!c || !noiseBuffer) return;
      const s = c.createBufferSource();
      s.buffer = noiseBuffer;
      const f = c.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      if (q) f.Q.value = q;
      const g = c.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      s.connect(f);
      f.connect(g);
      g.connect(out);
      s.start(t);
      s.stop(t + dur + 0.02);
    }

    switch (voice) {
      case "kick":
        tone("sine", 160, 42, 0.32, 1.1);
        break;
      case "snare":
        noise("bandpass", 1900, 0.18, 0.9, 0.8);
        tone("triangle", 200, 140, 0.1, 0.5);
        break;
      case "hat":
        noise("highpass", 7500, 0.05, 0.5);
        break;
      case "ohat":
        noise("highpass", 7000, 0.32, 0.45);
        break;
      case "ride":
        noise("bandpass", 7000, 0.5, 0.3, 1.5);
        tone("sine", 3200, 0, 0.35, 0.06);
        break;
      case "crash":
        noise("highpass", 4200, 1.3, 0.6);
        break;
      case "tomh":
        tone("sine", 230, 150, 0.32, 0.9);
        break;
      case "toml":
        tone("sine", 140, 88, 0.42, 0.95);
        break;
    }
  }

  private createNoise(c: AudioContext): AudioBuffer {
    const length = Math.floor(c.sampleRate * 1.5);
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}
