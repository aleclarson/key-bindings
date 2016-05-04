
# key-bindings v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```sh
npm install aleclarson/key-bindings#1.0.0
```

&nbsp;

## usage

```CoffeeScript
KeyBindings = require "key-bindings"

keys = KeyBindings

  "f+ctrl": ->
    # Do something crazy.

# Add more key bindings.
keys.add

  always: (info) ->
    # This is called for every keystroke.

  else: (info) ->
    # This is called when a keystroke doesn't have a binding.

# Set input stream.
keys.stream = process.stdin

# Remove input stream.
keys.stream = null

# Stop handling keystrokes, but keep `keys.stream` set.
keys.isEnabled = no
```

**NOTE:** Adding a key binding that is already added results in overwriting the previous binding.
