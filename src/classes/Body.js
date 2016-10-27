'use strict'

var HeadFoot = require('./HeadFoot')

var $ = window.jQuery

module.exports = Body

/**
 * Body class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function Body (editor, _documentBody, existingElement, hasHeader, hasFooter, header) {
  HeadFoot.call(this, editor, _documentBody, existingElement)

  var hasBoth = hasHeader && hasFooter
  var hasNoOne = !hasHeader && !hasFooter
  var hasJustHeader = hasHeader && !hasFooter
  var hasJustFooter = !hasHeader && hasFooter

  if (hasBoth || hasJustHeader) {
    $(this.node).insertAfter(header)
  } else if (hasNoOne || hasJustFooter) {
    $(this.node).prependTo(this._documentBody)
  }
}

Body.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the body.
 * @private
 * @method
 * @override
 */
Body.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-body', true)
}
