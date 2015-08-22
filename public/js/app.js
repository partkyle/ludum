// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.

'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Game = (function () {
  function Game(input) {
    _classCallCheck(this, Game);

    this.entities = [];
    this.stage = new PIXI.Container();
    this.now = new Date();

    this.width = 800;
    this.height = 600;

    this.renderer = new PIXI.autoDetectRenderer(this.width, this.height, { backgroundColor: 0x10ffffff });

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.body.appendChild(this.renderer.view);
  }

  _createClass(Game, [{
    key: 'addEntity',
    value: function addEntity(entity) {
      this.entities.push(entity);
      this.stage.addChild(entity.sprite);
    }
  }, {
    key: 'update',
    value: function update() {
      var _this = this;

      var dt = (new Date() - this.now) / 1000.0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entity = _step.value;

          entity.update(dt);
        }
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

      this.now = new Date();

      setTimeout(function () {
        return _this.update();
      }, 10);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      requestAnimationFrame(function () {
        return _this2.render();
      });
      this.renderer.render(this.stage);
    }
  }, {
    key: 'start',
    value: function start() {
      this.update();
      this.render();
    }
  }]);

  return Game;
})();

var Entity = (function () {
  function Entity(options) {
    _classCallCheck(this, Entity);

    this.texture = PIXI.Texture.fromImage('assets/' + options.sprite + '.png');
    this.sprite = new PIXI.Sprite(this.texture);

    // this.sprite.position = options.position || {x: 0, y: 0}

    this.speed = 3000;
    this.drag = 5;
    this.velocity = { x: 0, y: 0 };
    this.accel = { x: 0, y: 0 };

    this.attack = false;

    this.max_scale = 5;
    this.min_scale = 1;
    this.scale = this.min_scale;

    var size = this.size();

    this.position = { x: size.width / 2, y: size.height / 2 };

    this.accel_calc = {};
    this.drag_calc = {};
    this.delta_calc = {};
  }

  _createClass(Entity, [{
    key: 'size',
    value: function size() {
      this.size.width = 64 * this.scale;
      this.size.height = 52 * this.scale;
      return this.size;
    }
  }, {
    key: 'update',
    value: function update(dt) {
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

      this.position.x = Math.round(this.position.x + delta.x);
      this.position.y = Math.round(this.position.y + delta.y);

      this.velocity.x = Math.round(this.velocity.x + accel.x * dt);
      this.velocity.y = Math.round(this.velocity.y + accel.y * dt);

      if (this.attack) {
        this.scale = this.max_scale;
      } else {
        this.scale = this.min_scale;
      }

      this.sprite.scale.x = this.scale;
      this.sprite.scale.y = this.scale;

      var size = this.size();

      this.sprite.position.x = this.position.x - size.width / 2;
      this.sprite.position.y = this.position.y - size.height / 2;
    }
  }]);

  return Entity;
})();

var ControlledEntity = (function (_Entity) {
  _inherits(ControlledEntity, _Entity);

  function ControlledEntity(options) {
    _classCallCheck(this, ControlledEntity);

    _get(Object.getPrototypeOf(ControlledEntity.prototype), 'constructor', this).call(this, options);
    this.input = options.input;
  }

  _createClass(ControlledEntity, [{
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
      } else {
        this.attack = false;
      }

      _get(Object.getPrototypeOf(ControlledEntity.prototype), 'update', this).call(this, dt);

      this.accel.x = 0;
      this.accel.y = 0;
    }
  }]);

  return ControlledEntity;
})(Entity);

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
      var _this3 = this;

      // key events
      document.body.addEventListener("keydown", function (e) {
        _this3.keys[_this3.getKey(e.keyCode)] = true;
      });
      document.body.addEventListener("keyup", function (e) {
        _this3.keys[_this3.getKey(e.keyCode)] = false;
      });
    }
  }]);

  return Input;
})();

var game = new Game();
var input = new Input();
input.addListeners();

var boxman = new ControlledEntity({ sprite: 'boxman2', input: input });
console.log(boxman);
console.log(boxman.sprite);
game.addEntity(boxman);

for (var i = 0; i < 5; i++) {
  var enemy = new Entity({ 'sprite': 'boxman2' });
  enemy.position.x = Math.floor(Math.random() * game.width);
  enemy.position.y = Math.floor(Math.random() * game.height);
  game.addEntity(enemy);
}

// kick off the animation loop (defined below)
game.start();