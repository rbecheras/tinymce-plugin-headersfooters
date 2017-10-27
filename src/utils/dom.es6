'use strict'

/**
 * Tells if an element is empty (pure JS)
 * i.e. if:
 * - it contains nothing,
 * - or it contains an empty element,
 * - or the only contained element is the mceBogus element
 * @method
 * @static
 * @param {HTMLElement} element The node element to check if it is empty
 * @param {window} [contextWindow] The contextual window for this element
 * @returns {Boolean} true if the element is considered empty.
 */
export function elementIsEmpty (element, contextWindow) {
  if (!contextWindow) { contextWindow = window }
  if (!(element instanceof window.HTMLElement || element instanceof contextWindow.HTMLElement)) {
    console.error('TypeError element: ', element, 'contextWindow', contextWindow)
    throw new TypeError('argument 1 must be an instance of HTMLElement.')
  }
  return !element.textContent.trim()
}

/**
 * Get the closest parent of an element beeing not a bookmark element.
 * If the element itself is not a bookmark, it is returned as its own parent.
 * @method
 * @static
 * @param {jQuery} $bookmarkElement the bookmark (or not) element.
 * @returns {HTMLElement} the closest parent beeing not a bookmark or itself
 */
export function getClosestNotBookmarkParent ($, bookmarkElement) {
  let $bookmarkElement = $(bookmarkElement)
  let $parents = $bookmarkElement.parents()
  $parents.splice(0, 0, bookmarkElement)
  let parents = $parents.filter((i, el) => $(el).attr('data-mce-type') !== 'bookmark')
  return parents.length ? parents[0] : null
}
