
{ isKind, isType } = require "type-utils"
NamedFunction = require "NamedFunction"
keypress = require "keypress"
define = require "define"
modifiers = ["ctrl", "meta", "shift"]

KeyBindings = NamedFunction "KeyBindings", (keys) ->

  return new KeyBindings keys unless isKind this, KeyBindings

  define this, ->

    @options = configurable: no

    @
      isEnabled: yes

    @enumerable = no

    @
      _map: value: {}

      _handleKeypress: (ch, key) ->

        return unless @isEnabled

        hasModifier = no

        command = ch

        if key?
          command = key.name
          for modifier in modifiers
            if key[modifier] is yes
              hasModifier = yes
              command += "+" + modifier

        action = @_map[command]

        if isKind action, Function
          action.call this

        else
          @_map.else?.call this, { ch, key, command }

        @_map.always?.call this, { ch, key, command }

  @add keys

  this

define KeyBindings.prototype, ->

  @options = configurable: no

  @
    stream:
      value: null
      didSet: (stream, previous) ->

        return if stream is previous

        if stream?
          keypress stream
          stream.setRawMode yes
          stream.on "keypress", @_handleKeypress.bind this
          stream.resume()

        else if previous?
          previous.off "keypress", @_handleKeypress.bind this
          previous.setRawMode no
          previous.pause()

  @writable = no

  @
    add: (keys = {}) ->
      throw TypeError "'keys' must be an Object" unless isType keys, Object
      @_map[key] = action for key, action of keys
      return

define module, ->

  @options =
    configurable: no
    writable: no

  @
    exports: KeyBindings
