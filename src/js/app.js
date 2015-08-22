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

  update() {
    let dt = ((new Date()) - this.now) / 1000.0;

    for (let entity of this.entities) {
      entity.update(dt);
    }

    this.now = new Date();

    setTimeout(() => this.update(), 10);
  }

  render() {
    requestAnimationFrame(() => this.render());
    renderer.render(this.stage);
  }

  start() {
    this.update();
    this.render();
  }
}

class Entity {
  constructor(options) {
    this.texture = PIXI.Texture.fromImage('assets/'+options.sprite+'.png');
    this.sprite = new PIXI.Sprite(this.texture);

    this.position = {x:0, y:0};

    // this.sprite.position = options.position || {x: 0, y: 0}

    this.speed = 3000;
    this.drag = 5;
    this.velocity = {x: 0, y: 0};
    this.accel = {x: 0, y: 0};

    this.attack = false;

    this.max_scale = 20;
    this.min_scale = 4;
    this.scale = this.min_scale;

    this.size();

    this.accel_calc = {};
    this.drag_calc = {};
    this.delta_calc = {};
  }

  size() {
    this.size.width = 16 * this.scale;
    this.size.height = 13 * this.scale;
    return this.size;
  }

  update(dt) {
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

    this.position.x = Math.round(this.position.x + delta.x);
    this.position.y = Math.round(this.position.y + delta.y);

    this.velocity.x = Math.round(this.velocity.x + accel.x*dt);
    this.velocity.y = Math.round(this.velocity.y + accel.y*dt);

    if (this.attack) {
      this.scale = this.max_scale;
    } else {
      this.scale = this.min_scale;
    }

    this.sprite.scale.x = this.scale;
    this.sprite.scale.y = this.scale;

    let size = this.size();

    this.sprite.position.x = this.position.x - size.width / 2;
    this.sprite.position.y = this.position.y - size.height / 2;
  }
}

class ControlledEntity extends Entity {
  constructor(options) {
    super(options);
    this.input = options.input;
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
    } else {
      this.attack = false;
    }

    super.update(dt);

    this.accel.x = 0;
    this.accel.y = 0;
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

let boxman = new ControlledEntity({sprite: 'boxman', input: input});
console.log(boxman);
console.log(boxman.sprite);
game.addEntity(boxman);

// kick off the animation loop (defined below)
game.start();

