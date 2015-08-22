// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var renderer = new PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x10ffffff });

var Game = (function () {
  function Game() {
    _classCallCheck(this, Game);

    this.entities = [];
    this.stage = new PIXI.Container();
  }

  _createClass(Game, [{
    key: 'addEntity',
    value: function addEntity(entity) {
      this.entities.push(entity);
      this.stage.addChild(entity.sprite);
    }
  }, {
    key: 'updateAndRender',
    value: function updateAndRender() {
      var _this = this;

      // start the timer for the next animation loop
      requestAnimationFrame(function () {
        return _this.updateAndRender();
      });

      // this is the main render call that makes pixi draw your container and its children.
      renderer.render(this.stage);
    }
  }]);

  return Game;
})();

var Entity = (function () {
  function Entity(options) {
    _classCallCheck(this, Entity);

    var texture = PIXI.Texture.fromImage('assets/' + options.sprite + '.png');
    this.sprite = new PIXI.Sprite(texture);

    // this.sprite.position = options.position || {x: 0, y: 0}
  }

  // The renderer will create a canvas element for you that you can then insert into the DOM.

  _createClass(Entity, [{
    key: 'update',
    value: function update() {}
  }]);

  return Entity;
})();

document.body.appendChild(renderer.view);

var game = new Game();

var boxman = new Entity({ sprite: 'boxman' });
game.addEntity(boxman);

var keyConfig = {
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
  32: "SPACE"
};

// 90: "ZOOM",
// 70: "FOLLOW",
window.addEventListener('keydown', function (e) {
  console.log(e.keyCode);
  console.info(boxman.position);
  var key = keyConfig[e.keyCode];
  switch (key) {
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
      boxman.sprite.scale.x = (boxman.sprite.scale.x + 1) % 3 + 1;
      boxman.sprite.scale.y = (boxman.sprite.scale.y + 1) % 3 + 1;

      break;
  }
});

// kick off the animation loop (defined below)
game.updateAndRender();