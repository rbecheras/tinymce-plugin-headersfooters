'use strict'

var $ = window.jQuery

/**
 * User interface module
 * @module
 * @name ui
 * @description A module to provide configured ui elements to the plugin
 */

module.exports = {
  lockNode: lockNode,
  unlockNode: unlockNode,
  addUnselectableCSSClass: addUnselectableCSSClass,
  resetMenuItemState: resetMenuItemState,
  autoAddMenuItems: autoAddMenuItems
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
