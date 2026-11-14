/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Primary high-reliability local asset with seamless remote mirrors:
const PRIMARY_AUDIO_SRC = './audio/bg-music.mp3';
const REMOTE_AUDIO_SRC = 'https://videotourl.com/audio/1794227419367-d268eb0f-7b84-469e-ac23-91689fc1afc7.mp3';
const LEGACY_AUDIO_SRC = 'https://mp3tourl.com/audio/1794093400733-af13578f-6773-43fe-8165-a372cf5d54a8.mp3';
const AUDIO_SOURCES = [PRIMARY_AUDIO_SRC, REMOTE_AUDIO_SRC, LEGACY_AUDIO_SRC];

const DISCORD_INVITE_API = 'https://discord.com/api/v9/invites/JvsWrsCDyK?with_counts=true';

interface DiscordCommunityData {
  name: string;
  avatarUrl: string;
  onlineCount: number;
  totalMembers: number;
}

// --- CELESTIAL WEB AUDIO PROCEDURAL SYNTHESIS ---
let globalAudioCtx: AudioContext | null = null;

const getSharedAudioContext = () => {
  if (!globalAudioCtx && typeof window !== 'undefined') {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      globalAudioCtx = new AudioCtxClass();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
};

// Procedural resonant chime on click with rich celestial variations
const PENTATONIC_SCALE = [
  440, 528, 587.33, 659.25, 783.99, 880, 987.77, 1046.5,
  1174.66, 1318.51, 1396.91, 1567.98, 1760, 1975.53, 2093, 2349.32
];

const playClickChime = (volFactor: number) => {
  if (volFactor <= 0.001) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Low, comfortable default master volume for taps (very slightly quieter)
    const targetGain = Math.max(0.0004, Math.min(0.042, volFactor * 0.038));

    // Pick from broad frequency spectrum
    const baseFreq = PENTATONIC_SCALE[Math.floor(Math.random() * PENTATONIC_SCALE.length)];
    const variationType = Math.floor(Math.random() * 4);

    if (variationType === 0) {
      // 1. Crystal bell: dual oscillator (fundamental + crystalline harmonic overtone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, t);
      osc2.frequency.setValueAtTime(baseFreq * 2.756, t);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.2, t);
      filter.Q.setValueAtTime(3.5, t);

      gain1.gain.setValueAtTime(targetGain * 0.75, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      gain2.gain.setValueAtTime(targetGain * 0.25, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.2);
      osc2.stop(t + 0.14);
    } else if (variationType === 1) {
      // 2. Glassy downward micro-slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * 1.05, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.96, t + 0.14);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFreq * 2.2, t);

      gain.gain.setValueAtTime(targetGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.17);
    } else if (variationType === 2) {
      // 3. Ethereal upward celestial chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.07, t + 0.16);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.05, t);
      filter.Q.setValueAtTime(4.5, t);

      gain.gain.setValueAtTime(targetGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.23);
    } else {
      // 4. Staccato double micro-ping
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq * 1.5, t);
      osc2.frequency.setValueAtTime(baseFreq, t + 0.025);

      gain1.gain.setValueAtTime(targetGain * 0.4, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      gain2.gain.setValueAtTime(0.0001, t);
      gain2.gain.setValueAtTime(targetGain * 0.85, t + 0.025);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.06);
      osc2.start(t + 0.025);
      osc2.stop(t + 0.19);
    }
  } catch {}
};

// Crisp, infrequent sharp swipe slice on fast comet swipes (gentle on ears)
let lastWhooshTime = 0;
const playSwipeWhoosh = (speed: number, volFactor: number) => {
  if (volFactor <= 0.001) return;
  const now = performance.now();
  if (now - lastWhooshTime < 480) return;
  lastWhooshTime = now;

  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const bandpass = ctx.createBiquadFilter();
    const lowpass = ctx.createBiquadFilter();

    // Clean, sharp aerodynamic snap: crisp fast sweep without harsh high sawtooth buzz
    const startFreq = 1050 + Math.min(550, speed * 14);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.065);

    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(startFreq * 0.8, t);
    bandpass.frequency.exponentialRampToValueAtTime(320, t + 0.065);
    bandpass.Q.setValueAtTime(1.6, t);

    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2100, t);

    const targetGain = Math.max(0.0002, Math.min(0.02, volFactor * 0.016));
    gain.gain.setValueAtTime(targetGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.072);

    osc.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  } catch {}
};

// Faint but violent relativistic tidal shredding rumble when black hole tears comets apart
let lastRumbleTime = 0;
const playBlackHoleRumble = (volFactor: number) => {
  if (volFactor <= 0.001) return;
  const now = performance.now();
  if (now - lastRumbleTime < 180) return;
  lastRumbleTime = now;

  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Faint master volume (subtle, non-intrusive)
    const targetGain = Math.max(0.0005, Math.min(0.035, volFactor * 0.028));

    // Carrier: Deep singularity plunge
    const carrier = ctx.createOscillator();
    const carrierGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Modulator: High-frequency violent jitter / shredding frequency modulation
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();

    const startFreq = 62 + Math.random() * 18;
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(startFreq, t);
    carrier.frequency.exponentialRampToValueAtTime(28, t + 0.32);

    // Rapid violent FM flutter (simulating violent relativistic tidal tearing)
    mod.type = 'sawtooth';
    mod.frequency.setValueAtTime(84 + Math.random() * 24, t);
    mod.frequency.exponentialRampToValueAtTime(36, t + 0.32);
    modGain.gain.setValueAtTime(45, t);
    modGain.gain.exponentialRampToValueAtTime(8, t + 0.32);

    mod.connect(carrier.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, t);
    filter.frequency.exponentialRampToValueAtTime(60, t + 0.32);
    filter.Q.setValueAtTime(2.8, t);

    carrierGain.gain.setValueAtTime(targetGain, t);
    carrierGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);

    carrier.connect(filter);
    filter.connect(carrierGain);
    carrierGain.connect(ctx.destination);

    mod.start(t);
    carrier.start(t);
    mod.stop(t + 0.35);
    carrier.stop(t + 0.35);
  } catch {}
};

// Gentle celestial ping when hold-spawning a comet (calibrated to low default volume)
const playCometSpawnPing = (volFactor: number) => {
  if (volFactor <= 0.001) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1420 + Math.random() * 120, t);
    osc.frequency.exponentialRampToValueAtTime(1080, t + 0.14);

    const targetGain = Math.max(0.0004, Math.min(0.035, volFactor * 0.03));
    gain.gain.setValueAtTime(targetGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  } catch {}
};

// Procedural pop-out bubble sound for disc toggle (calibrated to low default volume)
const playPopOutSound = (volFactor: number) => {
  if (volFactor <= 0.001) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.06);

    const targetGain = Math.max(0.0005, Math.min(0.065, volFactor * 0.055));
    gain.gain.setValueAtTime(targetGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  } catch {}
};

let lastLineBounceAudioTime = 0;
let lastOutlineBounceAudioTime = 0;

// Procedural springy bounce sound for the Blue Bounce Line (minor springy plink) & Music Bar outline (way quieter)
const playSpringBounceSound = (volFactor: number, entitySize: number, isNebulaOutline = false) => {
  if (volFactor <= 0.001) return;
  const nowMs = performance.now();
  if (isNebulaOutline) {
    if (nowMs - lastOutlineBounceAudioTime < 260) return;
    lastOutlineBounceAudioTime = nowMs;
  } else {
    if (nowMs - lastLineBounceAudioTime < 42) return;
    lastLineBounceAudioTime = nowMs;
  }

  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isNebulaOutline) {
      // Ultra-quiet gentle hush on Music Bar / Track Navigator outline
      const baseFreq = 340 + Math.random() * 80;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, t + 0.03);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, t + 0.075);

      const qGain = Math.max(0.00005, Math.min(0.0012, volFactor * 0.0008));
      gain.gain.setValueAtTime(qGain, t);
      gain.gain.exponentialRampToValueAtTime(0.00001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.085);
    } else {
      // Minor springy bounce scaled subtly by entity size on the Blue Bounce Line
      const clampedSize = Math.max(1, Math.min(20, entitySize || 2));
      const baseFreq = Math.max(170, 500 - clampedSize * 15);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.38, t + 0.055);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, t + 0.145);

      const targetGain = Math.max(
        0.0004,
        Math.min(0.036, volFactor * (0.014 + Math.min(0.02, clampedSize * 0.0014)))
      );
      gain.gain.setValueAtTime(targetGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.155);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    }
  } catch {}
};

