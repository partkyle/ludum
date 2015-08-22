// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
let renderer = new PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x10ffffff});

class Game {
  constructor() {
    this.entities = [];
    this.stage = new PIXI.Container();
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.stage.addChild(entity.sprite);
  }

  updateAndRender() {
    // start the timer for the next animation loop
    requestAnimationFrame(() => this.updateAndRender());

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(this.stage);
  }
}

class Entity {
  constructor(options) {
    let texture = PIXI.Texture.fromImage('assets/'+options.sprite+'.png');
    this.sprite = new PIXI.Sprite(texture);

    // this.sprite.position = options.position || {x: 0, y: 0}
  }

  update() {

  }
}

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

let game = new Game();

let boxman = new Entity({sprite: 'boxman'});
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
  console.log(e.keyCode)
  console.info(boxman.position);
  let key = keyConfig[e.keyCode];
  switch(key) {
    case "UP":
      boxman.sprite.position.y += -50;
      break;
    case "DOWN":
      boxman.sprite.position.y += 50;
      break;
    case "LEFT":
      boxman.sprite.position.x += -50;
      break;
    case "RIGHT":
      boxman.sprite.position.x += 50;
      break;
    case "SPACE":
      boxman.sprite.scale.x = ((boxman.sprite.scale.x + 1) % 3) + 1;
      boxman.sprite.scale.y = ((boxman.sprite.scale.y + 1) % 3) + 1;

      break;
  }
});

// kick off the animation loop (defined below)
game.updateAndRender();

