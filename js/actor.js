export default class Actor extends Phaser.GameObjects.Sprite {

  constructor(scene, position, offset, actions, input) {
    super(scene, position.x + offset.x, position.y + offset.y);
    this.position = position;
    this.offset = offset;
    this.actions = actions;
    this.input = input;
    this.state = null;
    this.action = null;
    this._bind();
  }

  update() {
    this._input();
    console.log(this.state, this.x, this.y);
  }

  isFacingLeft() {
    return this.scaleX === 1;
  }

  isFacingRight() {
    return this.scaleX === -1;
  }

  perform(action) {
    if (this.state === action) {
      return;
    }
    return new Promise((resolve) => {
      if (this.action) {
        return resolve();
      }
      this.state = action;
      this.action = this.actions[action];
      this.play(action).once("animationcomplete", () => {
        resolve();
      });
    });
  }

  _isFacing(direction) {
    return (direction.includes("left") && this.isFacingLeft()) || (direction.includes("right") && this.isFacingRight());
  }

  _bind() {
    this.on("animationstart", (animation, frame) => {
      this._move(animation.key, frame.index);
    });
    this.on("animationupdate", (animation, frame) => {
      this._move(animation.key, frame.index);
    });
    this.on("animationcomplete", (animation, frame) => {
      if (this.action.turn) {
        this._turn();
      }
      this._align();
      const next = this.action.next;
      this.action = null;
      const busy = this._input();
      if (!busy && next) {
        this.perform(next);
      }
    });
  }

  _input() {
    if (this.action) {
      return false;
    }
    for (const name in this.actions) {
      const action = this.actions[name];
      if ((action.previous || []).includes(this.state)) {
        for (const key of action.keys || []) {
          const keyParts = key.split("+");
          const allDown = keyParts.every((keyPart) => {
            return this.input[keyPart].isDown;
          });
          if (allDown) {
            if (!action.turn || !this._isFacing(key)) {
              this.perform(name);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  _move(key, index) {
    if (this.action) {
      let dx;
      if (!isNaN(this.action.x)) {
        if (Array.isArray(this.action.dx)) {
          const sum = this.action.dx.reduce((sum, v) => sum + v, 0);
          dx = ((8 * this.action.x) / sum) * this.action.dx[index - 1];
        } else {
          dx = 8 * (this.action.x / this.action.size);
        }
      }
      if (dx) {
        this.position.x += dx * (this.isFacingLeft() ? -1 : 1);
        this.x = Math.round(this.position.x + this.offset.x);
      }
      let dy;
      if (!isNaN(this.action.y)) {
        if (Array.isArray(this.action.dy)) {
          const sum = this.action.dy.reduce((sum, v) => sum + v, 0);
          dy = ((8 * this.action.y) / sum) * this.action.dy[index - 1];
        } else {
          dy = 8 * (this.action.y / this.action.size);
        }
      }
      if (dy) {
        this.position.y += dy;
        this.y = Math.round(this.position.y + this.offset.y);
      }
    }
  }

  _align() {
    this.position.x = Math.floor(Math.round(this.position.x) / 8) * 8;
    this.x = this.position.x + this.offset.x;
    this.position.y = Math.floor((Math.round(this.position.y) - 32) / 72) * 72 + 32; // 32, 104, 176
    this.y = this.position.y + this.offset.y;
  }

  _turn() {
    this.scaleX *= -1;
  }
}