export const melody_tune = `
setcps(120/60/4)
samples('github:algorave-dave/samples')
note("[c4 e4 g4 c5]*4").sound("supersaw")
.postgain(1 * volume)
.room(0.5)
.lpf(800)
`;

export const dance_monkey_tune = `
setcps(50/60/4)
samples('github:algorave-dave/samples')

stack(
  note(pick([
    "{g4 g4 f#4 e4 d4 b3}%4",
    "{g4 g4 f#4 e4 d4 b3}%4"
  ], "<0 1>/1"))
    .sound("supersaw")
    .postgain(0.5 * volume)
    .room(0.5)
    .lpf(1200),

  note("[g2 g2 g2 g2]*4")
    .sound("saw")
    .postgain(0.3 * volume)
    .hpf(80),

  note(pick([
    "{b3 d4 g4 b2}%4",
    "{b3 e4 g4 b4}%4"
  ], "<0 1>/2"))
    .sound("saw")
    .postgain(0.4 * volume)
    .delay("0.5")
    .delayfeedback(0.3)
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


