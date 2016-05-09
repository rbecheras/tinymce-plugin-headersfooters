'use strict'

var ui = require('../utils/ui')

var $ = window.jquery

module.exports = HeadFoot

/**
 * Abstract class to inherit Header and Footer sub classes from.
 * @constructor
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 */
function HeadFoot (editor, documentBody, existingElement) {
  // bind useful vars
  var that = this
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
  $(this.node).dblclick(function () {
    console.log('double click on node', that.node)
    that.enterNode()
  })
}

/**
 * Create a new node for an header or a footer.
 * @private
 * @method
 */
HeadFoot.prototype._createNode = function () {
  this.node = $('<section>')
    .attr('data-headfoot', true)
    .attr('data-headfoot-pristine', true)
    .html('Double-click to edit this content')[0]
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

  this._editor.plugins.paginate.disableWatchPage()
  ui.lockNode.call(this._editor.plugins.paginate.getCurrentPage().content())
  ui.unlockNode.call(this.node)

  headfootContent = this.node.firstChild
  if (!headfootContent) {
    throw new Error('no child is not allowed in a headfoot')
  }
  this._editor.selection.select(headfootContent)
  if ($(this.node).attr('data-headfoot-pristine')) {
    // this._editor.selection.setContent('')
    $(this.node).removeAttr('data-headfoot-pristine')
  } else {
    this._editor.selection.collapse(true)
  }
  console.log('configure livenode', this._editor.plugins.paginate.getCurrentPage().content())
  currentPageContent = this._editor.plugins.paginate.getCurrentPage().content()
  $(currentPageContent).click(function () {
    console.log('paginate.getCurrentPage().content() clicked')
    that.liveNode()
  })
}

/**
 * Do the inverse of .enterNode(). Disable edition for the header or footer, and re-enable it for the current page.
 * @method
 * @returns void
 */
HeadFoot.prototype.liveNode = function () {
  console.info('living node'); console.log(this.node)
  this._editor.plugins.paginate.enableWatchPage()
  ui.lockNode.call(this.node)
  ui.unlockNode.call(this._editor.plugins.paginate.getCurrentPage().content())
}
