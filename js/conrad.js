export const Actions = {
  stand: { size: 1 },
  turn: { size: 10, turn: true, next: "stand" },
  // walk: { size: 20, next: "stand" },
  // run: { size: 20, next: "walkstop" },
  // jump: { size: 20, next: "walkstop" },
}

export class Conrad extends Phaser.GameObjects.Sprite {

  constructor (scene, x, y) {
    super(scene, x, y);
    this.state = "stand";
    this.action = null;
    this.perform("stand");
  }

  perform(action) {
    if (this.action) {
      return;
    }
    this.action = Actions[action];
    this.play(action).once("animationcomplete", () => {
      if (this.action.turn) {
        this.turn();
      }
      const next = this.action.next;
      this.action = null;
      if (next) {
        this.perform(next);
      }
    });
  }

  get looksLeft() {
    return this.scaleX === 1;
  }

  get looksRight() {
    return this.scaleX === -1;
  }

  turn() {
    this.scaleX *= -1;
  }

  inputs({left, right, up, down, fire, action}) {
    if ((this.looksLeft && right) || (this.looksRight && left)) {
      this.perform("turn");
    }
  }

  preUpdate (time, delta)   {
    super.preUpdate(time, delta);
  }
}