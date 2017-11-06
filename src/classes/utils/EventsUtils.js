'use strict'

/**
 * This static class exports utilities to work with events.
 * @static
 */
export default class EventsUtils {
  /**
   * Automatically bind event callbacks implemented in `eventHandlers` module
   * @static
   * @param {Editor} editor The editor instance which listen on
   * @param {Array<function>} eventHandlers An array of event handlers (callback functions) to bind each one on editor object
   */
  static autoBindImplementedEventCallbacks (editor, eventHandlers) {
    for (let eventName in eventHandlers) {
      for (let callbackName in eventHandlers[eventName]) {
        editor.on(eventName, eventHandlers[eventName][callbackName].bind(this))
      }
    }
  }
}
