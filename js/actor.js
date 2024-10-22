export default class Actor extends Phaser.GameObjects.Container {

    constructor(scene, name, position, offset, keys, turn, log) {
        super(scene, position.x + offset.x, position.y + offset.y);
        this.name = name;
        this.position = position;
        this.offset = offset;
        this.actions = scene.cache.json.get(name + "-anim");
        this._createAnimations(scene);
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
        this.keys = this._bindKeys(scene, keys);
        this._bindPointer(scene);
        this.env = {
            atEdgeAbove: false, atEdgeBelow: false, atWall: false, atObject: false,
        };
        this.input = {};
        this.pointer = {};
        this.state = null;
        this.action = null;
        this.log = log;
        this.body = scene.add.sprite(0, 0, name);
        this.body.setOrigin(0.5, 1);
        this.add(this.body);
        this._bind();
        if (turn) {
            this._turn();
        }
    }

    update() {
        this._processPointer();
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
            this._transition(this.state, action);
            this.state = action;
            this.action = this.actions[action];
            this.body.play(action).once("animationcomplete", () => {
                resolve();
            });
        });
    }

    _isFacingDirection(direction) {
        return (direction.includes("left") && this.isFacingLeft()) || (direction.includes("right") && this.isFacingRight());
    }

    _isNotFaceDirection(direction) {
        return !(direction.includes("left") || direction.includes("right"));
    }

    _bind() {
        this.body.on("animationstart", (animation, frame) => {
            this._move(animation.key, frame.index);
            this._callback(animation, frame);
            if (this.action.stop === frame.index) {
                this.body.anims.stop();
            }
        });
        this.body.on("animationupdate", (animation, frame) => {
            this._move(animation.key, frame.index);
            this._callback(animation, frame);
            if (this.action.stop === frame.index) {
                this.body.anims.stop();
            }
        });
        this.body.on("animationcomplete", (animation, frame) => {
            if (this.action.turn) {
                this._turn();
            }
            if (this.action.align !== false) {
                this._align(animation, frame);
            }
            if (this.action.stop === true) {
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
            this.input[key] = this.keys[key].isDown || !!this.pointer[key];
        }
        this.input = {...this.input, ...this.env};
        for (const name of this.actionNames) {
            const action = this.actions[name];
            if ((action.previous || []).includes(this.state)) {
                for (const input of action.input || []) {
                    const values = input.split("+");
                    const allSet = values.every((value) => {
                        return ((!String(value).startsWith("!") && this.input[value]) || (String(value).startsWith("!") && !this.input[value.substring(1)])) && (this._isNotFaceDirection(value) || !!action.turn !== this._isFacingDirection(value));
                    });
                    if (allSet) {
                        this.perform(name);
                        return true;
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
            }
            this._position();
        }
    }

    _callback(animation, frame) {
        const callback = animation.key.replace(/[^a-z]/gi, "");
        if (typeof this[callback] === "function") {
            this[callback](animation, frame);
        }
    }

    _transition(outState, inState) {
        const outStateAction = this.actions[outState];
        if (outStateAction) {
            if (!isNaN(outStateAction.ox)) {
                this.position.x += outStateAction.ox * (this.isFacingLeft() ? -1 : 1);
            }
            if (!isNaN(outStateAction.oy)) {
                this.position.y += outStateAction.oy;
            }
            if (outStateAction[inState]) {
                if (!isNaN(outStateAction[inState].ox)) {
                    this.position.x += outStateAction[inState].ox * (this.isFacingLeft() ? -1 : 1);
                }
                if (!isNaN(outStateAction[inState].oy)) {
                    this.position.y += outStateAction[inState].oy;
                }
            }
        }
        const inStateAction = this.actions[inState];
        if (inStateAction) {
            if (!isNaN(inStateAction.ix)) {
                this.position.x += inStateAction.ix * (this.isFacingLeft() ? -1 : 1);
            }
            if (!isNaN(inStateAction.iy)) {
                this.position.y += inStateAction.iy;
            }
            if (inStateAction[outState]) {
                if (!isNaN(inStateAction[outState].ix)) {
                    this.position.x += inStateAction[outState].ix * (this.isFacingLeft() ? -1 : 1);
                }
                if (!isNaN(inStateAction[outState].iy)) {
                    this.position.y += inStateAction[outState].iy;
                }
            }
        }
        this._position();
    }

    _position() {
        this.x = Math.round(this.position.x + this.offset.x);
        this.y = Math.round(this.position.y + this.offset.y);
        if (this.log || this.action?.log) {
            console.log(this.body.anims.currentAnim?.key, this.body.anims.currentFrame?.index, this.x, this.y);
        }
    }

    _align(animation, frame) {
        // grid: 1 unit (8 px)
        // align: 2 units (16 px)
        this.position.x = Math.round(Math.round(this.position.x) / 16) * 16;
        this.position.y = Math.round((Math.round(this.position.y) - 32) / 72) * 72 + 32; // 32, 104, 176
        const previous = {x: this.x, y: this.y};
        this.x = this.position.x + this.offset.x;
        this.y = this.position.y + this.offset.y;
        if (previous.x !== this.x) {
            console.error("=> misaligned-x", animation.key, frame.index, previous.x, this.x);
        }
        if (previous.y !== this.y) {
            console.error("=> misaligned-y", animation.key, frame.index, previous.y, this.y);
        }
    }

    _turn() {
        this.scaleX *= -1;
    }

    _createAnimations(scene) {
        for (const key in this.actions) {
            const action = this.actions[key];
            scene.anims.create({
                key, frameRate: action.rate || 20, frames: scene.anims.generateFrameNames(this.name, {
                    start: 0, end: (action.size || 1) - 1, prefix: `${key}-`, suffix: ".png",
                })
            });
        }
    }

    _bindKeys(scene, keys) {
        const _keys = {};
        for (const key in keys) {
            _keys[key] = scene.input.keyboard.addKey(keys[key]);
        }
        return _keys;
    }

    _bindPointer(scene) {
        scene.input.addPointer();
        scene.input.addPointer();
        scene.input.addPointer();
    }

    _processPointer() {
        const pointer = this._gamePointer();
        const size = this.scene.scale;
        if (pointer) {
            const middle = pointer.x >= size.width / 3 && pointer.x <= 2 * size.width / 3 && pointer.y >= size.height / 3 && pointer.y <= 2 * size.height / 3;
            const end = ((pointer.x >= 0 && pointer.x <= size.width / 6) || (pointer.x >= 5 * size.width / 6 && pointer.x <= size.width)) && pointer.y >= 0 && pointer.y <= size.height;
            this.pointer = {
                left: pointer.x >= 0 && pointer.x <= size.width / 3 && pointer.y >= 0 && pointer.y <= size.height,
                right: pointer.x >= 2 * size.width / 3 && pointer.x <= size.width && pointer.y >= 0 && pointer.y <= size.height,
                up: pointer.x >= 0 && pointer.x <= size.width && pointer.y >= 0 && pointer.y <= size.height / 3,
                down: pointer.x >= 0 && pointer.x <= size.width && pointer.y >= 2 * size.height / 3 && pointer.y <= size.height,
                fire: middle || end,
                draw: middle && this.scene.input.pointer1.isDown && this.scene.input.pointer2.isDown && !this.scene.input.pointer3.isDown,
                action: middle && this.scene.input.pointer1.isDown && this.scene.input.pointer2.isDown && this.scene.input.pointer3.isDown,
            };
        } else {
            this.pointer = {};
        }
    }

    _gamePointer() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const size = this._gameSize();
        const x = this.scene.input.activePointer.isDown && this.scene.input.activePointer.x ||
            this.scene.input.pointer1.isDown && this.scene.input.pointer1.x ||
            this.scene.input.pointer2.isDown && this.scene.input.pointer2.x ||
            this.scene.input.pointer2.isDown && this.scene.input.pointer3.x ||
            undefined;
        const y = this.scene.input.activePointer.isDown && this.scene.input.activePointer.y ||
            this.scene.input.pointer1.isDown && this.scene.input.pointer1.y ||
            this.scene.input.pointer2.isDown && this.scene.input.pointer2.y ||
            this.scene.input.pointer2.isDown && this.scene.input.pointer3.y ||
            undefined;
        if (x !== undefined && y !== undefined) {
            const o = {
                x: (width - size.width) / 2,
                y: (height - size.height) / 2,
            }
            return {
                x: (x * width - o.x * this.scene.scale.width) / size.width, // (x - o.x * this.scene.scale.width / width) * width / size.width,
                y: (y * height - o.y * this.scene.scale.height) / size.height, // (y - o.y * this.scene.scale.height / height) * height / size.height,
            };
        }
    }

    _gameSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = this.scene.scale.width / this.scene.scale.height;
        return width / height >= ratio ? {
            width: height * ratio, height
        } : {
            width, height: width / ratio
        };
    }
}
