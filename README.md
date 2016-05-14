
# key-bindings 1.1.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

```coffee
KeyBindings = require "key-bindings"

keys = KeyBindings

  "f+ctrl": ->
    # Supports 'ctrl', 'shift', and 'meta' modifier keys.
    # You can even use multiple modifiers at once! (eg: "f+ctrl+shift")

# Add more bindings later on.
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

---

**TODO:** Add more documentation?
