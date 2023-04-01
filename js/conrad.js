import Actor from "./actor.js";

// 1 unit = 8 px
const Actions = {
  standup: { size: 15, rate: 15, next: "stand" },
  stand: { size: 1, rate: 15 },
  turn: { size: 10, rate: 15, turn: true, previous: ["stand"], next: "stand", input: ["left", "right"] },
  walk1: { size: 6, rate: 15, previous: ["stand", "walk2", "startrun", "run1"], next: "stand", input: ["left", "right"], x: 2 },
  walk2: { size: 6, rate: 15, previous: ["walk1"], next: "stand", input: ["left", "right"], x: 2 },
  startrun: { size: 12, rate: 20, previous: ["stand", "walk1", "walk2"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, px: [0, 0, 0, 4, 1, 3, 1, 1, 3, 1, 4, 3], align: false },
  preparestop: { size: 3, rate: 20, previous: ["startrun"], next: "runstop", px: [3, 4, 4] },
  runstop: { size: 12, rate: 20, previous: ["preparestop", "run1", "run2", "run3", "run4"], next: "stand", x: 1, px: [-7, 1, 6, 3, 2, 4, 3, 1, 3, 0, 1, -1] },
  run1: { size: 5, rate: 25, previous: ["run4"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, align: false },
  run2: { size: 5, rate: 25, previous: ["run1"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, align: false },
  run3: { size: 5, rate: 25, previous: ["run2"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, align: false },
  run4: { size: 5, rate: 25, previous: ["startrun", "run3"], next: "preparestop", input: ["left+fire", "right+fire"], x: 2, align: false },
  crouch: { size: 7, rate: 20, previous: ["stand", "crouch"], next: "rise", input: ["down"] },
  rise: { size: 7, rate: 20, previous: ["crouch"], next: "stand", input: ["!down"] },
  jumpup: { size: 18, rate: 15, previous: ["stand"], next: "jumpupland", input: ["up"], py: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -5, -5, -5, -5, -5], align: false },
  jumpupland: { size: 10, rate: 15, previous: ["stand"], next: "stand", py: [10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0] },
  standjump: { size: 20, rate: 20, previous: ["stand"], next: "stand", input: ["up+fire", "up+fire"], x: 8, px: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  // runjump: { size: 20, rate: 25, previous: ["run1", "run2", "run3", "run4"], next: "preparestop", input: ["up+left", "up+right"], x: 12,
  // standaim - stand
  // standdrawn - standaim
  // turndrawn - standdrawn
  // turnaim - standaim
  // walkdrawn - standdrawn
  // crouchaim - standaim
  // crouchdrawn - standdrawn
  // crouchaimturn - crouchaim
  // crouchdrawnturn - crouchdrawn
  // riseaim - crouchaim
  // risedrawn - crouchdrawn
  // roll, rollstart, rollend - crouchdrown - crouchaim
  // standshoot - standaim
  // crouchshoot - crouchaim
  // runturn - run (turn)
};

export default class Conrad extends Actor {
  constructor(scene, position, offset, input) {
    super(scene, position, offset, Actions, input);
    this.perform("standup");
  }
}

Conrad.Actions = Actions;