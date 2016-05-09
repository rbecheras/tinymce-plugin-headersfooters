'use strict'

var Header = require('./Header')
var Footer = require('./Footer')

var $ = window.jquery

module.exports = HeaderFooterFactory

/**
 * HeaderFactory class. The aim of this class is to manage the document header and footer.
 * @constructor
 * @param {Editor} editor The current editor
 */
function HeaderFooterFactory (editor) {
  this._editor = editor
  this._hasHeader = false
  this._hasFooter = false
}

/**
 * Load an existing header or footer depending of its nature, from its DOM element.
 * @method
 * @param {DOMElement} element
 * @returns void
 */
HeaderFooterFactory.prototype.loadElement = function (element) {
  var $el = $(element)
  if ($el.attr('data-headfoot-header')) {
    this._hasHeader = true
    this.header = new Header(this._editor, this._editor.getBody(), element)
  } else if ($el.attr('data-headfoot-footer')) {
    this._hasFooter = true
    this.footer = new Footer(this._editor, this._editor.getBody(), element)
  } else throw new Error('This element is not a header neither a footer element.')
}

/**
 * Insert a new header
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertHeader = function () {
  this.header = new Header(this._editor, this._editor.getBody())
  this._hasHeader = true
}

/**
 * Insert a new footer
 * @method
 * @returns void
 */
HeaderFooterFactory.prototype.insertFooter = function () {
  this.footer = new Footer(this._editor, this._editor.getBody())
  this._hasFooter = true
}

/**
 * Check if the document has a header or not
 * @method
 * @returns {Boolean} true if the document has a header, false if not
 */
HeaderFooterFactory.prototype.hasHeader = function () {
  return this._hasHeader
}

/**
 * Check if the document has a footer or not
 * @method
 * @returns {Boolean} true if the document has a footer, false if not
 */
HeaderFooterFactory.prototype.hasFooter = function () {
  return this._hasFooter
}
