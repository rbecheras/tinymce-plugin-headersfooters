'use strict'

var HeadFoot = require('./HeadFoot')

var $ = window.jQuery

module.exports = Header

/**
 * Header class
 * @constructor
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 */
function Header (editor, _documentBody, existingElement) {
  HeadFoot.call(this, editor, _documentBody, existingElement)
  $(this.node).prependTo(this._documentBody)
}

Header.prototype = Object.create(HeadFoot.prototype)

/**
 * Create a new node for the header.
 * @private
 * @method
 * @override HeadFoot.prototype._createNode()
 */
Header.prototype._createNode = function () {
  HeadFoot.prototype._createNode.call(this)
  $(this.node).attr('data-headfoot-header', true)
}
