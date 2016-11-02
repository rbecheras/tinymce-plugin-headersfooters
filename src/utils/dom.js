'use strict'

module.exports = {
  elementIsEmpty: elementIsEmpty
}

/**
 * Tells if an element is empty (pure JS)
 * i.e. if:
 * - it contains nothing,
 * - or it contains an empty element,
 * - or the only contained element is the mceBogus element
 * @method
 * @static
 * @param {Node} node The node to check if it is empty
 * @param {window} [contextWindow] The contextual window for this element
 * @returns {Boolean} true if the element is concidered empty.
 */
function elementIsEmpty (element, contextWindow) {
  if (!contextWindow) {
    contextWindow = window
  }
  if (!element || !(element instanceof contextWindow.HTMLElement)) {
    throw new TypeError('argument 1 must be an instance of Node.')
  }
  return !element.textContent.trim()
}
