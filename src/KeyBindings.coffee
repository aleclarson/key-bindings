
PureObject = require "PureObject"
assertType = require "assertType"
keypress = require "keypress"
Type = require "Type"
bind = require "bind"
fs = require "fs"

MODIFIERS = ["ctrl", "meta", "shift"]

type = Type "KeyBindings"

type.defineArgs
  stream: Object.Kind
  bindings: Object.Maybe

type.defineValues (stream) ->

  isEnabled: yes

  _callbacks: Object.create null

type.initInstance (stream, bindings) ->
  bindings and @extend bindings
  keypress stream
  stream.setRawMode? yes
  stream.on "keypress", bind.method this, "_onKeyPress"
  stream.resume()
  @_callbacks["c+ctrl"] = ->
    stream.pause()
    process.exit()
  return

type.defineMethods

  extend: (bindings) ->
    for name, callback of bindings
      assertType callback, Function.Kind
      @_callbacks[name] = callback
    return

  _onKeyPress: (char, key) ->
    return unless @isEnabled

    name = char
    if key
      name = key.name
      for modifier in MODIFIERS
        continue if key[modifier] isnt yes
        name += "+" + modifier

    callback = @_callbacks[name]
    if callback instanceof Function then callback()
    else @_callbacks.else? name, { char, key }
    @_callbacks.always? name, { char, key }
    return

module.exports = type.build()
