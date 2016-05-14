
assertType = require "assertType"
keypress = require "keypress"
Type = require "Type"

MODIFIERS = ["ctrl", "meta", "shift"]

type = Type "KeyBindings"

type.defineValues

  isEnabled: yes

  _bindingCallbacks: -> Object.create null

type.defineProperties

  stream:
    value: null
    didSet: (stream, previous) ->
      return if stream is previous
      if stream
        keypress stream
        stream.setRawMode yes
        stream.on "keypress", @_onKeyPress.bind this
        stream.resume()
      else if previous
        previous.off "keypress", @_onKeyPress.bind this
        previous.setRawMode no
        previous.pause()

type.initInstance (bindings) ->

  @extend bindings

type.defineMethods

  extend: (bindings) ->
    assertType bindings, Object
    for name, callback of bindings
      @_bindingCallbacks[name] = callback
    return

  _onKeyPress: (char, key) ->

    return unless @isEnabled

    isModified = no

    bindingName = char

    if key
      bindingName = key.name
      for modifier in MODIFIERS
        continue if key[modifier] isnt yes
        isModified = yes
        bindingName += "+" + modifier

    callback = @_bindingCallbacks[bindingName]
    if callback instanceof Function then callback()
    else @_bindingCallbacks.else? bindingName, { char, key }
    @_bindingCallbacks.always? bindingName, { char, key }
    return

module.exports = type.build()
