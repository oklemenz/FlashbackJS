import { Conrad, Actions } from "./conrad.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 320,
  height: 200,
  scene: {
    init: () => {
    },
    preload,
    create,
    update,
  }
});

const keys = {
  left: Phaser.Input.Keyboard.KeyCodes.LEFT,
  right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  up: Phaser.Input.Keyboard.KeyCodes.UP,
  down: Phaser.Input.Keyboard.KeyCodes.DOWN,
  fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
  action: Phaser.Input.Keyboard.KeyCodes.ENTER,
};

let conrad;
function create() {
  setup(this);
  conrad = new Conrad(this, keys,160, 100);
  this.add.existing(conrad);
}

function update() {
  conrad?.update();
}

function setup(scene) {
  bindKeys(scene);
  createAnimations(scene);
}

function bindKeys(scene) {
  for (const key in keys) {
    keys[key] = scene.input.keyboard.addKey(key);
  }
}

function createAnimations(scene) {
  for (const key in Actions) {
    scene.anims.create({
      key,
      frameRate: 15,
      frames: scene.anims.generateFrameNames("flashback", {
        start: 0, end: (Actions[key].size || 1) - 1,
        prefix: `${ key }-`, suffix: ".png",
      })
    });
  }
}

function preload() {
  this.load.path = "assets/";
  this.load.multiatlas("flashback", "flashback.json");
}