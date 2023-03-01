export const Actions = {
  stand: { size: 1, previous: [], keys: [] },
  turn: { size: 10, previous: ["stand"], next: "stand", keys: ["left", "right"], turn: true },
  // walk: { size: 20, previous: ["stand"], next: "stand", keys: ["left", "right"] },
  // run: { size: 20, previous: ["stand"], next: "walk", keys: ["left", "right"] },
  // jump: { size: 20, previous: ["run"], next: "run", keys: ["left", "right"] },
}

export class Conrad extends Phaser.GameObjects.Sprite {
  constructor(scene, input, x, y) {
    super(scene, x, y);
    this.input = input;
    this.state = "stand";
    this.action = null;
    this.perform("stand");
  }

  update() {
    this.applyInput();
  }

  async applyInput() {
    if (this.action) {
      return false;
    }
    for (const name in Actions) {
      const action = Actions[name];
      if (action.previous.includes(this.state)) {
        for (const key of action.keys) {
          if (this.input[key].isDown) {
            if (!action.turn || !this.isFacing(key)) {
              await this.perform(name);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  async perform(action) {
    return new Promise((resolve) => {
      if (this.action) {
        return resolve();
      }
      this.action = Actions[action];
      this.play(action).once("animationcomplete", () => {
        if (this.action.turn) {
          this._turn();
        }
        const next = this.action.next;
        this.action = null;
        this.applyInput().then((busy) => {
          if (!busy && next) {
            return this.perform(next).then(resolve);
          }
        });
      });
    });
  }

  isFacing(direction) {
    return (direction === "left" && this.isFacingLeft()) || (direction === "right" && this.isFacingRight())
  }

  isFacingLeft() {
    return this.scaleX === 1;
  }

  isFacingRight() {
    return this.scaleX === -1;
  }

  _turn() {
    this.scaleX *= -1;
  }
}