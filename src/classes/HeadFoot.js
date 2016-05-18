'use strict'

var ui = require('../utils/ui')

var $ = window.jQuery

module.exports = HeadFoot

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @constructor
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function HeadFoot (editor, documentBody, existingElement) {
  // bind useful vars
  this._editor = editor
  this._documentBody = documentBody

  // load the existing element if it exists or create a new one.
  if (existingElement) {
    this.node = existingElement
  } else {
    this._createNode()
  }

  // live the node and implements the double click handler to switch the contentEditable mode.
  this.liveNode()
  $(this.node).dblclick(this.enterNode.bind(this))
}

/**
 * Create a new node for an header or a footer.
 * @private
 * @method
 */
HeadFoot.prototype._createNode = function () {
  var placeholder = '<p><span style="font-family: calibri; font-size: 12pt;">'
  placeholder += 'Double-click to edit this content'
  placeholder += '</span></p>'

  this.node = $('<section>')
    .attr('data-headfoot', true)
    .attr('data-headfoot-pristine', true)
    .html(placeholder)[0]
}

/**
 * Disable the page edition and enable the edition for the header or the footers
 * @method
 * @returns void
 */
HeadFoot.prototype.enterNode = function () {
  var that = this
  var headfootContent
  var currentPageContent
  var $thisNode = $(this.node)

  // disable paginator watching
  this._editor.plugins.paginate.disableWatchPage()

  // toggle elements states (contentEditable or not)
  $.each(this._editor.plugins.paginate.paginator.getPages(), function () {
    ui.lockNode.call(this)
  })
  ui.unlockNode.call(this.node)

  // select the unlocked node content or not
  headfootContent = this.node.firstChild
  if (!headfootContent) {
    throw new Error('no child is not allowed in a headfoot')
  }
  this._editor.selection.select(headfootContent)
  if ($thisNode.attr('data-headfoot-pristine')) {
    $thisNode.removeAttr('data-headfoot-pristine')
  } else {
    this._editor.selection.collapse(true)
  }

  // bind a click handler to the current page to toggle contentEditable state between header/footer and the page
  currentPageContent = this._editor.plugins.paginate.getCurrentPage().content()
  $(currentPageContent).click(that.liveNode.bind(that))
}

/**
 * Do the inverse of .enterNode(). Disable edition for the header or footer, and re-enable it for the current page.
 * @method
 * @returns void
 */
HeadFoot.prototype.liveNode = function () {
  this._editor.plugins.paginate.enableWatchPage()
  ui.lockNode.call(this.node)
  $.each(this._editor.plugins.paginate.paginator.getPages(), function () {
    ui.unlockNode.call(this)
  })
}
