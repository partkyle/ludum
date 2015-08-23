// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;


function Inner(a, b) {
  return a.x*b.x + a.y*b.y;
}

function LengthSq(vector) {
  return Inner(vector, vector)
}

function Length(vector) {
  Math.sqrt(LengthSq(vector))
}

function tmp() {
  let move_length = Length(delta)
}

function RectanglesIntersect(A, B) {
    return !((B.Max.x < A.Min.x) ||
                      (B.Min.x > A.Max.x) ||
                      (B.Max.y < A.Min.y) ||
                      (B.Min.y > A.Max.y) ||
                      (B.Max.z < A.Min.z) ||
                      (B.Min.z > A.Max.z));
}

class Game {
  constructor(input) {
    this.entities = [];
    this.stage = new PIXI.Container();
    this.now = new Date();

    this.screen_width = 800;
    this.screen_height = 600;
  
    this.renderer = new PIXI.autoDetectRenderer(this.screen_width, this.screen_height, {backgroundColor : 0x10ffffff});

    this.debug_graphics = new PIXI.Graphics();

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.body.appendChild(this.renderer.view);
  }

  enableDebug() {
    this.stage.addChild(this.debug_graphics);
  }

  drawDebug() {
    this.debug_graphics.clear()


    for (let entity of this.entities) {
      if (entity == boxman) {
        this.debug_graphics.beginFill(0x0002f0, .5);
      } else {
        this.debug_graphics.beginFill(0xff00ff, .5);
      }
  
      let r = entity.rect()

      this.debug_graphics.drawRect(r.Min.x, r.Min.y, r.Max.x - r.Min.x, r.Max.y - r.Min.y);
    }
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.stage.addChild(entity.sprite);
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.stage);

    let dt = ((new Date()) - this.now) / 1000.0;

    for (let entity of this.entities) {
      entity.collided = false;
      entity.update(dt);
    }

    this.now = new Date();

    this.drawDebug();
  }

  start() {
    this.render();
  }
}

class Entity {
  constructor(options) {
    this.texture = PIXI.Texture.fromImage('assets/'+options.sprite+'.png');
    this.sprite = new PIXI.Sprite(this.texture);

    this.speed = 3000;
    this.drag = 5;
    this.velocity = {x: 0, y: 0};
    this.accel = {x: 0, y: 0};

    this.attack = false;

    this.max_scale = 5;
    this.min_scale = 1;
    this.scale = this.min_scale;

    this._size = {width: 0, height: 0};
    let size = this.size();

    this.position = {x: size.width/2.0, y: size.height/2.0};


    this.accel_calc = {};
    this.drag_calc = {};
    this.delta_calc = {};

    this.game = options.game;
  }

  size() {
    this._size.width = 64 * this.scale;
    this._size.height = 52 * this.scale;
    return this._size;
  }

  rect() {
    return {Min: {x: this.position.x - (this.size().width / 2.0), y: this.position.y - (this.size().height / 2.0)},
            Max: {x: this.position.x + (this.size().width / 2.0), y: this.position.y + (this.size().height / 2.0)}}
  }

  update(dt) {
    let accel = this.accel_calc;

    let accel_length = LengthSq(accel);
    if (accel_length > 1.0) {
      accel.x *= (1.0 / Math.sqrt(accel_length));
      accel.y *= (1.0 / Math.sqrt(accel_length));
    }

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

    let new_position = {};
    new_position.x = Math.round(this.position.x + delta.x);
    new_position.y = Math.round(this.position.y + delta.y);

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

    let valid_move = true;

    let me = this.rect();
    for (let entity of game.entities) {
      if (entity != this) {
        let them = entity.rect();
        if (RectanglesIntersect(me, them)) {
          valid_move = false;
        }
      }
    }

    if (valid_move && !this.collided) {
      this.position.x = new_position.x;
      this.position.y = new_position.y;
    } else {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = -this.velocity.y;
    }

    this.sprite.position.x = this.position.x - size.width / 2.0;
    this.sprite.position.y = this.position.y - size.height / 2.0;
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

let game = new Game();
let input = new Input();
input.addListeners();

let boxman = new ControlledEntity({sprite: 'boxman2', input: input, game: game  });
game.addEntity(boxman);

for (let i = 0; i < 5; i++) {
  let enemy = new Entity({'sprite': 'boxman2', game: game});
  enemy.position.x = Math.floor(Math.random() * game.screen_width);
  enemy.position.y = Math.floor(Math.random() * game.screen_height);
  game.addEntity(enemy);
}

game.enableDebug();

// kick off the animation loop (defined below)
game.start();

