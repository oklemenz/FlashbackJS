import Conrad from "./conrad.js";

const KEYS = {
  left: Phaser.Input.Keyboard.KeyCodes.LEFT,
  right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  up: Phaser.Input.Keyboard.KeyCodes.UP,
  down: Phaser.Input.Keyboard.KeyCodes.DOWN,
  draw: Phaser.Input.Keyboard.KeyCodes.SPACE,
  fire: Phaser.Input.Keyboard.KeyCodes.SHIFT,
  action: Phaser.Input.Keyboard.KeyCodes.ENTER,
};

let conrad;
new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 256,
  height: 224,
  scene: {
    preload: function () {
      this.load.path = "assets/";
      this.load.json("conrad-anim", "anim/conrad.json");
      this.load.multiatlas("conrad", "conrad.json");
      this.load.image("background", "background.png");
      this.load.image("fire", "fire.png");
    },
    create: function () {
      this.add.sprite(0, 0, "background").setOrigin(0, 0);
      conrad = new Conrad(this, "conrad", { x: 48, y: 32 }, KEYS);
      this.add.existing(conrad);
    },
    update: function () {
      conrad?.update();
    }
  }
});
