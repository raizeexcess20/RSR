export const DEEP_SPACE_TRACK_DURATION = 180; // 3:00 evolving loopable composition

interface HarmonicSection {
  subFreq: number;
  padFreqs: number[];
  chimeFreqs: number[];
}

const COSMIC_SECTIONS: HarmonicSection[] = [
  // 0:00 - 0:45: Event Horizon Drift (Dm9)
  {
    subFreq: 36.71, // D1
    padFreqs: [146.83, 220.0, 261.63, 329.63],
    chimeFreqs: [587.33, 659.25, 880.0, 1046.5, 783.99],
  },
  // 0:45 - 1:30: Nebula Bloom (Bbmaj7#11)
  {
    subFreq: 58.27, // Bb1
    padFreqs: [116.54, 174.61, 220.0, 293.66, 329.63],
    chimeFreqs: [523.25, 587.33, 698.46, 880.0, 1046.5],
  },
  // 1:30 - 2:15: Singularity Resonance (Gm9)
  {
    subFreq: 49.0, // G1
    padFreqs: [98.0, 146.83, 174.61, 233.08, 293.66],
    chimeFreqs: [440.0, 587.33, 698.46, 783.99, 932.33],
  },
  // 2:15 - 3:00: Void Return (Csus2 / Am11)
  {
    subFreq: 55.0, // A1
    padFreqs: [130.81, 196.0, 246.94, 293.66, 329.63],
    chimeFreqs: [493.88, 659.25, 783.99, 987.77, 1174.66],
  },
];

interface PadVoice {
  stopAt: (when: number) => void;
}

export class DeepSpaceSynthEngine {
  private getAudioContext: () => AudioContext | null;
  private onStateChange?: (playing: boolean) => void;
  private onTimeChange?: (currentTime: number, duration: number) => void;

  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private padFilter: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;

  private isPlaying = false;
  private volume = 0.05;
  private currentTime = 0;
  private lastTickMs = 0;
  private schedulerId: number | null = null;

  private activeSectionIdx = -1;
  private activePadVoices: PadVoice[] = [];
  private lastPulseStep = -1;
  private lastChimeStep = -1;

  constructor(
    getAudioContext: () => AudioContext | null,
    callbacks?: {
      onStateChange?: (playing: boolean) => void;
      onTimeChange?: (currentTime: number, duration: number) => void;
    }
  ) {
    this.getAudioContext = getAudioContext;
    this.onStateChange = callbacks?.onStateChange;
    this.onTimeChange = callbacks?.onTimeChange;
  }

  private mapVolumeToGain(vol: number): number {
    if (vol <= 0.001) return 0;
    const clamped = Math.max(0, Math.min(1, vol));
    return Math.pow(clamped, 0.68) * 0.52;
  }

