'use strict'

import UnitsUtils from './UnitsUtils'
import ReflectionUtils from './ReflectionUtils'

/**
 * This static class exports utilities to inspect or manupulate the DOM.
 * @static
 */
export default class DomUtils {
  /**
   * Tells if an element is empty (pure JS)
   * i.e. if:
   * - it contains nothing,
   * - or it contains an empty element,
   * - or the only contained element is the mceBogus element
   * @method
   * @static
   * @memberof dom.utils
   * @param {HTMLElement} element The node element to check if it is empty
   * @param {window} [contextWindow] The contextual window for this element
   * @returns {Boolean} true if the element is considered empty.
   */
  static elementIsEmpty (element, contextWindow) {
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
  static getClosestNotBookmarkParent ($, bookmarkElement) {
    let $bookmarkElement = $(bookmarkElement)
    let $parents = $bookmarkElement.parents()
    $parents.splice(0, 0, bookmarkElement)
    let parents = $parents.filter((i, el) => $(el).attr('data-mce-type') !== 'bookmark')
    return parents.length ? parents[0] : null
  }

  /**
   * Focus to bottom given an editor reference
   * @param {external:Editor} editor The given editor to focus on its bottom
   * @returns {void}
   */
  static focusToBottom (editor) {
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
      let textnodes = DomUtils.getTextNodes(lastChild)

      // set Cursor to last position
      let lastTextNode = textnodes[textnodes.length - 1]
      let lastTextNodeContentLength = lastTextNode.textContent.length
      cursorLocation = lastTextNode
      cursorLocationOffset = lastTextNodeContentLength
    }

    // if cursorLocation is undefinded, the location will be at top of the document
    editor.selection.setCursorLocation(cursorLocation, cursorLocationOffset)
  }

  /**
   * Get the text nodes of a given parent node
   * @param {Node} node Theh given parent node to get it child nodes
   * @param {Number} [nodeType=3] An optional node type other that 3 (text node)
   * @param {Array} result The result array to fill.
   * @see https://developer.mozilla.org/fr/docs/Web/API/Node/nodeType
   */
  static getTextNodes (node, nodeType, result) {
    if (!ReflectionUtils.isInstanceOf(node, 'Node')) throw new TypeError('first argument must be a Node instance')

    let children = node.childNodes
    nodeType = nodeType || 3
    result = !result ? [] : result
    if (node.nodeType === nodeType) {
      result.push(node)
    }
    for (let i = 0; i < children.length; i++) {
      result = DomUtils.getTextNodes(children[i], nodeType, result)
    }
    return result
  }

  /**
   * Provides the real height of an element in function of its border-box property, without the unit digits.
   * @example
   * getElementHeight(document.body, window)
   * // => `12` but not `12px`
   * @todo complete implementation in function of `isBorderBox`
   * @param {HTMLElement} element
   * @param {Window} win
   * @param {boolean} isBorderBox
   * @returns {Number} the element height in pixels
   */
  static getElementHeight (element, win, isBorderBox) {
    win = win || window
    let style = win.getComputedStyle(element)
    let height = px(style.height) // +
      // px(style.paddingTop) + px(style.paddingBottom) +
      // px(style.marginTop) + px(style.marginBottom)
    return height

    function px (style) {
      return Number(UnitsUtils.getValueFromStyle(style))
    }
  }

  /**
   * Cut the first node of a given Node and returns it back
   * @param {object} $ jQuery instance matching the given node
   * @param {Node} parentNode the parent node to cut its first child node
   * @returns {Node} the first child node
   * @throws {TypeError} if the second argument is not a Node instance
   */
  static cutFirstNode ($, parentNode) {
    if (!ReflectionUtils.isInstanceOf(parentNode, 'Node')) throw new TypeError('second argument must be a Node instance')
    let firstNode
    if (parentNode.childNodes.length) {
      firstNode = parentNode.childNodes[0]
      firstNode && $(firstNode).remove()
    } else {
      console.error({parentNode})
      throw new Error('parentNode has no childNodes')
    }

    return firstNode
  }

  /**
   * Cut the last node of a given Node and returns it back
   * @param {object} $ jQuery instance matching the given node
   * @param {Node} parentNode the parent node to cut its last child node
   * @returns {Node} the last child node
   * @throws {TypeError} if the second argument is not a Node instance
   */
  static cutLastNode ($, parentNode) {
    if (!ReflectionUtils.isInstanceOf(parentNode, 'Node')) throw new TypeError('second argument must be a Node instance')
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
  static cutLastWord ($, textNode) {
    if (!ReflectionUtils.isInstanceOf(textNode, 'Node')) throw new TypeError('second argument must be a Node instance')
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
  static getNodeWindow (node) {
    if (node === undefined) throw new TypeError('first argument is undefined but must be an instance of Node')
    if (node && node.ownerDocument && node.ownerDocument.defaultView) {
      return node.ownerDocument.defaultView
    } else {
      throw new TypeError('first argument seems not to be a Node element in any context window')
    }
  }

  /**
   * Create a new transaction on a given editor, but given an async callback
   * @async
   * @param {external:Editor} editor The working editor instance
   * @param {function} asyncCallback An async callback
   * @returns {Promise} a promise resolved once the transaction is done
   * @example A
   * await editorTransactAsync(editor, async () => {
   *   foo = await bar()
   *   foobar = foo()
   * })
   * @example B
   * async function myAsyncCallback () {
   *   return bar().then(foo => foobar = foo())
   * }
   * await editorTransactAsync(editor, myAsyncCallback)
   */
  static async editorTransactAsync (editor, asyncCallback) {
    return new Promise((resolve, reject) => {
      editor.undoManager.transact(() => {
        asyncCallback()
        .then(result => resolve(result))
        .catch(e => reject(e))
      })
    })
  }
}

DomUtils.jQuery = window.jQuery
