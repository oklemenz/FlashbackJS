import Actor from "./actor.js";
import Actions from "./conrad.json" assert { type: "json" };

export default class Conrad extends Actor {
  constructor(scene, atlas, position, keys, turn, log) {
    super(scene, atlas, position, { x: 8, y: 43 }, Actions, keys, turn, log);
    this.fire = scene.add.sprite(-29, 0, "fire").setOrigin(0, 0);
    this.fire.visible = false;
    this.add(this.fire);
    this.perform("standup");
  }

  standfire(animation, frame) {
    this.fire.y = -37;
    this.fire.visible = frame.index === 1;
  }

  crouchfire(animation, frame) {
    this.fire.y = -26;
    this.fire.visible = frame.index === 1;
  }
}

Conrad.Actions = Actions;