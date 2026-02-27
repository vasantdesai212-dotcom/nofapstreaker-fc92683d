/**
 * Synthesize a subtle engine-rev sound using the Web Audio API.
 * No external files required — pure oscillator-based synthesis.
 */
let hasPlayed = false;

export const playEngineRev = () => {
  // Only play once per page load to avoid spamming
  if (hasPlayed) return;
  hasPlayed = true;

  try {
    const ctx = new AudioContext();

    // Master gain (overall volume — subtle)
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.12, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.4);
    master.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 1.6);
    master.connect(ctx.destination);

    // Low rumble oscillator (engine base tone)
    const rumble = ctx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(60, ctx.currentTime);
    rumble.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.6);
    rumble.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);
    rumble.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 1.6);

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.5, ctx.currentTime);
    rumble.connect(rumbleGain).connect(master);

    // Mid-range harmonic (engine character)
    const mid = ctx.createOscillator();
    mid.type = 'square';
    mid.frequency.setValueAtTime(120, ctx.currentTime);
    mid.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.6);
    mid.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.2);
    mid.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 1.6);

    const midGain = ctx.createGain();
    midGain.gain.setValueAtTime(0.15, ctx.currentTime);
    mid.connect(midGain).connect(master);

    // Distortion for grit
    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 10) * x / (Math.PI + 10 * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '2x';

    // Re-route rumble through distortion
    rumble.disconnect();
    rumble.connect(distortion).connect(rumbleGain);

    // Start and stop
    const now = ctx.currentTime;
    rumble.start(now);
    mid.start(now);
    rumble.stop(now + 1.7);
    mid.stop(now + 1.7);

    // Cleanup
    setTimeout(() => ctx.close(), 2000);
  } catch {
    // Silently fail if Web Audio not supported
  }
};

/** Reset so the sound can play again (e.g. on new cycle). */
export const resetEngineRev = () => {
  hasPlayed = false;
};
