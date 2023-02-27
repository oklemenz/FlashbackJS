import { Conrad, Actions } from "./conrad.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 320,
  height: 200,
  scene: {
    init: () => {},
    preload,
    create,
    update,
  }
});

let conrad;
let upKey;
let downKey;
let leftKey;
let rightKey;
let enterKey;
let spaceKey;

function preload() {
  this.load.path = "assets/";
  this.load.multiatlas("flashback", "flashback.json");
}

function create() {
  Object.keys(Actions).forEach((key) => {
    const animation = Actions[key];
    this.anims.create({
      key,
      frameRate: 15,
      frames: this.anims.generateFrameNames("flashback", {
        start: 0, end: (animation.size || 1) - 1,
        prefix: `${ key }-`, suffix: ".png",
      })
    });
  });
  conrad = new Conrad(this, 160, 100);
  this.add.existing(conrad);

  leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {
  conrad?.inputs({
    left: leftKey.isDown,
    right: rightKey.isDown,
    up: upKey.isDown,
    down: downKey.isDown,
    fire: spaceKey.isDown,
    action: enterKey.isDown,
  });
}
