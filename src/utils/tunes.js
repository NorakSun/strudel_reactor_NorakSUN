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
    "{b3 d4 g4 b4}%4",
    "{b3 e4 g4 b4}%4"
  ], "<0 1>/2"))
    .sound("saw")
    .postgain(0.4 * volume)
    .delay("0.5")
    .delayfeedback(0.3)
)
`;

export const stranger_tune = `
setcps(140/60/4)
samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

const gain_patterns = ["2", "{0.75 2.5}*4"]

const drum_structure = ["~", "x*4", "{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16"]

const basslines = [
  "[[eb1, eb2]!16 [f2, f1]!16 [g2, g1]!16 [f2, f1]!8 [bb2, bb1]!8]/8"
]

const arpeggiator1 = [
  "{d4 bb3 eb3 d3 bb2 eb2}%16"
]

bassline:
note(pick(basslines, 0))
.sound("supersaw")
.postgain(2 * volume)
.room(0.6)
.lpf(700)

main_arp: 
note(pick(arpeggiator1, 0))
.sound("supersaw")
.lpf(300)
.adsr("0:0:.5:.1")
.room(0.6)
.lpenv(3.3)
.postgain(1.5 * volume)

drums:
stack(
  s("tech:5").postgain(6 * volume).struct(pick(drum_structure,0)),
  s("sh").struct("[x!3 ~!2 x!10 ~]").postgain(0.5 * volume)
    .bank("RolandTR808").speed(0.8).jux(rev).room(0.2).gain(0.6 * volume)
)
`;
