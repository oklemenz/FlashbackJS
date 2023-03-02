export const Actions = {
  stand: { size: 1, previous: [], keys: [] },
  turn: { size: 10, previous: ["stand"], next: "stand", keys: ["left", "right"], turn: true },
  walk1: { size: 6, previous: ["stand", "walk2"], next: "stand", keys: ["left", "right"], x: 1 },
  walk2: { size: 6, previous: ["walk1"], next: "stand", keys: ["left", "right"], x: 1 },
  // startrun,
  // run,
  // runstop,
  // jumpup,
  // land,
  // jump,
  // runjump,
  // crouch,
  // roll,
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
    this.move();
    this.applyInput();
  }

  move() {
    if (this.action) {
      if (this.action.x) {
        this.x = Math.floor(this.x + this.action.x * (this.isFacingLeft() ? -1 : 1));
      }
      if (this.action.y) {
        this.y = Math.floor(this.y + this.action.y / 10);
      }
    }
  }

  async applyInput() {
    if (this.action) {
      return false;
    }
    for (const name in Actions) {
      const action = Actions[name];
      if (action.previous.includes(this.state)) {
        for (const key of action.keys) {
          const keyParts = key.split("+");
          const allDown = keyParts.every((keyPart) => {
            return this.input[keyPart].isDown;
          });
          if (allDown) {
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
      this.state = action;
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
    return (direction.includes("left") && this.isFacingLeft()) ||
      (direction.includes("right") && this.isFacingRight());
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