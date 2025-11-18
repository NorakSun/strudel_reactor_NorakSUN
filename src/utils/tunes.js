export const melody_tune = `
setcps(120/60/4)
samples('github:algorave-dave/samples')
note("[c4 e4 g4 c5]*4").sound("supersaw")
.postgain(1 * volume)
.room(0.5)
.lpf(800)
`;

export const dance_monkey_tune = `
setcps(98/60/4)  // tempo ~98 BPM like original
samples('github:algorave-dave/samples')

// Melody (main vocal riff simplified)
const melody_lines = [
  "{g4 g4 f#4 e4 d4 b3 g4 g4 f#4 e4 d4 b3}%4"
]

// Bassline (syncs with melody)
const bass_lines = [
  "[g2 g2 g2 g2 a2 a2 a2 a2]*4"
]

// Chords / harmony
const harmony_lines = [
  "{b3 d4 g4 b4}%4",
  "{b3 e4 g4 b4}%4"
]

// Drum patterns (mimics original groove)
const drum_kick = ["x ~ ~ ~ x ~ x ~"]    // slightly syncopated
const drum_snare = ["~ ~ x ~ ~ ~ x ~"]  // backbeat
const drum_hat = ["x . x x . x x x"]    // swing pattern

// Stack everything together
stack(
  // Melody
  note(pick(melody_lines,0))
    .sound("supersaw")
    .postgain(0.6 * volume)
    .room(0.5)
    .lpf(1200),

  // Bass
  note(pick(bass_lines,0))
    .sound("saw")
    .postgain(0.4 * volume)
    .hpf(80),

  // Harmony / counter-melody
  note(pick(harmony_lines,0))
    .sound("saw")
    .postgain(0.5 * volume)
    .delay("0.5")
    .delayfeedback(0.3),

  // Drums
  s("tech:1").postgain(0.8 * volume).struct(pick(drum_kick,0)),
  s("sn").postgain(0.6 * volume).struct(pick(drum_snare,0)).bank("RolandTR808"),
  s("sh").postgain(0.3 * volume).struct(pick(drum_hat,0)).bank("RolandTR808")
)
`;

export const soulful_tune = `
setcps(90/60/4)  // slower tempo
samples('github:algorave-dave/samples')

// Define bass, arpeggio, drums
const basslines = [
  "[[c2, eb2, g2]!8 [f2, g2]!8 [eb2, c2]!4]"
]

const arpeggiator1 = [
  "{c3 eb3 g3 c4 eb4 g4}%8"
]

const drum_structure = ["~", "x ~ x ~", "{x ~ x ~!3 x ~ x ~!2}"]

// Stack all together to play
stack(
  // Bass
  note(pick(basslines, 0))
    .sound("supersaw")      // ensure this is valid
    .postgain(0.8 * volume)
    .room(0.4)
    .lpf(400),

  // Arpeggio
  note(pick(arpeggiator1, 0))
    .sound("supersaw")
    .lpf(600)
    .adsr("0.2:0.5:1:0.2")
    .room(0.5)
    .lpenv(4.0)
    .postgain(0.6 * volume),

  // Drums
  s("tech:1").postgain(0.8 * volume).struct(pick(drum_structure,0)),
  s("sh").struct("[x ~ x ~]!2").postgain(0.3 * volume)
    .bank("RolandTR808").speed(0.6).jux(rev).room(0.3).gain(0.5 * volume)
)
`;

export const original_beat = `
setcps(85/60/4)  // slower, very relaxing tempo
samples('github:algorave-dave/samples')

// Ultra-soft bassline
const basslines = [
  "[[a2]!8 [c3]!8 [e3]!8 [g2]!8]"
]

// Gentle lead melody (triangle wave)
const melody_lines = [
  "{c4 e4 g4 a4 g4 e4 f4 d4}%8"
]

// Slow, airy arpeggiated chords
const chord_lines = [
  "{c4 e4 g4 c5}%4",
  "{f4 a4 c5 f5}%4",
  "{g4 b4 d5 g5}%4"
]

// Minimal, soft drum patterns
const drum_kick = ["x ~ ~ ~ ~ ~ ~ ~"]    
const drum_snare = ["~ ~ x ~ ~ ~ ~ ~"]   
const drum_hat = ["x ~ ~ ~ x ~ ~ ~"]     

stack(
  // Bass
  note(pick(basslines,0))
    .sound("triangle")      
    .postgain(0.15 * volume)   // softer
    .room(0.35)
    .lpf(500)
    .adsr("0.1:0.5:0.5:0.2"), // smooth envelope

  // Melody
  note(pick(melody_lines,0))
    .sound("triangle")
    .postgain(0.25 * volume)
    .room(0.45)
    .lpf(700)
    .adsr("0.1:0.6:0.5:0.3"), // softer attack and longer sustain

  // Chords / arpeggio
  note(pick(chord_lines,0))
    .sound("triangle")
    .postgain(0.2 * volume)
    .room(0.45)
    .delay("0.35")
    .delayfeedback(0.3),

  // Drums
  s("tech:1").postgain(0.1 * volume).struct(pick(drum_kick,0)),
  s("sn").postgain(0.1 * volume).struct(pick(drum_snare,0)).bank("RolandTR808"),
  s("sh").postgain(0.05 * volume).struct(pick(drum_hat,0)).bank("RolandTR808")
)
`;




