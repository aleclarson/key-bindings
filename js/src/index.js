var KeyBindings, NamedFunction, define, isKind, isType, keypress, modifiers, ref;

ref = require("type-utils"), isKind = ref.isKind, isType = ref.isType;

NamedFunction = require("NamedFunction");

keypress = require("keypress");

define = require("define");

modifiers = ["ctrl", "meta", "shift"];

KeyBindings = NamedFunction("KeyBindings", function(keys) {
  if (!isKind(this, KeyBindings)) {
    return new KeyBindings(keys);
  }
  define(this, function() {
    this.options = {
      configurable: false
    };
    this({
      isEnabled: true
    });
    this.enumerable = false;
    return this({
      _map: {
        value: {}
      },
      _handleKeypress: function(ch, key) {
        var action, command, hasModifier, i, len, modifier, ref1, ref2;
        if (!this.isEnabled) {
          return;
        }
        hasModifier = false;
        command = ch;
        if (key != null) {
          command = key.name;
          for (i = 0, len = modifiers.length; i < len; i++) {
            modifier = modifiers[i];
            if (key[modifier] === true) {
              hasModifier = true;
              command += "+" + modifier;
            }
          }
        }
        action = this._map[command];
        if (isKind(action, Function)) {
          action.call(this);
        } else {
          if ((ref1 = this._map["else"]) != null) {
            ref1.call(this, {
              ch: ch,
              key: key,
              command: command
            });
          }
        }
        return (ref2 = this._map.always) != null ? ref2.call(this, {
          ch: ch,
          key: key,
          command: command
        }) : void 0;
      }
    });
  });
  this.add(keys);
  return this;
});

define(KeyBindings.prototype, function() {
  this.options = {
    configurable: false
  };
  this({
    stream: {
      value: null,
      didSet: function(stream, previous) {
        if (stream === previous) {
          return;
        }
        if (stream != null) {
          keypress(stream);
          stream.setRawMode(true);
          stream.on("keypress", this._handleKeypress.bind(this));
          return stream.resume();
        } else if (previous != null) {
          previous.off("keypress", this._handleKeypress.bind(this));
          previous.setRawMode(false);
          return previous.pause();
        }
      }
    }
  });
  this.writable = false;
  return this({
    add: function(keys) {
      var action, key;
      if (keys == null) {
        keys = {};
      }
      if (!isType(keys, Object)) {
        throw TypeError("'keys' must be an Object");
      }
      for (key in keys) {
        action = keys[key];
        this._map[key] = action;
      }
    }
  });
});

define(module, function() {
  this.options = {
    configurable: false,
    writable: false
  };
  return this({
    exports: KeyBindings
  });
});

//# sourceMappingURL=../../map/src/index.map
