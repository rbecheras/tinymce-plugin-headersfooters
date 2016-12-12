'use strict'

var HeadFoot = require('./HeadFoot')
var HeadFoot_protected = require('./HeadFootProtected')

var $ = window.jQuery

module.exports = Header

// Prototypal Inheritance
Header.prototype = Object.create(HeadFoot.prototype)

// Public API
Header.prototype._createNode = _createNode

// Private API
// _createNode()

/**
 * Header class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function Header (editor, _documentBody, existingElement) {
  HeadFoot.call(this, editor, _documentBody, existingElement)
  $(this.node).prependTo(this._documentBody)
}

/**
 * Create a new node for the header.
 * @private
 * @method
 * @override
 */
function _createNode () {
  HeadFoot_protected.createNode.call(this)
  $(this.node).attr('data-headfoot-header', true)
}
