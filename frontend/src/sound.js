// Sounds for Equilab. Every task has its own sound.
// If a recording exists at public/sounds/<name>.mp3 it is played; otherwise a built-in generated sound is used.
let ctx;
function audio() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
const rand = (a, b) => a + Math.random() * (b - a);
const times = (count, gap, fn) => { for (let i = 0; i < count; i++) fn(i * gap, i); };

export function tone(freq, dur = 0.4, type = "sine", start = 0, vol = 0.25, slideTo) {
  const c = audio(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime + start;
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur);
}
export function noise({ dur = 1, start = 0, type = "lowpass", freq = 900, vol = 0.25, attack = 0.02 }) {
  const c = audio(), n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + start;
  s.buffer = b; f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + attack);
  g.gain.linearRampToValueAtTime(0, t + dur);
  s.connect(f); f.connect(g); g.connect(c.destination);
  s.start(t);
}
const splash = (start = 0, dur = 0.8) => noise({ dur, start, freq: 1800, vol: 0.35, attack: 0.01 });
const bubble = (t, low, high) => { const f = rand(low, high); tone(f, 0.09, "sine", t, 0.12, f * 1.9); };

export const success = () => { tone(523, 0.4, "sine", 0); tone(659, 0.4, "sine", 0.4); tone(784, 0.9, "sine", 0.8); };
export const wrong = () => tone(220, 1, "sawtooth", 0, 0.2);

const sounds = {
  click: () => { tone(220, 0.15, "triangle", 0, 0.25); tone(140, 0.3, "sine", 0.03, 0.2); },
  glass: () => { tone(2400, 0.9, "sine", 0, 0.18); tone(3600, 0.6, "sine", 0.01, 0.1); tone(1500, 0.7, "sine", 0.02, 0.1); noise({ dur: 0.05, type: "highpass", freq: 4000, vol: 0.2, attack: 0.002 }); },
  metal: () => { tone(1800, 1.2, "triangle", 0, 0.18); tone(2700, 0.8, "triangle", 0.01, 0.1); tone(4300, 0.5, "sine", 0.01, 0.06); },
  wood: () => times(2, 0.25, (t) => { tone(320, 0.14, "triangle", t, 0.3); tone(520, 0.08, "square", t, 0.06); }),
  pour: () => { noise({ dur: 3, type: "bandpass", freq: 2200, vol: 0.28, attack: 0.3 }); noise({ dur: 3, freq: 600, vol: 0.12, attack: 0.3 }); times(14, 0.2, (t) => bubble(0.3 + t, 300, 700)); },
  oil: () => { noise({ dur: 3, freq: 500, vol: 0.28, attack: 0.4 }); times(7, 0.4, (t) => bubble(0.4 + t, 110, 220)); },
  dry: () => times(45, 0.06, (t) => noise({ dur: 0.05, start: t, type: "highpass", freq: rand(2500, 5000), vol: 0.14, attack: 0.004 })),
  stir: () => times(5, 0.55, (t) => { noise({ dur: 0.5, start: t, type: "bandpass", freq: 1200, vol: 0.2, attack: 0.15 }); tone(rand(2200, 2800), 0.12, "sine", t + 0.25, 0.07); }),
  drip: () => { noise({ dur: 2.5, type: "bandpass", freq: 3500, vol: 0.05, attack: 0.3 }); times(6, 0.5, (t) => bubble(0.2 + t, 900, 1100)); },
  magnet: () => times(8, 0.3, (t) => { tone(rand(1300, 1900), 0.07, "square", t, 0.1); tone(rand(3000, 4000), 0.2, "sine", t + 0.02, 0.05); }),
  tick: () => times(8, 0.3, (t) => tone(1500, 0.08, "square", t, 0.12)),
  rustle: () => times(12, 0.15, (t) => noise({ dur: rand(0.05, 0.14), start: t, type: "bandpass", freq: rand(3000, 6000), vol: 0.14, attack: 0.01 })),
  snip: () => times(3, 0.5, (t) => { tone(2200, 0.06, "square", t, 0.15); tone(1600, 0.08, "square", t + 0.08, 0.15); }),
  timer: () => times(4, 0.6, (t) => times(2, 0.15, (u) => tone(1100, 0.1, "square", t + u, 0.1))),
  buzz: () => { sounds.click(); tone(440, 3, "square", 0.2, 0.15); },
  low: () => tone(300, 3, "sine", 0, 0.3),
  high: () => tone(900, 3, "sine", 0, 0.3),
  float: () => { splash(0); times(4, 0.5, (t) => bubble(0.9 + t, 250, 450)); },
  sink: () => { splash(0); tone(300, 1.6, "sine", 0.7, 0.3, 60); times(5, 0.25, (t) => bubble(0.8 + t, 400, 900)); },
};
export const soundNames = Object.keys(sounds);

export function playSim(kind) {
  const synth = sounds[kind] || sounds.click;
  let used = false;
  const fallback = () => { if (!used) { used = true; synth(); } };
  try {
    const a = new Audio(`${import.meta.env.BASE_URL}sounds/${kind}.mp3`);
    a.onerror = fallback;
    a.play().catch(fallback);
  } catch { fallback(); }
}
