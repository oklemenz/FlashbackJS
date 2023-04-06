import Actor from "./actor.js";

// 1 unit = 8 px, align 2 units = 16 px
const Actions = {
  standup: { size: 15, rate: 15, next: "stand" },
  stand: { size: 1, rate: 15 },
  turn: { size: 10, rate: 15, turn: true, previous: ["stand"], next: "stand", input: ["left", "right"] },
  startrun: { size: 12, rate: 20, previous: ["stand", "walk1", "walk2"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, px: [0, 0, 0, 4, 1, 3, 1, 1, 3, 1, 4, 3], align: false },
  run1: { size: 5, rate: 25, previous: ["run4"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, align: false },
  run2: { size: 5, rate: 25, previous: ["run1"], next: "preparestop", input: ["left", "right"], x: 2, align: false },
  run3: { size: 5, rate: 25, previous: ["run2"], next: "preparestop", input: ["left", "right"], x: 2, align: false },
  run4: { size: 5, rate: 25, previous: ["startrun", "run3"], next: "preparestop", input: ["left", "right"], x: 2, align: false },
  runturn: { size: 14, rate: 15, turn: true, previous: ["run1", "run2", "run3", "run4"], next: "run4", input: ["left", "right"], px: [8, 3, 7, 11, 3, 1, -3, 0, 1, 0, -5, -7, -8, -5], align: false },
  runwalk: { size: 11, rate: 25, previous: ["run4"], next: "walk1", input: ["left", "right"], x: 1, px: [7, 3, 3, 2, 2, 1, 1, 2, 2, 3, 1] },
  preparestop: { size: 3, rate: 20, previous: ["startrun"], next: "runstop", px: [3, 4, 4] },
  runstop: { size: 12, rate: 20, previous: ["preparestop"], next: "stand", x: 1, px: [-7, 1, 6, 3, 2, 4, 3, 1, 3, 0, 1, -1] },
  walk1: { size: 6, rate: 15, previous: ["stand", "walk2", "run1", "runwalk"], next: "stand", input: ["left", "right"], x: 2 },
  walk2: { size: 6, rate: 15, previous: ["walk1"], next: "stand", input: ["left", "right"], x: 2 },
  crouch: { size: 7, rate: 20, previous: ["stand", "crouch"], next: "rise", input: ["down"] },
  rise: { size: 7, rate: 20, previous: ["crouch"], next: "stand", input: ["!down"] },
  jumpup: { size: 18, rate: 15, previous: ["stand"], next: "jumpupland", input: ["up"], py: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -5, -5, -5, -5, -5], align: false },
  jumpupland: { size: 10, rate: 15, previous: ["stand"], next: "stand", py: [10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0] },
  standjump: { size: 20, rate: 20, previous: ["stand"], next: "stand", input: ["up+fire", "up+fire"], x: 8, px: [1, 0, 1, 1, 1, 1, 4, 3, 7, 9, 9, 9, 3, 5, 2, 4, 0, 2, 1, 1] },
  runjump: { size: 19, rate: 25, previous: ["run1", "run2", "run3", "run4"], next: "jumpland", input: ["up+left", "up+right"], x: 12, px: [7, 1, 6, 9, 6, 4, 2, 3, 4, 6, 5, 5, 5, 4, 4, 8, 10, 3, 4], py: [0, 0, 0, 0, -1, -4, -3, -2, -2, -1, -1, 1, 1, 2, 2, 3, 4, 1, 0], align: false },
  jumpland: { size: 5, rate: 25, previous: ["runjump"], next: "stand", x: 1, px: [7, 0, 2, 0, 2] },
  jumplandrun: { size: 9, rate: 25, previous: ["runjump"], next: "run4", input: ["left", "right"], x: 1, px: [11, 0, 0, 0, 6, 2, 2, 2, 4], ox: 5 },

  // standaim - stand
  // standdrawn - standaim
  // turndrawn - standdrawn (turn)
  // turnaim - standaim (turn)
  // walkdrawn - standdrawn
  // crouchaim - standaim
  // crouchdrawn - standdrawn
  // crouchaimturn - crouchaim (turn)
  // crouchdrawnturn - crouchdrawn (turn)
  // riseaim - crouchaim
  // risedrawn - crouchdrawn
  // roll, rollstart, rollend - crouchdrown - crouchaim
  // standshoot - standaim
  // crouchshoot - crouchaim
  // runroll - run
};

export default class Conrad extends Actor {
  constructor(scene, position, input, turn, log) {
    super(scene, position, { x: 8, y: 43 }, Actions, input, turn, log);
    this.perform("standup");
  }
}

Conrad.Actions = Actions;