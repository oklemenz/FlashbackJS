import Actor from "./actor.js";

// 1 unit = 8 px
const Actions = {
  turn: { size: 10, rate: 15, turn: true, previous: ["stand"], next: "stand", keys: ["left", "right"] },
  stand: { size: 1, rate: 15 },
  standup: { size: 15, rate: 15, next: "stand" },
  startrun: { size: 12, rate: 20, previous: ["stand", "walk1", "walk2"], next: "preparestop", keys: ["left+fire", "right+fire"], x: 2, px: [0, 0, 0, 4, 1, 3, 1, 1, 3, 1, 4, 3], align: false },
  preparestop: { size: 3, rate: 20, previous: ["startrun"], next: "runstop", px: [3, 4, 4] },
  runstop: { size: 12, rate: 20, previous: ["preparestop", "run1", "run2", "run3", "run4"], next: "stand", x: 1, px: [-7, 1, 6, 3, 2, 4, 3, 1, 3, 0, 1, -1] },
  run1: { size: 5, rate: 25, previous: ["startrun", "run4"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run2: { size: 5, rate: 25, previous: ["run1"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run3: { size: 5, rate: 25, previous: ["run2"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run4: { size: 5, rate: 25, previous: ["run3"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  walk1: { size: 6, rate: 15, previous: ["stand", "walk2", "startrun", "run1"], next: "stand", keys: ["left", "right"], x: 2 },
  walk2: { size: 6, rate: 15, previous: ["walk1"], next: "stand", keys: ["left", "right"], x: 2 },
  // jump: { size: 20, previous: ["stand"], next: "stand", keys: ["left", "right"], x: 8 },
  // runjump: { size: 20, previous: ["run1", "run2", "run3", "run4"], next: "runstop", keys: ["left", "right"], x: 12,
  // jumpup,
  // land,
  // crouch,
  // aim,
  // roll,
  // rollAim,
  // rollDrawn,
  // draw gun
  // shoot
};

export default class Conrad extends Actor {
  constructor(scene, position, offset, input) {
    super(scene, position, offset, Actions, input);
    this.perform("standup");
  }
}

Conrad.Actions = Actions;