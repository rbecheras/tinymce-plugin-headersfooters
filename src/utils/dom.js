'use strict'

import * as units from './units'

const $ = window.jQuery

export {$ as jQuery}

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
 * @param {jQuery} $ the jQuery instance
 * @param {HTMLElement} bookmarkElement the bookmark (or not) element.
 * @returns {HTMLElement} the closest parent beeing not a bookmark or itself
 */
export function getClosestNotBookmarkParent ($, bookmarkElement) {
  let $bookmarkElement = $(bookmarkElement)
  let $parents = $bookmarkElement.parents()
  $parents.splice(0, 0, bookmarkElement)
  let parents = $parents.filter((i, el) => $(el).attr('data-mce-type') !== 'bookmark')
  return parents.length ? parents[0] : null
}

export function focusToBottom (editor) {
  // get all Textnodes from lastchild, calc length
  const $ = editor.$
  const $body = $(editor.getBody())
  let bodyChildren = $body.children()
  let $bodyChildren = $(bodyChildren).filter((i, node) => {
    return !!$(node).text().trim()
  })
  let $lastChild = $bodyChildren.last()
  let cursorLocation, cursorLocationOffset
  if ($lastChild.length) {
    let lastChild = $lastChild[0]
    let textnodes = getTextNodes(lastChild)

    // set Cursor to last position
    let lastTextNode = textnodes[textnodes.length - 1]
    let lastTextNodeContentLength = lastTextNode.textContent.length
    cursorLocation = lastTextNode
    cursorLocationOffset = lastTextNodeContentLength
  }

  // if cursorLocation is undefinded, the location will be at top of the document
  editor.selection.setCursorLocation(cursorLocation, cursorLocationOffset)
}

export function getTextNodes (node, nodeType, result) {
  if (!isInstanceOf(node, 'Node')) throw new TypeError('first argument must be a Node instance')

  let children = node.childNodes
  nodeType = nodeType || 3
  result = !result ? [] : result
  if (node.nodeType === nodeType) {
    result.push(node)
  }
  for (let i = 0; i < children.length; i++) {
    result = getTextNodes(children[i], nodeType, result)
  }
  return result
}

/**
 * Provides the real height of an element in function of its border-box property, without the unit digits.
 * @example
 * ```js
 * getElementHeight(document.body, window)
 * // => `12` but not `12px`
 * ```
 * @todo complete implementation in function of `isBorderBox`
 * @param {HTMLElement} element
 * @param {Window} win
 * @param {boolean} isBorderBox
 * @returns {Number} the element height in pixels
 */
export function getElementHeight (element, win, isBorderBox) {
  win = win || window
  let style = win.getComputedStyle(element)
  let height = px(style.height) // +
    // px(style.paddingTop) + px(style.paddingBottom) +
    // px(style.marginTop) + px(style.marginBottom)
  return height

  function px (style) {
    return Number(units.getValueFromStyle(style))
  }
}

/**
 * Cut the last node of a given Node and returns it back
 * @param {object} $ jQuery instance matching the given node
 * @param {Node} parentNode the parent node to cut its last child node
 * @returns {Node} the last child node
 * @throws {TypeError} if the second argument is not a Node instance
 */
export function cutLastNode ($, parentNode) {
  if (!isInstanceOf(parentNode, 'Node')) throw new TypeError('second argument must be a Node instance')
  let last
  if (parentNode.childNodes.length) {
    last = parentNode.childNodes[parentNode.childNodes.length - 1]
  } else {
    console.error({parentNode})
    throw new Error('parentNode has no childNodes')
  }
  if (last) {
    $(last).remove()
  } else {
    console.error({last})
    throw new Error('impossible to remove "last" child element')
  }
  return last
}

/**
 * Cut the last word of a given textNode and returns it back
 * @param {object} $ jQuery instance matching the given textNode
 * @param {Node} textNode the text node to cut its last child node
 * @throws {TypeError} if the second argument is not a Node instance
 */
export function cutLastWord ($, textNode) {
  if (!isInstanceOf(textNode, 'Node')) throw new TypeError('second argument must be a Node instance')
  let $el = $(textNode)
  let words = $el.text().split(' ')
  let lastWord = words.pop()
  $el.text(words.join(' '))
  return lastWord
}

/**
 * Get the window from which a node has been instanciated from the constructor window.Node or window.Element
 * @param {Node} node
 * @throws {TypeError} if the node is not a Node instance
 * @returns {Window} the window context for the given node
 */
export function getNodeWindow (node) {
  if (node === undefined) throw new TypeError('first argument is undefined but must be an instance of Node')
  if (node && node.ownerDocument && node.ownerDocument.defaultView) {
    return node.ownerDocument.defaultView
  } else {
    throw new TypeError('first argument seems not to be a Node element in any context window')
  }
}

/**
 * Tells if an object is a Node instance (from any window instance).
 * If you want to know what is the context window where the Node constructor was used (window.Node), use the function `getNodeWindow(node)`
 * @param {object} object any object to test
 * @returns {boolean} true if the object is a Node instance
 */
export function isInstanceOf (object, className) {
  if (typeof object !== 'object') throw new TypeError('first argument must be an object')
  let rv
  let _proto = object
  do {
    _proto = Reflect.getPrototypeOf(_proto)
    if (_proto && _proto.constructor && _proto.constructor.name) {
      if (_proto.constructor.name === className) {
        rv = true
      }
    }
  } while (_proto)
  return rv
}