// Procedural synthesizer for Earth, Sun, Black Hole creation, absorption, and hyper-comets
// Procedural synthesizer for Earth, Sun, Black Hole, Supernova, Red Planet, Gas Giant, Spaceship, and interactive manipulation
const playCelestialTierSound = (
  type: 'earth' | 'sun' | 'blackhole' | 'absorb' | 'hyper' | 'supernova' | 'redplanet' | 'gasgiant' | 'spaceship' | 'holdlock' | 'fling',
  volFactor: number
) => {
  if (volFactor <= 0.001) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    if (type === 'earth') {
      // Earth creation: Ethereal terrestrial bio-harmonic chord (528Hz life resonance, 660Hz 5th, 792Hz 9th, 1056Hz octave)
      const earthGain = Math.max(0.0005, Math.min(0.055, volFactor * 0.045));
      [528, 660, 792, 1056].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.08, t + 0.42);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, t);
        filter.Q.setValueAtTime(3.0, t);

        gain.gain.setValueAtTime((earthGain * 0.6) / (idx * 0.6 + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.44);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.46);
      });
    } else if (type === 'sun') {
      // Sun creation: Majestic warm solar flare chord with coronal resonance
      const sunGain = Math.max(0.0005, Math.min(0.065, volFactor * 0.052));
      const solarFreqs = [110, 220, 330, 440, 554, 660];
      solarFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.95, t + 0.55);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);
        filter.frequency.exponentialRampToValueAtTime(1400, t + 0.18);
        filter.frequency.exponentialRampToValueAtTime(350, t + 0.55);

        gain.gain.setValueAtTime((sunGain * 0.55) / (idx * 0.5 + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.56);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.58);
      });
    } else if (type === 'blackhole') {
      // Black Hole creation / absorption: Dramatic relativistic singularity collapse
      const bhGain = Math.max(0.0005, Math.min(0.065, volFactor * 0.052));

      const collapseOsc = ctx.createOscillator();
      const collapseGain = ctx.createGain();
      const collapseFilter = ctx.createBiquadFilter();

      collapseOsc.type = 'sawtooth';
      collapseOsc.frequency.setValueAtTime(420, t);
      collapseOsc.frequency.exponentialRampToValueAtTime(34, t + 0.65);

      collapseFilter.type = 'lowpass';
      collapseFilter.frequency.setValueAtTime(650, t);
      collapseFilter.frequency.exponentialRampToValueAtTime(80, t + 0.65);
      collapseFilter.Q.setValueAtTime(2.5, t);

      collapseGain.gain.setValueAtTime(bhGain * 0.85, t);
      collapseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.68);

      collapseOsc.connect(collapseFilter);
      collapseFilter.connect(collapseGain);
      collapseGain.connect(ctx.destination);

      collapseOsc.start(t);
      collapseOsc.stop(t + 0.7);

      const chirpOsc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      chirpOsc.type = 'sine';
      chirpOsc.frequency.setValueAtTime(1800, t);
      chirpOsc.frequency.exponentialRampToValueAtTime(220, t + 0.09);

      chirpGain.gain.setValueAtTime(bhGain * 0.35, t);
      chirpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      chirpOsc.connect(chirpGain);
      chirpGain.connect(ctx.destination);

      chirpOsc.start(t);
      chirpOsc.stop(t + 0.11);
    } else if (type === 'supernova') {
      // Big Supernova: Massive deep stellar blast + incandescent solar expansion shimmer
      const snGain = Math.max(0.0005, Math.min(0.08, volFactor * 0.065));
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      const boomFilter = ctx.createBiquadFilter();

      boomOsc.type = 'sawtooth';
      boomOsc.frequency.setValueAtTime(90, t);
      boomOsc.frequency.exponentialRampToValueAtTime(24, t + 0.82);

      boomFilter.type = 'lowpass';
      boomFilter.frequency.setValueAtTime(320, t);
      boomFilter.frequency.exponentialRampToValueAtTime(45, t + 0.82);

      boomGain.gain.setValueAtTime(snGain * 0.9, t);
      boomGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      boomOsc.connect(boomFilter);
      boomFilter.connect(boomGain);
      boomGain.connect(ctx.destination);

      boomOsc.start(t);
      boomOsc.stop(t + 0.88);

      [440, 660, 880, 1320].forEach((freq, idx) => {
        const fOsc = ctx.createOscillator();
        const fGain = ctx.createGain();
        fOsc.type = 'sine';
        fOsc.frequency.setValueAtTime(freq, t);
        fOsc.frequency.exponentialRampToValueAtTime(freq * 0.88, t + 0.65);
        fGain.gain.setValueAtTime((snGain * 0.4) / (idx + 1), t);
        fGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        fOsc.connect(fGain);
        fGain.connect(ctx.destination);
        fOsc.start(t);
        fOsc.stop(t + 0.72);
      });
    } else if (type === 'redplanet') {
      // Red Planet: Warm rocky tectonic resonance
      const rpGain = Math.max(0.0005, Math.min(0.055, volFactor * 0.045));
      [165, 220, 330, 495].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t + 0.42);
        gain.gain.setValueAtTime((rpGain * 0.6) / (idx + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.48);
      });
    } else if (type === 'gasgiant') {
      // Gas Giant with rings: Majestic Saturnian ring harmonic chord
      const ggGain = Math.max(0.0005, Math.min(0.065, volFactor * 0.052));
      [147, 294, 441, 588, 882].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.58);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, t);
        filter.Q.setValueAtTime(3.8, t);
        gain.gain.setValueAtTime((ggGain * 0.5) / (idx + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.65);
      });
    } else if (type === 'spaceship') {
      // Spaceship launch: crisp ascending hyperdrive acceleration chirp
      const ssGain = Math.max(0.0005, Math.min(0.045, volFactor * 0.038));
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(2600, t + 0.22);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(380, t);
      gain.gain.setValueAtTime(ssGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'holdlock') {
      // Gravitational hold lock tone
      const hlGain = Math.max(0.0005, Math.min(0.045, volFactor * 0.035));
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(680, t + 0.12);
      gain.gain.setValueAtTime(hlGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === 'fling') {
      // Fling release spatial whip
      const flGain = Math.max(0.0005, Math.min(0.05, volFactor * 0.04));
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(360, t + 0.12);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(880, t);
      filter.Q.setValueAtTime(3.2, t);
      gain.gain.setValueAtTime(flGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    } else if (type === 'absorb') {
      // Crisp subtle orbital absorption snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.07);
      gain.gain.setValueAtTime(Math.max(0.0005, Math.min(0.045, volFactor * 0.038)), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (type === 'hyper') {
      // Supersonic high-velocity cosmic streak
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(3200, t + 0.15);
      gain.gain.setValueAtTime(Math.max(0.0005, Math.min(0.04, volFactor * 0.032)), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.19);
    }
  } catch {}
};

// Music Audio Beat Analyzer: Web Audio Analyser with tempo tracker fallback
let mediaElementSource: MediaElementAudioSourceNode | null = null;
let musicAnalyser: AnalyserNode | null = null;
let musicFreqData: Uint8Array<ArrayBuffer> | null = null;

const getMusicBeatEnergy = (
  audio: HTMLAudioElement | null,
  isAudioPlaying: boolean,
  musicVol: number
): number => {
  if (!audio || !isAudioPlaying || audio.paused || musicVol <= 0.001) {
    return 0;
  }

  // 1. Attempt to use Web Audio Analyser if connected
  try {
    const ctx = getSharedAudioContext();
    if (ctx && !mediaElementSource && audio.src) {
      try {
        mediaElementSource = ctx.createMediaElementSource(audio);
        musicAnalyser = ctx.createAnalyser();
        musicAnalyser.fftSize = 64;
        musicAnalyser.smoothingTimeConstant = 0.65;
        mediaElementSource.connect(musicAnalyser);
        musicAnalyser.connect(ctx.destination);
        musicFreqData = new Uint8Array(new ArrayBuffer(musicAnalyser.frequencyBinCount));
      } catch {
        // Fallback gracefully if browser or CORS prevents media element source
      }
    }

    if (musicAnalyser && musicFreqData) {
      musicAnalyser.getByteFrequencyData(musicFreqData);
      // Low bass / sub-kick frequencies are in bins 0..3
      const bassEnergy = (musicFreqData[0] + musicFreqData[1] + musicFreqData[2] + musicFreqData[3]) / 4 / 255;
      if (bassEnergy > 0.03) {
        // Real frequency spectrum active: detect kicks
        return bassEnergy > 0.52 ? Math.min(1.0, (bassEnergy - 0.4) * 2.2) : bassEnergy * 0.22;
      }
    }
  } catch {}

  // 2. Resilient Procedural Tempo Beat Detector based on track playback time
  // For electronic/ambient EDM tracks (~128 BPM = ~0.46875s per beat, 4/4 signature)
  const ct = audio.currentTime;
  if (ct > 0) {
    const beatPeriod = 0.46875;
    const phase = (ct % beatPeriod) / beatPeriod;
    if (phase < 0.22) {
      const kickEnvelope = Math.pow(1 - phase / 0.22, 2.5);
      const beatIndex = Math.floor(ct / beatPeriod) % 4;
      const downbeatMultiplier = beatIndex === 0 ? 1.0 : 0.85;
      return kickEnvelope * downbeatMultiplier;
    }
  }

  return 0;
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  // Dual Volume Controls:
  // Dot A (Interactive SFX): Pure black dot with black border (controls all interactive synthesized SFX)
  // Dot B (Music Volume): Completely white dot (controls background music)
  // Default music volume lowered significantly ("it's still too darn loud" -> 5%)
  // Default SFX volume set to 15%
  const [musicVolume, setMusicVolume] = useState(0.05);
  const [sfxVolume, setSfxVolume] = useState(0.15);
  const musicVolumeRef = useRef(0.05);
  const sfxVolumeRef = useRef(0.15);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Top-left Guide modal & Gyroscope status state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const isGuideOpenRef = useRef(false);
  useEffect(() => {
    isGuideOpenRef.current = isGuideOpen;
  }, [isGuideOpen]);
  const [hasOpenedGuide, setHasOpenedGuide] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [hasGyroHardware, setHasGyroHardware] = useState(false);

  // Disc menu dropdown (Track Navigator) & separated bottom SoundCloud audio source state
  const [isDiscMenuOpen, setIsDiscMenuOpen] = useState(false);
  const [isSoundCloudOpen, setIsSoundCloudOpen] = useState(true);
  const isSoundCloudOpenRef = useRef(true);
  useEffect(() => {
    isSoundCloudOpenRef.current = isSoundCloudOpen;
  }, [isSoundCloudOpen]);
  const [musicBarBottom, setMusicBarBottom] = useState(24);
  const [showBottomCue, setShowBottomCue] = useState(false);
  const bounceLineRef = useRef<HTMLDivElement | null>(null);
  const soundCloudSectionRef = useRef<HTMLDivElement | null>(null);
  const musicBarColRef = useRef<HTMLDivElement | null>(null);
  const musicBarPillRef = useRef<HTMLDivElement | null>(null);
  const trackNavRef = useRef<HTMLDivElement | null>(null);
  const [trackCurrentTime, setTrackCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Majestic Slim Time Control Knob State (0.0 = extreme slow, 0.5 = normal 1.0x, 1.0 = hyper fast 10.0x)
  const [timePos, setTimePos] = useState(0.5);
  const [timeScale, setTimeScale] = useState(1.0);
  const timeScaleRef = useRef(1.0);
  const timeTrackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingTimeRef = useRef(false);

  // Live community statistics with resilient defaults
  const [discordData, setDiscordData] = useState<DiscordCommunityData>({
    name: 'Agartha',
    avatarUrl: 'https://cdn.discordapp.com/icons/1454504133716349031/5862fe097ae61ac2c28600b7d0bbeecf.png?size=256',
    onlineCount: 54,
    totalMembers: 253,
  });

  const userExplicitlyPausedRef = useRef(false);
  const hasEverPlayedRef = useRef(false);

  // Fetch real-time Discord stats
  useEffect(() => {
    fetch(DISCORD_INVITE_API)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.guild) {
          const guildId = data.guild.id || '1454504133716349031';
          const iconHash = data.guild.icon || '5862fe097ae61ac2c28600b7d0bbeecf';
          const avatar = iconHash
            ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=256`
            : 'https://cdn.discordapp.com/icons/1454504133716349031/5862fe097ae61ac2c28600b7d0bbeecf.png?size=256';

          setDiscordData({
            name: data.guild.name || 'Agartha',
            avatarUrl: avatar,
            onlineCount: data.approximate_presence_count || 54,
            totalMembers: data.approximate_member_count || 253,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Ensure user lands at the default entrance height (everything stays at its original level, with empty space 1 swipe above)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash && window.scrollY === 0) {
      const topBuffer = window.innerHeight * 0.38;
      window.scrollTo({ top: topBuffer, behavior: 'auto' });
    }
  }, []);

  const currentSourceIndexRef = useRef(0);

  const tryFallbackAudio = useCallback(() => {
    if (!isSoundCloudOpenRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    currentSourceIndexRef.current = (currentSourceIndexRef.current + 1) % AUDIO_SOURCES.length;
    const nextSrc = AUDIO_SOURCES[currentSourceIndexRef.current];
    audio.src = nextSrc;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          hasEverPlayedRef.current = true;
          setStatusMessage(null);
        })
        .catch(() => {
          // Keep fallback quiet if browser autoplay blocks
        });
    }
  }, []);

  const startAudio = useCallback(async () => {
    if (!isSoundCloudOpenRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Ensure Web Audio context is primed
    getSharedAudioContext();
    audio.volume = musicVolumeRef.current;

    // If audio element is errored or uninitialized, reload with current source
    if (audio.error || !audio.src || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      audio.src = AUDIO_SOURCES[currentSourceIndexRef.current];
      audio.load();
    }

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        if (!isSoundCloudOpenRef.current) {
          audio.pause();
          setIsPlaying(false);
          return;
        }
        setIsPlaying(true);
        userExplicitlyPausedRef.current = false;
        hasEverPlayedRef.current = true;
        setStatusMessage(null);
      }
    } catch (err: unknown) {
      const domErr = err as DOMException;
      if (domErr && domErr.name === 'NotAllowedError') {
        if (!hasEverPlayedRef.current) {
          setStatusMessage('Click anywhere to enable audio');
        }
      } else if (domErr && domErr.name === 'AbortError') {
        // Ignored: interrupted by fresh play/load request
      } else {
        tryFallbackAudio();
      }
    }
  }, [tryFallbackAudio]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    userExplicitlyPausedRef.current = true;
  }, []);

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const audio = audioRef.current;
    if (!audio) return;

    // Check physical audio element status directly to prevent inverted state desync
    if (!audio.paused && !audio.ended) {
      pauseAudio();
    } else if (!isSoundCloudOpenRef.current) {
      setStatusMessage('Audio source hidden — press Show below');
    } else {
      userExplicitlyPausedRef.current = false;
      startAudio();
    }
  };

  const toggleSoundCloudSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopOutSound(sfxVolumeRef.current);
    setIsSoundCloudOpen((prev) => {
      const next = !prev;
      isSoundCloudOpenRef.current = next;
      if (!next) {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
          audio.pause();
        }
        setIsPlaying(false);
      } else {
        setStatusMessage(null);
        if (!userExplicitlyPausedRef.current) {
          startAudio();
        }
      }
      return next;
    });
  };

  // Independent volume controls: Snap to 0 when dragged completely to left (<= 0.02)
  const updateMusicVolume = useCallback((val: number) => {
    const clamped = val <= 0.02 ? 0 : Math.max(0, Math.min(1, val));
    setMusicVolume(clamped);
    musicVolumeRef.current = clamped;
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = clamped === 0;
    }
  }, []);

  const updateSfxVolume = useCallback((val: number) => {
    const clamped = val <= 0.02 ? 0 : Math.max(0, Math.min(1, val));
    setSfxVolume(clamped);
    sfxVolumeRef.current = clamped;
  }, []);

  useEffect(() => {
    musicVolumeRef.current = musicVolume;
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
      audioRef.current.muted = musicVolume === 0;
    }
  }, [musicVolume]);

  useEffect(() => {
    sfxVolumeRef.current = sfxVolume;
  }, [sfxVolume]);

  // Track progress & seek helpers
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const skipTime = (deltaSecs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration || trackDuration || 999999;
    const newTime = Math.max(0, Math.min(dur, audio.currentTime + deltaSecs));
    audio.currentTime = newTime;
    setTrackCurrentTime(newTime);
    playPopOutSound(sfxVolumeRef.current * 0.7);
  };

  const handleSeekFromClientX = (clientX: number) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration || trackDuration || 0;
    if (dur > 0) {
      const newTime = ratio * dur;
      audio.currentTime = newTime;
      setTrackCurrentTime(newTime);
    }
  };

  const handleProgressPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    isSeekingRef.current = true;
    setIsSeeking(true);
    handleSeekFromClientX(e.clientX);
    try {
      if (progressBarRef.current) {
        progressBarRef.current.setPointerCapture(e.pointerId);
      }
    } catch {}
  };

  const handleProgressPointerMove = (e: React.PointerEvent) => {
    if (!isSeekingRef.current) return;
    e.stopPropagation();
    handleSeekFromClientX(e.clientX);
  };

  const handleProgressPointerUp = (e: React.PointerEvent) => {
    if (!isSeekingRef.current) return;
    e.stopPropagation();
    handleSeekFromClientX(e.clientX);
    isSeekingRef.current = false;
    setIsSeeking(false);
    try {
      if (progressBarRef.current && progressBarRef.current.hasPointerCapture(e.pointerId)) {
        progressBarRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  // Map scale (0.01x to 10.0x) to normalized position (0.0 to 1.0)
  const scaleToPos = (scale: number): number => {
    const s = Math.max(0.01, Math.min(10.0, scale));
    if (s <= 1.0) {
      return ((s - 0.01) / 0.99) * 0.5;
    }
    return 0.5 + ((s - 1.0) / 9.0) * 0.5;
  };

  // Step micro-control: -0.01 or +0.01
  const stepTimeScale = useCallback((delta: number) => {
    const current = timeScaleRef.current;
    const newScale = Math.max(0.01, Math.min(10.0, Math.round((current + delta) * 100) / 100));
    const newPos = scaleToPos(newScale);
    setTimeScale(newScale);
    timeScaleRef.current = newScale;
    setTimePos(newPos);
  }, []);

  // Time Control: Drag handlers (Center line = 1.00x normal speed, 0.01x to 10.0x)
  const updateTimeFromClientX = useCallback((clientX: number) => {
    if (!timeTrackRef.current) return;
    const rect = timeTrackRef.current.getBoundingClientRect();
    const rawRatio = (clientX - rect.left) / (rect.width || 1);
    let clamped = Math.max(0, Math.min(1, rawRatio));

    // Magnetic snap to center (1.00x default speed)
    if (Math.abs(clamped - 0.5) < 0.02) {
      clamped = 0.5;
    }

    let scale = 1.0;
    if (clamped <= 0.5) {
      // 0.0 -> 0.01x (deep slow-motion), 0.5 -> 1.0x (normal)
      scale = 0.01 + (clamped / 0.5) * 0.99;
    } else {
      // 0.5 -> 1.0x (normal), 1.0 -> 10.0x (hyper speed)
      scale = 1.0 + ((clamped - 0.5) / 0.5) * 9.0;
    }
    scale = Math.round(scale * 100) / 100;

    setTimePos(clamped);
    setTimeScale(scale);
    timeScaleRef.current = scale;
  }, []);

  const handleTimePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    isDraggingTimeRef.current = true;
    updateTimeFromClientX(e.clientX);
    try {
      if (timeTrackRef.current) {
        timeTrackRef.current.setPointerCapture(e.pointerId);
      }
    } catch {}
  };

  const handleTimePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingTimeRef.current) return;
    e.stopPropagation();
    updateTimeFromClientX(e.clientX);
  };

  const handleTimePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingTimeRef.current) return;
    e.stopPropagation();
    updateTimeFromClientX(e.clientX);
    isDraggingTimeRef.current = false;
    try {
      if (timeTrackRef.current && timeTrackRef.current.hasPointerCapture(e.pointerId)) {
        timeTrackRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  const toggleDiscMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopOutSound(sfxVolumeRef.current);
    setIsDiscMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = musicVolumeRef.current;
    startAudio();

    // Universal gesture handler to unlock and initiate audio on first tap/click anywhere
    const handleUserGesture = () => {
      getSharedAudioContext();
      if (userExplicitlyPausedRef.current || !isSoundCloudOpenRef.current) return;

      const currentAudio = audioRef.current;
      if (currentAudio && (currentAudio.paused || currentAudio.ended)) {
        startAudio();
      }
    };

    const interactionEvents: (keyof WindowEventMap)[] = ['click', 'touchstart', 'pointerdown', 'keydown'];
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserGesture, { passive: true });
    });

    return () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserGesture);
      });
    };
  }, [startAudio]);

  // Keep fixed Music Bar + Track Navigator sitting cleanly right above Nebula & show bottom cue right above Music Bar when at page bottom
  useEffect(() => {
    const updateMusicBarPosition = () => {
      const lineEl = bounceLineRef.current;
      if (!lineEl) {
        setMusicBarBottom(24);
        setShowBottomCue(false);
        return;
      }
      const lineRect = lineEl.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const nebulaCrestTop = lineRect.top - (isMobile ? 54 : 52);
      const desired = Math.max(24, Math.ceil(window.innerHeight - nebulaCrestTop + (isMobile ? 12 : 6)));
      const maxSafe = Math.max(24, window.innerHeight - (isMobile ? 165 : 175));
      setMusicBarBottom(Math.min(desired, maxSafe));
      setShowBottomCue(lineRect.top <= window.innerHeight + 30);
    };

    updateMusicBarPosition();
    window.addEventListener('scroll', updateMusicBarPosition, { passive: true });
    window.addEventListener('resize', updateMusicBarPosition, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateMusicBarPosition);
      window.removeEventListener('resize', updateMusicBarPosition);
    };
  }, [isSoundCloudOpen, isDiscMenuOpen]);

  // Cyan Vortex Canvas Animation with Physics Comet Trajectory Alterations,
  // Hold-to-Create Comets, Procedural Click Variations, and Black Hole Tidal Disruption
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let centerX = width / 2;
    let centerY = height / 2;

    const resizeCanvas = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };

    window.addEventListener('resize', resizeCanvas);

    // Dynamic Parallax, Scroll Reveal & Momentum State (all synchronized 1:1 in canvas space)
    const getScrollRevealProgress = () => {
      const topBuffer = window.innerHeight * 0.38;
      const vortexFullThreshold = window.innerHeight * 1.0;
      const relScroll = Math.max(0, window.scrollY - topBuffer);
      return Math.min(1, Math.max(0, relScroll / (vortexFullThreshold || 1)));
    };
    let targetVortexProgress = getScrollRevealProgress();
    let smoothVortexProgress = targetVortexProgress;
    let smoothBottomVortexLift = 0;
    let lastDynamicCenterX = centerX;
    let lastDynamicCenterY = centerY + (1 - smoothVortexProgress) * (height * 0.35);
    let currentTidalR = 38;

    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let vortexImpulseSpeed = 0;

    // Phone Gyroscope Perspective 3D Tilt State
    let targetGyroTiltX = 0;
    let targetGyroTiltY = 0;
    let gyroTiltX = 0;
    let gyroTiltY = 0;

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Check if real orientation coordinates exist
      if (e.gamma !== null || e.beta !== null) {
        setHasGyroHardware(true);
        setGyroActive(true);
      }
      // gamma is left/right roll [-90, 90]
      // beta is front/back pitch [-180, 180], resting handheld phone is typically ~40-50 deg
      const rawGamma = e.gamma ?? 0;
      const rawBeta = e.beta ?? 45;

      // Generous responsive tilt: up to +-45px horizontal shift, +-35px vertical perspective shift
      targetGyroTiltX = Math.max(-45, Math.min(45, rawGamma * 1.1));
      targetGyroTiltY = Math.max(-35, Math.min(35, (rawBeta - 45) * 0.9));
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });

    // Pointer Interaction State
    let isPointerDown = false;
    let holdStartTime = 0;
    let lastCometSpawnTime = 0;
    let pointerX = 0;
    let pointerY = 0;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let hasPrevPointer = false;
    let prevMoveTime = performance.now();
    let strokeDistance = 0;
    let currentStrokeId = 1;
    let lastSwipeMoveTime = 0;
    let lastTrailPushTime = 0;
    let lastProcessedMoveTime = 0;
    let lastProcessedMoveX = -9999;
    let lastProcessedMoveY = -9999;

    // Data Structures
    interface Comet {
      angle: number;
      radius: number;
      originalRadius: number;
      speed: number;
      size: number;
      alpha: number;
      originalSize: number;
      perturbX: number;
      perturbY: number;
      isBreakingApart: boolean;
      destructionProgress: number;
      color: string;
      isPermanent?: boolean;
      isHyperFast?: boolean;
      radialVelocity?: number;
      hyperX?: number;
      hyperY?: number;
      hyperVx?: number;
      hyperVy?: number;
      hyperHistory?: { x: number; y: number }[];
      specialType?: 'earth' | 'sun' | 'blackhole' | 'red_planet' | 'gas_giant' | 'hawking_star';
      mass?: number;
      pulseAnim?: number;
      absorptionCount?: number;
      nebulaHoverTimer?: number;
      isHeld?: boolean;
      isFlinging?: boolean;
      flingVx?: number;
      flingVy?: number;
      flingPosX?: number;
      flingPosY?: number;
      ringTilt?: number;
      ringRadius?: number;
      ringAngle?: number;
      // Hawking Star & Sun Ingestion & Accretion Disks
      absorbedSunsCount?: number;
      firstSunAbsorbedTime?: number;
      hawkingProgress?: number; // 0 to 1 over 2 minutes (120,000ms)
      hasYellowDisk?: boolean;
      absorbedSunsForDisk?: number; // 1 = minor accretion disk, 2 = full-on
      lastLineBounceTime?: number;
    }

    interface NebulaDustParticle {
      normX: number;
      baseRelY: number;
      isCorner?: boolean;
      cornerRelY?: number;
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
      lastOutlineBounceTime: number;
      color: string;
      size: number;
      alpha: number;
      driftSpeed: number;
      driftOffset: number;
      eatenProgress: number; // 0 = normal, 1 = swallowed by blackhole
    }

    interface LineRipple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
      lineWidth: number;
    }

    interface Spaceship {
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      exhaust: { x: number; y: number; alpha: number; size: number }[];
      alpha: number;
      isHeld?: boolean;
    }

    interface BreakupDebris {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
    }

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
      lineWidth: number;
      color: string;
    }

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
    }

    interface TrailPoint {
      x: number;
      y: number;
      createdAt: number;
      size: number;
      maxAlpha: number;
      strokeId: number;
    }

    interface BirthAura {
      x: number;
      y: number;
      radius: number;
      alpha: number;
    }

    const comets: Comet[] = [];
    const spaceships: Spaceship[] = [];
    const breakupDebris: BreakupDebris[] = [];
    const ripples: Ripple[] = [];
    const lineRipples: LineRipple[] = [];
    const sparks: Spark[] = [];
    const trail: TrailPoint[] = [];
    const birthAuras: BirthAura[] = [];

    // Concave Nebula Dust Particles (~420 tiny colorful particles along bottom concave curve & fully filling bottom corners)
    const NEBULA_DUST_COLORS = ['#00f2fe', '#38bdf8', '#c084fc', '#e879f9', '#ec4899', '#f472b6', '#ffffff', '#a855f7'];
    const nebulaDustParticles: NebulaDustParticle[] = [];
    for (let i = 0; i < 420; i++) {
      let normX = Math.random();
      let baseRelY = (Math.random() - 0.15) * 52;
      let isCorner = false;
      let cornerRelY = 0;

      // Ensure bottom 2 corners are richly populated and fully filled down to the very edges
      if (i < 110) {
        // Bottom-left corner fill
        normX = Math.random() * 0.32;
        isCorner = true;
        cornerRelY = Math.random(); // 0 to 1 down from curve to absolute bottom
      } else if (i < 220) {
        // Bottom-right corner fill
        normX = 0.68 + Math.random() * 0.32;
        isCorner = true;
        cornerRelY = Math.random(); // 0 to 1 down from curve to absolute bottom
      }

      nebulaDustParticles.push({
        normX,
        baseRelY,
        isCorner,
        cornerRelY,
        x: 0,
        y: 0,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        lastOutlineBounceTime: 0,
        color: NEBULA_DUST_COLORS[Math.floor(Math.random() * NEBULA_DUST_COLORS.length)],
        size: Math.random() * 2.2 + 0.7,
        alpha: Math.random() * 0.7 + 0.28,
        driftSpeed: Math.random() * 0.0012 + 0.0006,
        driftOffset: Math.random() * Math.PI * 2,
        eatenProgress: 0,
      });
    }

    // Hold-to-stop & fling manipulation state
    let holdCandidate: Comet | null = null;
    let holdCandidateShip: Spaceship | null = null;
    let holdCandidateStartTime = 0;
    let holdPointerStartPos = { x: 0, y: 0 };
    let heldBody: Comet | null = null;
    let heldSpaceship: Spaceship | null = null;
    let recentSwipeVx = 0;
    let recentSwipeVy = 0;

    // Color palette variations for clicks & sparks
    const CYAN_PALETTE = ['#00f2fe', '#38bdf8', '#67e8f9', '#a5f3fc', '#e0ffff'];

    // Initialize base population of comets (slightly increased normal comet count)
    const initialCometCount = 98;
    for (let i = 0; i < initialCometCount; i++) {
      const initSize = Math.random() * 2 + 0.6;
      comets.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * Math.max(width, height) * 0.5 + 20,
        originalRadius: Math.random() * Math.max(width, height) * 0.5 + 20,
        speed: 0.002 + Math.random() * 0.003,
        size: initSize,
        originalSize: initSize,
        alpha: Math.random() * 0.5 + 0.25,
        perturbX: 0,
        perturbY: 0,
        isBreakingApart: false,
        destructionProgress: 0,
        color: CYAN_PALETTE[Math.floor(Math.random() * CYAN_PALETTE.length)],
      });
    }

    let vortexRotation = 0;
    let blackHoleRotation = 0;

    // Anchor Nebula strictly above the futuristic blue Bounce Line & SoundCloud section
    const getPageBottomViewportY = () => {
      if (bounceLineRef.current) {
        return bounceLineRef.current.getBoundingClientRect().top - 2;
      }
      if (soundCloudSectionRef.current) {
        return soundCloudSectionRef.current.getBoundingClientRect().top - 2;
      }
      const scrollH = Math.max(
        document.documentElement.scrollHeight || 0,
        document.body.scrollHeight || 0,
        height
      );
      return scrollH - window.scrollY;
    };

    const triggerLineBounce = (hitX: number, lineY: number, entitySize: number) => {
      const clampedSize = Math.max(0.8, Math.min(22, entitySize || 2));
      lineRipples.push({
        x: hitX,
        y: lineY,
        radius: 2,
        maxRadius: Math.max(16, Math.min(130, 12 + clampedSize * 5.4)),
        alpha: Math.min(0.98, 0.55 + clampedSize * 0.028),
        speed: Math.max(1.8, Math.min(5.2, 1.6 + clampedSize * 0.18)),
        lineWidth: Math.max(1.2, Math.min(3.6, 1.0 + clampedSize * 0.16)),
      });
      if (lineRipples.length > 48) {
        lineRipples.shift();
      }
      playSpringBounceSound(sfxVolumeRef.current, clampedSize, false);
    };

    const triggerOutlineBounce = (ptSize: number) => {
      playSpringBounceSound(sfxVolumeRef.current, ptSize, true);
    };

    let prevNebulaBottomY = getPageBottomViewportY();
    let smoothNebulaAnchorY = prevNebulaBottomY;
    let smoothNebulaScrollVel = 0;
    let smoothNebulaArchOffset = 0;

    // Concave bottom baseline helper: curves upward at both left and right edges, dipping in the center
    const getConcaveBaseY = (xPos: number, anchorY = getPageBottomViewportY()) => {
      const norm = (xPos - width * 0.5) / (width * 0.5 || 1);
      const archAmp = width < 640 ? 54 : 78;
      return anchorY - 48 - (norm * norm) * (archAmp + smoothNebulaArchOffset);
    };

    const getCometPos = (c: Comet, dynX = lastDynamicCenterX, dynY = lastDynamicCenterY) => {
      if ((c.isHeld || c.isFlinging) && c.flingPosX !== undefined && c.flingPosY !== undefined) {
        return { x: c.flingPosX, y: c.flingPosY };
      }
      if (c.isHyperFast && c.hyperX !== undefined && c.hyperY !== undefined) {
        return { x: c.hyperX, y: c.hyperY };
      }
      return {
        x: dynX + c.perturbX + Math.cos(c.angle + vortexRotation) * c.radius * 1.2,
        y: dynY + c.perturbY + Math.sin(c.angle + vortexRotation) * (c.radius * 0.7),
      };
    };

    const isInsideVortexCore = (px: number, py: number) => {
      const distFromVortex = Math.hypot(
        (px - lastDynamicCenterX) / 1.2,
        (py - lastDynamicCenterY) / 0.7
      );
      return distFromVortex < Math.max(46, currentTidalR + 8);
    };

    const isInsideNebulaZone = (px: number, py: number) => {
      return py >= getConcaveBaseY(px) - 25;
    };

    const isInsideExcludedZone = (px: number, py: number) => {
      return isInsideVortexCore(px, py) || isInsideNebulaZone(px, py);
    };

    const isUiInteractionActive = () =>
      isGuideOpenRef.current ||
      isDraggingTimeRef.current ||
      activeDotRef.current !== null ||
      isSeekingRef.current;

    const isUiTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return Boolean(
        el &&
          el.closest(
            'button, a, input, [role="button"], [role="slider"], .glass-panel, [data-ui-control="true"]'
          )
      );
    };

    // Multi-Touch Two-Finger Pinch & Trackpad Scaling for Event Horizon
    let currentHorizonScale = 1.0;
    let targetHorizonScale = 1.0;
    let isPinching = false;
    let isMultiTouchActive = false;
    let multiTouchCooldownUntil = 0;
    const activePointerIds = new Set<number>();
    let initialPinchDistance = 0;
    let initialPinchScale = 1.0;

    // Helper to spawn comets on demand (e.g. from holding contact point)
    const spawnCometAtPoint = (px: number, py: number) => {
      const dynamicCenterX = lastDynamicCenterX;
      const dynamicCenterY = lastDynamicCenterY;

      const rx = (px - dynamicCenterX) / 1.2;
      const ry = (py - dynamicCenterY) / 0.7;
      const r = Math.max(15, Math.hypot(rx, ry));
      const ang = Math.atan2(ry, rx) - vortexRotation;

      const newSize = Math.random() * 2.2 + 0.8;
      comets.push({
        angle: ang,
        radius: r,
        originalRadius: r,
        speed: 0.0025 + Math.random() * 0.003,
        size: newSize,
        originalSize: newSize,
        alpha: Math.random() * 0.5 + 0.4,
        perturbX: 0,
        perturbY: 0,
        isBreakingApart: false,
        destructionProgress: 0,
        color: CYAN_PALETTE[Math.floor(Math.random() * CYAN_PALETTE.length)],
        isPermanent: true,
      });

      // Subtle birth aura ring at point of creation
      birthAuras.push({
        x: px,
        y: py,
        radius: 3,
        alpha: 0.85,
      });

      // Synthesized celestial sound effect for comet birth
      playCometSpawnPing(sfxVolumeRef.current);
    };

    // Secret Tap Combo & Hyper-Comet State
    let tapClusterCount = 0;
    let lastTapPoint = { x: 0, y: 0, time: 0 };
    let lastHyperCometSpawn = performance.now();
    let nextHyperCometInterval = 7000 + Math.random() * 6000;
    let centralAuraScaleBonus = 0;
    let centralAuraShakeBonus = 0;

    // Spawns secret celestial bodies (Earth, Sun, Mini Black Hole) from repeated tap combinations
    const spawnSpecialCelestialBody = (type: 'earth' | 'sun' | 'blackhole', px: number, py: number) => {
      const dynamicCenterX = lastDynamicCenterX;
      const dynamicCenterY = lastDynamicCenterY;

      const rx = (px - dynamicCenterX) / 1.2;
      const ry = (py - dynamicCenterY) / 0.7;
      const r = Math.max(30, Math.hypot(rx, ry));
      const ang = Math.atan2(ry, rx) - vortexRotation;

      if (type === 'earth') {
        // Earth: ~1/6th of central vortex/black hole radius (~27px), blue with green, heavier/slower
        comets.push({
          angle: ang,
          radius: r,
          originalRadius: r,
          speed: 0.0011,
          size: 4.8,
          originalSize: 4.8,
          alpha: 1.0,
          perturbX: 0,
          perturbY: 0,
          isBreakingApart: false,
          destructionProgress: 0,
          color: '#0ea5e9',
          isPermanent: true,
          specialType: 'earth',
          mass: 3.2,
          pulseAnim: 1.0,
        });
        playCelestialTierSound('earth', sfxVolumeRef.current);
        ripples.push({
          x: px,
          y: py,
          radius: 4,
          maxRadius: 75,
          alpha: 1.0,
          speed: 3.4,
          lineWidth: 2.2,
          color: '#38bdf8',
        });
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          sparks.push({
            x: px,
            y: py,
            vx: Math.cos(a) * 2.2,
            vy: Math.sin(a) * 2.2,
            alpha: 1.0,
            size: 1.8,
            color: i % 2 === 0 ? '#22c55e' : '#38bdf8',
          });
        }
      } else if (type === 'sun') {
        // Sun: ~1/4th of central vortex/black hole radius (~27px), white-yellow with orange, even heavier, slight gravity
        comets.push({
          angle: ang,
          radius: r,
          originalRadius: r,
          speed: 0.00065,
          size: 7.2,
          originalSize: 7.2,
          alpha: 1.0,
          perturbX: 0,
          perturbY: 0,
          isBreakingApart: false,
          destructionProgress: 0,
          color: '#fef08a',
          isPermanent: true,
          specialType: 'sun',
          mass: 6.8,
          pulseAnim: 1.0,
        });
        playCelestialTierSound('sun', sfxVolumeRef.current);
        ripples.push({
          x: px,
          y: py,
          radius: 5,
          maxRadius: 110,
          alpha: 1.0,
          speed: 3.8,
          lineWidth: 2.8,
          color: '#fbbf24',
        });
        for (let i = 0; i < 12; i++) {
          const a = (Math.PI * 2 * i) / 12;
          sparks.push({
            x: px,
            y: py,
            vx: Math.cos(a) * 2.6,
            vy: Math.sin(a) * 2.6,
            alpha: 1.0,
            size: 2.2,
            color: i % 2 === 0 ? '#fef08a' : '#ea580c',
          });
        }
      } else if (type === 'blackhole') {
        // Mini Black Hole: ~1/2 of central vortex/black hole radius (~27px), black with slight blue disk, gravitational pull
        comets.push({
          angle: ang,
          radius: r,
          originalRadius: r,
          speed: 0.00035,
          size: 13.8,
          originalSize: 13.8,
          alpha: 1.0,
          perturbX: 0,
          perturbY: 0,
          isBreakingApart: false,
          destructionProgress: 0,
          color: '#000000',
          isPermanent: true,
          specialType: 'blackhole',
          mass: 14.0,
          pulseAnim: 1.0,
          absorptionCount: 1,
        });
        playCelestialTierSound('blackhole', sfxVolumeRef.current);
        ripples.push({
          x: px,
          y: py,
          radius: 6,
          maxRadius: 155,
          alpha: 1.0,
          speed: 4.5,
          lineWidth: 3.2,
          color: '#00f2fe',
        });
        for (let i = 0; i < 16; i++) {
          const a = (Math.PI * 2 * i) / 16;
          sparks.push({
            x: px,
            y: py,
            vx: Math.cos(a) * 3.0,
            vy: Math.sin(a) * 3.0,
            alpha: 1.0,
            size: 2.4,
            color: i % 2 === 0 ? '#00f2fe' : '#ffffff',
          });
        }
      }
    };

    // Shared swipe & move physics processor (mouse/pen via pointermove, touch via 1-finger touchmove)
    const processSwipeMove = (clientX: number, clientY: number) => {
      if (
        isUiInteractionActive() ||
        isPinching ||
        isMultiTouchActive ||
        activePointerIds.size >= 2 ||
        performance.now() < multiTouchCooldownUntil
      ) {
        hasPrevPointer = false;
        return;
      }

      const now = performance.now();
      if (
        now - lastProcessedMoveTime < 3 &&
        Math.hypot(clientX - lastProcessedMoveX, clientY - lastProcessedMoveY) < 1.5
      ) {
        return;
      }
      lastProcessedMoveTime = now;
      lastProcessedMoveX = clientX;
      lastProcessedMoveY = clientY;

      pointerX = clientX;
      pointerY = clientY;

      const halfW = width / 2;
      const halfH = height / 2;
      const normalizedX = (clientX - halfW) / (halfW || 1);
      const normalizedY = (clientY - halfH) / (halfH || 1);
      targetOffsetX = Math.max(-25, Math.min(25, normalizedX * 25));
      targetOffsetY = Math.max(-18, Math.min(18, normalizedY * 18));

      // Seed previous position cleanly on first move / re-entry so we never fire a phantom (0,0) swipe
      if (!hasPrevPointer) {
        prevPointerX = clientX;
        prevPointerY = clientY;
        prevMoveTime = now;
        hasPrevPointer = true;
        return;
      }

      const dt = Math.max(1, now - prevMoveTime);
      const dtForVel = Math.max(4, dt);
      const dx = clientX - prevPointerX;
      const dy = clientY - prevPointerY;
      const dist = Math.hypot(dx, dy);

      if (dt > 140) {
        strokeDistance = 0;
        currentStrokeId++;
        recentSwipeVx = 0;
        recentSwipeVy = 0;
      }
      strokeDistance = Math.min(500, strokeDistance + dist);

      const swipeSpeed = Math.min(45, (dist / dtForVel) * 16); // Normalized pixels per frame (~60fps)
      if (dist >= 1.2) {
        const instVx = Math.max(-28, Math.min(28, (dx / dtForVel) * 16));
        const instVy = Math.max(-28, Math.min(28, (dy / dtForVel) * 16));
        recentSwipeVx = recentSwipeVx * 0.3 + instVx * 0.7;
        recentSwipeVy = recentSwipeVy * 0.3 + instVy * 0.7;
      }

      // If a celestial body is held, it follows the pointer directly and remains in stasis until released
      if (heldBody && heldBody.isHeld) {
        heldBody.isFlinging = false;
        heldBody.flingVx = 0;
        heldBody.flingVy = 0;
        heldBody.flingPosX = pointerX;
        heldBody.flingPosY = pointerY;
        if (heldBody.isHyperFast) {
          heldBody.hyperX = pointerX;
          heldBody.hyperY = pointerY;
          heldBody.hyperVx = 0;
          heldBody.hyperVy = 0;
        }
        const rx = (pointerX - lastDynamicCenterX) / 1.2;
        const ry = (pointerY - lastDynamicCenterY) / 0.7;
        heldBody.radius = Math.max(12, Math.hypot(rx, ry));
        heldBody.angle = Math.atan2(ry, rx) - vortexRotation;
        heldBody.speed = 0;
        heldBody.perturbX = 0;
        heldBody.perturbY = 0;

        prevPointerX = clientX;
        prevPointerY = clientY;
        prevMoveTime = now;
        lastSwipeMoveTime = now;
        return;
      }

      if (heldSpaceship && heldSpaceship.isHeld) {
        heldSpaceship.x = pointerX;
        heldSpaceship.y = pointerY;
        heldSpaceship.vx = 0;
        heldSpaceship.vy = 0;
        if (dist > 1) {
          heldSpaceship.angle = Math.atan2(dy, dx);
        }
        prevPointerX = clientX;
        prevPointerY = clientY;
        prevMoveTime = now;
        lastSwipeMoveTime = now;
        return;
      }

      if (dist > 2) {
        lastSwipeMoveTime = now;

        // Swipes apply to EVERYTHING EXCEPT the Central Vortex in the middle and the Nebula at the bottom
        if (!isInsideExcludedZone(clientX, clientY)) {
          // Slight continuous swipe trail
          if (now - lastTrailPushTime >= 8 || dist > 6) {
            lastTrailPushTime = now;
            trail.push({
              x: clientX,
              y: clientY,
              createdAt: now,
              size: Math.min(2.8, 1.1 + swipeSpeed * 0.06),
              maxAlpha: Math.min(0.45, 0.22 + swipeSpeed * 0.014),
              strokeId: currentStrokeId,
            });
            if (trail.length > 48) {
              trail.shift();
            }
          }

          // Proportional influence area: small swipes affect small localized areas; extreme swipes affect large areas & flip orbits
          const swipeDirX = dx / (dist || 1);
          const swipeDirY = dy / (dist || 1);
          const influenceRadius = Math.max(
            28,
            Math.min(330, 20 + strokeDistance * 0.36 + swipeSpeed * 6.0)
          );
          const isBigExtremeSwipe = strokeDistance > 95 || swipeSpeed > 8.5;
          const swipeStrength = Math.min(
            1.6,
            0.22 + (strokeDistance / 280) * 0.55 + (swipeSpeed / 18) * 0.75
          );

          if (swipeSpeed > 11.5) {
            playSwipeWhoosh(swipeSpeed, sfxVolumeRef.current);
          }

          // 1. Deflect ALL unheld comets, hyper-comets, planets, suns, hawking stars, black holes (both orbiting and flinging)
          for (let i = 0; i < comets.length; i++) {
            const p = comets[i];
            if (p.isHeld) continue;

            const pos = getCometPos(p, lastDynamicCenterX, lastDynamicCenterY);
            const cx = pos.x;
            const cy = pos.y;

            if (isInsideExcludedZone(cx, cy)) continue;

            const cDist = Math.hypot(clientX - cx, clientY - cy);
            if (cDist < influenceRadius) {
              const rawForce = 1 - cDist / influenceRadius;
              const massFactor = p.mass ? 1 / (1 + p.mass * 0.14) : 1.0;
              const force = Math.pow(rawForce, 1.35) * massFactor;

              if (p.isFlinging) {
                p.flingVx = (p.flingVx || 0) + swipeDirX * force * (2.5 + swipeStrength * 4.5);
                p.flingVy = (p.flingVy || 0) + swipeDirY * force * (2.5 + swipeStrength * 4.5);
                continue;
              }

              // Hyper-fast comets use clean 2D Cartesian velocity deflection (zero wonky polar artifacts)
              if (p.isHyperFast) {
                const kick = force * (1.8 + swipeStrength * 4.8);
                p.hyperVx = (p.hyperVx || 0) + swipeDirX * kick;
                p.hyperVy = (p.hyperVy || 0) + swipeDirY * kick;
                continue;
              }

              // Exact elliptical tangent vector matching x = r*1.2*cos(a), y = r*0.7*sin(a)
              const rx = cx - lastDynamicCenterX;
              const ry = cy - lastDynamicCenterY;
              const rawTx = (-ry / 0.7) * 1.2;
              const rawTy = (rx / 1.2) * 0.7;
              const tLen = Math.hypot(rawTx, rawTy) || 1;
              const tx = rawTx / tLen;
              const ty = rawTy / tLen;
              const tangentialDot = swipeDirX * tx + swipeDirY * ty;

              const rDist = Math.hypot(rx, ry) || 1;
              const radialDot = (swipeDirX * rx + swipeDirY * ry) / rDist;

              if (isBigExtremeSwipe) {
                // Bigger, more extreme swipes completely change the direction of the orbits
                if (Math.abs(tangentialDot) > 0.05) {
                  const targetDir = Math.sign(tangentialDot);
                  const baseMag = Math.max(Math.abs(p.speed), 0.0025);
                  const speedBoost =
                    (0.003 + Math.min(0.018, swipeSpeed * 0.00065)) * massFactor * rawForce;
                  p.speed = targetDir * Math.min(0.028, baseMag * 0.8 + speedBoost);
                } else {
                  p.speed = -(p.speed || 0.004 * massFactor);
                }

                const flingForce = force * Math.min(34, 8 + swipeSpeed * 0.75 * swipeStrength);
                p.perturbX += swipeDirX * flingForce;
                p.perturbY += swipeDirY * flingForce;
                p.radius = Math.max(
                  12,
                  p.radius + radialDot * force * Math.min(42, 10 + swipeSpeed * 0.7 * swipeStrength)
                );
              } else {
                // Small swipes affect only their tight localized area proportionally
                p.perturbX += swipeDirX * force * (4 + swipeStrength * 9);
                p.perturbY += swipeDirY * force * (4 + swipeStrength * 9);
                p.radius = Math.max(12, p.radius + radialDot * force * (3 + swipeStrength * 6));
                p.speed += tangentialDot * force * (0.0005 + swipeStrength * 0.0012);
              }
            }
          }

          // 2. Deflect ALL unheld spaceships
          for (let s = 0; s < spaceships.length; s++) {
            const ship = spaceships[s];
            if (ship.isHeld || isInsideExcludedZone(ship.x, ship.y)) continue;
            const sDist = Math.hypot(clientX - ship.x, clientY - ship.y);
            if (sDist < influenceRadius) {
              const force = Math.pow(1 - sDist / influenceRadius, 1.3);
              ship.vx += swipeDirX * force * (1.4 + swipeStrength * 2.5);
              ship.vy += swipeDirY * force * (1.4 + swipeStrength * 2.5);
              if (Math.hypot(ship.vx, ship.vy) > 0.1) {
                ship.angle = Math.atan2(ship.vy, ship.vx);
              }
            }
          }

          // 3. Deflect breakup debris shards outside excluded zones
          for (let d = 0; d < breakupDebris.length; d++) {
            const deb = breakupDebris[d];
            if (isInsideExcludedZone(deb.x, deb.y)) continue;
            const dDist = Math.hypot(clientX - deb.x, clientY - deb.y);
            if (dDist < influenceRadius) {
              const force = Math.pow(1 - dDist / influenceRadius, 1.3);
              deb.vx += swipeDirX * force * (1.2 + swipeStrength * 2.4);
              deb.vy += swipeDirY * force * (1.2 + swipeStrength * 2.4);
            }
          }

          // 4. Deflect free-floating sparks outside excluded zones
          for (let k = 0; k < sparks.length; k++) {
            const sp = sparks[k];
            if (isInsideExcludedZone(sp.x, sp.y)) continue;
            const spDist = Math.hypot(clientX - sp.x, clientY - sp.y);
            if (spDist < influenceRadius) {
              const force = Math.pow(1 - spDist / influenceRadius, 1.3);
              sp.vx += swipeDirX * force * (1.2 + swipeStrength * 2.4);
              sp.vy += swipeDirY * force * (1.2 + swipeStrength * 2.4);
            }
          }
        }
      }

      prevPointerX = clientX;
      prevPointerY = clientY;
      prevMoveTime = now;
    };

    // POINTER EVENT HANDLERS
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) {
        return;
      }

      if (
        isUiInteractionActive() ||
        isUiTarget(e.target) ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Only track active touch pointers for multi-touch pinch exclusion so mouse/UI ids can never leak
      if (e.pointerType === 'touch') {
        activePointerIds.add(e.pointerId);
      }

      if (
        activePointerIds.size >= 2 ||
        isMultiTouchActive ||
        performance.now() < multiTouchCooldownUntil
      ) {
        if (activePointerIds.size >= 2) {
          isMultiTouchActive = true;
          isPointerDown = false;
          holdCandidate = null;
          holdCandidateShip = null;
          hasPrevPointer = false;
        }
        return;
      }

      const now = performance.now();
      isPointerDown = true;
      holdStartTime = now;
      lastCometSpawnTime = now;
      pointerX = e.clientX;
      pointerY = e.clientY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      hasPrevPointer = true;
      prevMoveTime = now;
      strokeDistance = 0;
      currentStrokeId++;
      recentSwipeVx = 0;
      recentSwipeVy = 0;

      // Excluded zones: middle Central Vortex & bottom Nebula
      if (isInsideExcludedZone(e.clientX, e.clientY)) {
        holdCandidate = null;
        holdCandidateShip = null;
        return;
      }

      // 1. Check if clicking directly on an existing celestial body or spaceship
      let nearestBody: Comet | null = null;
      let nearestShip: Spaceship | null = null;
      let nearestDist = 9999;

      for (let i = 0; i < comets.length; i++) {
        const c = comets[i];
        const pos = getCometPos(c, lastDynamicCenterX, lastDynamicCenterY);
        const cx = pos.x;
        const cy = pos.y;
        if (isInsideExcludedZone(cx, cy)) continue;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        const threshold = Math.max(38, (c.size || 3) * 3.6);
        if (d < threshold && d < nearestDist) {
          nearestDist = d;
          nearestBody = c;
          nearestShip = null;
        }
      }

      for (let s = 0; s < spaceships.length; s++) {
        const ship = spaceships[s];
        if (isInsideExcludedZone(ship.x, ship.y)) continue;
        const d = Math.hypot(e.clientX - ship.x, e.clientY - ship.y);
        if (d < 40 && d < nearestDist) {
          nearestDist = d;
          nearestShip = ship;
          nearestBody = null;
        }
      }

      if (nearestBody) {
        holdCandidate = nearestBody;
        holdCandidateShip = null;
        holdCandidateStartTime = now;
        holdPointerStartPos = { x: e.clientX, y: e.clientY };
      } else if (nearestShip) {
        holdCandidateShip = nearestShip;
        holdCandidate = null;
        holdCandidateStartTime = now;
        holdPointerStartPos = { x: e.clientX, y: e.clientY };
      } else {
        holdCandidate = null;
        holdCandidateShip = null;
        heldBody = null;
        heldSpaceship = null;
        // 1 Tap = 1 Comet: Immediately spawn 1 comet at the contact point when clicking open space
        spawnCometAtPoint(e.clientX, e.clientY);
      }

      // Track consecutive taps clustered at around the same point
      const distFromLastTap = Math.hypot(e.clientX - lastTapPoint.x, e.clientY - lastTapPoint.y);
      if (now - lastTapPoint.time < 4500 && distFromLastTap < 70) {
        tapClusterCount++;
      } else {
        tapClusterCount = 1;
      }
      lastTapPoint = { x: e.clientX, y: e.clientY, time: now };

      // Secret Celestial Tiers:
      // 8 taps = Earth (1/6th size)
      // 16 more taps (tap 24) = Sun (1/4th size)
      // 25 more taps (tap 49) = Mini Black Hole (1/2 size)
      if (tapClusterCount === 8) {
        spawnSpecialCelestialBody('earth', e.clientX, e.clientY);
      } else if (tapClusterCount === 24) {
        spawnSpecialCelestialBody('sun', e.clientX, e.clientY);
      } else if (tapClusterCount === 49) {
        spawnSpecialCelestialBody('blackhole', e.clientX, e.clientY);
        tapClusterCount = 0; // Reset sequence to allow new cycles
      }

      // Synthesized celestial sound effect for click
      playClickChime(sfxVolumeRef.current);

      // Procedural Click Variations - Compact, tighter ripple
      const clickColor = CYAN_PALETTE[Math.floor(Math.random() * CYAN_PALETTE.length)];
      const maxR = 38 + Math.random() * 26; // 38px to 64px
      const spd = 2.0 + Math.random() * 1.4;
      const lWidth = 1.0 + Math.random() * 0.6;

      // 1. Click Ripple with refined smaller radius
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 3,
        maxRadius: maxR,
        alpha: 0.9,
        speed: spd,
        lineWidth: lWidth,
        color: clickColor,
      });

      // 2. Click Micro-Sparks
      const sparkCount = 4 + Math.floor(Math.random() * 5);
      for (let i = 0; i < sparkCount; i++) {
        const ang = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const sparkSpeed = Math.random() * 1.8 + 0.8;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * sparkSpeed,
          vy: Math.sin(ang) * sparkSpeed,
          alpha: 0.9,
          size: Math.random() * 1.4 + 0.6,
          color: CYAN_PALETTE[Math.floor(Math.random() * CYAN_PALETTE.length)],
        });
      }

      // 3. Gentle rotation momentum impulse
      vortexImpulseSpeed += 0.002 + Math.random() * 0.0015;
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Touch dragging is driven exclusively by handleTouchMove so 1 move never double-fires & doubles speed
      if (e.pointerType === 'touch') return;

      if (
        isUiInteractionActive() ||
        (!heldBody && !heldSpaceship && isUiTarget(e.target)) ||
        e.ctrlKey ||
        e.metaKey ||
        isPinching ||
        isMultiTouchActive ||
        activePointerIds.size >= 2 ||
        performance.now() < multiTouchCooldownUntil
      ) {
        hasPrevPointer = false;
        return;
      }
      processSwipeMove(e.clientX, e.clientY);
    };

    const releaseHeldItems = () => {
      const now = performance.now();
      const timeSinceLastMove = now - prevMoveTime;

      // If user stopped moving for > 75ms before lifting pointer, velocity drops to zero
      if (timeSinceLastMove > 75) {
        recentSwipeVx = 0;
        recentSwipeVy = 0;
      }

      // If a celestial body was held, it ONLY flings depending on the release velocity right before unpressed!
      if (heldBody && heldBody.isHeld) {
        const flingSpeed = Math.hypot(recentSwipeVx, recentSwipeVy);
        if (heldBody.isHyperFast) {
          heldBody.hyperX = pointerX;
          heldBody.hyperY = pointerY;
          heldBody.isFlinging = false;
          if (flingSpeed > 1.2) {
            heldBody.hyperVx = recentSwipeVx * 1.4;
            heldBody.hyperVy = recentSwipeVy * 1.4;
            playCelestialTierSound('fling', sfxVolumeRef.current);
          } else {
            const toCx = lastDynamicCenterX - pointerX;
            const toCy = lastDynamicCenterY - pointerY;
            const d = Math.hypot(toCx, toCy) || 1;
            heldBody.hyperVx = (-toCy / d) * 5.0 + (toCx / d) * 1.2;
            heldBody.hyperVy = (toCx / d) * 5.0 + (toCy / d) * 1.2;
          }
        } else if (flingSpeed > 1.2) {
          heldBody.isFlinging = true;
          heldBody.flingVx = recentSwipeVx * 1.4;
          heldBody.flingVy = recentSwipeVy * 1.4;
          heldBody.flingPosX = pointerX;
          heldBody.flingPosY = pointerY;
          playCelestialTierSound('fling', sfxVolumeRef.current);
        } else {
          // Settles into current position in orbit without flinging
          heldBody.isFlinging = false;
          heldBody.flingVx = 0;
          heldBody.flingVy = 0;
          heldBody.speed = heldBody.specialType ? 0.0008 : 0.0025;
        }
        heldBody.isHeld = false;
        heldBody = null;
      }

      if (heldSpaceship && heldSpaceship.isHeld) {
        const flingSpeed = Math.hypot(recentSwipeVx, recentSwipeVy);
        if (flingSpeed > 1.2) {
          heldSpaceship.vx = recentSwipeVx * 0.9;
          heldSpaceship.vy = recentSwipeVy * 0.9;
          heldSpaceship.angle = Math.atan2(heldSpaceship.vy, heldSpaceship.vx);
          playCelestialTierSound('fling', sfxVolumeRef.current);
        } else {
          heldSpaceship.vx = Math.cos(heldSpaceship.angle) * 2.4;
          heldSpaceship.vy = Math.sin(heldSpaceship.angle) * 2.4;
        }
        heldSpaceship.isHeld = false;
        heldSpaceship = null;
      }

      holdCandidate = null;
      holdCandidateShip = null;
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointerIds.delete(e.pointerId);
      if (e.pointerType !== 'touch' || activePointerIds.size === 0) {
        isPointerDown = false;
      }
      releaseHeldItems();
    };

    const handlePointerCancel = (e: PointerEvent) => {
      activePointerIds.delete(e.pointerId);
      if (e.pointerType === 'touch') {
        // Native touch-action gestures (scroll / pinch) fire pointercancel while fingers remain active;
        // defer cleanup to handleTouchEnd/touchcancel when touches actually lift.
        return;
      }
      isPointerDown = false;
      if ((heldBody && heldBody.isHeld) || (heldSpaceship && heldSpaceship.isHeld)) {
        releaseHeldItems();
      } else {
        holdCandidate = null;
        holdCandidateShip = null;
      }
    };

    const handlePointerLeave = () => {
      activePointerIds.clear();
      isPointerDown = false;
      hasPrevPointer = false;
      targetOffsetX = 0;
      targetOffsetY = 0;
      if (heldBody) {
        heldBody.isHeld = false;
        heldBody = null;
      }
      if (heldSpaceship) {
        heldSpaceship.isHeld = false;
        heldSpaceship = null;
      }
      holdCandidate = null;
      holdCandidateShip = null;
    };

    const resetAllInputState = () => {
      activePointerIds.clear();
      isMultiTouchActive = false;
      isPinching = false;
      isPointerDown = false;
      hasPrevPointer = false;
      recentSwipeVx = 0;
      recentSwipeVy = 0;
      isDraggingTimeRef.current = false;
      activeDotRef.current = null;
      if (isSeekingRef.current) {
        isSeekingRef.current = false;
        setIsSeeking(false);
      }
      if (heldBody) {
        heldBody.isHeld = false;
        heldBody = null;
      }
      if (heldSpaceship) {
        heldSpaceship.isHeld = false;
        heldSpaceship = null;
      }
      holdCandidate = null;
      holdCandidateShip = null;
    };

    const handleVisibilityReset = () => {
      if (document.hidden) {
        resetAllInputState();
      }
    };

    const isSliderActivelyDragging = () =>
      isDraggingTimeRef.current || activeDotRef.current !== null || isSeekingRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (isSliderActivelyDragging()) return;

      if (e.touches.length >= 2) {
        // Allow 2-finger pinch-zoom everywhere (unless slider dragging or guide modal is open)
        if (isGuideOpenRef.current) return;
        isMultiTouchActive = true;
        isPinching = true;
        isPointerDown = false;
        hasPrevPointer = false;
        holdCandidate = null;
        holdCandidateShip = null;
        if (heldBody) {
          heldBody.isHeld = false;
          heldBody = null;
        }
        if (heldSpaceship) {
          heldSpaceship.isHeld = false;
          heldSpaceship = null;
        }
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialPinchScale = targetHorizonScale;
        return;
      }

      if (isUiInteractionActive() || isUiTarget(e.target)) return;

      if (e.touches.length === 1) {
        if (!isPinching && performance.now() >= multiTouchCooldownUntil) {
          isMultiTouchActive = false;
          if (activePointerIds.size > 1) {
            activePointerIds.clear();
          }
          const t = e.touches[0];
          pointerX = t.clientX;
          pointerY = t.clientY;
          prevPointerX = t.clientX;
          prevPointerY = t.clientY;
          hasPrevPointer = true;
          prevMoveTime = performance.now();
          strokeDistance = 0;
          currentStrokeId++;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isSliderActivelyDragging() || isGuideOpenRef.current) {
        hasPrevPointer = false;
        return;
      }
      if (e.touches.length >= 2) {
        isMultiTouchActive = true;
        hasPrevPointer = false;
        multiTouchCooldownUntil = performance.now() + 180;
        // Prioritize native 2-finger pinch-zoom into comets/planets & zooming out (no e.preventDefault()),
        // while naturally enlarging/shrinking the central black hole alongside the pinch.
        if (!isPinching) {
          isPinching = true;
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          initialPinchScale = targetHorizonScale;
        } else {
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          if (initialPinchDistance > 0) {
            const pinchRatio = currentDist / initialPinchDistance;
            targetHorizonScale = Math.max(0.4, Math.min(2.8, initialPinchScale * pinchRatio));
          }
        }
      } else if (e.touches.length === 1) {
        if (!heldBody && !heldSpaceship && isUiTarget(e.target)) {
          hasPrevPointer = false;
          return;
        }
        const t = e.touches[0];
        if (isMultiTouchActive || isPinching || performance.now() < multiTouchCooldownUntil) {
          prevPointerX = t.clientX;
          prevPointerY = t.clientY;
          hasPrevPointer = true;
          prevMoveTime = performance.now();
          return;
        }
        // Prevent browser scroll ONLY while actively dragging a stasis-locked body/spaceship;
        // otherwise let page scroll & zoom fluidly while simultaneously feeding swipe physics & trail!
        if ((heldBody && heldBody.isHeld) || (heldSpaceship && heldSpaceship.isHeld)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
        processSwipeMove(t.clientX, t.clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isPinching = false;
        if (isMultiTouchActive) {
          multiTouchCooldownUntil = performance.now() + 140;
        }
      }
      if (e.touches.length === 0) {
        activePointerIds.clear();
        isMultiTouchActive = false;
        isPointerDown = false;
        hasPrevPointer = false;
        releaseHeldItems();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        multiTouchCooldownUntil = performance.now() + 180;
        const delta = -e.deltaY * 0.005;
        targetHorizonScale = Math.max(0.4, Math.min(2.8, targetHorizonScale + delta));
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { capture: true, passive: true });
    window.addEventListener('pointercancel', handlePointerCancel, { capture: true, passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', resetAllInputState);
    window.addEventListener('contextmenu', resetAllInputState);
    document.addEventListener('visibilitychange', handleVisibilityReset);

    // Touch events (non-passive touchmove only blocks scroll when stasis-holding a body or pinching)
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { capture: true, passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });

    // RENDER LOOP
    const drawVortex = () => {
      const now = performance.now();
      const ts = timeScaleRef.current;

      // Live screen rects for the Blue Bounce Line and bottom HUD outlines
      const rawLineRect = bounceLineRef.current ? bounceLineRef.current.getBoundingClientRect() : null;
      const activeBounceLine =
        rawLineRect && rawLineRect.width > 10 && rawLineRect.top <= height + 24 && rawLineRect.top >= -24
          ? {
              y: rawLineRect.top + rawLineRect.height * 0.5,
              left: rawLineRect.left,
              right: rawLineRect.right,
            }
          : null;
      const isAtBottomHud = Boolean(rawLineRect && rawLineRect.top <= height + 36);
      const activeOutlineRects: DOMRect[] = [];
      if (isAtBottomHud) {
        if (musicBarPillRef.current) activeOutlineRects.push(musicBarPillRef.current.getBoundingClientRect());
        if (trackNavRef.current) activeOutlineRects.push(trackNavRef.current.getBoundingClientRect());
      }

      // Smooth lerp for pinch event horizon scale
      currentHorizonScale += (targetHorizonScale - currentHorizonScale) * 0.08;
      if (!isPinching) {
        // Elastic spring back to stable equilibrium
        targetHorizonScale += (1.0 - targetHorizonScale) * 0.015;
      }

      // Smooth fluid scroll reveal synced directly in canvas space (no CSS transition lag)
      smoothVortexProgress += (targetVortexProgress - smoothVortexProgress) * 0.28;
      if (Math.abs(targetVortexProgress - smoothVortexProgress) < 0.001) {
        smoothVortexProgress = targetVortexProgress;
      }
      const vortexRevealOffsetY = (1 - smoothVortexProgress) * (height * 0.35);
      const vortexRevealAlpha = 0.15 + smoothVortexProgress * 0.85;

      // Smooth low-pass dampening lerp for cursor parallax and phone gyroscope perspective tilt
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.04;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.04;
      gyroTiltX += (targetGyroTiltX - gyroTiltX) * 0.06;
      gyroTiltY += (targetGyroTiltY - gyroTiltY) * 0.06;

      // Ultra-slow, subtle 7-minute (420,000ms) figure-8 analemma drift for the Vortex & circular event horizon ring
      const analemmaTheta = ((now % 420000) / 420000) * Math.PI * 2;
      const analemmaOffsetX = 4.2 * Math.sin(2 * analemmaTheta) * (1 - 0.18 * Math.sin(analemmaTheta));
      const analemmaOffsetY = 8.0 * Math.sin(analemmaTheta);

      let neededBottomLift = 0;
      if (isAtBottomHud && musicBarColRef.current) {
        const barRect = musicBarColRef.current.getBoundingClientRect();
        const predictedCenterY = centerY + vortexRevealOffsetY + currentOffsetY + gyroTiltY + analemmaOffsetY;
        const maxSafeCenterY = barRect.top - 125;
        if (predictedCenterY > maxSafeCenterY) {
          neededBottomLift = Math.min(height * 0.26, predictedCenterY - maxSafeCenterY);
        }
      }
      smoothBottomVortexLift += (neededBottomLift - smoothBottomVortexLift) * 0.14;
      if (Math.abs(neededBottomLift - smoothBottomVortexLift) < 0.15) {
        smoothBottomVortexLift = neededBottomLift;
      }

      const dynamicCenterX = centerX + currentOffsetX + gyroTiltX + analemmaOffsetX;
      const dynamicCenterY = centerY + vortexRevealOffsetY - smoothBottomVortexLift + currentOffsetY + gyroTiltY + analemmaOffsetY;
      lastDynamicCenterX = dynamicCenterX;
      lastDynamicCenterY = dynamicCenterY;

      // Dynamic rotation with momentum impulse decay, scaled by time scale
      vortexRotation += (0.0015 + vortexImpulseSpeed + gyroTiltX * 0.00004) * ts;
      vortexImpulseSpeed *= Math.pow(0.95, ts);

      // Black hole independent rotation: very slow, counter-direction, scaled by time scale
      blackHoleRotation -= 0.00045 * ts;

      const maxDimension = Math.max(width, height) * 0.5;

      const BASE_EVENT_HORIZON_R = 9;
      const BASE_TIDAL_DISRUPTION_R = 38;

      const EVENT_HORIZON_R = (BASE_EVENT_HORIZON_R + centralAuraScaleBonus * 0.35) * currentHorizonScale;
      const TIDAL_DISRUPTION_R = (BASE_TIDAL_DISRUPTION_R + centralAuraScaleBonus) * currentHorizonScale;
      currentTidalR = TIDAL_DISRUPTION_R;

      // 0.2-Second Hold Detection: If user holds finger/pointer on any celestial body or spaceship for 0.2s, halt motion
      if (isPointerDown && (holdCandidate || holdCandidateShip) && !heldBody && !heldSpaceship) {
        if (now - holdCandidateStartTime >= 200) {
          const moveDist = Math.hypot(pointerX - holdPointerStartPos.x, pointerY - holdPointerStartPos.y);
          if (moveDist < 45) {
            if (holdCandidate) {
              heldBody = holdCandidate;
              heldBody.isHeld = true;
              heldBody.speed = 0;
              heldBody.radialVelocity = 0;
              heldBody.isFlinging = false;
              heldBody.flingVx = 0;
              heldBody.flingVy = 0;
              heldBody.flingPosX = pointerX;
              heldBody.flingPosY = pointerY;
              heldBody.isBreakingApart = false;
              heldBody.destructionProgress = 0;
              if (heldBody.isHyperFast) {
                heldBody.hyperVx = 0;
                heldBody.hyperVy = 0;
              }
            } else if (holdCandidateShip) {
              heldSpaceship = holdCandidateShip;
              heldSpaceship.isHeld = true;
              heldSpaceship.vx = 0;
              heldSpaceship.vy = 0;
              heldSpaceship.x = pointerX;
              heldSpaceship.y = pointerY;
            }
            playCelestialTierSound('holdlock', sfxVolumeRef.current);
            ripples.push({
              x: pointerX,
              y: pointerY,
              radius: 6,
              maxRadius: 65,
              alpha: 0.95,
              speed: 2.8,
              lineWidth: 2.5,
              color: '#00f2fe',
            });
          } else {
            holdCandidate = null;
            holdCandidateShip = null;
          }
        }
      }

      // Ballistic fling physics update scaled by time scale (+ Blue Bounce Line reflection)
      for (let i = 0; i < comets.length; i++) {
        const c = comets[i];
        if (c.isFlinging && c.flingPosX !== undefined && c.flingPosY !== undefined) {
          c.flingPosX += (c.flingVx || 0) * ts;
          c.flingPosY += (c.flingVy || 0) * ts;
          c.flingVx = (c.flingVx || 0) * Math.pow(0.985, ts);
          c.flingVy = (c.flingVy || 0) * Math.pow(0.985, ts);

          if (activeBounceLine) {
            const bodyR = Math.max(2, c.size || 2);
            if (
              c.flingPosX >= activeBounceLine.left &&
              c.flingPosX <= activeBounceLine.right &&
              c.flingPosY + bodyR >= activeBounceLine.y &&
              c.flingPosY - bodyR <= activeBounceLine.y + 24 &&
              (c.flingVy || 0) > 0
            ) {
              c.flingPosY = activeBounceLine.y - bodyR;
              c.flingVy = -Math.max(1.2, Math.abs(c.flingVy || 0) * 0.92);
              c.flingVx = (c.flingVx || 0) * 0.96;
              c.lastLineBounceTime = now;
              triggerLineBounce(c.flingPosX, activeBounceLine.y, c.size || 2);
            }
          }

          const rx = (c.flingPosX - dynamicCenterX) / 1.2;
          const ry = (c.flingPosY - dynamicCenterY) / 0.7;
          c.radius = Math.max(10, Math.hypot(rx, ry));
          c.angle = Math.atan2(ry, rx) - vortexRotation;

          if (Math.hypot(c.flingVx || 0, c.flingVy || 0) < 0.25 && !isInsideNebulaZone(c.flingPosX, c.flingPosY)) {
            c.isFlinging = false;
            c.speed = c.specialType ? (c.specialType === 'gas_giant' ? 0.00185 : 0.001) : (c.isHyperFast ? 0.015 : 0.003);
          } else if (Math.hypot(c.flingVx || 0, c.flingVy || 0) < 0.25) {
            c.isFlinging = false;
            c.speed = c.specialType ? (c.specialType === 'gas_giant' ? 0.00185 : 0.001) : (c.isHyperFast ? 0.015 : 0.003);
          }
        }
      }

      // Uncommon spawn of hyper-fast comets (clean 2D hyperbolic slingshot flyby past central vortex)
      if (now - lastHyperCometSpawn > nextHyperCometInterval) {
        const existingHyper = comets.filter((c) => c.isHyperFast);
        if (existingHyper.length === 0) {
          lastHyperCometSpawn = now;
          nextHyperCometInterval = 8500 + Math.random() * 9500;

          const enterAng = Math.random() * Math.PI * 2;
          const spawnDist = Math.max(width, height) * 0.72 + 40;
          const hx = dynamicCenterX + Math.cos(enterAng) * spawnDist;
          const hy = dynamicCenterY + Math.sin(enterAng) * spawnDist;

          // Aim toward a clean offset periapsis (68-150px past central vortex) so it curves gracefully without hitting core
          const dirToCenterX = (dynamicCenterX - hx) / spawnDist;
          const dirToCenterY = (dynamicCenterY - hy) / spawnDist;
          const perpX = -dirToCenterY;
          const perpY = dirToCenterX;
          const sideSign = Math.random() > 0.5 ? 1 : -1;
          const missOffset = sideSign * (72 + Math.random() * 78);
          const aimX = dynamicCenterX + perpX * missOffset - hx;
          const aimY = dynamicCenterY + perpY * missOffset - hy;
          const aimDist = Math.hypot(aimX, aimY) || 1;
          const hyperSpeed = 7.2 + Math.random() * 3.0;

          comets.push({
            angle: enterAng - vortexRotation,
            radius: spawnDist,
            originalRadius: spawnDist,
            speed: 0,
            size: 2.5,
            originalSize: 2.5,
            alpha: 0.95,
            perturbX: 0,
            perturbY: 0,
            isBreakingApart: false,
            destructionProgress: 0,
            color: '#e0ffff',
            isPermanent: true,
            isHyperFast: true,
            hyperX: hx,
            hyperY: hy,
            hyperVx: (aimX / aimDist) * hyperSpeed,
            hyperVy: (aimY / aimDist) * hyperSpeed,
            hyperHistory: [{ x: hx, y: hy }],
          });
          playCelestialTierSound('hyper', sfxVolumeRef.current);
        }
      }

      // Gravitational Pull from Sun (within ~48px) and Mini Black Hole (within ~90px)
      for (let j = 0; j < comets.length; j++) {
        const source = comets[j];
        if (!source || !source.specialType || source.isHeld) continue;

        const srcPos = getCometPos(source, dynamicCenterX, dynamicCenterY);
        const sx = srcPos.x;
        const sy = srcPos.y;

        if (source.specialType === 'sun' || source.specialType === 'hawking_star') {
          for (let k = 0; k < comets.length; k++) {
            if (k === j) continue;
            const target = comets[k];
            if (target.specialType === 'blackhole' || target.specialType === 'sun' || target.specialType === 'hawking_star' || target.isHeld) continue;
            const tgtPos = getCometPos(target, dynamicCenterX, dynamicCenterY);
            const tx = tgtPos.x;
            const ty = tgtPos.y;
            const d = Math.hypot(sx - tx, sy - ty);
            if (d < 48 && d > 2) {
              const pull = ((48 - d) / 48) * 0.7 * ts;
              if (target.isHyperFast) {
                target.hyperVx = (target.hyperVx || 0) + ((sx - tx) / d) * pull * 0.25;
                target.hyperVy = (target.hyperVy || 0) + ((sy - ty) / d) * pull * 0.25;
              } else {
                target.perturbX += ((sx - tx) / d) * pull;
                target.perturbY += ((sy - ty) / d) * pull;
              }
            }
          }
        } else if (source.specialType === 'blackhole') {
          for (let k = 0; k < comets.length; k++) {
            if (k === j) continue;
            const target = comets[k];
            if (target.isHeld) continue;
            const tgtPos = getCometPos(target, dynamicCenterX, dynamicCenterY);
            const tx = tgtPos.x;
            const ty = tgtPos.y;
            const d = Math.hypot(sx - tx, sy - ty);
            if (d < 90 && d > 2) {
              const pull = ((90 - d) / 90) * (target.specialType ? 0.9 : 1.7) * ts;
              if (target.isHyperFast) {
                target.hyperVx = (target.hyperVx || 0) + ((sx - tx) / d) * pull * 0.35;
                target.hyperVy = (target.hyperVy || 0) + ((sy - ty) / d) * pull * 0.35;
              } else {
                target.perturbX += ((sx - tx) / d) * pull;
                target.perturbY += ((sy - ty) / d) * pull;
              }
            }
          }
        }
      }

      // Mutual Collision & Absorption between celestial bodies
      for (let j = comets.length - 1; j >= 0; j--) {
        const predator = comets[j];
        if (!predator || !predator.specialType) continue;

        const predPos = getCometPos(predator, dynamicCenterX, dynamicCenterY);
        const px = predPos.x;
        const py = predPos.y;

        for (let k = comets.length - 1; k >= 0; k--) {
          if (k === j) continue;
          const prey = comets[k];
          if (!prey) continue;

          const preyPos = getCometPos(prey, dynamicCenterX, dynamicCenterY);
          const tx = preyPos.x;
          const ty = preyPos.y;

          const d = Math.hypot(px - tx, py - ty);
          const collisionDist = predator.size + prey.size + 4.5;
          if (d > collisionDist) continue;

          // 1. COLLISION OF 2 HAWKING STARS -> Forms a normal black hole!
          if (predator.specialType === 'hawking_star' && prey.specialType === 'hawking_star') {
            const superX = (px + tx) / 2;
            const superY = (py + ty) / 2;
            predator.specialType = 'blackhole';
            predator.hasYellowDisk = false;
            predator.absorbedSunsForDisk = 0;
            predator.size = 13;
            predator.originalSize = 13;
            predator.mass = 3.8;
            predator.pulseAnim = 1.0;
            predator.absorptionCount = (predator.absorptionCount || 1) + 1;

            playCelestialTierSound('blackhole', sfxVolumeRef.current);
            ripples.push({
              x: superX,
              y: superY,
              radius: 12,
              maxRadius: 180,
              alpha: 1.0,
              speed: 5.2,
              lineWidth: 3.5,
              color: '#00f2fe',
            });

            for (let s = 0; s < 20; s++) {
              const ang = (Math.PI * 2 * s) / 20;
              sparks.push({
                x: superX,
                y: superY,
                vx: Math.cos(ang) * (Math.random() * 3.5 + 1.5),
                vy: Math.sin(ang) * (Math.random() * 3.5 + 1.5),
                alpha: 0.95,
                size: 2.2,
                color: s % 2 === 0 ? '#00f2fe' : '#ffffff',
              });
            }

            comets.splice(k, 1);
            if (k < j) j--;
            break;
          }

          // 2. BLACKHOLE + BLACKHOLE COLLISION -> Merge into even bigger blackhole!
          if (predator.specialType === 'blackhole' && prey.specialType === 'blackhole') {
            const predatorCount = predator.absorptionCount || 1;
            const preyCount = prey.absorptionCount || 1;
            predator.absorptionCount = predatorCount + preyCount;
            predator.size = Math.min(32, predator.size + prey.size * 0.45);
            predator.originalSize = predator.size;
            predator.mass = (predator.mass || 3.0) + (prey.mass || 3.0);
            predator.pulseAnim = 1.0;
            if (prey.hasYellowDisk) predator.hasYellowDisk = true;
            if (prey.absorbedSunsForDisk) {
              predator.absorbedSunsForDisk = (predator.absorbedSunsForDisk || 0) + (prey.absorbedSunsForDisk || 0);
            }

            playCelestialTierSound('blackhole', sfxVolumeRef.current);
            ripples.push({
              x: (px + tx) / 2,
              y: (py + ty) / 2,
              radius: 12,
              maxRadius: Math.min(220, 140 + predator.absorptionCount * 18),
              alpha: 1.0,
              speed: 4.8,
              lineWidth: 3.2,
              color: '#00f2fe',
            });

            for (let s = 0; s < 18; s++) {
              const ang = (Math.PI * 2 * s) / 18;
              sparks.push({
                x: (px + tx) / 2,
                y: (py + ty) / 2,
                vx: Math.cos(ang) * (Math.random() * 3 + 1.5),
                vy: Math.sin(ang) * (Math.random() * 3 + 1.5),
                alpha: 0.95,
                size: 2.0,
                color: '#00f2fe',
              });
            }

            comets.splice(k, 1);
            if (k < j) j--;
            break;
          }

          // 3. SUN + SUN INGESTION & COLLISIONS:
          // - 3-4 Suns eaten -> Forms a "Hawking Star" (star with black hole inside, slowly eaten over 2 minutes)
          // - 5-6 Suns eaten in under 2 minutes -> Forms a black hole with a yellowish disk!
          // - Otherwise -> Big supernova
          if (predator.specialType === 'sun' && prey.specialType === 'sun') {
            const superX = (px + tx) / 2;
            const superY = (py + ty) / 2;
            const nowTime = performance.now();

            if (!predator.firstSunAbsorbedTime) {
              predator.firstSunAbsorbedTime = nowTime;
            }
            const newlyAbsorbed = (prey.absorbedSunsCount || 0) + 1;
            predator.absorbedSunsCount = (predator.absorbedSunsCount || 0) + newlyAbsorbed;
            const timeSinceFirstSun = nowTime - predator.firstSunAbsorbedTime;

            // Check if 5-6 Suns absorbed in under 2 minutes (120,000 ms)
            if (predator.absorbedSunsCount >= 5 && timeSinceFirstSun <= 120000) {
              predator.specialType = 'blackhole';
              predator.hasYellowDisk = true;
              predator.size = 13;
              predator.originalSize = 13;
              predator.mass = 3.6;
              predator.pulseAnim = 1.0;
              playCelestialTierSound('blackhole', sfxVolumeRef.current);

              ripples.push({
                x: superX,
                y: superY,
                radius: 12,
                maxRadius: 240,
                alpha: 1.0,
                speed: 6.5,
                lineWidth: 4.5,
                color: '#fbbf24',
              });
              for (let s = 0; s < 36; s++) {
                const ang = (Math.PI * 2 * s) / 36;
                sparks.push({
                  x: superX,
                  y: superY,
                  vx: Math.cos(ang) * (Math.random() * 4.5 + 2.0),
                  vy: Math.sin(ang) * (Math.random() * 4.5 + 2.0),
                  alpha: 1.0,
                  size: 2.2,
                  color: s % 2 === 0 ? '#fef08a' : '#f59e0b',
                });
              }

              comets.splice(k, 1);
              if (k < j) j--;
              break;
            }
            // Check if 3-4 Suns eaten -> Forms Hawking Star!
            else if (predator.absorbedSunsCount >= 3) {
              predator.specialType = 'hawking_star';
              predator.hawkingProgress = 0;
              predator.size = 14;
              predator.originalSize = 14;
              predator.mass = 3.2;
              predator.pulseAnim = 1.0;
              playCelestialTierSound('blackhole', sfxVolumeRef.current);

              ripples.push({
                x: superX,
                y: superY,
                radius: 12,
                maxRadius: 220,
                alpha: 1.0,
                speed: 5.5,
                lineWidth: 4.0,
                color: '#f59e0b',
              });
              for (let s = 0; s < 30; s++) {
                const ang = (Math.PI * 2 * s) / 30;
                sparks.push({
                  x: superX,
                  y: superY,
                  vx: Math.cos(ang) * (Math.random() * 4.0 + 1.5),
                  vy: Math.sin(ang) * (Math.random() * 4.0 + 1.5),
                  alpha: 1.0,
                  size: 2.0,
                  color: s % 2 === 0 ? '#00f2fe' : '#fbbf24',
                });
              }

              comets.splice(k, 1);
              if (k < j) j--;
              break;
            } else {
              // Standard Sun + Sun Supernova!
              playCelestialTierSound('supernova', sfxVolumeRef.current);

              ripples.push({
                x: superX,
                y: superY,
                radius: 15,
                maxRadius: 280,
                alpha: 1.0,
                speed: 7.0,
                lineWidth: 4.5,
                color: '#ffffff',
              });
              ripples.push({
                x: superX,
                y: superY,
                radius: 10,
                maxRadius: 220,
                alpha: 0.9,
                speed: 5.5,
                lineWidth: 3.5,
                color: '#f59e0b',
              });

              for (let s = 0; s < 36; s++) {
                const ang = (Math.PI * 2 * s) / 36;
                sparks.push({
                  x: superX,
                  y: superY,
                  vx: Math.cos(ang) * (Math.random() * 5.5 + 2.0),
                  vy: Math.sin(ang) * (Math.random() * 5.5 + 2.0),
                  alpha: 1.0,
                  size: Math.random() * 2.8 + 1.2,
                  color: s % 3 === 0 ? '#ffffff' : (s % 3 === 1 ? '#fbbf24' : '#f97316'),
                });
              }

              centralAuraScaleBonus += 2.8;
              centralAuraShakeBonus += 2.0;

              predator.size = Math.min(20, predator.size * 1.3);
              predator.originalSize = predator.size;
              predator.mass = (predator.mass || 2.2) * 1.6;
              predator.pulseAnim = 1.0;

              comets.splice(k, 1);
              if (k < j) j--;
              break;
            }
          }

          // 4. EARTH + EARTH COLLISION -> RED PLANET + RETRO SPACESHIP ESCAPING ENTIRE PAGE!
          if (predator.specialType === 'earth' && prey.specialType === 'earth') {
            const collideX = (px + tx) / 2;
            const collideY = (py + ty) / 2;

            predator.specialType = 'red_planet';
            predator.size = 10;
            predator.originalSize = 10;
            predator.mass = 2.4;
            predator.speed = Math.sign(predator.speed || 1) * 0.0022;
            predator.color = '#ef4444';
            predator.pulseAnim = 1.0;

            playCelestialTierSound('redplanet', sfxVolumeRef.current);

            ripples.push({
              x: collideX,
              y: collideY,
              radius: 8,
              maxRadius: 130,
              alpha: 0.95,
              speed: 4.0,
              lineWidth: 2.8,
              color: '#ef4444',
            });

            for (let s = 0; s < 16; s++) {
              const ang = (Math.PI * 2 * s) / 16;
              sparks.push({
                x: collideX,
                y: collideY,
                vx: Math.cos(ang) * (Math.random() * 3.0 + 1.0),
                vy: Math.sin(ang) * (Math.random() * 3.0 + 1.0),
                alpha: 0.95,
                size: 1.8,
                color: '#ef4444',
              });
            }

            // Launch tiny retro spaceship escaping off the entire page!
            const escapeAngle = Math.atan2(collideY - height * 0.5, collideX - width * 0.5) + (Math.random() - 0.5) * 0.5;
            const shipSpeed = 5.2 + Math.random() * 1.5;
            spaceships.push({
              x: collideX,
              y: collideY,
              vx: Math.cos(escapeAngle) * shipSpeed,
              vy: Math.sin(escapeAngle) * shipSpeed,
              angle: escapeAngle,
              alpha: 1.0,
              exhaust: [],
            });
            playCelestialTierSound('spaceship', sfxVolumeRef.current);

            comets.splice(k, 1);
            if (k < j) j--;
            break;
          }

          // 5. 2 RED PLANETS COLLISION -> DESTROYED & FORM A BUNCH OF RED COMETS!
          if (predator.specialType === 'red_planet' && prey.specialType === 'red_planet') {
            const collideX = (px + tx) / 2;
            const collideY = (py + ty) / 2;

            playCelestialTierSound('redplanet', sfxVolumeRef.current);

            ripples.push({
              x: collideX,
              y: collideY,
              radius: 10,
              maxRadius: 160,
              alpha: 1.0,
              speed: 4.8,
              lineWidth: 3.2,
              color: '#ef4444',
            });

            // Shatter into 16 red comets orbiting outwards
            for (let c = 0; c < 16; c++) {
              const ang = (Math.PI * 2 * c) / 16 + (Math.random() - 0.5) * 0.2;
              const spd = (Math.random() > 0.5 ? 1 : -1) * (0.0022 + Math.random() * 0.0018);
              const rad = Math.hypot(collideX - dynamicCenterX, collideY - dynamicCenterY);
              comets.push({
                angle: Math.atan2((collideY - dynamicCenterY) / 0.7, (collideX - dynamicCenterX) / 1.2) + (Math.random() - 0.5) * 0.2,
                radius: Math.max(25, rad + (Math.random() - 0.5) * 25),
                originalRadius: rad,
                speed: spd,
                size: Math.random() * 1.8 + 1.2,
                alpha: 0.95,
                originalSize: 1.8,
                perturbX: Math.cos(ang) * (Math.random() * 20 + 8),
                perturbY: Math.sin(ang) * (Math.random() * 20 + 8),
                isBreakingApart: false,
                destructionProgress: 0,
                color: '#ef4444',
              });
            }

            // Remove both planets
            const firstIdx = Math.max(j, k);
            const secondIdx = Math.min(j, k);
            comets.splice(firstIdx, 1);
            comets.splice(secondIdx, 1);
            break;
          }

          // 6. STANDARD PREDATOR / PREY ABSORPTION HIERARCHY:
          // - Blackhole absorbs: comet, hyper, earth, red_planet, gas_giant, sun
          //   * Absorbing 1-2 Suns gives black hole accretion disk (1 = minor, 2+ = full-on)
          // - Sun with 4-6 absorbed suns can absorb: Gas Giant!
          // - Gas Giant absorbs: comet, hyper, earth, red_planet
          // - Sun absorbs: comet, hyper, earth
          // - Earth absorbs: comet, hyper
          let canAbsorb = false;
          if (predator.specialType === 'blackhole') {
            canAbsorb = true;
            if (prey.specialType === 'sun' || prey.specialType === 'hawking_star') {
              predator.absorbedSunsForDisk = (predator.absorbedSunsForDisk || 0) + 1;
              playCelestialTierSound('sun', sfxVolumeRef.current);
            }
          } else if (predator.specialType === 'sun' && (predator.absorbedSunsCount || 0) >= 4 && prey.specialType === 'gas_giant') {
            canAbsorb = true;
          } else if (predator.specialType === 'gas_giant' && (prey.specialType === 'red_planet' || prey.specialType === 'earth' || !prey.specialType)) {
            canAbsorb = true;
          } else if (predator.specialType === 'sun' && (prey.specialType === 'earth' || !prey.specialType)) {
            canAbsorb = true;
          } else if (predator.specialType === 'earth' && !prey.specialType) {
            canAbsorb = true;
          }

          if (canAbsorb) {
            predator.pulseAnim = 1.0;
            predator.size = Math.min(predator.size * 1.02, predator.originalSize * 1.5);
            if (predator.specialType === 'blackhole') {
              predator.absorptionCount = (predator.absorptionCount || 1) + 1;
            }
            playCelestialTierSound('absorb', sfxVolumeRef.current);

            sparks.push({
              x: tx,
              y: ty,
              vx: (Math.random() - 0.5) * 2.5,
              vy: (Math.random() - 0.5) * 2.5,
              alpha: 0.9,
              size: 1.6,
              color: prey.color || '#00f2fe',
            });

            if (prey.isPermanent || prey.specialType || prey.isHyperFast || comets.length > initialCometCount) {
              comets.splice(k, 1);
              if (k < j) j--;
            } else {
              prey.radius = maxDimension;
              prey.originalRadius = maxDimension;
              prey.angle = Math.random() * Math.PI * 2;
              prey.size = prey.originalSize;
              prey.alpha = Math.random() * 0.5 + 0.25;
              prey.speed = 0.002 + Math.random() * 0.003;
              prey.perturbX = 0;
              prey.perturbY = 0;
              prey.isBreakingApart = false;
              prey.destructionProgress = 0;
            }
          }
        }
      }

      // HOLD TO CREATE COMETS: If holding still in open space outside vortex & nebula, stream comets
      if (
        isPointerDown &&
        !holdCandidate &&
        !holdCandidateShip &&
        !heldBody &&
        !heldSpaceship &&
        !isUiInteractionActive() &&
        !isInsideExcludedZone(pointerX, pointerY) &&
        !(strokeDistance > 45 && now - lastSwipeMoveTime < 80) &&
        now - holdStartTime > 200
      ) {
        if (now - lastCometSpawnTime > 160) {
          lastCometSpawnTime = now;
          if (comets.length < 180) {
            spawnCometAtPoint(pointerX, pointerY);
          }
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // FIND ACTIVE BLACK HOLES IN NEBULA REGION FOR TEMPORARY DUST SUCTION
      const activeNebulaBlackHoles: { x: number; y: number; r: number }[] = [];
      for (let b = 0; b < comets.length; b++) {
        const cb = comets[b];
        if (cb.specialType === 'blackhole') {
          let bx = dynamicCenterX + cb.perturbX + Math.cos(cb.angle + vortexRotation) * cb.radius * 1.2;
          let by = dynamicCenterY + cb.perturbY + Math.sin(cb.angle + vortexRotation) * (cb.radius * 0.7);
          if ((cb.isHeld || cb.isFlinging) && cb.flingPosX !== undefined && cb.flingPosY !== undefined) {
            bx = cb.flingPosX;
            by = cb.flingPosY;
          }
          const concaveYAtX = getConcaveBaseY(bx);
          if (by >= concaveYAtX - 55) {
            activeNebulaBlackHoles.push({ x: bx, y: by, r: 120 });
          }
        }
      }

      // LUMINOUS STARDUST NEBULA PARTICLES (Fluid elastic scroll motion; strictly anchored above blue line; ONLY Nebula bounces off bottom Music Bar & Track Navigator outlines)
      const pageBottomY = getPageBottomViewportY();
      const rawScrollStep = pageBottomY - prevNebulaBottomY;
      prevNebulaBottomY = pageBottomY;
      if (Math.abs(pageBottomY - smoothNebulaAnchorY) > height * 0.9) {
        smoothNebulaAnchorY = pageBottomY;
      } else {
        smoothNebulaAnchorY += (pageBottomY - smoothNebulaAnchorY) * 0.28;
        if (Math.abs(pageBottomY - smoothNebulaAnchorY) < 0.25) {
          smoothNebulaAnchorY = pageBottomY;
        }
      }
      const clampedStep = Math.max(-65, Math.min(65, rawScrollStep));
      smoothNebulaScrollVel = smoothNebulaScrollVel * 0.78 + clampedStep * 0.22;
      smoothNebulaArchOffset += (Math.max(-18, Math.min(24, smoothNebulaScrollVel * 1.15)) - smoothNebulaArchOffset) * 0.16;

      for (let n = 0; n < nebulaDustParticles.length; n++) {
        const pt = nebulaDustParticles[n];
        const dustX = pt.normX * width;
        const curveBaseY = getConcaveBaseY(dustX, smoothNebulaAnchorY);
        const floatX = Math.cos(now * pt.driftSpeed * 0.8 + pt.driftOffset) * 5;
        const floatY = Math.sin(now * pt.driftSpeed + pt.driftOffset) * 12;

        // Subtle fluid dust buoyancy when scrolling up/down so stardust billows smoothly without snapping
        if (Math.abs(smoothNebulaScrollVel) > 0.08) {
          const inertiaFactor = 0.032 + (pt.size / 3.0) * 0.025 + Math.sin(pt.normX * Math.PI) * 0.022;
          pt.vy -= smoothNebulaScrollVel * inertiaFactor;
        }

        // Smooth spring-damped motion around home position
        pt.vx *= Math.pow(0.92, ts);
        pt.vy *= Math.pow(0.90, ts);
        pt.vx -= pt.ox * 0.022 * ts;
        pt.vy -= pt.oy * 0.024 * ts;
        pt.ox += pt.vx * ts;
        pt.oy = Math.max(-55, Math.min(35, pt.oy + pt.vy * ts));

        let targetX = Math.max(2, Math.min(width - 2, dustX + floatX + pt.ox));
        let targetY: number;

        if (pt.isCorner && pt.cornerRelY !== undefined) {
          // Distribute seamlessly from curve down to the blue line in both corners
          const availableH = Math.max(20, smoothNebulaAnchorY - curveBaseY + 6);
          targetY = Math.min(pageBottomY - 2, curveBaseY + pt.cornerRelY * availableH + floatY * 0.45 + pt.oy);
        } else {
          targetY = Math.min(pageBottomY - 2, curveBaseY + pt.baseRelY + floatY + pt.oy);
        }

        // ONLY THE NEBULA bounces off the outline of the Music Bar and Track Navigator when both are at the bottom (no blue visual impact)
        if (isAtBottomHud && activeOutlineRects.length > 0) {
          const pad = Math.max(1.5, pt.size);
          for (let r = 0; r < activeOutlineRects.length; r++) {
            const rect = activeOutlineRects[r];
            if (
              targetX >= rect.left - pad &&
              targetX <= rect.right + pad &&
              targetY >= rect.top - pad &&
              targetY <= rect.bottom + pad
            ) {
              const dTop = Math.abs(targetY - (rect.top - pad));
              const dBottom = Math.abs(rect.bottom + pad - targetY);
              const dLeft = Math.abs(targetX - (rect.left - pad));
              const dRight = Math.abs(rect.right + pad - targetX);
              const minD = Math.min(dTop, dBottom, dLeft, dRight);

              if (minD === dBottom) {
                const push = rect.bottom + pad + 1 - targetY;
                targetY = rect.bottom + pad + 1;
                pt.oy += push;
                pt.vy = Math.max(1.3, Math.abs(pt.vy) * 0.9);
              } else if (minD === dTop) {
                const push = targetY - (rect.top - pad - 1);
                targetY = rect.top - pad - 1;
                pt.oy -= push;
                pt.vy = -Math.max(1.3, Math.abs(pt.vy) * 0.9);
              } else if (minD === dLeft) {
                const push = targetX - (rect.left - pad - 1);
                targetX = rect.left - pad - 1;
                pt.ox -= push;
                pt.vx = -Math.max(1.3, Math.abs(pt.vx) * 0.9);
              } else {
                const push = rect.right + pad + 1 - targetX;
                targetX = rect.right + pad + 1;
                pt.ox += push;
                pt.vx = Math.max(1.3, Math.abs(pt.vx) * 0.9);
              }

              if (now - pt.lastOutlineBounceTime > 160) {
                pt.lastOutlineBounceTime = now;
                triggerOutlineBounce(pt.size);
              }
              break;
            }
          }
        }

        // Check suction by any black hole dragged into the nebula
        let isBeingEaten = false;
        for (let b = 0; b < activeNebulaBlackHoles.length; b++) {
          const bh = activeNebulaBlackHoles[b];
          const distToBh = Math.hypot(targetX - bh.x, targetY - bh.y);
          if (distToBh < bh.r) {
            isBeingEaten = true;
            pt.eatenProgress = Math.min(1.0, pt.eatenProgress + 0.08 * ts);
            // Gravitationally pull coordinate towards black hole center
            targetX += (bh.x - targetX) * pt.eatenProgress * 0.45;
            targetY += (bh.y - targetY) * pt.eatenProgress * 0.45;
            break;
          }
        }

        if (!isBeingEaten && pt.eatenProgress > 0) {
          // Black hole left nebula: smoothly restore debris
          pt.eatenProgress = Math.max(0, pt.eatenProgress - 0.02 * ts);
        }

        // Skip drawing particles outside viewport (nebula stays strictly at page bottom)
        if (targetY < -12 || targetY > height + 12) continue;

        const renderAlpha = pt.alpha * (1 - pt.eatenProgress * 0.95);
        if (renderAlpha > 0.02) {
          ctx.beginPath();
          ctx.arc(targetX, targetY, pt.size * (1 - pt.eatenProgress * 0.6), 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = renderAlpha;
          ctx.shadowBlur = 6;
          ctx.shadowColor = pt.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      }

      // Apply scroll-reveal opacity cleanly to vortex & orbital entities while keeping nebula crisp
      ctx.globalAlpha = vortexRevealAlpha;

      // 1. Concentric Vortex Ellipses with phone gyroscope 3D perspective warp
      const perspectiveScaleX = 1.2 + (gyroTiltX * 0.003);
      const perspectiveScaleY = Math.max(0.45, 0.7 + (gyroTiltY * 0.003));

      for (let r = 40; r < maxDimension; r += 80) {
        ctx.beginPath();
        ctx.ellipse(dynamicCenterX, dynamicCenterY, r * perspectiveScaleX, r * perspectiveScaleY, vortexRotation, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.04 + (1 - r / (width * 0.5)) * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. CENTRAL VORTEX / BLACK HOLE CORE & BEAT-REACTIVE AURA
      // Music beat extraction (only active if music is playing and audible)
      const musicBeatEnergy = getMusicBeatEnergy(
        audioRef.current,
        isPlaying,
        musicVolumeRef.current
      );

      // Music Beat Aura Shaking: ONLY and very minorly but violently shakes the aura of the vortex/blackhole in the middle
      // Beat kicks create rapid violent micro-jitter and electric tremor strictly confined to the surrounding aura
      const auraBeatShake = musicBeatEnergy * 3.4;
      const auraJitterX = (Math.random() - 0.5) * (1.2 + auraBeatShake * 1.8 + centralAuraShakeBonus * 0.8);
      const auraJitterY = (Math.random() - 0.5) * (1.2 + auraBeatShake * 1.8 + centralAuraShakeBonus * 0.8);
      const auraCenterX = dynamicCenterX + auraJitterX;
      const auraCenterY = dynamicCenterY + auraJitterY;

      // Outer pulsating gravitational distortion glow (aura outermost layer)
      const pulseR =
        TIDAL_DISRUPTION_R +
        centralAuraScaleBonus * 1.6 +
        Math.sin(now * 0.035) * 2.8 +
        musicBeatEnergy * 4.2 +
        (Math.random() - 0.5) * (1.2 + auraBeatShake);

      ctx.beginPath();
      ctx.arc(auraCenterX, auraCenterY, Math.max(10, pulseR), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${Math.min(0.28, 0.035 + centralAuraScaleBonus * 0.015 + musicBeatEnergy * 0.04)})`;
      ctx.fill();

      // Relativistic ergosphere / accretion aura ring rotating slowly with beat-reactive jitter
      ctx.save();
      ctx.translate(auraCenterX, auraCenterY);
      ctx.rotate(blackHoleRotation);

      // 4 Relativistic photon arcs forming the glowing aura corona
      for (let a = 0; a < 4; a++) {
        const arcStart = (Math.PI / 2) * a;
        ctx.beginPath();
        ctx.arc(0, 0, (EVENT_HORIZON_R + 6) + Math.sin(now * 0.02 + a) * 0.8 + musicBeatEnergy * 1.4, arcStart, arcStart + Math.PI * 0.35);
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.35 + (a % 2 === 0 ? 0.25 : 0.05) + musicBeatEnergy * 0.22})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10 + musicBeatEnergy * 6;
        ctx.shadowColor = '#00f2fe';
        ctx.stroke();
      }

      // Gravitational distortion spikes extending outwards from the aura (reduced to 2 subtle, faint streaks)
      for (let s = 0; s < 2; s++) {
        const spikeAng = Math.PI * s + blackHoleRotation;
        const innerR = EVENT_HORIZON_R + 2;
        const outerR = EVENT_HORIZON_R + 5 * currentHorizonScale + Math.random() * 2 + musicBeatEnergy * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(spikeAng) * innerR, Math.sin(spikeAng) * innerR);
        ctx.lineTo(Math.cos(spikeAng) * outerR, Math.sin(spikeAng) * outerR);
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.25 + musicBeatEnergy * 0.15})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();

      // Black hole central event horizon and singularity stay firmly centered at dynamicCenterX, dynamicCenterY
      const horizonTremor = (Math.random() - 0.5) * 0.6;
      ctx.beginPath();
      ctx.arc(dynamicCenterX, dynamicCenterY, EVENT_HORIZON_R + 2.5 + horizonTremor, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00f2fe';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pure black singularity core firmly at the center
      ctx.beginPath();
      ctx.arc(dynamicCenterX, dynamicCenterY, EVENT_HORIZON_R, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Gradual settling of absorbed aura & shake
      centralAuraScaleBonus *= Math.pow(0.999, ts);
      centralAuraShakeBonus *= Math.pow(0.997, ts);

      // 3. COMETS / PARTICLES SIMULATION & RENDERING
      for (let i = comets.length - 1; i >= 0; i--) {
        const p = comets[i];

        // Orbit update with smooth friction on perturbations (scaled by timeScale)
        if (!p.isHeld && !p.isHyperFast) {
          p.angle += p.speed * ts;
          p.perturbX *= Math.pow(0.96, ts);
          p.perturbY *= Math.pow(0.96, ts);
        }

        // Advance rotating rings for gas giant
        if (p.specialType === 'gas_giant') {
          p.ringAngle = ((p.ringAngle || 0) + 0.025 * ts) % (Math.PI * 2);
        }

        // Advance Hawking star internal absorption (consumes sun over 2 minutes / 120,000ms)
        if (p.specialType === 'hawking_star') {
          p.hawkingProgress = Math.min(1.0, (p.hawkingProgress || 0) + (16.67 * ts) / 120000);
          if (p.hawkingProgress >= 1.0) {
            // Internal black hole finishes consuming the star -> collapses into mini black hole!
            p.specialType = 'blackhole';
            p.hasYellowDisk = false;
            p.absorbedSunsForDisk = 0;
            p.size = 11;
            p.originalSize = 11;
            p.mass = 3.0;
            p.pulseAnim = 1.0;
            playCelestialTierSound('blackhole', sfxVolumeRef.current);
            ripples.push({
              x: dynamicCenterX + p.perturbX + Math.cos(p.angle + vortexRotation) * p.radius * 1.2,
              y: dynamicCenterY + p.perturbY + Math.sin(p.angle + vortexRotation) * (p.radius * 0.7),
              radius: 8,
              maxRadius: 130,
              alpha: 1.0,
              speed: 4.2,
              lineWidth: 3.0,
              color: '#00f2fe',
            });
          }
        }

        // Hyper-fast comet clean 2D gravitational slingshot physics
        if (p.isHyperFast) {
          if (!p.hyperHistory) p.hyperHistory = [];
          if (!p.isHeld && !p.isFlinging && p.hyperX !== undefined && p.hyperY !== undefined) {
            const toCx = dynamicCenterX - p.hyperX;
            const toCy = dynamicCenterY - p.hyperY;
            const distSq = toCx * toCx + toCy * toCy;
            const dist = Math.sqrt(distSq) || 1;
            // Smooth softened central gravity so trajectory bends cleanly without sudden velocity spikes or kinks
            const grav = (950 * currentHorizonScale) / (distSq + 3200);
            p.hyperVx = (p.hyperVx || 0) + (toCx / dist) * grav * ts;
            p.hyperVy = (p.hyperVy || 0) + (toCy / dist) * grav * ts;

            const curSpd = Math.hypot(p.hyperVx, p.hyperVy);
            if (curSpd > 16) {
              p.hyperVx = (p.hyperVx / curSpd) * 16;
              p.hyperVy = (p.hyperVy / curSpd) * 16;
            }

            p.hyperX += p.hyperVx * ts;
            p.hyperY += p.hyperVy * ts;

            if (activeBounceLine) {
              const bodyR = Math.max(2, p.size || 2);
              if (
                p.hyperX >= activeBounceLine.left &&
                p.hyperX <= activeBounceLine.right &&
                p.hyperY + bodyR >= activeBounceLine.y &&
                p.hyperY - bodyR <= activeBounceLine.y + 24 &&
                (p.hyperVy || 0) > 0
              ) {
                p.hyperY = activeBounceLine.y - bodyR;
                p.hyperVy = -Math.max(1.5, Math.abs(p.hyperVy || 0) * 0.92);
                p.hyperVx = (p.hyperVx || 0) * 0.96;
                p.lastLineBounceTime = now;
                triggerLineBounce(p.hyperX, activeBounceLine.y, p.size || 2.5);
              }
            }

            p.radius = Math.hypot(
              (p.hyperX - dynamicCenterX) / 1.2,
              (p.hyperY - dynamicCenterY) / 0.7
            );
            p.angle =
              Math.atan2((p.hyperY - dynamicCenterY) / 0.7, (p.hyperX - dynamicCenterX) / 1.2) -
              vortexRotation;

            const lastH = p.hyperHistory[p.hyperHistory.length - 1];
            if (!lastH || Math.hypot(p.hyperX - lastH.x, p.hyperY - lastH.y) >= 1.5) {
              p.hyperHistory.push({ x: p.hyperX, y: p.hyperY });
              if (p.hyperHistory.length > 18) {
                p.hyperHistory.shift();
              }
            }

            // Discard cleanly once beyond outer viewport & heading outward
            const exitDist = Math.max(width, height) * 0.92;
            const dotOutward = (p.hyperX - dynamicCenterX) * p.hyperVx + (p.hyperY - dynamicCenterY) * p.hyperVy;
            if (dist > exitDist && dotOutward > 0) {
              comets.splice(i, 1);
              continue;
            }
          } else if (p.isHeld && p.hyperHistory.length > 0) {
            p.hyperHistory.shift();
          }
        }

        // Compute screen coordinates
        let pos = getCometPos(p, dynamicCenterX, dynamicCenterY);
        let x = pos.x;
        let y = pos.y;

        // Orbiting comets, planets, suns, hawking stars & black holes bounce cleanly off Blue Bounce Line
        if (
          activeBounceLine &&
          !p.isHeld &&
          !p.isFlinging &&
          !p.isHyperFast &&
          x >= activeBounceLine.left &&
          x <= activeBounceLine.right
        ) {
          const bodyR = Math.max(2, p.size || 2);
          if (
            y + bodyR >= activeBounceLine.y &&
            y - bodyR <= activeBounceLine.y + 30 &&
            (!p.lastLineBounceTime || now - p.lastLineBounceTime > 160)
          ) {
            const orbAng = p.angle + vortexRotation;
            const totalAngRate = p.speed + 0.0015 + vortexImpulseSpeed;
            const orbVx = -Math.sin(orbAng) * p.radius * 1.2 * totalAngRate;
            const orbVy = Math.cos(orbAng) * p.radius * 0.7 * totalAngRate;
            p.isFlinging = true;
            p.flingPosX = x;
            p.flingPosY = activeBounceLine.y - bodyR;
            p.flingVx = orbVx * 0.92;
            p.flingVy = -Math.max(1.6, Math.abs(orbVy) * 0.92);
            p.lastLineBounceTime = now;
            x = p.flingPosX;
            y = p.flingPosY;
            triggerLineBounce(x, activeBounceLine.y, p.size || 2);
          }
        }

        // Black Hole Gravity: Natural orbital decay
        if (!p.isBreakingApart && !p.isHyperFast && !p.isHeld && !p.isFlinging) {
          p.radius -= (p.specialType ? 0.08 : 0.16) * ts;
        }

        // RED PLANET IN CONCAVE NEBULA: Condenses into Jupiter-like Gas Giant with moving nebula rings!
        if (p.specialType === 'red_planet') {
          const curveBottomY = getConcaveBaseY(x);
          if (y >= curveBottomY - 18) {
            p.nebulaHoverTimer = (p.nebulaHoverTimer || 0) + 16.67 * ts;

            // Condensation ionized sparks
            if (Math.random() < 0.45) {
              sparks.push({
                x: x + (Math.random() - 0.5) * 22,
                y: y + (Math.random() - 0.5) * 22,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2.2,
                alpha: 0.9,
                size: 1.5,
                color: Math.random() > 0.5 ? '#f472b6' : '#38bdf8',
              });
            }

            // After 3 seconds (3000ms) in Nebula zone: Form Jupiter Gas Giant!
            // Moves only slightly slower than a red planet (0.00185 vs 0.0022)
            if (p.nebulaHoverTimer >= 3000) {
              p.specialType = 'gas_giant';
              p.size = 14;
              p.originalSize = 14;
              p.mass = 3.6;
              p.speed = Math.sign(p.speed || 1) * 0.00185;
              p.color = '#d97706';
              p.ringRadius = 27;
              p.ringTilt = 0.42;
              p.ringAngle = 0;
              p.nebulaHoverTimer = 0;
              p.pulseAnim = 1.0;

              playCelestialTierSound('gasgiant', sfxVolumeRef.current);

              ripples.push({
                x,
                y,
                radius: 12,
                maxRadius: 170,
                alpha: 1.0,
                speed: 4.5,
                lineWidth: 3.5,
                color: '#ec4899',
              });
              ripples.push({
                x,
                y,
                radius: 10,
                maxRadius: 130,
                alpha: 0.85,
                speed: 3.5,
                lineWidth: 2.5,
                color: '#00f2fe',
              });
            }
          }
        }

        // TIDAL DISRUPTION: If comet gets super close to the central black hole (and not held), break apart
        if (!p.isHeld && p.radius < TIDAL_DISRUPTION_R) {
          p.isBreakingApart = true;
          p.destructionProgress += 0.035 * ts;

          playBlackHoleRumble(sfxVolumeRef.current);

          p.speed = Math.sign(p.speed || 1) * Math.min(0.05, Math.abs(p.speed) * (1 + 0.05 * ts));
          p.radius -= 0.45 * ts;

          if (Math.random() < 0.65) {
            const curX = x;
            const curY = y;
            const toSingularityX = dynamicCenterX - curX;
            const toSingularityY = dynamicCenterY - curY;
            const toDist = Math.hypot(toSingularityX, toSingularityY) || 1;

            breakupDebris.push({
              x: curX,
              y: curY,
              vx: (toSingularityX / toDist) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.5,
              vy: (toSingularityY / toDist) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.5,
              alpha: p.alpha * 0.9,
              size: Math.max(0.6, p.size * 0.5),
              color: p.color,
            });
          }

          p.size = Math.max(0.3, p.size * Math.pow(0.95, ts));
          p.alpha = Math.max(0.01, p.alpha * Math.pow(0.93, ts));
        }

        // FULL CONSUMPTION / DIRECT COLLISION WITH CENTRAL VORTEX
        const distToCenter = Math.hypot(x - dynamicCenterX, y - dynamicCenterY);
        const hitHorizon = !p.isHeld && (p.radius <= EVENT_HORIZON_R || distToCenter <= EVENT_HORIZON_R + 2 || p.alpha <= 0.02);

        if (hitHorizon) {
          // Special Bodies swallowed by central black hole: Properly scaled and bounded!
          if (p.specialType) {
            if (p.specialType === 'earth') {
              centralAuraScaleBonus += 2.2;
              centralAuraShakeBonus += 1.0;
              playCelestialTierSound('earth', sfxVolumeRef.current);
              ripples.push({
                x: dynamicCenterX,
                y: dynamicCenterY,
                radius: 8,
                maxRadius: 110,
                alpha: 0.95,
                speed: 3.8,
                lineWidth: 2.2,
                color: '#38bdf8',
              });
            } else if (p.specialType === 'red_planet') {
              centralAuraScaleBonus += 3.0;
              centralAuraShakeBonus += 1.5;
              playCelestialTierSound('redplanet', sfxVolumeRef.current);
              ripples.push({
                x: dynamicCenterX,
                y: dynamicCenterY,
                radius: 10,
                maxRadius: 130,
                alpha: 0.95,
                speed: 4.2,
                lineWidth: 2.8,
                color: '#ef4444',
              });
            } else if (p.specialType === 'gas_giant') {
              centralAuraScaleBonus += 4.5;
              centralAuraShakeBonus += 2.2;
              playCelestialTierSound('gasgiant', sfxVolumeRef.current);
              ripples.push({
                x: dynamicCenterX,
                y: dynamicCenterY,
                radius: 12,
                maxRadius: 150,
                alpha: 0.95,
                speed: 4.8,
                lineWidth: 3.2,
                color: '#ec4899',
              });
            } else if (p.specialType === 'sun' || p.specialType === 'hawking_star') {
              centralAuraScaleBonus += 4.0;
              centralAuraShakeBonus += 2.0;
              playCelestialTierSound('sun', sfxVolumeRef.current);
              ripples.push({
                x: dynamicCenterX,
                y: dynamicCenterY,
                radius: 12,
                maxRadius: 155,
                alpha: 1.0,
                speed: 4.8,
                lineWidth: 3.0,
                color: '#fbbf24',
              });
            } else if (p.specialType === 'blackhole') {
              // Violent Central Vortex Singularity Outburst from swallowed black hole!
              const count = p.absorptionCount || 1;
              centralAuraScaleBonus += Math.min(22.0, 7.5 + Math.log2(count + 1) * 6.0);
              centralAuraShakeBonus += Math.min(14.0, 5.0 + Math.log2(count + 1) * 3.8);
              vortexImpulseSpeed += 0.016 + Math.min(0.024, count * 0.005);
              playCelestialTierSound('supernova', sfxVolumeRef.current);
              playBlackHoleRumble(sfxVolumeRef.current * 1.3);

              // 1. Primary supersonic cyan shockwave
              ripples.push({
                x: dynamicCenterX,
                y: dynamicCenterY,
                radius: 12,
                maxRadius: Math.min(320, 170 + count * 35),
                alpha: 1.0,
                speed: 7.0 + Math.min(3.5, count * 0.6),
                lineWidth: 5.0 + Math.min(2.5, count * 0.5),
                color: '#00f2fe',
              });

              // 2. Secondary incandescent ionized white/blue ripple
              ripples.push({
                x: dynamicCenterX,
                y: dynamicCenterY,
                radius: 6,
                maxRadius: Math.min(250, 130 + count * 25),
                alpha: 0.9,
                speed: 5.2 + Math.min(2.8, count * 0.4),
                lineWidth: 3.0,
                color: '#e0ffff',
              });

              // 3. Violent shower of relativistic sparks ejected radially
              const burstSparks = 22 + Math.min(18, count * 4);
              for (let s = 0; s < burstSparks; s++) {
                const spd = 3.2 + Math.random() * 5.0;
                const ang = (Math.PI * 2 * s) / burstSparks + (Math.random() - 0.5) * 0.4;
                sparks.push({
                  x: dynamicCenterX + (Math.random() - 0.5) * 14,
                  y: dynamicCenterY + (Math.random() - 0.5) * 14,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd,
                  alpha: 1.0,
                  size: Math.random() * 2.8 + 1.2,
                  color: s % 3 === 0 ? '#00f2fe' : s % 3 === 1 ? '#ffffff' : '#38bdf8',
                });
              }
            }
            comets.splice(i, 1);
            continue;
          }

          // Hyper-velocity comet direct absorption by Central Vortex
          if (p.isHyperFast) {
            centralAuraScaleBonus += 1.8;
            centralAuraShakeBonus += 1.2;
            playCelestialTierSound('absorb', sfxVolumeRef.current);
            ripples.push({
              x: dynamicCenterX,
              y: dynamicCenterY,
              radius: 6,
              maxRadius: 85,
              alpha: 0.85,
              speed: 4.0,
              lineWidth: 2.0,
              color: '#e0ffff',
            });
            comets.splice(i, 1);
            continue;
          }

          if (p.isPermanent && comets.length > initialCometCount) {
            comets.splice(i, 1);
            continue;
          } else {
            p.radius = maxDimension;
            p.originalRadius = maxDimension;
            p.angle = Math.random() * Math.PI * 2;
            p.size = p.originalSize;
            p.alpha = Math.random() * 0.5 + 0.25;
            p.speed = 0.002 + Math.random() * 0.003;
            p.perturbX = 0;
            p.perturbY = 0;
            p.isBreakingApart = false;
            p.destructionProgress = 0;
          }
        }

        // A. HYPER-FAST COMET RENDERING (Clean continuous tapered luminescent streak, zero dotted circles)
        if (p.isHyperFast) {
          const hist = p.hyperHistory || [];
          if (hist.length >= 2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f2fe';
            for (let s = 1; s < hist.length; s++) {
              const tRatio = s / (hist.length - 1);
              ctx.beginPath();
              ctx.moveTo(hist[s - 1].x, hist[s - 1].y);
              ctx.lineTo(hist[s].x, hist[s].y);
              ctx.strokeStyle = `rgba(224, 255, 255, ${(0.06 + tRatio * 0.72) * vortexRevealAlpha})`;
              ctx.lineWidth = Math.max(0.5, p.size * (0.25 + tRatio * 1.55));
              ctx.stroke();
            }
            // Connect final history point smoothly to exact current head position
            const lastPt = hist[hist.length - 1];
            ctx.beginPath();
            ctx.moveTo(lastPt.x, lastPt.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * vortexRevealAlpha})`;
            ctx.lineWidth = p.size * 1.85;
            ctx.stroke();
            ctx.restore();
          }

          ctx.beginPath();
          ctx.arc(x, y, p.size * 1.15, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 16;
          ctx.shadowColor = '#00f2fe';
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        }

        // B. SPECIAL CELESTIAL BODY RENDERING
        if (p.specialType === 'earth') {
          // Earth: Ocean blue sphere + green landmass continents + atmosphere halo
          const tailAngle = p.angle + vortexRotation - p.speed * 4;
          const tailX = dynamicCenterX + p.perturbX + Math.cos(tailAngle) * (p.radius + 1.2) * 1.2;
          const tailY = dynamicCenterY + p.perturbY + Math.sin(tailAngle) * (p.radius + 0.7) * 0.7;

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = '#38bdf8';
          ctx.globalAlpha = 0.5 * vortexRevealAlpha;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.globalAlpha = vortexRevealAlpha;

          // Atmospheric cyan glow
          ctx.beginPath();
          ctx.arc(x, y, p.size + 1.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#0284c7';
          ctx.fill();

          // Ocean Blue body
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();

          // Green continents
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(x - p.size * 0.28, y - p.size * 0.15, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + p.size * 0.25, y + p.size * 0.2, p.size * 0.36, 0, Math.PI * 2);
          ctx.fill();

          // Translucent cloud swirls
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(x + p.size * 0.1, y - p.size * 0.28, p.size * 0.24, 0, Math.PI * 2);
          ctx.fill();

          // Absorption expansion pulse
          if (p.pulseAnim && p.pulseAnim > 0) {
            ctx.beginPath();
            ctx.arc(x, y, p.size * (1 + (1 - p.pulseAnim) * 0.8), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${p.pulseAnim * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            p.pulseAnim = Math.max(0, p.pulseAnim - 0.04);
          }
          ctx.shadowBlur = 0;
          continue;
        }

        // Red Planet Rendering (Mars-like with polar cap & basalt patches)
        if (p.specialType === 'red_planet') {
          ctx.beginPath();
          ctx.arc(x, y, p.size + 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#dc2626';
          ctx.fill();

          const redGrad = ctx.createRadialGradient(x - p.size * 0.3, y - p.size * 0.3, p.size * 0.1, x, y, p.size);
          redGrad.addColorStop(0, '#f87171');
          redGrad.addColorStop(0.6, '#dc2626');
          redGrad.addColorStop(1, '#991b1b');
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = redGrad;
          ctx.fill();

          ctx.fillStyle = 'rgba(127, 29, 29, 0.7)';
          ctx.beginPath();
          ctx.arc(x - p.size * 0.25, y + p.size * 0.2, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + p.size * 0.3, y - p.size * 0.1, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x, y - p.size * 0.75, p.size * 0.32, 0, Math.PI * 2);
          ctx.fill();

          if (p.pulseAnim && p.pulseAnim > 0) {
            ctx.beginPath();
            ctx.arc(x, y, p.size * (1 + (1 - p.pulseAnim) * 0.9), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(239, 68, 68, ${p.pulseAnim * 0.85})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();
            p.pulseAnim = Math.max(0, p.pulseAnim - 0.04);
          }

          if (p.nebulaHoverTimer && p.nebulaHoverTimer > 0) {
            const charge = Math.min(1, p.nebulaHoverTimer / 3000);
            ctx.beginPath();
            ctx.arc(x, y, p.size + 4, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * charge);
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 2.0;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f472b6';
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
          continue;
        }

        // GAS GIANT OVERHAUL: LOOKS LIKE JUPITER WITH ACTUALLY MOVING NEBULA-COLORED RINGS!
        if (p.specialType === 'gas_giant') {
          const ringR = p.ringRadius || 27;
          const ringTilt = p.ringTilt || 0.42;
          const ringRot = p.ringAngle || 0;

          // 1. Back ring half (behind planet) with nebula colors (fuchsia, purple, cyan)
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.35);

          // Nebula ring glow in back
          ctx.beginPath();
          ctx.ellipse(0, 0, ringR, ringR * ringTilt, 0, Math.PI, Math.PI * 2);
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
          ctx.lineWidth = 4.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, ringR * 0.88, ringR * 0.88 * ringTilt, 0, Math.PI, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Moving stardust beads in back ring
          for (let b = 0; b < 6; b++) {
            const beadAng = ringRot + (Math.PI * 2 * b) / 6;
            const cosA = Math.cos(beadAng);
            const sinA = Math.sin(beadAng);
            if (sinA < 0) {
              const bx = cosA * ringR * 0.94;
              const by = sinA * ringR * ringTilt * 0.94;
              ctx.beginPath();
              ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
              ctx.fillStyle = b % 2 === 0 ? '#f472b6' : '#38bdf8';
              ctx.shadowBlur = 4;
              ctx.shadowColor = '#ec4899';
              ctx.fill();
            }
          }
          ctx.restore();

          // 2. Jupiter Planet Sphere with realistic Jovian stratified atmospheric bands & Great Red Spot
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.clip();

          // Stratified Jovian equatorial and polar belts
          const jupiterGrad = ctx.createLinearGradient(x, y - p.size, x, y + p.size);
          jupiterGrad.addColorStop(0, '#78350f');   // North polar dark mahogany
          jupiterGrad.addColorStop(0.18, '#d97706'); // North temperate ochre
          jupiterGrad.addColorStop(0.32, '#fef3c7'); // North tropical bright cream
          jupiterGrad.addColorStop(0.44, '#b45309'); // North equatorial caramel belt
          jupiterGrad.addColorStop(0.52, '#fef08a'); // Bright equatorial zone
          jupiterGrad.addColorStop(0.62, '#9a3412'); // South equatorial terracotta belt
          jupiterGrad.addColorStop(0.78, '#d97706'); // South tropical caramel
          jupiterGrad.addColorStop(1, '#451a03');   // South polar deep chocolate
          ctx.fillStyle = jupiterGrad;
          ctx.fill();

          // Wavy zonal turbulence cloud bands
          ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.fillRect(x - p.size, y - p.size * 0.16, p.size * 2, p.size * 0.14);
          ctx.fillStyle = 'rgba(124, 45, 18, 0.35)';
          ctx.fillRect(x - p.size, y + p.size * 0.12, p.size * 2, p.size * 0.16);

          // Great Red Spot: Oval swirling storm in south tropical zone!
          const grsX = x + p.size * 0.28;
          const grsY = y + p.size * 0.28;
          ctx.beginPath();
          ctx.ellipse(grsX, grsY, p.size * 0.34, p.size * 0.22, 0.08, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.fill();

          // Great Red Spot eye core highlight
          ctx.beginPath();
          ctx.ellipse(grsX, grsY, p.size * 0.18, p.size * 0.1, 0.08, 0, Math.PI * 2);
          ctx.fillStyle = '#f87171';
          ctx.fill();

          ctx.restore();

          // Atmospheric rim shading
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // 3. Front ring half (in front of planet for 3D depth) with moving nebula colors
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.35);

          // Iridescent front ring
          ctx.beginPath();
          ctx.ellipse(0, 0, ringR, ringR * ringTilt, 0, 0, Math.PI);
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.85)';
          ctx.lineWidth = 4.2;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ec4899';
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, ringR * 0.88, ringR * 0.88 * ringTilt, 0, 0, Math.PI);
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
          ctx.lineWidth = 2.0;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00f2fe';
          ctx.stroke();

          // Moving stardust beads in front ring that ACTUALLY move continuously
          for (let b = 0; b < 6; b++) {
            const beadAng = ringRot + (Math.PI * 2 * b) / 6;
            const cosA = Math.cos(beadAng);
            const sinA = Math.sin(beadAng);
            if (sinA >= 0) {
              const bx = cosA * ringR * 0.94;
              const by = sinA * ringR * ringTilt * 0.94;
              ctx.beginPath();
              ctx.arc(bx, by, 1.6, 0, Math.PI * 2);
              ctx.fillStyle = b % 2 === 0 ? '#f472b6' : '#38bdf8';
              ctx.shadowBlur = 6;
              ctx.shadowColor = '#00f2fe';
              ctx.fill();
            }
          }
          ctx.restore();

          if (p.pulseAnim && p.pulseAnim > 0) {
            ctx.beginPath();
            ctx.arc(x, y, ringR * (1 + (1 - p.pulseAnim) * 0.5), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(236, 72, 153, ${p.pulseAnim * 0.85})`;
            ctx.lineWidth = 2.0;
            ctx.stroke();
            p.pulseAnim = Math.max(0, p.pulseAnim - 0.035);
          }
          ctx.shadowBlur = 0;
          continue;
        }

        // HAWKING STAR RENDERING (Star slowly eaten from inside by an expanding black hole over 2 minutes!)
        if (p.specialType === 'hawking_star') {
          const prog = p.hawkingProgress || 0; // 0 to 1
          const outerR = p.size * (1 - prog * 0.18);
          const innerBhR = outerR * (0.28 + prog * 0.65); // Slowly expands from 0.28 to 0.93 of star size!

          // 1. Outer solar envelope & corona
          const coronaR = outerR * 1.65;
          const hawkGrad = ctx.createRadialGradient(x, y, innerBhR, x, y, coronaR);
          hawkGrad.addColorStop(0, '#fbbf24');
          hawkGrad.addColorStop(0.5, '#f59e0b');
          hawkGrad.addColorStop(0.85, '#ea580c');
          hawkGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = hawkGrad;
          ctx.beginPath();
          ctx.arc(x, y, coronaR, 0, Math.PI * 2);
          ctx.fill();

          // Solar body shell
          ctx.beginPath();
          ctx.arc(x, y, outerR, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#fbbf24';
          ctx.fill();

          // 2. Internal expanding Black Hole Singularity at its core
          const innerTremor = (Math.random() - 0.5) * 0.5;
          ctx.beginPath();
          ctx.arc(x, y, innerBhR + 1.2 + innerTremor, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.9)';
          ctx.lineWidth = 1.4;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00f2fe';
          ctx.stroke();

          // Black hole core inside the star
          ctx.beginPath();
          ctx.arc(x, y, innerBhR, 0, Math.PI * 2);
          ctx.fillStyle = '#000000';
          ctx.fill();

          // Coronal micro-flares
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(now * 0.001);
          for (let s = 0; s < 4; s++) {
            const ang = (Math.PI / 2) * s;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * outerR, Math.sin(ang) * outerR);
            ctx.lineTo(Math.cos(ang) * (outerR + 4), Math.sin(ang) * (outerR + 4));
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
          ctx.restore();

          if (p.pulseAnim && p.pulseAnim > 0) {
            ctx.beginPath();
            ctx.arc(x, y, outerR * (1 + (1 - p.pulseAnim) * 1.0), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 242, 254, ${p.pulseAnim * 0.9})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
            p.pulseAnim = Math.max(0, p.pulseAnim - 0.035);
          }
          ctx.shadowBlur = 0;
          continue;
        }

        if (p.specialType === 'sun') {
          // Sun: White-hot core + golden yellow/orange corona flares
          const coronaR = p.size * 1.8 + Math.sin(now * 0.02) * 1.2;
          const sunGrad = ctx.createRadialGradient(x, y, p.size * 0.3, x, y, coronaR);
          sunGrad.addColorStop(0, '#ffffff');
          sunGrad.addColorStop(0.3, '#fef08a');
          sunGrad.addColorStop(0.7, '#f59e0b');
          sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(x, y, coronaR, 0, Math.PI * 2);
          ctx.fill();

          // White-hot core
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#fffbeb';
          ctx.shadowBlur = 16;
          ctx.shadowColor = '#fbbf24';
          ctx.fill();

          // Rotating coronal spikes
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(now * 0.001);
          for (let s = 0; s < 4; s++) {
            const ang = (Math.PI / 2) * s;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * (p.size * 0.8), Math.sin(ang) * (p.size * 0.8));
            ctx.lineTo(Math.cos(ang) * (p.size * 1.6), Math.sin(ang) * (p.size * 1.6));
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
          ctx.restore();

          if (p.pulseAnim && p.pulseAnim > 0) {
            ctx.beginPath();
            ctx.arc(x, y, p.size * (1 + (1 - p.pulseAnim) * 1.2), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(251, 191, 36, ${p.pulseAnim * 0.85})`;
            ctx.lineWidth = 2.0;
            ctx.stroke();
            p.pulseAnim = Math.max(0, p.pulseAnim - 0.04);
          }
          ctx.shadowBlur = 0;
          continue;
        }

        if (p.specialType === 'blackhole') {
          // BLACK HOLE RENDERING WITH ACCRETION DISK VARIATIONS:
          // - hasYellowDisk: Bright incandescent yellowish accretion disk
          // - absorbedSunsForDisk === 1: Minor amber accretion disk
          // - absorbedSunsForDisk >= 2: Full-on incandescent multi-layered golden-orange accretion disk!
          // - Default: Subtle cyan accretion disk
          const diskR = p.size * 1.65;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-now * 0.002);

          if (p.hasYellowDisk) {
            // Incandescent yellowish accretion disk
            ctx.beginPath();
            ctx.arc(0, 0, diskR * 1.25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
            ctx.lineWidth = 2.4;
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#fbbf24';
            ctx.stroke();

            // Bright Doppler relativistic crescent
            ctx.beginPath();
            ctx.arc(0, 0, diskR * 1.1, 0, Math.PI * 0.9);
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.95)';
            ctx.lineWidth = 2.2;
            ctx.stroke();
          } else if (p.absorbedSunsForDisk && p.absorbedSunsForDisk >= 2) {
            // Full-on accretion disk (absorbed 2+ Suns): Multi-layer golden-amber relativistic disk!
            ctx.beginPath();
            ctx.arc(0, 0, diskR * 1.35, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.65)';
            ctx.lineWidth = 3.0;
            ctx.shadowBlur = 16;
            ctx.shadowColor = '#f97316';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, diskR * 1.15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
            ctx.lineWidth = 2.2;
            ctx.stroke();

            // Luminous photon ring crescent
            ctx.beginPath();
            ctx.arc(0, 0, diskR * 0.98, -0.3, Math.PI * 0.8);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.0;
            ctx.stroke();
          } else if (p.absorbedSunsForDisk === 1) {
            // Minor accretion disk (absorbed 1 Sun): Fine warm amber ring & photon crescent
            ctx.beginPath();
            ctx.arc(0, 0, diskR * 1.15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(251, 146, 60, 0.55)';
            ctx.lineWidth = 1.6;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fb923c';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, diskR, 0, Math.PI * 0.7);
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          } else {
            // Default subtle cyan accretion disk
            ctx.beginPath();
            ctx.arc(0, 0, diskR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f2fe';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, diskR - 1.5, 0, Math.PI * 0.6);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.restore();

          // Vibrating event horizon rim
          const tremor = (Math.random() - 0.5) * 0.6;
          ctx.beginPath();
          ctx.arc(x, y, p.size + 1.2 + tremor, 0, Math.PI * 2);
          ctx.strokeStyle = p.hasYellowDisk || (p.absorbedSunsForDisk || 0) > 0 ? 'rgba(251, 191, 36, 0.9)' : 'rgba(0, 242, 254, 0.85)';
          ctx.lineWidth = 1.4;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.hasYellowDisk || (p.absorbedSunsForDisk || 0) > 0 ? '#fbbf24' : '#00f2fe';
          ctx.stroke();

          // Black singularity core
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#000000';
          ctx.fill();

          if (p.pulseAnim && p.pulseAnim > 0) {
            ctx.beginPath();
            ctx.arc(x, y, p.size * (1 + (1 - p.pulseAnim) * 1.4), 0, Math.PI * 2);
            ctx.strokeStyle = p.hasYellowDisk ? `rgba(251, 191, 36, ${p.pulseAnim * 0.9})` : `rgba(0, 242, 254, ${p.pulseAnim * 0.9})`;
            ctx.lineWidth = 2.2;
            ctx.stroke();
            p.pulseAnim = Math.max(0, p.pulseAnim - 0.035);
          }
          ctx.shadowBlur = 0;
          continue;
        }

        // C. STANDARD COMET RENDERING
        const tailAngle = p.angle + vortexRotation - p.speed * 4;
        const tailX = dynamicCenterX + p.perturbX + Math.cos(tailAngle) * (p.radius + 1.2) * 1.2;
        const tailY = dynamicCenterY + p.perturbY + Math.sin(tailAngle) * (p.radius + 0.7) * 0.7;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.4 * vortexRevealAlpha;
        ctx.lineWidth = Math.max(0.8, p.size * 0.8);
        ctx.stroke();
        ctx.globalAlpha = vortexRevealAlpha;

        // Comet Head
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. ESCAPING RETRO SPACESHIPS (scaled by time scale)
      for (let s = spaceships.length - 1; s >= 0; s--) {
        const ship = spaceships[s];
        if (!ship.isHeld) {
          ship.x += ship.vx * ts;
          ship.y += ship.vy * ts;

          if (
            activeBounceLine &&
            ship.x >= activeBounceLine.left &&
            ship.x <= activeBounceLine.right &&
            ship.y + 6 >= activeBounceLine.y &&
            ship.y - 6 <= activeBounceLine.y + 20 &&
            ship.vy > 0
          ) {
            ship.y = activeBounceLine.y - 6;
            ship.vy = -Math.max(1.2, Math.abs(ship.vy) * 0.92);
            ship.vx *= 0.96;
            ship.angle = Math.atan2(ship.vy, ship.vx);
            triggerLineBounce(ship.x, activeBounceLine.y, 6);
          }
        }

        // Ion exhaust trail
        ship.exhaust.push({
          x: ship.x - Math.cos(ship.angle) * 5,
          y: ship.y - Math.sin(ship.angle) * 5,
          alpha: 0.85,
          size: 1.8,
        });

        for (let e = ship.exhaust.length - 1; e >= 0; e--) {
          const ex = ship.exhaust[e];
          ctx.beginPath();
          ctx.arc(ex.x, ex.y, ex.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 242, 254, ${ex.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00f2fe';
          ctx.fill();
          ctx.shadowBlur = 0;

          ex.alpha *= Math.pow(0.88, ts);
          ex.size *= Math.pow(0.95, ts);
          if (ex.alpha < 0.03) {
            ship.exhaust.splice(e, 1);
          }
        }

        // Draw Spaceship shuttle rotated towards ship.angle
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);

        // Shuttle hull
        ctx.beginPath();
        ctx.moveTo(7, 0); // nose cone
        ctx.lineTo(-4, -4); // left wing
        ctx.lineTo(-2, 0); // rear engine mount
        ctx.lineTo(-4, 4); // right wing
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();

        // Cockpit window
        ctx.beginPath();
        ctx.arc(1, 0, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.fill();

        // Ion thruster flare
        ctx.beginPath();
        ctx.moveTo(-2, -1.5);
        ctx.lineTo(-7 - Math.random() * 3, 0);
        ctx.lineTo(-2, 1.5);
        ctx.closePath();
        ctx.fillStyle = '#38bdf8';
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0;

        // Discard when fully out of view beyond the entire page
        if (
          ship.x < -120 ||
          ship.x > width + 120 ||
          ship.y < -120 ||
          ship.y > height + 120
        ) {
          spaceships.splice(s, 1);
        }
      }

      // 5. GRAVITATIONAL HOLD & STASIS LOCK INDICATOR
      if (
        (heldBody && heldBody.isHeld && heldBody.flingPosX !== undefined && heldBody.flingPosY !== undefined) ||
        (heldSpaceship && heldSpaceship.isHeld)
      ) {
        const hx = heldBody ? (heldBody.flingPosX as number) : (heldSpaceship as Spaceship).x;
        const hy = heldBody ? (heldBody.flingPosY as number) : (heldSpaceship as Spaceship).y;
        const lockR = heldBody ? Math.max(22, heldBody.size * 2.2) : 24;

        ctx.globalAlpha = 1.0;
        // Stasis field halo
        ctx.beginPath();
        ctx.arc(hx, hy, lockR + Math.sin(now * 0.008) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(hx - lockR - 4, hy);
        ctx.lineTo(hx - lockR + 4, hy);
        ctx.moveTo(hx + lockR - 4, hy);
        ctx.lineTo(hx + lockR + 4, hy);
        ctx.moveTo(hx, hy - lockR - 4);
        ctx.lineTo(hx, hy - lockR + 4);
        ctx.moveTo(hx, hy + lockR - 4);
        ctx.lineTo(hx, hy + lockR + 4);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Instructional HUD text
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(0, 242, 254, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('STASIS LOCKED • SWIPE TO FLING', hx, hy - lockR - 8);
        ctx.textAlign = 'left';
        ctx.globalAlpha = vortexRevealAlpha;
      } else if (isPointerDown && (holdCandidate || holdCandidateShip) && !heldBody && !heldSpaceship) {
        // Charging 0.2s circle ring around candidate
        const progress = Math.min(1, (now - holdCandidateStartTime) / 200);
        let cx = 0;
        let cy = 0;
        let candSize = 10;
        if (holdCandidate) {
          const candPos = getCometPos(holdCandidate, dynamicCenterX, dynamicCenterY);
          cx = candPos.x;
          cy = candPos.y;
          candSize = holdCandidate.size;
        } else if (holdCandidateShip) {
          cx = holdCandidateShip.x;
          cy = holdCandidateShip.y;
          candSize = 8;
        }

        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(16, candSize * 2.0), -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * progress);
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.4 + progress * 0.5})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.globalAlpha = vortexRevealAlpha;
      }

      // 6. BREAKUP DEBRIS SHARDS (Gravitational Shredding Particles, scaled by time scale)
      for (let i = breakupDebris.length - 1; i >= 0; i--) {
        const d = breakupDebris[i];
        d.x += d.vx * ts;
        d.y += d.vy * ts;
        if (
          activeBounceLine &&
          d.x >= activeBounceLine.left &&
          d.x <= activeBounceLine.right &&
          d.y + d.size >= activeBounceLine.y &&
          d.y - d.size <= activeBounceLine.y + 18 &&
          d.vy > 0
        ) {
          d.y = activeBounceLine.y - d.size;
          d.vy = -Math.max(0.8, Math.abs(d.vy) * 0.9);
          d.vx *= 0.96;
          triggerLineBounce(d.x, activeBounceLine.y, d.size);
        }
        d.alpha *= Math.pow(0.92, ts);
        d.size *= Math.pow(0.96, ts);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = d.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (d.alpha < 0.02 || Math.hypot(d.x - dynamicCenterX, d.y - dynamicCenterY) < EVENT_HORIZON_R) {
          breakupDebris.splice(i, 1);
        }
      }

      // 5. BIRTH AURAS
      for (let i = birthAuras.length - 1; i >= 0; i--) {
        const a = birthAuras[i];
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 242, 254, ${a.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f2fe';
        ctx.stroke();
        ctx.shadowBlur = 0;

        a.radius += 1.8 * ts;
        a.alpha *= Math.pow(0.9, ts);
        if (a.alpha < 0.02) {
          birthAuras.splice(i, 1);
        }
      }

      // 6. SLIGHT CONTINUOUS SWIPE TRAIL (real-time fade independent of timeScale, always crisp at any scroll depth)
      ctx.globalAlpha = 1.0;
      const TRAIL_LIFETIME_MS = 270;
      for (let i = trail.length - 1; i >= 0; i--) {
        if (now - trail[i].createdAt > TRAIL_LIFETIME_MS) {
          trail.splice(i, 1);
        }
      }
      if (trail.length > 0) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < trail.length; i++) {
          const prevPt = trail[i - 1];
          const curPt = trail[i];
          if (curPt.strokeId !== prevPt.strokeId) continue;
          const segDist = Math.hypot(curPt.x - prevPt.x, curPt.y - prevPt.y);
          if (segDist > 90) continue;

          const ageRatio = Math.max(0, 1 - (now - curPt.createdAt) / TRAIL_LIFETIME_MS);
          const alpha = curPt.maxAlpha * Math.pow(ageRatio, 1.5);
          if (alpha <= 0.01) continue;

          ctx.beginPath();
          ctx.moveTo(prevPt.x, prevPt.y);
          ctx.lineTo(curPt.x, curPt.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = Math.max(0.8, curPt.size * ageRatio);
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(0, 242, 254, 0.65)';
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = vortexRevealAlpha;

      // 7. CLICK SHOCKWAVES WITH PROCEDURAL VARIATIONS
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color;
        ctx.globalAlpha = rip.alpha * vortexRevealAlpha;
        ctx.lineWidth = rip.lineWidth;
        ctx.shadowBlur = 8;
        ctx.shadowColor = rip.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = vortexRevealAlpha;

        rip.radius += rip.speed * ts;
        rip.alpha *= Math.pow(0.93, ts);
        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 7B. BLUE BOUNCE LINE SPRING RIPPLES
      for (let i = lineRipples.length - 1; i >= 0; i--) {
        const lr = lineRipples[i];
        ctx.save();
        ctx.globalAlpha = lr.alpha;
        ctx.strokeStyle = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f2fe';

        // Horizontal energy flare spreading along the blue bounce line
        ctx.beginPath();
        ctx.moveTo(lr.x - lr.radius * 1.15, lr.y);
        ctx.lineTo(lr.x + lr.radius * 1.15, lr.y);
        ctx.lineWidth = lr.lineWidth * 1.1;
        ctx.stroke();

        // Upward shockwave arc off the bounce line
        ctx.beginPath();
        ctx.arc(lr.x, lr.y, lr.radius * 0.72, Math.PI, Math.PI * 2);
        ctx.lineWidth = Math.max(0.8, lr.lineWidth * 0.8);
        ctx.stroke();
        ctx.restore();

        lr.radius += lr.speed * ts;
        lr.alpha *= Math.pow(0.91, ts);
        if (lr.alpha < 0.02 || lr.radius > lr.maxRadius) {
          lineRipples.splice(i, 1);
        }
      }

      // 8. CLICK MICRO-SPARKS
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = sp.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        sp.x += sp.vx * ts;
        sp.y += sp.vy * ts;
        if (
          activeBounceLine &&
          sp.x >= activeBounceLine.left &&
          sp.x <= activeBounceLine.right &&
          sp.y + sp.size >= activeBounceLine.y &&
          sp.y - sp.size <= activeBounceLine.y + 18 &&
          sp.vy > 0
        ) {
          sp.y = activeBounceLine.y - sp.size;
          sp.vy = -Math.max(0.8, Math.abs(sp.vy) * 0.9);
          sp.vx *= 0.96;
          triggerLineBounce(sp.x, activeBounceLine.y, sp.size);
        }
        sp.vx *= Math.pow(0.95, ts);
        sp.vy *= Math.pow(0.95, ts);
        sp.alpha *= Math.pow(0.93, ts);

        if (sp.alpha < 0.02) {
          sparks.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animFrameId = requestAnimationFrame(drawVortex);
    };

    drawVortex();

    // Scroll reveal: Vortex expands to fullest over first 100vh below default entrance and remains full
    const handleScroll = () => {
      targetVortexProgress = getScrollRevealProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp, { capture: true });
      window.removeEventListener('pointercancel', handlePointerCancel, { capture: true });
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', resetAllInputState);
      window.removeEventListener('contextmenu', resetAllInputState);
      document.removeEventListener('visibilitychange', handleVisibilityReset);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', handleTouchEnd, { capture: true });
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // Request iOS 13+ DeviceOrientation permission if required
  const requestGyroscopePermission = async () => {
    try {
      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof DeviceOrientationEventAny?.requestPermission === 'function') {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          setGyroActive(true);
          setHasGyroHardware(true);
        }
      } else {
        // Non-iOS browsers usually support deviceorientation directly
        setGyroActive(true);
        setHasGyroHardware(true);
      }
    } catch {}
  };

  const getSfxVolumeIconClass = () => {
    if (sfxVolume === 0) return 'fa-solid fa-volume-xmark text-[9px] text-zinc-500';
    if (sfxVolume < 0.5) return 'fa-solid fa-volume-low text-[9px] text-white';
    return 'fa-solid fa-volume-high text-[9px] text-white';
  };

  // Dual Volume Track Drag Handler
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeDotRef = useRef<'music' | 'sfx' | null>(null);

  const startDragging = (which: 'music' | 'sfx', pointerId: number, target: Element) => {
    activeDotRef.current = which;
    try {
      target.setPointerCapture(pointerId);
    } catch {}
  };

  const handleTrackPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    // If direct thumb target wasn't already caught, determine which dot is closer
    const distToMusic = Math.abs(clickRatio - musicVolume);
    const distToSfx = Math.abs(clickRatio - sfxVolume);

    const chosen: 'music' | 'sfx' = distToMusic <= distToSfx ? 'music' : 'sfx';
    activeDotRef.current = chosen;

    if (chosen === 'music') {
      updateMusicVolume(clickRatio);
    } else {
      updateSfxVolume(clickRatio);
      playClickChime(sfxVolumeRef.current);
    }

    try {
      trackRef.current.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleTrackPointerMove = (e: React.PointerEvent) => {
    if (!activeDotRef.current || !trackRef.current) return;
    e.stopPropagation();
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (activeDotRef.current === 'music') {
      updateMusicVolume(ratio);
    } else {
      updateSfxVolume(ratio);
    }
  };

  const handleTrackPointerUp = (e: React.PointerEvent) => {
    if (!activeDotRef.current) return;
    e.stopPropagation();
    if (activeDotRef.current === 'sfx') {
      playClickChime(sfxVolumeRef.current);
    }
    activeDotRef.current = null;
    try {
      if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
        trackRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  return (
    <div className="relative min-h-[380vh] bg-black selection:bg-cyan-400 selection:text-black">
      {/* Interactive Cyan Vortex Background Canvas (Fixed to viewport) */}
      <canvas id="vortex-canvas" ref={canvasRef} />

      {/* FIXED TOP-LEFT SLEEK GAMING / MECHANICS GUIDE BUTTON */}
      <div data-ui-control="true" className="fixed top-3.5 left-3.5 min-[460px]:top-5 min-[460px]:left-5 sm:top-6 sm:left-6 z-50 flex items-center gap-2.5">
        <button
          onClick={() => {
            setIsGuideOpen(true);
            setHasOpenedGuide(true);
            requestGyroscopePermission();
          }}
          className="glass-panel glass-panel-hover group px-2.5 h-9 sm:px-3 sm:h-10 rounded-xl flex items-center gap-2 text-zinc-300 hover:text-white transition-all duration-300 active:scale-95 shadow-lg border border-white/10 hover:border-white/25 cursor-pointer"
          title="Interactive Vortex Mechanics Guide & Mobile Sensor Controls"
          aria-label="Open Interactive Vortex Controls Guide"
        >
          {/* Gaming Icon on left */}
          <i className="fa-solid fa-gamepad text-cyan-400 group-hover:text-cyan-300 text-sm transition-transform duration-300 group-hover:scale-110" />
          {/* Blue Dot near Controller icon: pulses only on initial load/reload until Mechanics menu is opened once */}
          <span
            className={`w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe] ${
              !hasOpenedGuide ? 'animate-pulse' : ''
            }`}
            title={hasOpenedGuide ? 'Mechanics Guide' : 'Interactive Mechanics Guide'}
          />
        </button>
      </div>

      {/* FIXED TOP-CENTER MAJESTIC SLIM TIME CONTROL */}
      <div
        data-ui-control="true"
        className="fixed top-[58px] min-[460px]:top-3.5 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none touch-none pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Numeric Speed Display Placed Centered Above Time Controller */}
        <div className="text-[10.5px] font-mono tracking-wider font-semibold text-cyan-300 pointer-events-none drop-shadow-[0_0_8px_rgba(0,242,254,0.7)] leading-none mb-1 text-center">
          {timeScale.toFixed(2)}×
        </div>

        {/* Controller Row: Micro-Control [<] | Track with Dropped Middle Line & Knob | Micro-Control [>] */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Micro-Control Slower "<" (-0.01x) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepTimeScale(-0.01);
            }}
            className="w-5 h-5 rounded-md bg-black/80 hover:bg-zinc-800 border border-white/15 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 flex items-center justify-center text-[10px] font-bold font-mono transition-all active:scale-90 cursor-pointer shadow-sm shrink-0"
            title="Slow down time by 0.01×"
            aria-label="Decrease time speed by 0.01x"
          >
            &lt;
          </button>

          <div
            ref={timeTrackRef}
            data-ui-control="true"
            role="slider"
            aria-valuemin={0.01}
            aria-valuemax={10}
            aria-valuenow={timeScale}
            onPointerDown={handleTimePointerDown}
            onPointerMove={handleTimePointerMove}
            onPointerUp={handleTimePointerUp}
            onPointerCancel={handleTimePointerUp}
            className="relative w-36 min-[460px]:w-36 sm:w-48 h-8 flex flex-col items-center justify-center cursor-pointer group px-2"
            title={`Temporal Speed: ${timeScale.toFixed(2)}× (Center mark = 1.00×)`}
            aria-label="Cosmic Time Warp Slider"
          >
            {/* Horizontal Track Groove dropped down just an itty-bitty bit */}
            <div className="w-full h-[2.5px] bg-white/20 rounded-full group-hover:bg-white/30 transition-colors shadow-inner relative translate-y-[3px]">
              {/* Active illuminated track segment connecting to center 50% */}
              <div
                style={{
                  left: `${Math.min(50, timePos * 100)}%`,
                  width: `${Math.abs(timePos - 0.5) * 100}%`,
                }}
                className="absolute top-0 h-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]"
              />
            </div>

            {/* Center Reference Line dropped down with the middle track */}
            <div
              className="absolute top-[21px] left-1/2 -translate-x-1/2 w-[1.5px] h-[5px] bg-cyan-400/80 shadow-[0_0_4px_#00f2fe] rounded-full pointer-events-none"
              title="1.00× Normal Time"
            />

            {/* Majestic Sleek Dot Thumb dropped down with the track line */}
            <div
              style={{ left: `${timePos * 100}%` }}
              className="absolute top-1/2 translate-y-[-1px] -translate-x-1/2 cursor-grab active:cursor-grabbing hover:scale-125 active:scale-95 transition-transform z-20 pointer-events-none"
            >
              <div className="relative w-3.5 h-3.5 rounded-full bg-cyan-300 border border-white shadow-[0_0_8px_#00f2fe,0_0_14px_rgba(0,242,254,0.8)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-black/90" />
              </div>
            </div>
          </div>

          {/* Micro-Control Faster ">" (+0.01x) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              stepTimeScale(0.01);
            }}
            className="w-5 h-5 rounded-md bg-black/80 hover:bg-zinc-800 border border-white/15 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 flex items-center justify-center text-[10px] font-bold font-mono transition-all active:scale-90 cursor-pointer shadow-sm shrink-0"
            title="Speed up time by 0.01×"
            aria-label="Increase time speed by 0.01x"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* INTERACTIVE MECHANICS GUIDE MODAL */}
      {isGuideOpen && (
        <div
          data-ui-control="true"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setIsGuideOpen(false)}
        >
          <div
            data-ui-control="true"
            className="w-full max-w-md bg-[#09090b]/95 border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-left text-zinc-200 relative overflow-hidden max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black border border-white/15 flex items-center justify-center text-cyan-400">
                  <i className="fa-solid fa-gamepad text-xs" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white">Vortex Mechanics Guide</h3>
                </div>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close mechanics guide"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Content: Desktop & Mobile Interactions */}
            <div className="space-y-4 text-xs">
              {/* Desktop Section */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-display text-[10px]" />
                  <span>Desktop & Spatial Physics</span>
                </div>
                <div className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed pl-1">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Temporal Controller:</strong> Slide the sleek dot across the header to bend time from 0.01× to 10×. Use the micro-steppers (&lt; / &gt;) for fine 0.01 increments.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">1 Tap = 1 Comet:</strong> Clicking anywhere immediately births a new comet into orbit at your exact coordinate (holding down in empty space streams comets).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">0.2s Hold to Stasis & Fling:</strong> Hold any celestial body for 0.2 seconds to freeze its orbital motion. It remains anchored while pressed and only flings depending on release swipe velocity.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">The Nebula:</strong> An ancient expanse of luminous stellar dust resting along the lower cosmic horizon, disturbed only when celestial wanderers drift through.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Hyper-Velocity Comets:</strong> Phantom streaks cutting through the dark from beyond the horizon, defying orbital bounds without 4D intervention.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Hawking Stars & Accretions:</strong> Singularities feasting within stellar hearts, shrouded in accretion halos. waiting for the void, one sun upon another sun.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Ctrl + Scroll / Trackpad Pinch:</strong> Dynamically compresses or expands the violent black hole event horizon.</span>
                  </div>
                </div>
              </div>

              {/* Mobile & Gyroscope Section */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-mobile-screen text-[10px]" />
                    <span>Mobile & Sensor Gestures</span>
                  </span>
                  {hasGyroHardware && (
                    <span className="text-[9px] text-cyan-300 font-mono bg-cyan-950/70 border border-cyan-800/60 rounded px-1.5 py-0.2">
                      Gyroscope Active
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed pl-1">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Tap Anywhere:</strong> 1 Tap instantly births 1 comet into orbit; hold down in empty space to stream comets.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">0.2s Touch Stasis:</strong> Press and hold on any comet or celestial anomaly for 0.2s to freeze it in place. It will only fling depending on your release swipe velocity.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Phone Gyroscope Tilt:</strong> Physically tilting your phone dynamically steers the 3D perspective and vortex parallax in real time.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Two-Finger Pinch:</strong> Pinch inward or outward to scale the central black hole event horizon and tidal shred radius.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                    <span><strong className="text-white">Swipe & Intercept:</strong> Fling comets across orbits and deflect incoming hyper-speed comets.</span>
                  </div>
                </div>
              </div>

              {/* Vinyl Disc & Track Navigator Section */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-compact-disc text-[10px]" />
                  <span>Vinyl Disc &amp; Track Navigator</span>
                </div>
                <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center gap-3 text-[11px]">
                  <div className="relative w-8 h-8 rounded-full p-[2px] flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/70 animate-spin-slow pointer-events-none" />
                    <div className="w-full h-full rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center animate-spin-disc">
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe]" />
                      </div>
                    </div>
                  </div>
                  <div className="text-zinc-300 leading-relaxed">
                    Click the spinning <strong className="text-white">Vinyl Disc</strong> on the Music Bar to open or close the <strong className="text-cyan-300">Track Navigator</strong> (seek timeline &amp; ±5s controls).
                  </div>
                </div>
              </div>

              {/* Dual Volume Slider Legend */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-sliders text-[10px]" />
                  <span>Dual Volume Controller</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm shrink-0" />
                    <div>
                      <div className="text-white font-medium">White Dot</div>
                      <div className="text-[10px] text-zinc-400">Background Music</div>
                    </div>
                  </div>
                  <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-black border border-white/80 ring-1 ring-black shrink-0" />
                    <div>
                      <div className="text-white font-medium">Black Dot</div>
                      <div className="text-[10px] text-zinc-400">Interactive SFX</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile sensor permission trigger button (essential for iOS Safari) */}
            <div className="pt-2">
              <button
                onClick={requestGyroscopePermission}
                className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-zinc-900 border border-white/20 hover:border-white/40 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <i className="fa-solid fa-compass" />
                <span>Calibrate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED TOP-RIGHT SLEEK & MINIMALIST SOCIAL BUTTONS */}
      <div data-ui-control="true" className="fixed top-3.5 right-3.5 min-[460px]:top-5 min-[460px]:right-5 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
        {/* Discord Icon Button */}
        <a
          href="https://discord.gg/JvsWrsCDyK"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel glass-panel-hover group w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
          title="Discord"
        >
          <svg className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c2.63-27.42-4.52-51.11-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.87,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.06-12.74,11.44-12.74S96.23,45.91,96.1,53,91.08,65.69,84.69,65.69Z" />
          </svg>
        </a>

        {/* Telegram Icon Button */}
        <a
          href="https://t.me/+lRrfWfKoDmljMDU0"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel glass-panel-hover group w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
          title="Telegram"
        >
          <svg className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.04 9.61c-.15.68-.56.85-1.13.53l-3.13-2.31-1.51 1.45c-.17.17-.31.31-.64.31l.22-3.18 5.79-5.23c.25-.22-.05-.34-.39-.12l-7.16 4.51-3.08-.96c-.67-.21-.68-.67.14-.99l12.04-4.64c.56-.21 1.05.13.89.82z" />
          </svg>
        </a>
      </div>

      {/* ZONE 0: NEW SMALL EMPTY SPACE 1 SWIPE ABOVE DEFAULT ENTRANCE */}
      <div className="h-[38vh] flex flex-col items-center justify-center select-none pointer-events-none relative z-10">
        <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-500 font-medium select-none">
          Yo, Go Down! 
        </span>
      </div>

      {/* ZONE 1: INITIAL SCROLL BUFFER (VORTEX REACHES ITS FULLEST HERE) */}
      <div className="h-[120vh] pointer-events-none" />

      {/* ZONE 2: COMMUNITY SECTIONS BELOW FULLEST VORTEX */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
        <div className="flex flex-row items-center justify-center gap-4 md:gap-6 flex-wrap">
          
          {/* SECTION 1: DISCORD COMMUNITY CARD (SMALL, SLEEK & COMPACT) */}
          <a
            href="https://discord.gg/JvsWrsCDyK"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[190px] md:w-[200px] bg-[#08080a]/90 hover:bg-[#101015] border border-white/10 hover:border-white/25 rounded-2xl p-3.5 transition-all duration-300 flex flex-col items-center text-center shadow-2xl group cursor-pointer active:scale-95"
            title="Join Agartha on Discord"
          >
            {/* Server Avatar in circular form with a thick black lining */}
            <div className="relative mb-2">
              <div className="w-11 h-11 rounded-full bg-black border-[3px] border-black ring-1 ring-white/15 overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105">
                <img
                  src={discordData.avatarUrl}
                  alt={discordData.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Server name and active member count in a circular rectangle */}
            <div className="flex items-center justify-center gap-2 w-full">
              <span className="text-xs font-semibold text-zinc-100 tracking-wide group-hover:text-white transition-colors">
                {discordData.name}
              </span>

              {/* Circular rectangle badge enclosing active member count with blackhole dot */}
              <div className="rounded-full px-2 py-0.5 bg-black border border-white/15 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-inner shrink-0">
                {/* Miniature Black Hole dot: Pure pitch-black core with pulsating cyan energy outline */}
                <span className="relative flex items-center justify-center w-2 h-2 shrink-0" title="Singularity Energy">
                  <span className="absolute inset-0 rounded-full border border-cyan-400 bg-black animate-blackhole-pulse" />
                  <span className="relative w-1 h-1 rounded-full bg-black z-10" />
                </span>
                <span>{discordData.onlineCount} Online</span>
              </div>
            </div>
          </a>

          {/* SECTION 2: TELEGRAM COMMUNITY CARD WITH BLURRED GROUP PFP */}
          <a
            href="https://t.me/+lRrfWfKoDmljMDU0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[150px] md:w-[160px] bg-[#08080a]/90 hover:bg-[#101015] border border-white/10 hover:border-white/25 rounded-2xl px-3.5 py-3 transition-all duration-300 flex items-center justify-between gap-2 shadow-2xl group cursor-pointer active:scale-95"
            title="Join RSR on Telegram"
          >
            <div className="flex items-center gap-2">
              {/* Group's PFP, heavily blurred */}
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-black ring-1 ring-white/15 relative bg-black flex items-center justify-center shadow-md">
                <img
                  src={discordData.avatarUrl}
                  alt="RSR Group PFP"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full filter blur-[2px] scale-135 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors tracking-wide">
                RSR
              </span>
            </div>

            {/* Circular rectangle badge with identical miniature black hole dot */}
            <div className="rounded-full px-2 py-0.5 bg-black border border-white/15 text-[9px] font-mono text-zinc-300 flex items-center gap-1.5 shadow-inner shrink-0">
              <span className="relative flex items-center justify-center w-2 h-2 shrink-0" title="Singularity Energy">
                <span className="absolute inset-0 rounded-full border border-cyan-400 bg-black animate-blackhole-pulse" />
                <span className="relative w-1 h-1 rounded-full bg-black z-10" />
              </span>
              <span>1 sub</span>
            </div>
          </a>

        </div>
      </section>

      {/* ZONE 3: POST-CARDS SCROLL EXPANSE (CARDS SCROLL COMPLETELY OUT OF VIEW, LEAVING ONLY THE FULL VORTEX) */}
      <div className="h-[120vh] pointer-events-none" />

      {/* NEBULA EXPANSE BELOW MUSIC BAR */}
      <div className="h-8 sm:h-16 pointer-events-none" />

      {/* ABSOLUTE BOTTOM SOUNDCLOUD SECTION (SEPARATED BELOW NEBULA BY BLUE BOUNCE LINE, OPEN BY DEFAULT) */}
      <div
        ref={soundCloudSectionRef}
        data-ui-control="true"
        className={`relative z-30 w-full pt-0 flex flex-col items-center ${
          isSoundCloudOpen ? 'pb-2.5 gap-1.5 sm:pb-4 sm:gap-2' : 'pb-1.5 gap-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thin Futuristic Blue Bounce Line Separating Nebula From SoundCloud Section */}
        <div ref={bounceLineRef} className="w-full max-w-3xl px-4 pointer-events-none">
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_12px_rgba(0,242,254,0.6)]" />
        </div>

        {/* Hide button when open; ONLY the custom down arrow symbol flush touching the blue line when hidden */}
        <button
          onClick={toggleSoundCloudSource}
          className={
            isSoundCloudOpen
              ? 'px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md hover:bg-zinc-900/90 border border-white/12 hover:border-cyan-400/50 text-zinc-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer text-[10px] font-mono group shadow-md'
              : '-mt-[1px] px-2.5 py-0.5 rounded-b-md bg-black/80 hover:bg-zinc-900/90 border border-t-0 border-cyan-400/40 hover:border-cyan-400/75 text-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center cursor-pointer group shadow-md'
          }
          title={isSoundCloudOpen ? 'Hide SoundCloud source & stop audio' : 'Reopen SoundCloud source & resume audio'}
          aria-label={isSoundCloudOpen ? 'Hide SoundCloud source & stop audio' : 'Reopen SoundCloud source & resume audio'}
        >
          <span className="text-[11px] leading-none text-cyan-400 group-hover:scale-115 transition-transform">
            ⧪
          </span>
          {isSoundCloudOpen && (
            <span className="text-[9.5px] text-zinc-300 group-hover:text-white">
              Hide
            </span>
          )}
        </button>

        {isSoundCloudOpen && (
          <div className="w-full flex flex-col items-center gap-1.5 animate-drop-in">
            {/* Official SoundCloud Embed: Exact 100% Wide x 80px Tall, dark-themed & unclipped */}
            <div className="relative w-full h-[80px] overflow-hidden bg-gradient-to-b from-cyan-950/15 via-black/45 to-black/80">
              <iframe
                width="100%"
                height="80"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                title="RSR Audio Source — SoundCloud"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/147393687&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&show_artwork=false&buying=false&download=false&sharing=false&show_playcount=false&visual=false"
                style={{ filter: 'invert(1) hue-rotate(180deg) contrast(1.45) brightness(1.22)' }}
                className="w-full h-[80px] block opacity-95 mix-blend-screen"
              />

              {/* Left mask: hides ONLY SoundCloud's circular play button while keeping track title starting cleanly */}
              <div className="pointer-events-none absolute top-0 left-0 w-[56px] h-[54px] bg-gradient-to-r from-black via-black via-75% to-transparent" />

              {/* Top-right wordmark mask: hides ONLY the "SOUNDCLOUD" text while keeping the SoundCloud cloud logo visible beside it */}
              <div className="pointer-events-none absolute top-0 right-0 w-[90px] h-[26px] bg-gradient-to-l from-black via-black via-94% to-transparent" />

              {/* Subtle lower-right anti-clip fade below the top-right SoundCloud logo */}
              <div className="pointer-events-none absolute bottom-0 right-0 w-4 h-[46px] bg-gradient-to-l from-black to-transparent" />

              {/* Bottom mask: cleanly hides waveform visualizer & privacy/cookie policy strip */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34px] bg-gradient-to-t from-black via-black via-72% to-transparent" />

              {/* Subtle cyan futuristic accent hairline along bottom of track info */}
              <div className="pointer-events-none absolute inset-x-6 bottom-[18px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
            </div>

            {/* Clean SoundCloud Link right below embed */}
            <a
              href="https://soundcloud.com/haris-adnan/metal-gear-rising-revengeance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] font-mono text-cyan-400/90 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5 group cursor-pointer px-3 text-center"
            >
              <i className="fa-brands fa-soundcloud text-cyan-400/80 text-xs shrink-0 group-hover:scale-110 transition-transform" />
              <span className="underline decoration-cyan-500/35 hover:decoration-cyan-400 break-all">
                https://soundcloud.com/haris-adnan/metal-gear-rising-revengeance
              </span>
            </a>

            {/* Alien Subtext below SoundCloud embed & link */}
            <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-300 select-all py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-xl bg-black/70 border border-white/10 break-all shadow-inner mx-3 text-center">
              !¡ꖎᒷᔑᓭᒷ リ𝙹 ᓵ𝙹!¡ǁ∷╎⊣⍑ℸ!
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM MUSIC PLAYER BAR WITH DUAL VOLUME CONTROLLER (Stays above Nebula & renders Go up a bit text right above itself at page bottom) */}
      <div
        ref={musicBarColRef}
        data-ui-control="true"
        style={{ bottom: `${musicBarBottom}px` }}
        className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 max-w-[calc(100vw-20px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottom Cue Text right above Music Bar (and Track Navigator) when scrolled to bottom */}
        <div
          className={`pointer-events-none select-none text-center transition-opacity duration-200 ${
            showBottomCue ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 font-medium select-none whitespace-nowrap">
            Go up a bit! IT Awaits You...
          </span>
        </div>

        <div
          ref={musicBarPillRef}
          className="glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-2xl border border-white/10 max-w-full"
        >
          {/* Circular Vinyl Disc: Slow-spinning outer outline + violent pulsating center when playing */}
          <button
            id="vinyl-disc-btn"
            onClick={toggleDiscMenu}
            className="relative w-8 h-8 rounded-full p-[2px] flex-shrink-0 cursor-pointer group active:scale-95 transition-transform"
            title="Click to toggle track progress & info"
            aria-label="Toggle track progress & audio details"
          >
            {/* Outer outline spinning slowly */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/60 group-hover:border-cyan-300 animate-spin-slow pointer-events-none" />

            {/* Inner Vinyl Disc Body */}
            <div
              id="vinyl-disc"
              className={`w-full h-full rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center animate-spin-disc ${
                !isPlaying ? 'paused-disc' : ''
              }`}
            >
              {/* Spindle ring */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-600 flex items-center justify-center relative">
                {/* Center Core: Pulsates violently depending on whether the music is playing */}
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPlaying
                      ? 'bg-cyan-400 animate-violent-pulse'
                      : 'bg-cyan-500/50'
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Controls: Play/Pause */}
          <button
            id="play-pause-btn"
            onClick={toggleAudio}
            className="w-8 h-8 rounded-xl glass-panel glass-panel-hover text-zinc-200 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shrink-0"
            aria-label="Play or Pause audio"
          >
            <i
              id="play-icon"
              className={isPlaying ? 'fa-solid fa-pause text-[11px]' : 'fa-solid fa-play text-[11px] translate-x-[1px]'}
            />
          </button>

          {/* DUAL VOLUME SLIDER CONTROLLER:
              - Left: Pure black circular icon with slim white border for interactive sound effects
              - Track: single track with two independent draggable thumb dots:
                * Dot A (Interactive SFX): Pure black dot with black border (controls interactive sounds; completely mutes SFX when far left)
                * Dot B (Music Volume): Completely white dot (controls background music; completely mutes music when far left)
              - Right: completely white "Music" icon */}
          <div className="flex items-center gap-2 sm:gap-2.5 border-l border-white/10 pl-2.5 sm:pl-3">
            {/* SFX Volume Indicator Badge on Left: Pure Black with slim white border */}
            <div
              className="w-5 h-5 rounded-full bg-black border border-white/80 flex items-center justify-center shrink-0 shadow-sm"
              title={`Interactive SFX Volume: ${Math.round(sfxVolume * 100)}%`}
            >
              <i className={getSfxVolumeIconClass()} />
            </div>

            {/* Single Track with 2 Independent Draggable Dots */}
            <div
              ref={trackRef}
              data-ui-control="true"
              onPointerDown={handleTrackPointerDown}
              onPointerMove={handleTrackPointerMove}
              onPointerUp={handleTrackPointerUp}
              onPointerCancel={handleTrackPointerUp}
              className="relative w-20 sm:w-24 h-5 flex items-center cursor-pointer select-none touch-none"
              title="Dual Volume Slider: Black dot = Interactive SFX, White dot = Music"
            >
              {/* Background Groove Track */}
              <div className="w-full h-[3px] bg-white/20 rounded-full" />

              {/* Dot A: Interactive SFX Thumb (Pure Black Dot with Black Border & subtle contrast ring) */}
              <div
                style={{ left: `${sfxVolume * 100}%` }}
                onPointerDown={(e) => {
                  if (e.pointerType === 'mouse' && e.button !== 0) return;
                  e.stopPropagation();
                  if (trackRef.current) {
                    startDragging('sfx', e.pointerId, trackRef.current);
                  }
                }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-black border border-black ring-[1px] ring-white/70 shadow-[0_0_4px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing hover:scale-120 transition-transform z-10"
                title={`Interactive SFX Volume: ${Math.round(sfxVolume * 100)}% (Drag completely left to mute)`}
              />

              {/* Dot B: Music Volume Thumb (Completely White Dot) */}
              <div
                style={{ left: `${musicVolume * 100}%` }}
                onPointerDown={(e) => {
                  if (e.pointerType === 'mouse' && e.button !== 0) return;
                  e.stopPropagation();
                  if (trackRef.current) {
                    startDragging('music', e.pointerId, trackRef.current);
                  }
                }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.85)] border border-white cursor-grab active:cursor-grabbing hover:scale-120 transition-transform z-10"
                title={`Music Volume: ${Math.round(musicVolume * 100)}% (Drag completely left to mute)`}
              />
            </div>

            {/* White Music Icon on Right */}
            <span title={`Music Volume: ${Math.round(musicVolume * 100)}%`} className="shrink-0 flex items-center">
              <i className="fa-solid fa-music text-white text-[11px]" />
            </span>
          </div>
        </div>

        {/* DROPDOWN PROGRESS BAR & DETAILS (Underneath Music Bar, opened by clicking Disc) */}
        {isDiscMenuOpen && (
          <div
            ref={trackNavRef}
            className="w-full max-w-[320px] sm:max-w-[350px] max-h-[75vh] overflow-y-auto glass-panel rounded-xl py-2 px-3 border border-white/15 shadow-2xl animate-drop-in flex flex-col gap-1.5"
          >
            {/* Row 1: Time Display */}
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 px-0.5 leading-none">
              <span className="text-zinc-200">{formatTime(trackCurrentTime)}</span>
              <span className="text-[8px] tracking-wider text-zinc-500 font-sans">bIpIvchu&apos;jaj</span>
              <span className="text-zinc-200">{formatTime(trackDuration)}</span>
            </div>

            {/* Row 2: "<" (Back 5s) | Straight Slim Progress Bar with Outline | ">" (Forward 5s) */}
            <div className="flex items-center gap-1.5">
              {/* Back 5s ("<") */}
              <button
                onClick={() => skipTime(-5)}
                className="w-4 h-4 rounded-md bg-black/70 hover:bg-zinc-800 border border-white/15 hover:border-white/35 text-zinc-300 hover:text-white flex items-center justify-center text-[9px] font-bold font-mono transition-all active:scale-90 cursor-pointer shrink-0"
                title="Go back 5 seconds"
                aria-label="Go back 5 seconds"
              >
                &lt;
              </button>

              {/* Slim Progress Bar: Straight line with a slim outline */}
              <div
                ref={progressBarRef}
                data-ui-control="true"
                onPointerDown={handleProgressPointerDown}
                onPointerMove={handleProgressPointerMove}
                onPointerUp={handleProgressPointerUp}
                onPointerCancel={handleProgressPointerUp}
                className="relative flex-1 h-3 flex items-center cursor-pointer select-none touch-none group"
                title={`Seek: ${formatTime(trackCurrentTime)} / ${formatTime(trackDuration)}`}
              >
                {/* Straight line with slim outline */}
                <div className="w-full h-[3px] bg-black/80 border border-white/30 group-hover:border-white/60 rounded-full overflow-hidden relative shadow-inner">
                  {/* Filled progress bar */}
                  <div
                    style={{
                      width: `${trackDuration > 0 ? (trackCurrentTime / trackDuration) * 100 : 0}%`,
                    }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-white transition-[width] duration-75"
                  />
                </div>

                {/* Scrubbing Thumb Indicator on the line */}
                <div
                  style={{
                    left: `${trackDuration > 0 ? (trackCurrentTime / trackDuration) * 100 : 0}%`,
                  }}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] border border-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                />
              </div>

              {/* Forward 5s (">") */}
              <button
                onClick={() => skipTime(5)}
                className="w-4 h-4 rounded-md bg-black/70 hover:bg-zinc-800 border border-white/15 hover:border-white/35 text-zinc-300 hover:text-white flex items-center justify-center text-[9px] font-bold font-mono transition-all active:scale-90 cursor-pointer shrink-0"
                title="Go forward 5 seconds"
                aria-label="Go forward 5 seconds"
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Status message display for audio errors or interaction cues */}
        <div
          id="audio-status"
          className={`text-[10px] text-zinc-500 text-center font-mono tracking-wider transition-opacity duration-300 ${
            statusMessage ? 'block' : 'hidden'
          }`}
        >
          {statusMessage}
        </div>
      </div>

      {/* AUDIO ELEMENT */}
      <audio
        id="bg-audio"
        ref={audioRef}
        src={AUDIO_SOURCES[0]}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (!isSeekingRef.current && audioRef.current) {
            setTrackCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setTrackDuration(audioRef.current.duration);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current && audioRef.current.duration) {
            setTrackDuration(audioRef.current.duration);
          }
        }}
        onError={tryFallbackAudio}
      />
    </div>
  );
}
