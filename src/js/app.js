// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
let renderer = new PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x10ffffff});

class Game {
  constructor(input) {
    this.entities = [];
    this.stage = new PIXI.Container();
    this.now = new Date();
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.stage.addChild(entity.sprite);
  }

  updateAndRender() {
    // start the timer for the next animation loop
    requestAnimationFrame(() => this.updateAndRender());

    let dt = ((new Date()) - this.now) / 1000.0;

    for (let entity of this.entities) {
      entity.update(dt);
    }

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(this.stage);

    this.now = new Date();
  }
}

class Entity {
  constructor(options) {
    let texture = PIXI.Texture.fromImage('assets/'+options.sprite+'.png');
    this.sprite = new PIXI.Sprite(texture);

    this.input = options.input;

    // this.sprite.position = options.position || {x: 0, y: 0}

    this.speed = 1500;
    this.drag = 5;
    this.velocity = {x: 0, y: 0};
    this.accel = {x:0, y:0};

    this.attack = false;

    this.max_scale = 20;

    this.accel_calc = {};
    this.drag_calc = {};
    this.delta_calc = {};
  }

  update(dt) {

    if (this.input.isKeyDown("UP")) {
      this.accel.y = -1;
    }
    if (this.input.isKeyDown("DOWN")) {
      this.accel.y = 1;
    }
    if (this.input.isKeyDown("LEFT")) {
      this.accel.x = -1;
    }
    if (this.input.isKeyDown("RIGHT")) {
      this.accel.x = 1;
    }
    if (this.input.isKeyDown("SPACE")) {
      this.attack = true;
    }

    let accel = this.accel_calc;
    accel.x = this.accel.x * this.speed;
    accel.y = this.accel.y * this.speed;

    let drag = this.drag_calc;
    drag.x = -this.drag*this.velocity.x;
    drag.y = -this.drag*this.velocity.y;

    accel.x += drag.x;
    accel.y += drag.y;

    let delta = this.delta_calc;

    delta.x = (.5 * accel.x * dt * dt) + (this.velocity.x * dt)
    delta.y = (.5 * accel.y * dt * dt) + (this.velocity.y * dt)

    this.sprite.position.x = Math.round(this.sprite.position.x + delta.x);
    this.sprite.position.y = Math.round(this.sprite.position.y + delta.y);

    this.velocity.x = Math.round(this.velocity.x + accel.x*dt);
    this.velocity.y = Math.round(this.velocity.y + accel.y*dt);

    if (this.attack) {
      this.sprite.scale.x = this.max_scale;
      this.sprite.scale.y = this.max_scale;
    } else {
      this.sprite.scale.x = 1;
      this.sprite.scale.y = 1;
    }
  }
}

class Input {
  constructor(options) {
    this.keys = {}
    this.key_config = {
        65: "LEFT",
        37: "LEFT",
        83: "DOWN",
        40: "DOWN",
        68: "RIGHT",
        39: "RIGHT",
        87: "UP",
        38: "UP",
        // 37: "CAMLEFT",
        // 39: "CAMRIGHT",
        32: "SPACE",
        // 90: "ZOOM",
        // 70: "FOLLOW",
      };
  }

  getKey(code) {
    return this.key_config[code];
  }

  isKeyDown(key) {
    return this.keys[key]
  }

  addListeners() {
    // key events
    document.body.addEventListener("keydown", (e) => {
        this.keys[this.getKey(e.keyCode)] = true;
    });
    document.body.addEventListener("keyup", (e) => {
        this.keys[this.getKey(e.keyCode)] = false;
    });
  }
}

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

let game = new Game();
let input = new Input();
input.addListeners();

let boxman = new Entity({sprite: 'boxman', input: input});
game.addEntity(boxman);

let keyConfig = {
  65: "LEFT",
  37: "LEFT",
  83: "DOWN",
  40: "DOWN",
  68: "RIGHT",
  39: "RIGHT",
  87: "UP",
  38: "UP",
  // 37: "CAMLEFT",
  // 39: "CAMRIGHT",
  32: "SPACE",
  // 90: "ZOOM",
  // 70: "FOLLOW",
};

window.addEventListener('keydown', function(e) {
  let key = keyConfig[e.keyCode];

  if (key == "UP") {
    boxman.accel.y = -1;
  }
  if (key == "DOWN") {
    boxman.accel.y = 1;
  }
  if (key == "LEFT") {
    boxman.accel.x = -1;
  }
  if (key == "RIGHT") {
    boxman.accel.x = 1;
  }
  if (key == "SPACE") {
    boxman.attack = true;
  }
});

window.addEventListener('keyup', function(e) {
  let key = keyConfig[e.keyCode];

  if (key == "UP") {
    boxman.accel.y = 0;
  }
  if (key == "DOWN") {
    boxman.accel.y = 0;
  }
  if (key == "LEFT") {
    boxman.accel.x = 0;
  }
  if (key == "RIGHT") {
    boxman.accel.x = 0;
  }
  if (key == "SPACE") {
    boxman.attack = false;
  }
});

// kick off the animation loop (defined below)
game.updateAndRender();

