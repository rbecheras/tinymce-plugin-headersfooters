'use strict'

var units = require('./units')
var $ = window.jQuery

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

module.exports = {
  jQuery: $,
  lockNode: lockNode,
  unlockNode: unlockNode,
  addUnselectableCSSClass: addUnselectableCSSClass,
  resetMenuItemState: resetMenuItemState,
  autoAddMenuItems: autoAddMenuItems,
  mapMceLayoutElements: mapMceLayoutElements,
  mapPageLayoutElements: mapPageLayoutElements,
  getElementHeight: getElementHeight
}

/**
 * Lock a node
 * @method
 * @mixin
 * @returns {undefined}
 */
function lockNode () {
  var $this = $(this)
  $this.attr('contenteditable', false)
  $this.addClass('unselectable')
}

/**
 * Unlock a node
 * @method
 * @mixin
 * @returns {undefined}
 */
function unlockNode () {
  var $this = $(this)
  $this.attr('contenteditable', true)
  $this.removeClass('unselectable')
  $this.focus()
}

/**
 * Create and apply the unselectable CSS class to the active document
 * @method
 * @static
 * @param {Editor} editor The tinymce active editor
 * @returns {undefined}
 */
function addUnselectableCSSClass (editor) {
  var head = $('head', editor.getDoc())
  var unselectableCSSRules = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
  var style = $('<style>').attr('type', 'text/css').html(unselectableCSSRules)
  style.appendTo(head)
}

/**
 * Reset a menu item state
 * @method
 * @static
 * @param {Editor} editor The tinymce active editor
 * @param {String} selector The selector to use to DO WHAT ?
 * @TODO finish to describe the selector parameter
 */
function resetMenuItemState (editor, selector) {
  var selectedElement = editor.selection.getStart()
  var $sel = $(selectedElement)
  var parents = $sel.parents(selector)
  this.disabled(!parents.length)
}

/**
 * Add the plugin's menu items
 */
function autoAddMenuItems () {
  for (var itemName in this.menuItemsList) {
    this.editor.addMenuItem(itemName, this.menuItemsList[itemName])
  }
}

function mapMceLayoutElements (bodyClass, stackedLayout) {
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

function mapPageLayoutElements (pageLayout) {
  pageLayout.pageWrapper = $('.page-wrapper')
  pageLayout.pagePanel = $('.page-panel')

  pageLayout.headerWrapper = $('.header-wrapper')
  pageLayout.headerPanel = $('.header-panel')

  pageLayout.bodyWrapper = $('.body-wrapper')
  pageLayout.bodyPanel = $('.body-panel')

  pageLayout.footerWrapper = $('.footer-wrapper')
  pageLayout.footerPanel = $('.footer-panel')
}

function getElementHeight (element, win, isBorderBox) {
  win = win || window
  var style = win.getComputedStyle(element)
  var height = px(style.height) // +
    // px(style.paddingTop) + px(style.paddingBottom) +
    // px(style.marginTop) + px(style.marginBottom)
  return height

  function px (style) {
    return Number(units.getValueFromStyle(style))
  }
}
