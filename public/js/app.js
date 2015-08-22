// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var renderer = new PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x10ffffff });

var Game = (function () {
  function Game(input) {
    _classCallCheck(this, Game);

    this.entities = [];
    this.stage = new PIXI.Container();
    this.now = new Date();
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

      var dt = (new Date() - this.now) / 1000.0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entity = _step.value;

          entity.update(dt);
        }

        // this is the main render call that makes pixi draw your container and its children.
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      renderer.render(this.stage);

      this.now = new Date();
    }
  }]);

  return Game;
})();

var Entity = (function () {
  function Entity(options) {
    _classCallCheck(this, Entity);

    var texture = PIXI.Texture.fromImage('assets/' + options.sprite + '.png');
    this.sprite = new PIXI.Sprite(texture);

    this.input = options.input;

    // this.sprite.position = options.position || {x: 0, y: 0}

    this.speed = 1500;
    this.drag = 5;
    this.velocity = { x: 0, y: 0 };
    this.accel = { x: 0, y: 0 };

    this.attack = false;

    this.max_scale = 20;

    this.accel_calc = {};
    this.drag_calc = {};
    this.delta_calc = {};
  }

  _createClass(Entity, [{
    key: 'update',
    value: function update(dt) {

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

      var accel = this.accel_calc;
      accel.x = this.accel.x * this.speed;
      accel.y = this.accel.y * this.speed;

      var drag = this.drag_calc;
      drag.x = -this.drag * this.velocity.x;
      drag.y = -this.drag * this.velocity.y;

      accel.x += drag.x;
      accel.y += drag.y;

      var delta = this.delta_calc;

      delta.x = .5 * accel.x * dt * dt + this.velocity.x * dt;
      delta.y = .5 * accel.y * dt * dt + this.velocity.y * dt;

      this.sprite.position.x = Math.round(this.sprite.position.x + delta.x);
      this.sprite.position.y = Math.round(this.sprite.position.y + delta.y);

      this.velocity.x = Math.round(this.velocity.x + accel.x * dt);
      this.velocity.y = Math.round(this.velocity.y + accel.y * dt);

      if (this.attack) {
        this.sprite.scale.x = this.max_scale;
        this.sprite.scale.y = this.max_scale;
      } else {
        this.sprite.scale.x = 1;
        this.sprite.scale.y = 1;
      }
    }
  }]);

  return Entity;
})();

var Input = (function () {
  function Input(options) {
    _classCallCheck(this, Input);

    this.keys = {};
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
      32: "SPACE"
    };
  }

  // The renderer will create a canvas element for you that you can then insert into the DOM.

  _createClass(Input, [{
    key: 'getKey',
    // 90: "ZOOM",
    // 70: "FOLLOW",
    value: function getKey(code) {
      return this.key_config[code];
    }
  }, {
    key: 'isKeyDown',
    value: function isKeyDown(key) {
      return this.keys[key];
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      var _this2 = this;

      // key events
      document.body.addEventListener("keydown", function (e) {
        _this2.keys[_this2.getKey(e.keyCode)] = true;
      });
      document.body.addEventListener("keyup", function (e) {
        _this2.keys[_this2.getKey(e.keyCode)] = false;
      });
    }
  }]);

  return Input;
})();

document.body.appendChild(renderer.view);

var game = new Game();
var input = new Input();
input.addListeners();

var boxman = new Entity({ sprite: 'boxman', input: input });
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
  var key = keyConfig[e.keyCode];

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

window.addEventListener('keyup', function (e) {
  var key = keyConfig[e.keyCode];

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