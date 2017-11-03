'use strict'

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

import * as units from './units'

const $ = window.jQuery

export {$ as jQuery}

/**
 * Lock a node
 * @mixin
 * @returns {undefined}
 */
export function lockNode () {
  let $this = $(this)
  $this.attr('contenteditable', false)
  $this.addClass('unselectable')
}

/**
 * Unlock a node
 * @mixin
 * @returns {undefined}
 */
export function unlockNode () {
  let $this = $(this)
  $this.attr('contenteditable', true)
  $this.removeClass('unselectable')
  $this.focus()
}

/**
 * Create and apply the unselectable CSS class to the active document
 * @param {Editor} editor The tinymce active editor
 * @returns {undefined}
 */
export function addUnselectableCSSClass (editor) {
  const unselectableCSSRules = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
  let head = $('head', editor.getDoc())
  let style = $('<style>').attr('type', 'text/css').html(unselectableCSSRules)
  style.appendTo(head)
}

/**
 * Reset a menu item state
 * @param {Editor} editor The tinymce active editor
 * @param {String} selector The selector to use to DO WHAT ?
 * @TODO finish to describe the selector parameter
 */
export function resetMenuItemState (editor, selector) {
  let selectedElement = editor.selection.getStart()
  let $sel = $(selectedElement)
  let parents = $sel.parents(selector)
  this.disabled(!parents.length)
}

/**
 * Add the plugin's menu items
 */
export function autoAddMenuItems () {
  for (let itemName in this.menuItemsList) {
    this.editor.addMenuItem(itemName, this.menuItemsList[itemName])
  }
}

export function mapMceLayoutElements (bodyClass, stackedLayout) {
  stackedLayout.root = $('.' + bodyClass)
  stackedLayout.wrapper = stackedLayout.root.children('.mce-tinymce')
  stackedLayout.layout = stackedLayout.wrapper.children('.mce-stack-layout')
  stackedLayout.menubar = stackedLayout.layout.children('.mce-stack-layout-item.mce-menubar.mce-toolbar')
  stackedLayout.toolbar = stackedLayout.layout.children('.mce-stack-layout-item.mce-toolbar-grp')
  stackedLayout.editarea = stackedLayout.layout.children('.mce-stack-layout-item.mce-edit-area')
  stackedLayout.iframe = stackedLayout.editarea.children('iframe')
  stackedLayout.statusbar = {}
  stackedLayout.statusbar.wrapper = stackedLayout.layout.children('.mce-stack-layout-item.mce-statusbar')
  stackedLayout.statusbar.flowLayout = stackedLayout.statusbar.wrapper.children('.mce-flow-layout')
  stackedLayout.statusbar.path = stackedLayout.statusbar.wrapper.children('.mce-path')
  stackedLayout.statusbar.wordcount = stackedLayout.layout.children('.mce-wordcount')
  stackedLayout.statusbar.resizehandle = stackedLayout.layout.children('.mce-resizehandle')
}

export function mapPageLayoutElements (pageLayout) {
  pageLayout.pageWrapper = $('.page-wrapper')
  pageLayout.pagePanel = $('.page-panel')

  pageLayout.headerWrapper = $('.header-wrapper')
  pageLayout.headerPanel = $('.header-panel')
  setTimeout(() => {
    pageLayout.headerIframe = pageLayout.headerPanel.find('iframe')
  }, 100)

  pageLayout.bodyWrapper = $('.body-wrapper')
  pageLayout.bodyPanel = $('.body-panel')

  pageLayout.footerWrapper = $('.footer-wrapper')
  pageLayout.footerPanel = $('.footer-panel')
  setTimeout(() => {
    pageLayout.footerIframe = pageLayout.footerPanel.find('iframe')
  }, 100)
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
  if (!isNodeInstance(parentNode)) throw new TypeError('second argument must be a Node instance')
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
  if (!isNodeInstance(textNode)) throw new TypeError('second argument must be a Node instance')
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
export function isNodeInstance (object) {
  let rv = false
  try {
    let windowInstance = getNodeWindow(object)
    rv = object instanceof windowInstance.Node
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err
    }
  }
  return rv
}
