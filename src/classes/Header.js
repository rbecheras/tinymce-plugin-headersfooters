'use strict'

var HeadFoot = require('./HeadFoot')

// var $ = window.jQuery

module.exports = Header

// Prototypal Inheritance
Header.prototype = Object.create(HeadFoot.prototype)

/**
 * Header class
 * @class
 * @augments HeadFoot
 * @param {Editor} editor The current editor
 * @param {DOMNode} [nodeElement]
 */
function Header (editor, nodeElement) {
  HeadFoot.call(this, editor, nodeElement)
}
