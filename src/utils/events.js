'use strict'

module.exports = {
  autoBindImplementedEventCallbacks: autoBindImplementedEventCallbacks
}

/**
 * Automatically bind event callbacks implemented in `eventHandlers` module
 */
function autoBindImplementedEventCallbacks (editor, eventHandlers) {
  for (var eventName in eventHandlers) {
    for (var callbackName in eventHandlers[eventName]) {
      editor.on(eventName, eventHandlers[eventName][callbackName].bind(this))
    }
  }
}
