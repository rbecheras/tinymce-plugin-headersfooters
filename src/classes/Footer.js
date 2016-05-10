'use strict'

var HeadFoot = require('./HeadFoot')

var $ = window.jQuery

module.exports = Footer

/**
 * Footer class
 * @constructor
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 */
function Footer (editor, _documentBody, existingElement) {
  HeadFoot.call(this, editor, _documentBody, existingElement)
  $(this.node).appendTo(this._documentBody)
}

Footer.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the footer.
 * @private
 * @method
 * @override HeadFoot.prototype._createNode()
 */
Footer.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-footer', true)
}
