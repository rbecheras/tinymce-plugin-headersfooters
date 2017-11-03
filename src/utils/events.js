'use strict'

/**
 * Automatically bind event callbacks implemented in `eventHandlers` module
 * @static
 * @param {Editor} editor The editor instance which listen on
 * @param {Array<function>} eventHandlers An array of event handlers (callback functions) to bind each one on editor object
 */
export function autoBindImplementedEventCallbacks (editor, eventHandlers) {
  for (let eventName in eventHandlers) {
    for (let callbackName in eventHandlers[eventName]) {
      editor.on(eventName, eventHandlers[eventName][callbackName].bind(this))
    }
  }
}
