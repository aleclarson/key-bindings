var MODIFIERS, Type, assertType, keypress, type;

assertType = require("assertType");

keypress = require("keypress");

Type = require("Type");

MODIFIERS = ["ctrl", "meta", "shift"];

type = Type("KeyBindings");

type.defineValues({
  isEnabled: true,
  _bindingCallbacks: function() {
    return Object.create(null);
  }
});

type.defineProperties({
  stream: {
    value: null,
    didSet: function(stream, previous) {
      if (stream === previous) {
        return;
      }
      if (stream) {
        keypress(stream);
        stream.setRawMode(true);
        stream.on("keypress", this._onKeyPress.bind(this));
        return stream.resume();
      } else if (previous) {
        previous.off("keypress", this._onKeyPress.bind(this));
        previous.setRawMode(false);
        return previous.pause();
      }
    }
  }
});

type.initInstance(function(bindings) {
  return this.extend(bindings);
});

type.defineMethods({
  extend: function(bindings) {
    var callback, name;
    assertType(bindings, Object);
    for (name in bindings) {
      callback = bindings[name];
      this._bindingCallbacks[name] = callback;
    }
  },
  _onKeyPress: function(char, key) {
    var base, base1, bindingName, callback, i, isModified, len, modifier;
    if (!this.isEnabled) {
      return;
    }
    isModified = false;
    bindingName = char;
    if (key) {
      bindingName = key.name;
      for (i = 0, len = MODIFIERS.length; i < len; i++) {
        modifier = MODIFIERS[i];
        if (key[modifier] !== true) {
          continue;
        }
        isModified = true;
        bindingName += "+" + modifier;
      }
    }
    callback = this._bindingCallbacks[bindingName];
    if (callback instanceof Function) {
      callback();
    } else {
      if (typeof (base = this._bindingCallbacks)["else"] === "function") {
        base["else"](bindingName, {
          char: char,
          key: key
        });
      }
    }
    if (typeof (base1 = this._bindingCallbacks).always === "function") {
      base1.always(bindingName, {
        char: char,
        key: key
      });
    }
  }
});

module.exports = type.build();

//# sourceMappingURL=../../map/src/KeyBindings.map
