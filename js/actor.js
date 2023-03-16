export default class Actor extends Phaser.GameObjects.Sprite {

  constructor(scene, position, offset, actions, keys) {
    super(scene, position.x + offset.x, position.y + offset.y);
    this.position = position;
    this.offset = offset;
    this.actions = actions;
    for (const key in this.actions) {
      this.actions[key].key = key;
    }
    this.actionNames = Object.keys(this.actions).sort((action1, action2) => {
      return Math.max(0, ...(this.actions[action2].input || []).map((value) => {
        return value.split("+").length;
      })) - Math.max(0, ...(this.actions[action1].input || []).map((value) => {
        return value.split("+").length;
      }));
    });
    this.keys = keys;
    this.env = {
      atEdgeAbove: false, atEdgeBelow: false, atWall: false, atObject: false,
    };
    this.input = {};
    this.state = null;
    this.action = null;
    this._bind();
  }

  update() {
    this._processInput();
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
      if (this.action.stop === frame.index) {
        this.anims.stop();
      }
    });
    this.on("animationupdate", (animation, frame) => {
      this._move(animation.key, frame.index);
      if (this.action.stop === frame.index) {
        this.anims.stop();
      }
    });
    this.on("animationcomplete", (animation, frame) => {
      if (this.action.turn) {
        this._turn();
      }
      if (this.action.align !== false) {
        this._align();
      }
      if (this.action.stop) {
        return;
      }
      const next = this.action.next;
      this.action = null;
      const busy = this._processInput();
      if (!busy && next) {
        this.perform(next);
      }
    });
  }

  _processInput() {
    if (this.action) {
      return false;
    }
    this.input = {};
    for (const key in this.keys) {
      this.input[key] = this.keys[key].isDown;
    }
    this.input = { ...this.input, ...this.env };
    for (const name of this.actionNames) {
      const action = this.actions[name];
      if ((action.previous || []).includes(this.state)) {
        for (const input of action.input || []) {
          const values = input.split("+");
          const allSet = values.every((value) => {
            return this.input[value];
          });
          if (allSet) {
            if (!action.turn || !this._isFacing(input)) {
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
      if (this.action.skipFirst && index === 1 || this.action.skipLast && index === this.action.size) {
        return;
      }
      let size = this.action.size;
      if (this.action.skipFirst) {
        size--;
      }
      if (this.action.skipLast) {
        size--;
      }
      let x = 0;
      if (Array.isArray(this.action.px)) {
        x = this.action.px[index - 1];
      } else if (!isNaN(this.action.x)) {
        if (Array.isArray(this.action.dx)) {
          const sum = this.action.dx.reduce((sum, v) => sum + v, 0);
          x = ((8 * this.action.x) / sum) * this.action.dx[index - 1];
        } else {
          x = 8 * (this.action.x / size);
        }
      }
      if (x) {
        this.position.x += x * (this.isFacingLeft() ? -1 : 1);
        this.x = Math.round(this.position.x + this.offset.x);
      }
      let y = 0;
      if (Array.isArray(this.action.py)) {
        y = this.action.py[index - 1];
      } else if (!isNaN(this.action.y)) {
        if (Array.isArray(this.action.dy)) {
          const sum = this.action.dy.reduce((sum, v) => sum + v, 0);
          y = ((8 * this.action.y) / sum) * this.action.dy[index - 1];
        } else {
          y = 8 * (this.action.y / size);
        }
      }
      if (y) {
        this.position.y += y;
        this.y = Math.round(this.position.y + this.offset.y);
      }
      if (this.action.log) {
        console.log(this.action.key, index, this.position.x, this.position.y, x, y);
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