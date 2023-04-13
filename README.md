# FlashbackJS

Conrad's animations in Flashback executed by a [state engine (actor.js)](./js/actor.js) and configured via [JSON (conrad.json)](./assets/anim/conrad.json):

**Animation Configuration:**
- `<nme>` _[String]_ : Name of the animation 
- `size` _[Number]_ : Number of animation frames
- `rate` _[Number]_ : Frame rate of the animation (default 20)
- `turn` _[Boolean]_ : Animation does turn character
- `previous` _[Array\<String\>]_ : Previous animations
- `next` _[String]_ : Next default animation (if no other animation played before with input)
- `input` _[Array\<String\>]_ : Multiple inputs to trigger animation (`keys, env`), input combo with `+`, input negation with `!`
- `x` _[Number]_ : Number of grid units shifted in `x` direction for whole animation
- `y` _[Number]_ : Number of grid units shifted in `y` direction for whole animation
- `px` _[Array\<Number\>]_ : Number of pixels shifted in `x` direction for a single animation frame (overrides `x`)
- `py` _[Array\<Number\>]_ : Number of pixels shifted in `y` direction for a single animation frame (overrides `y`)
- `ox` _[Number | Object\<String, Number\>]_ : Number of pixels shifted in `x` direction at the end (out) of animation. Can depend on succeeding (in) animation, e.g. `{ "<name>": 1 }`   
- `oy` _[Number | Object\<String, Number\>]_ : Number of pixels shifted in `y` direction at the end (out) of animation. Can depend on succeeding (in) animation, e.g. `{ "<name>": 1 }`
- `ix` _[Number | Object\<String, Number\>]_ : Number of pixels shifted in `x` direction at the start (in) of animation. Can depend on preceding (out) animation, e.g. `{ "<name>": 1 }`
- `iy` _[Number | Object\<String, Number\>]_ : Number of pixels shifted in `y` direction at the start (in) of animation. Can depend on preceding (out) animation, e.g. `{ "<name>": 1 }`
- `align` _[Boolean]_ : Align to grid after animation (2 grid units, default: `true`)
- `stop` _[Boolean | Number]_ : Stop animation at frame index (`Number`) or at animation end (`true`)
- `log` _[Boolean]_ : Log animation to console

## Play GitHub Version

- Browser: https://oklemenz.github.io/FlashbackJS
- Keyboard
  - `Cursor keys`: Movement
    - `Left / Right key`: Walk, Run, Step, Roll
    - `Up key`: Jump
    - `Down key`: Crouch
  - `SHIFT`: Run, Fire
  - `SPACE`: Draw Gun
  - `ENTER`: Action

## Play Locally

- Install [Node.js](https://nodejs.org)
- Clone: `https://github.com/oklemenz/FlashbackJS.git`
- Terminal:
  - `npm install`
  - `npm start`
- Browser: `localhost:8080`
