import Actor from "./actor.js";

const Actions = {
  stand: { size: 1 },
  standup: { size: 15, next: "stand" },
  startrun: { size: 12, previous: ["stand", "walk1", "walk2"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run1: { size: 5, previous: ["startrun", "run4"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run2: { size: 5, previous: ["run1"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run3: { size: 5, previous: ["run2"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  run4: { size: 5, previous: ["run3"], next: "runstop", keys: ["left+fire", "right+fire"], x: 2 },
  runstop: { size: 12, previous: ["startrun", "run1", "run2", "run3", "run4"], next: "stand", keys: ["left+fire", "right+fire"], x: 1 },
  turn: { size: 10, previous: ["stand"], next: "stand", keys: ["left", "right"], turn: true },
  walk1: { size: 6, previous: ["stand", "walk2", "startrun", "run1"], next: "stand", keys: ["left", "right"], x: 2 },
  walk2: { size: 6, previous: ["walk1"], next: "stand", keys: ["left", "right"], x: 2 },
  // jumpup,
  // land,
  // jump: { size: 20, previous: ["stand"], next: "stand", keys: ["left", "right"], x: 8, dx: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0] },
  // runjump: { size: 20, previous: ["run1", "run2"], next: "runstop", keys: ["left", "right"], x: 12,
  // crouch,
  // roll,
}

export default class Conrad extends Actor {
  constructor(scene, position, offset, input) {
    super(scene, position, offset, Actions, input);
    this.perform("standup");
  }
}
Conrad.Actions = Actions;