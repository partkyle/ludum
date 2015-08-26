// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.

'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

function Inner(a, b) {
  return a.x * b.x + a.y * b.y;
}

function LengthSq(vector) {
  return Inner(vector, vector);
}

function Length(vector) {
  Math.sqrt(LengthSq(vector));
}

function tmp() {
  var move_length = Length(delta);
}

function RectanglesIntersect(A, B) {
  return !(B.Max.x < A.Min.x || B.Min.x > A.Max.x || B.Max.y < A.Min.y || B.Min.y > A.Max.y || B.Max.z < A.Min.z || B.Min.z > A.Max.z);
}

var Game = (function () {
  function Game(input) {
    _classCallCheck(this, Game);

    this.entities = [];
    this.stage = new PIXI.Container();
    this.now = new Date();

    this.screen_width = 1200;
    this.screen_height = 900;

    this.renderer = new PIXI.autoDetectRenderer(this.screen_width, this.screen_height, { backgroundColor: 0x10ffffff });

    this.debug_graphics = new PIXI.Graphics();

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.body.appendChild(this.renderer.view);
  }

  _createClass(Game, [{
    key: 'enableDebug',
    value: function enableDebug() {
      this.stage.addChild(this.debug_graphics);
    }
  }, {
    key: 'drawDebug',
    value: function drawDebug() {
      this.debug_graphics.clear();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entity = _step.value;

          if (entity == boxman) {
            this.debug_graphics.beginFill(0x0002f0, .5);
          } else {
            this.debug_graphics.beginFill(0xff00ff, .5);
          }

          var r = entity.rect();

          this.debug_graphics.drawRect(r.Min.x, r.Min.y, r.Max.x - r.Min.x, r.Max.y - r.Min.y);
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
    }
  }, {
    key: 'addEntity',
    value: function addEntity(entity) {
      this.entities.push(entity);

      if (entity.sprite) {
        this.stage.addChild(entity.sprite);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      requestAnimationFrame(function () {
        return _this.render();
      });
      this.renderer.render(this.stage);

      var dt = (new Date() - this.now) / 1000.0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.entities[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var entity = _step2.value;

          entity.collided = false;
          entity.update(dt);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.now = new Date();

      this.drawDebug();
    }
  }, {
    key: 'start',
    value: function start() {
      this.render();
    }
  }]);

  return Game;
})();

var Entity = (function () {
  function Entity(options) {
    _classCallCheck(this, Entity);

    if (options.sprite) {
      this.texture = PIXI.Texture.fromImage('assets/' + options.sprite + '.png');
      this.sprite = new PIXI.Sprite(this.texture);
    }

    this.speed = 3000;
    this.drag = 5;
    this.velocity = { x: 0, y: 0 };
    this.accel = { x: 0, y: 0 };

    this.attack = false;

    this.max_scale = 5;
    this.min_scale = 1;
    this.scale = this.min_scale;

    this._size = { width: 0, height: 0 };
    var size = this.size();

    this.position = { x: size.width / 2.0, y: size.height / 2.0 };

    this.accel_calc = {};
    this.drag_calc = {};
    this.delta_calc = {};

    this.game = options.game;
  }

  _createClass(Entity, [{
    key: 'size',
    value: function size() {
      this._size.width = 64 * this.scale;
      this._size.height = 52 * this.scale;
      return this._size;
    }
  }, {
    key: 'rect',
    value: function rect() {
      return { Min: { x: this.position.x - this.size().width / 2.0, y: this.position.y - this.size().height / 2.0 },
        Max: { x: this.position.x + this.size().width / 2.0, y: this.position.y + this.size().height / 2.0 } };
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var accel = this.accel_calc;

      var accel_length = LengthSq(accel);
      if (accel_length > 1.0) {
        accel.x *= 1.0 / Math.sqrt(accel_length);
        accel.y *= 1.0 / Math.sqrt(accel_length);
      }

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

      var new_position = {};
      new_position.x = Math.round(this.position.x + delta.x);
      new_position.y = Math.round(this.position.y + delta.y);

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

      var valid_move = true;

      var me = this.rect();

      var found = false;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = game.entities[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var entity = _step3.value;

          if (entity == this) {
            found = true;
            continue;
          }

          if (found) {
            var them = entity.rect();
            if (RectanglesIntersect(me, them)) {
              valid_move = false;
              entity.velocity.x = this.scale * this.velocity.x;
              entity.velocity.y = this.scale * this.velocity.y;

              if (this.velocity.x == 0 && this.velocity.y == 0 && entity.velocity.x == 0 && entity.velocity.y == 0) {
                var left = 1;
                var up = 1;

                if (this.rect().Min.x <= entity.rect().Min.x) {
                  left = 1;
                }

                if (this.rect().Min.y <= entity.rect().Min.y) {
                  up = 1;
                }

                this.velocity.x = left * 1000;
                this.velocity.y = up * 1000;
                entity.velocity.x = -left * 1000;
                entity.velocity.y = -up * 1000;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (valid_move) {
        this.position.x = new_position.x;
        this.position.y = new_position.y;
      } else {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = -this.velocity.y;
      }

      this.sprite.position.x = this.position.x - size.width / 2.0;
      this.sprite.position.y = this.position.y - size.height / 2.0;

      if (this.sprite.position.x < 0) {
        this.velocity.x = -this.velocity.x;
        this.sprite.position.x = 0;
      }

      if (this.sprite.position.x > this.game.screen_width) {
        this.velocity.x = -this.velocity.x;
        this.sprite.position.x = this.game.screen_width - this.size().x;
      }

      if (this.sprite.position.y < 0) {
        this.velocity.y = -this.velocity.y;
        this.sprite.position.y = 0;
      }

      if (this.sprite.position.y > this.game.screen_height) {
        this.velocity.y = -this.velocity.y;
        this.sprite.position.y = this.game.screen_height - this.size().y;
      }
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

    // 90: "ZOOM",
    // 70: "FOLLOW",
    this.addListeners();
  }

  _createClass(Input, [{
    key: 'getKey',
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

var RandomInputs = (function (_Input) {
  _inherits(RandomInputs, _Input);

  function RandomInputs(options) {
    _classCallCheck(this, RandomInputs);

    _get(Object.getPrototypeOf(RandomInputs.prototype), 'constructor', this).call(this, options);
  }

  _createClass(RandomInputs, [{
    key: 'rando',
    value: function rando() {
      var _this3 = this;

      setTimeout(function () {
        return _this3.rando();
      }, 1000);

      if (Math.floor(Math.random() * 100) % 100) {
        for (var k in this.keys) {
          this.keys[k] = false;
        }
      }

      var move = Math.floor(Math.random() * 100);

      if (move < 24) {
        this.keys['LEFT'] = true;
      } else if (move < 48) {
        this.keys['RIGHT'] = true;
      } else if (move < 72) {
        this.keys['UP'] = true;
      } else if (move < 96) {
        this.keys['DOWN'] = true;
      } else {
        this.keys['SPACE'] = true;
      }
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.rando();
    }
  }]);

  return RandomInputs;
})(Input);

var game = new Game();
var input = new Input();

// wall entities
// let left_wall = new Entity

var boxman = new ControlledEntity({ sprite: 'boxman2', input: input, game: game });
boxman.position.x = 200;
boxman.position.y = 200;
game.addEntity(boxman);

for (var i = 0; i < 10; i++) {
  var randomInputs = new RandomInputs();
  var enemy = new ControlledEntity({ 'sprite': 'boxman2', game: game, input: randomInputs });
  enemy.position.x = Math.floor(Math.random() * (game.screen_width - 1)) + 1;
  enemy.position.y = Math.floor(Math.random() * (game.screen_height - 1)) + 1;
  game.addEntity(enemy);
}

game.enableDebug();

// kick off the animation loop (defined below)
game.start();