const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const OUT_DIR = path.join(__dirname, '..', 'assets', 'sounds');

function note(freq, durationMs, { fadeInMs = 5, fadeOutMs = 30, gain = 0.5 } = {}) {
  const n = Math.round((durationMs / 1000) * SAMPLE_RATE);
  const fadeInN = Math.round((fadeInMs / 1000) * SAMPLE_RATE);
  const fadeOutN = Math.round((fadeOutMs / 1000) * SAMPLE_RATE);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let env = 1;
    if (i < fadeInN) env = i / fadeInN;
    else if (i > n - fadeOutN) env = Math.max(0, (n - i) / fadeOutN);
    samples[i] = Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE) * gain * env;
  }
  return samples;
}

function silence(durationMs) {
  return new Float32Array(Math.round((durationMs / 1000) * SAMPLE_RATE));
}

function concat(...parts) {
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

function toWavBuffer(samples) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  return buffer;
}

const SOUNDS = {
  tap: () => note(820, 70, { gain: 0.35, fadeOutMs: 40 }),
  add: () => concat(note(660, 70, { gain: 0.4 }), silence(15), note(880, 110, { gain: 0.45, fadeOutMs: 60 })),
  complete: () =>
    concat(
      note(523.25, 90, { gain: 0.4 }),
      silence(10),
      note(659.25, 90, { gain: 0.42 }),
      silence(10),
      note(783.99, 160, { gain: 0.45, fadeOutMs: 90 })
    ),
  celebration: () =>
    concat(
      note(523.25, 80, { gain: 0.38 }),
      silence(8),
      note(659.25, 80, { gain: 0.4 }),
      silence(8),
      note(783.99, 80, { gain: 0.42 }),
      silence(8),
      note(1046.5, 220, { gain: 0.46, fadeOutMs: 130 })
    ),
  delete: () => concat(note(520, 90, { gain: 0.32 }), silence(10), note(320, 130, { gain: 0.3, fadeOutMs: 90 })),
  forgotten: () => concat(note(440, 140, { gain: 0.3 }), silence(20), note(293.66, 220, { gain: 0.28, fadeOutMs: 150 })),
};

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

for (const [name, build] of Object.entries(SOUNDS)) {
  const wav = toWavBuffer(build());
  const outPath = path.join(OUT_DIR, `${name}.wav`);
  fs.writeFileSync(outPath, wav);
  console.log(`wrote ${outPath} (${wav.length} bytes)`);
}
