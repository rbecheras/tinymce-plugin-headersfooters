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
  if (!node || !node.ownerDocument || !node.ownerDocument.defaultView || !node.ownerDocument.defaultView.Node || !(node instanceof node.ownerDocument.defaultView.Node)) {
    throw new TypeError('first arg must be a node')
  }

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
