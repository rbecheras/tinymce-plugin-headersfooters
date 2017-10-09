'use strict'

var HeadFoot = require('./HeadFoot')

// var $ = window.jQuery

module.exports = Footer

// Prototypal Inheritance
Footer.prototype = Object.create(HeadFoot.prototype)

/**
 * Footer class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMElement} documentBody The document body for this documentBody
 * @param {DOMNode} [existingElement] The optional existing element that constitute a header of a footer and should be loaded from it
 * @property {Editor} _editor The current editor
 * @property {DOMElement}  _documentBody The body element of the current document
 * @property {DOMNode} node The header/footer's node element
 */
function Footer (editor, nodeElement) {
  HeadFoot.call(this, editor, nodeElement)
}