  private ensureGraph(): AudioContext | null {
    const ctx = this.getAudioContext();
    if (!ctx) return null;

    if (this.ctx === ctx && this.masterGain && this.padFilter && this.analyser) {
      return ctx;
    }

    this.ctx = ctx;

    // Master chain: subMix/padFilter -> compressor -> masterGain -> analyser -> destination
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, ctx.currentTime);
    compressor.knee.setValueAtTime(18, ctx.currentTime);
    compressor.ratio.setValueAtTime(4, ctx.currentTime);
    compressor.attack.setValueAtTime(0.015, ctx.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.currentTime);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.isPlaying ? this.mapVolumeToGain(this.volume) : 0, ctx.currentTime);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.65;

    compressor.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);

    // Warm cosmic low-pass filter with ultra-slow breathing LFO
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(560, ctx.currentTime);
    padFilter.Q.setValueAtTime(1.1, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.045, ctx.currentTime);
    lfoGain.gain.setValueAtTime(260, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);
    lfo.start(ctx.currentTime);

    // Spacious cosmic stereo delay wash
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.43, ctx.currentTime);
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.36, ctx.currentTime);
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(1350, ctx.currentTime);

    padFilter.connect(compressor);
    padFilter.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delay);
    delayFilter.connect(compressor);

    this.compressor = compressor;
    this.masterGain = masterGain;
    this.analyser = analyser;
    this.freqData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    this.padFilter = padFilter;
    this.lfoOsc = lfo;

    return ctx;
  }

  private releasePads(fadeSeconds = 1.6) {
    if (!this.ctx) {
      this.activePadVoices = [];
      return;
    }
    const stopTime = this.ctx.currentTime + fadeSeconds;
    for (let i = 0; i < this.activePadVoices.length; i++) {
      this.activePadVoices[i].stopAt(stopTime);
    }
    this.activePadVoices = [];
    this.activeSectionIdx = -1;
  }

  private spawnSectionPads(sectionIdx: number) {
    const ctx = this.ensureGraph();
    if (!ctx || !this.padFilter || !this.compressor) return;

    const section = COSMIC_SECTIONS[sectionIdx] || COSMIC_SECTIONS[0];
    const now = ctx.currentTime;

    // Crossfade old pads out cleanly
    if (this.activePadVoices.length > 0) {
      const fadeOutAt = now + 2.0;
      for (let i = 0; i < this.activePadVoices.length; i++) {
        this.activePadVoices[i].stopAt(fadeOutAt);
      }
      this.activePadVoices = [];
    }

    this.activeSectionIdx = sectionIdx;

    // Deep continuous sub-bass drone
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(section.subFreq, now);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.24, now + 2.0);
    subOsc.connect(subGain);
    subGain.connect(this.compressor);
    subOsc.start(now);

    this.activePadVoices.push({
      stopAt: (stopT: number) => {
        try {
          const tNow = ctx.currentTime;
          const dur = Math.max(0.15, stopT - tNow);
          subGain.gain.cancelScheduledValues(tNow);
          subGain.gain.setValueAtTime(Math.max(0.0001, subGain.gain.value), tNow);
          subGain.gain.exponentialRampToValueAtTime(0.0001, tNow + dur);
          subOsc.stop(tNow + dur + 0.05);
        } catch {}
      },
    });

    // Detuned dual-oscillator cosmic ambient pad voices
    const voiceAmp = 0.085 / Math.max(1, section.padFreqs.length * 0.55);
    section.padFreqs.forEach((freq, idx) => {
      [-5, 5].forEach((detuneCents, pairIdx) => {
        const osc = ctx.createOscillator();
        const vGain = ctx.createGain();
        osc.type = (idx + pairIdx) % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detuneCents, now);

        vGain.gain.setValueAtTime(0.0001, now);
        vGain.gain.linearRampToValueAtTime(voiceAmp, now + 2.2);

        osc.connect(vGain);
        vGain.connect(this.padFilter as AudioNode);
        osc.start(now);

        this.activePadVoices.push({
          stopAt: (stopT: number) => {
            try {
              const tNow = ctx.currentTime;
              const dur = Math.max(0.15, stopT - tNow);
              vGain.gain.cancelScheduledValues(tNow);
              vGain.gain.setValueAtTime(Math.max(0.0001, vGain.gain.value), tNow);
              vGain.gain.exponentialRampToValueAtTime(0.0001, tNow + dur);
              osc.stop(tNow + dur + 0.05);
            } catch {}
          },
        });
      });
    });
  }

  private triggerSubPulse(sectionIdx: number) {
    const ctx = this.ctx;
    if (!ctx || !this.compressor) return;
    const section = COSMIC_SECTIONS[sectionIdx] || COSMIC_SECTIONS[0];
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(section.subFreq * 1.65, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(28, section.subFreq), t + 0.36);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(t);
    osc.stop(t + 0.48);
  }

  private triggerCosmicChime(sectionIdx: number, stepIndex: number) {
    const ctx = this.ctx;
    if (!ctx || !this.padFilter) return;
    const section = COSMIC_SECTIONS[sectionIdx] || COSMIC_SECTIONS[0];
    const freq = section.chimeFreqs[stepIndex % section.chimeFreqs.length];
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const ovGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.0, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

    ovGain.gain.setValueAtTime(0.0001, t);
    ovGain.gain.linearRampToValueAtTime(0.018, t + 0.06);
    ovGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

    osc.connect(gain);
    overtone.connect(ovGain);
    gain.connect(this.padFilter);
    ovGain.connect(this.padFilter);

    osc.start(t);
    overtone.start(t);
    osc.stop(t + 3.3);
    overtone.stop(t + 1.9);
  }

  private tick = () => {
    if (!this.isPlaying) return;

    const nowMs = performance.now();
    const dtSec = Math.max(0, Math.min(0.5, (nowMs - this.lastTickMs) / 1000));
    this.lastTickMs = nowMs;

    this.currentTime = (this.currentTime + dtSec) % DEEP_SPACE_TRACK_DURATION;
    this.onTimeChange?.(this.currentTime, DEEP_SPACE_TRACK_DURATION);

    const sectionIdx = Math.min(COSMIC_SECTIONS.length - 1, Math.floor(this.currentTime / 45));
    if (sectionIdx !== this.activeSectionIdx) {
      this.spawnSectionPads(sectionIdx);
    }

    // Gentle deep-space heartbeat pulse (~64 BPM = 0.9375s)
    const pulseStep = Math.floor(this.currentTime / 0.9375);
    if (pulseStep !== this.lastPulseStep) {
      this.lastPulseStep = pulseStep;
      this.triggerSubPulse(sectionIdx);
    }

    // Sparse ethereal shimmer chime every 3.75 seconds
    const chimeStep = Math.floor(this.currentTime / 3.75);
    if (chimeStep !== this.lastChimeStep) {
      this.lastChimeStep = chimeStep;
      if (chimeStep > 0 || this.currentTime > 0.2) {
        this.triggerCosmicChime(sectionIdx, chimeStep);
      }
    }
  };

  public async play(): Promise<boolean> {
    const ctx = this.ensureGraph();
    if (!ctx || !this.masterGain) return false;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    if (ctx.state !== 'running') {
      return false;
    }

    if (this.isPlaying) return true;

    this.isPlaying = true;
    this.lastTickMs = performance.now();

    const targetGain = this.mapVolumeToGain(this.volume);
    const t = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), t);
    if (targetGain <= 0) {
      this.masterGain.gain.setValueAtTime(0, t);
    } else {
      this.masterGain.gain.linearRampToValueAtTime(targetGain, t + 0.35);
    }

    this.lastPulseStep = Math.floor(this.currentTime / 0.9375) - 1;
    this.lastChimeStep = Math.floor(this.currentTime / 3.75);

    const sectionIdx = Math.min(COSMIC_SECTIONS.length - 1, Math.floor(this.currentTime / 45));
    this.spawnSectionPads(sectionIdx);

    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
    }
    this.schedulerId = window.setInterval(this.tick, 120);

    this.onStateChange?.(true);
    this.onTimeChange?.(this.currentTime, DEEP_SPACE_TRACK_DURATION);
    return true;
  }

  public pause(): void {
    if (!this.isPlaying && this.schedulerId === null) return;
    this.isPlaying = false;

    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }

    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), t);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      this.masterGain.gain.setValueAtTime(0, t + 0.18);
    }

    this.releasePads(0.25);
    this.onStateChange?.(false);
  }

  public setVolume(vol: number): void {
    this.volume = vol <= 0.02 ? 0 : Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && this.isPlaying) {
      const targetGain = this.mapVolumeToGain(this.volume);
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.04);
    }
  }

  public seek(seconds: number): void {
    const wrapped = ((seconds % DEEP_SPACE_TRACK_DURATION) + DEEP_SPACE_TRACK_DURATION) % DEEP_SPACE_TRACK_DURATION;
    this.currentTime = wrapped;
    this.lastTickMs = performance.now();
    this.lastPulseStep = Math.floor(wrapped / 0.9375);
    this.lastChimeStep = Math.floor(wrapped / 3.75);
    this.onTimeChange?.(this.currentTime, DEEP_SPACE_TRACK_DURATION);

    if (this.isPlaying) {
      const sectionIdx = Math.min(COSMIC_SECTIONS.length - 1, Math.floor(wrapped / 45));
      if (sectionIdx !== this.activeSectionIdx) {
        this.spawnSectionPads(sectionIdx);
      }
    }
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return DEEP_SPACE_TRACK_DURATION;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getBeatEnergy(): number {
    if (!this.isPlaying || this.volume <= 0.001) return 0;

    if (this.analyser && this.freqData) {
      this.analyser.getByteFrequencyData(this.freqData);
      const bassEnergy = (this.freqData[0] + this.freqData[1] + this.freqData[2] + this.freqData[3]) / 4 / 255;
      if (bassEnergy > 0.02) {
        return bassEnergy > 0.42 ? Math.min(1.0, (bassEnergy - 0.3) * 2.1) : bassEnergy * 0.28;
      }
    }

    // Fallback phase envelope matching the 0.9375s deep-space sub pulse
    const beatPeriod = 0.9375;
    const phase = (this.currentTime % beatPeriod) / beatPeriod;
    if (phase < 0.25) {
      return Math.pow(1 - phase / 0.25, 2.2) * 0.85;
    }
    return 0;
  }

  public destroy(): void {
    this.pause();
    try {
      this.lfoOsc?.stop();
    } catch {}
    this.lfoOsc = null;
    this.padFilter = null;
    this.masterGain = null;
    this.analyser = null;
    this.compressor = null;
    this.freqData = null;
  }
}
