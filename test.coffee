
KeyBindings = require "."

keys = KeyBindings
  always: -> console.log "Keystroke!"
  "c+ctrl": -> process.exit 0

keys.stream = process.stdin

console.log "Resuming stdin"

process.stdin.resume()
