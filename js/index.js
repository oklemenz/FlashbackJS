import Conrad from "./conrad.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 256,
  height: 224,
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
  draw: Phaser.Input.Keyboard.KeyCodes.SPACE,
  fire: Phaser.Input.Keyboard.KeyCodes.SHIFT,
  action: Phaser.Input.Keyboard.KeyCodes.ENTER,
};

let conrad;

function create() {
  setup(this);
  this.add.sprite(0, 0, "background").setOrigin(0, 0);
  conrad = new Conrad(this, { x: 48, y: 32 }, keys).setOrigin(0.5, 1);
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
    keys[key] = scene.input.keyboard.addKey(keys[key]);
  }
}

function createAnimations(scene) {
  for (const key in Conrad.Actions) {
    const action = Conrad.Actions[key];
    scene.anims.create({
      key,
      frameRate: action.rate || 20,
      frames: scene.anims.generateFrameNames("conrad", {
        start: 0, end: (action.size || 1) - 1,
        prefix: `${ key }-`, suffix: ".png",
      })
    });
  }
}

function preload() {
  this.load.path = "assets/";
  this.load.multiatlas("conrad", "conrad.json");
  this.load.image("background", "background.png");
}